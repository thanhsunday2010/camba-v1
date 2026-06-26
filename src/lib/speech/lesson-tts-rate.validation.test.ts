import { describe, expect, it } from "vitest";
import { getLessonSpeechRate } from "@/lib/speech/lesson-tts-rate";

describe("getLessonSpeechRate", () => {
  it("speaks slower for beginner Cambridge levels", () => {
    expect(getLessonSpeechRate("Starters")).toBeLessThan(getLessonSpeechRate("PET"));
    expect(getLessonSpeechRate("Pre-Starters")).toBeLessThan(getLessonSpeechRate("Movers"));
  });

  it("falls back to a moderate default when level is unknown", () => {
    expect(getLessonSpeechRate(undefined)).toBe(0.9);
    expect(getLessonSpeechRate("unknown-level")).toBe(0.9);
  });
});
