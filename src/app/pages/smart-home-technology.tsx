import { Smartphone, Wifi, Bell, Lock, Camera, Thermometer, ArrowRight, Lightbulb } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function SmartHomeTechnology() {
  const categories = [
    {
      icon: Bell,
      title: "Safety & Security",
      description: "Devices that help prevent emergencies and provide peace of mind.",
      examples: [
        "Personal emergency response systems (PERS)",
        "Fall detection sensors",
        "Smart smoke and carbon monoxide detectors",
        "Motion-activated lighting",
        "Video doorbells",
        "Medical alert devices",
      ],
    },
    {
      icon: Lock,
      title: "Remote Access & Control",
      description: "Technology for managing home access and security from anywhere.",
      examples: [
        "Smart door locks with keypad or fingerprint access",
        "Remote door unlock for visitors or caregivers",
        "Video intercom systems",
        "Garage door controllers",
        "Smart home hubs for centralized control",
      ],
    },
    {
      icon: Thermometer,
      title: "Comfort & Convenience",
      description: "Automated systems that make daily life easier and more comfortable.",
      examples: [
        "Smart thermostats for temperature control",
        "Voice-activated assistants (Alexa, Google Home)",
        "Automated lighting systems",
        "Smart blinds and curtains",
        "Medication reminder systems",
      ],
    },
    {
      icon: Camera,
      title: "Health Monitoring",
      description: "Devices that track health metrics and enable remote care.",
      examples: [
        "Blood pressure and glucose monitors",
        "Wearable fitness and health trackers",
        "Telehealth video systems",
        "Smart pill dispensers",
        "Sleep monitoring devices",
      ],
    },
  ];

  const smartphoneBenefits = [
    {
      title: "Communication & Connection",
      items: [
        "Video calls with family and healthcare providers",
        "Text messaging for quick check-ins",
        "Social media to stay connected with friends",
        "Email for important correspondence",
      ],
    },
    {
      title: "Health & Safety",
      items: [
        "Emergency contact access",
        "Health apps for tracking medications and appointments",
        "GPS location services for safety",
        "Medical information storage",
      ],
    },
    {
      title: "Daily Assistance",
      items: [
        "Reminders for medications and appointments",
        "Calendar and schedule management",
        "Voice assistants for hands-free help",
        "Ride-sharing apps for transportation",
      ],
    },
  ];

  const gettingStarted = [
    {
      step: "1",
      title: "Assess Your Needs",
      description: "Identify which areas of daily life could benefit from technology support: safety, convenience, health monitoring, or social connection.",
    },
    {
      step: "2",
      title: "Start Simple",
      description: "Begin with one or two easy-to-use devices. A video doorbell or voice assistant can be great first steps that provide immediate value.",
    },
    {
      step: "3",
      title: "Get Support",
      description: "Ask family members, friends, or hire a tech support specialist to help with setup and learning. Many devices offer simple tutorials.",
    },
    {
      step: "4",
      title: "Practice & Build Confidence",
      description: "Take time to practice using new technology. The more you use it, the more comfortable you'll become.",
    },
    {
      step: "5",
      title: "Expand Gradually",
      description: "Once you're comfortable, consider adding more devices that integrate with your existing setup for a comprehensive smart home system.",
    },
  ];

  const considerations = [
    "Privacy and data security: understand what information devices collect",
    "Cost of devices and any monthly subscription fees",
    "Internet connection requirements and reliability",
    "Ease of use and learning curve",
    "Compatibility with existing devices and systems",
    "Customer support and troubleshooting resources",
    "Battery life or power backup options",
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
                  <Smartphone className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl text-gray-900">
                  Smart Home Technology
                </h1>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Modern technology can enhance safety, convenience, and independence when aging in place. From smartphones to smart home devices, these tools offer practical support for daily living.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                You don't need to be a tech expert to benefit from smart home technology. With the right guidance and simple, user-friendly devices, technology can become a trusted companion in your home.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758691030887-cd65ed177034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjB0ZWNobm9sb2d5JTIwZWxkZXJseXxlbnwxfHx8fDE3NzM4MDY4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Smart home technology for elderly"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Categories */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Types of Smart Home Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solutions for safety, comfort, and peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-sage-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{category.description}</p>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
                      <ul className="space-y-2">
                        {category.examples.map((example, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Wifi className="h-4 w-4 text-sage-600 flex-shrink-0 mt-0.5" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Smartphone Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              The Power of Smartphones
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your smartphone can be a versatile tool for maintaining independence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {smartphoneBenefits.map((benefit, index) => (
              <Card key={index} className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="text-sage-600 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Getting Started with Smart Home Tech
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A step-by-step approach to adopting technology
            </p>
          </div>

          <div className="space-y-4">
            {gettingStarted.map((item, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-semibold text-white">
                        {item.step}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Considerations */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Important Considerations
            </h2>
            <p className="text-xl text-gray-600">
              Think about these factors when choosing smart home technology
            </p>
          </div>

          <Card className="border-gray-200 bg-white">
            <CardContent className="pt-8">
              <div className="grid md:grid-cols-2 gap-4">
                {considerations.map((consideration, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-sage-50 rounded-lg"
                  >
                    <Lightbulb className="h-5 w-5 text-sage-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{consideration}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-sage-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Explore Technology Resources
          </h2>
          <p className="text-xl text-sage-50 leading-relaxed mb-8">
            Visit our resource library for detailed guides on specific devices, setup tutorials, and tips for getting the most out of smart home technology.
          </p>
          <Link to="/library">
            <Button size="lg" className="bg-white text-sage-600 hover:bg-sage-50 hover:text-sage-700 border-2 border-white">
              Browse Technology Guides
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
            Need Help Getting Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us for guidance on choosing the right technology for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/library">
              <Button size="lg" className="bg-sage-600 hover:bg-sage-700">
                View Resources
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