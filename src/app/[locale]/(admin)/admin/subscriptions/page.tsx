import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { CreditCard, Receipt, Webhook } from "lucide-react";

export default async function AdminSubscriptionsHubPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "subscriptions.read")) redirect("/admin");

  return (
    <AdminModuleHub
      title="Đăng ký & Thanh toán"
      description="Quản lý gói đăng ký, đơn SePay và webhook."
      cards={[
        {
          id: "plans",
          title: "Gói đăng ký",
          description: "Free, Pro, VIP và gán thủ công",
          href: "/admin/subscriptions/plans",
          icon: CreditCard,
        },
        {
          id: "orders",
          title: "Đơn thanh toán",
          description: "Theo dõi và đối soát đơn SePay",
          href: "/admin/subscriptions/orders",
          icon: Receipt,
        },
        {
          id: "webhooks",
          title: "Webhook SePay",
          description: "Nhật ký sự kiện webhook",
          href: "/admin/subscriptions/webhooks",
          icon: Webhook,
        },
      ]}
    />
  );
}
