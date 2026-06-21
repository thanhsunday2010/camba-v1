"use client";

import { LearningUnitCard } from "@/components/learning/learning-unit-card";
import { LearningLessonCard } from "@/components/learning/learning-lesson-card";
import { unitHasSkillEntry } from "@/lib/learning/path-ui-utils";
import type { CurriculumUnitGroup } from "@/lib/learning/pivot-units";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { UnitVisualState } from "@/lib/learning/path-ui-utils";
import type { LessonWithProgress } from "@/types/learning";
import type { RefObject } from "react";

interface LearningUnitSectionLabels {
  skillNoContent: string;
  minutes: string;
  lockedHint: string;
  lockContinueLabel: string;
  unitComingSoon: string;
  comingSoon: string;
  recommended: string;
  needsReview: string;
  continueHere: string;
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
  continueLessonHref?: string | null;
  recommendedUnitRef?: RefObject<HTMLDivElement | null>;
  reviewLessonIds?: Set<string>;
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
  continueLessonHref,
  recommendedUnitRef,
  reviewLessonIds,
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

  const lessonCardLabels = {
    minutes: labels.minutes,
    lockedHint: labels.lockedHint,
    lockContinueLabel: labels.lockContinueLabel,
    stateLabels: labels.lessonStateLabels,
    ctaStart: labels.ctaStart,
    ctaContinue: labels.ctaContinue,
    ctaReview: labels.ctaReview,
    recommended: labels.recommended,
    needsReview: labels.needsReview,
  };

  const unitCardLabels = {
    unitComingSoon: labels.unitComingSoon,
    comingSoon: labels.comingSoon,
    lockedHint: labels.lockedHint,
    lockContinueLabel: labels.lockContinueLabel,
    stateLabels: labels.unitStateLabels,
    continueHere: labels.continueHere,
  };

  return (
    <div className="space-y-3">
      {visibleUnits.map((unit) => {
        const isExpanded = expandedUnit === unit.slug;
        const recommended = unit.slug === recommendedUnitSlug;
        const isRecommendedUnit = unit.slug === recommendedUnitSlug;

        return (
          <div key={unit.slug} className="space-y-2">
            <LearningUnitCard
              unit={unit}
              expanded={isExpanded}
              onToggle={() => onToggleUnit(isExpanded ? null : unit.slug)}
              recommended={recommended}
              continueLessonHref={continueLessonHref}
              unitRef={isRecommendedUnit ? recommendedUnitRef : undefined}
              labels={unitCardLabels}
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
                            continueLessonHref={continueLessonHref}
                            suppressReviewBadge={reviewLessonIds?.has(lesson.id)}
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
