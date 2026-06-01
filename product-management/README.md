# SIGNAL — Product Management

The product brain for **SIGNAL**, an SBIR/STTR **grant radar** for deep-tech startups: describe what
you build once, and SIGNAL scores every open federal solicitation for *genuine fit* (meaning, not
keywords) and tracks every real deadline.

This folder is both a **knowledge base** and an **automated PM agent** (the `signal-pm` skill). It
exists to answer one question well, over and over: *what are founders' real problems, and how should
SIGNAL solve them — starting with the dashboard?*

## Read in this order

| # | File | What it gives you |
|---|------|-------------------|
| 1 | [`research/01-domain-primer.md`](research/01-domain-primer.md) | SBIR/STTR mechanics, the phase funnel, the numbers a PM must know. **Start here.** |
| 2 | [`research/02-market-and-competitors.md`](research/02-market-and-competitors.md) | Landscape (Instrumentl, Granted AI, Grantsights, free tools) & how SIGNAL differentiates |
| 3 | [`research/03-personas.md`](research/03-personas.md) | Maya (primary), Devin, Priya |
| 4 | [`research/04-data-integration.md`](research/04-data-integration.md) | SBIR.gov API contract + target data model |
| 5 | [`strategy/05-problem-analysis.md`](strategy/05-problem-analysis.md) | **The core: problems P1–P8 → solutions → today's gaps** |
| 6 | [`strategy/06-product-vision.md`](strategy/06-product-vision.md) | Vision, north star, pillars, anti-goals |
| 7 | [`strategy/07-roadmap.md`](strategy/07-roadmap.md) | Phased plan tied to the problems |
| 8 | [`dashboard/08-dashboard-plan.md`](dashboard/08-dashboard-plan.md) | **The main deliverable: the dashboard plan** |
| 9 | [`dashboard/09-metrics.md`](dashboard/09-metrics.md) | Instrumentation & success metrics |
| — | [`automation/README.md`](automation/README.md) | The `signal-pm` skill + research-refresh tooling |

## The 60-second version

- **Wedge today:** semantic fit scoring + a single cross-agency feed + deadline tracking — the thing
  free tools (SBIR.gov, Grants.gov) structurally can't do: *tell you what to skip.*
- **The product is the verdict, not the list.** Trust via the "why / next / flag / shot," not a bare
  score. Honesty is the moat.
- **Biggest gaps in the current build:** (1) scoring runs on a *flattened* solicitation, not per
  topic; (2) deadlines ignore the **6+ week registration** lead time; (3) everyone gets the same
  answer — no personalization by experience/funnel; (4) no persistence/accounts/alerts; (5) demo
  data, not live SBIR.gov ingest.
- **The plan:** Phase 1 = trustworthy radar on real data (live ingest, per-topic scoring,
  readiness-aware deadlines). Phase 1.5 = "models me" (shot estimate, pipeline, readiness checklist).
  Phase 2 = retention (accounts, digests, awards competitive-intel). See the roadmap.

## How this connects to the code

The product lives in `apps/dashboard/` (React 19 + Vite + Tailwind v4). Today: `ProfileForm` →
heuristic `match.ts` → `RadarFeed`/`OpportunityCard` → flat `TrackedView`, all in-memory on demo
data. Every recommendation here points at the real files so it's actionable, not abstract. The
dashboard plan (doc 8) is the bridge from this prototype to a product.

## Using the PM agent

Ask Claude to act as SIGNAL's PM (the `signal-pm` skill auto-loads this KB). Examples in
[`automation/README.md`](automation/README.md). The agent leads with a decision, ties it to a
problem + persona + code file, and updates these docs when facts or priorities change.

> *Independent tool — not affiliated with the U.S. government, SBA, or any agency. Domain facts here
> are sourced from public records and may lag the official version; re-verify before high-stakes
> decisions (see `automation/refresh-research.sh`).*
