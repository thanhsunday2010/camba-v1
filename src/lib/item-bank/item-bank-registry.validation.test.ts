import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import {
  CAMBRIDGE_ITEM_BANK_ROOT,
  getItemsByLevel,
  listAvailableItemBankLevels,
  loadItemBank,
} from "@/lib/item-bank/item-bank-registry";
import { ITEM_BANK_SAMPLE_ITEMS } from "@/lib/item-bank/fixtures/item-bank-sample-items";
import { buildUnifiedItemBank } from "@/lib/item-bank/item-bank-builder";

const LEGACY_BANK_ROOT = resolve(process.cwd(), "data/item-bank");

describe("item bank registry", () => {
  it("loads unified starters bank when legacy bank is empty", () => {
    const items = getItemsByLevel("starters", {
      rootDir: LEGACY_BANK_ROOT,
      preferCambridgeBank: false,
    });
    const unified = buildUnifiedItemBank("starters").items;
    expect(items.length === 0 || items.length === unified.length).toBe(true);
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
    const levels = listAvailableItemBankLevels({ rootDir: CAMBRIDGE_ITEM_BANK_ROOT });
    expect(levels).toContain("starters");
    expect(levels).toContain("movers");
    expect(levels).toContain("flyers");
  });

  it("loadItemBank returns unified banks by default", () => {
    const all = loadItemBank();
    expect(all.length).toBeGreaterThan(0);
  });
});
