/**
 * Assemble lessons with unlock chains, lessonIndex, and exercise normalization.
 */

import { lessonId } from "./content-ids.mjs";
import {
  CONTENT_STRUCTURE,
  SKILL_ORDER,
  EXERCISE_PHASE_PREFIXES,
} from "./content-structure.mjs";

export { SKILL_ORDER };

export function globalSortOrder(skillIndex, lessonIndex) {
  return skillIndex * CONTENT_STRUCTURE.lessonsPerSkill + lessonIndex;
}

export function unlockAfter(level, unitNumber, skillIndex, lessonIndex) {
  if (skillIndex === 0 && lessonIndex === 0) return undefined;
  if (lessonIndex === 0) {
    const prevSkill = SKILL_ORDER[skillIndex - 1];
    return lessonId(
      level,
      unitNumber,
      prevSkill,
      CONTENT_STRUCTURE.lessonsPerSkill - 1
    );
  }
  const skill = SKILL_ORDER[skillIndex];
  return lessonId(level, unitNumber, skill, lessonIndex - 1);
}

export function lessonShell({
  level,
  unitNumber,
  slug,
  skill,
  lessonIndex,
  skillIndex,
  title,
  learningObjective,
  estimatedMinutes,
  exercises,
}) {
  const sortOrder = globalSortOrder(skillIndex, lessonIndex);
  const unlock = unlockAfter(level, unitNumber, skillIndex, lessonIndex);
  return {
    slug,
    skill,
    lessonIndex,
    sortOrder,
    ...(unlock ? { unlockAfterLessonId: unlock } : {}),
    title,
    learningObjective,
    estimatedMinutes,
    exercises,
  };
}

export function findCheckExercise(exercises) {
  return (
    exercises.find((ex) => ex.sortOrder === 2) ??
    exercises.find((ex) => ex.title?.startsWith("Check:"))
  );
}

export function cloneAsReview(checkExercise) {
  const review = structuredClone(checkExercise);
  review.slug = review.slug.includes("-check")
    ? review.slug.replace("-check", "-review")
    : `${review.slug}-review`;
  review.title = review.title.replace(/^Check:/, "Review:");
  review.sortOrder = 4;
  return review;
}

export function normalizeWritingCheck(exercise, level) {
  if (exercise.exerciseType !== "writing") return exercise;
  exercise.content = exercise.content ?? {};
  exercise.content.targetLevel = level;
  if (exercise.content.minWords == null) {
    exercise.content.minWords = level === "ket" || level === "pet" ? 25 : 5;
  }
  return exercise;
}

export function normalizeSpeakingCheck(exercise, level) {
  if (exercise.exerciseType !== "speaking") return exercise;
  exercise.content = exercise.content ?? {};
  exercise.content.targetLevel = level;
  exercise.content.maxDurationSeconds =
    exercise.content.maxDurationSeconds ?? 60;
  for (const q of exercise.questions ?? []) {
    if (q.content) q.content.maxDurationSeconds = 60;
  }
  return exercise;
}

export function addReviewFromCheck(exercises, level) {
  const check = findCheckExercise(exercises);
  if (!check) return exercises;
  let review = cloneAsReview(check);
  if (review.exerciseType === "writing") review = normalizeWritingCheck(review, level);
  if (review.exerciseType === "speaking") review = normalizeSpeakingCheck(review, level);
  return [...exercises, review];
}

export function relabelExercisePhases(exercises) {
  return exercises.map((ex, i) => {
    const prefix = EXERCISE_PHASE_PREFIXES[i];
    if (!prefix) return { ...ex, sortOrder: i };
    const title = ex.title?.includes(":")
      ? ex.title.replace(/^[^:]+:\s*/, `${prefix}: `)
      : `${prefix}: ${ex.title ?? ex.slug}`;
    return { ...structuredClone(ex), sortOrder: i, title };
  });
}

/**
 * Ensure a lesson has exactly 5 exercises with Learn→Review phases.
 * Pads legacy 2–4 exercise lessons before adding Review.
 */
export function padLessonToFiveExercises(exercises, level) {
  let normalized = structuredClone(exercises);
  for (const ex of normalized) {
    if (ex.exerciseType === "writing") normalizeWritingCheck(ex, level);
    if (ex.exerciseType === "speaking") normalizeSpeakingCheck(ex, level);
  }

  if (normalized.length >= CONTENT_STRUCTURE.exercisesPerLesson) {
    return normalizeLessonExercises(normalized, level);
  }

  normalized = relabelExercisePhases(normalized);

  while (normalized.length < 4) {
    const source = normalized[normalized.length - 1] ?? normalized[0];
    if (!source) break;
    const clone = structuredClone(source);
    clone.slug = `${clone.slug}-pad-${normalized.length}`;
    clone.sortOrder = normalized.length;
    const phase = EXERCISE_PHASE_PREFIXES[normalized.length];
    clone.title = `${phase}: ${(clone.title ?? clone.slug).replace(/^[^:]+:\s*/, "")}`;
    normalized.push(clone);
  }

  return normalizeLessonExercises(normalized, level);
}

