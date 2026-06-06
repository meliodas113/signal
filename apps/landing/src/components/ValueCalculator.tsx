import { useState } from "react";
import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

/**
 * Interactive value estimator. Inputs are the visitor's own numbers; outputs
 * are clearly-labeled estimates using transparent assumptions.
 */

const WEEKS = 46; // working weeks / year
const SCAN_REDUCTION = 0.85; // share of manual scanning SIGNAL removes
const PHASE1_LOW = 50_000;
const PHASE1_HIGH = 314_000; // typical federal Phase I award range

function money(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{label}</label>
        <span className="font-mono text-lg font-bold text-signal">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="signal-range w-full"
        aria-label={label}
      />
    </div>
  );
}

export function ValueCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(6);
  const [awards, setAwards] = useState(2);

  const hoursSaved = Math.round(hoursPerWeek * WEEKS * SCAN_REDUCTION);
  const fundingLow = awards * PHASE1_LOW;
  const fundingHigh = awards * PHASE1_HIGH;

  return (
    <section className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
      <Reveal>
        <div className="mb-10 max-w-[60ch] md:mb-14">
          <Kicker>What's it worth</Kicker>
          <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
            Put a number on the upside.
          </h2>
          <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-dim">
            Drag the sliders to your reality. The radar turns scanning hours into shortlists — and
            surfaces non-dilutive funding you'd otherwise miss.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
          {/* inputs */}
          <div className="flex flex-col justify-center gap-8 rounded-2xl border border-line bg-surface p-7 sm:p-9">
            <Slider
              label="Hours/week hunting for grants"
              value={hoursPerWeek}
              min={1}
              max={20}
              suffix=" hrs"
              onChange={setHoursPerWeek}
            />
            <Slider
              label="Phase I awards you'd pursue / year"
              value={awards}
              min={1}
              max={10}
              onChange={setAwards}
            />
          </div>

          {/* outputs */}
          <div className="grid grid-cols-1 gap-[18px]">
            <div className="rounded-2xl border border-signal-dim bg-[linear-gradient(180deg,rgba(194,245,63,0.05),transparent_45%)] p-7 sm:p-9">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
                Time back / year
              </div>
              <div className="mt-2 font-mono text-[42px] font-extrabold leading-none text-text sm:text-[52px]">
                {hoursSaved.toLocaleString()} hrs
              </div>
              <p className="mt-2 text-sm text-dim">
                ~{Math.round(hoursSaved / 8)} working days no longer spent scrolling portals.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-7 sm:p-9">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                Non-dilutive funding in reach
              </div>
              <div className="mt-2 font-mono text-[30px] font-extrabold leading-none text-signal sm:text-[36px]">
                {money(fundingLow)} – {money(fundingHigh)}
              </div>
              <p className="mt-2 text-sm text-dim">
                Across {awards} Phase I {awards > 1 ? "pursuits" : "pursuit"}, equity-free.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 font-mono text-[10px] tracking-wide text-faint">
          Estimate only · based on typical federal Phase I award ranges ($50k–$314k) and an 85%
          reduction in manual scanning. Your results will vary.
        </p>
      </Reveal>
    </section>
  );
}
