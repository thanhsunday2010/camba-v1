import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
import type { WritingAiEvaluationRequest } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import { evaluateCambridgeWriting, WritingEvaluationError } from "@/lib/ai/writing/cambridge-writing-evaluator";
import { GEMINI_MODEL_VERSION } from "@/lib/ai/gemini-client";
import type { Question, QuestionResult, UserAnswer } from "@/types/learning";
import {
  isWritingQuestion,
  parseWritingQuestionContent,
  userAnswerToWritingPayload,
} from "@/lib/writing/writing-utils";
import type {
  WritingAnalyticsSignals,
  WritingEvaluationEnvelope,
  WritingEvaluationResult,
  WritingFeedback,
  WritingQuestionEvaluationSummary,
} from "@/lib/writing/writing-evaluation-types";
import { randomUUID } from "node:crypto";

export {
  WRITING_EVALUATION_MAX_WORDS,
  WRITING_EVALUATION_MAX_RETRIES,
  WRITING_EVALUATION_TIMEOUT_MS,
} from "@/lib/writing/writing-evaluation-validation";

export function normalizeCambridgeExamLevel(raw?: string | null): CambridgeExamLevel {
  if (!raw) return "flyers";
  const slug = raw.toLowerCase().replace(/\s+/g, "_");
  if (slug.includes("starter")) return "starters";
  if (slug.includes("mover")) return "movers";
  if (slug.includes("flyer")) return "flyers";
  if (slug.includes("ket") || slug.includes("a2_key")) return "ket";
  if (slug.includes("pet") || slug.includes("b1_preliminary")) return "pet";
  if (["starters", "movers", "flyers", "ket", "pet"].includes(slug)) {
    return slug as CambridgeExamLevel;
  }
  return "flyers";
}

function resolveQuestionLevel(
  question: Question,
  fallbackLevel?: CambridgeExamLevel
): CambridgeExamLevel {
  const content = question.content ?? {};
  const raw =
    (typeof content.cambridgeLevel === "string" && content.cambridgeLevel) ||
    (typeof content.targetLevel === "string" && content.targetLevel) ||
    (typeof content.levelTag === "string" && content.levelTag) ||
    fallbackLevel;
  return normalizeCambridgeExamLevel(raw ?? null);
}

function toTaxonomyTaskType(taskType: string): CambridgeTaskTypeKey {
  if (taskType === "picture_description") return "picture_description_writing";
  return taskType as CambridgeTaskTypeKey;
}

export function buildWritingEvaluationRequest(
  question: Question,
  answer: UserAnswer,
  options?: { level?: CambridgeExamLevel; locale?: string }
): WritingAiEvaluationRequest | null {
  if (!isWritingQuestion(question)) return null;
  const payload = userAnswerToWritingPayload(answer);
  if (!payload?.responseText.trim()) return null;

  const content = parseWritingQuestionContent(question);
  const level = resolveQuestionLevel(question, options?.level);

  return {
    requestId: randomUUID(),
    level,
    taskType: toTaxonomyTaskType(content.cambridgeTaskType),
    prompt: content.prompt.prompt,
    learnerResponse: payload.responseText,
    constraints: {
      minWords: content.constraints.minWords,
      maxWords: content.constraints.maxWords,
      requiredPoints: content.constraints.requiredPoints,
    },
    stimulus: content.stimulus
      ? {
          imageUrl: content.stimulus.imageUrl,
          imageDescription: content.stimulus.imageDescription,
          bulletPoints: content.prompt.bulletPoints,
        }
      : undefined,
    locale: options?.locale,
  };
}

export function createPendingEvaluationEnvelope(): WritingEvaluationEnvelope {
  return { status: "pending" };
}

export function createFailedEvaluationEnvelope(errorMessage: string): WritingEvaluationEnvelope {
  return {
    status: "failed",
    errorMessage,
    evaluatedAt: new Date().toISOString(),
    modelVersion: GEMINI_MODEL_VERSION,
  };
}

export function createCompletedEvaluationEnvelope(
  result: WritingEvaluationResult
): WritingEvaluationEnvelope {
  return {
    status: "completed",
    result,
    evaluatedAt: result.evaluatedAt,
    modelVersion: result.metadata?.modelId ?? GEMINI_MODEL_VERSION,
  };
}

