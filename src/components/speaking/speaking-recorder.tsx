"use client";

import { useRef, useState } from "react";
import { uploadSpeakingRecording } from "@/actions/speaking-evaluation";
import { Button } from "@/components/ui/button";
import { readBlobAsBase64 } from "@/lib/speech/blob-to-base64";
import {
  MicrophoneAccessError,
  createAudioMediaRecorder,
  requestMicrophoneStream,
} from "@/lib/speech/request-microphone";
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
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mimeTypeRef = useRef("audio/webm");
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startRecording() {
    try {
      const stream = await requestMicrophoneStream();
      const recorder = createAudioMediaRecorder(stream);
      mimeTypeRef.current = recorder.mimeType || "audio/webm";
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
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
            duration,
            questionId
          );
          if (result.success && result.data) {
            onRecordingComplete({
              audioRef: result.data.audioRef,
              mimeType: result.data.mimeType,
              durationSeconds: result.data.durationSeconds,
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

      timerRef.current = setInterval(() => {
        setDuration((d) => {
          if (d + 1 >= maxDurationSeconds) {
            stopRecording();
          }
          return d + 1;
        });
      }, 1000);
    } catch (error) {
      const message =
        error instanceof MicrophoneAccessError
          ? "Microphone access denied or unavailable."
          : "Could not start recording.";
      onError?.(message);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
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
            className="gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {isUploading ? "Saving…" : "Start recording"}
          </Button>
        ) : (
          <Button type="button" variant="destructive" onClick={stopRecording} className="gap-2">
            <Square className="h-4 w-4" />
            Stop recording
          </Button>
        )}
        <span className="camba-caption text-muted">
          {formatDuration(duration)} / {formatDuration(maxDurationSeconds)}
        </span>
      </div>
      {isRecording && (
        <p className="camba-caption text-program animate-pulse">Recording… speak clearly into your microphone.</p>
      )}
    </div>
  );
}
