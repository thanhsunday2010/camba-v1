"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import {
  generatePracticePrompt,
  submitStandaloneSpeakingPractice,
} from "@/actions/ai-practice";
import { SPEECH_LOCALES } from "@/lib/ai-practice/practice-config";
import {
  advancePracticeSession,
  readPracticeSession,
  writePracticeSession,
} from "@/lib/ai-practice/practice-session-storage";
import { useMascotOptional } from "@/components/mascot/mascot-provider";
import { PracticeFeedbackPanel } from "@/components/ai-practice/practice-feedback-panel";
import {
  PracticeHistoryPanel,
  type PracticeHistoryLabels,
} from "@/components/ai-practice/practice-history-panel";
import { StudentPageShell } from "@/components/camba";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, RotateCcw, Square, Volume2 } from "lucide-react";
import { useSpeechRecognition } from "@/lib/speech/use-speech-recognition";
import { usePracticePromptSpeech } from "@/lib/speech/use-practice-prompt-speech";
import { readBlobAsBase64 } from "@/lib/speech/blob-to-base64";
import {
  MicrophoneAccessError,
  createAudioMediaRecorder,
  requestMicrophoneStream,
} from "@/lib/speech/request-microphone";
import { toast } from "sonner";
import type { PracticeSpeakingFeedback } from "@/types/ai";
import type { PracticeHistorySummary } from "@/lib/ai-practice/practice-history-types";

export interface PracticeSpeakingSessionLabels {
  setupPath: string;
  round: string;
  analysis: string;
  prompt: string;
  instructions: string;
  followUp: string;
  submit: string;
  submitting: string;
  continue: string;
  continuing: string;
  changeSetup: string;
  startRecording: string;
  stopRecording: string;
  noRecording: string;
  recording: string;
  transcript: string;
  transcriptPlaceholder: string;
  transcriptUnsupported: string;
  micAccessDenied: string;
  micNotFound: string;
  micInsecureContext: string;
  micNotSupported: string;
  micRecorderUnsupported: string;
  micUnknownError: string;
  questionAudioPlaying: string;
  replayQuestion: string;
  feedback: {
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
    transcript?: string;
    modelAnswer: string;
    errorHighlights?: string;
  };
}

interface PracticeSpeakingSessionProps {
  labels: PracticeSpeakingSessionLabels;
  historySummary: PracticeHistorySummary;
  historyLabels: PracticeHistoryLabels;
}

