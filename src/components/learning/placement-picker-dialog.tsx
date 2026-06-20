"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { ClipboardList, X } from "lucide-react";
import type { PlacementTestSummary } from "@/types/learning";

interface PlacementPickerDialogProps {
  tests: PlacementTestSummary[];
  labels: {
    title: string;
    subtitle: string;
    questions: string;
    minutes: string;
    empty: string;
    close: string;
  };
  trigger: React.ReactNode;
}

export function PlacementPickerDialog({ tests, labels, trigger }: PlacementPickerDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
        className="contents"
      >
        {trigger}
      </span>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={labels.close}
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200">
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{labels.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label={labels.close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {tests.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">{labels.empty}</p>
              ) : (
                tests.map((test) => (
                  <button
                    key={test.id}
                    type="button"
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/placement-test/${test.id}`);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">{test.title}</p>
                        {test.description && (
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                            {test.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {test.question_count} {labels.questions}
                          {test.time_limit_minutes
                            ? ` • ${test.time_limit_minutes} ${labels.minutes}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
