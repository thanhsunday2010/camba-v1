import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const CURRICULUM_MAP_PATH = resolve(__dirname, "../../data/curriculum/cambridge-curriculum-map.json");

export const CAMBRIDGE_SKILLS = [
  { slug: "vocabulary", name: "Vocabulary", description: "Word building and recognition", sort_order: 0 },
  { slug: "grammar", name: "Grammar", description: "Grammar structures and practice", sort_order: 1 },
  { slug: "reading", name: "Reading", description: "Reading comprehension", sort_order: 2 },
  { slug: "listening", name: "Listening", description: "Listening comprehension", sort_order: 3 },
  { slug: "writing", name: "Writing", description: "Guided writing tasks", sort_order: 4 },
  { slug: "speaking", name: "Speaking", description: "Speaking practice", sort_order: 5 },
];

export const PROGRAM_ID = "a0000000-0000-4000-8000-000000000001";

/** Stable level IDs — aligned with supabase/seed.sql */
export const LEVEL_IDS = {
  "pre-starters": "b0000000-0000-4000-8000-000000000001",
  starters: "b0000000-0000-4000-8000-000000000002",
  movers: "b0000000-0000-4000-8000-000000000003",
  flyers: "b0000000-0000-4000-8000-000000000004",
  ket: "b0000000-0000-4000-8000-000000000005",
  pet: "b0000000-0000-4000-8000-000000000006",
};

let cachedMap = null;

export function loadCurriculumMap() {
  if (!cachedMap) {
    cachedMap = JSON.parse(readFileSync(CURRICULUM_MAP_PATH, "utf8"));
  }
  return cachedMap;
}

export function getCurriculumLevel(levelSlug) {
  const map = loadCurriculumMap();
  const level = map.levels.find((l) => l.slug === levelSlug);
  if (!level) throw new Error(`Level "${levelSlug}" không có trong curriculum map`);
  return level;
}

export function getCurriculumUnit(levelSlug, unitNumber) {
  const level = getCurriculumLevel(levelSlug);
  const unit = level.units.find((u) => u.number === unitNumber);
  if (!unit) {
    throw new Error(`Unit ${unitNumber} không có trong curriculum map cho level "${levelSlug}"`);
  }
  return unit;
}

export function getCurriculumUnitBySlug(levelSlug, unitSlug) {
  const level = getCurriculumLevel(levelSlug);
  const unit = level.units.find((u) => u.slug === unitSlug);
  if (!unit) {
    throw new Error(`Unit slug "${unitSlug}" không có trong curriculum map cho level "${levelSlug}"`);
  }
  return unit;
}

/**
 * Validate unit content JSON against the curriculum blueprint before import.
 */
export function validateContentPackage(content, levelSlug) {
  const map = loadCurriculumMap();
  const curriculumUnit = getCurriculumUnitBySlug(levelSlug, content.meta.unitSlug);

  if (content.meta.level !== levelSlug) {
    throw new Error(
      `content.meta.level="${content.meta.level}" không khớp level seed "${levelSlug}"`
    );
  }

  if (content.meta.unitNumber !== curriculumUnit.number) {
    throw new Error(
      `content.meta.unitNumber=${content.meta.unitNumber} không khớp curriculum unit ${curriculumUnit.number}`
    );
  }

  if (content.meta.curriculumMapVersion !== map.version) {
    console.warn(
      `  ⚠ curriculumMapVersion ${content.meta.curriculumMapVersion} ≠ map ${map.version} — cân nhắc cập nhật content`
    );
  }

  if (content.meta.unitTitle !== curriculumUnit.title) {
    console.warn(
      `  ⚠ unitTitle "${content.meta.unitTitle}" ≠ curriculum "${curriculumUnit.title}"`
    );
  }

  return curriculumUnit;
}
