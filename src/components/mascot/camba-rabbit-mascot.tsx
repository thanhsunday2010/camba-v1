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

const FUR = "#FFFFFF";
const FUR_SHADOW = "#E8E2F4";
const STROKE = "#3B0764";
const STROKE_MID = "#5B21B6";
const PINK = "#F472B6";
const PINK_DEEP = "#EC4899";
const PINK_LIGHT = "#FBCFE8";
const EAR_INNER = "#F9A8D4";
const BLUSH = "#FDA4AF";
const EYE_BG = "#121212";
const COLLAR = "#6D28D9";
const COLLAR_DARK = "#4C1D95";

function FourPointStar({
  cx,
  cy,
  size,
  fill = "#FFFFFF",
  opacity = 1,
}: {
  cx: number;
  cy: number;
  size: number;
  fill?: string;
  opacity?: number;
}) {
  const r = size;
  const c = r * 0.28;
  const d = [
    `M ${cx} ${cy - r}`,
    `Q ${cx + c} ${cy - c} ${cx + r} ${cy}`,
    `Q ${cx + c} ${cy + c} ${cx} ${cy + r}`,
    `Q ${cx - c} ${cy + c} ${cx - r} ${cy}`,
    `Q ${cx - c} ${cy - c} ${cx} ${cy - r}`,
    "Z",
  ].join(" ");

  return <path d={d} fill={fill} opacity={opacity} />;
}

