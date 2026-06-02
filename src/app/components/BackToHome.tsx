import { useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import type { ComponentProps } from "react";

function previousPathname(): string {
  const raw = sessionStorage.getItem("swy_prev_path") ?? "";
  return raw.split("?")[0] || "";
}

function canUseHistoryBack(): boolean {
  const idx = window.history.state?.idx;
  return typeof idx === "number" && idx > 0;
}

/** Returns to home hero, or one step back when the user arrived from another page on this site. */
export function useBackToHome(preferHistoryBack = true) {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    const prev = previousPathname();
    const fromAnotherPage =
      preferHistoryBack &&
      prev &&
      prev !== "/" &&
      prev !== location.pathname &&
      canUseHistoryBack();

    if (fromAnotherPage) {
      navigate(-1);
      return;
    }

    navigate("/");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  };
}

type BackToHomeButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  label?: string;
  /** When false, always goes to the home hero (e.g. legal pages). */
  preferHistoryBack?: boolean;
};

export function BackToHomeButton({
  label = "Back to home",
  variant = "outline",
  preferHistoryBack = true,
  ...props
}: BackToHomeButtonProps) {
  const goBack = useBackToHome(preferHistoryBack);

  return (
    <Button type="button" variant={variant} onClick={goBack} {...props}>
      {label}
    </Button>
  );
}

type BackToHomeLinkProps = {
  className?: string;
  children?: React.ReactNode;
  preferHistoryBack?: boolean;
};

export function BackToHomeLink({
  className = "text-sage-700 hover:underline",
  children = "← Back to home",
  preferHistoryBack = true,
}: BackToHomeLinkProps) {
  const goBack = useBackToHome(preferHistoryBack);

  return (
    <a
      href="/"
      onClick={(e) => {
        e.preventDefault();
        goBack();
      }}
      className={className}
    >
      {children}
    </a>
  );
}
