import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  analyzeItemBankCoverage,
  formatItemBankCoverageLines,
} from "@/lib/item-bank/item-bank-coverage";
import type { ItemBankFile } from "@/lib/item-bank/item-bank-types";

const BANK_PATH = resolve(process.cwd(), "data/item-bank/starters/items.json");

describe("item bank coverage", () => {
  it("analyzes starters bank with grammar and vocabulary counts", () => {
    const bank = JSON.parse(readFileSync(BANK_PATH, "utf8")) as ItemBankFile;
    const report = analyzeItemBankCoverage("starters", bank.items);

    expect(report.totalItems).toBe(20);
    expect(Object.keys(report.grammarCoverage).length).toBeGreaterThan(0);
    expect(Object.keys(report.vocabularyCoverage).length).toBeGreaterThan(0);
    expect(report.difficultyCoverage.easy).toBe(10);
    expect(report.difficultyCoverage.medium).toBe(9);
    expect(report.difficultyCoverage.hard).toBe(1);
  });

  it("formats readable coverage lines", () => {
    const bank = JSON.parse(readFileSync(BANK_PATH, "utf8")) as ItemBankFile;
    const report = analyzeItemBankCoverage("starters", bank.items);
    const lines = formatItemBankCoverageLines(report);

    expect(lines.join("\n")).toContain("STARTERS ITEM BANK");
    expect(lines.join("\n")).toContain("Items: 20");
    expect(lines.join("\n")).toContain("Grammar");
    expect(lines.join("\n")).toContain("Vocabulary");
  });
});
