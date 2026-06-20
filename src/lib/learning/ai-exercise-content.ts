/**
 * Resolve AI writing/speaking fields from exercise content JSON (authoring gold standard).
 */

export function resolveTargetLevel(
  content: Record<string, unknown>
): string | undefined {
  const level = content.targetLevel ?? content.levelTag;
  return typeof level === "string" && level.length > 0 ? level : undefined;
}

export function resolveWritingMinWords(content: Record<string, unknown>): number {
  const min = content.minWords ?? content.minimumWords;
  return typeof min === "number" && min > 0 ? min : 30;
}

export function resolveWritingMaxWords(content: Record<string, unknown>): number {
  const max = content.maxWords;
  return typeof max === "number" && max > 0 ? max : 200;
}

export function buildWritingPromptText(
  content: Record<string, unknown>,
  fallback: string
): string {
  if (typeof content.prompt === "string" && content.prompt.trim()) {
    return content.prompt.trim();
  }

  const parts: string[] = [];
  if (typeof content.taskDescription === "string" && content.taskDescription.trim()) {
    parts.push(content.taskDescription.trim());
  }

  const prompts = Array.isArray(content.prompts)
    ? (content.prompts as string[]).filter((p) => typeof p === "string" && p.trim())
    : [];

  if (prompts.length > 0) {
    parts.push(prompts.join("\n"));
  }

  return parts.length > 0 ? parts.join("\n\n") : fallback;
}

export function buildSpeakingPromptText(
  content: Record<string, unknown>,
  fallback: string
): string {
  const base =
    typeof content.prompt === "string" && content.prompt.trim()
      ? content.prompt.trim()
      : "";

  const questions = Array.isArray(content.followUpQuestions)
    ? (content.followUpQuestions as string[]).filter((q) => typeof q === "string" && q.trim())
    : [];

  const questionBlock =
    questions.length > 0
      ? `\n\nTrả lời các câu hỏi sau:\n${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
      : "";

  const combined = `${base}${questionBlock}`.trim();
  return combined || fallback;
}

export function getFollowUpQuestions(content: Record<string, unknown>): string[] {
  if (!Array.isArray(content.followUpQuestions)) return [];
  return (content.followUpQuestions as string[]).filter(
    (q) => typeof q === "string" && q.trim()
  );
}

export function getWritingPrompts(content: Record<string, unknown>): string[] {
  if (!Array.isArray(content.prompts)) return [];
  return (content.prompts as string[]).filter((p) => typeof p === "string" && p.trim());
}

export function getExerciseListSubtitle(exercise: {
  exercise_type: string;
  title: string;
  questions?: unknown[] | null;
}): string {
  if (exercise.exercise_type === "writing") {
    return "Bài viết • AI chấm";
  }
  if (exercise.exercise_type === "speaking") {
    return "Bài nói • Ghi âm + AI chấm";
  }

  const count = exercise.questions?.length ?? 0;
  const title = exercise.title.toLowerCase();
  if (
    title.startsWith("learn:") ||
    title.startsWith("practice:") ||
    title.startsWith("check:") ||
    title.startsWith("apply:")
  ) {
    return `Trắc nghiệm • ${count} câu`;
  }

  return `${count} câu hỏi`;
}
