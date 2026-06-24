import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { MockTestFormatBadges } from "@/components/mock-tests/mock-test-format-disclosure";
import { MockTestStatusPill } from "@/components/mock-tests/mock-test-status-pill";
import type { MockTestHubLabels, MockTestHubSummary } from "@/lib/mock-tests/mock-test-types";
import { Clock, FileQuestion, Layers, Trophy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockTestCardProps {
  test: MockTestHubSummary;
  labels: MockTestHubLabels;
  goldBadgeLabel?: string;
}

export function MockTestCard({ test, labels, goldBadgeLabel }: MockTestCardProps) {
  const detailHref = `/mock-tests/${test.id}`;
  const statusLabel = labels.statusLabels[test.displayState];

  return (
    <CambaCard variant="mockTest" padding="md" className="h-full flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="camba-h3 text-foreground">{test.title}</h3>
          {test.description && (
            <p className="camba-caption text-muted mt-1 line-clamp-2">{test.description}</p>
          )}
        </div>
        <MockTestStatusPill state={test.displayState} label={statusLabel} />
      </div>

      {test.isGoldMock && goldBadgeLabel && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-badge)]/15 px-2 py-0.5 camba-caption font-bold text-[var(--color-badge)] border border-[var(--color-badge)]/25 mt-2">
          <Award className="h-3.5 w-3.5" aria-hidden />
          {goldBadgeLabel}
        </span>
      )}

      <MockTestFormatBadges
        format={test.format}
        labels={labels.format}
        className="mt-2"
      />

      <div className="flex flex-wrap gap-2 mt-3">
        {test.levelName && (
          <span className="inline-flex rounded-full bg-program-muted px-2 py-0.5 camba-caption font-semibold text-program">
            {labels.level}: {test.levelName}
          </span>
        )}
        <span className="inline-flex items-center gap-1 camba-caption text-muted">
          <Clock className="h-3.5 w-3.5" />
          {test.durationMinutes} {labels.minutes}
        </span>
        <span className="inline-flex items-center gap-1 camba-caption text-muted">
          <FileQuestion className="h-3.5 w-3.5" />
          {test.questionCount} {labels.questions}
        </span>
        <span className="inline-flex items-center gap-1 camba-caption text-muted">
          <Layers className="h-3.5 w-3.5" />
          {test.sectionCount} {labels.sections}
        </span>
      </div>

      {(test.bestScorePercent != null || test.attemptCount > 0) && (
        <div className="flex flex-wrap items-center gap-2 mt-3 camba-caption text-muted">
          {test.bestScorePercent != null && (
            <span className="inline-flex items-center gap-1 text-[var(--status-mock-test)] font-semibold">
              <Trophy className="h-3.5 w-3.5" />
              {labels.bestScore}: {test.bestScorePercent}%
            </span>
          )}
          {test.attemptCount > 0 && (
            <span>
              {test.attemptCount} {labels.attempts}
              {test.latestScorePercent != null &&
                test.latestScorePercent !== test.bestScorePercent && (
                  <>
                    {" "}
                    · {labels.latestScore}: {test.latestScorePercent}%
                  </>
                )}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto pt-4">
        <Button variant="quest" className="w-full" asChild>
          <Link href={detailHref}>{labels.viewDetail}</Link>
        </Button>
      </div>
    </CambaCard>
  );
}
