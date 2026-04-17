import {
  FileText,
  Video,
  BookMarked,
  CheckCircle,
  Phone,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

export function Resources() {
  const resourceCategories = [
    {
      icon: FileText,
      title: "Educational Guides",
      description:
        "Comprehensive guides covering essential topics for aging in place, caregiver support, and home safety.",
      items: [
        "Creating a Safe Home Environment",
        "Understanding Healthcare Options",
        "Nutrition for Healthy Aging",
        "Cognitive Health and Wellness",
      ],
    },
    {
      icon: CheckCircle,
      title: "Checklists & Tools",
      description:
        "Practical checklists and assessment tools to help you evaluate needs and plan effectively.",
      items: [
        "Home Safety Assessment Checklist",
        "Caregiver Wellness Self-Check",
        "Medication Management Tracker",
        "Emergency Preparedness Checklist",
      ],
    },
    {
      icon: BookMarked,
      title: "Planning Resources",
      description:
        "Resources to help with advance planning, decision-making, and organizing care.",
      items: [
        "Advance Care Planning Workbook",
        "Care Preference Documentation",
        "Financial Planning Guide",
        "Family Communication Templates",
      ],
    },
    {
      icon: Video,
      title: "Educational Materials",
      description:
        "Evidence-informed content to deepen understanding of aging, caregiving, and wellness topics.",
      items: [
        "Understanding Aging Process",
        "Effective Caregiving Strategies",
        "Managing Chronic Conditions",
        "Supporting Mental Wellbeing",
      ],
    },
  ];

  const faqs = [
    {
      question: "What does 'Living in Place' mean?",
      answer:
        "'Living in Place' is a person-centered approach to aging that recognizes the choice and desire to remain in one's own home. It's about actively living, thriving, and maintaining wellbeing in a familiar environment, rather than simply 'aging in place.' This approach emphasizes independence, dignity, and quality of life.",
    },
    {
      question: "Who can benefit from these resources?",
      answer:
        "Our resources are designed for older adults who wish to age at home, their family members, and caregivers (both family and professional). Whether you're planning ahead, currently navigating the aging process, or supporting a loved one, our materials can provide valuable guidance and support.",
    },
    {
      question: "Are these resources evidence-based?",
      answer:
        "Yes. All Sage With You programs and resources are grounded in current research and evidence-based practices in gerontology, caregiving, and home-based wellness. We work to translate research into practical, actionable information that individuals and families can use.",
    },
    {
      question: "How can I access these resources?",
      answer:
        "Resources are being developed and will be made available through the SageÉlan Foundation's Sage With You program. For information about accessing current materials or upcoming educational initiatives, please contact us through our contact page.",
    },
    {
      question: "What topics do your educational programs cover?",
      answer:
        "Our programs address a comprehensive range of topics including healthy aging strategies, caregiver support, home safety and adaptation, health literacy, social engagement, advance planning, and more. Visit our Programs page to see the full range of educational areas we cover.",
    },
    {
      question: "Is there support available for caregivers?",
      answer:
        "Absolutely. We recognize that caregiving is both rewarding and challenging. Our resources include specific materials for caregivers covering stress management, self-care, communication techniques, practical caregiving skills, and accessing support networks. Supporting caregivers is a core part of our mission.",
    },
  ];

  const supportLinks = [
    {
      icon: Phone,
      title: "National Resources",
      description: "Connect with national organizations supporting aging in place",
      links: [
        "Eldercare Locator (eldercare.acl.gov)",
        "National Institute on Aging (nia.nih.gov)",
        "Family Caregiver Alliance (caregiver.org)",
      ],
    },
    {
      icon: Globe,
      title: "Community Support",
      description: "Find local resources and community programs in your area",
      links: [
        "Area Agencies on Aging",
        "Local Senior Centers",
        "Community Health Services",
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6 text-gray-900">
              Resources & Support
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Evidence-informed resources, practical tools, and helpful
              information to support your journey of living in place.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Available Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of educational materials, tools, and guides.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={index}
                  className="border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <ul className="space-y-2">
                      {category.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="text-teal-600 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Links */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Additional Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with national and community resources for additional
              assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {supportLinks.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={index}
                  className="border-gray-200"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-teal-600" />
                      <CardTitle className="text-xl text-gray-900">
                        {section.title}
                      </CardTitle>
                    </div>
                    <p className="text-gray-600">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.links.map((link, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="text-teal-600 mr-2">•</span>
                          <span>{link}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our programs and living in place.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg text-gray-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Need More Information?
          </h2>
          <p className="text-xl text-teal-50 mb-8">
            Contact us to learn more about accessing our resources or to ask
            questions about our programs.
          </p>
        </div>
      </section>
    </div>
  );
}
