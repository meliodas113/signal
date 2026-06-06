import { Reveal } from "./Reveal";

// The federal agencies that run SBIR/STTR programs SIGNAL tracks.
const AGENCIES = [
  "DoD",
  "NASA",
  "NSF",
  "NIH",
  "DOE",
  "DARPA",
  "DHS",
  "USDA",
  "DOT",
  "EPA",
  "NOAA",
  "ED",
];

export function AgencyWall() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto max-w-[1140px] px-5 py-10 sm:px-7 md:py-12">
        <Reveal>
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
            One radar across every participating SBIR / STTR agency
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="mt-7 grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-4 md:grid-cols-6">
            {AGENCIES.map((a) => (
              <div
                key={a}
                className="flex items-center justify-center font-mono text-[15px] font-bold tracking-wider text-dim transition hover:text-text sm:text-base"
              >
                {a}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
