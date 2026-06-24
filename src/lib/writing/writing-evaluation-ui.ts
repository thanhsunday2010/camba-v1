import type {
  WritingEvaluationEnvelope,
  WritingQuestionEvaluationSummary,
} from "@/lib/writing/writing-evaluation-types";

export function toWritingQuestionEvaluationSummary(
  envelope: WritingEvaluationEnvelope | null
): WritingQuestionEvaluationSummary | null {
  if (!envelope?.result) return null;
  const r = envelope.result;
  return {
    overallScore: r.overallScore,
    bandScore: r.bandScore,
    dimensions: r.dimensions,
    strengths: r.strengths,
    weaknesses: r.weaknesses,
    feedback: r.feedback,
    correctedVersion: r.correctedVersion,
    status: envelope.status,
  };
}
