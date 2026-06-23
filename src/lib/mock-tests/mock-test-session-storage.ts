import type { MockTestAttemptSummary } from "@/lib/mock-tests/mock-test-types";
import type { QuestionResult, UserAnswer } from "@/types/learning";

const STORAGE_PREFIX = "camba-mock-test-session:";

export type MockTestSessionSnapshot = {
  attempt: MockTestAttemptSummary;
  answers: Record<string, UserAnswer>;
  questionResults: QuestionResult[];
};

function storageKey(testId: string): string {
  return `${STORAGE_PREFIX}${testId}`;
}

export function readMockTestSessionSnapshot(
  testId: string
): MockTestSessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey(testId));
    if (!raw) return null;
    return JSON.parse(raw) as MockTestSessionSnapshot;
  } catch {
    return null;
  }
}

export function writeMockTestSessionSnapshot(
  testId: string,
  snapshot: MockTestSessionSnapshot
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(storageKey(testId), JSON.stringify(snapshot));
  } catch {
    // Ignore quota / private mode errors — in-session state still works.
  }
}

export function clearMockTestSessionSnapshot(testId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(storageKey(testId));
  } catch {
    // no-op
  }
}
