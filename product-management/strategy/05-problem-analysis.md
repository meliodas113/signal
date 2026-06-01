# Problem Analysis — What's broken & how SIGNAL solves it

This is the heart of the product thinking. Each problem is framed as: **the founder's pain → why it
exists → SIGNAL's solution → what the current product does today (the gap)**. Prioritized by impact.

Severity legend: 🔴 critical / 🟠 high / 🟡 medium.

---

## P1 🔴 "I can't tell real fit from keyword-adjacent noise"

- **Pain:** A founder reads a topic that mentions "AI" and can't tell if it's *their* AI or a
  superficial keyword hit. They either over-apply (waste weeks on 5%-shot proposals) or under-apply
  (miss a perfect topic buried in jargon).
- **Why it exists:** Topic text is dense and agency-specific; keyword search (SBIR.gov/Grants.gov)
  structurally can't judge meaning.
- **SIGNAL's solution:** Semantic fit scoring with a **transparent verdict** — `fit_score`, `verdict`,
  `why`, `next_step`, `eligibility_flag`. The trust comes from the *explanation*, not the number.
- **Today / gap:** The scoring contract exists (`MatchScore`) and a server hook (`VITE_MATCH_API_URL`)
  is stubbed; the live path is a keyword-overlap **heuristic**. Scoring runs on the *flattened*
  solicitation, not per topic/subtopic. **Fix: real embeddings + LLM rationale, scored per topic.**

## P2 🔴 "I find out about a deadline too late to actually apply"

- **Pain:** Discovers a perfect topic with 9 days left — not enough time given **registration takes
  6+ weeks**. The deadline they should track is *"last day registration + a credible proposal is
  still possible,"* not the raw due date.
- **Why it exists:** Founders track the visible due date and ignore the invisible 6-week registration
  prerequisite and proposal-writing time.
- **SIGNAL's solution:** **Readiness-aware deadlines.** Combine the due date with the user's
  registration status to compute a *real* "act-by" date and a clear verdict: *On track / Tight /
  Too late to start.* Loud, early registration nudges.
- **Today / gap:** `TrackedView` shows raw `daysUntil(due)` with color bands (≤14 red, ≤30 amber).
  No registration model, no act-by date, no opening-soon. **Fix: registration profile + derived
  readiness clock.**

## P3 🟠 "Everyone gets the same answer; nobody models *me*"

- **Pain:** A first-time solo founder and a 10-award SBIR shop get identical scoring, despite wildly
  different realistic odds and best-fit agencies.
- **Why it exists:** The product scores tech↔topic similarity only; it ignores experience, funnel
  position, set-asides, and agency review culture.
- **SIGNAL's solution:** Personalize the verdict with a **realistic shot estimate** — blend semantic
  fit × agency base rate × first-timer adjustment × set-aside fit. Tell Maya the truth.
- **Today / gap:** `flags` and `firstTime` are *collected* but only nudge the heuristic by a few
  points; no win-rate model, no funnel stage. **Fix: shot-estimate model; use the flags we already
  gather.**

## P4 🟠 "I have no map of where I am in the funnel"

- **Pain:** SBIR success is *sequencing* Phase I → II → III over years. The founder has no view of
  their pipeline or what to line up next.
- **Why it exists:** Tools treat each opportunity as standalone; none model the funnel.
- **SIGNAL's solution:** A **pipeline** over tracked opportunities (Watching → Drafting → Submitted →
  Awarded/Rejected) plus funnel-stage context, so the next-best action is obvious.
- **Today / gap:** `tracked` is a flat string[] of ids; `TrackedView` is a sorted deadline list. No
  status, no stages. **Fix: tracked item becomes an object with pipeline status.**

## P5 🟠 "I can't tell if a topic is realistically winnable or already 'spoken for'"

- **Pain:** Some topics are effectively wired to incumbents (DoD repeat-winner concentration);
  founders waste effort on contests they can't win.
- **Why it exists:** Award history is public but lives in a separate dataset nobody cross-references.
- **SIGNAL's solution:** **Competitive intelligence** from the free Awards API — "N firms won this
  topic area; typical budget $X; M were first-timers" → a winnability signal.
- **Today / gap:** Not built. Awards API unused. **Fix: ingest awards, surface on the card.**

## P6 🟡 "Setup is a maze and I don't know if I'm even eligible"

- **Pain:** SAM.gov, UEI, Login.gov, DSIP/eRA — multi-week, error-prone, agency-specific. STTR needs
  a research partner. Founders bounce off before they ever apply.
- **SIGNAL's solution:** A **readiness checklist** with lead-time estimates and per-agency portal
  requirements; STTR partner requirement surfaced up front (already flagged).
- **Today / gap:** `eligibility_flag` notes STTR partnership; no registration checklist. **Fix:
  onboarding readiness module feeding P2's clock.**

## P7 🟡 "I have to babysit this; nothing comes to me"

- **Pain:** Founders have no time to re-check 11 agency sites. Discovery should be push, not pull.
- **SIGNAL's solution:** Saved profile + **digest alerts** ("3 new strong matches; 1 deadline in 14
  days") via email (Resend is already wired for early-access). Opening-soon alerts respect
  registration lead time.
- **Today / gap:** No persistence (all in-memory React state), no accounts, no alerts. **Fix: auth +
  saved profile + scheduled digest.**

## P8 🟡 "Is this data even current?"

- **Pain:** After the 2025 lapse, founders distrust whether listings are open/funded *now*.
- **SIGNAL's solution:** "Data as of {time}" + explicit open/closed/lapse state; never show
  confidently-stale opportunities.
- **Today / gap:** Demo data with synthetic relative dates. **Fix: ingest timestamps + status, per
  data-integration doc.**

---

## Problem → solution → roadmap map

| # | Problem | Core solution | Phase |
|---|---------|---------------|-------|
| P1 | Real vs keyword fit | Per-topic semantic scoring + transparent verdict | **Now / v1** |
| P2 | Deadlines found too late | Readiness-aware "act-by" clock | **v1** |
| P8 | Stale-data distrust | Freshness + status surfacing | **v1** |
| P3 | One-size-fits-all | Realistic shot estimate (experience/agency) | **v1.5** |
| P4 | No funnel/pipeline map | Pipeline statuses + funnel stage | **v1.5** |
| P6 | Eligibility/registration maze | Readiness checklist module | **v1.5** |
| P7 | No push / babysitting | Accounts + saved profile + digests | **v2** |
| P5 | Winnability unknown | Awards-based competitive intel | **v2** |

> The throughline: **SIGNAL's job is to protect the founder's scarcest resource — the week they'd
> spend on a proposal — by telling them, honestly and early, what to pursue, what to skip, and what
> to set up first.**
