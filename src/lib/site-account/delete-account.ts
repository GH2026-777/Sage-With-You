import type { SupabaseClient } from "@supabase/supabase-js";

export type DeleteAccountResult =
  | { ok: true }
  | { ok: false; error: string };

function messageFromPayload(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (typeof record.error === "string" && record.error.trim()) return record.error;
  if (typeof record.detail === "string" && record.detail.trim()) return record.detail;
  return null;
}

/** Invoke the standard SITE `delete-account` Edge Function (email must match signed-in user). */
export async function deleteAccountWithEmailConfirm(
  supabase: SupabaseClient,
  confirmEmail: string,
  functionName = "delete-account",
): Promise<DeleteAccountResult> {
  const trimmed = confirmEmail.trim();
  if (!trimmed) {
    return { ok: false, error: "Type your account email to confirm." };
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body: { confirmEmail: trimmed },
  });

  if (error) {
    return { ok: false, error: error.message || "We could not delete your account." };
  }

  const fromBody = messageFromPayload(data);
  if (fromBody) {
    return { ok: false, error: fromBody };
  }

  return { ok: true };
}
