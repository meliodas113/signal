import { useRef } from "react";
import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

// Federal agencies that run SBIR/STTR programs SIGNAL tracks. Descriptions are
// factual summaries of each agency's focus.
const AGENCIES = [
  { abbr: "DoD", name: "Department of Defense", focus: "Largest SBIR program — AFWERX, Navy, Army. Dual-use defense tech." },
  { abbr: "NASA", name: "Aeronautics & Space", focus: "In-space systems, propulsion, autonomy, sensing for extreme environments." },
  { abbr: "NSF", name: "National Science Foundation", focus: "America's Seed Fund — broad deep-tech R&D across science & engineering." },
  { abbr: "NIH", name: "National Institutes of Health", focus: "Biomedical & health: diagnostics, therapeutics, devices, digital health." },
  { abbr: "DOE", name: "Department of Energy", focus: "Clean energy, storage, the grid, advanced materials, physical sciences." },
  { abbr: "DARPA", name: "Defense Advanced Research", focus: "High-risk, high-reward breakthroughs — national-security moonshots." },
  { abbr: "DHS", name: "Homeland Security", focus: "Critical-infrastructure protection, cybersecurity, and resilience." },
  { abbr: "USDA", name: "Department of Agriculture", focus: "AgTech, food systems, rural innovation, and biotechnology." },
  { abbr: "DOT", name: "Department of Transportation", focus: "Mobility, infrastructure, safety, next-gen transportation systems." },
  { abbr: "EPA", name: "Environmental Protection", focus: "Environmental monitoring, remediation, and pollution-reduction tech." },
  { abbr: "NOAA", name: "Oceanic & Atmospheric", focus: "Ocean, climate, weather, and Earth-observation technologies." },
  { abbr: "ED", name: "Department of Education", focus: "Education technology and learning-science innovation." },
];

export function AgencyWall() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Move a radial "spotlight" with the cursor (CSS vars, no re-render).
  function onMove(e: React.MouseEvent) {
    const el = gridRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <section className="border-y border-line">
      <div className="mx-auto max-w-[1140px] px-5 py-14 sm:px-7 md:py-20">
        <Reveal>
          <div className="mx-auto mb-10 max-w-[60ch] text-center">
            <Kicker center>Total coverage</Kicker>
            <h2 className="mt-[18px] text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.08] tracking-[-0.02em]">
              Every agency. One radar.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-dim">
              SBIR/STTR lives across a dozen federal portals. SIGNAL watches them all — hover any to
              see what it funds.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div
            ref={gridRef}
            onMouseMove={onMove}
            className="group relative grid grid-cols-2 gap-2.5 rounded-3xl sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
          >
            {/* cursor-following spotlight (behind the translucent cards) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(194,245,63,0.12), transparent 70%)",
              }}
            />

            {AGENCIES.map((a) => (
              <article
                key={a.abbr}
                className="agency-card relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-4 backdrop-blur-sm transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-signal-dim/60 hover:bg-surface hover:shadow-[0_12px_34px_rgba(0,0,0,0.4)] sm:p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="scope-mini h-9 w-9" aria-hidden />
                  <span className="font-mono text-[18px] font-bold tracking-wider text-signal sm:text-[20px]">
                    {a.abbr}
                  </span>
                </div>
                <div className="text-[12.5px] font-bold leading-snug text-text">{a.name}</div>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-dim">{a.focus}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
