/**
 * M1.4 — Canonical YLE vocabulary topic registry for mock question metadata.
 */

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
] as const;

export type YleVocabularyTopic = (typeof YLE_VOCABULARY_TOPICS)[number];

const VOCAB_TOPIC_SET = new Set<string>(YLE_VOCABULARY_TOPICS);

export const YLE_VOCABULARY_TOPIC_LABELS: Record<YleVocabularyTopic, string> = {
  family: "Family",
  friends: "Friends",
  animals: "Animals",
  food: "Food",
  drink: "Drink",
  school: "School",
  home: "Home",
  sports: "Sports",
  leisure: "Leisure",
  transport: "Transport",
  weather: "Weather",
  shopping: "Shopping",
  clothes: "Clothes",
  colours: "Colours",
  jobs: "Jobs",
  travel: "Travel",
  health: "Health",
  technology: "Technology",
  nature: "Nature",
  places: "Places",
  body: "Body",
  feelings: "Feelings",
  numbers: "Numbers",
  time: "Time",
  hobbies: "Hobbies",
  environment: "Environment",
  culture: "Culture",
  community: "Community",
};

/** Maps legacy freeform topicTag slugs to canonical vocabularyTopics where sensible. */
export const LEGACY_TOPIC_TAG_ALIASES: Record<string, YleVocabularyTopic> = {
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

export function isKnownVocabularyTopic(topic: string): topic is YleVocabularyTopic {
  return VOCAB_TOPIC_SET.has(topic);
}

export function normalizeVocabularyTopics(
  topics: string[] | null | undefined
): YleVocabularyTopic[] {
  if (!topics?.length) return [];
  const seen = new Set<YleVocabularyTopic>();
  for (const raw of topics) {
    const slug = raw.trim().toLowerCase().replace(/\s+/g, "_");
    if (isKnownVocabularyTopic(slug)) seen.add(slug);
  }
  return [...seen];
}

export function validateVocabularyTopics(topics: string[] | null | undefined): {
  valid: YleVocabularyTopic[];
  unknown: string[];
} {
  if (!topics?.length) return { valid: [], unknown: [] };
  const valid: YleVocabularyTopic[] = [];
  const unknown: string[] = [];
  const seen = new Set<string>();

  for (const raw of topics) {
    const slug = raw.trim().toLowerCase().replace(/\s+/g, "_");
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    if (isKnownVocabularyTopic(slug)) {
      valid.push(slug);
    } else {
      unknown.push(raw);
    }
  }
  return { valid, unknown };
}

export function vocabularyTopicLabel(topic: string): string {
  if (isKnownVocabularyTopic(topic)) return YLE_VOCABULARY_TOPIC_LABELS[topic];
  return topic.replace(/_/g, " ");
}

export function resolveVocabularyTopicsFromLegacyTopicTag(
  topicTag: string | null | undefined
): YleVocabularyTopic[] {
  if (!topicTag) return [];
  const slug = topicTag.trim().toLowerCase();
  if (isKnownVocabularyTopic(slug)) return [slug];
  const alias = LEGACY_TOPIC_TAG_ALIASES[slug];
  return alias ? [alias] : [];
}
