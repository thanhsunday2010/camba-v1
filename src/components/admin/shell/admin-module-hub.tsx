"use client";

import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ModuleHubCard {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  stat?: string;
  badge?: number;
}

interface AdminModuleHubProps {
  title: string;
  description: string;
  cards: ModuleHubCard[];
}

export function AdminModuleHub({ title, description, cards }: AdminModuleHubProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.id} href={card.href} className="group block">
              <Card className="h-full transition hover:border-violet-300 hover:shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <span className="truncate">{card.title}</span>
                        {card.badge != null && card.badge > 0 && (
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-900">
                            {card.badge}
                          </span>
                        )}
                      </CardTitle>
                      {card.stat && (
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{card.stat}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{card.description}</p>
                  <span className={cn("mt-3 inline-block text-sm font-medium text-violet-600")}>
                    Quản lý →
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ title, description, breadcrumb, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        {breadcrumb && (
          <p className="text-xs font-medium text-gray-500">{breadcrumb}</p>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
