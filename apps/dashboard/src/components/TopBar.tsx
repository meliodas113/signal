export type View = "profile" | "radar" | "tracked";

interface TopBarProps {
  view: View;
  onNavigate: (v: View) => void;
  hasScores: boolean;
  trackedCount: number;
}

export function TopBar({ view, onNavigate, hasScores, trackedCount }: TopBarProps) {
  const tab = (key: View, label: string, enabled = true) => (
    <button
      onClick={() => enabled && onNavigate(key)}
      className={`rounded-md px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider transition ${
        view === key ? "bg-signal font-bold text-bg" : "text-dim hover:text-text"
      } ${enabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
    >
      {label}
      {key === "tracked" && trackedCount > 0 && (
        <span className="ml-1.5 rounded-full bg-black/25 px-1.5 py-px">{trackedCount}</span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-bg/80 px-6 py-[18px] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="scope-mini h-[30px] w-[30px]" aria-hidden />
        <div>
          <h1 className="text-[18px] font-extrabold tracking-[0.22em]">SIGNAL</h1>
          <span className="block font-mono text-[10px] tracking-[0.3em] text-dim">SBIR / STTR RADAR</span>
        </div>
      </div>
      <nav className="flex gap-1">
        {tab("profile", "Profile")}
        {tab("radar", "Radar", hasScores)}
        {tab("tracked", "Tracked")}
      </nav>
    </header>
  );
}
