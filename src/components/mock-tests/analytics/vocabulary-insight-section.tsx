import { SkillBreakdownList } from "@/components/mock-tests/analytics/skill-breakdown-list";
import { SkillStrengthList } from "@/components/mock-tests/analytics/skill-strength-list";
import { SkillWeaknessList } from "@/components/mock-tests/analytics/skill-weakness-list";
import type {
  MockTestAnalyticsLabels,
  VocabularyInsight,
} from "@/lib/mock-tests/mock-test-analytics-types";

interface VocabularyInsightSectionProps {
  breakdown: VocabularyInsight[];
  strengths: VocabularyInsight[];
  weaknesses: VocabularyInsight[];
  labels: MockTestAnalyticsLabels;
}

export function VocabularyInsightSection({
  breakdown,
  strengths,
  weaknesses,
  labels,
}: VocabularyInsightSectionProps) {
  if (breakdown.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="camba-caption font-semibold text-muted uppercase tracking-wide">
        {labels.vocabularyTitle}
      </p>

      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkillStrengthList items={strengths} labels={labels} />
          <SkillWeaknessList items={weaknesses} labels={labels} />
        </div>
      )}

      <SkillBreakdownList
        items={breakdown}
        labels={labels}
        listId="vocabulary-breakdown-list"
      />
    </div>
  );
}
