"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ContentSection, StudentPageShell } from "@/components/camba";
import { LearningPathHero } from "@/components/learning/learning-path-hero";
import { LearningLevelSwitcher } from "@/components/learning/learning-level-switcher";
import { LearningUnitSection } from "@/components/learning/learning-unit-section";
import { LearningPathEmpty } from "@/components/learning/learning-path-empty";
import { LearningReviewSection } from "@/components/learning/learning-review-section";
import {
  collectReviewLessons,
  computeLevelProgressPercent,
  findSkillSlugForLesson,
  findUnitSlugForLesson,
  getWeakestSkillSlug,
  resolveFocusLesson,
  type FocusLessonResult,
} from "@/lib/learning/path-ui-utils";
import { pivotSkillsToCurriculumUnits } from "@/lib/learning/pivot-units";
import type { SkillProgressRow, NextLessonContext } from "@/lib/queries/dashboard";
import type { Skill } from "@/types/learning";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { ReviewReasonKey, UnitVisualState } from "@/lib/learning/path-ui-utils";
import { BookOpen } from "lucide-react";
import { DashboardAiPracticeSection, type DashboardAiPracticeLabels } from "@/components/dashboard/dashboard-ai-practice-section";
import type { PracticeHistorySummary } from "@/lib/ai-practice/practice-history-types";
import type { PracticeHistoryLabels } from "@/components/ai-practice/practice-history-panel";
import { useTranslations } from "next-intl";
import { LessonUnlockBypassProvider } from "@/components/learning/lesson-unlock-bypass-context";

interface LevelOption {
  id: string;
  slug: string;
  name: string;
}

export interface LearningPathViewLabels {
  hero: import("@/components/learning/learning-path-hero").LearningPathHeroLabels;
  levelSwitcher: {
    title: string;
    selecting: string;
    current: string;
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
    lockedLessonsTitle: string;
    lockedUnitsTitle: string;
    lockedUnitsSubtitle: string;
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
  lessonUnlockBypass?: boolean;
  aiPractice?: {
    labels: DashboardAiPracticeLabels;
    writingSummary: PracticeHistorySummary;
    speakingSummary: PracticeHistorySummary;
    historyLabels: PracticeHistoryLabels;
  };
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
    lastActivityAt: null,
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
  lessonUnlockBypass = false,
  aiPractice,
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
    () => (nextLesson ? null : resolveFocusLesson(units, lessonUnlockBypass)),
    [nextLesson, units, lessonUnlockBypass]
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

  const [expandedUnit, setExpandedUnit] = useState<string | null>(firstActiveUnit);
  const focusUnitRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  const reviewItems = useMemo(
    () => collectReviewLessons(units, focusLessonId, 4, lessonUnlockBypass),
    [units, focusLessonId, lessonUnlockBypass]
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

  const displayObjective =
    nextLesson || !focusFromPath
      ? objectiveText
      : t("objectiveNextLesson", { lesson: focusFromPath.lesson.title });

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
    <LessonUnlockBypassProvider value={lessonUnlockBypass}>
      <StudentPageShell>
        <div className="camba-section-stack gap-4 sm:gap-5">
        {aiPractice && (
          <DashboardAiPracticeSection
            variant="strip"
            labels={aiPractice.labels}
            writingSummary={aiPractice.writingSummary}
            speakingSummary={aiPractice.speakingSummary}
            historyLabels={aiPractice.historyLabels}
          />
        )}

        {showUnlockAllBanner && (
          <div className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-sm text-amber-950 camba-body">
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
          compact
        />

        {levels.length > 0 && (
          <LearningLevelSwitcher
            levels={levels}
            currentLevelId={currentLevelId}
            labels={labels.levelSwitcher}
          />
        )}

        <ContentSection id="learning-journey" className="space-y-3">
          <div>
            <h2 className="camba-h3 text-foreground">{labels.units.sectionTitle}</h2>
            <p className="camba-caption text-muted mt-0.5">{labels.units.sectionSubtitle}</p>
          </div>
          <LearningUnitSection
            units={units}
            skillLabels={labels.skillLabels}
            expandedUnit={expandedUnit}
            onToggleUnit={setExpandedUnit}
            recommendedLessonId={focusLessonId}
            recommendedUnitSlug={focusUnitSlug}
            focusSkillSlug={focusSkillSlug}
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
      </div>
    </StudentPageShell>
    </LessonUnlockBypassProvider>
  );
}
