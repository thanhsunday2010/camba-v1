"use client";

import { LearningUnitCard } from "@/components/learning/learning-unit-card";
import { LearningLessonCard } from "@/components/learning/learning-lesson-card";
import { unitHasSkillEntry } from "@/lib/learning/path-ui-utils";
import type { CurriculumUnitGroup } from "@/lib/learning/pivot-units";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { UnitVisualState } from "@/lib/learning/path-ui-utils";
import type { LessonWithProgress } from "@/types/learning";

interface LearningUnitSectionLabels {
  skillNoContent: string;
  minutes: string;
  lockedDesc: string;
  unitComingSoon: string;
  comingSoon: string;
  recommended: string;
  recommendedUnit: string;
  lessonStateLabels: Record<LessonVisualState, string>;
  unitStateLabels: Record<UnitVisualState, string>;
  ctaStart: string;
  ctaContinue: string;
  ctaReview: string;
}

interface LearningUnitSectionProps {
  units: CurriculumUnitGroup[];
  activeSkill: string;
  expandedUnit: string | null;
  onToggleUnit: (slug: string | null) => void;
  recommendedLessonId?: string | null;
  recommendedUnitSlug?: string | null;
  masteryLabels: Record<number, string>;
  labels: LearningUnitSectionLabels;
}

export function LearningUnitSection({
  units,
  activeSkill,
  expandedUnit,
  onToggleUnit,
  recommendedLessonId,
  recommendedUnitSlug,
  masteryLabels,
  labels,
}: LearningUnitSectionProps) {
  const visibleUnits = units.filter((unit) => {
    if (activeSkill === "all") return true;
    return unitHasSkillEntry(unit, activeSkill);
  });

  if (visibleUnits.length === 0) {
    return (
      <p className="camba-body text-muted text-center py-8 rounded-2xl border border-dashed border-border">
        {labels.skillNoContent}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {visibleUnits.map((unit) => {
        const isExpanded = expandedUnit === unit.slug;
        const recommended = unit.slug === recommendedUnitSlug;

        const lessonCardLabels = {
          minutes: labels.minutes,
          lockedDesc: labels.lockedDesc,
          stateLabels: labels.lessonStateLabels,
          ctaStart: labels.ctaStart,
          ctaContinue: labels.ctaContinue,
          ctaReview: labels.ctaReview,
          recommended: labels.recommended,
        };

        return (
          <div key={unit.slug} className="space-y-2">
            <LearningUnitCard
              unit={unit}
              expanded={isExpanded}
              onToggle={() => onToggleUnit(isExpanded ? null : unit.slug)}
              recommended={recommended}
              labels={{
                unitComingSoon: labels.unitComingSoon,
                comingSoon: labels.comingSoon,
                stateLabels: labels.unitStateLabels,
                recommendedUnit: labels.recommendedUnit,
              }}
            />
            {isExpanded && (
              <div className="ml-1 sm:ml-3 space-y-3 border-l-2 border-program/15 pl-3 sm:pl-4">
                {unit.entries.map((entry) => {
                  if (activeSkill !== "all" && entry.skillSlug !== activeSkill) {
                    return null;
                  }
                  if (entry.lessons.length === 0) {
                    return (
                      <p
                        key={entry.skillSlug}
                        className="camba-caption text-muted italic py-2"
                      >
                        {labels.skillNoContent}
                      </p>
                    );
                  }
                  return (
                    <div key={entry.skillSlug} className="space-y-2">
                      {activeSkill === "all" && (
                        <h4 className="camba-caption font-semibold uppercase tracking-wide text-muted">
                          {entry.skillName}
                        </h4>
                      )}
                      <div className="space-y-2">
                        {entry.lessons.map((lesson: LessonWithProgress) => (
                          <LearningLessonCard
                            key={lesson.id}
                            lesson={lesson}
                            masteryLabels={masteryLabels}
                            recommendedLessonId={recommendedLessonId}
                            skillName={activeSkill === "all" ? undefined : entry.skillName}
                            labels={lessonCardLabels}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
