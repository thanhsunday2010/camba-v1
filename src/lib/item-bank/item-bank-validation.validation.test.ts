import { describe, expect, it } from "vitest";
import startersManifest from "../../../data/mock-tests/starters/starters-practice-test-1.json";
import { extractItemBankFromManifest } from "@/lib/item-bank/item-bank-extract";
import {
  validateItemBankFile,
  validateItemBankQuestion,
} from "@/lib/item-bank/item-bank-validation";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";

describe("item bank validation", () => {
  it("passes for extracted Starters Test 1 items", () => {
    const bank = extractItemBankFromManifest(startersManifest as YleMockManifest);
    const result = validateItemBankFile(bank.items);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("fails when required metadata is missing", () => {
    const bank = extractItemBankFromManifest(startersManifest as YleMockManifest);
    const bad = { ...bank.items[0]!, grammarTags: [] };
    const result = validateItemBankQuestion(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "ITEM_GRAMMAR_TAGS_MISSING")).toBe(true);
  });

  it("fails on unknown grammar tag", () => {
    const bank = extractItemBankFromManifest(startersManifest as YleMockManifest);
    const bad = { ...bank.items[0]!, grammarTags: ["not_a_real_tag"] };
    const result = validateItemBankQuestion(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "ITEM_UNKNOWN_GRAMMAR_TAG")).toBe(true);
  });
});
