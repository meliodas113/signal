# Roadmap

Phased, tied directly to the problems in `05-problem-analysis.md`. Each phase ends with a clear
"founder can now…" outcome. Effort is rough (S/M/L), not a commitment.

---

## ✅ Phase 0 — What exists today (baseline)

Profile form → heuristic scoring → radar feed of cards (fit/verdict/why/next/flag) → flat tracked
deadline list. In-memory only, demo data, no backend, no accounts. The skeleton of P1 (fit) and P2
(deadlines) is here; the substance isn't.

---

## 🎯 Phase 1 — "Trustworthy radar on real data" (the credibility release)

**Goal:** A founder can trust the matches and the deadlines on *live* data.

| Item | Problem | Effort |
|------|---------|--------|
| Server-side **ingest** of SBIR.gov solicitations into our store | P8 | L |
| **Topic/subtopic data model** + score per topic (not flattened) | P1 | M |
| Real **semantic scoring** behind `VITE_MATCH_API_URL` (embeddings + LLM rationale) | P1 | L |
| **Readiness-aware deadline**: registration profile → "act-by" date + On track/Tight/Too late | P2 | M |
| **Freshness + status** ("data as of", open/closed/opening-soon) | P8 | S |
| Dashboard IA refresh: Radar / Tracked / Profile as real surfaces (see dashboard plan) | — | M |

**Exit:** matches are semantically real and per-topic; deadlines reflect what's actually possible.

---

## 🚀 Phase 1.5 — "Models *me*" (the personalization release)

**Goal:** The verdict reflects this founder's reality, and tracked items form a pipeline.

| Item | Problem | Effort |
|------|---------|--------|
| **Realistic shot estimate** (semantic × agency base rate × first-timer × set-aside) | P3 | M |
| **Pipeline** on tracked items (Watching → Drafting → Submitted → Decided) | P4 | M |
| **Funnel stage** context (where you are: pre-Phase I / Phase I / II / D2P2) | P4 | S |
| **Readiness checklist** module (SAM/UEI/Login.gov/DSIP/eRA, STTR partner) | P6 | M |

**Exit:** Maya gets an honest shot estimate and a setup path; Devin manages a real pipeline.

---

## 📡 Phase 2 — "Comes to me + winnability" (the retention release)

**Goal:** SIGNAL works while the founder sleeps and tells them what's winnable.

| Item | Problem | Effort |
|------|---------|--------|
| **Accounts + persisted profile** (replace in-memory state) | P7 | M |
| **Digest alerts** (new strong matches, deadlines, opening-soon) via Resend | P7 | M |
| **Saved searches / multiple profiles** | P7 | S |
| **Awards-based competitive intel** ("who won this, typical budget, % first-timers") | P5 | L |
| **Calendar export / ICS** for deadlines | P2 | S |

**Exit:** founders return on push, not pull; cards carry a winnability signal.

---

## 🌐 Phase 3 — "Beyond the founder" (the expansion bets)

Multi-company **workspaces** for accelerators/universities/state programs (Priya); **fit brief /
go-no-go memo** export grounded in the match rationale; consultant referral; possible proposal-section
scaffolding (guarded against becoming a content mill). All deferred until Phase 1–2 prove retention.

---

## Sequencing logic (why this order)

1. **Trust before scale.** No alerts/personalization matter if the matches and deadlines aren't
   real. Phase 1 fixes the foundation (live data, per-topic scoring, honest deadlines).
2. **Personalization before retention.** Push notifications are only valuable once the verdict is
   personalized enough to be worth pushing.
3. **Retention before expansion.** Don't build B2B workspaces until single-founder retention is
   proven.

## Cross-cutting, always-on

- Verdict-quality evals (precision/recall of "Strong match" vs founder judgment).
- Data-freshness SLOs & lapse handling.
- Cost control on embeddings/LLM (cache topic embeddings; only re-score on profile/topic change).
