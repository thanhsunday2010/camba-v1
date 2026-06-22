import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { MockTestReviewSection } from "@/components/mock-tests/mock-test-review-section";
import { MockTestSkillBreakdown } from "@/components/mock-tests/mock-test-skill-breakdown";
import type {
  MockTestAttemptSummary,
  MockTestCompleteLabels,
  MockTestReviewLabels,
} from "@/lib/mock-tests/mock-test-types";
import { ArrowRight, ListChecks, RotateCcw, Shield, Trophy } from "lucide-react";

interface MockTestCompleteSummaryProps {
  testTitle: string;
  attempt: MockTestAttemptSummary;
  takeHref: string;
  hubHref?: string;
  detailHref?: string;
  labels: MockTestCompleteLabels;
  reviewLabels: MockTestReviewLabels;
  showActions?: boolean;
  ctaVariant?: "detail" | "take";
  onReviewTest?: () => void;
  onRetake?: () => void;
  onReviewSkill?: (skill: string) => void;
}

function getRecommendationCopy(
  variant: MockTestAttemptSummary["recommendationVariant"],
  labels: MockTestCompleteLabels
): { headline: string; support: string } {
  switch (variant) {
    case "great-job":
      return {
        headline: labels.recommendationGreatJob,
        support: labels.supportGreatJob,
      };
    case "solid":
      return {
        headline: labels.recommendationSolid,
        support: labels.supportSolid,
      };
    case "needs-review":
      return {
        headline: labels.recommendationNeedsReview,
        support: labels.supportNeedsReview,
      };
  }
}

export function MockTestCompleteSummary({
  testTitle,
  attempt,
  takeHref,
  hubHref = "/mock-tests",
  detailHref,
  labels,
  reviewLabels,
  showActions = true,
  ctaVariant = "detail",
  onReviewTest,
  onRetake,
  onReviewSkill,
}: MockTestCompleteSummaryProps) {
  const recommendation = getRecommendationCopy(attempt.recommendationVariant, labels);
  const isPositive = attempt.recommendationVariant === "great-job";

  return (
    <CambaCard
      variant="elevated"
      padding="lg"
      className="relative overflow-hidden border-2 border-[var(--status-mock-test)]/30 bg-gradient-to-br from-[var(--status-mock-test)]/10 via-white to-program/5"
    >
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="camba-icon-box-lg shrink-0 bg-[var(--status-mock-test)]/15 text-[var(--status-mock-test)] mx-auto sm:mx-0">
            <Trophy className="h-8 w-8" />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="camba-display text-xl sm:text-2xl text-foreground">
              {labels.title}
            </h2>
            <p className="camba-body text-muted mt-1">{labels.victorySubtitle}</p>
            <p className="camba-caption text-muted mt-1">{testTitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[var(--status-mock-test)]/10 border border-[var(--status-mock-test)]/20 px-3 py-3 text-center sm:text-left">
            <p className="camba-caption text-[var(--status-mock-test)] font-semibold uppercase tracking-wide text-[10px]">
              {labels.overallScore}
            </p>
            <p className="camba-stat text-2xl text-foreground mt-0.5">
              {attempt.scorePercent}%
            </p>
          </div>
          <div className="rounded-xl bg-white border border-border px-3 py-3 text-center sm:text-left">
            <p className="camba-caption text-muted font-semibold uppercase tracking-wide text-[10px]">
              {labels.rawScore}
            </p>
            <p className="camba-stat text-lg text-foreground mt-0.5 tabular-nums">
              {attempt.score}/{attempt.maxScore}
            </p>
          </div>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 ${
            isPositive
              ? "bg-success/8 border border-success/20"
              : "bg-orange-50/80 border border-orange-200/50"
          }`}
        >
          <p className="camba-body font-medium text-foreground">{recommendation.headline}</p>
          <p className="camba-caption text-muted mt-1">{recommendation.support}</p>
        </div>

        <MockTestSkillBreakdown
          skillBreakdown={attempt.skillBreakdown}
          labels={labels}
        />

        {Object.keys(attempt.shieldEstimate).length > 0 && (
          <div className="space-y-2">
            <p className="camba-caption font-semibold text-muted uppercase tracking-wide flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              {labels.shieldsTitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(attempt.shieldEstimate).map(([skill, shield]) => (
                <span
                  key={skill}
                  className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full capitalize"
                >
                  {skill}: {shield}/15
                </span>
              ))}
            </div>
            <p className="camba-caption text-muted text-[11px]">{labels.shieldsNote}</p>
          </div>
        )}

        <p className="camba-caption text-muted">{labels.performanceNote}</p>

        <MockTestReviewSection
          skillBreakdown={attempt.skillBreakdown}
          labels={reviewLabels}
          onReviewSkill={onReviewSkill}
        />

        {showActions && ctaVariant === "detail" && (
          <div className="flex flex-col gap-2 pt-1">
            <Button variant="quest" size="lg" className="gap-2 w-full" asChild>
              <Link href={takeHref}>
                <RotateCcw className="h-4 w-4" />
                {labels.retakeTest}
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 w-full" asChild>
              <Link href={hubHref}>
                {labels.backToHub}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {showActions && ctaVariant === "take" && (
          <div className="flex flex-col gap-2 pt-1">
            {onReviewTest && (
              <Button
                type="button"
                variant="quest"
                size="lg"
                className="gap-2 w-full"
                onClick={onReviewTest}
              >
                <ListChecks className="h-4 w-4" />
                {labels.reviewTest}
              </Button>
            )}
            {onRetake ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="gap-2 w-full"
                onClick={onRetake}
              >
                <RotateCcw className="h-4 w-4" />
                {labels.retakeTest}
              </Button>
            ) : (
              <Button variant="outline" size="lg" className="gap-2 w-full" asChild>
                <Link href={takeHref}>
                  <RotateCcw className="h-4 w-4" />
                  {labels.retakeTest}
                </Link>
              </Button>
            )}
            {detailHref && (
              <Button variant="ghost" size="sm" className="gap-2 w-full" asChild>
                <Link href={detailHref}>{labels.backToDetail}</Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="gap-2 w-full" asChild>
              <Link href={hubHref}>
                {labels.backToHub}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </CambaCard>
  );
}
