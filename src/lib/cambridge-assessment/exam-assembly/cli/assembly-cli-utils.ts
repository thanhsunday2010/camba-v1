import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import {
  assembleCambridgeExam,
  assembleAllVersions,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembler";
import type { CambridgeExamVersion } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
import { validateAssemblyResult } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-validation";
import { formatAssemblyReportText } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-report";

const EXAMS_ROOT = resolve(process.cwd(), "data/cambridge-exams");

export function writeGoldenExam(
  level: CambridgeExamLevel,
  version: CambridgeExamVersion = "A"
) {
  const result = assembleCambridgeExam({ level, version, strict: true });
  if (!result.success) {
    throw new Error(`Assembly failed for ${level} ${version}: ${result.errors.join("; ")}`);
  }

  const dir = join(EXAMS_ROOT, level);
  mkdirSync(dir, { recursive: true });

  const base = `${level}-reference-${version.toLowerCase()}`;
  writeFileSync(
    join(dir, `${base}-manifest.json`),
    JSON.stringify(result.manifest, null, 2),
    "utf8"
  );
  writeFileSync(
    join(dir, `${base}-runtime.json`),
    JSON.stringify(result.runtimeManifest, null, 2),
    "utf8"
  );
  writeFileSync(
    join(dir, `${base}-report.json`),
    JSON.stringify(result.report, null, 2),
    "utf8"
  );
  writeFileSync(
    join(dir, `${base}-report.txt`),
    formatAssemblyReportText(result.report),
    "utf8"
  );

  return result;
}

export function writeAllGoldenExams() {
  const levels: CambridgeExamLevel[] = ["starters", "movers", "flyers", "ket", "pet"];
  return levels.map((level) => writeGoldenExam(level, "A"));
}

export function runGenerateCli(level: CambridgeExamLevel, version: CambridgeExamVersion) {
  const result = writeGoldenExam(level, version);
  console.log(formatAssemblyReportText(result.report));
  return result;
}

export function runValidateCli(level?: CambridgeExamLevel) {
  const levels: CambridgeExamLevel[] = level
    ? [level]
    : ["starters", "movers", "flyers", "ket", "pet"];
  let allValid = true;

  for (const lv of levels) {
    const result = assembleCambridgeExam({ level: lv, version: "A", strict: false });
    const validation = validateAssemblyResult(result);
    console.log(`\n=== ${lv.toUpperCase()} ===`);
    console.log(`Assembly success: ${result.success}`);
    console.log(`Validation valid: ${validation.valid}`);
    if (validation.issues.length) {
      for (const issue of validation.issues) {
        console.log(`  [${issue.severity}] ${issue.code}: ${issue.message}`);
      }
    }
    if (!validation.valid) allValid = false;
  }

  if (!allValid) process.exitCode = 1;
  return allValid;
}

export function runAnalyzeCli(level: CambridgeExamLevel, version: CambridgeExamVersion = "A") {
  const result = assembleCambridgeExam({ level, version, strict: false });
  console.log(formatAssemblyReportText(result.report));
  if (!result.success) process.exitCode = 1;
  return result;
}

export { assembleAllVersions, assembleCambridgeExam };
