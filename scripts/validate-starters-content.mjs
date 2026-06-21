#!/usr/bin/env node
/**
 * Validate all Starters unit content JSON against curriculum map and structure.
 *
 * Usage: npm run validate:starters
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateContentPackage,
  getContentStructure,
} from "./lib/curriculum-map.mjs";
import { validateUnitStructure } from "./lib/validate-unit-structure.mjs";
import { isExpandedUnit } from "./lib/content-structure.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT_DIR = resolve(ROOT, "data/content/starters");

const structure = getContentStructure();
const files = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

let failed = 0;
let legacyCount = 0;

for (const file of files) {
  const content = JSON.parse(readFileSync(resolve(CONTENT_DIR, file), "utf8"));
  try {
    validateContentPackage(content, "starters");
    const vocabCount = content.vocabularyBank?.length ?? 0;

    if (isExpandedUnit(content)) {
      const stats = validateUnitStructure(content);
      console.log(
        `✓ ${file} — ${stats.lessonCount} lessons, ${stats.exerciseCount} exercises, ${vocabCount} vocab`
      );
    } else {
      legacyCount += 1;
      const lessonCount = content.lessons?.length ?? 0;
      console.log(
        `⚠ ${file} — ${lessonCount} lessons (legacy), ${vocabCount} vocab — run npm run generate:starters-units`
      );
    }
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
    failed += 1;
  }
}

if (failed > 0) {
  process.exit(1);
}

console.log(`\nAll ${files.length} Starters units valid.`);
if (legacyCount > 0) {
  console.log(
    `${legacyCount} unit(s) pending expansion to ${structure.minimumLessonsPerUnit} lessons (npm run generate:starters-units).`
  );
}
