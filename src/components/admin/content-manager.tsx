"use client";

import { useState, useTransition } from "react";
import {
  createSkill,
  createUnit,
  createLesson,
  createExercise,
  createQuestion,
  updateExerciseStatus,
} from "@/actions/admin/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentStatus } from "@/types/database";

interface ContentTree {
  programs: { id: string; name: string; slug: string; is_active: boolean }[];
  levels: { id: string; program_id: string; name: string }[];
  skills: { id: string; level_id: string; name: string }[];
  units: { id: string; skill_id: string; title: string }[];
  lessons: { id: string; unit_id: string; title: string }[];
  exercises: {
    id: string;
    lesson_id: string;
    title: string;
    status: ContentStatus;
    exercise_type: string;
  }[];
}

interface AdminContentManagerProps {
  content: ContentTree;
}

export function AdminContentManager({ content }: AdminContentManagerProps) {
  const [selectedProgram, setSelectedProgram] = useState(
    content.programs[0]?.id ?? ""
  );
  const programLevels = content.levels.filter((l) => l.program_id === selectedProgram);
  const [selectedLevel, setSelectedLevel] = useState(programLevels[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredSkills = content.skills.filter((s) => s.level_id === selectedLevel);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  function handleCreateSkill(formData: FormData) {
    formData.set("levelId", selectedLevel);
    startTransition(async () => {
      const result = await createSkill(formData);
      showMessage(result.success ? "Đã tạo kỹ năng" : result.error ?? "Lỗi");
    });
  }

  function handleCreateUnit(formData: FormData) {
    startTransition(async () => {
      const result = await createUnit(formData);
      showMessage(result.success ? "Đã tạo unit" : result.error ?? "Lỗi");
    });
  }

  function handleCreateLesson(formData: FormData) {
    startTransition(async () => {
      const result = await createLesson(formData);
      showMessage(result.success ? "Đã tạo bài học" : result.error ?? "Lỗi");
    });
  }

  function handleCreateExercise(formData: FormData) {
    startTransition(async () => {
      const result = await createExercise(formData);
      showMessage(result.success ? "Đã tạo bài tập" : result.error ?? "Lỗi");
    });
  }

  function handleCreateQuestion(formData: FormData) {
    startTransition(async () => {
      const result = await createQuestion(formData);
      showMessage(result.success ? "Đã tạo câu hỏi" : result.error ?? "Lỗi");
    });
  }

  function handlePublish(exerciseId: string) {
    startTransition(async () => {
      const result = await updateExerciseStatus(exerciseId, "published");
      showMessage(result.success ? "Đã xuất bản" : result.error ?? "Lỗi");
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Chương trình</Label>
          <select
            value={selectedProgram}
            onChange={(e) => {
              setSelectedProgram(e.target.value);
              const levels = content.levels.filter((l) => l.program_id === e.target.value);
              setSelectedLevel(levels[0]?.id ?? "");
            }}
            className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm"
          >
            {content.programs.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Cấp độ</Label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="mt-1 w-full h-10 rounded-lg border border-gray-200 px-3 text-sm"
          >
            {programLevels.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Tạo kỹ năng</CardTitle></CardHeader>
          <CardContent>
            <form action={handleCreateSkill} className="space-y-3">
              <Input name="name" placeholder="Tên kỹ năng (VD: Reading)" required />
              <Input name="slug" placeholder="Slug (VD: reading)" required />
              <Button type="submit" size="sm" disabled={isPending}>Tạo</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Tạo Unit</CardTitle></CardHeader>
          <CardContent>
            <form action={handleCreateUnit} className="space-y-3">
              <select name="skillId" required className="w-full h-10 rounded-lg border px-3 text-sm">
                <option value="">Chọn kỹ năng</option>
                {filteredSkills.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <Input name="title" placeholder="Tên unit" required />
              <Input name="slug" placeholder="Slug" required />
              <Button type="submit" size="sm" disabled={isPending}>Tạo</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Tạo bài học</CardTitle></CardHeader>
          <CardContent>
            <form action={handleCreateLesson} className="space-y-3">
              <select name="unitId" required className="w-full h-10 rounded-lg border px-3 text-sm">
                <option value="">Chọn unit</option>
                {content.units
                  .filter((u) => filteredSkills.some((s) => s.id === u.skill_id))
                  .map((u) => (
                    <option key={u.id} value={u.id}>{u.title}</option>
                  ))}
              </select>
              <Input name="title" placeholder="Tên bài học" required />
              <Input name="slug" placeholder="Slug" required />
              <Input name="description" placeholder="Mô tả" />
              <Button type="submit" size="sm" disabled={isPending}>Tạo</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Tạo bài tập</CardTitle></CardHeader>
          <CardContent>
            <form action={handleCreateExercise} className="space-y-3">
              <select name="lessonId" required className="w-full h-10 rounded-lg border px-3 text-sm">
                <option value="">Chọn bài học</option>
                {content.lessons.map((l) => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
              <Input name="title" placeholder="Tên bài tập" required />
              <Input name="slug" placeholder="Slug" required />
              <select name="exerciseType" required className="w-full h-10 rounded-lg border px-3 text-sm">
                <option value="multiple_choice">Trắc nghiệm</option>
                <option value="multi_select">Chọn nhiều</option>
                <option value="gap_fill">Điền từ</option>
                <option value="matching">Nối cặp</option>
                <option value="sentence_ordering">Sắp xếp câu</option>
                <option value="writing">Bài viết (AI)</option>
                <option value="speaking">Bài nói (AI)</option>
              </select>
              <Input name="instructions" placeholder="Hướng dẫn" />
              <Button type="submit" size="sm" disabled={isPending}>Tạo</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Tạo câu hỏi (trắc nghiệm)</CardTitle></CardHeader>
        <CardContent>
          <form action={handleCreateQuestion} className="space-y-3">
            <select name="exerciseId" required className="w-full h-10 rounded-lg border px-3 text-sm">
              <option value="">Chọn bài tập</option>
              {content.exercises.map((e) => (
                <option key={e.id} value={e.id}>{e.title} ({e.status})</option>
              ))}
            </select>
            <Input name="questionText" placeholder="Nội dung câu hỏi" required />
            <input type="hidden" name="questionType" value="multiple_choice" />
            <Input name="explanation" placeholder="Giải thích" />
            <Input
              name="choices"
              placeholder='JSON: [{"text":"A","isCorrect":false},{"text":"B","isCorrect":true}]'
            />
            <Button type="submit" size="sm" disabled={isPending}>Tạo câu hỏi</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Bài tập ({content.exercises.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {content.exercises.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-gray-500">{e.exercise_type} • {e.status}</p>
                </div>
                {e.status !== "published" && (
                  <Button size="sm" variant="outline" onClick={() => handlePublish(e.id)} disabled={isPending}>
                    Xuất bản
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
