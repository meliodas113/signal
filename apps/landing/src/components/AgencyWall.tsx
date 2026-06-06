import { useRef, type ReactNode } from "react";
import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

// Distinct, domain-relevant line icons (cohesive 24px set).
const ICONS: Record<string, ReactNode> = {
  DoD: <path d="M12 3l7 2.5v5.5c0 4.2-2.9 7-7 8.5-4.1-1.5-7-4.3-7-8.5V5.5z" />,
  NASA: (
    <>
      <path d="M12 2.5c2.4 2 3.8 4.9 3.8 7.8L12 13.8 8.2 10.3C8.2 7.4 9.6 4.5 12 2.5z" />
      <circle cx="12" cy="8.3" r="1.3" />
      <path d="M8.4 11.5L6 13.8l.6 2.8 2.6-1.6M15.6 11.5L18 13.8l-.6 2.8-2.6-1.6" />
    </>
  ),
  NSF: (
    <>
      <circle cx="12" cy="12" r="1.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </>
  ),
  NIH: <path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z" />,
  DOE: <path d="M13 2.5L5 13.5h5.5L9.5 21.5l8.5-11.5H12z" />,
  DARPA: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </>
  ),
  DHS: <path d="M3 21h18M5 21V9.5l7-4 7 4V21M9.5 21v-5.5h5V21" />,
  USDA: (
    <>
      <path d="M5 19c0-7.5 5.5-13 14-13.5C18.5 14 13 19.5 5.5 20 5 20 5 19.5 5 19z" />
      <path d="M6 18c3-4 6.5-6.5 10-7.5" />
    </>
  ),
  DOT: (
    <>
      <path d="M6.5 21L8.5 3M17.5 21L15.5 3" />
      <path d="M12 5v2.5M12 11v2.5M12 17v2" />
    </>
  ),
  EPA: (
    <>
      <path d="M12 3.2c3.4 3.8 5.6 6.8 5.6 9.6a5.6 5.6 0 0 1-11.2 0c0-2.8 2.2-5.8 5.6-9.6z" />
      <path d="M9.6 13.5a2.4 2.4 0 0 0 2.4 2.4" />
    </>
  ),
  NOAA: (
    <>
      <path d="M3 8.5c1.8 0 1.8 1.8 3.6 1.8S8.4 8.5 10.2 8.5 12 10.3 13.8 10.3 15.6 8.5 17.4 8.5 19.2 10.3 21 10.3" />
      <path d="M3 14c1.8 0 1.8 1.8 3.6 1.8S8.4 14 10.2 14 12 15.8 13.8 15.8 15.6 14 17.4 14 19.2 15.8 21 15.8" />
    </>
  ),
  ED: (
    <>
      <path d="M2.5 9L12 5l9.5 4-9.5 4z" />
      <path d="M6.5 11.2V15c0 1.6 2.6 3 5.5 3s5.5-1.4 5.5-3v-3.8" />
      <path d="M21.5 9v5" />
    </>
  ),
};

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
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-signal-dim bg-[rgba(194,245,63,0.06)]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-signal)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {ICONS[a.abbr]}
                    </svg>
                  </span>
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
