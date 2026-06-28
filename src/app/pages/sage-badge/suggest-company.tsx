import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AlertCircle, CheckCircle } from "lucide-react";
import { SageBadgeNav } from "../../components/badge/SageBadgeNav";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { supabase } from "../../../utils/supabase";
import { userFacingMessage } from "../../../utils/authErrorMessage";
import { normalizeOptionalWebsiteUrl, type BadgeServiceType } from "../../../lib/badge";

export function SageBadgeSuggestCompany() {
  const [serviceTypes, setServiceTypes] = useState<BadgeServiceType[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [serviceTypeInterest, setServiceTypeInterest] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    void supabase
      .from("badge_service_types")
      .select("id, label, sort_order")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setServiceTypes((data ?? []) as BadgeServiceType[]));

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      const meta = (session.user.user_metadata ?? {}) as Record<string, unknown>;
      const full =
        typeof meta.full_name === "string"
          ? meta.full_name.trim()
          : [meta.first_name, meta.last_name].filter(Boolean).join(" ").trim();
      if (full) setContactName(full);
      if (session.user.email) setContactEmail(session.user.email);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { data, error: fnErr } = await supabase.functions.invoke("submit-badge-inquiry", {
      body: {
        inquiry_type: "community_nomination",
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || null,
        website_url: normalizeOptionalWebsiteUrl(websiteUrl),
        service_type_interest: serviceTypeInterest || null,
        message: message.trim(),
        sage_panthers_interest: false,
        panthers_engagement_types: [],
      },
    });

    setSubmitting(false);
    const payload = data as { ok?: boolean; error?: string; detail?: string } | null;

    if (fnErr || !payload?.ok) {
      const code = payload?.error;
      let fallback =
        "We could not submit your suggestion. Please try again or email info@sageelan.org.";
      if (code === "missing_fields" || code === "invalid_email") {
        fallback = "Please check required fields and use a valid email address.";
      } else if (code === "save_failed") {
        fallback =
          "Your suggestion could not be saved. If this continues, email info@sageelan.org and mention Sage Badge company suggestion.";
      } else if (fnErr?.message?.toLowerCase().includes("failed to send")) {
        fallback =
          "The suggestion service is not available yet. Please try again later or email info@sageelan.org.";
      }
      setError(userFacingMessage(payload?.detail, fallback));
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <>
        <SageBadgeNav />
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <CheckCircle className="h-14 w-14 text-sage-600 mx-auto mb-4" aria-hidden />
          <h1 className="text-2xl font-semibold text-gray-900">Suggestion received</h1>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            Thank you. Sage Badge staff will review this organization. If it is assessed and
            published, it will appear in the verified company directory and you can share your
            experience.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/sage-badge/experience">Share your experience</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/sage-badge">Back to Sage Badge</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SageBadgeNav />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl font-semibold text-gray-900">Suggest a company</h1>
        <p className="mt-2 text-gray-600 leading-relaxed">
          Use this page to nominate an organization for the Sage Verified directory. You do not need
          to sign in. This is separate from{" "}
          <Link to="/sage-badge/experience" className="font-medium text-sage-700 hover:underline">
            Share your experience
          </Link>
          , which only works after a company is already listed.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Organizations requesting assessment can use{" "}
          <Link to="/sage-badge/for-companies" className="font-medium text-sage-700 hover:underline">
            For organizations
          </Link>
          .
        </p>

        <Card className="mt-8 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Company suggestion</CardTitle>
            <CardDescription>
              Tell us which organization you would like to see in the Sage Verified directory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="companyName">Organization name *</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website (optional)</Label>
                <Input
                  id="websiteUrl"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="www.example.com"
                />
                <p className="text-xs text-gray-500">
                  You can type a web address with or without https://. Leave blank if unknown.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Type of service (optional)</Label>
                <select
                  id="serviceType"
                  value={serviceTypeInterest}
                  onChange={(e) => setServiceTypeInterest(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select…</option>
                  {serviceTypes.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your name *</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Your email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone (optional)</Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Why suggest this organization? *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="How does this organization support living in place? Any experience you can share helps staff prioritize."
                />
              </div>

              <p className="text-xs text-gray-500">
                Not affiliated with the organization? That is fine. Do not include private health
                information.
              </p>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-sage-600 hover:bg-sage-700"
              >
                {submitting ? "Submitting…" : "Submit company suggestion"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-sm text-gray-600">
          Already listed?{" "}
          <Link to="/sage-badge/experience" className="font-medium text-sage-700 hover:underline">
            Share your experience
          </Link>{" "}
          instead.
        </p>
      </div>
    </>
  );
}
