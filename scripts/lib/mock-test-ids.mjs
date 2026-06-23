/**
 * Deterministic IDs for YLE mock tests (valid UUID hex only).
 *
 * Starters series: 02xxxxxx, Movers: 03xxxxxx, Flyers: 04xxxxxx
 */

import { LEVEL_IDS, PROGRAM_ID } from "./curriculum-map.mjs";
import { skillId } from "./content-ids.mjs";

export { PROGRAM_ID, LEVEL_IDS };

export const MOCK_BANK_UNIT_NUMBER = 99;

const LEVEL_PREFIX = { starters: "02", movers: "03", flyers: "04" };

function assertLevel(levelSlug) {
  if (!LEVEL_PREFIX[levelSlug]) {
    throw new Error(`No mock ID series for level "${levelSlug}"`);
  }
}

/** mock_tests.id — e.g. 02000001-0000-4000-8000-000000000001 */
export function mockTestId(levelSlug, testNumber) {
  assertLevel(levelSlug);
  const n = String(testNumber).padStart(6, "0");
  return `${LEVEL_PREFIX[levelSlug]}${n}-0000-4000-8000-000000000001`;
}

/** mock_test_sections.id */
export function mockSectionId(levelSlug, testNumber, sectionIndex) {
  assertLevel(levelSlug);
  const n = String(testNumber).padStart(6, "0");
  const s = String(sectionIndex).padStart(12, "0");
  return `${LEVEL_PREFIX[levelSlug]}${n}-0000-4000-8000-${s}`;
}

/** questions.id for mock-only questions (hex index from 0x10) */
export function mockQuestionId(levelSlug, testNumber, questionIndex1Based) {
  assertLevel(levelSlug);
  const n = String(testNumber).padStart(6, "0");
  const hex = (0x10 + questionIndex1Based - 1).toString(16).padStart(12, "0");
  return `${LEVEL_PREFIX[levelSlug]}${n}-0000-4000-8000-${hex}`;
}

/** Build full seedIds block for a practice mock manifest. */
export function buildManifestSeedIds(levelSlug, testNumber, sectionSlugs, questionRefs) {
  const sectionIds = {};
  sectionSlugs.forEach((slug, i) => {
    sectionIds[slug] = mockSectionId(levelSlug, testNumber, i + 2);
  });
  const questionIds = {};
  questionRefs.forEach((ref, i) => {
    questionIds[ref] = mockQuestionId(levelSlug, testNumber, i + 1);
  });
  return {
    mockTestId: mockTestId(levelSlug, testNumber),
    containerUnitId: mockBankUnitId(levelSlug, "reading"),
    containerLessonId: mockBankLessonId(levelSlug, "reading"),
    containerExerciseId: mockBankExerciseId(levelSlug, testNumber),
    sectionIds,
    questionIds,
  };
}

export function mockBankUnitId(levelSlug, skillSlug = "reading") {
  const series = { starters: "2", movers: "3", flyers: "4" }[levelSlug];
  const suffix = {
    vocabulary: "000000000001",
    grammar: "000000000002",
    reading: "000000000003",
    listening: "000000000004",
    writing: "000000000005",
    speaking: "000000000006",
  }[skillSlug];
  return `d${series}${String(MOCK_BANK_UNIT_NUMBER).padStart(6, "0")}-0000-4000-8000-${suffix}`;
}

export function mockBankLessonId(levelSlug, skillSlug = "reading") {
  const series = { starters: "2", movers: "3", flyers: "4" }[levelSlug];
  const suffix = {
    vocabulary: "000000000301",
    grammar: "000000000302",
    reading: "000000000303",
    listening: "000000000304",
    writing: "000000000305",
    speaking: "000000000306",
  }[skillSlug];
  return `e${series}${String(MOCK_BANK_UNIT_NUMBER).padStart(6, "0")}-0000-4000-8000-${suffix}`;
}

export function mockBankExerciseId(levelSlug, testNumber) {
  assertLevel(levelSlug);
  const n = String(testNumber).padStart(6, "0");
  return `${LEVEL_PREFIX[levelSlug]}${n}-0000-4000-8000-000000000099`;
}

export function mockSkillId(levelSlug, skillSlug) {
  return skillId(levelSlug, skillSlug);
}
