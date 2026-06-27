"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { signOut } from "@/actions/auth";
import { AdminSidebar } from "@/components/admin/shell/admin-sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Menu, Settings, Shield, X } from "lucide-react";
import { MascotBrandLink } from "@/components/mascot";
import type { AuthUser } from "@/types";

interface AdminShellProps {
  user: AuthUser;
  children: React.ReactNode;
  pendingReview?: number;
}

export function AdminShell({ user, children, pendingReview = 0 }: AdminShellProps) {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-violet-100 bg-white camba-safe-top">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <MascotBrandLink href="/admin" />
            <span className="hidden items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800 sm:inline-flex">
              <Shield className="h-3.5 w-3.5" />
              {user.isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 md:flex"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t("dashboard")}
            </Link>
            <span className="hidden max-w-[140px] truncate text-sm text-gray-600 lg:inline">
              {user.fullName || user.email}
            </span>
            <Link href="/settings">
              <Button variant="ghost" size="icon" aria-label={t("settings")}>
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <form action={signOut}>
              <Button variant="ghost" size="icon" type="submit" aria-label={t("logout")}>
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="hidden lg:block">
          <AdminSidebar user={user} pendingReview={pendingReview} />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Đóng menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative flex h-full w-72 flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="font-semibold text-gray-900">Menu Admin</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <AdminSidebar
                user={user}
                pendingReview={pendingReview}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
