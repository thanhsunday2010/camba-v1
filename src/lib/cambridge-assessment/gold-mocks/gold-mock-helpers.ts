import type { GoldMockQuestionBlock } from "@/lib/cambridge-assessment/gold-mock-format";

type BaseOpts = {
  questionRef: string;
  partSlug: string;
  sectionSlug: string;
  sortOrder: number;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  topicTag: string;
  grammarTags: string[];
  vocabularyTopics: string[];
  questionText: string;
  skillTag: string;
};

export function goldMcq(
  opts: BaseOpts & {
    blueprintQuestionType: GoldMockQuestionBlock["blueprintQuestionType"];
    choices: Array<{ text: string; isCorrect: boolean }>;
    content?: Record<string, unknown>;
  }
): GoldMockQuestionBlock {
  return {
    ...opts,
    cambaQuestionType: opts.blueprintQuestionType === "mcq_listening" ? "listening" : "multiple_choice",
    choices: opts.choices.map((c, i) => ({ ...c, sortOrder: i + 1, mediaUrl: null })),
    content: opts.content,
  };
}

export function goldMatching(
  opts: BaseOpts & {
    pairs: Array<{ leftText: string; rightText: string }>;
    content?: Record<string, unknown>;
  }
): GoldMockQuestionBlock {
  return {
    ...opts,
    blueprintQuestionType: "matching",
    cambaQuestionType: "matching",
    pairs: opts.pairs.map((p, i) => ({ ...p, sortOrder: i + 1 })),
    content: opts.content,
  };
}

export function goldGapFill(
  opts: BaseOpts & {
    template: string;
    correctAnswers: string[];
    content?: Record<string, unknown>;
  }
): GoldMockQuestionBlock {
  const { template, correctAnswers, content, ...base } = opts;
  return {
    ...base,
    blueprintQuestionType: "gap_fill",
    cambaQuestionType: "gap_fill",
    content: {
      template,
      correctAnswers,
      ...content,
    },
  };
}

export function goldReadingComprehension(
  opts: BaseOpts & {
    passage: string;
    choices: Array<{ text: string; isCorrect: boolean }>;
  }
): GoldMockQuestionBlock {
  const { passage, choices, ...base } = opts;
  return {
    ...base,
    blueprintQuestionType: "reading_comprehension",
    cambaQuestionType: "reading_comprehension",
    content: { passage },
    choices: choices.map((c, i) => ({ ...c, sortOrder: i + 1, mediaUrl: null })),
  };
}

export function goldWriting(
  opts: BaseOpts & {
    cambridgeTaskType: string;
    prompt: string;
    taskDescription?: string;
    minWords?: number;
    maxWords?: number;
    requiredPoints?: string[];
  }
): GoldMockQuestionBlock {
  const {
    cambridgeTaskType,
    prompt,
    taskDescription,
    minWords,
    maxWords,
    requiredPoints,
    ...base
  } = opts;
  return {
    ...base,
    blueprintQuestionType: "writing_copy",
    cambaQuestionType: "writing",
    skillTag: "writing",
    content: {
      cambridgeTaskType,
      prompt,
      taskDescription,
      minWords,
      maxWords,
      requiredPoints,
      rubricId: `gold-${cambridgeTaskType}-v1`,
    },
  };
}

export function goldSpeaking(
  opts: BaseOpts & {
    cambridgeTaskType: string;
    prompt: string;
    taskDescription?: string;
    maxDurationSeconds: number;
    followUpQuestions?: string[];
  }
): GoldMockQuestionBlock {
  const {
    cambridgeTaskType,
    prompt,
    taskDescription,
    maxDurationSeconds,
    followUpQuestions,
    ...base
  } = opts;
  return {
    ...base,
    blueprintQuestionType: "speaking_interview",
    cambaQuestionType: "speaking",
    skillTag: "speaking",
    points: opts.points,
    content: {
      cambridgeTaskType,
      prompt,
      taskDescription,
      maxDurationSeconds,
      followUpQuestions,
      rubricId: `gold-${cambridgeTaskType}-v1`,
    },
  };
}

export function goldMockListeningAudioSrc(goldMockId: string, partSlug: string): string {
  return `/audio/gold-mocks/${goldMockId}/${partSlug}.mp3`;
}

export function listeningAudio(
  partSlug: string,
  partNumber: number,
  title: string,
  transcript: string,
  goldMockId?: string
) {
  return {
    partSlug,
    sectionSlug: "listening",
    partNumber,
    title,
    instructions: title,
    contextType: "listening" as const,
    audio: {
      src: goldMockId
        ? goldMockListeningAudioSrc(goldMockId, partSlug)
        : `/audio/gold-mocks/${partSlug}.mp3`,
      transcript,
      caption: title,
    },
  };
}

/** KET/PET reading section uses "reading" slug. */
export function readingSectionSlug(level: string): string {
  if (level === "ket") return "reading-writing";
  if (level === "pet") return "reading";
  return "reading-writing";
}

export function listeningSectionSlug(): string {
  return "listening";
}

function passagePreview(passage: unknown, max = 40): string {
  if (typeof passage !== "string" || !passage.trim()) return "";
  const trimmed = passage.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}…`;
}

function topicLabel(tag: string | null | undefined): string {
  if (!tag) return "";
  return tag.replace(/_/g, " ");
}

/** Disambiguate generic Cambridge task stems so mock 2/3 content stays unique across versions. */
export function uniquifyQuestionStems(
  questions: GoldMockQuestionBlock[]
): GoldMockQuestionBlock[] {
  return questions.map((q) => {
    const text = q.questionText.trim();
    const passage = q.content?.passage;
    const prompt = q.content?.prompt;
    let next = text;

    if (text === "Match the word to the description." && q.pairs?.[0]?.leftText) {
      next = `Match the word '${q.pairs[0].leftText}' to the description.`;
    } else if (text === "Read the sentence. Choose the best answer." && passage) {
      const preview = passagePreview(passage);
      if (preview) next = `Read: "${preview}" Choose the best answer.`;
    } else if (text === "Read and choose the best answer." && passage) {
      const preview = passagePreview(passage, 35);
      if (preview) next = `Read the text beginning "${preview}" and choose the best answer.`;
    } else if (
      text === "Read the two scenes below. Tell your partner about the differences." ||
      text === "Read the two scenes below. Tell your partner about five differences between them."
    ) {
      const label = topicLabel(q.topicTag);
      if (label) next = `Read the two ${label} scenes below. Tell your partner about the differences.`;
    } else if (text === "Use the story outline and tell the story." && typeof prompt === "string") {
      next = prompt;
    } else if (text.startsWith("Answer the examiner's questions about") && q.topicTag) {
      next = `Answer the examiner's questions about ${topicLabel(q.topicTag)}.`;
    } else if (text === "Write an email to your English teacher.") {
      next = `Write an email to your English teacher about ${topicLabel(q.topicTag) || "school"}.`;
    } else if (text === "Write an email in response to your English teacher.") {
      next = `Write an email in response to your English teacher about ${topicLabel(q.topicTag) || "your studies"}.`;
    } else if (text === "Write a story that begins with the sentence below.") {
      next = `Write a story about ${topicLabel(q.topicTag) || "an experience"} that begins with the sentence below.`;
    } else if (text === "Read the scene description and say what the people are doing.") {
      next = `Read the ${topicLabel(q.topicTag) || "scene"} description and say what the people are doing.`;
    } else if (text === "Read the scene description and say what you think is happening.") {
      next = `Read the ${topicLabel(q.topicTag) || "scene"} description and say what you think is happening.`;
    }

    return next === text ? q : { ...q, questionText: next };
  });
}
