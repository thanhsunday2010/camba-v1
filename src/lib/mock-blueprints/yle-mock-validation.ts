import type {
  YleBlueprintQuestionTypeKey,
  YleMockBlueprint,
  YleMockPartBlueprint,
  YleMockValidationIssue,
  YleMockValidationResult,
} from "@/lib/mock-blueprints/yle-mock-blueprint-types";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import { analyzeMockManifestQuality } from "@/lib/mock-tests/mock-manifest-quality";
import { analyzeQuestionIntelligenceMetadata } from "@/lib/learning/question-metadata-validation";
import {
  YLE_MOCK_QUESTION_TYPE_REGISTRY,
  resolveCambaQuestionType,
} from "@/lib/mock-blueprints/yle-question-type-registry";
import { YLE_MOCK_BLUEPRINT_REGISTRY } from "@/lib/mock-blueprints/yle-mock-blueprints";

function issue(
  code: string,
  severity: YleMockValidationIssue["severity"],
  path: string,
  message: string
): YleMockValidationIssue {
  return { code, severity, path, message };
}

function result(issues: YleMockValidationIssue[]): YleMockValidationResult {
  const errors = issues.filter((i) => i.severity === "error");
  return { valid: errors.length === 0, issues };
}

export function validateYleMockBlueprint(blueprint: YleMockBlueprint): YleMockValidationResult {
  const issues: YleMockValidationIssue[] = [];

  if (!blueprint.blueprintId) {
    issues.push(issue("BLUEPRINT_ID_MISSING", "error", "blueprintId", "Blueprint ID is required."));
  }

  if (blueprint.sections.length === 0) {
    issues.push(
      issue("NO_SECTIONS", "error", "sections", "Blueprint must define at least one section.")
    );
  }

  const sectionOrders = new Set<number>();
  for (const section of blueprint.sections) {
    if (sectionOrders.has(section.displayOrder)) {
      issues.push(
        issue(
          "DUPLICATE_SECTION_ORDER",
          "error",
          `sections.${section.sectionSlug}.displayOrder`,
          `Duplicate section displayOrder: ${section.displayOrder}`
        )
      );
    }
    sectionOrders.add(section.displayOrder);

    if (section.parts.length === 0) {
      issues.push(
        issue(
          "EMPTY_SECTION",
          "warning",
          `sections.${section.sectionSlug}`,
          "Section has no parts defined."
        )
      );
    }

    const partOrders = new Set<number>();
    for (const part of section.parts) {
      validatePart(part, `sections.${section.sectionSlug}.parts.${part.partSlug}`, issues);
      if (partOrders.has(part.displayOrder)) {
        issues.push(
          issue(
            "DUPLICATE_PART_ORDER",
            "error",
            `sections.${section.sectionSlug}.parts.${part.partSlug}.displayOrder`,
            `Duplicate part displayOrder: ${part.displayOrder}`
          )
        );
      }
      partOrders.add(part.displayOrder);
    }
  }

  const policy = blueprint.difficultyPolicy.distribution;
  const policySum = Object.values(policy).reduce((a, b) => a + (b ?? 0), 0);
  if (policySum > 0 && Math.abs(policySum - 1) > 0.01) {
    issues.push(
      issue(
        "DIFFICULTY_SUM",
        "warning",
        "difficultyPolicy.distribution",
        `Difficulty distribution sums to ${policySum.toFixed(2)}, expected ~1.0.`
      )
    );
  }

  return result(issues);
}

function validatePart(
  part: YleMockPartBlueprint,
  path: string,
  issues: YleMockValidationIssue[]
): void {
  if (part.intendedQuestionCount < 0) {
    issues.push(issue("NEGATIVE_COUNT", "error", `${path}.intendedQuestionCount`, "Cannot be negative."));
  }

  if (part.defaultPointsPerQuestion < 0) {
    issues.push(
      issue("NEGATIVE_POINTS", "error", `${path}.defaultPointsPerQuestion`, "Cannot be negative.")
    );
  }

  if (part.allowedQuestionTypeKeys.length === 0) {
    issues.push(
      issue("NO_QUESTION_TYPES", "error", `${path}.allowedQuestionTypeKeys`, "Part must allow at least one question type.")
    );
  }

  for (const key of part.allowedQuestionTypeKeys) {
    if (!YLE_MOCK_QUESTION_TYPE_REGISTRY[key]) {
      issues.push(
        issue("UNKNOWN_QUESTION_TYPE", "error", `${path}.allowedQuestionTypeKeys`, `Unknown type key: ${key}`)
      );
    }
  }

  if (part.mediaExpectations.audio && part.runtimeSupport === "supported") {
    const hasListeningType = part.allowedQuestionTypeKeys.some(
      (k) => YLE_MOCK_QUESTION_TYPE_REGISTRY[k].mediaRequirements.audio
    );
    if (!hasListeningType) {
      issues.push(
        issue(
          "AUDIO_TYPE_MISMATCH",
          "warning",
          path,
          "Part expects audio but no allowed type requires audio."
        )
      );
    }
  }
}

