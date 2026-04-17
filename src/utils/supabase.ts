import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

if (!url || !anonKey) {
  const hint =
    "Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Supabase → Project Settings → API).";
  if (import.meta.env.PROD) {
    throw new Error(`Sage With You: missing Supabase env. ${hint}`);
  }
  console.error(`[Sage With You] ${hint}`);
}

/**
 * Browser client for Sage With You. Uses the public anon key; all data access
 * must be enforced with Row Level Security in Supabase.
 */
export const supabase = createClient(url ?? "", anonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export default supabase;
