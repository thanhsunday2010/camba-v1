"use client";

import { useTranslations } from "next-intl";

/** Client-side formatters for lesson strings with ICU placeholders. */
export function useLessonI18nFormatters() {
  const t = useTranslations("learning.lesson");
  const tcs = useTranslations("learning.lesson.completeSummary");

  return {
    exercisesProgress: (completed: number, total: number) =>
      t("exercisesProgress", { completed, total }),
    exerciseCount: (count: number) => t("exerciseCount", { count }),
    nextPathLesson: (lesson: string) => t("nextPathLesson", { lesson }),
    ctaNextLesson: (lesson: string) => tcs("ctaNextLesson", { lesson }),
    ctaNextSkill: (skill: string) => tcs("ctaNextSkill", { skill }),
    ctaNextUnit: (unit: string) => tcs("ctaNextUnit", { unit }),
    questionCount: (count: number) => t("questionCount", { count }),
    latestScore: (score: number) => t("latestScore", { score }),
    remainingExercises: (count: number) => t("remainingExercises", { count }),
    minWordsError: (min: number) => t("ai.minWordsError", { min }),
    exercisePosition: (current: number, total: number) =>
      t("exercisePosition", { current, total }),
    lessonProgressShort: (percent: number) => t("lessonProgressShort", { percent }),
    embeddedResultHeading: (percent: number) => t("embeddedResultHeading", { percent }),
    embeddedResultScore: (score: number, maxScore: number) =>
      t("embeddedResultScore", { score, maxScore }),
    questionPosition: (current: number, total: number) =>
      t("exercisePlayer.questionPosition", { current, total }),
    resultHeading: (percent: number) => t("exercisePlayer.resultHeading", { percent }),
    resultScore: (score: number, maxScore: number) =>
      t("exercisePlayer.resultScore", { score, maxScore }),
    nextExerciseLabel: (title?: string) =>
      title ? `${t("exercisePlayer.nextExercise")}: ${title}` : t("exercisePlayer.nextExercise"),
    recordedSuccess: (duration: number) => t("ai.recordedSuccess", { duration }),
    recommendationExercisesNeedReview: (count: number) =>
      tcs("recommendationExercisesNeedReview", { count }),
    finalExerciseSubtitle: (title: string) => tcs("finalExerciseSubtitle", { title }),
  };
}
