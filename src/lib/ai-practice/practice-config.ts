import type { PracticeLanguage, PracticeProgram } from "@/lib/ai-practice/practice-types";

export interface PracticeLevelOption {
  id: string;
  label: string;
}

export interface PracticeLanguageOption {
  id: PracticeLanguage;
  labelKey: string;
  nativeName: string;
}

export const PRACTICE_LANGUAGES: PracticeLanguageOption[] = [
  { id: "en", labelKey: "english", nativeName: "English" },
  { id: "zh", labelKey: "chinese", nativeName: "中文 (Giản thể)" },
  { id: "fr", labelKey: "french", nativeName: "Français" },
  { id: "ja", labelKey: "japanese", nativeName: "日本語" },
  { id: "ko", labelKey: "korean", nativeName: "한국어" },
  { id: "de", labelKey: "german", nativeName: "Deutsch" },
];

export const PRACTICE_PROGRAMS: { id: PracticeProgram; labelKey: string }[] = [
  { id: "general", labelKey: "general" },
  { id: "ielts", labelKey: "ielts" },
  { id: "toeic", labelKey: "toeic" },
];

export const LEVELS_BY_LANGUAGE: Record<PracticeLanguage, PracticeLevelOption[]> = {
  en: [
    { id: "a1", label: "A1 — Beginner" },
    { id: "a2", label: "A2 — Elementary" },
    { id: "b1", label: "B1 — Intermediate" },
    { id: "b2", label: "B2 — Upper intermediate" },
    { id: "c1", label: "C1 — Advanced" },
  ],
  zh: [
    { id: "hsk1", label: "HSK 1" },
    { id: "hsk2", label: "HSK 2" },
    { id: "hsk3", label: "HSK 3" },
    { id: "hsk4", label: "HSK 4" },
    { id: "hsk5", label: "HSK 5" },
    { id: "hsk6", label: "HSK 6" },
  ],
  fr: [
    { id: "delf-a1", label: "DELF A1" },
    { id: "delf-a2", label: "DELF A2" },
    { id: "delf-b1", label: "DELF B1" },
    { id: "delf-b2", label: "DELF B2" },
    { id: "dalf-c1", label: "DALF C1" },
    { id: "dalf-c2", label: "DALF C2" },
  ],
  ja: [
    { id: "n5", label: "JLPT N5" },
    { id: "n4", label: "JLPT N4" },
    { id: "n3", label: "JLPT N3" },
    { id: "n2", label: "JLPT N2" },
    { id: "n1", label: "JLPT N1" },
  ],
  ko: [
    { id: "topik1-1", label: "TOPIK I — Level 1" },
    { id: "topik1-2", label: "TOPIK I — Level 2" },
    { id: "topik2-3", label: "TOPIK II — Level 3" },
    { id: "topik2-4", label: "TOPIK II — Level 4" },
    { id: "topik2-5", label: "TOPIK II — Level 5" },
    { id: "topik2-6", label: "TOPIK II — Level 6" },
  ],
  de: [
    { id: "goethe-a1", label: "Goethe A1" },
    { id: "goethe-a2", label: "Goethe A2" },
    { id: "goethe-b1", label: "Goethe B1" },
    { id: "goethe-b2", label: "Goethe B2" },
    { id: "goethe-c1", label: "Goethe C1" },
    { id: "goethe-c2", label: "Goethe C2" },
  ],
};

export const SPEECH_LOCALES: Record<PracticeLanguage, string> = {
  en: "en-US",
  zh: "zh-CN",
  fr: "fr-FR",
  ja: "ja-JP",
  ko: "ko-KR",
  de: "de-DE",
};

export function getLanguageLabel(language: PracticeLanguage): string {
  return PRACTICE_LANGUAGES.find((l) => l.id === language)?.nativeName ?? language;
}

export function getLevelLabel(language: PracticeLanguage, levelId: string): string {
  return LEVELS_BY_LANGUAGE[language].find((l) => l.id === levelId)?.label ?? levelId;
}

export function getProgramLabelKey(program: PracticeProgram): string {
  return PRACTICE_PROGRAMS.find((p) => p.id === program)?.labelKey ?? program;
}
