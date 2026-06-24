import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { LearningProgressPortfolio } from "@/lib/profile/student-profile-types";
import { BookOpen, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

export type LearningProgressSectionLabels = {
  title: string;
  subtitle: string;
  currentUnit: string;
  currentLesson: string;
  unitsCompleted: string;
  lessonsCompleted: string;
  progress: string;
  nextMilestone: string;
  viewJourney: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
};

interface LearningProgressSectionProps {
  learning: LearningProgressPortfolio;
  labels: LearningProgressSectionLabels;
}

export function LearningProgressSection({ learning, labels }: LearningProgressSectionProps) {
  return (
    <section aria-labelledby="profile-learning-heading">
      <SectionHeader
        titleId="profile-learning-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={BookOpen}
        action={
          <Link href={learning.journeyHref}>
            <Button variant="ghost" size="sm">
              {labels.viewJourney}
            </Button>
          </Link>
        }
      />

      {!learning.hasProgress ? (
        <DashboardEmptyState
          icon={Route}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      ) : (
        <CambaCard variant="lesson" padding="md" className="space-y-4">
          {(learning.currentUnitTitle || learning.currentLessonTitle) && (
            <div>
              {learning.currentUnitTitle && (
                <p className="camba-caption text-muted">
                  {labels.currentUnit}:{" "}
                  <span className="font-semibold text-foreground">{learning.currentUnitTitle}</span>
                </p>
              )}
              {learning.currentLessonTitle && (
                <p className="camba-body font-semibold text-foreground mt-1">
                  {labels.currentLesson}: {learning.currentLessonTitle}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 camba-caption">
            <div>
              <p className="text-muted">{labels.unitsCompleted}</p>
              <p className="camba-stat text-foreground">{learning.unitsCompleted}</p>
            </div>
            <div>
              <p className="text-muted">{labels.lessonsCompleted}</p>
              <p className="camba-stat text-foreground">{learning.lessonsCompleted}</p>
            </div>
            <div>
              <p className="text-muted">{labels.progress}</p>
              <p className="camba-stat text-program">{learning.progressPercent}%</p>
            </div>
          </div>
          {learning.nextMilestoneTitle && (
            <p className="camba-caption text-program font-medium">
              {labels.nextMilestone}: {learning.nextMilestoneTitle}
            </p>
          )}
        </CambaCard>
      )}
    </section>
  );
}
