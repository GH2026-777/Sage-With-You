/**
 * Writes public/og-image.png (1200×630) for Open Graph / Twitter cards.
 * Run: npm run generate:og  (requires devDependency `sharp`)
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "og-image.png");
const logoPath = join(__dirname, "..", "public", "brand", "FullLogo.png");

const width = 1200;
const height = 630;

const background = await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: { r: 208, g: 229, b: 242 },
  },
})
  .png()
  .toBuffer();

const logo = await sharp(logoPath)
  .resize(520, null, { fit: "inside" })
  .png()
  .toBuffer();

const logoMeta = await sharp(logo).metadata();
const left = Math.round((width - (logoMeta.width ?? 520)) / 2);
const top = Math.round((height - (logoMeta.height ?? 400)) / 2);

await sharp(background)
  .composite([{ input: logo, left, top }])
  .png()
  .toFile(outPath);

console.log("Wrote", outPath);
