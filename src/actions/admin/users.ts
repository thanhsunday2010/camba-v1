"use server";

import { revalidatePath } from "next/cache";
import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import { writeAuditLog } from "@/lib/admin/audit";
import type {
  AdminClassRow,
  AdminParentLinkRow,
  AdminProgressSummary,
  AdminUserDetail,
  AdminUserSummary,
} from "@/lib/admin/users/types";
import { requirePermission } from "@/actions/admin/_shared";
import type { UserRole } from "@/types/database";
import type {
  ClassRow,
  ClassStudentRow,
  ParentLinkRow,
  ProfileRow,
  SubscriptionRow,
  UserRoleRow,
} from "@/lib/admin/db-rows";

const PAGE_SIZE = 25;

function revalidateUserPaths() {
  revalidatePath("/admin/users", "layout");
}

async function fetchUserSummaries(
  userIds: string[]
): Promise<Map<string, AdminUserSummary>> {
  if (userIds.length === 0) return new Map();

  const supabase = createAdminAnalyticsClient();
  const { data: profiles } = (await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, is_active, is_super_admin, created_at")
    .in("id", userIds)) as { data: ProfileRow[] | null };

  const [{ data: roles }, { data: subs }] = await Promise.all([
    supabase.from("user_roles").select("user_id, role").in("user_id", userIds),
    supabase
      .from("user_subscriptions")
      .select("user_id, tier")
      .in("user_id", userIds)
      .eq("program", "cambridge")
      .eq("status", "active"),
  ]);

  const roleRows = (roles ?? []) as UserRoleRow[];
  const subRows = (subs ?? []) as SubscriptionRow[];
  const rolesByUser = new Map<string, UserRole[]>();
  for (const row of roleRows) {
    const list = rolesByUser.get(row.user_id) ?? [];
    list.push(row.role as UserRole);
    rolesByUser.set(row.user_id, list);
  }

  const tierByUser = new Map<string, string>();
  for (const row of subRows) {
    tierByUser.set(row.user_id, row.tier);
  }

  const map = new Map<string, AdminUserSummary>();
  for (const p of profiles ?? []) {
    map.set(p.id, {
      id: p.id,
      email: p.email,
      fullName: p.full_name,
      avatarUrl: p.avatar_url,
      isActive: p.is_active,
      isSuperAdmin: p.is_super_admin ?? false,
      createdAt: p.created_at,
      roles: rolesByUser.get(p.id) ?? [],
      subscriptionTier: tierByUser.get(p.id) ?? "free",
    });
  }
  return map;
}

export async function searchAdminUsers(options: {
  query?: string;
  role?: UserRole;
  page?: number;
}): Promise<{ users: AdminUserSummary[]; total: number; page: number }> {
  await requirePermission("users.read");

  const supabase = createAdminAnalyticsClient();
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;
  const query = options.query?.trim() ?? "";

  let filterIds: string[] | null = null;
  if (options.role) {
    const { data: roleRows } = (await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", options.role)) as { data: { user_id: string }[] | null };
    filterIds = [...new Set((roleRows ?? []).map((r) => r.user_id))];
    if (filterIds.length === 0) {
      return { users: [], total: 0, page };
    }
  }

  let profileQuery = supabase
    .from("profiles")
    .select("id", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filterIds) profileQuery = profileQuery.in("id", filterIds);
  if (query) {
    profileQuery = profileQuery.or(
      `email.ilike.%${query}%,full_name.ilike.%${query}%`
    );
  }

  const { data: idRows, count } = await profileQuery.range(offset, offset + PAGE_SIZE - 1);
  const ids = ((idRows ?? []) as { id: string }[]).map((r) => r.id);
  const summaries = await fetchUserSummaries(ids);

  return {
    users: ids.map((id) => summaries.get(id)).filter(Boolean) as AdminUserSummary[],
    total: count ?? 0,
    page,
  };
}

export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  await requirePermission("users.read");

  const supabase = createAdminAnalyticsClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return null;

  const summaryMap = await fetchUserSummaries([userId]);
  const base = summaryMap.get(userId);
  if (!base) return null;

  const [
    { count: lessonsCompleted },
    { count: exerciseAttempts },
    { count: mockAttempts },
    { data: gamification },
    { data: streak },
  ] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("completion_percent", 100),
    supabase
      .from("exercise_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("mock_test_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase.from("user_gamification").select("total_xp").eq("user_id", userId).maybeSingle(),
    supabase.from("user_streaks").select("current_streak").eq("user_id", userId).maybeSingle(),
  ]);

  return {
    ...base,
    phone: profile.phone,
    locale: profile.locale,
    lessonsCompleted: lessonsCompleted ?? 0,
    exerciseAttempts: exerciseAttempts ?? 0,
    mockAttempts: mockAttempts ?? 0,
    totalXp: gamification?.total_xp ?? 0,
    currentStreak: streak?.current_streak ?? 0,
  };
}

