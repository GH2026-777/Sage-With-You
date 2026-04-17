import { Link } from "react-router";
import { Heart, Users, BookOpen, Home as HomeIcon, ArrowRight, ClipboardCheck, Library, Settings, Smartphone } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export function Home() {
  const features = [
    {
      icon: Heart,
      title: "Person-Centered Care",
      description:
        "Supporting your journey with dignity, clarity, and compassion as you continue living in your own home.",
      path: "/person-centered-care",
    },
    {
      icon: Users,
      title: "Caregiver Support",
      description:
        "Evidence-informed resources and guidance for family members and caregivers supporting loved ones.",
      path: "/caregiver-support",
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description:
        "Access to comprehensive, research-based information about aging, wellness, and home-based care.",
      path: "/educational-resources",
    },
    {
      icon: HomeIcon,
      title: "Living in Place",
      description:
        "Tools and strategies to maintain independence, wellbeing, and confidence in your own home.",
      path: "/living-in-place",
    },
    {
      icon: ClipboardCheck,
      title: "Interactive Assessments",
      description:
        "Take personalized self-assessments to evaluate home safety, caregiver wellness, and readiness for aging in place.",
      path: "/assessments",
    },
    {
      icon: Library,
      title: "Resource Library",
      description:
        "Browse and save guides, checklists, videos, and articles tailored to your needs.",
      path: "/library",
    },
    {
      icon: Settings,
      title: "Accessibility Tools",
      description:
        "Adjust text size, enable high contrast mode, and use text-to-speech for an accessible experience.",
      path: "/accessibility-features",
    },
    {
      icon: Smartphone,
      title: "Smart Home Technology",
      description:
        "Guidance on using smartphones, remote entry systems, and smart home devices to enhance safety, convenience, and independence at home.",
      path: "/smart-home-technology",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 to-blue-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl mb-6 text-gray-900">
                <span className="block">Sage With You</span>
                <span className="block text-teal-600 mt-2">
                  Living in Place
                </span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Your supportive partner for aging with dignity and confidence.
                We provide evidence-informed guidance for individuals,
                caregivers, and families choosing to age at home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/programs">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                    Explore Our Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50"
                  >
                    View Resources
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758686253692-2d6921de12dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY291cGxlJTIwc21pbGluZyUyMGhvbWV8ZW58MXx8fHwxNzczODA0NDU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Elderly couple smiling at home"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              How We Support You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The SageÉlan Foundation is committed to providing supportive,
              evidence-informed guidance that helps maintain wellbeing while
              living at home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.path}>
                  <Card className="border-gray-200 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-teal-600" />
                      </div>
                      <h3 className="text-xl mb-3 text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                      <div className="mt-4 flex items-center text-teal-600 font-medium">
                        Learn more
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl mb-6">
                Our Commitment to You
              </h2>
              <p className="text-lg mb-6 text-teal-50">
                "Sage With You" communicates our role as your supportive
                partner, emphasizing dignity, clarity, and companionship.
                "Living in Place" represents a person-centered approach to
                aging—one that respects your choice to remain in the comfort and
                familiarity of your own home.
              </p>
              <p className="text-lg text-teal-50">
                We believe in empowering individuals and their caregivers with
                the knowledge, resources, and support needed to navigate the
                journey of aging with confidence and grace.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764006145420-df3006edf060?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZ2l2ZXIlMjBoZWxwaW5nJTIwc2VuaW9yJTIwd29tYW58ZW58MXx8fHwxNzczODA0NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Caregiver supporting senior woman"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
            Ready to Learn More?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover how our programs and resources can support you or your
            loved ones in living independently and confidently at home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                About Our Foundation
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}