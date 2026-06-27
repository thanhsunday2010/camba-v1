"use client";

import { useRouter } from "next/navigation";
import { QuestionBankEditor } from "@/components/admin/question-bank-editor";
import { AdminMessage, useAdminMessage } from "@/components/admin/shared/admin-message";
import type { AdminContentTree } from "@/lib/admin/types";

interface QuestionBankPageClientProps {
  content: AdminContentTree;
}

export function QuestionBankPageClient({ content }: QuestionBankPageClientProps) {
  const router = useRouter();
  const { message, showMessage } = useAdminMessage();

  return (
    <div className="space-y-4">
      <AdminMessage message={message} />
      <QuestionBankEditor
        content={content}
        onMessage={showMessage}
        onSelectExercise={(exerciseId) => {
          router.push(`/admin/content/tree?exercise=${exerciseId}`);
        }}
      />
    </div>
  );
}
