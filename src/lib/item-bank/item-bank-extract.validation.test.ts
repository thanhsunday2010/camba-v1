import { describe, expect, it } from "vitest";
import { ITEM_BANK_TEST_MANIFEST } from "@/lib/item-bank/fixtures/item-bank-test-manifest";
import { extractItemBankFromManifest } from "@/lib/item-bank/item-bank-extract";

describe("item bank extraction", () => {
  it("extracts items from fixture manifest", () => {
    const bank = extractItemBankFromManifest(ITEM_BANK_TEST_MANIFEST);

    expect(bank.itemCount).toBe(2);
    expect(bank.items).toHaveLength(2);
    expect(bank.level).toBe("starters");
    expect(bank.sourceManifests).toContain("starters-practice-test-fixture");
  });

  it("preserves grammar tags, vocabulary topics, and content", () => {
    const bank = extractItemBankFromManifest(ITEM_BANK_TEST_MANIFEST);
    const listen05 = bank.items.find((i) => i.id === "starters-listen-05");

    expect(listen05?.grammarTags).toEqual(["verb_be"]);
    expect(listen05?.vocabularyTopics).toEqual(["family"]);
    expect(listen05?.content.template).toBe("My name [0] Tom.");
    expect(listen05?.authoringMetadata.sourceQuestionRef).toBe("listen-05");
  });
});
