export type DashboardTimeRange = "7d" | "30d" | "90d";

export interface KpiDelta {
  value: number;
  previous: number;
  changePercent: number | null;
  trend: "up" | "down" | "flat";
}

export interface TimeSeriesPoint {
  date: string;
  label: string;
  value: number;
}

export interface SubscriptionMix {
  tier: string;
  label: string;
  count: number;
}

export interface RevenueSeriesPoint {
  date: string;
  label: string;
  pro: number;
  vip: number;
  total: number;
}

export interface ActiveUsersSeriesPoint {
  date: string;
  label: string;
  dau: number;
  wau: number;
  mau: number;
}

export interface LearningActivityPoint {
  date: string;
  label: string;
  exercises: number;
  mocks: number;
  lessons: number;
  aiCalls: number;
}

export interface DashboardOperations {
  pendingReview: number;
  pendingOrders: number;
  newUsersToday: number;
  aiCallsToday: number;
  dauToday: number;
}

export interface DashboardContentSummary {
  programs: number;
  lessons: number;
  exercises: number;
  questions: number;
  placementTests: number;
  mockTests: number;
  publishedExercises: number;
  pendingExercises: number;
}

export interface AdminDashboardStats {
  timeRange: DashboardTimeRange;
  generatedAt: string;
  kpis: {
    totalUsers: KpiDelta;
    newUsers: KpiDelta;
    wau: KpiDelta;
    mau: KpiDelta;
    paidUsers: KpiDelta;
    revenueVnd: KpiDelta;
    paidOrders: KpiDelta;
    pendingOrders: number;
    conversionRate: KpiDelta;
  };
  userGrowth: {
    cumulative: TimeSeriesPoint[];
    newUsers: TimeSeriesPoint[];
  };
  revenue: RevenueSeriesPoint[];
  activeUsers: ActiveUsersSeriesPoint[];
  subscriptionMix: SubscriptionMix[];
  learningActivity: LearningActivityPoint[];
  operations: DashboardOperations;
  content: DashboardContentSummary;
  canViewRevenue: boolean;
}
