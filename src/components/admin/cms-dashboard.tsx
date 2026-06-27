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
import { ContentTree, type TreeSelection } from "./content-tree";
import { EntityEditor } from "./entity-editor";
import { WorkflowPanel } from "./workflow-panel";
import { PlacementTestEditor } from "./placement-test-editor";
import { MockTestEditor } from "./mock-test-editor";
import { BulkImportExport } from "./bulk-import-export";
import { AiQuestionGenerator } from "./ai-question-generator";
import { QuestionBankEditor } from "./question-bank-editor";
import { ExerciseTypeSelect } from "./exercise-type-select";
import { SiteCopyBrowser } from "@/components/admin/site-copy/site-copy-browser";
import { AdminMessage, useAdminMessage } from "./shared/admin-message";
import type { AdminContentTree, AdminExercise } from "@/lib/admin/types";
import type { AdminMockTest, AdminPlacementTest } from "@/lib/admin/types";
import type { AbstractIntlMessages } from "next-intl";
import type { SiteTextOverrideRow } from "@/lib/site-copy/overrides";

type CmsTab =
  | "content"
  | "create"
  | "question-banks"
  | "workflow"
  | "placement"
  | "mock"
  | "bulk"
  | "ai"
  | "site-copy";

interface CmsDashboardProps {
  content: AdminContentTree;
  pendingExercises: AdminExercise[];
  placementTests: AdminPlacementTest[];
  mockTests: AdminMockTest[];
  siteCopyLocale: string;
  siteCopyBaseMessages: AbstractIntlMessages;
  siteCopyOverrides: SiteTextOverrideRow[];
}

const TABS: { id: CmsTab; label: string }[] = [
  { id: "content", label: "Nội dung" },
  { id: "create", label: "Tạo mới" },
  { id: "question-banks", label: "Ngân hàng câu hỏi" },
  { id: "workflow", label: "Duyệt nội dung" },
  { id: "placement", label: "Placement test" },
  { id: "mock", label: "Mock test" },
  { id: "bulk", label: "Import/Export" },
  { id: "ai", label: "AI" },
  { id: "site-copy", label: "Nội dung trang" },
];

