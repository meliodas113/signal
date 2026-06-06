import { useEffect, useState } from "react";

/**
 * Minimal path-based router (History API). Gives real, professional URLs like
 * `/about` that work on static hosts (GitHub Pages serves a matching
 * `about/index.html`, and a `404.html` fallback boots the SPA for any other
 * path). No hash fragments in the address bar.
 */

const NAV_EVENT = "sig:navigate";

/** Canonicalize a pathname: strip `index.html`, collapse trailing slashes. */
export function normalizePath(p: string): string {
  p = p.replace(/index\.html$/i, "").replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

/** Current normalized pathname; re-renders on history navigation. */
export function usePathname(): string {
  const [path, setPath] = useState(() =>
    typeof window === "undefined" ? "/" : normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const sync = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);

  return path;
}

/** Client-side navigation to a path (pushState + notify the router). */
export function navigate(to: string): void {
  if (normalizePath(window.location.pathname) === normalizePath(to)) {
    window.scrollTo({ top: 0 });
    return;
  }
  window.history.pushState({}, "", to);
  window.dispatchEvent(new Event(NAV_EVENT));
  window.scrollTo({ top: 0 });
}

/**
 * Smooth-scroll to a homepage section by id, without putting a `#` in the URL.
 * If the section isn't on the current page, go home first, then scroll.
 */
export function goToSection(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  navigate("/");
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

/**
 * One-time migration for old hash URLs people may have shared
 * (`#/about` -> `/about`, `#why` -> scroll). Call once on app start.
 */
export function migrateLegacyHash(): void {
  const h = window.location.hash;
  if (!h) return;
  if (h === "#/about") {
    window.history.replaceState({}, "", "/about");
  } else if (/^#\/?$/.test(h)) {
    window.history.replaceState({}, "", "/");
  } else if (/^#[a-zA-Z][\w-]*$/.test(h)) {
    const id = h.slice(1);
    window.history.replaceState({}, "", window.location.pathname);
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }
}
