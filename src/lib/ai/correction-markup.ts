export type CorrectionTextSegment =
  | { type: "text"; value: string }
  | { type: "correction"; error: string; correction: string };

export type ErrorCorrectionPair = {
  error: string;
  correction: string;
};

const INLINE_CORRECTION_PATTERN = /\[([^\]]*)\]\{([^}]*)\}/g;
const ERROR_CORRECTION_LINE_PATTERN = /^\s*\[([^\]]+)\]\{([^}]+)\}\s*$/;
const ERROR_ARROW_PATTERN = /^(.+?)\s*(?:→|->|—>|=>|:)\s*(.+)$/;

/** Parse inline `[wrong]{right}` markup into render segments. */
export function parseCorrectionMarkup(text: string): CorrectionTextSegment[] {
  if (!text) return [];

  const segments: CorrectionTextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_CORRECTION_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    segments.push({
      type: "correction",
      error: match[1],
      correction: match[2],
    });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  if (segments.length === 0) {
    segments.push({ type: "text", value: text });
  }

  return segments;
}

/** Parse one error highlight line into error/correction pair when possible. */
export function parseErrorCorrectionLine(line: string): ErrorCorrectionPair | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const markupMatch = trimmed.match(ERROR_CORRECTION_LINE_PATTERN);
  if (markupMatch) {
    return { error: markupMatch[1].trim(), correction: markupMatch[2].trim() };
  }

  const arrowMatch = trimmed.match(ERROR_ARROW_PATTERN);
  if (arrowMatch) {
    return { error: arrowMatch[1].trim(), correction: arrowMatch[2].trim() };
  }

  return null;
}

export function hasCorrectionMarkup(text: string): boolean {
  return INLINE_CORRECTION_PATTERN.test(text);
}
