import type { UserRole } from "@/types/database";

export interface AdminUserSummary {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isActive: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  roles: UserRole[];
  subscriptionTier: string | null;
}

export interface AdminUserDetail extends AdminUserSummary {
  phone: string | null;
  locale: string;
  lessonsCompleted: number;
  exerciseAttempts: number;
  mockAttempts: number;
  totalXp: number;
  currentStreak: number;
}

export interface AdminParentLinkRow {
  id: string;
  parentId: string;
  parentEmail: string;
  parentName: string;
  studentId: string;
  studentEmail: string;
  studentName: string;
  status: string;
  invitedAt: string;
}

export interface AdminClassRow {
  id: string;
  name: string;
  teacherId: string;
  teacherEmail: string;
  teacherName: string;
  joinCode: string;
  isActive: boolean;
  studentCount: number;
  createdAt: string;
}

export interface AdminProgressSummary {
  user: AdminUserSummary;
  lessonsCompleted: number;
  lessonsInProgress: number;
  exerciseAttempts: number;
  mockAttempts: number;
  totalXp: number;
  currentStreak: number;
}

export interface AdminRoleTemplateRow {
  id: string;
  slug: string;
  nameVi: string;
  descriptionVi: string | null;
  permissions: string[];
}

export interface AdminAssignmentRow {
  userId: string;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
  templateId: string | null;
  templateSlug: string | null;
  templateName: string | null;
  grantedAt: string | null;
  overridePermissions: { permission: string; granted: boolean }[];
}

export interface AuditLogRow {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}
