import { awardXp } from "@/lib/gamification/award-xp";
import { updateMissionProgress } from "@/lib/gamification/missions";
import { recordDailyActivity } from "@/lib/gamification/streak";
import { todayDateString } from "@/lib/gamification/constants";
import { getUserLeagueSnapshot } from "@/lib/gamification/league";
import { createClient } from "@/lib/supabase/server";
import {
  EMPTY_GAMIFICATION_SUMMARY,
  type ExerciseGamificationSummary,
} from "@/lib/gamification/gamification-types";
import { isHigherTier } from "@/lib/gamification/leaderboard-utils";
import type { AwardXpResult } from "@/lib/gamification/award-xp";

function mergeAwardResults(
  summary: ExerciseGamificationSummary,
  result: AwardXpResult | null
): ExerciseGamificationSummary {
  if (!result) return summary;

  return {
    ...summary,
    totalXpAwarded: summary.totalXpAwarded + result.xpAwarded,
    leveledUp: summary.leveledUp || result.leveledUp,
    newLevel: result.leveledUp ? result.newLevel : summary.newLevel,
  };
}

async function getCurrentLevel(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_gamification")
    .select("level")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.level ?? 1;
}

export async function onExerciseCompleted(
  userId: string,
  lessonId: string,
  exerciseId: string,
  accuracyPercent: number,
  timeSpentSeconds: number,
  lessonJustCompleted: boolean
): Promise<ExerciseGamificationSummary> {
  const [beforeLeague, currentLevel] = await Promise.all([
    getUserLeagueSnapshot(userId),
    getCurrentLevel(userId),
  ]);

  let summary: ExerciseGamificationSummary = {
    ...EMPTY_GAMIFICATION_SUMMARY,
    newLevel: currentLevel,
  };

  const today = todayDateString();
  const minutes = Math.max(1, Math.ceil(timeSpentSeconds / 60));

  await recordDailyActivity(userId, { minutesStudied: minutes });
  await updateMissionProgress(userId, "listening_minutes", minutes);

  summary = mergeAwardResults(
    summary,
    await awardXp({
      userId,
      eventType: "exercise_complete",
      referenceType: "exercise",
      referenceId: exerciseId,
      idempotent: true,
    })
  );

  summary = mergeAwardResults(
    summary,
    await awardXp({
      userId,
      eventType: "daily_practice",
      referenceType: "daily",
      referenceId: today,
      idempotent: true,
    })
  );

  if (accuracyPercent === 100) {
    summary = mergeAwardResults(
      summary,
      await awardXp({
        userId,
        eventType: "perfect_score",
        referenceType: "exercise",
        referenceId: `${exerciseId}-perfect`,
        idempotent: true,
      })
    );
  }

  if (lessonJustCompleted) {
    summary = mergeAwardResults(
      summary,
      await awardXp({
        userId,
        eventType: "lesson_complete",
        referenceType: "lesson",
        referenceId: lessonId,
        idempotent: true,
      })
    );

    await updateMissionProgress(userId, "lessons_completed", 1);
    await recordDailyActivity(userId, { lessonsCompleted: 1 });
  }

  const afterLeague = await getUserLeagueSnapshot(userId);
  summary.leagueRank = afterLeague.rank;
  summary.leagueTier = afterLeague.tier;
  summary.tierPromoted = isHigherTier(afterLeague.tier, beforeLeague.tier);

  return summary;
}

export async function onPlacementTestCompleted(
  userId: string,
  testId: string
): Promise<void> {
  await awardXp({
    userId,
    eventType: "placement_test_complete",
    referenceType: "placement_test",
    referenceId: testId,
    idempotent: true,
  });
}

export async function onMockTestCompleted(
  userId: string,
  testId: string
): Promise<void> {
  await awardXp({
    userId,
    eventType: "mock_test_complete",
    referenceType: "mock_test",
    referenceId: testId,
    idempotent: false,
  });
}
