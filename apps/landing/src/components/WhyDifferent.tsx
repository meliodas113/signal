import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

const BAD = [
  "Keyword filters miss topics that fit but use different language",
  "SBIR topics live across 11 agency portals, not one feed",
  "Deadlines hide in PDFs — windows close in days",
  "No read on whether you're actually eligible",
];

const GOOD = [
  "AI matches your technology to topic text, not keywords",
  "One feed across every participating agency",
  "Deadline countdowns + alerts before the window shuts",
  "Eligibility flags, incl. STTR research-partner rules",
];

export function WhyDifferent() {
  return (
    <section id="why" className="mx-auto max-w-[1140px] px-7 py-16 md:py-24">
      <Reveal>
        <div className="mb-14 max-w-[60ch]">
          <Kicker>The problem</Kicker>
          <h3 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
            Keyword search can&apos;t read a solicitation.
          </h3>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-dim">
            SBIR topics are paragraphs of agency-speak. Search &quot;AI&quot; and you drown in noise;
            miss the topic that actually fits and you miss the money. The work is interpretation —
            which is exactly what an LLM does well.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
        <Reveal>
          <div className="rounded-2xl border border-line bg-surface p-[30px]">
            <div className="mb-[18px] font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Searching grants.gov yourself
            </div>
            <h4 className="mb-3.5 text-xl font-bold">Hours of scrolling, still guessing</h4>
            <ul>
              {BAD.map((t, i) => (
                <li
                  key={i}
                  className="flex gap-3 border-t border-line py-[9px] text-[14.5px] text-dim first:border-t-0"
                >
                  <span className="w-4 flex-none font-mono text-danger">✕</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-2xl border border-line bg-surface p-[30px]">
            <div className="mb-[18px] font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
              With SIGNAL
            </div>
            <h4 className="mb-3.5 text-xl font-bold">Matched, scored, and watched</h4>
            <ul>
              {GOOD.map((t, i) => (
                <li
                  key={i}
                  className="flex gap-3 border-t border-line py-[9px] text-[14.5px] text-dim first:border-t-0"
                >
                  <span className="w-4 flex-none font-mono text-signal">→</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
