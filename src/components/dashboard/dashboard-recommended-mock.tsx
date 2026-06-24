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
}

export function DashboardRecommendedMock({ test, labels }: DashboardRecommendedMockProps) {
  return (
    <section aria-labelledby="recommended-mock-heading">
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

      {!test ? (
        <DashboardEmptyState
          icon={ClipboardList}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/mock-tests"
        />
      ) : (
        <PremiumMockCard test={test} labels={labels} />
      )}
    </section>
  );
}
