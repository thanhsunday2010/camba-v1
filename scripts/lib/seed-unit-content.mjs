import {
  CAMBRIDGE_SKILLS,
  PROGRAM_ID,
  LEVEL_IDS,
  validateContentPackage,
  getCurriculumUnit,
  loadCurriculumMap,
} from "./curriculum-map.mjs";
import {
  skillId,
  unitId,
  lessonId,
  exerciseIdBase,
  questionIdBase,
  unitSlug as buildUnitSlug,
} from "./content-ids.mjs";

function padId(n) {
  return String(n).padStart(12, "0");
}

function buildQuestionContent(q) {
  const base = {
    skillTag: q.skillTag,
    topicTag: q.topicTag,
    levelTag: q.levelTag,
    difficultyRating: q.difficultyRating,
    qualityScores: q.qualityScores,
  };
  if (q.assessmentType) base.assessmentType = q.assessmentType;
  if (q.content) return { ...base, ...q.content };
  return base;
}

function buildChoiceMetadata(choice) {
  if (!choice.distractorNote) return {};
  return { distractorNote: choice.distractorNote };
}

function buildUnitMetadata(skillSlug, curriculumUnit, content, levelSlug) {
  const base = {
    unitNumber: curriculumUnit.number,
    unitSlug: curriculumUnit.slug,
    curriculumMapVersion: loadCurriculumMap().version,
    levelSlug,
    skillSlug,
    readingSkill: curriculumUnit.readingSkill,
    listeningSkill: curriculumUnit.listeningSkill,
  };

  if (skillSlug === "vocabulary") {
    return {
      ...base,
      vocabularyBank: content.vocabularyBank,
      grammarReference: content.grammarReference,
      unitLearningObjectives: content.unit.learningObjectives,
      curriculumVocabulary: curriculumUnit.vocabulary,
    };
  }

  if (skillSlug === "grammar") {
    return {
      ...base,
      curriculumGrammar: curriculumUnit.grammar,
      grammarFocus: content.unit.grammarFocus,
    };
  }

  return base;
}

async function ensureProgram(supabase) {
  const { error } = await supabase.from("programs").upsert(
    {
      id: PROGRAM_ID,
      slug: "cambridge-english",
      name: "Cambridge English",
      description: "Cambridge English Exam Preparation",
      sort_order: 1,
      is_active: true,
      settings: {
        assessment_type: "shield",
        skills: CAMBRIDGE_SKILLS.map((s) => s.slug),
      },
    },
    { onConflict: "id" }
  );
  if (error) throw new Error(`program: ${error.message}`);
}

async function resolveLevelId(supabase, levelSlug) {
  const knownId = LEVEL_IDS[levelSlug];
  if (!knownId) throw new Error(`Level "${levelSlug}" chưa có LEVEL_IDS`);

  const { data, error } = await supabase
    .from("levels")
    .select("id")
    .eq("id", knownId)
    .maybeSingle();

  if (error) throw new Error(`level lookup: ${error.message}`);
  if (data?.id) return data.id;

  const curriculumLevel = (await import("./curriculum-map.mjs")).getCurriculumLevel(levelSlug);
  const { data: inserted, error: insertError } = await supabase
    .from("levels")
    .upsert(
      {
        id: knownId,
        program_id: PROGRAM_ID,
        slug: levelSlug,
        name: curriculumLevel.name.replace(/^Cambridge /, ""),
        description: curriculumLevel.examName,
        sort_order: Object.keys(LEVEL_IDS).indexOf(levelSlug),
        is_active: true,
        metadata: {
          cefr: curriculumLevel.cefr,
          yle: curriculumLevel.shieldAssessment ?? false,
          max_shields: curriculumLevel.shieldAssessment ? 15 : undefined,
          unitPlan: curriculumLevel.unitPlan,
        },
      },
      { onConflict: "id" }
    )
    .select("id")
    .single();

  if (insertError) throw new Error(`level: ${insertError.message}`);
  return inserted.id;
}

