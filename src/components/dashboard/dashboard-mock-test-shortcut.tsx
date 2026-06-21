import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { MockTestCard } from "@/components/camba/cards/learning-cards";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { EmptyStateIllustrated } from "@/components/camba/empty-state-illustrated";
import type { MockTestSummary } from "@/types/learning";
import { ClipboardList, FileQuestion } from "lucide-react";

interface DashboardMockTestShortcutProps {
  tests: MockTestSummary[];
  title: string;
  viewAllLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  ctaLabel: string;
  moreTestsCount?: number;
}

export function DashboardMockTestShortcut({
  tests,
  title,
  viewAllLabel,
  emptyTitle,
  emptyDescription,
  ctaLabel,
  moreTestsCount,
}: DashboardMockTestShortcutProps) {
  const featured = tests[0];

  return (
    <div>
      <SectionHeader
        title={title}
        icon={FileQuestion}
        action={
          tests.length > 0 ? (
            <Link href="/mock-tests">
              <Button variant="ghost" size="sm">
                {viewAllLabel}
              </Button>
            </Link>
          ) : undefined
        }
      />
      {featured ? (
        <MockTestCard
          title={featured.title}
          description={featured.description ?? undefined}
          bestScore={featured.bestScorePercent ?? undefined}
          attemptCount={featured.attemptCount}
          href={`/mock-tests/${featured.id}`}
          ctaLabel={featured.attemptCount > 0 ? ctaLabel : ctaLabel}
        />
      ) : (
        <EmptyStateIllustrated
          icon={ClipboardList}
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={viewAllLabel}
          actionHref="/mock-tests"
        />
      )}
      {moreTestsCount != null && moreTestsCount > 0 && (
        <CambaCard variant="default" padding="sm" className="mt-3">
          <p className="camba-caption text-muted text-center">
            +{moreTestsCount} —{" "}
            <Link href="/mock-tests" className="text-program font-semibold hover:underline">
              {viewAllLabel}
            </Link>
          </p>
        </CambaCard>
      )}
    </div>
  );
}
