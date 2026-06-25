export const AI_WRITING_MAX_WORDS = 500;
export const AI_SPEAKING_MAX_SECONDS = 120;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function isWithinWritingWordLimit(text: string): boolean {
  return countWords(text) <= AI_WRITING_MAX_WORDS;
}

export function clampWritingToWordLimit(text: string): string {
  const trimmed = text.trimEnd();
  if (!trimmed) return text;

  const tokens = trimmed.split(/(\s+)/);
  let words = 0;
  let result = "";

  for (const token of tokens) {
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      if (words > 0 && words < AI_WRITING_MAX_WORDS) {
        result += token;
      }
      continue;
    }
    if (words >= AI_WRITING_MAX_WORDS) break;
    result += token;
    words += 1;
  }

  return result.trimStart();
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
export const AI_SPEAKING_DURATION_LIMIT_ERROR = `Bài nói tối đa ${AI_SPEAKING_MAX_SECONDS / 60} phút.`;
