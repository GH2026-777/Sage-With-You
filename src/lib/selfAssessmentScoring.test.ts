import { describe, expect, it } from "vitest";
import {
  assessmentProgressPercent,
  maxPointsForQuestions,
  scoreAssessmentAnswers,
} from "./selfAssessmentScoring";

const sampleQuestions = [
  {
    question: "Q1",
    options: [
      { value: "a", label: "Best", points: 3 },
      { value: "b", label: "Mid", points: 2 },
      { value: "c", label: "Low", points: 0 },
    ],
  },
  {
    question: "Q2",
    options: [
      { value: "a", label: "Best", points: 3 },
      { value: "b", label: "Mid", points: 2 },
    ],
  },
];

describe("scoreAssessmentAnswers", () => {
  it("scores only answered questions", () => {
    const result = scoreAssessmentAnswers(sampleQuestions, { 0: "a", 1: "b" });
    expect(result.total).toBe(5);
    expect(result.max).toBe(6);
    expect(result.answeredCount).toBe(2);
    expect(result.percentage).toBe(83);
  });

  it("returns zero when nothing answered", () => {
    const result = scoreAssessmentAnswers(sampleQuestions, {});
    expect(result.percentage).toBe(0);
    expect(result.max).toBe(0);
  });
});

describe("assessmentProgressPercent", () => {
  it("starts at 0 on the first question", () => {
    expect(assessmentProgressPercent(0, 6)).toBe(0);
  });

  it("reaches 83% on the last question of six", () => {
    expect(assessmentProgressPercent(5, 6)).toBe(83);
  });
});

describe("maxPointsForQuestions", () => {
  it("uses three points per question", () => {
    expect(maxPointsForQuestions(6)).toBe(18);
  });
});
