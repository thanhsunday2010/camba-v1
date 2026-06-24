import { PROGRAM_ID, LEVEL_IDS, mockSkillId } from "./mock-test-ids.mjs";
import { validateManifestForSeeding } from "./validate-mock-test-manifest.mjs";
import { deriveFormatFromManifest } from "./mock-format-from-manifest.mjs";
import { resolveDbQuestionType } from "./db-question-type.mjs";

function buildQuestionContent(q, mockContext) {
  const base = {
    skillTag: q.skillTag,
    topicTag: q.topicTag,
    levelTag: q.content?.levelTag ?? null,
    cambaQuestionType: q.cambaQuestionType,
    blueprintQuestionType: q.blueprintQuestionType ?? null,
    difficultyRating:
      q.difficulty === "easy" ? 1 : q.difficulty === "medium" ? 2 : 3,
    ...(q.content ?? {}),
  };

  if (q.grammarTags?.length) {
    base.grammarTags = q.grammarTags;
  } else if (q.grammarTag) {
    base.grammarTag = q.grammarTag;
  }

  if (q.vocabularyTopics?.length) {
    base.vocabularyTopics = q.vocabularyTopics;
  }

  if (mockContext) {
    base.mockContext = mockContext;
  }

  return base;
}

function resolvePartContextForQuestion(manifest, q) {
  const parts = manifest.parts ?? [];
  if (parts.length === 0) return null;

  const matches = parts.filter(
    (p) =>
      p.partSlug === q.partSlug &&
      (!p.questionRefs?.length || p.questionRefs.includes(q.questionRef))
  );

  if (matches.length === 0) return null;

  return matches.sort(
    (a, b) => (b.questionRefs?.length ?? 0) - (a.questionRefs?.length ?? 0)
  )[0];
}

function buildMockContextForQuestion(manifest, q) {
  const partCtx = resolvePartContextForQuestion(manifest, q);
  const section = manifest.sections.find((s) => s.sectionSlug === q.sectionSlug);
  const sectionId = manifest.metadata.seedIds?.sectionIds?.[q.sectionSlug] ?? "";

  if (!partCtx && !section) return null;

  return {
    sectionId,
    sectionTitle: section?.title ?? "",
    sectionSkillSlug: section?.skillSlug ?? null,
    partKey: partCtx?.groupKey ?? q.partSlug,
    partTitle: partCtx?.title ?? null,
    partNumber: partCtx?.partNumber ?? null,
    instructions: partCtx?.instructions ?? null,
    contextType: partCtx?.contextType ?? null,
    passageTitle: partCtx?.passage?.title ?? null,
    passageText: partCtx?.passage?.text ?? null,
    audio: partCtx?.audio
      ? {
          src: partCtx.audio.src,
          transcript: partCtx.audio.transcript ?? null,
          caption: partCtx.audio.caption ?? null,
        }
      : null,
    groupKey: partCtx?.groupKey ?? q.partSlug,
    note: partCtx?.note ?? null,
  };
}

async function ensureMockQuestionBank(supabase, manifest) {
  const levelSlug = manifest.metadata.levelSlug;
  const { containerUnitId, containerLessonId, containerExerciseId } = manifest.metadata.seedIds;
  const levelId = LEVEL_IDS[levelSlug];
  const readingSkillId = mockSkillId(levelSlug, "reading");

  const { error: unitError } = await supabase.from("units").upsert(
    {
      id: containerUnitId,
      skill_id: readingSkillId,
      slug: `mock-bank-${levelSlug}`,
      title: `Mock question bank (${levelSlug})`,
      description: "Container unit for YLE practice mock questions — not on learning path.",
      sort_order: 999,
      is_active: false,
      metadata: {
        mockBank: true,
        levelSlug,
        purpose: "yle-mock-test-questions",
      },
    },
    { onConflict: "id" }
  );
  if (unitError) throw new Error(`mock bank unit: ${unitError.message}`);

  const { error: lessonError } = await supabase.from("lessons").upsert(
    {
      id: containerLessonId,
      unit_id: containerUnitId,
      slug: `mock-bank-lesson-${manifest.metadata.manifestId}`,
      title: manifest.metadata.title,
      description: "Mock test question container lesson",
      sort_order: 0,
      estimated_minutes: 0,
      is_active: false,
      metadata: { mockBank: true, manifestId: manifest.metadata.manifestId },
    },
    { onConflict: "id" }
  );
  if (lessonError) throw new Error(`mock bank lesson: ${lessonError.message}`);

  const { error: exerciseError } = await supabase.from("exercises").upsert(
    {
      id: containerExerciseId,
      lesson_id: containerLessonId,
      slug: `mock-bank-${manifest.metadata.manifestId}`,
      title: manifest.metadata.title,
      instructions: "YLE practice mock — questions only.",
      exercise_type: "multiple_choice",
      content: { mockManifestId: manifest.metadata.manifestId },
      status: "published",
      sort_order: 0,
      is_active: true,
      metadata: { mockBank: true, mockOnly: true },
    },
    { onConflict: "id" }
  );
  if (exerciseError) throw new Error(`mock bank exercise: ${exerciseError.message}`);
}

