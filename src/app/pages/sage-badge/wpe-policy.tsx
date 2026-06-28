import { Link } from "react-router";
import { SageBadgeNav } from "../../components/badge/SageBadgeNav";
import { Button } from "../../components/ui/button";

export function SageBadgeWpePolicy() {
  return (
    <>
      <SageBadgeNav />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl font-semibold text-gray-900">
          WPE moderation policy
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          What People Are Experiencing (WPE) is structured community feedback about Sage Verified
          organizations. This page explains how submissions are reviewed before they affect public
          profiles.
        </p>

        <section className="mt-10 space-y-8 text-gray-700 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Who can submit</h2>
            <p className="mt-2">
              You must be signed in with a Sage With You account. Submissions are limited to
              organizations that already appear in the public Sage Verified directory.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">What we collect</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Overall rating and structured answers (supports living in place, caregiver access, technology ease)</li>
              <li>Optional barrier tags from a controlled list</li>
              <li>Optional short narrative (moderated before any public display of quotes)</li>
              <li>Your account identifier for duplicate detection and abuse prevention</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Moderation standards</h2>
            <p className="mt-2">Staff reviewers may approve, reject, or hold submissions that:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Include private health information, full names of individuals, or contact details</li>
              <li>Contain harassment, hate speech, or clearly false claims</li>
              <li>Appear to be spam, duplicate astroturfing, or conflict-of-interest abuse</li>
              <li>Relate to a company the submitter is paid to promote without disclosure (see conflict note below)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Conflict of interest</h2>
            <p className="mt-2">
              If you submit as a <strong>Professional</strong> and you are employed by, contracted
              with, or paid by the organization you are reviewing, disclose that relationship in your
              narrative or contact{" "}
              <a href="mailto:SageWithYou@sageelan.org" className="text-sage-700 font-medium hover:underline">
                SageWithYou@sageelan.org
              </a>{" "}
              before submitting. Undisclosed professional conflicts may be rejected.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">When aggregates appear publicly</h2>
            <p className="mt-2">
              Approved submissions contribute to profile-level WPE statistics only when charter
              thresholds are met (at least 15 approved responses from at least 10 unique contributors
              within 24 months). Below that threshold, profiles show that feedback is still being
              collected. See{" "}
              <Link to="/sage-badge/scoring-standard" className="text-sage-700 font-medium hover:underline">
                The Sage Standard
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Retention and privacy</h2>
            <p className="mt-2">
              WPE data is handled under our{" "}
              <Link to="/privacy" className="text-sage-700 font-medium hover:underline">
                Privacy Policy
              </Link>
              . Narratives are not published verbatim on company profiles unless explicitly selected
              by staff under a future narrative feature; aggregates use structured fields only in
              Phase 1.
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/sage-badge/experience">Share your experience</Link>
          </Button>
          <Button asChild className="bg-sage-600 hover:bg-sage-700">
            <Link to="/sage-badge">Back to Sage Badge</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
