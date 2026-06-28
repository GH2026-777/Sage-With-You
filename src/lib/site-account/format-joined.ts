export function formatJoinedDate(iso: string | undefined, fallback = "N/A"): string {
  if (!iso) return fallback;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return fallback;
  }
}
