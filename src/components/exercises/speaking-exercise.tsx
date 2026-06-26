"use client";

import { useMemo, useState, useRef } from "react";
import { submitSpeakingForFeedback } from "@/actions/ai/speaking";
import { AiFeedbackPanel } from "@/components/ai/ai-feedback-panel";
import { SpeakingSpeechControls } from "@/components/exercises/speaking-speech-controls";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, Mic, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AiExerciseLabels } from "@/lib/learning/lesson-page-types";
import { useLessonI18nFormatters } from "@/lib/learning/use-lesson-i18n-formatters";
import { useLessonSpeakingSpeech } from "@/lib/speech/use-lesson-speaking-speech";
import { useSpeechRecognition } from "@/lib/speech/use-speech-recognition";
import { readBlobAsBase64 } from "@/lib/speech/blob-to-base64";
import {
  MicrophoneAccessError,
  createAudioMediaRecorder,
  requestMicrophoneStream,
} from "@/lib/speech/request-microphone";
import { toast } from "sonner";
import type { SpeakingFeedback } from "@/types/ai";
import { AiSpeakingCountdown } from "@/components/ai/ai-speaking-countdown";
import { AI_SPEAKING_MAX_SECONDS } from "@/lib/ai/ai-input-limits";

interface SpeakingExerciseProps {
  exerciseId: string;
  lessonId: string;
  title: string;
  instructions?: string | null;
  prompt: string;
  followUpQuestions?: string[];
  sceneDescription?: string;
  /** @deprecated Use sceneDescription — kept for seeded DB rows not yet migrated */
  pictureDescription?: string;
  targetLevel?: string;
  speechTexts: string[];
  labels: AiExerciseLabels;
  onComplete?: (meta?: {
    accuracyPercent?: number;
    gamification?: import("@/lib/gamification/gamification-types").ExerciseGamificationSummary;
  }) => void;
  nextExerciseTitle?: string;
  onNextExercise?: () => void;
}

