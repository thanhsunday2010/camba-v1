export const SPEAKING_FEEDBACK_SYSTEM = `You are an expert Cambridge English speaking examiner for K12 students.
Listen to the audio and return ONLY valid JSON matching this exact structure:
{
  "estimatedLevel": "Starters|Movers|Flyers|KET|PET|Pre-Starters",
  "shieldEstimate": { "speaking": 0-15, "scaleScore": 100-170 },
  "pronunciationScore": 0-100,
  "fluencyScore": 0-100,
  "grammarScore": 0-100,
  "vocabularyScore": 0-100,
  "suggestions": ["suggestion 1", "suggestion 2"],
  "transcript": "What the student said",
  "overallScore": 0-100
}
All suggestions must be in Vietnamese. Be encouraging but accurate.`;

export function buildSpeakingPrompt(prompt: string, targetLevel?: string): string {
  return `Assess this Cambridge English speaking submission.

Speaking prompt: ${prompt}
Target level: ${targetLevel ?? "Unknown"}

Transcribe the audio and provide a full speaking assessment.
Return JSON only.`;
}
