import { cn } from "./cn";

export interface Blip {
  /** percentage offsets within the scope, 0–100 */
  top: number;
  left: number;
  label?: string;
  delay?: number;
}

export interface RadarScopeProps {
  /** diameter in px */
  size?: number;
  blips?: Blip[];
  readout?: string;
  className?: string;
}

/**
 * The SIGNAL radar motif. Renders concentric rings, crosshairs, a sweeping
 * gradient, and optional pulsing "blips" with labels.
 */
export function RadarScope({ size = 380, blips = [], readout, className }: RadarScopeProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size, maxWidth: "100%" }}>
      <div
        className="relative h-full w-full rounded-full border border-line"
        style={{ background: "radial-gradient(circle at center, rgba(194,245,63,0.07), transparent 70%)" }}
      >
        {/* rings */}
        {[0.74, 0.48, 0.22].map((s) => (
          <span
            key={s}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: `${s * 100}%`, height: `${s * 100}%`, border: "1px solid rgba(194,245,63,0.13)" }}
          />
        ))}
        {/* crosshairs */}
        <span className="absolute left-[6%] right-[6%] top-1/2 h-px" style={{ background: "rgba(194,245,63,0.12)" }} />
        <span className="absolute bottom-[6%] top-[6%] left-1/2 w-px" style={{ background: "rgba(194,245,63,0.12)" }} />
        {/* sweep */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute inset-0 rounded-full motion-reduce:animate-none"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(194,245,63,0.32), rgba(194,245,63,0.04) 22%, transparent 34%)",
              animation: "sig-sweep 4s linear infinite",
            }}
          />
        </div>
        {/* blips */}
        {blips.map((b, i) => (
          <div
            key={i}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
            style={{ top: `${b.top}%`, left: `${b.left}%` }}
          >
            <i
              className="block h-[9px] w-[9px] flex-none rounded-full"
              style={{
                background: "var(--color-signal)",
                boxShadow: "0 0 12px var(--color-signal)",
                animation: "sig-ping 3s ease-out infinite",
                animationDelay: `${b.delay ?? 0}s`,
              }}
            />
            {b.label && (
              <span
                className="whitespace-nowrap font-mono text-[10px] tracking-wide text-signal"
                style={{ textShadow: "0 0 8px rgba(0,0,0,0.8)" }}
              >
                {b.label}
              </span>
            )}
          </div>
        ))}
        {readout && (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
            {readout}
          </div>
        )}
      </div>
    </div>
  );
}
