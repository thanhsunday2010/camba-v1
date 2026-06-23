import type { MockTestData } from "@/types/learning";

export type MockTestContextType = "listening" | "reading" | "dialogue" | "general";

export type MockTestQuestionContext = {
  sectionId: string;
  sectionTitle: string;
  sectionSkillSlug?: string | null;

  partKey?: string | null;
  partTitle?: string | null;
  partNumber?: number | null;

  instructions?: string | null;

  contextType?: MockTestContextType | null;

  passageTitle?: string | null;
  passageText?: string | null;

  audio?: {
    src: string;
    transcript?: string | null;
    caption?: string | null;
  } | null;

  groupKey?: string | null;
  note?: string | null;
};

export type MockTestQuestionContextView = MockTestQuestionContext & {
  /** True when this question begins a new part/group block in linear flow. */
  startsNewPartGroup: boolean;
  /** True when the panel should render contextual content above the question. */
  hasContextPanel: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAudio(value: unknown): MockTestQuestionContext["audio"] {
  if (!isRecord(value) || typeof value.src !== "string" || !value.src.trim()) {
    return null;
  }
  return {
    src: value.src,
    transcript: typeof value.transcript === "string" ? value.transcript : null,
    caption: typeof value.caption === "string" ? value.caption : null,
  };
}

/** Parse mockContext stored in questions.content during YLE mock seeding. */
export function parseMockContextFromQuestionContent(
  content: Record<string, unknown> | undefined | null
): MockTestQuestionContext | null {
  const raw = content?.mockContext;
  if (!isRecord(raw)) return null;

  const sectionId = typeof raw.sectionId === "string" ? raw.sectionId : "";
  const sectionTitle = typeof raw.sectionTitle === "string" ? raw.sectionTitle : "";
  if (!sectionId && !sectionTitle) return null;

  const contextType = raw.contextType;
  const validContextType =
    contextType === "listening" ||
    contextType === "reading" ||
    contextType === "dialogue" ||
    contextType === "general"
      ? contextType
      : null;

  return {
    sectionId,
    sectionTitle,
    sectionSkillSlug: typeof raw.sectionSkillSlug === "string" ? raw.sectionSkillSlug : null,
    partKey: typeof raw.partKey === "string" ? raw.partKey : null,
    partTitle: typeof raw.partTitle === "string" ? raw.partTitle : null,
    partNumber: typeof raw.partNumber === "number" ? raw.partNumber : null,
    instructions: typeof raw.instructions === "string" ? raw.instructions : null,
    contextType: validContextType,
    passageTitle: typeof raw.passageTitle === "string" ? raw.passageTitle : null,
    passageText: typeof raw.passageText === "string" ? raw.passageText : null,
    audio: parseAudio(raw.audio),
    groupKey: typeof raw.groupKey === "string" ? raw.groupKey : null,
    note: typeof raw.note === "string" ? raw.note : null,
  };
}

export function mockContextHasPanelContent(context: MockTestQuestionContext | null): boolean {
  if (!context) return false;
  return Boolean(
    context.partTitle ||
      context.instructions ||
      context.passageText ||
      context.audio?.src ||
      context.note
  );
}

export function enrichMockContextView(
  context: MockTestQuestionContext | null,
  startsNewPartGroup: boolean
): MockTestQuestionContextView | null {
  if (!context) return null;
  return {
    ...context,
    startsNewPartGroup,
    hasContextPanel: mockContextHasPanelContent(context),
  };
}

/** Build per-question context views for the take route from loaded mock test data. */
export function buildMockTestQuestionContextMap(
  test: MockTestData
): Map<string, MockTestQuestionContextView> {
  const map = new Map<string, MockTestQuestionContextView>();
  const flatQuestions = test.sections.flatMap((s) => s.questions);
  let previousGroupKey: string | null = null;

  for (const question of flatQuestions) {
    const section = test.sections.find((s) => s.id === question.sectionId);
    const parsed = parseMockContextFromQuestionContent(question.content);
    const context: MockTestQuestionContext | null = parsed ?? (section
      ? {
          sectionId: section.id,
          sectionTitle: section.title,
          sectionSkillSlug: section.skillSlug,
        }
      : null);

    const groupKey = context?.groupKey ?? context?.partKey ?? null;
    const startsNewPartGroup = groupKey !== previousGroupKey;
    if (groupKey) previousGroupKey = groupKey;

    const view = enrichMockContextView(context, startsNewPartGroup);
    if (view) {
      map.set(question.id, view);
    }
  }

  return map;
}
