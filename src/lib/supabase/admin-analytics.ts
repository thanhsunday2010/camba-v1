import { createAdminClient } from "@/lib/supabase/admin";

/** Service-role client for admin/analytics tables not yet in generated Database types. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAdminAnalyticsClient(): any {
  return createAdminClient();
}
