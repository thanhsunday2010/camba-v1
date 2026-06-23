#!/usr/bin/env node
/**
 * Validate Movers / Flyers / PET unit content JSON.
 *
 * Usage:
 *   node scripts/validate-cambridge-content.mjs movers
 *   node scripts/validate-cambridge-content.mjs flyers
 *   node scripts/validate-cambridge-content.mjs pet
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
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
const structure = getContentStructure();

const level = process.argv[2];
if (!level || !["movers", "flyers", "pet"].includes(level)) {
  console.error("Usage: node scripts/validate-cambridge-content.mjs <movers|flyers|pet>");
  process.exit(1);
}

const CONTENT_DIR = resolve(ROOT, `data/content/${level}`);

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
    validateContentPackage(content, level);
    const lessonCount = content.lessons?.length ?? 0;
    const vocabCount = content.vocabularyBank?.length ?? 0;
    const exerciseCount = (content.lessons ?? []).reduce(
      (sum, l) => sum + (l.exercises?.length ?? 0),
      0
    );

    if (isExpandedUnit(content)) {
      validateUnitStructure(content);
      console.log(
        `✓ ${file} — ${lessonCount} lessons, ${exerciseCount} exercises, ${vocabCount} vocab (gold)`
      );
    } else {
      console.log(
        `✓ ${file} — ${lessonCount} lessons, ${exerciseCount} exercises (legacy — needs expansion)`
      );
    }
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
    failed += 1;
  }
}

if (failed > 0) process.exit(1);
console.log(`\nAll ${files.length} ${level} unit(s) valid.`);
console.log(
  `Gold target: ${structure.minimumLessonsPerUnit} lessons × ${structure.exercisesPerLesson} exercises per unit.`
);
