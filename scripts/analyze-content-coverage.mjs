import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { YLE_GRAMMAR_TAGS, grammarTagLabel } from "./lib/grammar-taxonomy.mjs";
import {
  YLE_VOCABULARY_TOPICS,
  vocabularyTopicLabel,
  extractManifestQuestionMetadata,
} from "./lib/vocabulary-taxonomy.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST_ROOT = resolve(ROOT, "data/mock-tests");

function loadManifest(levelSlug, slug) {
  const path = resolve(MANIFEST_ROOT, levelSlug, `${slug}.json`);
  if (!existsSync(path)) throw new Error(`Manifest not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function discoverManifests(levelFilter) {
  const manifests = [];
  const levels = levelFilter
    ? [levelFilter]
    : readdirSync(MANIFEST_ROOT, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

  for (const level of levels) {
    const dir = join(MANIFEST_ROOT, level);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (file.endsWith(".json")) {
        manifests.push({ levelSlug: level, slug: file.replace(/\.json$/, "") });
      }
    }
  }
  return manifests;
}

function analyzeContentCoverage(manifest) {
  const questions = manifest.questions ?? [];
  const grammar = {};
  const vocabulary = {};
  let taggedGrammarCount = 0;
  let taggedVocabCount = 0;

  for (const q of questions) {
    const meta = extractManifestQuestionMetadata(q);
    if (meta.grammarTags.length > 0) {
      taggedGrammarCount += 1;
      for (const tag of meta.grammarTags) {
        grammar[tag] = (grammar[tag] ?? 0) + 1;
      }
    }
    if (meta.vocabularyTopics.length > 0) {
      taggedVocabCount += 1;
      for (const topic of meta.vocabularyTopics) {
        vocabulary[topic] = (vocabulary[topic] ?? 0) + 1;
      }
    }
  }

  const grammarTagsUsed = new Set(Object.keys(grammar));
  const vocabTopicsUsed = new Set(Object.keys(vocabulary));

  return {
    totalQuestions: questions.length,
    taggedGrammarQuestions: taggedGrammarCount,
    taggedVocabQuestions: taggedVocabCount,
    grammarCoverage: grammar,
    vocabularyCoverage: vocabulary,
    grammarPercentOfTaxonomy: Math.round(
      (grammarTagsUsed.size / YLE_GRAMMAR_TAGS.length) * 100
    ),
    vocabularyPercentOfTaxonomy: Math.round(
      (vocabTopicsUsed.size / YLE_VOCABULARY_TOPICS.length) * 100
    ),
    missingGrammarTags: YLE_GRAMMAR_TAGS.filter((t) => !grammarTagsUsed.has(t)),
    missingVocabularyTopics: YLE_VOCABULARY_TOPICS.filter((t) => !vocabTopicsUsed.has(t)),
  };
}

function mergeReports(reports) {
  const grammar = {};
  const vocabulary = {};
  let totalQuestions = 0;
  let taggedGrammarQuestions = 0;
  let taggedVocabQuestions = 0;

  for (const report of reports) {
    totalQuestions += report.totalQuestions;
    taggedGrammarQuestions += report.taggedGrammarQuestions;
    taggedVocabQuestions += report.taggedVocabQuestions;
    for (const [k, v] of Object.entries(report.grammarCoverage)) {
      grammar[k] = (grammar[k] ?? 0) + v;
    }
    for (const [k, v] of Object.entries(report.vocabularyCoverage)) {
      vocabulary[k] = (vocabulary[k] ?? 0) + v;
    }
  }

  const grammarTagsUsed = new Set(Object.keys(grammar));
  const vocabTopicsUsed = new Set(Object.keys(vocabulary));

  return {
    totalQuestions,
    taggedGrammarQuestions,
    taggedVocabQuestions,
    grammarCoverage: grammar,
    vocabularyCoverage: vocabulary,
    grammarPercentOfTaxonomy: Math.round(
      (grammarTagsUsed.size / YLE_GRAMMAR_TAGS.length) * 100
    ),
    vocabularyPercentOfTaxonomy: Math.round(
      (vocabTopicsUsed.size / YLE_VOCABULARY_TOPICS.length) * 100
    ),
    missingGrammarTags: YLE_GRAMMAR_TAGS.filter((t) => !grammarTagsUsed.has(t)),
    missingVocabularyTopics: YLE_VOCABULARY_TOPICS.filter((t) => !vocabTopicsUsed.has(t)),
  };
}

function printReport(label, report) {
  console.log(`\n=== ${label} ===`);
  console.log(`Total questions: ${report.totalQuestions}`);
  console.log(
    `Grammar-tagged: ${report.taggedGrammarQuestions}/${report.totalQuestions} (${report.grammarPercentOfTaxonomy}% of taxonomy slugs used)`
  );
  console.log(
    `Vocabulary-tagged: ${report.taggedVocabQuestions}/${report.totalQuestions} (${report.vocabularyPercentOfTaxonomy}% of taxonomy slugs used)`
  );

  console.log("\nGrammar Coverage");
  const grammarSorted = Object.entries(report.grammarCoverage).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );
  if (grammarSorted.length === 0) {
    console.log("  (none explicitly tagged — add grammarTags to manifests)");
  } else {
    for (const [tag, count] of grammarSorted) {
      const labelText = grammarTagLabel(tag);
      const pad = ".".repeat(Math.max(1, 20 - labelText.length));
      console.log(`  ${labelText.padEnd(20)} ${pad} ${count}`);
    }
  }

  console.log("\nVocabulary Coverage");
  const vocabSorted = Object.entries(report.vocabularyCoverage).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );
  if (vocabSorted.length === 0) {
    console.log("  (legacy topicTag aliases may still resolve at runtime)");
  } else {
    for (const [topic, count] of vocabSorted) {
      const labelText = vocabularyTopicLabel(topic);
      const pad = ".".repeat(Math.max(1, 20 - labelText.length));
      console.log(`  ${labelText.padEnd(20)} ${pad} ${count}`);
    }
  }

  if (report.missingGrammarTags.length) {
    console.log(
      `\nMissing grammar areas (${report.missingGrammarTags.length}): ${report.missingGrammarTags.slice(0, 6).join(", ")}${report.missingGrammarTags.length > 6 ? "…" : ""}`
    );
  }
  if (report.missingVocabularyTopics.length) {
    console.log(
      `Missing vocabulary areas (${report.missingVocabularyTopics.length}): ${report.missingVocabularyTopics.slice(0, 6).join(", ")}${report.missingVocabularyTopics.length > 6 ? "…" : ""}`
    );
  }
}

function main() {
  const [levelArg, slugArg] = process.argv.slice(2);
  const targets =
    levelArg && slugArg
      ? [{ levelSlug: levelArg, slug: slugArg }]
      : discoverManifests(levelArg);

  if (targets.length === 0) {
    console.error("No manifests found under data/mock-tests/");
    process.exit(1);
  }

  const reports = [];
  for (const { levelSlug, slug } of targets) {
    const manifest = loadManifest(levelSlug, slug);
    reports.push(analyzeContentCoverage(manifest));
    printReport(`${levelSlug}/${slug}`, reports[reports.length - 1]);
  }

  if (reports.length > 1) {
    printReport("YLE practice bank (combined)", mergeReports(reports));
  }
}

main();
