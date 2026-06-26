import type { Choice } from "@/types/learning";

type ContentChoice = {
  id?: string;
  text?: string;
  sortOrder?: number;
  sort_order?: number;
  mediaUrl?: string | null;
  media_url?: string | null;
  isCorrect?: boolean;
  is_correct?: boolean;
};

function contentChoiceToRow(
  questionId: string,
  raw: ContentChoice,
  index: number
): Choice | null {
  const text = typeof raw.text === "string" ? raw.text.trim() : "";
  if (!text) return null;

  return {
    id:
      typeof raw.id === "string" && raw.id.trim().length > 0
        ? raw.id
        : `content:${questionId}:${index}`,
    question_id: questionId,
    text,
    is_correct: Boolean(raw.isCorrect ?? raw.is_correct),
    sort_order: raw.sortOrder ?? raw.sort_order ?? index,
    media_url: raw.mediaUrl ?? raw.media_url ?? null,
  };
}

function sortChoices(choices: Choice[]): Choice[] {
  return [...choices].sort((a, b) => a.sort_order - b.sort_order || a.text.localeCompare(b.text));
}

/**
 * Prefer normalized `choices` table rows; fall back to legacy `content.choices`
 * when the table is empty or incomplete (common for older mock-bank imports).
 */
export function resolveQuestionChoices(
  questionId: string,
  tableChoices: Choice[] | undefined | null,
  content: Record<string, unknown> | undefined | null
): Choice[] {
  const fromTable = sortChoices(tableChoices ?? []);
  const rawContent = content?.choices;
  const contentRows =
    Array.isArray(rawContent) && rawContent.length > 0
      ? sortChoices(
          rawContent
            .map((raw, index) => contentChoiceToRow(questionId, raw as ContentChoice, index))
            .filter((row): row is Choice => row != null)
        )
      : [];

  if (fromTable.length >= 2) return fromTable;
  if (fromTable.length === 0) return contentRows;
  if (contentRows.length <= fromTable.length) return fromTable;

  const seen = new Set(fromTable.map((choice) => choice.text.trim().toLowerCase()));
  const merged = [...fromTable];
  for (const choice of contentRows) {
    const key = choice.text.trim().toLowerCase();
    if (seen.has(key)) continue;
    merged.push(choice);
    seen.add(key);
  }

  return sortChoices(merged);
}
