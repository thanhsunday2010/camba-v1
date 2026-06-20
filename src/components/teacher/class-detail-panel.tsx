"use client";

import { useState, useTransition } from "react";
import { createAssignment, deactivateAssignment } from "@/actions/assignments";
import type { ClassDetail } from "@/lib/queries/teacher";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Users, ClipboardList, Check } from "lucide-react";

interface ClassDetailPanelProps {
  classDetail: ClassDetail;
  lessonOptions: { id: string; title: string }[];
  mockTestOptions: { id: string; title: string }[];
  labels: {
    joinCode: string;
    copied: string;
    roster: string;
    viewStudent: string;
    noStudents: string;
    assignments: string;
    createAssignment: string;
    assignmentTitle: string;
    dueDate: string;
    targetType: string;
    lesson: string;
    mockTest: string;
    selectTarget: string;
    completion: string;
    deactivate: string;
    creating: string;
    create: string;
  };
}

export function ClassDetailPanel({
  classDetail,
  lessonOptions,
  mockTestOptions,
  labels,
}: ClassDetailPanelProps) {
  const [copied, setCopied] = useState(false);
  const [targetType, setTargetType] = useState<"lesson" | "mock_test">("lesson");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function copyCode() {
    navigator.clipboard.writeText(classDetail.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCreateAssignment(formData: FormData) {
    formData.set("classId", classDetail.id);
    formData.set("targetType", targetType);
    setMessage(null);
    startTransition(async () => {
      const result = await createAssignment(formData);
      setMessage(result.success ? "Đã tạo bài tập" : result.error ?? "Lỗi");
    });
  }

  function handleDeactivate(assignmentId: string) {
    startTransition(async () => {
      await deactivateAssignment(assignmentId);
    });
  }

  const targets = targetType === "lesson" ? lessonOptions : mockTestOptions;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{classDetail.name}</h1>
          {classDetail.description && (
            <p className="text-sm text-gray-500 mt-1">{classDetail.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg">
          <span className="text-sm text-gray-600">{labels.joinCode}:</span>
          <code className="font-mono font-bold text-primary">{classDetail.joinCode}</code>
          <Button variant="ghost" size="icon" onClick={copyCode}>
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
          {copied && <span className="text-xs text-success">{labels.copied}</span>}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            {labels.roster} ({classDetail.students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classDetail.students.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noStudents}</p>
          ) : (
            <div className="space-y-2">
              {classDetail.students.map((student) => (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{student.fullName}</p>
                    <p className="text-xs text-gray-500">
                      {student.lessonsCompleted} bài • {student.averageAccuracy}% chính xác
                    </p>
                  </div>
                  <Link href={`/teacher/students/${student.studentId}`}>
                    <Button size="sm" variant="outline">
                      {labels.viewStudent}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            {labels.assignments}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={handleCreateAssignment} className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">{labels.createAssignment}</p>
            <Input name="title" placeholder={labels.assignmentTitle} required />
            <Input name="dueDate" type="date" placeholder={labels.dueDate} />
            <div className="flex gap-2">
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as "lesson" | "mock_test")}
                className="h-10 rounded-lg border px-3 text-sm"
              >
                <option value="lesson">{labels.lesson}</option>
                <option value="mock_test">{labels.mockTest}</option>
              </select>
              <select name="targetId" required className="flex-1 h-10 rounded-lg border px-3 text-sm">
                <option value="">{labels.selectTarget}</option>
                {targets.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? labels.creating : labels.create}
            </Button>
          </form>
          {message && <p className="text-sm text-primary">{message}</p>}

          <div className="space-y-2">
            {classDetail.assignments.filter((a) => a.isActive).map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{assignment.title}</p>
                  <p className="text-xs text-gray-500">{assignment.targetLabel}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {labels.completion}: {assignment.completedCount}/{assignment.totalStudents}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeactivate(assignment.id)}
                  disabled={isPending}
                >
                  {labels.deactivate}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
