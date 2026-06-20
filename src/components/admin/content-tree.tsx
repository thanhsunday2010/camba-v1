"use client";

import { ChevronDown, ChevronRight, FileText, FolderOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isQuestionBankExercise } from "@/lib/admin/constants";
import { StatusBadge } from "./shared/status-badge";
import type {
  AdminContentTree,
  AdminEntityType,
} from "@/lib/admin/types";

export interface TreeSelection {
  type: AdminEntityType;
  id: string;
}

interface ContentTreeProps {
  content: AdminContentTree;
  selection: TreeSelection | null;
  onSelect: (selection: TreeSelection) => void;
}

export function ContentTree({ content, selection, onSelect }: ContentTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filterProgram, setFilterProgram] = useState(content.programs[0]?.id ?? "");

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const programLevels = content.levels.filter((l) => l.program_id === filterProgram);

  return (
    <div className="space-y-3">
      <select
        value={filterProgram}
        onChange={(e) => setFilterProgram(e.target.value)}
        className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm"
      >
        {content.programs.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <div className="border rounded-lg max-h-[480px] overflow-y-auto text-sm">
        {content.programs
          .filter((p) => p.id === filterProgram)
          .map((program) => (
            <TreeRow
              key={program.id}
              label={program.name}
              isSelected={selection?.type === "program" && selection.id === program.id}
              onClick={() => onSelect({ type: "program", id: program.id })}
              depth={0}
              isLeaf
            />
          ))}

        {programLevels.map((level) => {
          const levelKey = `level-${level.id}`;
          const levelSkills = content.skills.filter((s) => s.level_id === level.id);

          return (
            <div key={level.id}>
              <TreeRow
                label={level.name}
                isSelected={selection?.type === "level" && selection.id === level.id}
                onClick={() => onSelect({ type: "level", id: level.id })}
                onToggle={() => toggle(levelKey)}
                expanded={expanded.has(levelKey)}
                depth={0}
              />
              {expanded.has(levelKey) &&
                levelSkills.map((skill) => {
                  const skillKey = `skill-${skill.id}`;
                  const skillUnits = content.units.filter((u) => u.skill_id === skill.id);

                  return (
                    <div key={skill.id}>
                      <TreeRow
                        label={skill.name}
                        isSelected={selection?.type === "skill" && selection.id === skill.id}
                        onClick={() => onSelect({ type: "skill", id: skill.id })}
                        onToggle={() => toggle(skillKey)}
                        expanded={expanded.has(skillKey)}
                        depth={1}
                      />
                      {expanded.has(skillKey) &&
                        skillUnits.map((unit) => {
                          const unitKey = `unit-${unit.id}`;
                          const unitLessons = content.lessons.filter(
                            (l) => l.unit_id === unit.id
                          );

                          return (
                            <div key={unit.id}>
                              <TreeRow
                                label={unit.title}
                                isSelected={selection?.type === "unit" && selection.id === unit.id}
                                onClick={() => onSelect({ type: "unit", id: unit.id })}
                                onToggle={() => toggle(unitKey)}
                                expanded={expanded.has(unitKey)}
                                depth={2}
                              />
                              {expanded.has(unitKey) &&
                                unitLessons.map((lesson) => {
                                  const lessonKey = `lesson-${lesson.id}`;
                                  const lessonExercises = content.exercises.filter(
                                    (e) => e.lesson_id === lesson.id
                                  );

                                  return (
                                    <div key={lesson.id}>
                                      <TreeRow
                                        label={lesson.title}
                                        isSelected={
                                          selection?.type === "lesson" &&
                                          selection.id === lesson.id
                                        }
                                        onClick={() =>
                                          onSelect({ type: "lesson", id: lesson.id })
                                        }
                                        onToggle={() => toggle(lessonKey)}
                                        expanded={expanded.has(lessonKey)}
                                        depth={3}
                                      />
                                      {expanded.has(lessonKey) &&
                                        lessonExercises.map((exercise) => (
                                          <TreeRow
                                            key={exercise.id}
                                            label={exercise.title}
                                            badge={
                                              <>
                                                {isQuestionBankExercise(
                                                  exercise.metadata as Record<string, unknown>
                                                ) && (
                                                  <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 rounded">
                                                    QB
                                                  </span>
                                                )}
                                                <StatusBadge status={exercise.status} />
                                              </>
                                            }
                                            isSelected={
                                              selection?.type === "exercise" &&
                                              selection.id === exercise.id
                                            }
                                            onClick={() =>
                                              onSelect({
                                                type: "exercise",
                                                id: exercise.id,
                                              })
                                            }
                                            depth={4}
                                            isLeaf
                                          />
                                        ))}
                                    </div>
                                  );
                                })}
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TreeRow({
  label,
  depth,
  isSelected,
  onClick,
  onToggle,
  expanded,
  isLeaf,
  badge,
}: {
  label: string;
  depth: number;
  isSelected: boolean;
  onClick: () => void;
  onToggle?: () => void;
  expanded?: boolean;
  isLeaf?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 py-1.5 px-2 cursor-pointer hover:bg-gray-50 border-b border-gray-50",
        isSelected && "bg-primary/5 border-l-2 border-l-primary"
      )}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      {!isLeaf ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className="p-0.5 text-gray-400"
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      ) : (
        <FileText className="h-3.5 w-3.5 text-gray-400 ml-0.5" />
      )}
      <button
        type="button"
        onClick={onClick}
        className="flex-1 text-left truncate flex items-center gap-2"
      >
        {!isLeaf && <FolderOpen className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
        <span className="truncate">{label}</span>
        {badge}
      </button>
    </div>
  );
}
