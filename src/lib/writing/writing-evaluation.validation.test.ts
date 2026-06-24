import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PublicQuestion, UserAnswer } from "@/types/learning";
import { CambridgeWritingGeminiResponseSchema } from "@/lib/ai/writing/cambridge-writing-schema";
import { parseCambridgeWritingGeminiResponse } from "@/lib/ai/writing/cambridge-writing-parser";
import {
  buildBandScore,
} from "@/lib/ai/writing/cambridge-writing-parser";
import {
  collectWritingAnalyticsFromAttempt,
  computeHybridMetricsFromResults,
  createCompletedEvaluationEnvelope,
  createFailedEvaluationEnvelope,
  mergeWritingIntoQuestionResults,
  toWritingQuestionEvaluationSummary,
} from "@/lib/writing/writing-evaluation";
import {
  parseAndValidateGeminiWritingResponse,
  validateGeminiWritingResponse,
  validateWritingEvaluationEnvelope,
  WRITING_EVALUATION_MAX_WORDS,
} from "@/lib/writing/writing-evaluation-validation";
import { toWritingEvaluationAnalyticsRecords } from "@/lib/writing/writing-analytics";
import { createWritingUserAnswer } from "@/lib/writing/writing-utils";
import { scoreExercise } from "@/lib/learning/scoring";
import type { Question } from "@/types/learning";

import type { CambridgeWritingGeminiResponse } from "@/lib/ai/writing/cambridge-writing-schema";

const FIXTURE: CambridgeWritingGeminiResponse = {
  overallScore: 78,
  bandScore: 4,
  dimensions: [
    { dimension: "grammar", score: 80, feedback: "Good use of present simple." },
    { dimension: "vocabulary", score: 75, feedback: "Adequate word choice." },
    { dimension: "task_achievement", score: 82, feedback: "Task fully addressed." },
    { dimension: "organization", score: 70, feedback: "Clear sentence order." },
    {
      dimension: "communicative_effectiveness",
      score: 76,
      feedback: "Message is easy to understand.",
    },
  ],
  strengths: ["Clear main idea"],
  weaknesses: ["Some article errors"],
  feedback: "Good effort overall.",
  correctedVersion: "The boy is playing football in the park.",
};

