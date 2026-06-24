import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
import type { SpeakingAiEvaluationRequest } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import { evaluateCambridgeSpeaking, SpeakingEvaluationError } from "@/lib/ai/speaking/cambridge-speaking-evaluator";
import { GEMINI_MODEL_VERSION } from "@/lib/ai/gemini-client";
import { normalizeCambridgeExamLevel } from "@/lib/writing/writing-evaluation";
import type { Question, QuestionResult, UserAnswer } from "@/types/learning";
import {
  isSpeakingQuestion,
  parseSpeakingQuestionContent,
  userAnswerToSpeakingPayload,
} from "@/lib/speaking/speaking-utils";
import type {
  SpeakingAnalyticsSignals,
  SpeakingEvaluationEnvelope,
  SpeakingEvaluationResult,
  SpeakingFeedback,
  SpeakingQuestionEvaluationSummary,
} from "@/lib/speaking/speaking-evaluation-types";
import { randomUUID } from "node:crypto";

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
  switch (taskType) {
    case "speaking_picture_description":
      return "picture_description_speaking";
    case "speaking_personal_questions":
      return "short_answer";
    case "speaking_storytelling":
      return "story_telling";
    case "speaking_discussion":
      return "conversation";
    default:
      return taskType as CambridgeTaskTypeKey;
  }
}

export function createPendingSpeakingEvaluationEnvelope(): SpeakingEvaluationEnvelope {
  return { status: "pending" };
}

export function createFailedSpeakingEvaluationEnvelope(
  errorMessage: string
): SpeakingEvaluationEnvelope {
  return {
    status: "failed",
    errorMessage,
    evaluatedAt: new Date().toISOString(),
    modelVersion: GEMINI_MODEL_VERSION,
  };
}

export function createCompletedSpeakingEvaluationEnvelope(
  result: SpeakingEvaluationResult
): SpeakingEvaluationEnvelope {
  return {
    status: "completed",
    result,
    evaluatedAt: result.evaluatedAt,
    modelVersion: result.metadata?.modelId ?? GEMINI_MODEL_VERSION,
  };
}

export function getSpeakingEvaluationFromAnswer(
  answer: UserAnswer | undefined
): SpeakingEvaluationEnvelope | null {
  if (!answer || answer.type !== "speaking") return null;
  return answer.evaluation ?? null;
}

export function buildSpeakingEvaluationRequest(
  question: Question,
  answer: UserAnswer,
  options?: { level?: CambridgeExamLevel; locale?: string }
): SpeakingAiEvaluationRequest | null {
  if (!isSpeakingQuestion(question)) return null;
  const payload = userAnswerToSpeakingPayload(answer);
  if (!payload?.audioRef.trim()) return null;

  const content = parseSpeakingQuestionContent(question);
  const level = resolveQuestionLevel(question, options?.level);

  return {
    requestId: randomUUID(),
    level,
    taskType: toTaxonomyTaskType(content.cambridgeTaskType),
    prompt: content.prompt.prompt,
    followUpPrompts: content.prompt.followUpQuestions,
    audio: {
      audioRef: payload.audioRef,
      mimeType: payload.mimeType,
      durationSeconds: payload.durationSeconds,
    },
    stimulus: content.stimulus,
    locale: options?.locale,
  };
}

export async function evaluateSpeakingQuestion(
  question: Question,
  answer: UserAnswer,
  audioBase64: string,
  options?: { level?: CambridgeExamLevel; locale?: string }
): Promise<SpeakingEvaluationEnvelope> {
  const request = buildSpeakingEvaluationRequest(question, answer, options);
  if (!request) {
    return createFailedSpeakingEvaluationEnvelope("No speaking recording to evaluate");
  }

  try {
    const result = await evaluateCambridgeSpeaking(request, audioBase64);
    return createCompletedSpeakingEvaluationEnvelope(result);
  } catch (error) {
    const message =
      error instanceof SpeakingEvaluationError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Evaluation failed";
    return createFailedSpeakingEvaluationEnvelope(message);
  }
}

export async function evaluateSpeakingQuestionsForAttempt(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  loadAudioBase64: (audioRef: string) => Promise<string>,
  options?: { level?: CambridgeExamLevel; locale?: string }
): Promise<Record<string, UserAnswer>> {
  const out: Record<string, UserAnswer> = { ...answers };

  for (const question of questions) {
    if (!isSpeakingQuestion(question)) continue;
    const answer = answers[question.id];
    const payload = userAnswerToSpeakingPayload(answer);
    if (!payload) continue;

    let audioBase64 = "";
    try {
      audioBase64 = await loadAudioBase64(payload.audioRef);
    } catch (error) {
      out[question.id] = {
        ...payload,
        evaluation: createFailedSpeakingEvaluationEnvelope(
          error instanceof Error ? error.message : "Failed to load audio"
        ),
      };
      continue;
    }

    const envelope = await evaluateSpeakingQuestion(question, answer!, audioBase64, options);
    out[question.id] = {
      type: "speaking",
      audioRef: payload.audioRef,
      mimeType: payload.mimeType,
      durationSeconds: payload.durationSeconds,
      submittedAt: payload.submittedAt,
      taskType: payload.taskType,
      transcript: envelope.result?.transcript ?? payload.transcript,
      evaluation: envelope,
    };
  }

  return out;
}

