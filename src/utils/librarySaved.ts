/** Persisted bookmark IDs for the Resource Library (same browser). */
const STORAGE_KEY = "swy_library_saved_ids";

export function loadSavedResourceIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function persistSavedResourceIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* private mode / quota */
  }
}
