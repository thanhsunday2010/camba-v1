import { describe, expect, it } from "vitest";
import {
  MOBILE_COMPONENT_AUDIT,
  mobileAuditByStatus,
  mobileAuditNeedsWork,
  getMobileAuditEntry,
} from "@/lib/design/mobile-component-audit";
import {
  MOBILE_BREAKPOINTS,
  MOBILE_TOUCH_TARGET_MIN_PX,
  MOBILE_FORBIDDEN,
  MOBILE_LAYOUT_RULES,
} from "@/lib/design/mobile-guidelines";

describe("U8.4 Mobile foundation", () => {
  it("defines standard audit breakpoints", () => {
    expect(MOBILE_BREAKPOINTS.phone).toBe(375);
    expect(MOBILE_BREAKPOINTS.tablet).toBe(768);
    expect(MOBILE_BREAKPOINTS.desktop).toBe(1024);
  });

  it("inventory covers core student surfaces", () => {
    expect(MOBILE_COMPONENT_AUDIT.length).toBeGreaterThan(25);
    const surfaces = new Set(MOBILE_COMPONENT_AUDIT.map((e) => e.surface));
    expect(surfaces.has("Mock Take")).toBe(true);
    expect(surfaces.has("Writing AI")).toBe(true);
    expect(surfaces.has("Speaking AI")).toBe(true);
  });

  it("tracks optimized and compliant components", () => {
    const optimized = mobileAuditByStatus("optimized-u8");
    const compliant = mobileAuditByStatus("compliant");
    expect(optimized.length + compliant.length).toBeGreaterThan(15);
  });

  it("flags components needing future variants", () => {
    const needsWork = mobileAuditNeedsWork();
    expect(needsWork.every((e) => e.issue || e.notes)).toBe(true);
  });

  it("documents touch target minimum", () => {
    expect(MOBILE_TOUCH_TARGET_MIN_PX).toBeGreaterThanOrEqual(44);
    expect(MOBILE_LAYOUT_RULES.columnStrategy).toBe("single-column-first");
    expect(MOBILE_FORBIDDEN.length).toBeGreaterThan(0);
  });

  it("resolves audit entries by id", () => {
    expect(getMobileAuditEntry("mock.player")?.status).toBe("optimized-u8");
  });
});
