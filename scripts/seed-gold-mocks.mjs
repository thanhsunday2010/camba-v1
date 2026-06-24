#!/usr/bin/env node
/**
 * Seed all 15 Gold Mock exams into Supabase.
 *
 * Usage:
 *   npm run seed:gold-mocks
 *   npm run seed:gold-mocks -- starters
 *   npm run seed:gold-mocks -- --dry-run
 *   SEED_ENV=staging npm run seed:gold-mocks
 *   SEED_ENV=production npm run seed:gold-mocks
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in:
 *   .env.local (default), .env.staging.local, or .env.production.local
 */

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseFromEnv } from "./lib/env.mjs";
import {
  discoverGoldMockManifests,
  prepareGoldMockForSeeding,
  validateGoldMockForSeeding,
} from "./lib/gold-mock-seed.mjs";
import { seedMockTestFromManifest } from "./lib/seed-mock-test.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function parseArgs(argv) {
  const dryRun = argv.includes("--dry-run");
  const level = argv.find((a) => !a.startsWith("-") && a !== "dry-run") ?? null;
  return { dryRun, level };
}

async function main() {
  const { dryRun, level } = parseArgs(process.argv.slice(2));
  const targets = discoverGoldMockManifests(level);

  if (targets.length === 0) {
    console.error("No gold mock manifests found.");
    process.exit(1);
  }

  console.log(`Found ${targets.length} gold mock manifest(s)${level ? ` for ${level}` : ""}.`);
  if (dryRun) console.log("DRY RUN — validation only, no database writes.\n");

  let failed = 0;
  const results = [];
  let supabase = null;

  if (!dryRun) {
    const { url, key } = createSupabaseFromEnv(ROOT);
    supabase = createClient(url, key, { auth: { persistSession: false } });
    console.log(`Target: ${process.env.SEED_ENV ?? "local"} Supabase (${url})\n`);
  }

  for (const target of targets) {
    const { goldMockId, raw } = target;
    try {
      const validation = validateGoldMockForSeeding(raw);
      if (!validation.valid) {
        const msg = validation.issues
          .filter((i) => i.severity === "error")
          .map((i) => `  ${i.path}: ${i.message}`)
          .join("\n");
        throw new Error(`Validation failed:\n${msg}`);
      }

      const runtime = prepareGoldMockForSeeding(raw);
      const mockTestId = runtime.metadata.seedIds.mockTestId;

      if (dryRun) {
        console.log(`✓ ${goldMockId} → ${mockTestId} (${runtime.questions.length} questions)`);
        results.push({ goldMockId, mockTestId, questionCount: runtime.questions.length });
        continue;
      }

      console.log(`\nSeeding ${goldMockId} — ${runtime.metadata.title}…`);
      const result = await seedMockTestFromManifest(supabase, runtime);
      console.log(`  ✓ ${result.mockTestId} (${result.questionCount} questions)`);
      results.push(result);
    } catch (err) {
      failed += 1;
      console.error(`  ✗ ${goldMockId}: ${err.message}`);
    }
  }

  if (failed > 0) process.exit(1);

  console.log(`\n${results.length} gold mock(s) ${dryRun ? "validated" : "seeded"}.`);
  if (!dryRun) {
    console.log("\nOpen the mock test hub: /mock-tests");
    for (const r of results) {
      const id = r.mockTestId ?? r.goldMockId;
      if (r.mockTestId) console.log(`  /mock-tests/${r.mockTestId}`);
    }
  }
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
