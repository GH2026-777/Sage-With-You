import { isAuthError } from "@supabase/auth-js";

const CODE_MESSAGES: Record<string, string> = {
  user_already_exists:
    "An account with this email already exists. Try signing in or reset your password.",
  email_exists:
    "An account with this email already exists. Try signing in or reset your password.",
  signup_disabled: "New sign-ups are not enabled right now. Please contact us for help.",
  weak_password: "Choose a stronger password (at least 8 characters).",
  hook_timeout:
    "Sign-up timed out while sending email. Try Sign in. Your account may already exist. If this keeps happening, wait a few minutes and try again.",
  over_email_send_rate_limit:
    "This site has reached its hourly limit for confirmation emails. Please wait about an hour and try again, or contact us if you need help right away.",
  over_request_rate_limit:
    "Too many sign-up attempts from this network. Wait a few minutes and try again.",
  validation_failed: "Please check your email and password and try again.",
  email_not_confirmed:
    "Please confirm your email before signing in. Use the link we sent you, or resend the confirmation email below.",
  refresh_token_not_found:
    "Your browser had an old sign-in session. Please try again.",
};

export function isEmailNotConfirmed(error: unknown): boolean {
  if (!isAuthError(error)) {
    const msg =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "";
    return msg.toLowerCase().includes("email not confirmed");
  }
  const code = "code" in error && typeof error.code === "string" ? error.code : "";
  if (code === "email_not_confirmed") return true;
  return error.message?.toLowerCase().includes("email not confirmed") ?? false;
}

const TECHNICAL_MESSAGE_PATTERN =
  /supabase|postgres|jwt|refresh.?token|edge function|migration|rls|badge_staff|sql editor|cookie_consent|vite_|localstorage|rpc\b|anon key|service role|functions\.invoke/i;

/** True when a string looks like a developer or infrastructure message, not for end users. */
export function isTechnicalUserMessage(msg: string): boolean {
  return TECHNICAL_MESSAGE_PATTERN.test(msg);
}

/** Prefer a server message only when it is safe to show visitors. */
export function userFacingMessage(
  preferred: string | null | undefined,
  fallback: string,
): string {
  const trimmed = preferred?.trim();
  if (trimmed && trimmed !== "{}" && !isTechnicalUserMessage(trimmed)) {
    return trimmed;
  }
  return fallback;
}

/** Turn Supabase auth errors into visitor-friendly text (avoids blank "{}" messages). */
export function authErrorMessage(error: unknown, fallback: string): string {
  if (!error) return fallback;

  if (typeof error === "string" && error.trim() && error !== "{}") {
    return userFacingMessage(error, fallback);
  }

  if (isAuthError(error)) {
    const code = "code" in error && typeof error.code === "string" ? error.code : "";
    if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];

    const msg = error.message?.trim();
    if (msg && msg !== "{}") return userFacingMessage(msg, fallback);

    const status = "status" in error && typeof error.status === "number" ? error.status : 0;
    if (status === 504 || status === 503 || status === 502) {
      return "Sign-up timed out while sending your confirmation email. Your account may still have been created. Check your inbox, or try signing in. If this keeps happening, email support through our contact page.";
    }
    if (status === 0) {
      return "Could not reach the server. Check your internet connection and try again.";
    }
  }

  if (error instanceof Error) {
    const msg = error.message?.trim();
    if (msg && msg !== "{}") return userFacingMessage(msg, fallback);
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    for (const key of ["message", "msg", "error_description", "error"] as const) {
      const value = record[key];
      if (typeof value === "string" && value.trim() && value !== "{}") {
        return userFacingMessage(value, fallback);
      }
    }
    if (typeof record.code === "string" && CODE_MESSAGES[record.code]) {
      return CODE_MESSAGES[record.code];
    }
  }

  return fallback;
}

export function isExistingUserSignup(data: {
  user: { identities?: unknown[] } | null;
}): boolean {
  const identities = data.user?.identities;
  return Array.isArray(identities) && identities.length === 0;
}

/** Sign-up failed because Supabase could not send the confirmation email in time. */
export function isAuthEmailTimeout(error: unknown): boolean {
  if (!isAuthError(error)) return false;
  const status = "status" in error && typeof error.status === "number" ? error.status : 0;
  return status === 504 || status === 503 || status === 502;
}
