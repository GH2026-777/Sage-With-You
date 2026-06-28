import type { User } from "@supabase/supabase-js";
import { downloadJsonFile } from "./download-json";

export type AccountExportPayload = {
  exported_at: string;
  app: string;
  user: {
    id: string;
    email: string | null;
    created_at: string | undefined;
    user_metadata: Record<string, unknown>;
  };
  data?: Record<string, unknown>;
};

export function buildAuthUserExport(
  user: User,
  appName: string,
  extra?: Record<string, unknown>,
): AccountExportPayload {
  return {
    exported_at: new Date().toISOString(),
    app: appName,
    user: {
      id: user.id,
      email: user.email ?? null,
      created_at: user.created_at,
      user_metadata: (user.user_metadata ?? {}) as Record<string, unknown>,
    },
    ...(extra ? { data: extra } : {}),
  };
}

export function downloadAccountExport(payload: AccountExportPayload, slug: string): void {
  const date = new Date().toISOString().slice(0, 10);
  downloadJsonFile(payload, `${slug}-account-export-${date}.json`);
}
