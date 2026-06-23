#!/usr/bin/env node
/**
 * Generate Cambridge unit JSON from blueprints (Movers, Flyers, PET, etc.)
 *
 * Usage:
 *   node scripts/generate-cambridge-units.mjs movers 1
 *   node scripts/generate-cambridge-units.mjs flyers 1 3
 *   node scripts/generate-cambridge-units.mjs pet 1
 */

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getCurriculumUnit } from "./lib/curriculum-map.mjs";
import { createCambridgeUnitBuilder } from "./lib/cambridge-unit-builder.mjs";
import { validateContentPackage } from "./lib/curriculum-map.mjs";
import { validateUnitStructure } from "./lib/validate-unit-structure.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SUPPORTED_LEVELS = new Set(["movers", "flyers", "pet"]);

function parseArgs() {
  const [levelArg, fromArg, toArg] = process.argv.slice(2);
  if (!levelArg || !SUPPORTED_LEVELS.has(levelArg)) {
    throw new Error(
      `Usage: node scripts/generate-cambridge-units.mjs <movers|flyers|pet> [fromUnit] [toUnit]`
    );
  }
  const from = fromArg ? parseInt(fromArg, 10) : 1;
  const to = toArg ? parseInt(toArg, 10) : from;
  return { level: levelArg, from, to };
}

async function loadBlueprint(level, unitNumber) {
  const path = resolve(
    __dirname,
    `lib/${level}-blueprints/unit-${String(unitNumber).padStart(2, "0")}.mjs`
  );
  if (!existsSync(path)) {
    throw new Error(`Missing blueprint: ${path}`);
  }
  const mod = await import(new URL(`file:///${path.replace(/\\/g, "/")}`).href);
  return mod.default;
}

async function main() {
  const { level, from, to } = parseArgs();
  const { buildCambridgeUnit } = createCambridgeUnitBuilder(level);
  const outDir = resolve(ROOT, `data/content/${level}`);
  mkdirSync(outDir, { recursive: true });

  for (let unitNumber = from; unitNumber <= to; unitNumber++) {
    const curriculumUnit = getCurriculumUnit(level, unitNumber);
    const blueprint = await loadBlueprint(level, unitNumber);
    const content = buildCambridgeUnit({
      ...blueprint,
      unitNumber,
      unitSlug: curriculumUnit.slug,
      unitTitle: curriculumUnit.title,
      curriculumUnit,
    });

    validateContentPackage(content, level);
    validateUnitStructure(content);

    const padded = String(unitNumber).padStart(2, "0");
    const outPath = resolve(outDir, `unit-${padded}-${curriculumUnit.slug}.json`);
    writeFileSync(outPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");

    const lessonCount = content.lessons?.length ?? 0;
    const exerciseCount = content.lessons?.reduce(
      (n, l) => n + (l.exercises?.length ?? 0),
      0
    );
    console.log(
      `✓ ${level}/unit-${padded}-${curriculumUnit.slug}.json — ${lessonCount} lessons, ${exerciseCount} exercises`
    );
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
