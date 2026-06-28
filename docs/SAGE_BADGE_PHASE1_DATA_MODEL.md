# Sage Badge — Phase 1 Data Model (Supabase)

**Project:** Sage With You (`htckswutkpktxclyijwk`)  
**Version:** 1.0 draft  
**Migration file:** `supabase/migrations/005_sage_badge_phase1.sql`  
**Related:** `SAGE_BADGE_MINI_WHITEPAPER.md`, `SAGE_BADGE_SCORING_CHARTER.md`, `SAGE_BADGE_COMPANY_SUPPORT_AND_SAGE_PANTHERS.md`

---

## 1. Phase 1 scope

**In scope**

- Internal assessor workflow (staff-only writes)  
- Company registry + Sage Standard assessments + pillar scores  
- Certification snapshot (computed level at publish time)  
- WPE submission (authenticated users) + moderation queue  
- Public read via views (published companies only)  
- Company program inquiries (assessment interest, consulting, beta testing)  

**Out of scope (Phase 2+)**

- Company self-service portal  
- Embeddable badge CDN  
- Cross-project Supabase sync with Sage Panthers (use intake + email routing in Phase 1)  
- Payment / invoicing  

---

## 2. Architecture principles (aligned with existing repo)

Matches patterns from `001_contact_submissions.sql` and `submit-contact` Edge Function:

| Pattern | Application |
|---------|-------------|
| RLS on all tables | Yes |
| Public inserts via Edge Function | WPE + company inquiries (not direct anon insert to sensitive tables) |
| Staff operations | `service_role` in Edge Functions or `badge_staff` role table |
| Rate limiting | Reuse `contact_submit_client_events` pattern for WPE/inquiries |
| SMTP notifications | Extend `submit-contact` or add `submit-badge-inquiry` |

---

## 3. Entity relationship overview

```
badge_service_types
       │
badge_companies ──┬── badge_assessments ── badge_pillar_scores
                  │         │
                  │         └── badge_certification_snapshots
                  │
                  ├── badge_wpe_submissions ── badge_wpe_barrier_tags
                  │                                    │
                  │                            badge_barrier_types
                  │
                  └── badge_company_inquiries

badge_staff_roles (links auth.users → staff capabilities)
```

---

## 4. Table definitions (summary)

### 4.1 `badge_service_types`

Controlled taxonomy for company classification and pillar weights.

| Column | Type | Notes |
|--------|------|-------|
| id | text PK | slug, e.g. `home-modification` |
| label | text | Display name |
| weight_overrides | jsonb | e.g. `{"safety_environment": 1.5, "accessibility": 1.5}` |
| sort_order | int | UI ordering |
| active | boolean | default true |

### 4.2 `badge_companies`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| slug | text UNIQUE | URL-safe |
| legal_name | text | |
| display_name | text | Public name |
| website_url | text | nullable |
| primary_service_type_id | text FK | → badge_service_types |
| description | text | public summary |
| logo_storage_path | text | optional Supabase Storage |
| status | text | `draft` \| `published` \| `archived` |
| created_at, updated_at | timestamptz | |

### 4.3 `badge_assessments`

One row per assessor evaluation event.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| company_id | uuid FK | |
| assessor_user_id | uuid FK | auth.users |
| charter_version | text | e.g. `1.0` |
| assessment_type | text | `initial` \| `renewal` \| `triggered` |
| status | text | `draft` \| `submitted` \| `published` \| `superseded` |
| composite_score | numeric(3,1) | computed on submit |
| base_level | text | Limited … Exceptional (Standard only) |
| wpe_adjusted_level | text | nullable; after WPE rules |
| effective_level | text | what public badge shows |
| floor_violations | jsonb | array of rule codes |
| evidence_notes | text | internal |
| assessed_at | timestamptz | |
| next_review_due | timestamptz | |
| published_at | timestamptz | nullable |

### 4.4 `badge_pillar_scores`

