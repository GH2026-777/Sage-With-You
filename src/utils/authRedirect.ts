/** Where Supabase should send users after email confirmation or password reset. */
export function authEmailRedirect(
  path: "/login" | "/reset-password" = "/login",
): string | undefined {
  if (typeof window === "undefined") return undefined;

  const fromEnv = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "");
  const origin = fromEnv || window.location.origin;
  return `${origin}${path}`;
}
