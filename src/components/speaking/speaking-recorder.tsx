"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { uploadSpeakingRecording } from "@/actions/speaking-evaluation";
import { Button } from "@/components/ui/button";
import { readBlobAsBase64 } from "@/lib/speech/blob-to-base64";
import {
  MicrophoneAccessError,
  createAudioMediaRecorder,
  requestMicrophoneStream,
} from "@/lib/speech/request-microphone";
import { useSpeechRecognition } from "@/lib/speech/use-speech-recognition";
import { Loader2, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type SpeakingRecorderProps = {
  maxDurationSeconds?: number;
  disabled?: boolean;
  questionId?: string;
  onRecordingComplete: (payload: {
    audioRef: string;
    mimeType: string;
    durationSeconds: number;
    transcript?: string;
  }) => void;
  onError?: (message: string) => void;
  className?: string;
};

export function SpeakingRecorder({
  maxDurationSeconds = 120,
  disabled,
  questionId,
  onRecordingComplete,
  onError,
  className,
}: SpeakingRecorderProps) {
  const t = useTranslations("learning.lesson.ai");
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mimeTypeRef = useRef("audio/webm");
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef(0);
  const transcriptRef = useRef("");

  const {
    transcript,
    interimTranscript,
    displayTranscript,
    isSupported: isSpeechSupported,
    start: startTranscription,
    stop: stopTranscription,
    reset: resetTranscription,
  } = useSpeechRecognition("en-US");

  useEffect(() => {
    transcriptRef.current = displayTranscript;
  }, [displayTranscript]);

  function getMicrophoneErrorMessage(error: unknown): string {
    if (error instanceof MicrophoneAccessError) {
      switch (error.code) {
        case "not_allowed":
          return t("micAccessDenied");
        case "not_found":
          return t("micNotFound");
        case "insecure_context":
          return t("micInsecureContext");
        case "not_supported":
          return t("micNotSupported");
        case "recorder_unsupported":
          return t("micRecorderUnsupported");
        default:
          return t("micUnknownError");
      }
    }
    return t("micUnknownError");
  }

  async function startRecording() {
    try {
      resetTranscription();
      transcriptRef.current = "";
      durationRef.current = 0;

      const stream = await requestMicrophoneStream();
      const recorder = createAudioMediaRecorder(stream);
      mimeTypeRef.current = recorder.mimeType || "audio/webm";
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const recordedDuration = Math.max(durationRef.current, 1);
        const capturedTranscript = transcriptRef.current.trim();

        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current });
        if (blob.size === 0) {
          onError?.("Recording was empty. Please try again.");
          return;
        }

        setIsUploading(true);
        try {
          const base64 = await readBlobAsBase64(blob);
          const result = await uploadSpeakingRecording(
            base64,
            mimeTypeRef.current,
            recordedDuration,
            questionId
          );
          if (result.success && result.data) {
            onRecordingComplete({
              audioRef: result.data.audioRef,
              mimeType: result.data.mimeType,
              durationSeconds: result.data.durationSeconds,
              transcript: capturedTranscript || undefined,
            });
          } else {
            onError?.(result.error ?? "Failed to save recording");
          }
        } catch (error) {
          onError?.(error instanceof Error ? error.message : "Upload failed");
        } finally {
          setIsUploading(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setDuration(0);
      startTranscription();

      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setDuration(durationRef.current);
        if (durationRef.current >= maxDurationSeconds) {
          stopRecording();
        }
      }, 1000);
    } catch (error) {
      onError?.(getMicrophoneErrorMessage(error));
    }
  }

  function stopRecording() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    transcriptRef.current = [transcript, interimTranscript].filter(Boolean).join(" ").trim();
    stopTranscription();
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-3">
        {!isRecording ? (
          <Button
            type="button"
            variant="outline"
            onClick={startRecording}
            disabled={disabled || isUploading}
            className="gap-2 min-h-[var(--touch-target-min)] px-5"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {isUploading ? t("submitting") : t("startRecording")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="destructive"
            onClick={stopRecording}
            className="gap-2 min-h-[var(--touch-target-min)] px-5"
          >
            <Square className="h-4 w-4" />
            {t("stopRecording")}
          </Button>
        )}
        <span className="camba-caption text-muted">
          {formatDuration(duration)} / {formatDuration(maxDurationSeconds)}
        </span>
      </div>

      {isRecording && (
        <p className="camba-caption text-program animate-pulse">
          {t("recording")}…
        </p>
      )}

      {(isRecording || displayTranscript) && (
        <div className="rounded-xl border border-border bg-[var(--surface-sunken)] p-3">
          <p className="camba-caption font-medium text-muted mb-2">{t("transcript")}</p>
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
            <p className="camba-body text-muted italic">{t("transcriptPlaceholder")}</p>
          ) : !isSpeechSupported ? (
            <p className="camba-body text-muted italic">{t("transcriptUnsupported")}</p>
          ) : (
            <p className="camba-body text-muted italic">{t("transcriptPlaceholder")}</p>
          )}
        </div>
      )}
    </div>
  );
}
