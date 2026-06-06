import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "../config.js";
import type { ImageSpec } from "../types.js";
import { CANVAS, renderHtml } from "./templates.js";

/**
 * Renders an ImageSpec to a PNG via headless Chromium. Also writes the source
 * HTML next to it for easy debugging / template tweaking.
 */
export async function renderImage(spec: ImageSpec, id: string): Promise<string> {
  await mkdir(config.outputDir, { recursive: true });
  const html = renderHtml(spec);
  const htmlPath = join(config.outputDir, `${id}.html`);
  const pngPath = join(config.outputDir, `${id}.png`);
  await writeFile(htmlPath, html, "utf8");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: CANVAS.width, height: CANVAS.height },
      deviceScaleFactor: 2, // crisp on retina / when X re-encodes
    });
    await page.setContent(html, { waitUntil: "networkidle" });
    // give web fonts a beat to swap in
    await page.evaluate(() => (document as any).fonts?.ready);
    await page.waitForTimeout(250);
    await page.screenshot({ path: pngPath, type: "png" });
    return pngPath;
  } finally {
    await browser.close();
  }
}
