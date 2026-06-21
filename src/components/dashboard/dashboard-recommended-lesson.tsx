import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { RecommendationCard } from "@/components/camba/cards/mission-reward-cards";
import { EmptyStateIllustrated } from "@/components/camba/empty-state-illustrated";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb } from "lucide-react";

interface DashboardRecommendedLessonProps {
  title: string;
  lessonTitle?: string;
  lessonHref?: string;
  estimatedMinutes?: number;
  minutesLabel: string;
  ctaLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}

export function DashboardRecommendedLesson({
  title,
  lessonTitle,
  lessonHref,
  estimatedMinutes,
  minutesLabel,
  ctaLabel,
  emptyTitle,
  emptyDescription,
}: DashboardRecommendedLessonProps) {
  return (
    <div>
      <SectionHeader title={title} icon={Lightbulb} />
      {lessonTitle && lessonHref ? (
        <RecommendationCard
          title={lessonTitle}
          description={
            estimatedMinutes != null
              ? `${estimatedMinutes} ${minutesLabel}`
              : emptyDescription
          }
          action={
            <Link href={lessonHref}>
              <Button variant="quest" size="sm">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        />
      ) : (
        <EmptyStateIllustrated
          icon={Lightbulb}
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={ctaLabel}
          actionHref="/learning"
        />
      )}
    </div>
  );
}
