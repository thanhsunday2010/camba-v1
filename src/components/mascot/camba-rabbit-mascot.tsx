"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MascotMood } from "@/components/mascot/mascot-provider";

export type MascotChoreo = "default" | "run" | "jump";

interface CambaRabbitMascotProps {
  mood?: MascotMood;
  className?: string;
  choreo?: MascotChoreo;
}

function MascotEye({
  cx,
  cy,
  blinking,
  side,
  mood,
}: {
  cx: number;
  cy: number;
  blinking: boolean;
  side: "left" | "right";
  mood: MascotMood;
}) {
  if (blinking) {
    return (
      <path
        d={`M${cx - 4} ${cy} Q${cx} ${cy + 1.6} ${cx + 4} ${cy}`}
        stroke="#0A0A0A"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  const pupilClass = side === "left" ? "mascot-pupil-left" : "mascot-pupil-right";
  const pupilR = mood === "excited" ? 2.1 : mood === "clever" ? 1.55 : 1.85;
  const pupilOffset =
    mood === "loading"
      ? side === "left"
        ? { x: -1.2, y: 0 }
        : { x: 1.2, y: 0 }
      : mood === "clever" && side === "left"
        ? { x: 0, y: 0.8 }
        : { x: 0, y: 0 };

  return (
    <>
      <circle cx={cx} cy={cy} r={5.2} fill="white" stroke="#1E293B" strokeWidth="1.2" />
      <g className={cn(!blinking && pupilClass)}>
        <circle
          cx={cx + pupilOffset.x}
          cy={cy + pupilOffset.y}
          r={pupilR}
          fill="#0A0A0A"
        />
        <circle
          cx={cx + pupilOffset.x - 0.65}
          cy={cy + pupilOffset.y - 0.65}
          r={0.55}
          fill="white"
          opacity={0.95}
        />
      </g>
    </>
  );
}

function MascotSmile({ mood }: { mood: MascotMood }) {
  const mouthOpen = mood !== "loading";

  if (!mouthOpen) {
    return (
      <path
        d="M30 58 Q40 62 50 58"
        stroke="#BE123C"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  return (
    <>
      <path
        d="M28 56 Q40 68 52 56 Q40 62 28 56 Z"
        fill="#881337"
        stroke="#BE123C"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <rect x="36.2" y="57.5" width="3.2" height="4.8" rx="0.8" fill="white" />
      <rect x="40.6" y="57.5" width="3.2" height="4.8" rx="0.8" fill="white" />
      <path
        d="M28 56 Q40 64 52 56"
        fill="none"
        stroke="#BE123C"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </>
  );
}

function MascotLimbs({
  choreo,
  animate,
}: {
  choreo: MascotChoreo;
  animate: boolean;
}) {
  const isRun = choreo === "run";
  const isJump = choreo === "jump";

  const earClassLeft = animate ? (isRun ? "mascot-run-bob" : "mascot-ear-left") : "";
  const earClassRight = animate ? (isRun ? "mascot-run-bob" : "mascot-ear-right") : "";
  const armClassLeft = animate
    ? isRun
      ? "mascot-run-arm-left"
      : isJump
        ? ""
        : "mascot-arm-left"
    : "";
  const armClassRight = animate
    ? isRun
      ? "mascot-run-arm-right"
      : isJump
        ? ""
        : "mascot-arm-right"
    : "";
  const legClassLeft = animate
    ? isRun
      ? "mascot-run-leg-left"
      : isJump
        ? ""
        : "mascot-leg-left"
    : "";
  const legClassRight = animate
    ? isRun
      ? "mascot-run-leg-right"
      : isJump
        ? ""
        : "mascot-leg-right"
    : "";

  const leftArmRotate = isJump ? -38 : 0;
  const rightArmRotate = isJump ? 38 : 0;
  const leftLegRotate = isJump ? -24 : isRun ? 0 : 0;
  const rightLegRotate = isJump ? 24 : 0;

  return (
    <>
      <g className={earClassLeft}>
        <ellipse cx="28" cy="18" rx="6.5" ry="15" fill="#FDA4AF" />
        <ellipse cx="28" cy="18" rx="3.8" ry="10" fill="#FECDD3" />
      </g>
      <g className={earClassRight}>
        <ellipse cx="52" cy="18" rx="6.5" ry="15" fill="#FDA4AF" />
        <ellipse cx="52" cy="18" rx="3.8" ry="10" fill="#FECDD3" />
      </g>

      <g
        className={legClassLeft}
        style={{
          transform: leftLegRotate ? `rotate(${leftLegRotate}deg)` : undefined,
          transformBox: "fill-box",
          transformOrigin: "50% 0%",
        }}
      >
        <ellipse cx="32" cy="72" rx="5" ry="7" fill="#FFF7ED" stroke="#FECDD3" strokeWidth="1" />
        <ellipse cx="32" cy="79" rx="6" ry="3.2" fill="#FDA4AF" />
      </g>
      <g
        className={legClassRight}
        style={{
          transform: rightLegRotate ? `rotate(${rightLegRotate}deg)` : undefined,
          transformBox: "fill-box",
          transformOrigin: "50% 0%",
        }}
      >
        <ellipse cx="48" cy="72" rx="5" ry="7" fill="#FFF7ED" stroke="#FECDD3" strokeWidth="1" />
        <ellipse cx="48" cy="79" rx="6" ry="3.2" fill="#FDA4AF" />
      </g>

      <circle cx="40" cy="48" r="22" fill="#FFF7ED" />
      <circle cx="40" cy="50" r="17" fill="#FFEDD5" opacity="0.55" />
      <ellipse cx="40" cy="64" rx="10" ry="6.5" fill="#FFE4E6" />

      <g
        className={armClassLeft}
        style={{
          transform: leftArmRotate ? `rotate(${leftArmRotate}deg)` : undefined,
          transformBox: "fill-box",
          transformOrigin: "80% 20%",
        }}
      >
        <ellipse cx="17" cy="50" rx="4.5" ry="8" fill="#FFF7ED" stroke="#FECDD3" strokeWidth="1" />
        <circle cx="15" cy="57" r="3.2" fill="#FDA4AF" />
      </g>
      <g
        className={armClassRight}
        style={{
          transform: rightArmRotate ? `rotate(${rightArmRotate}deg)` : undefined,
          transformBox: "fill-box",
          transformOrigin: "20% 20%",
        }}
      >
        <ellipse cx="63" cy="50" rx="4.5" ry="8" fill="#FFF7ED" stroke="#FECDD3" strokeWidth="1" />
        <circle cx="65" cy="57" r="3.2" fill="#FDA4AF" />
      </g>
    </>
  );
}

export function CambaRabbitMascot({
  mood = "idle",
  className,
  choreo = "default",
}: CambaRabbitMascotProps) {
  const reducedMotion = useReducedMotion();
  const [blinking, setBlinking] = useState(false);
  const animate = !reducedMotion;

  useEffect(() => {
    if (reducedMotion) return;

    let blinkTimeout: ReturnType<typeof setTimeout> | undefined;
    const scheduleBlink = () => {
      const delay = 2200 + Math.random() * 2600;
      blinkTimeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 140);
      }, delay);
    };

    scheduleBlink();
    return () => {
      if (blinkTimeout) clearTimeout(blinkTimeout);
    };
  }, [reducedMotion]);

  return (
    <div
      className={cn(
        "relative shrink-0",
        choreo === "run" && animate && "mascot-run-bob",
        mood === "excited" && choreo === "default" && "animate-[mascot-bounce_0.6s_ease-in-out_infinite]",
        mood === "loading" && choreo === "default" && "animate-[mascot-wiggle_1.2s_ease-in-out_infinite]",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 80 88" className="h-11 w-11 sm:h-12 sm:w-12 drop-shadow-sm overflow-visible">
        <MascotLimbs choreo={choreo} animate={animate} />

        <MascotEye cx={33} cy={44} blinking={blinking} side="left" mood={mood} />
        <MascotEye cx={47} cy={44} blinking={blinking} side="right" mood={mood} />

        <circle cx="14" cy="50" r="3.2" fill="#FDA4AF" opacity="0.55" />
        <circle cx="66" cy="50" r="3.2" fill="#FDA4AF" opacity="0.55" />
        <ellipse cx="40" cy="51" rx="2.2" ry="1.6" fill="#FB7185" />

        <MascotSmile mood={mood} />

        {mood === "excited" && (
          <>
            <path d="M6 20 L8.5 25 L3.5 25 Z" fill="#FBBF24" />
            <path d="M74 22 L76.5 27 L71.5 27 Z" fill="#FBBF24" />
            <circle cx="70" cy="16" r="2.2" fill="#FDE68A" />
          </>
        )}
      </svg>
    </div>
  );
}
