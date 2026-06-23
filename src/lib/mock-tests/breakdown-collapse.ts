export const BREAKDOWN_COLLAPSE_THRESHOLD = 8;

export type BreakdownCollapseView<T> = {
  visible: T[];
  hiddenCount: number;
  canCollapse: boolean;
};

/** Slice a breakdown list for collapsed collapse UX (local expand only). */
export function getBreakdownCollapseView<T>(
  items: T[],
  expanded: boolean
): BreakdownCollapseView<T> {
  const canCollapse = items.length > BREAKDOWN_COLLAPSE_THRESHOLD;
  if (!canCollapse || expanded) {
    return { visible: items, hiddenCount: 0, canCollapse };
  }
  return {
    visible: items.slice(0, BREAKDOWN_COLLAPSE_THRESHOLD),
    hiddenCount: items.length - BREAKDOWN_COLLAPSE_THRESHOLD,
    canCollapse,
  };
}
