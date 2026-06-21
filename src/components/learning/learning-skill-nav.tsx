"use client";

import {
  BookOpen,
  BookText,
  Ear,
  FileText,
  LayoutGrid,
  Mic,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillProgressRow } from "@/lib/queries/dashboard";

const SKILL_ICONS: Record<string, LucideIcon> = {
  vocabulary: BookOpen,
  grammar: BookText,
  reading: FileText,
  listening: Ear,
  writing: PenLine,
  speaking: Mic,
};

interface LearningSkillNavProps {
  skills: SkillProgressRow[];
  activeSkill: string;
  onChange: (skillSlug: string) => void;
  skillLabels: Record<string, string>;
  allLabel: string;
  className?: string;
}

export function LearningSkillNav({
  skills,
  activeSkill,
  onChange,
  skillLabels,
  allLabel,
  className,
}: LearningSkillNavProps) {
  const tabs = [
    { slug: "all", name: allLabel, progressPercent: 0, icon: LayoutGrid },
    ...skills.map((skill) => ({
      slug: skill.slug,
      name: skillLabels[skill.slug] ?? skill.name,
      progressPercent: skill.progressPercent,
      icon: SKILL_ICONS[skill.slug] ?? BookOpen,
    })),
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory"
        role="tablist"
        aria-label={allLabel}
      >
        {tabs.map((tab) => {
          const active = activeSkill === tab.slug;
          const Icon = tab.icon;
          return (
            <button
              key={tab.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.slug)}
              className={cn(
                "snap-start shrink-0 flex flex-col items-start gap-1 rounded-2xl border px-3 py-2.5 min-w-[7rem] camba-focus-ring transition-all",
                active
                  ? "border-program bg-program-muted shadow-sm ring-1 ring-program/20"
                  : "border-border bg-card hover:border-program/25"
              )}
            >
              <div className="flex items-center gap-1.5 w-full">
                <Icon
                  className={cn("h-4 w-4 shrink-0", active ? "text-program" : "text-muted")}
                />
                <span
                  className={cn(
                    "text-xs font-semibold truncate capitalize",
                    active ? "text-foreground" : "text-muted"
                  )}
                >
                  {tab.name}
                </span>
              </div>
              {tab.slug !== "all" && (
                <div className="w-full">
                  <div className="h-1 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-program transition-all"
                      style={{ width: `${tab.progressPercent}%` }}
                    />
                  </div>
                  <span className="camba-caption text-muted mt-0.5 block">
                    {tab.progressPercent}%
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
