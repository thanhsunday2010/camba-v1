#!/usr/bin/env node
/**
 * Generate KET unit JSON files from blueprints in scripts/lib/ket-blueprints/
 *
 * Usage:
 *   node scripts/generate-ket-units.mjs
 *   node scripts/generate-ket-units.mjs 2 5
 */

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getCurriculumUnit } from "./lib/curriculum-map.mjs";
import { buildKetUnit } from "./lib/ket-unit-builder.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BLUEPRINT_DIR = resolve(__dirname, "lib/ket-blueprints");

function parseRange() {
  const args = process.argv.slice(2);
  let from = 2;
  let to = 12;
  if (args[0] && /^\d+$/.test(args[0])) {
    from = parseInt(args[0], 10);
    to = args[1] ? parseInt(args[1], 10) : from;
  }
  return { from, to };
}

async function loadBlueprint(unitNumber) {
  const path = resolve(BLUEPRINT_DIR, `unit-${String(unitNumber).padStart(2, "0")}.mjs`);
  if (!existsSync(path)) {
    throw new Error(`Missing blueprint: ${path}`);
  }
  const mod = await import(new URL(`file:///${path.replace(/\\/g, "/")}`).href);
  return mod.default;
}

async function main() {
  const { from, to } = parseRange();
  const outDir = resolve(ROOT, "data/content/ket");
  mkdirSync(outDir, { recursive: true });

  for (let unitNumber = from; unitNumber <= to; unitNumber++) {
    const curriculumUnit = getCurriculumUnit("ket", unitNumber);
    const blueprint = await loadBlueprint(unitNumber);
    const content = buildKetUnit({
      ...blueprint,
      unitNumber,
      unitSlug: curriculumUnit.slug,
      unitTitle: curriculumUnit.title,
      curriculumUnit,
    });

    const padded = String(unitNumber).padStart(2, "0");
    const outPath = resolve(
      outDir,
      `unit-${padded}-${curriculumUnit.slug}.json`
    );
    writeFileSync(outPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");

    const lessonCount = content.lessons?.length ?? 0;
    const exerciseCount = content.lessons?.reduce(
      (n, l) => n + (l.exercises?.length ?? 0),
      0
    );
    console.log(
      `✓ unit-${padded}-${curriculumUnit.slug}.json — ${lessonCount} lessons, ${exerciseCount} exercises`
    );
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
