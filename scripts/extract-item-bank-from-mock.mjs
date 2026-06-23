#!/usr/bin/env node
/**
 * Extract item bank from a mock manifest.
 *
 * Usage:
 *   npm run extract:item-bank
 *   npm run extract:item-bank -- starters starters-practice-test-1
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractItemBankFromManifest } from "./lib/item-bank-extract.mjs";
import { validateItemBankFile } from "./lib/item-bank-validation.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST_ROOT = resolve(ROOT, "data/mock-tests");
const BANK_ROOT = resolve(ROOT, "data/item-bank");

function main() {
  const args = process.argv.slice(2);
  const level = args[0] ?? "starters";
  const slug = args[1] ?? "starters-practice-test-1";
  const manifestPath = resolve(MANIFEST_ROOT, level, `${slug}.json`);

  if (!existsSync(manifestPath)) {
    console.error(`Manifest not found: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const bank = extractItemBankFromManifest(manifest);
  const validation = validateItemBankFile(bank.items);

  if (!validation.valid) {
    console.error("Item bank validation failed after extraction:");
    for (const err of validation.errors) {
      console.error(`  [${err.code}] ${err.path}: ${err.message}`);
    }
    process.exit(1);
  }

  const outDir = join(BANK_ROOT, level);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "items.json");
  writeFileSync(outPath, `${JSON.stringify(bank, null, 2)}\n`, "utf8");

  console.log(`Extracted ${bank.itemCount} items → ${outPath}`);
}

main();
