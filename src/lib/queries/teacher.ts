import { createClient } from "@/lib/supabase/server";
import { getStudentProgressSummary } from "@/lib/queries/parent";

export interface TeacherClassSummary {
  id: string;
  name: string;
  description: string | null;
  joinCode: string;
  studentCount: number;
  assignmentCount: number;
  isActive: boolean;
}

export interface ClassStudentRow {
  studentId: string;
  fullName: string;
  email: string;
  joinedAt: string;
  lessonsCompleted: number;
  averageAccuracy: number;
}

export interface ClassAssignmentRow {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  lessonId: string | null;
  mockTestId: string | null;
  targetLabel: string;
  completedCount: number;
  totalStudents: number;
  isActive: boolean;
}

export interface ClassDetail {
  id: string;
  name: string;
  description: string | null;
  joinCode: string;
  programId: string | null;
  students: ClassStudentRow[];
  assignments: ClassAssignmentRow[];
}

export async function verifyTeacherOwnsClass(
  teacherId: string,
  classId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("classes")
    .select("id")
    .eq("id", classId)
    .eq("teacher_id", teacherId)
    .maybeSingle();

  return !!data;
}

export async function verifyTeacherOfStudent(
  teacherId: string,
  studentId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: classes } = await supabase
    .from("classes")
    .select("id")
    .eq("teacher_id", teacherId);

  if (!classes?.length) return false;

  const classIds = classes.map((c) => c.id);
  const { data } = await supabase
    .from("class_students")
    .select("id")
    .eq("student_id", studentId)
    .in("class_id", classIds)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

export async function getTeacherClasses(teacherId: string): Promise<TeacherClassSummary[]> {
  const supabase = await createClient();

  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (!classes?.length) return [];

  const classIds = classes.map((c) => c.id);

  const [{ data: studentCounts }, { data: assignmentCounts }] = await Promise.all([
    supabase.from("class_students").select("class_id").in("class_id", classIds),
    supabase.from("assignments").select("class_id").in("class_id", classIds).eq("is_active", true),
  ]);

  const studentsByClass = new Map<string, number>();
  for (const row of studentCounts ?? []) {
    studentsByClass.set(row.class_id, (studentsByClass.get(row.class_id) ?? 0) + 1);
  }

  const assignmentsByClass = new Map<string, number>();
  for (const row of assignmentCounts ?? []) {
    assignmentsByClass.set(row.class_id, (assignmentsByClass.get(row.class_id) ?? 0) + 1);
  }

  return classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    description: cls.description,
    joinCode: cls.join_code,
    studentCount: studentsByClass.get(cls.id) ?? 0,
    assignmentCount: assignmentsByClass.get(cls.id) ?? 0,
    isActive: cls.is_active,
  }));
}

export async function getClassDetail(
  classId: string,
  teacherId: string
): Promise<ClassDetail | null> {
  const supabase = await createClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .eq("teacher_id", teacherId)
    .single();

  if (!cls) return null;

  const { data: enrollments } = await supabase
    .from("class_students")
    .select("student_id, joined_at")
    .eq("class_id", classId)
    .order("joined_at", { ascending: false });

  const studentIds = (enrollments ?? []).map((e) => e.student_id);
  let students: ClassStudentRow[] = [];

  if (studentIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", studentIds);

    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("user_id, completion_percent, accuracy_percent")
      .in("user_id", studentIds);

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const progressByStudent = new Map<string, typeof progress>();

    for (const row of progress ?? []) {
      const list = progressByStudent.get(row.user_id) ?? [];
      list.push(row);
      progressByStudent.set(row.user_id, list);
    }

    students = (enrollments ?? []).map((enrollment) => {
      const profile = profileMap.get(enrollment.student_id);
      const studentProgress = progressByStudent.get(enrollment.student_id) ?? [];
      const completed = studentProgress.filter((p) => Number(p.completion_percent) >= 100).length;
      const accuracies = studentProgress
        .filter((p) => Number(p.accuracy_percent) > 0)
        .map((p) => Number(p.accuracy_percent));
      const avg =
        accuracies.length > 0
          ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
          : 0;

      return {
        studentId: enrollment.student_id,
        fullName: profile?.full_name ?? "Học sinh",
        email: profile?.email ?? "",
        joinedAt: enrollment.joined_at,
        lessonsCompleted: completed,
        averageAccuracy: avg,
      };
    });
  }

  const { data: assignments } = await supabase
    .from("assignments")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  const assignmentRows: ClassAssignmentRow[] = [];

  for (const assignment of assignments ?? []) {
    let targetLabel = assignment.title;
    if (assignment.lesson_id) {
      const { data: lesson } = await supabase
        .from("lessons")
        .select("title")
        .eq("id", assignment.lesson_id)
        .single();
      targetLabel = lesson?.title ?? targetLabel;
    } else if (assignment.mock_test_id) {
      const { data: test } = await supabase
        .from("mock_tests")
        .select("title")
        .eq("id", assignment.mock_test_id)
        .single();
      targetLabel = test?.title ?? targetLabel;
    }

    let completedCount = 0;
    if (studentIds.length > 0) {
      if (assignment.lesson_id) {
        const { data: completed } = await supabase
          .from("lesson_progress")
          .select("user_id")
          .eq("lesson_id", assignment.lesson_id)
          .in("user_id", studentIds)
          .gte("completion_percent", 100);
        completedCount = completed?.length ?? 0;
      } else if (assignment.mock_test_id) {
        const { data: completed } = await supabase
          .from("mock_test_attempts")
          .select("user_id")
          .eq("mock_test_id", assignment.mock_test_id)
          .in("user_id", studentIds)
          .eq("is_completed", true);
        const uniqueUsers = new Set((completed ?? []).map((c) => c.user_id));
        completedCount = uniqueUsers.size;
      }
    }

    assignmentRows.push({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.due_date,
      lessonId: assignment.lesson_id,
      mockTestId: assignment.mock_test_id,
      targetLabel,
      completedCount,
      totalStudents: studentIds.length,
      isActive: assignment.is_active,
    });
  }

  return {
    id: cls.id,
    name: cls.name,
    description: cls.description,
    joinCode: cls.join_code,
    programId: cls.program_id,
    students,
    assignments: assignmentRows,
  };
}

