/**
 * Microsoft 365 SMTP for Edge Functions (contact form + auth send-email hook).
 * Secrets: CONTACT_SMTP_HOST, CONTACT_SMTP_PORT, CONTACT_SMTP_USER, CONTACT_SMTP_PASS, CONTACT_SMTP_FROM
 *
 * Uses nodemailer via npm (esm.sh breaks TLS on Supabase Edge: tlssock._start is not a function).
 */
import nodemailer from "npm:nodemailer@6.9.16";

function smtpUseImplicitTls(port: number): boolean {
  return port === 465;
}

export function hasContactSmtpConfig(): boolean {
  return Boolean(
    Deno.env.get("CONTACT_SMTP_USER")?.trim() &&
      Deno.env.get("CONTACT_SMTP_PASS")?.trim() &&
      Deno.env.get("CONTACT_SMTP_FROM")?.trim(),
  );
}

export async function sendOffice365Mail(params: {
  to: string;
  subject: string;
  html: string;
  plain: string;
  bcc?: string;
}): Promise<void> {
  const host = Deno.env.get("CONTACT_SMTP_HOST")?.trim() ?? "smtp.office365.com";
  const port = Number(Deno.env.get("CONTACT_SMTP_PORT")?.trim() ?? "587");
  const user = Deno.env.get("CONTACT_SMTP_USER")?.trim();
  const pass = Deno.env.get("CONTACT_SMTP_PASS")?.trim();
  const from = Deno.env.get("CONTACT_SMTP_FROM")?.trim();
  const bcc = params.bcc ?? Deno.env.get("CONTACT_SMTP_BCC")?.trim();

  if (!user || !pass || !from) {
    throw new Error("missing_smtp_config");
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: smtpUseImplicitTls(port),
    auth: { user, pass },
    requireTLS: !smtpUseImplicitTls(port) && port === 587,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await transport.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      text: params.plain,
      html: params.html,
      ...(bcc ? { bcc } : {}),
    });
  } finally {
    await transport.close();
  }
}
