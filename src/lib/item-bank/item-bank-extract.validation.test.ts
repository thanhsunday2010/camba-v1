import { describe, expect, it } from "vitest";
import startersManifest from "../../../data/mock-tests/starters/starters-practice-test-1.json";
import { extractItemBankFromManifest } from "@/lib/item-bank/item-bank-extract";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";

describe("item bank extraction", () => {
  it("extracts 20 items from Starters Practice Test 1", () => {
    const bank = extractItemBankFromManifest(startersManifest as YleMockManifest);

    expect(bank.itemCount).toBe(20);
    expect(bank.items).toHaveLength(20);
    expect(bank.level).toBe("starters");
    expect(bank.sourceManifests).toContain("starters-practice-test-1");
  });

  it("preserves grammar tags, vocabulary topics, and content", () => {
    const bank = extractItemBankFromManifest(startersManifest as YleMockManifest);
    const listen05 = bank.items.find((i) => i.id === "starters-listen-05");

    expect(listen05?.grammarTags).toEqual(["verb_be"]);
    expect(listen05?.vocabularyTopics).toEqual(["family"]);
    expect(listen05?.content.template).toBe("My name [0] Tom.");
    expect(listen05?.authoringMetadata.sourceQuestionRef).toBe("listen-05");
  });
});
