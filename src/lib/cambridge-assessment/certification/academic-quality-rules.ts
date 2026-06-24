/**
 * M3.4 — Deterministic academic quality rules (no AI).
 */

import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import { getGoldMockSpecification } from "@/lib/cambridge-assessment/gold-mock-specifications";
import {
  getCoverageRequirementsForLevel,
  getDifficultyPolicyForLevel,
  validateDifficultyDistribution,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-difficulty-policy";
import { validateRuntimeManifestCompatibility } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-validation";
import type { MockCertificationIssue } from "@/lib/cambridge-assessment/certification/mock-certification-types";
import type {
  YleMockManifest,
  YleMockQuestionManifestBlock,
} from "@/lib/mock-blueprints/yle-mock-manifest-types";
import { isWritingQuestion } from "@/lib/writing/writing-utils";
import { isSpeakingQuestion } from "@/lib/speaking/speaking-utils";

export type AcademicQualityEvaluation = {
  score: number;
  issues: MockCertificationIssue[];
  grammarDistinct: number;
  vocabularyDistinct: number;
  skillDistinct: number;
  taskDistinct: number;
  topicDistinct: number;
  writingCount: number;
  speakingCount: number;
  readingCount: number;
  listeningCount: number;
  blueprintCompliant: boolean;
  difficultyBalanced: boolean;
};

function issue(
  code: string,
  path: string,
  message: string,
  category: MockCertificationIssue["category"],
  severity: "error" | "warning" = "error"
): MockCertificationIssue {
  return { code, path, message, category, severity };
}

const PLACEHOLDER_PATTERNS = [
  /^question \d+$/i,
  /^writing task:/i,
  /^speaking task:/i,
  /^choose the correct answer —/i,
  /^match the items —/i,
  /architecture validation/i,
  /placeholder/i,
  /^lorem ipsum/i,
];

function isPlaceholder(text: string): boolean {
  const t = text.trim();
  return !t || PLACEHOLDER_PATTERNS.some((p) => p.test(t));
}

function collectCoverage(questions: YleMockQuestionManifestBlock[]) {
  const grammar = new Map<string, number>();
  const vocabulary = new Map<string, number>();
  const skills = new Map<string, number>();
  const tasks = new Map<string, number>();
  const topics = new Map<string, number>();

  let writingCount = 0;
  let speakingCount = 0;
  let readingCount = 0;
  let listeningCount = 0;

  for (const q of questions) {
    for (const tag of q.grammarTags ?? []) grammar.set(tag, (grammar.get(tag) ?? 0) + 1);
    for (const topic of q.vocabularyTopics ?? []) {
      vocabulary.set(topic, (vocabulary.get(topic) ?? 0) + 1);
    }
    if (q.skillTag) skills.set(q.skillTag, (skills.get(q.skillTag) ?? 0) + 1);
    if (q.blueprintQuestionType) tasks.set(q.blueprintQuestionType, (tasks.get(q.blueprintQuestionType) ?? 0) + 1);
    if (q.topicTag) topics.set(q.topicTag, (topics.get(q.topicTag) ?? 0) + 1);

    const skill = (q.skillTag ?? q.sectionSlug ?? "").toLowerCase();
    if (q.cambaQuestionType === "writing") writingCount += 1;
    else if (q.cambaQuestionType === "speaking") speakingCount += 1;
    else if (skill.includes("listen")) listeningCount += 1;
    else readingCount += 1;
  }

  return {
    grammarDistinct: grammar.size,
    vocabularyDistinct: vocabulary.size,
    skillDistinct: skills.size,
    taskDistinct: tasks.size,
    topicDistinct: topics.size,
    writingCount,
    speakingCount,
    readingCount,
    listeningCount,
    vocabulary,
  };
}

export function evaluateBlueprintFidelity(
  level: CambridgeExamLevel,
  questions: YleMockQuestionManifestBlock[]
): { compliant: boolean; score: number; issues: MockCertificationIssue[] } {
  const blueprint = getCambridgeExamBlueprint(level);
  const issues: MockCertificationIssue[] = [];
  const byPart = new Map<string, YleMockQuestionManifestBlock[]>();

  for (const q of questions) {
    const list = byPart.get(q.partSlug) ?? [];
    list.push(q);
    byPart.set(q.partSlug, list);
  }

  let partsChecked = 0;
  let partsMatched = 0;

  for (const paper of blueprint.papers) {
    for (const part of paper.parts) {
      partsChecked += 1;
      const selected = byPart.get(part.partSlug) ?? [];
      if (selected.length !== part.questionCount) {
        issues.push(
          issue(
            "BLUEPRINT_PART_COUNT",
            `parts.${part.partSlug}`,
            `Expected ${part.questionCount} items, found ${selected.length}.`,
            "blueprint"
          )
        );
      } else {
        partsMatched += 1;
      }

      const paperMinutes = paper.totalMinutes;
      if (paperMinutes <= 0) {
        issues.push(
          issue("BLUEPRINT_TIMING", `papers.${paper.paperSlug}`, "Paper timing invalid.", "blueprint", "warning")
        );
      }
      if (paper.weightPercent <= 0) {
        issues.push(
          issue("BLUEPRINT_WEIGHT", `papers.${paper.paperSlug}`, "Paper weight invalid.", "blueprint", "warning")
        );
      }
    }
  }

  const compliant = issues.filter((i) => i.severity === "error").length === 0;
  const score = partsChecked === 0 ? 0 : Math.round((partsMatched / partsChecked) * 100);
  return { compliant, score, issues };
}

export function evaluateStudentSafety(
  runtime: YleMockManifest
): { safe: boolean; issues: MockCertificationIssue[] } {
  const issues: MockCertificationIssue[] = [];

  for (const q of runtime.questions) {
    if (isPlaceholder(q.questionText)) {
      issues.push(
        issue(
          "MALFORMED_PROMPT",
          `questions.${q.questionRef}`,
          "Question stem is empty or placeholder.",
          "safety"
        )
      );
    }

    const content = q.content ?? {};
    if (q.cambaQuestionType === "reading_comprehension") {
      const passage = typeof content.passage === "string" ? content.passage.trim() : "";
      if (!passage) {
        issues.push(
          issue(
            "EMPTY_PASSAGE",
            `questions.${q.questionRef}.content.passage`,
            "Reading comprehension missing passage.",
            "safety"
          )
        );
      }
    }

    if (q.cambaQuestionType === "gap_fill" || q.cambaQuestionType === "listening") {
      const template = typeof content.template === "string" ? content.template.trim() : "";
      const answers = Array.isArray(content.correctAnswers) ? content.correctAnswers : [];
      if (template && answers.length === 0) {
        issues.push(
          issue(
            "MISSING_ANSWER_KEY",
            `questions.${q.questionRef}.content.correctAnswers`,
            "Gap-fill/listening item missing answer key.",
            "safety"
          )
        );
      }
    }

    if (Array.isArray(q.choices) && q.choices.length > 0) {
      const hasCorrect = q.choices.some((c) => c.isCorrect);
      if (!hasCorrect) {
        issues.push(
          issue(
            "MISSING_ANSWER_KEY",
            `questions.${q.questionRef}.choices`,
            "MCQ item has no correct answer marked.",
            "safety"
          )
        );
      }
    }

    const audioUrl =
      (typeof content.audioUrl === "string" && content.audioUrl) ||
      (typeof content.audio === "object" &&
        content.audio !== null &&
        typeof (content.audio as { src?: string }).src === "string" &&
        (content.audio as { src: string }).src) ||
      "";
    if (
      (q.cambaQuestionType === "listening" || q.sectionSlug?.includes("listen")) &&
      audioUrl &&
      audioUrl.includes("undefined")
    ) {
      issues.push(
        issue(
          "INVALID_MEDIA",
          `questions.${q.questionRef}.content.audioUrl`,
          "Invalid audio reference.",
          "safety"
        )
      );
    }
  }

  const runtimeCheck = validateRuntimeManifestCompatibility(runtime);
  for (const i of runtimeCheck.issues.filter((x) => x.severity === "error")) {
    issues.push(
      issue(`RUNTIME_${i.code}`, i.path, i.message, i.code.includes("WRITING") || i.code.includes("SPEAKING") ? "quality" : "safety")
    );
  }

  return { safe: issues.filter((i) => i.severity === "error").length === 0, issues };
}

export function evaluateWritingQuality(
  level: CambridgeExamLevel,
  questions: YleMockQuestionManifestBlock[]
): { score: number; issues: MockCertificationIssue[]; count: number } {
  const writing = questions.filter((q) => q.cambaQuestionType === "writing");
  const issues: MockCertificationIssue[] = [];
  const spec = getGoldMockSpecification(level);

  if (writing.length === 0) {
    issues.push(issue("NO_WRITING", "questions", "Writing section required.", "writing"));
    return { score: 0, issues, count: 0 };
  }

  let points = 0;
  const max = writing.length * 5;

  for (const q of writing) {
    const content = q.content ?? {};
    const pseudo = {
      question_type: q.cambaQuestionType,
      question_text: q.questionText,
      content,
      media_url: null,
    };

    if (!isWritingQuestion(pseudo)) {
      issues.push(
        issue("WRITING_SHAPE", `questions.${q.questionRef}`, "Not M2.2-compatible.", "writing")
      );
      continue;
    }

    if (isPlaceholder(String(content.prompt ?? q.questionText))) {
      issues.push(
        issue("WRITING_PLACEHOLDER", `questions.${q.questionRef}`, "Writing prompt is placeholder.", "writing")
      );
    } else points += 1;

    if (typeof content.rubricId === "string" && content.rubricId.trim()) points += 1;
    else issues.push(issue("WRITING_RUBRIC", `questions.${q.questionRef}`, "Missing rubricId.", "writing", "warning"));

    const minWords = typeof content.minWords === "number" ? content.minWords : null;
    const maxWords = typeof content.maxWords === "number" ? content.maxWords : null;
    if (minWords != null && maxWords != null && minWords < maxWords) points += 1;
    else if (level === "ket" || level === "pet") {
      issues.push(
        issue("WRITING_WORD_RANGE", `questions.${q.questionRef}`, "Word range required for KET/PET.", "writing", "warning")
      );
    } else points += 1;

    if (typeof content.cambridgeTaskType === "string" || typeof content.writingTaskType === "string") {
      points += 1;
    } else {
      issues.push(issue("WRITING_TASK_TYPE", `questions.${q.questionRef}`, "Missing task type.", "writing", "warning"));
    }

    if (typeof content.prompt === "string" && content.prompt.length >= 20) points += 1;
    else issues.push(issue("WRITING_PROMPT_SHORT", `questions.${q.questionRef}`, "Prompt too short.", "writing", "warning"));
  }

  void spec;
  return {
    score: max === 0 ? 0 : Math.round((points / max) * 100),
    issues,
    count: writing.length,
  };
}

export function evaluateSpeakingQuality(
  level: CambridgeExamLevel,
  questions: YleMockQuestionManifestBlock[]
): { score: number; issues: MockCertificationIssue[]; count: number } {
  const speaking = questions.filter((q) => q.cambaQuestionType === "speaking");
  const issues: MockCertificationIssue[] = [];

  if (speaking.length === 0) {
    issues.push(issue("NO_SPEAKING", "questions", "Speaking section required.", "speaking"));
    return { score: 0, issues, count: 0 };
  }

  let points = 0;
  const max = speaking.length * 5;

  for (const q of speaking) {
    const content = q.content ?? {};
    const pseudo = {
      question_type: q.cambaQuestionType,
      question_text: q.questionText,
      content,
      media_url: null,
    };

    if (!isSpeakingQuestion(pseudo)) {
      issues.push(
        issue("SPEAKING_SHAPE", `questions.${q.questionRef}`, "Not M2.3-compatible.", "speaking")
      );
      continue;
    }

    if (isPlaceholder(String(content.prompt ?? q.questionText))) {
      issues.push(
        issue("SPEAKING_PLACEHOLDER", `questions.${q.questionRef}`, "Speaking prompt is placeholder.", "speaking")
      );
    } else points += 1;

    if (typeof content.rubricId === "string" && content.rubricId.trim()) points += 1;
    else issues.push(issue("SPEAKING_RUBRIC", `questions.${q.questionRef}`, "Missing rubricId.", "speaking", "warning"));

    const duration =
      typeof content.maxDurationSeconds === "number" ? content.maxDurationSeconds : 0;
    if (duration > 0) points += 1;
    else issues.push(issue("SPEAKING_DURATION", `questions.${q.questionRef}`, "Missing duration.", "speaking", "warning"));

    if (typeof content.cambridgeTaskType === "string" || typeof content.speakingTaskType === "string") {
      points += 1;
    } else {
      issues.push(issue("SPEAKING_TASK_TYPE", `questions.${q.questionRef}`, "Missing task type.", "speaking", "warning"));
    }

    if (typeof content.prompt === "string" && content.prompt.length >= 15) points += 1;
    else issues.push(issue("SPEAKING_PROMPT_SHORT", `questions.${q.questionRef}`, "Prompt too short.", "speaking", "warning"));
  }

  void level;
  return {
    score: max === 0 ? 0 : Math.round((points / max) * 100),
    issues,
    count: speaking.length,
  };
}

export function evaluateReadingQuality(
  questions: YleMockQuestionManifestBlock[]
): { score: number; issues: MockCertificationIssue[] } {
  const reading = questions.filter(
    (q) =>
      q.cambaQuestionType === "reading_comprehension" ||
      q.cambaQuestionType === "matching" ||
      q.cambaQuestionType === "gap_fill" ||
      (q.skillTag ?? "").includes("read") ||
      q.sectionSlug?.includes("read")
  );
  const issues: MockCertificationIssue[] = [];
  if (reading.length === 0) {
    issues.push(issue("NO_READING", "questions", "No reading items found.", "reading", "warning"));
    return { score: 50, issues };
  }

  let points = 0;
  for (const q of reading) {
    if (!isPlaceholder(q.questionText)) points += 1;
    if (q.cambaQuestionType === "reading_comprehension") {
      const passage = (q.content?.passage as string | undefined) ?? "";
      if (passage.trim().length >= 40) points += 1;
      else issues.push(issue("READING_PASSAGE_SHORT", `questions.${q.questionRef}`, "Passage too short.", "reading", "warning"));
    } else points += 1;
  }

  return { score: Math.round((points / (reading.length * 2)) * 100), issues };
}

export function evaluateListeningQuality(
  questions: YleMockQuestionManifestBlock[]
): { score: number; issues: MockCertificationIssue[] } {
  const listening = questions.filter(
    (q) =>
      q.cambaQuestionType === "listening" ||
      (q.skillTag ?? "").includes("listen") ||
      q.sectionSlug?.includes("listen")
  );
  const issues: MockCertificationIssue[] = [];
  if (listening.length === 0) {
    issues.push(issue("NO_LISTENING", "questions", "No listening items found.", "listening", "warning"));
    return { score: 50, issues };
  }

  let points = 0;
  for (const q of listening) {
    if (!isPlaceholder(q.questionText)) points += 1;
    const content = q.content ?? {};
    if (typeof content.transcriptSnippet === "string" || typeof content.transcript === "string") {
      points += 1;
    } else {
      issues.push(
        issue("LISTENING_NO_TRANSCRIPT", `questions.${q.questionRef}`, "Missing transcript for QA.", "listening", "warning")
      );
    }
  }

  return { score: Math.round((points / (listening.length * 2)) * 100), issues };
}

/** Full deterministic academic quality evaluation. */
export function evaluateAcademicQuality(
  level: CambridgeExamLevel,
  runtime: YleMockManifest
): AcademicQualityEvaluation {
  const questions = runtime.questions;
  const issues: MockCertificationIssue[] = [];
  const coverage = collectCoverage(questions);
  const requirements = getCoverageRequirementsForLevel(level);
  const spec = getGoldMockSpecification(level);

  if (coverage.grammarDistinct < requirements.minDistinctGrammarTags) {
    issues.push(
      issue(
        "GRAMMAR_COVERAGE",
        "coverage.grammar",
        `Need ${requirements.minDistinctGrammarTags} grammar tags, have ${coverage.grammarDistinct}.`,
        "coverage"
      )
    );
  }
  if (coverage.vocabularyDistinct < requirements.minDistinctVocabularyTopics) {
    issues.push(
      issue(
        "VOCAB_COVERAGE",
        "coverage.vocabulary",
        `Need ${requirements.minDistinctVocabularyTopics} vocabulary topics, have ${coverage.vocabularyDistinct}.`,
        "coverage"
      )
    );
  }
  if (coverage.skillDistinct < requirements.minSkillsRepresented) {
    issues.push(
      issue(
        "SKILL_COVERAGE",
        "coverage.skills",
        `Need ${requirements.minSkillsRepresented} skills, have ${coverage.skillDistinct}.`,
        "coverage"
      )
    );
  }

  const total = questions.length || 1;
  for (const [topic, count] of coverage.vocabulary) {
    if (count / total > spec.coverageTargets.maxTopicShare) {
      issues.push(
        issue(
          "TOPIC_OVER_REPRESENTED",
          `coverage.vocabulary.${topic}`,
          `Topic "${topic}" exceeds max share.`,
          "coverage",
          "warning"
        )
      );
    }
  }

  const blueprint = evaluateBlueprintFidelity(level, questions);
  issues.push(...blueprint.issues);

  const autoDifficulties = questions
    .filter((q) => q.cambaQuestionType !== "writing" && q.cambaQuestionType !== "speaking")
    .map((q) => q.difficulty);
  const policy = getDifficultyPolicyForLevel(level);
  const diffResult = validateDifficultyDistribution(autoDifficulties, policy);
  for (const err of diffResult.errors) {
    issues.push(issue("DIFFICULTY", "coverage.difficulty", err, "coverage", "warning"));
  }

  const writing = evaluateWritingQuality(level, questions);
  const speaking = evaluateSpeakingQuality(level, questions);
  const reading = evaluateReadingQuality(questions);
  const listening = evaluateListeningQuality(questions);
  issues.push(...writing.issues, ...speaking.issues, ...reading.issues, ...listening.issues);

  const difficultyBands = new Set(questions.map((q) => q.difficulty)).size;

  const coverageScore = Math.min(
    100,
    Math.round(
      (Math.min(coverage.grammarDistinct / requirements.minDistinctGrammarTags, 1) * 25 +
        Math.min(coverage.vocabularyDistinct / requirements.minDistinctVocabularyTopics, 1) * 25 +
        Math.min(coverage.skillDistinct / requirements.minSkillsRepresented, 1) * 20 +
        Math.min(coverage.taskDistinct / 6, 1) * 15 +
        Math.min(difficultyBands / 3, 1) * 15) *
        100 /
        100
    )
  );

  const qaScore = Math.round(
    (writing.score + speaking.score + reading.score + listening.score + blueprint.score) / 5
  );

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const score = Math.max(0, Math.min(100, Math.round((coverageScore + qaScore) / 2 - errorCount * 5)));

  return {
    score,
    issues,
    grammarDistinct: coverage.grammarDistinct,
    vocabularyDistinct: coverage.vocabularyDistinct,
    skillDistinct: coverage.skillDistinct,
    taskDistinct: coverage.taskDistinct,
    topicDistinct: coverage.topicDistinct,
    writingCount: coverage.writingCount,
    speakingCount: coverage.speakingCount,
    readingCount: coverage.readingCount,
    listeningCount: coverage.listeningCount,
    blueprintCompliant: blueprint.compliant,
    difficultyBalanced: diffResult.valid,
  };
}
