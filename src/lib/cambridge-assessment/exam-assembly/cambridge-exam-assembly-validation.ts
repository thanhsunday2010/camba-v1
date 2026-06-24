import type { CambridgeExamAssemblyResult } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
import type { CambridgeExamManifest } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-manifest-types";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import { isWritingQuestion } from "@/lib/writing/writing-utils";
import { isSpeakingQuestion } from "@/lib/speaking/speaking-utils";

export type AssemblyValidationIssue = {
  code: string;
  path: string;
  message: string;
  severity: "error" | "warning";
};

export type AssemblyValidationResult = {
  valid: boolean;
  issues: AssemblyValidationIssue[];
};

function issue(
  code: string,
  path: string,
  message: string,
  severity: "error" | "warning" = "error"
): AssemblyValidationIssue {
  return { code, path, message, severity };
}

export function validateCambridgeExamManifest(
  manifest: CambridgeExamManifest
): AssemblyValidationResult {
  const issues: AssemblyValidationIssue[] = [];

  if (!manifest.metadata?.manifestId) {
    issues.push(issue("NO_MANIFEST_ID", "metadata.manifestId", "manifestId is required."));
  }
  if (!manifest.metadata?.blueprintId) {
    issues.push(issue("NO_BLUEPRINT", "metadata.blueprintId", "blueprintId is required."));
  }
  if (manifest.itemReferences.length === 0) {
    issues.push(issue("NO_ITEMS", "itemReferences", "At least one item reference is required."));
  }

  const refIds = new Set<string>();
  for (const ref of manifest.itemReferences) {
    if (refIds.has(ref.itemId)) {
      issues.push(
        issue("DUPLICATE_REF", `itemReferences.${ref.itemId}`, "Duplicate item reference.")
      );
    }
    refIds.add(ref.itemId);
  }

  for (const paper of manifest.papers) {
    for (const part of paper.parts) {
      if (part.itemReferences.length !== part.questionCount) {
        issues.push(
          issue(
            "PART_COUNT_MISMATCH",
            `papers.${paper.paperSlug}.parts.${part.partSlug}`,
            `Expected ${part.questionCount} references, got ${part.itemReferences.length}.`
          )
        );
      }
    }
  }

  return { valid: issues.filter((i) => i.severity === "error").length === 0, issues };
}

export function validateRuntimeManifestCompatibility(
  runtime: YleMockManifest
): AssemblyValidationResult {
  const issues: AssemblyValidationIssue[] = [];

  if (!runtime.metadata?.levelSlug) {
    issues.push(issue("NO_LEVEL", "metadata.levelSlug", "levelSlug is required."));
  }
  if (runtime.questions.length === 0) {
    issues.push(issue("NO_QUESTIONS", "questions", "Runtime manifest needs questions."));
  }

  const writingQuestions = runtime.questions.filter(
    (q) => q.cambaQuestionType === "writing"
  );
  const speakingQuestions = runtime.questions.filter(
    (q) => q.cambaQuestionType === "speaking"
  );

  if (writingQuestions.length === 0) {
    issues.push(issue("NO_WRITING", "questions", "Writing tasks are required.", "error"));
  }
  if (speakingQuestions.length === 0) {
    issues.push(issue("NO_SPEAKING", "questions", "Speaking tasks are required.", "error"));
  }

  for (const q of writingQuestions) {
    const pseudo = {
      question_type: q.cambaQuestionType,
      question_text: q.questionText,
      content: q.content ?? {},
      media_url: null,
    };
    if (!isWritingQuestion(pseudo)) {
      issues.push(
        issue(
          "WRITING_SHAPE",
          `questions.${q.questionRef}`,
          "Writing question missing M2.2-compatible content shape."
        )
      );
    }
  }

  for (const q of speakingQuestions) {
    const pseudo = {
      question_type: q.cambaQuestionType,
      question_text: q.questionText,
      content: q.content ?? {},
      media_url: null,
    };
    if (!isSpeakingQuestion(pseudo)) {
      issues.push(
        issue(
          "SPEAKING_SHAPE",
          `questions.${q.questionRef}`,
          "Speaking question missing M2.3-compatible content shape."
        )
      );
    }
  }

  let pointsSum = 0;
  for (const q of runtime.questions) pointsSum += q.points ?? 0;
  if (runtime.metadata.totalScore !== pointsSum) {
    issues.push(
      issue(
        "SCORE_MISMATCH",
        "metadata.totalScore",
        `totalScore ${runtime.metadata.totalScore} !== points sum ${pointsSum}.`
      )
    );
  }

  return { valid: issues.filter((i) => i.severity === "error").length === 0, issues };
}

export function validateAssemblyResult(
  result: CambridgeExamAssemblyResult
): AssemblyValidationResult {
  if (!result.success) {
    return {
      valid: false,
      issues: result.errors.map((message) =>
        issue("ASSEMBLY_FAILED", "assembly", message)
      ),
    };
  }

  const manifestValidation = validateCambridgeExamManifest(result.manifest);
  const runtimeValidation = validateRuntimeManifestCompatibility(result.runtimeManifest);

  return {
    valid: manifestValidation.valid && runtimeValidation.valid && result.report.valid,
    issues: [...manifestValidation.issues, ...runtimeValidation.issues],
  };
}