export async function assignUserRole(
  userId: string,
  role: UserRole
): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("users.roles");

  if (role === "admin" && !actor.isSuperAdmin && !actor.adminPermissions.includes("users.admin")) {
    return { success: false, error: "Không có quyền gán role admin" };
  }

  const supabase = createAdminAnalyticsClient();
  const { error } = await supabase.from("user_roles").upsert(
    {
      user_id: userId,
      role,
      assigned_by: actor.id,
    },
    { onConflict: "user_id,role" }
  );

  if (error) return { success: false, error: error.message };

  await writeAuditLog({
    actorId: actor.id,
    action: "user.role.assign",
    resourceType: "user",
    resourceId: userId,
    metadata: { role },
  });

  revalidateUserPaths();
  return { success: true };
}

export async function revokeUserRole(
  userId: string,
  role: UserRole
): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("users.roles");

  if (role === "admin") {
    if (!actor.isSuperAdmin && !actor.adminPermissions.includes("users.admin")) {
      return { success: false, error: "Không có quyền thu hồi admin" };
    }
    const { data: profile } = await supabaseGetProfile(userId);
    if (profile?.is_super_admin) {
      const superCount = await countSuperAdmins();
      if (superCount <= 1) {
        return { success: false, error: "Không thể thu hồi Super Admin cuối cùng" };
      }
    }
  }

  const supabase = createAdminAnalyticsClient();
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", role);

  if (error) return { success: false, error: error.message };

  if (role === "admin") {
    await supabase.from("admin_assignments").delete().eq("user_id", userId);
    await supabase.from("admin_permission_overrides").delete().eq("user_id", userId);
    await supabase
      .from("profiles")
      .update({ is_super_admin: false })
      .eq("id", userId);
  }

  await writeAuditLog({
    actorId: actor.id,
    action: "user.role.revoke",
    resourceType: "user",
    resourceId: userId,
    metadata: { role },
  });

  revalidateUserPaths();
  revalidatePath("/admin/system", "layout");
  return { success: true };
}

export async function setUserActive(
  userId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("users.roles");
  const supabase = createAdminAnalyticsClient();

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };

  await writeAuditLog({
    actorId: actor.id,
    action: isActive ? "user.activate" : "user.deactivate",
    resourceType: "user",
    resourceId: userId,
  });

  revalidateUserPaths();
  return { success: true };
}

async function supabaseGetProfile(userId: string) {
  const supabase = createAdminAnalyticsClient();
  return supabase.from("profiles").select("is_super_admin").eq("id", userId).maybeSingle();
}

async function countSuperAdmins(): Promise<number> {
  const supabase = createAdminAnalyticsClient();
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_super_admin", true);
  return count ?? 0;
}

