import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { GoldMockManifest } from "@/lib/cambridge-assessment/gold-mock-format";
import { getAllGoldMockManifests, getGoldMocksForLevel } from "@/lib/cambridge-assessment/gold-mock-registry";
import { registerAvailableGoldMocks } from "@/lib/cambridge-assessment/gold-mocks/register-all-gold-mocks";
import { formatGoldMockValidationReport, validateGoldMock } from "@/lib/cambridge-assessment/gold-mock-validation";

const ROOT = resolve(process.cwd(), "data/cambridge-gold-mocks");

export function writeGoldMockJson(manifest: GoldMockManifest): string {
  const level = manifest.specification.level;
  const dir = join(ROOT, level);
  mkdirSync(dir, { recursive: true });
  const filename = `${manifest.gold.goldMockId}.json`;
  const path = join(dir, filename);
  writeFileSync(path, JSON.stringify(manifest, null, 2), "utf8");
  return path;
}

export function writeGoldMockJsonByLevel(level: CambridgeExamLevel) {
  registerAvailableGoldMocks();
  return getGoldMocksForLevel(level).map((e) => writeGoldMockJson(e.manifest));
}

export function writeAllGoldMockJson() {
  registerAvailableGoldMocks();
  return getAllGoldMockManifests().map(writeGoldMockJson);
}

export function runGoldMockAnalyzeCli(level?: CambridgeExamLevel) {
  registerAvailableGoldMocks();
  const mocks = level
    ? getGoldMocksForLevel(level).map((e) => e.manifest)
    : getAllGoldMockManifests();
  let allValid = true;

  for (const mock of mocks) {
    const report = validateGoldMock(mock);
    console.log(formatGoldMockValidationReport(report));
    console.log("");
    if (!report.valid) allValid = false;
  }

  if (!allValid) process.exitCode = 1;
  return allValid;
}
