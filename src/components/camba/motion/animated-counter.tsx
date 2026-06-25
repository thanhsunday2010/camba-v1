"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  durationMs?: number;
  format?: (value: number) => string;
}

export function AnimatedCounter({
  value,
  className,
  durationMs = 600,
  format = (v) => String(Math.round(v)),
}: AnimatedCounterProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const from = display;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(from + (value - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate to new target from current display
  }, [value, durationMs, reduced]);

  return (
    <span className={cn("tabular-nums", className)} aria-live="polite">
      {format(display)}
    </span>
  );
}
