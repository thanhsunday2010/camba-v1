"use client";

import { cn } from "@/lib/utils";
import {
  AI_SPEAKING_MAX_SECONDS,
  formatSpeakingDuration,
  speakingCountdownRemaining,
} from "@/lib/ai/ai-input-limits";

type AiSpeakingCountdownProps = {
  elapsedSeconds: number;
  maxSeconds?: number;
  isRecording: boolean;
  className?: string;
  recordingLabel?: string;
};

export function AiSpeakingCountdown({
  elapsedSeconds,
  maxSeconds = AI_SPEAKING_MAX_SECONDS,
  isRecording,
  className,
  recordingLabel = "Đang ghi âm",
}: AiSpeakingCountdownProps) {
  const remaining = speakingCountdownRemaining(elapsedSeconds, maxSeconds);
  const urgent = isRecording && remaining <= 15;

  return (
    <p
      className={cn(
        "camba-body font-medium tabular-nums",
        isRecording ? (urgent ? "text-error animate-pulse" : "text-error") : "text-muted",
        className
      )}
      aria-live="polite"
    >
      {isRecording ? (
        <>
          {recordingLabel}: còn {formatSpeakingDuration(remaining)} / {formatSpeakingDuration(maxSeconds)}
        </>
      ) : (
        <>Thời gian tối đa: {formatSpeakingDuration(maxSeconds)}</>
      )}
    </p>
  );
}
