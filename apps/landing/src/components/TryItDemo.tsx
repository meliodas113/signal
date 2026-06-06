import { useState } from "react";
import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

/**
 * Interactive "try the radar" preview. The visitor describes their tech and
 * sees scored, explained matches — the core SIGNAL experience, before signup.
 * Matches are illustrative (keyword-driven from a sample topic library); the
 * real product scores live .gov solicitations.
 */

interface SampleTopic {
  tags: string[];
  agency: string;
  program: string;
  title: string;
  why: string;
  next: string;
  deadlineDays: number;
  base: number; // baseline fit when matched
}

const LIBRARY: SampleTopic[] = [
  {
    tags: ["ai", "ml", "model", "inference", "edge", "autonomy", "vision", "llm", "agent"],
    agency: "DoD",
    program: "AFWERX · SBIR",
    title: "Dual-Use Autonomy & Edge AI for SWaP-Constrained Platforms",
    why: "Your edge-inference stack maps directly to the SWaP and on-device autonomy ask.",
    next: "Draft a dual-use brief; cite any commercial traction.",
    deadlineDays: 9,
    base: 94,
  },
  {
    tags: ["sensor", "hardware", "rf", "signal", "imaging", "lidar", "radar", "photonics"],
    agency: "DoD",
    program: "Navy · STTR",
    title: "Compact Multi-Modal Sensing for Contested Environments",
    why: "Your sensing hardware fits the multi-modal, low-SWaP detection requirement.",
    next: "Line up a research partner — STTR requires one.",
    deadlineDays: 21,
    base: 90,
  },
  {
    tags: ["bio", "health", "medical", "diagnostic", "genomic", "drug", "therapeutic", "clinical"],
    agency: "NIH",
    program: "NIH · SBIR",
    title: "AI-Enabled Diagnostics for Early Disease Detection",
    why: "Your diagnostic approach aligns with the early-detection and validation scope.",
    next: "Map your evidence to the Phase I aims.",
    deadlineDays: 34,
    base: 91,
  },
  {
    tags: ["energy", "battery", "grid", "solar", "storage", "power", "hydrogen", "carbon"],
    agency: "DOE",
    program: "DOE · SBIR",
    title: "Advanced Energy Storage & Grid-Edge Power Management",
    why: "Your storage/power tech matches the grid-edge efficiency objectives.",
    next: "Quantify efficiency gains vs. the topic's baseline.",
    deadlineDays: 16,
    base: 89,
  },
  {
    tags: ["space", "satellite", "orbit", "propulsion", "aerospace", "rocket", "lunar"],
    agency: "NASA",
    program: "NASA · SBIR",
    title: "Resilient In-Space Systems & Autonomous Operations",
    why: "Your aerospace systems fit the in-space autonomy and resilience need.",
    next: "Align your TRL with the Phase I expectation.",
    deadlineDays: 27,
    base: 92,
  },
  {
    tags: ["material", "manufacturing", "additive", "coating", "composite", "nano", "semiconductor"],
    agency: "DoD",
    program: "Army · SBIR",
    title: "Advanced Materials & Scalable Manufacturing Processes",
    why: "Your materials/process work fits the scalable-manufacturing objective.",
    next: "Show a path from lab process to production.",
    deadlineDays: 12,
    base: 88,
  },
  {
    tags: ["cyber", "security", "encryption", "network", "zero", "quantum", "crypto"],
    agency: "DHS",
    program: "DHS · SBIR",
    title: "Resilient Cybersecurity for Critical Infrastructure",
    why: "Your security approach maps to the critical-infrastructure resilience ask.",
    next: "Identify a pilot environment to reference.",
    deadlineDays: 19,
    base: 90,
  },
];

const FALLBACK: SampleTopic = {
  tags: [],
  agency: "NSF",
  program: "NSF · SBIR",
  title: "Deep-Tech Commercialization — America's Seed Fund",
  why: "Broad deep-tech fit; NSF funds a wide range of high-risk, high-impact R&D.",
  next: "Sharpen the commercial thesis in your pitch.",
  deadlineDays: 41,
  base: 85,
};

