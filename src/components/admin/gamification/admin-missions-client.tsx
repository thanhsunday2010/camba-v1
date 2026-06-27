"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveDailyMission } from "@/actions/admin/gamification";
import type { AdminDailyMissionRow } from "@/lib/admin/gamification/types";

interface AdminMissionsClientProps {
  missions: AdminDailyMissionRow[];
  canManage: boolean;
}

const EMPTY_FORM = {
  slug: "",
  title: "",
  description: "",
  missionType: "lessons_completed",
  targetValue: 1,
  xpReward: 50,
  coinReward: 10,
  isActive: true,
};

const MISSION_TYPE_LABELS: Record<string, string> = {
  lessons_completed: "Hoàn thành bài học",
  xp_earned: "Kiếm XP",
  listening_minutes: "Phút nghe",
};

export function AdminMissionsClient({ missions, canManage }: AdminMissionsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function runSave() {
    startTransition(async () => {
      const result = await saveDailyMission(form);
      setMessage(result.success ? "Đã lưu nhiệm vụ" : result.error ?? "Lỗi");
      if (result.success) {
        setShowForm(false);
        setForm(EMPTY_FORM);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900">{message}</p>
      )}

      <p className="text-sm text-gray-600">
        Nhiệm vụ hàng ngày được gán tự động cho học sinh mỗi ngày. Streak được theo dõi qua{" "}
        <code>user_streaks</code> — chỉ xem, không chỉnh từ đây.
      </p>

      {canManage && (
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Đóng form" : "Thêm nhiệm vụ"}
        </Button>
      )}

      {showForm && canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nhiệm vụ mới</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Tiêu đề</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Loại</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.missionType}
                onChange={(e) => setForm((f) => ({ ...f, missionType: e.target.value }))}
              >
                {Object.entries(MISSION_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Mục tiêu</Label>
              <Input
                type="number"
                value={form.targetValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, targetValue: parseInt(e.target.value, 10) || 1 }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>XP thưởng</Label>
              <Input
                type="number"
                value={form.xpReward}
                onChange={(e) =>
                  setForm((f) => ({ ...f, xpReward: parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
            <div className="flex items-end">
              <Button onClick={runSave} disabled={isPending}>
                Tạo nhiệm vụ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Nhiệm vụ</th>
                  <th className="px-4 py-3 font-medium">Loại</th>
                  <th className="px-4 py-3 font-medium">Mục tiêu</th>
                  <th className="px-4 py-3 font-medium">Thưởng</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {missions.map((m) => (
                  <tr key={m.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium">{m.title}</div>
                      <div className="font-mono text-xs text-gray-500">{m.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {MISSION_TYPE_LABELS[m.missionType] ?? m.missionType}
                    </td>
                    <td className="px-4 py-3">{m.targetValue}</td>
                    <td className="px-4 py-3 text-xs">
                      {m.xpReward} XP · {m.coinReward} coin
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={m.isActive ? "default" : "secondary"}>
                        {m.isActive ? "Bật" : "Tắt"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
