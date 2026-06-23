#!/usr/bin/env node
/**
 * Analyze item bank grammar/vocabulary/difficulty coverage.
 *
 * Usage:
 *   npm run analyze:item-bank starters
 *   npm run analyze:item-bank
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { YLE_GRAMMAR_TAGS, grammarTagLabel } from "./lib/grammar-taxonomy.mjs";
import { YLE_VOCABULARY_TOPICS, vocabularyTopicLabel } from "./lib/vocabulary-taxonomy.mjs";
import { validateItemBankFile } from "./lib/item-bank-validation.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BANK_ROOT = resolve(ROOT, "data/item-bank");
const LEVELS = ["starters", "movers", "flyers"];

function loadBank(level) {
  const path = join(BANK_ROOT, level, "items.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

function analyzeCoverage(level, items) {
  const grammarCoverage = {};
  const vocabularyCoverage = {};
  const difficultyCoverage = { easy: 0, medium: 0, hard: 0 };

  for (const item of items) {
    difficultyCoverage[item.difficulty] = (difficultyCoverage[item.difficulty] ?? 0) + 1;
    for (const tag of item.grammarTags) {
      grammarCoverage[tag] = (grammarCoverage[tag] ?? 0) + 1;
    }
    for (const topic of item.vocabularyTopics) {
      vocabularyCoverage[topic] = (vocabularyCoverage[topic] ?? 0) + 1;
    }
  }

  const usedGrammar = new Set(Object.keys(grammarCoverage));
  const usedVocab = new Set(Object.keys(vocabularyCoverage));

  return {
    level,
    totalItems: items.length,
    grammarCoverage,
    vocabularyCoverage,
    difficultyCoverage,
    missingGrammarTags: YLE_GRAMMAR_TAGS.filter((t) => !usedGrammar.has(t)),
    missingVocabularyTopics: YLE_VOCABULARY_TOPICS.filter((t) => !usedVocab.has(t)),
  };
}

function formatLines(report) {
  const lines = [];
  lines.push(`=== ${report.level.toUpperCase()} ITEM BANK ===`, "");
  lines.push(`Items: ${report.totalItems}`, "", "Grammar");

  const grammarEntries = Object.entries(report.grammarCoverage).sort(
    (a, b) => b[1] - a[1] || grammarTagLabel(a[0]).localeCompare(grammarTagLabel(b[0]))
  );
  if (grammarEntries.length === 0) {
    lines.push("  (none tagged)");
  } else {
    for (const [tag, count] of grammarEntries) {
      lines.push(`  ${grammarTagLabel(tag).padEnd(22, " ")} ${String(count).padStart(3, " ")}`);
    }
  }

  lines.push("", "Vocabulary");
  const vocabEntries = Object.entries(report.vocabularyCoverage).sort(
    (a, b) =>
      b[1] - a[1] || vocabularyTopicLabel(a[0]).localeCompare(vocabularyTopicLabel(b[0]))
  );
  if (vocabEntries.length === 0) {
    lines.push("  (none tagged)");
  } else {
    for (const [topic, count] of vocabEntries) {
      lines.push(
        `  ${vocabularyTopicLabel(topic).padEnd(22, " ")} ${String(count).padStart(3, " ")}`
      );
    }
  }

  lines.push("", "Difficulty");
  for (const band of ["easy", "medium", "hard"]) {
    lines.push(
      `  ${band.padEnd(22, " ")} ${String(report.difficultyCoverage[band] ?? 0).padStart(3, " ")}`
    );
  }

  lines.push("", "Missing grammar areas:");
  if (report.missingGrammarTags.length === 0) {
    lines.push("  (none — full taxonomy represented)");
  } else {
    const preview = report.missingGrammarTags.slice(0, 6).map((t) => grammarTagLabel(t));
    lines.push(
      `  ${preview.join(", ")}${report.missingGrammarTags.length > 6 ? "…" : ""}`
    );
  }

  lines.push("", "Missing vocabulary areas:");
  if (report.missingVocabularyTopics.length === 0) {
    lines.push("  (none — full taxonomy represented)");
  } else {
    const preview = report.missingVocabularyTopics
      .slice(0, 6)
      .map((t) => vocabularyTopicLabel(t));
    lines.push(
      `  ${preview.join(", ")}${report.missingVocabularyTopics.length > 6 ? "…" : ""}`
    );
  }

  return lines;
}

function main() {
  const levelFilter = process.argv[2] ?? null;
  const levels = levelFilter
    ? [levelFilter]
    : readdirSync(BANK_ROOT, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .filter((name) => LEVELS.includes(name));

  let anyOutput = false;

  for (const level of levels) {
    const bank = loadBank(level);
    if (!bank?.items?.length) continue;

    const validation = validateItemBankFile(bank.items);
    if (!validation.valid) {
      console.error(`Validation failed for ${level} item bank:`);
      for (const err of validation.errors) {
        console.error(`  [${err.code}] ${err.path}: ${err.message}`);
      }
      process.exit(1);
    }

    const report = analyzeCoverage(level, bank.items);
    if (anyOutput) console.log("");
    console.log(formatLines(report).join("\n"));
    anyOutput = true;
  }

  if (!anyOutput) {
    console.log("No item bank data found.");
    process.exit(1);
  }
}

main();
