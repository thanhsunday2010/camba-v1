/**
 * Gold blueprint scaffold — expandUnit pattern (legacy L0 + hand-crafted L1/L2).
 * Replace TODO sections with hand-crafted content per unit.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SKILL_ORDER, globalSortOrder, unlockAfter, lessonShell } from "../../unit-assembler.mjs";
import { prepareGoldLesson0 } from "../../starters-gold/lesson0-enhance.mjs";
import { validateUnitStructure } from "../../validate-unit-structure.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createGoldExpander(unitNumber, { lesson0Extra, builders }) {
  const LEVEL = "starters";
  const legacyPath = resolve(
    __dirname,
    `../../starters-gold/legacy-snapshots/unit-${String(unitNumber).padStart(2, "0")}-legacy.json`
  );

  return function expandUnit(original) {
    const legacy = JSON.parse(readFileSync(legacyPath, "utf8"));
    const legacyBySkill = Object.fromEntries(
      (legacy.lessons ?? []).map((l) => [l.skill, l])
    );

    const expandedLessons = [];

    for (let skillIndex = 0; skillIndex < SKILL_ORDER.length; skillIndex++) {
      const skill = SKILL_ORDER[skillIndex];
      const legacyLesson = legacyBySkill[skill];
      if (!legacyLesson) {
        throw new Error(`Legacy snapshot missing skill: ${skill}`);
      }

      const lesson0 = prepareGoldLesson0(legacyLesson, lesson0Extra[skill] ?? {}, LEVEL);
      lesson0.sortOrder = globalSortOrder(skillIndex, 0);
      const u0 = unlockAfter(LEVEL, unitNumber, skillIndex, 0);
      if (u0) lesson0.unlockAfterLessonId = u0;
      else delete lesson0.unlockAfterLessonId;
      expandedLessons.push(lesson0);

      for (const lessonIndex of [1, 2]) {
        const builder = builders[skill];
        if (!builder) throw new Error(`Missing builder for ${skill}`);
        expandedLessons.push(builder(lessonIndex, skillIndex, original));
      }
    }

    return { ...original, lessons: expandedLessons };
  };
}

export function validateExpanded(content) {
  return validateUnitStructure(content);
}

export { lessonShell, SKILL_ORDER };
