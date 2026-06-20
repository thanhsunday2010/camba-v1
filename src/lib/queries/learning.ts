import { createClient } from "@/lib/supabase/server";
import { sanitizeQuestionForClient } from "@/lib/learning/sanitize-questions";
import {
  fetchUserLessonProgress,
  upsertLessonProgress,
} from "@/lib/learning/lesson-progress-db";
import {
  getEntryLessonIds,
  isLessonUnlockedFromProgress,
  type LessonUnlockNode,
} from "@/lib/learning/unlock";
import type {
  Exercise,
  LearningPath,
  Lesson,
  LessonWithProgress,
  PlacementTestData,
  PublicQuestion,
  Question,
  Skill,
  Unit,
} from "@/types/learning";

export async function getLearningPath(
  userId: string,
  levelId: string
): Promise<LearningPath | null> {
  const supabase = await createClient();

  const { data: level } = await supabase
    .from("levels")
    .select("*")
    .eq("id", levelId)
    .single();

  if (!level) return null;

  const programId = level.program_id;

  const [{ data: program }, { data: skills }, allProgress] = await Promise.all([
    supabase.from("programs").select("id, name, slug").eq("id", programId).single(),
    supabase
      .from("skills")
      .select("*")
      .eq("level_id", levelId)
      .eq("is_active", true)
      .order("sort_order"),
    fetchUserLessonProgress(supabase, userId, programId),
  ]);

  if (!program || !skills?.length) return null;

  const skillIds = skills.map((skill) => skill.id);

  const { data: units } = await supabase
    .from("units")
    .select("*")
    .in("skill_id", skillIds)
    .eq("is_active", true)
    .order("sort_order");

  const unitIds = units?.map((unit) => unit.id) ?? [];
  const { data: lessons } = unitIds.length
    ? await supabase
        .from("lessons")
        .select("*")
        .in("unit_id", unitIds)
        .eq("is_active", true)
        .order("sort_order")
    : { data: [] as Lesson[] };

  const progressMap = new Map(allProgress.map((p) => [p.lesson_id, p]));
  const unitsBySkill = new Map<string, Unit[]>();
  const lessonsByUnit = new Map<string, LessonWithProgress[]>();

  for (const unit of units ?? []) {
    const bucket = unitsBySkill.get(unit.skill_id) ?? [];
    bucket.push(unit);
    unitsBySkill.set(unit.skill_id, bucket);
  }

  for (const lesson of lessons ?? []) {
    const progress = progressMap.get(lesson.id);
    const lessonWithProgress: LessonWithProgress = {
      ...lesson,
      progress: progress
        ? {
            completion_percent: Number(progress.completion_percent),
            accuracy_percent: Number(progress.accuracy_percent),
            mastery_level: progress.mastery_level,
            is_unlocked: progress.is_unlocked,
            attempts_count: progress.attempts_count,
          }
        : undefined,
    };
    const bucket = lessonsByUnit.get(lesson.unit_id) ?? [];
    bucket.push(lessonWithProgress);
    lessonsByUnit.set(lesson.unit_id, bucket);
  }

  const skillsWithContent: Skill[] = skills.map((skill) => ({
    ...skill,
    units: (unitsBySkill.get(skill.id) ?? []).map((unit) => ({
      ...unit,
      lessons: lessonsByUnit.get(unit.id) ?? [],
    })),
  }));

  return {
    program,
    level: { id: level.id, name: level.name, slug: level.slug },
    skills: skillsWithContent,
  };
}

export async function getLessonWithExercises(lessonId: string): Promise<Lesson | null> {
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) return null;

  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_active", true)
    .eq("status", "published")
    .order("sort_order");

  const exercisesWithQuestions: Exercise[] = [];

  for (const exercise of exercises ?? []) {
    const questions = await fetchExerciseQuestionsFull(exercise.id);
    exercisesWithQuestions.push({
      ...exercise,
      content: (exercise.content as Record<string, unknown>) ?? {},
      questions: questions.map((q) => sanitizeQuestionForClient(q)),
    });
  }

  return { ...lesson, exercises: exercisesWithQuestions };
}

export async function fetchQuestionByIdFull(questionId: string): Promise<Question | null> {
  const supabase = await createClient();

  const { data: question } = await supabase
    .from("questions")
    .select("*")
    .eq("id", questionId)
    .single();

  if (!question) return null;

  const { data: choices } = await supabase
    .from("choices")
    .select("*")
    .eq("question_id", questionId)
    .order("sort_order");

  const { data: pairs } = await supabase
    .from("question_pairs")
    .select("*")
    .eq("question_id", questionId)
    .order("sort_order");

  return {
    ...question,
    content: (question.content as Record<string, unknown>) ?? {},
    choices: choices ?? [],
    pairs: pairs ?? [],
  };
}

