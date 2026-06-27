"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { grantBadgeToUser, saveBadge } from "@/actions/admin/gamification";
import type { AdminBadgeRow } from "@/lib/admin/gamification/types";

interface AdminBadgesClientProps {
  badges: AdminBadgeRow[];
  canManage: boolean;
}

const EMPTY_FORM = {
  slug: "",
  name: "",
  description: "",
  xpReward: 50,
  coinReward: 20,
  isActive: true,
};

export function AdminBadgesClient({ badges, canManage }: AdminBadgesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [grantEmail, setGrantEmail] = useState("");
  const [grantBadgeId, setGrantBadgeId] = useState(badges[0]?.id ?? "");

  function runSave() {
    startTransition(async () => {
      const result = await saveBadge(form);
      setMessage(result.success ? "Đã lưu huy hiệu" : result.error ?? "Lỗi");
      if (result.success) {
        setShowForm(false);
        setForm(EMPTY_FORM);
        router.refresh();
      }
    });
  }

  function runGrant() {
    startTransition(async () => {
      const result = await grantBadgeToUser({ email: grantEmail, badgeId: grantBadgeId });
      setMessage(result.success ? "Đã trao huy hiệu" : result.error ?? "Lỗi");
      if (result.success) {
        setGrantEmail("");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900">{message}</p>
      )}

      {canManage && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Đóng form" : "Thêm huy hiệu"}
          </Button>
        </div>
      )}

      {showForm && canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Huy hiệu mới</CardTitle>
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
              <Label>Tên</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Mô tả</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
            <div className="space-y-1">
              <Label>Coin thưởng</Label>
              <Input
                type="number"
                value={form.coinReward}
                onChange={(e) =>
                  setForm((f) => ({ ...f, coinReward: parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
            <div className="flex items-end">
              <Button onClick={runSave} disabled={isPending}>
                Tạo huy hiệu
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
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Tên</th>
                  <th className="px-4 py-3 font-medium">Thưởng</th>
                  <th className="px-4 py-3 font-medium">Đã đạt</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {badges.map((b) => (
                  <tr key={b.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{b.slug}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{b.name}</div>
                      {b.description && (
                        <div className="text-xs text-gray-500">{b.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {b.xpReward} XP · {b.coinReward} coin
                    </td>
                    <td className="px-4 py-3">{b.earnedCount}</td>
                    <td className="px-4 py-3">
                      <Badge variant={b.isActive ? "default" : "secondary"}>
                        {b.isActive ? "Bật" : "Tắt"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {canManage && badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trao huy hiệu thủ công</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Huy hiệu</Label>
              <select
                className="flex h-10 min-w-[200px] rounded-md border border-input bg-background px-3 text-sm"
                value={grantBadgeId}
                onChange={(e) => setGrantBadgeId(e.target.value)}
              >
                {badges.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={runGrant} disabled={isPending || !grantEmail.trim()}>
                Trao huy hiệu
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