export function attachEvaluationToWritingAnswer(
  answer: Extract<UserAnswer, { type: "writing" }>,
  envelope: WritingEvaluationEnvelope
): Extract<UserAnswer, { type: "writing" }> {
  return { ...answer, evaluation: envelope };
}

export function getWritingEvaluationFromAnswer(
  answer: UserAnswer | undefined
): WritingEvaluationEnvelope | null {
  if (!answer || answer.type !== "writing") return null;
  return answer.evaluation ?? null;
}

export async function evaluateWritingQuestion(
  question: Question,
  answer: UserAnswer,
  options?: { level?: CambridgeExamLevel; locale?: string }
): Promise<WritingEvaluationEnvelope> {
  const request = buildWritingEvaluationRequest(question, answer, options);
  if (!request) {
    return createFailedEvaluationEnvelope("No writing response to evaluate");
  }

  try {
    const result = await evaluateCambridgeWriting(request);
    return createCompletedEvaluationEnvelope(result);
  } catch (error) {
    const message =
      error instanceof WritingEvaluationError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Evaluation failed";
    return createFailedEvaluationEnvelope(message);
  }
}

export async function evaluateWritingQuestionsForAttempt(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  options?: { level?: CambridgeExamLevel; locale?: string }
): Promise<Record<string, UserAnswer>> {
  const out: Record<string, UserAnswer> = { ...answers };

  for (const question of questions) {
    if (!isWritingQuestion(question)) continue;
    const answer = answers[question.id];
    if (!answer) continue;

    const payload = userAnswerToWritingPayload(answer);
    if (!payload) continue;

    const envelope = await evaluateWritingQuestion(question, answer, options);

    out[question.id] = attachEvaluationToWritingAnswer(
      {
        type: "writing",
        responseText: payload.responseText,
        wordCount: payload.wordCount,
        submittedAt: payload.submittedAt,
        taskType: payload.taskType,
      },
      envelope
    );
  }

  return out;
}

export function writingPointsFromEvaluation(
  evaluation: WritingEvaluationEnvelope | null,
  maxPoints: number
): number {
  if (!evaluation || evaluation.status !== "completed" || !evaluation.result) return 0;
  if (maxPoints <= 0) return 0;
  return Math.round((evaluation.result.overallScore / 100) * maxPoints);
}

export function mergeWritingIntoQuestionResults(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  baseResults: QuestionResult[]
): QuestionResult[] {
  const resultMap = new Map(baseResults.map((r) => [r.questionId, { ...r }]));

  for (const question of questions) {
    if (!isWritingQuestion(question)) continue;
    const envelope = getWritingEvaluationFromAnswer(answers[question.id]);
    const existing = resultMap.get(question.id) ?? {
      questionId: question.id,
      isCorrect: false,
      pointsEarned: 0,
      maxPoints: question.points,
      explanation: question.explanation,
    };

    existing.isCorrect = false;
    existing.maxPoints = question.points;
    existing.pointsEarned = writingPointsFromEvaluation(envelope, question.points);

    resultMap.set(question.id, existing);
  }

  return [...resultMap.values()];
}

export function computeHybridMetricsFromResults(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  questionResults: QuestionResult[]
): { score: number; maxScore: number; accuracyPercent: number } {
  const merged = mergeWritingIntoQuestionResults(questions, answers, questionResults);

  let score = 0;
  let maxScore = 0;
  let percentSum = 0;

  for (const q of questions) {
    const result = merged.find((r) => r.questionId === q.id);
    const max = result?.maxPoints ?? q.points;
    const earned = result?.pointsEarned ?? 0;
    score += earned;
    maxScore += max;

    if (isWritingQuestion(q)) {
      const envelope = getWritingEvaluationFromAnswer(answers[q.id]);
      if (envelope?.status === "completed" && envelope.result) {
        percentSum += envelope.result.overallScore;
      }
    } else if (max > 0) {
      percentSum += (earned / max) * 100;
    } else {
      percentSum += result?.isCorrect ? 100 : 0;
    }
  }

  const accuracyPercent =
    questions.length > 0 ? Math.round(percentSum / questions.length) : 0;

  return { score, maxScore, accuracyPercent };
}

