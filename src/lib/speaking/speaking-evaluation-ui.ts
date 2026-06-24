import type {
  SpeakingEvaluationEnvelope,
  SpeakingQuestionEvaluationSummary,
} from "@/lib/speaking/speaking-evaluation-types";

export function toSpeakingQuestionEvaluationSummary(
  envelope: SpeakingEvaluationEnvelope | null
): SpeakingQuestionEvaluationSummary | null {
  if (!envelope?.result) return null;
  const r = envelope.result;
  return {
    overallScore: r.overallScore,
    bandScore: r.bandScore,
    dimensions: r.dimensions,
    strengths: r.strengths,
    weaknesses: r.weaknesses,
    feedback: r.feedback,
    transcript: r.transcript,
    status: envelope.status,
  };
}
