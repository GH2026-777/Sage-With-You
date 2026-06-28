-- Sage Badge Phase 1 — companies, assessments, WPE, company inquiries
-- Run in Supabase SQL Editor or: supabase db push
-- Charter: docs/SAGE_BADGE_SCORING_CHARTER.md
--
-- If you get "policy ... already exists", 005 already ran through RLS once.
-- Do NOT re-run this whole file. Run 006_community_company_nomination.sql only,
-- or supabase/migrations/0051_badge_rls_repair.sql to (re)apply policies safely.

-- ---------------------------------------------------------------------------
-- Service types (taxonomy + optional pillar weight overrides)
-- ---------------------------------------------------------------------------
create table if not exists public.badge_service_types (
  id text primary key,
  label text not null,
  weight_overrides jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  active boolean not null default true
);

comment on table public.badge_service_types is
  'Sage Badge company service taxonomy; weight_overrides keys match badge_pillar_scores.pillar_key.';

insert into public.badge_service_types (id, label, weight_overrides, sort_order) values
  ('general', 'General senior services', '{}'::jsonb, 0),
  ('home-modification', 'Home modification / safety', '{"safety_environment": 1.5, "accessibility": 1.5}'::jsonb, 10),
  ('dme', 'DME / medical equipment', '{"safety_environment": 1.5, "continuity_of_support": 1.5}'::jsonb, 20),
  ('home-health', 'Home health / care coordination', '{"continuity_of_support": 1.5, "caregiver_access_supportability": 1.5}'::jsonb, 30),
  ('insurance-benefits', 'Insurance / benefits navigation', '{"communication_transparency": 1.5, "dignity_autonomy": 1.5}'::jsonb, 40),
  ('fintech-billing', 'FinTech / billing / payments', '{"communication_transparency": 1.5, "technology_ease_of_use": 1.5}'::jsonb, 50),
  ('telehealth', 'Telehealth / remote monitoring', '{"technology_ease_of_use": 1.5, "accessibility": 1.5}'::jsonb, 60),
  ('community-transport', 'Community / transportation', '{"accessibility": 1.5, "continuity_of_support": 1.5}'::jsonb, 70),
  ('legal-estate', 'Legal / estate planning', '{"communication_transparency": 1.5, "dignity_autonomy": 1.5}'::jsonb, 80)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Staff roles (assessor / moderator / admin)
-- ---------------------------------------------------------------------------
create table if not exists public.badge_staff_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('assessor', 'moderator', 'admin')),
  granted_at timestamptz not null default now()
);

create or replace function public.badge_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.badge_staff_roles r
    where r.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Companies
-- ---------------------------------------------------------------------------
create table if not exists public.badge_companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  legal_name text not null,
  display_name text not null,
  website_url text,
  primary_service_type_id text not null references public.badge_service_types (id),
  description text,
  logo_storage_path text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists badge_companies_status_idx on public.badge_companies (status);
create index if not exists badge_companies_service_type_idx on public.badge_companies (primary_service_type_id);

-- ---------------------------------------------------------------------------
-- Assessments + pillar scores
-- ---------------------------------------------------------------------------
create table if not exists public.badge_assessments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.badge_companies (id) on delete cascade,
  assessor_user_id uuid not null references auth.users (id),
  charter_version text not null default '1.0',
  assessment_type text not null default 'initial'
    check (assessment_type in ('initial', 'renewal', 'triggered')),
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'published', 'superseded')),
  composite_score numeric(3, 1),
  base_level text check (base_level in (
    'limited', 'emerging', 'ready', 'trusted', 'exceptional'
  )),
  wpe_adjusted_level text check (wpe_adjusted_level in (
    'limited', 'emerging', 'ready', 'trusted', 'exceptional'
  )),
  effective_level text check (effective_level in (
    'limited', 'emerging', 'ready', 'trusted', 'exceptional'
  )),
  floor_violations jsonb not null default '[]'::jsonb,
  evidence_notes text,
  assessed_at timestamptz not null default now(),
  next_review_due timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists badge_assessments_company_idx on public.badge_assessments (company_id, status);

create table if not exists public.badge_pillar_scores (
  assessment_id uuid not null references public.badge_assessments (id) on delete cascade,
  pillar_key text not null check (pillar_key in (
    'accessibility',
    'safety_environment',
    'communication_transparency',
    'dignity_autonomy',
    'continuity_of_support',
    'caregiver_access_supportability',
    'technology_ease_of_use'
  )),
  score smallint check (score between 1 and 5),
  is_na boolean not null default false,
  na_justification text,
  assessor_notes text,
  primary key (assessment_id, pillar_key),
  constraint badge_pillar_scores_na_or_score check (
    (is_na = true and score is null) or (is_na = false and score is not null)
  )
);

