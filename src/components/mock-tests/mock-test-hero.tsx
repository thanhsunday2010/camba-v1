import { Link } from "@/i18n/routing";
import { MockTestStatusPill } from "@/components/mock-tests/mock-test-status-pill";
import type { MockTestDetailLabels, MockTestDetailViewModel } from "@/lib/mock-tests/mock-test-types";
import { ArrowLeft, Clock, FileQuestion, Layers } from "lucide-react";

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
  >;
  labels: MockTestDetailLabels;
}

export function MockTestHero({ viewModel, labels }: MockTestHeroProps) {
  const statusLabel = labels.statusLabels[viewModel.displayState];

  return (
    <div className="rounded-2xl border border-[var(--status-mock-test)]/25 bg-gradient-to-br from-[var(--status-mock-test)]/8 via-white to-program/5 p-5 sm:p-6">
      <MockTestStatusPill
        state={viewModel.displayState}
        label={statusLabel}
        className="mb-3"
      />
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
          <Clock className="h-3.5 w-3.5" />
          {viewModel.durationMinutes} {labels.minutes}
        </span>
        <span className="inline-flex items-center gap-1">
          <FileQuestion className="h-3.5 w-3.5" />
          {viewModel.questionCount} {labels.questions}
        </span>
        <span className="inline-flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" />
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
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-program hover:underline w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        {labels.backToHub}
      </Link>
    </nav>
  );
}
