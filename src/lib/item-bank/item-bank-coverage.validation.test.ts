import { describe, expect, it } from "vitest";
import {
  analyzeItemBankCoverage,
  formatItemBankCoverageLines,
} from "@/lib/item-bank/item-bank-coverage";
import { ITEM_BANK_SAMPLE_ITEMS } from "@/lib/item-bank/fixtures/item-bank-sample-items";

describe("item bank coverage", () => {
  it("analyzes sample items with grammar and vocabulary counts", () => {
    const report = analyzeItemBankCoverage("starters", ITEM_BANK_SAMPLE_ITEMS);

    expect(report.totalItems).toBe(2);
    expect(Object.keys(report.grammarCoverage).length).toBeGreaterThan(0);
    expect(Object.keys(report.vocabularyCoverage).length).toBeGreaterThan(0);
    expect(report.difficultyCoverage.easy).toBe(2);
  });

  it("formats readable coverage lines", () => {
    const report = analyzeItemBankCoverage("starters", ITEM_BANK_SAMPLE_ITEMS);
    const lines = formatItemBankCoverageLines(report);

    expect(lines.join("\n")).toContain("STARTERS ITEM BANK");
    expect(lines.join("\n")).toContain("Items: 2");
    expect(lines.join("\n")).toContain("Grammar");
    expect(lines.join("\n")).toContain("Vocabulary");
  });
});
