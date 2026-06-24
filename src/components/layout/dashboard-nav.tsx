"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { PlacementPickerDialog } from "@/components/learning/placement-picker-dialog";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  Settings,
  LogOut,
  Map,
  Menu,
  Trophy,
  UserCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import type { AuthUser } from "@/types";
import type { PlacementTestSummary } from "@/types/learning";

interface DashboardNavProps {
  user: AuthUser;
  placementTests?: PlacementTestSummary[];
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/journey", icon: Map, labelKey: "journey" as const },
  { href: "/learning", icon: BookOpen, labelKey: "learningPath" as const },
  { href: "/mock-tests", icon: FileText, labelKey: "mockTests" as const },
  { href: "/achievements", icon: Trophy, labelKey: "achievements" as const },
  { href: "/profile", icon: UserCircle, labelKey: "profile" as const },
];

function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  href?: string;
  icon: typeof LayoutDashboard;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  const className = `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"
  }`;

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export function DashboardNav({ user, placementTests = [] }: DashboardNavProps) {
  const t = useTranslations("nav");
  const tp = useTranslations("placement");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const placementActive =
    pathname === "/placement-test" || pathname.startsWith("/placement-test/");

  const placementTrigger = (mobile?: boolean) => (
    <NavLink
      icon={ClipboardList}
      label={t("placementTest")}
      isActive={placementActive}
      onClick={mobile ? () => setMobileOpen(false) : undefined}
    />
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold hidden sm:inline">{tc("appName")}</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  isActive={isActive}
                />
              );
            })}
            {placementTests.length > 0 && (
              <PlacementPickerDialog
                tests={placementTests}
                labels={{
                  title: tp("pickerTitle"),
                  subtitle: tp("pickerSubtitle"),
                  questions: tp("questions"),
                  minutes: tp("minutes"),
                  empty: tp("pickerEmpty"),
                  close: tp("close"),
                }}
                trigger={placementTrigger()}
              />
            )}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline truncate max-w-[120px]">
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

        {mobileOpen && (
          <nav className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  isActive={isActive}
                  onClick={() => setMobileOpen(false)}
                />
              );
            })}
            {placementTests.length > 0 && (
              <PlacementPickerDialog
                tests={placementTests}
                labels={{
                  title: tp("pickerTitle"),
                  subtitle: tp("pickerSubtitle"),
                  questions: tp("questions"),
                  minutes: tp("minutes"),
                  empty: tp("pickerEmpty"),
                  close: tp("close"),
                }}
                trigger={placementTrigger(true)}
              />
            )}
          </nav>
        )}
      </header>
    </>
  );
}
