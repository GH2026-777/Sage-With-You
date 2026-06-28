import { describe, expect, it } from "vitest";
import {
  computeBadgeScoring,
  computeCompositeScore,
  detectFloorViolations,
  levelFromComposite,
  PILLAR_KEYS,
  wpeMeetsPublicationThreshold,
  type PillarScoreInput,
} from "./badgeScoring";

function allPillars(scores: Partial<Record<string, number>>): PillarScoreInput[] {
  const keys = [
    "accessibility",
    "safety_environment",
    "communication_transparency",
    "dignity_autonomy",
    "continuity_of_support",
    "caregiver_access_supportability",
    "technology_ease_of_use",
  ] as const;

  return keys.map((pillar_key) => ({
    pillar_key,
    score: scores[pillar_key] ?? 4,
    is_na: false,
  }));
}

describe("badgeScoring", () => {
  it("computes equal-weight composite rounded to one decimal", () => {
    const pillars = allPillars({
      accessibility: 4,
      safety_environment: 4,
      communication_transparency: 4,
      dignity_autonomy: 4,
      continuity_of_support: 4,
      caregiver_access_supportability: 4,
      technology_ease_of_use: 3,
    });
    expect(computeCompositeScore(pillars)).toBe(3.9);
  });

  it("excludes N/A pillars from composite", () => {
    const pillars: PillarScoreInput[] = PILLAR_KEYS.map((pillar_key, index) =>
      index === 2
        ? { pillar_key, score: null, is_na: true }
        : { pillar_key, score: 5, is_na: false },
    );
    expect(computeCompositeScore(pillars)).toBe(5);
  });

  it("maps composite to certification bands", () => {
    expect(levelFromComposite(2.0)).toBe("limited");
    expect(levelFromComposite(2.8)).toBe("emerging");
    expect(levelFromComposite(3.5)).toBe("ready");
    expect(levelFromComposite(4.2)).toBe("trusted");
    expect(levelFromComposite(4.7)).toBe("exceptional");
  });

  it("flags safety and dignity floor violations", () => {
    const pillars = allPillars({ safety_environment: 3, dignity_autonomy: 4 });
    const violations = detectFloorViolations(pillars);
    expect(violations.some((v) => v.includes("safety_environment"))).toBe(true);
  });

  it("caps ready-level composite to emerging when any pillar <= 2", () => {
    const pillars = allPillars({ accessibility: 2 });
    const result = computeBadgeScoring({ pillars });
    expect(result.base_level).toBe("emerging");
    expect(result.is_publicly_verified).toBe(false);
  });

  it("requires WPE n>=15 and unique submitters for publication threshold", () => {
    expect(wpeMeetsPublicationThreshold({ approved_count: 14, unique_submitter_count: 10 })).toBe(
      false,
    );
    expect(wpeMeetsPublicationThreshold({ approved_count: 15, unique_submitter_count: 9 })).toBe(
      false,
    );
    expect(wpeMeetsPublicationThreshold({ approved_count: 15, unique_submitter_count: 10 })).toBe(
      true,
    );
  });

  it("promotes ready to trusted when WPE thresholds met", () => {
    const pillars = allPillars({
      accessibility: 3,
      safety_environment: 4,
      communication_transparency: 4,
      dignity_autonomy: 4,
      continuity_of_support: 4,
      caregiver_access_supportability: 4,
      technology_ease_of_use: 3,
    });
    const result = computeBadgeScoring({
      pillars,
      wpe: {
        approved_count: 20,
        unique_submitter_count: 12,
        overall_avg: 4.3,
        supports_living_in_place_pct: 75,
        caregiver_easy_pct: 50,
      },
    });
    expect(result.base_level).toBe("ready");
    expect(result.effective_level).toBe("trusted");
    expect(result.wpe_adjusted_level).toBe("trusted");
  });
});
