/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** Canonical public site URL (no trailing slash), e.g. https://sagewithyou.org - used for OG URLs. */
  readonly VITE_SITE_URL?: string;
  /** Set true after uploading library files to Storage (see supabase/migrations/003_library_storage_bucket.sql). */
  readonly VITE_LIBRARY_USE_STORAGE?: string;
  /** Storage bucket id for library assets; default library. */
  readonly VITE_LIBRARY_BUCKET?: string;
  /** Set to `"false"` to disable the live-staging password gate (public go-live). */
  readonly VITE_ENABLE_PASSWORD_GATE?: string;
  /** Staging gate password (required in production builds when gate is on). */
  readonly VITE_STAGING_GATE_PASSWORD?: string;
  /** Google Analytics 4 measurement ID (optional; respects cookie consent). */
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
