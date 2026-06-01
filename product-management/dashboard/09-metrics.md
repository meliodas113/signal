# Metrics & Analytics Plan

What to instrument so we know whether the dashboard is working. Tied to the North Star in
`../strategy/06-product-vision.md`.

## North Star
**Qualified opportunities advanced** — tracked items moved to *Drafting+* after a *Strong/Possible*
verdict. Review weekly.

## Funnel (the activation spine)

| Step | Event | Why it matters |
|------|-------|----------------|
| Land | `dashboard_opened` | top of funnel |
| Describe | `profile_completed` (tech ≥ threshold) | the core input |
| Match | `match_run` (n_results, n_strong) | engine fired |
| Triage | `card_expanded`, `verdict_viewed` | engaging with the *why* |
| Commit | `opportunity_tracked` (verdict, fit, shot) | intent |
| **Advance** | `pipeline_status_changed` → Drafting+ | **North Star input** |
| Retain | `digest_opened`, `return_visit` | push working (Phase 2) |

**Activation definition:** profile_completed **and** ≥1 opportunity_tracked in first session.

## Trust & honesty metrics (the differentiator — measure it explicitly)

- **Verdict acceptance:** % of *Strong/Possible* cards that get tracked. Low = scoring not trusted.
- **Honesty ratio:** share of *Skip/Weak* verdicts shown. If ~0, we're flattering users, not
  triaging — a quality failure even if engagement looks good.
- **Rage-untrack:** track → untrack within X min. Spikes = false-positive "Strong" verdicts.
- **Override signal:** user tracks a *Weak/Skip* card → possible false negative; sample for eval.
- **Shot-estimate calibration (Phase 1.5+):** compare predicted shot bands to self-reported outcomes.

## Deadline-value metrics (P2)

- % of tracked items where user registered/acted *before* the act-by date.
- "Too late to start" verdicts shown → did the founder start SAM.gov earlier next time?
- Missed-deadline rate among tracked items (lower is the whole point).

## Engine quality (offline evals, not user analytics)

- Build a labeled set: founder profiles × topics with human "real fit?" judgments.
- Track **precision/recall of "Strong match."** Precision is king — a wrong "Strong" costs a founder
  a week. Treat regressions as release-blockers.
- Per-agency calibration (topic language differs by agency).

## Guardrail metrics (don't optimize engagement into harm)

- Time-to-first-decision should **go down**, not up. (We protect the founder's time; high
  time-on-site is a *bad* sign here.)
- LLM/embedding cost per matched user (cache topic embeddings; re-score only on change).
- Data freshness SLO: % of sessions served data < 24h old; lapse-state correctly surfaced.

## Instrumentation notes

- Current app is in-memory/no-backend → analytics arrives with the Phase 1 backend. Until then,
  these are **target events**, not live.
- Keep events PII-light; the profile tech blob is sensitive IP — log derived features (token count,
  agency, verdict), never the raw text in analytics.
