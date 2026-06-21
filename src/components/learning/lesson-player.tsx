"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
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
import type {
  LessonExerciseListLabels,
  LessonExerciseSummary,
  LessonPageProgress,
} from "@/lib/learning/lesson-page-types";
import { LessonExerciseList } from "@/components/learning/lesson/lesson-exercise-list";
import { Button } from "@/components/ui/button";
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

/** AI exercise labels — deep component i18n deferred to U5B */
const AI_FEEDBACK_LABELS = {
  placeholder: "Viết câu trả lời của bạn tại đây...",
  wordCount: "Số từ",
  submit: "Gửi cho AI chấm",
  submitting: "AI đang phân tích...",
  minWordsError: "Cần ít nhất {min} từ",
  result: "Kết quả phản hồi AI",
  estimatedLevel: "Trình độ ước tính",
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
  coherence: "Mạch lạc",
  improvements: "Gợi ý cải thiện",
  pronunciation: "Phát âm",
  fluency: "Độ trôi chảy",
  suggestions: "Gợi ý",
  overallScore: "Điểm tổng",
  startRecording: "Bắt đầu ghi âm",
  stopRecording: "Dừng ghi âm",
  noRecording: "Vui lòng ghi âm trước khi gửi",
  recording: "Đang ghi",
  transcript: "Bản ghi",
  transcriptPlaceholder: "Nói vào microphone để xem bản ghi...",
  transcriptUnsupported: "Trình duyệt không hỗ trợ bản ghi thời gian thực",
};

interface LessonPlayerProps {
  lessonId: string;
  exercises: Exercise[];
  exerciseSummaries: LessonExerciseSummary[];
  initialCompletedExerciseIds: string[];
  nextSuggestedExerciseId?: string | null;
  lessonProgress?: LessonPageProgress;
  listLabels: LessonExerciseListLabels & {
    exercisesTitle: string;
    exercisesSubtitle: string;
    nextSuggested: string;
    backToList: string;
  };
}

export function LessonPlayer({
  lessonId,
  exercises,
  exerciseSummaries,
  initialCompletedExerciseIds,
  nextSuggestedExerciseId,
  listLabels,
}: LessonPlayerProps) {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [sessionCompletedIds, setSessionCompletedIds] = useState<Set<string>>(
    () => new Set(initialCompletedExerciseIds)
  );

  const exerciseIndexById = useMemo(() => {
    const map = new Map<string, number>();
    exercises.forEach((exercise, index) => map.set(exercise.id, index));
    return map;
  }, [exercises]);

  function openExercise(exerciseId: string) {
    setActiveExerciseId(exerciseId);
  }

  function openNextExercise() {
    if (!activeExerciseId) return;
    const currentIndex = exerciseIndexById.get(activeExerciseId);
    if (currentIndex === undefined) return;

    const sortedIds = [...exerciseSummaries]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => s.id);

    const sortedIndex = sortedIds.indexOf(activeExerciseId);
    const nextId = sortedIndex >= 0 ? sortedIds[sortedIndex + 1] : undefined;
    if (nextId) {
      setActiveExerciseId(nextId);
    }
  }

  function markExerciseCompleted(exerciseId: string) {
    setSessionCompletedIds((prev) => new Set([...prev, exerciseId]));
  }

  async function handleSubmit(
    exerciseId: string,
    answers: Record<string, UserAnswer>
  ): Promise<ExerciseResult | null> {
    const result = await submitExerciseAttempt(exerciseId, lessonId, answers, 0);
    if (result.success && result.data) {
      markExerciseCompleted(exerciseId);
      return result.data;
    }
    throw new Error(result.error ?? "Submit failed");
  }

  if (activeExerciseId) {
    const activeIndex = exerciseIndexById.get(activeExerciseId);

    if (activeIndex !== undefined) {
      const exercise = exercises[activeIndex];
      const nextIndex = activeIndex + 1;
      const nextExercise = exercises[nextIndex];
      const content = exercise.content ?? {};
      const fallbackPrompt = exercise.instructions ?? exercise.title;
      const writingPrompt = buildWritingPromptText(content, fallbackPrompt);
      const speakingPrompt = buildSpeakingPromptText(content, fallbackPrompt);
      const targetLevel = resolveTargetLevel(content);

      return (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setActiveExerciseId(null)}>
            ← {listLabels.backToList}
          </Button>

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
              labels={AI_FEEDBACK_LABELS}
              onComplete={() => markExerciseCompleted(exercise.id)}
              nextExerciseTitle={nextExercise?.title}
              onNextExercise={nextExercise ? openNextExercise : undefined}
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
              labels={AI_FEEDBACK_LABELS}
              onComplete={() => markExerciseCompleted(exercise.id)}
              nextExerciseTitle={nextExercise?.title}
              onNextExercise={nextExercise ? openNextExercise : undefined}
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
              onComplete={() => markExerciseCompleted(exercise.id)}
              nextExerciseTitle={nextExercise?.title}
              onNextExercise={nextExercise ? openNextExercise : undefined}
            />
          )}
        </div>
      );
    }
  }

  return (
    <LessonExerciseList
      summaries={exerciseSummaries}
      sessionCompletedIds={sessionCompletedIds}
      nextSuggestedExerciseId={nextSuggestedExerciseId}
      labels={listLabels}
      onSelectExercise={openExercise}
    />
  );
}
