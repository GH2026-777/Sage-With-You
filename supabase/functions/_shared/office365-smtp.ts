/**
 * Microsoft 365 SMTP for Edge Functions (contact form + auth send-email hook).
 * Secrets: CONTACT_SMTP_HOST, CONTACT_SMTP_PORT, CONTACT_SMTP_USER, CONTACT_SMTP_PASS, CONTACT_SMTP_FROM
 */
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

  const client = new SMTPClient({
    connection: {
      hostname: host,
      port,
      tls: smtpUseImplicitTls(port),
      auth: { username: user, password: pass },
    },
  });

  try {
    await client.send({
      from,
      to: params.to,
      subject: params.subject,
      content: params.plain,
      html: params.html,
      ...(bcc ? { bcc } : {}),
    });
  } finally {
    try {
      await client.close();
    } catch {
      /* ignore */
    }
  }
}
