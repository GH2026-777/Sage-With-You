#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "============================================"
echo "SAGE WITH YOU - Supabase Edge Functions deploy"
echo "============================================"
echo ""

if [[ ! -f package.json ]]; then
  echo "ERROR: Run from the Sage With You project root (folder containing package.json)."
  exit 1
fi

PROJECT_REF="${SAGE_WITH_YOU_PROJECT_REF:-htckswutkpktxclyijwk}"

run_sb() {
  if command -v supabase >/dev/null 2>&1; then
    echo "[CLI] Using global: supabase"
    supabase "$@"
  elif [[ -f node_modules/supabase/package.json ]]; then
    echo "[CLI] Using local: npx supabase (run npm install in this folder if needed)"
    npx supabase "$@"
  else
    echo "[CLI] Using: npx -y supabase (first run may download 1–3 minutes)"
    npx -y supabase "$@"
  fi
}

echo "[1/5] Checking Supabase login (project ref: ${PROJECT_REF})..."
if ! run_sb projects list >/dev/null 2>&1; then
  echo ""
  echo "Not logged in. A browser window may open — complete sign-in, then continue."
  run_sb login
fi

echo "[2/5] Deploying submit-contact..."
run_sb functions deploy submit-contact --project-ref "${PROJECT_REF}"

echo "[3/5] Deploying delete-account..."
run_sb functions deploy delete-account --project-ref "${PROJECT_REF}"

echo "[4/5] Deploying submit-badge-inquiry..."
run_sb functions deploy submit-badge-inquiry --project-ref "${PROJECT_REF}"

echo "[5/6] Deploying submit-badge-wpe..."
run_sb functions deploy submit-badge-wpe --project-ref "${PROJECT_REF}"

echo "[6/6] Deploying publish-badge-assessment..."
run_sb functions deploy publish-badge-assessment --project-ref "${PROJECT_REF}"

echo ""
echo "Done. (submit-contact, delete-account, submit-badge-inquiry, submit-badge-wpe, publish-badge-assessment)"
