/**
 * Writes public/og-image.png (1200×630) for Open Graph / Twitter cards.
 * Run: npm run generate:og  (requires devDependency `sharp`)
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "og-image.png");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ccfbf1"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="72" y="300" font-family="Segoe UI,system-ui,sans-serif" font-size="68" font-weight="700" fill="#0f766e">Sage With You</text>
  <text x="72" y="380" font-family="Segoe UI,system-ui,sans-serif" font-size="34" fill="#334155">SageÉlan Foundation · Living in place</text>
</svg>`;

await sharp(Buffer.from(svg)).resize(1200, 630).png().toFile(outPath);
console.log("Wrote", outPath);
