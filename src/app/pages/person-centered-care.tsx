import { Heart, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function PersonCenteredCare() {
  const principles = [
    {
      title: "Dignity & Respect",
      description: "Honoring individual preferences, values, and life experiences in every interaction and decision.",
    },
    {
      title: "Choice & Autonomy",
      description: "Supporting your right to make decisions about your own care and living arrangements.",
    },
    {
      title: "Individualized Support",
      description: "Tailoring resources and guidance to meet your unique needs, goals, and circumstances.",
    },
    {
      title: "Companionship",
      description: "Walking alongside you as a supportive partner, not just a service provider.",
    },
  ];

  const aspects = [
    "Respecting your personal history, culture, and preferences",
    "Listening to your goals and concerns without judgment",
    "Providing information that empowers informed decision-making",
    "Supporting family involvement based on your wishes",
    "Maintaining confidentiality and privacy",
    "Adapting our approach as your needs change over time",
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-sage-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-sage-600 rounded-lg flex items-center justify-center">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl text-gray-900">
                  Person-Centered Care
                </h1>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Your story, your choices, your home. We believe in supporting you as a whole person, honoring your dignity, respecting your preferences, and empowering you to maintain control over your life.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Person-centered care means putting you at the heart of every decision, recognizing that you are the expert on your own life.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758686254563-5c5ab338c8b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGVyc29uJTIwY29tZm9ydCUyMGhvbWV8ZW58MXx8fHwxNzczODA2ODg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Elderly person comfortable at home"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Core Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our person-centered approach is built on these foundational values
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5 text-sage-600" />
                    </div>
                    {principle.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What This Means */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              What Person-Centered Care Means in Practice
            </h2>
            <p className="text-xl text-gray-600">
              Here's how we put these principles into action
            </p>
          </div>

          <Card className="border-gray-200">
            <CardContent className="pt-8">
              <div className="space-y-4">
                {aspects.map((aspect, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-sage-600 flex-shrink-0 mt-1" />
                    <p className="text-lg text-gray-700">{aspect}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 bg-sage-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Why Person-Centered Care Matters
          </h2>
          <p className="text-xl text-sage-50 leading-relaxed mb-6">
            Research consistently shows that person-centered care leads to better health outcomes, increased satisfaction, and improved quality of life. When you feel heard, respected, and empowered, you're more likely to engage actively in your own wellbeing.
          </p>
          <p className="text-xl text-sage-50 leading-relaxed">
            Most importantly, person-centered care recognizes that aging in place is not just about physical safety. It's about maintaining your independence, your identity, and your connections to the people and places that matter most to you.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
            Experience Person-Centered Support
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore our programs and resources designed with you at the center
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/programs">
              <Button size="lg" className="bg-sage-600 hover:bg-sage-700">
                View Our Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-sage-600 text-sage-600 hover:bg-sage-50"
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
