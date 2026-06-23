"use client";

import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/camba/section-header";
import { LearningReviewCard } from "@/components/learning/learning-review-card";
import type { ReviewLessonItem, ReviewReasonKey } from "@/lib/learning/path-ui-utils";
import { RefreshCw } from "lucide-react";

interface LearningReviewSectionLabels {
  title: string;
  subtitle: string;
  stateNeedsReview: string;
  ctaReview: string;
  minutes: string;
  reasons: Record<ReviewReasonKey, string>;
}

interface LearningReviewSectionProps {
  items: ReviewLessonItem[];
  masteryLabels: Record<number, string>;
  weakSkillLabel?: string | null;
  labels: LearningReviewSectionLabels;
}

export function LearningReviewSection({
  items,
  masteryLabels,
  weakSkillLabel,
  labels,
}: LearningReviewSectionProps) {
  const t = useTranslations("learning");

  if (items.length === 0) return null;

  const subtitle = weakSkillLabel
    ? t("reviewWeakSkillHint", { skill: weakSkillLabel })
    : labels.subtitle;

  return (
    <section aria-labelledby="review-section-heading">
      <SectionHeader
        titleId="review-section-heading"
        title={labels.title}
        description={subtitle}
        icon={RefreshCw}
      />
      <div className="space-y-2">
        {items.map((item) => (
          <LearningReviewCard
            key={item.lesson.id}
            lesson={item.lesson}
            reason={labels.reasons[item.reasonKey]}
            skillName={item.skillName}
            unitTitle={item.unitTitle}
            masteryLabel={masteryLabels[item.lesson.progress?.mastery_level ?? 0] ?? masteryLabels[0]}
            minutesLabel={labels.minutes}
            stateLabel={labels.stateNeedsReview}
            ctaLabel={labels.ctaReview}
          />
        ))}
      </div>
    </section>
  );
}
