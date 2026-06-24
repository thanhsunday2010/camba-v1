import type { GoldMockManifest } from "@/lib/cambridge-assessment/gold-mock-format";
import type { YleMockQuestionManifestBlock } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import type {
  ItemBankFile,
  ItemBankQuestion,
  ItemBankQuestionType,
  ItemBankSourceTrace,
  ItemBankSpeakingContent,
  ItemBankWritingContent,
  ItemLevel,
  ItemSkill,
} from "@/lib/item-bank/item-bank-types";

const WRITING_TASK_MAP: Record<string, string> = {
  write_sentence: "write_sentence",
  write_note: "writing_message",
  write_email: "writing_email",
  write_story: "writing_story",
  picture_description: "picture_description",
  writing_copy: "write_sentence",
  writing_message: "writing_message",
};

const SPEAKING_TASK_MAP: Record<string, string> = {
  speaking_personal_questions: "speaking_personal_questions",
  speaking_picture_description: "speaking_picture_description",
  speaking_storytelling: "speaking_storytelling",
  speaking_discussion: "speaking_discussion",
};

function mapSkill(skillTag: string | null | undefined, sectionSlug: string): ItemSkill {
  const slug = (skillTag ?? sectionSlug).toLowerCase();
  if (slug.includes("listen")) return "listening";
  if (slug.includes("writ")) return "writing";
  if (slug.includes("speak")) return "speaking";
  if (slug.includes("read")) return "reading";
  return "reading_writing";
}

function mapQuestionType(cambaType: string): ItemBankQuestionType {
  if (cambaType === "writing" || cambaType === "speaking") return cambaType;
  return cambaType as ItemBankQuestionType;
}

function buildSourceTrace(manifest: GoldMockManifest, q: YleMockQuestionManifestBlock): ItemBankSourceTrace {
  return {
    sourceLevel: manifest.metadata.levelSlug as ItemLevel,
    sourceMock: manifest.gold.goldMockId,
    sourcePart: q.partSlug,
    sourceQuestion: q.questionRef,
    extractedAt: new Date().toISOString(),
    goldMockTier: "gold",
  };
}

function buildWritingContent(q: YleMockQuestionManifestBlock): ItemBankWritingContent {
  const raw = q.content ?? {};
  const cambridgeTaskType = String(raw.cambridgeTaskType ?? "write_sentence");
  const writingTaskType =
    WRITING_TASK_MAP[cambridgeTaskType] ?? WRITING_TASK_MAP[cambridgeTaskType.replace(/^writing_/, "")] ?? "writing_message";

  return {
    prompt: String(raw.prompt ?? q.questionText),
    instructions: typeof raw.taskDescription === "string" ? raw.taskDescription : undefined,
    taskDescription: typeof raw.taskDescription === "string" ? raw.taskDescription : undefined,
    writingTaskType: writingTaskType as ItemBankWritingContent["writingTaskType"],
    cambridgeTaskType,
    minWords: typeof raw.minWords === "number" ? raw.minWords : undefined,
    maxWords: typeof raw.maxWords === "number" ? raw.maxWords : undefined,
    requiredPoints: Array.isArray(raw.requiredPoints)
      ? raw.requiredPoints.filter((p): p is string => typeof p === "string")
      : undefined,
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : undefined,
    rubricId: String(raw.rubricId ?? `gold-${cambridgeTaskType}-v1`),
    questionText: q.questionText,
  };
}

function buildSpeakingContent(q: YleMockQuestionManifestBlock): ItemBankSpeakingContent {
  const raw = q.content ?? {};
  const cambridgeTaskType = String(raw.cambridgeTaskType ?? "speaking_personal_questions");
  const speakingTaskType =
    SPEAKING_TASK_MAP[cambridgeTaskType] ?? "speaking_personal_questions";

  return {
    prompt: String(raw.prompt ?? q.questionText),
    instructions: typeof raw.taskDescription === "string" ? raw.taskDescription : undefined,
    speakingTaskType: speakingTaskType as ItemBankSpeakingContent["speakingTaskType"],
    cambridgeTaskType,
    maxDurationSeconds:
      typeof raw.maxDurationSeconds === "number" ? raw.maxDurationSeconds : 120,
    minDurationSeconds:
      typeof raw.minDurationSeconds === "number" ? raw.minDurationSeconds : undefined,
    followUpQuestions: Array.isArray(raw.followUpQuestions)
      ? raw.followUpQuestions.filter((p): p is string => typeof p === "string")
      : undefined,
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : undefined,
    pictureSequence: Array.isArray(raw.pictureSequence)
      ? raw.pictureSequence.filter((p): p is string => typeof p === "string")
      : undefined,
    rubricId: String(raw.rubricId ?? `gold-${cambridgeTaskType}-v1`),
    questionText: q.questionText,
  };
}

