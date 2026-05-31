import type { MatchScore, Solicitation } from "../types";
import { VERDICT_ORDER } from "../types";
import { daysUntil, formatDate } from "../lib/dates";

interface OpportunityCardProps {
  solicitation: Solicitation;
  score?: MatchScore;
  tracked: boolean;
  onToggleTrack: (id: string) => void;
}

const ACCENT = ["bg-signal", "bg-signal-dim", "bg-faint", "bg-line"];

export function OpportunityCard({ solicitation: s, score, tracked, onToggleTrack }: OpportunityCardProps) {
  const d = daysUntil(s.due);
  const accent = score ? ACCENT[VERDICT_ORDER[score.verdict]] : "bg-line";
  const lit = score ? Math.round((score.fit_score / 100) * 5) : 0;
  const deadlineColor = d <= 14 ? "text-danger" : d <= 30 ? "text-amber" : "";
  const scoreColor =
    score && score.fit_score >= 70 ? "text-signal" : score && score.fit_score >= 45 ? "text-amber" : "text-faint";

  return (
    <article className="relative mb-3.5 overflow-hidden rounded-2xl border border-line bg-surface p-[22px]">
      <span className={`absolute inset-y-0 left-0 w-[3px] ${accent}`} />
      <div className="flex items-start justify-between gap-[18px]">
        <div className="flex-1">
          <div className="mb-2.5 flex flex-wrap gap-2.5 font-mono text-[11px] tracking-wide text-dim">
            <span className="text-signal">{s.agency}</span>
            <span>{s.branch}</span>
            <span className="rounded-full border border-line px-2 py-px">{s.program}</span>
            <span className="rounded-full border border-line px-2 py-px">{s.phase}</span>
            <span className="text-faint">{s.id}</span>
          </div>
          <h3 className="mb-2.5 text-[19px] font-bold tracking-tight">{s.title}</h3>
          <p className="text-[13.5px] leading-relaxed text-dim">{s.topic}</p>
        </div>

        {score && (
          <div className="flex-none text-right">
            <div className={`font-mono text-[30px] font-bold leading-none ${scoreColor}`}>
              {score.fit_score}
              <span className="text-[13px] text-faint">/100</span>
            </div>
            <div
              className={`mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                VERDICT_ORDER[score.verdict] <= 1 ? "text-signal" : "text-dim"
              }`}
            >
              {score.verdict}
            </div>
            <div className="bars mt-2.5 justify-end">
              {[0, 1, 2, 3, 4].map((i) => (
                <i key={i} className={i < lit ? "lit" : ""} />
              ))}
            </div>
          </div>
        )}
      </div>

      {score && (
        <div className="mt-4 flex flex-col gap-[7px] border-t border-line pt-3.5">
          <Line tag="Why" text={score.why} />
          <Line tag="Next" text={score.next_step} />
          {score.eligibility_flag && <Line tag="Flag" text={score.eligibility_flag} flag />}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className={`font-mono text-xs tracking-wide text-dim`}>
          DUE {formatDate(s.due)} · <b className={`font-bold ${deadlineColor}`}>{d} days</b>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleTrack(s.id)}
            className={`rounded-lg border px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider transition ${
              tracked
                ? "border-signal bg-[rgba(194,245,63,0.12)] text-signal"
                : "border-line text-dim hover:border-faint hover:text-text"
            }`}
          >
            {tracked ? "✓ Tracking" : "Track"}
          </button>
          <a
            href="https://www.sbir.gov/topics"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-signal-dim px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-signal transition hover:brightness-110"
          >
            Official ↗
          </a>
        </div>
      </div>
    </article>
  );
}

function Line({ tag, text, flag = false }: { tag: string; text: string; flag?: boolean }) {
  return (
    <div className="flex gap-[9px] text-[13.5px] leading-snug">
      <span className="w-[62px] flex-none pt-0.5 font-mono text-[10px] uppercase tracking-wide text-faint">
        {tag}
      </span>
      <span className={flag ? "text-amber" : ""}>{text}</span>
    </div>
  );
}
