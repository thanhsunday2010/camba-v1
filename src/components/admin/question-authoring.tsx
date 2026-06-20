"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuestionType } from "@/types/database";

interface ChoiceRow {
  text: string;
  isCorrect: boolean;
}

interface PairRow {
  leftText: string;
  rightText: string;
}

interface SentenceItem {
  id: string;
  text: string;
}

interface QuestionAuthoringProps {
  exerciseId: string;
  defaultType?: QuestionType;
  onSave: (formData: FormData) => void;
  isPending: boolean;
  initial?: {
    id?: string;
    questionText?: string;
    questionType?: QuestionType;
    explanation?: string | null;
    points?: number;
    content?: Record<string, unknown>;
    choices?: ChoiceRow[];
    pairs?: PairRow[];
  };
}

export function QuestionAuthoring({
  exerciseId,
  defaultType = "multiple_choice",
  onSave,
  isPending,
  initial,
}: QuestionAuthoringProps) {
  const [questionType, setQuestionType] = useState<QuestionType>(
    initial?.questionType ?? defaultType
  );

  const [choices, setChoices] = useState<ChoiceRow[]>(
    initial?.choices ?? [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]
  );

  const [pairs, setPairs] = useState<PairRow[]>(
    initial?.pairs ?? [{ leftText: "", rightText: "" }]
  );

  const [template, setTemplate] = useState(
    (initial?.content?.template as string) ?? "Tom [0] up at 7. He [1] breakfast."
  );
  const [gapAnswers, setGapAnswers] = useState<string[]>(
    (initial?.content?.correctAnswers as string[]) ?? ["", ""]
  );

  const [sentences, setSentences] = useState<SentenceItem[]>(
    (initial?.content?.items as SentenceItem[]) ?? [
      { id: "s1", text: "" },
      { id: "s2", text: "" },
    ]
  );
  const [correctOrder, setCorrectOrder] = useState<string[]>(
    (initial?.content?.correctOrder as string[]) ??
      (initial?.content?.items as SentenceItem[])?.map((i) => i.id) ??
      ["s1", "s2"]
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("exerciseId", exerciseId);
    fd.set("questionType", questionType);

    if (initial?.id) fd.set("id", initial.id);

    if (
      questionType === "multiple_choice" ||
      questionType === "multi_select" ||
      questionType === "listening" ||
      questionType === "reading_comprehension"
    ) {
      fd.set("choices", JSON.stringify(choices.filter((c) => c.text.trim())));
    }

    if (questionType === "matching") {
      fd.set("pairs", JSON.stringify(pairs.filter((p) => p.leftText && p.rightText)));
    }

    if (questionType === "gap_fill") {
      fd.set(
        "content",
        JSON.stringify({ template, correctAnswers: gapAnswers.filter(Boolean) })
      );
    }

    if (questionType === "sentence_ordering") {
      fd.set(
        "content",
        JSON.stringify({ items: sentences.filter((s) => s.text.trim()), correctOrder })
      );
    }

    onSave(fd);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {initial?.id ? "Sửa câu hỏi" : "Tạo câu hỏi"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Loại câu hỏi</Label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
              className="mt-1 w-full h-10 rounded-lg border px-3 text-sm"
            >
              <option value="multiple_choice">Trắc nghiệm</option>
              <option value="multi_select">Chọn nhiều</option>
              <option value="gap_fill">Điền từ</option>
              <option value="matching">Nối cặp</option>
              <option value="sentence_ordering">Sắp xếp câu</option>
            </select>
          </div>

          <Input
            name="questionText"
            placeholder="Nội dung câu hỏi"
            defaultValue={initial?.questionText ?? ""}
            required
          />
          <Input
            name="explanation"
            placeholder="Giải thích"
            defaultValue={initial?.explanation ?? ""}
          />
          <Input
            name="points"
            type="number"
            placeholder="Điểm"
            defaultValue={initial?.points ?? 1}
            min={1}
          />

          {(questionType === "multiple_choice" ||
            questionType === "multi_select" ||
            questionType === "listening") && (
            <MultipleChoiceEditor choices={choices} onChange={setChoices} />
          )}

          {questionType === "matching" && (
            <MatchingEditor pairs={pairs} onChange={setPairs} />
          )}

          {questionType === "gap_fill" && (
            <GapFillEditor
              template={template}
              answers={gapAnswers}
              onTemplateChange={setTemplate}
              onAnswersChange={setGapAnswers}
            />
          )}

          {questionType === "sentence_ordering" && (
            <SentenceOrderingEditor
              items={sentences}
              correctOrder={correctOrder}
              onItemsChange={setSentences}
              onOrderChange={setCorrectOrder}
            />
          )}

          <Button type="submit" size="sm" disabled={isPending}>
            {initial?.id ? "Cập nhật" : "Tạo câu hỏi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function MultipleChoiceEditor({
  choices,
  onChange,
}: {
  choices: ChoiceRow[];
  onChange: (c: ChoiceRow[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Lựa chọn</Label>
      {choices.map((c, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            value={c.text}
            onChange={(e) => {
              const next = [...choices];
              next[i] = { ...c, text: e.target.value };
              onChange(next);
            }}
            placeholder={`Lựa chọn ${i + 1}`}
          />
          <label className="flex items-center gap-1 text-xs shrink-0">
            <input
              type="checkbox"
              checked={c.isCorrect}
              onChange={(e) => {
                const next = [...choices];
                next[i] = { ...c, isCorrect: e.target.checked };
                onChange(next);
              }}
            />
            Đúng
          </label>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...choices, { text: "", isCorrect: false }])}
      >
        + Thêm lựa chọn
      </Button>
    </div>
  );
}

function MatchingEditor({
  pairs,
  onChange,
}: {
  pairs: PairRow[];
  onChange: (p: PairRow[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Cặp nối (trái → phải)</Label>
      {pairs.map((p, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <Input
            value={p.leftText}
            onChange={(e) => {
              const next = [...pairs];
              next[i] = { ...p, leftText: e.target.value };
              onChange(next);
            }}
            placeholder="Cột trái"
          />
          <Input
            value={p.rightText}
            onChange={(e) => {
              const next = [...pairs];
              next[i] = { ...p, rightText: e.target.value };
              onChange(next);
            }}
            placeholder="Cột phải (đáp án)"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...pairs, { leftText: "", rightText: "" }])}
      >
        + Thêm cặp
      </Button>
    </div>
  );
}

function GapFillEditor({
  template,
  answers,
  onTemplateChange,
  onAnswersChange,
}: {
  template: string;
  answers: string[];
  onTemplateChange: (t: string) => void;
  onAnswersChange: (a: string[]) => void;
}) {
  const gapCount = (template.match(/\[\d+\]/g) ?? []).length;

  return (
    <div className="space-y-2">
      <Label>Mẫu câu (dùng [0], [1], ...)</Label>
      <Input
        value={template}
        onChange={(e) => {
          onTemplateChange(e.target.value);
          const count = (e.target.value.match(/\[\d+\]/g) ?? []).length;
          onAnswersChange(Array.from({ length: count }, (_, i) => answers[i] ?? ""));
        }}
      />
      {Array.from({ length: gapCount }).map((_, i) => (
        <Input
          key={i}
          value={answers[i] ?? ""}
          onChange={(e) => {
            const next = [...answers];
            next[i] = e.target.value;
            onAnswersChange(next);
          }}
          placeholder={`Đáp án [${i}]`}
        />
      ))}
    </div>
  );
}

function SentenceOrderingEditor({
  items,
  correctOrder,
  onItemsChange,
  onOrderChange,
}: {
  items: SentenceItem[];
  correctOrder: string[];
  onItemsChange: (items: SentenceItem[]) => void;
  onOrderChange: (order: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Câu (thứ tự đúng = thứ tự hiển thị bên dưới)</Label>
      {items.map((item, i) => (
        <div key={item.id} className="flex gap-2 items-center">
          <span className="text-xs text-gray-400 w-6">{i + 1}.</span>
          <Input
            value={item.text}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, text: e.target.value };
              onItemsChange(next);
            }}
            placeholder={`Câu ${i + 1}`}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const id = `s${Date.now()}`;
          onItemsChange([...items, { id, text: "" }]);
          onOrderChange([...correctOrder, id]);
        }}
      >
        + Thêm câu
      </Button>
      <p className="text-xs text-gray-500">
        Thứ tự đúng: {correctOrder.join(" → ")}
      </p>
    </div>
  );
}
