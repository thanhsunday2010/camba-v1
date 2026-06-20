"use client";

import { useState } from "react";
import type { Exercise, ExerciseResult, UserAnswer } from "@/types/learning";
import { ExercisePlayer } from "@/components/exercises/exercise-player";
import { WritingExercise } from "@/components/exercises/writing-exercise";
import { SpeakingExercise } from "@/components/exercises/speaking-exercise";
import { submitExerciseAttempt } from "@/actions/learning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, PenLine, Mic } from "lucide-react";

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
};

interface LessonPlayerProps {
  lessonId: string;
  lessonTitle: string;
  exercises: Exercise[];
}

function getExerciseIcon(type: string) {
  if (type === "writing") return PenLine;
  if (type === "speaking") return Mic;
  return Circle;
}

export function LessonPlayer({ lessonId, lessonTitle, exercises }: LessonPlayerProps) {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  async function handleSubmit(
    exerciseId: string,
    answers: Record<string, UserAnswer>
  ): Promise<ExerciseResult | null> {
    const result = await submitExerciseAttempt(exerciseId, lessonId, answers, 0);
    if (result.success && result.data) {
      setCompletedExercises((prev) => new Set([...prev, exerciseId]));
      return result.data;
    }
    return null;
  }

  function handleAiComplete(exerciseId: string) {
    setCompletedExercises((prev) => new Set([...prev, exerciseId]));
  }

  if (activeExerciseIndex !== null) {
    const exercise = exercises[activeExerciseIndex];
    const content = exercise.content ?? {};
    const prompt =
      (content.prompt as string) ??
      exercise.instructions ??
      exercise.title;

    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setActiveExerciseIndex(null)}>
          ← Quay lại danh sách bài tập
        </Button>

        {exercise.exercise_type === "writing" ? (
          <WritingExercise
            exerciseId={exercise.id}
            lessonId={lessonId}
            title={exercise.title}
            instructions={exercise.instructions}
            prompt={prompt}
            minWords={(content.minWords as number) ?? 30}
            maxWords={(content.maxWords as number) ?? 200}
            targetLevel={content.targetLevel as string | undefined}
            labels={AI_FEEDBACK_LABELS}
            onComplete={() => handleAiComplete(exercise.id)}
          />
        ) : exercise.exercise_type === "speaking" ? (
          <SpeakingExercise
            exerciseId={exercise.id}
            lessonId={lessonId}
            title={exercise.title}
            instructions={exercise.instructions}
            prompt={prompt}
            maxDurationSeconds={(content.maxDurationSeconds as number) ?? 120}
            targetLevel={content.targetLevel as string | undefined}
            labels={AI_FEEDBACK_LABELS}
            onComplete={() => handleAiComplete(exercise.id)}
          />
        ) : (
          <ExercisePlayer
            questions={exercise.questions ?? []}
            title={exercise.title}
            instructions={exercise.instructions}
            onSubmit={(answers) => handleSubmit(exercise.id, answers)}
            onComplete={() => {
              handleAiComplete(exercise.id);
              if (activeExerciseIndex < exercises.length - 1) {
                setTimeout(() => setActiveExerciseIndex(activeExerciseIndex + 1), 1500);
              }
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{lessonTitle}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {exercises.length} bài tập • {completedExercises.size} hoàn thành
        </p>
      </div>

      <div className="space-y-3">
        {exercises.map((exercise, index) => {
          const isCompleted = completedExercises.has(exercise.id);
          const Icon = getExerciseIcon(exercise.exercise_type);
          const isAi = exercise.exercise_type === "writing" || exercise.exercise_type === "speaking";

          return (
            <Card
              key={exercise.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setActiveExerciseIndex(index)}
            >
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Icon className="h-5 w-5 text-gray-300" />
                    )}
                    <div>
                      <CardTitle className="text-base">{exercise.title}</CardTitle>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isAi
                          ? exercise.exercise_type === "writing"
                            ? "Bài viết • AI chấm"
                            : "Bài nói • AI chấm"
                          : `${exercise.questions?.length ?? 0} câu hỏi`}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                    {isCompleted ? "Làm lại" : "Bắt đầu"}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {exercises.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Chưa có bài tập cho bài học này.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
