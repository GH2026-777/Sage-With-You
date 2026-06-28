/**
 * One request: validate → insert `contact_submissions` (service role) → O365 SMTP confirmation to visitor.
 * No third-party mail APIs - same pattern as Hapmetry (denomailer + Microsoft 365).
 *
 * Source file on disk (repo): `Sage With You/supabase/functions/submit-contact/index.ts`
 * - The parent folder name has a space, so Cursor @-mentions like `@Sage With You/...` often do not resolve;
 *   attach context with `@submit-contact` / search `submit-contact`, or open this path from the file tree.
 *
 * Secrets (Supabase → Edge Functions → Secrets):
 *   CONTACT_SMTP_HOST   - default smtp.office365.com
 *   CONTACT_SMTP_PORT   - default 587
 *   CONTACT_SMTP_USER   - mailbox sign-in
 *   CONTACT_SMTP_PASS   - app password or credential
 *   CONTACT_SMTP_FROM   - e.g. "Sage With You <noreply@yourdomain.com>"
 * Optional:
 *   CONTACT_SMTP_BCC    - e.g. info@sageelan.org (internal copy)
 *   CONTACT_RATE_SALT   - secret for hashing client IP (set in prod)
 *   CONTACT_RATE_LIMIT_PER_HOUR - default 25 submissions per hashed client per hour
 *
 * Run migration `004_contact_submit_rate_limit.sql` for table `contact_submit_client_events`.
 *
 * Deploy: supabase functions deploy submit-contact --project-ref htckswutkpktxclyijwk
 *
 * Run migration `002_contact_submissions_edge_only.sql` so the browser cannot insert directly (only this function).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { sendOffice365Mail } from "../_shared/office365-smtp.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX = { name: 200, email: 320, phone: 60, subject: 200, message: 12000 };

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function trimStr(v: unknown, max: number): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > max ? s.slice(0, max) : s;
}

function clientIpFromRequest(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")?.trim();
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  return "unknown";
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sendConfirmationSmtp(
  to: string,
  displayName: string,
  subjectLine: string,
  bodyText: string,
): Promise<void> {
  const nameH = escHtml(displayName || "there");
  const subjH = escHtml(subjectLine);
  const bodyH = escHtml(bodyText);
  const html = `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;">
  <p>Hi ${nameH},</p>
  <p>Thank you for contacting <strong>Sage With You</strong> (SageÉlan Foundation). We received your message and will get back to you as soon as we can.</p>
  <p><strong>Your subject:</strong> ${subjH}</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:1.5rem 0;" />
  <p style="color:#555;font-size:0.9rem;"><strong>Your message (for your records):</strong></p>
  <p style="white-space:pre-wrap;background:#f6f7f8;padding:1rem;border-radius:8px;">${bodyH}</p>
  <p style="margin-top:1.5rem;color:#555;font-size:0.85rem;">This is an automated confirmation.</p>
</body></html>`;

  const plain = `Hi ${displayName || "there"},\n\nWe received your message (subject: ${subjectLine}). We'll get back to you soon.\n\n---\n${bodyText}`;

  await sendOffice365Mail({
    to,
    subject: `We received your message: ${subjectLine.slice(0, 80)}${subjectLine.length > 80 ? "…" : ""}`,
    html,
    plain,
  });
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

  const name = trimStr(body.name, MAX.name);
  const email = trimStr(body.email, MAX.email).toLowerCase();
  const phone = trimStr(body.phone, MAX.phone) || null;
  const subject = trimStr(body.subject, MAX.subject);
  const message = trimStr(body.message, MAX.message);

  if (!name || !email || !subject || !message) {
    return new Response(JSON.stringify({ ok: false, error: "missing_fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

  const rateSalt = Deno.env.get("CONTACT_RATE_SALT")?.trim() ?? "dev_contact_rate_salt_change_me";
  const rateLimit = Math.max(
    1,
    Math.min(500, Number(Deno.env.get("CONTACT_RATE_LIMIT_PER_HOUR")?.trim() ?? "25") || 25),
  );
  const ip = clientIpFromRequest(req);
  const clientKey = await sha256Hex(`${ip}|${rateSalt}`);
  const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { error: pruneErr } = await admin
    .from("contact_submit_client_events")
    .delete()
    .lt("created_at", new Date(Date.now() - 72 * 3600 * 1000).toISOString());
  if (pruneErr) {
    console.warn("[submit-contact] rate prune skipped:", pruneErr.message);
  }

  const { count: recentCount, error: rateErr } = await admin
    .from("contact_submit_client_events")
    .select("id", { count: "exact", head: true })
    .eq("client_key", clientKey)
    .gte("created_at", sinceIso);

  if (!rateErr && recentCount != null && recentCount >= rateLimit) {
    return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (rateErr) {
    console.warn("[submit-contact] rate count failed (submission not blocked):", rateErr.message);
  }

  const { error: rateInsErr } = await admin.from("contact_submit_client_events").insert({ client_key: clientKey });
  if (rateInsErr) {
    console.warn("[submit-contact] rate insert failed (submission continues):", rateInsErr.message);
  }

  const { data: row, error: insErr } = await admin
    .from("contact_submissions")
    .insert({ name, email, phone, subject, message })
    .select("id")
    .single();

  if (insErr || !row?.id) {
    return new Response(
      JSON.stringify({ ok: false, error: "save_failed", detail: insErr?.message ?? "insert" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let emailSent = false;
  try {
    await sendConfirmationSmtp(email, name, subject, message);
    emailSent = true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "missing_smtp_config") {
      console.warn("[submit-contact] SMTP secrets not set; row saved, no confirmation email.");
    } else {
      console.error("[submit-contact] SMTP send failed:", msg);
    }
  }

  return new Response(JSON.stringify({ ok: true, id: row.id, emailSent }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

