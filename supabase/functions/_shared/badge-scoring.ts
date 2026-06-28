/**
 * Sage Badge scoring (Charter v1.0) for Edge Functions.
 * Keep in sync with src/lib/badgeScoring.ts
 */

export type BadgeLevel =
  | "limited"
  | "emerging"
  | "ready"
  | "trusted"
  | "exceptional";

export const CHARTER_VERSION = "1.0";

export const PILLAR_KEYS = [
  "accessibility",
  "safety_environment",
  "communication_transparency",
  "dignity_autonomy",
  "continuity_of_support",
  "caregiver_access_supportability",
  "technology_ease_of_use",
] as const;

export type PillarKey = (typeof PILLAR_KEYS)[number];

export const WPE_PUBLISH_MIN_APPROVED = 15;
export const WPE_PUBLISH_MIN_UNIQUE_SUBMITTERS = 10;

export type PillarScoreInput = {
  pillar_key: PillarKey;
  score: number | null;
  is_na: boolean;
};

export type WpeStats = {
  approved_count: number;
  unique_submitter_count: number;
  overall_avg: number | null;
  supports_living_in_place_pct: number | null;
  caregiver_easy_pct: number | null;
};

export type ScoringResult = {
  composite_score: number;
  base_level: BadgeLevel;
  effective_level: BadgeLevel;
  wpe_adjusted_level: BadgeLevel | null;
  floor_violations: string[];
  is_publicly_verified: boolean;
  pillar_scores: Record<string, number | null>;
};

const LEVEL_ORDER: BadgeLevel[] = ["limited", "emerging", "ready", "trusted", "exceptional"];

function levelIndex(level: BadgeLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

export function wpeMeetsPublicationThreshold(wpe: {
  approved_count: number;
  unique_submitter_count: number;
}): boolean {
  return (
    wpe.approved_count >= WPE_PUBLISH_MIN_APPROVED &&
    wpe.unique_submitter_count >= WPE_PUBLISH_MIN_UNIQUE_SUBMITTERS
  );
}

export function computeCompositeScore(
  pillars: PillarScoreInput[],
  weightOverrides: Record<string, number> = {},
): number {
  let weightedSum = 0;
  let weightTotal = 0;

  for (const pillar of pillars) {
    if (pillar.is_na || pillar.score === null) continue;
    const weight = weightOverrides[pillar.pillar_key] ?? 1;
    weightedSum += pillar.score * weight;
    weightTotal += weight;
  }

  if (weightTotal === 0) return 0;
  return Math.round((weightedSum / weightTotal) * 10) / 10;
}

export function levelFromComposite(composite: number): BadgeLevel {
  if (composite >= 4.5) return "exceptional";
  if (composite >= 4.0) return "trusted";
  if (composite >= 3.3) return "ready";
  if (composite >= 2.5) return "emerging";
  return "limited";
}

export function detectFloorViolations(pillars: PillarScoreInput[]): string[] {
  const violations: string[] = [];

  for (const pillar of pillars) {
    if (pillar.is_na || pillar.score === null) continue;
    if (pillar.score <= 2) {
      violations.push(`${pillar.pillar_key}: score <= 2`);
    }
  }

  const safety = pillars.find((p) => p.pillar_key === "safety_environment");
  if (safety && !safety.is_na && safety.score !== null && safety.score <= 3) {
    violations.push("safety_environment: score <= 3");
  }

  const dignity = pillars.find((p) => p.pillar_key === "dignity_autonomy");
  if (dignity && !dignity.is_na && dignity.score !== null && dignity.score <= 3) {
    violations.push("dignity_autonomy: score <= 3");
  }

  return violations;
}

export function applyFloorCap(baseLevel: BadgeLevel, floorViolations: string[]): BadgeLevel {
  if (floorViolations.length === 0) return baseLevel;
  if (levelIndex(baseLevel) >= levelIndex("ready")) return "emerging";
  return baseLevel;
}

export function isPubliclyVerifiedLevel(level: BadgeLevel): boolean {
  return level === "ready" || level === "trusted" || level === "exceptional";
}

function applyWpeLevelAdjustment(
  baseLevel: BadgeLevel,
  composite: number,
  floorViolations: string[],
  wpe: WpeStats | null,
): { effective_level: BadgeLevel; wpe_adjusted_level: BadgeLevel | null } {
  if (!wpe || floorViolations.length > 0 || !wpeMeetsPublicationThreshold(wpe)) {
    return { effective_level: baseLevel, wpe_adjusted_level: null };
  }

  let adjusted = baseLevel;

  const canPromoteReadyToTrusted =
    composite >= 3.3 &&
    levelIndex(baseLevel) >= levelIndex("ready") &&
    levelIndex(baseLevel) < levelIndex("trusted") &&
    wpe.overall_avg !== null &&
    wpe.overall_avg >= 4.2 &&
    wpe.supports_living_in_place_pct !== null &&
    wpe.supports_living_in_place_pct >= 70;

  if (canPromoteReadyToTrusted) {
    adjusted = "trusted";
  }

  const canPromoteTrustedToExceptional =
    composite >= 4.0 &&
    levelIndex(baseLevel) >= levelIndex("trusted") &&
    wpe.overall_avg !== null &&
    wpe.overall_avg >= 4.6 &&
    wpe.supports_living_in_place_pct !== null &&
    wpe.supports_living_in_place_pct >= 85 &&
    wpe.caregiver_easy_pct !== null &&
    wpe.caregiver_easy_pct >= 60;

  if (canPromoteTrustedToExceptional) {
    adjusted = "exceptional";
  }

  return {
    effective_level: adjusted,
    wpe_adjusted_level: adjusted !== baseLevel ? adjusted : null,
  };
}

export function pillarScoresRecord(pillars: PillarScoreInput[]): Record<string, number | null> {
  return Object.fromEntries(
    PILLAR_KEYS.map((key) => {
      const row = pillars.find((p) => p.pillar_key === key);
      if (!row || row.is_na) return [key, null];
      return [key, row.score];
    }),
  );
}

export function computeBadgeScoring(input: {
  pillars: PillarScoreInput[];
  weightOverrides?: Record<string, number>;
  wpe?: WpeStats | null;
}): ScoringResult {
  const composite_score = computeCompositeScore(input.pillars, input.weightOverrides ?? {});
  const rawLevel = levelFromComposite(composite_score);
  const floor_violations = detectFloorViolations(input.pillars);
  const base_level = applyFloorCap(rawLevel, floor_violations);
  const wpeResult = applyWpeLevelAdjustment(
    base_level,
    composite_score,
    floor_violations,
    input.wpe ?? null,
  );

  return {
    composite_score,
    base_level,
    effective_level: wpeResult.effective_level,
    wpe_adjusted_level: wpeResult.wpe_adjusted_level,
    floor_violations,
    is_publicly_verified: isPubliclyVerifiedLevel(wpeResult.effective_level),
    pillar_scores: pillarScoresRecord(input.pillars),
  };
}

export function computeNextReviewDue(level: BadgeLevel, assessedAt: Date = new Date()): Date {
  const months = level === "trusted" || level === "exceptional" ? 24 : 12;
  const due = new Date(assessedAt);
  due.setMonth(due.getMonth() + months);
  return due;
}
