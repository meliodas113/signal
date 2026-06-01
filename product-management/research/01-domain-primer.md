# Domain Primer — SBIR / STTR for Tech Startups

> Read this first. Everything in `product-management/` assumes the model of the world below.
> Last refreshed: 2026-06 (program reauthorized through Sept 2031).

## What SIGNAL is

SIGNAL is a **grant radar** for deep-tech startups. A founder describes what they build, once,
and SIGNAL scores every open federal SBIR/STTR solicitation for *genuine fit* — matching on
**meaning, not keywords** — and then tracks every deadline so a funding window never closes
unnoticed.

It is **discovery + triage + deadline tracking**, not a grant-writing tool (today). Knowing that
boundary is the single most important product decision in this folder; most of the roadmap is about
how far to extend past it.

## What SBIR / STTR actually is

- **SBIR** (Small Business Innovation Research) and **STTR** (Small Business Technology Transfer)
  are U.S. federal programs that fund early-stage R&D at small businesses. Non-dilutive — the
  government takes no equity.
- **11 participating agencies**: DOD, HHS (NIH), NSF, DOE, NASA, USDA, EPA, DOC (NOAA/NIST), ED,
  DOT, DHS. Each agency runs its **own** solicitations, portals, formats, and review culture.
- **STTR** additionally *requires* a formal partnership with a research institution (university /
  federal lab). That single eligibility rule changes who can even apply — SIGNAL already surfaces it
  as `eligibility_flag`.

### The phase funnel (the spine of the whole product)

| Phase | Purpose | Typical award | Duration | Notes |
|-------|---------|---------------|----------|-------|
| **Phase I** | Prove feasibility | ~$150k–$300k | 6–12 mo | The hard door to get through |
| **Phase II** | Develop the prototype | ~$1M–$2M | ~24 mo | Usually requires a prior Phase I |
| **Phase III** | Commercialize | No SBIR $ | — | Funded by follow-on contracts/customers |
| **Direct-to-Phase-II** | Skip I (DoD/some agencies) | Phase II $ | — | For commercially-mature tech |

> The gap between Phase II money ending and real revenue/contracts beginning is the **"valley of
> death."** A startup's whole SBIR strategy is really about *sequencing* awards across this funnel.
> SIGNAL today treats each solicitation as a standalone card — it does **not** model the founder's
> position in this funnel. That is the biggest conceptual gap (see problem analysis).

## How a founder actually wins money (the real workflow)

1. **Get eligible / registered** — SAM.gov + UEI + Login.gov, plus agency portals (DSIP for DoD,
   eRA Commons for NIH). **This takes 6+ weeks** and *must* be active at both submission and award.
   Founders routinely discover this too late and miss deadlines they were otherwise ready for.
2. **Find the right open topics** — across 11 agencies, each with its own site and release cadence.
   Dense, jargon-heavy topic text. ← **SIGNAL's wedge today.**
3. **Triage for fit** — is this *actually* my technology, or just keyword-adjacent? Is the agency a
   realistic funder for me? ← **SIGNAL's scoring.**
4. **Decide & sequence** — which 1–3 do I pursue this cycle given limited proposal-writing capacity?
5. **Write the proposal** — technical volume, commercialization plan, budget. Weeks of work.
6. **Submit before deadline** — portal-specific, unforgiving. ← **SIGNAL's deadline tracking.**
7. **Win → execute → set up the next phase.**

SIGNAL covers steps 2, 3, and 6. The roadmap is fundamentally about how much of 1, 4, and 5 to
absorb without becoming a grant-writing tool.

## Numbers a PM must keep in their head

- **Phase I win rates: ~15–25%** depending on agency. NSF ~20% (highest, least concentrated). NIH
  ~24% historically. DoD has high *award concentration* — >50% of DoD awards go to firms with 10+
  prior awards, i.e. repeat "SBIR mills." Implication: a *first-time* applicant's realistic odds and
  best-fit agencies differ sharply from a repeat winner's. **Personalization by experience level is
  a real product lever, not a nice-to-have.**
- **Phase I→II conversion: ~40–55%.** Once you're in, the next door is far easier. This is why
  "where are you in the funnel" matters so much for recommendations.
- **Registration lead time: 6+ weeks.** A deadline-tracking product that ignores registration lead
  time is tracking the wrong clock.
- **Award sizes** above — useful for ROI framing ("a 30-minute triage protects a $1M+ Phase II
  path").

## 2025 context (don't skip — it shapes positioning)

- SBIR/STTR **lapsed for ~6 months in late 2025** (longest gap since 1982) pending reauthorization,
  then was **reauthorized through September 2031** in March 2026. Funding cadence and topic release
  were disrupted; founders are wary about program stability.
- Practical implication: SIGNAL should treat **"is this program/agency actually open and funded
  right now"** as first-class state, and reassure on stability. A radar that shows confidently-stale
  data during a lapse destroys trust.

## Glossary (so specs are unambiguous)

- **Solicitation** — an agency's funding announcement; contains one or more **topics**.
- **Topic / Subtopic** — the specific technical problem you propose against. This is the unit a
  founder matches to. (Note: SIGNAL's current data model collapses solicitation+topic into one flat
  `Solicitation` — see data-integration doc.)
- **Open / Future / Closed** — solicitation status. Founders care about *open* and *opening-soon*.
- **Set-aside** — preference programs (woman-owned, HUBZone, socially/economically disadvantaged).
  Already in SIGNAL's profile as `flags`.
- **Direct-to-Phase-II (D2P2)** — entry at Phase II without a prior Phase I.