function MascotDefs() {
  return (
    <defs>
      <linearGradient id="camba-fur" x1="20" y1="30" x2="60" y2="72" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={FUR} />
        <stop offset="55%" stopColor={FUR} />
        <stop offset="100%" stopColor={FUR_SHADOW} />
      </linearGradient>
      <linearGradient id="camba-ear-inner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={PINK_LIGHT} />
        <stop offset="100%" stopColor={EAR_INNER} />
      </linearGradient>
      <linearGradient id="camba-collar" x1="40" y1="74" x2="40" y2="94" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={COLLAR} />
        <stop offset="100%" stopColor={COLLAR_DARK} />
      </linearGradient>
      <radialGradient id="camba-cheek" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={BLUSH} stopOpacity="0.55" />
        <stop offset="100%" stopColor={BLUSH} stopOpacity="0" />
      </radialGradient>
      <filter id="camba-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.8" stdDeviation="1.4" floodColor="#6D28D9" floodOpacity="0.18" />
      </filter>
    </defs>
  );
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
  const isLeft = side === "left";
  const pupilClass = isLeft ? "mascot-pupil-left" : "mascot-pupil-right";
  const outerX = isLeft ? cx + 8 : cx - 8;

  if (blinking) {
    return (
      <path
        d={`M${cx - 8} ${cy + 1} Q${cx} ${cy + 4.5} ${cx + 8} ${cy + 1}`}
        stroke={STROKE}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  if (mood === "loading") {
    return (
      <>
        <ellipse cx={cx} cy={cy + 1} rx="8.5" ry="9.5" fill={EYE_BG} stroke={STROKE} strokeWidth="1.8" />
        <circle cx={cx} cy={cy + 1} r="2.2" fill={PINK} />
      </>
    );
  }

  const tilt = mood === "clever" ? (isLeft ? -4 : 3) : 0;
  const starSize = mood === "excited" ? 4.8 : 4.2;
  const eyeRx = mood === "excited" ? 9.4 : 8.8;
  const eyeRy = mood === "excited" ? 10.6 : 10;

  return (
    <g transform={`rotate(${tilt} ${cx} ${cy})`}>
      <ellipse cx={cx} cy={cy + 1} rx={eyeRx} ry={eyeRy} fill={EYE_BG} stroke={STROKE} strokeWidth="1.8" />
      <g className={cn(pupilClass)}>
        <FourPointStar cx={cx + (mood === "clever" ? (isLeft ? 1.2 : -0.8) : 0)} cy={cy + 0.5} size={starSize} />
        <circle
          cx={cx + (isLeft ? -2.8 : 2.8)}
          cy={cy - 2.2}
          r="1.1"
          fill="white"
          opacity="0.85"
        />
      </g>
      <path
        d={`M${cx - eyeRx + 1} ${cy - 1.5} Q${cx} ${cy - eyeRy - 1.5} ${outerX} ${cy - 3.5}`}
        stroke={STROKE}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M${cx - eyeRx + 2} ${cy + eyeRy - 2} Q${cx} ${cy + eyeRy + 1} ${cx + eyeRx - 2} ${cy + eyeRy - 2}`}
        stroke={STROKE}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d={`M${outerX} ${cy - 3.5} L${outerX + (isLeft ? 3.5 : -3.5)} ${cy - 7.5}`}
        stroke={STROKE}
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      {mood === "clever" && isLeft && (
        <path
          d={`M${cx - 9} ${cy - 12} Q${cx - 1} ${cy - 15.5} ${cx + 5} ${cy - 11.5}`}
          stroke={STROKE_MID}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {mood === "clever" && !isLeft && (
        <path
          d={`M${cx - 5} ${cy - 11.5} Q${cx + 1} ${cy - 13.8} ${cx + 9} ${cy - 12.2}`}
          stroke={STROKE_MID}
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
          opacity="0.65"
        />
      )}
    </g>
  );
}

function MascotForeheadGem() {
  return (
    <g>
      <path d="M40 27.5 L44.2 31.5 L40 35.5 L35.8 31.5 Z" fill={PINK} stroke={STROKE} strokeWidth="1.6" />
      <path d="M40 29 L42.4 31.5 L40 34 L37.6 31.5 Z" fill="#FDA4AF" opacity="0.65" />
    </g>
  );
}

function MascotFaceDetails() {
  return (
    <>
      <circle cx="17" cy="54" r="4.5" fill="url(#camba-cheek)" />
      <circle cx="63" cy="54" r="4.5" fill="url(#camba-cheek)" />

      <path
        d="M11 50 Q8 54 10 58"
        fill={FUR}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M69 50 Q72 54 70 58"
        fill={FUR}
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <ellipse cx="40" cy="58.5" rx="2.1" ry="1.6" fill={PINK} stroke={STROKE} strokeWidth="1.2" />
    </>
  );
}

function MascotMouth({ mood }: { mood: MascotMood }) {
  if (mood === "loading") {
    return <ellipse cx="40" cy="64.5" rx="2.4" ry="2.8" fill={STROKE} opacity="0.9" />;
  }

  if (mood === "excited") {
    return (
      <>
        <path
          d="M33.5 62.5 Q40 69 46.5 62.5 Q40 66 33.5 62.5 Z"
          fill={PINK_DEEP}
          stroke={STROKE}
          strokeWidth="1.4"
        />
        <path
          d="M36.5 64 Q40 65.5 43.5 64"
          fill="none"
          stroke="#FDA4AF"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </>
    );
  }

  if (mood === "clever") {
    return (
      <>
        <path
          d="M34 63.2 Q39.5 66.8 46 61.8"
          stroke={STROKE}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M45 61.2 L46.8 59.8" stroke={STROKE} strokeWidth="1.7" strokeLinecap="round" />
      </>
    );
  }

  return (
    <path
      d="M34.5 63.2 L37.2 66.2 L40 63.4 L42.8 66.2 L45.5 63.2"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function MascotEars({ choreo, animate }: { choreo: MascotChoreo; animate: boolean }) {
  const isRun = choreo === "run";
  const earClassLeft = animate ? (isRun ? "mascot-run-bob" : "mascot-ear-left") : "";
  const earClassRight = animate ? (isRun ? "mascot-run-bob" : "mascot-ear-right") : "";

  return (
    <>
      <g className={earClassLeft}>
        <ellipse cx="21" cy="16" rx="6.2" ry="19" fill={FUR} stroke={STROKE} strokeWidth="2" />
        <ellipse cx="21" cy="18" rx="3.6" ry="13.5" fill="url(#camba-ear-inner)" />
        <FourPointStar cx={21} cy={20} size={3.2} opacity={0.95} />
        <ellipse cx="21" cy="32" rx="4.8" ry="2.4" fill={FUR_SHADOW} opacity="0.45" />
      </g>
      <g className={earClassRight}>
        <ellipse cx="59" cy="16" rx="6.2" ry="19" fill={FUR} stroke={STROKE} strokeWidth="2" />
        <ellipse cx="59" cy="18" rx="3.6" ry="13.5" fill="url(#camba-ear-inner)" />
        <FourPointStar cx={59} cy={20} size={3.2} opacity={0.95} />
        <ellipse cx="59" cy="32" rx="4.8" ry="2.4" fill={FUR_SHADOW} opacity="0.45" />
      </g>
    </>
  );
}

function MascotBody({ mood }: { mood: MascotMood }) {
  return (
    <>
      <ellipse cx="40" cy="88" rx="16" ry="2.2" fill="#94A3B8" opacity="0.12" />

      <path
        d="M20 74 L40 94 L60 74 Z"
        fill="url(#camba-collar)"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M28 74 L40 86 L52 74" fill={COLLAR_DARK} opacity="0.35" />

      <ellipse
        cx="40"
        cy="52"
        rx="24.5"
        ry="23"
        fill="url(#camba-fur)"
        stroke={STROKE}
        strokeWidth="2"
        filter="url(#camba-soft-shadow)"
      />
      <ellipse cx="32" cy="58" rx="8" ry="10" fill={FUR_SHADOW} opacity="0.42" />
      <ellipse cx="48" cy="58" rx="8" ry="10" fill={FUR_SHADOW} opacity="0.42" />

      <ellipse cx="40" cy="76" rx="7.5" ry="5" fill={FUR} stroke={STROKE} strokeWidth="1.5" />

      {mood === "excited" && (
        <>
          <FourPointStar cx={6} cy={18} size={3.5} fill="#FDE68A" opacity={0.95} />
          <FourPointStar cx={74} cy={20} size={3} fill="#FDE68A" opacity={0.95} />
          <circle cx="70" cy="12" r="1.6" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.5" />
        </>
      )}
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
      const delay = 2400 + Math.random() * 2800;
      blinkTimeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 130);
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
      <svg viewBox="0 0 80 96" className="h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem] overflow-visible">
        <MascotDefs />
        <MascotEars choreo={choreo} animate={animate} />
        <MascotBody mood={mood} />
        <MascotForeheadGem />
        <MascotEye cx={28.5} cy={48} blinking={blinking} side="left" mood={mood} />
        <MascotEye cx={51.5} cy={48} blinking={blinking} side="right" mood={mood} />
        <MascotFaceDetails />
        <MascotMouth mood={mood} />
      </svg>
    </div>
  );
}
