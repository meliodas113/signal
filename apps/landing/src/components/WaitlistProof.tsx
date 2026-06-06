import { useEffect, useState } from "react";
import { getWaitlistCount } from "../lib/earlyAccess";
import { Reveal } from "./Reveal";

const TRUST = [
  "Built on official .gov data",
  "0% equity — non-dilutive only",
  "Free tier, no card required",
];

export function WaitlistProof() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    getWaitlistCount()
      .then((n) => alive && setCount(n))
      .catch(() => alive && setCount(null));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-[1140px] px-5 py-12 sm:px-7 md:py-16">
      <Reveal>
        <div className="rounded-2xl border border-line bg-surface px-6 py-10 text-center sm:px-8">
          {count !== null && count > 0 ? (
            <p className="text-[clamp(20px,3vw,28px)] font-extrabold leading-tight tracking-[-0.01em]">
              <span className="text-signal">{count.toLocaleString()}</span> founder
              {count === 1 ? " is" : "s are"} already on the early-access list.
            </p>
          ) : (
            <p className="text-[clamp(20px,3vw,28px)] font-extrabold leading-tight tracking-[-0.01em]">
              Be among the first founders to get <span className="text-signal">matched</span>.
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {TRUST.map((t) => (
              <span key={t} className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-dim">
                <span className="text-signal">✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
