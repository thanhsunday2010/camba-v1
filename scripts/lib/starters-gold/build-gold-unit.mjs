/**
 * Assemble a gold-standard Starters unit from hand-crafted blueprint builders.
 * NO template/rich generation — every lesson comes from blueprint code.
 */

import { lessonId } from "../content-ids.mjs";
import { validateUnitStructure } from "../validate-unit-structure.mjs";
import { loadCurriculumMap } from "../curriculum-map.mjs";
import { getCurriculumUnit } from "../curriculum-map.mjs";
import {
  SKILL_ORDER,
  globalSortOrder,
  unlockAfter,
} from "../unit-assembler.mjs";

const LEVEL = "starters";

/**
 * @param {object} base - meta, unit, vocabularyBank, grammarReference (lessons ignored)
 * @param {object} blueprint - { buildLesson(skill, lessonIndex, skillIndex, ctx) }
 */
export function buildGoldUnit(base, blueprint) {
  const unitNumber = base.meta.unitNumber;
  const topicTag = base.meta.unitSlug;
  const curriculumUnit = getCurriculumUnit(LEVEL, unitNumber);

  const ctx = {
    level: LEVEL,
    unitNumber,
    topicTag,
    unitTitle: curriculumUnit.title,
    vocabularyBank: base.vocabularyBank,
    grammarReference: base.grammarReference,
    unit: base.unit,
    ...blueprint.ctx,
  };

  const lessons = [];

  for (let skillIndex = 0; skillIndex < SKILL_ORDER.length; skillIndex++) {
    const skill = SKILL_ORDER[skillIndex];
    for (let lessonIndex = 0; lessonIndex < 3; lessonIndex++) {
      const lesson = blueprint.buildLesson(skill, lessonIndex, skillIndex, ctx);
      if (!lesson) {
        throw new Error(
          `Blueprint missing lesson: unit ${unitNumber} ${skill} L${lessonIndex}`
        );
      }
      lesson.skill = skill;
      lesson.lessonIndex = lessonIndex;
      lesson.sortOrder = globalSortOrder(skillIndex, lessonIndex);
      const unlock = unlockAfter(LEVEL, unitNumber, skillIndex, lessonIndex);
      if (unlock) lesson.unlockAfterLessonId = unlock;
      else delete lesson.unlockAfterLessonId;

      const exCount = lesson.exercises?.length ?? 0;
      if (exCount !== 5) {
        throw new Error(
          `Gold blueprint: lesson "${lesson.slug}" has ${exCount} exercises; need exactly 5 hand-crafted`
        );
      }
      lessons.push(lesson);
    }
  }

  const map = loadCurriculumMap();
  const content = {
    ...base,
    meta: { ...base.meta, curriculumMapVersion: map.version },
    unit: {
      learningObjectives: base.unit?.learningObjectives ?? [],
      grammarFocus: curriculumUnit.grammar,
      readingSkillFocus: curriculumUnit.readingSkill,
      listeningSkillFocus: curriculumUnit.listeningSkill,
    },
    lessons,
  };

  validateUnitStructure(content);
  return content;
}

export function legacyUnlockFix(lesson, unitNumber, skillIndex, lessonIndex) {
  lesson.sortOrder = globalSortOrder(skillIndex, lessonIndex);
  const unlock = unlockAfter(LEVEL, unitNumber, skillIndex, lessonIndex);
  if (unlock) lesson.unlockAfterLessonId = unlock;
  else delete lesson.unlockAfterLessonId;
  return lesson;
}
