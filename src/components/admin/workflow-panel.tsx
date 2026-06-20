"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateExerciseStatus } from "@/actions/admin/content";
import { StatusBadge } from "./shared/status-badge";
import type { AdminExercise } from "@/lib/admin/types";

interface WorkflowPanelProps {
  pendingExercises: AdminExercise[];
  onMessage: (msg: string) => void;
}

export function WorkflowPanel({ pendingExercises, onMessage }: WorkflowPanelProps) {
  const [isPending, startTransition] = useTransition();

  function handleReview(exerciseId: string, approve: boolean) {
    startTransition(async () => {
      const result = await updateExerciseStatus(
        exerciseId,
        approve ? "published" : "draft"
      );
      onMessage(
        result.success
          ? approve
            ? "Đã duyệt và xuất bản"
            : "Đã trả về nháp"
          : result.error ?? "Lỗi"
      );
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Hàng chờ duyệt ({pendingExercises.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingExercises.length === 0 ? (
          <p className="text-sm text-gray-500">Không có bài tập chờ duyệt</p>
        ) : (
          <div className="space-y-3">
            {pendingExercises.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between gap-4 py-2 border-b border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    {e.exercise_type}
                    <StatusBadge status={e.status} />
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleReview(e.id, true)}
                  >
                    Duyệt
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleReview(e.id, false)}
                  >
                    Từ chối
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
