import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { WritingGrowthPortfolio } from "@/lib/profile/student-profile-types";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export type WritingGrowthSectionLabels = {
  title: string;
  subtitle: string;
  tasksCompleted: string;
  averageScore: string;
  strengths: string;
  improvements: string;
  recent: string;
  trendImproving: string;
  trendStable: string;
  trendBuilding: string;
  viewLearning: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
};

interface WritingGrowthSectionProps {
  writing: WritingGrowthPortfolio;
  labels: WritingGrowthSectionLabels;
}

export function WritingGrowthSection({ writing, labels }: WritingGrowthSectionProps) {
  const trend =
    writing.trendLabel === "improving"
      ? labels.trendImproving
      : writing.trendLabel === "building"
        ? labels.trendBuilding
        : writing.trendLabel === "stable"
          ? labels.trendStable
          : null;

  return (
    <section aria-labelledby="profile-writing-heading">
      <SectionHeader
        titleId="profile-writing-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={PenLine}
        action={
          <Link href="/learning">
            <Button variant="ghost" size="sm">
              {labels.viewLearning}
            </Button>
          </Link>
        }
      />

      {!writing.hasHistory ? (
        <DashboardEmptyState
          icon={PenLine}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      ) : (
        <CambaCard variant="default" padding="md" className="space-y-4 border-[var(--status-writing)]/20">
          <div className="grid grid-cols-2 gap-3 camba-caption">
            <div>
              <p className="text-muted">{labels.tasksCompleted}</p>
              <p className="camba-stat text-[var(--status-writing)]">{writing.tasksCompleted}</p>
            </div>
            {writing.averageScore != null && (
              <div>
                <p className="text-muted">{labels.averageScore}</p>
                <p className="camba-stat text-foreground">{writing.averageScore}%</p>
              </div>
            )}
          </div>
          {trend && <p className="camba-caption text-muted">{trend}</p>}
          {writing.topStrengths.length > 0 && (
            <div>
              <p className="camba-caption font-semibold text-muted">{labels.strengths}</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {writing.topStrengths.map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-success/10 px-2 py-0.5 camba-caption text-success"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {writing.improvementAreas.length > 0 && (
            <div>
              <p className="camba-caption font-semibold text-muted">{labels.improvements}</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {writing.improvementAreas.map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-orange-50 px-2 py-0.5 camba-caption text-[var(--status-needs-review)]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {writing.recentItems.length > 0 && (
            <div>
              <p className="camba-caption font-semibold text-muted mb-2">{labels.recent}</p>
              <ol className="space-y-1">
                {writing.recentItems.slice(0, 3).map((item) => (
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
                    <span className="font-semibold text-[var(--status-writing)]">
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
