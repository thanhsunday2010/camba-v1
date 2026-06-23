import { Check } from "lucide-react";
import type { MockTestAnalyticsLabels } from "@/lib/mock-tests/mock-test-analytics-types";

interface SkillStrengthListProps {
  items: Array<{ label: string }>;
  labels: Pick<MockTestAnalyticsLabels, "strengths">;
}

export function SkillStrengthList({ items, labels }: SkillStrengthListProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="camba-caption font-semibold text-success">{labels.strengths}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2 camba-caption text-foreground"
          >
            <Check className="h-3.5 w-3.5 text-success shrink-0" aria-hidden />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
