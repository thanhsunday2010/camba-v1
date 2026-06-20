import { EXERCISE_TYPE_OPTIONS } from "@/lib/admin/constants";
import type { ExerciseType } from "@/types/database";

interface ExerciseTypeSelectProps {
  name?: string;
  defaultValue?: ExerciseType;
  value?: ExerciseType;
  onChange?: (value: ExerciseType) => void;
  className?: string;
}

export function ExerciseTypeSelect({
  name = "exerciseType",
  defaultValue,
  value,
  onChange,
  className = "w-full h-10 rounded-lg border px-3 text-sm",
}: ExerciseTypeSelectProps) {
  if (value !== undefined && onChange) {
    return (
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value as ExerciseType)}
        className={className}
      >
        {EXERCISE_TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <select name={name} defaultValue={defaultValue ?? "multiple_choice"} className={className}>
      {EXERCISE_TYPE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
