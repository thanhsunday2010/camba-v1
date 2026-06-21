import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { MasteryBadge } from "@/components/camba/primitives/lesson-status-pill";
import { Button } from "@/components/ui/button";
import type { LessonNextPathLesson, LessonPageProgress } from "@/lib/learning/lesson-page-types";
import { CheckCircle2, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

interface LessonCompleteStateProps {
  completionPercentResolved: number;
  serverProgress: LessonPageProgress;
  completedCount: number;
  totalCount: number;
  masteryLabel: string;
  nextPathLesson: LessonNextPathLesson;
  onReviewLesson?: () => void;
  labels: {
    lessonCompleteTitle: string;
    lessonCompleteDescription: string;
    lessonCompletePerformance: string;
    backToPath: string;
    retryLesson: string;
    nextPathLesson: string;
    completedExercises: string;
    completionSummary: string;
    accuracy: string;
  };
}

export function LessonCompleteState({
  completionPercentResolved,
  serverProgress,
  completedCount,
  totalCount,
  masteryLabel,
  nextPathLesson,
  onReviewLesson,
  labels,
}: LessonCompleteStateProps) {
  return (
    <CambaCard
      variant="elevated"
      padding="lg"
      className="border-success/30 bg-gradient-to-br from-success/10 via-white to-program/5"
    >
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="camba-icon-box-lg shrink-0 bg-success/15 text-success ring-4 ring-success/10">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="camba-h2 text-foreground">{labels.lessonCompleteTitle}</h2>
            <p className="camba-body text-muted mt-1">{labels.lessonCompleteDescription}</p>
            <p className="camba-caption text-muted mt-2">{labels.lessonCompletePerformance}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="camba-caption text-muted">
                {labels.completedExercises}: {completedCount}/{totalCount}
              </span>
              <span className="camba-caption text-muted">
                {labels.completionSummary}: {completionPercentResolved}%
              </span>
              {serverProgress.accuracyPercent > 0 && (
                <span className="camba-caption text-muted">
                  {labels.accuracy}: {serverProgress.accuracyPercent}%
                </span>
              )}
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
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1">
          {nextPathLesson ? (
            <Button variant="quest" className="gap-2 w-full sm:w-auto" asChild>
              <Link href={`/learning/lesson/${nextPathLesson.id}`}>
                <Sparkles className="h-4 w-4" />
                {labels.nextPathLesson.replace("{lesson}", nextPathLesson.title)}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="quest" className="gap-2 w-full sm:w-auto" asChild>
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
              className="gap-2 w-full sm:w-auto"
              onClick={onReviewLesson}
            >
              <RotateCcw className="h-4 w-4" />
              {labels.retryLesson}
            </Button>
          )}
          {nextPathLesson && (
            <Button variant="ghost" className="gap-2 w-full sm:w-auto" asChild>
              <Link href="/learning">
                {labels.backToPath}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </CambaCard>
  );
}
