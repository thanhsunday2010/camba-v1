import { AlertTriangle } from "lucide-react";
import type { MockTestAnalyticsLabels } from "@/lib/mock-tests/mock-test-analytics-types";

interface SkillWeaknessListProps {
  items: Array<{ label: string }>;
  labels: Pick<MockTestAnalyticsLabels, "weaknesses">;
}

export function SkillWeaknessList({ items, labels }: SkillWeaknessListProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="camba-caption font-semibold text-[var(--status-needs-review)]">
        {labels.weaknesses}
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2 camba-caption text-foreground"
          >
            <AlertTriangle
              className="h-3.5 w-3.5 text-[var(--status-needs-review)] shrink-0"
              aria-hidden
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
