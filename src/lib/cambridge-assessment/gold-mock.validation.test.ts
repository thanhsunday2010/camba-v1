import { beforeAll, describe, expect, it } from "vitest";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import { isGoldMockManifest } from "@/lib/cambridge-assessment/gold-mock-format";
import { GOLD_MOCK_LEVELS, getGoldMockSpecification } from "@/lib/cambridge-assessment/gold-mock-specifications";
import { validateGoldMock } from "@/lib/cambridge-assessment/gold-mock-validation";
import { getGoldMock, GOLD_MOCK_REGISTRY } from "@/lib/cambridge-assessment/gold-mocks";
import {
  detectCrossMockStemDuplicates,
  EXPECTED_GOLD_MOCK_COUNT,
  getAllGoldMockManifests,
  getGoldMockInventoryStatus,
} from "@/lib/cambridge-assessment/gold-mock-registry";
import { registerAvailableGoldMocks } from "@/lib/cambridge-assessment/gold-mocks/register-all-gold-mocks";
import { certifyGoldMock } from "@/lib/cambridge-assessment/certification/mock-certification-engine";
import {
  runGoldMockAnalyzeCli,
  writeAllGoldMockJson,
} from "@/lib/cambridge-assessment/gold-mocks/gold-mock-cli";
import { writeGoldMockCoverageReport } from "@/lib/cambridge-assessment/gold-mock-coverage-report";
import { validateRuntimeManifestCompatibility } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-validation";
import { extractItemBankFromManifest } from "@/lib/item-bank/item-bank-extract";
import { isWritingQuestion } from "@/lib/writing/writing-utils";
import { isSpeakingQuestion } from "@/lib/speaking/speaking-utils";

const LEVELS: CambridgeExamLevel[] = [...GOLD_MOCK_LEVELS];

describe("M3.1 Gold Mock validation", () => {
  for (const level of LEVELS) {
    describe(`${level} gold mock`, () => {
      const mock = getGoldMock(level);

      it("is a canonical gold manifest", () => {
        expect(isGoldMockManifest(mock)).toBe(true);
        expect(mock.gold.authoringMethod).toBe("manual");
        expect(mock.gold.academicAuthority).toBe(true);
      });

      it("passes gold mock validation", () => {
        const report = validateGoldMock(mock);
        expect(report.valid).toBe(true);
        expect(report.blueprintCompliant).toBe(true);
        expect(report.writingCount).toBeGreaterThan(0);
        expect(report.speakingCount).toBeGreaterThan(0);
      });

      it("matches blueprint question totals", () => {
        const blueprint = getCambridgeExamBlueprint(level);
        const expected = blueprint.papers.reduce(
          (sum, p) => sum + p.parts.reduce((s, part) => s + part.questionCount, 0),
          0
        );
        expect(mock.questions.length).toBe(expected);
      });

      it("is runtime compatible", () => {
        const runtime = validateRuntimeManifestCompatibility(mock);
        expect(runtime.valid).toBe(true);
      });

      it("includes M2.2 writing tasks", () => {
        const writing = mock.questions.filter((q) => q.cambaQuestionType === "writing");
        expect(writing.length).toBeGreaterThan(0);
        for (const q of writing) {
          expect(
            isWritingQuestion({
              question_type: "writing",
              question_text: q.questionText,
              content: q.content ?? {},
              media_url: null,
            })
          ).toBe(true);
        }
      });

      it("includes M2.3 speaking tasks", () => {
        const speaking = mock.questions.filter((q) => q.cambaQuestionType === "speaking");
        expect(speaking.length).toBeGreaterThan(0);
        for (const q of speaking) {
          expect(
            isSpeakingQuestion({
              question_type: "speaking",
              question_text: q.questionText,
              content: q.content ?? {},
              media_url: null,
            })
          ).toBe(true);
        }
      });

      it("meets coverage targets", () => {
        const spec = getGoldMockSpecification(level);
        const report = validateGoldMock(mock);
        expect(Object.keys(report.grammarCoverage).length).toBeGreaterThanOrEqual(
          spec.coverageTargets.minDistinctGrammarTags
        );
        expect(Object.keys(report.vocabularyCoverage).length).toBeGreaterThanOrEqual(
          spec.coverageTargets.minDistinctVocabularyTopics
        );
      });
    });
  }

  it("extracts item bank from gold mock without expansion", () => {
    const mock = getGoldMock("starters");
    const bank = extractItemBankFromManifest(mock);
    expect(bank.itemCount).toBe(mock.questions.length);
    expect(bank.sourceManifests).toContain(mock.metadata.manifestId);
  });

  it("registry contains all five levels", () => {
    expect(Object.keys(GOLD_MOCK_REGISTRY)).toHaveLength(5);
    registerAvailableGoldMocks();
    expect(getAllGoldMockManifests().length).toBeGreaterThanOrEqual(5);
  });
});

