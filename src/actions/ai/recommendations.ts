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

export async function fetchActiveRecommendations(userId?: string) {
  const resolvedUserId = userId ?? (await getSessionUser())?.id;
  if (!resolvedUserId) return [];
  return getActiveRecommendations(resolvedUserId);
}
