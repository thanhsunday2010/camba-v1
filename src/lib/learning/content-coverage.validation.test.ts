import { describe, expect, it } from "vitest";
import { analyzeContentCoverage, mergeContentCoverageReports } from "@/lib/learning/content-coverage";
import { ITEM_BANK_TEST_MANIFEST } from "@/lib/item-bank/fixtures/item-bank-test-manifest";

describe("content coverage analyzer", () => {
  it("reports tagged grammar and vocabulary from fixture manifest", () => {
    const report = analyzeContentCoverage(ITEM_BANK_TEST_MANIFEST);
    expect(report.totalQuestions).toBe(2);
    expect(report.taggedGrammarQuestions).toBe(2);
    expect(report.taggedVocabQuestions).toBe(2);
    expect(report.vocabularyCoverage.family).toBe(2);
  });

  it("merges coverage across multiple manifests", () => {
    const merged = mergeContentCoverageReports([
      ITEM_BANK_TEST_MANIFEST,
      ITEM_BANK_TEST_MANIFEST,
    ]);
    expect(merged.totalQuestions).toBe(4);
    expect(Object.keys(merged.vocabularyCoverage).length).toBeGreaterThan(0);
  });

  it("lists missing grammar tags not present in manifest", () => {
    const report = analyzeContentCoverage(ITEM_BANK_TEST_MANIFEST);
    expect(report.missingGrammarTags.length).toBeGreaterThan(0);
  });
});
