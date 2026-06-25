"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SPEECH_LOCALES } from "@/lib/ai-practice/practice-config";
import type { PracticeLanguage } from "@/lib/ai-practice/practice-types";
import { getPracticeSpeechRate } from "@/lib/speech/practice-tts-rate";

function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(locale: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const languagePrefix = locale.split("-")[0]?.toLowerCase();
  const exact = voices.find((voice) => voice.lang.toLowerCase() === locale.toLowerCase());
  if (exact) return exact;

  const prefixMatch = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith(languagePrefix ?? locale)
  );
  return prefixMatch ?? null;
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

interface UsePracticePromptSpeechOptions {
  language: PracticeLanguage;
  levelId: string;
  promptText: string;
  followUpQuestions?: string[];
  playbackKey: string;
  enabled: boolean;
}

export function usePracticePromptSpeech({
  language,
  levelId,
  promptText,
  followUpQuestions = [],
  playbackKey,
  enabled,
}: UsePracticePromptSpeechOptions) {
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

    const texts = [promptText, ...followUpQuestions].filter((text) => text.trim());
    if (texts.length === 0) return;

    cancel();
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    setIsSpeaking(true);

    const locale = SPEECH_LOCALES[language];
    const rate = getPracticeSpeechRate(language, levelId);

    await waitForVoices();

    if (runIdRef.current !== runId) return;

    await speakSequence(texts, locale, rate);

    if (runIdRef.current === runId) {
      setIsSpeaking(false);
    }
  }, [cancel, followUpQuestions, language, levelId, promptText]);

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
