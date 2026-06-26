"use client";

import { useCallback, useEffect, useState } from "react";

export type VocabularyPronunciationLocale = "en-US" | "en-GB";

function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(locale: VocabularyPronunciationLocale): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const exact = voices.find((voice) => voice.lang.toLowerCase() === locale.toLowerCase());
  if (exact) return exact;

  const prefix = locale.split("-")[0]?.toLowerCase();
  const regional =
    locale === "en-GB"
      ? voices.find((voice) => /en-gb|en_gb|british|uk/i.test(`${voice.name} ${voice.lang}`))
      : voices.find((voice) => /en-us|en_us|american|united states/i.test(`${voice.name} ${voice.lang}`));

  if (regional) return regional;

  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix ?? "en")) ?? null
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

function speakUtterance(text: string, locale: VocabularyPronunciationLocale): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 0.92;

    const voice = pickVoice(locale);
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function useVocabularyPronunciation() {
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(isSpeechSynthesisSupported());
  }, []);

  const cancel = useCallback(() => {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
    setSpeakingKey(null);
  }, []);

  const speak = useCallback(
    async (text: string, locale: VocabularyPronunciationLocale) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (!isSpeechSynthesisSupported()) {
        setIsSupported(false);
        return;
      }

      cancel();
      const key = `${locale}:${trimmed}`;
      setSpeakingKey(key);
      await waitForVoices();
      await speakUtterance(trimmed, locale);
      setSpeakingKey((current) => (current === key ? null : current));
    },
    [cancel]
  );

  return {
    speak,
    cancel,
    speakingKey,
    isSupported,
  };
}
