import { createClient } from "@/lib/supabase/server";
import {
  getLessonWithExercises,
  getLessonProgress,
} from "@/lib/queries/learning";
import { isLessonUnlockedFromProgress } from "@/lib/learning/unlock";
import {
  getExerciseUiState,
  getPersistedCompletedExerciseIds,
  deriveResolvedLessonProgress,
} from "@/lib/learning/lesson-ui-utils";
import type {
  LessonExerciseSummary,
  LessonPageContext,
  LessonPageViewModel,
} from "@/lib/learning/lesson-page-types";
import type { Exercise } from "@/types/learning";

type ExerciseAttemptRow = {
  exercise_id: string;
  score: number;
  max_score: number;
  accuracy_percent: number;
  completed_at: string | null;
  is_completed: boolean;
  started_at: string;
};

async function fetchLessonContext(lessonId: string): Promise<LessonPageContext> {
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("unit_id")
    .eq("id", lessonId)
    .maybeSingle();

  if (!lesson) return {};

  const { data: unit } = await supabase
    .from("units")
    .select("id, slug, title, skill_id")
    .eq("id", lesson.unit_id)
    .maybeSingle();

  if (!unit) return {};

  const { data: skill } = await supabase
    .from("skills")
    .select("id, slug, name, level_id")
    .eq("id", unit.skill_id)
    .maybeSingle();

  if (!skill) {
    return {
      unitId: unit.id,
      unitSlug: unit.slug,
      unitTitle: unit.title,
    };
  }

  const { data: level } = await supabase
    .from("levels")
    .select("id, slug, name, program_id")
    .eq("id", skill.level_id)
    .maybeSingle();

  if (!level) {
    return {
      unitId: unit.id,
      unitSlug: unit.slug,
      unitTitle: unit.title,
      skillId: skill.id,
      skillSlug: skill.slug,
      skillName: skill.name,
    };
  }

  const { data: program } = await supabase
    .from("programs")
    .select("id, slug")
    .eq("id", level.program_id)
    .maybeSingle();

  return {
    programId: program?.id ?? level.program_id,
    programSlug: program?.slug ?? null,
    levelId: level.id,
    levelSlug: level.slug,
    levelName: level.name,
    skillId: skill.id,
    skillSlug: skill.slug,
    skillName: skill.name,
    unitId: unit.id,
    unitSlug: unit.slug,
    unitTitle: unit.title,
  };
}

export async function fetchLessonExerciseAttempts(
  userId: string,
  lessonId: string
): Promise<ExerciseAttemptRow[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("exercise_attempts")
    .select(
      "exercise_id, score, max_score, accuracy_percent, completed_at, is_completed, started_at"
    )
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .order("completed_at", { ascending: false, nullsFirst: false });

  return (data ?? []) as ExerciseAttemptRow[];
}

function groupAttemptsByExercise(
  attempts: ExerciseAttemptRow[]
): Map<string, ExerciseAttemptRow[]> {
  const map = new Map<string, ExerciseAttemptRow[]>();

  for (const attempt of attempts) {
    const list = map.get(attempt.exercise_id) ?? [];
    list.push(attempt);
    map.set(attempt.exercise_id, list);
  }

  for (const [exerciseId, rows] of map) {
    rows.sort((a, b) => {
      const aTime = a.completed_at ?? a.started_at;
      const bTime = b.completed_at ?? b.started_at;
      return bTime.localeCompare(aTime);
    });
    map.set(exerciseId, rows);
  }

  return map;
}

function buildExerciseSummaries(
  exercises: Exercise[],
  attemptsByExercise: Map<string, ExerciseAttemptRow[]>
): LessonExerciseSummary[] {
  return exercises.map((exercise) => {
    const attempts = attemptsByExercise.get(exercise.id) ?? [];
    const latest = attempts[0];
    const uiState = getExerciseUiState(attempts);

    return {
      id: exercise.id,
      lessonId: exercise.lesson_id,
      title: exercise.title,
      instructions: exercise.instructions,
      exerciseType: exercise.exercise_type,
      sortOrder: exercise.sort_order,
      questionCount: exercise.questions?.length ?? 0,
      latestAttempt: latest
        ? {
            score: latest.score,
            accuracyPercent: Number(latest.accuracy_percent),
            completedAt: latest.completed_at,
            attemptCount: attempts.length,
          }
        : null,
      uiState,
    };
  });
}

export async function getLessonPageViewModel(
  userId: string,
  lessonId: string
): Promise<LessonPageViewModel | null> {
  const [lesson, progressRow, context, attempts] = await Promise.all([
    getLessonWithExercises(lessonId),
    getLessonProgress(userId, lessonId),
    fetchLessonContext(lessonId),
    fetchLessonExerciseAttempts(userId, lessonId),
  ]);

  if (!lesson) return null;

  const exercises = lesson.exercises ?? [];
  const attemptsByExercise = groupAttemptsByExercise(attempts);
  const exerciseSummaries = buildExerciseSummaries(exercises, attemptsByExercise);
  const completedExerciseIds = getPersistedCompletedExerciseIds(exerciseSummaries);

  const progress = {
    isUnlocked: isLessonUnlockedFromProgress(progressRow),
    completionPercent: Number(progressRow?.completion_percent ?? 0),
    accuracyPercent: Number(progressRow?.accuracy_percent ?? 0),
    masteryLevel: progressRow?.mastery_level ?? 0,
  };

  const initialResolved = deriveResolvedLessonProgress(
    exerciseSummaries,
    new Set(completedExerciseIds),
    progress.completionPercent
  );

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      estimatedMinutes: lesson.estimated_minutes,
      sortOrder: lesson.sort_order,
    },
    context,
    progress,
    exercises,
    exerciseSummaries,
    completedExerciseIds,
    nextSuggestedExerciseId: initialResolved.nextSuggestedExerciseId,
  };
}
