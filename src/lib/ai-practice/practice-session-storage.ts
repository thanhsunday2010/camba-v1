import type { PracticeAttemptRecord, SpeakingPhase, WritingStep } from "@/lib/ai-practice/practice-enhancement-types";
import type { PracticeProfile, PracticePrompt, PracticeSessionState } from "@/lib/ai-practice/practice-types";
import { hashPromptKey } from "@/lib/ai-practice/practice-types";

const STORAGE_KEY = "camba-ai-practice-session";

export function readPracticeSession(): PracticeSessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PracticeSessionState;
    return normalizeSession(parsed);
  } catch {
    return null;
  }
}

function normalizeSession(session: PracticeSessionState): PracticeSessionState {
  return {
    ...session,
    promptKey: session.promptKey ?? hashPromptKey(session.currentPrompt.prompt),
    attempts: session.attempts ?? [],
    writingStep: session.writingStep ?? "outline",
    outline: session.outline ?? "",
    speakingPhase: session.speakingPhase ?? "listen",
    profile: {
      ...session.profile,
      mode: session.profile.mode ?? "standard",
    },
  };
}

export function writePracticeSession(state: PracticeSessionState): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearPracticeSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function createPracticeSession(
  profile: PracticeProfile,
  prompt: PracticePrompt
): PracticeSessionState {
  return {
    profile,
    currentPrompt: prompt,
    previousPrompts: [prompt.prompt],
    round: 1,
    promptKey: hashPromptKey(prompt.prompt),
    attempts: [],
    writingStep: "outline",
    outline: "",
    speakingPhase: "listen",
  };
}

export function advancePracticeSession(
  session: PracticeSessionState,
  nextPrompt: PracticePrompt
): PracticeSessionState {
  return {
    ...session,
    currentPrompt: nextPrompt,
    previousPrompts: [...session.previousPrompts, nextPrompt.prompt],
    round: session.round + 1,
    promptKey: hashPromptKey(nextPrompt.prompt),
    attempts: [],
    writingStep: "outline",
    outline: "",
    speakingPhase: "listen",
    focusFixHint: undefined,
  };
}

export function recordPracticeAttempt(
  session: PracticeSessionState,
  attempt: PracticeAttemptRecord
): PracticeSessionState {
  return {
    ...session,
    attempts: [...session.attempts, attempt],
  };
}

export function resetPracticeForRetry(session: PracticeSessionState): PracticeSessionState {
  return {
    ...session,
    writingStep: "outline",
    outline: "",
    speakingPhase: "listen",
  };
}

export function updateWritingStep(
  session: PracticeSessionState,
  step: WritingStep,
  outline?: string
): PracticeSessionState {
  return {
    ...session,
    writingStep: step,
    outline: outline ?? session.outline,
  };
}

export function updateSpeakingPhase(
  session: PracticeSessionState,
  phase: SpeakingPhase
): PracticeSessionState {
  return {
    ...session,
    speakingPhase: phase,
  };
}

export function setFocusFixHint(
  session: PracticeSessionState,
  focusFix?: string
): PracticeSessionState {
  return {
    ...session,
    focusFixHint: focusFix,
  };
}
