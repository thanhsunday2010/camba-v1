#!/usr/bin/env node
/**
 * Generate MP3 files for listening exercises and set content.audioUrl in unit JSON.
 *
 * Usage:
 *   npm run generate:listening-audio
 *   npm run generate:listening-audio -- starters
 *   npm run generate:listening-audio -- starters 1 3
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getCurriculumUnit } from "./lib/curriculum-map.mjs";
import { writeListeningMp3 } from "./lib/listening-audio.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function parseArgs() {
  const args = process.argv.slice(2);
  const levelSlug = args[0] ?? "starters";
  let from = 1;
  let to = 10;

  if (args[1] && /^\d+$/.test(args[1])) {
    from = parseInt(args[1], 10);
    to = args[2] ? parseInt(args[2], 10) : from;
  } else if (levelSlug === "starters") {
    from = 1;
    to = 10;
  }

  return { levelSlug, from, to };
}

function findListeningExercises(content) {
  const items = [];
  for (const lesson of content.lessons ?? []) {
    if (lesson.skill !== "listening") continue;
    for (const exercise of lesson.exercises ?? []) {
      if (exercise.exerciseType === "listening" && exercise.content?.script) {
        items.push({ lesson, exercise });
      }
    }
  }
  return items;
}

async function main() {
  const { levelSlug, from, to } = parseArgs();
  let generated = 0;

  for (let unitNumber = from; unitNumber <= to; unitNumber++) {
    const curriculumUnit = getCurriculumUnit(levelSlug, unitNumber);
    const padded = String(unitNumber).padStart(2, "0");
    const jsonPath = resolve(
      ROOT,
      `data/content/${levelSlug}/unit-${padded}-${curriculumUnit.slug}.json`
    );

    if (!existsSync(jsonPath)) {
      console.warn(`Skip unit ${unitNumber}: missing ${jsonPath}`);
      continue;
    }

    const content = JSON.parse(readFileSync(jsonPath, "utf8"));
    const listening = findListeningExercises(content);

    for (const { exercise } of listening) {
      const relDir = `audio/listening/${levelSlug}/unit-${padded}`;
      const mp3Name = `${exercise.slug}.mp3`;
      const filePath = resolve(ROOT, `public/${relDir}/${mp3Name}`);
      const audioUrl = `/${relDir}/${mp3Name}`;

      console.log(`→ Unit ${unitNumber}: ${exercise.title}`);
      const bytes = await writeListeningMp3(filePath, exercise.content.script);
      exercise.content.audioUrl = audioUrl;
      console.log(`  ✓ ${audioUrl} (${Math.round(bytes / 1024)} KB)`);
      generated += 1;
    }

    writeFileSync(jsonPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
    console.log(`  Updated ${jsonPath}\n`);
  }

  console.log(`Generated ${generated} listening MP3 file(s).`);
  console.log("Re-seed units to update Supabase: npm run seed:starters");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
