import type { ReactNode } from "react";
import type { PhaseInterest, Profile, SetAsideFlags } from "../types";

interface ProfileFormProps {
  profile: Profile;
  agencies: string[];
  scoring: boolean;
  error: string | null;
  solicitationCount: number;
  onChange: (p: Profile) => void;
  onRun: () => void;
}

const PHASES: PhaseInterest[] = ["Phase I", "Phase II", "Either"];
const FLAG_LABELS: Array<[keyof SetAsideFlags, string]> = [
  ["woman", "Woman-owned"],
  ["hubzone", "HUBZone"],
  ["disadvantaged", "Socially/Econ. disadvantaged"],
  ["firstTime", "First-time applicant"],
];

export function ProfileForm({
  profile,
  agencies,
  scoring,
  error,
  solicitationCount,
  onChange,
  onRun,
}: ProfileFormProps) {
  const canMatch = profile.tech.trim().length > 20;

  const toggleAgency = (a: string) =>
    onChange({
      ...profile,
      agencies: profile.agencies.includes(a)
        ? profile.agencies.filter((x) => x !== a)
        : [...profile.agencies, a],
    });

  const toggleFlag = (k: keyof SetAsideFlags) =>
    onChange({ ...profile, flags: { ...profile.flags, [k]: !profile.flags[k] } });

  const chip = (active: boolean) =>
    `cursor-pointer select-none rounded-full border px-3.5 py-2 font-mono text-xs tracking-wide transition ${
      active
        ? "border-signal bg-[rgba(194,245,63,0.12)] text-signal"
        : "border-line bg-bg text-dim hover:border-signal-dim hover:text-text"
    }`;

  return (
    <>
      <div className="pb-7 pt-14">
        <div className="mb-[18px] flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.34em] text-signal">
          <span className="h-px w-[26px] bg-signal" />
          Calibrate your signal
        </div>
        <h2 className="mb-4 max-w-[18ch] text-[clamp(30px,5vw,48px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
          Describe what you build. Get the topics that fit.
        </h2>
        <p className="max-w-[56ch] text-base leading-relaxed text-dim">
          SBIR/STTR matching is about your technology versus dense topic text — not keywords. Tell
          the radar what you do once, and it scores every open solicitation for genuine fit.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-7">
        <Field label="Company" hint="(optional)">
          <input
            className="input"
            placeholder="e.g. Aperture Robotics"
            value={profile.company}
            onChange={(e) => onChange({ ...profile, company: e.target.value })}
          />
        </Field>

        <Field label="Your technology" hint="* required">
          <textarea
            className="input min-h-[108px] resize-y leading-relaxed"
            placeholder="What do you build, for whom, and what's the core technical edge? e.g. 'We build low-power edge-AI vision modules for autonomous drones — sub-2W inference on custom silicon, deployed with two commercial logistics customers.'"
            value={profile.tech}
            onChange={(e) => onChange({ ...profile, tech: e.target.value })}
          />
          <p className="mt-1.5 text-xs text-faint">
            The more concrete the technical detail, the sharper the match.
          </p>
        </Field>

        <Field label="Phase interest">
          <div className="flex gap-1.5">
            {PHASES.map((ph) => (
              <button
                key={ph}
                onClick={() => onChange({ ...profile, phase: ph })}
                className={`flex-1 rounded-lg border py-2.5 font-mono text-[13px] transition ${
                  profile.phase === ph
                    ? "border-signal bg-[rgba(194,245,63,0.12)] text-signal"
                    : "border-line bg-bg text-dim hover:text-text"
                }`}
              >
                {ph}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Agencies of interest" hint="(optional)">
          <div className="flex flex-wrap gap-2">
            {agencies.map((a) => (
              <span key={a} className={chip(profile.agencies.includes(a))} onClick={() => toggleAgency(a)}>
                {a}
              </span>
            ))}
          </div>
        </Field>

        <Field label="Set-aside status" hint="(optional)">
          <div className="flex flex-wrap gap-2">
            {FLAG_LABELS.map(([k, label]) => (
              <span key={k} className={chip(profile.flags[k])} onClick={() => toggleFlag(k)}>
                {label}
              </span>
            ))}
          </div>
        </Field>

        <button
          onClick={onRun}
          disabled={!canMatch || scoring}
          className="mt-1.5 w-full rounded-xl bg-signal py-4 font-mono text-sm font-bold uppercase tracking-wider text-bg transition hover:enabled:shadow-[0_0_24px_rgba(194,245,63,0.3)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {scoring ? `Scanning ${solicitationCount} solicitations…` : "Run match →"}
        </button>
        {!canMatch && (
          <p className="mt-2.5 text-xs text-faint">
            Add a sentence or two about your technology to enable matching.
          </p>
        )}
        {error && <p className="mt-3.5 font-mono text-[13px] text-danger">{error}</p>}
      </div>

      <p className="mt-[30px] rounded-[10px] border border-dashed border-line p-4 font-mono text-[11px] leading-relaxed tracking-wide text-faint">
        <span className="text-dim">DEMO NOTE.</span> Solicitations here are sample data shaped like
        the SBIR.gov API. Scoring runs through <span className="text-dim">scoreSolicitations()</span>
        — set <span className="text-dim">VITE_MATCH_API_URL</span> to your server function (which
        holds the model key) for live LLM matching; otherwise a local heuristic runs.
      </p>

      <style>{`
        .input{
          width:100%;background:var(--color-bg);border:1px solid var(--color-line);
          border-radius:10px;color:var(--color-text);font-family:var(--font-display);
          font-size:15px;padding:13px 15px;outline:none;transition:.18s;
        }
        .input:focus{border-color:var(--color-signal-dim);box-shadow:0 0 0 3px rgba(194,245,63,0.08);}
        .input::placeholder{color:var(--color-faint);}
      `}</style>
    </>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-[26px]">
      <label className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
        {label} {hint && <span className="text-signal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
