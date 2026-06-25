"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import {
  generatePracticePrompt,
  submitStandaloneWritingPractice,
} from "@/actions/ai-practice";
import {
  advancePracticeSession,
  readPracticeSession,
  writePracticeSession,
} from "@/lib/ai-practice/practice-session-storage";
import { useMascotOptional } from "@/components/mascot/mascot-provider";
import { PracticeFeedbackPanel } from "@/components/ai-practice/practice-feedback-panel";
import { StudentPageShell } from "@/components/camba";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { Loader2, PenLine, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { PracticeWritingFeedback } from "@/types/ai";

export interface PracticeWritingSessionLabels {
  setupPath: string;
  round: string;
  analysis: string;
  prompt: string;
  instructions: string;
  yourWriting: string;
  submit: string;
  submitting: string;
  continue: string;
  continuing: string;
  changeSetup: string;
  minWordsError: string;
  feedback: {
    result: string;
    estimatedLevel: string;
    grammar: string;
    vocabulary: string;
    coherence: string;
    improvements: string;
    pronunciation: string;
    fluency: string;
    suggestions: string;
    overallScore: string;
    modelAnswer: string;
    errorHighlights: string;
  };
}

interface PracticeWritingSessionProps {
  labels: PracticeWritingSessionLabels;
}

export function PracticeWritingSession({ labels }: PracticeWritingSessionProps) {
  const router = useRouter();
  const mascot = useMascotOptional();
  const [session, setSession] = useState(() => readPracticeSession());
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<PracticeWritingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContinuing, startContinueTransition] = useTransition();

  useEffect(() => {
    if (!session || session.profile.skill !== "writing") {
      router.replace(labels.setupPath);
    }
  }, [session, router, labels.setupPath]);

  if (!session || session.profile.skill !== "writing") {
    return null;
  }

  const activeSession = session;
  const { currentPrompt, profile, round } = activeSession;
  const minWords = currentPrompt.minWords ?? 40;
  const maxWords = currentPrompt.maxWords ?? 300;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  async function handleSubmit() {
    setError(null);
    if (wordCount < minWords) {
      setError(labels.minWordsError.replace("{min}", String(minWords)));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitStandaloneWritingPractice(profile, currentPrompt.prompt, content);
      if (result.success && result.data) {
        setFeedback(result.data);
        if (result.data.overallScore >= 75) {
          mascot?.cheerHighScore(result.data.overallScore);
        } else {
          mascot?.cheerExerciseComplete();
        }
      } else {
        const message = result.error ?? "Không gửi được bài.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleContinue() {
    startContinueTransition(async () => {
      const result = await generatePracticePrompt(activeSession.profile, activeSession.previousPrompts);
      if (!result.success || !result.data) {
        toast.error(result.error ?? "Không tạo được đề tiếp theo.");
        return;
      }
      const next = advancePracticeSession(activeSession, result.data);
      writePracticeSession(next);
      setSession(next);
      setContent("");
      setFeedback(null);
      setError(null);
    });
  }

  function handleChangeSetup() {
    router.push(labels.setupPath);
  }

  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="camba-caption text-muted">{labels.round.replace("{n}", String(round))}</p>
          <Button variant="ghost" size="sm" onClick={handleChangeSetup}>
            <RotateCcw className="h-4 w-4" />
            {labels.changeSetup}
          </Button>
        </div>

        <CambaCard variant="lesson" padding="md" className="space-y-4">
          <div>
            <p className="camba-caption font-semibold text-program uppercase tracking-wide">
              {labels.analysis}
            </p>
            <p className="camba-body text-muted mt-1">{currentPrompt.analysisSummary}</p>
          </div>
          <div>
            <p className="camba-caption font-semibold text-foreground">{labels.prompt}</p>
            <p className="camba-body mt-1 whitespace-pre-wrap">{currentPrompt.prompt}</p>
          </div>
          <p className="text-sm text-gray-600">{currentPrompt.instructions}</p>
        </CambaCard>

        {!feedback ? (
          <CambaCard variant="elevated" padding="md" className="space-y-4">
            <label htmlFor="writing-content" className="camba-h3 flex items-center gap-2">
              <PenLine className="h-4 w-4 text-primary" />
              {labels.yourWriting}
            </label>
            <textarea
              id="writing-content"
              className="w-full min-h-[200px] rounded-xl border border-border p-4 text-sm camba-focus-ring resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={maxWords * 8}
            />
            <div className="flex justify-between text-xs text-muted">
              <span>
                {wordCount} / {maxWords} từ (tối thiểu {minWords})
              </span>
            </div>
            {error && (
              <p className="text-sm text-error bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isSubmitting ? labels.submitting : labels.submit}
            </Button>
          </CambaCard>
        ) : (
          <PracticeFeedbackPanel
            type="writing"
            feedback={feedback}
            labels={labels.feedback}
            actions={
              <Button className="w-full" onClick={handleContinue} disabled={isContinuing}>
                {isContinuing && <Loader2 className="animate-spin" />}
                {isContinuing ? labels.continuing : labels.continue}
              </Button>
            }
          />
        )}
      </div>
    </StudentPageShell>
  );
}
