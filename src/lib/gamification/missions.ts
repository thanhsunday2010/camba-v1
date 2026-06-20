import { createClient } from "@/lib/supabase/server";
import { todayDateString } from "@/lib/gamification/constants";
import { awardXp } from "@/lib/gamification/award-xp";

async function ensureDailyMissions(userId: string): Promise<void> {
  const supabase = await createClient();
  const today = todayDateString();

  const [{ data: missions }, { data: existing }] = await Promise.all([
    supabase.from("daily_missions").select("id").eq("is_active", true),
    supabase
      .from("user_daily_missions")
      .select("mission_id")
      .eq("user_id", userId)
      .eq("mission_date", today),
  ]);

  if (!missions?.length) return;

  const existingIds = new Set(existing?.map((row) => row.mission_id) ?? []);
  const missing = missions.filter((mission) => !existingIds.has(mission.id));

  if (!missing.length) return;

  await supabase.from("user_daily_missions").insert(
    missing.map((mission) => ({
      user_id: userId,
      mission_id: mission.id,
      mission_date: today,
      current_value: 0,
      is_completed: false,
    }))
  );
}

export async function updateMissionProgress(
  userId: string,
  missionType: string,
  increment: number
): Promise<void> {
  await ensureDailyMissions(userId);

  const supabase = await createClient();
  const today = todayDateString();

  const { data: missions } = await supabase
    .from("daily_missions")
    .select("*")
    .eq("mission_type", missionType)
    .eq("is_active", true);

  for (const mission of missions ?? []) {
    const { data: userMission } = await supabase
      .from("user_daily_missions")
      .select("*")
      .eq("user_id", userId)
      .eq("mission_id", mission.id)
      .eq("mission_date", today)
      .single();

    if (!userMission || userMission.is_completed) continue;

    const newValue = userMission.current_value + increment;
    const isCompleted = newValue >= mission.target_value;

    await supabase
      .from("user_daily_missions")
      .update({
        current_value: newValue,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .eq("id", userMission.id);

    if (isCompleted) {
      await awardXp({
        userId,
        eventType: "mission_complete",
        referenceType: "daily_mission",
        referenceId: userMission.id,
        idempotent: true,
      });
    }
  }
}

export async function getUserDailyMissions(userId: string) {
  const supabase = await createClient();
  const today = todayDateString();

  const { data: missionDefs } = await supabase
    .from("daily_missions")
    .select("*")
    .eq("is_active", true);

  if (!missionDefs?.length) return [];

  const { data: userMissions } = await supabase
    .from("user_daily_missions")
    .select("*")
    .eq("user_id", userId)
    .eq("mission_date", today);

  const userMissionMap = new Map(userMissions?.map((row) => [row.mission_id, row]) ?? []);

  return missionDefs.map((mission) => {
    const um = userMissionMap.get(mission.id);
    return {
      id: um?.id ?? mission.id,
      currentValue: um?.current_value ?? 0,
      targetValue: mission.target_value,
      isCompleted: um?.is_completed ?? false,
      title: mission.title,
      description: mission.description,
      xpReward: mission.xp_reward,
      coinReward: mission.coin_reward,
      missionType: mission.mission_type,
    };
  });
}
