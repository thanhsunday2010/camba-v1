#!/usr/bin/env node
/**
 * Write M1.3 YLE practice mock JSON manifests from the content bank.
 *
 * Usage: node scripts/write-m1-3-mock-manifests.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { M1_3_MANIFESTS } from "./lib/m1-3-mock-bank.mjs";
import { validateManifestForSeeding } from "./lib/validate-mock-test-manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "data/mock-tests");

let failed = 0;

for (const manifest of M1_3_MANIFESTS) {
  const level = manifest.metadata.levelSlug;
  const slug = manifest.metadata.stableSlug ?? manifest.metadata.manifestId;
  const dir = join(OUT, level);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const path = join(dir, `${slug}.json`);

  const validation = validateManifestForSeeding(manifest);
  if (!validation.valid) {
    failed += 1;
    console.error(`✗ ${level}/${slug} invalid:`);
    for (const i of validation.issues.filter((x) => x.severity === "error")) {
      console.error(`  ${i.path}: ${i.message}`);
    }
    continue;
  }

  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`✓ wrote ${level}/${slug}.json (${manifest.questions.length} questions)`);
}

if (failed > 0) process.exit(1);
console.log(`\n${M1_3_MANIFESTS.length} manifest(s) written.`);
