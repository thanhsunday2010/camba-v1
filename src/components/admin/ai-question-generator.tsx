"use client";

import { useState, useTransition } from "react";
import { generateQuestionsWithAi } from "@/actions/ai/question-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

interface AiQuestionGeneratorProps {
  lessons: { id: string; title: string }[];
}

export function AiQuestionGenerator({ lessons }: AiQuestionGeneratorProps) {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setResult(null);
    formData.set("autoCreate", "true");
    startTransition(async () => {
      const response = await generateQuestionsWithAi(formData);
      if (response.success && response.data) {
        setResult(
          `Đã tạo ${response.data.questions.length} câu hỏi — chủ đề: ${response.data.topic}. Trạng thái: chờ duyệt.`
        );
      } else {
        setError(response.error ?? "Lỗi");
      }
    });
  }

  return (
    <Card className="border-accent/30">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          AI Tạo câu hỏi (Gemini)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-3">
          <select name="lessonId" required className="w-full h-10 rounded-lg border px-3 text-sm">
            <option value="">Chọn bài học</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <Input name="skill" placeholder="Kỹ năng (Reading)" required />
            <Input name="level" placeholder="Cấp độ (Flyers)" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select name="questionType" required className="h-10 rounded-lg border px-3 text-sm">
              <option value="multiple_choice">Trắc nghiệm</option>
              <option value="gap_fill">Điền từ</option>
            </select>
            <Input name="count" type="number" placeholder="Số câu (3)" defaultValue="3" min={1} max={10} />
          </div>
          <Input name="topic" placeholder="Chủ đề (Animals at the zoo)" />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Tạo câu hỏi bằng AI
              </>
            )}
          </Button>
        </form>
        {result && <p className="text-sm text-success mt-3">{result}</p>}
        {error && <p className="text-sm text-error mt-3">{error}</p>}
      </CardContent>
    </Card>
  );
}
