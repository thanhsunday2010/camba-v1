#!/usr/bin/env node
/**
 * Generate Starters unit JSON from GOLD blueprints only.
 * Rich/legacy template generators are BANNED.
 *
 * Usage:
 *   npm run generate:starters-units
 *   npm run generate:starters-units -- 2 5
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getCurriculumUnit, validateContentPackage, loadCurriculumMap } from "./lib/curriculum-map.mjs";
import { validateUnitStructure } from "./lib/validate-unit-structure.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT_DIR = resolve(ROOT, "data/content/starters");
const BLUEPRINT_DIR = resolve(__dirname, "lib/starters-blueprints");

function parseRange() {
  const args = process.argv.slice(2);
  let from = 1;
  let to = 10;
  if (args[0] && /^\d+$/.test(args[0])) {
    from = parseInt(args[0], 10);
    to = args[1] ? parseInt(args[1], 10) : from;
  }
  return { from, to };
}

async function loadBlueprint(unitNumber) {
  const path = resolve(
    BLUEPRINT_DIR,
    `unit-${String(unitNumber).padStart(2, "0")}.mjs`
  );
  if (!existsSync(path)) {
    throw new Error(
      `Missing GOLD blueprint: ${path}\nHand-crafted blueprint required — rich generator is banned.`
    );
  }
  const mod = await import(new URL(`file:///${path.replace(/\\/g, "/")}`).href);
  return mod;
}

function findContentPath(unitNumber, unitSlug) {
  const padded = String(unitNumber).padStart(2, "0");
  const preferred = resolve(CONTENT_DIR, `unit-${padded}-${unitSlug}.json`);
  if (existsSync(preferred)) return preferred;
  const alt = resolve(CONTENT_DIR, `unit-${unitNumber}-${unitSlug}.json`);
  if (existsSync(alt)) return alt;
  return preferred;
}

async function generateUnit(unitNumber) {
  const curriculumUnit = getCurriculumUnit("starters", unitNumber);
  const contentPath = findContentPath(unitNumber, curriculumUnit.slug);

  if (!existsSync(contentPath)) {
    throw new Error(`No content file for starters unit ${unitNumber}: ${contentPath}`);
  }

  const base = JSON.parse(readFileSync(contentPath, "utf8"));
  const blueprint = await loadBlueprint(unitNumber);

  let content;
  if (blueprint.buildGoldUnit) {
    content = blueprint.buildGoldUnit(base);
  } else if (blueprint.default?.buildGoldUnit) {
    content = blueprint.default.buildGoldUnit(base);
  } else if (blueprint.expandUnit) {
    content = blueprint.expandUnit(base);
  } else if (blueprint.default?.expandUnit) {
    content = blueprint.default.expandUnit(base);
  } else {
    throw new Error(`Blueprint unit ${unitNumber} has no buildGoldUnit/expandUnit`);
  }

  validateContentPackage(content, "starters");
  content.meta.curriculumMapVersion = loadCurriculumMap().version;
  const stats = validateUnitStructure(content);

  writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");

  return { contentPath, stats, curriculumUnit };
}

async function main() {
  const { from, to } = parseRange();
  console.log(`Generating GOLD Starters units ${from}–${to} (blueprints only)…\n`);

  for (let unitNumber = from; unitNumber <= to; unitNumber++) {
    const { contentPath, stats, curriculumUnit } = await generateUnit(unitNumber);
    console.log(`✓ Unit ${unitNumber} (${curriculumUnit.slug}) [gold-blueprint]`);
    console.log(
      `  ${stats.lessonCount} lessons, ${stats.exerciseCount} exercises → ${contentPath}`
    );
  }

  console.log("\nDone. Run npm run validate:starters && npm run generate:listening-audio");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
