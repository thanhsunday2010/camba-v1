"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCambaMotion } from "@/components/camba/motion/use-camba-motion";
import { useEffect } from "react";

const CONFETTI_COLORS = [
  "var(--color-xp)",
  "var(--color-program)",
  "#f59e0b",
  "#ec4899",
  "#22c55e",
  "#3b82f6",
];

interface ConfettiBurstProps {
  active: boolean;
  onComplete?: () => void;
}

export function ConfettiBurst({ active, onComplete }: ConfettiBurstProps) {
  const motionConfig = useCambaMotion();

  useEffect(() => {
    if (!active || motionConfig.prefersReducedMotion) return;
    const timer = setTimeout(() => onComplete?.(), 2200);
    return () => clearTimeout(timer);
  }, [active, motionConfig.prefersReducedMotion, onComplete]);

  if (!active || motionConfig.prefersReducedMotion) return null;

  const pieces = Array.from({ length: 28 }, (_, index) => ({
    id: index,
    left: `${8 + ((index * 17) % 84)}%`,
    delay: (index % 7) * 0.04,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    rotate: (index % 5) * 36,
  }));

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      aria-hidden
    >
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.span
            key={piece.id}
            initial={{ opacity: 0, y: -20, x: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: ["-5vh", "95vh"],
              x: [0, (piece.id % 2 === 0 ? 1 : -1) * (12 + (piece.id % 6) * 8)],
              rotate: piece.rotate,
            }}
            transition={{
              duration: 2,
              delay: piece.delay,
              ease: "easeOut",
            }}
            className="absolute top-0 h-2.5 w-1.5 rounded-sm"
            style={{
              left: piece.left,
              backgroundColor: piece.color,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
