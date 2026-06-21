"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ContentSection, StudentPageShell } from "@/components/camba";
import { SectionHeader } from "@/components/camba/section-header";
import { LessonCard } from "@/components/camba/cards/learning-cards";
import { LearningPathHero, type LearningPathHeroLabels } from "@/components/learning/learning-path-hero";
import { LearningLevelSwitcher } from "@/components/learning/learning-level-switcher";
import { LearningSkillNav } from "@/components/learning/learning-skill-nav";
import { LearningUnitSection } from "@/components/learning/learning-unit-section";
import { LearningPathEmpty } from "@/components/learning/learning-path-empty";
import { LearningSkillFilterNotice } from "@/components/learning/learning-skill-filter-notice";
import { LearningReviewSection } from "@/components/learning/learning-review-section";
import {
  collectReviewLessons,
  computeLevelProgressPercent,
  findLessonInUnits,
  findSkillSlugForLesson,
  findUnitSlugForLesson,
  getLessonPresentation,
  getWeakestSkillSlug,
  isLessonVisibleInSkillFilter,
} from "@/lib/learning/path-ui-utils";
import { pivotSkillsToCurriculumUnits } from "@/lib/learning/pivot-units";
import type { SkillProgressRow, NextLessonContext } from "@/lib/queries/dashboard";
import type { Skill } from "@/types/learning";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { ReviewReasonKey, UnitVisualState } from "@/lib/learning/path-ui-utils";
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
  };
  skillFilter: {
    hiddenMessage: string;
    showAll: string;
    switchSkill: string;
  };
  skillNav: {
    all: string;
  };
  skillLabels: Record<string, string>;
  review: {
    title: string;
    subtitle: string;
    weakSkillHint: string;
    stateNeedsReview: string;
    ctaReview: string;
    minutes: string;
    reasons: Record<ReviewReasonKey, string>;
  };
  units: {
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
    sectionTitle: string;
    sectionSubtitle: string;
  };
  unlockAllBanner: string;
}

interface LearningPathViewProps {
  programSlug?: string | null;
  levelName: string;
  levelSlug: string;
  currentLevelId: string;
  skills: Skill[];
  levels: LevelOption[];
  skillProgress: SkillProgressRow[];
  nextLesson: NextLessonContext | null;
  masteryLabels: Record<number, string>;
  objectiveText: string;
  labels: LearningPathViewLabels;
  showUnlockAllBanner?: boolean;
}

