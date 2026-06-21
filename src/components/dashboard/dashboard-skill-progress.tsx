import {
  BookOpen,
  BookText,
  Ear,
  FileText,
  Mic,
  PenLine,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { SkillProgressRow } from "@/lib/queries/dashboard";
import { SectionHeader } from "@/components/camba/section-header";
import { SkillCard } from "@/components/camba/cards/learning-cards";
import { SkillShieldProgress } from "@/components/camba/cambridge/shield-progress";
import { EmptyStateIllustrated } from "@/components/camba/empty-state-illustrated";

const SKILL_ICONS: Record<string, LucideIcon> = {
  vocabulary: BookOpen,
  grammar: BookText,
  reading: FileText,
  listening: Ear,
  writing: PenLine,
  speaking: Mic,
};

interface DashboardSkillProgressProps {
  skills: SkillProgressRow[];
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  skillLabels: Record<string, string>;
  shieldProgress?: Record<string, number> | null;
}

export function DashboardSkillProgress({
  skills,
  title,
  emptyTitle,
  emptyDescription,
  skillLabels,
  shieldProgress,
}: DashboardSkillProgressProps) {
  const withProgress = skills.filter((s) => s.progressPercent > 0);

  if (skills.length === 0) {
    return (
      <EmptyStateIllustrated
        icon={Sparkles}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div>
      <SectionHeader title={title} icon={Sparkles} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => {
          const Icon = SKILL_ICONS[skill.slug] ?? BookOpen;
          const label = skillLabels[skill.slug] ?? skill.name;
          return (
            <SkillCard
              key={skill.slug}
              skillLabel={label}
              progress={skill.progressPercent}
              icon={Icon}
            />
          );
        })}
      </div>
      {withProgress.length > 0 && (
        <div className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-4">
          {skills.map((skill) => {
            const stored = shieldProgress?.[skill.slug];
            const filledSegments =
              typeof stored === "number"
                ? Math.min(5, stored)
                : Math.min(5, Math.round(skill.progressPercent / 20));
            return (
            <SkillShieldProgress
              key={`shield-${skill.slug}`}
              skillLabel={skillLabels[skill.slug] ?? skill.name}
              filledSegments={filledSegments}
            />
          );
          })}
        </div>
      )}
    </div>
  );
}
