import { describe, expect, it } from "vitest";
import { parseVocabularyBank } from "@/lib/learning/vocabulary-bank";

describe("parseVocabularyBank", () => {
  it("normalizes vocabulary rows for the lesson popup", () => {
    const words = parseVocabularyBank([
      {
        word: "father",
        ipa: "/ˈfɑːðə(r)/",
        vietnameseMeaning: "bố, cha",
        exampleSentence: "This is my father.",
        exampleTranslation: "Đây là bố của tôi.",
      },
      { word: "", vietnameseMeaning: "skip" },
    ]);

    expect(words).toHaveLength(1);
    expect(words[0]).toMatchObject({
      word: "father",
      exampleTranslation: "Đây là bố của tôi.",
    });
  });

  it("accepts legacy example sentence translation keys", () => {
    const words = parseVocabularyBank([
      {
        word: "mother",
        vietnameseMeaning: "mẹ",
        exampleSentence: "My mother is kind.",
        exampleSentenceVi: "Mẹ tôi rất tốt bụng.",
      },
    ]);

    expect(words[0]?.exampleTranslation).toBe("Mẹ tôi rất tốt bụng.");
  });
});
