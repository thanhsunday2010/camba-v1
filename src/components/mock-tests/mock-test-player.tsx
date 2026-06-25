"use client";

import { useMemo } from "react";
import type { MockTestData, QuestionResult, UserAnswer } from "@/types/learning";
import { QuestionRenderer } from "@/components/exercises/exercise-player";
import { isWritingQuestion } from "@/lib/writing/writing-utils";
import { isSpeakingQuestion } from "@/lib/speaking/speaking-utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { MockTestFramedQuestionFrame } from "@/components/mock-tests/mock-test-framed-question-frame";
import { MockTestQuestionContextPanel } from "@/components/mock-tests/mock-test-question-context-panel";
import { MockTestQuestionList } from "@/components/mock-tests/mock-test-question-list";
import { Button } from "@/components/ui/button";
import type {
  MockTestTakeLabels,
  MockTestTakeViewModel,
  ResolvedMockTestProgress,
} from "@/lib/mock-tests/mock-test-types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface MockTestPlayerProps {
  viewModel: MockTestTakeViewModel;
  test: MockTestData;
  labels: MockTestTakeLabels;
  resolvedProgress: ResolvedMockTestProgress;
  currentQuestionIndex: number;
  answers: Record<string, UserAnswer>;
  questionResults: QuestionResult[];
  isSubmitting: boolean;
  isReviewingTest: boolean;
  activeReviewQuestionId: string | null;
  showFramedReview: boolean;
  onIndexChange: (index: number) => void;
  onAnswerChange: (questionId: string, answer: UserAnswer) => void;
  onSubmit: () => void;
  onSelectReviewQuestion: (questionId: string) => void;
  onCloseFramedReview: () => void;
  onBackToReviewList: () => void;
  onExitReviewMode?: () => void;
}

