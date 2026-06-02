import { BookOpen, Users, Home, HeartHandshake, GraduationCap, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Programs() {
  const programs = [
    {
      icon: GraduationCap,
      title: "Aging Education",
      description:
        "Comprehensive educational programs covering physical, emotional, and social aspects of aging. Learn about health maintenance, mobility, cognitive wellness, and strategies for staying active and engaged.",
      topics: [
        "Healthy aging strategies",
        "Cognitive wellness",
        "Physical activity and mobility",
        "Nutrition and wellness",
      ],
    },
    {
      icon: HeartHandshake,
      title: "Caregiver Support",
      description:
        "Specialized training and resources for family members and professional caregivers. Gain practical skills, emotional support strategies, and self-care techniques to provide the best care while maintaining your own wellbeing.",
      topics: [
        "Caregiving fundamentals",
        "Stress management",
        "Communication techniques",
        "Self-care for caregivers",
      ],
    },
    {
      icon: Home,
      title: "Home Safety & Adaptation",
      description:
        "Practical guidance on creating a safe, accessible, and comfortable home environment. Learn about modifications, assistive technologies, and environmental design that support independence.",
      topics: [
        "Fall prevention",
        "Home modifications",
        "Assistive technologies",
        "Universal design principles",
      ],
    },
    {
      icon: Users,
      title: "Family & Community",
      description:
        "Programs that strengthen family connections and community engagement. Explore strategies for maintaining social connections, involving family in care decisions, and accessing community resources.",
      topics: [
        "Family communication",
        "Community resources",
        "Social engagement",
        "Support networks",
      ],
    },
    {
      icon: BookOpen,
      title: "Health Literacy",
      description:
        "Educational initiatives focused on understanding health information, navigating healthcare systems, and making informed decisions about medical care and wellness.",
      topics: [
        "Understanding medical information",
        "Healthcare navigation",
        "Medication management",
        "Preventive care",
      ],
    },
    {
      icon: Lightbulb,
      title: "Planning & Decision Making",
      description:
        "Resources for advance planning, including legal considerations, financial planning, and care preferences. Make informed decisions about your future with confidence and clarity.",
      topics: [
        "Advance care planning",
        "Legal considerations",
        "Financial planning",
        "Care preferences",
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-sage-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl mb-6 text-gray-900">
                Our Programs
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Evidence-informed education and support designed to empower
                individuals and caregivers on their journey of living in place.
              </p>
              <p className="text-lg text-gray-600">
                Our comprehensive programs address the multifaceted needs of
                aging at home, providing practical guidance, emotional support,
                and actionable strategies.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758691032133-b17f5a103436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBtYW4lMjByZWFkaW5nJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzczODA0NDU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Senior engaging in learning"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Education & Support Areas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our programs cover a wide range of topics to support successful
              aging in place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <Card
                  key={index}
                  className="border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-sage-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Key Topics:
                      </p>
                      <ul className="space-y-1">
                        {program.topics.map((topic, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-start"
                          >
                            <span className="text-sage-600 mr-2">•</span>
                            <span>{topic}</span>
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

      {/* Approach Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl mb-8 text-gray-900 text-center">
            Our Educational Approach
          </h2>
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              All Sage With You programs are grounded in evidence-based
              practices and current research in gerontology, caregiving, and
              home-based wellness. We translate complex information into
              practical, actionable guidance that can be applied in daily life.
            </p>
            <p>
              Our person-centered approach recognizes that every individual's
              circumstances, preferences, and needs are unique. We provide
              flexible frameworks that can be adapted to different situations,
              cultural contexts, and personal values.
            </p>
            <p>
              We emphasize empowerment through education, helping individuals and
              families make informed decisions, access appropriate resources,
              and develop strategies that work for their specific situations.
            </p>
            <p>
              Whether you're planning ahead, currently navigating aging in
              place, or supporting a loved one as a caregiver, our programs
              offer the knowledge and support you need at every stage of the
              journey.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sage-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Interested in Our Programs?
          </h2>
          <p className="text-xl text-sage-50 mb-8">
            Explore our resources or reach out to learn more about how our
            educational initiatives can support you or your loved ones.
          </p>
        </div>
      </section>
    </div>
  );
}
