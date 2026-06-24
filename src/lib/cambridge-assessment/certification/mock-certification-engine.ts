/**
 * M3.4 — Mock certification engine.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeExamAssemblyResult } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
import { assembleCambridgeExam } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembler";
import { validateAssemblyResult } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-validation";
import type { GoldMockManifest } from "@/lib/cambridge-assessment/gold-mock-format";
import { getGoldMock, ALL_GOLD_MOCKS } from "@/lib/cambridge-assessment/gold-mocks";
import { getAllGoldMockManifests } from "@/lib/cambridge-assessment/gold-mock-registry";
import { registerAvailableGoldMocks } from "@/lib/cambridge-assessment/gold-mocks/register-all-gold-mocks";
import { validateGoldMock } from "@/lib/cambridge-assessment/gold-mock-validation";
import {
  evaluateAcademicQuality,
  evaluateBlueprintFidelity,
  evaluateStudentSafety,
} from "@/lib/cambridge-assessment/certification/academic-quality-rules";
import {
  assignCertificationLevel,
  computeCertificationScore,
  isStudentFacing,
} from "@/lib/cambridge-assessment/certification/mock-certification-rules";
import {
  detectMockDuplicates,
  diversityScoreFromReport,
  duplicateIssuesFromReport,
} from "@/lib/cambridge-assessment/certification/mock-certification-duplicates";
import {
  registerCertification,
  CERTIFICATION_REGISTRY_ROOT,
} from "@/lib/cambridge-assessment/certification/mock-certification-registry";
import type {
  GoldMockComparisonReport,
  MockCertificationInput,
  MockCertificationResult,
} from "@/lib/cambridge-assessment/certification/mock-certification-types";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";

export const CERTIFICATION_REPORTS_ROOT = resolve(
  process.cwd(),
  "data/cambridge-certification/reports"
);

export function certifyMockExam(input: MockCertificationInput): MockCertificationResult {
  const { runtime, level, mockId, source } = input;
  const version = input.version ?? "1";
  const questions = runtime.questions;
  const notes: string[] = [];
  const allIssues = [];

  const safety = evaluateStudentSafety(runtime);
  allIssues.push(...safety.issues);

  const academic = evaluateAcademicQuality(level, runtime);
  allIssues.push(...academic.issues);

  const blueprint = evaluateBlueprintFidelity(level, questions);
  allIssues.push(...blueprint.issues);

  const duplicates = detectMockDuplicates(questions);
  allIssues.push(...duplicateIssuesFromReport(duplicates));

  const coverageScore = Math.min(
    100,
    Math.round(
      (Math.min(academic.grammarDistinct / 12, 1) * 30 +
        Math.min(academic.vocabularyDistinct / 15, 1) * 30 +
        Math.min(academic.taskDistinct / 6, 1) * 20 +
        Math.min(academic.topicDistinct / 10, 1) * 20) *
        100 /
        100
    )
  );

  const qaScore = academic.score;
  const diversityScore = diversityScoreFromReport(duplicates);
  const blueprintScore = blueprint.score;
  const certificationScore = computeCertificationScore(
    coverageScore,
    qaScore,
    diversityScore,
    blueprintScore
  );

  const criticalErrorCount = allIssues.filter((i) => i.severity === "error").length;
  const hasBlueprintFailure = !blueprint.compliant;
  const hasSafetyFailure = !safety.safe;

  const levelAssigned = assignCertificationLevel({
    metrics: {
      certificationScore,
      coverageScore,
      qaScore,
      diversityScore,
      blueprintScore,
      grammarDistinct: academic.grammarDistinct,
      vocabularyDistinct: academic.vocabularyDistinct,
      skillDistinct: academic.skillDistinct,
      taskDistinct: academic.taskDistinct,
      topicDistinct: academic.topicDistinct,
      difficultyDistinct: new Set(questions.map((q) => q.difficulty)).size,
      writingCount: academic.writingCount,
      speakingCount: academic.speakingCount,
      readingCount: academic.readingCount,
      listeningCount: academic.listeningCount,
      duplicateItemCount: duplicates.duplicateItemCount,
      duplicateClusterCount: duplicates.duplicateClusterCount,
    },
    criticalErrorCount,
    hasBlueprintFailure,
    hasSafetyFailure,
  });

  if (source === "gold") notes.push("Manually authored Gold Mock — academic authority baseline.");
  if (duplicates.duplicateItemCount > 0) {
    notes.push(`${duplicates.duplicateItemCount} duplicate item(s) detected.`);
  }
  if (!academic.difficultyBalanced) notes.push("Difficulty distribution outside target bands.");

  const result: MockCertificationResult = {
    mockId,
    version,
    level,
    source,
    levelAssigned,
    certified: isStudentFacing(levelAssigned),
    studentFacing: isStudentFacing(levelAssigned),
    metrics: {
      certificationScore,
      coverageScore,
      qaScore,
      diversityScore,
      blueprintScore,
      grammarDistinct: academic.grammarDistinct,
      vocabularyDistinct: academic.vocabularyDistinct,
      skillDistinct: academic.skillDistinct,
      taskDistinct: academic.taskDistinct,
      topicDistinct: academic.topicDistinct,
      difficultyDistinct: new Set(questions.map((q) => q.difficulty)).size,
      writingCount: academic.writingCount,
      speakingCount: academic.speakingCount,
      readingCount: academic.readingCount,
      listeningCount: academic.listeningCount,
      duplicateItemCount: duplicates.duplicateItemCount,
      duplicateClusterCount: duplicates.duplicateClusterCount,
    },
    issues: allIssues,
    certifiedAt: new Date().toISOString(),
    notes,
  };

  return result;
}

export function certifyGoldMock(manifest: GoldMockManifest): MockCertificationResult {
  const result = certifyMockExam({
    mockId: manifest.gold.goldMockId,
    version: manifest.metadata.manifestVersion ?? "1",
    level: manifest.specification.level,
    runtime: manifest,
    source: "gold",
  });

  const goldValidation = validateGoldMock(manifest);
  if (!goldValidation.valid) {
    result.levelAssigned = "rejected";
    result.certified = false;
    result.studentFacing = false;
    result.notes.push("Fails validateGoldMock() — not eligible for Gold Mock publication.");
    return result;
  }

  result.notes.push("Passes validateGoldMock() — academic authority baseline.");

  // M4.1: Gold Mocks must certify at GOLD tier only — no Silver/Bronze publication.
  if (
    result.metrics.blueprintScore === 100 &&
    result.metrics.writingCount > 0 &&
    result.metrics.speakingCount > 0 &&
    result.metrics.certificationScore >= 85 &&
    result.issues.filter((i) => i.severity === "error").length === 0
  ) {
    result.levelAssigned = "gold";
    result.certified = true;
    result.studentFacing = true;
  } else {
    result.levelAssigned = "rejected";
    result.certified = false;
    result.studentFacing = false;
    result.notes.push("M4.1 policy: Gold Mocks require GOLD certification tier (score ≥85, blueprint 100%, zero errors).");
  }

  return result;
}

export function certifyAssemblyResult(
  result: CambridgeExamAssemblyResult,
  mockId?: string
): MockCertificationResult | null {
  if (!result.success) return null;
  const validation = validateAssemblyResult(result);
  const base = certifyMockExam({
    mockId: mockId ?? result.manifest.metadata.manifestId,
    version: result.manifest.metadata.examVersion,
    level: result.manifest.metadata.level,
    runtime: result.runtimeManifest,
    source: "assembled",
    assemblySeed: result.manifest.metadata.assemblySeed,
  });

  if (!validation.valid) {
    base.issues.push(
      ...validation.issues.map((i) => ({
        code: i.code,
        path: i.path,
        message: i.message,
        severity: i.severity,
        category: "quality" as const,
      }))
    );
    if (validation.issues.some((i) => i.severity === "error")) {
      base.levelAssigned = "rejected";
      base.certified = false;
      base.studentFacing = false;
    }
  }

  return base;
}

export function certifyAllGoldMocks(): MockCertificationResult[] {
  registerAvailableGoldMocks();
  return getAllGoldMockManifests().map((m) => certifyGoldMock(m));
}

export function certifyAssembledMockForLevel(
  level: CambridgeExamLevel,
  version: "A" | "B" | "C" = "A",
  seed = "camba-m3-4-certify"
): MockCertificationResult | null {
  const assembled = assembleCambridgeExam({ level, version, seed });
  return certifyAssemblyResult(assembled, `${level}-assembled-${version.toLowerCase()}`);
}

export function buildGoldMockComparisonReport(): GoldMockComparisonReport {
  const entries = (["starters", "movers", "flyers", "ket", "pet"] as CambridgeExamLevel[]).map(
    (level) => {
      const gold = certifyGoldMock(getGoldMock(level));
      const assembled = certifyAssembledMockForLevel(level, "A");
      const assembledScore = assembled?.metrics.certificationScore ?? 0;
      const assembledLevel = assembled?.levelAssigned ?? "rejected";
      const scoreDelta = gold.metrics.certificationScore - assembledScore;
      return {
        level,
        goldMockId: gold.mockId,
        goldScore: gold.metrics.certificationScore,
        goldLevel: gold.levelAssigned,
        assembledMockId: assembled?.mockId ?? `${level}-assembled-a`,
        assembledScore,
        assembledLevel,
        goldOutperforms: scoreDelta >= 0,
        scoreDelta,
      };
    }
  );

  return {
    generatedAt: new Date().toISOString(),
    entries,
    allGoldOutperform: entries.every((e) => e.goldOutperforms),
  };
}

export function writeCertificationReport(
  result: MockCertificationResult,
  rootDir = CERTIFICATION_REPORTS_ROOT
): string {
  mkdirSync(join(rootDir, result.level), { recursive: true });
  const path = join(rootDir, result.level, `${result.mockId}-certification.json`);
  writeFileSync(path, JSON.stringify(result, null, 2), "utf8");
  return path;
}

export function writeGoldMockComparisonReport(
  report: GoldMockComparisonReport,
  rootDir = CERTIFICATION_REGISTRY_ROOT
): string {
  mkdirSync(rootDir, { recursive: true });
  const path = join(rootDir, "gold-mock-certification-report.json");
  writeFileSync(path, JSON.stringify(report, null, 2), "utf8");
  return path;
}

export function loadRuntimeFromFile(path: string): YleMockManifest | null {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as YleMockManifest;
}

export function certifyAndRegister(
  input: MockCertificationInput,
  options: { writeReport?: boolean; persistRegistry?: boolean } = {}
): MockCertificationResult {
  const result = certifyMockExam(input);
  registerCertification(result, { persist: options.persistRegistry });
  if (options.writeReport !== false) writeCertificationReport(result);
  return result;
}

export function runBatchCertification(
  level?: CambridgeExamLevel,
  options: { writeReports?: boolean; persistRegistry?: boolean } = {}
): MockCertificationResult[] {
  const levels: CambridgeExamLevel[] = level
    ? [level]
    : ["starters", "movers", "flyers", "ket", "pet"];

  const results: MockCertificationResult[] = [];

  for (const lv of levels) {
    const gold = certifyGoldMock(getGoldMock(lv));
    registerCertification(gold, { persist: options.persistRegistry });
    if (options.writeReports !== false) writeCertificationReport(gold);
    results.push(gold);

    for (const version of ["A", "B", "C"] as const) {
      const assembled = certifyAssembledMockForLevel(lv, version);
      if (assembled) {
        registerCertification(assembled, { persist: options.persistRegistry });
        if (options.writeReports !== false) writeCertificationReport(assembled);
        results.push(assembled);
      }
    }
  }

  const comparison = buildGoldMockComparisonReport();
  writeGoldMockComparisonReport(comparison);

  return results;
}
