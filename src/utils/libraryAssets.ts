import { supabase } from "./supabase";

export type LibraryResourceType = "guide" | "checklist" | "video" | "article";

/** When true, library links use public Storage URLs (upload files first). */
export function libraryAssetsUseSupabaseStorage(): boolean {
  const v = import.meta.env.VITE_LIBRARY_USE_STORAGE?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

/** Object path inside the library bucket, or null if this row has no hosted file by convention. */
export function libraryObjectPath(
  id: string,
  type: LibraryResourceType,
  format?: string,
): string | null {
  if (format === "PDF" && (type === "checklist" || type === "guide")) {
    return `pdfs/${id}.pdf`;
  }
  if (type === "video") {
    return `videos/${id}.mp4`;
  }
  if (type === "article") {
    return `articles/${id}.html`;
  }
  return null;
}

/** Expected object keys in Storage bucket `library` when all catalog assets are uploaded (upload checklist). */
export const LIBRARY_EXPECTED_STORAGE_PATHS: string[] = [
  "pdfs/1.pdf",
  "pdfs/2.pdf",
  "pdfs/3.pdf",
  "pdfs/5.pdf",
  "pdfs/6.pdf",
  "pdfs/8.pdf",
  "pdfs/9.pdf",
  "pdfs/10.pdf",
  "pdfs/15.pdf",
  "videos/4.mp4",
  "videos/12.mp4",
  "articles/7.html",
  "articles/11.html",
  "articles/13.html",
  "articles/14.html",
];

export function libraryPublicUrlForPath(objectPath: string): string {
  const bucket = import.meta.env.VITE_LIBRARY_BUCKET?.trim() || "library";
  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

export function resolveLibraryFileUrl(input: {
  id: string;
  type: LibraryResourceType;
  format?: string;
}): string | undefined {
  const path = libraryObjectPath(input.id, input.type, input.format);
  if (!path) return undefined;

  if (libraryAssetsUseSupabaseStorage()) {
    return libraryPublicUrlForPath(path);
  }

  return undefined;
}

function abortAfter(ms: number): { signal: AbortSignal; cancel: () => void } {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, cancel: () => clearTimeout(id) };
}

/**
 * Whether a public URL is reachable (e.g. Storage object exists).
 * On CORS/network/abort errors, returns true so we do not hide files incorrectly.
 */
export async function probeHttpExists(url: string): Promise<boolean> {
  try {
    const t = abortAfter(10_000);
    const head = await fetch(url, { method: "HEAD", mode: "cors", signal: t.signal });
    t.cancel();
    if (head.ok) return true;
    if (head.status === 404 || head.status === 403) return false;
  } catch {
    return true;
  }

  try {
    const t = abortAfter(10_000);
    const get = await fetch(url, {
      method: "GET",
      mode: "cors",
      signal: t.signal,
      headers: { Range: "bytes=0-0" },
    });
    t.cancel();
    if (get.ok || get.status === 206) return true;
    if (get.status === 404 || get.status === 403) return false;
  } catch {
    return true;
  }

  return false;
}
