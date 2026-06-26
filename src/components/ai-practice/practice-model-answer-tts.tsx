"use client";

import { SpeakingSpeechControls } from "@/components/exercises/speaking-speech-controls";
import { useLessonSpeakingSpeech } from "@/lib/speech/use-lesson-speaking-speech";

interface PracticeModelAnswerTtsProps {
  text: string;
  targetLevel?: string;
  playbackKey: string;
  labels: {
    playing: string;
    replay: string;
    stop: string;
  };
}

export function PracticeModelAnswerTts({
  text,
  targetLevel,
  playbackKey,
  labels,
}: PracticeModelAnswerTtsProps) {
  const trimmed = text.trim();
  const { isSpeaking, play, cancel } = useLessonSpeakingSpeech({
    texts: trimmed ? [trimmed] : [],
    targetLevel,
    playbackKey: `${playbackKey}:${trimmed}`,
    enabled: !!trimmed,
  });

  if (!trimmed) return null;

  return (
    <SpeakingSpeechControls
      isSpeaking={isSpeaking}
      playingLabel={labels.playing}
      replayLabel={labels.replay}
      stopLabel={labels.stop}
      onReplay={play}
      onStop={cancel}
    />
  );
}
