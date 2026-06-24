"use client";

import Image from "next/image";
import type { PublicQuestion } from "@/types/learning";
import type { UserAnswer } from "@/types/learning";
import { SpeakingRecorder } from "@/components/speaking/speaking-recorder";
import { SpeakingFeedbackCard } from "@/components/speaking/speaking-feedback-card";
import { SpeakingTranscriptCard } from "@/components/speaking/speaking-transcript-card";
import {
  createSpeakingUserAnswer,
  getSpeakingTaskLabel,
  parseSpeakingQuestionContent,
  toSpeakingSubmission,
  userAnswerToSpeakingPayload,
} from "@/lib/speaking/speaking-utils";
import { toSpeakingQuestionEvaluationSummary } from "@/lib/speaking/speaking-evaluation-ui";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type SpeakingPlayerProps = {
  question: PublicQuestion;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
  disabled?: boolean;
  showResult?: boolean;
  isEvaluating?: boolean;
};

export function SpeakingPlayer({
  question,
  answer,
  onAnswer,
  disabled,
  showResult,
  isEvaluating,
}: SpeakingPlayerProps) {
  const content = parseSpeakingQuestionContent(question);
  const payload = userAnswerToSpeakingPayload(answer);
  const evaluationSummary = toSpeakingQuestionEvaluationSummary(payload?.evaluation ?? null);

  function handleRecordingComplete(recording: {
    audioRef: string;
    mimeType: string;
    durationSeconds: number;
    transcript?: string;
  }) {
    onAnswer(
      createSpeakingUserAnswer({
        ...recording,
        taskType: content.cambridgeTaskType,
        transcript: recording.transcript ?? payload?.transcript,
      })
    );
    toast.success("Recording saved");
  }

  if (isEvaluating) {
    return (
      <div className="flex items-center gap-2 camba-body text-muted py-6">
        <Loader2 className="h-4 w-4 animate-spin text-program" />
        Evaluating your speaking…
      </div>
    );
  }

  if (showResult) {
    const submission = toSpeakingSubmission(question.id, answer, content.cambridgeTaskType);
    if (!submission) {
      return (
        <p className="camba-caption text-muted">No speaking response was submitted.</p>
      );
    }

    return (
      <div className="space-y-4">
        <CambaCard variant="default" padding="md" className="space-y-2">
          <p className="camba-caption font-medium uppercase tracking-wide text-program">
            {getSpeakingTaskLabel(content.cambridgeTaskType)}
          </p>
          <p className="camba-body text-foreground/90">{content.prompt.prompt}</p>
          <p className="camba-caption text-muted">
            Duration: {submission.durationSeconds}s · Saved recording on file
          </p>
        </CambaCard>
        {(submission.transcript || evaluationSummary?.transcript) && (
          <SpeakingTranscriptCard
            transcript={evaluationSummary?.transcript ?? submission.transcript ?? ""}
          />
        )}
        {content.stimulus?.pictureSequence?.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Story picture ${index + 1}`}
            width={640}
            height={360}
            className="max-w-full h-auto rounded-xl border border-border/50"
          />
        ))}
        {evaluationSummary ? (
          <SpeakingFeedbackCard evaluation={evaluationSummary} />
        ) : payload?.evaluation?.status === "failed" ? (
          <SpeakingFeedbackCard
            evaluation={{
              overallScore: 0,
              bandScore: { model: "yle_shields", shields: 0, maxShields: 5 },
              dimensions: [],
              strengths: [],
              weaknesses: [],
              feedback: payload.evaluation.errorMessage ?? "Evaluation failed",
              transcript: payload.transcript ?? "",
              status: "failed",
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CambaCard variant="default" padding="md" className="space-y-3 border-program/15 bg-program/5">
        <p className="camba-caption font-medium uppercase tracking-wide text-program">
          {getSpeakingTaskLabel(content.cambridgeTaskType)}
        </p>
        {content.prompt.taskDescription && (
          <p className="camba-body font-medium text-foreground">{content.prompt.taskDescription}</p>
        )}
        <p className="camba-body text-foreground/90">{content.prompt.prompt}</p>
        {content.prompt.followUpQuestions && content.prompt.followUpQuestions.length > 0 && (
          <ol className="list-decimal list-inside space-y-1 camba-body text-foreground/90">
            {content.prompt.followUpQuestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        )}
      </CambaCard>

      {content.stimulus?.pictureSequence && content.stimulus.pictureSequence.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {content.stimulus.pictureSequence.map((src, index) => (
            <div key={src} className="space-y-1">
              <p className="camba-caption font-medium text-muted">
                Picture {index + 1}
              </p>
              <Image
                src={src}
                alt={`Story picture ${index + 1}`}
                width={640}
                height={360}
                className="w-full h-auto rounded-xl border border-border/50"
              />
            </div>
          ))}
        </div>
      )}

      {content.stimulus?.imageUrl && (
        <Image
          src={content.stimulus.imageUrl}
          alt={content.stimulus.imageDescription ?? ""}
          width={640}
          height={360}
          className="max-w-full h-auto rounded-xl border border-border/50"
        />
      )}

      {payload?.audioRef ? (
        <CambaCard variant="default" padding="md" className="space-y-2">
          <p className="camba-body text-foreground">Recording saved ({payload.durationSeconds}s)</p>
          {payload.transcript && <SpeakingTranscriptCard transcript={payload.transcript} />}
          <p className="camba-caption text-muted">Record again to replace your answer before submitting.</p>
          <SpeakingRecorder
            questionId={question.id}
            maxDurationSeconds={content.constraints.maxDurationSeconds}
            disabled={disabled}
            onRecordingComplete={handleRecordingComplete}
            onError={(msg) => toast.error(msg)}
          />
        </CambaCard>
      ) : (
        <SpeakingRecorder
          questionId={question.id}
          maxDurationSeconds={content.constraints.maxDurationSeconds}
          disabled={disabled}
          onRecordingComplete={handleRecordingComplete}
          onError={(msg) => toast.error(msg)}
        />
      )}
    </div>
  );
}
