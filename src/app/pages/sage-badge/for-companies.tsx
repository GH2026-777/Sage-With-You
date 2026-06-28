import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AlertCircle, CheckCircle } from "lucide-react";
import { SageBadgeNav } from "../../components/badge/SageBadgeNav";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { supabase } from "../../../utils/supabase";
import { userFacingMessage } from "../../../utils/authErrorMessage";
import {
  INQUIRY_TYPE_OPTIONS,
  normalizeOptionalWebsiteUrl,
  type BadgeServiceType,
  type InquiryType,
} from "../../../lib/badge";

export function SageBadgeForCompanies() {
  const [serviceTypes, setServiceTypes] = useState<BadgeServiceType[]>([]);
  const [inquiryType, setInquiryType] = useState<InquiryType>("sage_verified_assessment");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [serviceTypeInterest, setServiceTypeInterest] = useState("");
  const [message, setMessage] = useState("");
  const [panthersInterest, setPanthersInterest] = useState(false);
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { data, error: fnErr } = await supabase.functions.invoke("submit-badge-inquiry", {
      body: {
        inquiry_type: inquiryType,
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || null,
        website_url: normalizeOptionalWebsiteUrl(websiteUrl),
        service_type_interest: serviceTypeInterest || null,
        message: message.trim(),
        sage_panthers_interest: panthersInterest,
        panthers_engagement_types:
          inquiryType === "sage_panthers_consulting" || inquiryType === "beta_testing"
            ? [inquiryType === "beta_testing" ? "beta_testing" : "usability_review"]
            : [],
      },
    });

    setSubmitting(false);
    const payload = data as { ok?: boolean; error?: string; detail?: string } | null;

    if (fnErr || !payload?.ok) {
      if (payload?.error === "rate_limited") {
        setError("Too many inquiries from this network. Please wait an hour and try again.");
        return;
      }
      setError(
        userFacingMessage(
          payload?.detail || payload?.error || fnErr?.message,
          "We could not submit your inquiry. Please try again or email info@sageelan.org.",
        ),
      );
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
          <h1 className="text-2xl font-semibold text-gray-900">Inquiry received</h1>
          <p className="mt-3 text-gray-600 text-sm">
            Thank you. The Sage With You team will review your request and respond within a few
            business days.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/sage-badge">Back to Sage Badge</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SageBadgeNav />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl font-semibold text-gray-900">For organizations</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Request a Sage Verified assessment, Sage Insight Panel sessions through Sage Panthers, or
          a structured beta cohort.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3 mb-12">
          {INQUIRY_TYPE_OPTIONS.slice(0, 3).map((opt) => (
            <Card key={opt.value} className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">{opt.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">{opt.description}</CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Contact us</CardTitle>
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
                <Label htmlFor="inquiryType">I am interested in</Label>
                <select
                  id="inquiryType"
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  {INQUIRY_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Organization name</Label>
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
                    With or without https://. Leave blank if unknown.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact name</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone (optional)</Label>
                  <Input
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Primary service type</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {(inquiryType === "sage_panthers_consulting" ||
                inquiryType === "beta_testing") && (
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={panthersInterest}
                    onChange={(e) => setPanthersInterest(e.target.checked)}
                    className="mt-1"
                  />
                  I understand senior participants are compensated through Sage Panthers program
                  structures.
                </label>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-sage-600 hover:bg-sage-700"
              >
                {submitting ? "Sending…" : "Submit inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
