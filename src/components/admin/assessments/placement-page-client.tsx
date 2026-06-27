"use client";

import { PlacementTestEditor } from "@/components/admin/placement-test-editor";
import { AdminMessage, useAdminMessage } from "@/components/admin/shared/admin-message";
import type { AdminContentTree, AdminPlacementTest } from "@/lib/admin/types";

interface PlacementPageClientProps {
  content: AdminContentTree;
  placementTests: AdminPlacementTest[];
}

export function PlacementPageClient({ content, placementTests }: PlacementPageClientProps) {
  const { message, showMessage } = useAdminMessage();
  return (
    <div className="space-y-4">
      <AdminMessage message={message} />
      <PlacementTestEditor
        programs={content.programs}
        placementTests={placementTests}
        allQuestions={content.questions}
        onMessage={showMessage}
      />
    </div>
  );
}
