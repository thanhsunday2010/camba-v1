"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lookupUserProgress } from "@/actions/admin/users";
import type { AdminProgressSummary } from "@/lib/admin/users/types";

interface AdminProgressLookupClientProps {
  initialQuery: string;
  initialResult: AdminProgressSummary | null;
}

export function AdminProgressLookupClient({
  initialQuery,
  initialResult,
}: AdminProgressLookupClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(initialResult);
  const [error, setError] = useState<string | null>(
    initialQuery && !initialResult ? "Không tìm thấy người dùng" : null
  );

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q") as string;
          startTransition(async () => {
            setError(null);
            const data = await lookupUserProgress(q);
            setResult(data);
            if (!data) setError("Không tìm thấy người dùng");
            router.push(`/admin/users/progress?q=${encodeURIComponent(q)}`);
          });
        }}
      >
        <Input name="q" defaultValue={initialQuery} placeholder="Email hoặc tên..." className="max-w-md" required />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang tìm..." : "Tra cứu"}
        </Button>
      </form>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {result.user.fullName} — {result.user.email}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "Bài học hoàn thành", value: result.lessonsCompleted },
                { label: "Đang học dở", value: result.lessonsInProgress },
                { label: "Lượt làm bài tập", value: result.exerciseAttempts },
                { label: "Lượt mock test", value: result.mockAttempts },
                { label: "Tổng XP", value: result.totalXp },
                { label: "Streak", value: result.currentStreak },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
