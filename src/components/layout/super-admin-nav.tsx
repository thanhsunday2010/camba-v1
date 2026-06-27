"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";
import { MascotBrandLink } from "@/components/mascot";
import type { AuthUser } from "@/types";

interface SuperAdminNavProps {
  user: AuthUser;
}

export function SuperAdminNav({ user }: SuperAdminNavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-violet-100 bg-white camba-safe-top">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16">
        <div className="flex items-center gap-3">
          <MascotBrandLink href="/admin" />
          <span className="hidden items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800 sm:inline-flex">
            <Shield className="h-3.5 w-3.5" />
            Super Admin
          </span>
        </div>

        <nav className="flex items-center gap-1">
          <Link
            href="/admin"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              pathname === "/admin" || pathname.startsWith("/admin/")
                ? "bg-violet-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t("superAdminDashboard")}</span>
          </Link>
          <Link
            href="/dashboard"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 md:flex"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t("dashboard")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
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
  );
}
