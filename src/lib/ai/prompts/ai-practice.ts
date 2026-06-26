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
  "followUpQuestions": ["optional follow-up in target language for speaking"]
}
Rules:
- Match difficulty to declared level and program (general conversation, IELTS-style, or TOEIC-style).
- For non-English languages, adapt IELTS/TOEIC to equivalent exam-style tasks in that language context.
- Do NOT repeat any prompt listed in previousPrompts.
- prompt and followUpQuestions must be in the target practice language.
- instructions and analysisSummary must be in Vietnamese.`;

export function buildPracticePromptRequest(
  profile: PracticeProfile,
  previousPrompts: string[] = []
): string {
  const language = getLanguageLabel(profile.language);
  const level = getLevelLabel(profile.language, profile.level);
  const program = getProgramLabelKey(profile.program);
  const skill = profile.skill === "writing" ? "Writing" : "Speaking";

  return `Design the next ${skill} practice task.

Target language: ${language}
Learner level: ${level}
Program focus: ${program}
Skill: ${skill}

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
  "strengths": ["max 2 short points in Vietnamese"],
  "weaknesses": ["max 2 short points in Vietnamese"],
  "errorHighlights": ["[wrong fragment]{correct fragment} — max 5 key fixes"],
  "modelAnswerSuggestion": "Model answer in the TARGET LANGUAGE calibrated to the learner's declared level; use [wrong]{correct} markup only when showing a fix inline"
}
All feedback fields except modelAnswerSuggestion must be in Vietnamese.
modelAnswerSuggestion must be in the target practice language and use only vocabulary/grammar suitable for the declared level.
Keep every field brief and scannable — no long paragraphs.`;

export function buildPracticeWritingFeedbackRequest(
  profile: PracticeProfile,
  prompt: string,
  content: string
): string {
  const language = getLanguageLabel(profile.language);
  const level = getLevelLabel(profile.language, profile.level);

  return `Assess this ${language} writing submission.
Learner declared level: ${level}
Program: ${profile.program}

Use only vocabulary, grammar, and sentence complexity typical of ${level} in modelAnswerSuggestion.

Prompt:
"""
${prompt}
"""

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
  "transcript": "Verbatim record of what the student said — never corrected or polished",
  "overallScore": 0-100,
  "modelAnswerSuggestion": "Short model response in the TARGET LANGUAGE (2-4 sentences) calibrated to the learner's declared level",
  "errorHighlights": ["[wrong fragment]{correct fragment} — max 5 key fixes from the student's transcript"],
  "correctedVersion": "Student's transcript improved with each fix marked as [wrong]{correct}; unchanged text stays plain"
}
Suggestions must be in Vietnamese. modelAnswerSuggestion and correctedVersion in target language.
${SPEAKING_TRANSCRIPT_RULES}
Keep feedback brief — no long paragraphs.`;

export function buildPracticeSpeakingFeedbackRequest(
  profile: PracticeProfile,
  prompt: string,
  clientTranscript?: string
): string {
  const language = getLanguageLabel(profile.language);
  const level = getLevelLabel(profile.language, profile.level);

  const transcriptBlock = clientTranscript?.trim()
    ? `\nLive speech-to-text transcript (copy EXACTLY into transcript — do not change any word):\n"""\n${clientTranscript.trim()}\n"""`
    : `\nNo live transcript was captured. Transcribe the audio verbatim — include errors and fillers, do not correct.`;

  return `Assess this ${language} speaking submission.
Learner declared level: ${level}
Program: ${profile.program}

Use only vocabulary, grammar, and sentence complexity typical of ${level} in modelAnswerSuggestion and correctedVersion.

Speaking prompt:
"""
${prompt}
"""
${transcriptBlock}

Assess and return JSON only.`;
}
