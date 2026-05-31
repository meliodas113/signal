import { RadarScope } from "../../../../packages/ui/RadarScope";
import { EmailCapture } from "./EmailCapture";
import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

const BLIPS = [
  { top: 30, left: 64, label: "AF243 · 96", delay: 0.1 },
  { top: 58, left: 40, label: "NSF · 88", delay: 1.1 },
  { top: 44, left: 74, label: "NIH", delay: 2.0 },
  { top: 70, left: 60, label: "DOE", delay: 0.7 },
];

export function Hero() {
  return (
    <header className="mx-auto grid max-w-[1140px] grid-cols-1 items-center gap-14 px-7 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-[90px]">
      <div className="order-2 md:order-1">
        <Reveal>
          <Kicker>Non-dilutive funding radar</Kicker>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mb-6 mt-6 text-[clamp(38px,5.4vw,62px)] font-extrabold leading-[0.98] tracking-[-0.025em]">
            The right SBIR topics, <em className="not-italic text-signal">before</em> the deadline.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mb-9 max-w-[46ch] text-[18px] leading-relaxed text-dim">
            Federal agencies bury billions in non-dilutive funding inside dense solicitation text.
            SIGNAL reads your technology and scores every open topic for real fit — then watches the
            clock so you never miss a window.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <EmailCapture cta="Get access" />
          <p className="mt-3.5 font-mono text-[11px] tracking-wide text-faint">
            No card. Free tier covers federal SBIR/STTR. Built on official .gov data.
          </p>
        </Reveal>
      </div>

      <Reveal className="order-1 flex justify-center md:order-2" delay={0.1}>
        <RadarScope size={380} blips={BLIPS} readout="8 open · 3 strong matches" />
      </Reveal>
    </header>
  );
}
