import { Users, Heart, BookOpen, Phone, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function CaregiverSupport() {
  const supportAreas = [
    {
      icon: Heart,
      title: "Emotional Wellbeing",
      description: "Resources to help you manage stress, prevent burnout, and maintain your own mental health while caring for others.",
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Evidence-based information about caregiving techniques, medical conditions, and best practices for providing care.",
    },
    {
      icon: Users,
      title: "Respite & Self-Care",
      description: "Guidance on finding respite care, setting boundaries, and prioritizing your own health and wellbeing.",
    },
    {
      icon: Phone,
      title: "Connection & Community",
      description: "Information about support groups, caregiver communities, and professional resources in your area.",
    },
  ];

  const challenges = [
    "Feeling overwhelmed or isolated",
    "Balancing caregiving with work and family",
    "Managing your own health needs",
    "Navigating complex healthcare systems",
    "Making difficult decisions about care",
    "Finding time for yourself",
    "Dealing with caregiver guilt or grief",
  ];

  const selfCareStrategies = [
    {
      title: "Ask for Help",
      description: "Reach out to family, friends, and professionals. Accepting support is a sign of strength, not weakness.",
    },
    {
      title: "Take Regular Breaks",
      description: "Schedule respite time, even if it's just 15 minutes a day. Your wellbeing matters.",
    },
    {
      title: "Stay Connected",
      description: "Maintain relationships and social connections outside of your caregiving role.",
    },
    {
      title: "Monitor Your Health",
      description: "Keep up with your own medical appointments, exercise, and healthy eating habits.",
    },
    {
      title: "Set Realistic Expectations",
      description: "You can't do everything perfectly. Be kind to yourself and celebrate small victories.",
    },
    {
      title: "Seek Professional Support",
      description: "Consider counseling, support groups, or caregiver coaching when you need additional help.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl text-gray-900">
                  Caregiver Support
                </h1>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Caregiving is one of the most important—and challenging—roles you can take on. We're here to support you with resources, guidance, and recognition that your wellbeing matters too.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                You can't pour from an empty cup. Taking care of yourself isn't selfish—it's essential for providing the best care to your loved one.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1773227055656-ec329ce9adac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZ2l2ZXIlMjBmYW1pbHklMjBzdXBwb3J0JTIwc2VuaW9yfGVufDF8fHx8MTc3MzgwNjg4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Caregiver providing family support to senior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Areas */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              How We Support Caregivers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive resources designed specifically for family caregivers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {supportAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {area.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{area.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Common Challenges */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              You're Not Alone
            </h2>
            <p className="text-xl text-gray-600">
              Many caregivers face similar challenges
            </p>
          </div>

          <Card className="border-gray-200 bg-white">
            <CardContent className="pt-8">
              <div className="grid md:grid-cols-2 gap-4">
                {challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{challenge}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-teal-600 text-white rounded-lg text-center">
                <p className="text-lg">
                  If you're experiencing these challenges, take our{" "}
                  <Link to="/assessments" className="underline font-semibold hover:text-teal-100">
                    Caregiver Wellness Check
                  </Link>{" "}
                  to identify areas where you may need additional support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Self-Care Strategies */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Self-Care Strategies for Caregivers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evidence-based practices to help you maintain your wellbeing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selfCareStrategies.map((strategy, index) => (
              <Card key={index} className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    {strategy.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{strategy.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Additional Caregiver Resources
          </h2>
          <p className="text-xl text-teal-50 leading-relaxed mb-8">
            Explore our library for downloadable guides, checklists, and workbooks specifically designed for family caregivers. From stress management techniques to communication strategies, we have tools to support you at every stage of your caregiving journey.
          </p>
          <Link to="/library">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
              Browse Caregiver Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
            Need Personalized Support?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're here to help you navigate your caregiving journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessments">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Take the Wellness Check
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
