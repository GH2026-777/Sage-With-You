import { isAuthError } from "@supabase/auth-js";
import { supabase } from "./supabase";

/** Stale local session after user delete, password change, or heavy auth testing. */
export function isInvalidRefreshTokenError(error: unknown): boolean {
  if (!isAuthError(error)) {
    const msg =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "";
    return msg.toLowerCase().includes("refresh token");
  }
  const code = "code" in error && typeof error.code === "string" ? error.code : "";
  if (code === "refresh_token_not_found") return true;
  return error.message?.toLowerCase().includes("refresh token") ?? false;
}

/** Remove broken auth data from this browser only (does not call sign-up email). */
export async function clearStaleSupabaseSession(): Promise<void> {
  await supabase.auth.signOut({ scope: "local" });
}

/**
 * On load: drop invalid refresh tokens so sign-up / sign-in are not blocked.
 * Safe to call on every visit.
 */
export async function initSupabaseAuth(): Promise<void> {
  const { error: sessionError } = await supabase.auth.getSession();
  if (sessionError && isInvalidRefreshTokenError(sessionError)) {
    await clearStaleSupabaseSession();
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { error: userError } = await supabase.auth.getUser();
  if (userError && isInvalidRefreshTokenError(userError)) {
    await clearStaleSupabaseSession();
  }
}
