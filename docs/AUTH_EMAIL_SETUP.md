# Sign-up and auth email (Sage Panthers pattern)

**No webhooks. No Edge Function for auth mail.** Only **Authentication → Custom SMTP** in the Supabase dashboard.

Project: [htckswutkpktxclyijwk](https://supabase.com/dashboard/project/htckswutkpktxclyijwk)

## One-time setup

1. **[Auth Hooks → Send Email](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/hooks)** — must be **off** (delete if present). Run `turn-off-auth-hook.bat` to open this page.
2. **[Authentication → SMTP](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/smtp)** — copy **exact same settings** from Sage Panthers. Click **Send test email**.
3. **[URL Configuration](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/url-configuration)** — include `https://sagewithyou.org/**`, `/login`, `/reset-password`, and `http://localhost:5173/**` for dev. Or run `fix-supabase-auth-urls.bat`.
4. **Confirm email** ON under [Providers → Email](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/providers).

## How sign-up works (same as Panthers)

1. User fills **Create Account** (`/join`)
2. Supabase sends **Confirm Your Signup** email via Custom SMTP
3. User clicks link → lands on `/login`
4. User **Signs in** with their password

Forgot password: `/forgot-password`

## Contact form (separate)

Edge Function `submit-contact` + `CONTACT_SMTP_*` secrets. Does not affect sign-up.

## Do not

- Enable **Send Email** auth hook (removed from this repo; caused 504 timeouts and TLS errors)
- Use a different Supabase project — Sage With You is **htckswutkpktxclyijwk**, not Panthers or Main Sites
