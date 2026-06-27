"use client";

import { useState, useTransition } from "react";
import {
  createExercise,
  createLesson,
  createSkill,
  createUnit,
} from "@/actions/admin/content";
import { createLevel, createProgram } from "@/actions/admin/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentTree, type TreeSelection } from "@/components/admin/content-tree";
import { EntityEditor } from "@/components/admin/entity-editor";
import { ExerciseTypeSelect } from "@/components/admin/exercise-type-select";
import { AdminMessage, useAdminMessage } from "@/components/admin/shared/admin-message";
import type { AdminContentTree } from "@/lib/admin/types";

interface ContentTreePanelProps {
  content: AdminContentTree;
}

export function ContentTreePanel({ content }: ContentTreePanelProps) {
  const [selection, setSelection] = useState<TreeSelection | null>(null);
  const { message, showMessage } = useAdminMessage();

  return (
    <div className="space-y-4">
      <AdminMessage message={message} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Cây nội dung</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentTree content={content} selection={selection} onSelect={setSelection} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <EntityEditor content={content} selection={selection} onMessage={showMessage} />
        </div>
      </div>
    </div>
  );
}

interface ContentCreatePanelProps {
  content: AdminContentTree;
}

export function ContentCreatePanel({ content }: ContentCreatePanelProps) {
  const { message, showMessage } = useAdminMessage();
  const [isPending, startTransition] = useTransition();
  const [createProgramId, setCreateProgramId] = useState(content.programs[0]?.id ?? "");
  const programLevels = content.levels.filter((l) => l.program_id === createProgramId);
  const [createLevelId, setCreateLevelId] = useState(programLevels[0]?.id ?? "");
  const filteredSkills = content.skills.filter((s) => s.level_id === createLevelId);

  function runCreate(
    action: (fd: FormData) => Promise<{ success: boolean; error?: string }>,
    fd: FormData,
    ok: string
  ) {
    startTransition(async () => {
      const result = await action(fd);
      showMessage(result.success ? ok : result.error ?? "Lỗi");
    });
  }

  return (
    <div className="space-y-4">
      <AdminMessage message={message} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Chương trình</Label>
          <select
            value={createProgramId}
            onChange={(e) => {
              setCreateProgramId(e.target.value);
              const levels = content.levels.filter((l) => l.program_id === e.target.value);
              setCreateLevelId(levels[0]?.id ?? "");
            }}
            className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
          >
            {content.programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Cấp độ</Label>
          <select
            value={createLevelId}
            onChange={(e) => setCreateLevelId(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
          >
            {programLevels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chương trình / Cấp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              action={(fd) => runCreate(createProgram, fd, "Đã tạo chương trình")}
              className="space-y-2"
            >
              <Input name="name" placeholder="Tên chương trình" required />
              <Input name="slug" placeholder="Slug" required />
              <Input name="description" placeholder="Mô tả" />
              <Button type="submit" size="sm" disabled={isPending}>
                Tạo chương trình
              </Button>
            </form>
            <form
              action={(fd) => {
                fd.set("programId", createProgramId);
                runCreate(createLevel, fd, "Đã tạo cấp độ");
              }}
              className="space-y-2 border-t pt-4"
            >
              <Input name="name" placeholder="Tên cấp độ" required />
              <Input name="slug" placeholder="Slug" required />
              <Button type="submit" size="sm" disabled={isPending || !createProgramId}>
                Tạo cấp độ
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kỹ năng / Unit / Bài học / Bài tập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              action={(fd) => {
                fd.set("levelId", createLevelId);
                runCreate(createSkill, fd, "Đã tạo kỹ năng");
              }}
              className="space-y-2"
            >
              <Input name="name" placeholder="Tên kỹ năng" required />
              <Input name="slug" placeholder="Slug" required />
              <Button type="submit" size="sm" disabled={isPending}>
                Tạo kỹ năng
              </Button>
            </form>
            <form
              action={(fd) => runCreate(createUnit, fd, "Đã tạo unit")}
              className="space-y-2 border-t pt-4"
            >
              <select name="skillId" required className="h-10 w-full rounded-lg border px-3 text-sm">
                <option value="">Chọn kỹ năng</option>
                {filteredSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <Input name="title" placeholder="Tên unit" required />
              <Input name="slug" placeholder="Slug" required />
              <Button type="submit" size="sm" disabled={isPending}>
                Tạo unit
              </Button>
            </form>
            <form
              action={(fd) => runCreate(createLesson, fd, "Đã tạo bài học")}
              className="space-y-2 border-t pt-4"
            >
              <select name="unitId" required className="h-10 w-full rounded-lg border px-3 text-sm">
                <option value="">Chọn unit</option>
                {content.units
                  .filter((u) => filteredSkills.some((s) => s.id === u.skill_id))
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.title}
                    </option>
                  ))}
              </select>
              <Input name="title" placeholder="Tên bài học" required />
              <Input name="slug" placeholder="Slug" required />
              <Button type="submit" size="sm" disabled={isPending}>
                Tạo bài học
              </Button>
            </form>
            <form
              action={(fd) => runCreate(createExercise, fd, "Đã tạo bài tập")}
              className="space-y-2 border-t pt-4"
            >
              <select name="lessonId" required className="h-10 w-full rounded-lg border px-3 text-sm">
                <option value="">Chọn bài học</option>
                {content.lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
              <Input name="title" placeholder="Tên bài tập" required />
              <Input name="slug" placeholder="Slug" required />
              <ExerciseTypeSelect />
              <Button type="submit" size="sm" disabled={isPending}>
                Tạo bài tập
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
