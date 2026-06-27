"use client";

import { WorkflowPanel } from "@/components/admin/workflow-panel";
import { AdminMessage, useAdminMessage } from "@/components/admin/shared/admin-message";
import type { AdminExercise } from "@/lib/admin/types";

interface ContentReviewClientProps {
  pendingExercises: AdminExercise[];
}

export function ContentReviewClient({ pendingExercises }: ContentReviewClientProps) {
  const { message, showMessage } = useAdminMessage();
  return (
    <div className="space-y-4">
      <AdminMessage message={message} />
      <WorkflowPanel pendingExercises={pendingExercises} onMessage={showMessage} />
    </div>
  );
}
