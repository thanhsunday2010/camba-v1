import type { YleLevelSlug, YleMockBlueprint } from "@/lib/mock-blueprints/yle-mock-blueprint-types";
import {
  ALL_YLE_MOCK_BLUEPRINTS,
  YLE_MOCK_BLUEPRINT_REGISTRY,
} from "@/lib/mock-blueprints/yle-mock-blueprints";
import {
  countAutoScoredBlueprintQuestions,
  validateAllYleMockBlueprints,
  validateYleMockBlueprint,
} from "@/lib/mock-blueprints/yle-mock-validation";
import { YLE_LEVEL_METADATA } from "@/lib/mock-blueprints/yle-coverage";
import {
  YLE_MOCK_QUESTION_TYPE_REGISTRY,
  getRuntimeSupportedQuestionTypes,
} from "@/lib/mock-blueprints/yle-question-type-registry";

export function getYleMockBlueprint(level: YleLevelSlug): YleMockBlueprint {
  return YLE_MOCK_BLUEPRINT_REGISTRY[level];
}

export function listYleMockBlueprints(): YleMockBlueprint[] {
  return ALL_YLE_MOCK_BLUEPRINTS;
}

export function listYleLevelSlugs(): YleLevelSlug[] {
  return Object.keys(YLE_MOCK_BLUEPRINT_REGISTRY) as YleLevelSlug[];
}

export function getYleLevelMetadata(level: YleLevelSlug) {
  return YLE_LEVEL_METADATA[level];
}

export function getBlueprintPartBySlug(blueprint: YleMockBlueprint, partSlug: string) {
  for (const section of blueprint.sections) {
    const part = section.parts.find((p) => p.partSlug === partSlug);
    if (part) return { section, part };
  }
  return null;
}

export function getBlueprintAutoScoredQuestionCapacity(blueprint: YleMockBlueprint): number {
  return countAutoScoredBlueprintQuestions(blueprint);
}

export function getBlueprintSummary(blueprint: YleMockBlueprint) {
  const parts = blueprint.sections.flatMap((s) => s.parts);
  return {
    blueprintId: blueprint.blueprintId,
    level: blueprint.level.slug,
    sectionCount: blueprint.sections.length,
    partCount: parts.length,
    intendedQuestionCount: parts.reduce((n, p) => n + p.intendedQuestionCount, 0),
    autoScoredQuestionCapacity: countAutoScoredBlueprintQuestions(blueprint),
    supportedParts: parts.filter((p) => p.runtimeSupport === "supported").length,
    partialParts: parts.filter((p) => p.runtimeSupport === "partial").length,
    blueprintOnlyParts: parts.filter((p) => p.runtimeSupport === "blueprint_only").length,
  };
}

export {
  YLE_MOCK_QUESTION_TYPE_REGISTRY,
  getRuntimeSupportedQuestionTypes,
  validateYleMockBlueprint,
  validateAllYleMockBlueprints,
};