export function validateAllYleMockBlueprints(): YleMockValidationResult {
  const issues: YleMockValidationIssue[] = [];
  for (const blueprint of Object.values(YLE_MOCK_BLUEPRINT_REGISTRY)) {
    const r = validateYleMockBlueprint(blueprint);
    for (const i of r.issues) {
      issues.push({ ...i, path: `${blueprint.blueprintId}.${i.path}` });
    }
  }
  return result(issues);
}

export function validateYleMockManifest(
  manifest: YleMockManifest,
  blueprint?: YleMockBlueprint
): YleMockValidationResult {
  const issues: YleMockValidationIssue[] = [];
  const bp =
    blueprint ??
    YLE_MOCK_BLUEPRINT_REGISTRY[manifest.metadata.levelSlug] ??
    null;

  if (!bp) {
    issues.push(
      issue(
        "BLUEPRINT_NOT_FOUND",
        "error",
        "metadata.levelSlug",
        `No blueprint for level: ${manifest.metadata.levelSlug}`
      )
    );
    return result(issues);
  }

  if (manifest.metadata.blueprintId !== bp.blueprintId) {
    issues.push(
      issue(
        "BLUEPRINT_ID_MISMATCH",
        "error",
        "metadata.blueprintId",
        `Expected ${bp.blueprintId}, got ${manifest.metadata.blueprintId}`
      )
    );
  }

  if (manifest.questions.length === 0) {
    issues.push(issue("NO_QUESTIONS", "error", "questions", "Manifest must include questions."));
  }

  const expectedQuestions = countAutoScoredBlueprintQuestions(bp);
  if (manifest.questions.length > expectedQuestions) {
    issues.push(
      issue(
        "QUESTION_COUNT_HIGH",
        "warning",
        "questions",
        `Manifest has ${manifest.questions.length} questions; blueprint auto-scored capacity is ~${expectedQuestions}.`
      )
    );
  }

  let pointsSum = 0;
  const sectionSlugs = new Set(manifest.sections.map((s) => s.sectionSlug));
  const partSlugs = new Set(
    bp.sections.flatMap((s) => s.parts.map((p) => p.partSlug))
  );

  for (const q of manifest.questions) {
    pointsSum += q.points;

    if (!sectionSlugs.has(q.sectionSlug)) {
      issues.push(
        issue(
          "UNKNOWN_SECTION",
          "error",
          `questions.${q.questionRef}.sectionSlug`,
          `Section not in manifest: ${q.sectionSlug}`
        )
      );
    }

    if (!partSlugs.has(q.partSlug)) {
      issues.push(
        issue(
          "UNKNOWN_PART",
          "error",
          `questions.${q.questionRef}.partSlug`,
          `Part not in blueprint: ${q.partSlug}`
        )
      );
    }

    const part = findPart(bp, q.partSlug);
    if (part && !part.allowedQuestionTypeKeys.includes(q.blueprintQuestionType)) {
      issues.push(
        issue(
          "TYPE_NOT_ALLOWED",
          "error",
          `questions.${q.questionRef}.blueprintQuestionType`,
          `Type ${q.blueprintQuestionType} not allowed in part ${q.partSlug}`
        )
      );
    }

    const registry = YLE_MOCK_QUESTION_TYPE_REGISTRY[q.blueprintQuestionType];
    if (registry?.runtimeSupport === "blueprint_only") {
      issues.push(
        issue(
          "BLUEPRINT_ONLY_TYPE",
          "error",
          `questions.${q.questionRef}`,
          `Question type ${q.blueprintQuestionType} is not runtime-supported.`
        )
      );
    }

    const resolved = resolveCambaQuestionType(q.blueprintQuestionType);
    if (resolved && q.cambaQuestionType !== resolved) {
      issues.push(
        issue(
          "CAMBA_TYPE_MISMATCH",
          "error",
          `questions.${q.questionRef}.cambaQuestionType`,
          `Expected ${resolved}, got ${q.cambaQuestionType}`
        )
      );
    }
  }

  if (manifest.metadata.totalScore !== pointsSum) {
    issues.push(
      issue(
        "SCORE_MISMATCH",
        "error",
        "metadata.totalScore",
        `totalScore is ${manifest.metadata.totalScore} but question points sum to ${pointsSum}`
      )
    );
  }

  for (const section of manifest.sections) {
    const refs = section.questionRefs;
    const missing = refs.filter((ref) => !manifest.questions.some((q) => q.questionRef === ref));
    if (missing.length > 0) {
      issues.push(
        issue(
          "MISSING_QUESTION_REFS",
          "error",
          `sections.${section.sectionSlug}.questionRefs`,
          `Missing question blocks: ${missing.join(", ")}`
        )
      );
    }
  }

  validateManifestParts(manifest, issues);

  return result(issues);
}

