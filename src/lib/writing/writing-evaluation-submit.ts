import type { Question, UserAnswer } from "@/types/learning";
import { scoreExercise } from "@/lib/learning/scoring";
import {
  collectWritingAnalyticsFromAttempt,
  computeHybridMetricsFromResults,
  evaluateWritingQuestionsForAttempt,
  mergeWritingIntoQuestionResults,
  mergeWritingSkillBreakdown,
  normalizeCambridgeExamLevel,
} from "@/lib/writing/writing-evaluation";
import { isWritingQuestion, parseWritingQuestionContent, userAnswerToWritingPayload } from "@/lib/writing/writing-utils";
import { createPendingEvaluationEnvelope } from "@/lib/writing/writing-evaluation";
import type { WritingAnalyticsSignals } from "@/lib/writing/writing-evaluation-types";
import type { PersistWritingEvaluationInput } from "@/lib/writing/writing-evaluation-persistence";

export function markWritingAnswersPending(
  questions: Question[],
  answers: Record<string, UserAnswer>
): Record<string, UserAnswer> {
  const out = { ...answers };
  for (const q of questions) {
    if (!isWritingQuestion(q)) continue;
    const answer = out[q.id];
    const payload = userAnswerToWritingPayload(answer);
    if (!payload) continue;
    out[q.id] = {
      type: "writing",
      responseText: payload.responseText,
      wordCount: payload.wordCount,
      submittedAt: payload.submittedAt,
      taskType: payload.taskType,
      evaluation: payload.evaluation ?? createPendingEvaluationEnvelope(),
    };
  }
  return out;
}

export async function runWritingEvaluationPipeline(input: {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  level?: string;
  locale?: string;
}) {
  const level = normalizeCambridgeExamLevel(input.level);
  const pendingAnswers = markWritingAnswersPending(input.questions, input.answers);
  const baseResult = scoreExercise(input.questions, pendingAnswers);

  const enrichedAnswers = await evaluateWritingQuestionsForAttempt(
    input.questions,
    pendingAnswers,
    { level, locale: input.locale }
  );

  const questionResults = mergeWritingIntoQuestionResults(
    input.questions,
    enrichedAnswers,
    baseResult.questionResults
  );

  const metrics = computeHybridMetricsFromResults(
    input.questions,
    enrichedAnswers,
    questionResults
  );

  const analyticsSignals = collectWritingAnalyticsFromAttempt(
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
    score: metrics.score,
    maxScore: metrics.maxScore,
    accuracyPercent: metrics.accuracyPercent,
    analyticsSignals,
    persistenceInputs,
  };
}

function buildPersistenceInputs(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  level: string
): Omit<PersistWritingEvaluationInput, "attemptId" | "attemptType">[] {
  const inputs: Omit<PersistWritingEvaluationInput, "attemptId" | "attemptType">[] = [];

  for (const q of questions) {
    if (!isWritingQuestion(q)) continue;
    const payload = userAnswerToWritingPayload(answers[q.id]);
    if (!payload?.evaluation) continue;
    const content = parseWritingQuestionContent(q);
    inputs.push({
      questionId: q.id,
      prompt: content.prompt.prompt,
      responseText: payload.responseText,
      wordCount: payload.wordCount,
      taskType: payload.taskType,
      level,
      envelope: payload.evaluation,
    });
  }

  return inputs;
}

export function mergeMockTestWritingScores(
  sections: Array<{
    skillSlug: string | null;
    title: string;
    questions: Array<{ id: string }>;
  }>,
  answers: Record<string, UserAnswer>,
  baseBreakdown: Record<string, number>
): Record<string, number> {
  return mergeWritingSkillBreakdown(sections, answers, baseBreakdown);
}

export function flattenWritingWeaknesses(signals: WritingAnalyticsSignals[]): string[] {
  const out: string[] = [];
  for (const s of signals) {
    out.push(...s.grammarWeaknesses.map((w) => `Grammar: ${w}`));
    out.push(...s.vocabularyWeaknesses.map((w) => `Vocabulary: ${w}`));
    out.push(...s.overallWeaknesses);
  }
  return [...new Set(out)].slice(0, 9);
}
