#!/usr/bin/env node
/**
 * Seed unit content from data/content/{level}/unit-NN-{slug}.json
 *
 * Usage:
 *   npm run seed:unit -- starters 1
 *   npm run seed:unit -- starters 1 --unlock-test-student
 *
 * Requires bootstrap:curriculum (or seed will create skills/level on the fly).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createSupabaseFromEnv } from "./lib/env.mjs";
import { getCurriculumUnit } from "./lib/curriculum-map.mjs";
import { seedUnitContent } from "./lib/seed-unit-content.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function resolveContentPath(levelSlug, unitNumber) {
  const curriculumUnit = getCurriculumUnit(levelSlug, unitNumber);
  const padded = String(unitNumber).padStart(2, "0");
  const path = resolve(
    ROOT,
    `data/content/${levelSlug}/unit-${padded}-${curriculumUnit.slug}.json`
  );
  if (!existsSync(path)) {
    throw new Error(`Không tìm thấy file content: ${path}`);
  }
  return path;
}

async function main() {
  const args = process.argv.slice(2);
  const levelSlug = args[0];
  const unitNumber = parseInt(args[1], 10);
  const unlockForTestStudent = args.includes("--unlock-test-student");

  if (!levelSlug || !Number.isFinite(unitNumber)) {
    console.error("Usage: npm run seed:unit -- <level> <unitNumber> [--unlock-test-student]");
    console.error("Example: npm run seed:unit -- starters 1 --unlock-test-student");
    process.exit(1);
  }

  const contentPath = resolveContentPath(levelSlug, unitNumber);
  const content = JSON.parse(readFileSync(contentPath, "utf8"));

  const { url, key } = createSupabaseFromEnv(ROOT);
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log(`Importing ${levelSlug} unit ${unitNumber} from ${contentPath}`);

  const result = await seedUnitContent(supabase, {
    levelSlug,
    content,
    unlockForTestStudent,
  });

  console.log(`\n✓ ${levelSlug} Unit ${result.unitNumber} (${result.unitSlug}) imported`);
  console.log(`  Level ID: ${result.levelId}`);
  console.log(`  Lessons: ${result.lessonCount}`);
  console.log(`  Exercises: ${result.exerciseCount}`);
  console.log(`  Questions: ${result.questionCount}`);
  if (result.vocabularyCount > 0) {
    console.log(`  Vocabulary bank: ${result.vocabularyCount} words`);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
