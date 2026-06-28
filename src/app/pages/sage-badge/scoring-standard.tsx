import { Link } from "react-router";
import { SageBadgeNav } from "../../components/badge/SageBadgeNav";
import { Button } from "../../components/ui/button";

export function SageBadgeScoringStandard() {
  return (
    <>
      <SageBadgeNav />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl font-semibold text-gray-900">The Sage Standard (Charter v1.0)</h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          This summary explains how Sage Badge scores organizations. Full methodology is maintained
          by SageÉlan Foundation assessors. WPE (community experience) is described separately on
          company profiles when enough moderated submissions exist.
        </p>

        <section className="mt-10 space-y-6 text-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Seven pillars (1-5 each, or N/A)</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
              <li>Accessibility</li>
              <li>Safety & Environment</li>
              <li>Communication & Transparency</li>
              <li>Dignity & Autonomy</li>
              <li>Continuity of Support</li>
              <li>Caregiver Access & Supportability</li>
              <li>Technology & Ease of Use</li>
            </ul>
            <p className="mt-3 text-sm">
              N/A pillars are excluded from the composite average when a pillar genuinely does not
              apply, with written justification.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Certification levels</h2>
            <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200 text-sm">
              <table className="min-w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">Level</th>
                    <th className="px-4 py-2 font-medium">Composite</th>
                    <th className="px-4 py-2 font-medium">Public Sage Verified</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">Limited</td>
                    <td className="px-4 py-2">1.0 - 2.4</td>
                    <td className="px-4 py-2">No</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Emerging</td>
                    <td className="px-4 py-2">2.5 - 3.2</td>
                    <td className="px-4 py-2">No</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Ready</td>
                    <td className="px-4 py-2">3.3 - 3.9</td>
                    <td className="px-4 py-2">Yes</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Trusted</td>
                    <td className="px-4 py-2">4.0 - 4.4</td>
                    <td className="px-4 py-2">Yes</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Exceptional</td>
                    <td className="px-4 py-2">4.5 - 5.0</td>
                    <td className="px-4 py-2">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Floor rules</h2>
            <p className="mt-3 text-sm leading-relaxed">
              A company cannot receive a public Sage Verified badge if any applicable pillar is 2 or
              below, if Safety & Environment is 3 or below, or if Dignity & Autonomy is 3 or below.
              Assessments older than 24 months without renewal are treated as stale.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">What People Are Experiencing (WPE)</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Moderated community feedback does not replace The Sage Standard. Numeric WPE aggregates
              appear on profiles only when there are at least <strong>15 approved</strong> submissions
              from at least <strong>10 unique submitters</strong> within the last 24 months. WPE may
              adjust the displayed level when charter promotion rules are met.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <strong>Disclaimer:</strong> Sage Badge profiles are informational and are not medical
            advice, clinical recommendations, or proof of regulatory licensure. Organizations remain
            responsible for their own compliance and services.
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/sage-badge">Back to Sage Badge</Link>
          </Button>
          <Button asChild className="bg-sage-600 hover:bg-sage-700">
            <Link to="/sage-badge/for-companies">Request assessment</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
