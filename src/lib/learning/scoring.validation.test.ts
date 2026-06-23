import { describe, expect, it } from "vitest";
import type { Question } from "@/types/learning";
import { scoreExercise, scoreQuestion } from "@/lib/learning/scoring";

function baseQuestion(overrides: Partial<Question> & Pick<Question, "id" | "question_type">): Question {
  return {
    exercise_id: "ex-1",
    question_text: "Question",
    media_url: null,
    media_type: null,
    points: 2,
    sort_order: 0,
    explanation: null,
    content: {},
    choices: [],
    pairs: [],
    ...overrides,
  };
}

function mcqQuestion(id: string, correctId: string): Question {
  return baseQuestion({
    id,
    question_type: "multiple_choice",
    choices: [
      { id: correctId, question_id: id, text: "yes", is_correct: true, sort_order: 0, media_url: null },
      { id: "wrong", question_id: id, text: "no", is_correct: false, sort_order: 1, media_url: null },
    ],
  });
}

function matchingQuestion(id: string): Question {
  return baseQuestion({
    id,
    question_type: "matching",
    points: 3,
    pairs: [
      { id: "p1", question_id: id, left_text: "A", right_text: "1", sort_order: 0 },
      { id: "p2", question_id: id, left_text: "B", right_text: "2", sort_order: 1 },
    ],
  });
}

function gapFillQuestion(id: string): Question {
  return baseQuestion({
    id,
    question_type: "gap_fill",
    content: { template: "I [0] happy.", correctAnswers: ["am"] },
  });
}

describe("mock scoring edge cases", () => {
  it("scores unanswered matching without throwing", () => {
    const result = scoreQuestion(matchingQuestion("m1"), { type: "matching", pairs: [] });
    expect(result.pointsEarned).toBe(0);
    expect(result.maxPoints).toBe(3);
    expect(result.isCorrect).toBe(false);
  });

  it("scores partially answered matching with partial credit", () => {
    const result = scoreQuestion(matchingQuestion("m2"), {
      type: "matching",
      pairs: [{ leftId: "p1", rightText: "1" }],
    });
    expect(result.pointsEarned).toBeGreaterThan(0);
    expect(result.pointsEarned).toBeLessThan(3);
    expect(result.isCorrect).toBe(false);
  });

  it("scores unanswered gap_fill with zero points", () => {
    const result = scoreQuestion(gapFillQuestion("g1"), { type: "gap_fill", answers: [] });
    expect(result.pointsEarned).toBe(0);
    expect(result.isCorrect).toBe(false);
  });

  it("aggregates empty submission across a mixed test", () => {
    const questions = [mcqQuestion("q1", "c1"), matchingQuestion("q2"), gapFillQuestion("q3")];
    const result = scoreExercise(questions, {});
    expect(result.score).toBe(0);
    expect(result.maxScore).toBe(7);
    expect(result.questionResults).toHaveLength(3);
    expect(result.accuracyPercent).toBe(0);
  });

  it("scores unanswered multiple choice as incorrect", () => {
    const result = scoreQuestion(mcqQuestion("q4", "c1"), { type: "single", choiceId: "" });
    expect(result.isCorrect).toBe(false);
    expect(result.pointsEarned).toBe(0);
  });
});