describe("writing evaluation (M2.2)", () => {
  it("validates Gemini JSON schema", () => {
    expect(validateGeminiWritingResponse(FIXTURE)).toHaveLength(0);
    expect(CambridgeWritingGeminiResponseSchema.parse(FIXTURE).overallScore).toBe(78);
  });

  it("rejects malformed Gemini responses", () => {
    const issues = validateGeminiWritingResponse({ overallScore: 200 });
    expect(issues.length).toBeGreaterThan(0);
  });

  it("parses Gemini response into Cambridge evaluation result", () => {
    const result = parseAndValidateGeminiWritingResponse(FIXTURE, {
      requestId: "req-1",
      level: "flyers",
      wordCount: 12,
    });
    expect(result.overallScore).toBe(78);
    expect(result.dimensions).toHaveLength(5);
    expect(result.bandScore.model).toBe("yle_shields");
  });

  it("maps YLE band scores", () => {
    const band = buildBandScore("starters", 4, 78);
    expect(band).toEqual({ model: "yle_shields", shields: 4, maxShields: 5 });
  });

  it("maps KET band scores to Cambridge scale", () => {
    const band = buildBandScore("ket", 140, 78);
    expect(band.model).toBe("cambridge_scale");
    if (band.model === "cambridge_scale") {
      expect(band.scaleScore).toBeGreaterThanOrEqual(100);
    }
  });

  it("merges writing scores into hybrid exercise metrics without isCorrect", () => {
    const mixed = JSON.parse(
      readFileSync(
        resolve(process.cwd(), "data/cambridge-writing-examples/mixed-mcq-writing.json"),
        "utf8"
      )
    ) as { questions: Question[] };

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

    const evaluation = createCompletedEvaluationEnvelope(
      parseCambridgeWritingGeminiResponse(FIXTURE, {
        requestId: "req-2",
        level: "flyers",
        wordCount: 5,
      })
    );

    const answers: Record<string, UserAnswer> = {
      "mixed-mcq-01": { type: "single", choiceId: "c1" },
      "mixed-writing-01": {
        ...createWritingUserAnswer("Today is sunny and warm.", "write_sentence"),
        evaluation,
      },
    };

    const base = scoreExercise(questions, answers);
    const merged = mergeWritingIntoQuestionResults(questions, answers, base.questionResults);
    const writingResult = merged.find((r) => r.questionId === "mixed-writing-01");

    expect(writingResult?.isCorrect).toBe(false);
    expect(writingResult?.pointsEarned).toBe(0);

    const metrics = computeHybridMetricsFromResults(questions, answers, merged);
    expect(metrics.accuracyPercent).toBeGreaterThan(50);
  });

  it("validates evaluation envelope shape", () => {
    const completed = createCompletedEvaluationEnvelope(
      parseCambridgeWritingGeminiResponse(FIXTURE, {
        requestId: "req-3",
        level: "movers",
      })
    );
    expect(validateWritingEvaluationEnvelope(completed)).toHaveLength(0);

    const failed = createFailedEvaluationEnvelope("Timeout");
    expect(failed.status).toBe("failed");
    expect(failed.errorMessage).toBe("Timeout");
  });

  it("extracts grammar and vocabulary analytics signals", () => {
    const q: PublicQuestion = {
      id: "w1",
      exercise_id: "e",
      question_text: "Write",
      question_type: "writing",
      media_url: null,
      media_type: null,
      points: 0,
      sort_order: 0,
      content: { cambridgeTaskType: "write_sentence", prompt: "Write one sentence." },
      explanation: null,
    };

    const evaluation = createCompletedEvaluationEnvelope(
      parseCambridgeWritingGeminiResponse(
        {
          ...FIXTURE,
          dimensions: FIXTURE.dimensions.map((d) => {
            if (d.dimension === "grammar") return { ...d, score: 55 };
            if (d.dimension === "vocabulary") return { ...d, score: 60 };
            return d;
          }),
        },
        { requestId: "req-4", level: "flyers" }
      )
    );

    const answers: Record<string, UserAnswer> = {
      w1: {
        ...createWritingUserAnswer("The cat is big.", "write_sentence"),
        evaluation,
      },
    };

    const signals = collectWritingAnalyticsFromAttempt([q as Question], answers);
    const records = toWritingEvaluationAnalyticsRecords(signals);
    expect(records[0]?.grammarWeaknesses.length).toBeGreaterThan(0);
    expect(records[0]?.vocabularyWeaknesses.length).toBeGreaterThan(0);
  });

  it("supports review rendering summary from stored evaluation", () => {
    const envelope = createCompletedEvaluationEnvelope(
      parseCambridgeWritingGeminiResponse(FIXTURE, {
        requestId: "req-5",
        level: "flyers",
      })
    );
    const summary = toWritingQuestionEvaluationSummary(envelope);
    expect(summary?.overallScore).toBe(78);
    expect(summary?.correctedVersion).toContain("boy");
    expect(summary?.dimensions).toHaveLength(5);
  });

  it("enforces max word limit constant", () => {
    expect(WRITING_EVALUATION_MAX_WORDS).toBe(500);
  });

  it("recovers from evaluation failure without losing submission text", () => {
    const failed = createFailedEvaluationEnvelope("Gemini timeout");
    const answer: UserAnswer = {
      type: "writing",
      responseText: "My saved answer text.",
      wordCount: 4,
      evaluation: failed,
    };
    expect(answer.responseText).toBe("My saved answer text.");
    expect(answer.evaluation?.status).toBe("failed");
  });
});
