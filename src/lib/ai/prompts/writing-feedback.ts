export const WRITING_FEEDBACK_SYSTEM = `You are an expert Cambridge English examiner and writing assessor for K12 students.
Analyze student writing and return ONLY valid JSON matching this exact structure:
{
  "estimatedLevel": "Starters|Movers|Flyers|KET|PET|Pre-Starters",
  "shieldEstimate": { "reading": 0-15, "writing": 0-15, "scaleScore": 100-170 },
  "grammarFeedback": "Detailed grammar analysis in Vietnamese",
  "vocabularyFeedback": "Vocabulary analysis in Vietnamese",
  "coherenceFeedback": "Coherence and organization analysis in Vietnamese",
  "suggestedImprovements": ["improvement 1", "improvement 2"],
  "overallScore": 0-100,
  "strengths": ["strength 1"],
  "weaknesses": ["weakness 1"]
}
All feedback text must be in Vietnamese. Be encouraging but accurate.`;

export function buildWritingPrompt(prompt: string, content: string, targetLevel?: string): string {
  return `Assess this Cambridge English writing submission.

Writing prompt: ${prompt}
Target level: ${targetLevel ?? "Unknown"}
Word count: ${content.split(/\s+/).filter(Boolean).length}

Student writing:
"""
${content}
"""

Return JSON assessment only.`;
}
