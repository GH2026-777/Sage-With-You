import { Link } from "react-router";
import { BRAND_ASSETS, SITE_BRAND_LABEL } from "../../lib/brand";

/** Matches footer column titles (`text-lg font-semibold leading-7`). */
export const FOOTER_HEADING_CLASS = "text-lg font-semibold leading-7";

type SiteLogoProps = {
  variant?: "header" | "footer" | "hero";
  className?: string;
  linkToHome?: boolean;
};

function LogoLockup({
  leafClass,
  titleClass,
  className = "",
}: {
  leafClass: string;
  titleClass: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 sm:gap-3 ${className}`.trim()}>
      <img src={BRAND_ASSETS.leaf} alt="" aria-hidden className={leafClass} />
      <img src={BRAND_ASSETS.titleTag} alt={SITE_BRAND_LABEL} className={titleClass} />
    </span>
  );
}

export function SiteLogo({
  variant = "header",
  className = "",
  linkToHome = true,
}: SiteLogoProps) {
  const mark =
    variant === "header" ? (
      <LogoLockup
        leafClass="h-9 w-auto sm:h-14 md:h-16"
        titleClass="h-8 w-auto sm:h-12 md:h-14"
        className={className}
      />
    ) : variant === "footer" ? (
      <LogoLockup
        leafClass="h-10 w-auto sm:h-11"
        titleClass="h-9 w-auto sm:h-10"
        className={className}
      />
    ) : (
      <img
        src={BRAND_ASSETS.full}
        alt={SITE_BRAND_LABEL}
        className={`h-28 w-auto sm:h-36 md:h-40 ${className}`.trim()}
      />
    );

  if (!linkToHome) return mark;

  return (
    <Link to="/" className="inline-flex shrink-0 rounded-sm focus-visible:ring-2 focus-visible:ring-sage-600">
      {mark}
    </Link>
  );
}
