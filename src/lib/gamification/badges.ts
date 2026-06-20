import { createClient } from "@/lib/supabase/server";
import { awardXp } from "@/lib/gamification/award-xp";

export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const awarded: string[] = [];

  const { data: badges } = await supabase
    .from("badges")
    .select("*")
    .eq("is_active", true);

  const { data: earnedBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  const earnedIds = new Set(earnedBadges?.map((b) => b.badge_id) ?? []);

  for (const badge of badges ?? []) {
    if (earnedIds.has(badge.id)) continue;

    const criteria = badge.criteria as Record<string, unknown>;
    const earned = await evaluateBadgeCriteria(userId, criteria);

    if (earned) {
      await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
      });

      await awardXp({
        userId,
        eventType: "badge_earned",
        referenceType: "badge",
        referenceId: badge.id,
        idempotent: true,
      });

      awarded.push(badge.slug);
    }
  }

  return awarded;
}

async function evaluateBadgeCriteria(
  userId: string,
  criteria: Record<string, unknown>
): Promise<boolean> {
  const supabase = await createClient();
  const type = criteria.type as string;

  switch (type) {
    case "streak": {
      const requiredDays = criteria.days as number;
      const { data: streak } = await supabase
        .from("user_streaks")
        .select("current_streak, best_streak")
        .eq("user_id", userId)
        .single();
      return (
        (streak?.current_streak ?? 0) >= requiredDays ||
        (streak?.best_streak ?? 0) >= requiredDays
      );
    }

    case "mock_test_score": {
      const minPercent = criteria.min_percent as number;
      const { data: attempts } = await supabase
        .from("mock_test_attempts")
        .select("score, max_score")
        .eq("user_id", userId)
        .eq("is_completed", true);
      return (attempts ?? []).some(
        (a) => a.max_score > 0 && (Number(a.score) / Number(a.max_score)) * 100 >= minPercent
      );
    }

    case "skill_master": {
      const skillSlug = criteria.skill as string;
      const { data: gamification } = await supabase
        .from("user_gamification")
        .select("current_level_id")
        .eq("user_id", userId)
        .single();
      if (!gamification?.current_level_id) return false;

      const { data: skill } = await supabase
        .from("skills")
        .select("id")
        .eq("level_id", gamification.current_level_id)
        .eq("slug", skillSlug)
        .maybeSingle();
      if (!skill) return false;

      const { data: units } = await supabase
        .from("units")
        .select("id")
        .eq("skill_id", skill.id);

      const unitIds = units?.map((u) => u.id) ?? [];
      if (unitIds.length === 0) return false;

      const { data: lessons } = await supabase
        .from("lessons")
        .select("id")
        .in("unit_id", unitIds)
        .eq("is_active", true);

      const lessonIds = lessons?.map((l) => l.id) ?? [];
      if (lessonIds.length === 0) return false;

      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("mastery_level")
        .eq("user_id", userId)
        .in("lesson_id", lessonIds);

      const masteredCount = progress?.filter((p) => p.mastery_level >= 4).length ?? 0;
      return masteredCount >= lessonIds.length;
    }

    default:
      return false;
  }
}

export async function getUserBadges(userId: string) {
  const supabase = await createClient();

  const { data: earned } = await supabase
    .from("user_badges")
    .select("*")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  const { data: allBadges } = await supabase
    .from("badges")
    .select("*")
    .eq("is_active", true);

  const earnedMap = new Map((earned ?? []).map((e) => [e.badge_id, e]));

  return (allBadges ?? []).map((badge) => ({
    ...badge,
    earned: earnedMap.has(badge.id),
    earnedAt: earnedMap.get(badge.id)?.earned_at ?? null,
  }));
}
