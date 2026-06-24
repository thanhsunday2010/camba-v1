#!/usr/bin/env node
/**
 * Generate SVG illustration assets for Gold Mock image references.
 *
 * Usage:
 *   npm run generate:gold-mock-images
 *   npm run generate:gold-mock-images -- starters
 *   npm run generate:gold-mock-images -- starters-gold-mock-1
 */

import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverGoldMockManifests } from "./lib/gold-mock-seed.mjs";
import { collectImageAssetsFromManifest } from "./lib/gold-mock-image-paths.mjs";
import { writeGoldMockImageSvg } from "./lib/gold-mock-images.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC_ROOT = join(ROOT, "public");

function parseArgs(argv) {
  const args = argv.filter((a) => !a.startsWith("-"));
  if (!args.length) return { level: null, goldMockId: null };
  if (args[0].includes("-gold-mock-")) return { level: null, goldMockId: args[0] };
  return { level: args[0], goldMockId: args[1] ?? null };
}

async function main() {
  const { level, goldMockId } = parseArgs(process.argv.slice(2));
  let targets = discoverGoldMockManifests(level);
  if (goldMockId) {
    targets = targets.filter((t) => t.goldMockId === goldMockId);
  }
  if (!targets.length) {
    console.error("No gold mock manifests matched.");
    process.exit(1);
  }

  /** @type {Map<string, object>} */
  const allAssets = new Map();

  for (const target of targets) {
    const assets = collectImageAssetsFromManifest(target.raw);
    for (const [src, meta] of assets) {
      if (!allAssets.has(src)) allAssets.set(src, meta);
    }
  }

  if (!allAssets.size) {
    console.log("No image references found in selected manifests.");
    return;
  }

  let generated = 0;
  let failed = 0;

  console.log(`Generating ${allAssets.size} Gold Mock image(s)…\n`);

  for (const [src, meta] of [...allAssets.entries()].sort()) {
    try {
      const { relPath, bytes } = writeGoldMockImageSvg(PUBLIC_ROOT, src, meta);
      console.log(`  ✓ /${relPath} (${Math.round(bytes / 1024)} KB)`);
      generated += 1;
    } catch (err) {
      failed += 1;
      console.error(`  ✗ ${src}: ${err.message}`);
    }
  }

  console.log(`\nGenerated ${generated} SVG file(s)${failed ? `, ${failed} failed` : ""}.`);
  console.log("Re-seed mocks so Supabase question content uses normalized .svg paths:");
  console.log("  npm run seed:gold-mocks");

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