export function CmsDashboard({
  content,
  pendingExercises,
  placementTests,
  mockTests,
  siteCopyLocale,
  siteCopyBaseMessages,
  siteCopyOverrides,
}: CmsDashboardProps) {
  const [tab, setTab] = useState<CmsTab>("content");
  const [selection, setSelection] = useState<TreeSelection | null>(null);
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

      <div className="flex flex-wrap gap-1 border-b pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t.label}
            {t.id === "workflow" && pendingExercises.length > 0 && (
              <span className="ml-1 bg-amber-400 text-amber-900 text-xs px-1.5 rounded-full">
                {pendingExercises.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-base">Cây nội dung</CardTitle></CardHeader>
            <CardContent>
              <ContentTree
                content={content}
                selection={selection}
                onSelect={setSelection}
              />
            </CardContent>
          </Card>
          <div className="lg:col-span-2">
            <EntityEditor
              content={content}
              selection={selection}
              onMessage={showMessage}
            />
          </div>
        </div>
      )}

      {tab === "question-banks" && (
        <QuestionBankEditor
          content={content}
          onMessage={showMessage}
          onSelectExercise={(exerciseId) => {
            setSelection({ type: "exercise", id: exerciseId });
            setTab("content");
          }}
        />
      )}

      {tab === "create" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Chương trình</Label>
              <select
                value={createProgramId}
                onChange={(e) => {
                  setCreateProgramId(e.target.value);
                  const levels = content.levels.filter((l) => l.program_id === e.target.value);
                  setCreateLevelId(levels[0]?.id ?? "");
                }}
                className="mt-1 w-full h-10 rounded-lg border px-3 text-sm"
              >
                {content.programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Cấp độ</Label>
              <select
                value={createLevelId}
                onChange={(e) => setCreateLevelId(e.target.value)}
                className="mt-1 w-full h-10 rounded-lg border px-3 text-sm"
              >
                {programLevels.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Chương trình / Cấp</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <form action={(fd) => runCreate(createProgram, fd, "Đã tạo chương trình")} className="space-y-2">
                  <Input name="name" placeholder="Tên chương trình" required />
                  <Input name="slug" placeholder="Slug" required />
                  <Input name="description" placeholder="Mô tả" />
                  <Button type="submit" size="sm" disabled={isPending}>Tạo chương trình</Button>
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
                  <Button type="submit" size="sm" disabled={isPending || !createProgramId}>Tạo cấp độ</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Kỹ năng / Unit</CardTitle></CardHeader>
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
                  <Button type="submit" size="sm" disabled={isPending}>Tạo kỹ năng</Button>
                </form>
                <form action={(fd) => runCreate(createUnit, fd, "Đã tạo unit")} className="space-y-2 border-t pt-4">
                  <select name="skillId" required className="w-full h-10 rounded-lg border px-3 text-sm">
                    <option value="">Chọn kỹ năng</option>
                    {filteredSkills.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <Input name="title" placeholder="Tên unit" required />
                  <Input name="slug" placeholder="Slug" required />
                  <Button type="submit" size="sm" disabled={isPending}>Tạo unit</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Bài học / Bài tập</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <form action={(fd) => runCreate(createLesson, fd, "Đã tạo bài học")} className="space-y-2">
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
                  <Button type="submit" size="sm" disabled={isPending}>Tạo bài học</Button>
                </form>
                <form action={(fd) => runCreate(createExercise, fd, "Đã tạo bài tập")} className="space-y-2 border-t pt-4">
                  <select name="lessonId" required className="w-full h-10 rounded-lg border px-3 text-sm">
                    <option value="">Chọn bài học</option>
                    {content.lessons.map((l) => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                  <Input name="title" placeholder="Tên bài tập" required />
                  <Input name="slug" placeholder="Slug" required />
                  <ExerciseTypeSelect />
                  <Button type="submit" size="sm" disabled={isPending}>Tạo bài tập</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === "workflow" && (
        <WorkflowPanel pendingExercises={pendingExercises} onMessage={showMessage} />
      )}

      {tab === "placement" && (
        <PlacementTestEditor
          programs={content.programs}
          placementTests={placementTests}
          allQuestions={content.questions}
          onMessage={showMessage}
        />
      )}

      {tab === "mock" && (
        <MockTestEditor
          programs={content.programs}
          levels={content.levels}
          skills={content.skills}
          mockTests={mockTests}
          allQuestions={content.questions}
          onMessage={showMessage}
        />
      )}

      {tab === "bulk" && (
        <BulkImportExport programs={content.programs} onMessage={showMessage} />
      )}

      {tab === "ai" && (
        <AiQuestionGenerator
          lessons={content.lessons.map((l) => ({ id: l.id, title: l.title }))}
        />
      )}

      {tab === "site-copy" && (
        <SiteCopyBrowser
          locale={siteCopyLocale}
          baseMessages={siteCopyBaseMessages}
          overrides={siteCopyOverrides}
        />
      )}

      <CmsStats content={content} placementTests={placementTests} mockTests={mockTests} />
    </div>
  );
}

function CmsStats({
  content,
  placementTests,
  mockTests,
}: {
  content: AdminContentTree;
  placementTests: AdminPlacementTest[];
  mockTests: AdminMockTest[];
}) {
  const published = content.exercises.filter((e) => e.status === "published").length;
  const draft = content.exercises.filter((e) => e.status === "draft").length;
  const pending = content.exercises.filter((e) => e.status === "pending_review").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-4 border-t">
      {[
        { label: "Chương trình", value: content.programs.length },
        { label: "Bài học", value: content.lessons.length },
        { label: "Bài tập", value: content.exercises.length },
        { label: "Câu hỏi", value: content.questions.length },
        { label: "Ngân hàng", value: content.exercises.filter((e) => e.metadata?.is_question_bank === true).length },
        { label: "Placement", value: placementTests.length },
        { label: "Mock test", value: mockTests.length },
      ].map((s) => (
        <div key={s.label} className="bg-white border rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{s.value}</p>
          <p className="text-xs text-gray-500">{s.label}</p>
        </div>
      ))}
      <div className="col-span-2 md:col-span-6 flex flex-wrap gap-3 text-xs text-gray-500">
        <span>Xuất bản: {published}</span>
        <span>Nháp: {draft}</span>
        <span>Chờ duyệt: {pending}</span>
      </div>
    </div>
  );
}
