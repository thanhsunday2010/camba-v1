"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ClipboardCheck,
  FileText,
  Globe,
  LayoutDashboard,
  Layers,
  Sparkles,
  Wrench,
} from "lucide-react";
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
import { WorkflowPanel } from "@/components/admin/workflow-panel";
import { PlacementTestEditor } from "@/components/admin/placement-test-editor";
import { MockTestEditor } from "@/components/admin/mock-test-editor";
import { BulkImportExport } from "@/components/admin/bulk-import-export";
import { AiQuestionGenerator } from "@/components/admin/ai-question-generator";
import { QuestionBankEditor } from "@/components/admin/question-bank-editor";
import { ExerciseTypeSelect } from "@/components/admin/exercise-type-select";
import { SiteCopyBrowser } from "@/components/admin/site-copy/site-copy-browser";
import { AdminMessage, useAdminMessage } from "@/components/admin/shared/admin-message";
import {
  SuperAdminSectionTabs,
  SuperAdminSubTabs,
} from "@/components/admin/super-admin/super-admin-section-tabs";
import { SuperAdminOverview } from "@/components/admin/super-admin/super-admin-overview";
import { SuperAdminPlatformPanel } from "@/components/admin/super-admin/super-admin-platform-panel";
import type { AdminContentTree, AdminExercise } from "@/lib/admin/types";
import type { AdminMockTest, AdminPlacementTest } from "@/lib/admin/types";
import type { AbstractIntlMessages } from "next-intl";
import type { SiteTextOverrideRow } from "@/lib/site-copy/overrides";

export type SuperAdminSection =
  | "overview"
  | "content"
  | "workflow"
  | "assessments"
  | "tools"
  | "site"
  | "platform";

const SECTIONS: SuperAdminSection[] = [
  "overview",
  "content",
  "workflow",
  "assessments",
  "tools",
  "site",
  "platform",
];

function parseSection(value: string | null): SuperAdminSection {
  if (value && SECTIONS.includes(value as SuperAdminSection)) {
    return value as SuperAdminSection;
  }
  return "overview";
}

interface SuperAdminDashboardProps {
  content: AdminContentTree;
  pendingExercises: AdminExercise[];
  placementTests: AdminPlacementTest[];
  mockTests: AdminMockTest[];
  siteCopyLocale: string;
  siteCopyBaseMessages: AbstractIntlMessages;
  siteCopyOverrides: SiteTextOverrideRow[];
}

