"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isSepayConfigured } from "@/lib/payments/sepay-config";
import {
  createSubscriptionPaymentOrder,
  getSubscriptionPaymentOrderStatus,
  type SubscriptionCheckoutSession,
} from "@/lib/payments/subscription-payment";
import type { BillingPeriod, SubscriptionProgram, SubscriptionTier } from "@/lib/subscriptions/subscription-types";
import type { ActionResult } from "@/types";

export async function createSubscriptionPaymentOrderAction(params: {
  program: SubscriptionProgram;
  tier: SubscriptionTier;
  billingPeriod: BillingPeriod;
}): Promise<ActionResult<SubscriptionCheckoutSession>> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để thanh toán." };
  }

  if (!isSepayConfigured()) {
    return { success: false, error: "Cổng thanh toán chưa được cấu hình." };
  }

  if (params.tier === "free") {
    return { success: false, error: "Gói Free không cần thanh toán." };
  }

  try {
    const checkout = await createSubscriptionPaymentOrder({
      userId: user.id,
      program: params.program,
      tier: params.tier,
      billingPeriod: params.billingPeriod,
    });

    return { success: true, data: checkout };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo đơn thanh toán.";
    return { success: false, error: message };
  }
}

export async function getSubscriptionPaymentOrderStatusAction(
  orderCode: string
): Promise<ActionResult<{ status: "pending" | "paid" | "expired" | "cancelled"; paidAt: string | null }>> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await getSubscriptionPaymentOrderStatus({
    userId: user.id,
    orderCode,
  });

  if (!result) {
    return { success: false, error: "Không tìm thấy đơn thanh toán." };
  }

  if (result.status === "paid") {
    revalidatePath("/subscriptions");
  }

  return { success: true, data: result };
}
