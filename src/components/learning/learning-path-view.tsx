"use client";

import { useMemo, useState } from "react";
import { ContentSection, StudentPageShell } from "@/components/camba";
import { SectionHeader } from "@/components/camba/section-header";
import { LessonCard } from "@/components/camba/cards/learning-cards";
import { LearningPathHero, type LearningPathHeroLabels } from "@/components/learning/learning-path-hero";
import { LearningLevelSwitcher } from "@/components/learning/learning-level-switcher";
import { LearningSkillNav } from "@/components/learning/learning-skill-nav";
import { LearningUnitSection } from "@/components/learning/learning-unit-section";
import { LearningPathEmpty } from "@/components/learning/learning-path-empty";
import {
  computeLevelProgressPercent,
  findUnitSlugForLesson,
} from "@/lib/learning/path-ui-utils";
import { pivotSkillsToCurriculumUnits } from "@/lib/learning/pivot-units";
import type { SkillProgressRow, NextLessonContext } from "@/lib/queries/dashboard";
import type { Skill } from "@/types/learning";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { UnitVisualState } from "@/lib/learning/path-ui-utils";
import { BookOpen, Sparkles } from "lucide-react";

interface LevelOption {
  id: string;
  slug: string;
  name: string;
}

export interface LearningPathViewLabels {
  hero: LearningPathHeroLabels;
  levelSwitcher: {
    title: string;
    selecting: string;
    current: string;
  };
  recommended: {
    title: string;
    subtitle: string;
    skillPrefix: string;
    unitPrefix: string;
    minutes: string;
    recommended: string;
    inProgress: string;
    notStarted: string;
  };
  skillNav: {
    all: string;
  };
  skillLabels: Record<string, string>;
  units: {
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
    sectionTitle: string;
    sectionSubtitle: string;
  };
  unlockAllBanner: string;
}

interface LearningPathViewProps {
  programSlug?: string | null;
  levelName: string;
  levelSlug: string;
  skills: Skill[];
  levels: LevelOption[];
  skillProgress: SkillProgressRow[];
  nextLesson: NextLessonContext | null;
  masteryLabels: Record<number, string>;
  objectiveText: string;
  labels: LearningPathViewLabels;
  showUnlockAllBanner?: boolean;
}

function lessonStateFromNext(completion: number): LessonVisualState {
  if (completion <= 0) return "recommended";
  if (completion >= 100) return "completed";
  return "in-progress";
}

function lessonStateLabel(
  completion: number,
  labels: LearningPathViewLabels["recommended"]
): string {
  if (completion <= 0) return labels.notStarted;
  if (completion >= 100) return labels.inProgress;
  return labels.inProgress;
}

export function LearningPathView({
  programSlug,
  levelName,
  levelSlug,
  skills,
  levels,
  skillProgress,
  nextLesson,
  masteryLabels,
  objectiveText,
  labels,
  showUnlockAllBanner,
}: LearningPathViewProps) {
  const units = useMemo(() => pivotSkillsToCurriculumUnits(skills), [skills]);
  const levelProgressPercent = useMemo(() => computeLevelProgressPercent(units), [units]);
  const lessonCount = useMemo(
    () => units.reduce((sum, unit) => sum + unit.lessonCount, 0),
    [units]
  );
  const unitsWithContent = units.filter((unit) => unit.hasContent).length;
  const recommendedUnitSlug = nextLesson
    ? findUnitSlugForLesson(units, nextLesson.id)
    : null;

  const firstActiveUnit =
    recommendedUnitSlug ??
    units.find((unit) => unit.hasContent)?.slug ??
    units[0]?.slug ??
    null;

  const [activeSkill, setActiveSkill] = useState("all");
  const [expandedUnit, setExpandedUnit] = useState<string | null>(firstActiveUnit);

  const recommendedSubtitle = nextLesson
    ? [
        nextLesson.unitTitle && `${labels.recommended.unitPrefix}: ${nextLesson.unitTitle}`,
        nextLesson.skillName && `${labels.recommended.skillPrefix}: ${nextLesson.skillName}`,
        `${nextLesson.estimated_minutes} ${labels.recommended.minutes}`,
        nextLesson.completionPercent > 0 ? `${nextLesson.completionPercent}%` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : labels.recommended.subtitle;

  if (units.length === 0) {
    return (
      <StudentPageShell narrow>
        <LearningPathEmpty
          icon={BookOpen}
          title={labels.units.sectionTitle}
          description={labels.units.skillNoContent}
        />
      </StudentPageShell>
    );
  }

  const currentLevelId = levels.find((level) => level.slug === levelSlug)?.id ?? null;

  return (
    <StudentPageShell>
      {showUnlockAllBanner && (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 camba-body">
          {labels.unlockAllBanner}
        </div>
      )}

      <LearningPathHero
        programSlug={programSlug}
        levelName={levelName}
        levelSlug={levelSlug}
        levelProgressPercent={levelProgressPercent}
        unitCount={units.length}
        unitsWithContent={unitsWithContent}
        lessonCount={lessonCount}
        nextLesson={nextLesson}
        objectiveText={objectiveText}
        labels={labels.hero}
      />

      {nextLesson && (
        <ContentSection>
          <SectionHeader
            title={labels.recommended.title}
            description={recommendedSubtitle}
            icon={Sparkles}
          />
          <LessonCard
            title={nextLesson.title}
            subtitle={recommendedSubtitle}
            href={`/learning/lesson/${nextLesson.id}`}
            state={lessonStateFromNext(nextLesson.completionPercent)}
            stateLabel={lessonStateLabel(nextLesson.completionPercent, labels.recommended)}
            masteryLevel={nextLesson.masteryLevel}
            masteryLabel={masteryLabels[nextLesson.masteryLevel]}
            recommended
          />
        </ContentSection>
      )}

      {levels.length > 0 && (
        <LearningLevelSwitcher
          levels={levels}
          currentLevelId={currentLevelId}
          labels={labels.levelSwitcher}
        />
      )}

      {skillProgress.length > 0 && (
        <ContentSection>
          <LearningSkillNav
            skills={skillProgress}
            activeSkill={activeSkill}
            onChange={setActiveSkill}
            skillLabels={labels.skillLabels}
            allLabel={labels.skillNav.all}
          />
        </ContentSection>
      )}

      <ContentSection>
        <SectionHeader
          title={labels.units.sectionTitle}
          description={labels.units.sectionSubtitle}
          icon={BookOpen}
        />
        <LearningUnitSection
          units={units}
          activeSkill={activeSkill}
          expandedUnit={expandedUnit}
          onToggleUnit={setExpandedUnit}
          recommendedLessonId={nextLesson?.id}
          recommendedUnitSlug={recommendedUnitSlug}
          masteryLabels={masteryLabels}
          labels={labels.units}
        />
      </ContentSection>
    </StudentPageShell>
  );
}
