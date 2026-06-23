import { computeLearnerSkillAnalytics } from "@/lib/learning/learner-skill-analytics";
import { grammarTagLabel } from "@/lib/learning/grammar-taxonomy";
import { vocabularyTopicLabel } from "@/lib/learning/vocabulary-taxonomy";
import { getSkillPerformanceBand } from "@/lib/mock-tests/skill-performance-band";
import type { QuestionResult } from "@/types/learning";
import type {
  GrammarInsight,
  MockTestAnalyticsQuestion,
  MockTestSkillAnalytics,
  SkillPerformanceBand,
  VocabularyInsight,
} from "@/lib/mock-tests/mock-test-analytics-types";

const TOP_INSIGHT_COUNT = 3;

function buildGrammarInsight(slug: string, percent: number): GrammarInsight {
  return {
    slug,
    label: grammarTagLabel(slug),
    percent,
    band: getSkillPerformanceBand(percent),
  };
}

function buildVocabularyInsight(slug: string, percent: number): VocabularyInsight {
  return {
    slug,
    label: vocabularyTopicLabel(slug),
    percent,
    band: getSkillPerformanceBand(percent),
  };
}

function sortBreakdownDesc<T extends { percent: number; label: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.percent - a.percent || a.label.localeCompare(b.label));
}

function topStrengths<T extends { band: SkillPerformanceBand; percent: number; label: string }>(
  items: T[]
): T[] {
  return sortBreakdownDesc(items.filter((i) => i.band === "strength")).slice(
    0,
    TOP_INSIGHT_COUNT
  );
}

function topWeaknesses<T extends { band: SkillPerformanceBand; percent: number; label: string }>(
  items: T[]
): T[] {
  return [...items]
    .filter((i) => i.band === "weakness")
    .sort((a, b) => a.percent - b.percent || a.label.localeCompare(b.label))
    .slice(0, TOP_INSIGHT_COUNT);
}

/**
 * View-model wrapper around M1.4 learner skill analytics for a single mock attempt.
 * No persistence — computed from questions + question results at read time.
 */
export function computeMockTestSkillAnalytics(
  questions: MockTestAnalyticsQuestion[],
  questionResults: QuestionResult[]
): MockTestSkillAnalytics {
  const raw = computeLearnerSkillAnalytics(questions, [{ questionResults }]);

  const grammarBreakdown = sortBreakdownDesc(
    Object.entries(raw.grammarBreakdown).map(([slug, percent]) =>
      buildGrammarInsight(slug, percent)
    )
  );
  const vocabularyBreakdown = sortBreakdownDesc(
    Object.entries(raw.vocabularyBreakdown).map(([slug, percent]) =>
      buildVocabularyInsight(slug, percent)
    )
  );

  return {
    grammarStrengths: topStrengths(grammarBreakdown),
    grammarWeaknesses: topWeaknesses(grammarBreakdown),
    vocabularyStrengths: topStrengths(vocabularyBreakdown),
    vocabularyWeaknesses: topWeaknesses(vocabularyBreakdown),
    grammarBreakdown,
    vocabularyBreakdown,
    hasData: grammarBreakdown.length > 0 || vocabularyBreakdown.length > 0,
  };
}
