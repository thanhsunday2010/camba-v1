/**
 * M1.4 — Canonical YLE grammar tag registry for mock question metadata.
 * Slugs are stable identifiers used in manifests, DB content, and analytics.
 */

export const YLE_GRAMMAR_TAGS = [
  "present_simple",
  "present_continuous",
  "past_simple",
  "past_continuous",
  "future_will",
  "future_going_to",
  "comparatives",
  "superlatives",
  "articles",
  "pronouns",
  "possessives",
  "prepositions",
  "countable_uncountable",
  "question_forms",
  "modal_can",
  "modal_must",
  "conjunctions",
  "adverbs_frequency",
  "verb_be",
  "have_got",
  "there_is_are",
  "imperatives",
  "relative_clauses",
  "linking_words",
] as const;

export type YleGrammarTag = (typeof YLE_GRAMMAR_TAGS)[number];

const GRAMMAR_TAG_SET = new Set<string>(YLE_GRAMMAR_TAGS);

/** Human-readable labels for product / reporting surfaces. */
export const YLE_GRAMMAR_TAG_LABELS: Record<YleGrammarTag, string> = {
  present_simple: "Present simple",
  present_continuous: "Present continuous",
  past_simple: "Past simple",
  past_continuous: "Past continuous",
  future_will: "Future (will)",
  future_going_to: "Future (going to)",
  comparatives: "Comparatives",
  superlatives: "Superlatives",
  articles: "Articles (a/an/the)",
  pronouns: "Pronouns",
  possessives: "Possessives",
  prepositions: "Prepositions",
  countable_uncountable: "Countable / uncountable nouns",
  question_forms: "Question forms",
  modal_can: "Modal: can",
  modal_must: "Modal: must / mustn't",
  conjunctions: "Conjunctions",
  adverbs_frequency: "Adverbs of frequency",
  verb_be: "Verb be (am/is/are)",
  have_got: "Have got",
  there_is_are: "There is / there are",
  imperatives: "Imperatives",
  relative_clauses: "Relative clauses",
  linking_words: "Linking words",
};

export function isKnownGrammarTag(tag: string): tag is YleGrammarTag {
  return GRAMMAR_TAG_SET.has(tag);
}

export function normalizeGrammarTags(tags: string[] | null | undefined): YleGrammarTag[] {
  if (!tags?.length) return [];
  const seen = new Set<YleGrammarTag>();
  for (const raw of tags) {
    const slug = raw.trim().toLowerCase().replace(/\s+/g, "_");
    if (isKnownGrammarTag(slug)) seen.add(slug);
  }
  return [...seen];
}

export function validateGrammarTags(tags: string[] | null | undefined): {
  valid: YleGrammarTag[];
  unknown: string[];
} {
  if (!tags?.length) return { valid: [], unknown: [] };
  const valid: YleGrammarTag[] = [];
  const unknown: string[] = [];
  const seen = new Set<string>();

  for (const raw of tags) {
    const slug = raw.trim().toLowerCase().replace(/\s+/g, "_");
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    if (isKnownGrammarTag(slug)) {
      valid.push(slug);
    } else {
      unknown.push(raw);
    }
  }
  return { valid, unknown };
}

export function grammarTagLabel(tag: string): string {
  if (isKnownGrammarTag(tag)) return YLE_GRAMMAR_TAG_LABELS[tag];
  return tag.replace(/_/g, " ");
}
