"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Exercise, ExerciseResult, UserAnswer } from "@/types/learning";
import { ExercisePlayer } from "@/components/exercises/exercise-player";
import { submitExerciseAttempt } from "@/actions/learning";
import {
  buildSpeakingPromptText,
  buildWritingPromptText,
  getFollowUpQuestions,
  getWritingPrompts,
  resolveTargetLevel,
  resolveWritingMaxWords,
  resolveWritingMinWords,
} from "@/lib/learning/ai-exercise-content";
import {
  EXERCISE_REVIEW_ACCURACY_THRESHOLD,
} from "@/lib/learning/lesson-ui-utils";
import type {
  AiExerciseLabels,
  LessonChromeLabels,
  LessonCompleteSummaryLabels,
  LessonExerciseCompletionMeta,
  LessonExerciseListLabels,
  LessonExerciseSummary,
  ResolvedLessonProgress,
} from "@/lib/learning/lesson-page-types";
import { LessonExerciseList } from "@/components/learning/lesson/lesson-exercise-list";
import { LessonActiveExerciseHeader } from "@/components/learning/lesson/lesson-active-exercise-header";
import { LessonFinalExerciseResultFrame } from "@/components/learning/lesson/lesson-final-exercise-result-frame";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const WritingExercise = dynamic(
  () =>
    import("@/components/exercises/writing-exercise").then((m) => ({
      default: m.WritingExercise,
    })),
  {
    loading: () => (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    ),
  }
);

const SpeakingExercise = dynamic(
  () =>
    import("@/components/exercises/speaking-exercise").then((m) => ({
      default: m.SpeakingExercise,
    })),
  {
    loading: () => (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    ),
  }
);

interface LessonPlayerProps {
  lessonId: string;
  lessonTitle: string;
  exercises: Exercise[];
  exerciseSummaries: LessonExerciseSummary[];
  sessionCompletedExerciseIds: Set<string>;
  sessionAccuracyByExerciseId: ReadonlyMap<string, number>;
  onExerciseCompleted: (
    exerciseId: string,
    meta?: LessonExerciseCompletionMeta
  ) => void;
  resolvedProgress: ResolvedLessonProgress;
  activeExerciseId: string | null;
  isReviewingLesson?: boolean;
  onActiveExerciseChange: (exerciseId: string | null) => void;
  onCloseFramedExercise?: () => void;
  onExitReviewMode?: () => void;
  completeSummaryLabels: LessonCompleteSummaryLabels;
  aiLabels: AiExerciseLabels;
  chromeLabels: LessonChromeLabels;
  listLabels: LessonExerciseListLabels & {
    exercisesTitle: string;
    exercisesSubtitle: string;
    nextSuggested: string;
    backToList: string;
    backToComplete?: string;
  };
}

