import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import {
  type GoldMockManifest,
  type GoldMockValidationRules,
  isGoldMockManifest,
} from "@/lib/cambridge-assessment/gold-mock-format";
import { getGoldMockSpecification } from "@/lib/cambridge-assessment/gold-mock-specifications";
import { validateDifficultyDistribution } from "@/lib/cambridge-assessment/exam-assembly/cambridge-difficulty-policy";
import { validateRuntimeManifestCompatibility } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-validation";
import { isWritingQuestion } from "@/lib/writing/writing-utils";
import { isSpeakingQuestion } from "@/lib/speaking/speaking-utils";

export type GoldMockValidationIssue = {
  code: string;
  path: string;
  message: string;
  severity: "error" | "warning";
};

export type GoldMockValidationReport = {
  valid: boolean;
  level: CambridgeExamLevel;
  goldMockId: string;
  issues: GoldMockValidationIssue[];
  grammarCoverage: Record<string, number>;
  vocabularyCoverage: Record<string, number>;
  skillCoverage: Record<string, number>;
  taskCoverage: Record<string, number>;
  difficultyCounts: Record<"easy" | "medium" | "hard", number>;
  blueprintCompliant: boolean;
  writingCount: number;
  speakingCount: number;
};

function issue(
  code: string,
  path: string,
  message: string,
  severity: "error" | "warning" = "error"
): GoldMockValidationIssue {
  return { code, path, message, severity };
}

const PLACEHOLDER_PATTERNS = [
  /^question \d+$/i,
  /^writing task:/i,
  /^speaking task:/i,
  /^choose the correct answer —/i,
  /^match the items —/i,
  /architecture validation/i,
  /placeholder/i,
];

function isPlaceholderStem(text: string): boolean {
  const trimmed = text.trim();
  return PLACEHOLDER_PATTERNS.some((p) => p.test(trimmed));
}

function validateBlueprintCompliance(
  manifest: GoldMockManifest,
  level: CambridgeExamLevel
): { compliant: boolean; issues: GoldMockValidationIssue[] } {
  const blueprint = getCambridgeExamBlueprint(level);
  const issues: GoldMockValidationIssue[] = [];
  const byPart = new Map<string, typeof manifest.questions>();

  for (const q of manifest.questions) {
    const list = byPart.get(q.partSlug) ?? [];
    list.push(q);
    byPart.set(q.partSlug, list);
  }

  for (const paper of blueprint.papers) {
    for (const part of paper.parts) {
      const selected = byPart.get(part.partSlug) ?? [];
      if (selected.length !== part.questionCount) {
        issues.push(
          issue(
            "BLUEPRINT_PART_COUNT",
            `parts.${part.partSlug}`,
            `Expected ${part.questionCount} items, found ${selected.length}.`
          )
        );
      }
    }
  }

  return { compliant: issues.length === 0, issues };
}

