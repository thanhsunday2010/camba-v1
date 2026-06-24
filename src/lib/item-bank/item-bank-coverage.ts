import {
  YLE_GRAMMAR_TAGS,
  grammarTagLabel,
} from "@/lib/learning/grammar-taxonomy";
import {
  YLE_VOCABULARY_TOPICS,
  vocabularyTopicLabel,
} from "@/lib/learning/vocabulary-taxonomy";
import type {
  ItemBankCoverageReport,
  ItemBankQuestion,
  ItemBankSpeakingContent,
  ItemBankWritingContent,
  ItemLevel,
} from "@/lib/item-bank/item-bank-types";

function increment(map: Record<string, number>, key: string): void {
  map[key] = (map[key] ?? 0) + 1;
}

function writingTask(item: ItemBankQuestion): string | null {
  if (item.questionType !== "writing") return null;
  const c = item.content as ItemBankWritingContent;
  return c.writingTaskType ?? null;
}

function speakingTask(item: ItemBankQuestion): string | null {
  if (item.questionType !== "speaking") return null;
  const c = item.content as ItemBankSpeakingContent;
  return c.speakingTaskType ?? null;
}

export function analyzeItemBankCoverage(
  level: ItemLevel,
  items: ItemBankQuestion[]
): ItemBankCoverageReport {
  const grammarCoverage: Record<string, number> = {};
  const vocabularyCoverage: Record<string, number> = {};
  const difficultyCoverage: Record<string, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
  };
  const skillCoverage: Record<string, number> = {};
  const taskTypeCoverage: Record<string, number> = {};
  const writingTaskCoverage: Record<string, number> = {};
  const speakingTaskCoverage: Record<string, number> = {};

  for (const item of items) {
    increment(difficultyCoverage, item.difficulty);
    increment(skillCoverage, item.skill);
    increment(taskTypeCoverage, item.questionType);

    const wt = writingTask(item);
    if (wt) increment(writingTaskCoverage, wt);
    const st = speakingTask(item);
    if (st) increment(speakingTaskCoverage, st);

    for (const tag of item.grammarTags) increment(grammarCoverage, tag);
    for (const topic of item.vocabularyTopics) increment(vocabularyCoverage, topic);
  }

  const usedGrammar = new Set(Object.keys(grammarCoverage));
  const usedVocab = new Set(Object.keys(vocabularyCoverage));

  return {
    level,
    totalItems: items.length,
    grammarCoverage,
    vocabularyCoverage,
    difficultyCoverage: difficultyCoverage as ItemBankCoverageReport["difficultyCoverage"],
    skillCoverage,
    taskTypeCoverage,
    writingTaskCoverage,
    speakingTaskCoverage,
    missingGrammarTags: YLE_GRAMMAR_TAGS.filter((t) => !usedGrammar.has(t)),
    missingVocabularyTopics: YLE_VOCABULARY_TOPICS.filter((t) => !usedVocab.has(t)),
  };
}

export function formatItemBankCoverageLines(report: ItemBankCoverageReport): string[] {
  const lines: string[] = [];
  const levelTitle = report.level.toUpperCase();

  lines.push(`=== ${levelTitle} ITEM BANK ===`, "");
  lines.push(`Items: ${report.totalItems}`, "");

  lines.push("Grammar");
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
  for (const band of ["easy", "medium", "hard"] as const) {
    lines.push(
      `  ${band.padEnd(22, " ")} ${String(report.difficultyCoverage[band] ?? 0).padStart(3, " ")}`
    );
  }

  lines.push("", "Writing tasks");
  for (const [task, count] of Object.entries(report.writingTaskCoverage)) {
    lines.push(`  ${task.padEnd(22, " ")} ${String(count).padStart(3, " ")}`);
  }

  lines.push("", "Speaking tasks");
  for (const [task, count] of Object.entries(report.speakingTaskCoverage)) {
    lines.push(`  ${task.padEnd(22, " ")} ${String(count).padStart(3, " ")}`);
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
