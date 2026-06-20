"use client";

import { useState } from "react";
import type { LessonWithProgress } from "@/types/learning";
import { Link } from "@/i18n/routing";
import { isLessonUnlockedFromProgress } from "@/lib/learning/unlock";
import { cn } from "@/lib/utils";
import { Lock, CheckCircle2, Circle, ChevronRight } from "lucide-react";

interface LearningPathTreeProps {
  skills: {
    id: string;
    name: string;
    icon: string | null;
    units?: {
      id: string;
      title: string;
      lessons?: LessonWithProgress[];
    }[];
  }[];
  masteryLabels: Record<number, string>;
}

const masteryColors: Record<number, string> = {
  0: "text-gray-400",
  1: "text-error",
  2: "text-warning",
  3: "text-primary",
  4: "text-success",
};

export function LearningPathTree({ skills, masteryLabels }: LearningPathTreeProps) {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(
    skills[0]?.id ?? null
  );

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <div key={skill.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() =>
              setExpandedSkill(expandedSkill === skill.id ? null : skill.id)
            }
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">{skill.name}</span>
            <ChevronRight
              className={cn(
                "h-5 w-5 text-gray-400 transition-transform",
                expandedSkill === skill.id && "rotate-90"
              )}
            />
          </button>

          {expandedSkill === skill.id && (
            <div className="border-t border-gray-100 px-5 py-3 space-y-4">
              {skill.units?.map((unit) => (
                <div key={unit.id}>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {unit.title}
                  </h3>
                  <div className="space-y-1">
                    {unit.lessons?.map((lesson) => {
                      const isUnlocked = isLessonUnlockedFromProgress(lesson.progress);
                      const mastery = lesson.progress?.mastery_level ?? 0;
                      const isComplete = (lesson.progress?.completion_percent ?? 0) >= 100;

                      return (
                        <Link
                          key={lesson.id}
                          href={isUnlocked ? `/learning/lesson/${lesson.id}` : "#"}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                            isUnlocked
                              ? "hover:bg-primary/5 cursor-pointer"
                              : "opacity-50 cursor-not-allowed"
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
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {lesson.estimated_minutes} phút
                              {lesson.progress && (
                                <span className={cn("ml-2", masteryColors[mastery])}>
                                  • {masteryLabels[mastery]}
                                </span>
                              )}
                            </p>
                          </div>
                          {isUnlocked && (
                            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
