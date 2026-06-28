/**
 * WPE (What People Are Experiencing) submission — authenticated users only.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  checkAndRecordRateLimit,
  sha256Hex,
} from "../_shared/client-rate-limit.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401,
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

  const companyId = typeof body.company_id === "string" ? body.company_id.trim() : "";
  const overallRating = Number(body.overall_rating);
  const supports = body.supports_living_in_place;
  const caregiverAccess = body.caregiver_access;
  const technologyRating = Number(body.technology_rating);
  const submitterRole = body.submitter_role;
  const narrative =
    typeof body.narrative === "string" ? body.narrative.trim().slice(0, 2000) : null;
  const barrierIds = Array.isArray(body.barrier_type_ids)
    ? body.barrier_type_ids.filter((x) => typeof x === "string").slice(0, 10)
    : [];

  const supportsOk = supports === "yes" || supports === "no" || supports === "somewhat";
  const caregiverOk =
    caregiverAccess === "easy" ||
    caregiverAccess === "difficult" ||
    caregiverAccess === "not_possible";
  const roleOk =
    submitterRole === "user" ||
    submitterRole === "caregiver" ||
    submitterRole === "professional";

  if (
    !companyId ||
    !supportsOk ||
    !caregiverOk ||
    !roleOk ||
    overallRating < 1 ||
    overallRating > 5 ||
    technologyRating < 1 ||
    technologyRating > 5
  ) {
    return new Response(JSON.stringify({ ok: false, error: "invalid_fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const rateSalt = Deno.env.get("BADGE_RATE_SALT")?.trim() ?? "dev_badge_rate_salt_change_me";
  const rateLimit = Math.max(
    1,
    Number.parseInt(Deno.env.get("BADGE_WPE_RATE_LIMIT_PER_DAY") ?? "5", 10) || 5,
  );
  const clientKey = await sha256Hex(`${user.id}|wpe|${rateSalt}`);
  const { allowed } = await checkAndRecordRateLimit(admin, {
    table: "badge_submit_client_events",
    clientKey,
    channel: "wpe",
    limit: rateLimit,
    windowHours: 24,
  });
  if (!allowed) {
    return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: company } = await admin
    .from("badge_companies")
    .select("id, status")
    .eq("id", companyId)
    .eq("status", "published")
    .maybeSingle();

  if (!company) {
    return new Response(JSON.stringify({ ok: false, error: "company_not_found" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: row, error: insErr } = await admin
    .from("badge_wpe_submissions")
    .insert({
      company_id: companyId,
      submitter_user_id: user.id,
      overall_rating: overallRating,
      supports_living_in_place: supports,
      caregiver_access: caregiverAccess,
      technology_rating: technologyRating,
      submitter_role: submitterRole,
      narrative,
      moderation_status: "pending",
    })
    .select("id")
    .single();

  if (insErr || !row?.id) {
    return new Response(
      JSON.stringify({ ok: false, error: "save_failed", detail: insErr?.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (barrierIds.length > 0) {
    const tags = barrierIds.map((barrier_type_id: string) => ({
      submission_id: row.id,
      barrier_type_id,
    }));
    const { error: tagErr } = await admin.from("badge_wpe_barrier_tags").insert(tags);
    if (tagErr) {
      console.error("[submit-badge-wpe] barrier tags:", tagErr.message);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