export function normalizeLessonExercises(exercises, level) {
  let normalized = structuredClone(exercises);
  for (const ex of normalized) {
    if (ex.exerciseType === "writing") normalizeWritingCheck(ex, level);
    if (ex.exerciseType === "speaking") normalizeSpeakingCheck(ex, level);
  }
  if (normalized.length < CONTENT_STRUCTURE.exercisesPerLesson) {
    normalized = relabelExercisePhases(normalized);
    normalized = addReviewFromCheck(normalized, level);
  }
  while (normalized.length < CONTENT_STRUCTURE.exercisesPerLesson) {
    const check = findCheckExercise(normalized);
    if (check) {
      normalized = addReviewFromCheck(normalized, level);
    } else {
      break;
    }
  }
  return normalized.slice(0, CONTENT_STRUCTURE.exercisesPerLesson);
}

export function prepareLessonIndex0(lesson, level) {
  const exercises = padLessonToFiveExercises(lesson.exercises ?? [], level);
  return {
    ...structuredClone(lesson),
    lessonIndex: 0,
    exercises,
  };
}

/**
 * Expand a legacy unit (6 lessons) to 18 lessons using optional custom builders.
 *
 * @param {object} original - Full unit content JSON
 * @param {Record<string, function>} newLessonBuilders - skill → (lessonIndex, skillIndex) => lesson
 */
export function expandUnitStructure(original, newLessonBuilders = {}) {
  const level = original.meta.level;
  const unitNumber = original.meta.unitNumber;
  const bySkill = {};
  for (const lesson of original.lessons ?? []) {
    bySkill[lesson.skill] = lesson;
  }

  const expandedLessons = [];

  for (let skillIndex = 0; skillIndex < SKILL_ORDER.length; skillIndex++) {
    const skill = SKILL_ORDER[skillIndex];
    const originalLesson = bySkill[skill];
    if (!originalLesson) {
      throw new Error(`Missing original lesson for skill: ${skill}`);
    }

    const lesson0 = prepareLessonIndex0(originalLesson, level);
    lesson0.sortOrder = globalSortOrder(skillIndex, 0);
    const unlock0 = unlockAfter(level, unitNumber, skillIndex, 0);
    if (unlock0) lesson0.unlockAfterLessonId = unlock0;
    else delete lesson0.unlockAfterLessonId;
    expandedLessons.push(lesson0);

    for (const lessonIndex of [1, 2]) {
      const builder = newLessonBuilders[skill];
      if (!builder) {
        throw new Error(
          `No lesson builder for skill "${skill}" lessonIndex ${lessonIndex}`
        );
      }
      expandedLessons.push(builder(lessonIndex, skillIndex));
    }
  }

  return {
    ...original,
    lessons: expandedLessons,
  };
}

/**
 * Normalize KET/legacy single-lesson units: add Review exercise (4 → 5).
 */
export function normalizeSingleLessonUnit(content) {
  const level = content.meta.level;
  const lessons = (content.lessons ?? []).map((lesson) => ({
    ...lesson,
    exercises: normalizeLessonExercises(lesson.exercises ?? [], level),
  }));
  return { ...content, lessons };
}

/**
 * Build lessons from blueprint: lessons[skill] is array of 1–3 lesson blueprints.
 */
export function buildLessonsFromBlueprint({
  level,
  unitNumber,
  lessonsBySkill,
  buildExerciseFn,
}) {
  const built = [];

  for (let skillIndex = 0; skillIndex < SKILL_ORDER.length; skillIndex++) {
    const skill = SKILL_ORDER[skillIndex];
    const raw = lessonsBySkill[skill];
    const lessonBlueprints = Array.isArray(raw) ? raw : raw ? [raw] : [];

    for (let lessonIndex = 0; lessonIndex < lessonBlueprints.length; lessonIndex++) {
      const bp = lessonBlueprints[lessonIndex];
      const exercises = (bp.exercises ?? []).map((ex) =>
        buildExerciseFn ? buildExerciseFn(ex, { skill, lessonIndex }) : ex
      );
      const normalized = normalizeLessonExercises(exercises, level);

      built.push(
        lessonShell({
          level,
          unitNumber,
          slug: bp.slug,
          skill,
          lessonIndex,
          skillIndex,
          title: bp.title,
          learningObjective: bp.learningObjective,
          estimatedMinutes: bp.estimatedMinutes ?? 15,
          exercises: normalized,
        })
      );
    }
  }

  return built;
}
