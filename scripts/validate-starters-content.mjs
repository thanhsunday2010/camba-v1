#!/usr/bin/env node
/**
 * Validate all Starters unit content JSON files against the curriculum map.
 *
 * Usage: npm run validate:starters
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateContentPackage } from "./lib/curriculum-map.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT_DIR = resolve(ROOT, "data/content/starters");

const files = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

let failed = 0;

for (const file of files) {
  const content = JSON.parse(readFileSync(resolve(CONTENT_DIR, file), "utf8"));
  try {
    validateContentPackage(content, "starters");
    const lessonCount = content.lessons?.length ?? 0;
    const vocabCount = content.vocabularyBank?.length ?? 0;
    console.log(`✓ ${file} — ${lessonCount} lessons, ${vocabCount} vocab`);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
    failed += 1;
  }
}

if (failed > 0) {
  process.exit(1);
}

console.log(`\nAll ${files.length} Starters units valid.`);
