import { Heart, Target, Eye, Award, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const FOUNDATION_BOARD_URL = "https://sageelan.org/board";

export function About() {
  const values = [
    {
      icon: Heart,
      title: "Dignity & Respect",
      description:
        "We honor the autonomy and choices of individuals choosing to age in place, treating everyone with the respect they deserve.",
    },
    {
      icon: Target,
      title: "Evidence-Informed",
      description:
        "Our programs and resources are grounded in research and best practices for aging, caregiving, and home-based wellbeing.",
    },
    {
      icon: Eye,
      title: "Clarity & Transparency",
      description:
        "We provide clear, accessible information that empowers informed decision-making for individuals and families.",
    },
    {
      icon: Award,
      title: "Person-Centered Approach",
      description:
        "Every individual's journey is unique. We tailor our support to meet the specific needs and circumstances of each person.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-sage-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6 text-gray-900">
              About Sage With You
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              A program of the SageÉlan Foundation dedicated to supporting
              aging, caregiver, and home-based wellbeing education initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
                Our Mission
              </h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  The SageÉlan Foundation has adopted{" "}
                  <strong>Sage With You - Living in Place</strong> as the
                  designated program identity for its aging, caregiver, and
                  home-based wellbeing education initiatives.
                </p>
                <p className="mb-4">
                  This naming reflects our commitment to providing supportive,
                  evidence-informed guidance that helps individuals maintain
                  wellbeing and confidence while continuing to live at home.
                </p>
                <p>
                  The phrase "Sage With You" communicates the Foundation's role
                  as a supportive partner, emphasizing dignity, clarity, and
                  companionship. The tagline "Living in Place" serves as a
                  person-centered alternative to traditional terminology while
                  maintaining clarity for public understanding.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
                Our Vision
              </h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  We envision a world where aging at home is supported by
                  comprehensive education, accessible resources, and a community
                  that values the dignity and independence of every individual.
                </p>
                <p className="mb-4">
                  Through our programs, we aim to empower individuals and their
                  caregivers with the knowledge and tools necessary to navigate
                  the complexities of aging with confidence and grace.
                </p>
                <p>
                  We believe that with the right support, everyone can age in
                  place safely, comfortably, and with the quality of life they
                  deserve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and every decision we
              make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-sage-600" />
                      </div>
                      <div>
                        <h3 className="text-xl mb-2 text-gray-900">
                          {value.title}
                        </h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About the Foundation */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl mb-8 text-gray-900 text-center">
            About SageÉlan Foundation
          </h2>
          <div className="prose prose-lg text-gray-700 mx-auto">
            <p className="mb-6">
              SageÉlan Foundation, Inc. is dedicated to advancing education and
              support for individuals choosing to age in place. Our programs are
              designed to address the unique challenges and opportunities that
              come with aging at home.
            </p>
            <p className="mb-6">
              Through carefully developed educational initiatives, we provide
              evidence-informed resources for older adults, their families, and
              caregivers. Our approach emphasizes practical guidance,
              compassionate support, and respect for individual autonomy.
            </p>
            <p className="mb-6">
              The foundation works to bridge the gap between research and
              practice, ensuring that the latest knowledge in gerontology,
              caregiving, and home-based wellness is accessible and actionable
              for those who need it most.
            </p>
            <p>
              We are committed to supporting communities in creating
              environments where aging in place is not just possible, but
              fulfilling, where individuals can maintain their independence,
              dignity, and quality of life in the comfort of their own homes.
            </p>
            <p className="mt-8 text-center">
              <Button asChild variant="outline" className="border-sage-600 text-sage-700 hover:bg-sage-50">
                <a href={FOUNDATION_BOARD_URL} target="_blank" rel="noopener noreferrer">
                  Meet our Board of Directors
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </a>
              </Button>
            </p>
          </div>
        </div>
      </section>

      {/* Program Identity */}
      <section className="py-20 bg-sage-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            Why "Living in Place"?
          </h2>
          <p className="text-xl text-sage-50 leading-relaxed">
            We chose "Living in Place" as an updated, person-centered
            alternative to traditional terminology. This phrase recognizes that
            aging at home is not simply about staying put. It's about actively
            living, thriving, and maintaining wellbeing in a familiar and
            beloved environment. It's a celebration of choice, independence, and
            the ongoing journey of life.
          </p>
        </div>
      </section>
    </div>
  );
}
