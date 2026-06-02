import { Mail, MapPin, Heart, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useState } from "react";
import { supabase } from "../../utils/supabase";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Confirmation email sent via Edge Function + Microsoft 365 SMTP. */
  const [confirmationEmailSent, setConfirmationEmailSent] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    setConfirmationEmailSent(null);

    const { data: fnResult, error: fnError } = await supabase.functions.invoke("submit-contact", {
      body: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      },
    });

    setIsSubmitting(false);

    const payload = fnResult as { ok?: boolean; emailSent?: boolean; error?: string; detail?: string } | null;

    if (fnError) {
      if (payload?.error === "rate_limited") {
        setSubmitError(
          "Too many contact attempts from this network. Please wait about an hour or email us directly at info@sageelan.org.",
        );
        return;
      }
      setSubmitError(fnError.message || "Could not send your message. Please try again.");
      return;
    }
    if (!payload?.ok) {
      if (payload?.error === "rate_limited") {
        setSubmitError(
          "Too many contact attempts from this network. Please wait about an hour or email us directly at info@sageelan.org.",
        );
        return;
      }
      setSubmitError(payload?.detail || payload?.error || "Could not save your message.");
      return;
    }

    setSubmitted(true);
    setConfirmationEmailSent(payload.emailSent === true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetToForm = () => {
    setSubmitted(false);
    setSubmitError(null);
    setConfirmationEmailSent(null);
  };

  const contactInfo = [
    {
      icon: Heart,
      title: "About Us",
      content: "SageÉlan Foundation, Inc.",
      description: "A nonprofit organization dedicated to supporting aging in place",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "info@sageelan.org",
      description: "We'll respond to your inquiry as soon as possible",
    },
    {
      icon: MapPin,
      title: "Our Mission",
      content: "Supporting Living in Place",
      description: "Serving individuals and caregivers nationwide",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-sage-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6 text-gray-900">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Have questions about our programs or resources? We're here to help.
              Reach out to learn more about how Sage With You can support you or
              your loved ones.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card
                  key={index}
                  className="border-gray-200 text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-sage-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-sage-600 font-medium mb-2">
                      {info.content}
                    </p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <h2 className="text-2xl mb-6 text-gray-900 text-center">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="bg-sage-50 border border-sage-200 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-sage-600 fill-sage-600" />
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">
                      Thank You!
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Your message has been received. We'll get back to you soon.
                    </p>
                    {confirmationEmailSent === true && (
                      <p className="text-gray-700 text-sm mb-6">
                        We sent a confirmation email to the address you provided. If you do not see it within a few minutes, check your spam or promotions folder.
                      </p>
                    )}
                    {confirmationEmailSent === false && (
                      <p className="text-amber-800 text-sm mb-6 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        Your message was saved successfully, but we could not send a confirmation email this time. If you need a record of what you sent, use &quot;Send another message&quot; below or contact us at{" "}
                        <a href="mailto:info@sageelan.org" className="text-sage-700 underline font-medium">
                          info@sageelan.org
                        </a>
                        .
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-6 border-sage-600 text-sage-700 hover:bg-sage-50"
                      onClick={resetToForm}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-900">
                            Could not send your message
                          </p>
                          <p className="text-sm text-red-800 mt-1">{submitError}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this regarding?"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        rows={6}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="bg-sage-600 hover:bg-sage-700"
                      >
                        {isSubmitting ? "Sending…" : "Send Message"}
                      </Button>
                    </div>

                    <p className="text-sm text-gray-600 text-center">
                      * Required fields
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
            We're Here to Support You
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Whether you're exploring options for yourself, seeking resources for
            a loved one, or looking for caregiver support, the Sage With You team
            is committed to providing the information and guidance you need.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our evidence-informed approach ensures that you receive reliable,
            practical information to support your journey of living in place with
            dignity and confidence.
          </p>
        </div>
      </section>
    </div>
  );
}