| Column | Type | Notes |
|--------|------|-------|
| assessment_id | uuid FK | |
| pillar_key | text | enum-like: `accessibility`, `safety_environment`, … |
| score | smallint | 1–5, nullable if N/A |
| is_na | boolean | default false |
| na_justification | text | required if is_na |
| assessor_notes | text | optional |
| PRIMARY KEY (assessment_id, pillar_key) | | |

### 4.5 `badge_certification_snapshots`

Immutable publish record for audit trail.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| company_id | uuid FK | |
| assessment_id | uuid FK | |
| effective_level | text | |
| composite_score | numeric(3,1) | |
| pillar_scores | jsonb | frozen copy for public history |
| charter_version | text | |
| published_at | timestamptz | |

### 4.6 `badge_barrier_types`

Seed data for WPE multi-select.

| Column | Type |
|--------|------|
| id | text PK |
| label | text |
| sort_order | int |

### 4.7 `badge_wpe_submissions`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| company_id | uuid FK | |
| submitter_user_id | uuid FK | auth.users (required Phase 1) |
| overall_rating | smallint | 1–5 |
| supports_living_in_place | text | `yes` \| `no` \| `somewhat` |
| caregiver_access | text | `easy` \| `difficult` \| `not_possible` |
| technology_rating | smallint | 1–5 |
| narrative | text | nullable; moderated |
| submitter_role | text | `user` \| `caregiver` \| `professional` |
| moderation_status | text | `pending` \| `approved` \| `rejected` |
| moderated_by | uuid | nullable |
| moderated_at | timestamptz | nullable |
| created_at | timestamptz | |

### 4.8 `badge_wpe_barrier_tags`

| Column | Type |
|--------|------|
| submission_id | uuid FK |
| barrier_type_id | text FK |
| PRIMARY KEY (submission_id, barrier_type_id) | |

### 4.9 `badge_company_inquiries`

Company-facing “Contact us” for badge program + Sage Panthers consulting paths.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| inquiry_type | text | see §6 |
| company_name | text | |
| contact_name | text | |
| contact_email | text | |
| contact_phone | text | nullable |
| website_url | text | nullable |
| service_type_interest | text | nullable FK or free text Phase 1 |
| message | text | |
| sage_panthers_interest | boolean | user opted into senior insight program |
| panthers_engagement_types | text[] | e.g. `{beta_testing, usability_review}` |
| status | text | `new` \| `triaged` \| `closed` |
| internal_notes | text | staff only |
| created_at | timestamptz | |

### 4.10 `badge_staff_roles`

| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid PK FK | auth.users |
| role | text | `assessor` \| `moderator` \| `admin` |
| granted_at | timestamptz | |

---

## 5. Public views

### `badge_companies_public`

Published companies with latest snapshot: display_name, slug, effective_level, composite_score, pillar_scores, assessed_at, next_review_due.

### `badge_wpe_aggregates_public`

Per company (only if n ≥ threshold from charter):

- submission_count, overall_avg, supports_yes_pct, caregiver_easy_pct, technology_avg, top_barriers

Views enforce **no PII** from WPE submitters.

---

## 6. Inquiry types (`badge_company_inquiries.inquiry_type`)

| Value | Notify mailbox (Edge Function secret) | Program owner |
|-------|--------------------------------------|---------------|
| `sage_verified_assessment` | `BADGE_INQUIRY_NOTIFY_TO` | Sage With You / Foundation assessor queue |
| `improvement_pathway` | `BADGE_INQUIRY_NOTIFY_TO` | Sage With You assessor queue |
| `general` | `BADGE_INQUIRY_NOTIFY_TO` | Sage With You general triage |
| `sage_panthers_consulting` | `SAGE_PANTHERS_INQUIRER_NOTIFY_TO` | Sage Panthers program team |
| `beta_testing` | **Both** — primary `BADGE_INQUIRY_NOTIFY_TO`, CC `SAGE_PANTHERS_INQUIRER_NOTIFY_TO` | Joint triage |

**Owner decision (locked):** Sage Panthers intake is **separate** from participant hub contact (`SagePanthers@sageelan.org`). Supabase Edge Functions send mail using the same **`info@sageelan.org`** SMTP secrets as `submit-contact` (`CONTACT_SMTP_*`).

