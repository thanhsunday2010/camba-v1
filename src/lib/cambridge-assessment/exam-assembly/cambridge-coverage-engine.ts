import type { CambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type {
  CambridgeAssemblyPartSelection,
  CambridgeCoverageRequirements,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
import {
  getCoverageRequirementsForLevel,
  type DifficultyDistributionResult,
  validateDifficultyDistribution,
  getDifficultyPolicyForLevel,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-difficulty-policy";

export type CoverageValidationResult = {
  valid: boolean;
  grammarTags: string[];
  vocabularyTopics: string[];
  skillsRepresented: string[];
  taskTypesRepresented: string[];
  writingItemCount: number;
  speakingItemCount: number;
  blueprintCompliant: boolean;
  errors: string[];
  warnings: string[];
  difficulty: DifficultyDistributionResult;
};

function collectMetadata(selections: CambridgeAssemblyPartSelection[]) {
  const grammarTags = new Set<string>();
  const vocabularyTopics = new Set<string>();
  const skills = new Set<string>();
  const taskTypes = new Set<string>();
  let writingItemCount = 0;
  let speakingItemCount = 0;

  for (const sel of selections) {
    for (const tag of sel.item.metadata.grammarTags) grammarTags.add(tag);
    for (const topic of sel.item.metadata.vocabularyTopics) vocabularyTopics.add(topic);
    skills.add(sel.skill);
    taskTypes.add(sel.taskType);
    if (sel.item.kind === "writing") writingItemCount += 1;
    if (sel.item.kind === "speaking") speakingItemCount += 1;
  }

  return {
    grammarTags: [...grammarTags],
    vocabularyTopics: [...vocabularyTopics],
    skillsRepresented: [...skills],
    taskTypesRepresented: [...taskTypes],
    writingItemCount,
    speakingItemCount,
  };
}

function validateBlueprintCompliance(
  blueprint: CambridgeExamBlueprint,
  selections: CambridgeAssemblyPartSelection[]
): { compliant: boolean; errors: string[] } {
  const errors: string[] = [];
  const byPart = new Map<string, CambridgeAssemblyPartSelection[]>();

  for (const sel of selections) {
    const key = `${sel.paperSlug}::${sel.partSlug}`;
    const list = byPart.get(key) ?? [];
    list.push(sel);
    byPart.set(key, list);
  }

  for (const paper of blueprint.papers) {
    for (const part of paper.parts) {
      const key = `${paper.paperSlug}::${part.partSlug}`;
      const selected = byPart.get(key) ?? [];
      if (selected.length !== part.questionCount) {
        errors.push(
          `Part ${part.partSlug}: expected ${part.questionCount} items, got ${selected.length}.`
        );
      }
      for (const sel of selected) {
        if (!part.allowedTaskTypes.includes(sel.taskType)) {
          errors.push(
            `Part ${part.partSlug}: task type ${sel.taskType} not allowed in blueprint.`
          );
        }
      }
    }
  }

  return { compliant: errors.length === 0, errors };
}

export function validateAssemblyCoverage(
  blueprint: CambridgeExamBlueprint,
  selections: CambridgeAssemblyPartSelection[],
  requirements: CambridgeCoverageRequirements = getCoverageRequirementsForLevel(blueprint.level)
): CoverageValidationResult {
  const meta = collectMetadata(selections);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (meta.grammarTags.length < requirements.minDistinctGrammarTags) {
    errors.push(
      `Grammar coverage: ${meta.grammarTags.length} distinct tags, need ${requirements.minDistinctGrammarTags}.`
    );
  }
  if (meta.vocabularyTopics.length < requirements.minDistinctVocabularyTopics) {
    errors.push(
      `Vocabulary coverage: ${meta.vocabularyTopics.length} distinct topics, need ${requirements.minDistinctVocabularyTopics}.`
    );
  }
  if (meta.skillsRepresented.length < requirements.minSkillsRepresented) {
    errors.push(
      `Skill coverage: ${meta.skillsRepresented.length} skills, need ${requirements.minSkillsRepresented}.`
    );
  }
  if (requirements.requireWritingTasks && meta.writingItemCount === 0) {
    errors.push("Writing tasks required but none selected.");
  }
  if (requirements.requireSpeakingTasks && meta.speakingItemCount === 0) {
    errors.push("Speaking tasks required but none selected.");
  }

  const blueprintCheck = validateBlueprintCompliance(blueprint, selections);
  errors.push(...blueprintCheck.errors);

  const policy = getDifficultyPolicyForLevel(blueprint.level);
  const autoScoredDifficulties = selections
    .filter((s) => s.item.kind === "reading" || s.item.kind === "listening")
    .map((s) => s.item.difficulty);
  const difficulty = validateDifficultyDistribution(autoScoredDifficulties, policy);
  if (selections.length !== autoScoredDifficulties.length) {
    warnings.push(
      "Difficulty distribution validated on auto-scored items only; writing/speaking excluded from band targets."
    );
  }
  errors.push(...difficulty.errors);
  warnings.push(...difficulty.warnings);

  return {
    valid: errors.length === 0,
    ...meta,
    blueprintCompliant: blueprintCheck.compliant,
    errors,
    warnings,
    difficulty,
  };
}

export function summarizeCoverageAchieved(
  selections: CambridgeAssemblyPartSelection[]
): {
  distinctGrammarPatterns: string[];
  distinctTopics: string[];
  difficultyCounts: Record<"easy" | "medium" | "hard", number>;
  skillsRepresented: string[];
} {
  const meta = collectMetadata(selections);
  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
  for (const sel of selections) {
    difficultyCounts[sel.item.difficulty] += 1;
  }
  return {
    distinctGrammarPatterns: meta.grammarTags,
    distinctTopics: meta.vocabularyTopics,
    difficultyCounts,
    skillsRepresented: meta.skillsRepresented,
  };
}
