/**
 * Staff-only: compute Sage Standard scores, apply WPE adjustment, publish certification snapshot.
 * Body: { "assessment_id": "<uuid>" }
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  computeBadgeScoring,
  computeNextReviewDue,
  isPubliclyVerifiedLevel,
  type PillarScoreInput,
  type WpeStats,
} from "../_shared/badge-scoring.ts";

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

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: staffRow } = await admin
    .from("badge_staff_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!staffRow) {
    return new Response(JSON.stringify({ ok: false, error: "staff_only" }), {
      status: 403,
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

  const assessmentId =
    typeof body.assessment_id === "string" ? body.assessment_id.trim() : "";
  if (!assessmentId) {
    return new Response(JSON.stringify({ ok: false, error: "missing_assessment_id" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: assessment, error: assErr } = await admin
    .from("badge_assessments")
    .select("id, company_id, status, charter_version")
    .eq("id", assessmentId)
    .maybeSingle();

  if (assErr || !assessment) {
    return new Response(JSON.stringify({ ok: false, error: "assessment_not_found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (assessment.status === "published" || assessment.status === "superseded") {
    return new Response(JSON.stringify({ ok: false, error: "assessment_not_publishable" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: company, error: coErr } = await admin
    .from("badge_companies")
    .select("id, slug, primary_service_type_id, status")
    .eq("id", assessment.company_id)
    .maybeSingle();

  if (coErr || !company) {
    return new Response(JSON.stringify({ ok: false, error: "company_not_found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: serviceType } = await admin
    .from("badge_service_types")
    .select("weight_overrides")
    .eq("id", company.primary_service_type_id)
    .maybeSingle();

  const weightOverrides =
    (serviceType?.weight_overrides as Record<string, number> | null) ?? {};

  const { data: pillarRows, error: pillarErr } = await admin
    .from("badge_pillar_scores")
    .select("pillar_key, score, is_na")
    .eq("assessment_id", assessmentId);

  if (pillarErr || !pillarRows?.length) {
    return new Response(JSON.stringify({ ok: false, error: "pillar_scores_missing" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const pillars: PillarScoreInput[] = pillarRows.map((row) => ({
    pillar_key: row.pillar_key as PillarScoreInput["pillar_key"],
    score: row.is_na ? null : row.score,
    is_na: row.is_na,
  }));

  const { data: wpeRow } = await admin
    .from("badge_wpe_aggregates_public")
    .select(
      "approved_count, unique_submitter_count, overall_avg, supports_living_in_place_pct, caregiver_easy_pct",
    )
    .eq("company_id", company.id)
    .maybeSingle();

  const wpe: WpeStats | null = wpeRow
    ? {
        approved_count: Number(wpeRow.approved_count ?? 0),
        unique_submitter_count: Number(wpeRow.unique_submitter_count ?? 0),
        overall_avg: wpeRow.overall_avg != null ? Number(wpeRow.overall_avg) : null,
        supports_living_in_place_pct:
          wpeRow.supports_living_in_place_pct != null
            ? Number(wpeRow.supports_living_in_place_pct)
            : null,
        caregiver_easy_pct:
          wpeRow.caregiver_easy_pct != null ? Number(wpeRow.caregiver_easy_pct) : null,
      }
    : null;

  const scoring = computeBadgeScoring({ pillars, weightOverrides, wpe });
  const now = new Date();
  const nextReviewDue = computeNextReviewDue(scoring.effective_level, now);
  const publishedAt = now.toISOString();

  await admin
    .from("badge_assessments")
    .update({ status: "superseded" })
    .eq("company_id", company.id)
    .eq("status", "published");

  const { error: updateAssErr } = await admin
    .from("badge_assessments")
    .update({
      status: "published",
      composite_score: scoring.composite_score,
      base_level: scoring.base_level,
      wpe_adjusted_level: scoring.wpe_adjusted_level,
      effective_level: scoring.effective_level,
      floor_violations: scoring.floor_violations,
      next_review_due: nextReviewDue.toISOString(),
      published_at: publishedAt,
    })
    .eq("id", assessmentId);

  if (updateAssErr) {
    return new Response(
      JSON.stringify({ ok: false, error: "publish_failed", detail: updateAssErr.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { error: snapErr } = await admin.from("badge_certification_snapshots").insert({
    company_id: company.id,
    assessment_id: assessmentId,
    effective_level: scoring.effective_level,
    composite_score: scoring.composite_score,
    pillar_scores: scoring.pillar_scores,
    charter_version: assessment.charter_version ?? "1.0",
    published_at: publishedAt,
  });

  if (snapErr) {
    return new Response(
      JSON.stringify({ ok: false, error: "snapshot_failed", detail: snapErr.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const companyStatus = isPubliclyVerifiedLevel(scoring.effective_level)
    ? "published"
    : "draft";

  await admin
    .from("badge_companies")
    .update({ status: companyStatus, updated_at: publishedAt })
    .eq("id", company.id);

  return new Response(
    JSON.stringify({
      ok: true,
      effective_level: scoring.effective_level,
      composite_score: scoring.composite_score,
      is_publicly_verified: scoring.is_publicly_verified,
      company_status: companyStatus,
      slug: company.slug,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
