"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { generatePracticePrompt } from "@/actions/ai-practice";
import {
  LEVELS_BY_LANGUAGE,
  PRACTICE_LANGUAGES,
  PRACTICE_PROGRAMS,
} from "@/lib/ai-practice/practice-config";
import type { PracticeLanguage, PracticeProfile, PracticeSkill } from "@/lib/ai-practice/practice-types";
import { createPracticeSession, writePracticeSession } from "@/lib/ai-practice/practice-session-storage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export interface PracticeSetupLabels {
  title: string;
  subtitle: string;
  language: string;
  level: string;
  program: string;
  start: string;
  starting: string;
  levelRequired: string;
  languages: Record<string, string>;
  programs: Record<string, string>;
}

interface PracticeSetupFormProps {
  skill: PracticeSkill;
  labels: PracticeSetupLabels;
  sessionPath: string;
}

export function PracticeSetupForm({ skill, labels, sessionPath }: PracticeSetupFormProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<PracticeLanguage>("en");
  const [level, setLevel] = useState(() => LEVELS_BY_LANGUAGE.en[0]?.id ?? "");
  const [program, setProgram] = useState<PracticeProfile["program"]>("general");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const levels = useMemo(() => LEVELS_BY_LANGUAGE[language], [language]);

  function handleLanguageChange(next: PracticeLanguage) {
    setLanguage(next);
    setLevel(LEVELS_BY_LANGUAGE[next][0]?.id ?? "");
  }

  function handleSubmit() {
    setError(null);
    const resolvedLevel = level || levels[0]?.id;
    if (!resolvedLevel) {
      setError(labels.levelRequired);
      return;
    }

    const profile: PracticeProfile = { language, level: resolvedLevel, program, skill };

    startTransition(async () => {
      const result = await generatePracticePrompt(profile, []);
      if (!result.success || !result.data) {
        const message = result.error ?? "Không tạo được đề bài. Vui lòng thử lại.";
        setError(message);
        toast.error(message);
        return;
      }

      writePracticeSession(createPracticeSession(profile, result.data));
      router.push(sessionPath);
    });
  }

  return (
    <CambaCard variant="elevated" padding="lg" className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="camba-h2 text-foreground">{labels.title}</h1>
        <p className="camba-body text-muted mt-2">{labels.subtitle}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="practice-language">{labels.language}</Label>
        <select
          id="practice-language"
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm camba-focus-ring"
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as PracticeLanguage)}
        >
          {PRACTICE_LANGUAGES.map((option) => (
            <option key={option.id} value={option.id}>
              {labels.languages[option.labelKey] ?? option.nativeName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="practice-level">{labels.level}</Label>
        <select
          id="practice-level"
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm camba-focus-ring"
          value={level || levels[0]?.id}
          onChange={(e) => setLevel(e.target.value)}
        >
          {levels.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="practice-program">{labels.program}</Label>
        <select
          id="practice-program"
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm camba-focus-ring"
          value={program}
          onChange={(e) => setProgram(e.target.value as PracticeProfile["program"])}
        >
          {PRACTICE_PROGRAMS.map((option) => (
            <option key={option.id} value={option.id}>
              {labels.programs[option.labelKey] ?? option.id}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-error bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {isPending ? labels.starting : labels.start}
      </Button>
    </CambaCard>
  );
}
