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
  return {
    ...opts,
    blueprintQuestionType: "gap_fill",
    cambaQuestionType: "gap_fill",
    content: {
      template: opts.template,
      correctAnswers: opts.correctAnswers,
      ...opts.content,
    },
  };
}

export function goldReadingComprehension(
  opts: BaseOpts & {
    passage: string;
    choices: Array<{ text: string; isCorrect: boolean }>;
  }
): GoldMockQuestionBlock {
  return {
    ...opts,
    blueprintQuestionType: "reading_comprehension",
    cambaQuestionType: "reading_comprehension",
    content: { passage: opts.passage },
    choices: opts.choices.map((c, i) => ({ ...c, sortOrder: i + 1, mediaUrl: null })),
  };
}

export function goldWriting(
  opts: BaseOpts & {
    cambridgeTaskType: string;
    prompt: string;
    taskDescription?: string;
    minWords?: number;
    maxWords?: number;
    imageUrl?: string;
    requiredPoints?: string[];
  }
): GoldMockQuestionBlock {
  return {
    ...opts,
    blueprintQuestionType: "writing_copy",
    cambaQuestionType: "writing",
    skillTag: "writing",
    content: {
      cambridgeTaskType: opts.cambridgeTaskType,
      prompt: opts.prompt,
      taskDescription: opts.taskDescription,
      minWords: opts.minWords,
      maxWords: opts.maxWords,
      imageUrl: opts.imageUrl,
      requiredPoints: opts.requiredPoints,
      rubricId: `gold-${opts.cambridgeTaskType}-v1`,
    },
  };
}

export function goldSpeaking(
  opts: BaseOpts & {
    cambridgeTaskType: string;
    prompt: string;
    maxDurationSeconds: number;
    followUpQuestions?: string[];
    imageUrl?: string;
    pictureSequence?: string[];
  }
): GoldMockQuestionBlock {
  return {
    ...opts,
    blueprintQuestionType: "speaking_interview",
    cambaQuestionType: "speaking",
    skillTag: "speaking",
    points: opts.points,
    content: {
      cambridgeTaskType: opts.cambridgeTaskType,
      prompt: opts.prompt,
      maxDurationSeconds: opts.maxDurationSeconds,
      followUpQuestions: opts.followUpQuestions,
      imageUrl: opts.imageUrl,
      pictureSequence: opts.pictureSequence,
      rubricId: `gold-${opts.cambridgeTaskType}-v1`,
    },
  };
}

export function listeningAudio(partSlug: string, partNumber: number, title: string, transcript: string) {
  return {
    partSlug,
    sectionSlug: "listening",
    partNumber,
    title,
    instructions: title,
    contextType: "listening" as const,
    audio: {
      src: `/audio/gold-mocks/${partSlug}.mp3`,
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

    if (text === "Match the word to the picture." && q.pairs?.[0]?.leftText) {
      next = `Match the word '${q.pairs[0].leftText}' to the picture.`;
    } else if (text === "Read the sentence. Choose the correct picture." && passage) {
      const preview = passagePreview(passage);
      if (preview) next = `Read: "${preview}" Choose the correct picture.`;
    } else if (text === "Read and choose the best answer." && passage) {
      const preview = passagePreview(passage, 35);
      if (preview) next = `Read the text beginning "${preview}" and choose the best answer.`;
    } else if (
      text === "Look at the two pictures. Tell your partner about the differences." ||
      text === "Look at the two pictures. Tell your partner about five differences between them."
    ) {
      const label = topicLabel(q.topicTag);
      if (label) next = `Look at the two ${label} pictures. Tell your partner about the differences.`;
    } else if (text === "Look at the pictures and tell the story." && typeof prompt === "string") {
      next = prompt;
    } else if (text.startsWith("Answer the examiner's questions about") && q.topicTag) {
      next = `Answer the examiner's questions about ${topicLabel(q.topicTag)}.`;
    } else if (text === "Write an email to your English teacher.") {
      next = `Write an email to your English teacher about ${topicLabel(q.topicTag) || "school"}.`;
    } else if (text === "Write an email in response to your English teacher.") {
      next = `Write an email in response to your English teacher about ${topicLabel(q.topicTag) || "your studies"}.`;
    } else if (text === "Write a story that begins with the sentence below.") {
      next = `Write a story about ${topicLabel(q.topicTag) || "an experience"} that begins with the sentence below.`;
    } else if (text === "Describe the picture and say what the people are doing.") {
      next = `Describe the ${topicLabel(q.topicTag) || "scene"} picture and say what the people are doing.`;
    } else if (text === "Describe the photograph and say what you think is happening.") {
      next = `Describe the ${topicLabel(q.topicTag) || "photograph"} and say what you think is happening.`;
    }

    return next === text ? q : { ...q, questionText: next };
  });
}