| Secret | Address | Notes |
|--------|---------|--------|
| `BADGE_INQUIRY_NOTIFY_TO` | **`SageWithYou@sageelan.org`** | Assessment, improvement pathway, general badge inquiries |
| `SAGE_PANTHERS_INQUIRER_NOTIFY_TO` | *Owner to confirm* | Sage Insight Panel / consulting from Sage With You form only |
| `CONTACT_SMTP_FROM` | **`info@sageelan.org`** | Shared Supabase SMTP identity for all Edge Functions |

Do **not** route Sage With You company consulting inquiries to `SagePanthers@sageelan.org` (participant/waitlist hub).

Document secrets in Supabase → Edge Functions when `submit-badge-inquiry` is deployed.

---

## 7. RLS policy sketch

| Table | anon | authenticated | staff |
|-------|------|---------------|-------|
| badge_service_types | SELECT active | SELECT | ALL |
| badge_companies | SELECT published via view | SELECT published | ALL |
| badge_assessments | — | — | ALL |
| badge_pillar_scores | — | — | ALL |
| badge_wpe_submissions | — | INSERT own (pending only) via RPC/Edge | ALL |
| badge_wpe_submissions | — | SELECT own rows | ALL |
| badge_company_inquiries | INSERT via Edge only | INSERT via Edge | ALL |

Direct anon INSERT to `badge_wpe_submissions` and `badge_company_inquiries` should be **revoked** (mirror `002_contact_submissions_edge_only.sql`).

---

## 8. Edge Functions (Phase 1)

| Function | Purpose |
|----------|---------|
| `submit-badge-wpe` | Validate, rate-limit, insert WPE + barriers |
| `submit-badge-inquiry` | Company contact form; route by `inquiry_type` |
| `publish-badge-assessment` | Staff-only: compute levels, snapshot, set company published |

Scoring logic should live in `_shared/badge-scoring.ts` (Deno) duplicated from charter rules so DB + UI stay aligned.

---

## 9. Frontend routes (Sage With You)

| Route | Audience | Phase |
|-------|----------|-------|
| `/sage-badge` | Public explainer | 1 |
| `/sage-badge/companies` | Directory | 1 |
| `/sage-badge/companies/:slug` | Profile + scorecard + WPE | 1 |
| `/sage-badge/experience` | WPE submission form | 1 |
| `/sage-badge/for-companies` | Programs + contact | 1 |
| `/sage-badge/admin/*` | Staff assessor UI | 1 (auth + staff role) |

Reuse `RequireSignIn` for WPE (already used on `/assessments`).

---

## 10. Implementation order

1. Run migration `005_sage_badge_phase1.sql`  
2. Seed service types + barrier types  
3. Add `_shared/badge-scoring.ts` + unit tests (vitest)  
4. Staff admin UI (minimal: company CRUD, assessment form, publish)  
5. Public directory + profile (read views)  
6. WPE form + moderation queue  
7. `/sage-badge/for-companies` + `submit-badge-inquiry`  
8. Pilot 5 companies internal; then publish  

---

## 11. Owner decisions

| Decision | Status | Resolution |
|----------|--------|------------|
| Package pricing | **Locked** | **Company-paid from day one**; grant-subsidized pilots may be added later as a separate track |
| Sage Panthers intake email | **Locked** | **Separate notify mailbox** from participant hub; Supabase SMTP via **`info@sageelan.org`** |
| Badge inquiry mailbox | **Locked** | **`SageWithYou@sageelan.org`** (`BADGE_INQUIRY_NOTIFY_TO`) |
| Pre–go-live access | **Locked** | Site staging password gate ON; **full Sage Badge access once past gate** |
| Safety/Dignity charter floors | **Locked** | **Keep** ≤ 3 rule (documented in Scoring Charter §5.1) |

- [ ] Confirm Supabase Storage bucket for company logos (`badge-logos`, public read)  
- [ ] Staff user IDs for initial `badge_staff_roles` seed  
- [ ] Final mailbox for `SAGE_PANTHERS_INQUIRER_NOTIFY_TO` (separate from participant hub; SMTP still `info@sageelan.org`)  
