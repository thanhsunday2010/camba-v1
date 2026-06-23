import { describe, expect, it } from "vitest";
import { STARTERS_PRACTICE_MOCK_MANIFEST_EXAMPLE } from "@/lib/mock-blueprints/fixtures/starters-practice-mock-manifest.example";
import {
  validateAllYleMockBlueprints,
  validateYleMockManifest,
  validateYleMockManifestForSeeding,
} from "@/lib/mock-blueprints/yle-mock-validation";
import { ITEM_BANK_TEST_MANIFEST } from "@/lib/item-bank/fixtures/item-bank-test-manifest";

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

  it("validates inline item-bank test manifest for seeding", () => {
    const result = validateYleMockManifestForSeeding(ITEM_BANK_TEST_MANIFEST);
    const errors = result.issues.filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
    expect(ITEM_BANK_TEST_MANIFEST.questions).toHaveLength(2);
  });
});