export function SpeakingExercise({
  exerciseId,
  lessonId,
  title,
  instructions,
  prompt,
  followUpQuestions = [],
  sceneDescription,
  pictureDescription,
  targetLevel,
  speechTexts,
  labels,
  onComplete,
  nextExerciseTitle,
  onNextExercise,
}: SpeakingExerciseProps) {
  const fmt = useLessonI18nFormatters();
  const tAi = useTranslations("learning.lesson.ai");
  const maxDurationSeconds = AI_SPEAKING_MAX_SECONDS;
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    transcript,
    interimTranscript,
    displayTranscript,
    isSupported: isSpeechSupported,
    start: startTranscription,
    stop: stopTranscription,
    reset: resetTranscription,
  } = useSpeechRecognition("en-US");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recorderMimeTypeRef = useRef("audio/webm");
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questionPlaybackKey = `${exerciseId}:${speechTexts.join("\n")}`;

  const {
    isSpeaking: isQuestionSpeaking,
    play: replayQuestionAudio,
    cancel: cancelQuestionAudio,
  } = useLessonSpeakingSpeech({
    texts: speechTexts,
    targetLevel,
    playbackKey: questionPlaybackKey,
    enabled: !feedback,
  });

  const modelAnswerTexts = useMemo(
    () =>
      feedback?.modelAnswerSuggestion?.trim()
        ? [feedback.modelAnswerSuggestion.trim()]
        : [],
    [feedback?.modelAnswerSuggestion]
  );

  const modelAnswerPlaybackKey = feedback
    ? `${exerciseId}:model:${feedback.modelAnswerSuggestion ?? ""}`
    : "";

  const {
    isSpeaking: isModelAnswerSpeaking,
    play: replayModelAnswerAudio,
    cancel: cancelModelAnswerAudio,
  } = useLessonSpeakingSpeech({
    texts: modelAnswerTexts,
    targetLevel,
    playbackKey: modelAnswerPlaybackKey,
    enabled: !!feedback && modelAnswerTexts.length > 0,
  });

  function getMicrophoneErrorMessage(error: unknown): string {
    if (error instanceof MicrophoneAccessError) {
      switch (error.code) {
        case "not_allowed":
          return labels.micAccessDenied;
        case "not_found":
          return labels.micNotFound;
        case "insecure_context":
          return labels.micInsecureContext;
        case "not_supported":
          return labels.micNotSupported;
        case "recorder_unsupported":
          return labels.micRecorderUnsupported;
        default:
          return labels.micUnknownError;
      }
    }
    return labels.micUnknownError;
  }

  async function startRecording() {
    try {
      cancelQuestionAudio();
      setAudioBlob(null);
      resetTranscription();
      setError(null);

      const stream = await requestMicrophoneStream();
      const recorder = createAudioMediaRecorder(stream);
      recorderMimeTypeRef.current = recorder.mimeType || "audio/webm";
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorderMimeTypeRef.current });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setDuration(0);
      startTranscription();

      timerRef.current = setInterval(() => {
        setDuration((d) => {
          const next = d + 1;
          if (next >= maxDurationSeconds) {
            stopRecording();
            return maxDurationSeconds;
          }
          return next;
        });
      }, 1000);
    } catch (error) {
      setError(getMicrophoneErrorMessage(error));
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    stopTranscription();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function handleSubmit() {
    if (!audioBlob) {
      setError(labels.noRecording);
      return;
    }

    cancelQuestionAudio();
    setError(null);
    setIsSubmitting(true);
    try {
      const base64 = await readBlobAsBase64(audioBlob);
      const result = await submitSpeakingForFeedback(
        exerciseId,
        lessonId,
        prompt,
        base64,
        recorderMimeTypeRef.current,
        duration,
        targetLevel,
        {
          sceneDescription: sceneDescription ?? pictureDescription ?? undefined,
          followUpQuestions,
          clientTranscript: transcript.trim() || undefined,
        }
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
        type="speaking"
        feedback={feedback}
        labels={labels}
        modelAnswerFooter={
          feedback.modelAnswerSuggestion?.trim() ? (
            <SpeakingSpeechControls
              isSpeaking={isModelAnswerSpeaking}
              playingLabel={labels.modelAnswerAudioPlaying}
              replayLabel={labels.replayModelAnswer}
              stopLabel={labels.stopAudio}
              onReplay={replayModelAnswerAudio}
              onStop={cancelModelAnswerAudio}
            />
          ) : undefined
        }
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
          <Mic className="h-5 w-5 text-program shrink-0" />
          {title}
        </h2>
        {instructions && <p className="camba-caption text-muted">{instructions}</p>}
      </header>

      <div className="rounded-xl border border-program/15 bg-program/5 p-4 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="camba-body font-medium text-foreground flex-1 min-w-0">{prompt}</p>
          <SpeakingSpeechControls
            isSpeaking={isQuestionSpeaking}
            playingLabel={labels.questionAudioPlaying}
            replayLabel={labels.replayQuestion}
            stopLabel={labels.stopAudio}
            onReplay={replayQuestionAudio}
            onStop={cancelQuestionAudio}
            disabled={isRecording}
          />
        </div>
        {(sceneDescription ?? pictureDescription) && (
          <p className="camba-caption text-muted italic">{sceneDescription ?? pictureDescription}</p>
        )}
        {followUpQuestions.length > 0 && (
          <div>
            <p className="camba-caption font-medium text-muted mb-2">{tAi("followUpPrompt")}</p>
            <ol className="list-decimal list-inside space-y-1 camba-body text-foreground/90">
              {followUpQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        <div
          className={`h-20 w-20 rounded-full flex items-center justify-center ${
            isRecording ? "bg-error/10 animate-pulse" : "bg-[var(--surface-sunken)]"
          }`}
        >
          <Mic className={`h-8 w-8 ${isRecording ? "text-error" : "text-muted"}`} />
        </div>

        <AiSpeakingCountdown
          elapsedSeconds={duration}
          maxSeconds={maxDurationSeconds}
          isRecording={isRecording}
          recordingLabel={labels.recording}
        />

        {audioBlob && !isRecording && (
          <p className="camba-body text-success">{fmt.recordedSuccess(duration)}</p>
        )}

        {(isRecording || audioBlob) && (
          <div className="w-full max-w-lg rounded-xl border border-border bg-[var(--surface-sunken)] p-3 text-left">
            <p className="camba-caption font-medium text-muted mb-2">{labels.transcript}</p>
            {displayTranscript ? (
              <p className="camba-body text-foreground leading-relaxed">
                {transcript}
                {interimTranscript && (
                  <span className="text-muted">
                    {transcript ? " " : ""}
                    {interimTranscript}
                  </span>
                )}
              </p>
            ) : isRecording ? (
              <p className="camba-body text-muted italic">{labels.transcriptPlaceholder}</p>
            ) : !isSpeechSupported ? (
              <p className="camba-body text-muted italic">{labels.transcriptUnsupported}</p>
            ) : (
              <p className="camba-body text-muted italic">{labels.transcriptPlaceholder}</p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {!isRecording ? (
            <Button onClick={startRecording} variant="outline">
              <Mic className="h-4 w-4" />
              {labels.startRecording}
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive">
              <Square className="h-4 w-4" />
              {labels.stopRecording}
            </Button>
          )}

          {audioBlob && !isRecording && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  {labels.submitting}
                </>
              ) : (
                labels.submit
              )}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="camba-caption text-error bg-error/5 border border-error/20 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
