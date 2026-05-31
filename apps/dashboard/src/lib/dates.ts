const DAY = 86_400_000;

/** ISO date `days` from now — used to seed demo deadlines. */
export const mkDue = (days: number): string => new Date(Date.now() + days * DAY).toISOString();

export const daysUntil = (iso: string): number =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / DAY);

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
