import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

const TIERS = [
  {
    name: "Scout",
    price: "$0",
    pro: false,
    features: [
      "Federal SBIR/STTR coverage",
      "Weekly matched digest",
      "One startup profile",
      "Fit scores + reasons",
    ],
    cta: "Start free",
  },
  {
    name: "Operator",
    price: "$29",
    pro: true,
    features: [
      "Everything in Scout",
      "Daily alerts + deadline reminders",
      "All agencies + curated state/local sources",
      "Multiple profiles & tracked pipeline",
    ],
    cta: "Get Operator",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
      <Reveal>
        <div className="mx-auto mb-14 max-w-[60ch] text-center">
          <Kicker center>Pricing</Kicker>
          <h3 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
            Start free. Upgrade when the clock matters.
          </h3>
        </div>
      </Reveal>

      <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-[18px] md:grid-cols-2">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div
              className={`relative h-full rounded-2xl border p-6 sm:p-[34px] ${
                t.pro
                  ? "border-signal-dim bg-[linear-gradient(180deg,rgba(194,245,63,0.05),transparent_40%)]"
                  : "border-line bg-surface"
              }`}
            >
              {t.pro && (
                <span className="absolute right-5 top-5 rounded-full bg-signal px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-bg">
                  Most chosen
                </span>
              )}
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{t.name}</div>
              <div className="mb-1 mt-3.5 text-[46px] font-extrabold tracking-tight">
                {t.price}
                <span className="text-[15px] font-normal text-dim"> /mo</span>
              </div>
              <ul className="my-6">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-3 border-t border-line py-2.5 text-sm text-dim first:border-t-0">
                    <span className="font-mono text-signal">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#get"
                className={`block rounded-[10px] py-3.5 text-center font-mono text-xs font-bold uppercase tracking-wider transition ${
                  t.pro
                    ? "bg-signal text-bg hover:shadow-[0_0_22px_rgba(194,245,63,0.3)]"
                    : "border border-line text-text hover:border-faint"
                }`}
              >
                {t.cta}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
