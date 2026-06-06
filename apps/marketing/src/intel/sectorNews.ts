import Parser from "rss-parser";

/**
 * Sector intelligence. Pulls recent items from free, key-less RSS/Atom feeds
 * about SBIR/STTR and federal deep-tech funding. Best-effort: if everything
 * fails we return undefined and the Strategist falls back to evergreen angles.
 */

const FEEDS = [
  // Google News queries (free, no key) — robust and topical.
  "https://news.google.com/rss/search?q=SBIR+OR+STTR+grant+when:14d&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=%22deep+tech%22+federal+funding+OR+%22non-dilutive%22+when:14d&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=DARPA+OR+%22Department+of+Defense%22+SBIR+when:21d&hl=en-US&gl=US&ceid=US:en",
];

export interface NewsItem {
  title: string;
  link?: string;
  source?: string;
  isoDate?: string;
}

const parser = new Parser({ timeout: 12000 });

export async function fetchSectorNews(limit = 6): Promise<NewsItem[]> {
  const results: NewsItem[] = [];
  for (const url of FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items ?? []) {
        if (!item.title) continue;
        results.push({
          title: cleanTitle(item.title),
          link: item.link,
          source: (item as any).source?.["#"] ?? feed.title,
          isoDate: item.isoDate,
        });
      }
    } catch {
      // ignore a dead feed; try the next
    }
  }
  // newest first, dedup by title
  const seen = new Set<string>();
  return results
    .sort((a, b) => (b.isoDate ?? "").localeCompare(a.isoDate ?? ""))
    .filter((i) => {
      const k = i.title.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, limit);
}

function cleanTitle(t: string): string {
  // Google News appends " - Publisher"; keep it, it's useful attribution.
  return t.replace(/\s+/g, " ").trim();
}

/** A compact, model-friendly context string. */
export async function sectorContext(): Promise<string | undefined> {
  const news = await fetchSectorNews();
  if (!news.length) return undefined;
  return news
    .map((n, i) => `${i + 1}. ${n.title}${n.isoDate ? ` (${n.isoDate.slice(0, 10)})` : ""}`)
    .join("\n");
}
