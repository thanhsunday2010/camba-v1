/** Node mirror of src/lib/learning/grammar-taxonomy.ts — keep slugs in sync. */

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
];

const GRAMMAR_TAG_SET = new Set(YLE_GRAMMAR_TAGS);

export function isKnownGrammarTag(tag) {
  return GRAMMAR_TAG_SET.has(tag);
}

export function validateGrammarTags(tags) {
  if (!tags?.length) return { valid: [], unknown: [] };
  const valid = [];
  const unknown = [];
  const seen = new Set();
  for (const raw of tags) {
    const slug = raw.trim().toLowerCase().replace(/\s+/g, "_");
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    if (isKnownGrammarTag(slug)) valid.push(slug);
    else unknown.push(raw);
  }
  return { valid, unknown };
}

export function grammarTagLabel(tag) {
  return tag.replace(/_/g, " ");
}
