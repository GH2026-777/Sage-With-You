import { useState } from "react";
import { Link } from "react-router";
import { FileText, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

/**
 * Terms of Service for Sage With You, a program of SageÉlan Foundation, Inc.
 * Aligned with SageÉlan-approved legal templates and tailored for this website.
 */
const LAST_UPDATED = "January 18, 2026";

export function Terms() {
  const [dmcaOpen, setDmcaOpen] = useState(false);
  const [counterNoticeOpen, setCounterNoticeOpen] = useState(false);
  const [assumptionOfRiskOpen, setAssumptionOfRiskOpen] = useState(false);
  const [healthSafetyOpen, setHealthSafetyOpen] = useState(false);

  const p = "text-sm text-gray-700 leading-relaxed";
  const h2 = "text-xl font-semibold text-gray-900";

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-teal-700 mb-4">
            <FileText className="h-10 w-10 shrink-0" aria-hidden />
            <h1 className="text-4xl font-semibold text-gray-900">Terms of Service &amp; Conditions</h1>
          </div>
          <p className="text-sm text-gray-600">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-3`}>
              <p>
                Welcome to <strong>Sage With You</strong>, a program of <strong>SageÉlan Foundation, Inc.</strong> We
                provide evidence-informed information and tools to support wellbeing and aging in place.
              </p>
              <p>
                These Terms of Service &amp; Conditions (the &quot;Terms&quot;) form a contract between you and
                SageÉlan Foundation, Inc. (&quot;SageÉlan,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
                and govern your access to and use of this website, content, assessments, resource library, account
                features, and related online services (collectively, the &quot;Services&quot;). By accessing or using
                the Services, you accept and agree to be bound by these Terms. If you do not agree, please do not use
                the Services.
              </p>
              <p>
                If you are visually impaired, have a disability, or would like these Terms in another language or
                accessible format, contact us at{" "}
                <a href="mailto:info@sageelan.org" className="text-teal-700 font-medium hover:underline">
                  info@sageelan.org
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-3`}>
              <p>Sage With You includes, for example:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Educational articles, program information, and resource pages</li>
                <li>A resource library with downloadable or linked materials where we make them available</li>
                <li>Optional self-service assessments or similar tools we may publish</li>
                <li>Account registration and preferences (including cookie choices)</li>
                <li>A contact form and related communications</li>
              </ul>
              <p>
                Other SageÉlan or partner websites or applications may offer different features; each has its own terms
                and privacy notices that apply when you use that property.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>3. Eligibility and Age Requirements</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-3`}>
              <p>
                You must be at least 18 years old (or the age of digital consent in your jurisdiction) to use the
                Services. If you are under 18, you must have a parent or guardian&apos;s permission where applicable.
                By creating an account, you represent and warrant that you meet this age requirement.
              </p>
              <div className="rounded-lg border-l-4 border-teal-600 bg-teal-50 p-4">
                <p className="font-semibold text-gray-900 mb-1">Age verification</p>
                <p>
                  Where registration is offered, you must confirm that you are 18 years of age or older. We may store
                  this verification as part of your account records for compliance purposes. Providing false
                  information about your age may result in immediate account termination.
                </p>
              </div>
              <p>You may use the Services only in compliance with these Terms and all applicable laws.</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>4. Account Registration</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-3`}>
              <p>
                To use certain features, you may need to create an account. You agree to provide accurate, current, and
                complete information; maintain the security of your credentials; and promptly update your information.
                You are responsible for activity under your account. Accounts are personal to you and non-transferable
                unless we agree otherwise in writing.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>5. Privacy and Data Use</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                Our privacy practices explain what we collect, why we collect it, and how we use and protect it. We may
                use aggregated or de-identified data to improve Services or support research, without identifying you.
                See our{" "}
                <Link to="/privacy" className="text-teal-700 font-medium hover:underline">
                  Privacy Policy
                </Link>
                . If you need a Data Processing Agreement or similar documentation for your organization, contact us.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>6. Paid programs, fees, and payments</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-3`}>
              <p>
                <strong>Core educational use of this site does not require payment.</strong> If we offer optional paid
                programs, registrations, events, donations, or digital goods, pricing, taxes, billing, renewals,
                commitment periods, refunds, and cancellation rules will be disclosed at checkout or in a separate
                agreement presented before you pay.
              </p>
              <p>
                Payments may be processed by third-party processors; their terms and privacy policies apply to payment
                data they handle. If there is a conflict between processor terms and these Terms only as to payment
                processing, the processor terms govern that processing.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>7. Disclaimers; assumption of risk; health &amp; safety</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-4`}>
              <p>
                We strive to make the Services clear, supportive, and grounded in evidence. However, the Services
                (including assessments, recommendations, resources, and any automated or AI-supported features) are{" "}
                <strong>not</strong> a medical device, medical service, or clinical intervention. They do not diagnose,
                treat, cure, or prevent illness or mental-health conditions.
              </p>
              <div className="rounded-lg border-l-4 border-teal-600 bg-teal-50 p-4">
                <p className="font-semibold text-gray-900 mb-2">No medical or mental-health advice</p>
                <p className="mb-2">
                  Only licensed healthcare professionals can provide medical advice or treatment. Information you
                  receive through the Services is educational and designed to support — not replace — your relationship
                  with your healthcare providers.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>If you have health concerns or a medical condition, consult a licensed clinician.</li>
                  <li>
                    If you are in crisis or considering self-harm, call your local emergency number (911 in the U.S.)
                    or the 988 Suicide &amp; Crisis Lifeline (call or text 988).
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setAssumptionOfRiskOpen(!assumptionOfRiskOpen)}
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold text-teal-800">Assumption of risk</span>
                  <ChevronDown
                    className={`h-5 w-5 text-teal-700 transition-transform ${assumptionOfRiskOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {assumptionOfRiskOpen && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-2 space-y-3">
                    <p>
                      By accessing or using the Services, you acknowledge that wellbeing information and activities
                      involve personal choices and risks. You are solely responsible for your physical and mental
                      wellbeing and assume risks arising from activities or practices you choose to undertake. To the
                      fullest extent permitted by law, SageÉlan is not liable for injury, harm, or adverse outcomes
                      associated with your decisions or use of the Services.
                    </p>
                    <p>
                      SageÉlan takes privacy seriously, but we cannot be responsible for unauthorized disclosure
                      resulting from your misuse of the Services or failure to protect credentials.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setHealthSafetyOpen(!healthSafetyOpen)}
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold text-teal-800">Important health &amp; safety notices</span>
                  <ChevronDown
                    className={`h-5 w-5 text-teal-700 transition-transform ${healthSafetyOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {healthSafetyOpen && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-2 space-y-3 text-sm">
                    <p>
                      <strong>(a) Medical concerns.</strong> If you require medical care, contact a licensed healthcare
                      provider. In an emergency, call 911 or your local emergency number.
                    </p>
                    <p>
                      <strong>(b) Not a licensed provider.</strong> SageÉlan does not provide medical diagnosis,
                      treatment, or professional clinical judgment through Sage With You.
                    </p>
                    <p>
                      <strong>(c) No emergency services.</strong> The Services are not for urgent, crisis, or emergency
                      situations and we do not dispatch emergency responders on your behalf.
                    </p>
                    <p>
                      <strong>(d) Informational only.</strong> Written, visual, or automated information is
                      educational and not a substitute for advice from a qualified professional.
                    </p>
                    <p>
                      <strong>(e) Consult a professional.</strong> Ask a physician or licensed clinician about medical
                      conditions, medications, or treatment changes.
                    </p>
                    <p>
                      <strong>(f) Do not disregard professional advice</strong> because of something you read here.
                    </p>
                    <p>
                      <strong>(g) No guarantee of accuracy.</strong> We do not guarantee completeness or clinical accuracy
                      of insights or content.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>8. Movement and activity guidance</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                If you engage in movement, breathwork, or wellness activities suggested through the Services, you
                represent that you are in adequate physical condition. Consult a physician before beginning or
                modifying exercise, especially if you have injury, cardiovascular disease, hypertension, or other
                chronic conditions. You participate at your own risk.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>9. Prohibited use</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Copy, reverse engineer, or misuse the Services except as expressly permitted</li>
                <li>Introduce malware or attempt unauthorized access to systems or accounts</li>
                <li>Use the Services unlawfully, fraudulently, or to harass, abuse, or discriminate</li>
                <li>Scrape or use automated extraction to train external models without our prior written consent</li>
                <li>Circumvent technical or geographic restrictions</li>
                <li>Impersonate any person or entity</li>
              </ul>
              <p className="mt-3">
                We may suspend or terminate access for violations. We may report unlawful activity to authorities and
                cooperate with lawful requests.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>10. Intellectual property; DMCA</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-3`}>
              <p>
                Materials on the Services are owned by SageÉlan or licensors and protected by intellectual property
                laws. Except for limited rights to access for personal, non-commercial use, no rights are granted without
                prior written permission.
              </p>
              <p>
                If you believe material on the Services infringes your copyright, contact us with the information
                required under 17 U.S.C. §512(c)(3). False claims may expose you to liability under §512(f).
              </p>

              <div className="rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setDmcaOpen(!dmcaOpen)}
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold text-teal-800">DMCA notice requirements (summary)</span>
                  <ChevronDown className={`h-5 w-5 text-teal-700 transition-transform ${dmcaOpen ? "rotate-180" : ""}`} />
                </button>
                {dmcaOpen && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-2 space-y-2 text-sm">
                    <p>Your notice should include:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>A physical or electronic signature of the person authorized to act for the copyright owner</li>
                      <li>Identification of the copyrighted work(s) claimed infringed</li>
                      <li>Identification of the material to be removed, with enough detail for us to locate it</li>
                      <li>Your name, address, telephone number, and email</li>
                      <li>
                        A good-faith statement that the use is not authorized by the copyright owner, its agent, or the
                        law
                      </li>
                      <li>
                        A statement, under penalty of perjury, that the information is accurate and you are authorized
                        to act for the owner
                      </li>
                    </ul>
                    <p className="pt-2">
                      <strong>Designated agent:</strong>{" "}
                      <a href="mailto:info@sageelan.org" className="text-teal-700 font-medium hover:underline">
                        info@sageelan.org
                      </a>{" "}
                      (subject line: &quot;DMCA Notice&quot;). A physical mailing address for notices is available upon
                      request at the same email.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setCounterNoticeOpen(!counterNoticeOpen)}
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold text-teal-800">Counter-notice (summary)</span>
                  <ChevronDown
                    className={`h-5 w-5 text-teal-700 transition-transform ${counterNoticeOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {counterNoticeOpen && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-2 space-y-2 text-sm">
                    <p>
                      If content was removed due to a DMCA notice and you believe that was a mistake, you may send a
                      counter-notice meeting the requirements of 17 U.S.C. §512(g)(3), including consent to jurisdiction
                      and acceptance of service from the complaining party. Counter-notices may be submitted to the same
                      designated agent with subject line &quot;DMCA Counter-Notice.&quot; False counter-notices may
                      create legal liability.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>11. Your content</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p className="mb-2">
                You may submit content such as contact messages, assessment responses, or feedback (&quot;User
                Content&quot;). You retain ownership of User Content. You grant SageÉlan a worldwide, royalty-free,
                non-exclusive license to use, host, store, reproduce, adapt, and display User Content solely to
                operate, provide, maintain, and improve the Services, consistent with our Privacy Policy.
              </p>
              <p>You represent that you have the rights needed to share User Content and that it does not violate law.</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>12. Automated features</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                Some features may use automated methods to generate summaries or suggestions. Outputs may be incomplete
                or incorrect. You are responsible for how you use automated outputs, especially for topics affecting
                health, safety, or finances.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>13. Third-party services and links</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-2`}>
              <p>
                The Services may integrate with or link to third-party sites or services. Third-party terms and privacy
                policies govern your use of those services. We do not control third parties and are not responsible for
                their content or practices.
              </p>
              <p>
                You may link to our home page in a fair, lawful way that does not suggest endorsement where none exists,
                without framing, and without deep-linking other pages without permission.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>14. Availability; changes</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                We aim to provide reliable Services but do not guarantee uninterrupted or error-free operation. We may
                modify, suspend, or discontinue features. Beta or experimental features may change or end without
                notice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>15. Warranties and disclaimers</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE FULLEST EXTENT
                PERMITTED BY LAW, SAGEÉLAN DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL
                BE UNINTERRUPTED OR ERROR-FREE.
              </p>
              <p className="mt-2">Nothing in these Terms limits non-waivable consumer rights.</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>16. Limitation of liability</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-2`}>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAGEÉLAN WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, GOODWILL, DATA, OR
                SERVICE INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY.
              </p>
              <p>
                OUR TOTAL LIABILITY FOR CLAIMS ARISING OUT OF OR RELATED TO THE SERVICES OR THESE TERMS IS LIMITED TO
                THE GREATER OF (I) THE AMOUNT YOU PAID TO SAGEÉLAN FOR THE SERVICES GIVING RISE TO THE CLAIM IN THE 12
                MONTHS BEFORE THE EVENT, OR (II) USD $100.
              </p>
              <p>These limitations do not apply where prohibited by law.</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>17. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                You agree to defend, indemnify, and hold harmless SageÉlan and its officers, directors, employees, and
                agents from claims, liabilities, damages, losses, and expenses (including reasonable attorneys&apos;
                fees) arising out of your use of the Services, your User Content, or your violation of law or third-party
                rights.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>18. Suspension and termination</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                You may stop using the Services at any time. We may suspend or terminate access if we reasonably believe
                you breached these Terms, posed a security or legal risk, or failed to pay fees where applicable.
                Provisions that by their nature should survive will survive.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>19. International users</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                We aim to respect local laws. If you are in a jurisdiction with non-waivable consumer protections, these
                Terms are read in harmony with those protections.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>20. Electronic communications</CardTitle>
            </CardHeader>
            <CardContent className={`${p} space-y-2`}>
              <p>
                We may send service-related emails and electronic notices. Your use of the Services constitutes consent
                to receive certain electronic communications required to operate the Services. You may request a paper
                copy of communications by contacting{" "}
                <a href="mailto:info@sageelan.org" className="text-teal-700 font-medium hover:underline">
                  info@sageelan.org
                </a>
                .
              </p>
              <p>
                If you provide feedback, you grant SageÉlan the right to use it without restriction and without
                obligation to you, except where prohibited by law.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>21. Changes to terms</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                We may update these Terms to reflect changes to the Services or law. If changes are material, we will
                provide reasonable notice where required. Continued use after changes take effect means you accept the
                updated Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>22. Governing law and venue</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                These Terms and any dispute arising out of or relating to them or the Services are governed by the laws
                of the State of Washington, without regard to conflict-of-law principles. You and SageÉlan agree to the
                exclusive jurisdiction and venue of the state and federal courts located in King County, Washington,
                except where prohibited by law.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className={h2}>23. Notices</CardTitle>
            </CardHeader>
            <CardContent className={p}>
              <p>
                For questions about these Terms:{" "}
                <a href="mailto:info@sageelan.org" className="text-teal-700 font-medium hover:underline">
                  info@sageelan.org
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 border-teal-200 bg-teal-50/50">
            <CardHeader>
              <CardTitle className={h2}>Plain-language reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                <li>Sage With You is educational and supportive, not a substitute for professional care.</li>
                <li>Use what resonates; check with a clinician when in doubt.</li>
                <li>Be kind to yourself — progress is a practice.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/privacy">Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
