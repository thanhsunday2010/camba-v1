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
    parts: input.parts,
    questions: input.questions,
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
