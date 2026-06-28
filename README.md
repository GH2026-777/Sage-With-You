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
- Optional: `VITE_SITE_URL` — Public origin without trailing slash (Open Graph URLs; default `https://sagewithyou.org`).
- Optional: `VITE_LIBRARY_USE_STORAGE`, `VITE_LIBRARY_BUCKET` — See `.env.example` and `src/utils/libraryAssets.ts` (`LIBRARY_EXPECTED_STORAGE_PATHS` lists upload paths).
- Staging gate: `VITE_STAGING_GATE_PASSWORD` (ON by default). Public go-live: `VITE_ENABLE_PASSWORD_GATE=false` then rebuild. See `.env.production.example`.

Production builds: copy `.env.production.example` to `.env.production` on the deploy machine.

## CI

GitHub Actions workflow `.github/workflows/ci.yml` runs `npm ci`, then **lint**, **typecheck**, **test**, and **build** on pushes/PRs to `main` or `master`.

## Supabase

**Windows batch files** (in this folder — Explorer may hide the `.bat` extension):

| File | Purpose |
|------|---------|
| `deploy-supabase.bat` | DB migrations |
| `deploy-supabase-functions.bat` | Edge Functions |
| `deploy-supabase-all.bat` | Migrations + functions (one run) |
| `repair-supabase-baseline.bat` | Fix history if SQL Editor was used first |
| `fix-supabase-auth-urls.bat` | Push auth redirect URLs from `supabase/config.toml` |
| `turn-off-auth-hook.bat` | Opens Dashboard to disable Send Email hook |
| `deploy-godaddy.bat` | Build + zip for GoDaddy |

1. Run **`deploy-supabase.bat`** (or `supabase db push`).  
   If the DB was set up earlier in the SQL Editor and push fails on **001** (*policy already exists*), run **`repair-supabase-baseline.bat`** once — it must use **`--linked`** on the remote project — then run **`deploy-supabase.bat`** again. The deploy script also auto-retries repair once when `SUPABASE_BASELINE_REPAIR_VERSIONS` is set.  
   `001` → `002` → `003` → `004` → `0050_sage_badge_phase1.sql` (or `0051_badge_rls_repair.sql` if policies already exist) → `006_community_company_nomination.sql` → `007_badge_wpe_unique_submitters.sql` → `008_badge_submit_rate_limit.sql`.
2. Deploy Edge Functions: **`deploy-supabase-functions.bat`** (`submit-contact`, `delete-account`, `submit-badge-inquiry`, `submit-badge-wpe`, `publish-badge-assessment`).
3. Sage Badge docs: `docs/SAGE_BADGE_GO_LIVE.md`, `docs/SAGE_WITH_YOU_FULL_SITE_AUDIT.md`, `docs/SAGE_BADGE_PROGRAM_STATUS_WHITEPAPER_v1.1.md`.
4. Set Edge **secrets** for `submit-contact` and badge functions (SMTP, `BADGE_INQUIRY_NOTIFY_TO`) — see `.env.example` and `docs/SAGE_BADGE_GO_LIVE.md`.
5. Sign-up mail: **Authentication → Custom SMTP** (same as Sage Panthers). **Do not** enable Send Email hook. See **`docs/AUTH_EMAIL_SETUP.md`** and **`docs/SUPABASE_OPS_CHECKLIST.md`**.

## Static / SEO

- `public/robots.txt` and `public/sitemap.xml` use `https://sagewithyou.org`. If your production host differs, update those files (or replace at deploy time).
- Default meta tags live in `index.html`; route-specific titles and descriptions are updated in the client via `SiteMeta` + `src/lib/siteSeo.ts`.
- Social preview: `public/og-image.png` (1200×630). Regenerate with `npm run generate:og`. `index.html` includes default `og:image` / `twitter:image` URLs — keep them in sync with production (`VITE_SITE_URL` drives the same URL in `SiteMeta` at runtime).

## Legal routes

- `/privacy` — Privacy policy  
- `/terms` — Terms of Service  

Content is informational; have counsel review before relying on it as binding policy.
