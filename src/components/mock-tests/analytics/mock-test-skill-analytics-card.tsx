import { CambaCard } from "@/components/camba/primitives/camba-card";
import { AnalyticsEmptyState } from "@/components/mock-tests/analytics/analytics-empty-state";
import { GrammarInsightSection } from "@/components/mock-tests/analytics/grammar-insight-section";
import { VocabularyInsightSection } from "@/components/mock-tests/analytics/vocabulary-insight-section";
import { resolveAnalyticsDisplayMode } from "@/lib/mock-tests/analytics-empty-state-mode";
import type {
  MockTestAnalyticsLabels,
  MockTestSkillAnalytics,
} from "@/lib/mock-tests/mock-test-analytics-types";
import { Lightbulb } from "lucide-react";

interface MockTestSkillAnalyticsCardProps {
  analytics: MockTestSkillAnalytics | null;
  labels: MockTestAnalyticsLabels;
  hasAttempt: boolean;
  /** When embedded inside complete summary, omit outer card chrome. */
  variant?: "card" | "embedded";
}

export function MockTestSkillAnalyticsCard({
  analytics,
  labels,
  hasAttempt,
  variant = "card",
}: MockTestSkillAnalyticsCardProps) {
  const displayMode = resolveAnalyticsDisplayMode(hasAttempt, analytics);

  if (displayMode === "no-attempt" && variant === "card") {
    return null;
  }

  const body = (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="camba-icon-box shrink-0 bg-program/10 text-program">
          <Lightbulb className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="camba-h3 text-foreground">{labels.learningInsights}</h3>
          <p className="camba-caption text-muted mt-0.5">{labels.title}</p>
        </div>
      </div>

      {displayMode === "ready" && analytics ? (
        <div className="space-y-6">
          <GrammarInsightSection
            breakdown={analytics.grammarBreakdown}
            strengths={analytics.grammarStrengths}
            weaknesses={analytics.grammarWeaknesses}
            labels={labels}
          />
          <VocabularyInsightSection
            breakdown={analytics.vocabularyBreakdown}
            strengths={analytics.vocabularyStrengths}
            weaknesses={analytics.vocabularyWeaknesses}
            labels={labels}
          />
        </div>
      ) : (
        <AnalyticsEmptyState
          mode={displayMode === "no-attempt" ? "no-attempt" : "insufficient-metadata"}
          labels={labels}
        />
      )}
    </div>
  );

  if (variant === "embedded") {
    return (
      <div className="rounded-2xl border border-border bg-white/60 px-4 py-4 sm:px-5 sm:py-5">
        {body}
      </div>
    );
  }

  return (
    <CambaCard variant="default" padding="md" className="border border-border">
      {body}
    </CambaCard>
  );
}
