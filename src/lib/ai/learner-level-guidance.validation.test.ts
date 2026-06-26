import { describe, expect, it } from "vitest";
import {
  buildLearnerLevelGuidanceBlock,
  finalizeSpeakingTranscript,
} from "@/lib/ai/learner-level-guidance";

describe("buildLearnerLevelGuidanceBlock", () => {
  it("returns empty string when no level is known", () => {
    expect(buildLearnerLevelGuidanceBlock({})).toBe("");
  });

  it("includes declared level and calibration rules", () => {
    const block = buildLearnerLevelGuidanceBlock({
      learnerDeclaredLevel: "Starters",
      exerciseTargetLevel: "Movers",
    });
    expect(block).toContain("Starters");
    expect(block).toContain("Movers");
    expect(block).toContain("modelAnswerSuggestion");
  });
});

describe("finalizeSpeakingTranscript", () => {
  it("prefers the client transcript over AI output", () => {
    expect(
      finalizeSpeakingTranscript(
        { transcript: "I go to school yesterday" },
        "I goes school yesterdays"
      )
    ).toBe("I goes school yesterdays");
  });

  it("falls back to AI transcript when client transcript is empty", () => {
    expect(
      finalizeSpeakingTranscript({ transcript: "Hello my name is Tom" }, "   ")
    ).toBe("Hello my name is Tom");
  });
});
