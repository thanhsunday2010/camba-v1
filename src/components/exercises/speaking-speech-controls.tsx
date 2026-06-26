"use client";

import { Button } from "@/components/ui/button";
import { Square, Volume2 } from "lucide-react";

interface SpeakingSpeechControlsProps {
  isSpeaking: boolean;
  playingLabel: string;
  replayLabel: string;
  stopLabel: string;
  onReplay: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function SpeakingSpeechControls({
  isSpeaking,
  playingLabel,
  replayLabel,
  stopLabel,
  onReplay,
  onStop,
  disabled = false,
}: SpeakingSpeechControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {isSpeaking && (
        <span className="inline-flex items-center gap-1.5 camba-caption font-medium text-program">
          <Volume2 className="h-3.5 w-3.5 animate-pulse" aria-hidden />
          {playingLabel}
        </span>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => void onReplay()}
        disabled={disabled || isSpeaking}
      >
        <Volume2 className="h-4 w-4" aria-hidden />
        {replayLabel}
      </Button>
      {isSpeaking && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onStop}
        >
          <Square className="h-3.5 w-3.5" aria-hidden />
          {stopLabel}
        </Button>
      )}
    </div>
  );
}
