#!/usr/bin/env node
/**
 * Remove all mock tests from Supabase and related mock question bank containers.
 *
 * Usage: npm run delete:all-mock-tests
 */

import { readdirSync, unlinkSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseFromEnv } from "./lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST_ROOT = resolve(ROOT, "data/mock-tests");
const ITEM_BANK_ROOT = resolve(ROOT, "data/item-bank");

function deleteManifestFiles() {
  let count = 0;
  if (!existsSync(MANIFEST_ROOT)) return count;

  for (const level of readdirSync(MANIFEST_ROOT, { withFileTypes: true }).filter((d) =>
    d.isDirectory()
  )) {
    const dir = join(MANIFEST_ROOT, level.name);
    for (const file of readdirSync(dir)) {
      if (file.endsWith(".json")) {
        unlinkSync(join(dir, file));
        count += 1;
      }
    }
  }
  return count;
}

function resetItemBanks() {
  const emptyBank = (level) =>
    JSON.stringify(
      {
        bankVersion: "1.0.0",
        level,
        itemCount: 0,
        sourceManifests: [],
        items: [],
      },
      null,
      2
    ) + "\n";

  for (const level of ["starters", "movers", "flyers"]) {
    const dir = join(ITEM_BANK_ROOT, level);
    if (!existsSync(dir)) continue;
    writeFileSync(join(dir, "items.json"), emptyBank(level), "utf8");
  }
}

async function deleteMockTestsFromDb(supabase) {
  const { data: mocks, error: listError } = await supabase
    .from("mock_tests")
    .select("id, title");
  if (listError) throw new Error(`list mock_tests: ${listError.message}`);

  if (mocks?.length) {
    const ids = mocks.map((m) => m.id);
    const { error: deleteError } = await supabase.from("mock_tests").delete().in("id", ids);
    if (deleteError) throw new Error(`delete mock_tests: ${deleteError.message}`);
  }

  const { data: units, error: unitListError } = await supabase
    .from("units")
    .select("id, slug, metadata")
    .or("slug.like.mock-bank-%,metadata->>mockBank.eq.true");
  if (unitListError) throw new Error(`list mock bank units: ${unitListError.message}`);

  const mockBankUnits =
    units?.filter((u) => u.slug?.startsWith("mock-bank-") || u.metadata?.mockBank === true) ?? [];

  if (mockBankUnits.length) {
    const unitIds = mockBankUnits.map((u) => u.id);
    const { error: unitDeleteError } = await supabase.from("units").delete().in("id", unitIds);
    if (unitDeleteError) throw new Error(`delete mock bank units: ${unitDeleteError.message}`);
  }

  return {
    mockTestsDeleted: mocks?.length ?? 0,
    mockBankUnitsDeleted: mockBankUnits.length,
  };
}

async function main() {
  const { url, key } = createSupabaseFromEnv(ROOT);
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const db = await deleteMockTestsFromDb(supabase);
  const manifestsDeleted = deleteManifestFiles();
  resetItemBanks();

  console.log("Deleted mock tests from database:", db.mockTestsDeleted);
  console.log("Deleted mock bank container units:", db.mockBankUnitsDeleted);
  console.log("Deleted manifest files:", manifestsDeleted);
  console.log("Reset item banks: starters, movers, flyers");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
