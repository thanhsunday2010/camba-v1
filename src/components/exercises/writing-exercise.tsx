"use client";

import { useState } from "react";
import { submitWritingForFeedback } from "@/actions/ai/writing";
import { AiFeedbackPanel } from "@/components/ai/ai-feedback-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Loader2, PenLine } from "lucide-react";
import { toast } from "sonner";
import type { WritingFeedback } from "@/types/ai";

interface WritingExerciseProps {
  exerciseId: string;
  lessonId: string;
  title: string;
  instructions?: string | null;
  prompt: string;
  minWords?: number;
  maxWords?: number;
  targetLevel?: string;
  labels: {
    placeholder: string;
    wordCount: string;
    submit: string;
    submitting: string;
    minWordsError: string;
    result: string;
    estimatedLevel: string;
    grammar: string;
    vocabulary: string;
    coherence: string;
    improvements: string;
    pronunciation: string;
    fluency: string;
    suggestions: string;
    overallScore: string;
  };
  onComplete?: () => void;
  nextExerciseTitle?: string;
  onNextExercise?: () => void;
}

export function WritingExercise({
  exerciseId,
  lessonId,
  title,
  instructions,
  prompt,
  minWords = 30,
  maxWords = 200,
  targetLevel,
  labels,
  onComplete,
  nextExerciseTitle,
  onNextExercise,
}: WritingExerciseProps) {
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  async function handleSubmit() {
    setError(null);
    if (wordCount < minWords) {
      setError(labels.minWordsError.replace("{min}", String(minWords)));
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
        onComplete?.();
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
              <Button onClick={onNextExercise}>
                Bài tiếp theo
                {nextExerciseTitle ? `: ${nextExerciseTitle}` : ""}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : undefined
        }
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {instructions && <p className="text-sm text-gray-500">{instructions}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900">{prompt}</p>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={labels.placeholder}
          rows={8}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
          maxLength={maxWords * 8}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {labels.wordCount}: {wordCount} / {maxWords}
          </span>
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
          <p className="text-sm text-error bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
