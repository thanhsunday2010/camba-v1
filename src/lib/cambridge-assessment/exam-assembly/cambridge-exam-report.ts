import type { CambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type {
  CambridgeAssemblyPartSelection,
  CambridgeExamVersion,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
import type { CoverageValidationResult } from "@/lib/cambridge-assessment/exam-assembly/cambridge-coverage-engine";
import { summarizeCoverageAchieved } from "@/lib/cambridge-assessment/exam-assembly/cambridge-coverage-engine";

export type CambridgeExamAssemblyReport = {
  level: CambridgeExamBlueprint["level"];
  examVersion: CambridgeExamVersion;
  assemblySeed: string;
  blueprintId: string;
  blueprintVersion: string;
  generatedAt: string;
  itemCount: number;
  itemsSelected: Array<{
    itemId: string;
    partSlug: string;
    paperSlug: string;
    taskType: string;
    skill: string;
    difficulty: string;
    grammarTags: string[];
    vocabularyTopics: string[];
  }>;
  coverageAchieved: ReturnType<typeof summarizeCoverageAchieved>;
  grammarCoverage: Record<string, number>;
  vocabularyCoverage: Record<string, number>;
  difficultyDistribution: CoverageValidationResult["difficulty"];
  blueprintCompliance: boolean;
  writingIncluded: boolean;
  speakingIncluded: boolean;
  warnings: string[];
  errors: string[];
  valid: boolean;
};

export function buildAssemblyReport(
  blueprint: CambridgeExamBlueprint,
  selections: CambridgeAssemblyPartSelection[],
  coverage: CoverageValidationResult,
  options: {
    examVersion: CambridgeExamVersion;
    assemblySeed: string;
  }
): CambridgeExamAssemblyReport {
  const grammarCoverage: Record<string, number> = {};
  const vocabularyCoverage: Record<string, number> = {};

  for (const sel of selections) {
    for (const tag of sel.item.metadata.grammarTags) {
      grammarCoverage[tag] = (grammarCoverage[tag] ?? 0) + 1;
    }
    for (const topic of sel.item.metadata.vocabularyTopics) {
      vocabularyCoverage[topic] = (vocabularyCoverage[topic] ?? 0) + 1;
    }
  }

  return {
    level: blueprint.level,
    examVersion: options.examVersion,
    assemblySeed: options.assemblySeed,
    blueprintId: blueprint.blueprintId,
    blueprintVersion: blueprint.blueprintVersion,
    generatedAt: new Date().toISOString(),
    itemCount: selections.length,
    itemsSelected: selections.map((sel) => ({
      itemId: sel.item.id,
      partSlug: sel.partSlug,
      paperSlug: sel.paperSlug,
      taskType: sel.taskType,
      skill: sel.skill,
      difficulty: sel.item.difficulty,
      grammarTags: sel.item.metadata.grammarTags,
      vocabularyTopics: sel.item.metadata.vocabularyTopics,
    })),
    coverageAchieved: summarizeCoverageAchieved(selections),
    grammarCoverage,
    vocabularyCoverage,
    difficultyDistribution: coverage.difficulty,
    blueprintCompliance: coverage.blueprintCompliant,
    writingIncluded: coverage.writingItemCount > 0,
    speakingIncluded: coverage.speakingItemCount > 0,
    warnings: coverage.warnings,
    errors: coverage.errors,
    valid: coverage.valid,
  };
}

export function formatAssemblyReportText(report: CambridgeExamAssemblyReport): string {
  const lines: string[] = [];
  lines.push(`=== Cambridge Exam Assembly Report ===`);
  lines.push(`Level: ${report.level.toUpperCase()} | Version: ${report.examVersion}`);
  lines.push(`Blueprint: ${report.blueprintId}@${report.blueprintVersion}`);
  lines.push(`Seed: ${report.assemblySeed}`);
  lines.push(`Items: ${report.itemCount} | Valid: ${report.valid ? "YES" : "NO"}`);
  lines.push("");
  lines.push("Difficulty distribution:");
  for (const band of ["easy", "medium", "hard"] as const) {
    const share = (report.difficultyDistribution.shares[band] * 100).toFixed(1);
    const target = (report.difficultyDistribution.targets[band] * 100).toFixed(1);
    lines.push(`  ${band}: ${report.difficultyDistribution.counts[band]} (${share}% / target ${target}%)`);
  }
  lines.push("");
  lines.push(`Writing included: ${report.writingIncluded ? "yes" : "no"}`);
  lines.push(`Speaking included: ${report.speakingIncluded ? "yes" : "no"}`);
  lines.push(`Blueprint compliant: ${report.blueprintCompliance ? "yes" : "no"}`);
  lines.push("");
  lines.push(`Grammar tags (${report.coverageAchieved.distinctGrammarPatterns.length}): ${report.coverageAchieved.distinctGrammarPatterns.join(", ")}`);
  lines.push(`Vocab topics (${report.coverageAchieved.distinctTopics.length}): ${report.coverageAchieved.distinctTopics.join(", ")}`);
  if (report.warnings.length) {
    lines.push("", "Warnings:");
    for (const w of report.warnings) lines.push(`  - ${w}`);
  }
  if (report.errors.length) {
    lines.push("", "Errors:");
    for (const e of report.errors) lines.push(`  - ${e}`);
  }
  return lines.join("\n");
}