export function MockTestPlayer({
  viewModel,
  test,
  labels,
  resolvedProgress,
  currentQuestionIndex,
  answers,
  questionResults,
  isSubmitting,
  isReviewingTest,
  activeReviewQuestionId,
  showFramedReview,
  onIndexChange,
  onAnswerChange,
  onSubmit,
  onSelectReviewQuestion,
  onCloseFramedReview,
  onBackToReviewList,
  onExitReviewMode,
}: MockTestPlayerProps) {
  const flatQuestions = useMemo(
    () => test.sections.flatMap((s) => s.questions),
    [test.sections]
  );

  const sectionForIndex = useMemo(() => {
    return flatQuestions.map((q) =>
      test.sections.find((s) => s.id === q.sectionId)
    );
  }, [flatQuestions, test.sections]);

  if (resolvedProgress.isTestCompleteResolved && !isReviewingTest && !showFramedReview) {
    return null;
  }

  if (isReviewingTest && !activeReviewQuestionId) {
    return (
      <MockTestQuestionList
        questions={viewModel.questions}
        sections={viewModel.sections}
        labels={labels}
        onSelectQuestion={onSelectReviewQuestion}
        onExitReviewMode={onExitReviewMode}
      />
    );
  }

  const reviewQuestionId = activeReviewQuestionId;
  const reviewIndex = reviewQuestionId
    ? flatQuestions.findIndex((q) => q.id === reviewQuestionId)
    : -1;
  const displayIndex =
    reviewQuestionId && reviewIndex >= 0 ? reviewIndex : currentQuestionIndex;
  const currentQuestion = flatQuestions[displayIndex];
  const currentSection = sectionForIndex[displayIndex];

  if (!currentQuestion) return null;

  const isReviewView = Boolean(reviewQuestionId);
  const isLast = displayIndex === flatQuestions.length - 1;
  const currentQuestionResult = questionResults.find((r) => r.questionId === currentQuestion.id);
  const isAiReview =
    isReviewView && (isWritingQuestion(currentQuestion) || isSpeakingQuestion(currentQuestion));
  const showQuestionResult = isReviewView && (questionResults.length > 0 || isAiReview);
  const questionSummary = viewModel.questions.find((q) => q.id === currentQuestion.id);
  const questionContext = questionSummary?.context ?? null;

  const contextPanel =
    questionContext?.hasContextPanel ? (
      <MockTestQuestionContextPanel
        context={questionContext}
        labels={labels.contextPanel}
        showTranscript={isReviewView}
      />
    ) : null;

  const questionBody = (
    <div className="space-y-4">
      {contextPanel}
      <p className="camba-body font-medium text-foreground">
        {currentQuestion.question_text}
      </p>
      <QuestionRenderer
        question={currentQuestion}
        answer={answers[currentQuestion.id]}
        onAnswer={
          isReviewView
            ? () => {}
            : (answer) => onAnswerChange(currentQuestion.id, answer)
        }
        disabled={isReviewView}
        showResult={showQuestionResult}
        questionResult={currentQuestionResult}
      />
      {isReviewView && !isAiReview && currentQuestionResult?.explanation && (
        <p className="camba-caption text-muted bg-muted/40 p-2 rounded-lg">
          {currentQuestionResult.explanation}
        </p>
      )}
    </div>
  );

  if (showFramedReview && reviewQuestionId) {
    const summary = viewModel.questions.find((q) => q.id === reviewQuestionId);
    return (
      <MockTestFramedQuestionFrame
        questionTitle={summary?.sectionTitle ?? test.title}
        labels={labels}
        onClose={onCloseFramedReview}
      >
        {questionBody}
      </MockTestFramedQuestionFrame>
    );
  }

  if (isReviewingTest && reviewQuestionId) {
    return (
      <CambaCard variant="lesson" padding="md" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="camba-caption text-muted">
            {labels.questionPosition
              .replace("{current}", String(displayIndex + 1))
              .replace("{total}", String(flatQuestions.length))}
            {currentSection?.title ? ` · ${currentSection.title}` : ""}
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={onBackToReviewList}>
            {labels.backToReviewList}
          </Button>
        </div>
        {questionBody}
      </CambaCard>
    );
  }

  return (
    <CambaCard variant="elevated" padding="md" className="space-y-4 camba-mobile-action-spacer">
      <div className="camba-scroll-x flex gap-1.5 flex-nowrap pb-1 -mx-1 px-1">
        {test.sections.map((section) => {
          const sectionQuestionIds = new Set(section.questions.map((q) => q.id));
          const reachedInSection = flatQuestions.some(
            (q, i) => sectionQuestionIds.has(q.id) && i <= currentQuestionIndex
          );
          const isActive = currentSection?.id === section.id;

          return (
            <span
              key={section.id}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full min-h-[var(--touch-target-min)] sm:min-h-0 sm:py-1 inline-flex items-center ${
                isActive
                  ? "bg-[var(--status-mock-test)] text-white"
                  : reachedInSection
                    ? "bg-[var(--status-mock-test)]/20 text-[var(--status-mock-test)]"
                    : "bg-[var(--surface-sunken)] text-muted"
              }`}
            >
              {section.title}
            </span>
          );
        })}
      </div>

      <div className="flex gap-1">
        {flatQuestions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= currentQuestionIndex
                ? "bg-[var(--status-mock-test)]"
                : "bg-[var(--surface-sunken)]"
            }`}
            aria-hidden
          />
        ))}
      </div>

      {questionBody}

      <div className="camba-mobile-action-bar flex justify-between gap-2 pt-2 md:pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1 sm:flex-none min-h-[var(--touch-target-min)]"
          onClick={() => onIndexChange(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          aria-label={labels.previous}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">{labels.previous}</span>
        </Button>

        {isLast ? (
          <Button
            type="button"
            size="lg"
            className="flex-1 sm:flex-none min-h-[var(--touch-target-min)]"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {labels.submitting}
              </>
            ) : (
              labels.submit
            )}
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            className="flex-1 sm:flex-none min-h-[var(--touch-target-min)]"
            onClick={() => onIndexChange(currentQuestionIndex + 1)}
          >
            {labels.next}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CambaCard>
  );
}
