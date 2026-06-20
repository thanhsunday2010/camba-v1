import { createClient } from "@/lib/supabase/server";
import { sanitizeQuestionForClient } from "@/lib/learning/sanitize-questions";
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

  const { data: program } = await supabase
    .from("programs")
    .select("id, name, slug")
    .eq("id", level.program_id)
    .single();

  if (!program) return null;

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .eq("level_id", levelId)
    .eq("is_active", true)
    .order("sort_order");

  if (!skills) return null;

  const { data: allProgress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("program_id", programId);

  const progressMap = new Map(allProgress?.map((p) => [p.lesson_id, p]) ?? []);

  const skillsWithContent: Skill[] = [];

  for (const skill of skills) {
    const { data: units } = await supabase
      .from("units")
      .select("*")
      .eq("skill_id", skill.id)
      .eq("is_active", true)
      .order("sort_order");

    const unitsWithLessons: Unit[] = [];

    for (const unit of units ?? []) {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("unit_id", unit.id)
        .eq("is_active", true)
        .order("sort_order");

      const lessonsWithProgress: LessonWithProgress[] = (lessons ?? []).map((lesson) => {
        const progress = progressMap.get(lesson.id);
        return {
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
      });

      unitsWithLessons.push({ ...unit, lessons: lessonsWithProgress });
    }

    skillsWithContent.push({ ...skill, units: unitsWithLessons });
  }

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
    .single();

  return data;
}

export async function getNextUnlockedLesson(
  userId: string,
  levelId: string
): Promise<LessonWithProgress | null> {
  const path = await getLearningPath(userId, levelId);
  if (!path) return null;

  for (const skill of path.skills) {
    for (const unit of skill.units ?? []) {
      for (const lesson of unit.lessons ?? []) {
        const isUnlocked = isLessonUnlockedFromProgress(lesson.progress);
        const notComplete = (lesson.progress?.completion_percent ?? 0) < 100;
        if (isUnlocked && notComplete) return lesson;
      }
    }
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
        const shouldUnlock = entryIds.includes(lesson.id) && !lesson.progress;

        if (shouldUnlock) {
          await supabase.from("lesson_progress").upsert(
            {
              user_id: userId,
              lesson_id: lesson.id,
              program_id: programId,
              is_unlocked: true,
              completion_percent: 0,
              accuracy_percent: 0,
              mastery_level: 0,
              attempts_count: 0,
            },
            { onConflict: "user_id,lesson_id" }
          );
        }
      }
    }
  }
}
