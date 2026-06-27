import type { UserRole } from "@/types/database";

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_active: boolean;
  is_super_admin: boolean | null;
  created_at: string;
  phone?: string | null;
  locale?: string;
};

export type UserRoleRow = { user_id: string; role: UserRole | string };
export type SubscriptionRow = { user_id: string; tier: string };
export type ParentLinkRow = {
  id: string;
  parent_id: string;
  student_id: string;
  status: string;
  invited_at: string;
};
export type ClassRow = {
  id: string;
  name: string;
  teacher_id: string;
  join_code: string;
  is_active: boolean;
  created_at: string;
};
export type ClassStudentRow = { class_id: string };
export type AdminTemplateRow = {
  id: string;
  slug: string;
  name_vi: string;
  description_vi: string | null;
};
export type AdminTemplatePermRow = { permission: string };
export type AdminAssignmentDbRow = {
  user_id: string;
  template_id: string;
  granted_at: string;
};
export type AdminOverrideRow = {
  user_id: string;
  permission: string;
  granted: boolean;
};
export type AuditLogDbRow = {
  id: string;
  actor_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  metadata: unknown;
  created_at: string;
};

export type PaymentOrderDbRow = {
  id: string;
  user_id: string;
  order_code: string;
  program: string;
  tier: string;
  billing_period: string;
  amount_vnd: number;
  status: string;
  sepay_transaction_id: number | null;
  paid_at: string | null;
  expires_at: string;
  created_at: string;
};

export type WebhookEventDbRow = {
  sepay_id: number;
  order_code: string | null;
  payload: Record<string, unknown>;
  received_at: string;
};

export type UserSubscriptionDbRow = {
  id: string;
  user_id: string;
  program: string;
  tier: string;
  billing_period: string | null;
  status: string;
  current_period_end: string | null;
  updated_at: string;
};

export type XpRuleDbRow = {
  id: string;
  event_type: string;
  xp_amount: number;
  coin_amount: number;
  description: string | null;
  is_active: boolean;
};

export type BadgeDbRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  criteria: Record<string, unknown>;
  xp_reward: number;
  coin_reward: number;
  is_active: boolean;
};

export type DailyMissionDbRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  mission_type: string;
  target_value: number;
  xp_reward: number;
  coin_reward: number;
  is_active: boolean;
};

export type LeagueDbRow = {
  id: string;
  week_start: string;
  week_end: string;
  tier: string;
  is_active: boolean;
};

export type LeagueRankingDbRow = {
  rank: number | null;
  user_id: string;
  weekly_xp: number;
  tier: string;
};

export type UserGamificationRow = {
  user_id: string;
  total_xp: number;
  level: number;
  coins: number;
};
