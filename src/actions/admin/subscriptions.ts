"use server";

import { revalidatePath } from "next/cache";
import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import { writeAuditLog } from "@/lib/admin/audit";
import { requirePermission } from "@/actions/admin/_shared";
import {
  SUBSCRIPTION_PROGRAMS,
  formatVnd,
} from "@/lib/subscriptions/subscription-catalog";
import type {
  AdminPaymentOrderRow,
  AdminPlanDisplayRow,
  AdminUserSubscriptionRow,
  AdminWebhookEventRow,
  PaymentOrderStatus,
} from "@/lib/admin/subscriptions/types";
import type {
  PaymentOrderDbRow,
  ProfileRow,
  UserSubscriptionDbRow,
  WebhookEventDbRow,
} from "@/lib/admin/db-rows";
import type {
  BillingPeriod,
  SubscriptionProgram,
  SubscriptionTier,
} from "@/lib/subscriptions/subscription-types";

const PAGE_SIZE = 25;

const PROGRAM_LABELS: Record<SubscriptionProgram, string> = {
  cambridge: "Cambridge English",
  speaking_writing: "Speaking & Writing",
};

const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: "Free",
  pro: "Pro",
  vip: "VIP",
};

function revalidateSubscriptions() {
  revalidatePath("/admin/subscriptions", "layout");
}

async function profileMap(userIds: string[]): Promise<Map<string, ProfileRow>> {
  if (userIds.length === 0) return new Map();
  const supabase = createAdminAnalyticsClient();
  const { data } = (await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds)) as { data: Pick<ProfileRow, "id" | "email" | "full_name">[] | null };
  return new Map((data ?? []).map((p) => [p.id, p as ProfileRow]));
}

