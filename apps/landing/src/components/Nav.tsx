import { Brand } from "./Brand";

const LINKS = [
  { href: "#/about", label: "About" },
  { href: "#why", label: "Why it's different" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1140px] items-center justify-between gap-4 px-5 sm:px-7">
        <a href="#/" aria-label="SIGNAL home" className="transition hover:opacity-80">
          <Brand />
        </a>
        <div className="flex items-center gap-5 md:gap-7">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden font-mono text-xs uppercase tracking-wider text-dim transition hover:text-text md:inline"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#get"
            className="whitespace-nowrap rounded-lg bg-signal px-3.5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-bg transition hover:shadow-[0_0_22px_rgba(194,245,63,0.35)] sm:px-[18px] sm:text-[11px]"
          >
            Get early access
          </a>
        </div>
      </div>
    </nav>
  );
}
