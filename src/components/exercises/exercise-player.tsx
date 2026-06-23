"use client";

import Image from "next/image";
import { useState } from "react";
import { normalizeQuestionType } from "@/lib/learning/question-types";
import type { PublicQuestion, QuestionResult, UserAnswer, ExerciseResult } from "@/types/learning";
import { MultipleChoice } from "./multiple-choice";
import { MultiSelect } from "./multi-select";
import { Matching } from "./matching";
import { GapFill } from "./gap-fill";
import { SentenceOrdering } from "./sentence-ordering";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseContextPanel } from "@/components/exercises/exercise-context-panel";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QuestionRendererProps {
  question: PublicQuestion;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
  showResult?: boolean;
  disabled?: boolean;
  questionResult?: QuestionResult;
}

export function QuestionRenderer({
  question,
  answer,
  onAnswer,
  showResult,
  disabled,
  questionResult,
}: QuestionRendererProps) {
  const questionType = normalizeQuestionType(question.question_type);
  switch (questionType) {
    case "multiple_choice":
    case "listening":
    case "reading_comprehension":
    case "image_selection":
      return (
        <MultipleChoice
          choices={question.choices ?? []}
          selectedId={(answer as Extract<UserAnswer, { type: "single" }>)?.choiceId ?? null}
          onSelect={(choiceId) => onAnswer({ type: "single", choiceId })}
          disabled={disabled}
          showResult={showResult}
          questionResult={questionResult}
        />
      );

    case "multi_select":
      return (
        <MultiSelect
          choices={question.choices ?? []}
          selectedIds={(answer as Extract<UserAnswer, { type: "multi" }>)?.choiceIds ?? []}
          onToggle={(choiceId) => {
            const current = (answer as Extract<UserAnswer, { type: "multi" }>)?.choiceIds ?? [];
            const next = current.includes(choiceId)
              ? current.filter((id) => id !== choiceId)
              : [...current, choiceId];
            onAnswer({ type: "multi", choiceIds: next });
          }}
          disabled={disabled}
          showResult={showResult}
          questionResult={questionResult}
        />
      );

    case "matching":
    case "drag_drop": {
      const pairs = question.pairs ?? [];
      const matchRecord: Record<string, string> = {};
      const matchAnswer = answer as Extract<UserAnswer, { type: "matching" }> | undefined;
      matchAnswer?.pairs.forEach((p) => {
        matchRecord[p.leftId] = p.rightText;
      });
      const rightOptions =
        question.matchingOptions ??
        [...new Set(pairs.map((p) => p.left_text))].sort(() => Math.random() - 0.5);

      return (
        <Matching
          pairs={pairs}
          rightOptions={rightOptions}
          matches={matchRecord}
          onMatch={(leftId, rightText) => {
            const existing = matchAnswer?.pairs.filter((p) => p.leftId !== leftId) ?? [];
            onAnswer({ type: "matching", pairs: [...existing, { leftId, rightText }] });
          }}
          disabled={disabled}
          showResult={showResult}
          correctPairs={questionResult?.correctPairs}
        />
      );
    }

    case "gap_fill":
      return (
        <GapFill
          template={(question.content.template as string) ?? question.question_text}
          answers={(answer as Extract<UserAnswer, { type: "gap_fill" }>)?.answers ?? []}
          onChange={(index, value) => {
            const current = (answer as Extract<UserAnswer, { type: "gap_fill" }>)?.answers ?? [];
            const next = [...current];
            next[index] = value;
            onAnswer({ type: "gap_fill", answers: next });
          }}
          disabled={disabled}
          showResult={showResult}
          correctAnswers={questionResult?.correctAnswers}
        />
      );

    case "sentence_ordering": {
      const items = (question.content.items as { id: string; text: string }[]) ?? [];
      const defaultOrder = items.map((i) => i.id);
      return (
        <SentenceOrdering
          items={items}
          order={(answer as Extract<UserAnswer, { type: "sentence_ordering" }>)?.order ?? defaultOrder}
          onReorder={(order) => onAnswer({ type: "sentence_ordering", order })}
          disabled={disabled}
          showResult={showResult}
          correctOrder={questionResult?.correctOrder}
        />
      );
    }

    default:
      return (
        <p className="text-sm text-gray-500">
          Loại câu hỏi này sẽ được hỗ trợ trong phiên bản tiếp theo.
        </p>
      );
  }
}

