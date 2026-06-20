"use client";

import { useState, useRef } from "react";
import { submitSpeakingForFeedback } from "@/actions/ai/speaking";
import { AiFeedbackPanel } from "@/components/ai/ai-feedback-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Loader2, Mic, Square } from "lucide-react";
import { useSpeechRecognition } from "@/lib/speech/use-speech-recognition";
import { readBlobAsBase64 } from "@/lib/speech/blob-to-base64";
import { toast } from "sonner";
import type { SpeakingFeedback } from "@/types/ai";

interface SpeakingExerciseProps {
  exerciseId: string;
  lessonId: string;
  title: string;
  instructions?: string | null;
  prompt: string;
  followUpQuestions?: string[];
  pictureDescription?: string;
  maxDurationSeconds?: number;
  targetLevel?: string;
  labels: {
    startRecording: string;
    stopRecording: string;
    submit: string;
    submitting: string;
    noRecording: string;
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
    recording: string;
    transcript: string;
    transcriptPlaceholder: string;
    transcriptUnsupported: string;
  };
  onComplete?: () => void;
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
  pictureDescription,
  maxDurationSeconds = 120,
  targetLevel,
  labels,
  onComplete,
  nextExerciseTitle,
  onNextExercise,
}: SpeakingExerciseProps) {
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
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startRecording() {
    try {
      setAudioBlob(null);
      resetTranscription();
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
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
    } catch {
      setError("Không thể truy cập microphone");
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
      const result = await submitSpeakingForFeedback(
        exerciseId,
        lessonId,
        prompt,
        base64,
        "audio/webm",
        duration,
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
        type="speaking"
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
          <Mic className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {instructions && <p className="text-sm text-gray-500">{instructions}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-900">{prompt}</p>
          {pictureDescription && (
            <p className="text-xs text-gray-600 italic">{pictureDescription}</p>
          )}
          {followUpQuestions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">
                Câu hỏi phỏng vấn — trả lời khi ghi âm:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-800">
                {followUpQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 py-6">
          <div
            className={`h-20 w-20 rounded-full flex items-center justify-center ${
              isRecording ? "bg-error/10 animate-pulse" : "bg-gray-100"
            }`}
          >
            <Mic className={`h-8 w-8 ${isRecording ? "text-error" : "text-gray-400"}`} />
          </div>

          {isRecording && (
            <p className="text-sm text-error font-medium">
              {labels.recording} {duration}s / {maxDurationSeconds}s
            </p>
          )}

          {audioBlob && !isRecording && (
            <p className="text-sm text-success">✓ Đã ghi âm ({duration}s)</p>
          )}

          {(isRecording || audioBlob) && (
            <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-gray-50 p-3 text-left">
              <p className="text-xs font-medium text-gray-500 mb-2">{labels.transcript}</p>
              {displayTranscript ? (
                <p className="text-sm text-gray-900 leading-relaxed">
                  {transcript}
                  {interimTranscript && (
                    <span className="text-gray-400">
                      {transcript ? " " : ""}
                      {interimTranscript}
                    </span>
                  )}
                </p>
              ) : isRecording ? (
                <p className="text-sm text-gray-400 italic">{labels.transcriptPlaceholder}</p>
              ) : !isSpeechSupported ? (
                <p className="text-sm text-gray-400 italic">{labels.transcriptUnsupported}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">{labels.transcriptPlaceholder}</p>
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
          <p className="text-sm text-error bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
