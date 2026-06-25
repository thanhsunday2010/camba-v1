import type { PracticeProfile } from "@/lib/ai-practice/practice-types";
import {
  getLanguageLabel,
  getLevelLabel,
  getProgramLabelKey,
} from "@/lib/ai-practice/practice-config";

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
  "grammarFeedback": "Detailed grammar analysis in Vietnamese",
  "vocabularyFeedback": "Vocabulary analysis in Vietnamese",
  "coherenceFeedback": "Organization and coherence in Vietnamese",
  "suggestedImprovements": ["actionable tip in Vietnamese"],
  "overallScore": 0-100,
  "strengths": ["strength in Vietnamese"],
  "weaknesses": ["weakness in Vietnamese"],
  "errorHighlights": ["specific error → correction in Vietnamese"],
  "modelAnswerSuggestion": "A model answer in the TARGET LANGUAGE appropriate to the prompt and level"
}
All feedback fields except modelAnswerSuggestion must be in Vietnamese.
modelAnswerSuggestion must be in the target practice language.`;

export function buildPracticeWritingFeedbackRequest(
  profile: PracticeProfile,
  prompt: string,
  content: string
): string {
  const language = getLanguageLabel(profile.language);
  const level = getLevelLabel(profile.language, profile.level);

  return `Assess this ${language} writing submission.
Level: ${level}
Program: ${profile.program}

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
  "suggestions": ["tip in Vietnamese"],
  "transcript": "transcription in target language",
  "overallScore": 0-100,
  "modelAnswerSuggestion": "A model spoken response in the TARGET LANGUAGE (short paragraph)"
}
Suggestions must be in Vietnamese. modelAnswerSuggestion in target language.`;

export function buildPracticeSpeakingFeedbackRequest(
  profile: PracticeProfile,
  prompt: string
): string {
  const language = getLanguageLabel(profile.language);
  const level = getLevelLabel(profile.language, profile.level);

  return `Assess this ${language} speaking submission.
Level: ${level}
Program: ${profile.program}

Speaking prompt:
"""
${prompt}
"""

Transcribe and assess. Return JSON only.`;
}
