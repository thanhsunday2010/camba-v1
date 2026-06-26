import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { WritingAiEvaluationRequest } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import { WRITING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import { getCambridgeTask } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";

export const CAMBRIDGE_WRITING_EVAL_SYSTEM = `You are a Cambridge English writing examiner for CAMBA.
Evaluate learner writing using the official Cambridge dimensions only:
grammar, vocabulary, task_achievement, organization, communicative_effectiveness.

Return ONLY valid JSON matching the required schema. No markdown. No prose outside JSON.
Feedback must be constructive, age-appropriate, and in the learner's locale when provided.
Keep feedback concise: one short sentence per dimension, max 2 strengths/weaknesses, max 3 suggestedImprovements.
The correctedVersion is a model answer — not the only correct answer.
Mark each fix inline as [incorrect fragment]{corrected fragment}; leave unchanged text plain.
Do not invent scores outside 0–100 for dimension and overall scores.`;

const LEVEL_RUBRIC: Record<CambridgeExamLevel, string> = {
  starters: `Level: Pre A1 Starters.
Expect very short responses (1–3 sentences). Simple present, basic vocabulary, name/object/action descriptions.
bandScore: integer 0–5 (YLE writing shields). Be encouraging; focus on basic communication.`,
  movers: `Level: A1 Movers.
Expect short paragraphs. Simple past/present, common connectors, basic story/email/note formats.
bandScore: integer 0–5 (YLE writing shields).`,
  flyers: `Level: A2 Flyers.
Expect longer responses with clearer organization. Past/present/future, varied vocabulary, task completion.
bandScore: integer 0–5 (YLE writing shields).`,
  ket: `Level: A2 Key (KET).
Expect B1-oriented task completion with paragraph structure, adequate range, and clear purpose.
bandScore: approximate Cambridge scale 120–150 (integer).`,
  pet: `Level: B1 Preliminary (PET).
Expect coherent multi-paragraph writing, good range, register awareness, and clear argumentation.
bandScore: approximate Cambridge scale 140–170 (integer).`,
};

export function buildCambridgeWritingEvalPrompt(request: WritingAiEvaluationRequest): string {
  const task = getCambridgeTask(request.taskType);
  const levelRubric = LEVEL_RUBRIC[request.level];
  const locale = request.locale ?? "en";

  const constraints = request.constraints
    ? `
Word range: ${request.constraints.minWords ?? "none"} – ${request.constraints.maxWords ?? "none"} words.
Required points: ${request.constraints.requiredPoints?.join("; ") ?? "none"}.`
    : "";

  const stimulus = request.stimulus
    ? `
Stimulus: ${request.stimulus.imageDescription ?? "picture-based task"}
Bullet points: ${request.stimulus.bulletPoints?.join("; ") ?? "none"}.`
    : "";

  return `${levelRubric}

Task type: ${task.label} (${request.taskType})
Task prompt:
${request.prompt}

Learner response (${request.learnerResponse.split(/\s+/).filter(Boolean).length} words):
"""
${request.learnerResponse}
"""
${constraints}
${stimulus}

Feedback language: ${locale === "vi" ? "Vietnamese" : "English"}.

Return JSON with exactly these fields:
{
  "overallScore": <0-100>,
  "bandScore": <level-appropriate band>,
  "dimensions": [
${WRITING_DIMENSION_ORDER.map(
  (d) => `    { "dimension": "${d}", "score": <0-100>, "feedback": "..." }`
).join(",\n")}
  ],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "feedback": "<summary — max 2 short sentences>",
  "correctedVersion": "<improved version with [wrong]{correct} markup for each fix>",
  "suggestedImprovements": ["max 3 short tips"]
}`;
}
