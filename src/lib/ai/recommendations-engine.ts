import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export async function generateRecommendationsFromFeedback(
  userId: string,
  weaknesses: string[]
): Promise<void> {
  if (!weaknesses.length) return;

  const supabase = await createClient();

  for (const weakness of weaknesses.slice(0, 3)) {
    await supabase.from("learning_recommendations").insert({
      user_id: userId,
      recommendation_type: "review",
      title: `Cải thiện: ${weakness}`,
      description: `AI đề xuất luyện tập thêm về ${weakness.toLowerCase()}`,
      priority: 5,
      metadata: { source: "ai_feedback", weakness } as Json,
    });
  }
}

export async function getActiveRecommendations(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("learning_recommendations")
    .select("*")
    .eq("user_id", userId)
    .eq("is_dismissed", false)
    .order("priority", { ascending: false })
    .limit(5);

  return data ?? [];
}

export async function dismissRecommendation(recommendationId: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("learning_recommendations")
    .update({ is_dismissed: true })
    .eq("id", recommendationId)
    .eq("user_id", user.id);
}
