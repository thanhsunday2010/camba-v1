import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import type { YleMockValidationIssue } from "@/lib/mock-blueprints/yle-mock-blueprint-types";
import { validateGrammarTags } from "@/lib/learning/grammar-taxonomy";
import { validateVocabularyTopics } from "@/lib/learning/vocabulary-taxonomy";
import { extractManifestQuestionMetadata } from "@/lib/learning/question-metadata";

function warn(
  code: string,
  path: string,
  message: string
): YleMockValidationIssue {
  return { code, severity: "warning", path, message };
}

/**
 * M1.4 intelligence metadata warnings — never blocks seeding.
 */
export function analyzeQuestionIntelligenceMetadata(
  manifest: YleMockManifest
): YleMockValidationIssue[] {
  const issues: YleMockValidationIssue[] = [];

  for (const q of manifest.questions ?? []) {
    const path = `questions.${q.questionRef}`;
    const rawGrammar = q.grammarTags ?? [];
    const rawVocab = q.vocabularyTopics ?? [];
    const legacyGrammar = (q as { grammarTag?: string }).grammarTag;

    const hasGrammarField =
      rawGrammar.length > 0 || Boolean(legacyGrammar?.trim());
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
