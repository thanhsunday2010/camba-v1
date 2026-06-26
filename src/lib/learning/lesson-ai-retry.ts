export interface LessonAttemptRecord {
  attemptNumber: number;
  overallScore: number;
  preview: string;
  submittedAt: string;
}

export interface LessonRetryContext {
  previousScore: number;
  previousPreview: string;
  currentScore: number;
  currentPreview: string;
  attemptNumber: number;
}

export function buildLessonRetryContext(
  attempts: LessonAttemptRecord[]
): LessonRetryContext | null {
  if (attempts.length < 2) return null;
  const prev = attempts[attempts.length - 2];
  const current = attempts[attempts.length - 1];
  return {
    previousScore: prev.overallScore,
    previousPreview: prev.preview,
    currentScore: current.overallScore,
    currentPreview: current.preview,
    attemptNumber: current.attemptNumber,
  };
}

export function getLessonScoreDelta(attempts: LessonAttemptRecord[]): number | null {
  if (attempts.length < 2) return null;
  const prev = attempts[attempts.length - 2].overallScore;
  const current = attempts[attempts.length - 1].overallScore;
  return current - prev;
}
