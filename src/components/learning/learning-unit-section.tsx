"use client";

import { LearningUnitCard } from "@/components/learning/learning-unit-card";
import { LearningUnitLessonsPanel } from "@/components/learning/learning-unit-lessons-panel";
import {
  LearningLockedUnitsDropdown,
  partitionUnitsByAccess,
} from "@/components/learning/learning-locked-units-dropdown";
import type { CurriculumUnitGroup } from "@/lib/learning/pivot-units";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { UnitVisualState } from "@/lib/learning/path-ui-utils";
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
  lockedLessonsTitle: string;
  lockedUnitsTitle: string;
  lockedUnitsSubtitle: string;
  lessonStateLabels: Record<LessonVisualState, string>;
  unitStateLabels: Record<UnitVisualState, string>;
  ctaStart: string;
  ctaContinue: string;
  ctaReview: string;
}

interface LearningUnitSectionProps {
  units: CurriculumUnitGroup[];
  skillLabels: Record<string, string>;
  expandedUnit: string | null;
  onToggleUnit: (slug: string | null) => void;
  recommendedLessonId?: string | null;
  recommendedUnitSlug?: string | null;
  focusSkillSlug?: string | null;
  continueLessonHref?: string | null;
  recommendedUnitRef?: RefObject<HTMLDivElement | null>;
  reviewLessonIds?: Set<string>;
  masteryLabels: Record<number, string>;
  labels: LearningUnitSectionLabels;
}

export function LearningUnitSection({
  units,
  skillLabels,
  expandedUnit,
  onToggleUnit,
  recommendedLessonId,
  recommendedUnitSlug,
  focusSkillSlug,
  continueLessonHref,
  recommendedUnitRef,
  reviewLessonIds,
  masteryLabels,
  labels,
}: LearningUnitSectionProps) {
  const { accessible, locked } = partitionUnitsByAccess(units);

  if (accessible.length === 0 && locked.length === 0) {
    return (
      <p className="camba-body text-muted text-center py-6 rounded-xl border border-dashed border-border">
        {labels.skillNoContent}
      </p>
    );
  }

  const unitCardLabels = {
    unitComingSoon: labels.unitComingSoon,
    comingSoon: labels.comingSoon,
    lockedHint: labels.lockedHint,
    lockContinueLabel: labels.lockContinueLabel,
    stateLabels: labels.unitStateLabels,
    continueHere: labels.continueHere,
  };

  const lessonsPanelLabels = {
    skillNoContent: labels.skillNoContent,
    minutes: labels.minutes,
    lockedHint: labels.lockedHint,
    lockContinueLabel: labels.lockContinueLabel,
    recommended: labels.recommended,
    needsReview: labels.needsReview,
    lockedLessonsTitle: labels.lockedLessonsTitle,
    lessonStateLabels: labels.lessonStateLabels,
    ctaStart: labels.ctaStart,
    ctaContinue: labels.ctaContinue,
    ctaReview: labels.ctaReview,
  };

  return (
    <div className="space-y-2.5">
      {accessible.map((unit) => {
        const isExpanded = expandedUnit === unit.slug;
        const recommended = unit.slug === recommendedUnitSlug;

        return (
          <div key={unit.slug} className="space-y-0">
            <LearningUnitCard
              unit={unit}
              expanded={isExpanded}
              onToggle={() => onToggleUnit(isExpanded ? null : unit.slug)}
              recommended={recommended}
              continueLessonHref={continueLessonHref}
              unitRef={recommended ? recommendedUnitRef : undefined}
              labels={unitCardLabels}
              compact
            />
            {isExpanded && (
              <div className="mt-2 ml-2 sm:ml-3 pl-3 sm:pl-4 border-l-2 border-program/15">
                <LearningUnitLessonsPanel
                  unit={unit}
                  skillLabels={skillLabels}
                  initialSkillSlug={
                    recommended && focusSkillSlug ? focusSkillSlug : null
                  }
                  recommendedLessonId={recommendedLessonId}
                  continueLessonHref={continueLessonHref}
                  reviewLessonIds={reviewLessonIds}
                  masteryLabels={masteryLabels}
                  labels={lessonsPanelLabels}
                />
              </div>
            )}
          </div>
        );
      })}

      <LearningLockedUnitsDropdown
        units={locked}
        title={labels.lockedUnitsTitle}
        subtitle={labels.lockedUnitsSubtitle}
        continueLessonHref={continueLessonHref}
        labels={unitCardLabels}
      />
    </div>
  );
}
