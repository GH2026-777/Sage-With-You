export function displayNameFromMetadata(
  meta: Record<string, unknown> | undefined,
  email: string | null | undefined,
  fallback = "Member",
): string {
  const full = typeof meta?.full_name === "string" ? meta.full_name.trim() : "";
  if (full) return full;
  const name = typeof meta?.name === "string" ? meta.name.trim() : "";
  if (name) return name;
  const first = typeof meta?.first_name === "string" ? meta.first_name.trim() : "";
  const last = typeof meta?.last_name === "string" ? meta.last_name.trim() : "";
  const combined = [first, last].filter(Boolean).join(" ").trim();
  if (combined) return combined;
  if (email) return email.split("@")[0] ?? fallback;
  return fallback;
}
