"use client";

import { MockTestEditor } from "@/components/admin/mock-test-editor";
import { AdminMessage, useAdminMessage } from "@/components/admin/shared/admin-message";
import type { AdminContentTree, AdminMockTest } from "@/lib/admin/types";

interface MockPageClientProps {
  content: AdminContentTree;
  mockTests: AdminMockTest[];
}

export function MockPageClient({ content, mockTests }: MockPageClientProps) {
  const { message, showMessage } = useAdminMessage();
  return (
    <div className="space-y-4">
      <AdminMessage message={message} />
      <MockTestEditor
        programs={content.programs}
        levels={content.levels}
        skills={content.skills}
        mockTests={mockTests}
        allQuestions={content.questions}
        onMessage={showMessage}
      />
    </div>
  );
}
