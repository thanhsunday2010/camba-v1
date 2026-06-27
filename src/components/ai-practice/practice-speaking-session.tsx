"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import {
  generatePracticePrompt,
  submitStandaloneSpeakingPractice,
  type PracticeSpeakingResult,
} from "@/actions/ai-practice";
import { SPEECH_LOCALES } from "@/lib/ai-practice/practice-config";
import {
  advancePracticeSession,
  readPracticeSession,
  recordPracticeAttempt,
  resetPracticeForRetry,
  setFocusFixHint,
  writePracticeSession,
} from "@/lib/ai-practice/practice-session-storage";
import { useCelebrationOptional } from "@/components/camba/celebration/celebration-provider";
import { celebratePracticeSubmit } from "@/lib/gamification/celebrate-client";
import { PracticeFeedbackPanel } from "@/components/ai-practice/practice-feedback-panel";
import {
  PracticeEnhancementCards,
  PracticeSentenceStarters,
} from "@/components/ai-practice/practice-enhancement-cards";
import { PracticeModelAnswerTts } from "@/components/ai-practice/practice-model-answer-tts";
import {
  PracticeHistoryPanel,
  type PracticeHistoryLabels,
} from "@/components/ai-practice/practice-history-panel";
import { PracticeProgressPanel } from "@/components/ai-practice/practice-progress-panel";
import type { PracticeSpeakingSessionLabels } from "@/lib/ai-practice/practice-session-labels";
import { StudentPageShell } from "@/components/camba";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, RotateCcw, Square } from "lucide-react";
import { SpeakingSpeechControls } from "@/components/exercises/speaking-speech-controls";
import { useSpeechRecognition } from "@/lib/speech/use-speech-recognition";
import { usePracticePromptSpeech } from "@/lib/speech/use-practice-prompt-speech";
import { readBlobAsBase64 } from "@/lib/speech/blob-to-base64";
import {
  MicrophoneAccessError,
  createAudioMediaRecorder,
  requestMicrophoneStream,
} from "@/lib/speech/request-microphone";
import { toast } from "sonner";
import type { PracticeHistorySummary } from "@/lib/ai-practice/practice-history-types";
import type { PracticeProgressViewModel } from "@/lib/ai-practice/practice-enhancement-types";
import { AiSpeakingCountdown } from "@/components/ai/ai-speaking-countdown";
import { AI_SPEAKING_MAX_SECONDS } from "@/lib/ai/ai-input-limits";
import type { AiUsageStatus } from "@/lib/subscriptions/subscription-types";
import type { AiLimitDialogLabels } from "@/components/subscriptions/ai-limit-dialog";
import { AiUsageBadge } from "@/components/subscriptions/ai-usage-badge";
import { useAiLimitDialog } from "@/components/subscriptions/use-ai-limit-dialog";

interface PracticeSpeakingSessionProps {
  labels: PracticeSpeakingSessionLabels;
  historySummary: PracticeHistorySummary;
  historyLabels: PracticeHistoryLabels;
  progress: PracticeProgressViewModel | null;
  aiUsage: AiUsageStatus;
  aiUsageLabels: { label: string; remaining: string };
  limitDialogLabels: AiLimitDialogLabels;
}

