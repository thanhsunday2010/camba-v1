export const CAMBRIDGE_PROGRAM_SLUGS = [
  "starters",
  "movers",
  "flyers",
  "ket",
  "pet",
] as const;

export type CambridgeProgramSlug = (typeof CAMBRIDGE_PROGRAM_SLUGS)[number];

export type UiDensity = "explorer" | "achiever" | "scholar";

export interface CambridgeProgramTheme {
  slug: CambridgeProgramSlug;
  labelVi: string;
  labelEn: string;
  cefr: string;
  density: UiDensity;
  /** Approximate age range for UI density */
  ageRange: string;
}

export const CAMBRIDGE_PROGRAM_THEMES: Record<CambridgeProgramSlug, CambridgeProgramTheme> = {
  starters: {
    slug: "starters",
    labelVi: "Starters",
    labelEn: "Starters",
    cefr: "Pre-A1",
    density: "explorer",
    ageRange: "6–8",
  },
  movers: {
    slug: "movers",
    labelVi: "Movers",
    labelEn: "Movers",
    cefr: "A1",
    density: "explorer",
    ageRange: "7–9",
  },
  flyers: {
    slug: "flyers",
    labelVi: "Flyers",
    labelEn: "Flyers",
    cefr: "A2",
    density: "achiever",
    ageRange: "9–12",
  },
  ket: {
    slug: "ket",
    labelVi: "KET",
    labelEn: "KET",
    cefr: "A2–B1",
    density: "achiever",
    ageRange: "11–14",
  },
  pet: {
    slug: "pet",
    labelVi: "PET",
    labelEn: "PET",
    cefr: "B1",
    density: "scholar",
    ageRange: "13–15",
  },
};

export function normalizeProgramSlug(slug: string | null | undefined): CambridgeProgramSlug | null {
  if (!slug) return null;
  const normalized = slug.toLowerCase();
  return CAMBRIDGE_PROGRAM_SLUGS.includes(normalized as CambridgeProgramSlug)
    ? (normalized as CambridgeProgramSlug)
    : null;
}

export function getProgramTheme(slug: string | null | undefined): CambridgeProgramTheme | null {
  const key = normalizeProgramSlug(slug);
  return key ? CAMBRIDGE_PROGRAM_THEMES[key] : null;
}

export function getUiDensity(slug: string | null | undefined): UiDensity {
  return getProgramTheme(slug)?.density ?? "achiever";
}

/** Shield segment count per Cambridge level (visual metaphor) */
export const SHIELD_SEGMENTS = 5;
