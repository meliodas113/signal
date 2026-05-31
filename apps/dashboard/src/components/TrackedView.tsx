import { useMemo } from "react";
import type { Solicitation } from "../types";
import { daysUntil, formatDate } from "../lib/dates";

interface TrackedViewProps {
  solicitations: Solicitation[];
  tracked: string[];
  onToggleTrack: (id: string) => void;
}

export function TrackedView({ solicitations, tracked, onToggleTrack }: TrackedViewProps) {
  const list = useMemo(
    () =>
      solicitations
        .filter((s) => tracked.includes(s.id))
        .sort((a, b) => daysUntil(a.due) - daysUntil(b.due)),
    [solicitations, tracked],
  );

  return (
    <>
      <div className="pb-1.5 pt-11">
        <div className="mb-[18px] flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.34em] text-signal">
          <span className="h-px w-[26px] bg-signal" />
          Deadline watch
        </div>
        <h2 className="text-[30px] font-extrabold tracking-tight">Don&apos;t miss the window.</h2>
      </div>

      {list.length === 0 ? (
        <div className="px-5 py-[70px] text-center text-faint">
          <div className="font-mono text-[13px] tracking-wider text-dim">NO TRACKED SOLICITATIONS</div>
          <p className="mt-2">Star opportunities from the radar to watch their deadlines here.</p>
        </div>
      ) : (
        <div className="mt-6">
          {list.map((s) => {
            const d = daysUntil(s.due);
            const color = d <= 14 ? "text-danger" : d <= 30 ? "text-amber" : "text-signal";
            return (
              <div key={s.id} className="mb-3 flex items-center gap-5 rounded-[13px] border border-line bg-surface px-[22px] py-[18px]">
                <div className={`min-w-[74px] text-center font-mono text-[34px] font-bold leading-none ${color}`}>
                  {d}
                  <small className="mt-1.5 block font-normal uppercase tracking-[0.18em] text-faint" style={{ fontSize: 10 }}>
                    days
                  </small>
                </div>
                <div className="flex-1">
                  <div className="mb-1.5 flex flex-wrap gap-2.5 font-mono text-[11px] tracking-wide text-dim">
                    <span className="text-signal">{s.agency}</span>
                    <span className="rounded-full border border-line px-2 py-px">{s.program}</span>
                    <span>{formatDate(s.due)}</span>
                  </div>
                  <h4 className="text-base font-semibold">{s.title}</h4>
                </div>
                <button
                  onClick={() => onToggleTrack(s.id)}
                  className="rounded-lg border border-signal bg-[rgba(194,245,63,0.12)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-signal"
                >
                  Untrack
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
