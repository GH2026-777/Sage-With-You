/**
 * Deletes the authenticated Supabase Auth user (same pattern as Hapmetry `delete-user`).
 * Body: { "confirmEmail": "<must match signed-in user email>" }.
 *
 * Source file on disk (repo): `Sage With You/supabase/functions/delete-account/index.ts`
 * — Parent folder has a space; use @-mention `delete-account` or Explorer if `@Sage With You/...` fails.
 *
 * Secrets: SUPABASE_SERVICE_ROLE_KEY (auto on Supabase), SUPABASE_URL, SUPABASE_ANON_KEY.
 *
 * Deploy: supabase functions deploy delete-account --project-ref htckswutkpktxclyijwk
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "missing_authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey) {
    return new Response(JSON.stringify({ error: "server_misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!serviceKey) {
    return new Response(
      JSON.stringify({
        error: "account_deletion_unavailable",
        detail: "SUPABASE_SERVICE_ROLE_KEY missing on Edge Function",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const jwt = authHeader.slice("Bearer ".length).trim();
  if (!jwt) {
    return new Response(JSON.stringify({ error: "missing_authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const {
    data: { user },
    error: userErr,
  } = await userClient.auth.getUser(jwt);

  if (userErr || !user?.id) {
    return new Response(
      JSON.stringify({ error: "unauthorized", detail: userErr?.message ?? "invalid token" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let body: { confirmEmail?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty */
  }

  const confirm = typeof body.confirmEmail === "string" ? body.confirmEmail.trim().toLowerCase() : "";
  const accountEmail = user.email?.trim().toLowerCase() ?? "";

  if (!confirm || !accountEmail || confirm !== accountEmail) {
    return new Response(JSON.stringify({ error: "email_confirmation_mismatch" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);

  if (delErr) {
    return new Response(JSON.stringify({ error: delErr.message ?? "delete_failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
