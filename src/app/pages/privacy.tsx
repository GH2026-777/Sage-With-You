import { Link } from "react-router";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

/**
 * Privacy policy for Sage With You (SageÉlan Foundation, Inc.).
 * Substance follows SageÉlan-approved legal templates, adjusted for this site (contact form, auth, library, cookies).
 */
const LAST_UPDATED = "January 18, 2026";

export function Privacy() {
  return (
    <div>
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-teal-700 mb-4">
            <Shield className="h-10 w-10 shrink-0" aria-hidden />
            <h1 className="text-4xl font-semibold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-sm text-gray-600 mb-2">Last updated: {LAST_UPDATED}</p>
          <p className="text-gray-700 leading-relaxed">
            Sage With You is operated by <strong>SageÉlan Foundation, Inc.</strong> (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use this website and related online services.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you use Sage With You — including educational pages, the resource
                library, optional assessments, account features, and the contact form.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal information</h3>
                <p className="mb-2">When you create an account or contact us, we may collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name and email address</li>
                  <li>Account credentials (for example, encrypted password managed by our authentication provider)</li>
                  <li>
                    Age eligibility confirmation (confirmation that you are 18 years or older, where we collect that
                    attestation as part of registration)
                  </li>
                  <li>Profile or preference information you choose to provide</li>
                  <li>Phone number or other fields you voluntarily include on the contact form</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Wellbeing and assessment information</h3>
                <p>
                  If you use interactive assessments or similar tools on this site, we collect the responses and scores
                  needed to operate those features and to improve our services (including using anonymized, aggregated
                  data where appropriate).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage data</h3>
                <p>
                  We automatically collect information about your interactions with our site, including pages visited,
                  features used, and timestamps — for example through server logs and, if you accept optional analytics
                  cookies, through measurement tools we may enable in the future under the same cookie choice.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Resource library (browser storage)</h3>
                <p>
                  If you save resources in the library, that list may be stored locally in your browser (for example{" "}
                  <code className="rounded bg-gray-100 px-1 text-xs">localStorage</code>) and is not sent to our servers
                  unless we later offer a signed-in sync feature.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 leading-relaxed">
                <li>To provide and maintain our websites, accounts, and tools</li>
                <li>To respond to inquiries and send transactional messages (such as contact confirmations)</li>
                <li>To improve and optimize our programs, content, and methodology</li>
                <li>To communicate with you about your account and our services</li>
                <li>To conduct research and analysis (using anonymized, aggregated data where appropriate)</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 leading-relaxed space-y-2">
              <p>We implement industry-standard security measures to protect your personal information, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Encryption of data in transit and at rest, consistent with our hosting and authentication providers</li>
                <li>Secure authentication and password protection</li>
                <li>Regular security reviews and updates as part of our operations</li>
                <li>Limited personnel access to personal data on a need-to-know basis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">5. Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 leading-relaxed space-y-2">
              <p>
                <strong>We do not sell your personal information.</strong> We may share your data only in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>With your consent:</strong> When you explicitly authorize us to share your information
                </li>
                <li>
                  <strong>For research:</strong> Anonymized, aggregated data may be used for program improvement or
                  scientific research
                </li>
                <li>
                  <strong>Service providers:</strong> Third-party services that help us operate our site (for example
                  hosting, authentication, email, or analytics), bound by confidentiality and data-processing
                  obligations appropriate to their role
                </li>
                <li>
                  <strong>Legal requirements:</strong> When required by law or to protect our rights and the safety of
                  users
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">6. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-2">You may have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700 leading-relaxed">
                <li>Access and download certain personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data where the feature is offered</li>
                <li>Opt out of optional marketing communications when we send them</li>
                <li>Withdraw consent for optional processing where consent is the legal basis</li>
                <li>
                  Adjust cookie preferences on{" "}
                  <Link to="/account#cookies" className="text-teal-700 font-medium hover:underline">
                    Account → Cookies
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                We retain your personal information for as long as your account is active or as needed to provide our
                services, comply with law, resolve disputes, and enforce our agreements.
              </p>
              <p>
                <strong>Separate paid programs:</strong> If you purchase paid offerings through SageÉlan or partner
                platforms (for example subscription-based wellbeing tools), retention after cancellation may follow the
                policy disclosed at purchase for that product.
              </p>
              <p>
                <strong>Account deletion:</strong> If you delete your account, we will delete or anonymize your data
                within a reasonable period (typically within 30 days), except where retention is required by law.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">8. Children&apos;s Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
                information from children.
              </p>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Age verification</h3>
                <p className="mb-2">
                  Where we offer account registration, users must confirm they are 18 years of age or older. This
                  verification may be stored as part of your account metadata along with a timestamp of when the
                  verification occurred.
                </p>
                <p className="mb-2">We collect and store this information to:</p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>Ensure compliance with age restrictions</li>
                  <li>Protect minors from accessing services not intended for them</li>
                  <li>Maintain an audit trail for legal compliance</li>
                  <li>Verify eligibility to use the platform</li>
                </ul>
              </div>
              <div className="rounded-lg border-l-4 border-teal-600 bg-teal-50 p-4">
                <p className="font-semibold text-gray-900 mb-1">Important</p>
                <p>
                  If we discover or are notified that a user is under 18 years of age, we may terminate the account and
                  delete associated data in compliance with applicable children&apos;s privacy laws.
                </p>
              </div>
              <p>
                If you believe a minor has provided personal information, contact us immediately at{" "}
                <a href="mailto:info@sageelan.org" className="text-teal-700 font-medium hover:underline">
                  info@sageelan.org
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 leading-relaxed">
              <p>
                Your information may be transferred to and processed in countries other than your own (including where
                our service providers operate). We use safeguards appropriate to the risk and consistent with
                applicable law.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes where
                required by law, including by email or through our platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 leading-relaxed space-y-2">
              <p>If you have questions about this Privacy Policy or our data practices, please contact us at:</p>
              <p>
                Email:{" "}
                <a href="mailto:info@sageelan.org" className="text-teal-700 font-medium hover:underline">
                  info@sageelan.org
                </a>
              </p>
              <p>
                Or use our{" "}
                <Link to="/contact" className="text-teal-700 font-medium hover:underline">
                  contact form
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <p className="text-sm text-gray-500">
            <Link to="/" className="text-teal-700 hover:underline">
              ← Back to home
            </Link>
            {" · "}
            <Link to="/terms" className="text-teal-700 hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
