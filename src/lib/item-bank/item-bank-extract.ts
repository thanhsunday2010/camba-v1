import type { YleMockManifest, YleMockQuestionManifestBlock } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import type {
  ItemBankAuthoringMetadata,
  ItemBankFile,
  ItemBankQuestion,
  ItemBankQuestionType,
  ItemDifficulty,
  ItemLevel,
  ItemSkill,
} from "@/lib/item-bank/item-bank-types";

function mapSkill(skillTag: string | null | undefined, sectionSlug: string): ItemSkill {
  const slug = (skillTag ?? sectionSlug).toLowerCase();
  if (slug.includes("listen")) return "listening";
  if (slug.includes("writ")) return "writing";
  if (slug.includes("read")) return "reading";
  return "reading_writing";
}

function mapQuestionType(cambaType: string): ItemBankQuestionType {
  return cambaType as ItemBankQuestionType;
}

function buildItemContent(q: YleMockQuestionManifestBlock): Record<string, unknown> {
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
  q: YleMockQuestionManifestBlock
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
    authoringMetadata: buildAuthoringMetadata(manifest.metadata.manifestId, q),
  };
}

/** Extract all manifest questions into a level item bank file. */
export function extractItemBankFromManifest(manifest: YleMockManifest): ItemBankFile {
  const items = (manifest.questions ?? []).map((q) =>
    extractItemFromManifestQuestion(manifest, q)
  );

  return {
    bankVersion: "1.0.0",
    level: manifest.metadata.levelSlug as ItemLevel,
    itemCount: items.length,
    sourceManifests: [manifest.metadata.manifestId],
    extractedAt: new Date().toISOString(),
    items,
  };
}
