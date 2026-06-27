"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { AbstractIntlMessages } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetSiteTextOverride,
  saveSiteTextOverride,
} from "@/actions/admin/site-copy";
import { getNestedMessage } from "@/lib/site-copy/messages";

interface CopyEditDialogProps {
  editor: { key: string; value: string } | null;
  locale: string;
  baseMessages: AbstractIntlMessages;
  overrides: Record<string, string>;
  onClose: () => void;
  onSaved: () => void;
  onApplyLocal: (messageKey: string, value: string | null) => void;
}

export function CopyEditDialog({
  editor,
  locale,
  baseMessages,
  overrides,
  onClose,
  onSaved,
  onApplyLocal,
}: CopyEditDialogProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const defaultValue = useMemo(() => {
    if (!editor) return "";
    return getNestedMessage(baseMessages, editor.key) ?? "";
  }, [baseMessages, editor]);

  const isOverridden = editor ? Boolean(overrides[editor.key]) : false;

  useEffect(() => {
    if (editor) {
      setDraft(editor.value);
      setError(null);
    }
  }, [editor]);

  if (!editor) return null;

  function handleSave() {
    startTransition(async () => {
      const result = await saveSiteTextOverride(locale, editor!.key, draft);
      if (!result.success) {
        setError(result.error ?? "Không thể lưu");
        return;
      }
      onApplyLocal(editor!.key, draft.trim());
      onSaved();
    });
  }

  function handleReset() {
    startTransition(async () => {
      const result = await resetSiteTextOverride(locale, editor!.key);
      if (!result.success) {
        setError(result.error ?? "Không thể khôi phục");
        return;
      }
      onApplyLocal(editor!.key, null);
      setDraft(defaultValue);
      onSaved();
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent data-copy-edit-ui className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa nội dung trang</DialogTitle>
          <DialogDescription>
            Thay đổi sẽ áp dụng cho locale <strong>{locale}</strong> trên toàn site.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copy-key">Message key</Label>
            <Input id="copy-key" value={editor.key} readOnly className="font-mono text-xs" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="copy-value">Nội dung hiển thị</Label>
            <textarea
              id="copy-value"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={5}
              className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="rounded-xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Mặc định (file gốc)</p>
            <p className="mt-1 whitespace-pre-wrap break-words">{defaultValue}</p>
            {isOverridden && (
              <p className="mt-2 text-violet-700">Đang dùng bản override của admin.</p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={isPending || !isOverridden}
            >
              Khôi phục mặc định
            </Button>
            <Button type="button" onClick={handleSave} disabled={isPending || !draft.trim()}>
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
