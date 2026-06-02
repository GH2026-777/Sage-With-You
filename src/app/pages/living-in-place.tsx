import { Home, CheckCircle, Users, Shield, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function LivingInPlace() {
  const benefits = [
    {
      icon: Heart,
      title: "Comfort & Familiarity",
      description: "Stay in the home and community you know and love, surrounded by memories and meaningful connections.",
    },
    {
      icon: Shield,
      title: "Independence & Control",
      description: "Maintain autonomy over your daily routines, decisions, and lifestyle preferences.",
    },
    {
      icon: Users,
      title: "Community Connection",
      description: "Stay connected to neighbors, friends, local organizations, and social networks.",
    },
    {
      icon: CheckCircle,
      title: "Cost Effectiveness",
      description: "Often more affordable than institutional care when properly planned and supported.",
    },
  ];

  const keyComponents = [
    {
      title: "Home Safety & Accessibility",
      items: [
        "Fall prevention modifications",
        "Bathroom and kitchen adaptations",
        "Adequate lighting and visibility",
        "Emergency response systems",
        "Clear pathways and decluttering",
      ],
    },
    {
      title: "Health & Wellness",
      items: [
        "Regular medical care and monitoring",
        "Medication management systems",
        "Physical activity and exercise",
        "Nutrition and meal planning",
        "Cognitive and social engagement",
      ],
    },
    {
      title: "Support Services",
      items: [
        "Personal care assistance when needed",
        "Home healthcare services",
        "Meal delivery or preparation",
        "Transportation options",
        "Housekeeping and maintenance",
      ],
    },
    {
      title: "Planning & Preparation",
      items: [
        "Advance care planning documents",
        "Financial planning for care costs",
        "Emergency preparedness plans",
        "Family communication and agreements",
        "Regular reassessment of needs",
      ],
    },
  ];

  const stages = [
    {
      title: "Early Planning",
      description: "Begin thinking about aging in place before immediate needs arise. Assess your home, explore options, and start conversations with family.",
    },
    {
      title: "Making Modifications",
      description: "Implement home safety improvements, establish support systems, and create routines that promote independence and wellbeing.",
    },
    {
      title: "Ongoing Adaptation",
      description: "Regularly reassess needs, adjust plans as circumstances change, and add services or support as required.",
    },
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
                  <Home className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl text-gray-900">
                  Living in Place
                </h1>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                "Living in place" means remaining in your own home and community as you age, with the support, modifications, and resources needed to maintain independence, safety, and quality of life.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                It's about more than just staying put. It's about thriving where you are, on your own terms.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1770821865661-65fd33e64581?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBpbmRlcGVuZGVudCUyMGxpdmluZyUyMGhvbWV8ZW58MXx8fHwxNzczODA2ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Senior living independently at home"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Benefits of Living in Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Why so many people choose to age at home
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-sage-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Components */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Key Components of Successful Living in Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive approach to maintaining independence at home
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {keyComponents.map((component, index) => (
              <Card key={index} className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    {component.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {component.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-sage-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Stages of Living in Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              An evolving journey that adapts to your changing needs
            </p>
          </div>

          <div className="space-y-6">
            {stages.map((stage, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-semibold text-sage-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section className="py-20 bg-sage-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Are You Ready to Live in Place?
          </h2>
          <p className="text-xl text-sage-50 leading-relaxed mb-8">
            Take our Living in Place Readiness Assessment to evaluate your current situation and identify areas that may need attention or planning.
          </p>
          <Link to="/assessments">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sage-600">
              Take the Readiness Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
            Get Started with Living in Place
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore our comprehensive resources and programs designed to support your journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/library">
              <Button size="lg" className="bg-sage-600 hover:bg-sage-700">
                Browse Resources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/programs">
              <Button
                size="lg"
                variant="outline"
                className="border-sage-600 text-sage-600 hover:bg-sage-50"
              >
                View Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
