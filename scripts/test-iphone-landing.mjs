/**
 * Quick iPhone viewport checks for landing page (/).
 * Run: node scripts/test-iphone-landing.mjs [baseUrl]
 */
import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:5173";
const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "test-screenshots", "iphone");

const profiles = [
  { name: "iPhone SE", device: devices["iPhone SE"] },
  { name: "iPhone 14", device: devices["iPhone 14"] },
  { name: "iPhone 14 Pro Max", device: devices["iPhone 14 Pro Max"] },
];

const results = [];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const { name, device } of profiles) {
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) {
    results.push({ name, error: `Failed to load: ${e.message}` });
    await context.close();
    continue;
  }

  const gatePassword = process.env.SITE_GATE_PASSWORD ?? "SageElan2026";
  const passwordField = page.locator('input[type="password"], input#password').first();
  if (await passwordField.isVisible().catch(() => false)) {
    await passwordField.fill(gatePassword);
    await page.getByRole("button", { name: /enter site/i }).click();
    await page.waitForURL(/\/($|\?)/, { timeout: 15000 }).catch(() => {});
    await page.waitForSelector("header", { timeout: 15000 });
  }

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const header = document.querySelector("header");
    const hero = document.querySelector("section");
    const headerRect = header?.getBoundingClientRect();
    const logoLink = header?.querySelector('a[href="/"], header img');
    const logoRect = logoLink?.getBoundingClientRect();
    const menuBtn = header?.querySelector("button.md\\:hidden, header button");
    const menuRect = menuBtn?.getBoundingClientRect();

    return {
      viewportW: window.innerWidth,
      scrollW: doc.scrollWidth,
      hasHorizontalScroll: doc.scrollWidth > window.innerWidth + 1,
      headerH: headerRect?.height ?? null,
      logoW: logoRect?.width ?? null,
      logoRight: logoRect?.right ?? null,
      menuLeft: menuRect?.left ?? null,
      logoOverlapsMenu: logoRect && menuRect ? logoRect.right > menuRect.left - 4 : null,
      heroExists: !!hero,
    };
  });

  const file = join(outDir, `${name.replace(/\s+/g, "-").toLowerCase()}.png`);
  await page.screenshot({ path: file, fullPage: true });

  results.push({ name, metrics, screenshot: file });
  await context.close();
}

await browser.close();

console.log("\n=== iPhone landing page check ===\n");
console.log(`URL: ${baseUrl}/\n`);

for (const r of results) {
  console.log(`--- ${r.name} ---`);
  if (r.error) {
    console.log(`  ERROR: ${r.error}\n`);
    continue;
  }
  const m = r.metrics;
  console.log(`  Viewport: ${m.viewportW}px`);
  console.log(`  Horizontal scroll: ${m.hasHorizontalScroll ? "YES (issue)" : "no"}`);
  console.log(`  Header logo width: ${m.logoW?.toFixed(0)}px`);
  console.log(`  Logo overlaps menu button: ${m.logoOverlapsMenu ? "YES (issue)" : "no"}`);
  console.log(`  Screenshot: ${r.screenshot}\n`);
}

const issues = results.filter(
  (r) => r.metrics?.hasHorizontalScroll || r.metrics?.logoOverlapsMenu
);
process.exit(issues.length > 0 ? 1 : 0);
