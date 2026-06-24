import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type {
  CambridgeItemBankItem,
  CambridgeItemReference,
} from "@/lib/cambridge-assessment/cambridge-item-bank-proposal";
import { getCambridgeTask } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
import type {
  CambridgeAssemblyPartSelection,
  CambridgeExamVersion,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
import type {
  CambridgeExamManifest,
  CambridgeExamManifestMetadata,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-manifest-types";
import type { YleBlueprintQuestionTypeKey } from "@/lib/mock-blueprints/yle-mock-blueprint-types";
import type {
  YleMockManifest,
  YleMockQuestionManifestBlock,
  YleMockSectionManifest,
} from "@/lib/mock-blueprints/yle-mock-manifest-types";
import type { ExerciseType } from "@/types/database";

const LEVEL_IDS: Record<CambridgeExamLevel, string> = {
  starters: "b0000000-0000-4000-8000-000000000002",
  movers: "b0000000-0000-4000-8000-000000000003",
  flyers: "b0000000-0000-4000-8000-000000000004",
  ket: "b0000000-0000-4000-8000-000000000005",
  pet: "b0000000-0000-4000-8000-000000000006",
};

const TASK_TO_BLUEPRINT: Partial<
  Record<CambridgeItemBankItem["taskType"], YleBlueprintQuestionTypeKey>
> = {
  multiple_choice: "mcq_single",
  reading_comprehension: "reading_comprehension",
  matching: "matching",
  true_false: "mcq_single",
  open_cloze: "gap_fill",
  gapped_text: "gap_fill",
  audio_multiple_choice: "mcq_listening",
  audio_matching: "matching",
  audio_gap_fill: "gap_fill",
  write_sentence: "writing_copy",
  write_note: "writing_message",
  write_email: "writing_message",
  write_story: "writing_message",
  picture_description_writing: "writing_copy",
  short_answer: "speaking_interview",
  picture_description_speaking: "speaking_picture_story",
  story_telling: "speaking_picture_story",
  conversation: "speaking_interview",
};

const WRITING_RUNTIME_TASK: Partial<Record<CambridgeItemBankItem["taskType"], string>> = {
  write_sentence: "write_sentence",
  write_note: "write_note",
  write_email: "write_email",
  write_story: "write_story",
  picture_description_writing: "picture_description",
};

const SPEAKING_RUNTIME_TASK: Partial<Record<CambridgeItemBankItem["taskType"], string>> = {
  short_answer: "speaking_personal_questions",
  picture_description_speaking: "speaking_picture_description",
  story_telling: "speaking_storytelling",
  conversation: "speaking_discussion",
};

function paperToSectionSlug(paperSlug: string, level: CambridgeExamLevel): string {
  if (paperSlug === "reading-writing") return level === "ket" ? "reading-writing" : "reading-writing";
  if (paperSlug === "reading") return "reading";
  if (paperSlug === "writing") return "writing";
  if (paperSlug === "listening") return "listening";
  if (paperSlug === "speaking") return "speaking";
  return paperSlug;
}

function sectionTitle(paperSlug: string): string {
  const titles: Record<string, string> = {
    listening: "Listening",
    "reading-writing": "Reading & Writing",
    reading: "Reading",
    writing: "Writing",
    speaking: "Speaking",
  };
  return titles[paperSlug] ?? paperSlug;
}

function sectionSkillSlug(paperSlug: string): string | null {
  if (paperSlug === "listening") return "listening";
  if (paperSlug === "reading-writing") return "reading_writing";
  if (paperSlug === "reading") return "reading";
  if (paperSlug === "writing") return "writing";
  if (paperSlug === "speaking") return "speaking";
  return null;
}

export function buildExamManifest(
  blueprint: CambridgeExamBlueprint,
  selections: CambridgeAssemblyPartSelection[],
  options: {
    examVersion: CambridgeExamVersion;
    assemblySeed: string;
  }
): CambridgeExamManifest {
  const itemReferences: CambridgeItemReference[] = selections.map((sel, index) => ({
    itemId: sel.item.id,
    partSlug: sel.partSlug,
    sortOrder: index + 1,
    pointsOverride: sel.points,
  }));

  const papers = blueprint.papers.map((paper) => ({
    paperSlug: paper.paperSlug,
    title: paper.title,
    skills: paper.skills,
    parts: paper.parts.map((part) => ({
      paperSlug: paper.paperSlug,
      partSlug: part.partSlug,
      partNumber: part.partNumber,
      title: part.title,
      skill: part.skill,
      questionCount: part.questionCount,
      itemReferences: itemReferences.filter((ref) => ref.partSlug === part.partSlug),
    })),
  }));

  const totalScore = selections.reduce((sum, sel) => sum + sel.points, 0);
  const manifestId = `cambridge-${blueprint.level}-${options.examVersion.toLowerCase()}-v1`;

  const metadata: CambridgeExamManifestMetadata = {
    manifestId,
    manifestVersion: "1.0.0",
    blueprintId: blueprint.blueprintId,
    blueprintVersion: blueprint.blueprintVersion,
    level: blueprint.level,
    examVersion: options.examVersion,
    assemblySeed: options.assemblySeed,
    title: `${blueprint.examName} — Form ${options.examVersion}`,
    description: `Assembled reference exam for ${blueprint.level} (architecture validation).`,
    formKind: "full-form",
    timeLimitMinutes: blueprint.totalDurationMinutes,
    totalScore,
    assembledAt: new Date().toISOString(),
    authoringNotes: "M2.4 golden reference — not production content.",
  };

  return { metadata, papers, itemReferences };
}

function itemToQuestionBlock(
  sel: CambridgeAssemblyPartSelection,
  paperSlug: string,
  level: CambridgeExamLevel
): YleMockQuestionManifestBlock {
  const { item } = sel;
  const task = getCambridgeTask(item.taskType);
  const blueprintQuestionType = TASK_TO_BLUEPRINT[item.taskType] ?? "mcq_single";
  const cambaQuestionType = (task.legacyCambaQuestionType ?? "multiple_choice") as ExerciseType;
  const sectionSlug = paperToSectionSlug(paperSlug, level);
  const topicTag = item.metadata.vocabularyTopics[0] ?? null;
  const grammarTags = item.metadata.grammarTags;
  const vocabularyTopics = item.metadata.vocabularyTopics;

  if (item.kind === "writing") {
    const runtimeTask = WRITING_RUNTIME_TASK[item.taskType] ?? "write_sentence";
    return {
      questionRef: item.id,
      partSlug: sel.partSlug,
      sectionSlug,
      sortOrder: sel.sortOrder,
      points: sel.points,
      blueprintQuestionType,
      cambaQuestionType: "writing",
      difficulty: item.difficulty,
      topicTag,
      skillTag: "writing",
      grammarTags,
      vocabularyTopics,
      questionText: item.content.prompt,
      content: {
        cambridgeTaskType: runtimeTask,
        prompt: item.content.prompt,
        taskDescription: item.content.taskDescription,
        minWords: item.content.minWords,
        maxWords: item.content.maxWords,
        requiredPoints: item.content.requiredPoints,
        imageUrl: item.content.stimulus?.imageUrl,
        rubricId: item.content.rubricId,
      },
    };
  }

  if (item.kind === "speaking") {
    const runtimeTask = SPEAKING_RUNTIME_TASK[item.taskType] ?? "speaking_personal_questions";
    return {
      questionRef: item.id,
      partSlug: sel.partSlug,
      sectionSlug,
      sortOrder: sel.sortOrder,
      points: sel.points,
      blueprintQuestionType,
      cambaQuestionType: "speaking",
      difficulty: item.difficulty,
      topicTag,
      skillTag: "speaking",
      grammarTags,
      vocabularyTopics,
      questionText: item.content.prompt,
      content: {
        cambridgeTaskType: runtimeTask,
        prompt: item.content.prompt,
        taskDescription: item.content.examinerScript,
        followUpQuestions: item.content.followUpQuestions,
        maxDurationSeconds: item.content.maxDurationSeconds,
        imageUrl: item.content.stimulus?.imageUrl,
        pictureSequence: item.content.stimulus?.pictureSequence,
        rubricId: item.content.rubricId,
      },
    };
  }

  const receptive = item;
  const content: Record<string, unknown> = {
    questionText: receptive.content.questionText,
    ...(receptive.content.stimulus?.passage
      ? { passage: receptive.content.stimulus.passage }
      : {}),
    ...(receptive.content.stimulus?.audioUrl
      ? { audioUrl: receptive.content.stimulus.audioUrl }
      : {}),
    ...(receptive.content.stimulus?.transcript
      ? { transcript: receptive.content.stimulus.transcript }
      : {}),
    ...(receptive.content.template ? { template: receptive.content.template } : {}),
    ...(receptive.content.correctAnswers
      ? { correctAnswers: receptive.content.correctAnswers }
      : {}),
  };

  return {
    questionRef: item.id,
    partSlug: sel.partSlug,
    sectionSlug,
    sortOrder: sel.sortOrder,
    points: sel.points,
    blueprintQuestionType,
    cambaQuestionType,
    difficulty: item.difficulty,
    topicTag,
    skillTag: item.skill,
    grammarTags,
    vocabularyTopics,
    questionText: receptive.content.questionText,
    content,
    choices: receptive.content.choices?.map((c, i) => ({
      text: c.text,
      isCorrect: c.isCorrect,
      sortOrder: i + 1,
      mediaUrl: c.mediaUrl ?? null,
    })),
    pairs: receptive.content.pairs?.map((p, i) => ({
      leftText: p.leftText,
      rightText: p.rightText,
      sortOrder: i + 1,
    })),
  };
}

export function hydrateManifestForRuntime(
  examManifest: CambridgeExamManifest,
  selections: CambridgeAssemblyPartSelection[],
  blueprint: CambridgeExamBlueprint
): YleMockManifest {
  const level = blueprint.level;
  const questions = selections.map((sel) =>
    itemToQuestionBlock(sel, sel.paperSlug, level)
  );

  const sectionOrder: string[] = [];
  for (const paper of blueprint.papers) {
    const slug = paperToSectionSlug(paper.paperSlug, level);
    if (!sectionOrder.includes(slug)) sectionOrder.push(slug);
  }

  const sections: YleMockSectionManifest[] = sectionOrder.map((sectionSlug, index) => {
    const paper = blueprint.papers.find(
      (p) => paperToSectionSlug(p.paperSlug, level) === sectionSlug
    )!;
    const sectionQuestions = questions.filter((q) => q.sectionSlug === sectionSlug);
    return {
      sectionSlug,
      title: sectionTitle(paper.paperSlug),
      sortOrder: index + 1,
      skillSlug: sectionSkillSlug(paper.paperSlug),
      timeLimitMinutes: paper.totalMinutes,
      partSlugs: paper.parts.map((p) => p.partSlug),
      questionRefs: sectionQuestions.map((q) => q.questionRef),
    };
  });

  const coverageAchieved = {
    distinctTopics: [...new Set(questions.map((q) => q.topicTag).filter(Boolean) as string[])],
    distinctGrammarPatterns: [
      ...new Set(questions.flatMap((q) => q.grammarTags ?? [])),
    ],
    subskillsRepresented: [...new Set(questions.map((q) => q.skillTag).filter(Boolean) as string[])],
    difficultyCounts: questions.reduce(
      (acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1;
        return acc;
      },
      {} as Record<"easy" | "medium" | "hard", number>
    ),
    notes: "Generated by M2.4 exam assembly engine.",
  };

  return {
    metadata: {
      manifestId: examManifest.metadata.manifestId,
      manifestVersion: examManifest.metadata.manifestVersion,
      blueprintId: examManifest.metadata.blueprintId,
      blueprintVersion: examManifest.metadata.blueprintVersion,
      // YLE type is starters|movers|flyers — KET/PET use extended slug at runtime import.
      levelSlug: level as YleMockManifest["metadata"]["levelSlug"],
      title: examManifest.metadata.title,
      description: examManifest.metadata.description,
      formKind: examManifest.metadata.formKind,
      levelId: LEVEL_IDS[level],
      timeLimitMinutes: examManifest.metadata.timeLimitMinutes,
      totalScore: examManifest.metadata.totalScore,
      status: "review",
      authoringNotes: examManifest.metadata.authoringNotes,
      stableSlug: `${level}-assembled-${examManifest.metadata.examVersion.toLowerCase()}`,
    },
    sections,
    questions,
    coverageAchieved,
  };
}

export function resolveItemFromBank(
  itemId: string,
  bank: CambridgeItemBankItem[]
): CambridgeItemBankItem | undefined {
  return bank.find((item) => item.id === itemId);
}
