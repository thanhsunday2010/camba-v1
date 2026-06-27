import type { ActionResult } from "@/types";
import { AI_DAILY_LIMITS } from "@/lib/subscriptions/subscription-catalog";
import { checkAiUsageAllowed, recordAiUsage } from "@/lib/subscriptions/ai-usage";

const AI_LIMIT_MESSAGES: Record<"free" | "pro" | "vip", string> = {
  free: "Bạn đã hết lượt dùng AI hôm nay. Đăng ký gói để tiếp tục luyện tập với AI.",
  pro: `Bạn đã hết ${AI_DAILY_LIMITS.pro} lượt AI hôm nay. Nâng cấp lên VIP để có thêm lượt.`,
  vip: `Bạn đã hết ${AI_DAILY_LIMITS.vip} lượt AI hôm nay. Hãy quay lại vào ngày mai nhé!`,
};

export async function assertAiUsageAllowed(userId: string): Promise<ActionResult<void>> {
  const check = await checkAiUsageAllowed(userId);
  if (check.allowed) {
    return { success: true };
  }

  const { tier, usedToday, dailyLimit, remaining } = check.status;

  return {
    success: false,
    code: "AI_LIMIT_EXCEEDED",
    error: AI_LIMIT_MESSAGES[tier],
    limitMeta: { tier, usedToday, dailyLimit, remaining },
  };
}

export async function recordSuccessfulAiUsage(userId: string): Promise<void> {
  await recordAiUsage(userId);
}
