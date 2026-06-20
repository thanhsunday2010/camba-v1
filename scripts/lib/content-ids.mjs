/**
 * Deterministic UUIDs for curriculum content.
 *
 * Hierarchy (matches learning path UI):
 *   Program → Level → Skill → Unit → Lesson → Exercise → Question
 *
 * One curriculum unit (e.g. "Family and Friends") maps to 6 DB units — one per skill track.
 * Unit N on skill S at level L:
 *   unit:   d{levelSeries}{unitNumber padded 6} → skill suffix
 *   lesson: e{levelSeries}{unitNumber padded 6} → lesson suffix (1 per skill lesson)
 *
 * levelSeries: starters=2, movers=3, flyers=4, ket=5, pet=6
 */

const LEVEL_SERIES = {
  starters: "2",
  movers: "3",
  flyers: "4",
  ket: "5",
  pet: "6",
};

const SKILL_SUFFIX = {
  vocabulary: "000000000001",
  grammar: "000000000002",
  reading: "000000000003",
  listening: "000000000004",
  writing: "000000000005",
  speaking: "000000000006",
};

function assertLevel(levelSlug) {
  if (!LEVEL_SERIES[levelSlug]) {
    throw new Error(`Level "${levelSlug}" chưa có ID scheme (chỉ starters–pet)`);
  }
}

function unitSegment(levelSlug, unitNumber) {
  assertLevel(levelSlug);
  return `${LEVEL_SERIES[levelSlug]}${String(unitNumber).padStart(6, "0")}`;
}

export function skillId(levelSlug, skillSlug) {
  assertLevel(levelSlug);
  const suffix = SKILL_SUFFIX[skillSlug];
  if (!suffix) throw new Error(`Skill "${skillSlug}" không hợp lệ`);
  return `c${LEVEL_SERIES[levelSlug]}000001-0000-4000-8000-${suffix}`;
}

export function unitId(levelSlug, unitNumber, skillSlug) {
  const suffix = SKILL_SUFFIX[skillSlug];
  if (!suffix) throw new Error(`Skill "${skillSlug}" không hợp lệ`);
  return `d${unitSegment(levelSlug, unitNumber)}-0000-4000-8000-${suffix}`;
}

export function lessonId(levelSlug, unitNumber, skillSlug) {
  const suffix = SKILL_SUFFIX[skillSlug];
  if (!suffix) throw new Error(`Skill "${skillSlug}" không hợp lệ`);
  return `e${unitSegment(levelSlug, unitNumber)}-0000-4000-8000-${suffix}`;
}

export function exerciseIdBase(levelSlug, unitNumber) {
  return `f${unitSegment(levelSlug, unitNumber)}-0000-4000-8000-`;
}

export function questionIdBase(levelSlug, unitNumber) {
  return `a${unitSegment(levelSlug, unitNumber)}-0000-4000-8000-`;
}

export function unitSlug(unitNumber, unitSlugName) {
  return `unit-${unitNumber}-${unitSlugName}`;
}
