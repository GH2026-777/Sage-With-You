import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { SageBadgeNav } from "../../components/badge/SageBadgeNav";
import { RequireSignIn } from "../../components/RequireSignIn";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { supabase } from "../../../utils/supabase";
import { userFacingMessage } from "../../../utils/authErrorMessage";
import type { BadgeBarrierType, BadgeCompanyPublic } from "../../../lib/badge";

function ExperienceForm() {
  const [searchParams] = useSearchParams();
  const preSlug = searchParams.get("company") ?? "";

  const [companies, setCompanies] = useState<BadgeCompanyPublic[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [barriers, setBarriers] = useState<BadgeBarrierType[]>([]);
  const [companySlug, setCompanySlug] = useState(preSlug);
  const [overallRating, setOverallRating] = useState(3);
  const [supports, setSupports] = useState<"yes" | "no" | "somewhat">("somewhat");
  const [caregiverAccess, setCaregiverAccess] = useState<"easy" | "difficult" | "not_possible">(
    "easy",
  );
  const [technologyRating, setTechnologyRating] = useState(3);
  const [submitterRole, setSubmitterRole] = useState<"user" | "caregiver" | "professional">("user");
  const [narrative, setNarrative] = useState("");
  const [selectedBarriers, setSelectedBarriers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const loadCompanies = async () => {
    setCompaniesLoading(true);
    const { data: cos } = await supabase
      .from("badge_companies_public")
      .select("id, slug, display_name")
      .order("display_name");
    setCompanies((cos ?? []) as BadgeCompanyPublic[]);
    setCompaniesLoading(false);
  };

  useEffect(() => {
    void loadCompanies();
    void supabase
      .from("badge_barrier_types")
      .select("id, label, sort_order")
      .order("sort_order")
      .then(({ data }) => setBarriers((data ?? []) as BadgeBarrierType[]));
  }, []);

  useEffect(() => {
    if (preSlug) setCompanySlug(preSlug);
  }, [preSlug]);

  const toggleBarrier = (id: string) => {
    setSelectedBarriers((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!companySlug) {
      setError("Select a company.");
      return;
    }
    const company = companies.find((c) => c.slug === companySlug);
    if (!company) {
      setError("Company not found in directory.");
      return;
    }

    setSubmitting(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const { data, error: fnErr } = await supabase.functions.invoke("submit-badge-wpe", {
      body: {
        company_id: company.id,
        overall_rating: overallRating,
        supports_living_in_place: supports,
        caregiver_access: caregiverAccess,
        technology_rating: technologyRating,
        submitter_role: submitterRole,
        narrative: narrative.trim() || null,
        barrier_type_ids: selectedBarriers,
      },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    setSubmitting(false);
    const payload = data as { ok?: boolean; error?: string; detail?: string } | null;
    if (fnErr || !payload?.ok) {
      if (payload?.error === "rate_limited") {
        setError("You have reached the submission limit for today. Please try again tomorrow.");
        return;
      }
      setError(
        userFacingMessage(
          payload?.detail || payload?.error || fnErr?.message,
          "We could not submit your feedback. Please try again or contact us at info@sageelan.org.",
        ),
      );
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <CheckCircle className="h-14 w-14 text-sage-600 mx-auto mb-4" aria-hidden />
        <h2 className="text-2xl font-semibold text-gray-900">Thank you</h2>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          Your experience was submitted for moderation. Sage Badge staff will review it before any
          summary appears on the company profile. Approved feedback helps others choosing services
          for living in place.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/sage-badge/companies">Browse companies</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setNarrative("");
              setSelectedBarriers([]);
            }}
          >
            Submit another
          </Button>
        </div>
      </div>
    );
  }

  const noCompanies = !companiesLoading && companies.length === 0;

  if (noCompanies) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl font-semibold text-gray-900">Share your experience</h1>
        <p className="mt-2 text-gray-600 leading-relaxed">
          Experience feedback can only be submitted for organizations already listed as Sage
          Verified. The directory is empty right now, so this form is not available yet.
        </p>

        <Card className="mt-8 border-sage-200 bg-sage-50/40">
          <CardHeader>
            <CardTitle className="text-lg">Want to name an organization?</CardTitle>
            <CardDescription>
              Use a separate short form to suggest a company for staff review. That is not the same
              as sharing experience feedback, which opens after a company is published.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="bg-sage-600 hover:bg-sage-700">
              <Link to="/sage-badge/suggest-company">Go to Suggest a company</Link>
            </Button>
            <p className="text-sm text-gray-600">
              You do not need to pick a company from a list on that page. Fill in the organization
              name and why you are suggesting it, then submit.
            </p>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <Info className="h-5 w-5 shrink-0" aria-hidden />
          <p>
            Staff testing: publish a demo company in{" "}
            <Link to="/sage-badge/admin" className="font-medium underline">
              Sage Badge admin
            </Link>{" "}
            to unlock the experience feedback form here.
          </p>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          <Link to="/sage-badge/companies" className="font-medium text-sage-700 hover:underline">
            View company directory
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 md:py-16">
      <h1 className="text-3xl font-semibold text-gray-900">Share your experience</h1>
      <p className="mt-2 text-gray-600 leading-relaxed">
        What People Are Experiencing (WPE) is structured community feedback about Sage Verified
        organizations. Your submission is reviewed by staff before it can appear on a public
        profile. Read the{" "}
        <Link to="/sage-badge/wpe-policy" className="font-medium text-sage-700 hover:underline">
          WPE moderation policy
        </Link>
        .
      </p>

      <Card className="mt-8 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Experience feedback form</CardTitle>
          <CardDescription>
            Choose a listed company, complete the ratings, then select Submit for review. Fields
            marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <select
                id="company"
                value={companySlug}
                onChange={(e) => setCompanySlug(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                required
                disabled={companiesLoading}
              >
                <option value="">
                  {companiesLoading ? "Loading companies…" : "Select a Sage Verified company…"}
                </option>
                {companies.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.display_name}
                  </option>
                ))}
              </select>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                <p className="font-medium text-gray-900">Company not in this list?</p>
                <p className="mt-1">
                  You cannot submit experience feedback until the organization is Sage Verified and
                  appears here. Nominate it first on Suggest a company.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link to="/sage-badge/suggest-company">Suggest a company</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your role *</Label>
              <select
                id="role"
                value={submitterRole}
                onChange={(e) =>
                  setSubmitterRole(e.target.value as "user" | "caregiver" | "professional")
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="user">Person using services</option>
                <option value="caregiver">Caregiver / family helper</option>
                <option value="professional">Professional advisor</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="overall">Overall experience (1-5) *</Label>
              <input
                id="overall"
                type="range"
                min={1}
                max={5}
                value={overallRating}
                onChange={(e) => setOverallRating(Number(e.target.value))}
                className="w-full accent-sage-600"
              />
              <p className="text-sm text-gray-600">{overallRating} out of 5</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supports">Does this organization support living in place? *</Label>
              <select
                id="supports"
                value={supports}
                onChange={(e) => setSupports(e.target.value as typeof supports)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="yes">Yes</option>
                <option value="somewhat">Somewhat</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caregiver">Caregiver access *</Label>
              <select
                id="caregiver"
                value={caregiverAccess}
                onChange={(e) => setCaregiverAccess(e.target.value as typeof caregiverAccess)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="easy">Easy for caregivers to help</option>
                <option value="difficult">Difficult</option>
                <option value="not_possible">Not possible</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tech">Technology ease of use (1-5) *</Label>
              <input
                id="tech"
                type="range"
                min={1}
                max={5}
                value={technologyRating}
                onChange={(e) => setTechnologyRating(Number(e.target.value))}
                className="w-full accent-sage-600"
              />
              <p className="text-sm text-gray-600">{technologyRating} out of 5</p>
            </div>

            {barriers.length > 0 && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-gray-900">Barriers (optional)</legend>
                <p className="text-xs text-gray-500">Select any that applied to your experience.</p>
                <div className="flex flex-wrap gap-2">
                  {barriers.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => toggleBarrier(b.id)}
                      className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                        selectedBarriers.includes(b.id)
                          ? "bg-sage-100 border-sage-400 text-sage-900"
                          : "border-gray-300 text-gray-600 hover:border-sage-300"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="space-y-2">
              <Label htmlFor="narrative">Comments (optional)</Label>
              <Textarea
                id="narrative"
                rows={5}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                maxLength={2000}
                placeholder="What went well? What could improve? Do not include private health details."
              />
              <p className="text-xs text-gray-500">{narrative.length} / 2000 characters</p>
            </div>

            <Button
              type="submit"
              disabled={submitting || companiesLoading}
              className="w-full sm:w-auto bg-sage-600 hover:bg-sage-700"
            >
              {submitting ? "Submitting…" : "Submit for review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function SageBadgeExperience() {
  return (
    <>
      <SageBadgeNav />
      <RequireSignIn
        redirectTo="/sage-badge/experience"
        title="Sign in to share experience"
        description="Create a free account to submit What People Are Experiencing feedback for Sage Verified companies."
      >
        <ExperienceForm />
      </RequireSignIn>
    </>
  );
}
