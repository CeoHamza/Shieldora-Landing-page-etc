// Renders preview/og-source.html to og-image.png (1200 x 630) with the
// installed Chrome. Run from the repo root:
//   node preview/render-og.mjs /path/to/node_modules/puppeteer-core
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const puppeteerPath = process.argv[2] ?? "puppeteer-core";
const puppeteer = (await import(puppeteerPath)).default;
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto("file://" + resolve(here, "og-source.html"), { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(here, "..", "og-image.png"), clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log("wrote og-image.png");
