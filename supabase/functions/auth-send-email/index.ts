/**
 * Supabase Auth "Send Email" hook: confirmation + password reset via Office 365 SMTP
 * (same CONTACT_SMTP_* secrets as submit-contact). Keeps Confirm email ON without
 * using Supabase dashboard SMTP (which was timing out with 504).
 *
 * Deploy: supabase functions deploy auth-send-email --no-verify-jwt --project-ref htckswutkpktxclyijwk
 * Dashboard: Authentication → Auth Hooks → Send Email → HTTPS → this function URL
 * Secret: SEND_EMAIL_HOOK_SECRET (from hook setup UI; v1,whsec_ prefix stripped below)
 */
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { hasContactSmtpConfig, sendOffice365Mail } from "../_shared/office365-smtp.ts";

type EmailData = {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
  site_url: string;
  token_new: string;
  token_hash_new: string;
};

type HookUser = {
  email: string;
  new_email?: string;
  user_metadata?: Record<string, unknown>;
};

function hookSecret(): string {
  const raw = Deno.env.get("SEND_EMAIL_HOOK_SECRET")?.trim() ?? "";
  return raw.replace(/^v1,whsec_/, "");
}

function supabaseBaseUrl(): string {
  return (Deno.env.get("SUPABASE_URL") ?? "https://htckswutkpktxclyijwk.supabase.co")
    .replace(/\/$/, "");
}

function buildVerifyUrl(emailData: EmailData, tokenHash: string, type: string): string {
  const params = new URLSearchParams({
    token: tokenHash,
    type,
  });
  if (emailData.redirect_to) {
    params.set("redirect_to", emailData.redirect_to);
  }
  return `${supabaseBaseUrl()}/auth/v1/verify?${params.toString()}`;
}

function displayName(user: HookUser): string {
  const meta = user.user_metadata ?? {};
  const first = typeof meta.first_name === "string" ? meta.first_name.trim() : "";
  const last = typeof meta.last_name === "string" ? meta.last_name.trim() : "";
  const full = typeof meta.full_name === "string" ? meta.full_name.trim() : "";
  if (full) return full;
  if (first || last) return `${first} ${last}`.trim();
  return "there";
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function authEmailContent(
  action: string,
  name: string,
  confirmUrl: string,
  otp: string,
): { subject: string; html: string; plain: string } {
  const safeName = escHtml(name);
  const safeUrl = escHtml(confirmUrl);
  const safeOtp = escHtml(otp);

  const subjects: Record<string, string> = {
    signup: "Confirm your Sage With You account",
    recovery: "Reset your Sage With You password",
    magiclink: "Your Sage With You sign-in link",
    email_change: "Confirm your email change",
    invite: "You are invited to Sage With You",
  };

  const leads: Record<string, string> = {
    signup: "Please confirm your email to finish creating your account.",
    recovery:
      "We received a request to reset your password. If you did not ask for this, you can ignore this email.",
    magiclink: "Use the link below to sign in. This link expires soon.",
    email_change: "Please confirm this change to your account email address.",
    invite: "You have been invited to create an account.",
  };

  const ctas: Record<string, string> = {
    signup: "Confirm email",
    recovery: "Reset password",
    magiclink: "Sign in",
    email_change: "Confirm change",
    invite: "Accept invitation",
  };

  const actionKey = subjects[action] ? action : "signup";
  const lead = leads[actionKey] ?? "Please use the link below to continue.";
  const cta = ctas[actionKey] ?? "Continue";
  const subject = subjects[actionKey] ?? "Sage With You notification";

  const html = `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:32rem;">
  <p>Hi ${safeName},</p>
  <p>${escHtml(lead)}</p>
  <p style="margin:1.25rem 0;"><a href="${safeUrl}" style="display:inline-block;padding:0.65rem 1.25rem;background:#4a7c59;color:#fff;text-decoration:none;border-radius:6px;">${escHtml(cta)}</a></p>
  <p style="font-size:0.9rem;color:#555;">Or copy this link:<br/><a href="${safeUrl}">${safeUrl}</a></p>
  <p style="font-size:0.9rem;color:#555;">Verification code: <strong>${safeOtp}</strong></p>
  <p style="margin-top:1.5rem;font-size:0.85rem;color:#777;">Sage With You · SageÉlan Foundation, Inc.</p>
</body></html>`;

  const plain =
    `Hi ${name},\n\n${lead}\n\n${cta}: ${confirmUrl}\n\nVerification code: ${otp}\n\nSage With You`;

  return { subject, html, plain };
}

async function sendAuthMail(
  to: string,
  user: HookUser,
  emailData: EmailData,
  tokenHash: string,
  type: string,
  tokenForBody: string,
): Promise<void> {
  const confirmUrl = buildVerifyUrl(emailData, tokenHash, type);
  const { subject, html, plain } = authEmailContent(
    type,
    displayName(user),
    confirmUrl,
    tokenForBody,
  );
  await sendOffice365Mail({ to, subject, html, plain });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  if (!hasContactSmtpConfig()) {
    return new Response(
      JSON.stringify({ error: { message: "CONTACT_SMTP_* secrets not configured" } }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const secret = hookSecret();
  if (!secret) {
    return new Response(
      JSON.stringify({ error: { message: "SEND_EMAIL_HOOK_SECRET not set" } }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  try {
    const wh = new Webhook(secret);
    const { user, email_data: emailData } = wh.verify(payload, headers) as {
      user: HookUser;
      email_data: EmailData;
    };

    const action = emailData.email_action_type;

    if (
      action === "email_change" &&
      emailData.token_hash_new &&
      user.new_email &&
      emailData.token_hash &&
      emailData.token_new
    ) {
      await sendAuthMail(
        user.email,
        user,
        emailData,
        emailData.token_hash_new,
        action,
        emailData.token,
      );
      await sendAuthMail(
        user.new_email,
        user,
        emailData,
        emailData.token_hash,
        action,
        emailData.token_new,
      );
    } else {
      await sendAuthMail(
        user.email,
        user,
        emailData,
        emailData.token_hash,
        action,
        emailData.token,
      );
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[auth-send-email]", message);
    return new Response(
      JSON.stringify({ error: { message } }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
