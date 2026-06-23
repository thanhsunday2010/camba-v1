import type { MockTestSectionSummary } from "@/lib/mock-tests/mock-test-types";
import { YLE_LEVEL_IDS } from "@/lib/mock-blueprints/yle-coverage";
import type { YleLevelSlug } from "@/lib/mock-blueprints/yle-mock-blueprint-types";

/** How listening is delivered in a practice mock. */
export type MockTestListeningMode = "none" | "audio" | "text" | "mixed";

export type MockTestFormatMetadata = {
  levelSlug: YleLevelSlug | null;
  isPracticeMock: true;
  isAutoScoredSubset: true;
  includesSpeaking: false;
  includesWriting: false;
  includedSkillSlugs: string[];
  includedSectionTitles: string[];
  listeningMode: MockTestListeningMode;
  hasAudio: boolean;
  hasTextBasedListening: boolean;
};

export type StoredMockTestFormat = Partial<MockTestFormatMetadata> & {
  listeningMode?: MockTestListeningMode;
};

type MockContextSlice = {
  sectionSkillSlug?: string | null;
  contextType?: string | null;
  audioSrc?: string | null;
};

type DeriveFormatInput = {
  levelId: string | null;
  levelSlug?: string | null;
  settings?: Record<string, unknown> | null;
  sections: MockTestSectionSummary[];
  questionContexts?: MockContextSlice[];
};

const YLE_LEVEL_ID_TO_SLUG = Object.fromEntries(
  (Object.entries(YLE_LEVEL_IDS) as [YleLevelSlug, string][]).map(([slug, id]) => [id, slug])
) as Record<string, YleLevelSlug>;

export function resolveYleLevelSlug(
  levelId: string | null | undefined,
  levelSlug?: string | null
): YleLevelSlug | null {
  if (levelSlug && levelSlug in YLE_LEVEL_IDS) {
    return levelSlug as YleLevelSlug;
  }
  if (levelId && YLE_LEVEL_ID_TO_SLUG[levelId]) {
    return YLE_LEVEL_ID_TO_SLUG[levelId];
  }
  return null;
}

function listeningContexts(contexts: MockContextSlice[]): MockContextSlice[] {
  return contexts.filter(
    (c) =>
      c.sectionSkillSlug === "listening" ||
      c.contextType === "listening"
  );
}

export function deriveListeningMode(contexts: MockContextSlice[]): MockTestListeningMode {
  const listening = listeningContexts(contexts);
  if (listening.length === 0) return "none";

  const withAudio = listening.some((c) => Boolean(c.audioSrc?.trim()));
  const withText = listening.some(
    (c) => c.contextType === "listening" && !c.audioSrc?.trim()
  );

  if (withAudio && withText) return "mixed";
  if (withAudio) return "audio";
  if (withText) return "text";
  return "text";
}

export function deriveMockTestFormatMetadata(input: DeriveFormatInput): MockTestFormatMetadata {
  const stored = (input.settings?.format ?? null) as StoredMockTestFormat | null;
  const levelSlug =
    resolveYleLevelSlug(input.levelId, stored?.levelSlug ?? input.levelSlug) ??
    (stored?.levelSlug as YleLevelSlug | null) ??
    null;

  const includedSkillSlugs = [
    ...new Set(
      input.sections
        .map((s) => s.skillSlug)
        .filter((s): s is string => Boolean(s))
    ),
  ];

  const listeningMode =
    stored?.listeningMode ??
    deriveListeningMode(input.questionContexts ?? []);

  const hasAudio = listeningMode === "audio" || listeningMode === "mixed";
  const hasTextBasedListening =
    listeningMode === "text" || listeningMode === "mixed";

  return {
    levelSlug,
    isPracticeMock: true,
    isAutoScoredSubset: true,
    includesSpeaking: false,
    includesWriting: false,
    includedSkillSlugs,
    includedSectionTitles: input.sections.map((s) => s.title),
    listeningMode,
    hasAudio,
    hasTextBasedListening,
  };
}

export function isMockRecommendedForLevel(
  mockLevelSlug: YleLevelSlug | null,
  learnerLevelSlug: YleLevelSlug | null
): boolean {
  if (!learnerLevelSlug) return true;
  if (!mockLevelSlug) return false;
  return mockLevelSlug === learnerLevelSlug;
}
