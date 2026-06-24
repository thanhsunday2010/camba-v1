import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PublicQuestion, UserAnswer } from "@/types/learning";
import { CambridgeSpeakingGeminiResponseSchema } from "@/lib/ai/speaking/cambridge-speaking-schema";
import { parseCambridgeSpeakingGeminiResponse, buildSpeakingBandScore } from "@/lib/ai/speaking/cambridge-speaking-parser";
import {
  createCompletedSpeakingEvaluationEnvelope,
  createFailedSpeakingEvaluationEnvelope,
  mergeSpeakingIntoQuestionResults,
  toSpeakingQuestionEvaluationSummary,
  collectSpeakingAnalyticsFromAttempt,
} from "@/lib/speaking/speaking-evaluation";
import {
  parseAndValidateGeminiSpeakingResponse,
  validateGeminiSpeakingResponse,
  validateSpeakingEvaluationEnvelope,
} from "@/lib/speaking/speaking-evaluation-validation";
import {
  isSpeakingQuestion,
  createSpeakingUserAnswer,
  isSpeakingAnswerComplete,
} from "@/lib/speaking/speaking-utils";
import { isSpeakingQuestionType } from "@/lib/learning/question-types";
import { validateSpeakingAudioInput, SPEAKING_MAX_DURATION_SECONDS } from "@/lib/speaking/speaking-submission";
import { toSpeakingEvaluationAnalyticsRecords } from "@/lib/speaking/speaking-analytics";
import { scoreExercise } from "@/lib/learning/scoring";
import type { Question } from "@/types/learning";
import type { CambridgeSpeakingGeminiResponse } from "@/lib/ai/speaking/cambridge-speaking-schema";

const EXAMPLES_DIR = resolve(process.cwd(), "data/cambridge-speaking-examples");

const FIXTURE: CambridgeSpeakingGeminiResponse = {
  transcript: "Hello, my name is Sam. I live in a small house with my family.",
  overallScore: 76,
  bandScore: 4,
  dimensions: [
    { dimension: "pronunciation", score: 75, feedback: "Generally clear sounds." },
    { dimension: "grammar", score: 70, feedback: "Simple grammar is mostly accurate." },
    { dimension: "vocabulary", score: 72, feedback: "Basic vocabulary used well." },
    { dimension: "fluency", score: 78, feedback: "Steady pace with short pauses." },
    { dimension: "task_achievement", score: 80, feedback: "You answered the prompt." },
  ],
  strengths: ["Clear introduction"],
  weaknesses: ["Some article errors"],
  feedback: "Good effort. Keep practising longer answers.",
  languageAnalysis: {
    wordCount: 14,
    sentenceCount: 2,
    averageWordsPerSentence: 7,
    vocabularyRange: "adequate",
    grammarControl: "adequate",
  },
};

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
  };
}

