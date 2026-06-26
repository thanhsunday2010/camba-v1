import { describe, expect, it } from "vitest";
import {
  AI_WRITING_MAX_WORDS,
  clampWritingToWordLimit,
  countWords,
} from "@/lib/ai/ai-input-limits";

describe("clampWritingToWordLimit", () => {
  it("preserves trailing spaces while composing the next word", () => {
    expect(clampWritingToWordLimit("Hello ")).toBe("Hello ");
    expect(clampWritingToWordLimit("Hello world ")).toBe("Hello world ");
  });

  it("preserves multiple spaces between words", () => {
    expect(clampWritingToWordLimit("Hello  world")).toBe("Hello  world");
  });

  it("truncates when word count exceeds the limit", () => {
    const words = Array.from({ length: AI_WRITING_MAX_WORDS + 3 }, (_, i) => `w${i + 1}`);
    const input = `${words.join(" ")} extra`;
    const clamped = clampWritingToWordLimit(input);

    expect(countWords(clamped)).toBe(AI_WRITING_MAX_WORDS);
    expect(clamped).toBe(words.slice(0, AI_WRITING_MAX_WORDS).join(" "));
  });
});