async function upsertQuestion(supabase, exerciseId, q, questionId, sortOrder, mockContext) {
  const { error: qError } = await supabase.from("questions").upsert(
    {
      id: questionId,
      exercise_id: exerciseId,
      question_text: q.questionText,
      question_type: resolveDbQuestionType(q.cambaQuestionType),
      points: q.points,
      sort_order: sortOrder,
      explanation: q.explanation ?? null,
      content: buildQuestionContent(q, mockContext),
    },
    { onConflict: "id" }
  );
  if (qError) throw new Error(`question ${q.questionRef}: ${qError.message}`);

  await supabase.from("choices").delete().eq("question_id", questionId);
  await supabase.from("question_pairs").delete().eq("question_id", questionId);

  if (q.choices?.length) {
    const rows = q.choices.map((c, i) => ({
      question_id: questionId,
      text: c.text,
      is_correct: c.isCorrect,
      sort_order: c.sortOrder ?? i,
      media_url: c.mediaUrl ?? null,
      metadata: {},
    }));
    const { error } = await supabase.from("choices").insert(rows);
    if (error) throw new Error(`choices ${q.questionRef}: ${error.message}`);
  }

  if (q.pairs?.length) {
    const rows = q.pairs.map((p, i) => ({
      question_id: questionId,
      left_text: p.leftText,
      right_text: p.rightText,
      sort_order: p.sortOrder ?? i,
    }));
    const { error } = await supabase.from("question_pairs").insert(rows);
    if (error) throw new Error(`pairs ${q.questionRef}: ${error.message}`);
  }
}

function normalizeSectionSkillSlug(skillSlug) {
  if (!skillSlug) return null;
  if (skillSlug === "reading_writing") return "reading";
  return skillSlug;
}

export async function seedMockTestFromManifest(supabase, manifest) {
  const validation = validateManifestForSeeding(manifest);
  if (!validation.valid) {
    const msg = validation.issues
      .filter((i) => i.severity === "error")
      .map((i) => `${i.path}: ${i.message}`)
      .join("\n");
    throw new Error(`Manifest validation failed:\n${msg}`);
  }

  const { metadata, sections, questions } = manifest;
  const { mockTestId, containerExerciseId, sectionIds, questionIds } = metadata.seedIds;
  const levelId = LEVEL_IDS[metadata.levelSlug];
  const isGoldMock = manifest.gold?.tier === "gold";
  const formatMetadata = deriveFormatFromManifest(manifest);

  await ensureMockQuestionBank(supabase, manifest);

  const { error: mockError } = await supabase.from("mock_tests").upsert(
    {
      id: mockTestId,
      program_id: PROGRAM_ID,
      level_id: levelId,
      title: metadata.title,
      description: metadata.description,
      time_limit_minutes: metadata.timeLimitMinutes,
      total_score: metadata.totalScore,
      is_active: true,
      settings: {
        manifestId: metadata.manifestId,
        stableSlug: metadata.stableSlug,
        blueprintId: metadata.blueprintId,
        formKind: metadata.formKind,
        yleMock: !isGoldMock,
        goldMock: isGoldMock,
        goldMockId: manifest.gold?.goldMockId ?? null,
        format: formatMetadata,
      },
    },
    { onConflict: "id" }
  );
  if (mockError) throw new Error(`mock_tests: ${mockError.message}`);

  const sectionIdBySlug = sectionIds;

  for (const section of sections) {
    const sectionId = sectionIdBySlug[section.sectionSlug];
    if (!sectionId) {
      throw new Error(`Missing seedIds.sectionIds.${section.sectionSlug}`);
    }

    const skillIdForSection = section.skillSlug
      ? mockSkillId(metadata.levelSlug, normalizeSectionSkillSlug(section.skillSlug))
      : null;

    const { error: sectionError } = await supabase.from("mock_test_sections").upsert(
      {
        id: sectionId,
        mock_test_id: mockTestId,
        skill_id: skillIdForSection,
        title: section.title,
        sort_order: section.sortOrder,
        time_limit_minutes: section.timeLimitMinutes,
      },
      { onConflict: "id" }
    );
    if (sectionError) throw new Error(`section ${section.sectionSlug}: ${sectionError.message}`);

    const { error: deleteJunctionError } = await supabase
      .from("mock_test_questions")
      .delete()
      .eq("mock_test_section_id", sectionId);
    if (deleteJunctionError) {
      throw new Error(`clear junction ${section.sectionSlug}: ${deleteJunctionError.message}`);
    }
  }

  const questionByRef = new Map(questions.map((q) => [q.questionRef, q]));
  let globalSort = 0;

  for (const section of sections) {
    const sectionId = sectionIdBySlug[section.sectionSlug];

    for (let i = 0; i < section.questionRefs.length; i++) {
      const ref = section.questionRefs[i];
      const q = questionByRef.get(ref);
      if (!q) throw new Error(`Question ref not found: ${ref}`);

      const questionId = questionIds[ref];
      if (!questionId) throw new Error(`Missing seedIds.questionIds.${ref}`);

      await upsertQuestion(
        supabase,
        containerExerciseId,
        q,
        questionId,
        globalSort,
        buildMockContextForQuestion(manifest, q)
      );

      const { error: junctionError } = await supabase.from("mock_test_questions").insert({
        mock_test_section_id: sectionId,
        question_id: questionId,
        sort_order: i,
        points: q.points,
      });
      if (junctionError) {
        throw new Error(`mock_test_questions ${ref}: ${junctionError.message}`);
      }

      globalSort += 1;
    }
  }

  return {
    mockTestId,
    questionCount: questions.length,
    sectionCount: sections.length,
  };
}
