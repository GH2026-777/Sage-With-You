# Unblock sign-up with confirmation ON

Do **not** turn off Confirm email for production risk reasons.

## Fix (keeps email confirmation)

Follow **`AUTH_EMAIL_SETUP.md`**:

1. Deploy **`auth-send-email`** (`deploy-supabase-functions.bat`)
2. Enable **Send Email** hook in the dashboard (HTTPS URL for that function)
3. Set **`SEND_EMAIL_HOOK_SECRET`** in Edge secrets
4. Keep **Confirm email** ON

This sends confirmation mail through **Office 365** (same as contact form), not Supabase dashboard SMTP (which was timing out).

## Browser

If you see `Invalid Refresh Token`: use incognito or clear `sb-*` keys in Local Storage.

## Temporary workaround (not for production)

Turning Confirm email off only for a quick test is described in older notes; use the hook instead for the real requirement.
