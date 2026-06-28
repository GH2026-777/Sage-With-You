import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { supabase } from "../../../utils/supabase";
import { userFacingMessage } from "../../../utils/authErrorMessage";
import { LEVEL_DISPLAY, PILLAR_LABELS, type BadgeServiceType } from "../../../lib/badge";
import {
  CHARTER_VERSION,
  PILLAR_KEYS,
  computeBadgeScoring,
  slugifyCompanyName,
  type PillarKey,
} from "../../../lib/badgeScoring";
import { normalizeOptionalWebsiteUrl } from "../../../lib/badge";

type CompanyOption = {
  id: string;
  slug: string;
  display_name: string;
  status: string;
};

type PillarFormState = Record<
  PillarKey,
  { score: string; is_na: boolean; na_justification: string }
>;

function defaultPillarForm(): PillarFormState {
  return Object.fromEntries(
    PILLAR_KEYS.map((key) => [key, { score: "4", is_na: false, na_justification: "" }]),
  ) as PillarFormState;
}

function parsePillars(form: PillarFormState) {
  return PILLAR_KEYS.map((pillar_key) => {
    const row = form[pillar_key];
    if (row.is_na) {
      return { pillar_key, score: null, is_na: true };
    }
    const score = Number.parseInt(row.score, 10);
    return {
      pillar_key,
      score: Number.isFinite(score) && score >= 1 && score <= 5 ? score : null,
      is_na: false,
    };
  });
}

export type BadgeAssessorPanelProps = {
  companies: CompanyOption[];
  onCompaniesChange: () => void;
  onMessage: (msg: string | null) => void;
  onError: (err: string | null) => void;
};

