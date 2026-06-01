# Dashboard Plan — the main project

> This is the primary deliverable. It defines what the dashboard (`apps/dashboard`) should become,
> grounded in the current code and the problems in `../strategy/05-problem-analysis.md`. It is a
> product spec, not a visual mockup — it tells engineering *what to build and why*, in priority
> order.

## 1. Where the dashboard is today (honest baseline)

Current surfaces (`apps/dashboard/src`):
- **Profile** (`ProfileForm`): company, free-text tech, phase interest, agencies, set-aside flags →
  "Run match."
- **Radar** (`RadarFeed` + `OpportunityCard`): sortable list of cards with fit_score, verdict, why,
  next step, eligibility flag, deadline, track button.
- **Tracked** (`TrackedView`): flat list sorted by days-until-deadline with color urgency.
- State: all in-memory React (`App.tsx`), demo data, heuristic scoring fallback.

It's a clean, well-built **prototype of the right idea**. The plan below turns it into a product by
fixing data, granularity, personalization, and persistence — *without* throwing away the strong card
UI and radar metaphor.

## 2. Core design principles

1. **The verdict is the hero, not the list.** Every screen should make the *go / no-go / not-yet*
   decision faster. Honesty over flattery.
2. **One decision per card.** A card should answer: *Is it me? Can I win it? Can I make the
   deadline? What do I do next?* — at a glance, with detail on demand.
3. **Show your work.** Never a bare score; always the "why." Trust is the moat.
4. **Surface time-to-act, not just time-to-deadline.** Registration lead time is first-class.
5. **Freshness is visible.** "Data as of" everywhere live data appears.
6. **Progressive disclosure.** Maya sees a simple triage; Devin can open pipeline/intel depth.

## 3. Information architecture (target)

Four primary surfaces (was three). The new one — **Readiness** — directly addresses the
most-missed-deadline problem (P2/P6).

```
SIGNAL dashboard
├── Radar        ← discover + triage (the home)
├── Tracked      ← pipeline of pursued opportunities (was a flat list)
├── Readiness    ← NEW: registration/eligibility status that powers deadline math
└── Profile      ← who you are + what you build (drives everything)
```

Top bar (`TopBar`) gains a **Readiness** tab and a global **"data as of {time}"** indicator.

## 4. Surface-by-surface spec

### 4.1 Profile (extend `ProfileForm`)
Keep: company, tech free-text, phase interest, agencies, set-aside flags.
**Add (drives personalization & deadline math):**
- **Experience level** — first-time / 1–3 prior awards / 4+ (already partly in `flags.firstTime`).
- **Funnel position** — pre-Phase I / have Phase I / pursuing Phase II / D2P2-ready.
- **Registration status** snapshot (or link to Readiness): SAM/UEI active? eRA/DSIP? STTR partner?
- Inline guidance that more concrete technical detail → sharper match (already present — keep).

### 4.2 Radar (evolve `RadarFeed` + `OpportunityCard`) — the home screen
**Keep:** card layout, fit score + bars, verdict accent rail, why/next/flag lines, sort, track.
**Change / add:**
- Score **per topic/subtopic**, not per flattened solicitation (data-model change, P1). Cards
  represent *topics*; group under their solicitation.
- Add a **realistic shot estimate** chip distinct from semantic fit ("Fit 82 · Shot ~Moderate for a
  first-timer at NSF") (P3).
- Add a **readiness/deadline verdict** chip: *On track / Tight / Too late to start* using the
  Readiness data (P2) — not just raw days.
- Add **filters** (agency, program, phase, verdict, "winnable for me") above the existing sort.
- Add an **"opening soon"** section so founders can start registration *before* a topic opens (P2).
- Later: **competitive-intel** line ("12 firms won this area; ~$1.1M median; 3 first-timers") (P5).
- Empty/zero-match state should coach ("no strong fits this cycle — here's what's opening soon").

### 4.3 Tracked → **Pipeline** (rebuild `TrackedView`)
**Today:** flat deadline-sorted list. **Target:** a lightweight pipeline.
- Tracked item becomes an object: `{ id, status, note, addedAt }` where status ∈
  *Watching → Drafting → Submitted → Awarded / Rejected* (P4).
- Two views: **Board** (Kanban by status, for Devin) and **Deadline** (the current urgency list, for
  Maya). Default to Deadline; offer Board toggle.
- Each item shows the readiness/act-by clock, not just due date.
- Calendar/ICS export of act-by + due dates (Phase 2).

### 4.4 Readiness (NEW surface, P2/P6)
The screen that prevents missed deadlines.
- **Registration checklist** with lead-time estimates: Login.gov → SAM.gov (3–4 wk) → UEI (7–10 bd)
  → agency portals (eRA ~2 wk / DSIP). STTR research-partner requirement.
- Each item: status (not started / in progress / active / expiring) + "why it matters" + official
  link. SAM expiry warning ("renew within 60 days").
- This data feeds the Radar/Tracked **act-by** math. A founder who hasn't registered sees honest
  "Too late to start" verdicts on near-deadline topics — and a loud "start SAM.gov now" nudge.

## 5. The card, redesigned (the most important pixel real-estate)

A topic card should answer four questions in a glance, detail on tap:

```
┌────────────────────────────────────────────────────────────┐
│ NSF · TIP · SBIR · Phase I              NSF-25-AM   [topic#] │
│ Advanced Manufacturing & Industrial Robotics                │  ← what
│ "Funding for high-risk robotics/automation with a clear…"   │
│                                                              │
│  FIT 82/100  ▮▮▮▮▯   Strong match                            │  ← is it me
│  SHOT  Moderate (first-timer · NSF base ~20%)                │  ← can I win
│  Why:  Overlaps your edge-AI vision + manufacturing stack    │
│  Next: Read the topic; draft a fit brief                     │
│  Flag: —                                                     │
│                                                              │
│  ⏱ ACT BY May 2 · DUE May 30 · On track   [Track] [Official]│  ← deadline reality
└────────────────────────────────────────────────────────────┘
```

vs. today's card which shows fit/verdict/why/next/flag/due but **no shot, no act-by, no per-topic
granularity.** Those three additions are the heart of the upgrade.

## 6. Build order (maps to roadmap Phase 1 → 1.5)

1. **Data model → topic/subtopic** + live ingest (unblocks everything). 
2. **Real per-topic scoring** behind the API (replace heuristic).
3. **Readiness surface + registration profile** → enables act-by math.
4. **Act-by deadline verdict** on cards & Tracked.
5. **Shot estimate** chip.
6. **Pipeline** statuses on Tracked.
7. **Filters + opening-soon** on Radar.
8. Persistence/accounts (Phase 2) unlocks alerts & saved profiles.

## 7. Explicitly deferred (so v1 stays focused)

Awards competitive-intel, digest alerts, multi-company workspaces, fit-brief export, calendar sync.
All have homes in Phase 2–3. v1 = **trustworthy, personalized triage on real data with honest
deadlines.**

## 8. Open questions for the team

- Do we score every subtopic (cost) or cluster/score at topic level and expand on demand?
- Where does registration status live — self-reported (fast, v1) vs. SAM.gov API verified (later)?
- Is "shot estimate" shown as a band (Low/Moderate/Strong) or a number? (Band reads more honest and
  avoids false precision — recommended.)
- How aggressive should "Skip" verdicts be? (Lean honest; measure rage-untracks — see metrics.)