interface ExercisePlayerProps {
  questions: PublicQuestion[];
  title: string;
  instructions?: string | null;
  exerciseType?: string;
  content?: Record<string, unknown>;
  showListeningTranscript?: boolean;
  onSubmit: (answers: Record<string, UserAnswer>) => Promise<ExerciseResult | null>;
  onComplete?: (result: ExerciseResult) => void;
  nextExerciseTitle?: string;
  onNextExercise?: () => void;
  embeddedResult?: boolean;
  resultLabels?: {
    resultHeading: (percent: number) => string;
    scoreLine: (score: number, maxScore: number) => string;
  };
}

export function ExercisePlayer({
  questions,
  title,
  instructions,
  exerciseType,
  content,
  showListeningTranscript = false,
  onSubmit,
  onComplete,
  nextExerciseTitle,
  onNextExercise,
  embeddedResult = false,
  resultLabels,
}: ExercisePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  function handleAnswer(answer: UserAnswer) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const exerciseResult = await onSubmit(answers);
      if (exerciseResult) {
        setResult(exerciseResult);
        setShowResults(true);
        onComplete?.(exerciseResult);
      } else {
        toast.error("Không nộp được bài. Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi kết nối. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showResults && result) {
    const resultHeading = resultLabels?.resultHeading
      ? resultLabels.resultHeading(result.accuracyPercent)
      : `Kết quả: ${result.accuracyPercent}%`;
    const scoreLine = resultLabels?.scoreLine
      ? resultLabels.scoreLine(result.score, result.maxScore)
      : `Điểm: ${result.score}/${result.maxScore}`;

    if (embeddedResult) {
      return (
        <div className="space-y-3 px-1 py-1">
          <div className="flex items-center gap-2 border-b border-border/40 pb-2">
            {result.accuracyPercent >= 80 ? (
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-muted shrink-0" />
            )}
            <p className="camba-caption font-medium text-muted-foreground">{resultHeading}</p>
          </div>
          <ExerciseContextPanel
            exerciseType={exerciseType}
            content={content}
            showListeningTranscript
          />
          <p className="camba-caption text-muted">{scoreLine}</p>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const qr = result.questionResults.find((r) => r.questionId === q.id);
              return (
                <div key={q.id} className="space-y-1.5">
                  <p className="camba-caption font-medium text-foreground/90">
                    {i + 1}. {q.question_text}
                  </p>
                  <QuestionRenderer
                    question={q}
                    answer={answers[q.id]}
                    onAnswer={() => {}}
                    showResult
                    disabled
                    questionResult={qr}
                  />
                  {qr?.explanation && (
                    <p className="text-xs text-muted bg-muted/40 p-2 rounded">
                      {qr.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {result.accuracyPercent >= 80 ? (
              <CheckCircle2 className="h-6 w-6 text-success" />
            ) : (
              <XCircle className="h-6 w-6 text-warning" />
            )}
            Kết quả: {result.accuracyPercent}%
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ExerciseContextPanel
            exerciseType={exerciseType}
            content={content}
            showListeningTranscript
          />
          <p className="text-sm text-gray-600">
            Điểm: {result.score}/{result.maxScore}
          </p>
          <div className="space-y-6">
            {questions.map((q, i) => {
              const qr = result.questionResults.find((r) => r.questionId === q.id);
              return (
                <div key={q.id} className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {i + 1}. {q.question_text}
                  </p>
                  <QuestionRenderer
                    question={q}
                    answer={answers[q.id]}
                    onAnswer={() => {}}
                    showResult
                    disabled
                    questionResult={qr}
                  />
                  {qr?.explanation && (
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      {qr.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {onNextExercise && (
            <div className="flex justify-end">
              <Button onClick={onNextExercise}>
                Bài tiếp theo
                {nextExerciseTitle ? `: ${nextExerciseTitle}` : ""}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {instructions && (
          <p className="text-sm text-gray-500 mt-1">{instructions}</p>
        )}
        <div className="flex gap-1 mt-3">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i === currentIndex
                  ? "bg-primary"
                  : answers[questions[i].id]
                    ? "bg-primary/40"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ExerciseContextPanel exerciseType={exerciseType} content={content} />
        <div>
          <p className="text-xs text-gray-500 mb-2">
            Câu {currentIndex + 1}/{questions.length}
          </p>
          <p className="text-base font-medium text-gray-900 mb-4">
            {currentQuestion.question_text}
          </p>
          {currentQuestion.media_url && (
            <Image
              src={currentQuestion.media_url}
              alt=""
              width={800}
              height={450}
              className="max-w-full h-auto rounded-lg mb-4"
            />
          )}
          <QuestionRenderer
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
          />
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>

          {isLast ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang nộp...
                </>
              ) : (
                "Nộp bài"
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={!answers[currentQuestion.id]}
            >
              Tiếp
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
