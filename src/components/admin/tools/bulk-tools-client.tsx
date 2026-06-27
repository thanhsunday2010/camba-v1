"use client";

import { BulkImportExport } from "@/components/admin/bulk-import-export";
import { AdminMessage, useAdminMessage } from "@/components/admin/shared/admin-message";

import type { AdminProgram } from "@/lib/admin/types";

interface BulkToolsClientProps {
  programs: AdminProgram[];
}

export function BulkToolsClient({ programs }: BulkToolsClientProps) {
  const { message, showMessage } = useAdminMessage();
  return (
    <div className="space-y-4">
      <AdminMessage message={message} />
      <BulkImportExport programs={programs} onMessage={showMessage} />
    </div>
  );
}
