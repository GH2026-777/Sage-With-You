import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function updateDisplayName(
  supabase: SupabaseClient,
  displayName: string,
): Promise<{ user: User | null; error: string | null }> {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return { user: null, error: "Enter your name." };
  }

  const parts = trimmed.split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ");

  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: trimmed,
      name: trimmed,
      first_name: first,
      last_name: last,
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}