export function PracticeSpeakingSession({
  labels,
  historySummary,
  historyLabels,
  progress,
  aiUsage,
  aiUsageLabels,
  limitDialogLabels,
}: PracticeSpeakingSessionProps) {
  const router = useRouter();
  const celebration = useCelebrationOptional();
  const { handleActionResult, dialog: limitDialog } = useAiLimitDialog(limitDialogLabels);
  const [session, setSession] = useState(() => readPracticeSession());
  const [feedback, setFeedback] = useState<PracticeSpeakingResult | null>(null);
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

  const promptPlaybackKey = session ? `${session.round}:${session.currentPrompt.prompt}` : "";

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
    enabled: false,
  });

  useEffect(() => {
    if (!session || session.profile.skill !== "speaking") {
      router.replace(labels.setupPath);
    }
  }, [session, router, labels.setupPath]);

  const retryContext = useMemo(() => {
    if (!feedback || !session || session.attempts.length < 2) return null;
    const prev = session.attempts[session.attempts.length - 2];
    const current = session.attempts[session.attempts.length - 1];
    return {
      previousScore: prev.overallScore,
      previousPreview: prev.preview,
      currentScore: current.overallScore,
      currentPreview: current.preview,
      attemptNumber: current.attemptNumber,
    };
  }, [feedback, session]);

  if (!session || session.profile.skill !== "speaking") {
    return null;
  }

  const activeSession = session;
  const { currentPrompt, profile, round } = activeSession;
  const maxDurationSeconds =
    currentPrompt.maxDurationSeconds ??
    (profile.mode === "micro" ? 60 : AI_SPEAKING_MAX_SECONDS);
  const previousBest = progress?.personalBest ?? historySummary.bestScore;

  function persistSession(next: typeof activeSession) {
    writePracticeSession(next);
    setSession(next);
  }

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
          const next = d + 1;
          if (next >= maxDurationSeconds) {
            stopRecording();
            return maxDurationSeconds;
          }
          return next;
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

    const attemptNumber = activeSession.attempts.length + 1;
    const previousAttemptScore =
      activeSession.attempts[activeSession.attempts.length - 1]?.overallScore ?? null;

    setError(null);
    setIsSubmitting(true);
    try {
      const base64 = await readBlobAsBase64(audioBlob);
      const result = await submitStandaloneSpeakingPractice(
        profile,
        currentPrompt.prompt,
        base64,
        recorderMimeTypeRef.current,
        duration,
        transcript.trim() || undefined,
        {
          attemptNumber,
          focusFixHint: activeSession.focusFixHint,
          previousBest,
          previousAttemptScore,
        }
      );
      if (result.success && result.data) {
        setFeedback(result.data);
        const preview = (result.data.transcript ?? transcript).slice(0, 200);
        const withAttempt = recordPracticeAttempt(activeSession, {
          attemptNumber,
          overallScore: result.data.overallScore,
          preview,
          submittedAt: new Date().toISOString(),
          pronunciationScore: result.data.pronunciationScore,
          fluencyScore: result.data.fluencyScore,
          grammarScore: result.data.grammarScore,
          vocabularyScore: result.data.vocabularyScore,
        });
        persistSession(setFocusFixHint(withAttempt, result.data.focusFix));
        router.refresh();
        celebratePracticeSubmit(celebration, {
          overallScore: result.data.overallScore,
          xpAwarded: result.data.meta.xpAwarded,
        });
      } else if (handleActionResult(result)) {
        setError(result.error ?? null);
      } else {
        const message = result.error ?? "Không gửi được bài.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRetry() {
    persistSession(resetPracticeForRetry(activeSession));
    setFeedback(null);
    setAudioBlob(null);
    setDuration(0);
    resetTranscription();
    setError(null);
  }

  function handleContinue() {
    startContinueTransition(async () => {
      const result = await generatePracticePrompt(activeSession.profile, activeSession.previousPrompts);
      if (!result.success || !result.data) {
        if (handleActionResult(result)) return;
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
      {limitDialog}
      <div className="camba-section-stack gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="camba-caption text-muted">{labels.round.replace("{n}", String(round))}</p>
            {profile.mode !== "standard" && (
              <span className="camba-caption rounded-full bg-program/10 text-program px-2 py-0.5 font-medium">
                {profile.mode === "micro" ? labels.modeMicro : labels.modeRoleplay}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AiUsageBadge aiUsage={aiUsage} labels={aiUsageLabels} />
            <Button variant="ghost" size="sm" onClick={() => router.push(labels.setupPath)}>
              <RotateCcw className="h-4 w-4" />
              {labels.changeSetup}
            </Button>
          </div>
        </div>

        <CambaCard variant="lesson" padding="md" className="space-y-4">
          {currentPrompt.rolePlayPersona && (
            <p className="camba-caption font-semibold text-program">{currentPrompt.rolePlayPersona}</p>
          )}
          <div>
            <p className="camba-caption font-semibold text-program uppercase tracking-wide">{labels.analysis}</p>
            <p className="camba-body text-muted mt-1">{currentPrompt.analysisSummary}</p>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="camba-caption font-semibold text-foreground">{labels.prompt}</p>
              {!feedback && (
                <SpeakingSpeechControls
                  isSpeaking={isQuestionSpeaking}
                  playingLabel={labels.questionAudioPlaying}
                  replayLabel={labels.replayQuestion}
                  stopLabel={labels.stopAudio}
                  onReplay={replayQuestionAudio}
                  onStop={cancelQuestionAudio}
                  disabled={isRecording}
                />
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
          <PracticeSentenceStarters
            starters={currentPrompt.sentenceStarters ?? []}
            label={labels.sentenceStarters}
          />
        </CambaCard>

        {!feedback ? (
          <CambaCard variant="elevated" padding="md" className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-2">
                <AiSpeakingCountdown
                  elapsedSeconds={duration}
                  maxSeconds={maxDurationSeconds}
                  isRecording={isRecording}
                  recordingLabel={labels.recording}
                />
                <div
                  className={`h-20 w-20 rounded-full flex items-center justify-center ${
                    isRecording ? "bg-error/10 animate-pulse" : "bg-[var(--surface-sunken)]"
                  }`}
                >
                  <Mic className={`h-8 w-8 ${isRecording ? "text-error" : "text-muted"}`} />
                </div>

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
          <div className="space-y-4">
            <PracticeEnhancementCards
              meta={feedback.meta}
              focusFix={feedback.focusFix}
              bestPhrase={feedback.bestPhrase}
              retryContext={retryContext}
              labels={labels.enhancement}
              onRetry={handleRetry}
            />
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
            {feedback.modelAnswerSuggestion && (
              <CambaCard variant="lesson" padding="md" className="space-y-2">
                <p className="camba-caption font-semibold text-foreground">{labels.feedback.modelAnswer}</p>
                <p className="camba-body text-foreground/90">{feedback.modelAnswerSuggestion}</p>
                <PracticeModelAnswerTts
                  text={feedback.modelAnswerSuggestion}
                  targetLevel={profile.level}
                  playbackKey={`speaking-${activeSession.promptKey}`}
                  labels={labels.modelAnswerTts}
                />
              </CambaCard>
            )}
          </div>
        )}

        {progress && <PracticeProgressPanel progress={progress} labels={labels.progress} />}

        <PracticeHistoryPanel skill="speaking" summary={historySummary} labels={historyLabels} />
      </div>
    </StudentPageShell>
  );
}
