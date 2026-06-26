"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { CambaRabbitMascot } from "@/components/mascot/camba-rabbit-mascot";
import type { MascotMood } from "@/components/mascot/mascot-provider";

const RUN_INTERVAL_MIN_MS = 38_000;
const RUN_INTERVAL_MAX_MS = 72_000;
const RUN_DURATION_S = 3.1;

interface MascotScreenRunnerProps {
  mood: MascotMood;
  children: React.ReactNode;
}

type RunPhase = "home" | "running";

export function MascotScreenRunner({ mood, children }: MascotScreenRunnerProps) {
  const reducedMotion = useReducedMotion();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase, setPhase] = useState<RunPhase>("home");
  const [anchor, setAnchor] = useState({ top: 0, left: 0, width: 44 });

  const scheduleRun = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (reducedMotion) return;

    const delay =
      RUN_INTERVAL_MIN_MS +
      Math.random() * (RUN_INTERVAL_MAX_MS - RUN_INTERVAL_MIN_MS);

    timerRef.current = setTimeout(() => {
      if (mood !== "idle") {
        scheduleRun();
        return;
      }
      const rect = anchorRef.current?.getBoundingClientRect();
      if (rect) {
        setAnchor({
          top: rect.top,
          left: rect.left,
          width: rect.width,
        });
      }
      setPhase("running");
    }, delay);
  }, [mood, reducedMotion]);

  useEffect(() => {
    scheduleRun();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleRun]);

  useEffect(() => {
    if (mood !== "idle" && phase === "home") {
      if (timerRef.current) clearTimeout(timerRef.current);
      scheduleRun();
    }
  }, [mood, phase, scheduleRun]);

  const finishRun = useCallback(() => {
    setPhase("home");
    scheduleRun();
  }, [scheduleRun]);

  const exitX =
    typeof window !== "undefined"
      ? window.innerWidth - anchor.left - anchor.width + 24
      : 600;
  const enterX = -(anchor.left + anchor.width + 24);

  return (
    <>
      <span
        ref={anchorRef}
        className={phase === "running" ? "invisible inline-flex" : "inline-flex"}
      >
        {children}
      </span>

      {phase === "running" &&
        typeof document !== "undefined" &&
        createPortal(
          <motion.div
            className="pointer-events-none fixed z-[100]"
            style={{ top: anchor.top, left: anchor.left }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: [0, exitX, enterX, 0],
              y: [0, -26, -26, 0],
              opacity: [1, 1, 1, 1],
            }}
            transition={{
              duration: RUN_DURATION_S,
              times: [0, 0.42, 0.44, 1],
              ease: ["easeIn", "linear", "linear", "easeOut"],
            }}
            onAnimationComplete={finishRun}
          >
            <CambaRabbitMascot mood="excited" choreo="run" />
          </motion.div>,
          document.body
        )}
    </>
  );
}
