import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { scoreExercise, scoreQuestion } from "@/lib/learning/scoring";
import { isWritingQuestionType } from "@/lib/learning/question-types";
import type { PublicQuestion, Question, UserAnswer } from "@/types/learning";
import {
  countAnsweredQuestions,
  countWords,
  createWritingUserAnswer,
  isQuestionAnswered,
  isWritingQuestion,
  parseWritingQuestionContent,
  serializeWritingAnswersForAttempt,
  toWritingSubmission,
  userAnswerToWritingPayload,
} from "@/lib/writing/writing-utils";
import { validateWritingQuestionContent, validateWritingAnswer } from "@/lib/writing/writing-validation";

const EXAMPLES_DIR = resolve(process.cwd(), "data/cambridge-writing-examples");

function loadExample(name: string): PublicQuestion {
  const raw = JSON.parse(readFileSync(resolve(EXAMPLES_DIR, name), "utf8"));
  return {
    id: raw.id,
    exercise_id: "fixture-exercise",
    question_text: raw.question_text,
    question_type: raw.question_type,
    media_url: raw.content?.imageUrl ?? null,
    media_type: null,
    points: raw.points ?? 0,
    sort_order: 0,
    content: raw.content ?? {},
    explanation: null,
    choices: raw.choices,
    pairs: raw.pairs,
  };
}

describe("writing runtime (M2.1)", () => {
  it("maps all five writing example fixtures", () => {
    const files = [
      "write-sentence.json",
      "write-note.json",
      "write-email.json",
      "write-story.json",
      "picture-description.json",
    ];
    for (const file of files) {
      const q = loadExample(file);
      expect(isWritingQuestion(q)).toBe(true);
      expect(isWritingQuestionType(q)).toBe(true);
      expect(validateWritingQuestionContent(q)).toHaveLength(0);
      const parsed = parseWritingQuestionContent(q);
      expect(parsed.prompt.prompt.length).toBeGreaterThan(0);
    }
  });

  it("counts words consistently", () => {
    expect(countWords("Hello world")).toBe(2);
    expect(countWords("  one   two  three  ")).toBe(3);
    expect(countWords("")).toBe(0);
  });

  it("builds writing submission shape without score fields", () => {
    const q = loadExample("write-note.json");
    const answer = createWritingUserAnswer(
      "Dear Sam, come at four o'clock. Please bring your book. See you soon.",
      parseWritingQuestionContent(q).cambridgeTaskType
    );
    const submission = toWritingSubmission(q.id, answer, parseWritingQuestionContent(q).cambridgeTaskType);
    expect(submission).toMatchObject({
      questionId: q.id,
      wordCount: expect.any(Number),
      responseText: expect.stringContaining("Dear Sam"),
      submittedAt: expect.any(String),
    });
    expect(submission).not.toHaveProperty("overallScore");
    expect(submission).not.toHaveProperty("feedback");
  });

  it("serializes legacy text answers to writing payloads for attempts", () => {
    const serialized = serializeWritingAnswersForAttempt({
      q1: { type: "text", text: "My cat is small." },
      q2: { type: "single", choiceId: "a" },
    });
    expect(serialized.q1?.type).toBe("writing");
    if (serialized.q1?.type === "writing") {
      expect(serialized.q1.wordCount).toBe(4);
    }
    expect(serialized.q2?.type).toBe("single");
  });

  it("tracks answered state for navigation persistence", () => {
    const writingQ = loadExample("write-sentence.json");
    const mcq: PublicQuestion = {
      id: "mcq",
      exercise_id: "e",
      question_text: "Pick",
      question_type: "multiple_choice",
      media_url: null,
      media_type: null,
      points: 1,
      sort_order: 0,
      content: {},
      explanation: null,
      choices: [{ id: "a", question_id: "mcq", text: "A", sort_order: 0, media_url: null }],
    };

    const answers: Record<string, UserAnswer> = {
      [writingQ.id]: createWritingUserAnswer("The boy is playing.", "write_sentence"),
      [mcq.id]: { type: "single", choiceId: "a" },
    };

    expect(isQuestionAnswered(writingQ, answers[writingQ.id])).toBe(true);
    expect(isQuestionAnswered(mcq, answers[mcq.id])).toBe(true);
    expect(countAnsweredQuestions([writingQ, mcq], answers)).toBe(2);
  });

  it("scores writing as zero points without fake correctness", () => {
    const q = loadExample("write-email.json") as Question;
    const answer = createWritingUserAnswer(
      "Dear teacher, I am sorry I will be late today because the bus was slow. Thank you.",
      "write_email"
    );
    const result = scoreQuestion(
      { ...q, choices: undefined, pairs: undefined },
      answer
    );
    expect(result.pointsEarned).toBe(0);
    expect(result.isCorrect).toBe(false);
    expect(result.maxPoints).toBe(0);
  });

  it("mixed MCQ + writing exercise scoring only auto-scored items", () => {
    const mixed = JSON.parse(
      readFileSync(resolve(EXAMPLES_DIR, "mixed-mcq-writing.json"), "utf8")
    ) as { questions: Array<Question & { choices?: Question["choices"] }> };

    const questions: Question[] = mixed.questions.map((q) => ({
      ...q,
      exercise_id: "mixed",
      sort_order: 0,
      explanation: null,
      choices: q.choices?.map((c) => ({
        ...c,
        question_id: q.id,
        is_correct: c.text === "Blue",
        media_url: null,
      })),
    }));

    const answers: Record<string, UserAnswer> = {
      "mixed-mcq-01": { type: "single", choiceId: "c1" },
      "mixed-writing-01": createWritingUserAnswer("Today is sunny and warm.", "write_sentence"),
    };

    const result = scoreExercise(questions, answers);
    expect(result.score).toBe(1);
    expect(result.maxScore).toBe(1);
    expect(result.questionResults.find((r) => r.questionId === "mixed-writing-01")?.pointsEarned).toBe(
      0
    );
  });

  it("validates min word constraints", () => {
    const q = loadExample("write-story.json");
    const shortAnswer = createWritingUserAnswer("Too short.", "write_story");
    const issues = validateWritingAnswer(q, shortAnswer);
    expect(issues.some((i) => i.code === "WRITING_MIN_WORDS")).toBe(true);
  });

  it("normalizes userAnswerToWritingPayload from writing type", () => {
    const payload = userAnswerToWritingPayload({
      type: "writing",
      responseText: "Hello there friend",
      wordCount: 3,
      submittedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(payload?.responseText).toBe("Hello there friend");
    expect(payload?.wordCount).toBe(3);
  });
});
