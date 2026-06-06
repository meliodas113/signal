import type { Browser } from "playwright";
import { openPage, shot } from "../browser.js";
import type { Bug } from "../types.js";

// In-page anchors the nav links to (see apps/landing Nav.tsx + section ids).
const ANCHORS = ["#why", "#how", "#pricing", "#get"];

/** Nav anchors resolve, the #/about route renders, and no link is empty/malformed. */
export async function checkNavAndLinks(browser: Browser, baseUrl: string): Promise<Bug[]> {
  const bugs: Bug[] = [];
  const b = await openPage(browser);
  const home = `${baseUrl}/`;

  await b.page.goto(home, { waitUntil: "load", timeout: 30_000 });
  await b.page.waitForTimeout(600);

  // 1. Every nav anchor has a matching target element.
  for (const a of ANCHORS) {
    const id = a.slice(1);
    const count = await b.page.locator(`#${id}`).count();
    if (count === 0) {
      bugs.push({
        check: "nav",
        key: `anchor:${a}`,
        title: `Nav anchor ${a} has no target`,
        severity: "high",
        url: home,
        detail: `The nav links to \`${a}\`, but no element with id \`${id}\` exists on the page.`,
      });
    }
  }

  // 2. The #/about route renders real content.
  const aboutUrl = `${baseUrl}/#/about`;
  await b.page.goto(aboutUrl, { waitUntil: "load", timeout: 30_000 });
  await b.page.waitForTimeout(600);
  const aboutText = (await b.page.locator("body").innerText()).trim();
  if (aboutText.length < 200) {
    bugs.push({
      check: "nav",
      key: "route:about",
      title: "About page renders little or no content",
      severity: "high",
      url: aboutUrl,
      screenshotPath: await shot(b.page, "about_empty"),
      detail: `The \`#/about\` route rendered only ${aboutText.length} characters of text — it may be broken.`,
    });
  }

  // 3. No empty or malformed link hrefs.
  await b.page.goto(home, { waitUntil: "load", timeout: 30_000 });
  await b.page.waitForTimeout(300);
  const badLinks: string[] = await b.page.$$eval("a[href]", (as) =>
    as
      .map((a) => a.getAttribute("href") || "")
      .filter((h) => h === "" || h === "#" || h.includes("undefined") || h.includes("null")),
  );
  if (badLinks.length) {
    bugs.push({
      check: "nav",
      key: "links:bad",
      title: `Empty or malformed link hrefs (${badLinks.length})`,
      severity: "medium",
      url: home,
      detail: `Anchor tags with empty or malformed \`href\`:\n\n\`\`\`\n${[...new Set(badLinks)].join("\n")}\n\`\`\``,
    });
  }

  await b.close();
  return bugs;
}
