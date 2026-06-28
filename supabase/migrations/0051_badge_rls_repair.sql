-- Safe to run if 005 failed with "policy ... already exists" mid-file.
-- Re-applies RLS policies and grants only (no tables). Idempotent.

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

drop policy if exists "badge_service_types_public_read" on public.badge_service_types;
create policy "badge_service_types_public_read"
  on public.badge_service_types for select
  using (active = true);

drop policy if exists "badge_barrier_types_public_read" on public.badge_barrier_types;
create policy "badge_barrier_types_public_read"
  on public.badge_barrier_types for select
  using (true);

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

drop policy if exists "badge_wpe_select_own" on public.badge_wpe_submissions;
create policy "badge_wpe_select_own"
  on public.badge_wpe_submissions for select
  to authenticated
  using (submitter_user_id = auth.uid());

grant select on public.badge_companies_public to anon, authenticated;
grant select on public.badge_wpe_aggregates_public to anon, authenticated;
