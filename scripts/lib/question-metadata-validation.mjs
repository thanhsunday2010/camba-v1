import { validateGrammarTags } from "./grammar-taxonomy.mjs";
import { validateVocabularyTopics, extractManifestQuestionMetadata } from "./vocabulary-taxonomy.mjs";

function warn(code, path, message) {
  return { code, severity: "warning", path, message };
}

/** M1.4 — Node mirror of question-metadata-validation.ts */
export function analyzeQuestionIntelligenceMetadata(manifest) {
  const issues = [];

  for (const q of manifest.questions ?? []) {
    const path = `questions.${q.questionRef}`;
    const rawGrammar = q.grammarTags ?? [];
    const rawVocab = q.vocabularyTopics ?? [];
    const legacyGrammar = q.grammarTag;

    const hasGrammarField = rawGrammar.length > 0 || Boolean(legacyGrammar?.trim());
    const hasVocabField = rawVocab.length > 0;

    const extracted = extractManifestQuestionMetadata(q);

    if (!hasGrammarField && extracted.grammarTags.length === 0) {
      issues.push(
        warn(
          "GRAMMAR_TAG_MISSING",
          path,
          "No grammarTags — add canonical grammar metadata for future diagnostics."
        )
      );
    }

    if (!hasVocabField && extracted.vocabularyTopics.length === 0) {
      issues.push(
        warn(
          "VOCAB_TOPIC_MISSING",
          path,
          "No vocabularyTopics — add canonical vocabulary metadata for future diagnostics."
        )
      );
    }

    if (rawGrammar.length > 0) {
      const { unknown } = validateGrammarTags(rawGrammar);
      for (const tag of unknown) {
        issues.push(
          warn(
            "UNKNOWN_GRAMMAR_TAG",
            `${path}.grammarTags`,
            `Unknown grammar tag: "${tag}". Use slugs from grammar-taxonomy.`
          )
        );
      }
    }

    if (rawVocab.length > 0) {
      const { unknown } = validateVocabularyTopics(rawVocab);
      for (const topic of unknown) {
        issues.push(
          warn(
            "UNKNOWN_VOCAB_TOPIC",
            `${path}.vocabularyTopics`,
            `Unknown vocabulary topic: "${topic}". Use slugs from vocabulary-taxonomy.`
          )
        );
      }
    }
  }

  return issues;
}
