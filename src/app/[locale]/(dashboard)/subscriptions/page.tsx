import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { SubscriptionPricingView } from "@/components/subscriptions/subscription-pricing-view";
import {
  getSubscriptionCatalog,
  getUserSubscriptionStatus,
} from "@/lib/subscriptions/subscription-service";
import { buildSubscriptionPricingLabels } from "@/lib/subscriptions/subscription-labels";
import { isSepayConfigured } from "@/lib/payments/sepay-config";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("subscriptions");
  const [catalog, status] = await Promise.all([
    Promise.resolve(getSubscriptionCatalog()),
    getUserSubscriptionStatus(),
  ]);

  if (!status) redirect("/login");

  const labels = buildSubscriptionPricingLabels((key) => t(key));

  return (
    <SubscriptionPricingView
      catalog={catalog}
      status={status}
      labels={labels}
      paymentsEnabled={isSepayConfigured()}
    />
  );
}
