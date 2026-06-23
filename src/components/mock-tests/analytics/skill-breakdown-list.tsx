"use client";

import { useState } from "react";
import { SkillBreakdownBar } from "@/components/mock-tests/analytics/skill-breakdown-bar";
import { getBreakdownCollapseView } from "@/lib/mock-tests/breakdown-collapse";
import type { MockTestAnalyticsLabels } from "@/lib/mock-tests/mock-test-analytics-types";

type BreakdownItem = {
  slug: string;
  label: string;
  percent: number;
  band: import("@/lib/mock-tests/mock-test-analytics-types").SkillPerformanceBand;
};

interface SkillBreakdownListProps {
  items: BreakdownItem[];
  labels: Pick<MockTestAnalyticsLabels, "breakdownPercent" | "showAll" | "showLess">;
  listId: string;
}

export function SkillBreakdownList({ items, labels, listId }: SkillBreakdownListProps) {
  const [expanded, setExpanded] = useState(false);
  const { visible, canCollapse } = getBreakdownCollapseView(items, expanded);

  const percentLabel = (percent: number) =>
    labels.breakdownPercent.replace("{percent}", String(percent));

  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <ul id={listId} className="space-y-2.5 list-none p-0 m-0">
        {visible.map((item) => (
          <li key={item.slug}>
            <SkillBreakdownBar
              label={item.label}
              percent={item.percent}
              percentLabel={percentLabel(item.percent)}
              band={item.band}
            />
          </li>
        ))}
      </ul>
      {canCollapse && (
        <button
          type="button"
          className="camba-caption font-semibold text-program hover:underline"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? labels.showLess : labels.showAll}
        </button>
      )}
    </div>
  );
}
