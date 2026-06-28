/** Scoring helpers for /assessments self-check tools (0–3 points per question). */

export type AssessmentOption = { value: string; label: string; points: number };

export type AssessmentQuestion = {
  question: string;
  options: AssessmentOption[];
};

const POINTS_PER_QUESTION = 3;

export function maxPointsForQuestions(questionCount: number): number {
  return questionCount * POINTS_PER_QUESTION;
}

export function scoreAssessmentAnswers(
  questions: AssessmentQuestion[],
  answers: Record<number, string>,
): { total: number; max: number; percentage: number; answeredCount: number } {
  let total = 0;
  let answeredCount = 0;

  questions.forEach((q, index) => {
    const answer = answers[index];
    if (!answer) return;
    const option = q.options.find((opt) => opt.value === answer);
    if (!option) return;
    total += option.points;
    answeredCount += 1;
  });

  const max = maxPointsForQuestions(answeredCount);
  const percentage = max > 0 ? Math.round((total / max) * 100) : 0;

  return { total, max, percentage, answeredCount };
}

/** Progress through the questionnaire (0% on first question before advancing). */
export function assessmentProgressPercent(currentQuestionIndex: number, questionCount: number): number {
  if (questionCount <= 0) return 0;
  return Math.round((currentQuestionIndex / questionCount) * 100);
}

export function getAssessmentResultsBand(percentage: number): {
  level: string;
  color: string;
  bgColor: string;
  borderColor: string;
  message: string;
} {
  if (percentage >= 80) {
    return {
      level: "Excellent",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      message:
        "Great work! You're doing very well in this area. Continue to maintain these positive practices.",
    };
  }
  if (percentage >= 60) {
    return {
      level: "Good",
      color: "text-sage-600",
      bgColor: "bg-sage-50",
      borderColor: "border-sage-200",
      message:
        "You're on the right track. Consider reviewing the areas that scored lower and explore our resources for improvement.",
    };
  }
  if (percentage >= 40) {
    return {
      level: "Fair",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      message:
        "There are several areas that could benefit from attention. We recommend exploring our programs and resources to address these areas.",
    };
  }
  return {
    level: "Needs Attention",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    message:
      "Several important areas need attention. Please consider reaching out for support and reviewing our comprehensive resources.",
  };
}
