#!/usr/bin/env node
/**
 * Prints expected Supabase Storage object paths for the resource library.
 * Upload files to bucket `library` (or VITE_LIBRARY_BUCKET), then set VITE_LIBRARY_USE_STORAGE=true.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/utils/libraryAssets.ts"), "utf8");
const marker = "LIBRARY_EXPECTED_STORAGE_PATHS";
const start = src.indexOf(marker);
if (start < 0) {
  console.error("Could not find LIBRARY_EXPECTED_STORAGE_PATHS in libraryAssets.ts");
  process.exit(1);
}
const bracketStart = src.indexOf("[", start);
const bracketEnd = src.indexOf("];", bracketStart);
const block = src.slice(bracketStart, bracketEnd);
const paths = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

console.log("Sage With You — library Storage upload checklist\n");
console.log(`Bucket: library (or VITE_LIBRARY_BUCKET)\n`);
console.log(`${paths.length} objects:\n`);
for (const p of paths) {
  console.log(`  ${p}`);
}
console.log("\nAfter upload: set VITE_LIBRARY_USE_STORAGE=true in .env.production and rebuild.");
