import { useEffect, useState } from "react";

/**
 * Minimal hash-based router. Returns the current `window.location.hash`
 * and re-renders on change. Keeps the marketing site dependency-free while
 * still supporting real, linkable "pages" like `#/about`.
 */
export function useHashRoute(): string {
  const [hash, setHash] = useState<string>(() =>
    typeof window === "undefined" ? "" : window.location.hash,
  );

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return hash;
}
