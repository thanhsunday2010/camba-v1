import type { AuthUser } from "@/types";
import type { UserRole } from "@/types/database";

export function hasRole(roles: UserRole[], role: UserRole): boolean {
  return roles.includes(role);
}

export function isAdmin(roles: UserRole[]): boolean {
  return hasRole(roles, "admin");
}

/** Super Admin — highest privilege tier (`profiles.is_super_admin`). */
export function isSuperAdmin(user: Pick<AuthUser, "isSuperAdmin">): boolean {
  return user.isSuperAdmin;
}

export function canAccessAdmin(user: Pick<AuthUser, "roles" | "isSuperAdmin">): boolean {
  return user.isSuperAdmin || isAdmin(user.roles);
}

export function isTeacher(roles: UserRole[]): boolean {
  return hasRole(roles, "teacher");
}

export function isParent(roles: UserRole[]): boolean {
  return hasRole(roles, "parent");
}

export function isStudent(roles: UserRole[]): boolean {
  return hasRole(roles, "student");
}

export function getPrimaryRole(roles: UserRole[]): UserRole {
  const priority: UserRole[] = ["admin", "teacher", "parent", "student"];
  return priority.find((r) => roles.includes(r)) ?? "student";
}

export function getDashboardPath(roles: UserRole[]): string {
  if (isAdmin(roles)) return "/admin";
  if (isTeacher(roles)) return "/teacher";
  if (isParent(roles)) return "/parent";
  return "/dashboard";
}