export async function listPaymentOrders(options: {
  status?: PaymentOrderStatus;
  query?: string;
  page?: number;
}): Promise<{ orders: AdminPaymentOrderRow[]; total: number; page: number }> {
  await requirePermission("subscriptions.orders");

  const supabase = createAdminAnalyticsClient();
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;
  const query = options.query?.trim() ?? "";

  let userFilterIds: string[] | null = null;
  if (query && !query.startsWith("CAMBA")) {
    const { data: profiles } = (await supabase
      .from("profiles")
      .select("id")
      .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(50)) as { data: { id: string }[] | null };
    userFilterIds = (profiles ?? []).map((p) => p.id);
    if (userFilterIds.length === 0 && !query.match(/^CAMBA/i)) {
      return { orders: [], total: 0, page };
    }
  }

  let q = supabase
    .from("subscription_payment_orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (options.status) q = q.eq("status", options.status);
  if (query.startsWith("CAMBA")) q = q.ilike("order_code", `%${query}%`);
  else if (userFilterIds) q = q.in("user_id", userFilterIds);

  const { data, count } = (await q.range(offset, offset + PAGE_SIZE - 1)) as {
    data: PaymentOrderDbRow[] | null;
    count: number | null;
  };

  const userIds = [...new Set((data ?? []).map((o) => o.user_id))];
  const profiles = await profileMap(userIds);

  const orders: AdminPaymentOrderRow[] = (data ?? []).map((o) => {
    const profile = profiles.get(o.user_id);
    return {
      id: o.id,
      userId: o.user_id,
      userEmail: profile?.email ?? "—",
      userName: profile?.full_name ?? "—",
      orderCode: o.order_code,
      program: o.program as SubscriptionProgram,
      tier: o.tier as SubscriptionTier,
      billingPeriod: o.billing_period as BillingPeriod,
      amountVnd: o.amount_vnd,
      status: o.status as PaymentOrderStatus,
      sepayTransactionId: o.sepay_transaction_id,
      paidAt: o.paid_at,
      expiresAt: o.expires_at,
      createdAt: o.created_at,
    };
  });

  return { orders, total: count ?? 0, page };
}

export async function listWebhookEvents(options: {
  page?: number;
}): Promise<{ events: AdminWebhookEventRow[]; total: number; page: number }> {
  await requirePermission("subscriptions.webhooks");

  const supabase = createAdminAnalyticsClient();
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const { data, count } = (await supabase
    .from("sepay_webhook_events")
    .select("sepay_id, order_code, payload, received_at", { count: "exact" })
    .order("received_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)) as {
    data: WebhookEventDbRow[] | null;
    count: number | null;
  };

  const events: AdminWebhookEventRow[] = (data ?? []).map((e) => ({
    sepayId: e.sepay_id,
    orderCode: e.order_code,
    receivedAt: e.received_at,
    payload: e.payload ?? {},
  }));

  return { events, total: count ?? 0, page };
}

export async function getSubscriptionPlansForAdmin(): Promise<AdminPlanDisplayRow[]> {
  await requirePermission("subscriptions.plans");

  const rows: AdminPlanDisplayRow[] = [];
  for (const program of SUBSCRIPTION_PROGRAMS) {
    for (const plan of program.plans) {
      rows.push({
        program: program.id,
        programLabel: PROGRAM_LABELS[program.id],
        tier: plan.tier,
        tierLabel: TIER_LABELS[plan.tier],
        monthlyPriceVnd: plan.monthlyPriceVnd,
        yearlyPriceVnd: plan.yearlyPriceVnd,
        yearlySavingsPercent: plan.yearlySavingsPercent,
        dailyAiLimit: plan.dailyAiLimit,
        isPaid: plan.isPaid,
      });
    }
  }
  return rows;
}

export async function listManagedSubscriptions(options: {
  query?: string;
  tier?: SubscriptionTier;
  program?: SubscriptionProgram;
  page?: number;
}): Promise<{ subscriptions: AdminUserSubscriptionRow[]; total: number; page: number }> {
  await requirePermission("subscriptions.plans");

  const supabase = createAdminAnalyticsClient();
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;
  const query = options.query?.trim() ?? "";

  let userFilterIds: string[] | null = null;
  if (query) {
    const { data: profiles } = (await supabase
      .from("profiles")
      .select("id")
      .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(50)) as { data: { id: string }[] | null };
    userFilterIds = (profiles ?? []).map((p) => p.id);
    if (userFilterIds.length === 0) return { subscriptions: [], total: 0, page };
  }

  let q = supabase
    .from("user_subscriptions")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false });

  if (options.tier) q = q.eq("tier", options.tier);
  if (options.program) q = q.eq("program", options.program);
  if (userFilterIds) q = q.in("user_id", userFilterIds);

  const { data, count } = (await q.range(offset, offset + PAGE_SIZE - 1)) as {
    data: UserSubscriptionDbRow[] | null;
    count: number | null;
  };

  const userIds = [...new Set((data ?? []).map((s) => s.user_id))];
  const profiles = await profileMap(userIds);

  const subscriptions: AdminUserSubscriptionRow[] = (data ?? []).map((s) => {
    const profile = profiles.get(s.user_id);
    return {
      id: s.id,
      userId: s.user_id,
      userEmail: profile?.email ?? "—",
      userName: profile?.full_name ?? "—",
      program: s.program as SubscriptionProgram,
      tier: s.tier as SubscriptionTier,
      billingPeriod: s.billing_period as BillingPeriod | null,
      status: s.status,
      currentPeriodEnd: s.current_period_end,
      updatedAt: s.updated_at,
    };
  });

  return { subscriptions, total: count ?? 0, page };
}

function addDays(from: Date, days: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

export async function setUserSubscription(input: {
  email: string;
  program: SubscriptionProgram;
  tier: SubscriptionTier;
  billingPeriod?: BillingPeriod | null;
  periodDays?: number;
}): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("subscriptions.manage");
  const supabase = createAdminAnalyticsClient();
  const email = input.email.trim().toLowerCase();
  if (!email) return { success: false, error: "Email không hợp lệ" };

  const { data: profile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle()) as { data: { id: string } | null };

  if (!profile) return { success: false, error: "Không tìm thấy người dùng" };

  const now = new Date();
  let periodEnd: string | null = null;
  if (input.tier !== "free") {
    const days = input.periodDays ?? (input.billingPeriod === "yearly" ? 365 : 30);
    periodEnd = addDays(now, days).toISOString();
  }

  const { error } = await supabase.from("user_subscriptions").upsert(
    {
      user_id: profile.id,
      program: input.program,
      tier: input.tier,
      billing_period: input.tier === "free" ? null : (input.billingPeriod ?? "monthly"),
      status: "active",
      current_period_end: periodEnd,
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id,program" }
  );

  if (error) return { success: false, error: error.message };

  await writeAuditLog({
    actorId: actor.id,
    action: "subscription.set_tier",
    resourceType: "user_subscription",
    resourceId: profile.id,
    metadata: {
      email,
      program: input.program,
      tier: input.tier,
      billingPeriod: input.billingPeriod,
    },
  });

  revalidateSubscriptions();
  return { success: true };
}

export { formatVnd, PROGRAM_LABELS, TIER_LABELS };
