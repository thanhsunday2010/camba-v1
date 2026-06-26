"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MascotMood } from "@/components/mascot/mascot-provider";

interface CambaRabbitMascotProps {
  mood?: MascotMood;
  className?: string;
}

const IDLE_PLAYFUL_MS = 2000;
const PLAYFUL_FACE_COUNT = 6;

type PlayfulFace = 0 | 1 | 2 | 3 | 4 | 5;

function MascotEyes({ mood, playful }: { mood: MascotMood; playful: PlayfulFace }) {
  if (mood === "clever") {
    return (
      <>
        <path d="M20 34 Q22 32 24 34" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <ellipse cx="42" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
      </>
    );
  }

  if (mood === "loading") {
    return (
      <>
        <ellipse cx="22" cy="33" rx="2.2" ry="1.2" fill="#1E293B" />
        <ellipse cx="42" cy="33" rx="2.2" ry="1.2" fill="#1E293B" />
      </>
    );
  }

  if (mood === "idle") {
    switch (playful) {
      case 1:
        return (
          <>
            <path d="M19 34 Q22 31 25 34" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <ellipse cx="42" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
          </>
        );
      case 2:
        return (
          <>
            <ellipse cx="22" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
            <path d="M39 34 Q42 31 45 34" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        );
      case 3:
        return (
          <>
            <path d="M18 35 Q22 32 26 35" stroke="#1E293B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M38 35 Q42 32 46 35" stroke="#1E293B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </>
        );
      case 4:
        return (
          <>
            <ellipse cx="23" cy="33" rx="2.2" ry="2.8" fill="#1E293B" />
            <ellipse cx="43" cy="33" rx="2.2" ry="2.8" fill="#1E293B" />
          </>
        );
      case 5:
        return (
          <>
            <ellipse cx="22" cy="34" rx="2.8" ry="2.2" fill="#1E293B" />
            <ellipse cx="42" cy="35" rx="1.6" ry="2.4" fill="#1E293B" />
          </>
        );
      default:
        return (
          <>
            <ellipse cx="22" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
            <ellipse cx="42" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
          </>
        );
    }
  }

  return (
    <>
      <ellipse cx="22" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
      <ellipse cx="42" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
    </>
  );
}

function MascotMouth({ mood, playful }: { mood: MascotMood; playful: PlayfulFace }) {
  if (mood === "excited") {
    return (
      <path
        d="M24 46 Q32 54 40 46"
        stroke="#BE123C"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  if (mood === "idle") {
    switch (playful) {
      case 1:
        return (
          <path
            d="M26 47 Q34 51 40 46"
            stroke="#BE123C"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        );
      case 2:
        return (
          <path
            d="M24 46 Q30 50 38 47"
            stroke="#BE123C"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        );
      case 3:
        return (
          <>
            <path
              d="M24 46 Q32 52 40 46"
              stroke="#BE123C"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="32" cy="49" rx="1.2" ry="0.8" fill="#FB7185" />
          </>
        );
      case 4:
        return (
          <path
            d="M25 48 Q32 49 39 46"
            stroke="#BE123C"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        );
      case 5:
        return (
          <path
            d="M27 46 Q32 53 37 46"
            stroke="#BE123C"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d="M26 47 Q32 50 38 47"
            stroke="#BE123C"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        );
    }
  }

  return (
    <path
      d="M26 47 Q32 50 38 47"
      stroke="#BE123C"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
  );
}

export function CambaRabbitMascot({ mood = "idle", className }: CambaRabbitMascotProps) {
  const reducedMotion = useReducedMotion();
  const [playfulFace, setPlayfulFace] = useState<PlayfulFace>(0);

  useEffect(() => {
    if (mood !== "idle" || reducedMotion) {
      setPlayfulFace(0);
      return;
    }

    const timer = window.setInterval(() => {
      setPlayfulFace((current) => ((current + 1) % PLAYFUL_FACE_COUNT) as PlayfulFace);
    }, IDLE_PLAYFUL_MS);

    return () => window.clearInterval(timer);
  }, [mood, reducedMotion]);

  const playfulTilt =
    mood === "idle" && !reducedMotion
      ? playfulFace === 1
        ? "-rotate-2"
        : playfulFace === 2
          ? "rotate-2"
          : playfulFace === 5
            ? "-rotate-1 scale-[1.02]"
            : ""
      : "";

  return (
    <div
      className={cn(
        "relative shrink-0",
        mood === "excited" && "animate-[mascot-bounce_0.6s_ease-in-out_infinite]",
        mood === "loading" && "animate-[mascot-wiggle_1.2s_ease-in-out_infinite]",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-11 sm:w-11 drop-shadow-sm">
        <g className={cn("origin-center transition-transform duration-300 ease-out", playfulTilt)}>
          <ellipse cx="18" cy="14" rx="7" ry="16" fill="#FDA4AF" />
          <ellipse cx="46" cy="14" rx="7" ry="16" fill="#FDA4AF" />
          <ellipse cx="18" cy="14" rx="4" ry="11" fill="#FECDD3" />
          <ellipse cx="46" cy="14" rx="4" ry="11" fill="#FECDD3" />
          <circle cx="32" cy="36" r="22" fill="#FFF7ED" />
          <circle cx="32" cy="38" r="18" fill="#FFEDD5" opacity="0.55" />
          <ellipse cx="32" cy="52" rx="9" ry="6" fill="#FFE4E6" />
          <circle cx="22" cy="34" r="4.5" fill="white" stroke="#334155" strokeWidth="1.2" />
          <circle cx="42" cy="34" r="4.5" fill="white" stroke="#334155" strokeWidth="1.2" />
          <g className="transition-all duration-200 ease-out">
            <MascotEyes mood={mood} playful={playfulFace} />
          </g>
          <circle cx="16" cy="40" r="3" fill="#FDA4AF" opacity="0.55" />
          <circle cx="48" cy="40" r="3" fill="#FDA4AF" opacity="0.55" />
          <ellipse cx="32" cy="41" rx="2" ry="1.5" fill="#FB7185" />
          <g className="transition-all duration-200 ease-out">
            <MascotMouth mood={mood} playful={playfulFace} />
          </g>
          <rect x="14" y="31" width="36" height="8" rx="4" fill="#E0F2FE" opacity="0.85" />
          <rect x="16" y="32.5" width="32" height="5" rx="2.5" fill="#BAE6FD" opacity="0.5" />
        </g>
        {mood === "excited" && (
          <>
            <path d="M8 18 L10 22 L6 22 Z" fill="#FBBF24" />
            <path d="M56 20 L58 24 L54 24 Z" fill="#FBBF24" />
            <circle cx="54" cy="14" r="2" fill="#FDE68A" />
          </>
        )}
      </svg>
    </div>
  );
}
