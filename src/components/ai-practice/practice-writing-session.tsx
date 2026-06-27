"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import {
  generatePracticePrompt,
  submitStandaloneWritingPractice,
  type PracticeWritingResult,
} from "@/actions/ai-practice";
import {
  advancePracticeSession,
  readPracticeSession,
  recordPracticeAttempt,
  resetPracticeForRetry,
  updateWritingStep,
  writePracticeSession,
  setFocusFixHint,
} from "@/lib/ai-practice/practice-session-storage";
import { useCelebrationOptional } from "@/components/camba/celebration/celebration-provider";
import { celebratePracticeSubmit } from "@/lib/gamification/celebrate-client";
import { PracticeFeedbackPanel } from "@/components/ai-practice/practice-feedback-panel";
import {
  PracticeEnhancementCards,
  PracticeSentenceStarters,
} from "@/components/ai-practice/practice-enhancement-cards";
import {
  PracticeHistoryPanel,
  type PracticeHistoryLabels,
} from "@/components/ai-practice/practice-history-panel";
import { PracticeProgressPanel } from "@/components/ai-practice/practice-progress-panel";
import { StudentPageShell } from "@/components/camba";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { Loader2, PenLine, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { PracticeHistorySummary } from "@/lib/ai-practice/practice-history-types";
import type { PracticeProgressViewModel } from "@/lib/ai-practice/practice-enhancement-types";
import { AiWritingWordCounter } from "@/components/ai/ai-writing-word-counter";
import {
  PRACTICE_WRITING_MAX_WORDS,
  PRACTICE_WRITING_MAX_WORDS_ERROR,
  PRACTICE_WRITING_MIN_WORDS,
  PRACTICE_WRITING_MIN_WORDS_ERROR,
  clampWritingToWordLimit,
  countWords,
} from "@/lib/ai/ai-input-limits";
import type { AiUsageStatus } from "@/lib/subscriptions/subscription-types";
import type { AiLimitDialogLabels } from "@/components/subscriptions/ai-limit-dialog";
import { AiUsageBadge } from "@/components/subscriptions/ai-usage-badge";
import { useAiLimitDialog } from "@/components/subscriptions/use-ai-limit-dialog";
import type { PracticeWritingSessionLabels } from "@/lib/ai-practice/practice-session-labels";

interface PracticeWritingSessionProps {
  labels: PracticeWritingSessionLabels;
  historySummary: PracticeHistorySummary;
  historyLabels: PracticeHistoryLabels;
  progress: PracticeProgressViewModel | null;
  aiUsage: AiUsageStatus;
  aiUsageLabels: { label: string; remaining: string };
  limitDialogLabels: AiLimitDialogLabels;
}

export function PracticeWritingSession({
  labels,
  historySummary,
  historyLabels,
  progress,
  aiUsage,
  aiUsageLabels,
  limitDialogLabels,
}: PracticeWritingSessionProps) {
  const router = useRouter();
  const celebration = useCelebrationOptional();
  const { handleActionResult, dialog: limitDialog } = useAiLimitDialog(limitDialogLabels);
  const [session, setSession] = useState(() => readPracticeSession());
  const [outline, setOutline] = useState(() => readPracticeSession()?.outline ?? "");
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<PracticeWritingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContinuing, startContinueTransition] = useTransition();

  useEffect(() => {
    if (!session || session.profile.skill !== "writing") {
      router.replace(labels.setupPath);
    }
  }, [session, router, labels.setupPath]);

  const retryContext = useMemo(() => {
    if (!feedback || !session || session.attempts.length < 2) return null;
    const prev = session.attempts[session.attempts.length - 2];
    const current = session.attempts[session.attempts.length - 1];
    return {
      previousScore: prev.overallScore,
      previousPreview: prev.preview,
      currentScore: current.overallScore,
      currentPreview: current.preview,
      attemptNumber: current.attemptNumber,
    };
  }, [feedback, session]);

  if (!session || session.profile.skill !== "writing") {
    return null;
  }

  const activeSession = session;
  const { currentPrompt, profile, round } = activeSession;
  const writingStep = activeSession.writingStep ?? "outline";

  const minWords = PRACTICE_WRITING_MIN_WORDS;
  const maxWords = PRACTICE_WRITING_MAX_WORDS;
  const wordCount = countWords(content);
  const previousBest = progress?.personalBest ?? historySummary.bestScore;

  function persistSession(next: typeof activeSession) {
    writePracticeSession(next);
    setSession(next);
  }

  function handleOutlineNext() {
    if (!outline.trim()) {
      setError(labels.outlineRequired);
      return;
    }
    setError(null);
    persistSession(updateWritingStep(activeSession, "draft", outline));
  }

  async function handleSubmit() {
    setError(null);
    if (wordCount < minWords) {
      setError(labels.minWordsError.replace("{min}", String(minWords)));
      return;
    }
    if (wordCount > maxWords) {
      setError(PRACTICE_WRITING_MAX_WORDS_ERROR);
      return;
    }

    const attemptNumber = activeSession.attempts.length + 1;
    const previousAttemptScore =
      activeSession.attempts[activeSession.attempts.length - 1]?.overallScore ?? null;

    setIsSubmitting(true);
    try {
      const result = await submitStandaloneWritingPractice(
        profile,
        currentPrompt.prompt,
        content,
        {
          outline: activeSession.outline,
          attemptNumber,
          focusFixHint: activeSession.focusFixHint,
          previousBest,
          previousAttemptScore,
        }
      );
      if (result.success && result.data) {
        setFeedback(result.data);
        const withAttempt = recordPracticeAttempt(activeSession, {
          attemptNumber,
          overallScore: result.data.overallScore,
          preview: content.slice(0, 200),
          submittedAt: new Date().toISOString(),
          grammarScore: result.data.grammarScore,
          vocabularyScore: result.data.vocabularyScore,
        });
        persistSession(setFocusFixHint(withAttempt, result.data.focusFix));
        router.refresh();
        celebratePracticeSubmit(celebration, {
          overallScore: result.data.overallScore,
          xpAwarded: result.data.meta.xpAwarded,
        });
      } else if (handleActionResult(result)) {
        setError(result.error ?? null);
      } else {
        const message = result.error ?? "Không gửi được bài.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRetry() {
    persistSession(resetPracticeForRetry(activeSession));
    setContent("");
    setFeedback(null);
    setError(null);
  }

  function handleContinue() {
    startContinueTransition(async () => {
      const result = await generatePracticePrompt(activeSession.profile, activeSession.previousPrompts);
      if (!result.success || !result.data) {
        if (handleActionResult(result)) return;
        toast.error(result.error ?? "Không tạo được đề tiếp theo.");
        return;
      }
      const next = advancePracticeSession(activeSession, result.data);
      writePracticeSession(next);
      setSession(next);
      setOutline("");
      setContent("");
      setFeedback(null);
      setError(null);
    });
  }

  return (
    <StudentPageShell narrow>
      {limitDialog}
      <div className="camba-section-stack gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="camba-caption text-muted">{labels.round.replace("{n}", String(round))}</p>
            {profile.mode !== "standard" && (
              <span className="camba-caption rounded-full bg-program/10 text-program px-2 py-0.5 font-medium">
                {profile.mode === "micro" ? labels.modeMicro : labels.modeRoleplay}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AiUsageBadge aiUsage={aiUsage} labels={aiUsageLabels} />
            <Button variant="ghost" size="sm" onClick={() => router.push(labels.setupPath)}>
              <RotateCcw className="h-4 w-4" />
              {labels.changeSetup}
            </Button>
          </div>
        </div>

        <CambaCard variant="lesson" padding="md" className="space-y-4">
          {currentPrompt.rolePlayPersona && (
            <p className="camba-caption font-semibold text-program">{currentPrompt.rolePlayPersona}</p>
          )}
          <div>
            <p className="camba-caption font-semibold text-program uppercase tracking-wide">{labels.analysis}</p>
            <p className="camba-body text-muted mt-1">{currentPrompt.analysisSummary}</p>
          </div>
          <div>
            <p className="camba-caption font-semibold text-foreground">{labels.prompt}</p>
            <p className="camba-body mt-1 whitespace-pre-wrap">{currentPrompt.prompt}</p>
          </div>
          <p className="text-sm text-gray-600">{currentPrompt.instructions}</p>
          <PracticeSentenceStarters
            starters={currentPrompt.sentenceStarters ?? []}
            label={labels.sentenceStarters}
          />
        </CambaCard>

        {!feedback ? (
          writingStep === "outline" ? (
            <CambaCard variant="elevated" padding="md" className="space-y-4">
              <h3 className="camba-h3">{labels.outlineStep}</h3>
              <p className="camba-caption text-muted">{labels.outlineHint}</p>
              <textarea
                className="w-full min-h-[120px] rounded-xl border border-border p-4 text-sm camba-focus-ring resize-y"
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder={labels.outlinePlaceholder}
              />
              {error && <p className="text-sm text-error">{error}</p>}
              <Button className="w-full" onClick={handleOutlineNext}>
                {labels.outlineNext}
              </Button>
            </CambaCard>
          ) : (
            <CambaCard variant="elevated" padding="md" className="space-y-4">
              <label htmlFor="writing-content" className="camba-h3 flex items-center gap-2">
                <PenLine className="h-4 w-4 text-primary" />
                {labels.yourWriting}
              </label>
              {activeSession.outline && (
                <div className="rounded-lg bg-[var(--surface-sunken)] p-3 camba-caption text-muted whitespace-pre-wrap">
                  <span className="font-medium text-foreground">{labels.outlineStep}: </span>
                  {activeSession.outline}
                </div>
              )}
              <textarea
                id="writing-content"
                className="w-full min-h-[200px] rounded-xl border border-border p-4 text-sm camba-focus-ring resize-y"
                value={content}
                onChange={(e) => setContent(clampWritingToWordLimit(e.target.value, maxWords))}
              />
              <AiWritingWordCounter text={content} maxWords={maxWords} minWords={minWords} />
              {error && <p className="text-sm text-error">{error}</p>}
              <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? labels.submitting : labels.submit}
              </Button>
            </CambaCard>
          )
        ) : (
          <div className="space-y-4">
            <PracticeEnhancementCards
              meta={feedback.meta}
              focusFix={feedback.focusFix}
              bestPhrase={feedback.bestPhrase}
              retryContext={retryContext}
              labels={labels.enhancement}
              onRetry={handleRetry}
            />
            <PracticeFeedbackPanel
              type="writing"
              feedback={feedback}
              labels={{ ...labels.feedback, bestPhrase: labels.feedback.bestPhrase, focusFix: labels.feedback.focusFix }}
              actions={
                <div className="flex flex-col gap-2">
                  <Button className="w-full" onClick={handleContinue} disabled={isContinuing}>
                    {isContinuing && <Loader2 className="animate-spin" />}
                    {isContinuing ? labels.continuing : labels.continue}
                  </Button>
                </div>
              }
            />
          </div>
        )}

        {progress && <PracticeProgressPanel progress={progress} labels={labels.progress} />}

        <PracticeHistoryPanel skill="writing" summary={historySummary} labels={historyLabels} />
      </div>
    </StudentPageShell>
  );
}
