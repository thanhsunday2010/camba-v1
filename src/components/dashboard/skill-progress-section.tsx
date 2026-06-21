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
import { ProgressRing } from "@/components/camba/progress-ring";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { cn } from "@/lib/utils";

const SKILL_ICONS: Record<string, LucideIcon> = {
  vocabulary: BookOpen,
  grammar: BookText,
  reading: FileText,
  listening: Ear,
  writing: PenLine,
  speaking: Mic,
};

interface SkillProgressSectionProps {
  skills: SkillProgressRow[];
  labels: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    focusLabel: string;
    strongLabel: string;
    shieldBySkill: string;
    emptyAction: string;
  };
  skillLabels: Record<string, string>;
  shieldProgress?: Record<string, number> | null;
}

export function SkillProgressSection({
  skills,
  labels,
  skillLabels,
  shieldProgress,
}: SkillProgressSectionProps) {
  if (skills.length === 0) {
    return (
      <section>
        <SectionHeader title={labels.title} description={labels.subtitle} icon={Sparkles} />
        <DashboardEmptyState
          icon={Sparkles}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      </section>
    );
  }

  const sorted = [...skills].sort((a, b) => b.progressPercent - a.progressPercent);
  const strongest = sorted[0];
  const weakest = sorted.filter((s) => s.progressPercent > 0).pop() ?? sorted[sorted.length - 1];

  return (
    <section aria-labelledby="skill-progress-heading">
      <SectionHeader title={labels.title} description={labels.subtitle} icon={Sparkles} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => {
          const Icon = SKILL_ICONS[skill.slug] ?? BookOpen;
          const label = skillLabels[skill.slug] ?? skill.name;
          const isStrong = skill.slug === strongest?.slug && skill.progressPercent >= 50;
          const isFocus =
            skill.slug === weakest?.slug &&
            skill.progressPercent < 50 &&
            skill.progressPercent >= 0;

          return (
            <SkillCard
              key={skill.slug}
              skillLabel={label}
              progress={skill.progressPercent}
              masteryLabel={
                isStrong
                  ? labels.strongLabel
                  : isFocus
                    ? labels.focusLabel
                    : undefined
              }
              icon={Icon}
              className={cn(
                isStrong && "ring-1 ring-success/25",
                isFocus && "ring-1 ring-[var(--status-recommended)]/30"
              )}
            />
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <p className="camba-caption text-muted font-semibold uppercase tracking-wide">
            {labels.shieldBySkill}
          </p>
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
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border bg-card p-4">
          {sorted.slice(0, 3).map((skill) => (
            <ProgressRing
              key={`ring-${skill.slug}`}
              value={skill.progressPercent}
              label={`${skill.progressPercent}%`}
              sublabel={skillLabels[skill.slug] ?? skill.name}
              size={72}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
