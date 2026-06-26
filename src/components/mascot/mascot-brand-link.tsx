"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CambaRabbitMascot } from "@/components/mascot/camba-rabbit-mascot";
import { MascotScreenRunner } from "@/components/mascot/mascot-screen-runner";
import { useMascotOptional } from "@/components/mascot/mascot-provider";

export function MascotBrandLink() {
  const tc = useTranslations("common");
  const mascot = useMascotOptional();
  const mood = mascot?.mood ?? "idle";
  const message = mascot?.message;
  const isVisible = mascot?.isVisible ?? false;

  return (
    <Link
      href="/dashboard"
      className="group relative flex items-center gap-2 min-w-0 text-primary camba-focus-ring rounded-xl pr-1 overflow-visible"
      aria-label={`${tc("appName")} — Dashboard`}
    >
      <MascotScreenRunner mood={mood}>
        <CambaRabbitMascot mood={mood} />
      </MascotScreenRunner>
      <span className="font-bold">{tc("appName")}</span>
      {message && (
        <div
          className={cn(
            "absolute left-0 top-[calc(100%+6px)] z-50 max-w-[min(240px,calc(100vw-2rem))] rounded-2xl border border-primary/15 bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-lg transition-all duration-300",
            "before:absolute before:-top-1.5 before:left-5 before:h-3 before:w-3 before:rotate-45 before:border-l before:border-t before:border-primary/15 before:bg-white",
            isVisible
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none"
          )}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}
    </Link>
  );
}
