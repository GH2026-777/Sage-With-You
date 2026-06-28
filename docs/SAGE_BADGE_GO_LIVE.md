# Sage Badge — Go-live checklist

**Program:** Sage With You — Living in Place  
**Access before go-live:** Site-wide staging password gate (`VITE_ENABLE_PASSWORD_GATE` not `false`). After unlock, users get **full** Sage Badge access (no second gate).  
**Related:** `SAGE_WITH_YOU_FULL_SITE_AUDIT.md`, `SAGE_BADGE_PROGRAM_STATUS_WHITEPAPER_v1.1.md`, `SAGE_BADGE_MINI_WHITEPAPER.md`, `SAGE_BADGE_SCORING_CHARTER.md`, `SAGE_BADGE_PHASE1_DATA_MODEL.md`, `PRE-DEPLOYMENT-CHECKLIST.md`

---

## Owner decisions (locked)

| Item | Value |
|------|--------|
| Badge program inquiry mailbox | `SageWithYou@sageelan.org` |
| Supabase / Edge SMTP identity | `info@sageelan.org` (same pattern as `submit-contact`) |
| Company pricing | Company-paid at launch |
| Safety/Dignity floor | Keep ≤ 3 (Charter v1.0) |
| Pre–go-live access | Staging password gate ON; full badge UX once past gate |

---

## Migration troubleshooting

**Error: policy `badge_service_types_public_read` already exists**

`005` already ran through the RLS section on a previous attempt. Do **not** paste the full `005_sage_badge_phase1.sql` again.

1. Run `supabase/migrations/005_badge_rls_repair.sql` (finishes policies + view grants).
2. Run `006_community_company_nomination.sql` if you need community company suggestions.
3. Confirm with:

```sql
select tablename, policyname
from pg_policies
where schemaname = 'public' and tablename like 'badge%'
order by tablename, policyname;
```

---

## After migration `005_sage_badge_phase1.sql` (do now)

Run in Supabase SQL Editor after migration succeeds:

```sql
-- Replace with your auth.users id (Dashboard → Authentication → Users → copy UUID)
insert into public.badge_staff_roles (user_id, role)
values ('YOUR-USER-UUID-HERE', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

Verify:

```sql
select * from public.badge_service_types order by sort_order;
select * from public.badge_barrier_types order by sort_order;
```

---

## Supabase ops (before badge program is public)

### Migration

- [ ] `005_sage_badge_phase1.sql` applied  
- [ ] At least one row in `badge_staff_roles` (your admin user)

### Edge Function secrets (`submit-badge-inquiry` when deployed)

| Secret | Value |
|--------|--------|
| `BADGE_INQUIRY_NOTIFY_TO` | `SageWithYou@sageelan.org` |
| `SAGE_PANTHERS_INQUIRER_NOTIFY_TO` | Confirm with owner (separate from participant hub mail; triage via Foundation) |
| `CONTACT_SMTP_*` | Same as contact form — send **from** `info@sageelan.org` |

Mirror rate-limit pattern from `004_contact_submit_rate_limit.sql` for badge inquiries when Edge Function ships.

### Functions to deploy (Phase 1)

- [ ] `submit-badge-inquiry`  
- [ ] `submit-badge-wpe`  
- [ ] `publish-badge-assessment` (staff-only)

---

## Legal & policy (required before public go-live)

- [ ] **SOW templates** for company-paid packages (Assessment, Insight Panel, Beta Cohort)  
- [ ] **Public disclaimer** on badge profiles (not medical advice; not regulatory licensure)  
- [ ] **WPE moderation policy** + moderated narrative rules  
- [ ] **Privacy / Terms** update for WPE submissions and company profiles  
- [ ] **Conflict-of-interest rule** for beta participants submitting WPE (Professional role)  
- [ ] Counsel review of provisional badge language  

---

## Product & content (before public go-live)

- [ ] Charter v1.0 published on `/sage-badge`  
- [ ] `/sage-badge/for-companies` with inquiry form live  
- [ ] WPE n=15 threshold confirmed for public aggregates (or pilot-only lower n documented)  
- [ ] Pilot: 5–10 companies assessed internally; calibrate assessor consistency  
- [ ] Sage Panthers FAQ cross-link (employer → Sage With You for-companies)  
- [ ] Company logo Storage bucket `badge-logos` (if using uploads)

---

## Staging gate & SEO (pre– vs post–go-live)

**Until public go-live:**

- [ ] `VITE_ENABLE_PASSWORD_GATE` **not** set to `false` (gate ON)  
- [ ] `VITE_STAGING_GATE_PASSWORD` set in production build env  
- [ ] Site-wide `noindex` while gate active (existing `SiteMeta` behavior)  
- [ ] Smoke-test Sage Badge routes **after** entering staging password  

**Public go-live:**

- [ ] Set `VITE_ENABLE_PASSWORD_GATE=false` in `.env.production`  
- [ ] Rebuild and redeploy static `dist/`  
- [ ] Do **not** remove `PasswordGate` component from repo — env toggle only  
- [ ] Re-run smoke tests on `/sage-badge/*` without gate  
- [ ] Confirm badge directory and company profiles indexable (remove staging noindex)

---

## Smoke tests (with gate ON, then repeat at go-live)

- [ ] `/sage-badge` explainer loads after gate unlock  
- [ ] `/sage-badge/for-companies` inquiry submits → row in `badge_company_inquiries` + email to `SageWithYou@sageelan.org`  
- [ ] Panthers/consulting inquiry routes to separate notify mailbox  
- [ ] WPE form (signed-in) → `badge_wpe_submissions` pending moderation  
- [ ] Staff publish assessment → `badge_certification_snapshots` + public view  
- [ ] Public directory shows only Ready / Trusted / Exceptional  

---

## Reminders

1. **Staff role** — without `badge_staff_roles`, assessor admin UI will not work.  
2. **Migration 002 pattern** — after Edge Functions deploy, revoke direct anon insert on `badge_company_inquiries` and `badge_wpe_submissions`.  
3. **Charter floors** — Safety & Dignity ≤ 3 blocks public badge; no pilot exception.  
4. **Email** — notifications to `SageWithYou@sageelan.org`; SMTP sends via `info@sageelan.org` secrets.  

---

**SageÉlan Foundation — Sage With You — Sage Badge**
