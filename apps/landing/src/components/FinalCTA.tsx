import { EmailCapture } from "./EmailCapture";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section id="get" className="mx-auto max-w-[1140px] px-5 py-16 sm:px-7 md:py-24">
      <Reveal>
        <div className="rounded-[22px] border border-line bg-surface bg-[radial-gradient(600px_300px_at_50%_0%,rgba(194,245,63,0.08),transparent_65%)] px-6 py-14 text-center sm:px-8 sm:py-[70px]">
          <h3 className="mx-auto mb-[18px] max-w-[18ch] text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Stop scanning. Start getting matched.
          </h3>
          <p className="mb-8 text-base text-dim">
            Join the early-access list. We&apos;ll bring the topics to you.
          </p>
          <EmailCapture cta="Get early access" centered />
        </div>
      </Reveal>
    </section>
  );
}
