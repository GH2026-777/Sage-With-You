# Sage With You — Deployment Guide

## Quick start: GoDaddy static deploy

### Prerequisites

- Node.js 18+ and npm
- GoDaddy cPanel access
- `.env` or `.env.production` with Supabase and staging gate vars (see `.env.production.example`)

### Build package

**Windows:**

```bash
deploy-godaddy.bat
```

**Mac/Linux:**

```bash
chmod +x deploy-godaddy.sh
./deploy-godaddy.sh
```

The script runs `npm ci`, `npm run build`, writes `dist/.htaccess` for React Router, and creates `sageelan-staging-deploy.zip`.

### Upload

1. Log in to GoDaddy cPanel → File Manager
2. Open your target directory (e.g. `public_html/` for production or a staging subfolder)
3. Remove old site files
4. Upload `sageelan-staging-deploy.zip`, extract, delete the zip on the server

Production host documented in repo: **https://sage-with-you.org**

---

## Environment (build time)

Vite embeds `VITE_*` variables at build time. Copy `.env.production.example` to `.env.production` (or use `.env` for local builds).

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key |
| `VITE_SITE_URL` | Canonical origin (no trailing slash), e.g. `https://sage-with-you.org` |
| `VITE_ENABLE_PASSWORD_GATE` | `"false"` to disable staging gate (public go-live) |
| `VITE_STAGING_GATE_PASSWORD` | Staging gate password (required when gate is on in production builds) |
| `VITE_LIBRARY_USE_STORAGE` | Optional: `true` after library files are in Supabase Storage |

---

## Staging password gate

**Not** the same as Supabase sign-in. Casual UAT protection only (client-side).

| Setting | Default | Go-live |
|---------|---------|---------|
| Gate | ON (`VITE_ENABLE_PASSWORD_GATE` unset or not `"false"`) | Set `VITE_ENABLE_PASSWORD_GATE=false` and rebuild |
| Password | `VITE_STAGING_GATE_PASSWORD` | n/a when gate off |
| SEO | `noindex` on all pages while gate is on | Indexing allowed when gate off |

Local dev uses a dev fallback password when `VITE_STAGING_GATE_PASSWORD` is unset (see `src/lib/staging-gate.ts`).

---

## What gets deployed

### Pages

Home, About, Programs, Resources, Assessments, Library, Contact, Account, Privacy, Terms, program detail pages, Login / Join / Forgot / Reset password.

### Backend (Supabase)

- **Auth:** email + password, email confirmation, password reset
- **Contact:** Edge Function `submit-contact` → DB + O365 confirmation email
- **Account deletion:** Edge Function `delete-account`
- **Optional:** library files in public Storage bucket `library`

See `docs/SUPABASE_OPS_CHECKLIST.md` for Dashboard setup.

---

## Post-deploy testing

- [ ] Staging gate (if enabled) accepts team password
- [ ] All main routes load; refresh does not 404 (`.htaccess` present)
- [ ] Sign up → confirm email → sign in
- [ ] Forgot / reset password
- [ ] Contact form saves and sends confirmation email
- [ ] Library links (if Storage enabled)
- [ ] Mobile layout and accessibility widget

---

## Troubleshooting

**404 on refresh:** Ensure `dist/.htaccess` was uploaded; mod_rewrite enabled on host.

**Blank page:** Check browser console; verify all `dist/` assets uploaded.

**Auth redirect errors:** Add your exact origin and paths in Supabase → Authentication → URL Configuration.

**Contact form fails:** Confirm migrations 001–004, Edge Function deployed, `CONTACT_SMTP_*` secrets set.

**Build fails:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` / `.env.production`.

---

## Going live

1. Complete `docs/SUPABASE_OPS_CHECKLIST.md`
2. Set `VITE_SITE_URL=https://sage-with-you.org`
3. Set `VITE_ENABLE_PASSWORD_GATE=false`
4. Rebuild and deploy to production directory
5. Verify `public/robots.txt`, `public/sitemap.xml`, and OG URLs match production host

---

**SageÉlan Foundation — Sage With You (Living in Place)**  
Build: Vite + React + Tailwind CSS v4 + Supabase
