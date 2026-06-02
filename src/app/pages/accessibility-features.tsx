import { Settings, Type, Contrast, Volume2, Eye, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function AccessibilityFeatures() {
  const features = [
    {
      icon: Type,
      title: "Adjustable Text Size",
      description: "Increase or decrease text size from 75% to 150% to find the perfect reading comfort for your eyes.",
      howTo: "Use the slider in the accessibility widget to adjust text size in 25% increments.",
    },
    {
      icon: Contrast,
      title: "High Contrast Mode",
      description: "Switch to high contrast colors (black background, white/yellow text) for improved visibility and reduced eye strain.",
      howTo: "Toggle the high contrast switch to instantly transform the visual appearance of the entire site.",
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Have any text on the website read aloud to you using your device's built-in speech synthesis.",
      howTo: "Enable text-to-speech, then click on any text element to hear it spoken aloud.",
    },
  ];

  const benefits = [
    "Accommodates different vision capabilities and preferences",
    "Reduces eye strain during extended reading",
    "Helps users with low vision or reading difficulties",
    "Supports multiple learning styles (visual and auditory)",
    "Allows hands-free access to written content",
    "Settings persist throughout your browsing session",
    "Easy to reset to default settings anytime",
  ];

  const otherAccessibility = [
    {
      title: "Keyboard Navigation",
      description: "Navigate the entire website using only your keyboard with Tab, Enter, and arrow keys.",
    },
    {
      title: "Screen Reader Compatible",
      description: "All content is properly labeled for compatibility with screen reading software.",
    },
    {
      title: "Clear Content Structure",
      description: "Logical heading hierarchy and semantic HTML make content easy to navigate and understand.",
    },
    {
      title: "Alt Text for Images",
      description: "All images include descriptive alternative text for users who can't see them.",
    },
    {
      title: "Readable Fonts",
      description: "Clean, legible typography designed for optimal readability, especially for older adults.",
    },
    {
      title: "Consistent Navigation",
      description: "Predictable layout and navigation patterns make the site easy to learn and use.",
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
                  <Settings className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl text-gray-900">
                  Accessibility Features
                </h1>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                We believe everyone should be able to access our information comfortably. Our accessibility tools let you customize your experience to match your needs and preferences.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Look for the accessibility widget in the bottom-right corner of every page to adjust settings instantly.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1585244129648-5dc1f9cd9d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2Nlc3NpYmxlJTIwZGVzaWduJTIwZWxkZXJseSUyMHBlcnNvbnxlbnwxfHx8fDE3NzM4MDY4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Accessible design for elderly person"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Customizable Accessibility Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three powerful features to enhance your browsing experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-sage-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{feature.description}</p>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">How to use:</p>
                      <p className="text-sm text-gray-600">{feature.howTo}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Widget Demo Section */}
      <section className="py-20 bg-sage-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="h-8 w-8 text-sage-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl mb-6">
            Try the Accessibility Widget Now
          </h2>
          <p className="text-xl text-sage-50 leading-relaxed mb-8">
            Look for the floating button in the bottom-right corner of this page. Click it to open the accessibility panel and start customizing your experience right away.
          </p>
          <div className="bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg text-sage-50">
              The accessibility widget appears on every page of our website, so your preferences follow you wherever you navigate.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Why Accessibility Matters
            </h2>
            <p className="text-xl text-gray-600">
              The benefits of customizable accessibility features
            </p>
          </div>

          <Card className="border-gray-200 bg-white">
            <CardContent className="pt-8">
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-sage-600 flex-shrink-0 mt-1" />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Other Accessibility Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4 text-gray-900">
              Additional Accessibility Considerations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed the entire website with accessibility in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherAccessibility.map((item, index) => (
              <Card key={index} className="border-gray-200">
                <CardHeader>
                  <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center mb-3">
                    <Eye className="h-5 w-5 text-sage-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
            We Welcome Your Feedback
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            If you encounter any accessibility barriers or have suggestions for improvement, please let us know. We're committed to making our website as accessible as possible for everyone.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-sage-600 hover:bg-sage-700">
              Share Your Feedback
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6 text-gray-900">
            Explore Our Resources
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse our comprehensive library of accessible educational materials
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
