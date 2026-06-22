import type { MockTestCompleteLabels } from "@/lib/mock-tests/mock-test-types";

interface MockTestSkillBreakdownProps {
  skillBreakdown: Record<string, number>;
  labels: Pick<MockTestCompleteLabels, "skillBreakdownTitle">;
}

export function MockTestSkillBreakdown({
  skillBreakdown,
  labels,
}: MockTestSkillBreakdownProps) {
  const entries = Object.entries(skillBreakdown).sort((a, b) => a[1] - b[1]);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="camba-caption font-semibold text-muted uppercase tracking-wide">
        {labels.skillBreakdownTitle}
      </p>
      <div className="space-y-2.5">
        {entries.map(([skill, percent]) => (
          <div key={skill}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="camba-caption font-medium text-foreground capitalize">
                {skill}
              </span>
              <span className="camba-caption text-muted tabular-nums">{percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  percent >= 80
                    ? "bg-success"
                    : percent >= 70
                      ? "bg-program"
                      : "bg-[var(--status-needs-review)]"
                }`}
                style={{ width: `${Math.min(100, percent)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