function buildRecommendedSubtitle(
  nextLesson: NextLessonContext,
  labels: LearningPathViewLabels["recommended"]
): string {
  return [
    nextLesson.unitTitle && `${labels.unitPrefix}: ${nextLesson.unitTitle}`,
    nextLesson.skillName && `${labels.skillPrefix}: ${nextLesson.skillName}`,
    `${nextLesson.estimated_minutes} ${labels.minutes}`,
    nextLesson.completionPercent > 0 ? `${nextLesson.completionPercent}%` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function LearningPathView({
  programSlug,
  levelName,
  levelSlug,
  currentLevelId,
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

  const recommendedLessonId = nextLesson?.id ?? null;
  const recommendedUnitSlug = recommendedLessonId
    ? findUnitSlugForLesson(units, recommendedLessonId)
    : null;
  const recommendedSkillSlug = recommendedLessonId
    ? findSkillSlugForLesson(units, recommendedLessonId) ?? nextLesson?.skillSlug ?? null
    : null;

  const firstActiveUnit =
    recommendedUnitSlug ??
    units.find((unit) => unit.hasContent)?.slug ??
    units[0]?.slug ??
    null;

  const [activeSkill, setActiveSkill] = useState("all");
  const [expandedUnit, setExpandedUnit] = useState<string | null>(firstActiveUnit);
  const recommendedUnitRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  const reviewItems = useMemo(
    () => collectReviewLessons(units, recommendedLessonId),
    [units, recommendedLessonId]
  );
  const weakestSkillSlug = useMemo(() => getWeakestSkillSlug(skillProgress), [skillProgress]);
  const weakSkillLabel = weakestSkillSlug
    ? labels.skillLabels[weakestSkillSlug] ?? weakestSkillSlug
    : null;

  const continueLessonHref = recommendedLessonId
    ? `/learning/lesson/${recommendedLessonId}`
    : null;

  const recommendedPathLesson = recommendedLessonId
    ? findLessonInUnits(units, recommendedLessonId)?.lesson ?? null
    : null;

  const presentationOptions = {
    recommendedLessonId,
    stateLabels: labels.units.lessonStateLabels,
    ctaStart: labels.units.ctaStart,
    ctaContinue: labels.units.ctaContinue,
    ctaReview: labels.units.ctaReview,
  };

  const recommendedPresentation = recommendedPathLesson
    ? getLessonPresentation(recommendedPathLesson, presentationOptions)
    : nextLesson
      ? getLessonPresentation(
          {
            id: nextLesson.id,
            unit_id: "",
            slug: "",
            title: nextLesson.title,
            description: null,
            sort_order: 0,
            estimated_minutes: nextLesson.estimated_minutes,
            unlock_after_lesson_id: null,
            progress: {
              completion_percent: nextLesson.completionPercent,
              mastery_level: nextLesson.masteryLevel,
              is_unlocked: true,
              accuracy_percent: 0,
              attempts_count: 0,
            },
          },
          presentationOptions
        )
      : null;

  const recommendedSubtitle = nextLesson
    ? buildRecommendedSubtitle(nextLesson, labels.recommended)
    : labels.recommended.subtitle;

  const recommendedHiddenByFilter =
    !!recommendedLessonId &&
    activeSkill !== "all" &&
    !isLessonVisibleInSkillFilter(recommendedLessonId, units, activeSkill);

  const recommendedSkillLabel =
    (recommendedSkillSlug && labels.skillLabels[recommendedSkillSlug]) ||
    nextLesson?.skillName ||
    recommendedSkillSlug ||
    "";

  useEffect(() => {
    if (hasScrolledRef.current || !recommendedUnitSlug || !recommendedUnitRef.current) return;
    hasScrolledRef.current = true;
    const timer = window.setTimeout(() => {
      recommendedUnitRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [recommendedUnitSlug]);

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

      {nextLesson && recommendedPresentation && (
        <ContentSection className="hidden md:block">
          <SectionHeader
            title={labels.recommended.title}
            description={recommendedSubtitle}
            icon={Sparkles}
          />
          <LessonCard
            title={nextLesson.title}
            subtitle={recommendedSubtitle}
            href={`/learning/lesson/${nextLesson.id}`}
            state={recommendedPresentation.state}
            stateLabel={recommendedPresentation.stateLabel}
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

      {recommendedHiddenByFilter && (
        <LearningSkillFilterNotice
          message={labels.skillFilter.hiddenMessage.replace(
            "{skill}",
            recommendedSkillLabel
          )}
          skillLabel={recommendedSkillLabel}
          showAllLabel={labels.skillFilter.showAll}
          switchSkillLabel={labels.skillFilter.switchSkill}
          onShowAll={() => {
            setActiveSkill("all");
            if (recommendedUnitSlug) setExpandedUnit(recommendedUnitSlug);
          }}
          onSwitchSkill={() => {
            if (recommendedSkillSlug) setActiveSkill(recommendedSkillSlug);
            if (recommendedUnitSlug) setExpandedUnit(recommendedUnitSlug);
          }}
        />
      )}

      <ContentSection id="learning-journey">
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
          recommendedLessonId={recommendedLessonId}
          recommendedUnitSlug={recommendedUnitSlug}
          continueLessonHref={continueLessonHref}
          recommendedUnitRef={recommendedUnitRef}
          masteryLabels={masteryLabels}
          labels={labels.units}
        />
      </ContentSection>

      {reviewItems.length > 0 && (
        <ContentSection>
          <LearningReviewSection
            items={reviewItems}
            masteryLabels={masteryLabels}
            weakSkillLabel={weakSkillLabel}
            labels={labels.review}
          />
        </ContentSection>
      )}
    </StudentPageShell>
  );
}
