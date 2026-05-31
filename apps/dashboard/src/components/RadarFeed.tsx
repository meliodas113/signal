import { useMemo } from "react";
import type { MatchScore, Profile, Solicitation } from "../types";
import { VERDICT_ORDER } from "../types";
import { daysUntil } from "../lib/dates";
import { OpportunityCard } from "./OpportunityCard";

export type SortBy = "fit" | "deadline";

interface RadarFeedProps {
  solicitations: Solicitation[];
  scores: Record<string, MatchScore>;
  profile: Profile;
  tracked: string[];
  sortBy: SortBy;
  onSort: (s: SortBy) => void;
  onToggleTrack: (id: string) => void;
}

export function RadarFeed({
  solicitations,
  scores,
  profile,
  tracked,
  sortBy,
  onSort,
  onToggleTrack,
}: RadarFeedProps) {
  const sorted = useMemo(() => {
    const arr = [...solicitations];
    if (sortBy === "deadline") {
      arr.sort((a, b) => daysUntil(a.due) - daysUntil(b.due));
    } else {
      arr.sort((a, b) => {
        const sa = scores[a.id];
        const sb = scores[b.id];
        if (sa && sb) {
          const v = VERDICT_ORDER[sa.verdict] - VERDICT_ORDER[sb.verdict];
          return v !== 0 ? v : sb.fit_score - sa.fit_score;
        }
        return 0;
      });
    }
    return arr;
  }, [solicitations, scores, sortBy]);

  const sortBtn = (key: SortBy, label: string) => (
    <button
      onClick={() => onSort(key)}
      className={`rounded-md border bg-surface px-3.5 py-[7px] font-mono text-[11px] uppercase tracking-wider transition ${
        sortBy === key ? "border-signal-dim text-signal" : "border-line text-dim hover:text-text"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="my-[26px] flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-xs tracking-wider text-dim">
          <b className="text-signal">{solicitations.length}</b> OPEN · MATCHED FOR{" "}
          {profile.company ? profile.company.toUpperCase() : "YOUR STARTUP"}
        </div>
        <div className="flex gap-1">
          {sortBtn("fit", "By fit")}
          {sortBtn("deadline", "By deadline")}
        </div>
      </div>

      {sorted.map((s) => (
        <OpportunityCard
          key={s.id}
          solicitation={s}
          score={scores[s.id]}
          tracked={tracked.includes(s.id)}
          onToggleTrack={onToggleTrack}
        />
      ))}
    </>
  );
}
