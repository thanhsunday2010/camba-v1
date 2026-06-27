"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { restoreStreakWithXp } from "@/lib/gamification/streak-restore";

export async function restoreStreakAction(): Promise<{
  success: boolean;
  error?: string;
  newStreak?: number;
  xpSpent?: number;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await restoreStreakWithXp(user.id);
  if (result.success) {
    revalidatePath("/dashboard");
    revalidatePath("/journey");
    revalidatePath("/profile");
  }

  return result;
}