function validateManifestParts(
  manifest: YleMockManifest,
  issues: YleMockValidationIssue[]
): void {
  if (!manifest.parts?.length) return;

  const sectionSlugs = new Set(manifest.sections.map((s) => s.sectionSlug));
  const questionRefs = new Set(manifest.questions.map((q) => q.questionRef));

  for (const part of manifest.parts) {
    const path = `parts.${part.partSlug}`;

    if (!sectionSlugs.has(part.sectionSlug)) {
      issues.push(
        issue(
          "UNKNOWN_PART_SECTION",
          "error",
          `${path}.sectionSlug`,
          `Section not in manifest: ${part.sectionSlug}`
        )
      );
    }

    if (part.audio) {
      if (!part.audio.src?.trim()) {
        issues.push(
          issue("INVALID_AUDIO", "error", `${path}.audio.src`, "Audio src is required when audio is set.")
        );
      }
    }

    if (part.passage && !part.passage.text?.trim()) {
      issues.push(
        issue("INVALID_PASSAGE", "error", `${path}.passage.text`, "Passage text is required when passage is set.")
      );
    }

    for (const ref of part.questionRefs ?? []) {
      if (!questionRefs.has(ref)) {
        issues.push(
          issue(
            "UNKNOWN_PART_QUESTION_REF",
            "error",
            `${path}.questionRefs`,
            `Unknown questionRef: ${ref}`
          )
        );
      }
    }
  }
}

/** Stricter validation before DB seed — payload completeness + seed IDs. */
export function validateYleMockManifestForSeeding(
  manifest: YleMockManifest,
  blueprint?: YleMockBlueprint
): YleMockValidationResult {
  const base = validateYleMockManifest(manifest, blueprint);
  const issues = [...base.issues];

  if (!manifest.metadata.seedIds?.mockTestId) {
    issues.push(
      issue("NO_SEED_IDS", "error", "metadata.seedIds", "seedIds.mockTestId is required for import.")
    );
  }

  const refs = new Set<string>();
  for (const q of manifest.questions) {
    if (refs.has(q.questionRef)) {
      issues.push(
        issue("DUPLICATE_REF", "error", `questions.${q.questionRef}`, "Duplicate questionRef.")
      );
    }
    refs.add(q.questionRef);

    validateQuestionPayloadForSeeding(q, issues);
  }

  const topics = new Set(
    manifest.questions.map((q) => q.topicTag).filter((t): t is string => Boolean(t))
  );
  if (topics.size < 5) {
    issues.push(
      issue(
        "LOW_TOPIC_COVERAGE",
        "warning",
        "coverage",
        `Only ${topics.size} distinct topics — Starters practice mocks target ≥5.`
      )
    );
  }

  issues.push(...analyzeMockManifestQuality(manifest));
  issues.push(...analyzeQuestionIntelligenceMetadata(manifest));

  return result(issues);
}

function validateQuestionPayloadForSeeding(
  q: YleMockManifest["questions"][number],
  issues: YleMockValidationIssue[]
): void {
  const type = q.cambaQuestionType;

  if (
    type === "multiple_choice" ||
    type === "reading_comprehension" ||
    type === "image_selection" ||
    type === "listening"
  ) {
    if (!q.choices?.length) {
      issues.push(
        issue("MISSING_CHOICES", "error", `questions.${q.questionRef}`, "MCQ requires choices.")
      );
      return;
    }
    const correct = q.choices.filter((c) => c.isCorrect);
    if (correct.length !== 1) {
      issues.push(
        issue(
          "MCQ_CORRECT_COUNT",
          "error",
          `questions.${q.questionRef}`,
          "MCQ must have exactly one correct choice."
        )
      );
    }
  }

  if (type === "matching" || type === "drag_drop") {
    if (!q.pairs?.length) {
      issues.push(
        issue("MISSING_PAIRS", "error", `questions.${q.questionRef}`, "Matching requires pairs.")
      );
    }
  }

  if (type === "gap_fill") {
    const template = q.content?.template as string | undefined;
    const correctAnswers = q.content?.correctAnswers as string[] | undefined;
    if (!template || !correctAnswers?.length) {
      issues.push(
        issue(
          "MISSING_GAP_CONTENT",
          "error",
          `questions.${q.questionRef}`,
          "gap_fill requires content.template and content.correctAnswers."
        )
      );
    }
  }
}

function findPart(blueprint: YleMockBlueprint, partSlug: string): YleMockPartBlueprint | null {
  for (const section of blueprint.sections) {
    const part = section.parts.find((p) => p.partSlug === partSlug);
    if (part) return part;
  }
  return null;
}

/** Count questions in parts that are supported or partial (excludes speaking + blueprint_only parts). */
export function countAutoScoredBlueprintQuestions(blueprint: YleMockBlueprint): number {
  return blueprint.sections
    .flatMap((s) => s.parts)
    .filter((p) => p.runtimeSupport !== "blueprint_only" && p.skillCategory !== "speaking")
    .reduce((sum, p) => sum + p.intendedQuestionCount, 0);
}

export function isQuestionTypeAllowedInPart(
  part: YleMockPartBlueprint,
  typeKey: YleBlueprintQuestionTypeKey
): boolean {
  return part.allowedQuestionTypeKeys.includes(typeKey);
}
