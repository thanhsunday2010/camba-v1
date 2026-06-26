export type { Database, Profile, UserRoleRow, Program, Level, UserGamification, LessonProgress } from "./database";
export type { UserRole, ExerciseType, ContentStatus, LeagueTier, XpEventType } from "./database";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  roles: import("./database").UserRole[];
  onboardingCompleted: boolean;
}

export interface AiLimitMeta {
  tier: "free" | "pro" | "vip";
  usedToday: number;
  dailyLimit: number;
  remaining: number;
}

export interface PracticeLimitMeta {
  tier: "free" | "pro" | "vip";
  usedToday: number;
  dailyLimit: number;
  remaining: number;
  practicedLessonIds: string[];
}

export type ActionErrorCode = "AI_LIMIT_EXCEEDED" | "PRACTICE_LIMIT_EXCEEDED";

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  code?: ActionErrorCode;
  limitMeta?: AiLimitMeta;
  practiceLimitMeta?: PracticeLimitMeta;
}
