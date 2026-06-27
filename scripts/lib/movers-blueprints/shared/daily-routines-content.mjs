/**
 * Movers Unit 1 — Daily Routines
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-01.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "daily-routines";

const {
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildWritingCheck,
  buildSpeakingCheck,
} = createCambridgeUnitBuilder("movers");

export const vocabularyBank = [
  buildVocabWord({
    word: "wake up",
    ipa: "/weɪk ʌp/",
    partOfSpeech: "phrasal verb",
    vietnameseMeaning: "thức dậy",
    exampleSentence: "I wake up at six thirty every day.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "breakfast",
    ipa: "/ˈbrekfəst/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bữa sáng",
    exampleSentence: "Minh has breakfast with his family.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "lunch",
    ipa: "/lʌntʃ/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bữa trưa",
    exampleSentence: "We have lunch at school at twelve.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "dinner",
    ipa: "/ˈdɪnə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bữa tối",
    exampleSentence: "My family eats dinner at six o'clock.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "homework",
    ipa: "/ˈhəʊmwɜːk/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bài tập về nhà",
    exampleSentence: "I always do my homework after school.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "always",
    ipa: "/ˈɔːlweɪz/",
    partOfSpeech: "adverb",
    vietnameseMeaning: "luôn luôn",
    exampleSentence: "She always brushes her teeth before school.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "sometimes",
    ipa: "/ˈsʌmtaɪmz/",
    partOfSpeech: "adverb",
    vietnameseMeaning: "đôi khi",
    exampleSentence: "I sometimes play football after homework.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "never",
    ipa: "/ˈnevə(r)/",
    partOfSpeech: "adverb",
    vietnameseMeaning: "không bao giờ",
    exampleSentence: "He never watches TV before homework.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "get dressed",
    ipa: "/ɡet drest/",
    partOfSpeech: "phrasal verb",
    vietnameseMeaning: "mặc quần áo",
    exampleSentence: "Minh gets dressed after breakfast.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "brush teeth",
    ipa: "/brʌʃ tiːθ/",
    partOfSpeech: "phrase",
    vietnameseMeaning: "đánh răng",
    exampleSentence: "I brush my teeth every morning.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "go to bed",
    ipa: "/ɡəʊ tə bed/",
    partOfSpeech: "phrase",
    vietnameseMeaning: "đi ngủ",
    exampleSentence: "Minh goes to bed at nine o'clock.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "every day",
    ipa: "/ˈevri deɪ/",
    partOfSpeech: "phrase",
    vietnameseMeaning: "mỗi ngày",
    exampleSentence: "I walk to school every day.",
    difficulty: 2,
    topic: TOPIC,
  }),
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Present simple: daily habits",
    explanation:
      "Use present simple for routines and habits that happen regularly. Add -s or -es for he/she/it: He wakes up at seven. Use do/does in questions and negatives.",
    examples: [
      "I wake up at six thirty every day.",
      "She has breakfast with her family.",
      "Minh goes to school at seven thirty.",
      "Do you do your homework after school?",
    ],
    commonMistakes: [
      "He wake up at seven (×) → He wakes up at seven (✓)",
      "I am go to school every day (×) → I go to school every day (✓)",
      "She have lunch at school (×) → She has lunch at school (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Adverbs of frequency: always, sometimes, never",
    explanation:
      "Place always, sometimes and never before the main verb (I always do homework). With be, put the adverb after am/is/are (She is always happy). Never means zero times.",
    examples: [
      "I always brush my teeth in the morning.",
      "He sometimes plays football after school.",
      "She never watches TV before homework.",
      "They are always hungry before dinner.",
    ],
    commonMistakes: [
      "I do always homework (×) → I always do homework (✓)",
      "She never is late (×) → She is never late (✓)",
      "Sometimes I am play football (×) → Sometimes I play football (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twelve daily routine words at Movers A1 level.",
    "Use present simple to describe everyday habits and school-day routines.",
    "Place adverbs of frequency (always, sometimes, never) correctly in sentences.",
    "Read a short text about a school day and identify the main idea and key details.",
    "Listen for times and sequence words in short dialogues about routines.",
    "Write a short note or message (at least 15 words) about daily habits.",
    "Talk about your morning and school day in short spoken answers.",
  ],
};

export const passageMinhSchoolDay = buildPassage({
  title: "Minh's School Day",
  text: `Minh is nine. He lives in Hanoi. Every day he wakes up at six thirty and has breakfast with his family. Then he gets dressed and brushes his teeth.

At seven thirty Minh goes to school. He has lunch at twelve. After school he always does his homework before dinner. He sometimes plays football in the park.

Minh never watches TV before homework. He eats dinner at six and goes to bed at nine.`,
});

export const listeningScriptMorning = buildListeningScript({
  title: "At Home in the Morning",
  setting: "A kitchen in the morning, light traffic outside",
  speakers: [
    { name: "Mum", role: "mother" },
    { name: "Minh", role: "boy, 9" },
  ],
  lines: [
    { speaker: "Mum", text: "Minh, wake up! It's six thirty." },
    { speaker: "Minh", text: "OK, Mum. I'm awake." },
    { speaker: "Mum", text: "Good. Have your breakfast before you get dressed." },
    { speaker: "Minh", text: "I always have rice and eggs for breakfast." },
    { speaker: "Mum", text: "Don't forget to brush your teeth." },
    { speaker: "Minh", text: "I never forget. School starts at seven thirty." },
    { speaker: "Mum", text: "That's right. Leave the house at seven fifteen." },
  ],
  audioNotes:
    "Clear mother-and-son dialogue, moderate pace with short pauses. Approx. 45 seconds.",
});

export const listeningScriptAfterSchool = buildListeningScript({
  title: "After School with Linh",
  setting: "School gate in the afternoon",
  speakers: [
    { name: "Minh", role: "boy, 9" },
    { name: "Linh", role: "girl, 9, classmate" },
  ],
  lines: [
    { speaker: "Linh", text: "Hi Minh! What do you do after school?" },
    { speaker: "Minh", text: "I always do my homework first. Then I sometimes play football." },
    { speaker: "Linh", text: "When do you have dinner?" },
    { speaker: "Minh", text: "At six o'clock. I never watch TV before homework." },
    { speaker: "Linh", text: "Me too. What time do you go to bed?" },
    { speaker: "Minh", text: "At nine. First I read a book, then I go to bed." },
    { speaker: "Linh", text: "Good routine! See you tomorrow." },
  ],
  audioNotes:
    "Friendly after-school chat between two children. Approx. 50 seconds.",
});

const MOVERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses present simple and adverbs of frequency correctly.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses routine words from the unit (meals, homework, wake up, etc.).",
  },
  organization: {
    weight: 0.2,
    criteria: "Ideas follow a logical daily order or answer all prompts clearly.",
  },
  taskAchievement: {
    weight: 0.2,
    criteria: "Meets minimum length and addresses the writing task.",
  },
};

/** Writing Check exercises — one per writing lesson (sortOrder 2). */
export const writingChecks = [
  buildWritingCheck({
    slug: "writing-morning-check",
    topicTag: TOPIC,
    title: "Check: Write About Your Morning",
    instructions: "Write a short note about what you do every morning. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note to your English teacher about your morning routine. Say when you wake up, what you eat, and one thing you always do.",
    prompts: [
      "When do you wake up?",
      "What do you have for breakfast?",
      "What do you always do before school?",
    ],
    minWords: 15,
    modelAnswerText:
      "I wake up at six thirty every day. I have breakfast with my family. I always brush my teeth and get dressed before school. I leave home at seven fifteen.",
    successCriteria: [
      "At least 15 words",
      "Mentions wake up time or breakfast",
      "Uses always, sometimes or never at least once",
      "Present simple verbs are mostly correct",
    ],
    autoCheckKeywords: ["wake", "breakfast", "always", "morning", "school"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-meals-check",
    topicTag: TOPIC,
    title: "Check: Write About Your Meals",
    instructions: "Write 2–3 sentences about your meals. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write 2–3 sentences about breakfast, lunch and dinner. Say where you have each meal and one food you like.",
    prompts: [
      "Where do you have breakfast?",
      "Where do you have lunch on school days?",
      "What time is dinner at your home?",
    ],
    minWords: 15,
    modelAnswerText:
      "I have breakfast at home with my family. At school I have lunch at twelve o'clock. We eat dinner at six. I sometimes help my mother after dinner.",
    successCriteria: [
      "At least 15 words",
      "Names breakfast, lunch or dinner",
      "Uses present simple correctly",
      "Sentences are connected (and, then, at)",
    ],
    autoCheckKeywords: ["breakfast", "lunch", "dinner", "home", "school"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-routine-check",
    topicTag: TOPIC,
    title: "Check: My Daily Routine",
    instructions: "Write about your full school day. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to a pen friend describing your school day from morning to bedtime. Include homework and one thing you never do.",
    prompts: [
      "What do you do after school?",
      "When do you do homework?",
      "What time do you go to bed?",
    ],
    minWords: 15,
    modelAnswerText:
      "Every day I wake up at six thirty and go to school at seven thirty. After school I always do my homework before dinner. I sometimes play football. I never watch TV before homework and I go to bed at nine.",
    successCriteria: [
      "At least 15 words",
      "Covers morning and evening routine",
      "Uses always, sometimes or never",
      "Logical order of events",
    ],
    autoCheckKeywords: ["homework", "always", "never", "school", "bed"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
];

const MOVERS_SPEAKING_CRITERIA = {
  pronunciation: "Routine words (breakfast, homework, always) are clear enough to understand.",
  fluency: "Answers are short but connected; brief pauses are acceptable.",
  grammar: "Uses present simple and frequency adverbs in short phrases.",
  vocabulary: "Uses daily routine vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-morning-check",
    topicTag: TOPIC,
    title: "Check: Talk About Your Morning",
    instructions: "Answer the questions about your morning routine. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about your morning habits before school.",
    sceneDescription:
      "Story outline: (1) child waking up with an alarm clock, (2) eating breakfast at a table, (3) brushing teeth in a bathroom, (4) walking to school with a bag.",
    followUpQuestions: [
      "What time do you wake up?",
      "What do you have for breakfast?",
      "Do you always brush your teeth before school?",
      "How do you go to school?",
      "What do you never do in the morning?",
    ],
    suggestedAnswers: [
      "I wake up at six thirty.",
      "I have rice and eggs.",
      "Yes, I always brush my teeth.",
      "I walk to school with my friend.",
      "I never watch TV in the morning.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-frequency-check",
    topicTag: TOPIC,
    title: "Check: How Often?",
    instructions: "Answer using always, sometimes or never. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks how often you do different activities.",
    sceneDescription:
      "A boy doing homework at a desk, playing football in a park, and watching TV — labels show always, sometimes, never.",
    followUpQuestions: [
      "Do you always do your homework after school?",
      "Do you sometimes play sport after homework?",
      "Do you ever watch TV before homework?",
      "Does your family always eat dinner together?",
      "What do you never do on school nights?",
    ],
    suggestedAnswers: [
      "Yes, I always do my homework first.",
      "I sometimes play football in the park.",
      "No, I never watch TV before homework.",
      "We always eat dinner at six.",
      "I never go to bed late on school nights.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-school-day-check",
    topicTag: TOPIC,
    title: "Check: Describe Your School Day",
    instructions: "Describe your day from morning to bedtime. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "Tell the examiner about your typical school day.",
    sceneDescription:
      "Timeline: wake up → school → lunch → homework → dinner → bed, with clock times for a Vietnamese primary student.",
    followUpQuestions: [
      "What time do you go to school?",
      "Where do you have lunch?",
      "What do you do after school?",
      "When do you have dinner?",
      "What time do you go to bed?",
    ],
    suggestedAnswers: [
      "I go to school at seven thirty.",
      "I have lunch at school at twelve.",
      "I do my homework and sometimes play with friends.",
      "We have dinner at six o'clock.",
      "I go to bed at nine.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  morning: {
    q1: "six thirty",
    q2: "breakfast",
    q3: "seven thirty",
  },
  afterSchool: {
    q1: "homework",
    q2: "six o'clock",
    q3: "nine",
  },
};
