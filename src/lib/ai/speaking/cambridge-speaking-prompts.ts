import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { SpeakingAiEvaluationRequest } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import { SPEAKING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";

export const CAMBRIDGE_SPEAKING_EVAL_SYSTEM = `You are a Cambridge English speaking examiner for CAMBA.
Listen to the learner audio, transcribe it accurately, and evaluate using only these dimensions:
pronunciation, grammar, vocabulary, fluency, task_achievement.

Return ONLY valid JSON matching the required schema. No markdown. No prose outside JSON.
Feedback must be constructive, age-appropriate, and match the learner locale when provided.`;

const LEVEL_RUBRIC: Record<CambridgeExamLevel, string> = {
  starters: `Level: Pre A1 Starters.
Expect very short spoken answers (single words / short phrases). Simple vocabulary and pronunciation.
bandScore: integer 0–5 (YLE speaking shields). Be encouraging.`,
  movers: `Level: A1 Movers.
Expect short spoken responses with simple sentences. Basic fluency and task completion.
bandScore: integer 0–5 (YLE speaking shields).`,
  flyers: `Level: A2 Flyers.
Expect clearer spoken responses with some detail. Adequate fluency for age.
bandScore: integer 0–5 (YLE speaking shields).`,
  ket: `Level: A2 Key (KET).
Expect sustained spoken responses with adequate range and intelligibility.
bandScore: approximate Cambridge scale 120–150 (integer).`,
  pet: `Level: B1 Preliminary (PET).
Expect extended spoken responses, good range, and clear communication.
bandScore: approximate Cambridge scale 140–170 (integer).`,
};

export function buildCambridgeSpeakingEvalPrompt(request: SpeakingAiEvaluationRequest): string {
  const levelRubric = LEVEL_RUBRIC[request.level];
  const locale = request.locale ?? "en";

  const stimulus = request.stimulus
    ? `
Stimulus: ${request.stimulus.imageDescription ?? "picture-based task"}
Picture sequence: ${request.stimulus.pictureSequence?.join("; ") ?? "none"}.`
    : "";

  const followUps = request.followUpPrompts?.length
    ? `\nFollow-up questions:\n${request.followUpPrompts.map((q) => `- ${q}`).join("\n")}`
    : "";

  return `${levelRubric}

Task type: ${request.taskType}
Task prompt:
${request.prompt}
${followUps}
${stimulus}

Audio duration: ${request.audio.durationSeconds} seconds.
Feedback language: ${locale === "vi" ? "Vietnamese" : "English"}.

Return JSON with exactly these fields:
{
  "transcript": "<accurate transcript>",
  "overallScore": <0-100>,
  "bandScore": <level-appropriate band>,
  "dimensions": [
${SPEAKING_DIMENSION_ORDER.map(
  (d) => `    { "dimension": "${d}", "score": <0-100>, "feedback": "..." }`
).join(",\n")}
  ],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "feedback": "<summary>",
  "languageAnalysis": {
    "wordCount": <number>,
    "sentenceCount": <number>,
    "averageWordsPerSentence": <number>,
    "vocabularyRange": "limited|adequate|good|wide",
    "grammarControl": "limited|adequate|good|strong"
  }
}`;
}
