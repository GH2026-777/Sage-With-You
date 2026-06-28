# Pre-Deployment Checklist — Sage With You

Complete before running `deploy-godaddy.bat` / `deploy-godaddy.sh`.

---

## Configuration

### Staging gate (UAT)

- [ ] `VITE_STAGING_GATE_PASSWORD` set in `.env` or `.env.production`
- [ ] Gate ON for staging (default; omit `VITE_ENABLE_PASSWORD_GATE` or leave unset)
- [ ] For public go-live later: plan `VITE_ENABLE_PASSWORD_GATE=false` rebuild

### Supabase (build env)

- [ ] `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set
- [ ] `VITE_SITE_URL` matches deploy host (e.g. `https://sagewithyou.org`)

### Dashboard (see `docs/SUPABASE_OPS_CHECKLIST.md`)

- [ ] Migrations 001–005 applied (`005` = Sage Badge Phase 1)
- [ ] Edge Functions deployed
- [ ] SMTP / auth email path verified (`info@sageelan.org`)
- [ ] Auth redirect URLs include production + localhost

### Sage Badge (pre–go-live)

- [ ] Staging gate ON — full badge UX available **after** password unlock (see `docs/SAGE_BADGE_GO_LIVE.md`)
- [ ] `badge_staff_roles` seeded for admin user(s)
- [ ] Legal / SOW / WPE policy items on go-live list (not required for gated staging)

---

## Content & UX

- [ ] Page copy finalized; contact info correct (`info@sageelan.org`)
- [ ] Privacy and Terms reviewed
- [ ] Library assets uploaded if using Storage (`VITE_LIBRARY_USE_STORAGE=true`)

---

## Technical

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` succeeds locally
- [ ] No console errors on key flows (home, contact, join, login)

---

## Deploy

- [ ] GoDaddy cPanel access ready
- [ ] Target directory known (staging vs production)
- [ ] Run deploy script from project root
- [ ] Upload and extract `sageelan-staging-deploy.zip`

---

## After deploy

Use the checklist in `DEPLOYMENT.md` (gate, routes, auth, contact, mobile).

---

**SageÉlan Foundation — Sage With You**
