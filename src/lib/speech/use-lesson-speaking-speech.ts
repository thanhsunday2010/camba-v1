"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLessonSpeechRate } from "@/lib/speech/lesson-tts-rate";

const DEFAULT_LOCALE = "en-GB";

function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(locale: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const languagePrefix = locale.split("-")[0]?.toLowerCase();
  const exact = voices.find((voice) => voice.lang.toLowerCase() === locale.toLowerCase());
  if (exact) return exact;

  const regional =
    locale.toLowerCase() === "en-gb"
      ? voices.find((voice) => /en-gb|en_gb|british|uk/i.test(`${voice.name} ${voice.lang}`))
      : voices.find((voice) => /en-us|en_us|american|united states/i.test(`${voice.name} ${voice.lang}`));

  if (regional) return regional;

  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith(languagePrefix ?? locale)) ?? null
  );
}

function waitForVoices(timeoutMs = 1500): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve();
      return;
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener("voiceschanged", finish);
      resolve();
    };

    window.speechSynthesis.addEventListener("voiceschanged", finish);
    window.setTimeout(finish, timeoutMs);
  });
}

function speakUtterance(text: string, locale: string, rate: number): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = rate;

    const voice = pickVoice(locale);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

async function speakSequence(texts: string[], locale: string, rate: number): Promise<void> {
  for (const text of texts) {
    if (!text.trim()) continue;
    await speakUtterance(text.trim(), locale, rate);
  }
}

interface UseLessonSpeakingSpeechOptions {
  texts: string[];
  targetLevel?: string;
  locale?: string;
  playbackKey: string;
  enabled: boolean;
}

export function useLessonSpeakingSpeech({
  texts,
  targetLevel,
  locale = DEFAULT_LOCALE,
  playbackKey,
  enabled,
}: UseLessonSpeakingSpeechOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const runIdRef = useRef(0);

  const cancel = useCallback(() => {
    runIdRef.current += 1;
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const play = useCallback(async () => {
    if (!isSpeechSynthesisSupported()) {
      setIsSupported(false);
      return;
    }

    const sequence = texts.filter((text) => text.trim());
    if (sequence.length === 0) return;

    cancel();
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    setIsSpeaking(true);

    const rate = getLessonSpeechRate(targetLevel);
    await waitForVoices();

    if (runIdRef.current !== runId) return;

    await speakSequence(sequence, locale, rate);

    if (runIdRef.current === runId) {
      setIsSpeaking(false);
    }
  }, [cancel, locale, targetLevel, texts]);

  useEffect(() => {
    if (!enabled || !playbackKey) return;

    let cancelled = false;
    void (async () => {
      if (cancelled) return;
      await play();
    })();

    return () => {
      cancelled = true;
      cancel();
    };
  }, [playbackKey, enabled, play, cancel]);

  return {
    isSpeaking,
    isSupported,
    play,
    cancel,
  };
}
