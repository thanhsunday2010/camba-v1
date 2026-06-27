"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Flame, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { restoreStreakAction } from "@/actions/gamification/streak-restore";
import { Button } from "@/components/ui/button";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { StreakRestoreOffer } from "@/lib/gamification/streak-restore";

interface StreakRestoreBannerProps {
  offer: StreakRestoreOffer;
  labels: {
    title: string;
    description: string;
    cta: string;
    pending: string;
    insufficientXp: string;
    daysLeft: string;
    error: string;
  };
}

export function StreakRestoreBanner({ offer, labels }: StreakRestoreBannerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!offer.previousStreak && offer.reason !== "insufficient_xp") {
    return null;
  }

  if (offer.reason === "expired" || offer.reason === "no_pending_restore") {
    return null;
  }

  const description = offer.eligible
    ? labels.description
        .replace("{streak}", String(offer.restoreToStreak))
        .replace("{previous}", String(offer.previousStreak))
        .replace("{xp}", String(offer.xpCost))
        .replace("{days}", String(offer.daysRemaining))
    : labels.insufficientXp
        .replace("{xp}", String(offer.xpCost))
        .replace("{balance}", String(offer.userTotalXp));

  return (
    <CambaCard
      variant="default"
      padding="md"
      className="border-[var(--color-streak)]/25 bg-[var(--color-streak)]/5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="camba-body font-semibold text-foreground flex items-center gap-2">
            <Flame className="h-4 w-4 text-[var(--color-streak)]" aria-hidden />
            {labels.title}
          </p>
          <p className="camba-caption text-muted">{description}</p>
          {offer.daysRemaining > 0 && (
            <p className="camba-caption text-[var(--color-streak)] font-medium">
              {labels.daysLeft.replace("{days}", String(offer.daysRemaining))}
            </p>
          )}
        </div>
        <Button
          type="button"
          disabled={!offer.eligible || isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await restoreStreakAction();
              if (result.success) {
                router.refresh();
                return;
              }
              toast.error(result.error ?? labels.error);
            });
          }}
          className="shrink-0 gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {isPending ? labels.pending : labels.cta.replace("{xp}", String(offer.xpCost))}
        </Button>
      </div>
    </CambaCard>
  );
}