export function validateGoldMock(
  manifest: unknown,
  rules: GoldMockValidationRules = getGoldMockSpecification(
    isGoldMockManifest(manifest) ? manifest.specification.level : "starters"
  ).validationRules
): GoldMockValidationReport {
  const issues: GoldMockValidationIssue[] = [];

  if (!isGoldMockManifest(manifest)) {
    return {
      valid: false,
      level: "starters",
      goldMockId: "unknown",
      issues: [issue("NOT_GOLD_MOCK", "gold", "Manifest is not a valid Gold Mock.")],
      grammarCoverage: {},
      vocabularyCoverage: {},
      skillCoverage: {},
      taskCoverage: {},
      difficultyCounts: { easy: 0, medium: 0, hard: 0 },
      blueprintCompliant: false,
      writingCount: 0,
      speakingCount: 0,
    };
  }

  const level = manifest.specification.level;
  const spec = getGoldMockSpecification(level);
  const targets = spec.coverageTargets;

  const grammarCoverage: Record<string, number> = {};
  const vocabularyCoverage: Record<string, number> = {};
  const skillCoverage: Record<string, number> = {};
  const taskCoverage: Record<string, number> = {};
  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
  const refs = new Set<string>();

  let writingCount = 0;
  let speakingCount = 0;

  for (const q of manifest.questions) {
    if (refs.has(q.questionRef)) {
      issues.push(
        issue("DUPLICATE_REF", `questions.${q.questionRef}`, "Duplicate questionRef.")
      );
    }
    refs.add(q.questionRef);

    for (const tag of q.grammarTags ?? []) {
      grammarCoverage[tag] = (grammarCoverage[tag] ?? 0) + 1;
    }
    for (const topic of q.vocabularyTopics ?? []) {
      vocabularyCoverage[topic] = (vocabularyCoverage[topic] ?? 0) + 1;
    }
    if (q.skillTag) skillCoverage[q.skillTag] = (skillCoverage[q.skillTag] ?? 0) + 1;
    if (q.blueprintQuestionType) {
      taskCoverage[q.blueprintQuestionType] = (taskCoverage[q.blueprintQuestionType] ?? 0) + 1;
    }
    difficultyCounts[q.difficulty] += 1;

    if (q.cambaQuestionType === "writing") writingCount += 1;
    if (q.cambaQuestionType === "speaking") speakingCount += 1;

    if (rules.rejectPlaceholderStems && isPlaceholderStem(q.questionText)) {
      issues.push(
        issue(
          "PLACEHOLDER_STEM",
          `questions.${q.questionRef}`,
          "Question stem appears to be placeholder/filler content.",
          "warning"
        )
      );
    }
  }

  const grammarDistinct = Object.keys(grammarCoverage).length;
  const vocabDistinct = Object.keys(vocabularyCoverage).length;
  const skillsDistinct = Object.keys(skillCoverage).length;

  if (grammarDistinct < targets.minDistinctGrammarTags) {
    issues.push(
      issue(
        "GRAMMAR_COVERAGE",
        "coverage.grammar",
        `Need ${targets.minDistinctGrammarTags} grammar tags, have ${grammarDistinct}.`
      )
    );
  }
  if (vocabDistinct < targets.minDistinctVocabularyTopics) {
    issues.push(
      issue(
        "VOCAB_COVERAGE",
        "coverage.vocabulary",
        `Need ${targets.minDistinctVocabularyTopics} vocabulary topics, have ${vocabDistinct}.`
      )
    );
  }
  if (skillsDistinct < targets.minSkillsRepresented) {
    issues.push(
      issue(
        "SKILL_COVERAGE",
        "coverage.skills",
        `Need ${targets.minSkillsRepresented} skills, have ${skillsDistinct}.`
      )
    );
  }
  if (targets.requireWritingTasks && writingCount === 0) {
    issues.push(issue("NO_WRITING", "questions", "Gold Mock requires writing tasks."));
  }
  if (targets.requireSpeakingTasks && speakingCount === 0) {
    issues.push(issue("NO_SPEAKING", "questions", "Gold Mock requires speaking tasks."));
  }

  const totalItems = manifest.questions.length;
  for (const [topic, count] of Object.entries(vocabularyCoverage)) {
    if (count / totalItems > targets.maxTopicShare) {
      issues.push(
        issue(
          "TOPIC_OVER_REPRESENTED",
          `coverage.vocabulary.${topic}`,
          `Topic "${topic}" exceeds max share (${((count / totalItems) * 100).toFixed(0)}%).`,
          "warning"
        )
      );
    }
  }

  const autoDifficulties = manifest.questions
    .filter((q) => q.cambaQuestionType !== "writing" && q.cambaQuestionType !== "speaking")
    .map((q) => q.difficulty);
  const diffResult = validateDifficultyDistribution(autoDifficulties, {
    level,
    distribution: targets.difficultyDistribution,
    tolerance: rules.difficultyTolerance,
  });
  for (const err of diffResult.errors) {
    issues.push(issue("DIFFICULTY", "coverage.difficulty", err));
  }

  if (rules.requireBlueprintCompliance) {
    const bp = validateBlueprintCompliance(manifest, level);
    issues.push(...bp.issues);
  }

  if (rules.requireScoreIntegrity) {
    const pointsSum = manifest.questions.reduce((s, q) => s + (q.points ?? 0), 0);
    if (manifest.metadata.totalScore !== pointsSum) {
      issues.push(
        issue(
          "SCORE_MISMATCH",
          "metadata.totalScore",
          `totalScore ${manifest.metadata.totalScore} !== sum ${pointsSum}.`
        )
      );
    }
  }

  if (rules.requireAiTaskCompatibility) {
    const runtimeCheck = validateRuntimeManifestCompatibility(manifest);
    issues.push(
      ...runtimeCheck.issues.map((i) => ({
        ...i,
        code: `RUNTIME_${i.code}`,
      }))
    );

    for (const q of manifest.questions.filter((x) => x.cambaQuestionType === "writing")) {
      if (
        !isWritingQuestion({
          question_type: "writing",
          question_text: q.questionText,
          content: q.content ?? {},
          media_url: null,
        })
      ) {
        issues.push(
          issue("WRITING_SHAPE", `questions.${q.questionRef}`, "Invalid M2.2 writing shape.")
        );
      }
    }
    for (const q of manifest.questions.filter((x) => x.cambaQuestionType === "speaking")) {
      if (
        !isSpeakingQuestion({
          question_type: "speaking",
          question_text: q.questionText,
          content: q.content ?? {},
          media_url: null,
        })
      ) {
        issues.push(
          issue("SPEAKING_SHAPE", `questions.${q.questionRef}`, "Invalid M2.3 speaking shape.")
        );
      }
    }
  }

  const blueprintCheck = validateBlueprintCompliance(manifest, level);

  return {
    valid: issues.filter((i) => i.severity === "error").length === 0,
    level,
    goldMockId: manifest.gold.goldMockId,
    issues,
    grammarCoverage,
    vocabularyCoverage,
    skillCoverage,
    taskCoverage,
    difficultyCounts,
    blueprintCompliant: blueprintCheck.compliant,
    writingCount,
    speakingCount,
  };
}

export function formatGoldMockValidationReport(report: GoldMockValidationReport): string {
  const lines: string[] = [];
  lines.push(`=== Gold Mock Validation: ${report.goldMockId} ===`);
  lines.push(`Level: ${report.level} | Valid: ${report.valid ? "YES" : "NO"}`);
  lines.push(`Blueprint compliant: ${report.blueprintCompliant ? "yes" : "no"}`);
  lines.push(`Writing: ${report.writingCount} | Speaking: ${report.speakingCount}`);
  lines.push("");
  lines.push("Difficulty:", JSON.stringify(report.difficultyCounts));
  lines.push("Grammar tags:", Object.keys(report.grammarCoverage).join(", "));
  lines.push("Vocab topics:", Object.keys(report.vocabularyCoverage).join(", "));
  if (report.issues.length) {
    lines.push("", "Issues:");
    for (const i of report.issues) {
      lines.push(`  [${i.severity}] ${i.code}: ${i.message}`);
    }
  }
  return lines.join("\n");
}
