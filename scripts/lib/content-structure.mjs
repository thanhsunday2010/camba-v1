/**
 * Canonical content package structure for all CAMBA levels.
 * Single source of truth for lesson/exercise counts and skill order.
 */

export const CONTENT_STRUCTURE_VERSION = "2.0.0";

export const CONTENT_STRUCTURE = {
  version: CONTENT_STRUCTURE_VERSION,
  lessonsPerSkill: 3,
  exercisesPerLesson: 5,
  skillsPerUnit: 6,
  exercisePhases: ["Learn", "Practice", "Check", "Apply", "Review"],
  minimumLessonsPerUnit: 18,
  minimumExercisesPerUnit: 90,
};

export const SKILL_ORDER = [
  "vocabulary",
  "grammar",
  "reading",
  "listening",
  "writing",
  "speaking",
];

export const SKILLS = SKILL_ORDER;

export const EXERCISE_PHASE_PREFIXES = {
  0: "Learn",
  1: "Practice",
  2: "Check",
  3: "Apply",
  4: "Review",
};

export function isExpandedUnit(content) {
  const lessons = content.lessons ?? [];
  return lessons.length >= CONTENT_STRUCTURE.minimumLessonsPerUnit;
}

export function lessonsPerSkill(content, skill) {
  return (content.lessons ?? []).filter((l) => l.skill === skill).length;
}

export function isLegacyUnit(content) {
  return !isExpandedUnit(content);
}
