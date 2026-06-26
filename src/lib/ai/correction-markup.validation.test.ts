import { describe, expect, it } from "vitest";
import {
  hasCorrectionMarkup,
  parseCorrectionMarkup,
  parseErrorCorrectionLine,
} from "@/lib/ai/correction-markup";

describe("correction-markup", () => {
  it("parses inline [wrong]{right} segments", () => {
    expect(parseCorrectionMarkup("The boy [go]{goes} to school.")).toEqual([
      { type: "text", value: "The boy " },
      { type: "correction", error: "go", correction: "goes" },
      { type: "text", value: " to school." },
    ]);
  });

  it("returns plain text when no markup", () => {
    expect(parseCorrectionMarkup("Plain answer.")).toEqual([
      { type: "text", value: "Plain answer." },
    ]);
  });

  it("parses bracket markup error lines", () => {
    expect(parseErrorCorrectionLine("[go]{goes}")).toEqual({
      error: "go",
      correction: "goes",
    });
  });

  it("parses arrow error lines", () => {
    expect(parseErrorCorrectionLine("go → goes")).toEqual({
      error: "go",
      correction: "goes",
    });
  });

  it("detects markup presence", () => {
    expect(hasCorrectionMarkup("fix [a]{b}")).toBe(true);
    expect(hasCorrectionMarkup("plain")).toBe(false);
  });
});
