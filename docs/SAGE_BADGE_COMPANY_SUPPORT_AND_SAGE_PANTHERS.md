# Sage Badge — Company Support & Sage Panthers Integration

**Program:** Sage With You — Living in Place + Sage Panthers  
**Version:** 1.0 draft  
**Related:** `SAGE_BADGE_MINI_WHITEPAPER.md`, `SAGE_BADGE_SCORING_CHARTER.md`, `SAGE_BADGE_PHASE1_DATA_MODEL.md`

---

## 1. Strategic fit

The Sage Badge program evaluates whether **companies** support Living in Place. Sage Panthers engages **experienced adults** in meaningful, compensated work. Connecting them is natural and differentiated:

| Sage Badge need | Sage Panthers supply |
|-----------------|----------------------|
| Authentic usability feedback | Seniors and caregivers with lived experience |
| Beta testing digital + service flows | Structured, dignified engagement (not unpaid “senior testers”) |
| Post-assessment remediation advice | Advisory/consulting cohorts scoped to pillar gaps |
| Credibility of WPE layer | Optional “Sage Insight Panel” submissions weighted as professional/lived-experience hybrid |

**Positioning name (recommended):** **Sage Insight Program** — *Senior-informed feedback for organizations pursuing Sage Verified status, delivered through the Sage Panthers program of the SageÉlan Foundation.*

This avoids implying Sage Panthers participants are employees of the rated company, or that Panthers grant certification.

---

## 2. What this is not

Align with existing Sage Panthers FAQ language for employers:

- **Not a staffing agency** or recruiter  
- **Not certifiers** — Panthers inform; Sage assessors score The Sage Standard  
- **Not unpaid labor** — compensation follows Sage Panthers models (stipend or contractor)  
- **Not a guarantee** of badge level improvement  

Companies receive **insights and optional pathways**; certification remains evidence-based under the Scoring Charter.

---

## 3. Company-facing offers (packages)

Launch with **three clear SKUs** on `/sage-badge/for-companies` to reduce sales friction:

### A. Sage Verified Assessment

- Foundation-led Sage Standard evaluation  
- Pillar scorecard + gap report  
- Public badge if Ready+  
- **Audience:** Companies ready for formal assessment  

### B. Sage Insight Panel (Sage Panthers)

- **2–4 facilitated sessions** with matched Sage Panthers  
- Focus: usability, communication clarity, caregiver flows, dignity in practice  
- Deliverable: structured feedback report mapped to **7 pillars** (not a numeric cert score)  
- **Audience:** Emerging companies or pre-assessment readiness  
- **Outcome:** Recommended actions before formal assessment; optional beta cohort follow-up  

### C. Living in Place Beta Cohort

- **6–8 week** structured beta with defined tasks (onboarding, support call, caregiver handoff, etc.)  
- Panthers + caregivers where applicable  
- Deliverable: pillar-tagged issue log + severity; feeds **internal** assessor prep and optional anonymized WPE-style quotes (with consent)  
- **Audience:** Digital products and service platforms  

**Enhancement:** Bundle **Assessment + Insight Panel** at a discount for first cohort of 10 companies (pilot pricing TBD by owner).

---

## 4. Contact Us UX (Sage With You)

Add a **For Organizations** section and dedicated form (or contact subject routing):

**Fields (extends existing contact pattern):**

- Organization name  
- Contact name / email / phone  
- Website  
- Primary service type (dropdown from `badge_service_types`)  
- **I am interested in:** (multi-select)  
  - Sage Verified assessment  
  - Sage Insight Panel (senior consulting)  
  - Beta testing cohort  
  - Improvement pathway (already assessed)  
  - General question  
- **Sage Panthers engagement** (checkbox): *“I understand senior participants are compensated through Sage Panthers program structures.”*  
- Message  

**Submit via:** `submit-badge-inquiry` Edge Function → `badge_company_inquiries` table.

**Confirmation email copy:** Acknowledge inquiry type; set expectation (e.g. “Sage Insight Panel inquiries are reviewed by the Sage Panthers program team within 5 business days”).

---

## 5. Operational workflow (cross-program)

```
Company submits inquiry (Sage With You)
        │
        ▼
Foundation triage (badge admin)
        │
        ├── sage_verified_assessment ──► assessor queue
        │
        ├── sage_panthers_consulting ──► email Sage Panthers program inbox
        │         │                      + tag in inquiry record
        │         ▼
        │   Panthers team: scope, match, compensation model
        │         │
        │         ▼
        │   Engagement runs (separate SOW / stipend)
        │         │
        │         └── Feedback report → Foundation assessor (optional input, not auto-score)
        │
        └── beta_testing ──► joint triage (badge + Panthers)
```

