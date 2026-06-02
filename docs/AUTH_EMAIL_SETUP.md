# Sign-up with email confirmation

**Confirm email stays ON.** That is required for your risk model.

Most Sage sites only need **Authentication → Emails → Custom SMTP** (Office 365). **No hook.** Try that first.

---

## Simple setup (same as your other projects)

1. [Authentication → Emails → SMTP](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/templates)
2. **Custom SMTP** ON — same mailbox as contact form:
   - Host: `smtp.office365.com`
   - Port: `587`
   - User / password / From: your `CONTACT_SMTP_*` values
3. **Send test email** — must arrive in under a few seconds (not timeout)
4. [Providers → Email](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/providers) → **Confirm email** ON
5. [URL Configuration](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/url-configuration) → Site URL + `/login` redirect URLs
6. One test sign-up on `/join`

**Do not enable the Send Email hook** if this works.

---

## Only if test email or sign-up still times out (504)

Then use the backup Edge Function `auth-send-email`:

1. Run `deploy-supabase-functions.bat`
2. [Auth Hooks → Send Email](https://supabase.com/dashboard/project/htckswutkpktxclyijwk/auth/hooks) → type **HTTPS** (not Postgres)
3. URL: `https://htckswutkpktxclyijwk.supabase.co/functions/v1/auth-send-email`
4. Add `SEND_EMAIL_HOOK_SECRET` to Edge secrets

When the hook is ON, dashboard SMTP is not used for auth mail.

---

## Contact form vs sign-up

| | Where |
|--|--------|
| Contact form | Edge `submit-contact` + `CONTACT_SMTP_*` |
| Sign-up email | Usually **Authentication → SMTP** only |
| Sign-up (backup) | `auth-send-email` hook + same `CONTACT_SMTP_*` |

---

## Rate limit message

“Too many emails” = wait ~1 hour or raise **Authentication → Rate Limits → Emails sent**.
