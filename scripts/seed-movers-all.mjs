#!/usr/bin/env node
/**
 * Seed Movers units from data/content/movers/*.json
 *
 * Usage:
 *   npm run seed:movers
 *   npm run seed:movers -- --from 1 --to 3
 *   npm run seed:movers -- --unlock-test-student
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

function parseArgs() {
  const args = process.argv.slice(2);
  let from = 1;
  let to = 10;
  let unlockForTestStudent = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--from") from = parseInt(args[++i], 10);
    else if (args[i] === "--to") to = parseInt(args[++i], 10);
    else if (args[i] === "--unlock-test-student") unlockForTestStudent = true;
  }

  return { from, to, unlockForTestStudent };
}

function resolveContentPath(unitNumber) {
  const curriculumUnit = getCurriculumUnit("movers", unitNumber);
  const padded = String(unitNumber).padStart(2, "0");
  const path = resolve(
    ROOT,
    `data/content/movers/unit-${padded}-${curriculumUnit.slug}.json`
  );
  if (!existsSync(path)) {
    throw new Error(`Missing content file: ${path}`);
  }
  return path;
}

async function main() {
  const { from, to, unlockForTestStudent } = parseArgs();
  const { url, key } = createSupabaseFromEnv(ROOT);
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log(`Seeding Movers units ${from}–${to}...\n`);

  for (let unitNumber = from; unitNumber <= to; unitNumber++) {
    const contentPath = resolveContentPath(unitNumber);
    const content = JSON.parse(readFileSync(contentPath, "utf8"));

    console.log(`→ Unit ${unitNumber}: ${content.meta.unitTitle}`);

    const result = await seedUnitContent(supabase, {
      levelSlug: "movers",
      content,
      unlockForTestStudent,
    });

    console.log(
      `  ✓ ${result.lessonCount} lessons, ${result.exerciseCount} exercises, ${result.questionCount} questions\n`
    );
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
