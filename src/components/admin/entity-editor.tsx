"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  deleteExercise,
  deleteLesson,
  deleteSkill,
  deleteUnit,
  submitExerciseForReview,
  updateExercise,
  updateExerciseStatus,
  updateLesson,
  updateSkill,
  updateUnit,
} from "@/actions/admin/content";
import {
  deleteLevel,
  deleteProgram,
  updateLevel,
  updateProgram,
  updateProgramStatus,
} from "@/actions/admin/programs";
import { deleteQuestion, reorderQuestion } from "@/actions/admin/questions";
import { StatusBadge } from "./shared/status-badge";
import { QuestionAuthoring } from "./question-authoring";
import { ExerciseTypeSelect } from "./exercise-type-select";
import { saveQuestion } from "@/actions/admin/questions";
import { isQuestionBankExercise } from "@/lib/admin/constants";
import type { AdminContentTree } from "@/lib/admin/types";
import type { TreeSelection } from "./content-tree";
import type { ContentStatus } from "@/types/database";

interface EntityEditorProps {
  content: AdminContentTree;
  selection: TreeSelection | null;
  onMessage: (msg: string) => void;
}

export function EntityEditor({ content, selection, onMessage }: EntityEditorProps) {
  const [isPending, startTransition] = useTransition();

  if (!selection) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500 text-sm">
          Chọn mục trong cây nội dung để chỉnh sửa
        </CardContent>
      </Card>
    );
  }

  function run(action: () => Promise<{ success: boolean; error?: string }>, ok: string) {
    startTransition(async () => {
      const result = await action();
      onMessage(result.success ? ok : result.error ?? "Lỗi");
    });
  }

  if (selection.type === "program") {
    const program = content.programs.find((p) => p.id === selection.id);
    if (!program) return null;
    return (
      <EditCard title="Chương trình" onDelete={() => run(() => deleteProgram(program.id), "Đã xóa")} isPending={isPending}>
        <form action={(fd) => run(() => updateProgram(fd), "Đã cập nhật")} className="space-y-3">
          <input type="hidden" name="id" value={program.id} />
          <Input name="name" defaultValue={program.name} required />
          <Input name="slug" defaultValue={program.slug} required />
          <Input name="description" defaultValue={program.description ?? ""} />
          <Input name="iconUrl" defaultValue={program.icon_url ?? ""} placeholder="Icon URL" />
          <Input name="coverUrl" defaultValue={program.cover_url ?? ""} placeholder="Cover URL" />
          <Input name="sortOrder" type="number" defaultValue={program.sort_order} />
          <textarea
            name="settings"
            defaultValue={JSON.stringify(program.settings ?? {}, null, 2)}
            className="w-full min-h-[80px] rounded-lg border px-3 py-2 text-sm font-mono"
            placeholder="JSON settings"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" value="true" defaultChecked={program.is_active} />
            Hoạt động
          </label>
          <Button type="submit" size="sm" disabled={isPending}>Lưu</Button>
        </form>
        <Button
          size="sm"
          variant="outline"
          className="mt-2"
          disabled={isPending}
          onClick={() =>
            run(() => updateProgramStatus(program.id, !program.is_active), "Đã cập nhật trạng thái")
          }
        >
          {program.is_active ? "Ẩn chương trình" : "Kích hoạt"}
        </Button>
      </EditCard>
    );
  }

  if (selection.type === "level") {
    const level = content.levels.find((l) => l.id === selection.id);
    if (!level) return null;
    return (
      <EditCard title="Cấp độ" onDelete={() => run(() => deleteLevel(level.id), "Đã xóa")} isPending={isPending}>
        <form action={(fd) => run(() => updateLevel(fd), "Đã cập nhật")} className="space-y-3">
          <input type="hidden" name="id" value={level.id} />
          <Input name="name" defaultValue={level.name} required />
          <Input name="slug" defaultValue={level.slug} required />
          <Input name="description" defaultValue={level.description ?? ""} />
          <Input name="sortOrder" type="number" defaultValue={level.sort_order} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" value="true" defaultChecked={level.is_active} />
            Hoạt động
          </label>
          <Button type="submit" size="sm" disabled={isPending}>Lưu</Button>
        </form>
      </EditCard>
    );
  }

  if (selection.type === "skill") {
    const skill = content.skills.find((s) => s.id === selection.id);
    if (!skill) return null;
    return (
      <EditCard title="Kỹ năng" onDelete={() => run(() => deleteSkill(skill.id), "Đã xóa")} isPending={isPending}>
        <form action={(fd) => run(() => updateSkill(fd), "Đã cập nhật")} className="space-y-3">
          <input type="hidden" name="id" value={skill.id} />
          <Input name="name" defaultValue={skill.name} required />
          <Input name="slug" defaultValue={skill.slug} required />
          <Input name="description" defaultValue={skill.description ?? ""} />
          <Input name="icon" defaultValue={skill.icon ?? ""} placeholder="Icon" />
          <Input name="sortOrder" type="number" defaultValue={skill.sort_order} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" value="true" defaultChecked={skill.is_active} />
            Hoạt động
          </label>
          <Button type="submit" size="sm" disabled={isPending}>Lưu</Button>
        </form>
      </EditCard>
    );
  }

  if (selection.type === "unit") {
    const unit = content.units.find((u) => u.id === selection.id);
    if (!unit) return null;
    const siblingUnits = content.units.filter((u) => u.skill_id === unit.skill_id && u.id !== unit.id);
    return (
      <EditCard title="Unit" onDelete={() => run(() => deleteUnit(unit.id), "Đã xóa")} isPending={isPending}>
        <form action={(fd) => run(() => updateUnit(fd), "Đã cập nhật")} className="space-y-3">
          <input type="hidden" name="id" value={unit.id} />
          <Input name="title" defaultValue={unit.title} required />
          <Input name="slug" defaultValue={unit.slug} required />
          <Input name="description" defaultValue={unit.description ?? ""} />
          <Input name="sortOrder" type="number" defaultValue={unit.sort_order} />
          <div>
            <Label>Mở khóa sau unit</Label>
            <select name="unlockAfterUnitId" defaultValue={unit.unlock_after_unit_id ?? ""} className="w-full h-10 rounded-lg border px-3 text-sm mt-1">
              <option value="">Không</option>
              {siblingUnits.map((u) => (
                <option key={u.id} value={u.id}>{u.title}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" value="true" defaultChecked={unit.is_active} />
            Hoạt động
          </label>
          <Button type="submit" size="sm" disabled={isPending}>Lưu</Button>
        </form>
      </EditCard>
    );
  }

  if (selection.type === "lesson") {
    const lesson = content.lessons.find((l) => l.id === selection.id);
    if (!lesson) return null;
    const siblingLessons = content.lessons.filter((l) => l.unit_id === lesson.unit_id && l.id !== lesson.id);
    return (
      <EditCard title="Bài học" onDelete={() => run(() => deleteLesson(lesson.id), "Đã xóa")} isPending={isPending}>
        <form action={(fd) => run(() => updateLesson(fd), "Đã cập nhật")} className="space-y-3">
          <input type="hidden" name="id" value={lesson.id} />
          <Input name="title" defaultValue={lesson.title} required />
          <Input name="slug" defaultValue={lesson.slug} required />
          <Input name="description" defaultValue={lesson.description ?? ""} />
          <Input name="estimatedMinutes" type="number" defaultValue={lesson.estimated_minutes} />
          <Input name="sortOrder" type="number" defaultValue={lesson.sort_order} />
          <div>
            <Label>Mở khóa sau bài học</Label>
            <select name="unlockAfterLessonId" defaultValue={lesson.unlock_after_lesson_id ?? ""} className="w-full h-10 rounded-lg border px-3 text-sm mt-1">
              <option value="">Không</option>
              {siblingLessons.map((l) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" value="true" defaultChecked={lesson.is_active} />
            Hoạt động
          </label>
          <Button type="submit" size="sm" disabled={isPending}>Lưu</Button>
        </form>
      </EditCard>
    );
  }

  if (selection.type === "exercise") {
    const exercise = content.exercises.find((e) => e.id === selection.id);
    if (!exercise) return null;
    const questions = content.questions
      .filter((q) => q.exercise_id === exercise.id)
      .sort((a, b) => a.sort_order - b.sort_order);
    const isQuestionBank = isQuestionBankExercise(exercise.metadata);

    return (
      <div className="space-y-4">
        <EditCard
          title={`Bài tập — ${exercise.title}`}
          badge={
            <>
              <StatusBadge status={exercise.status} />
              {isQuestionBank && (
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                  Ngân hàng câu hỏi
                </span>
              )}
            </>
          }
          onDelete={() => run(() => deleteExercise(exercise.id), "Đã xóa")}
          isPending={isPending}
        >
          <form action={(fd) => run(() => updateExercise(fd), "Đã cập nhật")} className="space-y-3">
            <input type="hidden" name="id" value={exercise.id} />
            <Input name="title" defaultValue={exercise.title} required />
            <Input name="slug" defaultValue={exercise.slug} required />
            <Input name="instructions" defaultValue={exercise.instructions ?? ""} />
            <ExerciseTypeSelect defaultValue={exercise.exercise_type} />
            <Input name="maxScore" type="number" defaultValue={exercise.max_score} />
            <Input name="sortOrder" type="number" defaultValue={exercise.sort_order} />
            <Input name="timeLimitSeconds" type="number" defaultValue={exercise.time_limit_seconds ?? ""} placeholder="Giới hạn thời gian (giây)" />
            <textarea
              name="content"
              defaultValue={JSON.stringify(exercise.content ?? {}, null, 2)}
              className="w-full min-h-[80px] rounded-lg border px-3 py-2 text-sm font-mono"
              placeholder='JSON content (writing/speaking prompts)'
            />
            <Button type="submit" size="sm" disabled={isPending}>Lưu</Button>
          </form>

          <WorkflowActions
            status={exercise.status}
            isPending={isPending}
            onStatus={(s) => run(() => updateExerciseStatus(exercise.id, s), "Đã cập nhật trạng thái")}
            onSubmitReview={() => run(() => submitExerciseForReview(exercise.id), "Đã gửi duyệt")}
          />
        </EditCard>

        <QuestionAuthoring
          exerciseId={exercise.id}
          defaultType={exercise.exercise_type === "gap_fill" ? "gap_fill" : exercise.exercise_type === "matching" ? "matching" : exercise.exercise_type === "sentence_ordering" ? "sentence_ordering" : "multiple_choice"}
          isPending={isPending}
          onSave={(fd) => run(() => saveQuestion(fd), "Đã lưu câu hỏi")}
        />

        {questions.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Câu hỏi ({questions.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {questions.map((q, index) => (
                <div key={q.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-medium">{q.question_text}</p>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending || index === 0}
                        onClick={() => run(() => reorderQuestion(q.id, "up"), "Đã sắp xếp")}
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending || index === questions.length - 1}
                        onClick={() => run(() => reorderQuestion(q.id, "down"), "Đã sắp xếp")}
                      >
                        ↓
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => run(() => deleteQuestion(q.id), "Đã xóa câu hỏi")}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{q.question_type} • {q.points} điểm</p>
                  <QuestionAuthoring
                    exerciseId={exercise.id}
                    isPending={isPending}
                    initial={{
                      id: q.id,
                      questionText: q.question_text,
                      questionType: q.question_type,
                      explanation: q.explanation,
                      points: q.points,
                      mediaUrl: q.media_url,
                      content: q.content,
                      choices: q.choices?.map((c) => ({ text: c.text, isCorrect: c.is_correct })),
                      pairs: q.pairs?.map((p) => ({ leftText: p.left_text, rightText: p.right_text })),
                    }}
                    onSave={(fd) => run(() => saveQuestion(fd), "Đã cập nhật câu hỏi")}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
}

function EditCard({
  title,
  children,
  onDelete,
  isPending,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  onDelete: () => void;
  isPending: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          {title}
          {badge}
        </CardTitle>
        <Button size="sm" variant="outline" disabled={isPending} onClick={onDelete}>
          Xóa
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function WorkflowActions({
  status,
  isPending,
  onStatus,
  onSubmitReview,
}: {
  status: ContentStatus;
  isPending: boolean;
  onStatus: (s: ContentStatus) => void;
  onSubmitReview: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
      {status === "draft" && (
        <Button size="sm" variant="outline" disabled={isPending} onClick={onSubmitReview}>
          Gửi duyệt
        </Button>
      )}
      {status === "pending_review" && (
        <>
          <Button size="sm" disabled={isPending} onClick={() => onStatus("published")}>
            Duyệt & xuất bản
          </Button>
          <Button size="sm" variant="outline" disabled={isPending} onClick={() => onStatus("draft")}>
            Trả về nháp
          </Button>
        </>
      )}
      {status === "published" && (
        <Button size="sm" variant="outline" disabled={isPending} onClick={() => onStatus("archived")}>
          Lưu trữ
        </Button>
      )}
      {status === "archived" && (
        <Button size="sm" variant="outline" disabled={isPending} onClick={() => onStatus("draft")}>
          Khôi phục nháp
        </Button>
      )}
    </div>
  );
}
