import { parseErrorCorrectionLine } from "@/lib/ai/correction-markup";

function normalizeErrorKey(fragment: string): string {
  return fragment.toLowerCase().replace(/\s+/g, " ").trim().slice(0, 80);
}

/** Aggregate recurring error patterns from AI errorHighlights across sessions. */
export function extractRecurringErrors(
  highlightsList: string[][],
  limit = 3
): string[] {
  const counts = new Map<string, { label: string; count: number }>();

  for (const highlights of highlightsList) {
    const seenInSession = new Set<string>();
    for (const item of highlights) {
      const markupMatch = item.match(/\[([^\]]+)\]\{([^}]+)\}/);
      const wrong = markupMatch?.[1]?.trim() ?? parseErrorCorrectionLine(item)?.error?.trim();
      if (!wrong) continue;
      const key = normalizeErrorKey(wrong);
      if (seenInSession.has(key)) continue;
      seenInSession.add(key);
      const existing = counts.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(key, { label: wrong, count: 1 });
      }
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((entry) => entry.label);
}
