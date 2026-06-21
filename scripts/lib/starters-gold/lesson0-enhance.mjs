/**
 * Upgrade legacy L0 lessons (2 exercises) to gold 5-phase without template padding.
 */
import { addReviewFromCheck } from "../unit-assembler.mjs";

const PHASE_PREFIX = ["Learn", "Practice", "Check", "Apply", "Review"];

export function prepareGoldLesson0(legacyLesson, extra = {}, level = "starters") {
  const exercises = [];

  const pushPhase = (ex, sort, prefix) => {
    if (!ex) return;
    const clone = structuredClone(ex);
    clone.sortOrder = sort;
    if (!clone.title.startsWith(`${prefix}:`)) {
      clone.title = `${prefix}: ${clone.title.replace(/^(Learn|Practice|Check|Apply):\s*/, "")}`;
    }
    exercises.push(clone);
  };

  if (extra.learn) {
    pushPhase(extra.learn, 0, "Learn");
  } else if (legacyLesson.exercises?.[0]) {
    pushPhase(legacyLesson.exercises[0], 0, "Learn");
  }

  if (extra.practice) {
    pushPhase(extra.practice, 1, "Practice");
  } else if (legacyLesson.exercises?.[1]) {
    pushPhase(legacyLesson.exercises[1], 1, "Practice");
  }

  if (extra.check) pushPhase(extra.check, 2, "Check");
  if (extra.apply) pushPhase(extra.apply, 3, "Apply");

  const withReview = addReviewFromCheck(exercises, level);
  if (withReview.length !== 5) {
    throw new Error(
      `prepareGoldLesson0: expected 5 exercises for "${legacyLesson.slug}", got ${withReview.length} (need learn+practice+check+apply or legacy+extras)`
    );
  }

  return {
    ...structuredClone(legacyLesson),
    lessonIndex: 0,
    exercises: withReview,
  };
}
