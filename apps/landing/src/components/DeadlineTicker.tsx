import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

/**
 * A continuously scrolling ticker of opportunities with live countdowns —
 * proves the "we watch the clock" promise and creates urgency. The topics
 * shown are illustrative examples of the kind SIGNAL tracks.
 */

const TOPICS = [
  { agency: "DoD", title: "Edge AI for Autonomous ISR", days: 6 },
  { agency: "NIH", title: "AI Diagnostics — Early Detection", days: 12 },
  { agency: "NASA", title: "In-Space Autonomous Operations", days: 4 },
  { agency: "DOE", title: "Grid-Edge Energy Storage", days: 18 },
  { agency: "NSF", title: "Deep-Tech Seed Fund (broad)", days: 9 },
  { agency: "DARPA", title: "Resilient Multi-Modal Sensing", days: 3 },
  { agency: "USDA", title: "AgTech Automation & Robotics", days: 22 },
  { agency: "DHS", title: "Critical-Infrastructure Cyber", days: 7 },
];

function Item({ agency, title, days }: { agency: string; title: string; days: number }) {
  const urgent = days <= 7;
  return (
    <div className="flex items-center gap-3 px-6">
      <span className="font-mono text-[11px] font-bold tracking-wide text-signal">{agency}</span>
      <span className="text-sm text-text">{title}</span>
      <span
        className={`whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide ${
          urgent ? "border-amber/40 text-amber" : "border-line text-faint"
        }`}
      >
        closes in {days}d
      </span>
      <span className="text-line">•</span>
    </div>
  );
}

export function DeadlineTicker() {
  const row = [...TOPICS, ...TOPICS]; // duplicate for seamless loop
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto mb-9 max-w-[1140px] px-5 sm:px-7">
        <Reveal>
          <div className="max-w-[60ch]">
            <Kicker>Always watching</Kicker>
            <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              Windows close in days. SIGNAL never blinks.
            </h2>
            <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-dim">
              Deadlines hide in PDFs and amendments. The radar tracks every one and warns you while
              there's still time to act.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.06}>
        <div className="group relative overflow-hidden border-y border-line bg-surface py-4">
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
          <div className="flex w-max animate-[sig-marquee_38s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {row.map((t, i) => (
              <Item key={i} {...t} />
            ))}
          </div>
        </div>
        <p className="mx-auto mt-3 max-w-[1140px] px-5 text-center font-mono text-[10px] tracking-wide text-faint sm:px-7">
          Illustrative examples of the opportunities SIGNAL monitors.
        </p>
      </Reveal>
    </section>
  );
}
