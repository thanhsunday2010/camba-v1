"use client";

import { useMemo, useState, useTransition } from "react";
import type { AbstractIntlMessages } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  flattenMessages,
  getNestedMessage,
  searchMessageKeys,
} from "@/lib/site-copy/messages";
import {
  resetSiteTextOverride,
  saveSiteTextOverride,
} from "@/actions/admin/site-copy";
import type { SiteTextOverrideRow } from "@/lib/site-copy/overrides";

interface SiteCopyBrowserProps {
  locale: string;
  baseMessages: AbstractIntlMessages;
  overrides: SiteTextOverrideRow[];
}

export function SiteCopyBrowser({
  locale,
  baseMessages,
  overrides,
}: SiteCopyBrowserProps) {
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const overrideMap = useMemo(
    () => Object.fromEntries(overrides.map((row) => [row.message_key, row.value])),
    [overrides]
  );

  const results = useMemo(() => {
    if (!query.trim()) {
      return flattenMessages(baseMessages).slice(0, 30);
    }
    return searchMessageKeys(baseMessages, query, 40);
  }, [baseMessages, query]);

  const defaultValue = selectedKey
    ? getNestedMessage(baseMessages, selectedKey) ?? ""
    : "";

  function selectKey(key: string) {
    setSelectedKey(key);
    setDraft(overrideMap[key] ?? getNestedMessage(baseMessages, key) ?? "");
    setMessage(null);
  }

  function handleSave() {
    if (!selectedKey) return;
    startTransition(async () => {
      const result = await saveSiteTextOverride(locale, selectedKey, draft);
      setMessage(result.success ? "Đã lưu" : result.error ?? "Lỗi");
      if (result.success) router.refresh();
    });
  }

  function handleReset() {
    if (!selectedKey) return;
    startTransition(async () => {
      const result = await resetSiteTextOverride(locale, selectedKey);
      if (result.success) {
        setDraft(defaultValue);
        setMessage("Đã khôi phục mặc định");
        router.refresh();
      } else {
        setMessage(result.error ?? "Lỗi");
      }
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tìm nội dung trang ({locale})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo key hoặc nội dung..."
          />
          <div className="max-h-[520px] overflow-y-auto rounded-xl border">
            {results.map((entry) => {
              const overridden = Boolean(overrideMap[entry.key]);
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => selectKey(entry.key)}
                  className={`block w-full border-b px-3 py-2 text-left last:border-b-0 hover:bg-gray-50 ${
                    selectedKey === entry.key ? "bg-violet-50" : ""
                  }`}
                >
                  <p className="font-mono text-[11px] text-violet-700">{entry.key}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-800">{entry.value}</p>
                  {overridden && (
                    <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Override
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chỉnh sửa nội dung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedKey ? (
            <p className="text-sm text-muted-foreground">
              Chọn một key bên trái hoặc bật &quot;Chỉnh sửa nội dung trang&quot; ở thanh dưới màn
              hình rồi bấm trực tiếp vào chữ trên trang.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Key</Label>
                <Input value={selectedKey} readOnly className="font-mono text-xs" />
              </div>
              <div className="space-y-2">
                <Label>Nội dung hiển thị</Label>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={8}
                  className="flex min-h-[180px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="rounded-xl bg-muted/60 px-3 py-2 text-sm">
                <p className="font-medium">Mặc định</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">
                  {defaultValue}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={handleSave} disabled={isPending || !draft.trim()}>
                  {isPending ? "Đang lưu..." : "Lưu"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isPending || !overrideMap[selectedKey]}
                >
                  Khôi phục mặc định
                </Button>
              </div>
            </>
          )}
          {message && <p className="text-sm text-violet-700">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
