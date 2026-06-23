import { describe, expect, it } from "vitest";
import startersPracticeTest1 from "../../../data/mock-tests/starters/starters-practice-test-1.json";
import startersPracticeTest2 from "../../../data/mock-tests/starters/starters-practice-test-2.json";
import startersPracticeTest3 from "../../../data/mock-tests/starters/starters-practice-test-3.json";
import moversPracticeTest1 from "../../../data/mock-tests/movers/movers-practice-test-1.json";
import moversPracticeTest2 from "../../../data/mock-tests/movers/movers-practice-test-2.json";
import moversPracticeTest3 from "../../../data/mock-tests/movers/movers-practice-test-3.json";
import flyersPracticeTest1 from "../../../data/mock-tests/flyers/flyers-practice-test-1.json";
import flyersPracticeTest2 from "../../../data/mock-tests/flyers/flyers-practice-test-2.json";
import flyersPracticeTest3 from "../../../data/mock-tests/flyers/flyers-practice-test-3.json";
import { STARTERS_PRACTICE_MOCK_MANIFEST_EXAMPLE } from "@/lib/mock-blueprints/fixtures/starters-practice-mock-manifest.example";
import {
  validateAllYleMockBlueprints,
  validateYleMockManifest,
  validateYleMockManifestForSeeding,
} from "@/lib/mock-blueprints/yle-mock-validation";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";

const ALL_M1_MANIFESTS: Array<{ label: string; manifest: YleMockManifest; expectedCount: number }> = [
  { label: "Starters Practice Test 1", manifest: startersPracticeTest1 as YleMockManifest, expectedCount: 20 },
  { label: "Starters Practice Test 2", manifest: startersPracticeTest2 as YleMockManifest, expectedCount: 20 },
  { label: "Starters Practice Test 3", manifest: startersPracticeTest3 as YleMockManifest, expectedCount: 20 },
  { label: "Movers Practice Test 1", manifest: moversPracticeTest1 as YleMockManifest, expectedCount: 26 },
  { label: "Movers Practice Test 2", manifest: moversPracticeTest2 as YleMockManifest, expectedCount: 26 },
  { label: "Movers Practice Test 3", manifest: moversPracticeTest3 as YleMockManifest, expectedCount: 26 },
  { label: "Flyers Practice Test 1", manifest: flyersPracticeTest1 as YleMockManifest, expectedCount: 32 },
  { label: "Flyers Practice Test 2", manifest: flyersPracticeTest2 as YleMockManifest, expectedCount: 32 },
  { label: "Flyers Practice Test 3", manifest: flyersPracticeTest3 as YleMockManifest, expectedCount: 32 },
];

describe("YLE mock blueprint validation", () => {
  it("validates all registered blueprints without errors", () => {
    const result = validateAllYleMockBlueprints();
    const errors = result.issues.filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("validates the starters example manifest fixture", () => {
    const result = validateYleMockManifest(STARTERS_PRACTICE_MOCK_MANIFEST_EXAMPLE);
    expect(result.valid).toBe(true);
  });

  it.each(ALL_M1_MANIFESTS)("validates $label for seeding", ({ manifest, expectedCount }) => {
    const result = validateYleMockManifestForSeeding(manifest);
    const errors = result.issues.filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
    expect(manifest.questions).toHaveLength(expectedCount);
  });
});
