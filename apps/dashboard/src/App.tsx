import { useMemo, useState } from "react";
import type { MatchScore, Profile } from "./types";
import { SOLICITATIONS } from "./data/solicitations";
import { scoreSolicitations } from "./lib/match";
import { TopBar, type View } from "./components/TopBar";
import { ProfileForm } from "./components/ProfileForm";
import { RadarFeed, type SortBy } from "./components/RadarFeed";
import { TrackedView } from "./components/TrackedView";

const EMPTY_PROFILE: Profile = {
  company: "",
  tech: "",
  phase: "Either",
  agencies: [],
  flags: { woman: false, hubzone: false, disadvantaged: false, firstTime: false },
};

export default function App() {
  const [view, setView] = useState<View>("profile");
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [scores, setScores] = useState<Record<string, MatchScore>>({});
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracked, setTracked] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("fit");

  const agencies = useMemo(() => [...new Set(SOLICITATIONS.map((s) => s.agency))], []);
  const hasScores = Object.keys(scores).length > 0;

  const toggleTrack = (id: string) =>
    setTracked((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  async function runScoring() {
    setScoring(true);
    setError(null);
    try {
      const results = await scoreSolicitations(profile, SOLICITATIONS);
      const map: Record<string, MatchScore> = {};
      for (const r of results) map[r.id] = r;
      setScores(map);
      setView("radar");
    } catch {
      setError("Couldn't complete the match. Check your connection and try again.");
    } finally {
      setScoring(false);
    }
  }

  return (
    <div className="min-h-screen">
      <TopBar
        view={view}
        onNavigate={setView}
        hasScores={hasScores}
        trackedCount={tracked.length}
      />
      <main className="mx-auto max-w-[1080px] px-6 pb-20">
        {view === "profile" && (
          <ProfileForm
            profile={profile}
            agencies={agencies}
            scoring={scoring}
            error={error}
            solicitationCount={SOLICITATIONS.length}
            onChange={setProfile}
            onRun={runScoring}
          />
        )}
        {view === "radar" && (
          <RadarFeed
            solicitations={SOLICITATIONS}
            scores={scores}
            profile={profile}
            tracked={tracked}
            sortBy={sortBy}
            onSort={setSortBy}
            onToggleTrack={toggleTrack}
          />
        )}
        {view === "tracked" && (
          <TrackedView solicitations={SOLICITATIONS} tracked={tracked} onToggleTrack={toggleTrack} />
        )}
      </main>
    </div>
  );
}
