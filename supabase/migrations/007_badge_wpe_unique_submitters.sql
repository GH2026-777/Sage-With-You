-- WPE aggregates: add unique submitter count for charter n>=10 threshold (§6.2)
-- Must drop first: CREATE OR REPLACE cannot insert a column before existing ones.

drop view if exists public.badge_wpe_aggregates_public;

create view public.badge_wpe_aggregates_public as
select
  w.company_id,
  count(*) filter (where w.moderation_status = 'approved') as approved_count,
  count(distinct w.submitter_user_id) filter (where w.moderation_status = 'approved')
    as unique_submitter_count,
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

grant select on public.badge_wpe_aggregates_public to anon, authenticated;
