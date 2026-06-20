import { describe, expect, it } from "vitest";
import { normalizeQuestionType, isMcStyleQuestionType } from "@/lib/learning/question-types";

describe("question-types alignment", () => {
  it("maps legacy reading to reading_comprehension", () => {
    expect(normalizeQuestionType("reading")).toBe("reading_comprehension");
  });

  it("passes through aligned types unchanged", () => {
    expect(normalizeQuestionType("multiple_choice")).toBe("multiple_choice");
    expect(normalizeQuestionType("gap_fill")).toBe("gap_fill");
  });

  it("treats normalized reading as MC-style", () => {
    expect(isMcStyleQuestionType("reading")).toBe(true);
    expect(isMcStyleQuestionType("reading_comprehension")).toBe(true);
  });
});
