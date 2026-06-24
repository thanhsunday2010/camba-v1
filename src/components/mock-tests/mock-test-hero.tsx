import { Link } from "@/i18n/routing";
import { MockTestStatusPill } from "@/components/mock-tests/mock-test-status-pill";
import { MockAiSkillBadges } from "@/components/mock-tests/mock-ai-skill-badges";
import type { MockTestDetailLabels, MockTestDetailViewModel } from "@/lib/mock-tests/mock-test-types";
import { ArrowLeft, Clock, FileQuestion, Layers, TrendingUp } from "lucide-react";

interface MockTestHeroProps {
  viewModel: Pick<
    MockTestDetailViewModel,
    | "title"
    | "description"
    | "levelName"
    | "durationMinutes"
    | "questionCount"
    | "sectionCount"
    | "displayState"
    | "attemptCount"
    | "bestScorePercent"
    | "format"
    | "isGoldMock"
    | "readinessPercent"
    | "readinessBand"
  >;
  labels: MockTestDetailLabels;
}

function readinessText(
  band: MockTestDetailViewModel["readinessBand"],
  labels: MockTestDetailLabels
): string | null {
  switch (band) {
    case "ready":
      return labels.readinessReady;
    case "approaching":
      return labels.readinessApproaching;
    case "developing":
      return labels.readinessDeveloping;
    case "building":
      return labels.readinessBuilding;
    default:
      return null;
  }
}

export function MockTestHero({ viewModel, labels }: MockTestHeroProps) {
  const statusLabel = labels.statusLabels[viewModel.displayState];
  const readiness = readinessText(viewModel.readinessBand, labels);

  return (
    <div className="rounded-2xl border border-[var(--status-mock-test)]/25 bg-gradient-to-br from-[var(--status-mock-test)]/8 via-white to-program/5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <MockTestStatusPill state={viewModel.displayState} label={statusLabel} />
        <MockAiSkillBadges
          format={viewModel.format}
          isGoldMock={viewModel.isGoldMock}
          labels={{
            goldCertified: labels.goldBadge,
            writingAi: labels.format.writingAi ?? "Writing evaluated by AI",
            speakingAi: labels.format.speakingAi ?? "Speaking evaluated by AI",
          }}
        />
      </div>
      <h1 className="camba-display text-xl sm:text-2xl text-foreground">
        {viewModel.title}
      </h1>
      {viewModel.description && (
        <p className="camba-body text-muted mt-2 max-w-2xl">{viewModel.description}</p>
      )}
      <div className="flex flex-wrap gap-3 mt-4 camba-caption text-muted">
        {viewModel.levelName && (
          <span className="inline-flex rounded-full bg-program-muted px-2.5 py-1 font-semibold text-program">
            {labels.level}: {viewModel.levelName}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {viewModel.durationMinutes} {labels.minutes}
        </span>
        <span className="inline-flex items-center gap-1">
          <FileQuestion className="h-3.5 w-3.5" aria-hidden />
          {viewModel.questionCount} {labels.questions}
        </span>
        <span className="inline-flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" aria-hidden />
          {viewModel.sectionCount} {labels.sections}
        </span>
      </div>
      {viewModel.attemptCount > 0 && viewModel.bestScorePercent != null && (
        <p className="camba-caption text-[var(--status-mock-test)] font-semibold mt-3">
          {labels.attemptsSummary
            .replace("{count}", String(viewModel.attemptCount))
            .replace("{score}", String(viewModel.bestScorePercent))}
        </p>
      )}
      {viewModel.attemptCount > 0 && viewModel.readinessPercent != null && readiness && (
        <div
          className="mt-4 rounded-xl border border-[var(--status-mock-test)]/20 bg-white/70 px-4 py-3 flex items-start gap-2"
          role="status"
        >
          <TrendingUp
            className="h-4 w-4 shrink-0 text-[var(--status-mock-test)] mt-0.5"
            aria-hidden
          />
          <div className="min-w-0">
            <p className="camba-caption font-semibold text-foreground">
              {labels.readinessTitle}
            </p>
            <p className="camba-caption text-muted mt-0.5">
              {viewModel.readinessPercent}% · {readiness}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface MockTestBreadcrumbProps {
  labels: Pick<MockTestDetailLabels, "backToHub" | "breadcrumbHub">;
}

export function MockTestBreadcrumb({ labels }: MockTestBreadcrumbProps) {
  return (
    <nav aria-label={labels.breadcrumbHub}>
      <Link
        href="/mock-tests"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-program hover:underline w-fit camba-focus-ring rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {labels.backToHub}
      </Link>
    </nav>
  );
}