export async function getStudentProgressForTeacher(
  studentId: string,
  teacherId: string
) {
  const hasAccess = await verifyTeacherOfStudent(teacherId, studentId);
  if (!hasAccess) return null;
  return getStudentProgressSummary(studentId);
}

export async function getAssignmentLessonOptions() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("lessons")
    .select("id, title")
    .eq("is_active", true)
    .order("title")
    .limit(100);

  return data ?? [];
}

export async function getAssignmentMockTestOptions(programId?: string | null) {
  const supabase = await createClient();

  let query = supabase
    .from("mock_tests")
    .select("id, title")
    .eq("is_active", true)
    .order("title");

  if (programId) {
    query = query.eq("program_id", programId);
  }

  const { data } = await query;

  return data ?? [];
}

export async function getStudentClasses(studentId: string) {
  const supabase = await createClient();

  const { data: enrollments } = await supabase
    .from("class_students")
    .select("class_id, joined_at")
    .eq("student_id", studentId);

  if (!enrollments?.length) return [];

  const classIds = enrollments.map((e) => e.class_id);
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, teacher_id")
    .in("id", classIds);

  const classMap = new Map((classes ?? []).map((c) => [c.id, c]));
  const teacherIds = [...new Set((classes ?? []).map((c) => c.teacher_id))];

  const { data: teachers } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", teacherIds);

  const teacherMap = new Map((teachers ?? []).map((t) => [t.id, t.full_name]));

  return enrollments.map((e) => {
    const cls = classMap.get(e.class_id);
    return {
      classId: e.class_id,
      className: cls?.name ?? "Lớp học",
      teacherName: cls ? (teacherMap.get(cls.teacher_id) ?? "Giáo viên") : "Giáo viên",
      joinedAt: e.joined_at,
    };
  });
}

export async function getStudentAssignments(studentId: string) {
  const supabase = await createClient();

  const { data: enrollments } = await supabase
    .from("class_students")
    .select("class_id")
    .eq("student_id", studentId);

  const classIds = (enrollments ?? []).map((e) => e.class_id);
  if (classIds.length === 0) return [];

  const { data: assignments } = await supabase
    .from("assignments")
    .select("*")
    .in("class_id", classIds)
    .eq("is_active", true)
    .order("due_date", { ascending: true, nullsFirst: false });

  const rows = [];

  for (const assignment of assignments ?? []) {
    let targetLabel = "";
    let isCompleted = false;
    let href = "";

    if (assignment.lesson_id) {
      const { data: lesson } = await supabase
        .from("lessons")
        .select("title")
        .eq("id", assignment.lesson_id)
        .single();
      targetLabel = lesson?.title ?? assignment.title;
      href = `/learning/lesson/${assignment.lesson_id}`;

      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("completion_percent")
        .eq("user_id", studentId)
        .eq("lesson_id", assignment.lesson_id)
        .maybeSingle();
      isCompleted = Number(progress?.completion_percent ?? 0) >= 100;
    } else if (assignment.mock_test_id) {
      const { data: test } = await supabase
        .from("mock_tests")
        .select("title")
        .eq("id", assignment.mock_test_id)
        .single();
      targetLabel = test?.title ?? assignment.title;
      href = `/mock-tests/${assignment.mock_test_id}`;

      const { data: attempt } = await supabase
        .from("mock_test_attempts")
        .select("id")
        .eq("user_id", studentId)
        .eq("mock_test_id", assignment.mock_test_id)
        .eq("is_completed", true)
        .limit(1)
        .maybeSingle();
      isCompleted = !!attempt;
    }

    rows.push({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.due_date,
      targetLabel,
      href,
      isCompleted,
    });
  }

  return rows;
}
