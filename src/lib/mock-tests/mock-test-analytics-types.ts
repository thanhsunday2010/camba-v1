import type { Question } from "@/types/learning";
import type { YleGrammarTag } from "@/lib/learning/grammar-taxonomy";
import type { YleVocabularyTopic } from "@/lib/learning/vocabulary-taxonomy";

export type SkillPerformanceBand = "strength" | "weakness" | "neutral";

export type AnalyticsEmptyStateMode = "no-attempt" | "insufficient-metadata";

/** Minimal question shape required for grammar/vocabulary analytics. */
export type MockTestAnalyticsQuestion = Pick<Question, "id" | "content">;

export type GrammarInsight = {
  slug: YleGrammarTag | string;
  label: string;
  percent: number;
  band: SkillPerformanceBand;
};

export type VocabularyInsight = {
  slug: YleVocabularyTopic | string;
  label: string;
  percent: number;
  band: SkillPerformanceBand;
};

export type MockTestSkillAnalytics = {
  grammarStrengths: GrammarInsight[];
  grammarWeaknesses: GrammarInsight[];
  vocabularyStrengths: VocabularyInsight[];
  vocabularyWeaknesses: VocabularyInsight[];
  grammarBreakdown: GrammarInsight[];
  vocabularyBreakdown: VocabularyInsight[];
  /** True when at least one grammar or vocabulary tag has scored data. */
  hasData: boolean;
};

export type MockTestAnalyticsLabels = {
  title: string;
  grammarTitle: string;
  vocabularyTitle: string;
  strengths: string;
  weaknesses: string;
  learningInsights: string;
  noAttemptTitle: string;
  noAttemptMessage: string;
  noAttemptAction: string;
  insufficientMetadataTitle: string;
  insufficientMetadataMessage: string;
  breakdownPercent: string;
  showAll: string;
  showLess: string;
};
