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
    recommendationExercisesNeedReview: (count: number) =>
      tcs("recommendationExercisesNeedReview", { count }),
    finalExerciseSubtitle: (title: string) => tcs("finalExerciseSubtitle", { title }),
  };
}
