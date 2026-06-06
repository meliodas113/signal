import { useState } from "react";
import { Reveal } from "./Reveal";

// Federal agencies that run SBIR/STTR programs SIGNAL tracks. Descriptions are
// factual summaries of each agency's focus.
const AGENCIES = [
  {
    abbr: "DoD",
    name: "Department of Defense",
    focus:
      "The largest SBIR/STTR program — AFWERX, Navy, Army and more. Dual-use defense tech from autonomy to advanced materials.",
  },
  {
    abbr: "NASA",
    name: "National Aeronautics & Space Administration",
    focus:
      "Aerospace and in-space systems: propulsion, autonomy, sensing, and resilient hardware for extreme environments.",
  },
  {
    abbr: "NSF",
    name: "National Science Foundation",
    focus:
      "America's Seed Fund — broad deep-tech R&D across nearly every field of science and engineering.",
  },
  {
    abbr: "NIH",
    name: "National Institutes of Health",
    focus:
      "Biomedical and health innovation: diagnostics, therapeutics, medical devices, and digital health.",
  },
  {
    abbr: "DOE",
    name: "Department of Energy",
    focus: "Clean energy, storage, the grid, advanced materials, and the physical sciences.",
  },
  {
    abbr: "DARPA",
    name: "Defense Advanced Research Projects Agency",
    focus: "High-risk, high-reward breakthroughs — the moonshots of national-security technology.",
  },
  {
    abbr: "DHS",
    name: "Department of Homeland Security",
    focus: "Critical-infrastructure protection, cybersecurity, and resilience.",
  },
  {
    abbr: "USDA",
    name: "Department of Agriculture",
    focus: "AgTech, food systems, rural innovation, and biotechnology.",
  },
  {
    abbr: "DOT",
    name: "Department of Transportation",
    focus: "Mobility, infrastructure, safety, and next-generation transportation systems.",
  },
  {
    abbr: "EPA",
    name: "Environmental Protection Agency",
    focus: "Environmental monitoring, remediation, and pollution-reduction technology.",
  },
  {
    abbr: "NOAA",
    name: "Nat'l Oceanic & Atmospheric Administration",
    focus: "Ocean, climate, weather, and Earth-observation technologies.",
  },
  {
    abbr: "ED",
    name: "Department of Education",
    focus: "Education technology and learning-science innovation.",
  },
];

export function AgencyWall() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? selected;
  const agency = AGENCIES[active];

  return (
    <section className="border-y border-line">
      <div className="mx-auto max-w-[1140px] px-5 py-10 sm:px-7 md:py-14">
        <Reveal>
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
            One radar across every participating SBIR / STTR agency
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div
            className="mt-7 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6"
            onMouseLeave={() => setHovered(null)}
          >
            {AGENCIES.map((a, i) => {
              const on = active === i;
              return (
                <button
                  key={a.abbr}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                  className={`rounded-xl border px-2 py-3.5 text-center font-mono text-[14px] font-bold tracking-wider transition-all duration-200 sm:text-[15px] ${
                    on
                      ? "-translate-y-0.5 border-signal-dim bg-[rgba(194,245,63,0.07)] text-signal shadow-[0_0_22px_rgba(194,245,63,0.14)]"
                      : "border-line text-dim hover:text-text"
                  }`}
                >
                  {a.abbr}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* detail panel reflects hovered (preview) or selected (pinned) agency */}
        <Reveal delay={0.12}>
          <div className="mt-5 flex min-h-[92px] items-center gap-4 rounded-2xl border border-line bg-surface p-5 sm:gap-5 sm:p-6">
            <div className="scope-mini h-11 w-11 flex-none sm:h-12 sm:w-12" aria-hidden />
            <div key={active} className="animate-[sig-rise_0.3s_ease-out]">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="font-mono text-[15px] font-bold tracking-wide text-signal">
                  {agency.abbr}
                </span>
                <span className="text-[13px] font-semibold text-text">{agency.name}</span>
              </div>
              <p className="mt-1.5 max-w-[70ch] text-[13.5px] leading-relaxed text-dim">
                {agency.focus}
              </p>
            </div>
          </div>
          <p className="mt-2.5 text-center font-mono text-[10px] tracking-wide text-faint">
            Hover or tap an agency · SIGNAL scores your tech against every one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
