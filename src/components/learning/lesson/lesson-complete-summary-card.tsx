import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { MasteryBadge } from "@/components/camba/primitives/lesson-status-pill";
import { Button } from "@/components/ui/button";
import { getLessonCompleteRecommendationVariant } from "@/lib/learning/lesson-ui-utils";
import type {
  LessonCompleteRecommendationVariant,
  LessonCompleteSummaryLabels,
  LessonNextPathLesson,
  LessonPageContext,
  LessonPageProgress,
  ResolvedLessonProgress,
} from "@/lib/learning/lesson-page-types";
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles, Trophy } from "lucide-react";

interface LessonCompleteSummaryCardProps {
  context: LessonPageContext;
  serverProgress: LessonPageProgress;
  resolvedProgress: ResolvedLessonProgress;
  masteryLabel: string;
  nextPathLesson: LessonNextPathLesson;
  reviewableExerciseCount: number;
  finalExerciseAccuracy?: number | null;
  onReviewLesson?: () => void;
  labels: LessonCompleteSummaryLabels;
}

function getRecommendationText(
  variant: LessonCompleteRecommendationVariant,
  labels: LessonCompleteSummaryLabels,
  reviewableCount: number
): string {
  switch (variant) {
    case "exercisesNeedReview":
      return labels.recommendationExercisesNeedReview.replace(
        "{count}",
        String(reviewableCount)
      );
    case "lessonNeedsReview":
      return labels.recommendationLessonNeedsReview;
    case "finalQuizLow":
      return labels.recommendationFinalQuizLow;
    case "greatJobContinue":
      return labels.recommendationGreatJob;
  }
}

function getRecommendationSupport(
  variant: LessonCompleteRecommendationVariant,
  labels: LessonCompleteSummaryLabels
): string {
  switch (variant) {
    case "exercisesNeedReview":
      return labels.recommendationSupportReview;
    case "lessonNeedsReview":
      return labels.recommendationSupportLessonReview;
    case "finalQuizLow":
      return labels.recommendationSupportFinalQuiz;
    case "greatJobContinue":
      return labels.recommendationSupportGreatJob;
  }
}

export function LessonCompleteSummaryCard({
  context,
  serverProgress,
  resolvedProgress,
  masteryLabel,
  nextPathLesson,
  reviewableExerciseCount,
  finalExerciseAccuracy,
  onReviewLesson,
  labels,
}: LessonCompleteSummaryCardProps) {
  const recommendationVariant = getLessonCompleteRecommendationVariant(
    serverProgress,
    resolvedProgress.isLessonCompleteResolved,
    reviewableExerciseCount,
    finalExerciseAccuracy
  );
  const recommendationText = getRecommendationText(
    recommendationVariant,
    labels,
    reviewableExerciseCount
  );
  const recommendationSupport = getRecommendationSupport(recommendationVariant, labels);
  const isPositive = recommendationVariant === "greatJobContinue";

  const contextLine = [context.skillName, context.unitTitle].filter(Boolean).join(" · ");

  return (
    <CambaCard
      variant="elevated"
      padding="lg"
      className="relative overflow-hidden border-2 border-success/40 bg-gradient-to-br from-success/15 via-white to-program/8 shadow-lg ring-2 ring-success/15"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-success/10 blur-3xl"
        aria-hidden
      />
      <div className="relative space-y-6">
        {/* Victory headline */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="camba-icon-box-lg shrink-0 bg-success/20 text-success ring-4 ring-success/15 mx-auto sm:mx-0">
            <Trophy className="h-9 w-9" />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
            <h2 className="camba-display text-foreground text-xl sm:text-2xl leading-tight">
              {labels.title}
            </h2>
            {labels.victorySubtitle && (
              <p className="camba-body text-muted">{labels.victorySubtitle}</p>
            )}
            {contextLine && (
              <p className="camba-caption text-muted pt-0.5">{contextLine}</p>
            )}
          </div>
        </div>

        {/* Lesson-level metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="rounded-xl bg-success/10 border border-success/20 px-3 py-2.5 text-center sm:text-left">
            <p className="camba-caption text-success font-semibold uppercase tracking-wide text-[10px]">
              {labels.metricLabelExercises}
            </p>
            <p className="camba-stat text-lg text-foreground mt-0.5">
              {resolvedProgress.completedCount}/{resolvedProgress.totalExercises}
            </p>
          </div>
          <div className="rounded-xl bg-program-muted border border-program/15 px-3 py-2.5 text-center sm:text-left">
            <p className="camba-caption text-program font-semibold uppercase tracking-wide text-[10px]">
              {labels.metricLabelLesson}
            </p>
            <p className="camba-stat text-lg text-program mt-0.5">
              {resolvedProgress.completionPercentResolved}%
            </p>
          </div>
          {serverProgress.accuracyPercent > 0 && (
            <div className="rounded-xl bg-white border border-border px-3 py-2.5 text-center sm:text-left">
              <p className="camba-caption text-muted font-semibold uppercase tracking-wide text-[10px]">
                {labels.metricLabelAccuracy}
              </p>
              <p className="camba-stat text-lg text-foreground mt-0.5">
                {serverProgress.accuracyPercent}%
              </p>
            </div>
          )}
          <div className="rounded-xl bg-white border border-border px-3 py-2.5 flex flex-col items-center sm:items-start justify-center col-span-2 sm:col-span-1">
            <MasteryBadge
              level={
                Math.min(4, Math.max(0, serverProgress.masteryLevel)) as
                  | 0
                  | 1
                  | 2
                  | 3
                  | 4
              }
              label={masteryLabel}
            />
          </div>
        </div>

        <p className="camba-caption text-muted text-center sm:text-left">
          {labels.performanceNote}
        </p>

        {/* Recommendation */}
        <div
          className={`rounded-2xl px-4 py-3 space-y-1 ${
            isPositive
              ? "bg-success/8 border border-success/20"
              : "bg-orange-50/80 border border-orange-200/50"
          }`}
        >
          <div className="flex items-start gap-2">
            <CheckCircle2
              className={`h-4 w-4 shrink-0 mt-0.5 ${isPositive ? "text-success" : "text-[var(--status-needs-review)]"}`}
            />
            <div className="min-w-0">
              <p className="camba-body font-medium text-foreground">{recommendationText}</p>
              <p className="camba-caption text-muted mt-1">{recommendationSupport}</p>
            </div>
          </div>
        </div>

        {/* CTA zone */}
        <div className="rounded-2xl bg-[var(--surface-sunken)]/50 border border-border/80 px-4 py-4 space-y-3">
          <p className="camba-caption font-semibold text-muted uppercase tracking-wide">
            {labels.ctaZoneTitle}
          </p>
          <div className="flex flex-col gap-2">
            {nextPathLesson ? (
              <Button variant="quest" size="lg" className="gap-2 w-full" asChild>
                <Link href={`/learning/lesson/${nextPathLesson.id}`}>
                  <Sparkles className="h-4 w-4" />
                  {labels.nextPathLesson.replace("{lesson}", nextPathLesson.title)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="quest" size="lg" className="gap-2 w-full" asChild>
                <Link href="/learning">
                  {labels.backToPath}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {onReviewLesson && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="gap-2 w-full"
                onClick={onReviewLesson}
              >
                <RotateCcw className="h-4 w-4" />
                {labels.retryLesson}
              </Button>
            )}
            {nextPathLesson && (
              <Button variant="ghost" size="sm" className="gap-2 w-full" asChild>
                <Link href="/learning">
                  {labels.backToPath}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </CambaCard>
  );
}
