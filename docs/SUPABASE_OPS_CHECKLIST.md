# Sage With You — Supabase ops checklist

Use this before calling staging or production **done**. Dashboard: [Supabase project htckswutkpktxclyijwk](https://supabase.com/dashboard/project/htckswutkpktxclyijwk).

## SQL migrations (in order)

Run in SQL Editor or `supabase db push`:

1. `001_contact_submissions.sql`
2. `002_contact_submissions_edge_only.sql` (after `submit-contact` is deployed)
3. `003_library_storage_bucket.sql`
4. `004_contact_submit_rate_limit.sql`

## Edge Functions

From project root: `deploy-supabase-functions.bat` (Windows) or `./deploy-supabase-functions.sh`.

| Function | Notes |
|----------|--------|
| `submit-contact` | Contact form + O365 confirmation |
| `delete-account` | Account deletion from `/account` |
| `auth-send-email` | Backup if Auth dashboard SMTP times out |

## Edge secrets

**submit-contact:** `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASS`, `CONTACT_SMTP_FROM`  
Optional: `CONTACT_SMTP_BCC`, `CONTACT_RATE_SALT`, `CONTACT_RATE_LIMIT_PER_HOUR`

**auth-send-email** (if hook enabled): `SEND_EMAIL_HOOK_SECRET`, same `CONTACT_SMTP_*` as contact form

## Auth

- [ ] **URL Configuration:** Site URL + Redirect URLs (`http://localhost:5173`, production origin, `/login`, `/reset-password`)
- [ ] **Confirm email:** ON (Providers → Email)
- [ ] **Custom SMTP** in Authentication → Emails (try first; see `docs/AUTH_EMAIL_SETUP.md`)
- [ ] **Send Email hook** only if SMTP test or sign-up still times out (504)

## Library (optional)

- [ ] Upload objects to Storage bucket `library` (see `LIBRARY_EXPECTED_STORAGE_PATHS` in `src/utils/libraryAssets.ts`)
- [ ] Set `VITE_LIBRARY_USE_STORAGE=true` in production build env

## Smoke tests

- [ ] `/join` → confirmation email arrives
- [ ] `/login` after confirm
- [ ] `/forgot-password` → reset link works
- [ ] `/contact` → row in `contact_submissions` + visitor confirmation email
- [ ] `/account` → delete account (test user only)
