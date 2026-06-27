"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MascotBrandLink } from "@/components/mascot";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  Settings,
  Map,
  Menu,
  CreditCard,
  X,
} from "lucide-react";
import { useState } from "react";
import type { AuthUser } from "@/types";

interface DashboardNavProps {
  user: AuthUser;
}

/** Temporarily hide Journey from the top nav — set true to show again */
const JOURNEY_NAV_ENABLED = false;

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" as const },
  ...(JOURNEY_NAV_ENABLED
    ? [{ href: "/journey" as const, icon: Map, labelKey: "journey" as const }]
    : []),
  { href: "/learning", icon: BookOpen, labelKey: "learningPath" as const, featured: true },
  { href: "/mock-tests", icon: FileText, labelKey: "mockTests" as const },
  { href: "/subscriptions", icon: CreditCard, labelKey: "pricing" as const },
  { href: "/placement-test", icon: ClipboardList, labelKey: "placementTest" as const },
];

function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
  featured = false,
  onClick,
}: {
  href?: string;
  icon: typeof LayoutDashboard;
  label: string;
  isActive: boolean;
  featured?: boolean;
  onClick?: () => void;
}) {
  const className = cn(
    "flex items-center gap-2 px-3 py-2.5 rounded-lg camba-ui-sm font-medium transition-all min-h-[var(--touch-target-min)] md:min-h-0 md:py-2",
    isActive
      ? "camba-gradient-program text-white font-semibold shadow-md ring-2 ring-program/50 ring-offset-1"
      : featured
        ? "camba-nav-cta-sparkle text-program font-semibold hover:opacity-95"
        : "text-gray-600 hover:bg-gray-100"
  );

  const iconClassName = cn(
    "h-4 w-4 shrink-0",
    isActive ? "text-white" : featured ? "text-program" : undefined
  );

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        <Icon className={cn(iconClassName, featured && !isActive && "relative z-[1]")} />
        <span className={cn(featured && "tracking-wide", featured && !isActive && "relative z-[1]")}>
          {label}
        </span>
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      <Icon className={cn(iconClassName, featured && !isActive && "relative z-[1]")} />
      <span className={cn(featured && "tracking-wide", featured && !isActive && "relative z-[1]")}>
        {label}
      </span>
    </button>
  );
}

export function DashboardNav({ user }: DashboardNavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white camba-safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden p-2 -ml-2 camba-touch-target camba-focus-ring rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="relative">
              <MascotBrandLink />
            </div>
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
                  featured={"featured" in item && item.featured}
                />
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="camba-ui-sm text-gray-600 hidden sm:inline truncate max-w-[120px]">
              {user.fullName || user.email}
            </span>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="camba-touch-target md:h-9 md:w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
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
                  featured={"featured" in item && item.featured}
                  onClick={() => setMobileOpen(false)}
                />
              );
            })}
          </nav>
        )}
      </header>
    </>
  );
}
