# Sage Badge: Program Status Whitepaper (v1.1)

| | |
|---|---|
| **Organization** | SageÉlan Foundation, Inc. (Sage With You program) |
| **Program** | Sage With You · Living in Place |
| **Charter version** | 1.0 (scoring rules unchanged) |
| **Document version** | 1.1 |
| **Last updated** | June 2, 2026 |
| **Supersedes** | `SAGE_BADGE_MINI_WHITEPAPER.md` v1.0 for **implementation status** only |
| **Companion** | `SAGE_WITH_YOU_FULL_SITE_AUDIT.md` (full site audit, June 2026) |

**Related:** `SAGE_BADGE_SCORING_CHARTER.md`, `SAGE_BADGE_PHASE1_DATA_MODEL.md`, `SAGE_BADGE_GO_LIVE.md`

---

## 1. Purpose (unchanged)

The **Sage Badge** recognizes organizations that help people **age safely and confidently at home**. It combines **The Sage Standard** (assessor scoring on seven pillars) and **What People Are Experiencing (WPE)** (moderated community feedback) to award **Sage Verified** status when thresholds are met.

This v1.1 document adds **what is built in Sage With You today** versus **what remains before public program launch**.

---

## 2. Program model (summary)

### The seven pillars (1-5 each, or N/A)

Accessibility · Safety & Environment · Communication & Transparency · Dignity & Autonomy · Continuity of Support · Caregiver Access & Supportability · Technology & Ease of Use

### Public certification bands (Sage Standard)

| Level | Composite | Public badge |
|-------|-----------|--------------|
| Limited | 1.0 - 2.4 | No |
| Emerging | 2.5 - 3.2 | No |
| Ready | 3.3 - 3.9 | Yes |
| Trusted | 4.0 - 4.4 | Yes |
| Exceptional | 4.5 - 5.0 | Yes |

**Floors:** No public badge if any pillar ≤ 2, Safety ≤ 3, Dignity ≤ 3, or assessment older than 24 months without renewal.

### WPE (community layer)

- Does not replace The Sage Standard; can adjust displayed level when **≥ 15** approved submissions, **≥ 10** unique submitters, within 24 months (Charter §6.2).  
- Signed-in submitters; staff moderation required before public impact.

Full rules: `SAGE_BADGE_SCORING_CHARTER.md`.

---

## 3. Stakeholder journeys

### Organizations

1. **For organizations** (`/sage-badge/for-companies`): assessment, improvement pathway, Sage Panthers consulting, beta testing, or general inquiry.  
2. Staff triage via `badge_company_inquiries` and email to `SageWithYou@sageelan.org`.  
3. Formal assessment and publish (see §4 gaps).

### Community

1. **Share your experience** (`/sage-badge/experience`): WPE for **published** companies only (sign-in required).  
2. Staff approve/reject in **Sage Badge admin**.  
3. **Community nomination** (`/sage-badge/suggest-company`): intake for organizations not yet listed; **not promoted** in site footer or Sage Badge subnav (in-context links only).

### Sage staff

1. **`badge_staff_roles`** in Supabase (assessor, moderator, admin).  
2. **Admin** (`/sage-badge/admin`): inquiries, WPE moderation, company list, **Publish UAT demo company**.  
3. Production assessor workflow: **not yet in app** (see §4).

### Sage Panthers (adjacent)

Sage Insight Panel and beta cohorts inform pillar gaps; **do not certify**. See `SAGE_BADGE_COMPANY_SUPPORT_AND_SAGE_PANTHERS.md`.

---

## 4. Implementation status (Sage With You, June 2026)

| Capability | Status | Notes |
|------------|--------|-------|
| Public program pages | **Live in repo** | Overview, directory, profile, for-companies, experience |
| DB schema + RLS | **In repo** | Migrations `005`, `005_badge_rls_repair`, `006` |
| Org / nomination inquiries | **Live** | `submit-badge-inquiry` Edge Function |
| WPE submit | **Live** | `submit-badge-wpe`; auth required |
| WPE moderation UI | **Live** | Admin approve/reject |
| Public directory view | **Live** | `badge_companies_public`; empty until publish |
| UAT demo company | **Live** | Admin button; Trusted 4.2 snapshot |
| Production assessor scoring UI | **Missing** | No in-browser pillar entry for real assessments |
| `publish-badge-assessment` function | **Missing** | Documented in data model; not in `supabase/functions` |
| Charter WPE threshold on profile | **Mismatch** | UI shows WPE block at ≥3 approved; charter requires ≥15 for aggregates |
| Profile legal disclaimer | **Missing** | Required in go-live checklist |
| Company logo uploads | **Missing** | `logo_storage_path` column; no upload UI |
| Badge rate limiting | **Unconfirmed** | Contact form has pattern; badge tables TBD |
| Email notifications | **Deploy-dependent** | `CONTACT_SMTP_*`, `BADGE_INQUIRY_NOTIFY_TO` |

