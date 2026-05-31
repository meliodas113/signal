import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

export function SampleMatch() {
  return (
    <section className="mx-auto max-w-[1140px] px-7 py-16 md:py-24">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <div className="max-w-[60ch]">
            <Kicker>A real match</Kicker>
            <h3 className="mt-[18px] text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
              Not a list. A read.
            </h3>
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-dim">
              Every opportunity comes back with a fit score, a one-line reason it matches your
              stack, the next move, and any eligibility catch — so you can decide in seconds, not
              afternoons.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <article className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6">
            <span className="absolute inset-y-0 left-0 w-[3px] bg-signal" />
            <div className="absolute right-6 top-6 text-right">
              <div className="font-mono text-[30px] font-bold leading-none text-signal">
                96<span className="text-xs text-faint">/100</span>
              </div>
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.13em] text-signal">
                Strong match
              </div>
              <div className="bars mt-2 justify-end">
                {[0, 1, 2, 3, 4].map((i) => (
                  <i key={i} className="lit" />
                ))}
              </div>
            </div>

            <div className="mb-[11px] flex flex-wrap gap-[9px] font-mono text-[11px] tracking-wide text-dim">
              <span className="text-signal">DoD</span>
              <span>Air Force / AFWERX</span>
              <span className="rounded-full border border-line px-2 py-px">SBIR</span>
              <span className="rounded-full border border-line px-2 py-px">Phase I → Direct II</span>
            </div>
            <h4 className="mb-2.5 max-w-[80%] text-lg font-bold">Open Topic — Dual-Use Autonomy &amp; Edge AI</h4>
            <p className="text-[13px] leading-relaxed text-dim">
              Seeking commercially-mature autonomy and edge-inference tech for SWaP-constrained
              hardware, with an existing commercial traction signal.
            </p>

            <div className="mt-4 flex flex-col gap-2 border-t border-line pt-3.5">
              {[
                ["Why", "Direct fit: your sub-2W edge inference + two commercial customers.", false],
                ["Next", "Draft dual-use brief; cite traction.", false],
                ["Flag", "Window closes in 9 days — move now.", true],
              ].map(([tag, text, isFlag]) => (
                <div key={tag as string} className="flex gap-[9px] text-[13px] leading-snug">
                  <span className="w-12 flex-none pt-0.5 font-mono text-[10px] uppercase tracking-wide text-faint">
                    {tag}
                  </span>
                  <span className={isFlag ? "text-amber" : ""}>{text}</span>
                </div>
              ))}
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
