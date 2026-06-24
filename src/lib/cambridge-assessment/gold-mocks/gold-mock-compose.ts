import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import {
  GOLD_MOCK_QA_CHECKLIST_VERSION,
  type GoldMockManifest,
  type GoldMockQuestionBlock,
} from "@/lib/cambridge-assessment/gold-mock-format";
import { getGoldMockSpecification } from "@/lib/cambridge-assessment/gold-mock-specifications";
import type {
  YleMockPartContextManifest,
  YleMockSectionManifest,
} from "@/lib/mock-blueprints/yle-mock-manifest-types";

const LEVEL_IDS: Record<CambridgeExamLevel, string> = {
  starters: "b0000000-0000-4000-8000-000000000002",
  movers: "b0000000-0000-4000-8000-000000000003",
  flyers: "b0000000-0000-4000-8000-000000000004",
  ket: "b0000000-0000-4000-8000-000000000005",
  pet: "b0000000-0000-4000-8000-000000000006",
};

function paperToSectionSlug(paperSlug: string): string {
  if (paperSlug === "reading-writing") return "reading-writing";
  return paperSlug;
}

function normalizeGoldMockImageSrc(src: string): string {
  if (src.startsWith("/images/gold-mocks/") && src.endsWith(".png")) {
    return src.replace(/\.png$/, ".svg");
  }
  return src;
}

function normalizeQuestionImages(questions: GoldMockQuestionBlock[]): GoldMockQuestionBlock[] {
  return questions.map((question) => {
    if (!question.content) return question;
    const content = { ...question.content } as Record<string, unknown>;
    if (typeof content.imageUrl === "string") {
      content.imageUrl = normalizeGoldMockImageSrc(content.imageUrl);
    }
    if (Array.isArray(content.pictureSequence)) {
      content.pictureSequence = content.pictureSequence.map((url) =>
        typeof url === "string" ? normalizeGoldMockImageSrc(url) : url
      );
    }
    const next = { ...question, content } as GoldMockQuestionBlock & Record<string, unknown>;
    for (const key of [
      "cambridgeTaskType",
      "prompt",
      "taskDescription",
      "minWords",
      "maxWords",
      "imageUrl",
      "requiredPoints",
      "maxDurationSeconds",
      "followUpQuestions",
      "pictureSequence",
      "template",
      "correctAnswers",
      "passage",
    ]) {
      if (key in next) delete next[key];
    }
    return next as GoldMockQuestionBlock;
  });
}

function normalizeListeningParts(
  parts: YleMockPartContextManifest[] | undefined,
  goldMockId: string
): YleMockPartContextManifest[] | undefined {
  if (!parts?.length) return parts;
  return parts.map((part) => {
    if (part.sectionSlug !== "listening" || !part.audio?.transcript?.trim()) return part;
    return {
      ...part,
      audio: {
        ...part.audio,
        src: `/audio/gold-mocks/${goldMockId}/${part.partSlug}.mp3`,
      },
    };
  });
}

function sectionSkillSlug(paperSlug: string): string | null {
  if (paperSlug === "listening") return "listening";
  if (paperSlug === "reading-writing") return "reading_writing";
  if (paperSlug === "reading") return "reading";
  if (paperSlug === "writing") return "writing";
  if (paperSlug === "speaking") return "speaking";
  return null;
}

export type ComposeGoldMockInput = {
  level: CambridgeExamLevel;
  goldMockId: string;
  title: string;
  description: string;
  questions: GoldMockQuestionBlock[];
  parts?: YleMockPartContextManifest[];
};

/** Compose a canonical Gold Mock manifest from authored questions + M2.0 blueprint. */
export function composeGoldMockManifest(input: ComposeGoldMockInput): GoldMockManifest {
  const spec = getGoldMockSpecification(input.level);
  const blueprint = getCambridgeExamBlueprint(input.level);
  const totalScore = input.questions.reduce((sum, q) => sum + (q.points ?? 0), 0);

  const sectionOrder: string[] = [];
  for (const paper of blueprint.papers) {
    const slug = paperToSectionSlug(paper.paperSlug);
    if (!sectionOrder.includes(slug)) sectionOrder.push(slug);
  }

  const sections: YleMockSectionManifest[] = sectionOrder.map((sectionSlug, index) => {
    const paper = blueprint.papers.find(
      (p) => paperToSectionSlug(p.paperSlug) === sectionSlug
    )!;
    const sectionQuestions = input.questions.filter((q) => q.sectionSlug === sectionSlug);
    return {
      sectionSlug,
      title: paper.title,
      sortOrder: index + 1,
      skillSlug: sectionSkillSlug(paper.paperSlug),
      timeLimitMinutes: paper.totalMinutes,
      partSlugs: paper.parts.map((p) => p.partSlug),
      questionRefs: sectionQuestions.map((q) => q.questionRef),
    };
  });

  const grammarTags = new Set<string>();
  const vocabTopics = new Set<string>();
  const topics = new Set<string>();
  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };

  for (const q of input.questions) {
    q.grammarTags?.forEach((t) => grammarTags.add(t));
    q.vocabularyTopics?.forEach((t) => vocabTopics.add(t));
    if (q.topicTag) topics.add(q.topicTag);
    difficultyCounts[q.difficulty] += 1;
  }

  return {
    metadata: {
      manifestId: input.goldMockId,
      manifestVersion: "1.0.0",
      blueprintId: spec.blueprintId,
      blueprintVersion: spec.blueprintVersion,
      levelSlug: input.level as GoldMockManifest["metadata"]["levelSlug"],
      title: input.title,
      description: input.description,
      formKind: "full-form",
      levelId: LEVEL_IDS[input.level],
      timeLimitMinutes: spec.totalDurationMinutes,
      totalScore,
      status: "published",
      authoringNotes: "M4.1 Gold Mock — manually authored and academically reviewed.",
      stableSlug: input.goldMockId,
    },
    sections,
    parts: normalizeListeningParts(input.parts, input.goldMockId),
    questions: normalizeQuestionImages(input.questions),
    coverageAchieved: {
      distinctTopics: [...topics],
      distinctGrammarPatterns: [...grammarTags],
      subskillsRepresented: [...new Set(input.questions.map((q) => q.skillTag).filter(Boolean) as string[])],
      difficultyCounts,
      notes: "Authored for M3.1 Gold Mock specification.",
    },
    gold: {
      tier: "gold",
      goldMockId: input.goldMockId,
      goldMockVersion: "1.0.0",
      specificationId: spec.specificationId,
      specificationVersion: spec.specificationVersion,
      authoredAt: "2026-06-22T00:00:00.000Z",
      status: "published",
      academicAuthority: true,
      authoringMethod: "manual",
      qaChecklistVersion: GOLD_MOCK_QA_CHECKLIST_VERSION,
    },
    specification: {
      specificationId: spec.specificationId,
      specificationVersion: spec.specificationVersion,
      level: input.level,
      coverageTargets: spec.coverageTargets,
    },
  };
}
