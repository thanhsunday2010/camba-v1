export const KNOWN_PROGRAM_SETTING_KEYS = [
  {
    key: "mastery_unlock_threshold",
    label: "Ngưỡng mastery mở khóa",
    type: "number" as const,
    defaultValue: 3,
    description: "Mức mastery cần để mở bài học tiếp theo",
  },
  {
    key: "shield_scale_max",
    label: "Shield tối đa",
    type: "number" as const,
    defaultValue: 15,
    description: "Thang điểm shield tối đa cho chương trình YLE",
  },
  {
    key: "placement_test_questions",
    label: "Số câu placement test",
    type: "number" as const,
    defaultValue: 20,
    description: "Số câu hỏi trong bài placement test",
  },
] as const;
