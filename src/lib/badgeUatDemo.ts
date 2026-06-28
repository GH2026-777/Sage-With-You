import { supabase } from "../utils/supabase";
import { DEMO_COMPANY_SLUG } from "./badge";

const PILLAR_KEYS = [
  "accessibility",
  "safety_environment",
  "communication_transparency",
  "dignity_autonomy",
  "continuity_of_support",
  "caregiver_access_supportability",
  "technology_ease_of_use",
] as const;

/** Idempotent: published demo company + assessment for UAT / experience form testing. */
export async function setupUatDemoCompany(assessorUserId: string): Promise<{ ok: boolean; message: string }> {
  const { data: existing } = await supabase
    .from("badge_companies")
    .select("id")
    .eq("slug", DEMO_COMPANY_SLUG)
    .maybeSingle();

  let companyId = existing?.id as string | undefined;

  if (!companyId) {
    const { data: created, error: coErr } = await supabase
      .from("badge_companies")
      .insert({
        slug: DEMO_COMPANY_SLUG,
        legal_name: "Sage Demo Home Care LLC",
        display_name: "Sage Demo Home Care (UAT)",
        website_url: "https://sageelan.org",
        primary_service_type_id: "home-modification",
        description:
          "Demo organization for staff UAT and training. Use for testing experience submissions; not a real vendor.",
        status: "published",
      })
      .select("id")
      .single();

    if (coErr || !created?.id) {
      return { ok: false, message: coErr?.message ?? "Could not create demo company." };
    }
    companyId = created.id;
  } else {
    const { error: upErr } = await supabase
      .from("badge_companies")
      .update({ status: "published" })
      .eq("id", companyId);
    if (upErr) return { ok: false, message: upErr.message };
  }

  const { data: publishedAssess } = await supabase
    .from("badge_assessments")
    .select("id")
    .eq("company_id", companyId)
    .eq("status", "published")
    .maybeSingle();

  if (!publishedAssess?.id) {
    const { data: assessment, error: assErr } = await supabase
      .from("badge_assessments")
      .insert({
        company_id: companyId,
        assessor_user_id: assessorUserId,
        charter_version: "1.0",
        assessment_type: "initial",
        status: "published",
        composite_score: 4.2,
        base_level: "trusted",
        effective_level: "trusted",
        published_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (assErr || !assessment?.id) {
      return { ok: false, message: assErr?.message ?? "Could not create demo assessment." };
    }

    const pillarRows = PILLAR_KEYS.map((pillar_key) => ({
      assessment_id: assessment.id,
      pillar_key,
      score: 4,
      is_na: false,
    }));
    const { error: pillarErr } = await supabase.from("badge_pillar_scores").insert(pillarRows);
    if (pillarErr) return { ok: false, message: pillarErr.message };

    const pillar_scores = Object.fromEntries(PILLAR_KEYS.map((k) => [k, 4]));
    const { error: snapErr } = await supabase.from("badge_certification_snapshots").insert({
      company_id: companyId,
      assessment_id: assessment.id,
      effective_level: "trusted",
      composite_score: 4.2,
      pillar_scores,
      charter_version: "1.0",
    });
    if (snapErr) return { ok: false, message: snapErr.message };
  }

  return {
    ok: true,
    message: "Demo company is published. Refresh Share your experience to use the form.",
  };
}
