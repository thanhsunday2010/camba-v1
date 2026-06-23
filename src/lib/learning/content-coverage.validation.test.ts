import { describe, expect, it } from "vitest";
import moversPracticeTest1 from "../../../data/mock-tests/movers/movers-practice-test-1.json";
import { analyzeContentCoverage, mergeContentCoverageReports } from "@/lib/learning/content-coverage";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";

describe("content coverage analyzer", () => {
  it("resolves vocabulary from legacy topicTag aliases in coverage report", () => {
    const report = analyzeContentCoverage(moversPracticeTest1 as YleMockManifest);
    expect(report.totalQuestions).toBe(26);
    expect(report.vocabularyCoverage.school).toBeGreaterThan(0);
    expect(report.taggedVocabQuestions).toBeGreaterThan(0);
  });

  it("merges coverage across multiple manifests", () => {
    const manifest = moversPracticeTest1 as YleMockManifest;
    const merged = mergeContentCoverageReports([manifest, manifest]);
    expect(merged.totalQuestions).toBe(manifest.questions.length * 2);
    expect(Object.keys(merged.vocabularyCoverage).length).toBeGreaterThan(0);
  });

  it("reports missing grammar when none explicitly tagged", () => {
    const report = analyzeContentCoverage(moversPracticeTest1 as YleMockManifest);
    expect(report.taggedGrammarQuestions).toBe(0);
    expect(report.missingGrammarTags.length).toBeGreaterThan(0);
  });
});
