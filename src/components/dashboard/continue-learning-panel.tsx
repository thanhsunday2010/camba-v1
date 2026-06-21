import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { LessonCard } from "@/components/camba/cards/learning-cards";
import { RecommendationCard } from "@/components/camba/cards/mission-reward-cards";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Button } from "@/components/ui/button";
import type { NextLessonContext } from "@/lib/queries/dashboard";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import { BookOpen, ArrowRight, Map } from "lucide-react";

interface ContinueLearningPanelProps {
  nextLesson: NextLessonContext | null;
  secondaryRecommendations?: { id: string; title: string; description: string | null }[];
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
    recommended: string;
    notStarted: string;
    skillPrefix: string;
    unitPrefix: string;
  };
  skillLabel?: string;
}

function lessonState(completion: number): LessonVisualState {
  if (completion <= 0) return "recommended";
  if (completion >= 100) return "completed";
  return "in-progress";
}

function stateLabel(completion: number, labels: ContinueLearningPanelProps["labels"]) {
  if (completion <= 0) return labels.recommended;
  if (completion >= 100) return labels.inProgress;
  return labels.inProgress;
}

export function ContinueLearningPanel({
  nextLesson,
  secondaryRecommendations = [],
  labels,
  skillLabel,
}: ContinueLearningPanelProps) {
  const subtitle = nextLesson?.unitTitle
    ? `${labels.unitPrefix}: ${nextLesson.unitTitle}${skillLabel ? ` · ${labels.skillPrefix}: ${skillLabel}` : ""}`
    : labels.subtitle;

  return (
    <section aria-labelledby="continue-learning-heading">
      <SectionHeader
        title={labels.title}
        description={subtitle}
        icon={Map}
        action={
          <Link href="/learning">
            <Button variant="ghost" size="sm">
              {labels.viewPath}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      {nextLesson ? (
        <div className="space-y-3">
          <LessonCard
            title={nextLesson.title}
            subtitle={`${nextLesson.estimated_minutes} ${labels.minutes}${nextLesson.completionPercent > 0 ? ` · ${nextLesson.completionPercent}%` : ""}`}
            href={`/learning/lesson/${nextLesson.id}`}
            state={lessonState(nextLesson.completionPercent)}
            stateLabel={stateLabel(nextLesson.completionPercent, labels)}
            recommended
          />
          {secondaryRecommendations.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {secondaryRecommendations.slice(0, 2).map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  title={rec.title}
                  description={rec.description ?? labels.subtitle}
                />
              ))}
            </div>
          )}
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
