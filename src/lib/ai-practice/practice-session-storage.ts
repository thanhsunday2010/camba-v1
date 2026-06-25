import type { PracticeProfile, PracticePrompt, PracticeSessionState } from "@/lib/ai-practice/practice-types";

const STORAGE_KEY = "camba-ai-practice-session";

export function readPracticeSession(): PracticeSessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PracticeSessionState;
  } catch {
    return null;
  }
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
  };
}
