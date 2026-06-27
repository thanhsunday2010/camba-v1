"use client";

import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";
import { hasAnyAdminPermission, type AdminPermission } from "@/lib/auth/admin-permissions";
import { ADMIN_NAV_GROUPS, type AdminNavItem } from "@/lib/admin/nav-config";
import type { AuthUser } from "@/types";

interface AdminSidebarProps {
  user: AuthUser;
  collapsed?: boolean;
  pendingReview?: number;
  onNavigate?: () => void;
}

function canSeeItem(user: AuthUser, item: AdminNavItem): boolean {
  if (user.isSuperAdmin) return true;
  return hasAnyAdminPermission(user.adminPermissions, item.permissions);
}

export function AdminSidebar({
  user,
  collapsed = false,
  pendingReview = 0,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function badgeFor(item: AdminNavItem): number | undefined {
    if (item.badgeKey === "pendingReview" && pendingReview > 0) return pendingReview;
    return undefined;
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-violet-100 bg-white",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {ADMIN_NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => canSeeItem(user, item));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.id}>
              {group.label && !collapsed && (
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {group.label}
                </p>
              )}
              <ul className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const badge = badgeFor(item);

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-violet-600 text-white"
                            : "text-gray-700 hover:bg-violet-50 hover:text-violet-900",
                          collapsed && "justify-center px-2"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {badge != null && (
                              <span
                                className={cn(
                                  "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                                  active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-900"
                                )}
                              >
                                {badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export function filterModuleCards<T extends { permissions: AdminPermission[] }>(
  user: AuthUser,
  cards: T[]
): T[] {
  return cards.filter(
    (card) =>
      user.isSuperAdmin || hasAnyAdminPermission(user.adminPermissions, card.permissions)
  );
}
