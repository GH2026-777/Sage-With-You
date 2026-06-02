import { BookOpen, FileText, Video, CheckSquare, ArrowRight, Lightbulb } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function EducationalResources() {
  const resourceTypes = [
    {
      icon: FileText,
      title: "Comprehensive Guides",
      description: "In-depth guides covering topics from home modifications to managing chronic conditions.",
      examples: ["Home Safety Guide", "Medication Management", "Advance Care Planning"],
    },
    {
      icon: CheckSquare,
      title: "Practical Checklists",
      description: "Downloadable checklists to help you take action and track your progress.",
      examples: ["Emergency Preparedness", "Home Safety Assessment", "Care Planning"],
    },
    {
      icon: Video,
      title: "Video Education",
      description: "Expert-led videos on caregiving, health conditions, and aging in place strategies.",
      examples: ["Understanding Dementia", "Fall Prevention", "Medicare Overview"],
    },
    {
      icon: BookOpen,
      title: "Articles & Research",
      description: "Evidence-based articles on wellness, nutrition, and healthy aging topics.",
      examples: ["Cognitive Wellness", "Nutrition for Seniors", "Social Connection"],
    },
  ];

  const topicAreas = [
    {
      title: "Home Safety & Modifications",
      topics: [
        "Fall prevention strategies",
        "Bathroom and kitchen adaptations",
        "Lighting and visibility improvements",
        "Emergency preparedness",
      ],
    },
    {
      title: "Health & Wellness",
      topics: [
        "Managing chronic conditions",
        "Medication management",
        "Nutrition and meal planning",
        "Physical activity and mobility",
      ],
    },
    {
      title: "Caregiving Support",
      topics: [
        "Dementia and memory care",
        "Communication strategies",
        "Caregiver self-care",
        "Managing caregiver stress",
      ],
    },
    {
      title: "Planning & Legal",
      topics: [
        "Advance care planning",
        "Healthcare proxies and powers of attorney",
        "Medicare and insurance options",
        "Financial planning for care",
      ],
    },
    {
      title: "Social & Emotional Wellbeing",
      topics: [
        "Staying socially connected",
        "Managing isolation and loneliness",
        "Maintaining purpose and meaning",
        "Grief and loss support",
      ],
    },
    {
      title: "Technology & Innovation",
      topics: [
        "Smart home devices for safety",
        "Telehealth and remote monitoring",
        "Apps for medication and scheduling",
        "Assistive technology options",
      ],
    },
  ];

  const benefits = [
    "Evidence-informed information from trusted sources",
    "Written in accessible, easy-to-understand language",
    "Available in multiple formats to suit different learning styles",
    "Regularly updated with the latest research and best practices",
    "Free to access and download for your personal use",
    "Designed for both individuals aging in place and their caregivers",
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
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl text-gray-900">
                  Educational Resources
                </h1>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Access comprehensive, evidence-based information to help you make informed decisions about aging in place, caregiving, and maintaining wellbeing at home.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Knowledge is power. Our educational resources are designed to empower you with the information you need to navigate your journey with confidence.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764173039323-04d1b1d85364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcmVhZGluZyUyMGJvb2slMjBsZWFybmluZ3xlbnwxfHx8fDE3NzM3NjAyOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Elderly person reading and learning"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resource Types */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Types of Educational Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple formats to match your learning preferences
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resourceTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-sage-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {type.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{type.description}</p>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
                      <div className="flex flex-wrap gap-2">
                        {type.examples.map((example, i) => (
                          <span
                            key={i}
                            className="inline-block px-3 py-1 bg-sage-50 text-sage-700 text-sm rounded-full"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Topic Areas */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              What We Cover
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive information across key topic areas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicAreas.map((area, index) => (
              <Card key={index} className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-sage-600" />
                    {area.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {area.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="text-sage-600 mt-1.5">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Why Our Educational Resources Stand Out
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-sage-50 rounded-lg"
              >
                <CheckSquare className="h-5 w-5 text-sage-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to Library */}
      <section className="py-20 bg-sage-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-sage-50 leading-relaxed mb-8">
            Browse our comprehensive resource library with hundreds of guides, checklists, videos, and articles. Search by topic, save your favorites, and download materials for offline access.
          </p>
          <Link to="/library">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sage-600">
              Explore the Resource Library
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Additional CTA */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
            Looking for Something Specific?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Can't find what you need? Contact us for personalized resource recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/library">
              <Button size="lg" className="bg-sage-600 hover:bg-sage-700">
                Browse Library
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
