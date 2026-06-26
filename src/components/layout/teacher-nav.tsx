"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutDashboard, LogOut, Settings } from "lucide-react";
import type { AuthUser } from "@/types";

interface TeacherNavProps {
  user: AuthUser;
}

export function TeacherNav({ user }: TeacherNavProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/teacher" className="flex items-center gap-2 text-primary">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold hidden sm:inline">{tc("appName")}</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/teacher"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg camba-ui-sm font-medium ${
              pathname === "/teacher" || pathname.startsWith("/teacher/")
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            {t("teacherDashboard")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="camba-ui-sm text-gray-600 hidden sm:inline truncate max-w-[120px]">
            {user.fullName || user.email}
          </span>
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <form action={signOut}>
            <Button variant="ghost" size="icon" type="submit">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