-- ---------------------------------------------------------------------------
-- Published certification snapshots (immutable)
-- ---------------------------------------------------------------------------
create table if not exists public.badge_certification_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.badge_companies (id) on delete cascade,
  assessment_id uuid not null references public.badge_assessments (id) on delete cascade,
  effective_level text not null,
  composite_score numeric(3, 1) not null,
  pillar_scores jsonb not null default '{}'::jsonb,
  charter_version text not null,
  published_at timestamptz not null default now()
);

create index if not exists badge_cert_snapshots_company_idx
  on public.badge_certification_snapshots (company_id, published_at desc);

-- ---------------------------------------------------------------------------
-- WPE barriers + submissions
-- ---------------------------------------------------------------------------
create table if not exists public.badge_barrier_types (
  id text primary key,
  label text not null,
  sort_order int not null default 0
);

insert into public.badge_barrier_types (id, label, sort_order) values
  ('process_complexity', 'Process complexity', 10),
  ('poor_customer_service', 'Poor customer service', 20),
  ('hidden_fees', 'Hidden fees or unclear pricing', 30),
  ('technology_friction', 'Technology friction', 40),
  ('caregiver_blocked', 'Caregiver blocked from helping', 50),
  ('accessibility_barriers', 'Accessibility barriers', 60),
  ('long_wait_times', 'Long wait times', 70),
  ('lack_of_follow_up', 'Lack of follow-up', 80),
  ('confusing_communication', 'Confusing communication', 90),
  ('other', 'Other', 100)
on conflict (id) do nothing;

create table if not exists public.badge_wpe_submissions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.badge_companies (id) on delete cascade,
  submitter_user_id uuid not null references auth.users (id) on delete cascade,
  overall_rating smallint not null check (overall_rating between 1 and 5),
  supports_living_in_place text not null check (
    supports_living_in_place in ('yes', 'no', 'somewhat')
  ),
  caregiver_access text not null check (
    caregiver_access in ('easy', 'difficult', 'not_possible')
  ),
  technology_rating smallint not null check (technology_rating between 1 and 5),
  narrative text,
  submitter_role text not null check (
    submitter_role in ('user', 'caregiver', 'professional')
  ),
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'rejected')),
  moderated_by uuid references auth.users (id),
  moderated_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists badge_wpe_company_moderation_idx
  on public.badge_wpe_submissions (company_id, moderation_status, created_at desc);

create table if not exists public.badge_wpe_barrier_tags (
  submission_id uuid not null references public.badge_wpe_submissions (id) on delete cascade,
  barrier_type_id text not null references public.badge_barrier_types (id),
  primary key (submission_id, barrier_type_id)
);

-- ---------------------------------------------------------------------------
-- Company program inquiries (assessment + Sage Panthers consulting)
-- ---------------------------------------------------------------------------
create table if not exists public.badge_company_inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null check (inquiry_type in (
    'sage_verified_assessment',
    'sage_panthers_consulting',
    'beta_testing',
    'improvement_pathway',
    'general'
  )),
  company_name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  website_url text,
  service_type_interest text references public.badge_service_types (id),
  message text not null,
  sage_panthers_interest boolean not null default false,
  panthers_engagement_types text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'triaged', 'closed')),
  internal_notes text,
  created_at timestamptz not null default now()
);

