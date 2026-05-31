import { useEffect, useRef, useState } from "react";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const step = Math.ceil(target / 40);
          const id = window.setInterval(() => {
            setValue((v) => {
              const next = v + step;
              if (next >= target) {
                window.clearInterval(id);
                return target;
              }
              return next;
            });
          }, 24);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="font-mono text-[34px] font-bold tracking-tight text-signal">
      {value.toLocaleString()}
      {suffix}
    </div>
  );
}

const CELLS = [
  { node: <div className="font-mono text-[34px] font-bold tracking-tight text-signal">11</div>, label: "Federal agencies" },
  { node: <CountUp target={1500} />, label: "Topics scanned daily" },
  { node: <div className="font-mono text-[34px] font-bold tracking-tight text-signal">0%</div>, label: "Equity given up" },
  { node: <div className="font-mono text-[34px] font-bold tracking-tight text-signal">&lt;60s</div>, label: "To your matches" },
];

export function StatStrip() {
  return (
    <div className="grid grid-cols-2 border-y border-line md:grid-cols-4">
      {CELLS.map((c, i) => (
        <div
          key={i}
          className="border-line px-6 py-[34px] text-center [&:not(:last-child)]:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(2)]:border-r md:[&:nth-child(-n+2)]:border-b-0"
        >
          {c.node}
          <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
