import { describe, expect, it } from "vitest";

import { getGoldMock } from "@/lib/cambridge-assessment/gold-mocks";
import { STARTERS_EXPANSION_ITEMS } from "@/lib/item-bank/expansion/starters-expansion-batch";
import { buildCoverageMatrix, formatCoverageMatrixReport } from "@/lib/item-bank/item-bank-coverage-matrix-builder";
import { detectItemBankDuplicates } from "@/lib/item-bank/item-bank-duplicate-detection";
import { extractItemBankFromGoldMock } from "@/lib/item-bank/item-bank-gold-extract";
import {
  buildUnifiedItemBank,
  writeAllUnifiedItemBanks,
} from "@/lib/item-bank/item-bank-builder";
import { ITEM_BANK_LEVELS, validateItemBankExtended, validateItemBankFile } from "@/lib/item-bank/item-bank-validation";
import { scoreItemBankQuality } from "@/lib/item-bank/item-quality-score";
import type { ItemLevel } from "@/lib/item-bank/item-bank-types";

const LEVELS: ItemLevel[] = [...ITEM_BANK_LEVELS];

describe("M3.2 item bank expansion", () => {
  for (const level of LEVELS) {
    it(`${level} unified bank validates`, () => {
      const bank = buildUnifiedItemBank(level);
      const result = validateItemBankFile(bank.items);
      expect(result.valid).toBe(true);
    });

    it(`${level} unified bank includes gold + expansion`, () => {
      const bank = buildUnifiedItemBank(level);
      const goldCount = extractItemBankFromGoldMock(getGoldMock(level)).itemCount;
      expect(bank.itemCount).toBeGreaterThanOrEqual(goldCount + 25);
    });

    it(`${level} has writing and speaking items`, () => {
      const bank = buildUnifiedItemBank(level);
      expect(bank.items.some((i) => i.questionType === "writing")).toBe(true);
      expect(bank.items.some((i) => i.questionType === "speaking")).toBe(true);
    });

    it(`${level} gold items retain source trace`, () => {
      const bank = buildUnifiedItemBank(level);
      const goldItems = bank.items.filter((i) => i.authoringMetadata.source?.goldMockTier === "gold");
      expect(goldItems.length).toBeGreaterThan(0);
      for (const item of goldItems) {
        expect(item.authoringMetadata.source?.sourceMock).toBeTruthy();
        expect(item.authoringMetadata.source?.sourcePart).toBeTruthy();
        expect(item.authoringMetadata.source?.sourceQuestion).toBeTruthy();
      }
    });
  }

  it("starters expansion batch has 30 items", () => {
    expect(STARTERS_EXPANSION_ITEMS).toHaveLength(30);
    expect(validateItemBankFile(STARTERS_EXPANSION_ITEMS).valid).toBe(true);
  });

  it("builds coverage matrix with gaps", () => {
    const bank = buildUnifiedItemBank("starters");
    const matrix = buildCoverageMatrix("starters", bank.items);
    expect(matrix.totalItems).toBeGreaterThan(0);
    expect(matrix.readinessScore).toBeGreaterThan(0);
    expect(formatCoverageMatrixReport(matrix)).toContain("Coverage Matrix");
  });

  it("detects duplicate stems", () => {
    const bank = buildUnifiedItemBank("starters");
    const dupes = detectItemBankDuplicates(bank.items);
    expect(dupes.duplicateStemCount).toBe(0);
  });

  it("scores item quality", () => {
    const bank = buildUnifiedItemBank("starters");
    const scores = scoreItemBankQuality(bank.items);
    expect(scores.length).toBe(bank.items.length);
    expect(scores.every((s) => s.totalScore > 0)).toBe(true);
  });

  it("extended validation runs without errors", () => {
    const bank = buildUnifiedItemBank("movers");
    const result = validateItemBankExtended(bank.items, { level: "movers" });
    expect(result.valid).toBe(true);
  });
});

describe("M3.2 item bank CLI", () => {
  it("writes unified item banks when ITEM_BANK_WRITE=1", () => {
    if (process.env.ITEM_BANK_WRITE !== "1") return;
    writeAllUnifiedItemBanks();
  });

  it("runs gap analysis CLI when ITEM_BANK_CLI=gaps", () => {
    if (process.env.ITEM_BANK_CLI !== "gaps") return;
    const level = (process.env.ITEM_BANK_LEVEL ?? "starters") as ItemLevel;
    const bank = buildUnifiedItemBank(level);
    const matrix = buildCoverageMatrix(level, bank.items);
    console.log(formatCoverageMatrixReport(matrix));
  });
});
