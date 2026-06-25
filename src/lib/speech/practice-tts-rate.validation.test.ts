import { describe, expect, it } from "vitest";
import { getPracticeSpeechRate } from "@/lib/speech/practice-tts-rate";

describe("getPracticeSpeechRate", () => {
  it("returns slower rate for beginner English levels", () => {
    const beginner = getPracticeSpeechRate("en", "a1");
    const advanced = getPracticeSpeechRate("en", "c1");
    expect(beginner).toBeLessThan(advanced);
  });

  it("returns slower rate for lower HSK levels", () => {
    const hsk1 = getPracticeSpeechRate("zh", "hsk1");
    const hsk6 = getPracticeSpeechRate("zh", "hsk6");
    expect(hsk1).toBeLessThan(hsk6);
  });

  it("falls back to default rate for unknown level", () => {
    expect(getPracticeSpeechRate("en", "unknown")).toBe(0.9);
  });
});