function buildReceptiveContent(q: YleMockQuestionManifestBlock): Record<string, unknown> {
  return {
    questionText: q.questionText,
    ...(q.explanation != null ? { explanation: q.explanation } : {}),
    ...(q.content ?? {}),
    ...(q.choices?.length ? { choices: q.choices } : {}),
    ...(q.pairs?.length ? { pairs: q.pairs } : {}),
  };
}

/** M3.2 — Normalize a Gold Mock question into a canonical item-bank entry. */
export function extractGoldMockItem(
  manifest: GoldMockManifest,
  q: YleMockQuestionManifestBlock
): ItemBankQuestion {
  const level = manifest.metadata.levelSlug as ItemLevel;
  const questionType = mapQuestionType(q.cambaQuestionType);
  const source = buildSourceTrace(manifest, q);

  let content: ItemBankQuestion["content"];
  if (questionType === "writing") content = buildWritingContent(q);
  else if (questionType === "speaking") content = buildSpeakingContent(q);
  else content = buildReceptiveContent(q);

  return {
    id: `${level}-${q.questionRef}`,
    level,
    skill: mapSkill(q.skillTag, q.sectionSlug),
    part: q.partSlug,
    questionType,
    difficulty: q.difficulty,
    grammarTags: [...(q.grammarTags ?? [])],
    vocabularyTopics: [...(q.vocabularyTopics ?? [])],
    content,
    authoringMetadata: {
      sourceManifestId: manifest.metadata.manifestId,
      sourceQuestionRef: q.questionRef,
      extractedAt: source.extractedAt,
      topicTag: q.topicTag,
      skillTag: q.skillTag,
      blueprintQuestionType: q.blueprintQuestionType,
      cambridgeTaskType:
        typeof (q.content ?? {}).cambridgeTaskType === "string"
          ? ((q.content ?? {}).cambridgeTaskType as string)
          : undefined,
      sectionSlug: q.sectionSlug,
      points: q.points,
      sortOrder: q.sortOrder,
      questionText: q.questionText,
      explanation: q.explanation ?? null,
      source,
      rubricId:
        questionType === "writing"
          ? (content as ItemBankWritingContent).rubricId
          : questionType === "speaking"
            ? (content as ItemBankSpeakingContent).rubricId
            : undefined,
    },
  };
}

export function extractItemBankFromGoldMock(manifest: GoldMockManifest): ItemBankFile {
  const items = (manifest.questions ?? []).map((q) => extractGoldMockItem(manifest, q));
  return {
    bankVersion: "2.0.0",
    level: manifest.metadata.levelSlug as ItemLevel,
    itemCount: items.length,
    sourceManifests: [manifest.metadata.manifestId],
    extractedAt: new Date().toISOString(),
    bankTier: "cambridge-unified",
    items,
  };
}

function stemKey(item: ItemBankQuestion): string {
  const content = item.content as Record<string, unknown>;
  const text =
    (typeof content.questionText === "string" && content.questionText) ||
    (typeof content.prompt === "string" && content.prompt) ||
    item.authoringMetadata.questionText ||
    "";
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export function mergeItemBanks(
  primary: ItemBankQuestion[],
  expansion: ItemBankQuestion[]
): ItemBankQuestion[] {
  const seenIds = new Set(primary.map((i) => i.id));
  const seenStems = new Set(primary.map(stemKey).filter(Boolean));
  const merged = [...primary];
  for (const item of expansion) {
    if (seenIds.has(item.id)) continue;
    const stem = stemKey(item);
    if (stem && seenStems.has(stem)) continue;
    merged.push(item);
    seenIds.add(item.id);
    if (stem) seenStems.add(stem);
  }
  return merged;
}
