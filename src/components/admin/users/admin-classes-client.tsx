"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminClassRow } from "@/lib/admin/users/types";

interface AdminClassesClientProps {
  classes: AdminClassRow[];
  total: number;
  page: number;
}

export function AdminClassesClient({ classes, total, page }: AdminClassesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const totalPages = Math.max(1, Math.ceil(total / 25));

  function navigate(nextPage: number, q?: string) {
    const params = new URLSearchParams();
    if (q ?? query) params.set("q", q ?? query);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/admin/users/teachers?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          navigate(1, String(fd.get("q") ?? ""));
        }}
      >
        <Input name="q" defaultValue={query} placeholder="Tìm tên lớp..." className="max-w-sm" />
        <Button type="submit" variant="outline">
          Tìm
        </Button>
      </form>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Lớp</th>
                <th className="px-4 py-3">Giáo viên</th>
                <th className="px-4 py-3">Mã tham gia</th>
                <th className="px-4 py-3">Học sinh</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <p>{c.teacherName}</p>
                    <p className="text-xs text-gray-500">{c.teacherEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{c.joinCode}</td>
                  <td className="px-4 py-3">{c.studentCount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.isActive ? "default" : "secondary"}>
                      {c.isActive ? "Hoạt động" : "Ẩn"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{total} lớp</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate(page - 1)}>
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => navigate(page + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
