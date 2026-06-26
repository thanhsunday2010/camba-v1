import { describe, expect, it } from "vitest";
import { resolveQuestionChoices } from "@/lib/learning/question-choices";
import type { Choice } from "@/types/learning";

const tableChoice = (
  questionId: string,
  text: string,
  sortOrder: number
): Choice => ({
  id: `choice-${sortOrder}`,
  question_id: questionId,
  text,
  is_correct: sortOrder === 0,
  sort_order: sortOrder,
  media_url: null,
});

describe("resolveQuestionChoices", () => {
  it("prefers table choices when complete", () => {
    const questionId = "q1";
    const choices = resolveQuestionChoices(
      questionId,
      [
        tableChoice(questionId, "A", 0),
        tableChoice(questionId, "B", 1),
        tableChoice(questionId, "C", 2),
      ],
      {
        choices: [{ text: "Fallback" }],
      }
    );

    expect(choices).toHaveLength(3);
    expect(choices.map((choice) => choice.text)).toEqual(["A", "B", "C"]);
  });

  it("falls back to content choices when table is incomplete", () => {
    const questionId = "q2";
    const choices = resolveQuestionChoices(
      questionId,
      [tableChoice(questionId, "Only table", 0)],
      {
        choices: [
          { text: "Only table", sortOrder: 0 },
          { text: "From content", sortOrder: 1 },
          { text: "Also content", sortOrder: 2 },
        ],
      }
    );

    expect(choices).toHaveLength(3);
    expect(choices.map((choice) => choice.text)).toEqual([
      "Only table",
      "From content",
      "Also content",
    ]);
  });

  it("uses content choices when table is empty", () => {
    const questionId = "q3";
    const choices = resolveQuestionChoices(questionId, [], {
      choices: [
        { text: "One", sortOrder: 0 },
        { text: "Two", sortOrder: 1 },
      ],
    });

    expect(choices).toHaveLength(2);
    expect(choices[0].id).toBe("content:q3:0");
  });
});
