"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { MockTestCompleteSummary } from "@/components/mock-tests/mock-test-complete-summary";
import { MockCompletionCelebration } from "@/components/camba/motion";
import { MockTestFormatDisclosure } from "@/components/mock-tests/mock-test-format-disclosure";
import { MockTestStatusPill } from "@/components/mock-tests/mock-test-status-pill";
import type {
  MockTestAttemptSummary,
  MockTestPageLabels,
  MockTestTakeLabels,
  MockTestTakeViewModel,
  ResolvedMockTestProgress,
} from "@/lib/mock-tests/mock-test-types";
import type { MockTestSkillAnalytics } from "@/lib/mock-tests/mock-test-analytics-types";
import { ArrowLeft, Clock, FileQuestion, Layers } from "lucide-react";
import type { ReactNode } from "react";

interface MockTestPageShellProps {
  viewModel: MockTestTakeViewModel;
  labels: MockTestPageLabels;
  resolvedProgress: ResolvedMockTestProgress;
  isReviewingTest: boolean;
  sessionAttempt: MockTestAttemptSummary | null;
  skillAnalytics?: MockTestSkillAnalytics | null;
  activeReviewQuestionId: string | null;
  onReviewTest?: () => void;
  onRetake?: () => void;
  onReviewSkill?: (skill: string) => void;
  children: ReactNode;
}

function MockTestTakeBreadcrumb({
  detailHref,
  label,
}: {
  detailHref: string;
  label: string;
}) {
  return (
    <nav aria-label={label}>
      <Link
        href={detailHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-program hover:underline w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </nav>
  );
}

function MockTestActiveHero({
  viewModel,
  takeLabels,
  detailLabels,
  resolvedProgress,
}: {
  viewModel: MockTestTakeViewModel;
  takeLabels: MockTestPageLabels["take"];
  detailLabels: MockTestPageLabels["detail"];
  resolvedProgress: ResolvedMockTestProgress;
}) {
  return (
    <div className="rounded-2xl border border-[var(--status-mock-test)]/20 bg-gradient-to-br from-[var(--status-mock-test)]/8 via-white to-program/5 p-4 sm:p-5">
      <h1 className="camba-h2 text-foreground">{viewModel.title}</h1>
      {viewModel.description && (
        <p className="camba-caption text-muted mt-1 line-clamp-2">{viewModel.description}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-3 camba-caption text-muted">
        {viewModel.levelName && (
          <span className="rounded-full bg-program-muted px-2 py-0.5 font-semibold text-program">
            {viewModel.levelName}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {viewModel.durationMinutes} {detailLabels.minutes}
        </span>
        <span className="inline-flex items-center gap-1">
          <FileQuestion className="h-3.5 w-3.5" />
          {viewModel.questionCount} {detailLabels.questions}
        </span>
        <span className="inline-flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" />
          {viewModel.sectionCount} {detailLabels.sections}
        </span>
      </div>
      {resolvedProgress.currentSectionTitle && (
        <p className="camba-caption text-program font-medium mt-2">
          {takeLabels.section}: {resolvedProgress.currentSectionTitle} ·{" "}
          {takeLabels.question} {resolvedProgress.currentQuestionIndex + 1}{" "}
          {takeLabels.of} {resolvedProgress.totalQuestions}
        </p>
      )}
    </div>
  );
}

function MockTestCompactCompleteHero({
  viewModel,
  label,
  statusLabel,
}: {
  viewModel: MockTestTakeViewModel;
  label: string;
  statusLabel: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--status-mock-test)]/20 bg-[var(--status-mock-test)]/5 px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="camba-caption text-[var(--status-mock-test)] font-semibold uppercase tracking-wide">
          {label}
        </p>
        <p className="camba-h3 text-foreground truncate">{viewModel.title}</p>
      </div>
      <MockTestStatusPill state="completed" label={statusLabel} className="shrink-0" />
    </div>
  );
}

function MockTestProgressStrip({
  resolvedProgress,
  labels,
}: {
  resolvedProgress: ResolvedMockTestProgress;
  labels: MockTestTakeLabels;
}) {
  return (
    <CambaCard variant="stat" padding="sm">
      <div className="flex items-center justify-between gap-3 camba-caption">
        <span className="text-muted font-medium">
          {labels.progressSummary.replace(
            "{percent}",
            String(resolvedProgress.completionPercent)
          )}
        </span>
        <span className="text-muted">
          {labels.questionsAnswered
            .replace("{answered}", String(resolvedProgress.answeredCount))
            .replace("{total}", String(resolvedProgress.totalQuestions))}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--status-mock-test)] transition-all"
          style={{ width: `${resolvedProgress.completionPercent}%` }}
        />
      </div>
    </CambaCard>
  );
}

export function MockTestPageShell({
  viewModel,
  labels,
  resolvedProgress,
  isReviewingTest,
  sessionAttempt,
  skillAnalytics = null,
  activeReviewQuestionId,
  onReviewTest,
  onRetake,
  onReviewSkill,
  children,
}: MockTestPageShellProps) {
  const showCompleteLayer =
    resolvedProgress.isTestCompleteResolved && !isReviewingTest;
  const takeLabels = labels.take;
  const completeLabels = labels.complete;
  const reviewLabels = labels.review;

  return (
    <div className="camba-section-stack">
      <MockTestTakeBreadcrumb
        detailHref={viewModel.detailHref}
        label={takeLabels.backToDetail}
      />

      {!resolvedProgress.isTestCompleteResolved && !isReviewingTest && (
        <>
          <MockTestActiveHero
            viewModel={viewModel}
            takeLabels={takeLabels}
            detailLabels={labels.detail}
            resolvedProgress={resolvedProgress}
          />
          <MockTestProgressStrip
            resolvedProgress={resolvedProgress}
            labels={takeLabels}
          />
          <MockTestFormatDisclosure
            format={viewModel.format}
            labels={takeLabels.format}
            variant="compact"
          />
        </>
      )}

      {isReviewingTest && !activeReviewQuestionId && (
        <MockTestCompactCompleteHero
          viewModel={viewModel}
          label={takeLabels.reviewListTitle}
          statusLabel={labels.detail.statusLabels.completed}
        />
      )}

      {showCompleteLayer && sessionAttempt && (
        <div className={cn("space-y-4", activeReviewQuestionId && "-mb-1")}>
          <MockTestCompactCompleteHero
            viewModel={viewModel}
            label={takeLabels.completeModeSubtitle}
            statusLabel={labels.detail.statusLabels.completed}
          />
          <MockCompletionCelebration active={!activeReviewQuestionId}>
          <MockTestCompleteSummary
            testTitle={viewModel.title}
            attempt={sessionAttempt}
            takeHref={`${viewModel.detailHref}/take`}
            hubHref={viewModel.hubHref}
            detailHref={viewModel.detailHref}
            labels={completeLabels}
            reviewLabels={reviewLabels}
            analyticsLabels={labels.analytics}
            skillAnalytics={skillAnalytics}
            ctaVariant="take"
            onReviewTest={onReviewTest}
            onRetake={onRetake}
            onReviewSkill={onReviewSkill}
          />
          </MockCompletionCelebration>
        </div>
      )}

      <div className={cn(showCompleteLayer && activeReviewQuestionId && "mt-0")}>
        {children}
      </div>
    </div>
  );
}
