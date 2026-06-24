#!/usr/bin/env node
/**
 * Generate listening MP3 files for Gold Mock exams (TTS from part transcripts).
 *
 * Usage:
 *   npm run generate:gold-mock-audio
 *   npm run generate:gold-mock-audio -- starters
 *   npm run generate:gold-mock-audio -- starters-gold-mock-1
 */

import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverGoldMockManifests } from "./lib/gold-mock-seed.mjs";
import { writeGoldMockListeningMp3 } from "./lib/gold-mock-audio.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC_ROOT = join(ROOT, "public");

function parseArgs(argv) {
  const args = argv.filter((a) => !a.startsWith("-"));
  if (!args.length) return { level: null, goldMockId: null };
  if (args[0].includes("-gold-mock-")) return { level: null, goldMockId: args[0] };
  return { level: args[0], goldMockId: args[1] ?? null };
}

async function main() {
  const { level, goldMockId } = parseArgs(process.argv.slice(2));
  let targets = discoverGoldMockManifests(level);

  if (goldMockId) {
    targets = targets.filter((t) => t.goldMockId === goldMockId);
  }

  if (!targets.length) {
    console.error("No gold mock manifests matched.");
    process.exit(1);
  }

  let generated = 0;
  let skipped = 0;

  for (const target of targets) {
    const { goldMockId: mockId, raw } = target;
    const listeningParts = (raw.parts ?? []).filter(
      (p) => p.sectionSlug === "listening" && p.audio?.transcript?.trim()
    );

    if (!listeningParts.length) {
      console.warn(`Skip ${mockId}: no listening parts with transcripts`);
      continue;
    }

    console.log(`\n${mockId} (${listeningParts.length} listening parts)`);

    for (const part of listeningParts) {
      const relPath = `audio/gold-mocks/${mockId}/${part.partSlug}.mp3`;
      const filePath = join(PUBLIC_ROOT, relPath);

      try {
        const bytes = await writeGoldMockListeningMp3(filePath, part.audio.transcript);
        console.log(`  ✓ /${relPath} (${Math.round(bytes / 1024)} KB)`);
        generated += 1;
      } catch (err) {
        skipped += 1;
        console.error(`  ✗ ${part.partSlug}: ${err.message}`);
      }
    }
  }

  console.log(`\nGenerated ${generated} MP3 file(s)${skipped ? `, ${skipped} failed` : ""}.`);
  console.log("Re-seed mocks so Supabase question context uses updated audio paths:");
  console.log("  npm run seed:gold-mocks");

  if (skipped > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
