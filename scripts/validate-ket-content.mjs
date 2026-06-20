#!/usr/bin/env node
/**
 * Validate all KET unit content JSON files against the curriculum map.
 *
 * Usage: npm run validate:ket
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateContentPackage } from "./lib/curriculum-map.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT_DIR = resolve(ROOT, "data/content/ket");

if (!existsSync(CONTENT_DIR)) {
  console.error(`Missing content directory: ${CONTENT_DIR}`);
  process.exit(1);
}

const files = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

let failed = 0;

for (const file of files) {
  const content = JSON.parse(readFileSync(resolve(CONTENT_DIR, file), "utf8"));
  try {
    validateContentPackage(content, "ket");
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

console.log(`\nAll ${files.length} KET units valid.`);
