"use client";

import { useState, useTransition } from "react";
import { joinClassByCode } from "@/actions/classes";
import { respondToParentLink } from "@/actions/parent";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Users, ClipboardList, Check, X } from "lucide-react";

interface StudentSettingsPanelProps {
  pendingParentLinks: {
    linkId: string;
    parentName: string;
    parentEmail: string;
    invitedAt: string;
  }[];
  classes: {
    classId: string;
    className: string;
    teacherName: string;
    joinedAt: string;
  }[];
  assignments: {
    id: string;
    title: string;
    description: string | null;
    dueDate: string | null;
    targetLabel: string;
    href: string;
    isCompleted: boolean;
  }[];
  labels: {
    parentLinks: string;
    accept: string;
    reject: string;
    noPendingLinks: string;
    joinClass: string;
    joinCodePlaceholder: string;
    join: string;
    joining: string;
    myClasses: string;
    myAssignments: string;
    due: string;
    completed: string;
    start: string;
    noClasses: string;
    noAssignments: string;
  };
}

export function StudentSettingsPanel({
  pendingParentLinks,
  classes,
  assignments,
  labels,
}: StudentSettingsPanelProps) {
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleJoin(formData: FormData) {
    const code = formData.get("code") as string;
    setJoinMessage(null);
    setJoinError(null);
    startTransition(async () => {
      const result = await joinClassByCode(code);
      if (result.success) {
        setJoinMessage("Đã tham gia lớp học");
      } else {
        setJoinError(result.error ?? "Lỗi");
      }
    });
  }

  function handleParentResponse(linkId: string, accept: boolean) {
    startTransition(async () => {
      await respondToParentLink(linkId, accept);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{labels.parentLinks}</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingParentLinks.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noPendingLinks}</p>
          ) : (
            <div className="space-y-2">
              {pendingParentLinks.map((link) => (
                <div
                  key={link.linkId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{link.parentName}</p>
                    <p className="text-xs text-gray-500">{link.parentEmail}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleParentResponse(link.linkId, true)}
                      disabled={isPending}
                    >
                      <Check className="h-3 w-3" />
                      {labels.accept}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleParentResponse(link.linkId, false)}
                      disabled={isPending}
                    >
                      <X className="h-3 w-3" />
                      {labels.reject}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            {labels.joinClass}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleJoin} className="flex gap-2">
            <Input
              name="code"
              placeholder={labels.joinCodePlaceholder}
              required
              className="flex-1 font-mono"
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? labels.joining : labels.join}
            </Button>
          </form>
          {joinMessage && <p className="text-sm text-success mt-2">{joinMessage}</p>}
          {joinError && <p className="text-sm text-error mt-2">{joinError}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            {labels.myClasses}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noClasses}</p>
          ) : (
            <div className="space-y-2">
              {classes.map((cls) => (
                <div key={cls.classId} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">{cls.className}</p>
                  <p className="text-xs text-gray-500">{cls.teacherName}</p>
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
            {labels.myAssignments}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noAssignments}</p>
          ) : (
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{assignment.title}</p>
                    <p className="text-xs text-gray-500">{assignment.targetLabel}</p>
                    {assignment.dueDate && (
                      <p className="text-xs text-gray-400">
                        {labels.due}: {new Date(assignment.dueDate).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                  </div>
                  {assignment.isCompleted ? (
                    <span className="text-xs text-success font-medium">{labels.completed}</span>
                  ) : (
                    <Link href={assignment.href}>
                      <Button size="sm">{labels.start}</Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