describe("speaking evaluation (M2.3)", () => {
  it("maps all four speaking example fixtures", () => {
    for (const file of [
      "speaking-picture-description.json",
      "speaking-personal-questions.json",
      "speaking-storytelling.json",
      "speaking-discussion.json",
    ]) {
      const q = loadExample(file);
      expect(isSpeakingQuestion(q)).toBe(true);
      expect(isSpeakingQuestionType(q)).toBe(true);
    }
  });

  it("validates Gemini JSON schema", () => {
    expect(validateGeminiSpeakingResponse(FIXTURE)).toHaveLength(0);
    expect(CambridgeSpeakingGeminiResponseSchema.parse(FIXTURE).overallScore).toBe(76);
  });

  it("parses transcript and dimensions", () => {
    const result = parseAndValidateGeminiSpeakingResponse(FIXTURE, {
      requestId: "req-1",
      level: "flyers",
    });
    expect(result.transcript).toContain("Sam");
    expect(result.dimensions).toHaveLength(5);
    expect(result.pipeline.languageAnalysis.wordCount).toBe(14);
  });

  it("maps YLE and KET band scores", () => {
    expect(buildSpeakingBandScore("movers", 4, 76)).toEqual({
      model: "yle_shields",
      shields: 4,
      maxShields: 5,
    });
    const ket = buildSpeakingBandScore("ket", 140, 76);
    expect(ket.model).toBe("cambridge_scale");
  });

  it("validates audio submission constraints", () => {
    expect(
      validateSpeakingAudioInput({
        mimeType: "audio/webm",
        durationSeconds: 30,
        byteLength: 1024,
      })
    ).toHaveLength(0);

    const bad = validateSpeakingAudioInput({
      mimeType: "video/mp4",
      durationSeconds: 30,
      byteLength: 1024,
    });
    expect(bad.some((i) => i.code === "SPEAKING_MIME_UNSUPPORTED")).toBe(true);
  });

  it("tracks speaking answered state", () => {
    const answer = createSpeakingUserAnswer({
      audioRef: "user/id/rec.webm",
      mimeType: "audio/webm",
      durationSeconds: 12,
      taskType: "speaking_personal_questions",
    });
    expect(isSpeakingAnswerComplete(answer)).toBe(true);
  });

  it("merges speaking scores without isCorrect", () => {
    const q = loadExample("speaking-picture-description.json") as Question;
    const evaluation = createCompletedSpeakingEvaluationEnvelope(
      parseCambridgeSpeakingGeminiResponse(FIXTURE, { requestId: "req-2", level: "flyers" })
    );
    const answers: Record<string, UserAnswer> = {
      [q.id]: { ...createSpeakingUserAnswer({
        audioRef: "user/id/rec.webm",
        mimeType: "audio/webm",
        durationSeconds: 20,
      }), evaluation },
    };
    const base = scoreExercise([q], answers);
    const merged = mergeSpeakingIntoQuestionResults([q], answers, base.questionResults);
    expect(merged[0]?.isCorrect).toBe(false);
    expect(merged[0]?.pointsEarned).toBe(0);
  });

  it("validates evaluation envelope and review summary", () => {
    const envelope = createCompletedSpeakingEvaluationEnvelope(
      parseCambridgeSpeakingGeminiResponse(FIXTURE, { requestId: "req-3", level: "starters" })
    );
    expect(validateSpeakingEvaluationEnvelope(envelope)).toHaveLength(0);
    const summary = toSpeakingQuestionEvaluationSummary(envelope);
    expect(summary?.transcript).toContain("Sam");
    expect(summary?.dimensions).toHaveLength(5);
  });

  it("extracts grammar and vocabulary analytics", () => {
    const q = loadExample("speaking-personal-questions.json") as Question;
    const evaluation = createCompletedSpeakingEvaluationEnvelope(
      parseCambridgeSpeakingGeminiResponse(
        {
          ...FIXTURE,
          dimensions: FIXTURE.dimensions.map((d) =>
            d.dimension === "grammar" ? { ...d, score: 55 } : d.dimension === "vocabulary" ? { ...d, score: 60 } : d
          ),
        },
        { requestId: "req-4", level: "flyers" }
      )
    );
    const answers: Record<string, UserAnswer> = {
      [q.id]: {
        ...createSpeakingUserAnswer({
          audioRef: "user/id/rec.webm",
          mimeType: "audio/webm",
          durationSeconds: 15,
        }),
        evaluation,
      },
    };
    const signals = collectSpeakingAnalyticsFromAttempt([q], answers);
    const records = toSpeakingEvaluationAnalyticsRecords(signals);
    expect(records[0]?.grammarWeaknesses.length).toBeGreaterThan(0);
    expect(records[0]?.vocabularyWeaknesses.length).toBeGreaterThan(0);
  });

  it("recovers from failure without losing audio reference", () => {
    const failed = createFailedSpeakingEvaluationEnvelope("Gemini timeout");
    const answer: UserAnswer = {
      type: "speaking",
      audioRef: "user/id/saved.webm",
      mimeType: "audio/webm",
      durationSeconds: 18,
      evaluation: failed,
    };
    expect(answer.audioRef).toBe("user/id/saved.webm");
    expect(failed.status).toBe("failed");
  });

  it("enforces max duration constant", () => {
    expect(SPEAKING_MAX_DURATION_SECONDS).toBe(180);
  });
});
