import { describe, expect, it } from "vitest";
import { ITEM_BANK_TEST_MANIFEST } from "@/lib/item-bank/fixtures/item-bank-test-manifest";
import { extractItemBankFromManifest } from "@/lib/item-bank/item-bank-extract";
import {
  validateItemBankFile,
  validateItemBankQuestion,
} from "@/lib/item-bank/item-bank-validation";

describe("item bank validation", () => {
  it("passes for extracted fixture items", () => {
    const bank = extractItemBankFromManifest(ITEM_BANK_TEST_MANIFEST);
    const result = validateItemBankFile(bank.items);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("fails when required metadata is missing", () => {
    const bank = extractItemBankFromManifest(ITEM_BANK_TEST_MANIFEST);
    const bad = { ...bank.items[0]!, grammarTags: [] };
    const result = validateItemBankQuestion(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "ITEM_GRAMMAR_TAGS_MISSING")).toBe(true);
  });

  it("fails on unknown grammar tag", () => {
    const bank = extractItemBankFromManifest(ITEM_BANK_TEST_MANIFEST);
    const bad = { ...bank.items[0]!, grammarTags: ["not_a_real_tag"] };
    const result = validateItemBankQuestion(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "ITEM_UNKNOWN_GRAMMAR_TAG")).toBe(true);
  });
});
