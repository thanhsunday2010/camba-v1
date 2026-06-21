#!/usr/bin/env node
/**
 * Normalize existing KET unit JSON: add Review exercises (4→5 per lesson).
 *
 * Usage: node scripts/normalize-ket-content.mjs [from] [to]
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateContentPackage, loadCurriculumMap } from "./lib/curriculum-map.mjs";
import { normalizeSingleLessonUnit } from "./lib/unit-assembler.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT_DIR = resolve(ROOT, "data/content/ket");

function parseRange() {
  const args = process.argv.slice(2);
  let from = 1;
  let to = 12;
  if (args[0] && /^\d+$/.test(args[0])) {
    from = parseInt(args[0], 10);
    to = args[1] ? parseInt(args[1], 10) : from;
  }
  return { from, to };
}

function findFile(unitNumber) {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
  const padded = String(unitNumber).padStart(2, "0");
  return files.find((f) => f.startsWith(`unit-${padded}-`) || f.startsWith(`unit-${unitNumber}-`));
}

async function main() {
  const { from, to } = parseRange();
  const mapVersion = loadCurriculumMap().version;

  for (let unitNumber = from; unitNumber <= to; unitNumber++) {
    const file = findFile(unitNumber);
    if (!file) {
      console.warn(`⚠ No file for KET unit ${unitNumber}`);
      continue;
    }
    const path = resolve(CONTENT_DIR, file);
    const content = JSON.parse(readFileSync(path, "utf8"));
    const normalized = normalizeSingleLessonUnit(content);
    normalized.meta.curriculumMapVersion = mapVersion;
    validateContentPackage(normalized, "ket");
    writeFileSync(path, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");

    const exCount = normalized.lessons.reduce(
      (s, l) => s + l.exercises.length,
      0
    );
    console.log(`✓ ${file} — ${normalized.lessons.length} lessons, ${exCount} exercises`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
