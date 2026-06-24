import type { ItemBankQuestion } from "@/lib/item-bank/item-bank-types";

export type DuplicateMatch = {
  itemAId: string;
  itemBId: string;
  matchType: "identical_stem" | "near_stem" | "identical_prompt" | "duplicate_distractor";
  similarity: number;
  detail: string;
};

export type DuplicateDetectionReport = {
  totalItems: number;
  matches: DuplicateMatch[];
  duplicateStemCount: number;
  nearDuplicateCount: number;
};

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function stemOf(item: ItemBankQuestion): string {
  const content = item.content as Record<string, unknown>;
  const text =
    (typeof content.questionText === "string" && content.questionText) ||
    (typeof content.prompt === "string" && content.prompt) ||
    item.authoringMetadata.questionText ||
    "";
  return normalize(text);
}

function tokenSet(text: string): Set<string> {
  return new Set(normalize(text).split(/\W+/).filter((t) => t.length > 2));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function contentFingerprint(item: ItemBankQuestion): string {
  const content = item.content as Record<string, unknown>;
  const parts: string[] = [];

  if (item.questionType === "writing" || item.questionType === "speaking") {
    const prompt = typeof content.prompt === "string" ? normalize(content.prompt) : "";
    return prompt || item.id;
  }

  if (Array.isArray(content.choices)) {
    parts.push(
      (content.choices as Array<{ text?: string }>)
        .map((c) => normalize(c.text ?? ""))
        .sort()
        .join("|")
    );
  }
  if (Array.isArray(content.pairs)) {
    parts.push(
      (content.pairs as Array<{ leftText?: string; rightText?: string }>)
        .map((p) => `${normalize(p.leftText ?? "")}:${normalize(p.rightText ?? "")}`)
        .join("|")
    );
  }
  if (typeof content.template === "string") {
    parts.push(normalize(content.template));
  }
  if (Array.isArray(content.correctAnswers)) {
    parts.push(
      (content.correctAnswers as string[]).map((a) => normalize(a)).join("|")
    );
  }
  if (typeof content.passage === "string") {
    parts.push(normalize(content.passage));
  }

  const fingerprint = parts.filter(Boolean).join("::");
  return fingerprint || item.id;
}

function distractorsOf(item: ItemBankQuestion): string[] {
  const content = item.content as Record<string, unknown>;
  const choices = content.choices as Array<{ text?: string }> | undefined;
  if (!Array.isArray(choices)) return [];
  return choices.map((c) => normalize(c.text ?? "")).filter(Boolean);
}

const NEAR_DUPLICATE_THRESHOLD = 0.85;

/** Detect duplicate and near-duplicate content in an item bank slice. */
export function detectItemBankDuplicates(items: ItemBankQuestion[]): DuplicateDetectionReport {
  const matches: DuplicateMatch[] = [];
  const stems = items.map((item) => ({ id: item.id, stem: stemOf(item), item }));

  for (let i = 0; i < stems.length; i += 1) {
    for (let j = i + 1; j < stems.length; j += 1) {
      const a = stems[i]!;
      const b = stems[j]!;

      if (
        a.stem.length > 0 &&
        b.stem.length > 0 &&
        a.stem === b.stem &&
        contentFingerprint(a.item) === contentFingerprint(b.item)
      ) {
        matches.push({
          itemAId: a.id,
          itemBId: b.id,
          matchType: "identical_stem",
          similarity: 1,
          detail: a.stem.slice(0, 80),
        });
        continue;
      }

      if (a.stem && b.stem) {
        const sim = jaccard(tokenSet(a.stem), tokenSet(b.stem));
        if (sim >= NEAR_DUPLICATE_THRESHOLD) {
          matches.push({
            itemAId: a.id,
            itemBId: b.id,
            matchType: "near_stem",
            similarity: sim,
            detail: `"${a.stem.slice(0, 40)}" ~ "${b.stem.slice(0, 40)}"`,
          });
        }
      }

      const promptA =
        typeof (a.item.content as Record<string, unknown>).prompt === "string"
          ? normalize((a.item.content as Record<string, unknown>).prompt as string)
          : "";
      const promptB =
        typeof (b.item.content as Record<string, unknown>).prompt === "string"
          ? normalize((b.item.content as Record<string, unknown>).prompt as string)
          : "";
      if (promptA && promptA === promptB) {
        matches.push({
          itemAId: a.id,
          itemBId: b.id,
          matchType: "identical_prompt",
          similarity: 1,
          detail: promptA.slice(0, 80),
        });
      }

      const distA = distractorsOf(a.item);
      const distB = distractorsOf(b.item);
      for (const d of distA) {
        if (distB.includes(d)) {
          matches.push({
            itemAId: a.id,
            itemBId: b.id,
            matchType: "duplicate_distractor",
            similarity: 1,
            detail: d.slice(0, 60),
          });
        }
      }
    }
  }

  return {
    totalItems: items.length,
    matches,
    duplicateStemCount: matches.filter((m) => m.matchType === "identical_stem").length,
    nearDuplicateCount: matches.filter((m) => m.matchType === "near_stem").length,
  };
}
