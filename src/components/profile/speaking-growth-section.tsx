import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { SpeakingGrowthPortfolio } from "@/lib/profile/student-profile-types";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SpeakingGrowthSectionLabels = {
  title: string;
  subtitle: string;
  tasksCompleted: string;
  averageScore: string;
  pronunciation: string;
  fluency: string;
  vocabulary: string;
  recent: string;
  trendImproving: string;
  trendStable: string;
  trendBuilding: string;
  viewLearning: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
};

interface SpeakingGrowthSectionProps {
  speaking: SpeakingGrowthPortfolio;
  labels: SpeakingGrowthSectionLabels;
}

export function SpeakingGrowthSection({ speaking, labels }: SpeakingGrowthSectionProps) {
  const trend =
    speaking.trendLabel === "improving"
      ? labels.trendImproving
      : speaking.trendLabel === "building"
        ? labels.trendBuilding
        : speaking.trendLabel === "stable"
          ? labels.trendStable
          : null;

  return (
    <section aria-labelledby="profile-speaking-heading">
      <SectionHeader
        titleId="profile-speaking-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={Mic}
        action={
          <Link href="/learning">
            <Button variant="ghost" size="sm">
              {labels.viewLearning}
            </Button>
          </Link>
        }
      />

      {!speaking.hasHistory ? (
        <DashboardEmptyState
          icon={Mic}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      ) : (
        <CambaCard variant="default" padding="md" className="space-y-4 border-[var(--status-speaking)]/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 camba-caption">
            <div>
              <p className="text-muted">{labels.tasksCompleted}</p>
              <p className="camba-stat text-[var(--status-speaking)]">{speaking.tasksCompleted}</p>
            </div>
            {speaking.averageScore != null && (
              <div>
                <p className="text-muted">{labels.averageScore}</p>
                <p className="camba-stat text-foreground">{speaking.averageScore}%</p>
              </div>
            )}
            {speaking.pronunciationAvg != null && (
              <div>
                <p className="text-muted">{labels.pronunciation}</p>
                <p className="font-semibold text-foreground">{speaking.pronunciationAvg}%</p>
              </div>
            )}
            {speaking.fluencyAvg != null && (
              <div>
                <p className="text-muted">{labels.fluency}</p>
                <p className="font-semibold text-foreground">{speaking.fluencyAvg}%</p>
              </div>
            )}
          </div>
          {trend && <p className="camba-caption text-muted">{trend}</p>}
          {speaking.recentItems.length > 0 && (
            <div>
              <p className="camba-caption font-semibold text-muted mb-2">{labels.recent}</p>
              <ol className="space-y-1">
                {speaking.recentItems.slice(0, 3).map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between camba-caption text-muted"
                  >
                    <span>
                      {new Date(item.completedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="font-semibold text-[var(--status-speaking)]">
                      {item.overallScore}%
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </CambaCard>
      )}
    </section>
  );
}
