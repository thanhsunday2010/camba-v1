"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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
  resolveFocusLesson,
  type FocusLessonResult,
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
    showAll: string;
  };
  skillNav: {
    all: string;
  };
  skillLabels: Record<string, string>;
  review: {
    title: string;
    subtitle: string;
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
  lesson: NextLessonContext,
  labels: LearningPathViewLabels["recommended"]
): string {
  return [
    lesson.unitTitle && `${labels.unitPrefix}: ${lesson.unitTitle}`,
    lesson.skillName && `${labels.skillPrefix}: ${lesson.skillName}`,
    `${lesson.estimated_minutes} ${labels.minutes}`,
    lesson.completionPercent > 0 ? `${lesson.completionPercent}%` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function focusToNextContext(focus: FocusLessonResult): NextLessonContext {
  return {
    id: focus.lesson.id,
    title: focus.lesson.title,
    estimated_minutes: focus.lesson.estimated_minutes,
    unitTitle: focus.unitTitle,
    skillSlug: focus.skillSlug,
    skillName: focus.skillName,
    completionPercent: focus.lesson.progress?.completion_percent ?? 0,
    masteryLevel: focus.lesson.progress?.mastery_level ?? 0,
  };
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
  const t = useTranslations("learning");
  const units = useMemo(() => pivotSkillsToCurriculumUnits(skills), [skills]);
  const levelProgressPercent = useMemo(() => computeLevelProgressPercent(units), [units]);
  const lessonCount = useMemo(
    () => units.reduce((sum, unit) => sum + unit.lessonCount, 0),
    [units]
  );
  const unitsWithContent = units.filter((unit) => unit.hasContent).length;

  const focusFromPath = useMemo(
    () => (nextLesson ? null : resolveFocusLesson(units)),
    [nextLesson, units]
  );

  const displayLesson: NextLessonContext | null = nextLesson
    ? nextLesson
    : focusFromPath
      ? focusToNextContext(focusFromPath)
      : null;

  const focusLessonId = displayLesson?.id ?? null;
  const focusUnitSlug = focusLessonId
    ? findUnitSlugForLesson(units, focusLessonId)
    : null;
  const focusSkillSlug = focusLessonId
    ? findSkillSlugForLesson(units, focusLessonId) ?? displayLesson?.skillSlug ?? null
    : null;

  const firstActiveUnit =
    focusUnitSlug ??
    units.find((unit) => unit.hasContent)?.slug ??
    units[0]?.slug ??
    null;

  const [activeSkill, setActiveSkill] = useState("all");
  const [expandedUnit, setExpandedUnit] = useState<string | null>(firstActiveUnit);
  const focusUnitRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  const reviewItems = useMemo(
    () => collectReviewLessons(units, focusLessonId),
    [units, focusLessonId]
  );
  const reviewLessonIds = useMemo(
    () => new Set(reviewItems.map((item) => item.lesson.id)),
    [reviewItems]
  );

  const weakestSkillSlug = useMemo(() => getWeakestSkillSlug(skillProgress), [skillProgress]);
  const weakSkillLabel = weakestSkillSlug
    ? labels.skillLabels[weakestSkillSlug] ?? weakestSkillSlug
    : null;

  const continueLessonHref = focusLessonId
    ? `/learning/lesson/${focusLessonId}`
    : null;

  const focusPathLesson = focusLessonId
    ? findLessonInUnits(units, focusLessonId)?.lesson ?? null
    : null;

  const presentationOptions = {
    recommendedLessonId: focusLessonId,
    stateLabels: labels.units.lessonStateLabels,
    ctaStart: labels.units.ctaStart,
    ctaContinue: labels.units.ctaContinue,
    ctaReview: labels.units.ctaReview,
  };

  const focusPresentation = focusPathLesson
    ? getLessonPresentation(focusPathLesson, presentationOptions)
    : null;

  const recommendedSubtitle = displayLesson
    ? buildRecommendedSubtitle(displayLesson, labels.recommended)
    : labels.recommended.subtitle;

  const displayObjective =
    nextLesson || !focusFromPath
      ? objectiveText
      : t("objectiveNextLesson", { lesson: focusFromPath.lesson.title });

  const focusHiddenByFilter =
    !!focusLessonId &&
    activeSkill !== "all" &&
    !isLessonVisibleInSkillFilter(focusLessonId, units, activeSkill);

  const focusSkillLabel =
    (focusSkillSlug && labels.skillLabels[focusSkillSlug]) ||
    displayLesson?.skillName ||
    focusSkillSlug ||
    "";

  useEffect(() => {
    if (hasScrolledRef.current || !focusUnitSlug || !focusUnitRef.current) return;
    hasScrolledRef.current = true;
    const timer = window.setTimeout(() => {
      focusUnitRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [focusUnitSlug]);

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
        nextLesson={displayLesson}
        objectiveText={displayObjective}
        labels={labels.hero}
      />

      {displayLesson && focusPresentation && focusPathLesson && (
        <ContentSection className="hidden md:block">
          <SectionHeader
            title={labels.recommended.title}
            description={recommendedSubtitle}
            icon={Sparkles}
          />
          <LessonCard
            title={displayLesson.title}
            subtitle={recommendedSubtitle}
            href={`/learning/lesson/${displayLesson.id}`}
            state={focusPresentation.state}
            stateLabel={focusPresentation.stateLabel}
            masteryLevel={displayLesson.masteryLevel}
            masteryLabel={masteryLabels[displayLesson.masteryLevel]}
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

      {focusHiddenByFilter && (
        <LearningSkillFilterNotice
          message={t("skillFilterHidden", { skill: focusSkillLabel })}
          skillLabel={focusSkillLabel}
          showAllLabel={labels.skillFilter.showAll}
          switchSkillLabel={t("skillFilterSwitch", { skill: focusSkillLabel })}
          onShowAll={() => {
            setActiveSkill("all");
            if (focusUnitSlug) setExpandedUnit(focusUnitSlug);
          }}
          onSwitchSkill={() => {
            if (focusSkillSlug) setActiveSkill(focusSkillSlug);
            if (focusUnitSlug) setExpandedUnit(focusUnitSlug);
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
          recommendedLessonId={focusLessonId}
          recommendedUnitSlug={focusUnitSlug}
          continueLessonHref={continueLessonHref}
          recommendedUnitRef={focusUnitRef}
          reviewLessonIds={reviewLessonIds}
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
