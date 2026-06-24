import type { Question, UserAnswer } from "@/types/learning";
import { scoreExercise } from "@/lib/learning/scoring";
import {
  collectSpeakingAnalyticsFromAttempt,
  createPendingSpeakingEvaluationEnvelope,
  evaluateSpeakingQuestionsForAttempt,
  mergeSpeakingIntoQuestionResults,
  mergeSpeakingSkillBreakdown,
} from "@/lib/speaking/speaking-evaluation";
import { normalizeCambridgeExamLevel } from "@/lib/writing/writing-evaluation";
import {
  isSpeakingQuestion,
  parseSpeakingQuestionContent,
  userAnswerToSpeakingPayload,
} from "@/lib/speaking/speaking-utils";
import { loadSpeakingAudioBase64 } from "@/lib/speaking/speaking-audio-storage";
import type { SpeakingAnalyticsSignals } from "@/lib/speaking/speaking-evaluation-types";
import type { PersistSpeakingEvaluationInput } from "@/lib/speaking/speaking-evaluation-persistence";

export function markSpeakingAnswersPending(
  questions: Question[],
  answers: Record<string, UserAnswer>
): Record<string, UserAnswer> {
  const out = { ...answers };
  for (const q of questions) {
    if (!isSpeakingQuestion(q)) continue;
    const answer = out[q.id];
    const payload = userAnswerToSpeakingPayload(answer);
    if (!payload) continue;
    out[q.id] = {
      type: "speaking",
      audioRef: payload.audioRef,
      mimeType: payload.mimeType,
      durationSeconds: payload.durationSeconds,
      submittedAt: payload.submittedAt,
      taskType: payload.taskType,
      transcript: payload.transcript,
      evaluation: payload.evaluation ?? createPendingSpeakingEvaluationEnvelope(),
    };
  }
  return out;
}

export async function runSpeakingEvaluationPipeline(input: {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  level?: string;
  locale?: string;
}) {
  const level = normalizeCambridgeExamLevel(input.level);
  const pendingAnswers = markSpeakingAnswersPending(input.questions, input.answers);

  const enrichedAnswers = await evaluateSpeakingQuestionsForAttempt(
    input.questions,
    pendingAnswers,
    loadSpeakingAudioBase64,
    { level, locale: input.locale }
  );

  const baseResult = scoreExercise(input.questions, enrichedAnswers);
  const questionResults = mergeSpeakingIntoQuestionResults(
    input.questions,
    enrichedAnswers,
    baseResult.questionResults
  );

  const analyticsSignals = collectSpeakingAnalyticsFromAttempt(
    input.questions,
    enrichedAnswers
  );

  const persistenceInputs = buildPersistenceInputs(
    input.questions,
    enrichedAnswers,
    level
  );

  return {
    enrichedAnswers,
    questionResults,
    analyticsSignals,
    persistenceInputs,
  };
}

function buildPersistenceInputs(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  level: string
): Omit<PersistSpeakingEvaluationInput, "attemptId" | "attemptType">[] {
  const inputs: Omit<PersistSpeakingEvaluationInput, "attemptId" | "attemptType">[] = [];

  for (const q of questions) {
    if (!isSpeakingQuestion(q)) continue;
    const payload = userAnswerToSpeakingPayload(answers[q.id]);
    if (!payload?.evaluation) continue;
    const content = parseSpeakingQuestionContent(q);
    inputs.push({
      questionId: q.id,
      prompt: content.prompt.prompt,
      audioRef: payload.audioRef,
      durationSeconds: payload.durationSeconds,
      taskType: payload.taskType,
      level,
      envelope: payload.evaluation,
    });
  }

  return inputs;
}

export function mergeMockTestSpeakingScores(
  sections: Array<{
    skillSlug: string | null;
    title: string;
    questions: Array<{ id: string }>;
  }>,
  answers: Record<string, UserAnswer>,
  baseBreakdown: Record<string, number>
): Record<string, number> {
  return mergeSpeakingSkillBreakdown(sections, answers, baseBreakdown);
}

export function flattenSpeakingWeaknesses(signals: SpeakingAnalyticsSignals[]): string[] {
  const out: string[] = [];
  for (const s of signals) {
    out.push(...s.grammarWeaknesses.map((w) => `Grammar: ${w}`));
    out.push(...s.vocabularyWeaknesses.map((w) => `Vocabulary: ${w}`));
    out.push(...s.overallWeaknesses);
  }
  return [...new Set(out)].slice(0, 9);
}
