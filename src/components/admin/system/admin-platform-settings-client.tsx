"use client";

import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KNOWN_PROGRAM_SETTING_KEYS } from "@/lib/admin/settings-keys";
import {
  getProgramSettings,
  saveProgramSetting,
  type AdminProgramRow,
} from "@/actions/admin/settings";

interface AdminPlatformSettingsClientProps {
  programs: AdminProgramRow[];
  initialProgramId: string;
  initialSettings: { key: string; value: unknown; description: string | null }[];
  aiLimits: { tier: string; tierLabel: string; dailyAiLimit: number }[];
}

export function AdminPlatformSettingsClient({
  programs,
  initialProgramId,
  initialSettings,
  aiLimits,
}: AdminPlatformSettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [programId, setProgramId] = useState(initialProgramId);
  const [settings, setSettings] = useState(initialSettings);
  const [draft, setDraft] = useState<Record<string, string>>({});

  function loadProgram(id: string) {
    startTransition(async () => {
      const rows = await getProgramSettings(id);
      setProgramId(id);
      setSettings(rows);
      setDraft({});
      router.refresh();
    });
  }

  function save(key: string) {
    const raw = draft[key];
    const def = KNOWN_PROGRAM_SETTING_KEYS.find((k) => k.key === key);
    if (!def) return;
    const value = def.type === "number" ? parseInt(raw ?? String(settings.find((s) => s.key === key)?.value ?? def.defaultValue), 10) : raw;

    startTransition(async () => {
      const result = await saveProgramSetting({ programId, key, value: value as number });
      setMessage(result.success ? "Đã lưu cài đặt" : result.error ?? "Lỗi");
      if (result.success) {
        setDraft((d) => {
          const next = { ...d };
          delete next[key];
          return next;
        });
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900">{message}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cài đặt chương trình học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Chương trình</Label>
            <select
              className="flex h-10 max-w-md rounded-md border border-input bg-background px-3 text-sm"
              value={programId}
              disabled={isPending}
              onChange={(e) => loadProgram(e.target.value)}
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {KNOWN_PROGRAM_SETTING_KEYS.map((def) => {
              const current = settings.find((s) => s.key === def.key);
              const value = draft[def.key] ?? String(current?.value ?? def.defaultValue);
              return (
                <div
                  key={def.key}
                  className="flex flex-col gap-2 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-end"
                >
                  <div className="flex-1 space-y-1">
                    <Label>{def.label}</Label>
                    <p className="text-xs text-gray-500">{def.description}</p>
                    <Input
                      type={def.type === "number" ? "number" : "text"}
                      value={value}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [def.key]: e.target.value }))
                      }
                    />
                    <p className="font-mono text-xs text-gray-400">{def.key}</p>
                  </div>
                  <Button
                    size="sm"
                    disabled={isPending || draft[def.key] === undefined}
                    onClick={() => save(def.key)}
                  >
                    Lưu
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Giới hạn AI mặc định theo gói</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="py-2 font-medium">Gói</th>
                  <th className="py-2 font-medium">Lượt AI / ngày</th>
                </tr>
              </thead>
              <tbody>
                {aiLimits.map((row) => (
                  <tr key={row.tier} className="border-b last:border-0">
                    <td className="py-2">{row.tierLabel}</td>
                    <td className="py-2">{row.dailyAiLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Giới hạn được cấu hình trong <code>subscription-catalog.ts</code>. Whitelist không
            giới hạn qua biến môi trường <code>AI_UNLIMITED_USER_EMAILS</code> — xem tại{" "}
            <Link href="/admin/tools/ai-limits" className="text-violet-600 underline">
              Giới hạn AI
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
