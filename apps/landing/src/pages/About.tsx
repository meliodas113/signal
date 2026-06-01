import { useEffect, useRef, useState, type ReactNode } from "react";
import { RadarScope } from "../../../../packages/ui/RadarScope";
import { EmailCapture } from "../components/EmailCapture";
import { Kicker } from "../components/Kicker";
import { Reveal } from "../components/Reveal";

/* -------------------------------------------------------------------------- */
/*  Small interactive primitives (no external deps)                            */
/* -------------------------------------------------------------------------- */

/** Counts up to `target` the first time it scrolls into view. */
function CountUp({
  target,
  prefix = "",
  suffix = "",
  duration = 1100,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/** Accessible expand/collapse row. */
function AccordionItem({
  open,
  onToggle,
  index,
  title,
  meta,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  index: string;
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-line first:border-t-0">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 py-5 text-left transition hover:opacity-90"
      >
        <span className="font-mono text-xs text-faint">{index}</span>
        <span className="flex-1 text-[17px] font-bold leading-snug sm:text-lg">{title}</span>
        {meta && (
          <span className="hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-signal sm:inline">
            {meta}
          </span>
        )}
        <span
          className={`flex-none font-mono text-signal transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pr-8 text-[14.5px] leading-relaxed text-dim">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content                                                                     */
/* -------------------------------------------------------------------------- */

const PAIN_POINTS = [
  {
    title: "Opportunities are scattered across 11+ agency portals",
    meta: "Fragmentation",
    body: "SBIR/STTR topics are published by the DoD, NASA, NSF, NIH, DOE, and seven more agencies — each with its own portal, schedule, and format. There is no single source of truth, so founders end up tab-hopping across a dozen sites just to know what is open.",
  },
  {
    title: "Keyword search can't read a solicitation",
    meta: "Relevance",
    body: "Topics are paragraphs of dense agency-speak. Search \"AI\" and you drown in false positives; the topic that actually fits your stack uses different language and never surfaces. The real work is interpretation — judging whether a solicitation matches your technology — and keyword filters simply can't do it.",
  },
  {
    title: "Deadlines are buried inside PDFs",
    meta: "Timing",
    body: "Close dates live deep in solicitation documents and amendment notices. Windows can be as short as a few weeks, and by the time a relevant topic surfaces through word-of-mouth, it is often days from closing — or already gone.",
  },
  {
    title: "Eligibility rules are easy to miss",
    meta: "Compliance",
    body: "Each program has its own size-standard, ownership, and research-partner requirements. STTR in particular requires a formal partnership with a research institution and a minimum work split. Miss one rule and weeks of proposal work are disqualified on a technicality.",
  },
  {
    title: "Manual scanning eats your scarcest hours",
    meta: "Cost",
    body: "The people best able to judge fit — founders, CTOs, and principal investigators — are exactly the people whose time is most expensive. Turning them into part-time grant-portal scrapers is the worst possible use of that time.",
  },
  {
    title: "A missed window is non-dilutive money left on the table",
    meta: "Impact",
    body: "SBIR/STTR is equity-free capital — billions of dollars a year that fund R&D without touching your cap table. Every window you miss is dilution you take on later, or a milestone you never reach.",
  },
];

const CAPABILITIES = [
  {
    key: "read",
    label: "Read",
    headline: "Reads the full solicitation, not the title",
    body: "SIGNAL ingests the complete topic text from official .gov sources — objectives, technical scope, phase structure, and the fine print — so matching is based on what an agency actually wants, not a truncated headline.",
    points: ["Full-text ingestion", "Official .gov sources", "Phase & track aware"],
  },
  {
    key: "match",
    label: "Match",
    headline: "Matches your technology to topic intent",
    body: "You describe what you build once, in plain English. SIGNAL compares the meaning of your technology against the meaning of every open topic — surfacing fits a keyword search would never connect.",
    points: ["Semantic, not keyword", "Your stack vs. topic intent", "Cross-agency in one pass"],
  },
  {
    key: "score",
    label: "Score",
    headline: "Scores fit and tells you why",
    body: "Every opportunity comes back with a 0–100 fit score, a one-line reason it matches your stack, the suggested next move, and any eligibility catch — so you can decide in seconds, not afternoons.",
    points: ["0–100 fit score", "Plain-English rationale", "Eligibility flags"],
  },
  {
    key: "watch",
    label: "Watch",
    headline: "Watches the clock so you don't have to",
    body: "SIGNAL re-scans daily, tracks every deadline, and counts down the window on each match — flagging topics that are closing soon while there is still time to act.",
    points: ["Daily re-scan", "Deadline countdowns", "Closing-soon alerts"],
  },
  {
    key: "alert",
    label: "Alert",
    headline: "Brings the matches to you",
    body: "A short, scored digest lands in your inbox on your cadence — weekly on the free tier, daily with deadline reminders on Operator. No dashboard babysitting required.",
    points: ["Inbox digest", "Your cadence", "Zero portal-hopping"],
  },
] as const;

const PIPELINE = [
  {
    tag: "01 · Ingest",
    title: "Pull from official sources",
    body: "Every day SIGNAL pulls fresh solicitations and amendments from official .gov feeds across all participating agencies, normalizing them into one structured stream.",
  },
  {
    tag: "02 · Parse",
    title: "Structure the dense text",
    body: "Each solicitation is parsed into its meaningful parts — objectives, technical scope, phase/track, eligibility, and deadlines — so nothing important stays buried in a PDF.",
  },
  {
    tag: "03 · Match",
    title: "Compare meaning to meaning",
    body: "Your technology profile is compared against the intent of every open topic, so genuine fits surface even when they share no keywords with how you describe yourself.",
  },
  {
    tag: "04 · Score",
    title: "Rank, reason, and flag",
    body: "Matches are scored 0–100, annotated with why they fit and what to do next, and checked against eligibility rules — including STTR research-partner requirements.",
  },
  {
    tag: "05 · Deliver",
    title: "Digest + deadline watch",
    body: "The top matches land in your inbox as a scored digest, each with a ticking deadline, and SIGNAL keeps watching so you are alerted before any window closes.",
  },
];

const PERSONAS = [
  { title: "Deep-tech founders", body: "Fund R&D without giving up equity." },
  { title: "Principal investigators", body: "Find topics that fit the lab's actual work." },
  { title: "Grant & proposal consultants", body: "Cover more clients across more agencies." },
  { title: "Accelerators & studios", body: "Surface non-dilutive paths for the portfolio." },
];

const FAQ = [
  {
    q: "Where does the data come from?",
    a: "Open opportunity data is sourced from official, public .gov records across participating SBIR/STTR agencies. SIGNAL is an independent tool and is not affiliated with or endorsed by the U.S. government, the SBA, or any agency — always confirm details on the official solicitation before applying.",
  },
  {
    q: "How is this different from searching grants.gov myself?",
    a: "Portals match on keywords and make you visit each agency separately. SIGNAL reads the full text of every topic, matches it to the meaning of your technology across all agencies at once, scores the fit, and watches deadlines for you — turning hours of scrolling into a scored digest.",
  },
  {
    q: "Do I need to give up equity or pay to apply?",
    a: "No. SBIR/STTR funding is non-dilutive — it does not touch your cap table. SIGNAL's free Scout tier covers federal SBIR/STTR matching at no cost; you only pay if you want daily alerts, more sources, and multiple profiles.",
  },
  {
    q: "What about eligibility — especially STTR?",
    a: "Every match is checked against program rules and flags eligibility catches, including STTR's requirement to formally partner with a research institution and meet minimum work-split thresholds, so you do not invest in a proposal you cannot submit.",
  },
  {
    q: "How fast is it?",
    a: "After a one-time profile setup, you go from \"what's open?\" to a scored shortlist in under a minute, and the radar keeps running on its own every day after that.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                        */
/* -------------------------------------------------------------------------- */

const ABOUT_BLIPS = [
  { top: 28, left: 62, label: "AF243 · 96", delay: 0.1 },
  { top: 54, left: 38, label: "NSF · 88", delay: 1.0 },
  { top: 42, left: 76, label: "NIH", delay: 1.8 },
  { top: 68, left: 58, label: "DOE", delay: 0.6 },
];

export function About() {
  const [openPain, setOpenPain] = useState<number | null>(0);
  const [activeCap, setActiveCap] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [withSignal, setWithSignal] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const cap = CAPABILITIES[activeCap];

  return (
    <main>
      {/* ---------------------------------------------------------------- Intro */}
      <section className="mx-auto max-w-[1140px] px-5 pb-10 pt-12 sm:px-7 md:pb-16 md:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <Kicker>About SIGNAL</Kicker>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mb-6 mt-6 text-[clamp(34px,5vw,58px)] font-extrabold leading-[1.0] tracking-[-0.025em]">
                Billions in non-dilutive funding, hidden in plain{" "}
                <em className="not-italic text-signal">text</em>.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-[54ch] text-[18px] leading-relaxed text-dim">
                SIGNAL is a grant radar for SBIR/STTR. Federal agencies pour billions of
                equity-free dollars into early R&amp;D every year — but the opportunities are buried
                across a dozen portals in dense solicitation language. SIGNAL reads that text the
                way a domain expert would, matches it to <em className="not-italic text-text">your</em>{" "}
                technology, scores the fit, and watches every deadline so you never miss a window.
              </p>
            </Reveal>
          </div>

          <Reveal className="flex justify-center" delay={0.1}>
            <div className="w-full max-w-[300px] sm:max-w-[340px] md:max-w-none">
              <RadarScope size={360} blips={ABOUT_BLIPS} readout="reading 1,500 topics / day" />
            </div>
          </Reveal>
        </div>

        {/* quick stat band */}
        <Reveal delay={0.16}>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:mt-16 md:grid-cols-4">
            {[
              { node: <CountUp prefix="$" target={4} suffix="B+" />, label: "Equity-free / year" },
              { node: <CountUp target={11} />, label: "Federal agencies" },
              { node: <CountUp target={1500} suffix="+" />, label: "Topics scanned daily" },
              { node: <CountUp target={0} suffix="%" />, label: "Equity given up" },
            ].map((s, i) => (
              <div key={i} className="bg-surface px-5 py-7 text-center">
                <div className="font-mono text-[30px] font-bold tracking-tight text-signal sm:text-[34px]">
                  {s.node}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ Pain points */}
      <section className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
        <Reveal>
          <div className="mb-10 max-w-[60ch] md:mb-14">
            <Kicker>The pain today</Kicker>
            <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              Finding the right topic is a part-time job nobody has time for.
            </h2>
            <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-dim">
              The money is real and the process is broken. Here is exactly where it falls apart
              today — tap any point to see why it costs you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="rounded-2xl border border-line bg-surface px-5 sm:px-8">
            {PAIN_POINTS.map((p, i) => (
              <AccordionItem
                key={p.title}
                open={openPain === i}
                onToggle={() => setOpenPain(openPain === i ? null : i)}
                index={`0${i + 1}`}
                title={p.title}
                meta={p.meta}
              >
                {p.body}
              </AccordionItem>
            ))}
          </div>
        </Reveal>
      </section>

      {/* --------------------------------------------------------- What it does */}
      <section className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
        <Reveal>
          <div className="mb-10 max-w-[60ch] md:mb-14">
            <Kicker>What it does</Kicker>
            <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              Five moves, one quiet radar.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="rounded-2xl border border-line bg-surface p-2 sm:p-3">
            {/* tab bar */}
            <div className="flex flex-wrap gap-2">
              {CAPABILITIES.map((c, i) => (
                <button
                  key={c.key}
                  onClick={() => setActiveCap(i)}
                  className={`rounded-xl px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider transition ${
                    activeCap === i
                      ? "bg-signal text-bg"
                      : "text-dim hover:bg-surface-2 hover:text-text"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* panel */}
            <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                  Step {activeCap + 1} / {CAPABILITIES.length}
                </div>
                <h3 className="mt-3 text-[22px] font-bold leading-tight sm:text-2xl">
                  {cap.headline}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-dim">{cap.body}</p>
              </div>
              <ul className="flex flex-col gap-2.5 md:border-l md:border-line md:pl-6">
                {cap.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-sm text-text">
                    <span className="font-mono text-signal">→</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------------- Why now */}
      <section className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
        <Reveal>
          <div className="mb-10 max-w-[60ch] md:mb-14">
            <Kicker>Why it's needed</Kicker>
            <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              The old way vs. the radar.
            </h2>
            <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-dim">
              Same goal — find and win non-dilutive funding. Flip the switch to compare the day-to-day.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          {/* toggle */}
          <div className="mb-7 inline-flex rounded-xl border border-line bg-surface p-1">
            <button
              onClick={() => setWithSignal(false)}
              className={`rounded-lg px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition ${
                !withSignal ? "bg-danger/15 text-danger" : "text-dim hover:text-text"
              }`}
            >
              Without SIGNAL
            </button>
            <button
              onClick={() => setWithSignal(true)}
              className={`rounded-lg px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition ${
                withSignal ? "bg-signal text-bg" : "text-dim hover:text-text"
              }`}
            >
              With SIGNAL
            </button>
          </div>

          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {(withSignal
              ? [
                  ["Discovery", "One feed across every participating agency."],
                  ["Relevance", "Semantic matches to your tech, scored 0–100."],
                  ["Deadlines", "Tracked automatically with closing-soon alerts."],
                  ["Eligibility", "Flagged up front, including STTR partner rules."],
                  ["Your time", "Minutes a week reviewing a scored digest."],
                  ["Outcome", "You act while the window is still open."],
                ]
              : [
                  ["Discovery", "Tab-hopping across 11+ separate agency portals."],
                  ["Relevance", "Keyword search buries the topics that actually fit."],
                  ["Deadlines", "Buried in PDFs — found days before they close."],
                  ["Eligibility", "Discovered late, after the proposal work is done."],
                  ["Your time", "Hours of manual scanning by your most expensive people."],
                  ["Outcome", "Windows close before you ever see them."],
                ]
            ).map(([label, text]) => (
              <div
                key={label}
                className={`rounded-2xl border bg-surface p-6 transition ${
                  withSignal ? "border-signal-dim" : "border-line"
                }`}
              >
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  <span className={withSignal ? "text-signal" : "text-danger"}>
                    {withSignal ? "✓" : "✕"}
                  </span>
                  {label}
                </div>
                <p className="text-[14.5px] leading-relaxed text-dim">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* --------------------------------------------------------- How it works */}
      <section className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
        <Reveal>
          <div className="mb-10 max-w-[60ch] md:mb-14">
            <Kicker>Under the hood</Kicker>
            <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              From raw solicitation to scored match.
            </h2>
            <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-dim">
              Tap a stage to follow a topic through the pipeline.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[0.85fr_1.15fr]">
          {/* stepper rail */}
          <Reveal>
            <ol className="flex flex-col gap-2">
              {PIPELINE.map((s, i) => (
                <li key={s.tag}>
                  <button
                    onClick={() => setActiveStep(i)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      activeStep === i
                        ? "border-signal-dim bg-surface"
                        : "border-line bg-transparent hover:bg-surface"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                        activeStep === i ? "bg-signal text-bg" : "bg-surface-2 text-dim"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`font-mono text-[11px] uppercase tracking-wider ${
                        activeStep === i ? "text-text" : "text-dim"
                      }`}
                    >
                      {s.tag}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* active stage detail */}
          <Reveal delay={0.06}>
            <div className="flex h-full flex-col justify-center rounded-2xl border border-line bg-surface bg-[radial-gradient(500px_240px_at_100%_0%,rgba(194,245,63,0.06),transparent_60%)] p-7 sm:p-9">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
                {PIPELINE[activeStep].tag}
              </div>
              <h3 className="mt-3 text-2xl font-bold leading-tight sm:text-[28px]">
                {PIPELINE[activeStep].title}
              </h3>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-dim">
                {PIPELINE[activeStep].body}
              </p>
              <div className="mt-7 flex gap-1.5">
                {PIPELINE.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition ${
                      i <= activeStep ? "bg-signal" : "bg-line"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- Personas */}
      <section className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
        <Reveal>
          <div className="mb-10 max-w-[60ch] md:mb-14">
            <Kicker>Who it's for</Kicker>
            <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              Built for the people who can't afford to miss it.
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-signal-dim">
                <h3 className="text-[17px] font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dim">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ FAQ */}
      <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-7 md:py-24">
        <Reveal>
          <div className="mb-10 text-center md:mb-14">
            <Kicker center>FAQ</Kicker>
            <h2 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              The questions founders actually ask.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="rounded-2xl border border-line bg-surface px-5 sm:px-8">
            {FAQ.map((f, i) => (
              <AccordionItem
                key={f.q}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                index={`0${i + 1}`}
                title={f.q}
              >
                {f.a}
              </AccordionItem>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      <section id="get" className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
        <Reveal>
          <div className="rounded-[22px] border border-line bg-surface bg-[radial-gradient(600px_300px_at_50%_0%,rgba(194,245,63,0.08),transparent_65%)] px-6 py-14 text-center sm:px-8 sm:py-[70px]">
            <h2 className="mx-auto mb-[18px] max-w-[20ch] text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              Let the radar do the scanning.
            </h2>
            <p className="mb-8 text-base text-dim">
              Start free — federal SBIR/STTR coverage, scored matches, no card required.
            </p>
            <EmailCapture cta="Get early access" centered />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
