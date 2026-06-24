import type { Question, QuestionResult, UserAnswer } from "@/types/learning";
import { scoreExercise } from "@/lib/learning/scoring";
import { hasWritingQuestions, mergeWritingIntoQuestionResults } from "@/lib/writing/writing-evaluation";
import {
  runWritingEvaluationPipeline,
  flattenWritingWeaknesses,
  mergeMockTestWritingScores,
  markWritingAnswersPending,
} from "@/lib/writing/writing-evaluation-submit";
import { hasSpeakingQuestions, mergeSpeakingIntoQuestionResults } from "@/lib/speaking/speaking-evaluation";
import {
  runSpeakingEvaluationPipeline,
  flattenSpeakingWeaknesses,
  markSpeakingAnswersPending,
  mergeMockTestSpeakingScores,
} from "@/lib/speaking/speaking-evaluation-submit";
import { serializeWritingAnswersForAttempt } from "@/lib/writing/writing-utils";
import { serializeSpeakingAnswersForAttempt } from "@/lib/speaking/speaking-utils";
import { isSpeakingQuestion } from "@/lib/speaking/speaking-utils";
import { isWritingQuestion } from "@/lib/writing/writing-utils";
import { getSpeakingEvaluationFromAnswer } from "@/lib/speaking/speaking-evaluation";
import { getWritingEvaluationFromAnswer } from "@/lib/writing/writing-evaluation";

export function serializeCambridgeAiAnswersForAttempt(
  answers: Record<string, UserAnswer>
): Record<string, UserAnswer> {
  return serializeSpeakingAnswersForAttempt(serializeWritingAnswersForAttempt(answers));
}

export function hasCambridgeAiEvaluatedQuestions(questions: Question[]): boolean {
  return hasWritingQuestions(questions) || hasSpeakingQuestions(questions);
}

export function markCambridgeAiAnswersPending(
  questions: Question[],
  answers: Record<string, UserAnswer>
): Record<string, UserAnswer> {
  let out = markWritingAnswersPending(questions, answers);
  out = markSpeakingAnswersPending(questions, out);
  return out;
}

export async function runCambridgeAiEvaluationPipeline(input: {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  level?: string;
  locale?: string;
}) {
  const normalizedAnswers = serializeCambridgeAiAnswersForAttempt(input.answers);
  const hasWriting = hasWritingQuestions(input.questions);
  const hasSpeaking = hasSpeakingQuestions(input.questions);

  let enrichedAnswers = normalizedAnswers;
  let questionResults = scoreExercise(input.questions, enrichedAnswers).questionResults;
  const analyticsWeaknesses: string[] = [];
  const writingPersistence: Awaited<
    ReturnType<typeof runWritingEvaluationPipeline>
  >["persistenceInputs"] = [];
  const speakingPersistence: Awaited<
    ReturnType<typeof runSpeakingEvaluationPipeline>
  >["persistenceInputs"] = [];

  if (hasWriting) {
    const writing = await runWritingEvaluationPipeline({
      questions: input.questions,
      answers: enrichedAnswers,
      level: input.level,
      locale: input.locale,
    });
    enrichedAnswers = writing.enrichedAnswers;
    questionResults = writing.questionResults;
    analyticsWeaknesses.push(...flattenWritingWeaknesses(writing.analyticsSignals));
    writingPersistence.push(...writing.persistenceInputs);
  }

  if (hasSpeaking) {
    const speaking = await runSpeakingEvaluationPipeline({
      questions: input.questions,
      answers: enrichedAnswers,
      level: input.level,
      locale: input.locale,
    });
    enrichedAnswers = speaking.enrichedAnswers;
    questionResults = mergeSpeakingIntoQuestionResults(
      input.questions,
      enrichedAnswers,
      questionResults
    );
    analyticsWeaknesses.push(...flattenSpeakingWeaknesses(speaking.analyticsSignals));
    speakingPersistence.push(...speaking.persistenceInputs);
  }

  if (hasWriting && hasSpeaking) {
    questionResults = mergeWritingIntoQuestionResults(
      input.questions,
      enrichedAnswers,
      questionResults
    );
  }

  const metrics = computeCambridgeHybridMetrics(input.questions, enrichedAnswers, questionResults);

  return {
    enrichedAnswers,
    questionResults,
    score: metrics.score,
    maxScore: metrics.maxScore,
    accuracyPercent: metrics.accuracyPercent,
    analyticsWeaknesses: [...new Set(analyticsWeaknesses)],
    writingPersistence,
    speakingPersistence,
  };
}

export function computeCambridgeHybridMetrics(
  questions: Question[],
  answers: Record<string, UserAnswer>,
  questionResults: QuestionResult[]
): { score: number; maxScore: number; accuracyPercent: number } {
  let score = 0;
  let maxScore = 0;
  let percentSum = 0;

  const resultMap = new Map(questionResults.map((r) => [r.questionId, r]));

  for (const q of questions) {
    const result = resultMap.get(q.id);
    const max = result?.maxPoints ?? q.points;
    const earned = result?.pointsEarned ?? 0;
    score += earned;
    maxScore += max;

    if (isWritingQuestion(q)) {
      const envelope = getWritingEvaluationFromAnswer(answers[q.id]);
      if (envelope?.status === "completed" && envelope.result) {
        percentSum += envelope.result.overallScore;
      }
    } else if (isSpeakingQuestion(q)) {
      const envelope = getSpeakingEvaluationFromAnswer(answers[q.id]);
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

export function mergeMockTestCambridgeAiScores(
  sections: Array<{
    skillSlug: string | null;
    title: string;
    questions: Array<{ id: string }>;
  }>,
  answers: Record<string, UserAnswer>,
  baseBreakdown: Record<string, number>
): Record<string, number> {
  const withWriting = mergeMockTestWritingScores(sections, answers, baseBreakdown);
  return mergeMockTestSpeakingScores(sections, answers, withWriting);
}

