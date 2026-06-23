import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import {
  getItemsByLevel,
  listAvailableItemBankLevels,
  loadItemBank,
} from "@/lib/item-bank/item-bank-registry";
import { ITEM_BANK_SAMPLE_ITEMS } from "@/lib/item-bank/fixtures/item-bank-sample-items";

const BANK_ROOT = resolve(process.cwd(), "data/item-bank");

describe("item bank registry", () => {
  it("loads empty starters bank from filesystem after wipe", () => {
    const items = getItemsByLevel("starters", { rootDir: BANK_ROOT });
    expect(items.length).toBe(0);
  });

  it("filters sample items by skill, grammar, and vocabulary", () => {
    const listening = ITEM_BANK_SAMPLE_ITEMS.filter((i) => i.skill === "listening");
    expect(listening.length).toBe(2);

    const verbBe = ITEM_BANK_SAMPLE_ITEMS.filter((i) => i.grammarTags.includes("verb_be"));
    expect(verbBe.length).toBe(1);

    const family = ITEM_BANK_SAMPLE_ITEMS.filter((i) =>
      i.vocabularyTopics.includes("family")
    );
    expect(family.length).toBe(2);
  });

  it("lists available levels", () => {
    const levels = listAvailableItemBankLevels({ rootDir: BANK_ROOT });
    expect(levels).toContain("starters");
    expect(levels).toContain("movers");
    expect(levels).toContain("flyers");
  });

  it("loadItemBank returns empty when all banks are empty", () => {
    const all = loadItemBank({ rootDir: BANK_ROOT });
    expect(all.length).toBe(0);
  });
});
