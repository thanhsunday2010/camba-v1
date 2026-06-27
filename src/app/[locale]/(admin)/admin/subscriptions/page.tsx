import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  canAccess,
  canAccessAdminModule,
  SUBSCRIPTIONS_MODULE_PERMISSIONS,
} from "@/lib/auth/admin-permissions";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { CreditCard, Receipt, Webhook } from "lucide-react";
import type { AdminPermission } from "@/lib/auth/admin-permissions";

const SUBSCRIPTION_HUB_CARDS: {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof CreditCard;
  permission: AdminPermission;
}[] = [
  {
    id: "plans",
    title: "Gói đăng ký",
    description: "Free, Pro, VIP và gán thủ công",
    href: "/admin/subscriptions/plans",
    icon: CreditCard,
    permission: "subscriptions.plans",
  },
  {
    id: "orders",
    title: "Đơn thanh toán",
    description: "Theo dõi và đối soát đơn SePay",
    href: "/admin/subscriptions/orders",
    icon: Receipt,
    permission: "subscriptions.orders",
  },
  {
    id: "webhooks",
    title: "Webhook SePay",
    description: "Nhật ký sự kiện webhook",
    href: "/admin/subscriptions/webhooks",
    icon: Webhook,
    permission: "subscriptions.webhooks",
  },
];

export default async function AdminSubscriptionsHubPage() {
  const user = await getCurrentUser();
  if (!user || !canAccessAdminModule(user, SUBSCRIPTIONS_MODULE_PERMISSIONS)) {
    redirect("/admin");
  }

  const cards = SUBSCRIPTION_HUB_CARDS.filter(
    (card) =>
      user.isSuperAdmin ||
      canAccess(user, "subscriptions.read") ||
      canAccess(user, card.permission)
  ).map(({ permission: _p, ...card }) => card);

  return (
    <AdminModuleHub
      title="Đăng ký & Thanh toán"
      description="Quản lý gói đăng ký, đơn SePay và webhook."
      cards={cards}
    />
  );
}
