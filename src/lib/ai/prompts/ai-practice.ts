import type { PracticeProfile } from "@/lib/ai-practice/practice-types";
import {
  getLanguageLabel,
  getLevelLabel,
  getProgramLabelKey,
} from "@/lib/ai-practice/practice-config";
import { SPEAKING_TRANSCRIPT_RULES } from "@/lib/ai/learner-level-guidance";

export const PRACTICE_PROMPT_SYSTEM = `You are an expert language coach designing personalized speaking/writing practice tasks.
Return ONLY valid JSON:
{
  "analysisSummary": "2-3 sentences in Vietnamese explaining how you tailored this task to the learner profile",
  "prompt": "The main task prompt written in the TARGET LANGUAGE the learner is practicing",
  "instructions": "Clear instructions in Vietnamese for the learner",
  "minWords": number (writing only, optional),
  "maxWords": number (writing only, optional),
  "maxDurationSeconds": number (speaking only, optional),
  "followUpQuestions": ["optional follow-up in target language for speaking"],
  "sentenceStarters": ["2-4 level-appropriate sentence starters in the target language"],
  "repeatPhrase": "One short phrase for the learner to repeat aloud (speaking only, target language)",
  "rolePlayPersona": "Examiner/partner role name (roleplay mode only, e.g. Shop assistant)"
}
Rules:
- Match difficulty to declared level and program (general conversation, IELTS-style, or TOEIC-style).
- For micro mode: speaking max ~60 seconds; writing minWords ~40, maxWords ~80.
- For roleplay mode: create a realistic spoken/written scenario with a clear persona — NO picture descriptions.
- Include sentenceStarters suitable for the learner's declared level.
- If recurringErrors are provided, design a task that naturally practices those weak points.
- Do NOT repeat any prompt listed in previousPrompts.
- prompt and followUpQuestions must be in the target practice language.
- instructions and analysisSummary must be in Vietnamese.`;

export function buildPracticePromptRequest(
  profile: PracticeProfile,
  previousPrompts: string[] = [],
  options?: { recurringErrors?: string[]; focusFixHint?: string }
): string {
  const language = getLanguageLabel(profile.language);
  const level = getLevelLabel(profile.language, profile.level);
  const program = getProgramLabelKey(profile.program);
  const skill = profile.skill === "writing" ? "Writing" : "Speaking";
  const mode = profile.mode ?? "standard";

  const modeBlock =
    mode === "micro"
      ? "\nMode: MICRO — short, focused session (speaking ~60s, writing ~40-80 words)."
      : mode === "roleplay"
        ? "\nMode: ROLEPLAY — immersive scenario with a clear partner persona. No picture prompts."
        : "\nMode: STANDARD — full-length practice task.";

  const recurringBlock =
    options?.recurringErrors && options.recurringErrors.length > 0
      ? `\nRecurring errors to target in this task:\n${options.recurringErrors.map((e, i) => `${i + 1}. ${e}`).join("\n")}`
      : "";

  const focusBlock = options?.focusFixHint
    ? `\nPrevious attempt focus fix — reinforce this in the task design:\n${options.focusFixHint}`
    : "";

  return `Design the next ${skill} practice task.

Target language: ${language}
Learner level: ${level}
Program focus: ${program}
Skill: ${skill}${modeBlock}${recurringBlock}${focusBlock}

Previous prompts to avoid repeating:
${previousPrompts.length ? previousPrompts.map((p, i) => `${i + 1}. ${p}`).join("\n") : "(none — first task)"}

Return JSON only.`;
}

export const PRACTICE_WRITING_FEEDBACK_SYSTEM = `You are an expert multilingual writing examiner.
Analyze the learner's writing and return ONLY valid JSON:
{
  "estimatedLevel": "string — level label matching the target framework",
  "shieldEstimate": { "writing": 0-15 },
  "grammarFeedback": "One short sentence in Vietnamese (max 20 words)",
  "vocabularyFeedback": "One short sentence in Vietnamese (max 20 words)",
  "coherenceFeedback": "One short sentence in Vietnamese (max 20 words)",
  "suggestedImprovements": ["max 2 short tips in Vietnamese, each under 15 words"],
  "overallScore": 0-100,
  "grammarScore": 0-100,
  "vocabularyScore": 0-100,
  "coherenceScore": 0-100,
  "strengths": ["max 2 short points in Vietnamese"],
  "weaknesses": ["max 2 short points in Vietnamese"],
  "errorHighlights": ["[wrong fragment]{correct fragment} — max 3 key fixes on first attempt, max 1 if focusFixRetry"],
  "modelAnswerSuggestion": "Model answer in the TARGET LANGUAGE calibrated to the learner's declared level",
  "correctedVersion": "Improved version with [wrong]{correct} markup",
  "bestPhrase": "One strong phrase or sentence the learner wrote well (target language, quote exactly)",
  "focusFix": "ONE priority fix in Vietnamese (max 15 words) for the next retry attempt"
}
All feedback fields except modelAnswer, correctedVersion, and bestPhrase must be in Vietnamese.
On retry attempts, emphasize only ONE focusFix and keep errorHighlights to 1 item.
Keep every field brief and scannable.`;

