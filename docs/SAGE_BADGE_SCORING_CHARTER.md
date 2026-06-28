# Sage Badge — Scoring Charter

**Program:** Sage With You — Living in Place  
**Version:** 1.0 (draft for owner review)  
**Status:** Phase 0 charter — implement before public badge launch  
**Related:** `SAGE_BADGE_MINI_WHITEPAPER.md`, `SAGE_BADGE_PHASE1_DATA_MODEL.md`, `SAGE_BADGE_COMPANY_SUPPORT_AND_SAGE_PANTHERS.md`

---

## 1. Purpose

This charter defines how **The Sage Standard** (7 pillars), **Sage Verified** certification levels, and **What People Are Experiencing (WPE)** combine into a single, auditable outcome. It is the source of truth for assessors, product logic, and public explanations.

---

## 2. Definitions

| Term | Meaning |
|------|---------|
| **Sage Badge** | The overall recognition program |
| **The Sage Standard** | Structured 7-pillar evaluation (1–5 each) |
| **Sage Verified** | Public designation for companies meeting threshold |
| **WPE** | Community-submitted experience data (ratings + narratives) |
| **Composite score** | Weighted average of applicable pillar scores |
| **Floor rule** | Minimum pillar score required for a certification band |

---

## 3. The seven pillars

Each pillar is scored **1–5** by a trained Sage assessor using observable evidence (see assessor playbook — separate doc).

| Pillar | Score 1 (anchor) | Score 5 (anchor) |
|--------|------------------|------------------|
| **Accessibility** | Major physical/digital barriers; excludes typical home-based users | Inclusive access across ability, age, and modality |
| **Safety & Environment** | Design or service increases risk at home | Proactively reduces risk; supports safe aging in place |
| **Communication & Transparency** | Opaque, confusing, or misleading | Clear, honest, plain-language communication |
| **Dignity & Autonomy** | Paternalistic; removes choice | Respects independence and user agency |
| **Continuity of Support** | One-off transaction; no follow-through | Reliable ongoing engagement |
| **Caregiver Access & Supportability** | Caregivers blocked from helping | Family/helpers can assist effectively |
| **Technology & Ease of Use** | High friction; unusable for typical seniors | Simple, intuitive digital experience |

**N/A rule:** If a pillar genuinely does not apply (e.g., no digital product for a local installer), mark **N/A with written justification**. N/A pillars are **excluded** from the composite average—not scored as 5.

---

## 4. Composite score calculation

### 4.1 Default (equal weights)

For companies without a service-type override:

```
composite = sum(pillar_scores) / count(applicable_pillars)
```

Result is rounded to **one decimal place** (e.g., 3.7).

### 4.2 Service-type weights (Phase 1 pilot)

Each company has one **primary service type**. Weights below apply to the composite only; all seven pillars are still scored and displayed.

| Service type | Weight emphasis (×1.5) | Rationale |
|--------------|--------------------------|-----------|
| Home modification / safety | Safety, Accessibility | Physical environment focus |
| DME / medical equipment | Safety, Continuity | Delivery, setup, ongoing support |
| Home health / care coordination | Continuity, Caregiver Access | Care transitions and family role |
| Insurance / benefits navigation | Communication, Dignity | Complex decisions, autonomy |
| FinTech / billing / payments | Communication, Technology | Transparency and usability |
| Telehealth / remote monitoring | Technology, Accessibility | Digital access parity |
| Community / transportation | Accessibility, Continuity | Access and reliability |
| Legal / estate planning | Communication, Dignity | Clarity and respect |
| General senior services (default) | Equal weights | — |

Implementation: store weights in `badge_service_types`; application code computes weighted composite.

---

## 5. Certification levels (Sage Standard only)

Base level is determined **only** from the Sage Standard composite and floor rules below.

| Level | Composite range | Public Sage Verified badge |
|-------|-----------------|----------------------------|
| **Limited** | 1.0 – 2.4 | No — *Not Yet Sage Verified* |
| **Emerging** | 2.5 – 3.2 | No — *Not Yet Sage Verified* |
| **Ready** | 3.3 – 3.9 | **Yes** |
| **Trusted** | 4.0 – 4.4 | **Yes** |
| **Exceptional** | 4.5 – 5.0 | **Yes** |

### 5.1 Floor rules (mandatory)

A company **cannot** receive a public Sage Verified badge (Ready or above) if **any** of the following are true:

1. Any applicable pillar score is **≤ 2**
2. **Safety & Environment** is **≤ 3**
3. **Dignity & Autonomy** is **≤ 3**
4. Assessment is **older than 24 months** without renewal (badge shows stale until re-assessed)

If composite would qualify but a floor fails → cap at **Emerging** (internal) and **Not Yet Sage Verified** (public).

### 5.2 Display rule

Public profiles always show:

- Certification level (if Ready+)
- **Pillar scorecard** (7 bars, including N/A labels)
- **Assessment date** and **next review due**
- Disclaimer: not medical advice; not regulatory licensure

---

## 6. WPE (What People Are Experiencing)

### 6.1 Data collected (per submission)

- Overall rating (1–5)
- Supports Living in Place: Yes / No / Somewhat
- Caregiver access: Easy / Difficult / Not Possible
- Technology & ease of use (1–5)
- Barriers (multi-select from controlled list)
- Optional narrative (moderated before publish)
- Submitter role: User / Caregiver / Professional

### 6.2 Publication thresholds

WPE aggregates appear on a company profile only when:

| Metric | Minimum |
|--------|---------|
| Approved submissions (last 24 months) | **n ≥ 15** |
| Unique submitters (by account or hashed identity) | **≥ 10** |
| Most recent submission | Within **24 months** |

Below threshold: show *“Community experiences — collecting feedback”* without numeric aggregate.

### 6.3 WPE aggregate metrics (published)

- **WPE overall average** (1–5)
- **% Supports Living in Place** (Yes / Somewhat / No)
- **Caregiver access distribution** (Easy / Difficult / Not Possible)
- **Technology average** (1–5)
- **Top 3 barriers** (by frequency)
- **Selected moderated narratives** (optional)

### 6.4 WPE integration with certification level

WPE does **not** replace The Sage Standard. It can **adjust** the displayed level when sample thresholds are met.

**Promotion (Ready → Trusted via community)**  
All required:

- Sage Standard composite **≥ 3.3** (Ready floor met)
- WPE overall average **≥ 4.2**
- **≥ 70%** of WPE responses are **Yes** or **Somewhat** on Supports Living in Place
- No pillar floor violations

**Promotion (Trusted → Exceptional via community)**  
All required:

- Sage Standard composite **≥ 4.0**
- WPE overall average **≥ 4.6**
- **≥ 85%** Yes or Somewhat on Supports Living in Place
- Caregiver access: **≥ 60%** Easy

**Demotion / provisional status**

- If published WPE average **≤ 3.0** for **6 consecutive months** (with n ≥ 15), status → **Provisional Trusted** (or Provisional Exceptional)
- Public badge remains visible with label: *“Under review — community feedback below program standards”*
- Sage team triggers re-assessment within **90 days**

**Important:** WPE never demotes a company below Ready if Sage Standard still qualifies and floors pass—unless Sage Standard re-assessment fails.

---

## 7. Assessor workflow summary

1. Intake company + primary service type  
2. Collect evidence pack per pillar  
3. Score each applicable pillar (1–5 or N/A)  
4. System computes composite + applies floors → base level  
5. If WPE thresholds met, apply WPE adjustment rules  
6. Publish snapshot to public profile (staff approval)  
7. Schedule renewal (Ready: 12 mo light review; Trusted/Exceptional: 24 mo full)

---

## 8. Pilot calibration (first 5–10 companies)

Before locking weights for production:

- Score blind pairs (two assessors, same company) — target **≤ 0.5** avg pillar deviation  
- Review floor false positives (companies users love but fail Safety floor)  
- Adjust service-type weights only with documented rationale  

---

## 9. Versioning

- Charter version stored on each `badge_assessment` record (`charter_version = '1.0'`)  
- Re-scoring after charter changes uses new rules; badge shows *“Assessed under Sage Standard v1.0”*  

---

## 10. Owner decisions (locked)

| Decision | Status | Resolution |
|----------|--------|------------|
| Safety & Dignity floor (≤ 3 blocks public badge) | **Locked** | **Keep** — no pilot softening |
| WPE n=15 publication threshold | Pending | Default n=15 at launch (see §6.2) |
| Service-type taxonomy | Pending | Use seed data in `005_sage_badge_phase1.sql` |
| Public narratives / legal copy | Pending | Legal review before publish |

**Charter v1.0 floor rules are final for Phase 1.** Revisit only via a new charter version (e.g. v1.1) with re-assessment of affected companies.

---

## 11. Owner decisions still open before build

- [ ] Approve WPE n=15 at public launch (or n=10 for closed pilot only)  
- [ ] Legal review of public narratives and provisional status language  
