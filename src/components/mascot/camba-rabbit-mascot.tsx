"use client";

import { cn } from "@/lib/utils";
import type { MascotMood } from "@/components/mascot/mascot-provider";

interface CambaRabbitMascotProps {
  mood?: MascotMood;
  className?: string;
}

export function CambaRabbitMascot({ mood = "idle", className }: CambaRabbitMascotProps) {
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
        <ellipse cx="18" cy="14" rx="7" ry="16" fill="#FDA4AF" />
        <ellipse cx="46" cy="14" rx="7" ry="16" fill="#FDA4AF" />
        <ellipse cx="18" cy="14" rx="4" ry="11" fill="#FECDD3" />
        <ellipse cx="46" cy="14" rx="4" ry="11" fill="#FECDD3" />
        <circle cx="32" cy="36" r="22" fill="#FFF7ED" />
        <circle cx="32" cy="38" r="18" fill="#FFEDD5" opacity="0.55" />
        <ellipse cx="32" cy="52" rx="9" ry="6" fill="#FFE4E6" />
        <circle cx="22" cy="34" r="4.5" fill="white" stroke="#334155" strokeWidth="1.2" />
        <circle cx="42" cy="34" r="4.5" fill="white" stroke="#334155" strokeWidth="1.2" />
        {mood === "clever" ? (
          <>
            <path d="M20 34 Q22 32 24 34" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <ellipse cx="42" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
          </>
        ) : (
          <>
            <ellipse cx="22" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
            <ellipse cx="42" cy="34" rx="2.2" ry="2.8" fill="#1E293B" />
            {mood === "loading" && (
              <>
                <ellipse cx="22" cy="33" rx="2.2" ry="1.2" fill="#1E293B" />
                <ellipse cx="42" cy="33" rx="2.2" ry="1.2" fill="#1E293B" />
              </>
            )}
          </>
        )}
        <circle cx="16" cy="40" r="3" fill="#FDA4AF" opacity="0.55" />
        <circle cx="48" cy="40" r="3" fill="#FDA4AF" opacity="0.55" />
        <ellipse cx="32" cy="41" rx="2" ry="1.5" fill="#FB7185" />
        {mood === "excited" ? (
          <path
            d="M24 46 Q32 54 40 46"
            stroke="#BE123C"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M26 47 Q32 50 38 47"
            stroke="#BE123C"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        )}
        <rect x="14" y="31" width="36" height="8" rx="4" fill="#E0F2FE" opacity="0.85" />
        <rect x="16" y="32.5" width="32" height="5" rx="2.5" fill="#BAE6FD" opacity="0.5" />
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
