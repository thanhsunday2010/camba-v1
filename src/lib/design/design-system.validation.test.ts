import { describe, expect, it } from "vitest";
import { countFindingsBySeverity, TOKEN_FINDINGS } from "@/lib/design/design-system-audit";
import { inventoryByStatus, ALL_INVENTORY } from "@/lib/design/component-inventory";
import { getDesignSystemReport } from "@/lib/design/design-system-report";
import { typographyClass, TYPOGRAPHY_CLASS } from "@/lib/design/typography";

describe("U8.1 Design system foundation", () => {
  it("exposes typography roles mapped to camba utilities", () => {
    expect(typographyClass("pageTitle")).toBe("camba-display");
    expect(typographyClass("sectionTitle")).toBe("camba-h3");
    expect(TYPOGRAPHY_CLASS.body).toBe("camba-body");
  });

  it("documents token findings with valid severities", () => {
    expect(TOKEN_FINDINGS.length).toBeGreaterThan(0);
    const total =
      countFindingsBySeverity("critical") +
      countFindingsBySeverity("high") +
      countFindingsBySeverity("medium") +
      countFindingsBySeverity("low");
    expect(total).toBe(TOKEN_FINDINGS.length);
  });

  it("inventory covers U7 surfaces", () => {
    expect(ALL_INVENTORY.length).toBeGreaterThan(30);
    expect(inventoryByStatus("preferred-u7").length).toBeGreaterThan(15);
  });

  it("builds design system report", () => {
    const report = getDesignSystemReport();
    expect(report.version).toBe("1.0.0");
    expect(report.summary.surfacesAudited).toContain("Student Portfolio (U7.5)");
    expect(report.approved.pageShell).toContain("StudentPageShell");
  });
});