export function SuperAdminDashboard({
  content,
  pendingExercises,
  placementTests,
  mockTests,
  siteCopyLocale,
  siteCopyBaseMessages,
  siteCopyOverrides,
}: SuperAdminDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = parseSection(searchParams.get("section"));
  const panel = searchParams.get("panel") ?? "";

  const [selection, setSelection] = useState<TreeSelection | null>(null);
  const { message, showMessage } = useAdminMessage();
  const [isPending, startTransition] = useTransition();

  const [createProgramId, setCreateProgramId] = useState(content.programs[0]?.id ?? "");
  const programLevels = content.levels.filter((l) => l.program_id === createProgramId);
  const [createLevelId, setCreateLevelId] = useState(programLevels[0]?.id ?? "");
  const filteredSkills = content.skills.filter((s) => s.level_id === createLevelId);

  const contentPanel = panel || "tree";
  const assessmentsPanel = panel || "placement";
  const toolsPanel = panel || "bulk";

  const navigate = useCallback(
    (nextSection: SuperAdminSection, nextPanel?: string) => {
      const params = new URLSearchParams();
      params.set("section", nextSection);
      if (nextPanel) params.set("panel", nextPanel);
      router.push(`/admin?${params.toString()}`);
    },
    [router]
  );

  const sectionTabs = useMemo(
    () => [
      { id: "overview" as const, label: "Tổng quan", icon: LayoutDashboard },
      { id: "content" as const, label: "Nội dung", icon: Layers },
      {
        id: "workflow" as const,
        label: "Duyệt",
        icon: ClipboardCheck,
        badge: pendingExercises.length,
      },
      { id: "assessments" as const, label: "Bài kiểm tra", icon: FileText },
      { id: "tools" as const, label: "Công cụ", icon: Sparkles },
      { id: "site" as const, label: "Trang web", icon: Globe },
      { id: "platform" as const, label: "Nền tảng", icon: Wrench },
    ],
    [pendingExercises.length]
  );

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
    <div className="space-y-5">
      <AdminMessage message={message} />

      <SuperAdminSectionTabs
        tabs={sectionTabs}
        active={section}
        onChange={(id) => navigate(id)}
      />

      {section === "overview" && (
        <SuperAdminOverview
          content={content}
          pendingCount={pendingExercises.length}
          placementTests={placementTests}
          mockTests={mockTests}
          onNavigate={navigate}
        />
      )}

      {section === "content" && (
        <div className="space-y-4">
          <SuperAdminSubTabs
            tabs={[
              { id: "tree", label: "Cây nội dung" },
              { id: "create", label: "Tạo mới" },
              { id: "banks", label: "Ngân hàng câu hỏi" },
            ]}
            active={contentPanel}
            onChange={(id) => navigate("content", id)}
          />

          {contentPanel === "tree" && (
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">Cây nội dung</CardTitle>
                </CardHeader>
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

          {contentPanel === "banks" && (
            <QuestionBankEditor
              content={content}
              onMessage={showMessage}
              onSelectExercise={(exerciseId) => {
                setSelection({ type: "exercise", id: exerciseId });
                navigate("content", "tree");
              }}
            />
          )}

          {contentPanel === "create" && (
            <div className="space-y-6">
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
                    <CardTitle className="text-base">Kỹ năng / Unit</CardTitle>
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bài học / Bài tập</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form
                      action={(fd) => runCreate(createLesson, fd, "Đã tạo bài học")}
                      className="space-y-2"
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
          )}
        </div>
      )}

      {section === "workflow" && (
        <WorkflowPanel pendingExercises={pendingExercises} onMessage={showMessage} />
      )}

      {section === "assessments" && (
        <div className="space-y-4">
          <SuperAdminSubTabs
            tabs={[
              { id: "placement", label: "Placement test" },
              { id: "mock", label: "Mock test" },
            ]}
            active={assessmentsPanel}
            onChange={(id) => navigate("assessments", id)}
          />
          {assessmentsPanel === "placement" && (
            <PlacementTestEditor
              programs={content.programs}
              placementTests={placementTests}
              allQuestions={content.questions}
              onMessage={showMessage}
            />
          )}
          {assessmentsPanel === "mock" && (
            <MockTestEditor
              programs={content.programs}
              levels={content.levels}
              skills={content.skills}
              mockTests={mockTests}
              allQuestions={content.questions}
              onMessage={showMessage}
            />
          )}
        </div>
      )}

      {section === "tools" && (
        <div className="space-y-4">
          <SuperAdminSubTabs
            tabs={[
              { id: "bulk", label: "Import / Export" },
              { id: "ai", label: "Sinh câu hỏi AI" },
            ]}
            active={toolsPanel}
            onChange={(id) => navigate("tools", id)}
          />
          {toolsPanel === "bulk" && (
            <BulkImportExport programs={content.programs} onMessage={showMessage} />
          )}
          {toolsPanel === "ai" && (
            <AiQuestionGenerator
              lessons={content.lessons.map((l) => ({ id: l.id, title: l.title }))}
            />
          )}
        </div>
      )}

      {section === "site" && (
        <SiteCopyBrowser
          locale={siteCopyLocale}
          baseMessages={siteCopyBaseMessages}
          overrides={siteCopyOverrides}
        />
      )}

      {section === "platform" && <SuperAdminPlatformPanel />}
    </div>
  );
}

/** @deprecated Use SuperAdminDashboard */
export const CmsDashboard = SuperAdminDashboard;
