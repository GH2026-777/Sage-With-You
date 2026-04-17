-- Rate limiting data for Edge Function `submit-contact` (service role only; no public policies).

create table if not exists public.contact_submit_client_events (
  id bigint generated always as identity primary key,
  client_key text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_submit_client_events_key_created_idx
  on public.contact_submit_client_events (client_key, created_at desc);

create index if not exists contact_submit_client_events_created_idx
  on public.contact_submit_client_events (created_at);

comment on table public.contact_submit_client_events is
  'Hashed client keys for contact form rate limiting; written only by submit-contact Edge Function.';

alter table public.contact_submit_client_events enable row level security;
