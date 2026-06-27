"use server";

import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import type { AuditLogRow } from "@/lib/admin/users/types";
import type { AuditLogDbRow, ProfileRow } from "@/lib/admin/db-rows";
import { requirePermission } from "@/actions/admin/_shared";

const PAGE_SIZE = 50;

export async function listAuditLogs(options: {
  action?: string;
  page?: number;
}): Promise<{ logs: AuditLogRow[]; total: number; page: number }> {
  await requirePermission("audit.read");

  const supabase = createAdminAnalyticsClient();
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("admin_audit_logs")
    .select("id, actor_id, action, resource_type, resource_id, metadata, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (options.action?.trim()) {
    query = query.ilike("action", `%${options.action.trim()}%`);
  }

  const { data: logs, count } = (await query.range(offset, offset + PAGE_SIZE - 1)) as {
    data: AuditLogDbRow[] | null;
    count: number | null;
  };
  const actorIds = [
    ...new Set((logs ?? []).map((l) => l.actor_id).filter(Boolean)),
  ] as string[];

  const { data: profiles } = actorIds.length
    ? ((await supabase.from("profiles").select("id, email").in("id", actorIds)) as {
        data: ProfileRow[] | null;
      })
    : { data: [] as ProfileRow[] };

  const emailMap = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  return {
    logs: (logs ?? []).map((log) => ({
      id: log.id,
      actorId: log.actor_id,
      actorEmail: log.actor_id ? (emailMap.get(log.actor_id) ?? null) : null,
      action: log.action,
      resourceType: log.resource_type,
      resourceId: log.resource_id,
      metadata: (log.metadata as Record<string, unknown> | null) ?? null,
      createdAt: log.created_at,
    })),
    total: count ?? 0,
    page,
  };
}
