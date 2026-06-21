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

interface LevelUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number;
  title?: string;
  description?: string;
  continueLabel?: string;
}

export function LevelUpModal({
  open,
  onOpenChange,
  level,
  title = "Chúc mừng!",
  description,
  continueLabel = "Tiếp tục học",
}: LevelUpModalProps) {
  const desc =
    description ?? `Bạn đã lên cấp ${level}. Hãy tiếp tục phát huy nhé!`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center camba-scale-in">
        <DialogHeader className="items-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/15">
            <Trophy className="h-9 w-9 text-warning" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-center">{desc}</DialogDescription>
        </DialogHeader>
        <div className="camba-stat text-program py-2">Cấp {level}</div>
        <Button variant="celebration" className="w-full" onClick={() => onOpenChange(false)}>
          {continueLabel}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
