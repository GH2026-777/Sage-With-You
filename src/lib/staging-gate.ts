/**
 * Live-staging password gate (deploy-time toggle). Not end-user auth (Supabase handles that).
 *
 * **On by default** for production builds. Public go-live: set `VITE_ENABLE_PASSWORD_GATE=false` and rebuild.
 * Password: `VITE_STAGING_GATE_PASSWORD` (required in production when gate is on).
 */

export function isStagingPasswordGateEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_PASSWORD_GATE !== "false";
}

/** Ask crawlers not to index while the staging gate is active. */
export function shouldNoindexForStaging(): boolean {
  return isStagingPasswordGateEnabled();
}

export function stagingGatePassword(): string {
  const fromEnv = import.meta.env.VITE_STAGING_GATE_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return "SageElan2026";
  return "";
}
