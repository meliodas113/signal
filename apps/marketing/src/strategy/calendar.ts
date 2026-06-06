import type { Brief, Pillar, PostRecord } from "../types.js";
import {
  DIFFERENTIATORS,
  FACTS,
  PAINS,
  PERSONAS,
  GUARDRAILS,
  VOICE,
} from "./productFacts.js";

/**
 * The Strategist. Rotates content pillars across the day and picks a concrete
 * angle, biasing away from whatever was posted most recently. Deterministic
 * given the clock + history, so every 2h slot lands on a fresh, on-brand brief.
 */

// Weighted pillar rotation across a 12-post day (every 2h).
// Pain points are the workhorse; sector + why-signal + build-log add variety.
const ROTATION: Pillar[] = [
  "pain",
  "why-signal",
  "pain",
  "sector",
  "pain",
  "why-signal",
  "build-log",
  "pain",
  "sector",
  "pain",
  "why-signal",
  "pain",
];

const PILLAR_GUIDANCE: Record<Pillar, string> = {
  pain: "Lead with the founder's visceral pain in their own words, then land SIGNAL's fix in one line. Make them feel seen before you sell.",
  sector: "React to a real, current development in SBIR/STTR or deep-tech federal funding. Add a sharp take, then connect it to why a radar like SIGNAL matters. If no fresh news is provided, frame an evergreen sector truth as timely insight.",
  "why-signal": "Make the case for why SIGNAL exists and why it's different — honesty, SBIR-native depth, push-not-pull. Confident, not boastful. Show the contrast with the old way.",
  "build-log": "Founder build-in-public energy. Share a principle or decision behind how SIGNAL is built (e.g. why a 'skip' verdict is a feature). Authentic, first-person, no roadmap promises.",
};

function recentAngles(history: PostRecord[], n = 12): string[] {
  return history.slice(-n).map((h) => h.angle);
}

/** Pick the next pillar: follow rotation by slot-of-day, nudge off repeats. */
function pickPillar(history: PostRecord[], now: Date): Pillar {
  const slot = Math.floor(now.getHours() / 2) % ROTATION.length;
  let pillar = ROTATION[slot];
  const last = history[history.length - 1]?.pillar;
  if (last === pillar) {
    // avoid two in a row of the same pillar
    pillar = ROTATION[(slot + 1) % ROTATION.length];
  }
  return pillar;
}

/** Choose a concrete angle within the pillar, avoiding the most recent ones. */
function pickAngle(pillar: Pillar, history: PostRecord[]): {
  angle: string;
  facts: string[];
} {
  const avoid = new Set(recentAngles(history));
  const fresh = <T extends { id?: string }>(items: T[], key: (t: T) => string) => {
    const notRecent = items.filter((i) => !avoid.has(key(i)));
    const pool = notRecent.length ? notRecent : items;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  switch (pillar) {
    case "pain": {
      const p = fresh(PAINS, (x) => `pain:${x.id}`);
      return {
        angle: `pain:${p.id}`,
        facts: [`${p.pain} — ${p.detail}`, `SIGNAL's fix: ${p.fix}`, ...sample(FACTS, 2)],
      };
    }
    case "why-signal": {
      const d = fresh(
        DIFFERENTIATORS.map((text, i) => ({ id: `D${i}`, text })),
        (x) => `why:${x.id}`,
      );
      return { angle: `why:${d.id}`, facts: [d.text, ...sample(FACTS, 2)] };
    }
    case "build-log": {
      const d = fresh(
        DIFFERENTIATORS.map((text, i) => ({ id: `B${i}`, text })),
        (x) => `build:${x.id}`,
      );
      return { angle: `build:${d.id}`, facts: [d.text, ...sample(FACTS, 1)] };
    }
    case "sector":
    default:
      return { angle: `sector:${new Date().toISOString().slice(0, 10)}`, facts: sample(FACTS, 3) };
  }
}

function sample<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

export function buildBrief(opts: {
  history: PostRecord[];
  now?: Date;
  sectorContext?: string;
}): Brief {
  const now = opts.now ?? new Date();
  const pillar = pickPillar(opts.history, now);
  const { angle, facts } = pickAngle(pillar, opts.history);
  const persona = sample(PERSONAS, 1)[0];

  return {
    pillar,
    angle,
    product_facts: facts,
    sector_context: pillar === "sector" ? opts.sectorContext : undefined,
    avoid: opts.history.slice(-8).map((h) => h.tweet),
    guidance: [
      PILLAR_GUIDANCE[pillar],
      `Implied reader for this post: ${persona}`,
      "VOICE:",
      ...VOICE.map((v) => `- ${v}`),
      "GUARDRAILS:",
      ...GUARDRAILS.map((g) => `- ${g}`),
    ].join("\n"),
  };
}