function scoreFor(input: string, t: SampleTopic): number {
  const words = input.toLowerCase();
  const hits = t.tags.filter((tag) => words.includes(tag)).length;
  if (hits === 0) return 0;
  // deterministic, input-sensitive jitter so scores feel tailored
  const jitter = (input.length * 7 + t.title.length * 3) % 6;
  return Math.min(99, t.base + Math.min(hits, 3) - 2 + jitter - 2);
}

const EXAMPLES = [
  "On-device computer-vision for drones",
  "Solid-state battery chemistry",
  "Genomic early-cancer diagnostics",
];

export function TryItDemo() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const [results, setResults] = useState<{ topic: SampleTopic; score: number }[]>([]);

  function run(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    if (text) setInput(text);
    setState("scanning");
    // simulate the radar reading topics
    window.setTimeout(() => {
      const ranked = LIBRARY.map((t) => ({ topic: t, score: scoreFor(q, t) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);
      const picked = ranked.length
        ? ranked
        : [{ topic: FALLBACK, score: FALLBACK.base + (q.length % 5) }];
      setResults(picked);
      setState("done");
    }, 1100);
  }

  return (
    <section className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
      <Reveal>
        <div className="mx-auto mb-10 max-w-[60ch] text-center md:mb-14">
          <Kicker center>Try the radar</Kicker>
          <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
            Describe what you build. See what fits.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-dim">
            A 10-second taste of the real thing — type your technology and watch SIGNAL surface
            scored matches.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mx-auto max-w-[760px] rounded-2xl border border-line bg-surface p-5 sm:p-7">
          <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            Your technology, in plain English
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="e.g. low-power edge AI for autonomous drones"
              className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-4 py-[14px] text-[15px] text-text outline-none transition placeholder:text-faint focus:border-signal-dim"
            />
            <button
              onClick={() => run()}
              disabled={state === "scanning"}
              className="whitespace-nowrap rounded-xl bg-signal px-6 py-[14px] font-mono text-xs font-bold uppercase tracking-wider text-bg transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
            >
              {state === "scanning" ? "Scanning…" : "Scan for matches"}
            </button>
          </div>

          {/* example chips */}
          {state === "idle" && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-faint">Try:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => run(ex)}
                  className="rounded-full border border-line px-3 py-1 text-[12px] text-dim transition hover:border-signal-dim hover:text-text"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}

          {/* scanning */}
          {state === "scanning" && (
            <div className="mt-6 flex items-center gap-3 font-mono text-[12px] text-dim">
              <span className="inline-block h-2.5 w-2.5 animate-ping rounded-full bg-signal" />
              Reading 1,500+ open topics across 11 agencies…
            </div>
          )}

          {/* results */}
          {state === "done" && (
            <div className="mt-6 flex flex-col gap-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
                {results.length} strong match{results.length > 1 ? "es" : ""} found
              </div>
              {results.map(({ topic, score }) => (
                <div
                  key={topic.title}
                  className="relative overflow-hidden rounded-xl border border-line bg-bg p-5"
                >
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-signal" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wide text-dim">
                      <span className="text-signal">{topic.agency}</span>
                      <span>{topic.program}</span>
                    </div>
                    <div className="flex-none text-right">
                      <span className="font-mono text-[26px] font-bold leading-none text-signal">
                        {score}
                        <span className="text-[11px] text-faint">/100</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-2 text-[16px] font-bold leading-snug">{topic.title}</h3>
                  <div className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3 text-[13px] leading-snug">
                    <div className="flex gap-2">
                      <span className="w-10 flex-none font-mono text-[10px] uppercase tracking-wide text-faint">
                        Why
                      </span>
                      <span className="text-dim">{topic.why}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-10 flex-none font-mono text-[10px] uppercase tracking-wide text-faint">
                        Next
                      </span>
                      <span className="text-dim">{topic.next}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-10 flex-none font-mono text-[10px] uppercase tracking-wide text-faint">
                        Flag
                      </span>
                      <span className="text-amber">
                        Window closes in {topic.deadlineDays} days — move now.
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="mt-1 text-center font-mono text-[10px] tracking-wide text-faint">
                Illustrative preview · the live product scores real, current .gov solicitations.
              </p>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
