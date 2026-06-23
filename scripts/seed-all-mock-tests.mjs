#!/usr/bin/env node
/**
 * Seed all YLE practice mock manifests under data/mock-tests/.
 *
 * Usage: npm run seed:all-mock-tests
 */

import { readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseFromEnv } from "./lib/env.mjs";
import { seedMockTestFromManifest } from "./lib/seed-mock-test.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST_ROOT = resolve(ROOT, "data/mock-tests");

function discoverManifests() {
  const manifests = [];
  for (const level of readdirSync(MANIFEST_ROOT, { withFileTypes: true }).filter((d) =>
    d.isDirectory()
  )) {
    const dir = join(MANIFEST_ROOT, level.name);
    for (const file of readdirSync(dir)) {
      if (file.endsWith(".json")) {
        manifests.push({
          levelSlug: level.name,
          slug: file.replace(/\.json$/, ""),
          path: join(dir, file),
        });
      }
    }
  }
  return manifests.sort((a, b) =>
    `${a.levelSlug}/${a.slug}`.localeCompare(`${b.levelSlug}/${b.slug}`)
  );
}

async function main() {
  const { url, key } = createSupabaseFromEnv(ROOT);
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const targets = discoverManifests();

  if (targets.length === 0) {
    console.error("No manifests found.");
    process.exit(1);
  }

  let failed = 0;
  for (const { levelSlug, slug, path } of targets) {
    const manifest = JSON.parse(readFileSync(path, "utf8"));
    try {
      console.log(`\nSeeding ${levelSlug}/${slug} — ${manifest.metadata.title}…`);
      const result = await seedMockTestFromManifest(supabase, manifest);
      console.log(`  ✓ ${result.mockTestId} (${result.questionCount} questions)`);
    } catch (err) {
      failed += 1;
      console.error(`  ✗ ${slug}: ${err.message}`);
    }
  }

  if (failed > 0) process.exit(1);
  console.log(`\n${targets.length} mock test(s) seeded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
