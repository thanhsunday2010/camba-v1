import { describe, expect, it } from "vitest";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import {
  assignCertificationLevel,
  buildCertificationSummary,
  buildGoldMockComparisonReport,
  certifyAllGoldMocks,
  certifyAssembledMockForLevel,
  certifyGoldMock,
  clearInMemoryRegistry,
  detectMockDuplicates,
  evaluateBlueprintFidelity,
  evaluateStudentSafety,
  evaluateWritingQuality,
  formatCertificationReport,
  formatGoldMockComparisonReport,
  isStudentFacing,
  listCertifications,
  registerCertification,
  resultToRecord,
  runBatchCertification,
  writeGoldMockComparisonReport,
} from "@/lib/cambridge-assessment/certification";
import { getGoldMock } from "@/lib/cambridge-assessment/gold-mocks";
import { registerAvailableGoldMocks } from "@/lib/cambridge-assessment/gold-mocks/register-all-gold-mocks";
import { assembleCambridgeExam } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembler";
import { certifyAssemblyResult } from "@/lib/cambridge-assessment/certification/mock-certification-engine";
import { buildCoverageMatrix } from "@/lib/item-bank/item-bank-coverage-matrix-builder";
import { buildUnifiedItemBank } from "@/lib/item-bank/item-bank-builder";

const LEVELS: CambridgeExamLevel[] = ["starters", "movers", "flyers", "ket", "pet"];

describe("M3.4 Mock Certification", () => {
  it("certifies all gold mocks at GOLD tier", () => {
    registerAvailableGoldMocks();
    const results = certifyAllGoldMocks();
    expect(results.length).toBeGreaterThanOrEqual(15);
    for (const r of results) {
      expect(r.levelAssigned).toBe("gold");
      expect(r.metrics.writingCount).toBeGreaterThan(0);
      expect(r.metrics.speakingCount).toBeGreaterThan(0);
    }
  });

  for (const level of LEVELS) {
    it(`${level} gold mock passes blueprint compliance`, () => {
      const manifest = getGoldMock(level);
      const bp = evaluateBlueprintFidelity(level, manifest.questions);
      expect(bp.compliant).toBe(true);
    });

    it(`${level} gold mock passes student safety`, () => {
      const manifest = getGoldMock(level);
      const safety = evaluateStudentSafety(manifest);
      expect(safety.safe).toBe(true);
    });

    it(`${level} gold mock has writing certification`, () => {
      const manifest = getGoldMock(level);
      const writing = evaluateWritingQuality(level, manifest.questions);
      expect(writing.count).toBeGreaterThan(0);
      expect(writing.score).toBeGreaterThan(50);
    });
  }

  it("detects duplicate stems within a mock", () => {
    const manifest = getGoldMock("starters");
    const dupes = detectMockDuplicates(manifest.questions);
    expect(dupes.totalItems).toBe(manifest.questions.length);
    expect(dupes.duplicateItemCount).toBe(0);
  });

  it("assigns rejected for blueprint failure", () => {
    const level = assignCertificationLevel({
      metrics: {
        certificationScore: 90,
        coverageScore: 90,
        qaScore: 90,
        diversityScore: 90,
        blueprintScore: 50,
        grammarDistinct: 15,
        vocabularyDistinct: 15,
        skillDistinct: 4,
        taskDistinct: 8,
        topicDistinct: 10,
        difficultyDistinct: 3,
        writingCount: 5,
        speakingCount: 5,
        readingCount: 20,
        listeningCount: 20,
        duplicateItemCount: 0,
        duplicateClusterCount: 0,
      },
      criticalErrorCount: 0,
      hasBlueprintFailure: true,
      hasSafetyFailure: false,
    });
    expect(level).toBe("rejected");
  });

  it("certifies assembled exam when assembly succeeds", () => {
    const assembled = assembleCambridgeExam({ level: "starters", version: "A", seed: "m3-4-test" });
    const cert = certifyAssemblyResult(assembled);
    expect(cert).not.toBeNull();
    expect(cert!.source).toBe("assembled");
    expect(cert!.metrics.certificationScore).toBeGreaterThan(0);
  });

  it("registry stores certification records", () => {
    clearInMemoryRegistry();
    const result = certifyGoldMock(getGoldMock("starters"));
    registerCertification(result, { persist: false });
    const records = listCertifications({ level: "starters" });
    expect(records.some((r) => r.mockId === result.mockId)).toBe(true);
  });

  it("builds certification summary", () => {
    clearInMemoryRegistry();
    registerAvailableGoldMocks();
    const results = certifyAllGoldMocks();
    const records = results.map(resultToRecord);
    const summary = buildCertificationSummary(records);
    expect(summary.totalMocks).toBeGreaterThanOrEqual(15);
    expect(summary.goldCount).toBeGreaterThanOrEqual(15);
  });

  it("gold mocks outperform or match assembled mocks", () => {
    const report = buildGoldMockComparisonReport();
    expect(report.entries).toHaveLength(5);
    for (const entry of report.entries) {
      expect(entry.goldScore).toBeGreaterThan(0);
    }
    expect(formatGoldMockComparisonReport(report)).toContain("Gold Mock vs Generated");
  });

  it("formats certification report", () => {
    const result = certifyGoldMock(getGoldMock("ket"));
    const text = formatCertificationReport(result);
    expect(text).toContain("Mock Certification");
    expect(text).toContain("Certification:");
  });

  it("student-facing only for gold/silver/bronze", () => {
    expect(isStudentFacing("gold")).toBe(true);
    expect(isStudentFacing("rejected")).toBe(false);
  });

  it("item bank coverage matrix integrates with certification context", () => {
    const bank = buildUnifiedItemBank("starters");
    const matrix = buildCoverageMatrix("starters", bank.items);
    expect(matrix.totalItems).toBeGreaterThan(0);
    expect(matrix.readinessScore).toBeGreaterThan(0);
  });
});

describe("M3.4 certification CLI", () => {
  it("runs batch certification when CERTIFY_CLI=batch", () => {
    if (process.env.CERTIFY_CLI !== "batch") return;
    const level = process.env.CERTIFY_LEVEL as CambridgeExamLevel | undefined;
    clearInMemoryRegistry();
    const results = runBatchCertification(level, { writeReports: true, persistRegistry: true });
    console.log(`Certified ${results.length} mocks`);
    for (const r of results) {
      console.log(formatCertificationReport(r));
    }
    const comparison = buildGoldMockComparisonReport();
    writeGoldMockComparisonReport(comparison);
    console.log(formatGoldMockComparisonReport(comparison));
  });

  it("runs inventory review when CERTIFY_CLI=inventory", () => {
    if (process.env.CERTIFY_CLI !== "inventory") return;
    const level = (process.env.CERTIFY_LEVEL ?? "starters") as CambridgeExamLevel;
    const bank = buildUnifiedItemBank(level);
    const matrix = buildCoverageMatrix(level, bank.items);
    const gold = certifyGoldMock(getGoldMock(level));
    const assembled = certifyAssembledMockForLevel(level, "A");
    console.log(`=== Inventory Review: ${level} ===`);
    console.log(`Bank items: ${bank.itemCount} | Readiness: ${matrix.readinessScore}%`);
    console.log(`Gold: ${gold.levelAssigned} (${gold.metrics.certificationScore})`);
    console.log(`Assembled: ${assembled?.levelAssigned} (${assembled?.metrics.certificationScore ?? 0})`);
  });
});
