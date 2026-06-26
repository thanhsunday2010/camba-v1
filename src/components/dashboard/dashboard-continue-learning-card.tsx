import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { LessonCard } from "@/components/camba/cards/learning-cards";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Button } from "@/components/ui/button";
import type { NextLessonContext } from "@/lib/queries/dashboard";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import { BookOpen, ArrowRight } from "lucide-react";

interface DashboardContinueLearningCardProps {
  nextLesson: NextLessonContext | null;
  labels: {
    title: string;
    subtitle: string;
    continueLesson: string;
    startLearning: string;
    viewPath: string;
    minutes: string;
    emptyTitle: string;
    emptyDescription: string;
    inProgress: string;
    lastActivity: string;
    unitPrefix: string;
  };
  skillLabel?: string;
  compact?: boolean;
}

function lessonState(completion: number): LessonVisualState {
  if (completion <= 0) return "recommended";
  if (completion >= 100) return "completed";
  return "in-progress";
}

function formatRelativeDate(iso: string, lastActivityLabel: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return `${lastActivityLabel}: today`;
  if (diffDays === 1) return `${lastActivityLabel}: yesterday`;
  return `${lastActivityLabel}: ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export function DashboardContinueLearningCard({
  nextLesson,
  labels,
  skillLabel,
  compact = false,
}: DashboardContinueLearningCardProps) {
  const subtitle = nextLesson?.unitTitle
    ? `${labels.unitPrefix}: ${nextLesson.unitTitle}${skillLabel ? ` · ${skillLabel}` : ""}`
    : compact
      ? undefined
      : labels.subtitle;

  return (
    <section aria-labelledby="continue-learning-heading">
      <SectionHeader
        titleId="continue-learning-heading"
        title={labels.title}
        description={subtitle}
        icon={BookOpen}
        action={
          <Link href="/learning">
            <Button variant="ghost" size="sm">
              {labels.viewPath}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
        }
      />

      {nextLesson ? (
        <div className="space-y-2">
          <LessonCard
            title={nextLesson.title}
            subtitle={
              compact
                ? `${nextLesson.estimated_minutes} ${labels.minutes}`
                : `${nextLesson.estimated_minutes} ${labels.minutes} · ${nextLesson.completionPercent}%${
                    nextLesson.lastActivityAt
                      ? ` · ${formatRelativeDate(nextLesson.lastActivityAt, labels.lastActivity)}`
                      : ""
                  }`
            }
            href={`/learning/lesson/${nextLesson.id}`}
            state={lessonState(nextLesson.completionPercent)}
            stateLabel={
              nextLesson.completionPercent > 0 ? labels.inProgress : labels.continueLesson
            }
            recommended
          />
          <Link href={`/learning/lesson/${nextLesson.id}`} className="camba-focus-ring rounded-xl block">
            <Button variant="quest" size={compact ? "default" : "default"} className="w-full sm:w-auto">
              {nextLesson.completionPercent > 0 ? labels.continueLesson : labels.startLearning}
              <ArrowRight className="h-4 w-4 ml-1" aria-hidden />
            </Button>
          </Link>
        </div>
      ) : (
        <DashboardEmptyState
          icon={BookOpen}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.startLearning}
          actionHref="/learning"
        />
      )}
    </section>
  );
}
