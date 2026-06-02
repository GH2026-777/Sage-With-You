import { useState } from "react";
import { ClipboardCheck, Heart, Home, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";

type Assessment = "none" | "home-safety" | "caregiver" | "readiness";

export function Assessments() {
  const [activeAssessment, setActiveAssessment] = useState<Assessment>("none");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const assessments = [
    {
      id: "home-safety" as Assessment,
      icon: Home,
      title: "Home Safety Assessment",
      description:
        "Evaluate your home environment for potential safety hazards and identify areas for improvement.",
      duration: "5-7 minutes",
      questions: [
        {
          question: "Are all walkways and hallways well-lit and free of clutter?",
          options: [
            { value: "yes", label: "Yes, completely clear", points: 3 },
            { value: "mostly", label: "Mostly clear", points: 2 },
            { value: "some", label: "Some clutter present", points: 1 },
            { value: "no", label: "No, significant clutter", points: 0 },
          ],
        },
        {
          question: "Are there grab bars installed in bathrooms near toilets and in showers/tubs?",
          options: [
            { value: "yes", label: "Yes, in all necessary locations", points: 3 },
            { value: "some", label: "In some locations", points: 2 },
            { value: "planned", label: "Not yet, but planned", points: 1 },
            { value: "no", label: "No grab bars installed", points: 0 },
          ],
        },
        {
          question: "Are stairs equipped with secure handrails on both sides?",
          options: [
            { value: "yes", label: "Yes, both sides", points: 3 },
            { value: "one", label: "One side only", points: 2 },
            { value: "no-stairs", label: "No stairs in home", points: 3 },
            { value: "none", label: "No handrails", points: 0 },
          ],
        },
        {
          question: "Are rugs and carpets secured to prevent slipping or tripping?",
          options: [
            { value: "yes", label: "Yes, all secured or removed", points: 3 },
            { value: "mostly", label: "Most are secured", points: 2 },
            { value: "some", label: "Some are loose", points: 1 },
            { value: "no", label: "Many loose rugs present", points: 0 },
          ],
        },
        {
          question: "Is there adequate lighting in all areas, especially at night?",
          options: [
            { value: "yes", label: "Yes, excellent lighting", points: 3 },
            { value: "good", label: "Generally good", points: 2 },
            { value: "fair", label: "Fair, could improve", points: 1 },
            { value: "poor", label: "Poor lighting", points: 0 },
          ],
        },
        {
          question: "Are emergency phone numbers posted in visible locations?",
          options: [
            { value: "yes", label: "Yes, clearly posted", points: 3 },
            { value: "some", label: "Posted in some areas", points: 2 },
            { value: "planned", label: "Not yet, but planned", points: 1 },
            { value: "no", label: "Not posted", points: 0 },
          ],
        },
      ],
    },
    {
      id: "caregiver" as Assessment,
      icon: Heart,
      title: "Caregiver Wellness Check",
      description:
        "Assess your own wellbeing as a caregiver and identify areas where you may need additional support.",
      duration: "5-7 minutes",
      questions: [
        {
          question: "How often do you feel overwhelmed by your caregiving responsibilities?",
          options: [
            { value: "rarely", label: "Rarely or never", points: 3 },
            { value: "sometimes", label: "Sometimes", points: 2 },
            { value: "often", label: "Often", points: 1 },
            { value: "always", label: "Almost always", points: 0 },
          ],
        },
        {
          question: "Do you take regular breaks and time for yourself?",
          options: [
            { value: "yes", label: "Yes, regularly", points: 3 },
            { value: "sometimes", label: "Sometimes", points: 2 },
            { value: "rarely", label: "Rarely", points: 1 },
            { value: "never", label: "Never or almost never", points: 0 },
          ],
        },
        {
          question: "How well are you sleeping?",
          options: [
            { value: "well", label: "Very well, 7+ hours", points: 3 },
            { value: "ok", label: "Fairly well, 5-7 hours", points: 2 },
            { value: "poor", label: "Poorly, less than 5 hours", points: 1 },
            { value: "very-poor", label: "Very poorly, frequent disruptions", points: 0 },
          ],
        },
        {
          question: "Do you have a support network (family, friends, support groups)?",
          options: [
            { value: "strong", label: "Yes, strong support network", points: 3 },
            { value: "some", label: "Some support available", points: 2 },
            { value: "limited", label: "Limited support", points: 1 },
            { value: "none", label: "Little to no support", points: 0 },
          ],
        },
        {
          question: "How is your physical health?",
          options: [
            { value: "excellent", label: "Excellent", points: 3 },
            { value: "good", label: "Good", points: 2 },
            { value: "fair", label: "Fair, some concerns", points: 1 },
            { value: "poor", label: "Poor, significant concerns", points: 0 },
          ],
        },
        {
          question: "Do you feel you have the knowledge and resources to provide care effectively?",
          options: [
            { value: "yes", label: "Yes, very confident", points: 3 },
            { value: "mostly", label: "Mostly confident", points: 2 },
            { value: "somewhat", label: "Somewhat unsure", points: 1 },
            { value: "no", label: "Often feel unprepared", points: 0 },
          ],
        },
      ],
    },
    {
      id: "readiness" as Assessment,
      icon: ClipboardCheck,
      title: "Living in Place Readiness",
      description:
        "Determine how prepared you or your loved one is for aging in place and what areas may need attention.",
      duration: "5-7 minutes",
      questions: [
        {
          question: "Has a healthcare provider been consulted about aging in place?",
          options: [
            { value: "yes", label: "Yes, comprehensive discussion", points: 3 },
            { value: "briefly", label: "Briefly mentioned", points: 2 },
            { value: "planned", label: "Planning to discuss", points: 1 },
            { value: "no", label: "Not yet discussed", points: 0 },
          ],
        },
        {
          question: "Are financial resources and budgets in place for potential home modifications and care?",
          options: [
            { value: "yes", label: "Yes, well planned", points: 3 },
            { value: "some", label: "Some planning done", points: 2 },
            { value: "started", label: "Just getting started", points: 1 },
            { value: "no", label: "Not yet addressed", points: 0 },
          ],
        },
        {
          question: "Is there a plan for emergency situations and medical crises?",
          options: [
            { value: "yes", label: "Yes, detailed plan in place", points: 3 },
            { value: "basic", label: "Basic plan exists", points: 2 },
            { value: "thinking", label: "Thinking about it", points: 1 },
            { value: "no", label: "No plan yet", points: 0 },
          ],
        },
        {
          question: "Are family members or support persons aware of and aligned with the plan?",
          options: [
            { value: "yes", label: "Yes, everyone is informed", points: 3 },
            { value: "mostly", label: "Most are informed", points: 2 },
            { value: "some", label: "Some know, others don't", points: 1 },
            { value: "no", label: "Not yet discussed widely", points: 0 },
          ],
        },
        {
          question: "Have you researched local community resources and services?",
          options: [
            { value: "yes", label: "Yes, comprehensive research", points: 3 },
            { value: "some", label: "Some research done", points: 2 },
            { value: "started", label: "Just getting started", points: 1 },
            { value: "no", label: "Not yet researched", points: 0 },
          ],
        },
        {
          question: "Is there a system for medication management and healthcare appointments?",
          options: [
            { value: "yes", label: "Yes, well organized", points: 3 },
            { value: "working", label: "Working on it", points: 2 },
            { value: "basic", label: "Basic system only", points: 1 },
            { value: "no", label: "No system in place", points: 0 },
          ],
        },
      ],
    },
  ];

  const currentAssessmentData = assessments.find(
    (a) => a.id === activeAssessment
  );

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (
      currentAssessmentData &&
      currentQuestion < currentAssessmentData.questions.length - 1
    ) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    if (!currentAssessmentData) return { total: 0, max: 0, percentage: 0 };

    let total = 0;
    const max = currentAssessmentData.questions.length * 3;

    currentAssessmentData.questions.forEach((q, index) => {
      const answer = answers[index];
      const option = q.options.find((opt) => opt.value === answer);
      if (option) {
        total += option.points;
      }
    });

    return {
      total,
      max,
      percentage: Math.round((total / max) * 100),
    };
  };

  const getResultsMessage = (percentage: number) => {
    if (percentage >= 80) {
      return {
        level: "Excellent",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        message:
          "Great work! You're doing very well in this area. Continue to maintain these positive practices.",
      };
    } else if (percentage >= 60) {
      return {
        level: "Good",
        color: "text-sage-600",
        bgColor: "bg-sage-50",
        borderColor: "border-sage-200",
        message:
          "You're on the right track. Consider reviewing the areas that scored lower and explore our resources for improvement.",
      };
    } else if (percentage >= 40) {
      return {
        level: "Fair",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        message:
          "There are several areas that could benefit from attention. We recommend exploring our programs and resources to address these areas.",
      };
    } else {
      return {
        level: "Needs Attention",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        message:
          "Several important areas need attention. Please consider reaching out for support and reviewing our comprehensive resources.",
      };
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setActiveAssessment("none");
  };

  if (activeAssessment === "none") {
    return (
      <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sage-50 to-sage-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl mb-6 text-gray-900">
                Self-Assessment Tools
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Use these interactive assessments to evaluate your situation and
                identify areas where additional support or resources may be
                helpful.
              </p>
            </div>
          </div>
        </section>

        {/* Assessment Cards */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {assessments.map((assessment) => {
                const Icon = assessment.icon;
                return (
                  <Card
                    key={assessment.id}
                    className="border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-sage-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">
                        {assessment.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {assessment.description}
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        <ClipboardCheck className="inline h-4 w-4 mr-1" />
                        {assessment.duration}
                      </p>
                      <Button
                        onClick={() => setActiveAssessment(assessment.id)}
                        className="w-full bg-sage-600 hover:bg-sage-700"
                      >
                        Start Assessment
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl mb-6 text-gray-900">
              Why Take an Assessment?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              These self-assessments provide valuable insights into your current
              situation and help identify areas that may benefit from additional
              attention or resources.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The results are private and can help guide your conversations with
              healthcare providers, family members, or our support team.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const results = getResultsMessage(score.percentage);

    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card className="border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900 mb-2">
                Assessment Results
              </CardTitle>
              <p className="text-gray-600">{currentAssessmentData?.title}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-sage-600 mb-2">
                  {score.percentage}%
                </div>
                <div className="text-xl text-gray-700">
                  {score.total} out of {score.max} points
                </div>
              </div>

              {/* Results Message */}
              <div
                className={`p-6 rounded-lg border ${results.bgColor} ${results.borderColor}`}
              >
                <h3 className={`text-xl font-semibold mb-2 ${results.color}`}>
                  {results.level}
                </h3>
                <p className="text-gray-700">{results.message}</p>
              </div>

              {/* Recommendations */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Next Steps
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-sage-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Review our Resources page for detailed guides and tools
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-sage-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Explore our Programs to find educational support
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-sage-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Consider sharing these results with healthcare providers
                      or family members
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-sage-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Contact us if you need personalized guidance
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={resetAssessment}
                  variant="outline"
                  className="flex-1"
                >
                  Take Another Assessment
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="flex-1 bg-sage-600 hover:bg-sage-700"
                >
                  Print Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Assessment in progress
  const progress =
    currentAssessmentData
      ? ((currentQuestion + 1) / currentAssessmentData.questions.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card className="border-gray-200">
          <CardHeader>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Question {currentQuestion + 1} of{" "}
                  {currentAssessmentData?.questions.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {currentAssessmentData?.questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentAssessmentData?.questions[currentQuestion].options.map(
                (option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-sage-50 hover:border-sage-300 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="flex-1 bg-sage-600 hover:bg-sage-700"
              >
                {currentAssessmentData &&
                currentQuestion ===
                  currentAssessmentData.questions.length - 1
                  ? "View Results"
                  : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
