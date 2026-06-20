import { createClient } from "@/lib/supabase/server";
import { getUserGamification, getUserStreak } from "@/lib/queries/user";

export interface LinkedStudent {
  linkId: string;
  studentId: string;
  fullName: string;
  email: string;
  status: "pending" | "active" | "revoked";
  invitedAt: string;
  acceptedAt: string | null;
}

export interface StudentProgressSummary {
  gamification: Awaited<ReturnType<typeof getUserGamification>>;
  streak: Awaited<ReturnType<typeof getUserStreak>>;
  lessonsCompleted: number;
  lessonsInProgress: number;
  averageAccuracy: number;
  recentMockTests: {
    id: string;
    scorePercent: number;
    completedAt: string | null;
    testTitle: string;
  }[];
}

export async function verifyParentAccess(
  parentId: string,
  studentId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("parent_student_links")
    .select("id")
    .eq("parent_id", parentId)
    .eq("student_id", studentId)
    .eq("status", "active")
    .maybeSingle();

  return !!data;
}

export async function getLinkedStudents(parentId: string): Promise<LinkedStudent[]> {
  const supabase = await createClient();

  const { data: links } = await supabase
    .from("parent_student_links")
    .select("id, student_id, status, invited_at, accepted_at")
    .eq("parent_id", parentId)
    .neq("status", "revoked")
    .order("invited_at", { ascending: false });

  if (!links?.length) return [];

  const studentIds = links.map((l) => l.student_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", studentIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return links.map((link) => {
    const profile = profileMap.get(link.student_id);
    return {
      linkId: link.id,
      studentId: link.student_id,
      fullName: profile?.full_name ?? "Học sinh",
      email: profile?.email ?? "",
      status: link.status as LinkedStudent["status"],
      invitedAt: link.invited_at,
      acceptedAt: link.accepted_at,
    };
  });
}

export async function getStudentProgressSummary(
  studentId: string
): Promise<StudentProgressSummary> {
  const supabase = await createClient();

  const [gamification, streak, progressResult, mockAttempts] = await Promise.all([
    getUserGamification(studentId),
    getUserStreak(studentId),
    supabase
      .from("lesson_progress")
      .select("completion_percent, accuracy_percent")
      .eq("user_id", studentId),
    supabase
      .from("mock_test_attempts")
      .select("id, score, max_score, completed_at, mock_test_id")
      .eq("user_id", studentId)
      .eq("is_completed", true)
      .order("completed_at", { ascending: false })
      .limit(5),
  ]);

  const progress = progressResult.data ?? [];
  const lessonsCompleted = progress.filter((p) => Number(p.completion_percent) >= 100).length;
  const lessonsInProgress = progress.filter(
    (p) => Number(p.completion_percent) > 0 && Number(p.completion_percent) < 100
  ).length;

  const accuracies = progress
    .filter((p) => Number(p.accuracy_percent) > 0)
    .map((p) => Number(p.accuracy_percent));
  const averageAccuracy =
    accuracies.length > 0
      ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
      : 0;

  const testIds = [...new Set((mockAttempts.data ?? []).map((a) => a.mock_test_id))];
  const testTitles = new Map<string, string>();

  if (testIds.length > 0) {
    const { data: tests } = await supabase
      .from("mock_tests")
      .select("id, title")
      .in("id", testIds);

    for (const test of tests ?? []) {
      testTitles.set(test.id, test.title);
    }
  }

  const recentMockTests = (mockAttempts.data ?? []).map((attempt) => ({
    id: attempt.id,
    scorePercent:
      Number(attempt.max_score) > 0
        ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100)
        : 0,
    completedAt: attempt.completed_at,
    testTitle: testTitles.get(attempt.mock_test_id) ?? "Mock Test",
  }));

  return {
    gamification,
    streak,
    lessonsCompleted,
    lessonsInProgress,
    averageAccuracy,
    recentMockTests,
  };
}

export async function getPendingParentLinksForStudent(studentId: string) {
  const supabase = await createClient();

  const { data: links } = await supabase
    .from("parent_student_links")
    .select("id, parent_id, invited_at")
    .eq("student_id", studentId)
    .eq("status", "pending");

  if (!links?.length) return [];

  const parentIds = links.map((l) => l.parent_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", parentIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return links.map((link) => ({
    linkId: link.id,
    parentId: link.parent_id,
    parentName: profileMap.get(link.parent_id)?.full_name ?? "Phụ huynh",
    parentEmail: profileMap.get(link.parent_id)?.email ?? "",
    invitedAt: link.invited_at,
  }));
}
