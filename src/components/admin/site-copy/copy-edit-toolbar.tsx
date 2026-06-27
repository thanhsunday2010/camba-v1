"use client";

import { useCallback, useEffect } from "react";
import { PencilLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  findMessageKeysByText,
  normalizeCopyText,
} from "@/lib/site-copy/messages";
import { useSiteCopyEdit } from "@/components/admin/site-copy/site-copy-edit-shell";

const EDITABLE_SELECTOR =
  "button, a, p, span, h1, h2, h3, h4, h5, h6, label, li, td, th, strong, em, small, div[data-copy-key]";

export function CopyEditToolbar() {
  const ctx = useSiteCopyEdit();
  const editMode = ctx?.editMode ?? false;
  const setEditMode = ctx?.setEditMode;

  const handleDocumentClick = useCallback(
    (event: MouseEvent) => {
      if (!ctx?.editMode) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-copy-edit-ui]")) return;

      const candidate = target.closest(EDITABLE_SELECTOR);
      if (!candidate) return;

      const text = normalizeCopyText(candidate.textContent ?? "");
      if (text.length < 2) return;

      const matches = findMessageKeysByText(ctx.messages, text);
      if (matches.length === 0) return;

      event.preventDefault();
      event.stopPropagation();

      const match = matches[0]!;
      ctx.openEditor(match.key, match.value);
    },
    [ctx]
  );

  useEffect(() => {
    if (!editMode) return;
    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [editMode, handleDocumentClick]);

  if (!ctx || !setEditMode) return null;

  return (
    <div
      data-copy-edit-ui
      className={cn(
        "fixed bottom-4 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-2 rounded-full border border-violet-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur",
        editMode && "ring-2 ring-violet-400/60"
      )}
    >
      <PencilLine className="h-4 w-4 text-violet-600" aria-hidden />
      <span className="text-sm font-medium text-gray-800">
        {editMode ? "Chế độ chỉnh sửa trang" : "Chỉnh sửa nội dung trang"}
      </span>
      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold uppercase text-violet-700">
        {ctx.locale}
      </span>
      <Button
        type="button"
        size="sm"
        variant={editMode ? "default" : "outline"}
        className="rounded-full"
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? "Đang bật" : "Bật"}
      </Button>
      {editMode && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="rounded-full"
          onClick={() => setEditMode(false)}
          aria-label="Tắt chế độ chỉnh sửa"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
