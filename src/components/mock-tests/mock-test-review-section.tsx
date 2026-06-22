import { getWeakSkillsFromBreakdown } from "@/lib/mock-tests/mock-test-ui-utils";
import type { MockTestReviewLabels } from "@/lib/mock-tests/mock-test-types";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface MockTestReviewSectionProps {
  skillBreakdown: Record<string, number>;
  labels: MockTestReviewLabels;
  onReviewSkill?: (skill: string) => void;
}

export function MockTestReviewSection({
  skillBreakdown,
  labels,
  onReviewSkill,
}: MockTestReviewSectionProps) {
  const weakSkills = getWeakSkillsFromBreakdown(skillBreakdown);

  if (weakSkills.length === 0) return null;

  const skillList = weakSkills.join(", ");

  return (
    <div className="rounded-2xl border border-orange-200/60 bg-orange-50/70 px-4 py-3 space-y-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[var(--status-needs-review)]" />
        <div className="min-w-0 flex-1">
          <p className="camba-body font-medium text-foreground">{labels.title}</p>
          <p className="camba-caption text-muted mt-1">
            {labels.weakSkill.replace("{skills}", skillList)}
          </p>
          <p className="camba-caption text-muted mt-1">{labels.retakeHint}</p>
        </div>
      </div>
      {onReviewSkill && (
        <div className="flex flex-wrap gap-2 pl-6">
          {weakSkills.map((skill) => (
            <Button
              key={skill}
              type="button"
              variant="outline"
              size="sm"
              className="capitalize"
              onClick={() => onReviewSkill(skill)}
            >
              {labels.reviewSkillAction.replace("{skill}", skill)}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
