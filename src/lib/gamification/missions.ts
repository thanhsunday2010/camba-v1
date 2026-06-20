import { createClient } from "@/lib/supabase/server";
import { todayDateString } from "@/lib/gamification/constants";
import { awardXp } from "@/lib/gamification/award-xp";

export async function ensureDailyMissions(userId: string): Promise<void> {
  const supabase = await createClient();
  const today = todayDateString();

  const { data: missions } = await supabase
    .from("daily_missions")
    .select("*")
    .eq("is_active", true);

  if (!missions?.length) return;

  for (const mission of missions) {
    const { data: existing } = await supabase
      .from("user_daily_missions")
      .select("id")
      .eq("user_id", userId)
      .eq("mission_id", mission.id)
      .eq("mission_date", today)
      .maybeSingle();

    if (!existing) {
      await supabase.from("user_daily_missions").insert({
        user_id: userId,
        mission_id: mission.id,
        mission_date: today,
        current_value: 0,
        is_completed: false,
      });
    }
  }
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
  await ensureDailyMissions(userId);

  const supabase = await createClient();
  const today = todayDateString();

  const { data } = await supabase
    .from("user_daily_missions")
    .select("*")
    .eq("user_id", userId)
    .eq("mission_date", today);

  const missionIds = data?.map((d) => d.mission_id) ?? [];
  const { data: missionDefs } = missionIds.length
    ? await supabase.from("daily_missions").select("*").in("id", missionIds)
    : { data: [] };

  const missionMap = new Map(missionDefs?.map((m) => [m.id, m]) ?? []);

  return (data ?? []).map((um) => {
    const mission = missionMap.get(um.mission_id);
    return {
      id: um.id,
      currentValue: um.current_value,
      targetValue: mission?.target_value ?? 1,
      isCompleted: um.is_completed,
      title: mission?.title ?? "",
      description: mission?.description ?? null,
      xpReward: mission?.xp_reward ?? 0,
      coinReward: mission?.coin_reward ?? 0,
      missionType: mission?.mission_type ?? "",
    };
  });
}
