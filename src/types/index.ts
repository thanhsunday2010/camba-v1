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

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
