/**
 * Validate expanded unit structure against canonical content-structure rules.
 */

import {
  CONTENT_STRUCTURE,
  SKILL_ORDER,
  isExpandedUnit,
} from "./content-structure.mjs";

export function validateUnitStructure(content, options = {}) {
  const {
    lessonsPerSkill = CONTENT_STRUCTURE.lessonsPerSkill,
    exercisesPerLesson = CONTENT_STRUCTURE.exercisesPerLesson,
    strict = true,
  } = options;

  const lessons = content.lessons ?? [];

  for (const skill of SKILL_ORDER) {
    const skillLessons = lessons.filter((l) => l.skill === skill);
    if (skillLessons.length < lessonsPerSkill) {
      const msg = `Skill "${skill}" has ${skillLessons.length} lesson(s); need at least ${lessonsPerSkill}`;
      if (strict) throw new Error(msg);
      return { valid: false, reason: msg, lessonCount: lessons.length };
    }
  }

  for (const lesson of lessons) {
    const exCount = lesson.exercises?.length ?? 0;
    if (exCount < exercisesPerLesson) {
      const msg = `Lesson "${lesson.slug}" (${lesson.skill}) has ${exCount} exercise(s); need at least ${exercisesPerLesson}`;
      if (strict) throw new Error(msg);
      return { valid: false, reason: msg, lessonCount: lessons.length };
    }
  }

  return {
    valid: true,
    expanded: isExpandedUnit(content),
    lessonCount: lessons.length,
    exerciseCount: lessons.reduce(
      (sum, l) => sum + (l.exercises?.length ?? 0),
      0
    ),
    bySkill: Object.fromEntries(
      SKILL_ORDER.map((skill) => [
        skill,
        lessons.filter((l) => l.skill === skill).length,
      ])
    ),
  };
}
