"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addMockTestQuestion,
  createMockTest,
  createMockTestSection,
  deleteMockTest,
  deleteMockTestSection,
  removeMockTestQuestion,
  updateMockTest,
} from "@/actions/admin/assessments";
import type { AdminContentTree, AdminMockTest } from "@/lib/admin/types";

interface MockTestEditorProps {
  programs: AdminContentTree["programs"];
  levels: AdminContentTree["levels"];
  skills: AdminContentTree["skills"];
  mockTests: AdminMockTest[];
  allQuestions: AdminContentTree["questions"];
  onMessage: (msg: string) => void;
}

export function MockTestEditor({
  programs,
  levels,
  skills,
  mockTests,
  allQuestions,
  onMessage,
}: MockTestEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState(mockTests[0]?.id ?? "");

  const selected = mockTests.find((mt) => mt.id === selectedId);

  function run(action: () => Promise<{ success: boolean; error?: string }>, ok: string) {
    startTransition(async () => {
      const result = await action();
      onMessage(result.success ? ok : result.error ?? "Lỗi");
    });
  }

  const programLevels = levels.filter((l) => l.program_id === programs[0]?.id);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Tạo mock test</CardTitle></CardHeader>
        <CardContent>
          <form
            action={(fd) => run(() => createMockTest(fd), "Đã tạo mock test")}
            className="grid md:grid-cols-2 gap-3"
          >
            <select name="programId" required className="h-10 rounded-lg border px-3 text-sm">
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select name="levelId" className="h-10 rounded-lg border px-3 text-sm">
              <option value="">Không chọn cấp</option>
              {programLevels.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <Input name="title" placeholder="Tiêu đề" required />
            <Input name="description" placeholder="Mô tả" />
            <Input name="timeLimitMinutes" type="number" placeholder="Thời gian (phút)" defaultValue={45} />
            <Input name="totalScore" type="number" placeholder="Tổng điểm" defaultValue={100} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" value="true" defaultChecked />
              Hoạt động
            </label>
            <Button type="submit" size="sm" disabled={isPending}>Tạo</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Mock tests</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {mockTests.map((mt) => (
              <button
                key={mt.id}
                type="button"
                onClick={() => setSelectedId(mt.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  selectedId === mt.id ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                }`}
              >
                {mt.title}
                <span className="block text-xs text-gray-400">
                  {mt.sections.length} phần • {mt.time_limit_minutes} phút
                </span>
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
                onClick={() => run(() => deleteMockTest(selected.id), "Đã xóa")}
              >
                Xóa
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                action={(fd) => {
                  fd.set("id", selected.id);
                  run(() => updateMockTest(fd), "Đã cập nhật");
                }}
                className="grid md:grid-cols-2 gap-3"
              >
                <Input name="title" defaultValue={selected.title} required />
                <Input name="description" defaultValue={selected.description ?? ""} />
                <Input name="timeLimitMinutes" type="number" defaultValue={selected.time_limit_minutes} />
                <Input name="totalScore" type="number" defaultValue={selected.total_score} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isActive" value="true" defaultChecked={selected.is_active} />
                  Hoạt động
                </label>
                <Button type="submit" size="sm" disabled={isPending}>Lưu</Button>
              </form>

              <div className="border-t pt-4">
                <Label>Thêm phần (section)</Label>
                <form
                  action={(fd) => {
                    fd.set("mockTestId", selected.id);
                    run(() => createMockTestSection(fd), "Đã thêm section");
                  }}
                  className="flex flex-wrap gap-2 mt-1"
                >
                  <Input name="title" placeholder="Tên section" required className="flex-1 min-w-[120px]" />
                  <select name="skillId" className="h-10 rounded-lg border px-3 text-sm">
                    <option value="">Kỹ năng</option>
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <Input name="timeLimitMinutes" type="number" placeholder="Phút" className="w-24" />
                  <Button type="submit" size="sm" disabled={isPending}>Thêm</Button>
                </form>
              </div>

              {selected.sections.map((section) => (
                <div key={section.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">{section.title}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => run(() => deleteMockTestSection(section.id), "Đã xóa section")}
                    >
                      Xóa section
                    </Button>
                  </div>

                  <form
                    action={(fd) => {
                      fd.set("sectionId", section.id);
                      run(() => addMockTestQuestion(fd), "Đã thêm câu hỏi");
                    }}
                    className="flex gap-2"
                  >
                    <select name="questionId" required className="flex-1 h-9 rounded-lg border px-2 text-sm">
                      <option value="">Chọn câu hỏi</option>
                      {allQuestions.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.question_text.slice(0, 50)}...
                        </option>
                      ))}
                    </select>
                    <Input name="points" type="number" defaultValue={1} className="w-16" />
                    <Button type="submit" size="sm" disabled={isPending}>Thêm</Button>
                  </form>

                  {section.questions.map((mq) => (
                    <div key={mq.id} className="flex justify-between text-sm py-1 border-b">
                      <span>{mq.question_text} ({mq.points}đ)</span>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => run(() => removeMockTestQuestion(mq.id), "Đã xóa")}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
