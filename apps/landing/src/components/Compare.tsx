import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

const ROWS: { label: string; grants: string; consultant: string; signal: string }[] = [
  {
    label: "Coverage",
    grants: "One portal at a time",
    consultant: "Whatever they track",
    signal: "All 11 agencies, one feed",
  },
  {
    label: "Matching",
    grants: "Keyword search",
    consultant: "Human judgment, slow",
    signal: "AI reads topic intent vs. your tech",
  },
  {
    label: "Fit scoring",
    grants: "None",
    consultant: "Subjective",
    signal: "0–100 score + plain-English reason",
  },
  {
    label: "Deadline tracking",
    grants: "You dig through PDFs",
    consultant: "Manual",
    signal: "Automatic countdowns + alerts",
  },
  {
    label: "Eligibility checks",
    grants: "DIY",
    consultant: "Sometimes",
    signal: "Flagged up front (incl. STTR)",
  },
  {
    label: "Speed to shortlist",
    grants: "Hours of scrolling",
    consultant: "Days",
    signal: "Under a minute",
  },
  {
    label: "Cost",
    grants: "Free, but your time",
    consultant: "$$$ / % of award",
    signal: "Free tier, $29/mo Pro",
  },
];

export function Compare() {
  return (
    <section className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
      <Reveal>
        <div className="mx-auto mb-10 max-w-[60ch] text-center md:mb-14">
          <Kicker center>Why SIGNAL</Kicker>
          <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
            The same goal, a fraction of the work.
          </h2>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="overflow-hidden rounded-2xl border border-line">
          {/* header */}
          <div className="grid grid-cols-[1.1fr_1fr_1fr_1.2fr] bg-surface text-left">
            <div className="px-3 py-4 sm:px-5" />
            <div className="px-3 py-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-dim sm:px-5 sm:text-[11px]">
              grants.gov
            </div>
            <div className="px-3 py-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-dim sm:px-5 sm:text-[11px]">
              Consultant
            </div>
            <div className="bg-[rgba(194,245,63,0.05)] px-3 py-4 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-signal sm:px-5 sm:text-[11px]">
              SIGNAL
            </div>
          </div>
          {/* rows */}
          {ROWS.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[1.1fr_1fr_1fr_1.2fr] border-t border-line text-[12.5px] sm:text-[13.5px]"
            >
              <div className="px-3 py-4 font-bold sm:px-5">{r.label}</div>
              <div className="px-3 py-4 text-center text-faint sm:px-5">{r.grants}</div>
              <div className="px-3 py-4 text-center text-faint sm:px-5">{r.consultant}</div>
              <div className="bg-[rgba(194,245,63,0.04)] px-3 py-4 text-center text-text sm:px-5">
                {r.signal}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
