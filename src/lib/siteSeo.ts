/** Canonical site origin for OG URLs and sitemap (no trailing slash). */
export function siteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "https://sage-with-you.org";
}

/** Absolute URL for default social preview image (`public/og-image.png`). */
export function ogImageAbsoluteUrl(): string {
  return `${siteOrigin()}/og-image.png`;
}

export type SeoEntry = {
  title: string;
  description: string;
  /** When true, ask crawlers not to index (e.g. staging). */
  noindex?: boolean;
};

const DEFAULT: SeoEntry = {
  title: "Sage With You",
  description:
    "Evidence-informed guidance for aging in place, caregivers, and home wellbeing — Sage With You by SageÉlan Foundation.",
};

/** Longest paths first for prefix matching where needed. */
const ROUTE_SEO: { prefix: string; entry: SeoEntry }[] = [
  { prefix: "/reset-password", entry: { title: "Reset password", description: "Set a new password for your Sage With You account.", noindex: true } },
  { prefix: "/forgot-password", entry: { title: "Forgot password", description: "Request a password reset link for Sage With You.", noindex: true } },
  { prefix: "/join", entry: { title: "Create account", description: "Join Sage With You to save preferences and access account tools.", noindex: true } },
  { prefix: "/login", entry: { title: "Sign in", description: "Sign in to your Sage With You account.", noindex: true } },
  { prefix: "/account", entry: { title: "Account", description: "Profile, privacy, email preferences, and security for Sage With You.", noindex: true } },
  { prefix: "/library", entry: { title: "Resource library", description: "Guides, checklists, videos, and articles for living in place." } },
  { prefix: "/assessments", entry: { title: "Assessments", description: "Wellbeing and readiness tools to support your aging-in-place journey." } },
  { prefix: "/contact", entry: { title: "Contact", description: "Reach Sage With You / SageÉlan Foundation with questions or partnership ideas." } },
  { prefix: "/resources", entry: { title: "Resources", description: "Programs, links, and materials that complement Sage With You." } },
  { prefix: "/programs", entry: { title: "Programs", description: "Sage With You programs supporting dignity and confidence at home." } },
  { prefix: "/about", entry: { title: "About", description: "Mission, values, and the story behind Sage With You." } },
  { prefix: "/privacy", entry: { title: "Privacy policy", description: "How Sage With You collects, uses, and protects your information." } },
  { prefix: "/terms", entry: { title: "Terms of Service", description: "Terms and conditions for using Sage With You." } },
  { prefix: "/person-centered-care", entry: { title: "Person-centered care", description: "Principles and practices for respectful, individualized support." } },
  { prefix: "/caregiver-support", entry: { title: "Caregiver support", description: "Resources and encouragement for family and professional caregivers." } },
  { prefix: "/educational-resources", entry: { title: "Educational resources", description: "Learning materials related to aging in place and wellbeing." } },
  { prefix: "/living-in-place", entry: { title: "Living in place", description: "What it means to age safely and confidently at home." } },
  { prefix: "/smart-home-technology", entry: { title: "Smart home technology", description: "Technology considerations for safer, more supportive homes." } },
  { prefix: "/accessibility-features", entry: { title: "Accessibility", description: "Accessibility features and inclusion on Sage With You." } },
];

export function getSeoForPath(pathname: string): SeoEntry {
  const path = pathname.split("?")[0] || "/";
  if (path === "/") return DEFAULT;
  const hit = ROUTE_SEO.find((r) => path === r.prefix || path.startsWith(`${r.prefix}/`));
  if (hit) return hit.entry;
  return {
    title: "Page not found",
    description: "The page you requested is not available on Sage With You.",
    noindex: true,
  };
}

export function fullTitle(pageTitle: string): string {
  if (pageTitle === DEFAULT.title) return `${DEFAULT.title} | Living in place`;
  return `${pageTitle} | Sage With You`;
}
