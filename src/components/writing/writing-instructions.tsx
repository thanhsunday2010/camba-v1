"use client";

import type { WritingPrompt, WritingRuntimeTaskType } from "@/lib/writing/writing-types";
import { getWritingTaskLabel } from "@/lib/writing/writing-utils";

type WritingInstructionsProps = {
  taskType: WritingRuntimeTaskType;
  prompt: WritingPrompt;
};

export function WritingInstructions({ taskType, prompt }: WritingInstructionsProps) {
  return (
    <div className="rounded-xl border border-program/15 bg-program/5 p-4 space-y-3">
      <p className="camba-caption font-medium uppercase tracking-wide text-program">
        {getWritingTaskLabel(taskType)}
      </p>
      {prompt.taskDescription && (
        <p className="camba-body font-medium text-foreground">{prompt.taskDescription}</p>
      )}
      {prompt.bulletPoints && prompt.bulletPoints.length > 0 ? (
        <ol className="list-decimal list-inside space-y-1 camba-body text-foreground/90">
          {prompt.bulletPoints.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <p className="camba-body text-foreground/90">{prompt.prompt}</p>
      )}
    </div>
  );
}
