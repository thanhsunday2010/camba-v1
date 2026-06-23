/** Node mirror of src/lib/learning/vocabulary-taxonomy.ts — keep slugs in sync. */

export const YLE_VOCABULARY_TOPICS = [
  "family",
  "friends",
  "animals",
  "food",
  "drink",
  "school",
  "home",
  "sports",
  "leisure",
  "transport",
  "weather",
  "shopping",
  "clothes",
  "colours",
  "jobs",
  "travel",
  "health",
  "technology",
  "nature",
  "places",
  "body",
  "feelings",
  "numbers",
  "time",
  "hobbies",
  "environment",
  "culture",
  "community",
];

const VOCAB_TOPIC_SET = new Set(YLE_VOCABULARY_TOPICS);

export const LEGACY_TOPIC_TAG_ALIASES = {
  park: "leisure",
  museum: "places",
  "school-trip": "school",
  holiday: "travel",
  farm: "nature",
  vegetables: "food",
  fruit: "food",
  zoo: "animals",
  birthday: "family",
  pets: "animals",
  music: "hobbies",
  library: "school",
  money: "shopping",
  history: "school",
  adventure: "leisure",
  festival: "culture",
  charity: "community",
  invention: "technology",
  coding: "technology",
  events: "leisure",
  workshop: "school",
  exchange: "culture",
  countryside: "nature",
  seasons: "weather",
  days: "time",
};

export function isKnownVocabularyTopic(topic) {
  return VOCAB_TOPIC_SET.has(topic);
}

export function validateVocabularyTopics(topics) {
  if (!topics?.length) return { valid: [], unknown: [] };
  const valid = [];
  const unknown = [];
  const seen = new Set();
  for (const raw of topics) {
    const slug = raw.trim().toLowerCase().replace(/\s+/g, "_");
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    if (isKnownVocabularyTopic(slug)) valid.push(slug);
    else unknown.push(raw);
  }
  return { valid, unknown };
}

export function resolveVocabularyTopicsFromLegacyTopicTag(topicTag) {
  if (!topicTag) return [];
  const slug = topicTag.trim().toLowerCase();
  if (isKnownVocabularyTopic(slug)) return [slug];
  const alias = LEGACY_TOPIC_TAG_ALIASES[slug];
  return alias ? [alias] : [];
}

export function vocabularyTopicLabel(topic) {
  return topic.replace(/_/g, " ");
}

function readStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => typeof v === "string" && v.trim().length > 0);
}

export function extractManifestQuestionMetadata(q) {
  const content = q.content ?? {};
  const grammarTags = [
    ...readStringArray(q.grammarTags),
    ...readStringArray(content.grammarTags),
    ...(q.grammarTag ? [q.grammarTag] : []),
  ].filter((t, i, a) => a.indexOf(t) === i);

  const validGrammar = grammarTags
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, "_"))
    .filter((t) => isKnownGrammarTag(t));

  const vocabExplicit = readStringArray(q.vocabularyTopics);
  const vocabFromContent = readStringArray(content.vocabularyTopics);
  const legacy = resolveVocabularyTopicsFromLegacyTopicTag(q.topicTag);
  const vocabularyTopics = [...new Set([...vocabExplicit, ...vocabFromContent, ...legacy])].filter(
    (t) => isKnownVocabularyTopic(t)
  );

  return { grammarTags: validGrammar, vocabularyTopics };
}
