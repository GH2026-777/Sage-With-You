# Sage With You — Supabase ops checklist

Use this before calling staging or production **done**. Dashboard: [Supabase project htckswutkpktxclyijwk](https://supabase.com/dashboard/project/htckswutkpktxclyijwk).

## Do not mix Supabase projects

| Product | Project ref | Site |
|---------|-------------|------|
| **Sage With You** | `htckswutkpktxclyijwk` | sagewithyou.org |
| **Sage Panthers** | `yvlbwoeuggincvwecgxk` | sagepanthers.org |

Each product has its **own** Supabase project, migrations, Edge Functions, and auth URLs. Deploy scripts must be run **from that product’s folder**. Copy **Custom SMTP settings** from Panthers into With You — but never point With You `.env` at the Panthers URL.

If `deploy-supabase.bat` shows the wrong ref, check `.env` → `VITE_SUPABASE_URL` and clear any global `SAGEPANTHERS_PROJECT_REF` from your shell before deploying Sage With You.

## SQL migrations (in order)

Run in SQL Editor or `supabase db push`:

1. `001_contact_submissions.sql`
2. `002_contact_submissions_edge_only.sql` (after `submit-contact` is deployed)
3. `003_library_storage_bucket.sql`
4. `004_contact_submit_rate_limit.sql`
5. `005_sage_badge_phase1.sql` — Sage Badge companies, assessments, WPE, inquiries

After `005`:

```sql
insert into public.badge_staff_roles (user_id, role)
values ('YOUR-USER-UUID', 'admin');
```

See `docs/SAGE_BADGE_GO_LIVE.md` for full badge go-live checklist.

## Edge Functions

From project root: `deploy-supabase-functions.bat` (Windows) or `./deploy-supabase-functions.sh`.

| Function | Notes |
|----------|--------|
| `submit-contact` | Contact form + O365 confirmation |
| `delete-account` | Account deletion from `/account` |

**Sign-up / password reset mail:** **Authentication → Custom SMTP** only (copy from Sage Panthers). **Do not enable Send Email hook** — it bypasses SMTP and broke sign-up.

## Edge secrets

**submit-contact:** `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASS`, `CONTACT_SMTP_FROM`  
Optional: `CONTACT_SMTP_BCC`, `CONTACT_RATE_SALT`, `CONTACT_RATE_LIMIT_PER_HOUR`

## Auth

- [ ] **Send Email hook:** OFF ([hooks](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/hooks))
- [ ] **Custom SMTP:** same as Sage Panthers ([SMTP](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/smtp)) — send test email
- [ ] **URL Configuration:** `fix-supabase-auth-urls.bat` or confirm `https://sagewithyou.org/**`
- [ ] **Confirm email:** ON

## Library (optional)

- [ ] Upload objects to Storage bucket `library` (see `LIBRARY_EXPECTED_STORAGE_PATHS` in `src/utils/libraryAssets.ts`)
- [ ] Set `VITE_LIBRARY_USE_STORAGE=true` in production build env

## Smoke tests

- [ ] `/join` → confirmation email arrives
- [ ] `/login` after confirm
- [ ] `/forgot-password` → reset link works
- [ ] `/contact` → row in `contact_submissions` + visitor confirmation email
- [ ] `/account` → delete account (test user only)
