/**
 * The grounded SIGNAL knowledge base. Distilled from product-management/.
 * The Copywriter may ONLY use facts/claims that appear here (or fresh sector
 * news passed in the brief). This is the guardrail against autopilot
 * hallucinating numbers or over-promising.
 */

export const ONE_LINER =
  "SIGNAL is a grant radar that scores every open SBIR/STTR solicitation for genuine technical fit and tracks every real deadline — so deep-tech founders stop drowning in the federal funding maze.";

export const VISION =
  "Every deep-tech founder should be able to find, judge, and never miss the non-dilutive federal funding that actually fits what they build — in an afternoon, not a quarter.";

export const POSITIONING =
  "For deep-tech founders overwhelmed by the SBIR/STTR maze. Unlike keyword search on SBIR.gov or generalist tools like Instrumentl, SIGNAL is SBIR/STTR-native, funnel-aware, and brutally honest — it tells you what to skip.";

/** Voice contract — every post must obey this. */
export const VOICE = [
  "Brutally honest and anti-hype. SIGNAL's edge is telling founders what to SKIP. Never breathless or salesy.",
  "Respect the founder's time and intelligence. Concrete, specific, technically credible. No fluff, no buzzword soup.",
  "Radar metaphor lives in the brand, use it sparingly — never force 'signal/noise' puns into every post.",
  "Lowercase-leaning, punchy. Short sentences. One idea per post.",
  "At most one emoji, usually zero. No hashtag spam — at most 1–2 precise tags, often none.",
  "Sound like a sharp founder talking to peers, not a brand account broadcasting.",
];

/** Hard guardrails the Editor enforces. */
export const GUARDRAILS = [
  "NEVER invent statistics, dollar amounts, win rates, or dates. Only use numbers that appear in product_facts or sector_context.",
  "NEVER guarantee funding, awards, or outcomes. SIGNAL improves decisions; it does not win grants for you.",
  "Do not name-drop or disparage competitors beyond the neutral positioning already stated.",
  "No fake urgency, no 'DM me', no growth-hack bait, no engagement-farming 'comment X below'.",
  "Keep the tweet <= 270 characters to leave room. The image carries the visual punch.",
];

/** Durable facts the copy may reference freely. */
export const FACTS = [
  ONE_LINER,
  "Federal SBIR/STTR grants are non-dilutive — founders keep 100% equity. Awards commonly range from ~$150k (Phase I) to ~$2M (Phase II).",
  "Keyword search (SBIR.gov / Grants.gov) structurally can't judge meaning — it can't tell if a topic that mentions 'AI' is YOUR kind of AI or a superficial keyword hit.",
  "Registration (SAM.gov, UEI, Login.gov, DSIP/eRA) commonly takes 6+ weeks — so the deadline that matters is 'last day a real proposal is still possible', not the raw due date.",
  "STTR (unlike SBIR) requires a partnering research institution — a constraint founders often discover too late.",
  "SBIR success is a multi-year funnel: Phase I → Phase II → Phase III. Most tools treat each opportunity as standalone and ignore the funnel.",
  "Some topics are effectively wired to incumbents (repeat-winner concentration, especially at DoD). Award history is public but rarely cross-referenced.",
  "SIGNAL gives each match a transparent verdict: a fit score plus why / next step / eligibility flag — the explanation is the product, not the number.",
  "SIGNAL is built to protect the founder's scarcest resource: the week they'd otherwise spend on a 5%-shot proposal.",
];

/** The 8 pain points (P1–P8) — the core 'pain' pillar content. */
export const PAINS = [
  {
    id: "P1",
    pain: "You can't tell real technical fit from keyword-adjacent noise.",
    detail:
      "A topic mentions 'AI' and you can't tell if it's your AI or a buzzword hit, so you either over-apply (wasted weeks) or under-apply (miss a perfect topic buried in jargon).",
    fix: "Semantic fit scoring with a transparent verdict — why it fits, the next step, and an eligibility flag.",
  },
  {
    id: "P2",
    pain: "You find a perfect topic with 9 days left — too late to actually apply.",
    detail:
      "Registration takes 6+ weeks. The deadline you should track is 'last day a credible proposal is still possible', not the raw due date.",
    fix: "Readiness-aware 'act-by' dates: On track / Tight / Too late to start, plus loud early registration nudges.",
  },
  {
    id: "P3",
    pain: "Everyone gets the same answer; nobody models YOU.",
    detail:
      "A first-time solo founder and a 10-award shop get identical scoring despite wildly different realistic odds and best-fit agencies.",
    fix: "A realistic shot estimate that blends fit, agency base rate, first-timer reality, and set-asides.",
  },
  {
    id: "P4",
    pain: "You have no map of where you are in the funnel.",
    detail:
      "SBIR is sequencing Phase I → II → III over years, but tools treat every opportunity as a one-off.",
    fix: "A pipeline over tracked opportunities (Watching → Drafting → Submitted → Awarded) so the next move is obvious.",
  },
  {
    id: "P5",
    pain: "You can't tell if a topic is winnable or already 'spoken for'.",
    detail:
      "Some topics are effectively wired to incumbents; founders burn effort on contests they can't win. Award history is public but nobody cross-references it.",
    fix: "Competitive intel from public awards data — who's won this area, typical budget, how many were first-timers.",
  },
  {
    id: "P6",
    pain: "Setup is a maze and you don't even know if you're eligible.",
    detail:
      "SAM.gov, UEI, Login.gov, DSIP/eRA — multi-week, error-prone, agency-specific. STTR needs a research partner. Founders bounce off before they ever apply.",
    fix: "A readiness checklist with lead-time estimates and per-agency requirements, STTR partner surfaced up front.",
  },
  {
    id: "P7",
    pain: "You have to babysit 11 agency sites; nothing comes to you.",
    detail:
      "Founders have no time to re-check every agency portal. Discovery should be push, not pull.",
    fix: "A saved profile plus digest alerts — '3 new strong matches; 1 deadline in 14 days' — that respect registration lead time.",
  },
  {
    id: "P8",
    pain: "You can't tell if the data is even current.",
    detail:
      "After the 2025 funding lapse, founders distrust whether a listing is open and funded right now.",
    fix: "Explicit 'data as of {time}' and open/closed/lapse status — never show confidently-stale opportunities as live.",
  },
];

/** Differentiators — the 'why-signal' pillar. */
export const DIFFERENTIATORS = [
  "Honesty as a feature: SIGNAL tells you what to skip. A 'don't apply' verdict is the product working.",
  "SBIR/STTR-native depth, not database breadth — funnel-awareness, agency culture, set-asides, registration-readiness, awards intel.",
  "Built to protect the founder's week, not maximize time-on-site.",
  "Push, don't pull — discovery arrives as digests/alerts instead of making you babysit agency portals.",
  "Right data, honestly fresh — freshness and status are surfaced, never stale-as-live.",
];

/** Personas to speak to (rotate the implied reader). */
export const PERSONAS = [
  "Maya — first-time deep-tech founder, technical, time-poor, intimidated by the SBIR maze.",
  "A repeat SBIR founder optimizing which topics are worth a week of proposal effort.",
  "Priya — an accelerator / university program lead shepherding many companies through funding.",
];
