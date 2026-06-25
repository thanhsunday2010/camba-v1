"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { pickMessage } from "@/lib/mascot/pick-message";

export type MascotMood = "idle" | "loading" | "excited" | "clever";

interface MascotContextValue {
  message: string | null;
  mood: MascotMood;
  isVisible: boolean;
  cheerLessonComplete: () => void;
  cheerExerciseComplete: () => void;
  cheerHighScore: (score: number) => void;
  cheerMockTestComplete: (scorePercent: number) => void;
  cheerLevelUp: (level: number) => void;
  cheerBadge: (name: string) => void;
  cheerXp: (amount: number) => void;
  showLoading: () => void;
  resetToIdle: () => void;
}

const MascotContext = createContext<MascotContextValue | null>(null);

const HIGH_SCORE_THRESHOLD = 75;
const MESSAGE_TTL_MS = 4500;
const LOADING_MIN_MS = 700;

function readMessageList(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((item): item is string => typeof item === "string" && item.length > 0);
  }
  return typeof raw === "string" && raw.length > 0 ? [raw] : [];
}

export function MascotProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("mascot");
  const pathname = usePathname();
  const [message, setMessage] = useState<string | null>(null);
  const [mood, setMood] = useState<MascotMood>("idle");
  const [isVisible, setIsVisible] = useState(false);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstPathRef = useRef(true);

  const clearScheduled = useCallback(() => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  }, []);

  const showMessage = useCallback(
    (nextMessage: string, nextMood: MascotMood, ttl = MESSAGE_TTL_MS) => {
      clearScheduled();
      setMessage(nextMessage);
      setMood(nextMood);
      setIsVisible(true);
      clearTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setMood("idle");
        setMessage(t("idle"));
        clearTimerRef.current = setTimeout(() => {
          setMessage(null);
        }, 2000);
      }, ttl);
    },
    [clearScheduled, t]
  );

  const resetToIdle = useCallback(() => {
    clearScheduled();
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setIsVisible(false);
    setMood("idle");
    setMessage(null);
  }, [clearScheduled]);

  const showLoading = useCallback(() => {
    clearScheduled();
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    setMessage(t("loading"));
    setMood("loading");
    setIsVisible(true);
    loadingTimerRef.current = setTimeout(() => {
      loadingTimerRef.current = null;
      resetToIdle();
    }, LOADING_MIN_MS);
  }, [clearScheduled, resetToIdle, t]);

  useEffect(() => {
    if (isFirstPathRef.current) {
      isFirstPathRef.current = false;
      setMessage(t("idle"));
      setIsVisible(true);
      clearTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setMessage(null);
      }, 2800);
      return;
    }

    showLoading();
  }, [pathname, showLoading, t]);

  useEffect(() => () => {
    clearScheduled();
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
  }, [clearScheduled]);

  const cheerLessonComplete = useCallback(() => {
    showMessage(pickMessage(readMessageList(t.raw("lessonComplete"))), "excited");
  }, [showMessage, t]);

  const cheerExerciseComplete = useCallback(() => {
    showMessage(pickMessage(readMessageList(t.raw("exerciseComplete"))), "excited");
  }, [showMessage, t]);

  const cheerHighScore = useCallback(
    (score: number) => {
      const pool = readMessageList(t.raw("highScore"));
      const template = pickMessage(pool.length > 0 ? pool : ["{score}% — giỏi quá!"]);
      showMessage(template.replace("{score}", String(Math.round(score))), "clever");
    },
    [showMessage, t]
  );

  const cheerMockTestComplete = useCallback(
    (scorePercent: number) => {
      if (scorePercent >= HIGH_SCORE_THRESHOLD) {
        cheerHighScore(scorePercent);
        return;
      }
      showMessage(pickMessage(readMessageList(t.raw("mockComplete"))), "excited");
    },
    [cheerHighScore, showMessage, t]
  );

  const cheerLevelUp = useCallback(
    (level: number) => {
      showMessage(t("levelUp", { level }), "excited", 5000);
    },
    [showMessage, t]
  );

  const cheerBadge = useCallback(
    (name: string) => {
      showMessage(t("badge", { name }), "clever", 5000);
    },
    [showMessage, t]
  );

  const cheerXp = useCallback(
    (amount: number) => {
      if (amount < 10) return;
      showMessage(t("xp", { amount }), "clever");
    },
    [showMessage, t]
  );

  const value = useMemo(
    () => ({
      message,
      mood,
      isVisible,
      cheerLessonComplete,
      cheerExerciseComplete,
      cheerHighScore,
      cheerMockTestComplete,
      cheerLevelUp,
      cheerBadge,
      cheerXp,
      showLoading,
      resetToIdle,
    }),
    [
      message,
      mood,
      isVisible,
      cheerLessonComplete,
      cheerExerciseComplete,
      cheerHighScore,
      cheerMockTestComplete,
      cheerLevelUp,
      cheerBadge,
      cheerXp,
      showLoading,
      resetToIdle,
    ]
  );

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
}

export function useMascot() {
  const ctx = useContext(MascotContext);
  if (!ctx) {
    throw new Error("useMascot must be used within MascotProvider");
  }
  return ctx;
}

export function useMascotOptional() {
  return useContext(MascotContext);
}
