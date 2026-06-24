import type { WritingAnalyticsSignals } from "@/lib/writing/writing-evaluation-types";

/** Reusable analytics view model for M1 adaptive learning (no dashboard coupling). */
export type WritingEvaluationAnalyticsRecord = {
  questionId: string;
  taskType?: string;
  overallScore: number;
  grammarWeaknesses: string[];
  vocabularyWeaknesses: string[];
  allWeaknesses: string[];
};

export function toWritingEvaluationAnalyticsRecords(
  signals: WritingAnalyticsSignals[]
): WritingEvaluationAnalyticsRecord[] {
  return signals.map((s) => ({
    questionId: s.questionId,
    taskType: s.taskType,
    overallScore: s.overallScore,
    grammarWeaknesses: s.grammarWeaknesses,
    vocabularyWeaknesses: s.vocabularyWeaknesses,
    allWeaknesses: [
      ...s.grammarWeaknesses,
      ...s.vocabularyWeaknesses,
      ...s.organizationWeaknesses,
      ...s.taskAchievementWeaknesses,
      ...s.overallWeaknesses,
    ],
  }));
}

export function mergeWritingAnalyticsIntoSkillWeaknesses(
  existingWeaknesses: string[],
  signals: WritingAnalyticsSignals[]
): string[] {
  const fromWriting = signals.flatMap((s) => [
    ...s.grammarWeaknesses.map((w) => `grammar:${w}`),
    ...s.vocabularyWeaknesses.map((w) => `vocabulary:${w}`),
  ]);
  return [...new Set([...existingWeaknesses, ...fromWriting])];
}
