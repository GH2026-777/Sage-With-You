-- Sage With You: contact form → Supabase
-- Run once in Dashboard → SQL Editor for project htckswutkpktxclyijwk (or via supabase db push).

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

comment on table public.contact_submissions is
  'Public contact form; inserts from anon key. View rows in Table Editor or SQL (service role bypasses RLS).';

alter table public.contact_submissions enable row level security;

drop policy if exists "contact_submissions_anon_insert" on public.contact_submissions;
create policy "contact_submissions_anon_insert"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

drop policy if exists "contact_submissions_authenticated_insert" on public.contact_submissions;
create policy "contact_submissions_authenticated_insert"
  on public.contact_submissions
  for insert
  to authenticated
  with check (true);

grant insert on table public.contact_submissions to anon, authenticated;