**Phase 1 technical integration:** Shared intake table (`badge_company_inquiries`) with **split email routing** by `inquiry_type` — badge program mailboxes vs Sage Panthers employer/consulting mailbox. No shared Supabase project required.  
**Phase 2:** Deep link from Sage With You company profile to Sage Panthers employer FAQ; shared CRM optional.

**Routing rule (locked):** `sage_panthers_consulting` → `SAGE_PANTHERS_INQUIRER_NOTIFY_TO` only. Never route to participant hub contact (`SagePanthers@sageelan.org`).

---

## 6. Matching Sage Panthers to company needs

| Company gap (pillar) | Typical Panther match |
|----------------------|------------------------|
| Technology & Ease of Use | Panthers with comfort testing apps + “low-tech proxy” testers |
| Communication & Transparency | Panthers with advocacy / teaching background |
| Caregiver Access | Active or former family caregivers in hub |
| Dignity & Autonomy | Diverse age band; include users with mobility/cognitive diversity via inclusive cohort design |

Matching criteria stored in **internal ops doc** initially; later optional `panther_engagement_profiles` table on Sage Panthers side.

---

## 7. Compensation & funding (owner decision — locked)

**Company-paid from day one.** All launch packages (Sage Verified Assessment, Sage Insight Panel, Living in Place Beta Cohort) are billed to the organization under a scoped SOW. Grant-subsidized or hybrid models may be introduced later as a **distinct track** with separate intake and accounting—do not commingle with paid company engagements.

Operational model for Phase 1:

1. **Company pays Foundation** (invoice/SOW per package)  
2. **Foundation pays Sage Panthers** stipends or coordinates 1099 contractor terms for scoped panel/beta work  
3. **No grant subsidy** at launch unless explicitly approved as a separate pilot cohort  

Document fee schedules in company SOW templates before marketing `/sage-badge/for-companies`.

---

## 8. Legal & ethics guardrails

- **NDA** optional for pre-release products (company ↔ Foundation; Panthers under Foundation agreement)  
- **No PHI** in feedback sessions — align with HIPAA hub training for staff  
- **Conflict of interest:** Panthers who are paid by a company for beta work cannot submit WPE for that company as “User” (disclose role as Professional)  
- **Accessibility:** Sessions offered by phone/video/in-person as needed — practice what Sage Standard preaches  

---

## 9. Marketing copy hooks (cross-link)

**On Sage With You `/sage-badge/for-companies`:**

> Improve your Living in Place impact with feedback from experienced adults through the **Sage Insight Program**, delivered by **Sage Panthers** — a SageÉlan Foundation program that compensates participants for meaningful advisory and testing work.

**On Sage Panthers employer FAQ (add one item):**

> **Can employers engage Sage Panthers through Sage With You?**  
> Yes. Organizations pursuing Sage Verified status or improving home-based services may request structured senior insight panels and beta testing through Sage With You’s company program. [Link to sagewithyou.org/sage-badge/for-companies]

---

## 10. Success metrics

- Inquiries by type (assessment vs Panthers vs beta)  
- % of Emerging companies that re-assess within 12 months after Insight Panel  
- Panther compensation paid vs company fees (sustainability)  
- Pillar-specific improvement rate on re-assessment  
- Company NPS after engagement (internal survey)  

---

## 11. Recommended next steps

1. ~~Owner approves three package names and pricing direction~~ — **Done:** company-paid at launch  
2. Legal review SOW + WPE conflict rule for beta participants  
3. Add `/sage-badge/for-companies` page + inquiry form (Phase 1 UI)  
4. Provision **`SageWithYou@sageelan.org`** + Supabase secrets; SMTP **`info@sageelan.org`** (see `docs/SAGE_BADGE_GO_LIVE.md`)  
5. Run **one paid pilot** Insight Panel with a friendly company before public launch  

---

## 12. Why this strengthens both programs

- **Sage With You** gains credible, hard-to-fake feedback machinery and a revenue/partnership path beyond grants  
- **Sage Panthers** gains employer-facing engagements aligned with mission (dignity, paid work, impact)  
- **Families** eventually get a badge ecosystem backed by both expert rubric and senior-informed reality checks  

The integration should feel like one Foundation family of programs—not two products bolted together—while keeping certification authority clearly with The Sage Standard assessors.