export async function getQuestionById(questionId: string): Promise<PublicQuestion | null> {
  const question = await fetchQuestionByIdFull(questionId);
  return question ? sanitizeQuestionForClient(question) : null;
}

/** Server-side scoring only — includes answer keys */
export async function fetchExerciseQuestionsFull(exerciseId: string): Promise<Question[]> {
  const supabase = await createClient();

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("exercise_id", exerciseId)
    .order("sort_order");

  const result: Question[] = [];

  for (const question of questions ?? []) {
    const { data: choices } = await supabase
      .from("choices")
      .select("*")
      .eq("question_id", question.id)
      .order("sort_order");

    const { data: pairs } = await supabase
      .from("question_pairs")
      .select("*")
      .eq("question_id", question.id)
      .order("sort_order");

    result.push({
      ...question,
      content: (question.content as Record<string, unknown>) ?? {},
      choices: choices ?? [],
      pairs: pairs ?? [],
    });
  }

  return result;
}

/** @deprecated Use fetchExerciseQuestionsFull for server scoring */
export async function getExerciseQuestions(exerciseId: string): Promise<Question[]> {
  return fetchExerciseQuestionsFull(exerciseId);
}

export async function fetchPlacementTestFull(
  programId: string
): Promise<(PlacementTestData & { questions: Question[] }) | null> {
  const supabase = await createClient();

  const { data: test } = await supabase
    .from("placement_tests")
    .select("*")
    .eq("program_id", programId)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!test) return null;

  const { data: testQuestions } = await supabase
    .from("placement_test_questions")
    .select("*, questions(*)")
    .eq("placement_test_id", test.id)
    .order("sort_order");

  const questions: Array<Question & { skill_weight?: Record<string, number> }> = [];

  for (const tq of testQuestions ?? []) {
    const fullQuestion = await fetchQuestionByIdFull(tq.question_id);
    if (fullQuestion) {
      questions.push({
        ...fullQuestion,
        skill_weight: (tq.skill_weight as Record<string, number>) ?? {},
      });
    }
  }

  return {
    id: test.id,
    title: test.title,
    description: test.description,
    question_count: test.question_count,
    time_limit_minutes: test.time_limit_minutes,
    questions,
  };
}

export async function getLessonProgress(userId: string, lessonId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  return data;
}

export async function getNextUnlockedLesson(
  userId: string,
  levelId: string
): Promise<LessonWithProgress | null> {
  return getNextUnlockedLessonFast(userId, levelId);
}

export async function getNextUnlockedLessonFast(
  userId: string,
  levelId: string
): Promise<LessonWithProgress | null> {
  const supabase = await createClient();

  const { data: skills } = await supabase
    .from("skills")
    .select("id, sort_order")
    .eq("level_id", levelId)
    .eq("is_active", true)
    .order("sort_order");

  if (!skills?.length) return null;

  const skillIds = skills.map((skill) => skill.id);

  const { data: units } = await supabase
    .from("units")
    .select("id, skill_id, sort_order")
    .in("skill_id", skillIds)
    .eq("is_active", true)
    .order("sort_order");

  if (!units?.length) return null;

  const unitIds = units.map((unit) => unit.id);

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .in("unit_id", unitIds)
    .eq("is_active", true)
    .order("sort_order");

  if (!lessons?.length) return null;

  const lessonIds = lessons.map((lesson) => lesson.id);

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);

  const progressMap = new Map(progressRows?.map((row) => [row.lesson_id, row]) ?? []);
  const skillOrder = new Map(skills.map((skill) => [skill.id, skill.sort_order]));
  const unitOrder = new Map(units.map((unit) => [unit.id, unit.sort_order]));
  const unitSkill = new Map(units.map((unit) => [unit.id, unit.skill_id]));

  const sortedLessons = [...lessons].sort((a, b) => {
    const skillA = skillOrder.get(unitSkill.get(a.unit_id) ?? "") ?? 0;
    const skillB = skillOrder.get(unitSkill.get(b.unit_id) ?? "") ?? 0;
    if (skillA !== skillB) return skillA - skillB;
    const unitA = unitOrder.get(a.unit_id) ?? 0;
    const unitB = unitOrder.get(b.unit_id) ?? 0;
    if (unitA !== unitB) return unitA - unitB;
    return a.sort_order - b.sort_order;
  });

  for (const lesson of sortedLessons) {
    const progress = progressMap.get(lesson.id);
    const lessonWithProgress: LessonWithProgress = {
      ...lesson,
      progress: progress
        ? {
            completion_percent: Number(progress.completion_percent),
            accuracy_percent: Number(progress.accuracy_percent),
            mastery_level: progress.mastery_level,
            is_unlocked: progress.is_unlocked,
            attempts_count: progress.attempts_count,
          }
        : undefined,
    };

    const isUnlocked = isLessonUnlockedFromProgress(lessonWithProgress.progress);
    const notComplete = (lessonWithProgress.progress?.completion_percent ?? 0) < 100;
    if (isUnlocked && notComplete) return lessonWithProgress;
  }

  return null;
}

