import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import type { YleMockValidationIssue } from "@/lib/mock-blueprints/yle-mock-blueprint-types";
import { deriveListeningMode } from "@/lib/mock-tests/mock-test-format";

export type MockManifestQualityIssue = YleMockValidationIssue;

/** Gap-fill share above this triggers EXCESSIVE_GAP_FILL (practice mocks target ≤55%). */
export const GAP_FILL_RATIO_WARNING_THRESHOLD = 0.55;

/** Fewer than this many distinct CAMBA question types triggers THIN_TASK_VARIETY. */
export const MIN_DISTINCT_TASK_TYPES = 3;

function warn(
  code: string,
  path: string,
  message: string
): MockManifestQualityIssue {
  return { code, severity: "warning", path, message };
}

function manifestListeningContexts(manifest: YleMockManifest) {
  const listeningSectionSlugs = new Set(
    manifest.sections
      .filter((s) => s.skillSlug === "listening" || s.sectionSlug === "listening")
      .map((s) => s.sectionSlug)
  );

  const hasListeningQuestions = manifest.questions.some(
    (q) => q.sectionSlug === "listening" || q.skillTag === "listening"
  );

  if (!hasListeningQuestions && listeningSectionSlugs.size === 0) {
    return { hasListening: false, mode: "none" as const };
  }

  const parts = manifest.parts ?? [];
  const listeningParts = parts.filter(
    (p) => p.sectionSlug === "listening" || listeningSectionSlugs.has(p.sectionSlug)
  );

  const audioInParts = listeningParts.some((p) => Boolean(p.audio?.src?.trim()));
  const textInParts = listeningParts.some(
    (p) => Boolean(p.passage?.text?.trim()) && !p.audio?.src?.trim()
  );

  if (audioInParts && textInParts) return { hasListening: true, mode: "mixed" as const };
  if (audioInParts) return { hasListening: true, mode: "audio" as const };
  if (textInParts || hasListeningQuestions) {
    return { hasListening: true, mode: "text" as const };
  }

  const contexts = manifest.questions
    .filter((q) => q.sectionSlug === "listening")
    .map(() => ({ sectionSkillSlug: "listening", contextType: "listening", audioSrc: null }));

  return {
    hasListening: contexts.length > 0,
    mode: deriveListeningMode(contexts),
  };
}

export function analyzeMockManifestQuality(
  manifest: YleMockManifest
): MockManifestQualityIssue[] {
  const issues: MockManifestQualityIssue[] = [];
  const questions = manifest.questions ?? [];

  if (questions.length === 0) return issues;

  const listening = manifestListeningContexts(manifest);
  if (listening.hasListening && listening.mode !== "audio" && listening.mode !== "mixed") {
    issues.push(
      warn(
        "LISTENING_WITHOUT_AUDIO",
        "sections.listening",
        "Listening section uses text/transcript only — label as text-based listening in the product."
      )
    );
  }

  const gapCount = questions.filter((q) => q.cambaQuestionType === "gap_fill").length;
  const gapRatio = gapCount / questions.length;
  if (gapRatio > GAP_FILL_RATIO_WARNING_THRESHOLD) {
    issues.push(
      warn(
        "EXCESSIVE_GAP_FILL",
        "questions",
        `${Math.round(gapRatio * 100)}% gap_fill (${gapCount}/${questions.length}) exceeds ${Math.round(GAP_FILL_RATIO_WARNING_THRESHOLD * 100)}% target.`
      )
    );
  }

  const distinctTypes = new Set(questions.map((q) => q.cambaQuestionType));
  if (distinctTypes.size < MIN_DISTINCT_TASK_TYPES) {
    issues.push(
      warn(
        "THIN_TASK_VARIETY",
        "questions",
        `Only ${distinctTypes.size} distinct task type(s): ${[...distinctTypes].join(", ")}. Target ≥${MIN_DISTINCT_TASK_TYPES}.`
      )
    );
  }

  const topics = new Set(questions.map((q) => q.topicTag).filter(Boolean));
  if (topics.size < 5) {
    issues.push(
      warn(
        "LOW_TOPIC_COVERAGE",
        "coverage",
        `Only ${topics.size} distinct topics — practice mocks target ≥5.`
      )
    );
  }

  const grammarPatterns =
    (manifest.metadata as { grammarPatterns?: string[] }).grammarPatterns ?? [];
  const grammarTagged = questions.filter(
    (q) => (q as { grammarTag?: string }).grammarTag
  ).length;
  if (grammarPatterns.length > 0 && grammarTagged === 0) {
    issues.push(
      warn(
        "GRAMMAR_METADATA_UNTAGGED",
        "metadata.grammarPatterns",
        "grammarPatterns listed in metadata but no questions carry grammarTag."
      )
    );
  }

  return issues;
}
