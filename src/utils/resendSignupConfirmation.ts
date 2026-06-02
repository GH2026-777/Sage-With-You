import { supabase } from "./supabase";
import { authEmailRedirect } from "./authRedirect";
import { authErrorMessage } from "./authErrorMessage";

/** Resend the sign-up confirmation email (requires Confirm email enabled in Supabase). */
export async function resendSignupConfirmation(email: string): Promise<{
  ok: boolean;
  message: string;
}> {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: {
      emailRedirectTo: authEmailRedirect("/login"),
    },
  });

  if (error) {
    return {
      ok: false,
      message: authErrorMessage(
        error,
        "Could not resend the confirmation email. Please try again in a few minutes.",
      ),
    };
  }

  return {
    ok: true,
    message: "Confirmation email sent. Check your inbox and spam folder, then sign in.",
  };
}
