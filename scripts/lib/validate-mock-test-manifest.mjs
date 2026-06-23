/**
 * Node-side manifest validation for seed pipeline.
 * Mirrors critical checks from src/lib/mock-blueprints/yle-mock-validation.ts
 */

const RUNTIME_SEED_ALLOWED_SUPPORT = new Set(["supported", "partial"]);

const BLUEPRINT_ONLY_TYPES = new Set([
  "writing_copy",
  "writing_message",
  "speaking_picture_story",
  "speaking_interview",
]);

const CAMBA_TYPE_MAP = {
  mcq_single: "multiple_choice",
  mcq_image: "image_selection",
  mcq_listening: "listening",
  reading_comprehension: "reading_comprehension",
  multi_select: "multi_select",
  matching: "matching",
  drag_drop: "drag_drop",
  gap_fill: "gap_fill",
  sentence_ordering: "sentence_ordering",
  form_completion: "gap_fill",
};

export function validateManifestForSeeding(manifest) {
  const issues = [];

  function error(code, path, message) {
    issues.push({ code, severity: "error", path, message });
  }

  function warn(code, path, message) {
    issues.push({ code, severity: "warning", path, message });
  }

  if (!manifest?.metadata) {
    error("NO_METADATA", "metadata", "Manifest metadata is required.");
    return { valid: false, issues };
  }

  const { metadata, sections = [], questions = [] } = manifest;

  if (!metadata.levelSlug) {
    error("NO_LEVEL", "metadata.levelSlug", "levelSlug is required.");
  }

  if (!metadata.seedIds?.mockTestId) {
    error("NO_SEED_IDS", "metadata.seedIds", "seedIds.mockTestId is required for import.");
  }

  if (questions.length === 0) {
    error("NO_QUESTIONS", "questions", "At least one question is required.");
  }

  const refs = new Set();
  let pointsSum = 0;
  const topics = new Set();

  for (const q of questions) {
    if (refs.has(q.questionRef)) {
      error("DUPLICATE_REF", `questions.${q.questionRef}`, "Duplicate questionRef.");
    }
    refs.add(q.questionRef);
    pointsSum += q.points ?? 0;

    if (q.topicTag) topics.add(q.topicTag);

    if (BLUEPRINT_ONLY_TYPES.has(q.blueprintQuestionType)) {
      error(
        "BLUEPRINT_ONLY_TYPE",
        `questions.${q.questionRef}`,
        `Type ${q.blueprintQuestionType} cannot be seeded for runtime.`
      );
    }

    const expectedType = CAMBA_TYPE_MAP[q.blueprintQuestionType];
    if (expectedType && q.cambaQuestionType !== expectedType) {
      error(
        "CAMBA_TYPE_MISMATCH",
        `questions.${q.questionRef}`,
        `Expected cambaQuestionType ${expectedType}, got ${q.cambaQuestionType}`
      );
    }

    validateQuestionPayload(q, error);
  }

  if (metadata.totalScore !== pointsSum) {
    error(
      "SCORE_MISMATCH",
      "metadata.totalScore",
      `totalScore ${metadata.totalScore} !== points sum ${pointsSum}`
    );
  }

  for (const section of sections) {
    if (!section.questionRefs?.length) {
      error(
        "EMPTY_SECTION",
        `sections.${section.sectionSlug}`,
        "Section must list at least one questionRef."
      );
    }
    for (const ref of section.questionRefs ?? []) {
      if (!refs.has(ref)) {
        error(
          "MISSING_QUESTION",
          `sections.${section.sectionSlug}`,
          `Unknown questionRef: ${ref}`
        );
      }
    }
  }

  if (topics.size < 5) {
    warn(
      "LOW_TOPIC_COVERAGE",
      "coverage",
      `Only ${topics.size} distinct topics — Starters practice mocks target ≥5.`
    );
  }

  validateManifestParts(manifest, error, warn);

  const errors = issues.filter((i) => i.severity === "error");
  return { valid: errors.length === 0, issues };
}

function validateManifestParts(manifest, error, warn) {
  if (!manifest.parts?.length) return;

  const sectionSlugs = new Set((manifest.sections ?? []).map((s) => s.sectionSlug));
  const questionRefs = new Set((manifest.questions ?? []).map((q) => q.questionRef));

  for (const part of manifest.parts) {
    const path = `parts.${part.partSlug}`;

    if (!sectionSlugs.has(part.sectionSlug)) {
      error("UNKNOWN_PART_SECTION", `${path}.sectionSlug`, `Section not in manifest: ${part.sectionSlug}`);
    }

    if (part.audio && !part.audio.src?.trim()) {
      error("INVALID_AUDIO", `${path}.audio.src`, "Audio src is required when audio is set.");
    }

    if (part.passage && !part.passage.text?.trim()) {
      error("INVALID_PASSAGE", `${path}.passage.text`, "Passage text is required when passage is set.");
    }

    for (const ref of part.questionRefs ?? []) {
      if (!questionRefs.has(ref)) {
        error("UNKNOWN_PART_QUESTION_REF", `${path}.questionRefs`, `Unknown questionRef: ${ref}`);
      }
    }

    if (!part.instructions && !part.audio && !part.passage && !part.title) {
      warn(
        "EMPTY_PART_CONTEXT",
        path,
        "Part context block has no title, instructions, audio, or passage."
      );
    }
  }
}

function validateQuestionPayload(q, error) {
  const type = q.cambaQuestionType;

  if (type === "multiple_choice" || type === "reading_comprehension" || type === "image_selection") {
    if (!q.choices?.length) {
      error("MISSING_CHOICES", `questions.${q.questionRef}`, "MCQ requires choices.");
      return;
    }
    const correct = q.choices.filter((c) => c.isCorrect);
    if (correct.length !== 1) {
      error(
        "MCQ_CORRECT_COUNT",
        `questions.${q.questionRef}`,
        "MCQ must have exactly one correct choice."
      );
    }
    if (!q.questionText?.trim()) {
      error("MISSING_STEM", `questions.${q.questionRef}`, "questionText is required.");
    }
  }

  if (type === "matching") {
    if (!q.pairs?.length) {
      error("MISSING_PAIRS", `questions.${q.questionRef}`, "Matching requires pairs.");
    }
  }

  if (type === "gap_fill") {
    const template = q.content?.template;
    const correctAnswers = q.content?.correctAnswers;
    if (!template || !Array.isArray(correctAnswers) || correctAnswers.length === 0) {
      error(
        "MISSING_GAP_CONTENT",
        `questions.${q.questionRef}`,
        "gap_fill requires content.template and content.correctAnswers."
      );
    }
  }
}
