import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { MockTestStatusPill } from "@/components/mock-tests/mock-test-status-pill";
import { MockAiSkillBadges } from "@/components/mock-tests/mock-ai-skill-badges";
import { deriveMockDifficulty } from "@/lib/mock-tests/mock-center-utils";
import type { MockTestHubLabels, MockTestHubSummary } from "@/lib/mock-tests/mock-test-types";
import { Clock, FileQuestion, Layers, Play, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PremiumMockCardLabels extends MockTestHubLabels {
  goldBadge: string;
  writingAi: string;
  speakingAi: string;
  difficultyStandard: string;
  difficultyReview: string;
  difficultyChallenge: string;
  startTest: string;
  resumeTest: string;
  retakeTest: string;
}

interface PremiumMockCardProps {
  test: MockTestHubSummary;
  labels: PremiumMockCardLabels;
  compact?: boolean;
}

function difficultyLabel(
  test: MockTestHubSummary,
  labels: PremiumMockCardLabels
): string {
  switch (deriveMockDifficulty(test)) {
    case "review":
      return labels.difficultyReview;
    case "challenge":
      return labels.difficultyChallenge;
    default:
      return labels.difficultyStandard;
  }
}

function ctaLabel(test: MockTestHubSummary, labels: PremiumMockCardLabels): string {
  if (test.displayState === "in-progress") return labels.resumeTest;
  if (test.attemptCount > 0) return labels.retakeTest;
  return labels.startTest;
}

export function PremiumMockCard({ test, labels, compact }: PremiumMockCardProps) {
  const detailHref = `/mock-tests/${test.id}`;
  const takeHref = `/mock-tests/${test.id}/take`;
  const statusLabel = labels.statusLabels[test.displayState];
  const primaryHref = test.displayState === "not-started" || test.displayState === "in-progress"
    ? takeHref
    : detailHref;

  return (
    <CambaCard variant="mockTest" padding="md" className="h-full flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={compact ? "camba-h3 text-foreground line-clamp-1" : "camba-h3 text-foreground"}>
            {test.title}
          </h3>
          {!compact && test.description && (
            <p className="camba-caption text-muted mt-1 line-clamp-2">{test.description}</p>
          )}
        </div>
        <MockTestStatusPill state={test.displayState} label={statusLabel} />
      </div>

      <MockAiSkillBadges
        format={test.format}
        isGoldMock={test.isGoldMock}
        labels={{
          goldCertified: labels.goldBadge,
          writingAi: labels.writingAi,
          speakingAi: labels.speakingAi,
        }}
        className="mt-2"
      />

      <div className="flex flex-wrap gap-2 mt-3">
        {test.levelName && (
          <span className="inline-flex rounded-full bg-program-muted px-2 py-0.5 camba-caption font-semibold text-program">
            {labels.level}: {test.levelName}
          </span>
        )}
        <span className="inline-flex rounded-full bg-[var(--surface-sunken)] px-2 py-0.5 camba-caption font-medium text-muted">
          {difficultyLabel(test, labels)}
        </span>
        {!compact && (
          <>
            <span className="inline-flex items-center gap-1 camba-caption text-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {test.durationMinutes} {labels.minutes}
            </span>
            <span className="inline-flex items-center gap-1 camba-caption text-muted">
              <FileQuestion className="h-3.5 w-3.5" aria-hidden />
              {test.questionCount} {labels.questions}
            </span>
            <span className="inline-flex items-center gap-1 camba-caption text-muted">
              <Layers className="h-3.5 w-3.5" aria-hidden />
              {test.sectionCount} {labels.sections}
            </span>
          </>
        )}
      </div>

      {(test.bestScorePercent != null || test.attemptCount > 0) && (
        <div className="flex flex-wrap items-center gap-2 mt-3 camba-caption text-muted">
          {test.bestScorePercent != null && (
            <span className="inline-flex items-center gap-1 text-[var(--status-mock-test)] font-semibold">
              <Trophy className="h-3.5 w-3.5" aria-hidden />
              {labels.bestScore}: {test.bestScorePercent}%
            </span>
          )}
          {test.latestScorePercent != null &&
            test.latestScorePercent !== test.bestScorePercent && (
              <span>
                {labels.latestScore}: {test.latestScorePercent}%
              </span>
            )}
        </div>
      )}

      <div className="mt-auto pt-4 flex gap-2">
        <Button variant="quest" className="flex-1" asChild>
          <Link href={primaryHref}>
            {test.displayState === "in-progress" ? (
              <RotateCcw className="h-4 w-4 mr-1" aria-hidden />
            ) : (
              <Play className="h-4 w-4 mr-1" aria-hidden />
            )}
            {ctaLabel(test, labels)}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={detailHref}>{labels.viewDetail}</Link>
        </Button>
      </div>
    </CambaCard>
  );
}
