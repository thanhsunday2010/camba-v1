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
  "transcript": "What the student said",
  "overallScore": 0-100,
  "modelAnswerSuggestion": "Short model spoken response in English (2-4 sentences) that answers the prompt well at the target level"
}
shieldEstimate.speaking is a shield count from 0 to 15 for the speaking skill only.
Include shieldEstimate.scaleScore (integer 100-170) ONLY for KET or PET when appropriate; omit for Starters, Movers, and Flyers.
All suggestions must be in Vietnamese. modelAnswerSuggestion must be in English.
Be encouraging but accurate. Keep suggestions brief — no long paragraphs.`;

export function buildSpeakingPrompt(
  prompt: string,
  targetLevel?: string,
  options?: {
    sceneDescription?: string;
    followUpQuestions?: string[];
  }
): string {
  const followUpBlock =
    options?.followUpQuestions && options.followUpQuestions.length > 0
      ? `\nFollow-up questions the student should also address:\n${options.followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
      : "";

  const sceneBlock = options?.sceneDescription
    ? `\nScene / picture context: ${options.sceneDescription}`
    : "";

  return `Assess this Cambridge English speaking submission.

Speaking prompt: ${prompt}
Target level: ${targetLevel ?? "Unknown"}${sceneBlock}${followUpBlock}

Transcribe the audio and provide a full speaking assessment.
Include modelAnswerSuggestion: a concise sample answer a strong student at this level could say (cover the main prompt and follow-ups if any).
Return JSON only.`;
}
