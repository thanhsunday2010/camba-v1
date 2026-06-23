import { describe, expect, it } from "vitest";
import {
  YLE_GRAMMAR_TAGS,
  isKnownGrammarTag,
  validateGrammarTags,
  grammarTagLabel,
} from "@/lib/learning/grammar-taxonomy";

describe("grammar taxonomy", () => {
  it("recognises canonical YLE grammar slugs", () => {
    expect(isKnownGrammarTag("present_simple")).toBe(true);
    expect(isKnownGrammarTag("modal_can")).toBe(true);
    expect(isKnownGrammarTag("not_a_grammar")).toBe(false);
  });

  it("validates known and unknown grammar tags", () => {
    const result = validateGrammarTags(["present_simple", "fake_tense", "modal_can"]);
    expect(result.valid).toEqual(["present_simple", "modal_can"]);
    expect(result.unknown).toEqual(["fake_tense"]);
  });

  it("provides display labels for known tags", () => {
    expect(grammarTagLabel("present_simple")).toBe("Present simple");
    expect(YLE_GRAMMAR_TAGS.length).toBeGreaterThanOrEqual(20);
  });
});