export async function listParentLinks(options: {
  query?: string;
  page?: number;
}): Promise<{ links: AdminParentLinkRow[]; total: number; page: number }> {
  await requirePermission("users.parents");

  const supabase = createAdminAnalyticsClient();
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const { data: links, count } = (await supabase
    .from("parent_student_links")
    .select("id, parent_id, student_id, status, invited_at", { count: "exact" })
    .order("invited_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)) as {
    data: ParentLinkRow[] | null;
    count: number | null;
  };

  const ids = new Set<string>();
  for (const link of links ?? []) {
    ids.add(link.parent_id);
    ids.add(link.student_id);
  }
  const profiles = await fetchUserSummaries([...ids]);

  let rows: AdminParentLinkRow[] = (links ?? []).map((link: ParentLinkRow) => {
    const parent = profiles.get(link.parent_id);
    const student = profiles.get(link.student_id);
    return {
      id: link.id,
      parentId: link.parent_id,
      parentEmail: parent?.email ?? "",
      parentName: parent?.fullName ?? "",
      studentId: link.student_id,
      studentEmail: student?.email ?? "",
      studentName: student?.fullName ?? "",
      status: link.status,
      invitedAt: link.invited_at,
    };
  });

  const q = options.query?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (r) =>
        r.parentEmail.toLowerCase().includes(q) ||
        r.studentEmail.toLowerCase().includes(q) ||
        r.parentName.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q)
    );
  }

  return { links: rows, total: count ?? 0, page };
}

export async function updateParentLinkStatus(
  linkId: string,
  status: "active" | "revoked" | "pending"
): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("users.parents");
  const supabase = createAdminAnalyticsClient();

  const { error } = await supabase
    .from("parent_student_links")
    .update({
      status,
      accepted_at: status === "active" ? new Date().toISOString() : null,
    })
    .eq("id", linkId);

  if (error) return { success: false, error: error.message };

  await writeAuditLog({
    actorId: actor.id,
    action: "parent_link.update",
    resourceType: "parent_student_link",
    resourceId: linkId,
    metadata: { status },
  });

  revalidateUserPaths();
  return { success: true };
}

export async function listAdminClasses(options: {
  query?: string;
  page?: number;
}): Promise<{ classes: AdminClassRow[]; total: number; page: number }> {
  await requirePermission("users.teachers");

  const supabase = createAdminAnalyticsClient();
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  let classQuery = supabase
    .from("classes")
    .select("id, name, teacher_id, join_code, is_active, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  const q = options.query?.trim();
  if (q) classQuery = classQuery.ilike("name", `%${q}%`);

  const { data: classes, count } = (await classQuery.range(offset, offset + PAGE_SIZE - 1)) as {
    data: ClassRow[] | null;
    count: number | null;
  };
  const teacherIds = [...new Set((classes ?? []).map((c: ClassRow) => c.teacher_id))];
  const teachers = await fetchUserSummaries(teacherIds);

  const classIds = (classes ?? []).map((c: ClassRow) => c.id);
  const { data: studentCounts } = (await supabase
    .from("class_students")
    .select("class_id")
    .in("class_id", classIds.length ? classIds : ["00000000-0000-0000-0000-000000000000"])) as {
    data: ClassStudentRow[] | null;
  };

  const countByClass = new Map<string, number>();
  for (const row of studentCounts ?? []) {
    countByClass.set(row.class_id, (countByClass.get(row.class_id) ?? 0) + 1);
  }

  return {
    classes: (classes ?? []).map((c: ClassRow) => {
      const teacher = teachers.get(c.teacher_id);
      return {
        id: c.id,
        name: c.name,
        teacherId: c.teacher_id,
        teacherEmail: teacher?.email ?? "",
        teacherName: teacher?.fullName ?? "",
        joinCode: c.join_code,
        isActive: c.is_active,
        studentCount: countByClass.get(c.id) ?? 0,
        createdAt: c.created_at,
      };
    }),
    total: count ?? 0,
    page,
  };
}

export async function lookupUserProgress(
  query: string
): Promise<AdminProgressSummary | null> {
  await requirePermission("users.progress");

  const supabase = createAdminAnalyticsClient();
  const q = query.trim();
  if (!q) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
    .limit(1)
    .maybeSingle();

  if (!profile) return null;

  const detail = await getAdminUserDetail(profile.id);
  if (!detail) return null;

  const { count: inProgress } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .gt("completion_percent", 0)
    .lt("completion_percent", 100);

  const summaryMap = await fetchUserSummaries([profile.id]);
  const user = summaryMap.get(profile.id)!;

  return {
    user,
    lessonsCompleted: detail.lessonsCompleted,
    lessonsInProgress: inProgress ?? 0,
    exerciseAttempts: detail.exerciseAttempts,
    mockAttempts: detail.mockAttempts,
    totalXp: detail.totalXp,
    currentStreak: detail.currentStreak,
  };
}
