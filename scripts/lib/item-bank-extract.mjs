/** Node mirror of src/lib/item-bank/item-bank-extract.ts */

export function extractItemBankFromManifest(manifest) {
  const items = (manifest.questions ?? []).map((q) =>
    extractItemFromManifestQuestion(manifest, q)
  );

  return {
    bankVersion: "1.0.0",
    level: manifest.metadata.levelSlug,
    itemCount: items.length,
    sourceManifests: [manifest.metadata.manifestId],
    extractedAt: new Date().toISOString(),
    items,
  };
}

function mapSkill(skillTag, sectionSlug) {
  const slug = (skillTag ?? sectionSlug).toLowerCase();
  if (slug.includes("listen")) return "listening";
  if (slug.includes("writ")) return "writing";
  if (slug.includes("read")) return "reading";
  return "reading_writing";
}

function buildItemContent(q) {
  const content = {
    questionText: q.questionText,
    ...(q.explanation != null ? { explanation: q.explanation } : {}),
    ...(q.content ?? {}),
  };
  if (q.choices?.length) content.choices = q.choices;
  if (q.pairs?.length) content.pairs = q.pairs;
  return content;
}

export function extractItemFromManifestQuestion(manifest, q) {
  const level = manifest.metadata.levelSlug;
  return {
    id: `${level}-${q.questionRef}`,
    level,
    skill: mapSkill(q.skillTag, q.sectionSlug),
    part: q.partSlug,
    questionType: q.cambaQuestionType,
    difficulty: q.difficulty,
    grammarTags: [...(q.grammarTags ?? [])],
    vocabularyTopics: [...(q.vocabularyTopics ?? [])],
    content: buildItemContent(q),
    authoringMetadata: {
      sourceManifestId: manifest.metadata.manifestId,
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
    },
  };
}
