import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Building2 } from "lucide-react";
import { SageBadgeNav } from "../../components/badge/SageBadgeNav";
import { BadgeLevelBadge } from "../../components/badge/BadgeLevelBadge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { supabase } from "../../../utils/supabase";
import { formatCertDate, BADGE_EMPTY, type BadgeCompanyPublic } from "../../../lib/badge";

export function SageBadgeCompanies() {
  const [companies, setCompanies] = useState<BadgeCompanyPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const { data, error: qErr } = await supabase
        .from("badge_companies_public")
        .select("*")
        .order("display_name");

      if (qErr) {
        setError(
          "We could not load the company directory right now. Please try again in a few minutes or contact us for help.",
        );
        setLoading(false);
        return;
      }
      setCompanies((data ?? []) as BadgeCompanyPublic[]);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <SageBadgeNav />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl font-semibold text-gray-900">Sage Verified companies</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Organizations that meet The Sage Standard at Ready level or above. Scores reflect the
          latest published assessment.
        </p>

        {loading && (
          <p className="mt-10 text-gray-500 text-sm">Loading directory…</p>
        )}

        {error && (
          <p className="mt-10 text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-4">
            {error}
          </p>
        )}

        {!loading && !error && companies.length === 0 && (
          <Card className="mt-10 border-dashed border-gray-300">
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" aria-hidden />
              <p className="text-gray-600">
                No published companies yet. Assessments in progress will appear here once
                published by Sage staff.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                <Link to="/sage-badge/suggest-company" className="font-medium text-sage-700 hover:underline">
                  Suggest a company
                </Link>
                {" · "}
                <Link to="/sage-badge/for-companies" className="font-medium text-sage-700 hover:underline">
                  Organizations: request an assessment
                </Link>
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {companies.map((c) => (
            <Link key={c.id} to={`/sage-badge/companies/${c.slug}`}>
              <Card className="h-full border-gray-200 hover:border-sage-300 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl text-gray-900">{c.display_name}</CardTitle>
                    <BadgeLevelBadge level={c.effective_level} size="sm" />
                  </div>
                  <p className="text-sm text-gray-500">{c.service_type_label}</p>
                </CardHeader>
                <CardContent>
                  {c.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
                  )}
                  <p className="mt-4 text-xs text-gray-500">
                    Composite {c.composite_score ?? BADGE_EMPTY} · Certified {formatCertDate(c.certified_at)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
