/**
 * Favicon/PWA only — does not modify logo files used in the UI.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandDir = join(__dirname, "..", "public", "brand");
const publicDir = join(__dirname, "..", "public");

const iconPath = join(brandDir, "LogoImage.png");
const { data, info } = await sharp(iconPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const pixels = new Uint8Array(data);
for (let i = 0; i < pixels.length; i += 4) {
  if (pixels[i] <= 28 && pixels[i + 1] <= 28 && pixels[i + 2] <= 28) {
    pixels[i + 3] = 0;
  }
}
const iconCutout = await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer();

for (const [size, name] of [
  [512, "pwa-icon-512.png"],
  [192, "pwa-icon-192.png"],
  [32, "favicon.png"],
]) {
  await sharp(iconCutout)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, name));
}

console.log("Wrote favicon + PWA icons from LogoImage.png only");
