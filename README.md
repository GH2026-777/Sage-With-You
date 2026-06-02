# Sage With You

Vite + React + Tailwind site for **Sage With You** (SageÉlan Foundation), with Supabase Auth, contact submissions via Edge Function, and optional library assets in Supabase Storage.

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Local dev server (port 5173 by default; Vite may use the next port if busy). |
| `npm run build` | Production bundle to `dist/`. |
| `npm run lint` | ESLint (flat config, `eslint.config.js`). |
| `npm run lint:fix` | ESLint with `--fix`. |
| `npm run typecheck` | `tsc --noEmit` (TypeScript). |
| `npm test` | `vitest run` (unit tests). |
| `npm run generate:og` | Regenerate `public/og-image.png` (1200×630) via `sharp` + `scripts/generate-og.mjs`. |

## Environment

Copy `.env.example` to `.env` and set at least:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Project **API** settings in Supabase.
- Optional: `VITE_SITE_URL` — Public origin without trailing slash (Open Graph URLs; default `https://sage-with-you.org`).
- Optional: `VITE_LIBRARY_USE_STORAGE`, `VITE_LIBRARY_BUCKET` — See `.env.example` and `src/utils/libraryAssets.ts` (`LIBRARY_EXPECTED_STORAGE_PATHS` lists upload paths).
- Staging gate: `VITE_STAGING_GATE_PASSWORD` (ON by default). Public go-live: `VITE_ENABLE_PASSWORD_GATE=false` then rebuild. See `.env.production.example`.

Production builds: copy `.env.production.example` to `.env.production` on the deploy machine.

## CI

GitHub Actions workflow `.github/workflows/ci.yml` runs `npm ci`, then **lint**, **typecheck**, **test**, and **build** on pushes/PRs to `main` or `master`.

## Supabase

1. Run SQL migrations in order in the SQL Editor (or `supabase db push`):  
   `001_contact_submissions.sql` → `002_contact_submissions_edge_only.sql` → `003_library_storage_bucket.sql` → `004_contact_submit_rate_limit.sql`.
2. Deploy Edge Functions (e.g. `deploy-supabase-functions.bat` / `.sh`): **`submit-contact`**, **`delete-account`**, **`auth-send-email`** (hook backup).
3. Set Edge **secrets** for `submit-contact` (SMTP, optional BCC, `CONTACT_RATE_SALT`, optional `CONTACT_RATE_LIMIT_PER_HOUR`) — see comments in `supabase/functions/submit-contact/index.ts` and `.env.example`.
4. Full Dashboard checklist: **`docs/SUPABASE_OPS_CHECKLIST.md`**. Auth email: **`docs/AUTH_EMAIL_SETUP.md`**.

## Static / SEO

- `public/robots.txt` and `public/sitemap.xml` use `https://sage-with-you.org`. If your production host differs, update those files (or replace at deploy time).
- Default meta tags live in `index.html`; route-specific titles and descriptions are updated in the client via `SiteMeta` + `src/lib/siteSeo.ts`.
- Social preview: `public/og-image.png` (1200×630). Regenerate with `npm run generate:og`. `index.html` includes default `og:image` / `twitter:image` URLs — keep them in sync with production (`VITE_SITE_URL` drives the same URL in `SiteMeta` at runtime).

## Legal routes

- `/privacy` — Privacy policy  
- `/terms` — Terms of Service  

Content is informational; have counsel review before relying on it as binding policy.
