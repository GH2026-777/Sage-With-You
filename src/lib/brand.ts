/** Official tagline from brand assets */
export const SITE_TAGLINE = "Living in Place & Senior Care";

export const SITE_BRAND_LABEL = `Sage With You, ${SITE_TAGLINE}`;

export const BRAND_COLORS = {
  deep: "#3C5E74",
  primary: "#4E83AA",
  mist: "#D0E5F2",
  sky: "#68A3C9",
  ink: "#10191F",
  neutral: "#919191",
} as const;

export const SAGE_PALETTE = BRAND_COLORS;
export const SAGE_THEME_COLOR = BRAND_COLORS.primary;

/** Three PNGs in public/brand/ - your filenames, unchanged. */
export const BRAND_ASSETS = {
  leaf: "/brand/LogoImage.png",
  titleTag: "/brand/TitleTag2.png",
  full: "/brand/FullLogo.png",
} as const;
