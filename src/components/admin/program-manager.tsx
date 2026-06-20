"use client";

import { useState, useTransition } from "react";
import { createProgram, createLevel } from "@/actions/admin/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Plus } from "lucide-react";

interface ProgramManagerProps {
  programs: { id: string; name: string; slug: string; is_active: boolean }[];
  levels: { id: string; program_id: string; name: string; slug: string }[];
}

export function ProgramManager({ programs, levels }: ProgramManagerProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState(programs[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  function handleCreateProgram(formData: FormData) {
    startTransition(async () => {
      const result = await createProgram(formData);
      showMessage(result.success ? "Đã tạo chương trình" : result.error ?? "Lỗi");
    });
  }

  function handleCreateLevel(formData: FormData) {
    formData.set("programId", selectedProgram);
    startTransition(async () => {
      const result = await createLevel(formData);
      showMessage(result.success ? "Đã tạo cấp độ" : result.error ?? "Lỗi");
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm">{message}</div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tạo chương trình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleCreateProgram} className="space-y-3">
              <Input name="name" placeholder="Tên (VD: IELTS)" required />
              <Input name="slug" placeholder="Slug (VD: ielts)" required />
              <Input name="description" placeholder="Mô tả" />
              <Button type="submit" size="sm" disabled={isPending}>Tạo</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Tạo cấp độ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleCreateLevel} className="space-y-3">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full h-10 rounded-lg border px-3 text-sm"
                required
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <Input name="name" placeholder="Tên cấp (VD: Band 5)" required />
              <Input name="slug" placeholder="Slug (VD: band-5)" required />
              <Input name="description" placeholder="Mô tả" />
              <Button type="submit" size="sm" disabled={isPending || !selectedProgram}>
                Tạo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chương trình ({programs.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {programs.map((program) => (
            <div key={program.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{program.name}</p>
                  <p className="text-xs text-gray-500">{program.slug}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {program.is_active ? "Hoạt động" : "Ẩn"}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {levels
                  .filter((l) => l.program_id === program.id)
                  .map((level) => (
                    <span
                      key={level.id}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {level.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
