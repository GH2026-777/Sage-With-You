/** Sage Badge shared types and display helpers (charter v1.0). */

export type BadgeLevel =
  | "limited"
  | "emerging"
  | "ready"
  | "trusted"
  | "exceptional";

export type BadgeCompanyPublic = {
  id: string;
  slug: string;
  display_name: string;
  website_url: string | null;
  description: string | null;
  logo_storage_path: string | null;
  service_type_label: string;
  effective_level: BadgeLevel | null;
  composite_score: number | null;
  pillar_scores: Record<string, number | null> | null;
  charter_version: string | null;
  certified_at: string | null;
  next_review_due: string | null;
};

export type BadgeWpeAggregate = {
  company_id: string;
  approved_count: number;
  unique_submitter_count?: number;
  overall_avg: number | null;
  supports_living_in_place_pct: number | null;
  caregiver_easy_pct: number | null;
  technology_avg: number | null;
};

export type BadgeServiceType = {
  id: string;
  label: string;
  sort_order: number;
};

export type BadgeBarrierType = {
  id: string;
  label: string;
  sort_order: number;
};

export const PILLAR_LABELS: Record<string, string> = {
  accessibility: "Accessibility",
  safety_environment: "Safety & Environment",
  communication_transparency: "Communication & Transparency",
  dignity_autonomy: "Dignity & Autonomy",
  continuity_of_support: "Continuity of Support",
  caregiver_access_supportability: "Caregiver Access & Supportability",
  technology_ease_of_use: "Technology & Ease of Use",
};

export const LEVEL_DISPLAY: Record<
  BadgeLevel,
  { label: string; verified: boolean; className: string }
> = {
  limited: { label: "Limited", verified: false, className: "bg-gray-100 text-gray-700" },
  emerging: { label: "Emerging", verified: false, className: "bg-amber-50 text-amber-900" },
  ready: { label: "Sage Verified: Ready", verified: true, className: "bg-sage-100 text-sage-900" },
  trusted: { label: "Sage Verified: Trusted", verified: true, className: "bg-sage-600 text-white" },
  exceptional: {
    label: "Sage Verified: Exceptional",
    verified: true,
    className: "bg-sage-800 text-white",
  },
};

export const INQUIRY_TYPE_OPTIONS = [
  {
    value: "sage_verified_assessment",
    label: "Sage Verified assessment",
    description: "Formal Sage Standard evaluation and public badge if Ready or above.",
  },
  {
    value: "sage_panthers_consulting",
    label: "Sage Insight Panel (Sage Panthers)",
    description: "Senior-informed feedback sessions before or alongside assessment.",
  },
  {
    value: "beta_testing",
    label: "Living in Place beta cohort",
    description: "Structured beta testing with matched Sage Panthers participants.",
  },
  {
    value: "improvement_pathway",
    label: "Improvement pathway",
    description: "Already assessed. Help closing pillar gaps.",
  },
  { value: "general", label: "General question", description: "Other organization inquiries." },
] as const;

export type InquiryType = (typeof INQUIRY_TYPE_OPTIONS)[number]["value"];

export const BADGE_EMPTY = "N/A";

export function formatCertDate(iso: string | null | undefined): string {
  if (!iso) return BADGE_EMPTY;
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const WPE_SUPPORTS_LABELS: Record<string, string> = {
  yes: "Yes",
  somewhat: "Somewhat",
  no: "No",
};

export const WPE_CAREGIVER_LABELS: Record<string, string> = {
  easy: "Easy for caregivers",
  difficult: "Difficult",
  not_possible: "Not possible",
};

export const WPE_ROLE_LABELS: Record<string, string> = {
  user: "Person using services",
  caregiver: "Caregiver / family",
  professional: "Professional advisor",
};

export const DEMO_COMPANY_SLUG = "sage-demo-home-care";

/** Optional website field: accept example.com; store with https:// for staff. */
export function normalizeOptionalWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}
