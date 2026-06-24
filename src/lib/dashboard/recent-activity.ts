import { createClient } from "@/lib/supabase/server";

export type DashboardActivityItem = {
  id: string;
  kind: "lesson" | "mock_test" | "badge" | "achievement";
  title: string;
  subtitle?: string;
  href?: string;
  occurredAt: string;
};

export async function getDashboardRecentActivity(
  userId: string,
  labels: { badgeEarned: string },
  limit = 10
): Promise<DashboardActivityItem[]> {
  const supabase = await createClient();
  const items: DashboardActivityItem[] = [];

  const [{ data: mockAttempts }, { data: badges }, { data: xpLogs }] = await Promise.all([
    supabase
      .from("mock_test_attempts")
      .select("id, completed_at, score, max_score, mock_tests(title)")
      .eq("user_id", userId)
      .eq("is_completed", true)
      .order("completed_at", { ascending: false })
      .limit(limit),
    supabase
      .from("user_badges")
      .select("id, earned_at, badges(name)")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })
      .limit(limit),
    supabase
      .from("xp_logs")
      .select("id, created_at, event_type, reference_id")
      .eq("user_id", userId)
      .eq("event_type", "lesson_complete")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  for (const attempt of mockAttempts ?? []) {
    const mockTitle =
      (attempt.mock_tests as { title?: string } | null)?.title ?? "Mock test";
    const percent =
      Number(attempt.max_score) > 0
        ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100)
        : 0;
    items.push({
      id: `mock-${attempt.id}`,
      kind: "mock_test",
      title: mockTitle,
      subtitle: `${percent}%`,
      href: "/mock-tests",
      occurredAt: attempt.completed_at ?? new Date().toISOString(),
    });
  }

  for (const row of badges ?? []) {
    const name = (row.badges as { name?: string } | null)?.name ?? "Badge";
    items.push({
      id: `badge-${row.id}`,
      kind: "badge",
      title: name,
      subtitle: labels.badgeEarned,
      occurredAt: row.earned_at,
    });
  }

  const lessonIds = [...new Set((xpLogs ?? []).map((l) => l.reference_id).filter(Boolean))];
  let lessonTitles = new Map<string, string>();
  if (lessonIds.length > 0) {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id, title")
      .in("id", lessonIds as string[]);
    lessonTitles = new Map((lessons ?? []).map((l) => [l.id, l.title]));
  }

  for (const log of xpLogs ?? []) {
    if (!log.reference_id) continue;
    items.push({
      id: `lesson-${log.id}`,
      kind: "lesson",
      title: lessonTitles.get(log.reference_id) ?? "Lesson completed",
      href: `/learning/lesson/${log.reference_id}`,
      occurredAt: log.created_at,
    });
  }

  return items
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, limit);
}
