import type { LeagueTier, XpEventType } from "@/types/database";

export interface AdminXpRuleRow {
  id: string;
  eventType: XpEventType;
  xpAmount: number;
  coinAmount: number;
  description: string | null;
  isActive: boolean;
}

export interface AdminBadgeRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  criteria: Record<string, unknown>;
  xpReward: number;
  coinReward: number;
  isActive: boolean;
  earnedCount: number;
}

export interface AdminDailyMissionRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  missionType: string;
  targetValue: number;
  xpReward: number;
  coinReward: number;
  isActive: boolean;
}

export interface AdminLeagueRow {
  id: string;
  weekStart: string;
  weekEnd: string;
  tier: LeagueTier;
  isActive: boolean;
  participantCount: number;
}

export interface AdminLeagueRankingRow {
  rank: number | null;
  userId: string;
  userEmail: string;
  userName: string;
  weeklyXp: number;
  tier: LeagueTier;
}
