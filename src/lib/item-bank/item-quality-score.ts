import type { ItemBankQuestion, ItemBankSpeakingContent, ItemBankWritingContent } from "@/lib/item-bank/item-bank-types";

export type ItemQualityScore = {
  itemId: string;
  totalScore: number;
  metadataCompleteness: number;
  coverageContribution: number;
  difficultyCalibration: number;
  taskQuality: number;
  duplicationRisk: number;
  flags: string[];
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreMetadata(item: ItemBankQuestion): { score: number; flags: string[] } {
  const flags: string[] = [];
  let points = 0;
  const max = 25;

  if (item.grammarTags.length >= 1) points += 5;
  else flags.push("missing_grammar");
  if (item.grammarTags.length >= 2) points += 3;
  if (item.vocabularyTopics.length >= 1) points += 5;
  else flags.push("missing_vocab");
  if (item.vocabularyTopics.length >= 2) points += 3;
  if (item.authoringMetadata.source?.sourceMock) points += 4;
  if (item.authoringMetadata.rubricId) points += 2;
  if (item.authoringMetadata.blueprintQuestionType) points += 3;

  return { score: clamp((points / max) * 100), flags };
}

function scoreTaskQuality(item: ItemBankQuestion): { score: number; flags: string[] } {
  const flags: string[] = [];
  let points = 0;
  const max = 30;

  const content = item.content as Record<string, unknown>;

  if (item.questionType === "writing") {
    const w = item.content as ItemBankWritingContent;
    if (w.prompt?.length > 10) points += 8;
    else flags.push("weak_writing_prompt");
    if (w.rubricId) points += 6;
    if (w.minWords != null && w.maxWords != null) points += 6;
    if (w.writingTaskType) points += 5;
    if (w.instructions) points += 5;
  } else if (item.questionType === "speaking") {
    const s = item.content as ItemBankSpeakingContent;
    if (s.prompt?.length > 10) points += 8;
    else flags.push("weak_speaking_prompt");
    if (s.rubricId) points += 6;
    if (s.maxDurationSeconds > 0) points += 6;
    if (s.speakingTaskType) points += 5;
    if (s.followUpQuestions?.length) points += 5;
  } else {
    const text = (content.questionText as string) ?? "";
    if (text.length > 15) points += 10;
    else flags.push("weak_stem");
    if (Array.isArray(content.choices) && content.choices.length >= 2) points += 10;
    else if (Array.isArray(content.pairs) && content.pairs.length >= 2) points += 10;
    else if (typeof content.template === "string") points += 10;
    else flags.push("weak_payload");
    if (text.length > 30) points += 10;
  }

  return { score: clamp((points / max) * 100), flags };
}

/** QA-only quality score — not student-facing. */
export function scoreItemQuality(
  item: ItemBankQuestion,
  options: { duplicationRisk?: number } = {}
): ItemQualityScore {
  const flags: string[] = [];
  const meta = scoreMetadata(item);
  flags.push(...meta.flags);
  const task = scoreTaskQuality(item);
  flags.push(...task.flags);

  const difficultyCalibration =
    item.difficulty === "medium" ? 80 : item.difficulty === "easy" ? 75 : 70;

  const coverageContribution = clamp(
    item.grammarTags.length * 8 + item.vocabularyTopics.length * 8 + (item.authoringMetadata.source ? 10 : 0)
  );

  const duplicationRisk = options.duplicationRisk ?? 0;

  const totalScore = clamp(
    meta.score * 0.25 +
      task.score * 0.35 +
      difficultyCalibration * 0.15 +
      coverageContribution * 0.15 +
      (100 - duplicationRisk) * 0.1
  );

  return {
    itemId: item.id,
    totalScore,
    metadataCompleteness: meta.score,
    coverageContribution,
    difficultyCalibration,
    taskQuality: task.score,
    duplicationRisk,
    flags,
  };
}

export function scoreItemBankQuality(
  items: ItemBankQuestion[],
  duplicateMatches: Array<{ itemAId: string; itemBId: string }> = []
): ItemQualityScore[] {
  const dupeRisk = new Map<string, number>();
  for (const m of duplicateMatches) {
    dupeRisk.set(m.itemAId, (dupeRisk.get(m.itemAId) ?? 0) + 40);
    dupeRisk.set(m.itemBId, (dupeRisk.get(m.itemBId) ?? 0) + 40);
  }
  return items.map((item) =>
    scoreItemQuality(item, { duplicationRisk: Math.min(100, dupeRisk.get(item.id) ?? 0) })
  );
}