export function toWritingQuestionEvaluationSummary(
  envelope: WritingEvaluationEnvelope | null
): WritingQuestionEvaluationSummary | null {
  if (!envelope?.result) return null;
  const r = envelope.result;
  return {
    overallScore: r.overallScore,
    bandScore: r.bandScore,
    dimensions: r.dimensions,
    strengths: r.strengths,
    weaknesses: r.weaknesses,
    feedback: r.feedback,
    correctedVersion: r.correctedVersion,
    status: envelope.status,
  };
}

export function toWritingFeedback(result: WritingEvaluationResult): WritingFeedback {
  return {
    summary: result.feedback,
    strengths: result.strengths,
    weaknesses: result.weaknesses,
    suggestedImprovements: result.suggestedImprovements,
  };
}

export function extractWritingAnalyticsSignals(
  questionId: string,
  envelope: WritingEvaluationEnvelope | null,
  taskType?: string
): WritingAnalyticsSignals | null {
  if (!envelope?.result) return null;
  const r = envelope.result;

  const grammarWeaknesses: string[] = [];
  const vocabularyWeaknesses: string[] = [];
  const organizationWeaknesses: string[] = [];
  const taskAchievementWeaknesses: string[] = [];

  for (const dim of r.dimensions) {
    if (dim.score >= 70) continue;
    const label = dim.feedback.trim();
    if (!label) continue;
    switch (dim.dimension) {
      case "grammar":
        grammarWeaknesses.push(label);
        break;
      case "vocabulary":
        vocabularyWeaknesses.push(label);
        break;
      case "organization":
        organizationWeaknesses.push(label);
        break;
      case "task_achievement":
        taskAchievementWeaknesses.push(label);
        break;
      default:
        break;
    }
  }

  return {
    grammarWeaknesses,
    vocabularyWeaknesses,
    organizationWeaknesses,
    taskAchievementWeaknesses,
    overallWeaknesses: r.weaknesses,
    overallScore: r.overallScore,
    questionId,
    taskType,
  };
}

export function collectWritingAnalyticsFromAttempt(
  questions: Question[],
  answers: Record<string, UserAnswer>
): WritingAnalyticsSignals[] {
  const signals: WritingAnalyticsSignals[] = [];
  for (const q of questions) {
    if (!isWritingQuestion(q)) continue;
    const envelope = getWritingEvaluationFromAnswer(answers[q.id]);
    const payload = userAnswerToWritingPayload(answers[q.id]);
    const signal = extractWritingAnalyticsSignals(
      q.id,
      envelope,
      payload?.taskType
    );
    if (signal) signals.push(signal);
  }
  return signals;
}

export function mergeWritingSkillBreakdown(
  sections: Array<{ skillSlug: string | null; title: string; questions: Array<{ id: string }> }>,
  answers: Record<string, UserAnswer>,
  baseBreakdown: Record<string, number>
): Record<string, number> {
  const breakdown = { ...baseBreakdown };

  for (const section of sections) {
    const skillKey = section.skillSlug ?? section.title.toLowerCase();
    const writingQuestions = section.questions.filter((q) => {
      const answer = answers[q.id];
      return answer?.type === "writing";
    });

    if (writingQuestions.length === 0) continue;

    let scoreSum = 0;
    let count = 0;
    for (const q of writingQuestions) {
      const envelope = getWritingEvaluationFromAnswer(answers[q.id]);
      if (envelope?.status === "completed" && envelope.result) {
        scoreSum += envelope.result.overallScore;
        count += 1;
      }
    }

    if (count > 0) {
      breakdown[skillKey] = Math.round(scoreSum / count);
    }
  }

  return breakdown;
}

export function hasWritingQuestions(questions: Question[]): boolean {
  return questions.some((q) => isWritingQuestion(q));
}

export function hasPendingOrFailedWritingEvaluations(
  questions: Question[],
  answers: Record<string, UserAnswer>
): boolean {
  for (const q of questions) {
    if (!isWritingQuestion(q)) continue;
    const envelope = getWritingEvaluationFromAnswer(answers[q.id]);
    if (!envelope || envelope.status !== "completed") return true;
  }
  return false;
}
