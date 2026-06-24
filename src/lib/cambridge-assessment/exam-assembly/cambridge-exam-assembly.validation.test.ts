import { describe, expect, it } from "vitest";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import {
  assembleAllVersions,
  assembleCambridgeExam,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembler";
import { CAMBRIDGE_EXAM_VERSIONS } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
import {
  validateAssemblyResult,
  validateCambridgeExamManifest,
  validateRuntimeManifestCompatibility,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-validation";
import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import { createSeededRng, deriveAssemblySeed } from "@/lib/cambridge-assessment/exam-assembly/cambridge-seeded-random";
import { buildReferenceBankForLevel } from "@/lib/cambridge-assessment/exam-assembly/fixtures/assembly-reference-bank";
import { isWritingQuestion } from "@/lib/writing/writing-utils";
import { isSpeakingQuestion } from "@/lib/speaking/speaking-utils";

import {
  runAnalyzeCli,
  runGenerateCli,
  runValidateCli,
  writeAllGoldenExams,
} from "@/lib/cambridge-assessment/exam-assembly/cli/assembly-cli-utils";

const LEVELS: CambridgeExamLevel[] = ["starters", "movers", "flyers", "ket", "pet"];

describe("M2.4 Cambridge exam assembly", () => {
  for (const level of LEVELS) {
    describe(`${level} assembly`, () => {
      it("assembles a valid full-form exam with writing and speaking", () => {
        const result = assembleCambridgeExam({ level, version: "A", strict: true });
        expect(result.success).toBe(true);
        if (!result.success) return;

        const validation = validateAssemblyResult(result);
        expect(validation.valid).toBe(true);
        expect(result.report.writingIncluded).toBe(true);
        expect(result.report.speakingIncluded).toBe(true);
        expect(result.report.blueprintCompliance).toBe(true);

        const manifestCheck = validateCambridgeExamManifest(result.manifest);
        expect(manifestCheck.valid).toBe(true);

        const runtimeCheck = validateRuntimeManifestCompatibility(result.runtimeManifest);
        expect(runtimeCheck.valid).toBe(true);
      });

      it("matches blueprint item counts", () => {
        const blueprint = getCambridgeExamBlueprint(level);
        const result = assembleCambridgeExam({ level, version: "A" });
        expect(result.success).toBe(true);
        if (!result.success) return;

        const expectedTotal = blueprint.papers.reduce(
          (sum, paper) =>
            sum + paper.parts.reduce((pSum, part) => pSum + part.questionCount, 0),
          0
        );
        expect(result.selections.length).toBe(expectedTotal);
        expect(result.manifest.itemReferences.length).toBe(expectedTotal);
      });
    });
  }

  it("generates deterministic exams for the same seed", () => {
    const a = assembleCambridgeExam({ level: "starters", version: "A", seed: "test-seed" });
    const b = assembleCambridgeExam({ level: "starters", version: "A", seed: "test-seed" });
    expect(a.success).toBe(true);
    expect(b.success).toBe(true);
    if (!a.success || !b.success) return;

    expect(a.manifest.itemReferences.map((r) => r.itemId)).toEqual(
      b.manifest.itemReferences.map((r) => r.itemId)
    );
  });

  it("generates different item sets for versions A/B/C with same seed", () => {
    const versions = assembleAllVersions("movers", { seed: "version-test" });
    expect(versions.every((v) => v.success)).toBe(true);

    const ids = versions.map((v) =>
      v.success ? v.manifest.itemReferences.map((r) => r.itemId).join(",") : ""
    );
    expect(new Set(ids).size).toBe(3);
  });

  it("versions share blueprint and coverage profile", () => {
    const versions = assembleAllVersions("flyers", { seed: "coverage-test" });
    for (const result of versions) {
      expect(result.success).toBe(true);
      if (!result.success) continue;
      expect(result.report.blueprintCompliance).toBe(true);
      expect(result.report.coverageAchieved.distinctGrammarPatterns.length).toBeGreaterThanOrEqual(8);
    }
  });

  it("includes M2.2-compatible writing content in runtime manifest", () => {
    const result = assembleCambridgeExam({ level: "ket", version: "A" });
    expect(result.success).toBe(true);
    if (!result.success) return;

    const writingQs = result.runtimeManifest.questions.filter(
      (q) => q.cambaQuestionType === "writing"
    );
    expect(writingQs.length).toBeGreaterThan(0);
    for (const q of writingQs) {
      expect(
        isWritingQuestion({
          question_type: "writing",
          question_text: q.questionText,
          content: q.content ?? {},
          media_url: null,
        })
      ).toBe(true);
      expect(q.content?.cambridgeTaskType).toBeTruthy();
      expect(q.content?.prompt).toBeTruthy();
    }
  });

  it("includes M2.3-compatible speaking content in runtime manifest", () => {
    const result = assembleCambridgeExam({ level: "pet", version: "A" });
    expect(result.success).toBe(true);
    if (!result.success) return;

    const speakingQs = result.runtimeManifest.questions.filter(
      (q) => q.cambaQuestionType === "speaking"
    );
    expect(speakingQs.length).toBeGreaterThan(0);
    for (const q of speakingQs) {
      expect(
        isSpeakingQuestion({
          question_type: "speaking",
          question_text: q.questionText,
          content: q.content ?? {},
          media_url: null,
        })
      ).toBe(true);
      expect(q.content?.cambridgeTaskType).toBeTruthy();
      expect(q.content?.maxDurationSeconds).toBeTruthy();
    }
  });

  it("fails when item bank is insufficient", () => {
    const bank = buildReferenceBankForLevel("starters").slice(0, 5);
    const result = assembleCambridgeExam({
      level: "starters",
      version: "A",
      itemBank: bank,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("seeded RNG is reproducible", () => {
    const seed = deriveAssemblySeed("base", "starters", "B");
    const a = createSeededRng(seed);
    const b = createSeededRng(seed);
    const seqA = Array.from({ length: 5 }, () => a.next());
    const seqB = Array.from({ length: 5 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it("reference bank covers all blueprint parts", () => {
    for (const level of LEVELS) {
      const blueprint = getCambridgeExamBlueprint(level);
      const bank = buildReferenceBankForLevel(level);
      for (const paper of blueprint.papers) {
        for (const part of paper.parts) {
          const candidates = bank.filter(
            (item) =>
              item.partSlug === part.partSlug &&
              part.allowedTaskTypes.includes(item.taskType)
          );
          expect(candidates.length).toBeGreaterThanOrEqual(part.questionCount);
        }
      }
    }
  });
});

describe("M2.4 CLI hooks", () => {
  it("writes golden reference exams when CAMBRIDGE_WRITE_GOLDEN=1", () => {
    if (process.env.CAMBRIDGE_WRITE_GOLDEN !== "1") return;
    writeAllGoldenExams();
  });

  it("runs generate CLI when CAMBRIDGE_CLI=generate", () => {
    if (process.env.CAMBRIDGE_CLI !== "generate") return;
    const level = (process.env.CAMBRIDGE_LEVEL ?? "starters") as CambridgeExamLevel;
    const version = (process.env.CAMBRIDGE_VERSION ?? "A") as (typeof CAMBRIDGE_EXAM_VERSIONS)[number];
    runGenerateCli(level, version);
  });

  it("runs validate CLI when CAMBRIDGE_CLI=validate", () => {
    if (process.env.CAMBRIDGE_CLI !== "validate") return;
    const level = process.env.CAMBRIDGE_LEVEL as CambridgeExamLevel | undefined;
    runValidateCli(level);
  });

  it("runs analyze CLI when CAMBRIDGE_CLI=analyze", () => {
    if (process.env.CAMBRIDGE_CLI !== "analyze") return;
    const level = (process.env.CAMBRIDGE_LEVEL ?? "starters") as CambridgeExamLevel;
    const version = (process.env.CAMBRIDGE_VERSION ?? "A") as (typeof CAMBRIDGE_EXAM_VERSIONS)[number];
    runAnalyzeCli(level, version);
  });
});
