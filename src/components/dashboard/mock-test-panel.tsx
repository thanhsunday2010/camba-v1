import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { MockTestCard } from "@/components/camba/cards/learning-cards";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Button } from "@/components/ui/button";
import type { MockTestSummary } from "@/types/learning";
import { ClipboardList, FileQuestion } from "lucide-react";

interface MockTestPanelProps {
  tests: MockTestSummary[];
  labels: {
    title: string;
    subtitle: string;
    viewAll: string;
    emptyTitle: string;
    emptyDescription: string;
    ctaLabel: string;
    retakeLabel: string;
    bestScore: string;
    attempts: string;
    moreTests: string;
  };
}

export function MockTestPanel({ tests, labels }: MockTestPanelProps) {
  const featured = tests[0];

  return (
    <section aria-labelledby="mock-test-heading">
      <SectionHeader
        title={labels.title}
        description={labels.subtitle}
        icon={FileQuestion}
        action={
          <Link href="/mock-tests">
            <Button variant="ghost" size="sm">
              {labels.viewAll}
            </Button>
          </Link>
        }
      />

      {featured ? (
        <div className="space-y-3">
          <MockTestCard
            title={featured.title}
            description={featured.description ?? undefined}
            bestScore={featured.bestScorePercent ?? undefined}
            attemptCount={featured.attemptCount}
            href={`/mock-tests/${featured.id}`}
            ctaLabel={featured.attemptCount > 0 ? labels.retakeLabel : labels.ctaLabel}
            className="border-2 border-[var(--status-mock-test)]/20"
          />
          {featured.bestScorePercent != null && (
            <CambaCard variant="stat" padding="sm">
              <p className="camba-caption text-muted text-center">
                {labels.bestScore}:{" "}
                <strong className="text-[var(--status-mock-test)]">
                  {featured.bestScorePercent}%
                </strong>
                {featured.attemptCount > 0 && (
                  <>
                    {" "}
                    · {labels.attempts}: {featured.attemptCount}
                  </>
                )}
              </p>
            </CambaCard>
          )}
          {tests.length > 1 && (
            <p className="camba-caption text-muted text-center">
              {labels.moreTests.replace("{count}", String(tests.length - 1))}{" "}
              <Link href="/mock-tests" className="text-program font-semibold hover:underline">
                {labels.viewAll}
              </Link>
            </p>
          )}
        </div>
      ) : (
        <DashboardEmptyState
          icon={ClipboardList}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.viewAll}
          actionHref="/mock-tests"
        />
      )}
    </section>
  );
}
