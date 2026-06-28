/**
 * Company program inquiries for Sage Badge (assessment, Panthers consulting, beta).
 * Secrets: CONTACT_SMTP_* (same as submit-contact), optional BADGE_INQUIRY_NOTIFY_TO
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { sendOffice365Mail } from "../_shared/office365-smtp.ts";
import {
  checkAndRecordRateLimit,
  clientIpFromRequest,
  sha256Hex,
} from "../_shared/client-rate-limit.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const INQUIRY_TYPES = new Set([
  "sage_verified_assessment",
  "sage_panthers_consulting",
  "beta_testing",
  "improvement_pathway",
  "general",
  "community_nomination",
]);

function trimStr(v: unknown, max: number): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > max ? s.slice(0, max) : s;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const inquiryType = trimStr(body.inquiry_type, 64);
  const companyName = trimStr(body.company_name, 200);
  const contactName = trimStr(body.contact_name, 200);
  const contactEmail = trimStr(body.contact_email, 320).toLowerCase();
  const contactPhone = trimStr(body.contact_phone, 60) || null;
  const websiteUrl = trimStr(body.website_url, 500) || null;
  const serviceTypeInterest = trimStr(body.service_type_interest, 64) || null;
  const message = trimStr(body.message, 8000);
  const sagePanthersInterest = body.sage_panthers_interest === true;
  const panthersEngagementTypes = Array.isArray(body.panthers_engagement_types)
    ? body.panthers_engagement_types.filter((x) => typeof x === "string").slice(0, 10)
    : [];

  if (!INQUIRY_TYPES.has(inquiryType) || !companyName || !contactName || !contactEmail || !message) {
    return new Response(JSON.stringify({ ok: false, error: "missing_fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return new Response(JSON.stringify({ ok: false, error: "invalid_email" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const rateSalt = Deno.env.get("BADGE_RATE_SALT")?.trim() ?? "dev_badge_rate_salt_change_me";
  const rateLimit = Math.max(
    1,
    Number.parseInt(Deno.env.get("BADGE_INQUIRY_RATE_LIMIT_PER_HOUR") ?? "10", 10) || 10,
  );
  const clientKey = await sha256Hex(`${clientIpFromRequest(req)}|inquiry|${rateSalt}`);
  const { allowed } = await checkAndRecordRateLimit(admin, {
    table: "badge_submit_client_events",
    clientKey,
    channel: "inquiry",
    limit: rateLimit,
    windowHours: 1,
  });
  if (!allowed) {
    return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { error: insErr } = await admin.from("badge_company_inquiries").insert({
    inquiry_type: inquiryType,
    company_name: companyName,
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    website_url: websiteUrl,
    service_type_interest: serviceTypeInterest,
    message,
    sage_panthers_interest: sagePanthersInterest,
    panthers_engagement_types: panthersEngagementTypes,
  });

  if (insErr) {
    return new Response(
      JSON.stringify({ ok: false, error: "save_failed", detail: insErr.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const notifyTo =
    Deno.env.get("BADGE_INQUIRY_NOTIFY_TO")?.trim() || "SageWithYou@sageelan.org";
  const subject = `[Sage Badge inquiry] ${inquiryType.replace(/_/g, " ")}: ${companyName}`;
  const plain = [
    `Type: ${inquiryType}`,
    `Organization: ${companyName}`,
    `Contact: ${contactName} <${contactEmail}>`,
    contactPhone ? `Phone: ${contactPhone}` : "",
    websiteUrl ? `Website: ${websiteUrl}` : "",
    serviceTypeInterest ? `Service type: ${serviceTypeInterest}` : "",
    `Sage Panthers interest: ${sagePanthersInterest}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  let emailSent = false;
  try {
    await sendOffice365Mail({
      to: notifyTo,
      subject,
      html: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${plain.replace(/</g, "&lt;")}</pre>`,
      plain,
    });
    emailSent = true;
  } catch (e) {
    console.error("[submit-badge-inquiry] notify failed:", e);
  }

  try {
    await sendOffice365Mail({
      to: contactEmail,
      subject: "We received your Sage Badge inquiry",
      html: `<p>Hi ${contactName},</p><p>Thank you for contacting Sage With You about the Sage Badge program. We received your inquiry and will respond within a few business days.</p>`,
      plain: `Hi ${contactName},\n\nThank you for your Sage Badge inquiry. We will respond within a few business days.`,
    });
  } catch (e) {
    console.error("[submit-badge-inquiry] confirmation failed:", e);
  }

  return new Response(JSON.stringify({ ok: true, emailSent }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
