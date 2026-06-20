"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { LessonWithProgress, Skill } from "@/types/learning";
import { pivotSkillsToCurriculumUnits } from "@/lib/learning/pivot-units";
import { isLessonUnlockedFromProgress } from "@/lib/learning/unlock";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Lock,
  Sparkles,
} from "lucide-react";

interface LearningUnitPathProps {
  levelName: string;
  levelSlug: string;
  programName: string;
  skills: Skill[];
  masteryLabels: Record<number, string>;
}

const masteryColors: Record<number, string> = {
  0: "text-gray-400",
  1: "text-error",
  2: "text-warning",
  3: "text-primary",
  4: "text-success",
};

function LessonRow({
  lesson,
  masteryLabels,
}: {
  lesson: LessonWithProgress;
  masteryLabels: Record<number, string>;
}) {
  const t = useTranslations("learning");
  const isUnlocked = isLessonUnlockedFromProgress(lesson.progress);
  const mastery = lesson.progress?.mastery_level ?? 0;
  const isComplete = (lesson.progress?.completion_percent ?? 0) >= 100;

  return (
    <Link
      href={isUnlocked ? `/learning/lesson/${lesson.id}` : "#"}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        isUnlocked ? "hover:bg-primary/5 cursor-pointer" : "opacity-50 cursor-not-allowed"
      )}
      onClick={(e) => !isUnlocked && e.preventDefault()}
    >
      {!isUnlocked ? (
        <Lock className="h-4 w-4 text-gray-400 shrink-0" />
      ) : isComplete ? (
        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-gray-300 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
        <p className="text-xs text-gray-500">
          {lesson.estimated_minutes} {t("minutes")}
          {lesson.progress && (
            <span className={cn("ml-2", masteryColors[mastery])}>
              • {masteryLabels[mastery]}
            </span>
          )}
        </p>
      </div>
      {isUnlocked && <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />}
    </Link>
  );
}

export function LearningUnitPath({
  levelName,
  levelSlug,
  programName,
  skills,
  masteryLabels,
}: LearningUnitPathProps) {
  const t = useTranslations("learning");
  const units = useMemo(() => pivotSkillsToCurriculumUnits(skills), [skills]);

  const firstActiveUnitSlug = units.find((u) => u.hasContent)?.slug ?? units[0]?.slug ?? null;
  const [expandedUnit, setExpandedUnit] = useState<string | null>(firstActiveUnitSlug);

  const unitsWithContent = units.filter((u) => u.hasContent).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {programName}
          </p>
          <p className="text-lg font-bold text-gray-900">{levelName}</p>
          <p className="text-sm text-gray-600">
            {t("unitCount", { count: units.length })}
            {unitsWithContent > 0 && (
              <span className="text-gray-500">
                {" "}
                • {t("unitsWithContent", { count: unitsWithContent })}
              </span>
            )}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
          {levelSlug}
        </span>
      </div>

      <div className="space-y-3">
        {units.map((unit) => {
          const isExpanded = expandedUnit === unit.slug;

          return (
            <div
              key={unit.slug}
              className={cn(
                "rounded-xl border bg-white overflow-hidden",
                unit.hasContent ? "border-gray-200" : "border-dashed border-gray-200"
              )}
            >
              <button
                type="button"
                onClick={() => setExpandedUnit(isExpanded ? null : unit.slug)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                    unit.hasContent
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {unit.unitNumber || "?"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{unit.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {unit.hasContent
                      ? t("unitLessonCount", { count: unit.lessonCount })
                      : t("unitComingSoon")}
                  </p>
                </div>
                {!unit.hasContent && (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                    <Sparkles className="h-3 w-3" />
                    {t("comingSoon")}
                  </span>
                )}
                <ChevronRight
                  className={cn(
                    "h-5 w-5 text-gray-400 transition-transform shrink-0",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-3 space-y-3">
                  {unit.entries.map((entry) => (
                    <div key={entry.skillSlug}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                        {entry.skillName}
                      </h4>
                      {entry.lessons.length > 0 ? (
                        <div className="space-y-1">
                          {entry.lessons.map((lesson) => (
                            <LessonRow
                              key={lesson.id}
                              lesson={lesson}
                              masteryLabels={masteryLabels}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic px-3 py-2">
                          {t("skillNoContent")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
