import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { PremiumMockCard, type PremiumMockCardLabels } from "@/components/mock-tests/premium-mock-card";
import type { MockPerformancePortfolio } from "@/lib/profile/student-profile-types";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MockPerformanceSectionLabels = {
  title: string;
  subtitle: string;
  bestScore: string;
  latestScore: string;
  mocksCompleted: string;
  readiness: string;
  trendImproving: string;
  trendStable: string;
  trendBuilding: string;
  recentResults: string;
  viewMockCenter: string;
  recommended: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
  card: PremiumMockCardLabels;
};

interface MockPerformanceSectionProps {
  mockPerformance: MockPerformancePortfolio;
  labels: MockPerformanceSectionLabels;
}

function trendText(
  trend: MockPerformancePortfolio["trendLabel"],
  labels: MockPerformanceSectionLabels
): string | null {
  switch (trend) {
    case "improving":
      return labels.trendImproving;
    case "building":
      return labels.trendBuilding;
    case "stable":
      return labels.trendStable;
    default:
      return null;
  }
}

export function MockPerformanceSection({
  mockPerformance,
  labels,
}: MockPerformanceSectionProps) {
  const trend = trendText(mockPerformance.trendLabel, labels);

  return (
    <section aria-labelledby="profile-mock-heading">
      <SectionHeader
        titleId="profile-mock-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={ClipboardList}
        action={
          <Link href="/mock-tests">
            <Button variant="ghost" size="sm">
              {labels.viewMockCenter}
            </Button>
          </Link>
        }
      />

      {!mockPerformance.hasMocks ? (
        <DashboardEmptyState
          icon={ClipboardList}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/mock-tests"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 camba-caption">
            <div className="rounded-xl border border-border/60 bg-white px-3 py-2.5">
              <p className="text-muted">{labels.mocksCompleted}</p>
              <p className="camba-stat text-[var(--status-mock-test)]">
                {mockPerformance.mocksCompleted}
              </p>
            </div>
            {mockPerformance.bestScorePercent != null && (
              <div className="rounded-xl border border-border/60 bg-white px-3 py-2.5">
                <p className="text-muted">{labels.bestScore}</p>
                <p className="camba-stat text-foreground">{mockPerformance.bestScorePercent}%</p>
              </div>
            )}
            {mockPerformance.latestScorePercent != null && (
              <div className="rounded-xl border border-border/60 bg-white px-3 py-2.5">
                <p className="text-muted">{labels.latestScore}</p>
                <p className="camba-stat text-foreground">{mockPerformance.latestScorePercent}%</p>
              </div>
            )}
            {mockPerformance.readiness.hasAnalytics && (
              <div className="rounded-xl border border-border/60 bg-white px-3 py-2.5">
                <p className="text-muted">{labels.readiness}</p>
                <p className="camba-stat text-program">{mockPerformance.readiness.readinessPercent}%</p>
              </div>
            )}
          </div>

          {trend && <p className="camba-caption text-muted font-medium">{trend}</p>}

          {mockPerformance.recentResults.length > 0 && (
            <div>
              <p className="camba-caption font-semibold text-muted mb-2">{labels.recentResults}</p>
              <ol className="space-y-1.5">
                {mockPerformance.recentResults.slice(0, 3).map((result) => (
                  <li key={result.detailHref}>
                    <Link
                      href={result.detailHref}
                      className="flex justify-between rounded-lg border border-border/50 px-3 py-2 camba-caption hover:border-[var(--status-mock-test)]/30 camba-focus-ring"
                    >
                      <span className="truncate font-medium text-foreground">{result.mockTitle}</span>
                      <span className="text-[var(--status-mock-test)] font-semibold shrink-0 ml-2">
                        {result.scorePercent}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {mockPerformance.recommendedMock && (
            <div>
              <p className="camba-caption font-semibold text-muted mb-2">{labels.recommended}</p>
              <PremiumMockCard test={mockPerformance.recommendedMock} labels={labels.card} compact />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
