import type { YleMockQuestionManifestBlock } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import type { Question } from "@/types/learning";
import {
  normalizeGrammarTags,
  type YleGrammarTag,
} from "@/lib/learning/grammar-taxonomy";
import {
  normalizeVocabularyTopics,
  resolveVocabularyTopicsFromLegacyTopicTag,
  type YleVocabularyTopic,
} from "@/lib/learning/vocabulary-taxonomy";

export type QuestionIntelligenceMetadata = {
  grammarTags: YleGrammarTag[];
  vocabularyTopics: YleVocabularyTopic[];
};

type MetadataCarrier = {
  grammarTags?: string[] | null;
  vocabularyTopics?: string[] | null;
  grammarTag?: string | null;
  topicTag?: string | null;
  content?: Record<string, unknown> | null;
};

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

/** Extract intelligence metadata from a seeded question or manifest block. */
export function extractQuestionIntelligenceMetadata(
  source: MetadataCarrier
): QuestionIntelligenceMetadata {
  const content = source.content ?? {};

  const grammarFromField = readStringArray(source.grammarTags);
  const grammarFromContent = readStringArray(content.grammarTags);
  const legacyGrammar = source.grammarTag ? [source.grammarTag] : [];

  const grammarTags = normalizeGrammarTags([
    ...grammarFromField,
    ...grammarFromContent,
    ...legacyGrammar,
  ]);

  const vocabFromField = readStringArray(source.vocabularyTopics);
  const vocabFromContent = readStringArray(content.vocabularyTopics);
  const legacyTopic = resolveVocabularyTopicsFromLegacyTopicTag(source.topicTag ?? null);

  const vocabularyTopics = normalizeVocabularyTopics([
    ...vocabFromField,
    ...vocabFromContent,
    ...legacyTopic.map((t) => t),
  ]);

  return { grammarTags, vocabularyTopics };
}

export function extractManifestQuestionMetadata(
  q: YleMockQuestionManifestBlock
): QuestionIntelligenceMetadata {
  return extractQuestionIntelligenceMetadata({
    grammarTags: q.grammarTags,
    vocabularyTopics: q.vocabularyTopics,
    grammarTag: (q as { grammarTag?: string }).grammarTag,
    topicTag: q.topicTag,
    content: q.content,
  });
}

export function extractRuntimeQuestionMetadata(question: Question): QuestionIntelligenceMetadata {
  return extractQuestionIntelligenceMetadata({
    grammarTags: readStringArray(question.content?.grammarTags),
    vocabularyTopics: readStringArray(question.content?.vocabularyTopics),
    grammarTag:
      typeof question.content?.grammarTag === "string" ? question.content.grammarTag : null,
    topicTag: typeof question.content?.topicTag === "string" ? question.content.topicTag : null,
    content: question.content,
  });
}
