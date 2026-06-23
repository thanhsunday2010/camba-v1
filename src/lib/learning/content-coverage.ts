import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import {
  YLE_GRAMMAR_TAGS,
  grammarTagLabel,
  type YleGrammarTag,
} from "@/lib/learning/grammar-taxonomy";
import {
  YLE_VOCABULARY_TOPICS,
  vocabularyTopicLabel,
  type YleVocabularyTopic,
} from "@/lib/learning/vocabulary-taxonomy";
import { extractManifestQuestionMetadata } from "@/lib/learning/question-metadata";

export type CoverageCountMap = Record<string, number>;

export type ContentCoverageReport = {
  totalQuestions: number;
  taggedGrammarQuestions: number;
  taggedVocabQuestions: number;
  grammarCoverage: CoverageCountMap;
  vocabularyCoverage: CoverageCountMap;
  grammarPercentOfTaxonomy: number;
  vocabularyPercentOfTaxonomy: number;
  missingGrammarTags: YleGrammarTag[];
  missingVocabularyTopics: YleVocabularyTopic[];
  untaggedGrammarQuestionRefs: string[];
  untaggedVocabQuestionRefs: string[];
};

function countTags(
  questions: YleMockManifest["questions"]
): {
  grammar: CoverageCountMap;
  vocabulary: CoverageCountMap;
  untaggedGrammar: string[];
  untaggedVocab: string[];
  taggedGrammarCount: number;
  taggedVocabCount: number;
} {
  const grammar: CoverageCountMap = {};
  const vocabulary: CoverageCountMap = {};
  const untaggedGrammar: string[] = [];
  const untaggedVocab: string[] = [];
  let taggedGrammarCount = 0;
  let taggedVocabCount = 0;

  for (const q of questions) {
    const meta = extractManifestQuestionMetadata(q);
    if (meta.grammarTags.length === 0) {
      untaggedGrammar.push(q.questionRef);
    } else {
      taggedGrammarCount += 1;
      for (const tag of meta.grammarTags) {
        grammar[tag] = (grammar[tag] ?? 0) + 1;
      }
    }
    if (meta.vocabularyTopics.length === 0) {
      untaggedVocab.push(q.questionRef);
    } else {
      taggedVocabCount += 1;
      for (const topic of meta.vocabularyTopics) {
        vocabulary[topic] = (vocabulary[topic] ?? 0) + 1;
      }
    }
  }

  return {
    grammar,
    vocabulary,
    untaggedGrammar,
    untaggedVocab,
    taggedGrammarCount,
    taggedVocabCount,
  };
}

export function analyzeContentCoverage(manifest: YleMockManifest): ContentCoverageReport {
  const questions = manifest.questions ?? [];
  const counts = countTags(questions);

  const grammarTagsUsed = new Set(Object.keys(counts.grammar));
  const vocabTopicsUsed = new Set(Object.keys(counts.vocabulary));

  const missingGrammarTags = YLE_GRAMMAR_TAGS.filter((t) => !grammarTagsUsed.has(t));
  const missingVocabularyTopics = YLE_VOCABULARY_TOPICS.filter((t) => !vocabTopicsUsed.has(t));

  return {
    totalQuestions: questions.length,
    taggedGrammarQuestions: counts.taggedGrammarCount,
    taggedVocabQuestions: counts.taggedVocabCount,
    grammarCoverage: counts.grammar,
    vocabularyCoverage: counts.vocabulary,
    grammarPercentOfTaxonomy: Math.round(
      (grammarTagsUsed.size / YLE_GRAMMAR_TAGS.length) * 100
    ),
    vocabularyPercentOfTaxonomy: Math.round(
      (vocabTopicsUsed.size / YLE_VOCABULARY_TOPICS.length) * 100
    ),
    missingGrammarTags,
    missingVocabularyTopics,
    untaggedGrammarQuestionRefs: counts.untaggedGrammar,
    untaggedVocabQuestionRefs: counts.untaggedVocab,
  };
}

export function mergeContentCoverageReports(
  manifests: YleMockManifest[]
): ContentCoverageReport {
  const mergedQuestions = manifests.flatMap((m) => m.questions ?? []);
  return analyzeContentCoverage({ ...manifests[0], questions: mergedQuestions });
}

export function formatCoverageReportLines(report: ContentCoverageReport): string[] {
  const lines: string[] = [
    `Total questions: ${report.totalQuestions}`,
    `Grammar-tagged: ${report.taggedGrammarQuestions}/${report.totalQuestions} (${report.grammarPercentOfTaxonomy}% of taxonomy represented)`,
    `Vocabulary-tagged: ${report.taggedVocabQuestions}/${report.totalQuestions} (${report.vocabularyPercentOfTaxonomy}% of taxonomy represented)`,
    "",
    "Grammar Coverage",
  ];

  const grammarSorted = Object.entries(report.grammarCoverage).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );
  if (grammarSorted.length === 0) {
    lines.push("  (none tagged yet)");
  } else {
    const maxCount = Math.max(...grammarSorted.map(([, n]) => n), 1);
    for (const [tag, count] of grammarSorted) {
      const pad = ".".repeat(Math.max(1, 18 - grammarTagLabel(tag).length));
      lines.push(`  ${grammarTagLabel(tag).padEnd(18)} ${pad} ${count}`);
    }
  }

  lines.push("", "Vocabulary Coverage");
  const vocabSorted = Object.entries(report.vocabularyCoverage).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );
  if (vocabSorted.length === 0) {
    lines.push("  (none tagged yet — legacy topicTag may still resolve at runtime)");
  } else {
    for (const [topic, count] of vocabSorted) {
      const pad = ".".repeat(Math.max(1, 18 - vocabularyTopicLabel(topic).length));
      lines.push(`  ${vocabularyTopicLabel(topic).padEnd(18)} ${pad} ${count}`);
    }
  }

  if (report.missingGrammarTags.length > 0) {
    lines.push(
      "",
      `Missing grammar areas (${report.missingGrammarTags.length}): ${report.missingGrammarTags.slice(0, 8).join(", ")}${report.missingGrammarTags.length > 8 ? "…" : ""}`
    );
  }
  if (report.missingVocabularyTopics.length > 0) {
    lines.push(
      `Missing vocabulary areas (${report.missingVocabularyTopics.length}): ${report.missingVocabularyTopics.slice(0, 8).join(", ")}${report.missingVocabularyTopics.length > 8 ? "…" : ""}`
    );
  }

  return lines;
}
