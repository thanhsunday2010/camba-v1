export const AI_WRITING_MAX_WORDS = 500;
export const AI_SPEAKING_MAX_SECONDS = 120;

/** Standalone Writing practice (Luyện Writing) word bounds */
export const PRACTICE_WRITING_MIN_WORDS = 10;
export const PRACTICE_WRITING_MAX_WORDS = 300;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function isWithinWritingWordLimit(text: string): boolean {
  return countWords(text) <= AI_WRITING_MAX_WORDS;
}

export function clampWritingToWordLimit(text: string, maxWords = AI_WRITING_MAX_WORDS): string {
  if (countWords(text) <= maxWords) {
    return text;
  }

  const wordPattern = /\S+/g;
  let match: RegExpExecArray | null;
  let wordsSeen = 0;

  while ((match = wordPattern.exec(text)) !== null) {
    wordsSeen += 1;
    if (wordsSeen === maxWords) {
      return text.slice(0, match.index + match[0].length);
    }
  }

  return text;
}

export function isWithinSpeakingDurationLimit(durationSeconds: number): boolean {
  return durationSeconds > 0 && durationSeconds <= AI_SPEAKING_MAX_SECONDS;
}

export function formatSpeakingDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function speakingCountdownRemaining(elapsedSeconds: number, maxSeconds = AI_SPEAKING_MAX_SECONDS): number {
  return Math.max(0, maxSeconds - Math.max(0, elapsedSeconds));
}

export const AI_WRITING_WORD_LIMIT_ERROR = `Bài viết tối đa ${AI_WRITING_MAX_WORDS} từ.`;
export const PRACTICE_WRITING_MIN_WORDS_ERROR = `Bài viết cần ít nhất ${PRACTICE_WRITING_MIN_WORDS} từ.`;
export const PRACTICE_WRITING_MAX_WORDS_ERROR = `Bài viết tối đa ${PRACTICE_WRITING_MAX_WORDS} từ.`;
export const AI_SPEAKING_DURATION_LIMIT_ERROR = `Bài nói tối đa ${AI_SPEAKING_MAX_SECONDS / 60} phút.`;