### Frontend routes (Sage Badge)

| Route | Role |
|-------|------|
| `/sage-badge` | Program overview |
| `/sage-badge/companies` | Verified directory |
| `/sage-badge/companies/:slug` | Public profile |
| `/sage-badge/for-companies` | Organization inquiries |
| `/sage-badge/experience` | WPE (signed in) |
| `/sage-badge/suggest-company` | Community nomination (low visibility) |
| `/sage-badge/admin` | Staff only |

---

## 5. End-to-end flow (text)

```
Organizations → For organizations form → Staff triage → Sage Standard assessment
     → Score 7 pillars → Composite + floors → Publish certification snapshot
     → Public directory → Company profile

Community (signed in) → Share experience → Moderation → Approved WPE (if n meets charter)
     → May adjust displayed level per charter rules

Optional: Community nomination → Staff review (not instant listing)
Optional: Sage Panthers Insight / beta → Informs assessment only
```

**Production gap:** the middle step “Publish certification snapshot” for real companies is **manual/SQL or future Edge Function**, except the **UAT demo** path in admin.

---

## 6. Technology stack (Phase 1)

| Layer | Implementation |
|-------|----------------|
| Site | Vite + React + React Router; static deploy |
| Auth | Supabase email/password |
| Data | Supabase Postgres + RLS |
| Public reads | Views `badge_companies_public`, `badge_wpe_aggregates_public` |
| Writes (visitor) | Edge Functions with service role |
| Email | Microsoft 365 SMTP via Edge (`info@sageelan.org`) |

**Out of scope Phase 1:** company portal, payments, embeddable badge CDN, Panthers DB sync.

---

## 7. Pre-launch requirements (consolidated)

### Operator (Supabase + deploy)

- [ ] Migrations `001` through `006` applied  
- [ ] `badge_staff_roles` populated  
- [ ] Edge Functions deployed and secrets set  
- [ ] Frontend built with correct `.env.production`  
- [ ] Smoke tests in `SAGE_BADGE_GO_LIVE.md`

### Product / legal

- [ ] At least one intentional published company (or labeled demo)  
- [ ] Fix WPE display threshold vs charter (or document pilot exception)  
- [ ] On-profile disclaimer and updated Privacy/Terms  
- [ ] WPE moderation policy visible to submitters  
- [ ] Assessor workflow for real companies (tool or function)

### Site (broader than Badge)

- [ ] Library assets in Storage or clear “coming soon” messaging site-wide  
- [ ] `sitemap.xml` includes Sage Badge URLs  
- [ ] Public go-live: `VITE_ENABLE_PASSWORD_GATE=false` when ready  

---

## 8. Governance (locked)

| Decision | Status |
|----------|--------|
| Safety & Dignity floors | Locked for Charter v1.0 |
| Inquiry mailbox | `SageWithYou@sageelan.org` |
| SMTP from address | `info@sageelan.org` |
| Company-paid model | Locked at launch |
| Staging gate before public | ON by default |

---

## 9. Elevator summary

Sage Badge helps families find organizations that support **living in place** through a **seven-pillar Sage Standard** and **moderated community experience (WPE)**. The Sage With You **website implements public discovery, inquiries, WPE submission, and staff moderation**, plus a **UAT demo publish** path. **Production assessment publishing and charter-complete WPE display** still require engineering and ops completion before the program is publicly trustworthy at scale.

---

## 10. Document history

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-06-02 | Mini whitepaper (process only) — `SAGE_BADGE_MINI_WHITEPAPER.md` |
| 1.1 | 2026-06-02 | Added implementation status, gaps, audit cross-reference |

---

## 11. Export to PDF

Use the same methods as `SAGE_BADGE_MINI_WHITEPAPER.md` §12 (Markdown PDF extension, Pandoc, or print from GitHub). Prefer this **v1.1** document for board or partner briefings that need **build status**; use **v1.0 mini whitepaper** for a shorter process-only handout.
