-- Contact form: only Edge Function `submit-contact` (service role) may insert.
-- Run after deploying `submit-contact`. Revokes direct browser inserts.

drop policy if exists "contact_submissions_anon_insert" on public.contact_submissions;
drop policy if exists "contact_submissions_authenticated_insert" on public.contact_submissions;

revoke insert on table public.contact_submissions from anon, authenticated;

comment on table public.contact_submissions is
  'Contact form rows inserted via Edge Function submit-contact (O365 confirmation).';
