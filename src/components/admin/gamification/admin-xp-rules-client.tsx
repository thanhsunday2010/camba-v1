"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adjustUserXp, updateXpRule } from "@/actions/admin/gamification";
import type { AdminXpRuleRow } from "@/lib/admin/gamification/types";
import type { XpEventType } from "@/types/database";

interface AdminXpRulesClientProps {
  rules: AdminXpRuleRow[];
  canManage: boolean;
}

export function AdminXpRulesClient({ rules, canManage }: AdminXpRulesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<AdminXpRuleRow>>({});

  const [adjustEmail, setAdjustEmail] = useState("");
  const [adjustXp, setAdjustXp] = useState("0");
  const [adjustCoin, setAdjustCoin] = useState("0");
  const [adjustReason, setAdjustReason] = useState("");

  function saveRule(rule: AdminXpRuleRow) {
    startTransition(async () => {
      const result = await updateXpRule({
        eventType: rule.eventType,
        xpAmount: draft.xpAmount ?? rule.xpAmount,
        coinAmount: draft.coinAmount ?? rule.coinAmount,
        description: draft.description ?? rule.description ?? undefined,
        isActive: draft.isActive ?? rule.isActive,
      });
      setMessage(result.success ? "Đã lưu quy tắc XP" : result.error ?? "Lỗi");
      if (result.success) {
        setEditing(null);
        setDraft({});
        router.refresh();
      }
    });
  }

  function runAdjust() {
    startTransition(async () => {
      const result = await adjustUserXp({
        email: adjustEmail,
        xpDelta: parseInt(adjustXp, 10) || 0,
        coinDelta: parseInt(adjustCoin, 10) || 0,
        reason: adjustReason || undefined,
      });
      setMessage(result.success ? "Đã điều chỉnh XP" : result.error ?? "Lỗi");
      if (result.success) {
        setAdjustEmail("");
        setAdjustXp("0");
        setAdjustCoin("0");
        setAdjustReason("");
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
          <CardTitle className="text-base">Quy tắc XP theo sự kiện</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Sự kiện</th>
                  <th className="px-4 py-3 font-medium">XP</th>
                  <th className="px-4 py-3 font-medium">Coin</th>
                  <th className="px-4 py-3 font-medium">Mô tả</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  {canManage && <th className="px-4 py-3 font-medium" />}
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => {
                  const isEdit = editing === rule.eventType;
                  return (
                    <tr key={rule.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-mono text-xs">{rule.eventType}</td>
                      <td className="px-4 py-3">
                        {isEdit ? (
                          <Input
                            type="number"
                            className="w-20"
                            defaultValue={rule.xpAmount}
                            onChange={(e) =>
                              setDraft((d) => ({ ...d, xpAmount: parseInt(e.target.value, 10) }))
                            }
                          />
                        ) : (
                          rule.xpAmount
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEdit ? (
                          <Input
                            type="number"
                            className="w-20"
                            defaultValue={rule.coinAmount}
                            onChange={(e) =>
                              setDraft((d) => ({ ...d, coinAmount: parseInt(e.target.value, 10) }))
                            }
                          />
                        ) : (
                          rule.coinAmount
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{rule.description ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "Bật" : "Tắt"}
                        </Badge>
                      </td>
                      {canManage && (
                        <td className="px-4 py-3">
                          {isEdit ? (
                            <div className="flex gap-1">
                              <Button size="sm" disabled={isPending} onClick={() => saveRule(rule)}>
                                Lưu
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditing(null);
                                  setDraft({});
                                }}
                              >
                                Hủy
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditing(rule.eventType as XpEventType);
                                setDraft({});
                              }}
                            >
                              Sửa
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Điều chỉnh XP thủ công</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={adjustEmail} onChange={(e) => setAdjustEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>XP (+/-)</Label>
              <Input value={adjustXp} onChange={(e) => setAdjustXp(e.target.value)} type="number" />
            </div>
            <div className="space-y-1">
              <Label>Coin (+/-)</Label>
              <Input
                value={adjustCoin}
                onChange={(e) => setAdjustCoin(e.target.value)}
                type="number"
              />
            </div>
            <div className="space-y-1">
              <Label>Lý do</Label>
              <Input value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={runAdjust} disabled={isPending || !adjustEmail.trim()}>
                Áp dụng
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