create index if not exists badge_company_inquiries_status_idx
  on public.badge_company_inquiries (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Public views (no PII)
-- ---------------------------------------------------------------------------
create or replace view public.badge_companies_public as
select
  c.id,
  c.slug,
  c.display_name,
  c.website_url,
  c.description,
  c.logo_storage_path,
  st.label as service_type_label,
  s.effective_level,
  s.composite_score,
  s.pillar_scores,
  s.charter_version,
  s.published_at as certified_at,
  a.next_review_due
from public.badge_companies c
join public.badge_service_types st on st.id = c.primary_service_type_id
left join lateral (
  select cs.*
  from public.badge_certification_snapshots cs
  where cs.company_id = c.id
  order by cs.published_at desc
  limit 1
) s on true
left join public.badge_assessments a on a.id = s.assessment_id
where c.status = 'published'
  and s.effective_level in ('ready', 'trusted', 'exceptional');

create or replace view public.badge_wpe_aggregates_public as
select
  w.company_id,
  count(*) filter (where w.moderation_status = 'approved') as approved_count,
  round(avg(w.overall_rating) filter (where w.moderation_status = 'approved'), 2) as overall_avg,
  round(
    100.0 * count(*) filter (
      where w.moderation_status = 'approved'
        and w.supports_living_in_place in ('yes', 'somewhat')
    ) / nullif(count(*) filter (where w.moderation_status = 'approved'), 0),
    1
  ) as supports_living_in_place_pct,
  round(
    100.0 * count(*) filter (
      where w.moderation_status = 'approved' and w.caregiver_access = 'easy'
    ) / nullif(count(*) filter (where w.moderation_status = 'approved'), 0),
    1
  ) as caregiver_easy_pct,
  round(avg(w.technology_rating) filter (where w.moderation_status = 'approved'), 2) as technology_avg
from public.badge_wpe_submissions w
where w.created_at >= now() - interval '24 months'
group by w.company_id;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.badge_service_types enable row level security;
alter table public.badge_staff_roles enable row level security;
alter table public.badge_companies enable row level security;
alter table public.badge_assessments enable row level security;
alter table public.badge_pillar_scores enable row level security;
alter table public.badge_certification_snapshots enable row level security;
alter table public.badge_barrier_types enable row level security;
alter table public.badge_wpe_submissions enable row level security;
alter table public.badge_wpe_barrier_tags enable row level security;
alter table public.badge_company_inquiries enable row level security;

-- Public read: taxonomy + barriers
drop policy if exists "badge_service_types_public_read" on public.badge_service_types;
create policy "badge_service_types_public_read"
  on public.badge_service_types for select
  using (active = true);

drop policy if exists "badge_barrier_types_public_read" on public.badge_barrier_types;
create policy "badge_barrier_types_public_read"
  on public.badge_barrier_types for select
  using (true);

-- Staff full access on operational tables
drop policy if exists "badge_staff_companies_all" on public.badge_companies;
create policy "badge_staff_companies_all"
  on public.badge_companies for all
  using (public.badge_is_staff())
  with check (public.badge_is_staff());

drop policy if exists "badge_staff_assessments_all" on public.badge_assessments;
create policy "badge_staff_assessments_all"
  on public.badge_assessments for all
  using (public.badge_is_staff())
  with check (public.badge_is_staff());

drop policy if exists "badge_staff_pillar_scores_all" on public.badge_pillar_scores;
create policy "badge_staff_pillar_scores_all"
  on public.badge_pillar_scores for all
  using (public.badge_is_staff())
  with check (public.badge_is_staff());

drop policy if exists "badge_staff_snapshots_all" on public.badge_certification_snapshots;
create policy "badge_staff_snapshots_all"
  on public.badge_certification_snapshots for all
  using (public.badge_is_staff())
  with check (public.badge_is_staff());

drop policy if exists "badge_staff_wpe_all" on public.badge_wpe_submissions;
create policy "badge_staff_wpe_all"
  on public.badge_wpe_submissions for all
  using (public.badge_is_staff())
  with check (public.badge_is_staff());

drop policy if exists "badge_staff_wpe_tags_all" on public.badge_wpe_barrier_tags;
create policy "badge_staff_wpe_tags_all"
  on public.badge_wpe_barrier_tags for all
  using (public.badge_is_staff())
  with check (public.badge_is_staff());

drop policy if exists "badge_staff_inquiries_all" on public.badge_company_inquiries;
create policy "badge_staff_inquiries_all"
  on public.badge_company_inquiries for all
  using (public.badge_is_staff())
  with check (public.badge_is_staff());

drop policy if exists "badge_staff_roles_admin_read" on public.badge_staff_roles;
create policy "badge_staff_roles_admin_read"
  on public.badge_staff_roles for select
  using (public.badge_is_staff());

-- Authenticated users: read own WPE submissions
drop policy if exists "badge_wpe_select_own" on public.badge_wpe_submissions;
create policy "badge_wpe_select_own"
  on public.badge_wpe_submissions for select
  to authenticated
  using (submitter_user_id = auth.uid());

-- Note: INSERT for WPE and company inquiries should go through Edge Functions
-- (service role). Revoke direct insert after functions are deployed, mirroring
-- migration 002_contact_submissions_edge_only.sql.

grant select on public.badge_companies_public to anon, authenticated;
grant select on public.badge_wpe_aggregates_public to anon, authenticated;

comment on table public.badge_company_inquiries is
  'Organization inquiries for Sage Verified assessment, Sage Panthers consulting, and beta testing.';