export async function getPlacementTest(programId: string): Promise<PlacementTestData | null> {
  const test = await fetchPlacementTestFull(programId);
  if (!test) return null;

  return {
    id: test.id,
    title: test.title,
    description: test.description,
    question_count: test.question_count,
    time_limit_minutes: test.time_limit_minutes,
    questions: test.questions.map((q) => {
      const sanitized = sanitizeQuestionForClient(q as Question);
      return {
        ...sanitized,
        skill_weight: q.skill_weight,
      };
    }),
  };
}

export async function initializeLessonUnlocks(userId: string, levelId: string) {
  const supabase = await createClient();
  const path = await getLearningPath(userId, levelId);
  if (!path) return;

  const programId = path.program.id;

  for (const skill of path.skills) {
    for (const unit of skill.units ?? []) {
      const unitLessons = (unit.lessons ?? []).map((l) => ({
        id: l.id,
        unit_id: l.unit_id,
        sort_order: l.sort_order,
        unlock_after_lesson_id: l.unlock_after_lesson_id,
      })) as LessonUnlockNode[];

      const entryIds = getEntryLessonIds(unitLessons);

      for (const lesson of unit.lessons ?? []) {
        const shouldUnlock =
          entryIds.includes(lesson.id) &&
          (!lesson.progress || lesson.progress.is_unlocked !== true);

        if (shouldUnlock) {
          await upsertLessonProgress(supabase, {
            user_id: userId,
            lesson_id: lesson.id,
            program_id: programId,
            is_unlocked: true,
            completion_percent: lesson.progress?.completion_percent ?? 0,
            accuracy_percent: lesson.progress?.accuracy_percent ?? 0,
            mastery_level: lesson.progress?.mastery_level ?? 0,
            attempts_count: lesson.progress?.attempts_count ?? 0,
          });
        }
      }
    }
  }
}

export async function getLevelIdForLesson(lessonId: string): Promise<string | null> {
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("unit_id")
    .eq("id", lessonId)
    .maybeSingle();

  if (!lesson) return null;

  const { data: unit } = await supabase
    .from("units")
    .select("skill_id")
    .eq("id", lesson.unit_id)
    .maybeSingle();

  if (!unit) return null;

  const { data: skill } = await supabase
    .from("skills")
    .select("level_id")
    .eq("id", unit.skill_id)
    .maybeSingle();

  return skill?.level_id ?? null;
}

/** Unlock entry lessons for the lesson's level (e.g. direct /learning/lesson/[id] links). */
export async function ensureLessonUnlockedForUser(
  userId: string,
  lessonId: string
): Promise<void> {
  const supabase = await createClient();
  const levelId = await getLevelIdForLesson(lessonId);
  if (!levelId) return;

  const { data: lesson } = await supabase
    .from("lessons")
    .select("unlock_after_lesson_id")
    .eq("id", lessonId)
    .maybeSingle();

  if (lesson && !lesson.unlock_after_lesson_id) {
    const existing = await getLessonProgress(userId, lessonId);
    if (!existing || existing.is_unlocked !== true) {
      const { data: level } = await supabase
        .from("levels")
        .select("program_id")
        .eq("id", levelId)
        .maybeSingle();

      await upsertLessonProgress(supabase, {
        user_id: userId,
        lesson_id: lessonId,
        program_id: level?.program_id ?? undefined,
        is_unlocked: true,
        completion_percent: Number(existing?.completion_percent ?? 0),
        accuracy_percent: Number(existing?.accuracy_percent ?? 0),
        mastery_level: existing?.mastery_level ?? 0,
        attempts_count: existing?.attempts_count ?? 0,
      });
    }
  }

  await initializeLessonUnlocks(userId, levelId);
}
