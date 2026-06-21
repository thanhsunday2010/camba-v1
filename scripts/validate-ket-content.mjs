#!/usr/bin/env node
/**
 * Validate all KET unit content JSON against the curriculum map.
 *
 * Usage: npm run validate:ket
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
const CONTENT_DIR = resolve(ROOT, "data/content/ket");
const structure = getContentStructure();

if (!existsSync(CONTENT_DIR)) {
  console.error(`Missing content directory: ${CONTENT_DIR}`);
  process.exit(1);
}

const files = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

let failed = 0;
let legacyStructure = 0;

for (const file of files) {
  const content = JSON.parse(readFileSync(resolve(CONTENT_DIR, file), "utf8"));
  try {
    validateContentPackage(content, "ket");
    const lessonCount = content.lessons?.length ?? 0;
    const vocabCount = content.vocabularyBank?.length ?? 0;
    const exerciseCount = (content.lessons ?? []).reduce(
      (sum, l) => sum + (l.exercises?.length ?? 0),
      0
    );

    if (isExpandedUnit(content)) {
      validateUnitStructure(content);
      console.log(
        `✓ ${file} — ${lessonCount} lessons, ${exerciseCount} exercises, ${vocabCount} vocab`
      );
    } else {
      legacyStructure += 1;
      const perLesson = lessonCount
        ? Math.round(exerciseCount / lessonCount)
        : 0;
      console.log(
        `✓ ${file} — ${lessonCount} lessons × ~${perLesson} exercises (legacy), ${vocabCount} vocab`
      );
      if (perLesson < structure.exercisesPerLesson) {
        console.log(
          `  ⚠ Re-run npm run generate:ket-units to add Review exercises (${structure.exercisesPerLesson}/lesson)`
        );
      }
    }
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
    failed += 1;
  }
}

if (failed > 0) {
  process.exit(1);
}

console.log(`\nAll ${files.length} KET units valid.`);
if (legacyStructure > 0) {
  console.log(
    `${legacyStructure} unit(s) on legacy lesson count — full ${structure.minimumLessonsPerUnit}-lesson expansion pending blueprint update.`
  );
}