async function ensureSkillsForLevel(supabase, levelSlug, levelId) {
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
      curriculumMapVersion: loadCurriculumMap().version,
    },
  }));

  const { error } = await supabase.from("skills").upsert(skillRows, { onConflict: "id" });
  if (error) throw new Error(`skills: ${error.message}`);
}

/**
 * Import one unit content package into the curriculum skeleton.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {object} options
 * @param {string} options.levelSlug - e.g. "starters"
 * @param {object} options.content - parsed unit JSON
 * @param {boolean} [options.unlockForTestStudent] - unlock lessons for student@camba.me
 */
export async function seedUnitContent(supabase, { levelSlug, content, unlockForTestStudent = false }) {
  const curriculumUnit = validateContentPackage(content, levelSlug);
  const unitNumber = curriculumUnit.number;

  await ensureProgram(supabase);
  const levelId = await resolveLevelId(supabase, levelSlug);
  await ensureSkillsForLevel(supabase, levelSlug, levelId);

  const slug = buildUnitSlug(unitNumber, curriculumUnit.slug);
  const unitTitle = `Unit ${unitNumber}: ${curriculumUnit.title}`;

  const unitRows = CAMBRIDGE_SKILLS.map((s) => ({
    id: unitId(levelSlug, unitNumber, s.slug),
    skill_id: skillId(levelSlug, s.slug),
    slug,
    title: unitTitle,
    description: content.unit.learningObjectives[0],
    sort_order: unitNumber - 1,
    is_active: true,
    unlock_after_unit_id:
      unitNumber > 1 ? unitId(levelSlug, unitNumber - 1, s.slug) : null,
    metadata: buildUnitMetadata(s.slug, curriculumUnit, content, levelSlug),
  }));

  const { error: unitsError } = await supabase.from("units").upsert(unitRows, { onConflict: "id" });
  if (unitsError) throw new Error(`units: ${unitsError.message}`);

  const EXERCISE_ID_BASE = exerciseIdBase(levelSlug, unitNumber);
  const QUESTION_ID_BASE = questionIdBase(levelSlug, unitNumber);
  let exerciseCounter = 1;
  let questionCounter = 1;
  const importedLessonIds = [];

  for (const lesson of content.lessons) {
    const currentLessonId = lessonId(
      levelSlug,
      unitNumber,
      lesson.skill,
      lesson.lessonIndex ?? 0
    );
    const currentUnitId = unitId(levelSlug, unitNumber, lesson.skill);
    importedLessonIds.push(currentLessonId);

    const { error: lessonError } = await supabase.from("lessons").upsert(
      {
        id: currentLessonId,
        unit_id: currentUnitId,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.learningObjective,
        sort_order: lesson.sortOrder,
        estimated_minutes: lesson.estimatedMinutes,
        is_active: true,
        unlock_after_lesson_id: lesson.unlockAfterLessonId ?? null,
        metadata: {
          skill: lesson.skill,
          lessonIndex: lesson.lessonIndex ?? 0,
          learningObjective: lesson.learningObjective,
          level: levelSlug,
          unitSlug: curriculumUnit.slug,
          unitNumber,
          curriculumMapVersion: loadCurriculumMap().version,
        },
      },
      { onConflict: "id" }
    );
    if (lessonError) throw new Error(`lesson ${lesson.slug}: ${lessonError.message}`);

    for (const exercise of lesson.exercises) {
      const exerciseId = `${EXERCISE_ID_BASE}${padId(exerciseCounter++)}`;
      const exerciseContent = {
        ...(exercise.content ?? {}),
        qualityScores: exercise.qualityScores,
        topicTag: curriculumUnit.slug,
        levelTag: levelSlug,
      };

      const { error: exError } = await supabase.from("exercises").upsert(
        {
          id: exerciseId,
          lesson_id: currentLessonId,
          slug: exercise.slug,
          title: exercise.title,
          instructions: exercise.instructions,
          exercise_type: exercise.exerciseType,
          content: exerciseContent,
          status: "published",
          sort_order: exercise.sortOrder,
          is_active: true,
          metadata: {
            qualityScores: exercise.qualityScores,
            needsReview: exercise.qualityScores?.needsReview ?? false,
          },
        },
        { onConflict: "id" }
      );
      if (exError) throw new Error(`exercise ${exercise.slug}: ${exError.message}`);

      for (let qi = 0; qi < exercise.questions.length; qi++) {
        const q = exercise.questions[qi];
        const questionId = `${QUESTION_ID_BASE}${padId(questionCounter++)}`;

        const { error: qError } = await supabase.from("questions").upsert(
          {
            id: questionId,
            exercise_id: exerciseId,
            question_text: q.questionText,
            question_type: q.questionType,
            points: q.points ?? 1,
            sort_order: qi,
            explanation: q.explanation,
            content: buildQuestionContent(q),
          },
          { onConflict: "id" }
        );
        if (qError) throw new Error(`question: ${qError.message}`);

        if (q.choices?.length) {
          await supabase.from("choices").delete().eq("question_id", questionId);
          const choiceRows = q.choices.map((c, ci) => ({
            question_id: questionId,
            text: c.text,
            is_correct: c.isCorrect,
            sort_order: ci,
            metadata: {
              ...buildChoiceMetadata(c),
              qualityScores: q.qualityScores,
            },
          }));
          const { error: cError } = await supabase.from("choices").insert(choiceRows);
          if (cError) throw new Error(`choices: ${cError.message}`);
        }

        if (q.pairs?.length) {
          await supabase.from("question_pairs").delete().eq("question_id", questionId);
          const pairRows = q.pairs.map((p, pi) => ({
            question_id: questionId,
            left_text: p.left,
            right_text: p.right,
            sort_order: pi,
          }));
          const { error: pError } = await supabase.from("question_pairs").insert(pairRows);
          if (pError) throw new Error(`pairs: ${pError.message}`);
        }
      }
    }
  }

  if (unlockForTestStudent) {
    await unlockLessonsForTestStudent(supabase, levelId, importedLessonIds);
  }

  return {
    levelId,
    unitNumber,
    unitSlug: slug,
    lessonCount: content.lessons.length,
    exerciseCount: exerciseCounter - 1,
    questionCount: questionCounter - 1,
    vocabularyCount: content.vocabularyBank?.length ?? 0,
  };
}

