"use client";

import { useState } from "react";
import { submitWritingForFeedback } from "@/actions/ai/writing";
import { AiFeedbackPanel } from "@/components/ai/ai-feedback-panel";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, PenLine } from "lucide-react";
import { toast } from "sonner";
import type { WritingFeedback } from "@/types/ai";
import type { AiExerciseLabels } from "@/lib/learning/lesson-page-types";
import { useLessonI18nFormatters } from "@/lib/learning/use-lesson-i18n-formatters";
import { AiWritingWordCounter } from "@/components/ai/ai-writing-word-counter";
import {
  AI_WRITING_MAX_WORDS,
  AI_WRITING_WORD_LIMIT_ERROR,
  clampWritingToWordLimit,
  countWords,
} from "@/lib/ai/ai-input-limits";

interface WritingExerciseProps {
  exerciseId: string;
  lessonId: string;
  title: string;
  instructions?: string | null;
  prompt: string;
  taskDescription?: string;
  taskPrompts?: string[];
  minWords?: number;
  targetLevel?: string;
  labels: AiExerciseLabels;
  onComplete?: (meta?: {
    accuracyPercent?: number;
    gamification?: import("@/lib/gamification/gamification-types").ExerciseGamificationSummary;
  }) => void;
  nextExerciseTitle?: string;
  onNextExercise?: () => void;
}

export function WritingExercise({
  exerciseId,
  lessonId,
  title,
  instructions,
  prompt,
  taskDescription,
  taskPrompts = [],
  minWords = 30,
  targetLevel,
  labels,
  onComplete,
  nextExerciseTitle,
  onNextExercise,
}: WritingExerciseProps) {
  const fmt = useLessonI18nFormatters();
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxWords = AI_WRITING_MAX_WORDS;
  const wordCount = countWords(content);

  async function handleSubmit() {
    setError(null);
    if (wordCount < minWords) {
      setError(fmt.minWordsError(minWords));
      return;
    }
    if (wordCount > maxWords) {
      setError(AI_WRITING_WORD_LIMIT_ERROR);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitWritingForFeedback(
        exerciseId,
        lessonId,
        prompt,
        content,
        targetLevel
      );
      if (result.success && result.data) {
        setFeedback(result.data);
        onComplete?.({
          accuracyPercent: result.data.overallScore,
          gamification: result.data.gamification,
        });
      } else {
        const message = result.error ?? "Không gửi được bài. Vui lòng thử lại.";
        setError(message);
        toast.error(message);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Lỗi kết nối. Vui lòng thử lại.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (feedback) {
    return (
      <AiFeedbackPanel
        type="writing"
        feedback={feedback}
        labels={labels}
        actions={
          onNextExercise ? (
            <div className="flex justify-end">
              <Button onClick={onNextExercise} className="gap-1">
                {fmt.nextExerciseLabel(nextExerciseTitle)}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="camba-h3 text-foreground flex items-center gap-2">
          <PenLine className="h-5 w-5 text-program shrink-0" />
          {title}
        </h2>
        {instructions && <p className="camba-caption text-muted">{instructions}</p>}
      </header>

      <div className="rounded-xl border border-program/15 bg-program/5 p-4 space-y-3">
        {taskDescription && (
          <p className="camba-body font-medium text-foreground">{taskDescription}</p>
        )}
        {taskPrompts.length > 0 ? (
          <ol className="list-decimal list-inside space-y-1 camba-body text-foreground/90">
            {taskPrompts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        ) : (
          <p className="camba-body font-medium text-foreground">{prompt}</p>
        )}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(clampWritingToWordLimit(e.target.value))}
        placeholder={labels.placeholder}
        rows={8}
        className="w-full rounded-xl border border-border bg-white px-3 py-2 camba-body text-foreground focus:outline-none focus:ring-2 focus:ring-program/30 resize-y"
      />

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/40">
        <AiWritingWordCounter text={content} maxWords={maxWords} minWords={minWords} label={labels.wordCount} />
        <Button onClick={handleSubmit} disabled={isSubmitting || wordCount === 0}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              {labels.submitting}
            </>
          ) : (
            labels.submit
          )}
        </Button>
      </div>

      {error && (
        <p className="camba-caption text-error bg-error/5 border border-error/20 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
