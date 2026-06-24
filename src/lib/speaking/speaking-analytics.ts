import type { SpeakingAnalyticsSignals } from "@/lib/speaking/speaking-evaluation-types";

export type SpeakingEvaluationAnalyticsRecord = {
  questionId: string;
  taskType?: string;
  overallScore: number;
  grammarWeaknesses: string[];
  vocabularyWeaknesses: string[];
  allWeaknesses: string[];
};

export function toSpeakingEvaluationAnalyticsRecords(
  signals: SpeakingAnalyticsSignals[]
): SpeakingEvaluationAnalyticsRecord[] {
  return signals.map((s) => ({
    questionId: s.questionId,
    taskType: s.taskType,
    overallScore: s.overallScore,
    grammarWeaknesses: s.grammarWeaknesses,
    vocabularyWeaknesses: s.vocabularyWeaknesses,
    allWeaknesses: [
      ...s.grammarWeaknesses,
      ...s.vocabularyWeaknesses,
      ...s.pronunciationWeaknesses,
      ...s.fluencyWeaknesses,
      ...s.overallWeaknesses,
    ],
  }));
}