async function unlockLessonsForTestStudent(supabase, levelId, lessonIds) {
  const { data: listed, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.warn(`  ⚠ Không thể mở khóa bài test: ${listError.message}`);
    return;
  }

  const student = listed.users.find((user) => user.email === "student@camba.me");
  if (!student) return;

  const { error: gamError } = await supabase.from("user_gamification").upsert(
    {
      user_id: student.id,
      current_program_id: PROGRAM_ID,
      current_level_id: levelId,
    },
    { onConflict: "user_id" }
  );
  if (gamError) {
    console.warn(`  ⚠ Không thể gán level: ${gamError.message}`);
    return;
  }

  const progressRows = lessonIds.map((lessonId) => ({
    user_id: student.id,
    lesson_id: lessonId,
    program_id: PROGRAM_ID,
    is_unlocked: true,
    completion_percent: 0,
    accuracy_percent: 0,
    mastery_level: 0,
    attempts_count: 0,
  }));

  let { error: progressError } = await supabase
    .from("lesson_progress")
    .upsert(progressRows, { onConflict: "user_id,lesson_id" });

  if (
    progressError?.message?.includes("program_id") &&
    progressError.message.includes("schema cache")
  ) {
    const rowsWithoutProgram = progressRows.map(({ program_id: _p, ...row }) => row);
    ({ error: progressError } = await supabase
      .from("lesson_progress")
      .upsert(rowsWithoutProgram, { onConflict: "user_id,lesson_id" }));
  }

  if (progressError) {
    console.warn(`  ⚠ Không thể mở khóa bài học: ${progressError.message}`);
    return;
  }

  console.log(`  ✓ student@camba.me → ${lessonIds.length} bài đã mở khóa`);
}
