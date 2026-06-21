import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { MasteryBadge } from "@/components/camba/primitives/lesson-status-pill";
import { Button } from "@/components/ui/button";
import type { LessonPageProgress } from "@/lib/learning/lesson-page-types";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface LessonCompleteStateProps {
  completionPercentResolved: number;
  serverProgress: LessonPageProgress;
  completedCount: number;
  totalCount: number;
  masteryLabel: string;
  labels: {
    lessonCompleteTitle: string;
    lessonCompleteDescription: string;
    backToPath: string;
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
  labels,
}: LessonCompleteStateProps) {
  return (
    <CambaCard
      variant="elevated"
      padding="lg"
      className="border-success/25 bg-success/5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="camba-icon-box-lg shrink-0 bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="camba-h2 text-foreground">{labels.lessonCompleteTitle}</h2>
          <p className="camba-body text-muted mt-1">{labels.lessonCompleteDescription}</p>
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
              level={Math.min(4, Math.max(0, serverProgress.masteryLevel)) as 0 | 1 | 2 | 3 | 4}
              label={masteryLabel}
            />
          </div>
        </div>
        <Link href="/learning" className="shrink-0">
          <Button variant="quest" className="gap-2 w-full sm:w-auto">
            {labels.backToPath}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </CambaCard>
  );
}
