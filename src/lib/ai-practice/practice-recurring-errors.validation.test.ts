import { describe, expect, it } from "vitest";
import { extractRecurringErrors } from "@/lib/ai-practice/practice-recurring-errors";

describe("extractRecurringErrors", () => {
  it("returns most frequent wrong fragments", () => {
    const result = extractRecurringErrors([
      ["[go]{went} — past tense", "[goes]{go} — subject"],
      ["[go]{went} — again"],
    ]);
    expect(result[0]).toBe("go");
  });
});
