import { Link } from "react-router";
import { Award, Building2, MessageSquare, Shield, Users } from "lucide-react";
import { SageBadgeNav } from "../../components/badge/SageBadgeNav";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function SageBadgeHome() {
  const pillars = [
    "Accessibility",
    "Safety & Environment",
    "Communication & Transparency",
    "Dignity & Autonomy",
    "Continuity of Support",
    "Caregiver Access & Supportability",
    "Technology & Ease of Use",
  ];

  return (
    <>
      <SageBadgeNav />
      <div className="bg-gradient-to-b from-sage-50 to-white">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-800 mb-6">
              <Award className="h-4 w-4" aria-hidden />
              Living in Place recognition
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
              Sage Badge
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              The Sage Badge program recognizes organizations that support aging safely and
              confidently at home. Companies are evaluated on <strong>The Sage Standard</strong>,
              seven evidence-informed pillars, and community experience through{" "}
              <strong>What People Are Experiencing (WPE)</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-sage-600 hover:bg-sage-700">
                <Link to="/sage-badge/companies">Browse verified companies</Link>
              </Button>
              <Button asChild variant="outline" className="border-sage-600 text-sage-700">
                <Link to="/sage-badge/for-companies">For organizations</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-gray-200">
              <CardHeader>
                <Shield className="h-8 w-8 text-sage-600 mb-2" aria-hidden />
                <CardTitle className="text-lg">The Sage Standard</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 leading-relaxed">
                Trained assessors score each pillar from 1-5 using observable evidence. Floor rules
                protect safety and dignity. No public badge without meeting minimums.
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader>
                <Users className="h-8 w-8 text-sage-600 mb-2" aria-hidden />
                <CardTitle className="text-lg">Community experience (WPE)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 leading-relaxed">
                Signed-in users share structured feedback about companies. Moderated submissions
                inform the public scorecard when enough approved responses exist.
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader>
                <Building2 className="h-8 w-8 text-sage-600 mb-2" aria-hidden />
                <CardTitle className="text-lg">Sage Verified</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 leading-relaxed">
                Ready, Trusted, and Exceptional levels earn a public Sage Verified designation.
                Emerging and Limited companies may pursue improvement pathways.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">The seven pillars</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <li
                key={p}
                className="rounded-lg border border-sage-200 bg-white px-4 py-3 text-sm text-gray-800"
              >
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-gray-500">
            Scoring follows{" "}
            <Link
              to="/sage-badge/scoring-standard"
              className="text-sage-700 font-medium hover:underline"
            >
              The Sage Standard (Charter v1.0)
            </Link>
            . Organizations can{" "}
            <Link to="/sage-badge/for-companies" className="text-sage-700 font-medium hover:underline">
              request assessment details
            </Link>
            .
          </p>
        </section>

        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-sage-600" aria-hidden />
                Share or inquire
              </h2>
              <p className="mt-2 text-gray-600 text-sm max-w-xl">
                Organizations can request assessment or Sage Insight Panel support. Community
                members can submit experience feedback for published companies.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/sage-badge/experience">Submit experience</Link>
              </Button>
              <Button asChild className="bg-sage-600 hover:bg-sage-700">
                <Link to="/sage-badge/for-companies">Contact for organizations</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
