import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ExternalLink } from "lucide-react";
import { SageBadgeNav } from "../../components/badge/SageBadgeNav";
import { BadgeLevelBadge } from "../../components/badge/BadgeLevelBadge";
import { PillarScorecard } from "../../components/badge/PillarScorecard";
import { Button } from "../../components/ui/button";
import { supabase } from "../../../utils/supabase";
import {
  formatCertDate,
  BADGE_EMPTY,
  type BadgeCompanyPublic,
  type BadgeWpeAggregate,
} from "../../../lib/badge";
import { wpeMeetsPublicationThreshold } from "../../../lib/badgeScoring";

export function SageBadgeCompanyProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<BadgeCompanyPublic | null>(null);
  const [wpe, setWpe] = useState<BadgeWpeAggregate | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      const { data, error } = await supabase
        .from("badge_companies_public")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setCompany(data as BadgeCompanyPublic);

      const { data: wpeData } = await supabase
        .from("badge_wpe_aggregates_public")
        .select("*")
        .eq("company_id", data.id)
        .maybeSingle();

      setWpe((wpeData as BadgeWpeAggregate | null) ?? null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <>
        <SageBadgeNav />
        <p className="py-20 text-center text-gray-500">Loading…</p>
      </>
    );
  }

  if (notFound || !company) {
    return (
      <>
        <SageBadgeNav />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Company not found</h1>
          <p className="mt-2 text-gray-600">This profile is not published or does not exist.</p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/sage-badge/companies">Back to directory</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SageBadgeNav />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{company.display_name}</h1>
            <p className="mt-1 text-gray-500">{company.service_type_label}</p>
          </div>
          <BadgeLevelBadge level={company.effective_level} />
        </div>

        {company.description && (
          <p className="mt-6 text-gray-700 leading-relaxed">{company.description}</p>
        )}

        {company.website_url && (
          <a
            href={company.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-sage-700 hover:underline"
          >
            Visit website <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3 text-sm">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-gray-500">Composite score</p>
            <p className="text-2xl font-semibold text-sage-800 mt-1">
              {company.composite_score ?? BADGE_EMPTY}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-gray-500">Certified</p>
            <p className="font-medium text-gray-900 mt-1">{formatCertDate(company.certified_at)}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-gray-500">Next review</p>
            <p className="font-medium text-gray-900 mt-1">
              {formatCertDate(company.next_review_due)}
            </p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pillar scorecard</h2>
          <PillarScorecard scores={company.pillar_scores} />
          {company.charter_version && (
            <p className="mt-3 text-xs text-gray-500">
              Assessed under Sage Standard v{company.charter_version}.
            </p>
          )}
        </section>

        {wpe && wpeMeetsPublicationThreshold({
          approved_count: wpe.approved_count,
          unique_submitter_count: wpe.unique_submitter_count ?? 0,
        }) ? (
          <section className="mt-12 rounded-xl border border-sage-200 bg-sage-50/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What people are experiencing
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Based on {wpe.approved_count} moderated community submissions from{" "}
              {wpe.unique_submitter_count ?? "—"} unique contributors (last 24 months).
            </p>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <span className="text-gray-500">Overall rating</span>
                <p className="font-semibold text-gray-900">{wpe.overall_avg ?? BADGE_EMPTY} / 5</p>
              </div>
              <div>
                <span className="text-gray-500">Supports living in place</span>
                <p className="font-semibold text-gray-900">
                  {wpe.supports_living_in_place_pct ?? BADGE_EMPTY}%
                </p>
              </div>
              <div>
                <span className="text-gray-500">Caregiver access easy</span>
                <p className="font-semibold text-gray-900">{wpe.caregiver_easy_pct ?? BADGE_EMPTY}%</p>
              </div>
              <div>
                <span className="text-gray-500">Technology ease</span>
                <p className="font-semibold text-gray-900">{wpe.technology_avg ?? BADGE_EMPTY} / 5</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Community experiences</h2>
            <p className="mt-2 text-sm text-gray-600">
              Collecting feedback. WPE aggregates appear when at least 15 approved submissions from
              10 unique contributors exist within 24 months.
            </p>
          </section>
        )}

        <p className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 leading-relaxed">
          <strong>Disclaimer:</strong> This profile is informational and is not medical advice,
          clinical guidance, or proof of regulatory licensure. Sage Badge reflects SageÉlan
          Foundation assessment and moderated community feedback at the time shown. Verify details
          directly with the organization.{" "}
          <Link to="/sage-badge/scoring-standard" className="text-sage-700 font-medium hover:underline">
            Scoring methodology
          </Link>
          .
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/sage-badge/companies">All companies</Link>
          </Button>
          <Button asChild className="bg-sage-600 hover:bg-sage-700">
            <Link to={`/sage-badge/experience?company=${company.slug}`}>
              Share your experience
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
