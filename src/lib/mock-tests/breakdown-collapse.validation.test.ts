import { describe, expect, it } from "vitest";
import {
  BREAKDOWN_COLLAPSE_THRESHOLD,
  getBreakdownCollapseView,
} from "@/lib/mock-tests/breakdown-collapse";

describe("breakdown collapse view", () => {
  it("shows all items when count is within threshold", () => {
    const items = Array.from({ length: BREAKDOWN_COLLAPSE_THRESHOLD }, (_, i) => i);
    const view = getBreakdownCollapseView(items, false);
    expect(view.visible).toHaveLength(BREAKDOWN_COLLAPSE_THRESHOLD);
    expect(view.canCollapse).toBe(false);
    expect(view.hiddenCount).toBe(0);
  });

  it("collapses to first eight items until expanded", () => {
    const items = Array.from({ length: 12 }, (_, i) => i);
    const view = getBreakdownCollapseView(items, false);
    expect(view.visible).toHaveLength(BREAKDOWN_COLLAPSE_THRESHOLD);
    expect(view.hiddenCount).toBe(4);
    expect(view.canCollapse).toBe(true);

    const expanded = getBreakdownCollapseView(items, true);
    expect(expanded.visible).toHaveLength(12);
    expect(expanded.hiddenCount).toBe(0);
  });
});