export function PracticeSpeakingSession({
  labels,
  historySummary,
  historyLabels,
}: PracticeSpeakingSessionProps) {
  const router = useRouter();
  const mascot = useMascotOptional();
  const [session, setSession] = useState(() => readPracticeSession());
  const [feedback, setFeedback] = useState<PracticeSpeakingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContinuing, startContinueTransition] = useTransition();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recorderMimeTypeRef = useRef("audio/webm");
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speechLocale = session ? SPEECH_LOCALES[session.profile.language] : "en-US";
  const {
    transcript,
    interimTranscript,
    displayTranscript,
    isSupported: isSpeechSupported,
    start: startTranscription,
    stop: stopTranscription,
    reset: resetTranscription,
  } = useSpeechRecognition(speechLocale);

  const promptPlaybackKey = session
    ? `${session.round}:${session.currentPrompt.prompt}`
    : "";

  const {
    isSpeaking: isQuestionSpeaking,
    play: replayQuestionAudio,
    cancel: cancelQuestionAudio,
  } = usePracticePromptSpeech({
    language: session?.profile.language ?? "en",
    levelId: session?.profile.level ?? "a1",
    promptText: session?.currentPrompt.prompt ?? "",
    followUpQuestions: session?.currentPrompt.followUpQuestions,
    playbackKey: promptPlaybackKey,
    enabled: !!session && session.profile.skill === "speaking" && !feedback,
  });

  useEffect(() => {
    if (!session || session.profile.skill !== "speaking") {
      router.replace(labels.setupPath);
    }
  }, [session, router, labels.setupPath]);

  if (!session || session.profile.skill !== "speaking") {
    return null;
  }

  const activeSession = session;
  const { currentPrompt, profile, round } = activeSession;
  const maxDurationSeconds = currentPrompt.maxDurationSeconds ?? 120;

  function getMicrophoneErrorMessage(err: unknown): string {
    if (err instanceof MicrophoneAccessError) {
      switch (err.code) {
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
          if (d + 1 >= maxDurationSeconds) {
            stopRecording();
          }
          return d + 1;
        });
      }, 1000);
    } catch (err) {
      setError(getMicrophoneErrorMessage(err));
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

    setError(null);
    setIsSubmitting(true);
    try {
      const base64 = await readBlobAsBase64(audioBlob);
      const result = await submitStandaloneSpeakingPractice(
        profile,
        currentPrompt.prompt,
        base64,
        recorderMimeTypeRef.current,
        duration
      );
      if (result.success && result.data) {
        setFeedback(result.data);
        router.refresh();
        if (result.data.overallScore >= 75) {
          mascot?.cheerHighScore(result.data.overallScore);
        } else {
          mascot?.cheerExerciseComplete();
        }
      } else {
        const message = result.error ?? "Không gửi được bài.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleContinue() {
    startContinueTransition(async () => {
      const result = await generatePracticePrompt(activeSession.profile, activeSession.previousPrompts);
      if (!result.success || !result.data) {
        toast.error(result.error ?? "Không tạo được đề tiếp theo.");
        return;
      }
      const next = advancePracticeSession(activeSession, result.data);
      writePracticeSession(next);
      setSession(next);
      setFeedback(null);
      setAudioBlob(null);
      setDuration(0);
      resetTranscription();
      setError(null);
    });
  }

  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="camba-caption text-muted">{labels.round.replace("{n}", String(round))}</p>
          <Button variant="ghost" size="sm" onClick={() => router.push(labels.setupPath)}>
            <RotateCcw className="h-4 w-4" />
            {labels.changeSetup}
          </Button>
        </div>

        <CambaCard variant="lesson" padding="md" className="space-y-4">
          <div>
            <p className="camba-caption font-semibold text-program uppercase tracking-wide">
              {labels.analysis}
            </p>
            <p className="camba-body text-muted mt-1">{currentPrompt.analysisSummary}</p>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="camba-caption font-semibold text-foreground">{labels.prompt}</p>
              {!feedback && (
                <div className="flex items-center gap-2">
                  {isQuestionSpeaking && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-program font-medium">
                      <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                      {labels.questionAudioPlaying}
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => void replayQuestionAudio()}
                    disabled={isQuestionSpeaking || isRecording}
                  >
                    <Volume2 className="h-4 w-4" />
                    {labels.replayQuestion}
                  </Button>
                </div>
              )}
            </div>
            <p className="camba-body mt-1 whitespace-pre-wrap">{currentPrompt.prompt}</p>
          </div>
          <p className="text-sm text-gray-600">{currentPrompt.instructions}</p>
          {currentPrompt.followUpQuestions && currentPrompt.followUpQuestions.length > 0 && (
            <div>
              <p className="camba-caption font-medium text-muted mb-2">{labels.followUp}</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {currentPrompt.followUpQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>
          )}
        </CambaCard>

        {!feedback ? (
          <CambaCard variant="elevated" padding="md" className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-2">
              <div
                className={`h-20 w-20 rounded-full flex items-center justify-center ${
                  isRecording ? "bg-error/10 animate-pulse" : "bg-[var(--surface-sunken)]"
                }`}
              >
                <Mic className={`h-8 w-8 ${isRecording ? "text-error" : "text-muted"}`} />
              </div>

              {isRecording && (
                <p className="text-sm text-error font-medium">
                  {labels.recording} {duration}s / {maxDurationSeconds}s
                </p>
              )}

              {(isRecording || audioBlob) && (
                <div className="w-full rounded-xl border border-border bg-[var(--surface-sunken)] p-3">
                  <p className="camba-caption font-medium text-muted mb-2">{labels.transcript}</p>
                  {displayTranscript ? (
                    <p className="text-sm leading-relaxed">
                      {transcript}
                      {interimTranscript && (
                        <span className="text-muted">
                          {transcript ? " " : ""}
                          {interimTranscript}
                        </span>
                      )}
                    </p>
                  ) : isRecording ? (
                    <p className="text-sm text-muted italic">{labels.transcriptPlaceholder}</p>
                  ) : !isSpeechSupported ? (
                    <p className="text-sm text-muted italic">{labels.transcriptUnsupported}</p>
                  ) : (
                    <p className="text-sm text-muted italic">{labels.transcriptPlaceholder}</p>
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
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    {isSubmitting ? labels.submitting : labels.submit}
                  </Button>
                )}
              </div>
            </div>
            {error && (
              <p className="text-sm text-error bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </CambaCard>
        ) : (
          <PracticeFeedbackPanel
            type="speaking"
            feedback={feedback}
            labels={labels.feedback}
            actions={
              <Button className="w-full" onClick={handleContinue} disabled={isContinuing}>
                {isContinuing && <Loader2 className="animate-spin" />}
                {isContinuing ? labels.continuing : labels.continue}
              </Button>
            }
          />
        )}

        <PracticeHistoryPanel
          skill="speaking"
          summary={historySummary}
          labels={historyLabels}
        />
      </div>
    </StudentPageShell>
  );
}
