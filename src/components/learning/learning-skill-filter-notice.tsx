"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MapPin, LayoutGrid } from "lucide-react";

interface LearningSkillFilterNoticeProps {
  message: string;
  skillLabel: string;
  showAllLabel: string;
  switchSkillLabel: string;
  onShowAll: () => void;
  onSwitchSkill: () => void;
  className?: string;
}

export function LearningSkillFilterNotice({
  message,
  skillLabel,
  showAllLabel,
  switchSkillLabel,
  onShowAll,
  onSwitchSkill,
  className,
}: LearningSkillFilterNoticeProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-violet-200/80 bg-violet-50/80 px-4 py-3",
        className
      )}
      role="status"
    >
      <div className="flex items-start gap-2 min-w-0 flex-1">
        <MapPin className="h-4 w-4 shrink-0 text-[var(--status-recommended)] mt-0.5" />
        <p className="camba-caption text-foreground leading-snug">{message}</p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <Button type="button" variant="outline" size="sm" onClick={onSwitchSkill}>
          {switchSkillLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onShowAll} className="gap-1">
          <LayoutGrid className="h-3.5 w-3.5" />
          {showAllLabel}
        </Button>
      </div>
    </div>
  );
}
