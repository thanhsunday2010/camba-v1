"use client";

import Image from "next/image";
import type { PublicQuestion } from "@/types/learning";
import type { UserAnswer } from "@/types/learning";
import { WritingEditor } from "@/components/writing/writing-editor";
import { WritingInstructions } from "@/components/writing/writing-instructions";
import { WritingSubmissionPreview } from "@/components/writing/writing-submission-preview";
import { WritingFeedbackCard } from "@/components/writing/writing-feedback-card";
import {
  createWritingUserAnswer,
  getWritingResponseText,
  parseWritingQuestionContent,
  toWritingSubmission,
  userAnswerToWritingPayload,
} from "@/lib/writing/writing-utils";
import { toWritingQuestionEvaluationSummary } from "@/lib/writing/writing-evaluation-ui";
import { Loader2 } from "lucide-react";

type WritingPlayerProps = {
  question: PublicQuestion;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
  disabled?: boolean;
  showResult?: boolean;
  isEvaluating?: boolean;
};

export function WritingPlayer({
  question,
  answer,
  onAnswer,
  disabled,
  showResult,
  isEvaluating,
}: WritingPlayerProps) {
  const content = parseWritingQuestionContent(question);
  const responseText = getWritingResponseText(answer);
  const payload = userAnswerToWritingPayload(answer);
  const evaluationSummary = toWritingQuestionEvaluationSummary(payload?.evaluation ?? null);

  function handleChange(text: string) {
    onAnswer(createWritingUserAnswer(text, content.cambridgeTaskType));
  }

  if (isEvaluating) {
    return (
      <div className="flex items-center gap-2 camba-body text-muted py-6">
        <Loader2 className="h-4 w-4 animate-spin text-program" />
        Evaluating your writing…
      </div>
    );
  }

  if (showResult) {
    const submission = toWritingSubmission(
      question.id,
      answer,
      content.cambridgeTaskType
    );
    if (!submission) {
      return (
        <p className="camba-caption text-muted">No writing response was submitted.</p>
      );
    }
    return (
      <div className="space-y-4">
        <WritingSubmissionPreview
          submission={submission}
          promptText={content.prompt.prompt}
          imageUrl={content.stimulus?.imageUrl}
        />
        {evaluationSummary ? (
          <WritingFeedbackCard evaluation={evaluationSummary} />
        ) : payload?.evaluation?.status === "failed" ? (
          <WritingFeedbackCard
            evaluation={{
              overallScore: 0,
              bandScore: { model: "yle_shields", shields: 0, maxShields: 5 },
              dimensions: [],
              strengths: [],
              weaknesses: [],
              feedback: payload.evaluation.errorMessage ?? "Evaluation failed",
              correctedVersion: "",
              status: "failed",
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WritingInstructions taskType={content.cambridgeTaskType} prompt={content.prompt} />
      {content.stimulus?.imageUrl && (
        <Image
          src={content.stimulus.imageUrl}
          alt={content.stimulus.imageDescription ?? ""}
          width={640}
          height={360}
          className="max-w-full h-auto rounded-xl border border-border/50"
        />
      )}
      <WritingEditor
        value={responseText}
        onChange={handleChange}
        disabled={disabled}
        constraints={content.constraints}
      />
    </div>
  );
}
