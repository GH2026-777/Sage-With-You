-- Allow community members to nominate organizations for the Sage Badge directory.

alter table public.badge_company_inquiries
  drop constraint if exists badge_company_inquiries_inquiry_type_check;

alter table public.badge_company_inquiries
  add constraint badge_company_inquiries_inquiry_type_check
  check (inquiry_type in (
    'sage_verified_assessment',
    'sage_panthers_consulting',
    'beta_testing',
    'improvement_pathway',
    'general',
    'community_nomination'
  ));

comment on column public.badge_company_inquiries.inquiry_type is
  'Includes community_nomination when a visitor suggests an organization for the directory.';