export function LessonPlayer({
  lessonId,
  lessonTitle,
  exercises,
  exerciseSummaries,
  sessionCompletedExerciseIds,
  sessionAccuracyByExerciseId,
  onExerciseCompleted,
  resolvedProgress,
  activeExerciseId,
  isReviewingLesson = false,
  onActiveExerciseChange,
  onCloseFramedExercise,
  onExitReviewMode,
  completeSummaryLabels,
  aiLabels,
  chromeLabels,
  listLabels,
}: LessonPlayerProps) {
  const sortedSummaries = useMemo(
    () => [...exerciseSummaries].sort((a, b) => a.sortOrder - b.sortOrder),
    [exerciseSummaries]
  );

  const exerciseIndexById = useMemo(() => {
    const map = new Map<string, number>();
    exercises.forEach((exercise, index) => map.set(exercise.id, index));
    return map;
  }, [exercises]);

  const showExerciseList =
    !resolvedProgress.isLessonCompleteResolved || isReviewingLesson;

  const showFinalExerciseFrame =
    resolvedProgress.isLessonCompleteResolved &&
    !isReviewingLesson &&
    Boolean(activeExerciseId);

  function openExercise(exerciseId: string) {
    onActiveExerciseChange(exerciseId);
  }

  function openNextExercise() {
    if (!activeExerciseId) return;

    const sortedIds = sortedSummaries.map((s) => s.id);
    const sortedIndex = sortedIds.indexOf(activeExerciseId);
    const nextId = sortedIndex >= 0 ? sortedIds[sortedIndex + 1] : undefined;
    if (nextId) {
      onActiveExerciseChange(nextId);
    }
  }

  function markExerciseCompleted(
    exerciseId: string,
    meta?: LessonExerciseCompletionMeta
  ) {
    onExerciseCompleted(exerciseId, meta);
  }

  async function handleSubmit(
    exerciseId: string,
    answers: Record<string, UserAnswer>
  ): Promise<ExerciseResult | null> {
    const result = await submitExerciseAttempt(exerciseId, lessonId, answers, 0);
    if (result.success && result.data) {
      markExerciseCompleted(exerciseId, {
        exerciseId,
        accuracyPercent: result.data.accuracyPercent,
      });
      return result.data;
    }
    throw new Error(result.error ?? chromeLabels.submitFailed);
  }

  if (activeExerciseId) {
    const activeIndex = exerciseIndexById.get(activeExerciseId);
    const sortedPosition =
      sortedSummaries.findIndex((s) => s.id === activeExerciseId) + 1;

    if (activeIndex !== undefined && sortedPosition > 0) {
      const exercise = exercises[activeIndex];
      const nextIndex = activeIndex + 1;
      const nextExercise = exercises[nextIndex];
      const content = exercise.content ?? {};
      const fallbackPrompt = exercise.instructions ?? exercise.title;
      const writingPrompt = buildWritingPromptText(content, fallbackPrompt);
      const speakingPrompt = buildSpeakingPromptText(content, fallbackPrompt);
      const targetLevel = resolveTargetLevel(content);

      const sessionAccuracy = sessionAccuracyByExerciseId.get(exercise.id);
      const showReviewTag =
        sessionAccuracy != null &&
        sessionAccuracy > 0 &&
        sessionAccuracy < EXERCISE_REVIEW_ACCURACY_THRESHOLD;

      const exerciseBody = (
        <CambaCard
          variant={showFinalExerciseFrame ? "lesson" : "elevated"}
          padding="md"
          className={cn(
            "overflow-hidden",
            showFinalExerciseFrame && "shadow-none border-border/50 bg-white/80"
          )}
        >
          {exercise.exercise_type === "writing" ? (
            <WritingExercise
              key={exercise.id}
              exerciseId={exercise.id}
              lessonId={lessonId}
              title={exercise.title}
              instructions={exercise.instructions}
              prompt={writingPrompt}
              taskDescription={content.taskDescription as string | undefined}
              taskPrompts={getWritingPrompts(content)}
              minWords={resolveWritingMinWords(content)}
              maxWords={resolveWritingMaxWords(content)}
              targetLevel={targetLevel}
              labels={aiLabels}
              onComplete={() => markExerciseCompleted(exercise.id, { exerciseId: exercise.id })}
              nextExerciseTitle={nextExercise?.title}
              onNextExercise={
                nextExercise && !showFinalExerciseFrame ? openNextExercise : undefined
              }
            />
          ) : exercise.exercise_type === "speaking" ? (
            <SpeakingExercise
              key={exercise.id}
              exerciseId={exercise.id}
              lessonId={lessonId}
              title={exercise.title}
              instructions={exercise.instructions}
              prompt={speakingPrompt}
              followUpQuestions={getFollowUpQuestions(content)}
              pictureDescription={content.pictureDescription as string | undefined}
              maxDurationSeconds={(content.maxDurationSeconds as number) ?? 120}
              targetLevel={targetLevel}
              labels={aiLabels}
              onComplete={() => markExerciseCompleted(exercise.id, { exerciseId: exercise.id })}
              nextExerciseTitle={nextExercise?.title}
              onNextExercise={
                nextExercise && !showFinalExerciseFrame ? openNextExercise : undefined
              }
            />
          ) : (
            <ExercisePlayer
              key={exercise.id}
              questions={exercise.questions ?? []}
              title={exercise.title}
              instructions={exercise.instructions}
              exerciseType={exercise.exercise_type}
              content={exercise.content}
              onSubmit={(answers) => handleSubmit(exercise.id, answers)}
              onComplete={(result) =>
                markExerciseCompleted(exercise.id, {
                  exerciseId: exercise.id,
                  accuracyPercent: result.accuracyPercent,
                })
              }
              nextExerciseTitle={nextExercise?.title}
              onNextExercise={
                nextExercise && !showFinalExerciseFrame ? openNextExercise : undefined
              }
              embeddedResult={showFinalExerciseFrame}
              resultLabels={
                showFinalExerciseFrame
                  ? {
                      resultHeading: chromeLabels.embeddedResultHeading,
                      scoreLine: chromeLabels.embeddedResultScore,
                    }
                  : undefined
              }
            />
          )}
        </CambaCard>
      );

      return (
        <div className={cn("space-y-4", showFinalExerciseFrame && "space-y-2")}>
          {!showFinalExerciseFrame && (
            <LessonActiveExerciseHeader
              lessonTitle={lessonTitle}
              exerciseTitle={exercise.title}
              position={sortedPosition}
              total={sortedSummaries.length}
              completionPercent={resolvedProgress.completionPercentResolved}
              labels={chromeLabels}
              onBackToList={() => onActiveExerciseChange(null)}
            />
          )}

          {showFinalExerciseFrame ? (
            <LessonFinalExerciseResultFrame
              exerciseTitle={exercise.title}
              accuracyPercent={sessionAccuracy}
              showReviewTag={showReviewTag}
              labels={completeSummaryLabels}
              onClose={onCloseFramedExercise}
            >
              {exerciseBody}
            </LessonFinalExerciseResultFrame>
          ) : (
            exerciseBody
          )}
        </div>
      );
    }
  }

  if (!showExerciseList) {
    return null;
  }

  return (
    <LessonExerciseList
      summaries={exerciseSummaries}
      sessionCompletedIds={sessionCompletedExerciseIds}
      sessionAccuracyByExerciseId={sessionAccuracyByExerciseId}
      nextSuggestedExerciseId={
        isReviewingLesson ? null : resolvedProgress.nextSuggestedExerciseId
      }
      isReviewMode={isReviewingLesson}
      onExitReviewMode={onExitReviewMode}
      exitReviewLabel={
        isReviewingLesson && listLabels.backToComplete
          ? listLabels.backToComplete
          : undefined
      }
      labels={listLabels}
      onSelectExercise={openExercise}
    />
  );
}