export function buildPracticeWritingFeedbackRequest(
  profile: PracticeProfile,
  prompt: string,
  content: string,
  options?: { outline?: string; attemptNumber?: number; focusFixHint?: string }
): string {
  const language = getLanguageLabel(profile.language);
  const level = getLevelLabel(profile.language, profile.level);
  const outlineBlock = options?.outline?.trim()
    ? `\nLearner's outline (plan before writing):\n"""\n${options.outline.trim()}\n"""`
    : "";
  const retryBlock =
    (options?.attemptNumber ?? 1) > 1
      ? `\nThis is retry attempt #${options?.attemptNumber}. Prioritize ONE focus fix${options?.focusFixHint ? `: ${options.focusFixHint}` : ""}.`
      : "";

  return `Assess this ${language} writing submission.
Learner declared level: ${level}
Program: ${profile.program}
${retryBlock}

Prompt:
"""
${prompt}
"""
${outlineBlock}

Student writing:
"""
${content}
"""

Word count: ${content.split(/\s+/).filter(Boolean).length}
Return JSON only.`;
}

export const PRACTICE_SPEAKING_FEEDBACK_SYSTEM = `You are an expert multilingual speaking examiner.
Listen to the audio and return ONLY valid JSON:
{
  "estimatedLevel": "string",
  "shieldEstimate": { "speaking": 0-15 },
  "pronunciationScore": 0-100,
  "fluencyScore": 0-100,
  "grammarScore": 0-100,
  "vocabularyScore": 0-100,
  "suggestions": ["max 3 short tips in Vietnamese, each under 15 words"],
  "transcript": "Verbatim record — never corrected or polished",
  "overallScore": 0-100,
  "modelAnswerSuggestion": "Short model response (2-4 sentences) calibrated to declared level",
  "errorHighlights": ["[wrong fragment]{correct fragment} — max 3 fixes, max 1 on retry"],
  "correctedVersion": "Transcript improved with [wrong]{correct} markup",
  "bestPhrase": "One strong phrase the learner said well (quote exactly from transcript)",
  "focusFix": "ONE priority fix in Vietnamese (max 15 words) for the next retry"
}
Suggestions must be in Vietnamese. modelAnswerSuggestion, correctedVersion, bestPhrase in target language.
${SPEAKING_TRANSCRIPT_RULES}
On retry attempts, return only ONE focusFix and ONE errorHighlight.
Keep feedback brief.`;

export function buildPracticeSpeakingFeedbackRequest(
  profile: PracticeProfile,
  prompt: string,
  clientTranscript?: string,
  options?: { attemptNumber?: number; focusFixHint?: string }
): string {
  const language = getLanguageLabel(profile.language);
  const level = getLevelLabel(profile.language, profile.level);

  const transcriptBlock = clientTranscript?.trim()
    ? `\nLive speech-to-text transcript (copy EXACTLY into transcript — do not change any word):\n"""\n${clientTranscript.trim()}\n"""`
    : `\nNo live transcript was captured. Transcribe the audio verbatim — include errors and fillers, do not correct.`;

  const retryBlock =
    (options?.attemptNumber ?? 1) > 1
      ? `\nRetry attempt #${options?.attemptNumber}. Focus on ONE fix${options?.focusFixHint ? `: ${options.focusFixHint}` : ""}.`
      : "";

  return `Assess this ${language} speaking submission.
Learner declared level: ${level}
Program: ${profile.program}
${retryBlock}

Speaking prompt:
"""
${prompt}
"""
${transcriptBlock}

Assess and return JSON only.`;
}
