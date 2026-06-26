import {
  SPEAKING_TRANSCRIPT_RULES,
  buildLearnerLevelGuidanceBlock,
} from "@/lib/ai/learner-level-guidance";

export const SPEAKING_FEEDBACK_SYSTEM = `You are an expert Cambridge English speaking examiner for K12 students.
Listen to the audio and return ONLY valid JSON matching this exact structure:
{
  "estimatedLevel": "Starters|Movers|Flyers|KET|PET|Pre-Starters",
  "shieldEstimate": { "speaking": 0-15 },
  "pronunciationScore": 0-100,
  "fluencyScore": 0-100,
  "grammarScore": 0-100,
  "vocabularyScore": 0-100,
  "suggestions": ["max 3 short tips in Vietnamese, each under 15 words"],
  "transcript": "Verbatim record of what the student said — never corrected or polished",
  "overallScore": 0-100,
  "modelAnswerSuggestion": "Short model spoken response in English (2-4 sentences) calibrated to the learner's declared level",
  "errorHighlights": ["[wrong fragment]{correct fragment} — max 5 key fixes from the student's transcript"],
  "correctedVersion": "Student's transcript improved with each fix marked as [wrong]{correct}; unchanged text stays plain"
}
shieldEstimate.speaking is a shield count from 0 to 15 for the speaking skill only.
Include shieldEstimate.scaleScore (integer 100-170) ONLY for KET or PET when appropriate; omit for Starters, Movers, and Flyers.
All suggestions must be in Vietnamese. modelAnswerSuggestion and correctedVersion must be in English.
${SPEAKING_TRANSCRIPT_RULES}
errorHighlights and correctedVersion must be based on the student's actual transcript — not a rewritten version.
Be encouraging but accurate. Keep suggestions brief — no long paragraphs.`;

export function buildSpeakingPrompt(
  prompt: string,
  targetLevel?: string,
  options?: {
    sceneDescription?: string;
    followUpQuestions?: string[];
    learnerDeclaredLevel?: string;
    clientTranscript?: string;
  }
): string {
  const followUpBlock =
    options?.followUpQuestions && options.followUpQuestions.length > 0
      ? `\nFollow-up questions the student should also address:\n${options.followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
      : "";

  const sceneBlock = options?.sceneDescription
    ? `\nScene / picture context: ${options.sceneDescription}`
    : "";

  const levelBlock = buildLearnerLevelGuidanceBlock({
    learnerDeclaredLevel: options?.learnerDeclaredLevel,
    exerciseTargetLevel: targetLevel,
  });

  const clientTranscript = options?.clientTranscript?.trim();
  const transcriptBlock = clientTranscript
    ? `\nLive speech-to-text transcript captured while the student spoke (copy this EXACTLY into the transcript field — character for character, do not change any word):\n"""\n${clientTranscript}\n"""`
    : `\nNo live transcript was captured. Transcribe the audio verbatim into transcript — include errors and fillers, do not correct.`;

  return `Assess this Cambridge English speaking submission.

Speaking prompt: ${prompt}
Target level: ${targetLevel ?? "Unknown"}${sceneBlock}${followUpBlock}${levelBlock}
${transcriptBlock}

Assess pronunciation, fluency, grammar, and vocabulary from the audio and transcript.
Include errorHighlights and correctedVersion derived from the student's transcript only.
Include modelAnswerSuggestion: a concise sample answer a strong student at the learner's declared level could say (cover the main prompt and follow-ups if any).
Return JSON only.`;
}
