import type { YleMockManifest, YleMockQuestionManifestBlock } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import type {
  ItemBankAuthoringMetadata,
  ItemBankFile,
  ItemBankQuestion,
  ItemBankQuestionType,
  ItemBankWritingContent,
  ItemBankSpeakingContent,
  ItemDifficulty,
  ItemLevel,
  ItemSkill,
} from "@/lib/item-bank/item-bank-types";

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

function buildItemContent(q: YleMockQuestionManifestBlock): ItemBankQuestion["content"] {
  if (q.cambaQuestionType === "writing") {
    const raw = q.content ?? {};
    return {
      prompt: String(raw.prompt ?? q.questionText),
      writingTaskType: "writing_message",
      cambridgeTaskType: String(raw.cambridgeTaskType ?? "write_note"),
      minWords: typeof raw.minWords === "number" ? raw.minWords : undefined,
      maxWords: typeof raw.maxWords === "number" ? raw.maxWords : undefined,
      rubricId: String(raw.rubricId ?? "legacy-writing-v1"),
      questionText: q.questionText,
    } satisfies ItemBankWritingContent;
  }
  if (q.cambaQuestionType === "speaking") {
    const raw = q.content ?? {};
    return {
      prompt: String(raw.prompt ?? q.questionText),
      speakingTaskType: "speaking_personal_questions",
      cambridgeTaskType: String(raw.cambridgeTaskType ?? "speaking_personal_questions"),
      maxDurationSeconds: typeof raw.maxDurationSeconds === "number" ? raw.maxDurationSeconds : 120,
      rubricId: String(raw.rubricId ?? "legacy-speaking-v1"),
      questionText: q.questionText,
    } satisfies ItemBankSpeakingContent;
  }

  const content: Record<string, unknown> = {
    questionText: q.questionText,
    ...(q.explanation != null ? { explanation: q.explanation } : {}),
    ...(q.content ?? {}),
  };
  if (q.choices?.length) content.choices = q.choices;
  if (q.pairs?.length) content.pairs = q.pairs;
  return content;
}

function buildAuthoringMetadata(
  manifestId: string,
  q: YleMockQuestionManifestBlock,
  level: ItemLevel
): ItemBankAuthoringMetadata {
  return {
    sourceManifestId: manifestId,
    sourceQuestionRef: q.questionRef,
    extractedAt: new Date().toISOString(),
    topicTag: q.topicTag,
    skillTag: q.skillTag,
    blueprintQuestionType: q.blueprintQuestionType,
    sectionSlug: q.sectionSlug,
    points: q.points,
    sortOrder: q.sortOrder,
    questionText: q.questionText,
    explanation: q.explanation ?? null,
    source: {
      sourceLevel: level,
      sourceMock: manifestId,
      sourcePart: q.partSlug,
      sourceQuestion: q.questionRef,
      extractedAt: new Date().toISOString(),
    },
  };
}

export function extractItemFromManifestQuestion(
  manifest: YleMockManifest,
  q: YleMockQuestionManifestBlock
): ItemBankQuestion {
  const level = manifest.metadata.levelSlug as ItemLevel;
  const id = `${level}-${q.questionRef}`;

  return {
    id,
    level,
    skill: mapSkill(q.skillTag, q.sectionSlug),
    part: q.partSlug,
    questionType: mapQuestionType(q.cambaQuestionType),
    difficulty: q.difficulty as ItemDifficulty,
    grammarTags: [...(q.grammarTags ?? [])],
    vocabularyTopics: [...(q.vocabularyTopics ?? [])],
    content: buildItemContent(q),
    authoringMetadata: buildAuthoringMetadata(manifest.metadata.manifestId, q, level),
  };
}

/** Extract all manifest questions into a level item bank file. */
export function extractItemBankFromManifest(manifest: YleMockManifest): ItemBankFile {
  const items = (manifest.questions ?? []).map((q) =>
    extractItemFromManifestQuestion(manifest, q)
  );

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
