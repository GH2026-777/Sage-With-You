/**
 * Rate-limit helpers for Edge Functions (hashed client keys; service role writes only).
 */
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export function clientIpFromRequest(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")?.trim();
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  return "unknown";
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkAndRecordRateLimit(
  admin: SupabaseClient,
  opts: {
    table: "contact_submit_client_events" | "badge_submit_client_events";
    clientKey: string;
    channel?: "inquiry" | "wpe";
    limit: number;
    windowHours?: number;
    pruneOlderThanHours?: number;
  },
): Promise<{ allowed: boolean }> {
  const windowHours = opts.windowHours ?? 1;
  const pruneHours = opts.pruneOlderThanHours ?? 48;
  const sinceIso = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
  const pruneIso = new Date(Date.now() - pruneHours * 60 * 60 * 1000).toISOString();

  const { error: pruneErr } = await admin
    .from(opts.table)
    .delete()
    .lt("created_at", pruneIso);
  if (pruneErr) {
    console.warn(`[rate-limit] prune skipped (${opts.table}):`, pruneErr.message);
  }

  let countQuery = admin
    .from(opts.table)
    .select("id", { count: "exact", head: true })
    .eq("client_key", opts.clientKey)
    .gte("created_at", sinceIso);

  if (opts.table === "badge_submit_client_events" && opts.channel) {
    countQuery = countQuery.eq("channel", opts.channel);
  }

  const { count: recentCount, error: rateErr } = await countQuery;
  if (!rateErr && recentCount != null && recentCount >= opts.limit) {
    return { allowed: false };
  }
  if (rateErr) {
    console.warn(`[rate-limit] count failed (${opts.table}):`, rateErr.message);
  }

  const insertRow =
    opts.table === "badge_submit_client_events"
      ? { client_key: opts.clientKey, channel: opts.channel ?? "inquiry" }
      : { client_key: opts.clientKey };

  const { error: insErr } = await admin.from(opts.table).insert(insertRow);
  if (insErr) {
    console.warn(`[rate-limit] insert failed (${opts.table}):`, insErr.message);
  }

  return { allowed: true };
}
