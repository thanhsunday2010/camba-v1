"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MascotMood } from "@/components/mascot/mascot-provider";

interface CambaRabbitMascotProps {
  mood?: MascotMood;
  className?: string;
}

const IDLE_EYE_STEP_MS = 650;
const PLAYFUL_FACE_COUNT = 10;

type PlayfulFace = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type EyeLook = "center" | "left" | "right" | "up" | "down";
type EyeVariant = "open" | "blink" | "squint" | "wide";

const PUPIL_OFFSET: Record<EyeLook, { x: number; y: number }> = {
  center: { x: 0, y: 0 },
  left: { x: -1.35, y: 0 },
  right: { x: 1.35, y: 0 },
  up: { x: 0, y: -1.1 },
  down: { x: 0, y: 0.85 },
};

function MascotEye({
  cx,
  cy,
  look = "center",
  variant = "open",
}: {
  cx: number;
  cy: number;
  look?: EyeLook;
  variant?: EyeVariant;
}) {
  const offset = PUPIL_OFFSET[look];

  if (variant === "blink") {
    return (
      <path
        d={`M${cx - 3.4} ${cy} Q${cx} ${cy + 1.4} ${cx + 3.4} ${cy}`}
        stroke="#0F172A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  if (variant === "squint") {
    return (
      <path
        d={`M${cx - 3.2} ${cy + 0.4} Q${cx} ${cy - 0.6} ${cx + 3.2} ${cy + 0.4}`}
        stroke="#0F172A"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  const irisR = variant === "wide" ? 3 : 2.55;
  const pupilR = variant === "wide" ? 1.75 : 1.45;

  return (
    <>
      <circle cx={cx} cy={cy} r={irisR} fill="#334155" />
      <circle
        cx={cx + offset.x}
        cy={cy + offset.y}
        r={pupilR}
        fill="#0A0A0A"
      />
      <circle
        cx={cx + offset.x - 0.55}
        cy={cy + offset.y - 0.55}
        r={0.5}
        fill="white"
        opacity={0.95}
      />
    </>
  );
}

function MascotEyes({ mood, playful }: { mood: MascotMood; playful: PlayfulFace }) {
  if (mood === "clever") {
    return (
      <>
        <MascotEye cx={22} cy={34} variant="squint" />
        <MascotEye cx={42} cy={34} look="right" variant="open" />
      </>
    );
  }

  if (mood === "loading") {
    return (
      <>
        <MascotEye cx={22} cy={34} look="left" variant="open" />
        <MascotEye cx={42} cy={34} look="right" variant="open" />
      </>
    );
  }

  if (mood === "idle") {
    switch (playful) {
      case 1:
        return (
          <>
            <MascotEye cx={22} cy={34} look="left" />
            <MascotEye cx={42} cy={34} look="left" />
          </>
        );
      case 2:
        return (
          <>
            <MascotEye cx={22} cy={34} look="right" />
            <MascotEye cx={42} cy={34} look="right" />
          </>
        );
      case 3:
        return (
          <>
            <MascotEye cx={22} cy={34} look="up" variant="wide" />
            <MascotEye cx={42} cy={34} look="up" variant="wide" />
          </>
        );
      case 4:
        return (
          <>
            <MascotEye cx={22} cy={34} variant="blink" />
            <MascotEye cx={42} cy={34} variant="blink" />
          </>
        );
      case 5:
        return (
          <>
            <MascotEye cx={22} cy={34} variant="squint" />
            <MascotEye cx={42} cy={34} look="center" />
          </>
        );
      case 6:
        return (
          <>
            <MascotEye cx={22} cy={34} look="center" />
            <MascotEye cx={42} cy={34} variant="squint" />
          </>
        );
      case 7:
        return (
          <>
            <MascotEye cx={22} cy={34} look="down" />
            <MascotEye cx={42} cy={34} look="down" />
          </>
        );
      case 8:
        return (
          <>
            <MascotEye cx={22} cy={34} look="right" />
            <MascotEye cx={42} cy={34} look="left" />
          </>
        );
      case 9:
        return (
          <>
            <MascotEye cx={22} cy={34} look="left" />
            <MascotEye cx={42} cy={34} look="right" />
          </>
        );
      default:
        return (
          <>
            <MascotEye cx={22} cy={34} look="center" />
            <MascotEye cx={42} cy={34} look="center" />
          </>
        );
    }
  }

  return (
    <>
      <MascotEye cx={22} cy={34} look="center" variant="wide" />
      <MascotEye cx={42} cy={34} look="center" variant="wide" />
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
      case 6:
      case 7:
      case 8:
      case 9:
        return (
          <path
            d="M26 47 Q32 50 38 47"
            stroke="#BE123C"
            strokeWidth="1.6"
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
    }, IDLE_EYE_STEP_MS);

    return () => window.clearInterval(timer);
  }, [mood, reducedMotion]);

  const playfulTilt =
    mood === "idle" && !reducedMotion
      ? playfulFace === 1 || playfulFace === 9
        ? "-rotate-2"
        : playfulFace === 2 || playfulFace === 8
          ? "rotate-2"
          : playfulFace === 3
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
          <circle cx="22" cy="34" r="4.8" fill="white" stroke="#334155" strokeWidth="1.3" />
          <circle cx="42" cy="34" r="4.8" fill="white" stroke="#334155" strokeWidth="1.3" />
          <g className="transition-all duration-150 ease-out">
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
