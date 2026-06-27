"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { updateParentLinkStatus } from "@/actions/admin/users";
import type { AdminParentLinkRow } from "@/lib/admin/users/types";

interface AdminParentsClientProps {
  links: AdminParentLinkRow[];
  total: number;
  page: number;
}

export function AdminParentsClient({ links, total, page }: AdminParentsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const query = searchParams.get("q") ?? "";

  function navigate(nextPage: number, q?: string) {
    const params = new URLSearchParams();
    if (q ?? query) params.set("q", q ?? query);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/admin/users/parents?${params.toString()}`);
  }

  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-4">
      {message && (
        <p className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900">{message}</p>
      )}

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          navigate(1, String(fd.get("q") ?? ""));
        }}
      >
        <Input name="q" defaultValue={query} placeholder="Lọc email phụ huynh / học sinh..." />
        <Button type="submit" variant="outline">
          Lọc
        </Button>
      </form>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Phụ huynh</th>
                <th className="px-4 py-3">Học sinh</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày mời</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id} className="border-b">
                  <td className="px-4 py-3">
                    <p className="font-medium">{link.parentName}</p>
                    <p className="text-xs text-gray-500">{link.parentEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{link.studentName}</p>
                    <p className="text-xs text-gray-500">{link.studentEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={link.status === "active" ? "default" : "secondary"}>
                      {link.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(link.invitedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {link.status !== "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() =>
                            startTransition(async () => {
                              const r = await updateParentLinkStatus(link.id, "active");
                              setMessage(r.success ? "Đã kích hoạt" : r.error ?? "Lỗi");
                              if (r.success) router.refresh();
                            })
                          }
                        >
                          Kích hoạt
                        </Button>
                      )}
                      {link.status !== "revoked" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() =>
                            startTransition(async () => {
                              const r = await updateParentLinkStatus(link.id, "revoked");
                              setMessage(r.success ? "Đã thu hồi" : r.error ?? "Lỗi");
                              if (r.success) router.refresh();
                            })
                          }
                        >
                          Thu hồi
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{total} liên kết</span>
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
