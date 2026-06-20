"use client";

import { useState, useRef, useTransition } from "react";
import { submitSpeakingForFeedback } from "@/actions/ai/speaking";
import { AiFeedbackPanel } from "@/components/ai/ai-feedback-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mic, Square } from "lucide-react";
import type { SpeakingFeedback } from "@/types/ai";

interface SpeakingExerciseProps {
  exerciseId: string;
  lessonId: string;
  title: string;
  instructions?: string | null;
  prompt: string;
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
  };
  onComplete?: () => void;
}

export function SpeakingExercise({
  exerciseId,
  lessonId,
  title,
  instructions,
  prompt,
  maxDurationSeconds = 120,
  targetLevel,
  labels,
  onComplete,
}: SpeakingExerciseProps) {
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPending, startTransition] = useTransition();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startRecording() {
    try {
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
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function handleSubmit() {
    if (!audioBlob) {
      setError(labels.noRecording);
      return;
    }

    setError(null);
    startTransition(async () => {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
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
          setError(result.error ?? "Error");
        }
      };
    });
  }

  if (feedback) {
    return <AiFeedbackPanel type="speaking" feedback={feedback} labels={labels} />;
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
        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900">{prompt}</p>
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
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? (
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
