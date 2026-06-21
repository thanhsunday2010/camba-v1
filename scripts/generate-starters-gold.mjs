#!/usr/bin/env node
/**
 * Generate Starters units from GOLD blueprints only.
 * Rich/legacy template generators are NOT used.
 *
 * Usage:
 *   npm run generate:starters-gold
 *   npm run generate:starters-gold -- 2 5
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getCurriculumUnit } from "./lib/curriculum-map.mjs";
import { validateContentPackage } from "./lib/curriculum-map.mjs";
import { buildGoldUnit } from "./lib/starters-gold/build-gold-unit.mjs";

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
  if (!mod.default && !mod.buildGoldUnit && !mod.expandUnit) {
    throw new Error(`Blueprint unit-${unitNumber} must export buildGoldUnit or expandUnit`);
  }
  return mod;
}

function contentPath(unitNumber, unitSlug) {
  const padded = String(unitNumber).padStart(2, "0");
  return resolve(CONTENT_DIR, `unit-${padded}-${unitSlug}.json`);
}

async function generateUnit(unitNumber) {
  const curriculumUnit = getCurriculumUnit("starters", unitNumber);
  const path = contentPath(unitNumber, curriculumUnit.slug);
  if (!existsSync(path)) {
    throw new Error(`Missing base content: ${path}`);
  }

  const base = JSON.parse(readFileSync(path, "utf8"));
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
  writeFileSync(path, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  return content;
}

async function main() {
  const { from, to } = parseRange();
  console.log(`Generating GOLD Starters units ${from}–${to} (blueprints only)…\n`);

  for (let n = from; n <= to; n++) {
    const content = await generateUnit(n);
    const exCount = content.lessons.reduce(
      (s, l) => s + l.exercises.length,
      0
    );
    console.log(
      `✓ Unit ${n} (${content.meta.unitSlug}) — ${content.lessons.length} lessons, ${exCount} exercises`
    );
  }

  console.log("\nDone. Run: npm run validate:starters");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
