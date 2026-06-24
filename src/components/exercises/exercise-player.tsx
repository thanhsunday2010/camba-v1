"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { normalizeQuestionType } from "@/lib/learning/question-types";
import { isWritingQuestion, isQuestionAnswered } from "@/lib/writing/writing-utils";
import { isSpeakingQuestion } from "@/lib/speaking/speaking-utils";
import { WritingPlayer } from "@/components/writing/writing-player";
import { SpeakingPlayer } from "@/components/speaking/speaking-player";
import type { PublicQuestion, QuestionResult, UserAnswer, ExerciseResult } from "@/types/learning";
import { MultipleChoice } from "./multiple-choice";
import { MultiSelect } from "./multi-select";
import { Matching } from "./matching";
import { GapFill } from "./gap-fill";
import { SentenceOrdering } from "./sentence-ordering";
import { Button } from "@/components/ui/button";
import { ExerciseContextPanel } from "@/components/exercises/exercise-context-panel";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLessonI18nFormatters } from "@/lib/learning/use-lesson-i18n-formatters";
import { cn } from "@/lib/utils";

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
  const t = useTranslations("learning.lesson.exercisePlayer");
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

    case "writing":
      if (isWritingQuestion(question)) {
        return (
          <WritingPlayer
            question={question}
            answer={answer}
            onAnswer={onAnswer}
            disabled={disabled}
            showResult={showResult}
          />
        );
      }
      return <p className="camba-caption text-muted">{t("unsupportedQuestionType")}</p>;

    case "speaking":
      if (isSpeakingQuestion(question)) {
        return (
          <SpeakingPlayer
            question={question}
            answer={answer}
            onAnswer={onAnswer}
            disabled={disabled}
            showResult={showResult}
          />
        );
      }
      return <p className="camba-caption text-muted">{t("unsupportedQuestionType")}</p>;

    default:
      return <p className="camba-caption text-muted">{t("unsupportedQuestionType")}</p>;
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
}

function QuestionProgressDots({
  questions,
  currentIndex,
  answers,
}: {
  questions: PublicQuestion[];
  currentIndex: number;
  answers: Record<string, UserAnswer>;
}) {
  return (
    <div className="flex gap-1" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemax={questions.length}>
      {questions.map((q, i) => (
        <div
          key={q.id}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i === currentIndex
              ? "bg-program"
              : isQuestionAnswered(q, answers[q.id])
                ? "bg-program/40"
                : "bg-[var(--surface-sunken)]"
          )}
        />
      ))}
    </div>
  );
}

function ExerciseResultReview({
  questions,
  answers,
  result,
  exerciseType,
  content,
  embeddedResult,
  onNextExercise,
  nextExerciseTitle,
}: {
  questions: PublicQuestion[];
  answers: Record<string, UserAnswer>;
  result: ExerciseResult;
  exerciseType?: string;
  content?: Record<string, unknown>;
  embeddedResult: boolean;
  onNextExercise?: () => void;
  nextExerciseTitle?: string;
}) {
  const fmt = useLessonI18nFormatters();

  const resultHeading = embeddedResult
    ? fmt.embeddedResultHeading(result.accuracyPercent)
    : fmt.resultHeading(result.accuracyPercent);
  const scoreLine = embeddedResult
    ? fmt.embeddedResultScore(result.score, result.maxScore)
    : fmt.resultScore(result.score, result.maxScore);

  return (
    <div className={cn("space-y-4", embeddedResult && "space-y-3 px-1 py-1")}>
      <div
        className={cn(
          "flex items-center gap-2",
          embeddedResult ? "border-b border-border/40 pb-2" : "pb-1"
        )}
      >
        {result.accuracyPercent >= 80 ? (
          <CheckCircle2
            className={cn("text-success shrink-0", embeddedResult ? "h-4 w-4" : "h-6 w-6")}
          />
        ) : (
          <XCircle
            className={cn(
              "shrink-0",
              embeddedResult ? "h-4 w-4 text-muted" : "h-6 w-6 text-warning"
            )}
          />
        )}
        <p
          className={cn(
            "font-medium",
            embeddedResult ? "camba-caption text-muted-foreground" : "camba-h3 text-foreground"
          )}
        >
          {resultHeading}
        </p>
      </div>

      <ExerciseContextPanel
        exerciseType={exerciseType}
        content={content}
        showListeningTranscript
      />

      <p className={cn(embeddedResult ? "camba-caption text-muted" : "camba-body text-muted")}>
        {scoreLine}
      </p>

      <div className={cn("space-y-4", !embeddedResult && "space-y-6")}>
        {questions.map((q, i) => {
          const qr = result.questionResults.find((r) => r.questionId === q.id);
          return (
            <div key={q.id} className="space-y-1.5">
              <p
                className={cn(
                  "font-medium text-foreground/90",
                  embeddedResult ? "camba-caption" : "camba-body"
                )}
              >
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
                <p className="text-xs text-muted bg-muted/40 p-2 rounded-lg">{qr.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      {onNextExercise && !embeddedResult && (
        <div className="flex justify-end pt-2">
          <Button onClick={onNextExercise} className="gap-1">
            {fmt.nextExerciseLabel(nextExerciseTitle)}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
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
}: ExercisePlayerProps) {
  const fmt = useLessonI18nFormatters();
  const t = useTranslations("learning.lesson");
  const tp = useTranslations("learning.lesson.exercisePlayer");

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

  const hasWriting = questions.some((q) => isWritingQuestion(q));
  const hasSpeaking = questions.some((q) => isSpeakingQuestion(q));
  const hasAiEval = hasWriting || hasSpeaking;

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const exerciseResult = await onSubmit(answers);
      if (exerciseResult) {
        if (exerciseResult.answers) {
          setAnswers(exerciseResult.answers);
        }
        setResult(exerciseResult);
        setShowResults(true);
        onComplete?.(exerciseResult);
      } else {
        toast.error(t("submitFailed"));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tp("connectionError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showResults && result) {
    return (
      <ExerciseResultReview
        questions={questions}
        answers={answers}
        result={result}
        exerciseType={exerciseType}
        content={content}
        embeddedResult={embeddedResult}
        onNextExercise={onNextExercise}
        nextExerciseTitle={nextExerciseTitle}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="camba-h3 text-foreground">{title}</h2>
        {instructions && <p className="camba-caption text-muted">{instructions}</p>}
        <QuestionProgressDots
          questions={questions}
          currentIndex={currentIndex}
          answers={answers}
        />
      </header>

      <ExerciseContextPanel exerciseType={exerciseType} content={content} />

      <div className="space-y-4">
        <p className="camba-caption text-muted">
          {fmt.questionPosition(currentIndex + 1, questions.length)}
        </p>
        <p className="camba-body font-medium text-foreground">{currentQuestion.question_text}</p>
        {currentQuestion.media_url && (
          <Image
            src={currentQuestion.media_url}
            alt=""
            width={800}
            height={450}
            className="max-w-full h-auto rounded-xl border border-border/50"
          />
        )}
        <QuestionRenderer
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          onAnswer={handleAnswer}
        />
      </div>

      <div className="flex justify-between gap-2 pt-2 border-t border-border/40">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          {tp("prev")}
        </Button>

        {isLast ? (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {hasAiEval ? "Evaluating responses…" : tp("submitting")}
              </>
            ) : (
              tp("submit")
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={!isQuestionAnswered(currentQuestion, answers[currentQuestion.id])}
          >
            {tp("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
