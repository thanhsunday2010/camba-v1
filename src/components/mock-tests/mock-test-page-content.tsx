"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { submitMockTest } from "@/actions/mock-tests";
import { useCelebrationOptional } from "@/components/camba/celebration/celebration-provider";
import { StudentPageShell } from "@/components/camba";
import { MockTestPageShell } from "@/components/mock-tests/mock-test-page-shell";
import { MockTestPlayer } from "@/components/mock-tests/mock-test-player";
import {
  buildMockTestAttemptSummary,
  deriveResolvedMockTestProgress,
  getWeakQuestionIdsForSkill,
} from "@/lib/mock-tests/mock-test-ui-utils";
import {
  clearMockTestSessionSnapshot,
  readMockTestSessionSnapshot,
  writeMockTestSessionSnapshot,
} from "@/lib/mock-tests/mock-test-session-storage";
import type {
  MockTestAttemptSummary,
  MockTestPageLabels,
  MockTestTakeViewModel,
} from "@/lib/mock-tests/mock-test-types";
import type { QuestionResult, UserAnswer } from "@/types/learning";
import { toast } from "sonner";

interface MockTestPageContentProps {
  viewModel: MockTestTakeViewModel;
  labels: MockTestPageLabels;
}

export function MockTestPageContent({ viewModel, labels }: MockTestPageContentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [sessionAttempt, setSessionAttempt] = useState<MockTestAttemptSummary | null>(null);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [isReviewingTest, setIsReviewingTest] = useState(false);
  const [activeReviewQuestionId, setActiveReviewQuestionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();
  const celebrate = useCelebrationOptional();
  const wasCompleteRef = useRef(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const snapshot = readMockTestSessionSnapshot(viewModel.id);
    if (!snapshot) return;
    setSessionAttempt(snapshot.attempt);
    setAnswers(snapshot.answers);
    setQuestionResults(snapshot.questionResults);
  }, [viewModel.id]);

  const flatQuestions = viewModel.test.sections.flatMap((s) => s.questions);
  const currentSection = viewModel.test.sections.find((s) =>
    s.questions.some((q) => q.id === flatQuestions[currentQuestionIndex]?.id)
  );

  const isTestCompleteResolved = sessionAttempt !== null;

  const resolvedProgress = useMemo(
    () =>
      deriveResolvedMockTestProgress({
        totalQuestions: viewModel.questionCount,
        currentQuestionIndex,
        answers,
        isTestCompleteResolved,
        currentSectionTitle: currentSection?.title ?? null,
        currentSectionId: currentSection?.id ?? null,
      }),
    [
      viewModel.questionCount,
      currentQuestionIndex,
      answers,
      isTestCompleteResolved,
      currentSection?.title,
      currentSection?.id,
    ]
  );

  const showCompleteLayer = isTestCompleteResolved && !isReviewingTest;
  const showFramedReview =
    showCompleteLayer && activeReviewQuestionId !== null && !isReviewingTest;

  useEffect(() => {
    if (isTestCompleteResolved && !wasCompleteRef.current) {
      celebrate?.celebrateMission();
    }
    wasCompleteRef.current = isTestCompleteResolved;
  }, [isTestCompleteResolved, celebrate]);

  useEffect(() => {
    if (isTestCompleteResolved) {
      setIsReviewingTest(false);
    }
  }, [isTestCompleteResolved]);

  const onAnswerChange = useCallback((questionId: string, answer: UserAnswer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubmit = useCallback(() => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    startTransition(async () => {
      try {
        const response = await submitMockTest(viewModel.id, answers, timeSpent);
        if (response.success && response.data) {
          const result = response.data;
          const attempt = buildMockTestAttemptSummary({
            attemptId: "session",
            score: result.score,
            maxScore: result.maxScore,
            completedAt: new Date().toISOString(),
            timeSpentSeconds: timeSpent,
            skillBreakdown: result.skillBreakdown,
            shieldEstimate: result.shieldEstimate,
          });
          writeMockTestSessionSnapshot(viewModel.id, {
            attempt,
            answers,
            questionResults: result.questionResults,
          });
          setSessionAttempt(attempt);
          setQuestionResults(result.questionResults);
          setActiveReviewQuestionId(null);
          setIsReviewingTest(false);
        } else {
          toast.error(response.error ?? labels.take.submitFailed);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : labels.take.submitFailed
        );
      }
    });
  }, [answers, labels.take.submitFailed, startTime, viewModel.id]);

  const enterReviewMode = useCallback(() => {
    setIsReviewingTest(true);
    setActiveReviewQuestionId(null);
  }, []);

  const exitReviewMode = useCallback(() => {
    setIsReviewingTest(false);
    setActiveReviewQuestionId(null);
  }, []);

  const openFramedReviewQuestion = useCallback((questionId: string) => {
    setActiveReviewQuestionId(questionId);
    setIsReviewingTest(false);
  }, []);

  const closeFramedReview = useCallback(() => {
    setActiveReviewQuestionId(null);
  }, []);

  const openReviewQuestion = useCallback((questionId: string) => {
    setActiveReviewQuestionId(questionId);
  }, []);

  const backToReviewList = useCallback(() => {
    setActiveReviewQuestionId(null);
  }, []);

  const handleReviewSkill = useCallback(
    (skill: string) => {
      const ids = getWeakQuestionIdsForSkill(viewModel.questions, skill);
      if (ids[0]) {
        openFramedReviewQuestion(ids[0]);
      }
    },
    [openFramedReviewQuestion, viewModel.questions]
  );

  const handleRetake = useCallback(() => {
    clearMockTestSessionSnapshot(viewModel.id);
    setSessionAttempt(null);
    setQuestionResults([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(Date.now());
    setIsReviewingTest(false);
    setActiveReviewQuestionId(null);
  }, [viewModel.id]);

  return (
    <StudentPageShell narrow>
      <MockTestPageShell
        viewModel={viewModel}
        labels={labels}
        resolvedProgress={resolvedProgress}
        isReviewingTest={isReviewingTest}
        sessionAttempt={sessionAttempt}
        activeReviewQuestionId={activeReviewQuestionId}
        onReviewTest={enterReviewMode}
        onRetake={handleRetake}
        onReviewSkill={handleReviewSkill}
      >
        <MockTestPlayer
          viewModel={viewModel}
          test={viewModel.test}
          labels={labels.take}
          resolvedProgress={resolvedProgress}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          questionResults={questionResults}
          isSubmitting={isPending}
          isReviewingTest={isReviewingTest}
          activeReviewQuestionId={activeReviewQuestionId}
          showFramedReview={showFramedReview}
          onIndexChange={setCurrentQuestionIndex}
          onAnswerChange={onAnswerChange}
          onSubmit={handleSubmit}
          onSelectReviewQuestion={openReviewQuestion}
          onCloseFramedReview={closeFramedReview}
          onBackToReviewList={backToReviewList}
          onExitReviewMode={exitReviewMode}
        />
      </MockTestPageShell>
    </StudentPageShell>
  );
}
