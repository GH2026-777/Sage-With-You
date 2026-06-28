-- Rate limiting for Sage Badge Edge Functions (service role only; no public policies).

create table if not exists public.badge_submit_client_events (
  id bigint generated always as identity primary key,
  client_key text not null,
  channel text not null check (channel in ('inquiry', 'wpe')),
  created_at timestamptz not null default now()
);

create index if not exists badge_submit_client_events_key_channel_created_idx
  on public.badge_submit_client_events (client_key, channel, created_at desc);

create index if not exists badge_submit_client_events_created_idx
  on public.badge_submit_client_events (created_at);

comment on table public.badge_submit_client_events is
  'Hashed client keys for badge inquiry / WPE rate limiting; Edge Functions only.';

alter table public.badge_submit_client_events enable row level security;
