# Market & Competitive Landscape

## Where SIGNAL sits

The grant-tech market splits into three layers. SIGNAL must be honest about which one it's playing in.

| Layer | What it does | Players | SIGNAL? |
|-------|--------------|---------|---------|
| **Discovery / matching** | Find & rank relevant opportunities | Instrumentl, Grantsights, Granted AI, GrantForward, raw Grants.gov / SBIR.gov | ✅ **Core today** |
| **Writing / drafting** | Generate proposal text | Granted AI, Grantable, generic LLMs | 🔜 Roadmap edge |
| **Management / compliance** | Track awards, reporting, post-award | Instrumentl, Grant Frog, agency portals | ⛔ Out of scope (for now) |

## The competitors, and why SIGNAL is differentiated

### Free / official sources — the *real* default
- **SBIR.gov** and **Grants.gov** are free and authoritative but notoriously hard to navigate, no
  intuitive UI, keyword-only search, no fit scoring, no personalization, no cross-agency triage. The
  founder's actual status quo is **"15 browser tabs + a spreadsheet + a calendar reminder."**
- **SIGNAL's wedge:** semantic fit scoring + a single cross-agency feed + deadline tracking. The
  thing the free tools can't do is tell you *"this isn't worth your week."*

### Instrumentl (~$299/mo) — the market leader
- 490k+ funders, strong matching, pipeline management. **But built for nonprofits / foundation
  grants**, not deep-tech founders chasing federal R&D contracts. Generic, expensive, not
  SBIR-native, no concept of the Phase I→II→III funnel or agency review culture.
- **SIGNAL's wedge:** SBIR/STTR-native, founder-native language, funnel-aware, far cheaper.

### Granted AI — closest in spirit
- AI-powered plain-language search across 85k+ grants + 144 sources; combines DB match with
  real-time LLM. Also offers SAM.gov registration help and AI writing.
- **This is the most direct threat** — same "describe in plain language, get matches" mechanic
  SIGNAL uses. SIGNAL must win on (a) *depth* in SBIR/STTR specifically, (b) *quality of the
  triage verdict* (the "why/next/flag" trust layer), and (c) *founder workflow* (funnel, readiness),
  not breadth of database.

### Grantsights ($29/mo), Grant Frog ($149/mo), FundRobin
- Cheaper, mostly nonprofit-leaning. Grantsights' angle — "who won, what they budgeted, is it worth
  applying" — is a **strong insight SIGNAL should steal**: *award/competitive intelligence* is a
  high-value, defensible feature (SBIR.gov publishes the full awards dataset).

### Consultants / grant writers
- The high-touch alternative: $5k–$25k+ per proposal, or success fees. They *do* the funnel
  strategy and writing. SIGNAL is the self-serve, founder-controlled, pre-consultant layer — and a
  potential lead-gen channel *to* consultants.

## Strategic takeaways for the product

1. **Don't compete on database size.** Compete on *triage quality and founder fit*. The verdict
   ("Strong match / why / next step / eligibility flag") is the product, not the list.
2. **SBIR/STTR-native is the moat.** Funnel-awareness, agency review-culture, registration-readiness,
   set-asides, and award/competitive intel are things generalist tools structurally won't build.
3. **Awards data is an untapped, free, defensible asset.** SBIR.gov publishes every historical award.
   "Who has won this topic before, at what budget, and what's your realistic shot" is a feature
   Grantsights validates demand for and that SIGNAL can do *better* because it's SBIR-focused.
4. **Price for founders, not enterprises.** Instrumentl's $299/mo is a ceiling to undercut; a
   pre-seed founder will pay for *time saved* and *deadlines not missed*, framed against a $150k–$2M
   non-dilutive prize.
5. **The writing layer is a trap and an opportunity.** Generic AI writing is commoditizing fast.
   SIGNAL should resist becoming a content mill but *can* own the high-value, hard-to-fake artifacts:
   the **fit brief**, the **go/no-go memo**, and **proposal-section scaffolding seeded by the match
   rationale** — uniquely defensible because they're grounded in SIGNAL's scoring.