describe("M4.1 Gold Mock Program", () => {
  beforeAll(() => {
    registerAvailableGoldMocks();
  });

  it("tracks inventory toward 15 mocks", () => {
    const status = getGoldMockInventoryStatus();
    expect(status.expected).toBe(EXPECTED_GOLD_MOCK_COUNT);
    expect(status.registered).toBe(15);
    expect(status.complete).toBe(true);
  });

  it("validates all registered gold mocks", () => {
    for (const mock of getAllGoldMockManifests()) {
      const report = validateGoldMock(mock);
      expect(report.valid).toBe(true);
      expect(report.blueprintCompliant).toBe(true);
    }
  });

  it("certifies registered gold mocks at GOLD tier only", () => {
    for (const mock of getAllGoldMockManifests()) {
      const cert = certifyGoldMock(mock);
      expect(cert.levelAssigned).toBe("gold");
      expect(cert.certified).toBe(true);
    }
  });

  for (const level of LEVELS) {
    it(`${level} has no cross-mock duplicate stems`, () => {
      const dupes = detectCrossMockStemDuplicates(level);
      expect(dupes).toHaveLength(0);
    });
  }

  it("keeps writing/speaking payload fields inside content only", () => {
    const duplicateKeys = [
      "cambridgeTaskType",
      "prompt",
      "imageUrl",
      "pictureSequence",
      "passage",
      "template",
    ];
    for (const mock of getAllGoldMockManifests()) {
      for (const q of mock.questions) {
        if (!q.content) continue;
        for (const key of duplicateKeys) {
          if (key in q.content) {
            expect(q).not.toHaveProperty(key);
          }
        }
      }
    }
  });

  it("uses normalized SVG paths for gold mock images", () => {
    for (const mock of getAllGoldMockManifests()) {
      for (const q of mock.questions) {
        const content = q.content ?? {};
        if (typeof content.imageUrl === "string") {
          expect(content.imageUrl.startsWith("/images/gold-mocks/")).toBe(true);
          expect(content.imageUrl.endsWith(".svg")).toBe(true);
        }
        if (Array.isArray(content.pictureSequence)) {
          for (const url of content.pictureSequence) {
            expect(typeof url).toBe("string");
            expect(url.endsWith(".svg")).toBe(true);
          }
        }
      }
    }
  });

  it("writes all gold mock JSON when GOLD_WRITE=1", () => {
    if (process.env.GOLD_WRITE !== "1") return;
    writeAllGoldMockJson();
  });
});

describe("M3.1 Gold Mock CLI", () => {
  it("writes JSON when GOLD_WRITE=1", () => {
    if (process.env.GOLD_WRITE !== "1") return;
    writeAllGoldMockJson();
  });

  it("runs analyze CLI when GOLD_CLI=analyze", () => {
    if (process.env.GOLD_CLI !== "analyze") return;
    const level = process.env.GOLD_LEVEL as CambridgeExamLevel | undefined;
    runGoldMockAnalyzeCli(level);
  });

  it("writes coverage report when COVERAGE_CLI=report", () => {
    if (process.env.COVERAGE_CLI !== "report") return;
    const path = writeGoldMockCoverageReport();
    console.log(`Coverage report written to ${path}`);
  });
});
