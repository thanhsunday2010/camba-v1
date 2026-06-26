import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import {
  PremiumMockCard,
  type PremiumMockCardLabels,
} from "@/components/mock-tests/premium-mock-card";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Button } from "@/components/ui/button";
import type { MockTestHubSummary } from "@/lib/mock-tests/mock-test-types";
import { ArrowRight, ClipboardList } from "lucide-react";

export interface DashboardRecommendedMockLabels extends PremiumMockCardLabels {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
  viewAll: string;
}

interface DashboardRecommendedMockProps {
  test: MockTestHubSummary | null;
  labels: DashboardRecommendedMockLabels;
  compact?: boolean;
}

export function DashboardRecommendedMock({ test, labels, compact = false }: DashboardRecommendedMockProps) {
  return (
    <section aria-labelledby="recommended-mock-heading">
      {!compact && (
        <SectionHeader
          titleId="recommended-mock-heading"
          title={labels.title}
          description={labels.subtitle}
          icon={ClipboardList}
          action={
            <Link href="/mock-tests">
              <Button variant="ghost" size="sm">
                {labels.viewAll}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          }
        />
      )}

      {compact && (
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="camba-caption font-semibold text-foreground">{labels.title}</p>
          <Link href="/mock-tests" className="camba-caption font-semibold text-program hover:underline">
            {labels.viewAll}
          </Link>
        </div>
      )}

      {!test ? (
        <DashboardEmptyState
          icon={ClipboardList}
          title={labels.emptyTitle}
          description={compact ? labels.emptyDescription : labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/mock-tests"
        />
      ) : (
        <PremiumMockCard test={test} labels={labels} compact={compact} />
      )}
    </section>
  );
}