export function speakingPointsFromEvaluation(
  evaluation: SpeakingEvaluationEnvelope | null,
  maxPoints: number
): number {
  if (!evaluation || evaluation.status !== "completed" || !evaluation.result) return 0;
  if (maxPoints <= 0) return 0;
  return Math.round((evaluation.result.overallScore / 100) * maxPoints);
}

export function mergeSpeakingIntoQuestionResults(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  baseResults: QuestionResult[]
): QuestionResult[] {
  const resultMap = new Map(baseResults.map((r) => [r.questionId, { ...r }]));

  for (const question of questions) {
    if (!isSpeakingQuestion(question)) continue;
    const envelope = getSpeakingEvaluationFromAnswer(answers[question.id]);
    const existing = resultMap.get(question.id) ?? {
      questionId: question.id,
      isCorrect: false,
      pointsEarned: 0,
      maxPoints: question.points,
      explanation: question.explanation,
    };

    existing.isCorrect = false;
    existing.maxPoints = question.points;
    existing.pointsEarned = speakingPointsFromEvaluation(envelope, question.points);

    resultMap.set(question.id, existing);
  }

  return [...resultMap.values()];
}

export function mergeSpeakingSkillBreakdown(
  sections: Array<{ skillSlug: string | null; title: string; questions: Array<{ id: string }> }>,
  answers: Record<string, UserAnswer>,
  baseBreakdown: Record<string, number>
): Record<string, number> {
  const breakdown = { ...baseBreakdown };

  for (const section of sections) {
    const skillKey = section.skillSlug ?? section.title.toLowerCase();
    const speakingQuestions = section.questions.filter((q) => answers[q.id]?.type === "speaking");
    if (speakingQuestions.length === 0) continue;

    let scoreSum = 0;
    let count = 0;
    for (const q of speakingQuestions) {
      const envelope = getSpeakingEvaluationFromAnswer(answers[q.id]);
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

export function hasSpeakingQuestions(questions: Question[]): boolean {
  return questions.some((q) => isSpeakingQuestion(q));
}

export function toSpeakingQuestionEvaluationSummary(
  envelope: SpeakingEvaluationEnvelope | null
): SpeakingQuestionEvaluationSummary | null {
  if (!envelope?.result) return null;
  const r = envelope.result;
  return {
    overallScore: r.overallScore,
    bandScore: r.bandScore,
    dimensions: r.dimensions,
    strengths: r.strengths,
    weaknesses: r.weaknesses,
    feedback: r.feedback,
    transcript: r.transcript,
    status: envelope.status,
  };
}

export function toSpeakingFeedback(result: SpeakingEvaluationResult): SpeakingFeedback {
  return {
    summary: result.feedback,
    strengths: result.strengths,
    weaknesses: result.weaknesses,
  };
}

export function extractSpeakingAnalyticsSignals(
  questionId: string,
  envelope: SpeakingEvaluationEnvelope | null,
  taskType?: string
): SpeakingAnalyticsSignals | null {
  if (!envelope?.result) return null;
  const r = envelope.result;

  const grammarWeaknesses: string[] = [];
  const vocabularyWeaknesses: string[] = [];
  const pronunciationWeaknesses: string[] = [];
  const fluencyWeaknesses: string[] = [];

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
      case "pronunciation":
        pronunciationWeaknesses.push(label);
        break;
      case "fluency":
        fluencyWeaknesses.push(label);
        break;
      default:
        break;
    }
  }

  return {
    grammarWeaknesses,
    vocabularyWeaknesses,
    pronunciationWeaknesses,
    fluencyWeaknesses,
    overallWeaknesses: r.weaknesses,
    overallScore: r.overallScore,
    questionId,
    taskType,
  };
}

export function collectSpeakingAnalyticsFromAttempt(
  questions: Question[],
  answers: Record<string, UserAnswer>
): SpeakingAnalyticsSignals[] {
  const signals: SpeakingAnalyticsSignals[] = [];
  for (const q of questions) {
    if (!isSpeakingQuestion(q)) continue;
    const envelope = getSpeakingEvaluationFromAnswer(answers[q.id]);
    const payload = userAnswerToSpeakingPayload(answers[q.id]);
    const signal = extractSpeakingAnalyticsSignals(q.id, envelope, payload?.taskType);
    if (signal) signals.push(signal);
  }
  return signals;
}

export function attachSpeakingEvaluationToAnswer(
  answer: Extract<UserAnswer, { type: "speaking" }>,
  envelope: SpeakingEvaluationEnvelope
): Extract<UserAnswer, { type: "speaking" }> {
  return { ...answer, evaluation: envelope };
}
