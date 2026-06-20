"use client";

import { useMemo, useState, useTransition } from "react";
import { createQuestionBank } from "@/actions/admin/content";
import { deleteQuestion, reorderQuestion, saveQuestion } from "@/actions/admin/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseTypeSelect } from "./exercise-type-select";
import { QuestionAuthoring } from "./question-authoring";
import { isQuestionBankExercise } from "@/lib/admin/constants";
import type { AdminContentTree } from "@/lib/admin/types";

interface QuestionBankEditorProps {
  content: AdminContentTree;
  onMessage: (msg: string) => void;
  onSelectExercise?: (exerciseId: string) => void;
}

export function QuestionBankEditor({
  content,
  onMessage,
  onSelectExercise,
}: QuestionBankEditorProps) {
  const [search, setSearch] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [createProgramId, setCreateProgramId] = useState(content.programs[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  const questionBanks = useMemo(
    () =>
      content.exercises.filter((e) =>
        isQuestionBankExercise(e.metadata as Record<string, unknown>)
      ),
    [content.exercises]
  );

  const selectedBank = questionBanks.find((b) => b.id === selectedBankId) ?? questionBanks[0];
  const bankQuestions = useMemo(() => {
    if (!selectedBank) return [];
    return content.questions
      .filter((q) => q.exercise_id === selectedBank.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [content.questions, selectedBank]);

  const filteredBanks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return questionBanks;
    return questionBanks.filter((bank) => {
      const questions = content.questions.filter((item) => item.exercise_id === bank.id);
      return (
        bank.title.toLowerCase().includes(q) ||
        bank.slug.toLowerCase().includes(q) ||
        questions.some((item) => item.question_text.toLowerCase().includes(q))
      );
    });
  }, [questionBanks, content.questions, search]);

  function run(action: () => Promise<{ success: boolean; error?: string }>, ok: string) {
    startTransition(async () => {
      const result = await action();
      onMessage(result.success ? ok : result.error ?? "Lỗi");
    });
  }

  function resolveLessonPath(lessonId: string) {
    const lesson = content.lessons.find((l) => l.id === lessonId);
    if (!lesson) return "—";
    const unit = content.units.find((u) => u.id === lesson.unit_id);
    const skill = unit ? content.skills.find((s) => s.id === unit.skill_id) : undefined;
    const level = skill ? content.levels.find((l) => l.id === skill.level_id) : undefined;
    const program = level ? content.programs.find((p) => p.id === level.program_id) : undefined;
    return [program?.name, level?.name, skill?.name, unit?.title, lesson.title]
      .filter(Boolean)
      .join(" › ");
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tạo ngân hàng câu hỏi</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={(fd) => {
                fd.set("programId", createProgramId);
                run(() => createQuestionBank(fd), "Đã tạo ngân hàng câu hỏi");
              }}
              className="space-y-3"
            >
              <div>
                <Label>Chương trình</Label>
                <select
                  value={createProgramId}
                  onChange={(e) => setCreateProgramId(e.target.value)}
                  className="mt-1 w-full h-10 rounded-lg border px-3 text-sm"
                >
                  {content.programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input name="title" placeholder="Tên ngân hàng (vd: Starters Reading Q1)" required />
              <Input name="slug" placeholder="Slug (vd: starters-reading-q1)" required />
              <ExerciseTypeSelect defaultValue="multiple_choice" />
              <Input name="instructions" placeholder="Hướng dẫn (tùy chọn)" />
              <Button type="submit" size="sm" disabled={isPending || !createProgramId}>
                Tạo ngân hàng
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              Hệ thống tự tạo nhánh nội dung nội bộ (Internal › Question Banks) trong chương trình đã chọn.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Danh sách ({filteredBanks.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc nội dung câu hỏi..."
            />
            <div className="max-h-[360px] overflow-y-auto space-y-1">
              {filteredBanks.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">Chưa có ngân hàng câu hỏi</p>
              )}
              {filteredBanks.map((bank) => {
                const count = content.questions.filter((q) => q.exercise_id === bank.id).length;
                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setSelectedBankId(bank.id)}
                    className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors ${
                      selectedBank?.id === bank.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-medium truncate">{bank.title}</p>
                    <p className="text-xs text-gray-500">
                      {count} câu • {bank.exercise_type}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {!selectedBank ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500 text-sm">
              Tạo hoặc chọn một ngân hàng câu hỏi để quản lý câu hỏi
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{selectedBank.title}</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">{resolveLessonPath(selectedBank.lesson_id)}</p>
                </div>
                {onSelectExercise && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectExercise(selectedBank.id)}
                  >
                    Mở trong cây nội dung
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {bankQuestions.length} câu hỏi • Slug: <code>{selectedBank.slug}</code>
                </p>
              </CardContent>
            </Card>

            <QuestionAuthoring
              exerciseId={selectedBank.id}
              defaultType={
                selectedBank.exercise_type === "gap_fill"
                  ? "gap_fill"
                  : selectedBank.exercise_type === "matching"
                    ? "matching"
                    : selectedBank.exercise_type === "sentence_ordering"
                      ? "sentence_ordering"
                      : "multiple_choice"
              }
              isPending={isPending}
              onSave={(fd) => run(() => saveQuestion(fd), "Đã lưu câu hỏi")}
            />

            {bankQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Câu hỏi trong ngân hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bankQuestions.map((q, index) => (
                    <div key={q.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-sm font-medium">{q.question_text}</p>
                          <p className="text-xs text-gray-500">
                            #{index + 1} • {q.question_type} • {q.points} điểm
                          </p>
                        </div>
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
                            disabled={isPending || index === bankQuestions.length - 1}
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
                      <QuestionAuthoring
                        exerciseId={selectedBank.id}
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
          </>
        )}
      </div>
    </div>
  );
}
