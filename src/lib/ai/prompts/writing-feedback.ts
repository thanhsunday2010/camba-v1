import { buildLearnerLevelGuidanceBlock } from "@/lib/ai/learner-level-guidance";

export const WRITING_FEEDBACK_SYSTEM = `You are an expert Cambridge English examiner and writing assessor for K12 students.
Analyze student writing and return ONLY valid JSON matching this exact structure:
{
  "estimatedLevel": "Starters|Movers|Flyers|KET|PET|Pre-Starters",
  "shieldEstimate": { "writing": 0-15 },
  "grammarFeedback": "One short sentence in Vietnamese (max 20 words)",
  "vocabularyFeedback": "One short sentence in Vietnamese (max 20 words)",
  "coherenceFeedback": "One short sentence in Vietnamese (max 20 words)",
  "suggestedImprovements": ["max 2 short tips in Vietnamese, each under 15 words"],
  "overallScore": 0-100,
  "strengths": ["max 2 short points in Vietnamese"],
  "weaknesses": ["max 2 short points in Vietnamese"],
  "errorHighlights": ["[wrong fragment]{correct fragment} — max 5 key fixes"],
  "correctedVersion": "Improved text with each fix marked as [wrong]{correct}; unchanged text stays plain — vocabulary and structures must stay at the learner's declared level",
  "bestPhrase": "One strong phrase or sentence the learner wrote well (quote exactly from their writing)",
  "focusFix": "ONE priority fix in Vietnamese (max 15 words) for the next attempt"
}
shieldEstimate.writing is a shield count from 0 to 15 for the writing skill only.
Include shieldEstimate.scaleScore (integer 100-170) ONLY for KET or PET submissions when you can estimate Cambridge Scale; omit scaleScore for Starters, Movers, and Flyers.
All feedback text must be in Vietnamese except correctedVersion (target language of the student's writing).
correctedVersion is a level-appropriate improved version — use only vocabulary and grammar suitable for the learner's declared level.
Be encouraging but accurate. Keep every feedback field brief and scannable.`;

export function buildWritingPrompt(
  prompt: string,
  content: string,
  targetLevel?: string,
  learnerDeclaredLevel?: string,
  options?: { attemptNumber?: number; focusFixHint?: string }
): string {
  const levelBlock = buildLearnerLevelGuidanceBlock({
    learnerDeclaredLevel,
    exerciseTargetLevel: targetLevel,
  });

  const retryBlock =
    (options?.attemptNumber ?? 1) > 1
      ? `\nThis is retry attempt #${options?.attemptNumber}. Prioritize ONE focusFix${options?.focusFixHint ? `: ${options.focusFixHint}` : ""}. Limit errorHighlights to 1 item.`
      : "";

  return `Assess this Cambridge English writing submission.

Writing prompt: ${prompt}
Target level: ${targetLevel ?? "Unknown"}${levelBlock}${retryBlock}
Word count: ${content.split(/\s+/).filter(Boolean).length}

Student writing:
"""
${content}
"""

Return JSON assessment only.`;
}
