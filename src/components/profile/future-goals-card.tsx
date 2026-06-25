import { PortfolioInlineEmptyState } from "@/components/camba/empty-states";
import { SectionHeader } from "@/components/camba/section-header";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { FutureGoal } from "@/lib/profile/student-profile-types";
import { Link } from "@/i18n/routing";
import { Target } from "lucide-react";

export type FutureGoalsCardLabels = {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyDescription: string;
  resolveTitle: (goal: FutureGoal) => string;
  resolveDescription: (goal: FutureGoal) => string;
};

interface FutureGoalsCardProps {
  goals: FutureGoal[];
  labels: FutureGoalsCardLabels;
}

export function FutureGoalsCard({ goals, labels }: FutureGoalsCardProps) {
  return (
    <section aria-labelledby="profile-goals-heading">
      <SectionHeader
        titleId="profile-goals-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={Target}
      />

      {goals.length === 0 ? (
        <PortfolioInlineEmptyState
          title={labels.emptyTitle}
          description={labels.emptyDescription}
        />
      ) : (
        <ol className="space-y-3" role="list">
          {goals.map((goal) => (
            <li key={goal.id}>
              <Link href={goal.href} className="block camba-focus-ring rounded-2xl">
                <CambaCard variant="lesson" padding="md" interactive className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="camba-icon-box shrink-0 bg-program-muted text-program">
                      <Target className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="camba-body font-semibold text-foreground">
                        {labels.resolveTitle(goal)}
                      </p>
                      <p className="camba-caption text-muted mt-1">
                        {labels.resolveDescription(goal)}
                      </p>
                      <div
                        className="mt-2 h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden max-w-xs"
                        role="progressbar"
                        aria-valuenow={goal.progressPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full rounded-full bg-program"
                          style={{ width: `${goal.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CambaCard>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
