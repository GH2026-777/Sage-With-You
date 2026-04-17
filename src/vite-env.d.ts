/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** Canonical public site URL (no trailing slash), e.g. https://sage-with-you.org — used for OG URLs. */
  readonly VITE_SITE_URL?: string;
  /** Set true after uploading library files to Storage (see supabase/migrations/003_library_storage_bucket.sql). */
  readonly VITE_LIBRARY_USE_STORAGE?: string;
  /** Storage bucket id for library assets; default library. */
  readonly VITE_LIBRARY_BUCKET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
