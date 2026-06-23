import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import {
  getItemsByGrammarTag,
  getItemsByLevel,
  getItemsBySkill,
  getItemsByVocabularyTopic,
  listAvailableItemBankLevels,
  loadItemBank,
} from "@/lib/item-bank/item-bank-registry";

const BANK_ROOT = resolve(process.cwd(), "data/item-bank");

describe("item bank registry", () => {
  it("loads starters item bank from filesystem", () => {
    const items = getItemsByLevel("starters", { rootDir: BANK_ROOT });
    expect(items.length).toBe(20);
  });

  it("filters by skill, grammar, and vocabulary", () => {
    const listening = getItemsBySkill("starters", "listening", { rootDir: BANK_ROOT });
    expect(listening.length).toBe(8);

    const verbBe = getItemsByGrammarTag("starters", "verb_be", { rootDir: BANK_ROOT });
    expect(verbBe.length).toBeGreaterThan(0);

    const family = getItemsByVocabularyTopic("starters", "family", {
      rootDir: BANK_ROOT,
    });
    expect(family.length).toBeGreaterThan(0);
  });

  it("lists available levels", () => {
    const levels = listAvailableItemBankLevels({ rootDir: BANK_ROOT });
    expect(levels).toContain("starters");
    expect(levels).toContain("movers");
    expect(levels).toContain("flyers");
  });

  it("loadItemBank aggregates non-empty banks only", () => {
    const all = loadItemBank({ rootDir: BANK_ROOT });
    expect(all.length).toBe(20);
  });
});
