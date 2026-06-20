"use client";

import { useState, useTransition } from "react";
import { createClass } from "@/actions/classes";
import type { TeacherClassSummary } from "@/lib/queries/teacher";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Plus, Users, ClipboardList } from "lucide-react";

interface TeacherDashboardProps {
  classes: TeacherClassSummary[];
  programs: { id: string; name: string }[];
  labels: {
    createTitle: string;
    className: string;
    description: string;
    program: string;
    create: string;
    creating: string;
    myClasses: string;
    students: string;
    assignments: string;
    openClass: string;
    noClasses: string;
    noClassesDesc: string;
  };
}

export function TeacherDashboard({ classes, programs, labels }: TeacherDashboardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await createClass(formData);
      if (result.success) {
        setMessage("Đã tạo lớp học");
      } else {
        setError(result.error ?? "Lỗi");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {labels.createTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="space-y-3">
            <select name="programId" required className="w-full h-10 rounded-lg border px-3 text-sm">
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Input name="name" placeholder={labels.className} required />
            <Input name="description" placeholder={labels.description} />
            <Button type="submit" disabled={isPending}>
              {isPending ? labels.creating : labels.create}
            </Button>
          </form>
          {message && <p className="text-sm text-success mt-2">{message}</p>}
          {error && <p className="text-sm text-error mt-2">{error}</p>}
        </CardContent>
      </Card>

      <div>
        <h2 className="font-semibold text-gray-900 mb-4">{labels.myClasses}</h2>
        {classes.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-500">
              <GraduationCap className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p className="font-medium">{labels.noClasses}</p>
              <p className="text-sm mt-1">{labels.noClassesDesc}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {classes.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle className="text-base">{cls.name}</CardTitle>
                  {cls.description && (
                    <p className="text-sm text-gray-500">{cls.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {cls.studentCount} {labels.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardList className="h-3.5 w-3.5" />
                      {cls.assignmentCount} {labels.assignments}
                    </span>
                  </div>
                  <Link href={`/teacher/classes/${cls.id}`}>
                    <Button size="sm" className="w-full">
                      {labels.openClass}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
