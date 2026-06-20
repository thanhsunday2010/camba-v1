"use client";

import { useState, useTransition } from "react";
import { inviteStudentByEmail } from "@/actions/parent";
import type { LinkedStudent } from "@/lib/queries/parent";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, Clock, CheckCircle2 } from "lucide-react";

interface ParentDashboardProps {
  students: LinkedStudent[];
  labels: {
    inviteTitle: string;
    emailPlaceholder: string;
    invite: string;
    inviting: string;
    linkedTitle: string;
    pending: string;
    active: string;
    viewProgress: string;
    noStudents: string;
    noStudentsDesc: string;
  };
}

export function ParentDashboard({ students, labels }: ParentDashboardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleInvite(formData: FormData) {
    setMessage(null);
    setError(null);
    const email = formData.get("email") as string;
    startTransition(async () => {
      const result = await inviteStudentByEmail(email);
      if (result.success) {
        setMessage("Đã gửi lời mời liên kết");
      } else {
        setError(result.error ?? "Lỗi");
      }
    });
  }

  const activeStudents = students.filter((s) => s.status === "active");
  const pendingStudents = students.filter((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {labels.inviteTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleInvite} className="flex gap-2">
            <Input
              name="email"
              type="email"
              placeholder={labels.emailPlaceholder}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? labels.inviting : labels.invite}
            </Button>
          </form>
          {message && <p className="text-sm text-success mt-2">{message}</p>}
          {error && <p className="text-sm text-error mt-2">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            {labels.linkedTitle} ({activeStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeStudents.length === 0 && pendingStudents.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="font-medium">{labels.noStudents}</p>
              <p className="text-sm mt-1">{labels.noStudentsDesc}</p>
            </div>
          ) : (
            <>
              {activeStudents.map((student) => (
                <div
                  key={student.linkId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{student.fullName}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                  <Link href={`/parent/${student.studentId}`}>
                    <Button size="sm" variant="outline">
                      {labels.viewProgress}
                    </Button>
                  </Link>
                </div>
              ))}

              {pendingStudents.map((student) => (
                <div
                  key={student.linkId}
                  className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20"
                >
                  <div>
                    <p className="font-medium text-gray-900">{student.fullName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {labels.pending}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-warning" />
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