export function BadgeAssessorPanel({
  companies,
  onCompaniesChange,
  onMessage,
  onError,
}: BadgeAssessorPanelProps) {
  const [serviceTypes, setServiceTypes] = useState<BadgeServiceType[]>([]);
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [draftAssessmentId, setDraftAssessmentId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [legalName, setLegalName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("general");
  const [description, setDescription] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [pillars, setPillars] = useState<PillarFormState>(defaultPillarForm);
  const [weightOverrides, setWeightOverrides] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    void supabase
      .from("badge_service_types")
      .select("id, label, sort_order")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setServiceTypes((data as BadgeServiceType[]) ?? []));
  }, []);

  const loadCompanyDraft = useCallback(async (companyId: string) => {
    const { data: company } = await supabase
      .from("badge_companies")
      .select(
        "id, slug, legal_name, display_name, website_url, primary_service_type_id, description",
      )
      .eq("id", companyId)
      .maybeSingle();

    if (!company) return;

    setSlug(company.slug);
    setLegalName(company.legal_name);
    setDisplayName(company.display_name);
    setWebsiteUrl(company.website_url ?? "");
    setServiceTypeId(company.primary_service_type_id);
    setDescription(company.description ?? "");

    const { data: st } = await supabase
      .from("badge_service_types")
      .select("weight_overrides")
      .eq("id", company.primary_service_type_id)
      .maybeSingle();

    setWeightOverrides((st?.weight_overrides as Record<string, number>) ?? {});

    const { data: draft } = await supabase
      .from("badge_assessments")
      .select("id, evidence_notes")
      .eq("company_id", companyId)
      .in("status", ["draft", "submitted"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!draft?.id) {
      setDraftAssessmentId(null);
      setEvidenceNotes("");
      setPillars(defaultPillarForm());
      return;
    }

    setDraftAssessmentId(draft.id);
    setEvidenceNotes(draft.evidence_notes ?? "");

    const { data: pillarRows } = await supabase
      .from("badge_pillar_scores")
      .select("pillar_key, score, is_na, na_justification")
      .eq("assessment_id", draft.id);

    const next = defaultPillarForm();
    for (const row of pillarRows ?? []) {
      const key = row.pillar_key as PillarKey;
      if (!PILLAR_KEYS.includes(key)) continue;
      next[key] = {
        score: row.is_na ? "" : String(row.score ?? ""),
        is_na: row.is_na,
        na_justification: row.na_justification ?? "",
      };
    }
    setPillars(next);
  }, []);

  useEffect(() => {
    if (mode === "existing" && selectedCompanyId) {
      void loadCompanyDraft(selectedCompanyId);
    }
  }, [mode, selectedCompanyId, loadCompanyDraft]);

  useEffect(() => {
    if (mode !== "new" || !displayName.trim()) return;
    if (!slug.trim()) {
      setSlug(slugifyCompanyName(displayName));
    }
  }, [mode, displayName, slug]);

  const preview = useMemo(
    () => computeBadgeScoring({ pillars: parsePillars(pillars), weightOverrides }),
    [pillars, weightOverrides],
  );

  const loadServiceTypeWeights = async (typeId: string) => {
    setServiceTypeId(typeId);
    const { data } = await supabase
      .from("badge_service_types")
      .select("weight_overrides")
      .eq("id", typeId)
      .maybeSingle();
    setWeightOverrides((data?.weight_overrides as Record<string, number>) ?? {});
  };

  const saveDraft = async () => {
    onMessage(null);
    onError(null);
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      onError("Sign in required.");
      setSaving(false);
      return;
    }

    const trimmedSlug = slug.trim();
    const trimmedLegal = legalName.trim();
    const trimmedDisplay = displayName.trim();
    if (!trimmedSlug || !trimmedLegal || !trimmedDisplay) {
      onError("Slug, legal name, and display name are required.");
      setSaving(false);
      return;
    }

    let companyId = mode === "existing" ? selectedCompanyId : "";

    if (mode === "new") {
      const { data: created, error: createErr } = await supabase
        .from("badge_companies")
        .insert({
          slug: trimmedSlug,
          legal_name: trimmedLegal,
          display_name: trimmedDisplay,
          website_url: normalizeOptionalWebsiteUrl(websiteUrl),
          primary_service_type_id: serviceTypeId,
          description: description.trim() || null,
          status: "draft",
        })
        .select("id")
        .single();

      if (createErr || !created?.id) {
        onError(userFacingMessage(createErr?.message, "Could not create company."));
        setSaving(false);
        return;
      }
      companyId = created.id;
      setMode("existing");
      setSelectedCompanyId(companyId);
    } else {
      const { error: updateErr } = await supabase
        .from("badge_companies")
        .update({
          slug: trimmedSlug,
          legal_name: trimmedLegal,
          display_name: trimmedDisplay,
          website_url: normalizeOptionalWebsiteUrl(websiteUrl),
          primary_service_type_id: serviceTypeId,
          description: description.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", companyId);

      if (updateErr) {
        onError(userFacingMessage(updateErr.message, "Could not update company."));
        setSaving(false);
        return;
      }
    }

    let assessmentId = draftAssessmentId;
    if (!assessmentId) {
      const { data: assessment, error: assErr } = await supabase
        .from("badge_assessments")
        .insert({
          company_id: companyId,
          assessor_user_id: user.id,
          charter_version: CHARTER_VERSION,
          assessment_type: "initial",
          status: "draft",
          evidence_notes: evidenceNotes.trim() || null,
        })
        .select("id")
        .single();

      if (assErr || !assessment?.id) {
        onError(userFacingMessage(assErr?.message, "Could not create assessment draft."));
        setSaving(false);
        return;
      }
      assessmentId = assessment.id;
      setDraftAssessmentId(assessmentId);
    } else {
      const { error: noteErr } = await supabase
        .from("badge_assessments")
        .update({ evidence_notes: evidenceNotes.trim() || null })
        .eq("id", assessmentId);
      if (noteErr) {
        onError(userFacingMessage(noteErr.message, "Could not update assessment."));
        setSaving(false);
        return;
      }
    }

    const parsed = parsePillars(pillars);
    for (const row of parsed) {
      if (!row.is_na && (row.score === null || row.score < 1 || row.score > 5)) {
        onError(`Each pillar needs a score from 1-5 or N/A (${PILLAR_LABELS[row.pillar_key]}).`);
        setSaving(false);
        return;
      }
    }

    await supabase.from("badge_pillar_scores").delete().eq("assessment_id", assessmentId);

    const pillarInserts = PILLAR_KEYS.map((pillar_key) => {
      const row = pillars[pillar_key];
      const parsedRow = parsed.find((p) => p.pillar_key === pillar_key)!;
      return {
        assessment_id: assessmentId,
        pillar_key,
        score: parsedRow.is_na ? null : parsedRow.score,
        is_na: parsedRow.is_na,
        na_justification: parsedRow.is_na ? row.na_justification.trim() || null : null,
      };
    });

    const { error: pillarErr } = await supabase.from("badge_pillar_scores").insert(pillarInserts);
    setSaving(false);

    if (pillarErr) {
      onError(userFacingMessage(pillarErr.message, "Could not save pillar scores."));
      return;
    }

    onMessage("Draft saved. Review preview, then publish when ready.");
    onCompaniesChange();
  };

  const publishAssessment = async () => {
    onMessage(null);
    onError(null);

    if (!draftAssessmentId) {
      onError("Save a draft first.");
      return;
    }

    setPublishing(true);
    const { data, error: fnErr } = await supabase.functions.invoke("publish-badge-assessment", {
      body: { assessment_id: draftAssessmentId },
    });
    setPublishing(false);

    if (fnErr) {
      onError(userFacingMessage(fnErr.message, "Publish failed."));
      return;
    }

    const result = data as {
      ok?: boolean;
      error?: string;
      effective_level?: string;
      is_publicly_verified?: boolean;
      slug?: string;
    };

    if (!result?.ok) {
      onError(result?.error ?? "Publish failed.");
      return;
    }

    const levelLabel = result.effective_level
      ? (LEVEL_DISPLAY[result.effective_level as keyof typeof LEVEL_DISPLAY]?.label ??
        result.effective_level)
      : "Unknown";

    if (result.is_publicly_verified && result.slug) {
      onMessage(`Published as ${levelLabel}. Public profile: /sage-badge/companies/${result.slug}`);
    } else {
      onMessage(
        `Assessment published internally as ${levelLabel}. Not yet Sage Verified - company stays draft until Ready or above.`,
      );
    }
    onCompaniesChange();
  };

  return (
    <section className="mt-10 rounded-xl border border-sage-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Assess and publish</h2>
      <p className="mt-2 text-sm text-gray-600">
        Score the seven pillars, save a draft, then publish. Scoring follows Sage Standard Charter
        v1.0.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          size="sm"
          variant={mode === "existing" ? "default" : "outline"}
          className={mode === "existing" ? "bg-sage-600 hover:bg-sage-700" : ""}
          onClick={() => setMode("existing")}
        >
          Existing company
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "new" ? "default" : "outline"}
          className={mode === "new" ? "bg-sage-600 hover:bg-sage-700" : ""}
          onClick={() => {
            setMode("new");
            setSelectedCompanyId("");
            setDraftAssessmentId(null);
            setSlug("");
            setLegalName("");
            setDisplayName("");
            setWebsiteUrl("");
            setDescription("");
            setEvidenceNotes("");
            setPillars(defaultPillarForm());
          }}
        >
          New company
        </Button>
      </div>

      {mode === "existing" && (
        <div className="mt-4">
          <Label htmlFor="assessor-company">Company</Label>
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger id="assessor-company" className="mt-1 max-w-md">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.display_name} ({c.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(mode === "new" || selectedCompanyId) && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="assessor-display">Display name</Label>
            <Input
              id="assessor-display"
              className="mt-1"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="assessor-legal">Legal name</Label>
            <Input
              id="assessor-legal"
              className="mt-1"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="assessor-slug">URL slug</Label>
            <Input
              id="assessor-slug"
              className="mt-1"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="assessor-website">Website</Label>
            <Input
              id="assessor-website"
              className="mt-1"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="www.example.com"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="assessor-service">Primary service type</Label>
            <Select value={serviceTypeId} onValueChange={(v) => void loadServiceTypeWeights(v)}>
              <SelectTrigger id="assessor-service" className="mt-1 max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((st) => (
                  <SelectItem key={st.id} value={st.id}>
                    {st.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="assessor-description">Public description</Label>
            <Textarea
              id="assessor-description"
              className="mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      )}

      {(mode === "new" || selectedCompanyId) && (
        <>
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pillar scores (1-5 or N/A)</h3>
            <div className="space-y-4">
              {PILLAR_KEYS.map((key) => (
                <Card key={key} className="border-gray-200">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">{PILLAR_LABELS[key]}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-wrap gap-4 items-end">
                    <div>
                      <Label htmlFor={`pillar-${key}-score`} className="text-xs">
                        Score
                      </Label>
                      <Select
                        value={pillars[key].is_na ? "na" : pillars[key].score}
                        onValueChange={(v) => {
                          setPillars((prev) => ({
                            ...prev,
                            [key]:
                              v === "na"
                                ? { ...prev[key], is_na: true, score: "" }
                                : { ...prev[key], is_na: false, score: v },
                          }));
                        }}
                      >
                        <SelectTrigger id={`pillar-${key}-score`} className="mt-1 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="na">N/A</SelectItem>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {pillars[key].is_na && (
                      <div className="flex-1 min-w-[200px]">
                        <Label htmlFor={`pillar-${key}-na`} className="text-xs">
                          N/A justification
                        </Label>
                        <Input
                          id={`pillar-${key}-na`}
                          className="mt-1"
                          value={pillars[key].na_justification}
                          onChange={(e) =>
                            setPillars((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], na_justification: e.target.value },
                            }))
                          }
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="assessor-evidence">Assessor evidence notes (internal)</Label>
            <Textarea
              id="assessor-evidence"
              className="mt-1"
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Card className="mt-6 border-sage-200 bg-sage-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Preview (before WPE adjustment at publish)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-1">
              <p>
                Composite: <strong>{preview.composite_score}</strong> · Base level:{" "}
                <strong>{LEVEL_DISPLAY[preview.base_level].label}</strong>
              </p>
              {preview.floor_violations.length > 0 && (
                <p className="text-amber-800">
                  Floor violations: {preview.floor_violations.join("; ")}
                </p>
              )}
              <p className="text-gray-500 text-xs">
                WPE may adjust level at publish when n≥15 approved submissions and charter rules
                apply.
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={saving || publishing}
              onClick={() => void saveDraft()}
            >
              {saving ? "Saving…" : "Save draft"}
            </Button>
            <Button
              type="button"
              className="bg-sage-600 hover:bg-sage-700"
              disabled={saving || publishing || !draftAssessmentId}
              onClick={() => void publishAssessment()}
            >
              {publishing ? "Publishing…" : "Publish assessment"}
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link to="/sage-badge/scoring-standard">Scoring charter summary</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
