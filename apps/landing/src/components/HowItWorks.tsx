import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    no: "STEP 01",
    title: "Describe your tech",
    body: "Tell the radar what you build, your edge, and your phase interest — in plain English, once.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    ),
  },
  {
    no: "STEP 02",
    title: "It scans daily",
    body: "Every day SIGNAL pulls fresh solicitations from official .gov sources and flags what's new or closing soon.",
    icon: (
      <>
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        <circle cx="12" cy="12" r="5" />
      </>
    ),
  },
  {
    no: "STEP 03",
    title: "You get matched",
    body: "A short digest lands in your inbox: scored topics, why each fits, next step, and the ticking deadline.",
    icon: (
      <>
        <path d="M4 4h16v12H5.2L4 18z" />
        <path d="M8 9h8M8 12h5" />
      </>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
      <Reveal>
        <div className="mb-14 max-w-[60ch]">
          <Kicker>How it works</Kicker>
          <h3 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
            Calibrate once. The radar runs itself.
          </h3>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.no} delay={i * 0.08}>
            <div className="group h-full rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-signal-dim sm:p-[30px]">
              <div className="mb-5 font-mono text-xs tracking-[0.2em] text-signal">{s.no}</div>
              <div className="mb-[18px] flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-signal-dim bg-[rgba(194,245,63,0.06)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-signal)" strokeWidth="1.6">
                  {s.icon}
                </svg>
              </div>
              <h4 className="mb-2.5 text-[19px] font-bold">{s.title}</h4>
              <p className="text-sm leading-relaxed text-dim">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
