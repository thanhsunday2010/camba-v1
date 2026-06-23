import type { QuestionResult, Question } from "@/types/learning";
import { extractQuestionIntelligenceMetadata } from "@/lib/learning/question-metadata";
import { grammarTagLabel } from "@/lib/learning/grammar-taxonomy";
import { vocabularyTopicLabel } from "@/lib/learning/vocabulary-taxonomy";

export type LearnerAnalyticsQuestion = Pick<Question, "id" | "content">;

export type LearnerAttemptSlice = {
  questionResults: QuestionResult[];
};

export type LearnerSkillAnalytics = {
  strengths: string[];
  weaknesses: string[];
  grammarBreakdown: Record<string, number>;
  vocabularyBreakdown: Record<string, number>;
};

/** Percent at or above this is a strength; below weakness threshold is a weakness. */
export const LEARNER_ANALYTICS_STRENGTH_THRESHOLD = 70;

/** Percent below this is flagged as a weakness. */
export const LEARNER_ANALYTICS_WEAKNESS_THRESHOLD = 55;

type TagAccumulator = {
  earned: number;
  max: number;
};

function accumulateTagBreakdown(
  questions: LearnerAnalyticsQuestion[],
  questionResults: QuestionResult[],
  pickTags: (q: LearnerAnalyticsQuestion) => string[]
): Record<string, number> {
  const resultMap = new Map(questionResults.map((r) => [r.questionId, r]));
  const acc = new Map<string, TagAccumulator>();

  for (const question of questions) {
    const result = resultMap.get(question.id);
    if (!result) continue;
    const tags = pickTags(question);
    if (tags.length === 0) continue;

    for (const tag of tags) {
      const bucket = acc.get(tag) ?? { earned: 0, max: 0 };
      bucket.earned += result.pointsEarned;
      bucket.max += result.maxPoints;
      acc.set(tag, bucket);
    }
  }

  const breakdown: Record<string, number> = {};
  for (const [tag, { earned, max }] of acc) {
    if (max > 0) breakdown[tag] = Math.round((earned / max) * 100);
  }
  return breakdown;
}

function pickStrengthsAndWeaknesses(
  breakdown: Record<string, number>,
  labelFn: (slug: string) => string
): { strengths: string[]; weaknesses: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const [slug, percent] of Object.entries(breakdown)) {
    if (percent >= LEARNER_ANALYTICS_STRENGTH_THRESHOLD) {
      strengths.push(labelFn(slug));
    } else if (percent < LEARNER_ANALYTICS_WEAKNESS_THRESHOLD) {
      weaknesses.push(labelFn(slug));
    }
  }

  return {
    strengths: strengths.sort((a, b) => a.localeCompare(b)),
    weaknesses: weaknesses.sort((a, b) => a.localeCompare(b)),
  };
}

/**
 * Deterministic learner grammar/vocabulary analytics from one or more attempts.
 * Infrastructure only — no UI, no AI recommendations.
 */
export function computeLearnerSkillAnalytics(
  questions: LearnerAnalyticsQuestion[],
  attempts: LearnerAttemptSlice[]
): LearnerSkillAnalytics {
  const bestByQuestion = new Map<string, QuestionResult>();

  for (const attempt of attempts) {
    for (const result of attempt.questionResults) {
      const existing = bestByQuestion.get(result.questionId);
      if (!existing || result.pointsEarned > existing.pointsEarned) {
        bestByQuestion.set(result.questionId, result);
      }
    }
  }
  const mergedResults = [...bestByQuestion.values()];

  const grammarBreakdown = accumulateTagBreakdown(
    questions,
    mergedResults,
    (q) => extractQuestionIntelligenceMetadata({ content: q.content }).grammarTags
  );
  const vocabularyBreakdown = accumulateTagBreakdown(
    questions,
    mergedResults,
    (q) => extractQuestionIntelligenceMetadata({ content: q.content }).vocabularyTopics
  );

  const grammarLabels = pickStrengthsAndWeaknesses(grammarBreakdown, grammarTagLabel);
  const vocabLabels = pickStrengthsAndWeaknesses(vocabularyBreakdown, vocabularyTopicLabel);

  return {
    strengths: [...grammarLabels.strengths, ...vocabLabels.strengths],
    weaknesses: [...grammarLabels.weaknesses, ...vocabLabels.weaknesses],
    grammarBreakdown,
    vocabularyBreakdown,
  };
}
