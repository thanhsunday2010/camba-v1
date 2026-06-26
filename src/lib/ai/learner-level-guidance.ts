import { getActiveProgramContext } from "@/lib/programs/context";
import { getUserGamification } from "@/lib/queries/user";

/** User's declared learning level from gamification / program context. */
export async function resolveLearnerDeclaredLevelName(
  userId: string
): Promise<string | undefined> {
  const gamification = await getUserGamification(userId);
  const context = await getActiveProgramContext(userId, gamification);
  return context?.level?.name?.trim() || undefined;
}

export function buildLearnerLevelGuidanceBlock(options: {
  learnerDeclaredLevel?: string;
  exerciseTargetLevel?: string;
}): string {
  const declared = options.learnerDeclaredLevel?.trim();
  const exercise = options.exerciseTargetLevel?.trim();
  const calibrationLevel = declared ?? exercise;

  if (!calibrationLevel) {
    return "";
  }

  const lines = [
    "",
    "Level calibration (mandatory for modelAnswerSuggestion and correctedVersion):",
    `- Primary learner level: ${declared ?? exercise}`,
  ];

  if (declared && exercise && declared !== exercise) {
    lines.push(`- Exercise target level: ${exercise}`);
    lines.push(
      `- Use the learner's declared level (${declared}) for vocabulary, grammar structures, and sentence complexity in all suggested answers and corrections.`
    );
  } else {
    lines.push(
      `- Use only vocabulary, grammar structures, and sentence complexity typical of ${calibrationLevel}.`
    );
  }

  lines.push(
    "- Do NOT use words, idioms, or grammar above this level.",
    "- Model answers must be achievable for a student currently at this level."
  );

  return lines.join("\n");
}

export const SPEAKING_TRANSCRIPT_RULES = `Transcript rules (mandatory):
- The "transcript" field must reproduce EXACTLY what the student said — verbatim from the live transcript when provided, or a faithful transcription from audio when not.
- Do NOT correct grammar, spelling, or word choice in transcript.
- Do NOT omit filler words, repetitions, or incomplete sentences.
- Do NOT polish or rewrite the student's words in transcript.
- Put all fixes only in errorHighlights and correctedVersion.`;

export function finalizeSpeakingTranscript(
  feedback: { transcript?: string },
  clientTranscript?: string
): string | undefined {
  const client = clientTranscript?.trim();
  if (client) return client;
  return feedback.transcript?.trim() || undefined;
}
