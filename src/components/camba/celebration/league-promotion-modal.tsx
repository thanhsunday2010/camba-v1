"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { leagueTierLabel } from "@/lib/gamification/leaderboard-types";

interface LeaguePromotionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: string;
  rank: number | null;
  title?: string;
  continueLabel?: string;
  tierLabels?: Record<string, string>;
}

export function LeaguePromotionModal({
  open,
  onOpenChange,
  tier,
  rank,
  title = "Thăng hạng giải đấu!",
  continueLabel = "Tiếp tục học",
  tierLabels,
}: LeaguePromotionModalProps) {
  const tierName = leagueTierLabel(tier, tierLabels);
  const description =
    rank != null
      ? `Bạn đã lên bảng ${tierName} và đang ở hạng #${rank} tuần này.`
      : `Bạn đã lên bảng ${tierName} tuần này.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center camba-scale-in">
        <DialogHeader className="items-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-program/15">
            <Trophy className="h-9 w-9 text-program" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <div className="camba-stat text-program py-2">{tierName}</div>
        {rank != null && (
          <p className="camba-caption text-muted">Hạng #{rank} · tuần này</p>
        )}
        <Button variant="celebration" className="w-full" onClick={() => onOpenChange(false)}>
          {continueLabel}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
