import type { ActionResult } from "@/types";
import { reserveAiUsage } from "@/lib/subscriptions/ai-usage";

const AI_LIMIT_MESSAGES: Record<"free" | "pro" | "vip", string> = {
  free: "Bạn đã hết lượt dùng AI hôm nay. Đăng ký gói để tiếp tục luyện tập với AI.",
  pro: "Bạn đã hết 5 lượt AI hôm nay. Nâng cấp lên VIP để có thêm lượt.",
  vip: "Bạn đã hết 10 lượt AI hôm nay. Hãy quay lại vào ngày mai nhé!",
};

export async function assertAiUsageAllowed(userId: string): Promise<ActionResult<void>> {
  const reservation = await reserveAiUsage(userId);
  if (reservation.allowed) {
    return { success: true };
  }

  const { tier, usedToday, dailyLimit, remaining } = reservation.status;

  return {
    success: false,
    code: "AI_LIMIT_EXCEEDED",
    error: AI_LIMIT_MESSAGES[tier],
    limitMeta: { tier, usedToday, dailyLimit, remaining },
  };
}
