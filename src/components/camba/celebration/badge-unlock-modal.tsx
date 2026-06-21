"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

interface BadgeUnlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badgeName: string;
  badgeDescription?: string;
  title?: string;
  continueLabel?: string;
}

export function BadgeUnlockModal({
  open,
  onOpenChange,
  badgeName,
  badgeDescription,
  title = "Huy hiệu mới!",
  continueLabel = "Tuyệt vời!",
}: BadgeUnlockModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center camba-scale-in">
        <DialogHeader className="items-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/15">
            <Award className="h-9 w-9 text-warning" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-center font-semibold text-foreground text-base">
            {badgeName}
          </DialogDescription>
          {badgeDescription && (
            <p className="camba-body text-muted text-center pt-1">{badgeDescription}</p>
          )}
        </DialogHeader>
        <Button variant="celebration" className="w-full" onClick={() => onOpenChange(false)}>
          {continueLabel}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
