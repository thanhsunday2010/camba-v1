import { describe, expect, it } from "vitest";
import { normalizeShieldEstimate } from "@/lib/ai/normalize-shield-estimate";
import { WritingFeedbackSchema } from "@/types/ai";

describe("normalizeShieldEstimate", () => {
  it("drops scaleScore below Cambridge scale minimum", () => {
    expect(
      normalizeShieldEstimate({ writing: 4, scaleScore: 85 })
    ).toEqual({ writing: 4 });
  });

  it("keeps valid scaleScore for KET/PET", () => {
    expect(
      normalizeShieldEstimate({ writing: 10, scaleScore: 140 })
    ).toEqual({ writing: 10, scaleScore: 140 });
  });

  it("clamps skill shields to 0-15", () => {
    expect(
      normalizeShieldEstimate({ writing: 20, reading: -2 })
    ).toEqual({ writing: 15, reading: 0 });
  });
});

describe("WritingFeedbackSchema with normalized shield", () => {
  it("accepts payload after dropping invalid scaleScore", () => {
    const normalized = {
      estimatedLevel: "Movers",
      shieldEstimate: normalizeShieldEstimate({ writing: 3, scaleScore: 72 }),
      grammarFeedback: "Sai thì.",
      vocabularyFeedback: "Ổn.",
      coherenceFeedback: "Rõ.",
      suggestedImprovements: ["Dùng present simple"],
      overallScore: 45,
    };
    expect(() => WritingFeedbackSchema.parse(normalized)).not.toThrow();
  });
});
