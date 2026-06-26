"use client";

import { useEffect, useMemo, useState } from "react";
import { AppTabs } from "@/components/camba/primitives/app-tabs";
import {
  DashboardSlideItem,
  DashboardSlideStrip,
} from "@/components/dashboard/dashboard-slide-strip";
import { LearningLessonCard } from "@/components/learning/learning-lesson-card";
import { isLessonUnlockedFromProgress } from "@/lib/learning/unlock";
import type { CurriculumUnitGroup } from "@/lib/learning/pivot-units";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { LessonWithProgress } from "@/types/learning";
import { ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDE_THRESHOLD = 4;

interface LearningUnitLessonsPanelLabels {
  skillNoContent: string;
  minutes: string;
  lockedHint: string;
  lockContinueLabel: string;
  recommended: string;
  needsReview: string;
  lockedLessonsTitle: string;
  lessonStateLabels: Record<LessonVisualState, string>;
  ctaStart: string;
  ctaContinue: string;
  ctaReview: string;
}

interface LearningUnitLessonsPanelProps {
  unit: CurriculumUnitGroup;
  skillLabels: Record<string, string>;
  initialSkillSlug?: string | null;
  recommendedLessonId?: string | null;
  continueLessonHref?: string | null;
  reviewLessonIds?: Set<string>;
  masteryLabels: Record<number, string>;
  labels: LearningUnitLessonsPanelLabels;
}

export function LearningUnitLessonsPanel({
  unit,
  skillLabels,
  initialSkillSlug,
  recommendedLessonId,
  continueLessonHref,
  reviewLessonIds,
  masteryLabels,
  labels,
}: LearningUnitLessonsPanelProps) {
  const entriesWithLessons = useMemo(
    () => unit.entries.filter((entry) => entry.lessons.length > 0),
    [unit.entries]
  );

  const defaultSkill =
    (initialSkillSlug &&
      entriesWithLessons.some((entry) => entry.skillSlug === initialSkillSlug) &&
      initialSkillSlug) ||
    entriesWithLessons[0]?.skillSlug ||
    "";

  const [activeSkill, setActiveSkill] = useState(defaultSkill);

  useEffect(() => {
    if (
      initialSkillSlug &&
      entriesWithLessons.some((entry) => entry.skillSlug === initialSkillSlug)
    ) {
      setActiveSkill(initialSkillSlug);
    }
  }, [initialSkillSlug, entriesWithLessons]);

  const skillTabs = entriesWithLessons.map((entry) => ({
    id: entry.skillSlug,
    label: skillLabels[entry.skillSlug] ?? entry.skillName,
  }));

  const activeEntry = entriesWithLessons.find((entry) => entry.skillSlug === activeSkill);
  const lessons = activeEntry?.lessons ?? [];

  const unlockedLessons = lessons.filter((lesson) =>
    isLessonUnlockedFromProgress(lesson.progress)
  );
  const lockedLessons = lessons.filter(
    (lesson) => !isLessonUnlockedFromProgress(lesson.progress)
  );

  const useSlide = unlockedLessons.length > SLIDE_THRESHOLD;

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

  if (entriesWithLessons.length === 0) {
    return (
      <p className="camba-caption text-muted italic py-2">{labels.skillNoContent}</p>
    );
  }

  return (
    <div className="space-y-3">
      {skillTabs.length > 1 && (
        <AppTabs
          tabs={skillTabs}
          activeId={activeSkill}
          onChange={setActiveSkill}
          className="gap-1 [&_button]:min-h-8 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-xs"
        />
      )}

      {lessons.length === 0 ? (
        <p className="camba-caption text-muted italic py-1">{labels.skillNoContent}</p>
      ) : (
        <>
          {unlockedLessons.length > 0 && (
            <LessonGridOrStrip
              lessons={unlockedLessons}
              useSlide={useSlide}
              slideLabel={skillTabs.find((tab) => tab.id === activeSkill)?.label ?? "Lessons"}
              masteryLabels={masteryLabels}
              recommendedLessonId={recommendedLessonId}
              continueLessonHref={continueLessonHref}
              reviewLessonIds={reviewLessonIds}
              lessonCardLabels={lessonCardLabels}
            />
          )}

          {lockedLessons.length > 0 && (
            <LockedLessonsDropdown
              lessons={lockedLessons}
              title={labels.lockedLessonsTitle}
              count={lockedLessons.length}
              masteryLabels={masteryLabels}
              recommendedLessonId={recommendedLessonId}
              continueLessonHref={continueLessonHref}
              reviewLessonIds={reviewLessonIds}
              lessonCardLabels={lessonCardLabels}
            />
          )}
        </>
      )}
    </div>
  );
}

function LessonGridOrStrip({
  lessons,
  useSlide,
  slideLabel,
  masteryLabels,
  recommendedLessonId,
  continueLessonHref,
  reviewLessonIds,
  lessonCardLabels,
}: {
  lessons: LessonWithProgress[];
  useSlide: boolean;
  slideLabel: string;
  masteryLabels: Record<number, string>;
  recommendedLessonId?: string | null;
  continueLessonHref?: string | null;
  reviewLessonIds?: Set<string>;
  lessonCardLabels: {
    minutes: string;
    lockedHint: string;
    lockContinueLabel: string;
    stateLabels: Record<LessonVisualState, string>;
    ctaStart: string;
    ctaContinue: string;
    ctaReview: string;
    recommended: string;
    needsReview: string;
  };
}) {
  const cards = lessons.map((lesson) => (
    <LearningLessonCard
      key={lesson.id}
      lesson={lesson}
      masteryLabels={masteryLabels}
      recommendedLessonId={recommendedLessonId}
      continueLessonHref={continueLessonHref}
      suppressReviewBadge={reviewLessonIds?.has(lesson.id)}
      labels={lessonCardLabels}
      variant="compact"
    />
  ));

  if (useSlide) {
    return (
      <DashboardSlideStrip label={slideLabel}>
        {lessons.map((lesson, index) => (
          <DashboardSlideItem key={lesson.id} className="w-[min(100%,14rem)] sm:w-[15rem]">
            {cards[index]}
          </DashboardSlideItem>
        ))}
      </DashboardSlideStrip>
    );
  }

  return <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">{cards}</div>;
}

function LockedLessonsDropdown({
  lessons,
  title,
  count,
  masteryLabels,
  recommendedLessonId,
  continueLessonHref,
  reviewLessonIds,
  lessonCardLabels,
}: {
  lessons: LessonWithProgress[];
  title: string;
  count: number;
  masteryLabels: Record<number, string>;
  recommendedLessonId?: string | null;
  continueLessonHref?: string | null;
  reviewLessonIds?: Set<string>;
  lessonCardLabels: {
    minutes: string;
    lockedHint: string;
    lockContinueLabel: string;
    stateLabels: Record<LessonVisualState, string>;
    ctaStart: string;
    ctaContinue: string;
    ctaReview: string;
    recommended: string;
    needsReview: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-dashed border-[var(--status-locked)]/25 bg-[var(--surface-sunken)]/40">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left camba-focus-ring rounded-xl"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 camba-caption font-semibold text-muted">
          <Lock className="h-3.5 w-3.5 text-[var(--status-locked)]" aria-hidden />
          {title.replace("{count}", String(count))}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted transition-transform shrink-0",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div className="space-y-2 px-3 pb-3 border-t border-border/40 pt-2">
          {lessons.map((lesson) => (
            <LearningLessonCard
              key={lesson.id}
              lesson={lesson}
              masteryLabels={masteryLabels}
              recommendedLessonId={recommendedLessonId}
              continueLessonHref={continueLessonHref}
              suppressReviewBadge={reviewLessonIds?.has(lesson.id)}
              labels={lessonCardLabels}
              variant="compact"
            />
          ))}
        </div>
      )}
    </div>
  );
}
