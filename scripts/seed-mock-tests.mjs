#!/usr/bin/env node
/**
 * Seed YLE practice mock tests from authored manifests.
 *
 * Usage:
 *   npm run seed:mock-tests -- starters starters-practice-test-1
 *
 * Requires .env.local with Supabase service role key.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseFromEnv } from "./lib/env.mjs";
import { seedMockTestFromManifest } from "./lib/seed-mock-test.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadManifest(levelSlug, slug) {
  const path = resolve(ROOT, `data/mock-tests/${levelSlug}/${slug}.json`);
  if (!existsSync(path)) {
    throw new Error(`Manifest not found: ${path}`);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

async function main() {
  const [levelSlug, slug] = process.argv.slice(2);

  if (!levelSlug || !slug) {
    console.error("Usage: npm run seed:mock-tests -- <level> <manifest-slug>");
    console.error("Example: npm run seed:mock-tests -- starters starters-practice-test-1");
    process.exit(1);
  }

  const manifest = loadManifest(levelSlug, slug);
  const { url, key } = createSupabaseFromEnv(ROOT);
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log(`Seeding ${manifest.metadata.title}…`);

  const result = await seedMockTestFromManifest(supabase, manifest);

  console.log(`\n✓ Mock test seeded`);
  console.log(`  ID: ${result.mockTestId}`);
  console.log(`  Sections: ${result.sectionCount}`);
  console.log(`  Questions: ${result.questionCount}`);
  console.log(`\nOpen: /mock-tests/${result.mockTestId}`);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
