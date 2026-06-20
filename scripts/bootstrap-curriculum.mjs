#!/usr/bin/env node
/**
 * Bootstrap curriculum skeleton from data/curriculum/cambridge-curriculum-map.json
 *
 * Creates (idempotent upsert):
 *   Program → Levels → Skills (6 per level) → Unit shells (curriculum unit × skill)
 *
 * Does NOT import lessons/exercises — use seed:unit for that.
 *
 * Usage: npm run bootstrap:curriculum
 */

import { createClient } from "@supabase/supabase-js";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createSupabaseFromEnv } from "./lib/env.mjs";
import {
  CAMBRIDGE_SKILLS,
  PROGRAM_ID,
  LEVEL_IDS,
  loadCurriculumMap,
  getCurriculumLevel,
} from "./lib/curriculum-map.mjs";
import { skillId, unitId, unitSlug as buildUnitSlug } from "./lib/content-ids.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const CONTENT_LEVELS = ["starters", "movers", "flyers", "ket", "pet"];

function buildUnitShellMetadata(skillSlug, curriculumUnit, levelSlug) {
  const base = {
    unitNumber: curriculumUnit.number,
    unitSlug: curriculumUnit.slug,
    curriculumMapVersion: loadCurriculumMap().version,
    levelSlug,
    skillSlug,
    contentStatus: "shell",
    readingSkill: curriculumUnit.readingSkill,
    listeningSkill: curriculumUnit.listeningSkill,
  };

  if (skillSlug === "vocabulary") {
    return { ...base, curriculumVocabulary: curriculumUnit.vocabulary };
  }
  if (skillSlug === "grammar") {
    return { ...base, curriculumGrammar: curriculumUnit.grammar };
  }
  return base;
}

async function main() {
  const { url, key } = createSupabaseFromEnv(ROOT);
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const map = loadCurriculumMap();

  const { error: programError } = await supabase.from("programs").upsert(
    {
      id: PROGRAM_ID,
      slug: map.program.slug,
      name: map.program.name,
      description: "Cambridge English Exam Preparation",
      sort_order: 1,
      is_active: true,
      settings: {
        assessment_type: "shield",
        skills: CAMBRIDGE_SKILLS.map((s) => s.slug),
        curriculumMapVersion: map.version,
      },
    },
    { onConflict: "id" }
  );
  if (programError) throw new Error(`program: ${programError.message}`);

  let totalUnits = 0;

  for (const levelSlug of CONTENT_LEVELS) {
    const curriculumLevel = getCurriculumLevel(levelSlug);
    const levelId = LEVEL_IDS[levelSlug];

    const { error: levelError } = await supabase.from("levels").upsert(
      {
        id: levelId,
        program_id: PROGRAM_ID,
        slug: levelSlug,
        name: curriculumLevel.name.replace(/^Cambridge /, ""),
        description: curriculumLevel.examName,
        sort_order: CONTENT_LEVELS.indexOf(levelSlug) + 1,
        is_active: true,
        metadata: {
          cefr: curriculumLevel.cefr,
          yle: curriculumLevel.shieldAssessment ?? false,
          max_shields: curriculumLevel.shieldAssessment ? 15 : undefined,
          unitPlan: curriculumLevel.unitPlan,
          curriculumMapVersion: map.version,
        },
      },
      { onConflict: "id" }
    );
    if (levelError) throw new Error(`level ${levelSlug}: ${levelError.message}`);

    const skillRows = CAMBRIDGE_SKILLS.map((s) => ({
      id: skillId(levelSlug, s.slug),
      level_id: levelId,
      slug: s.slug,
      name: s.name,
      description: s.description,
      sort_order: s.sort_order,
      is_active: true,
      metadata: {
        levelSlug,
        curriculumMapVersion: map.version,
      },
    }));

    const { error: skillsError } = await supabase.from("skills").upsert(skillRows, { onConflict: "id" });
    if (skillsError) throw new Error(`skills ${levelSlug}: ${skillsError.message}`);

    const unitRows = [];
    for (const curriculumUnit of curriculumLevel.units) {
      const slug = buildUnitSlug(curriculumUnit.number, curriculumUnit.slug);
      const title = `Unit ${curriculumUnit.number}: ${curriculumUnit.title}`;

      for (const skill of CAMBRIDGE_SKILLS) {
        unitRows.push({
          id: unitId(levelSlug, curriculumUnit.number, skill.slug),
          skill_id: skillId(levelSlug, skill.slug),
          slug,
          title,
          description: curriculumUnit.title,
          sort_order: curriculumUnit.number - 1,
          is_active: true,
          unlock_after_unit_id:
            curriculumUnit.number > 1
              ? unitId(levelSlug, curriculumUnit.number - 1, skill.slug)
              : null,
          metadata: buildUnitShellMetadata(skill.slug, curriculumUnit, levelSlug),
        });
      }
    }

    const { error: unitsError } = await supabase.from("units").upsert(unitRows, { onConflict: "id" });
    if (unitsError) throw new Error(`units ${levelSlug}: ${unitsError.message}`);

    totalUnits += unitRows.length;
    console.log(
      `  ✓ ${levelSlug}: ${CAMBRIDGE_SKILLS.length} skills, ${curriculumLevel.units.length} curriculum units → ${unitRows.length} DB units`
    );
  }

  console.log(`\n✓ Curriculum bootstrap hoàn tất (map v${map.version})`);
  console.log(`  Program: ${map.program.slug}`);
  console.log(`  Levels: ${CONTENT_LEVELS.join(", ")}`);
  console.log(`  Unit shells: ${totalUnits}`);
  console.log(`\nTiếp theo: npm run seed:unit -- starters 1`);
}

main().catch((err) => {
  console.error("Bootstrap failed:", err.message);
  process.exit(1);
});
