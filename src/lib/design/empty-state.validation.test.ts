import { describe, expect, it } from "vitest";
import {
  EMPTY_STATE_INVENTORY,
  inventoryByCategory,
  inventoryBySeverity,
  getEmptyStateEntry,
} from "@/lib/design/empty-state-inventory";
import {
  EMPTY_STATE_RULES,
  FORBIDDEN_EMPTY_STATE_PHRASES,
  APPROVED_EMPTY_STATE_CTAS,
} from "@/lib/design/empty-state-guidelines";

describe("U8.3 Empty state foundation", () => {
  it("inventory covers all major student surfaces", () => {
    expect(EMPTY_STATE_INVENTORY.length).toBeGreaterThan(25);
    const categories = new Set(EMPTY_STATE_INVENTORY.map((e) => e.category));
    expect(categories.has("learning")).toBe(true);
    expect(categories.has("mockTests")).toBe(true);
    expect(categories.has("analytics")).toBe(true);
    expect(categories.has("achievements")).toBe(true);
    expect(categories.has("portfolio")).toBe(true);
  });

  it("classifies entries by severity", () => {
    const critical = inventoryBySeverity("critical");
    expect(critical.length).toBeGreaterThan(0);
    expect(critical.every((e) => e.severity === "critical")).toBe(true);
  });

  it("groups inventory by category", () => {
    expect(inventoryByCategory("filters").length).toBeGreaterThan(0);
    expect(inventoryByCategory("errorRecovery").length).toBe(1);
  });

  it("resolves entries by id", () => {
    expect(getEmptyStateEntry("dashboard.recent-activity")?.component).toBe(
      "FeatureEmptyState"
    );
  });

  it("documents design rules and forbidden phrases", () => {
    expect(EMPTY_STATE_RULES.mustInclude.length).toBeGreaterThanOrEqual(4);
    expect(FORBIDDEN_EMPTY_STATE_PHRASES).toContain("no data");
    expect(APPROVED_EMPTY_STATE_CTAS).toContain("Start learning");
  });
});
