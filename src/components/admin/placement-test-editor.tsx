"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addPlacementTestQuestion,
  createPlacementTest,
  deletePlacementTest,
  removePlacementTestQuestion,
  updatePlacementTest,
} from "@/actions/admin/assessments";
import type { AdminContentTree, AdminPlacementTest } from "@/lib/admin/types";

interface PlacementTestEditorProps {
  programs: AdminContentTree["programs"];
  placementTests: AdminPlacementTest[];
  allQuestions: AdminContentTree["questions"];
  onMessage: (msg: string) => void;
}

export function PlacementTestEditor({
  programs,
  placementTests,
  allQuestions,
  onMessage,
}: PlacementTestEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState(placementTests[0]?.id ?? "");

  const selected = placementTests.find((pt) => pt.id === selectedId);

  function run(action: () => Promise<{ success: boolean; error?: string }>, ok: string) {
    startTransition(async () => {
      const result = await action();
      onMessage(result.success ? ok : result.error ?? "Lỗi");
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Tạo placement test</CardTitle></CardHeader>
        <CardContent>
          <form
            action={(fd) => run(() => createPlacementTest(fd), "Đã tạo placement test")}
            className="grid md:grid-cols-2 gap-3"
          >
            <select name="programId" required className="h-10 rounded-lg border px-3 text-sm">
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Input name="title" placeholder="Tiêu đề" required />
            <Input name="description" placeholder="Mô tả" />
            <Input name="timeLimitMinutes" type="number" placeholder="Thời gian (phút)" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" value="true" defaultChecked />
              Hoạt động
            </label>
            <Button type="submit" size="sm" disabled={isPending}>Tạo</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader><CardTitle className="text-base">Danh sách</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {placementTests.map((pt) => (
              <button
                key={pt.id}
                type="button"
                onClick={() => setSelectedId(pt.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  selectedId === pt.id ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                }`}
              >
                {pt.title}
                <span className="block text-xs text-gray-400">{pt.questions.length} câu</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {selected && (
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-base">{selected.title}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => run(() => deletePlacementTest(selected.id), "Đã xóa")}
              >
                Xóa
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                action={(fd) => {
                  fd.set("id", selected.id);
                  run(() => updatePlacementTest(fd), "Đã cập nhật");
                }}
                className="space-y-3"
              >
                <Input name="title" defaultValue={selected.title} required />
                <Input name="description" defaultValue={selected.description ?? ""} />
                <Input name="questionCount" type="number" defaultValue={selected.question_count} readOnly />
                <Input name="timeLimitMinutes" type="number" defaultValue={selected.time_limit_minutes ?? ""} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isActive" value="true" defaultChecked={selected.is_active} />
                  Hoạt động
                </label>
                <Button type="submit" size="sm" disabled={isPending}>Lưu</Button>
              </form>

              <div>
                <Label>Thêm câu hỏi</Label>
                <form
                  action={(fd) => {
                    fd.set("placementTestId", selected.id);
                    fd.set("skillWeight", JSON.stringify({ reading: 1 }));
                    run(() => addPlacementTestQuestion(fd), "Đã thêm câu hỏi");
                  }}
                  className="flex gap-2 mt-1"
                >
                  <select name="questionId" required className="flex-1 h-10 rounded-lg border px-3 text-sm">
                    <option value="">Chọn câu hỏi</option>
                    {allQuestions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.question_text.slice(0, 60)}...
                      </option>
                    ))}
                  </select>
                  <Button type="submit" size="sm" disabled={isPending}>Thêm</Button>
                </form>
              </div>

              <div className="space-y-2">
                {selected.questions.map((pq) => (
                  <div key={pq.id} className="flex justify-between items-center text-sm border-b py-2">
                    <span>{pq.question_text}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => run(() => removePlacementTestQuestion(pq.id), "Đã xóa")}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
