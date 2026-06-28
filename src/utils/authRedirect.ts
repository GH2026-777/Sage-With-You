/** Where Supabase sends users after email confirmation or password reset (same as Sage Panthers). */
export function authEmailRedirect(
  path: "/login" | "/reset-password" = "/login",
): string | undefined {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}${path}`;
}
