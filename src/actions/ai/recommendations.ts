"use server";

import { revalidatePath } from "next/cache";
import {
  dismissRecommendation as dismiss,
  getActiveRecommendations,
} from "@/lib/ai/recommendations-engine";
import { getSessionUser } from "@/lib/auth/session";

export async function dismissRecommendationAction(recommendationId: string) {
  await dismiss(recommendationId);
  revalidatePath("/dashboard");
}

export async function fetchActiveRecommendations() {
  const user = await getSessionUser();
  if (!user) return [];
  return getActiveRecommendations(user.id);
}
