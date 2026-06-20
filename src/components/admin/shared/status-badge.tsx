"use client";

import type { ContentStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ContentStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_review: "bg-amber-100 text-amber-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Nháp",
  pending_review: "Chờ duyệt",
  published: "Đã xuất bản",
  archived: "Lưu trữ",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full font-medium",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
