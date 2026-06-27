import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";

export interface WriteAuditLogInput {
  actorId: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(input: WriteAuditLogInput): Promise<void> {
  try {
    const supabase = createAdminAnalyticsClient();
    await supabase.from("admin_audit_logs").insert({
      actor_id: input.actorId,
      action: input.action,
      resource_type: input.resourceType ?? null,
      resource_id: input.resourceId ?? null,
      metadata: input.metadata ?? null,
    });
  } catch {
    // Audit failure must not block admin operations
  }
}
