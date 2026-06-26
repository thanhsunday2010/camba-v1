/**
 * Starters Unit 1 — Family and Friends
 * Shared content blocks for blueprint (Phase 1).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "family-and-friends";

const {
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildWritingCheck,
  buildSpeakingCheck,
} = createCambridgeUnitBuilder("starters");

export const vocabularyBank = [
  buildVocabWord({
    word: "father",
    ipa: "/ˈfɑːðə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bố, cha",
    exampleSentence: "This is my father.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "mother",
    ipa: "/ˈmʌðə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "mẹ",
    exampleSentence: "My mother is kind.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "brother",
    ipa: "/ˈbrʌðə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "anh/em trai",
    exampleSentence: "I have one brother.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "sister",
    ipa: "/ˈsɪstə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "chị/em gái",
    exampleSentence: "Her sister is seven.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "friend",
    ipa: "/frend/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bạn",
    exampleSentence: "Tom is my friend.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "boy",
    ipa: "/bɔɪ/",
    partOfSpeech: "noun",
    vietnameseMeaning: "cậu bé, con trai",
    exampleSentence: "The boy is happy.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "girl",
    ipa: "/ɡɜːl/",
    partOfSpeech: "noun",
    vietnameseMeaning: "cô bé, con gái",
    exampleSentence: "She is a girl.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "head",
    ipa: "/hed/",
    partOfSpeech: "noun",
    vietnameseMeaning: "đầu",
    exampleSentence: "Touch your head.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "eyes",
    ipa: "/aɪz/",
    partOfSpeech: "noun",
    vietnameseMeaning: "mắt",
    exampleSentence: "Her eyes are brown.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "nose",
    ipa: "/nəʊz/",
    partOfSpeech: "noun",
    vietnameseMeaning: "mũi",
    exampleSentence: "His nose is small.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "mouth",
    ipa: "/maʊθ/",
    partOfSpeech: "noun",
    vietnameseMeaning: "miệng",
    exampleSentence: "Open your mouth.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "hair",
    ipa: "/heə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "tóc",
    exampleSentence: "My hair is black.",
    difficulty: 1,
    topic: TOPIC,
  }),
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Verb be: am, is, are",
    explanation:
      "Dùng am với I; is với he, she, it và danh từ số ít; are với you, we, they và danh từ số nhiều.",
    examples: ["I am Mai.", "He is my brother.", "They are my friends."],
    commonMistakes: [
      "I is happy (×) → I am happy (✓)",
      "She are my sister (×) → She is my sister (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Possessive adjectives: my, your, his, her",
    explanation:
      "Tính từ sở hữu đứng trước danh từ để chỉ ai sở hữu: my father, her eyes.",
    examples: ["my father", "your friend", "his sister", "her mother"],
    commonMistakes: [
      "he mother (×) → his mother (✓)",
      "she friend (×) → her friend (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Question word: who",
    explanation: "Dùng who để hỏi về người. What hỏi về vật; where hỏi về nơi chốn.",
    examples: ["Who is he?", "Who is your friend?"],
    commonMistakes: [
      "What is he? (khi hỏi danh tính) → Who is he? (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name family members and friends using twelve Starters vocabulary words.",
    "Use am, is and are to describe people at Pre-A1 level.",
    "Use possessive adjectives my, your, his and her before family nouns.",
    "Answer who-questions about people in scene descriptions and short texts.",
    "Read Mai's family text and listen for names and relationships.",
    "Write and speak short answers about yourself, family and friends.",
  ],
};

export const passageMaiFamily = buildPassage({
  title: "Mai's Family",
  text: `Hello! My name is Mai. I am eight years old. This is my family photo.

My father is tall. His hair is black. My mother is kind. Her eyes are brown.

I have one brother. His name is Nam. He is a boy. He is six. We have a friend. Her name is Anna. She is a girl in our class.

We are happy!`,
export const listeningScriptAtHome = buildListeningScript({
  title: "At Home",
  setting: "A living room after school",
  speakers: [
    { name: "Examiner", role: "adult" },
    { name: "Minh", role: "boy, 8" },
  ],
  lines: [
    { speaker: "Examiner", text: "Hello, Minh. Who is this?" },
    { speaker: "Minh", text: "This is my mother." },
    { speaker: "Examiner", text: "And who is the boy?" },
    { speaker: "Minh", text: "He is my brother. His name is Duc." },
    { speaker: "Examiner", text: "Is the girl your sister?" },
    { speaker: "Minh", text: "No. She is my friend. Her name is Lily." },
  ],
  audioNotes:
    "Clear, slow delivery with short pauses. Total duration approx. 35 seconds.",
});

export const listeningScriptAtSchool = buildListeningScript({
  title: "At School",
  setting: "School playground",
  speakers: [
    { name: "Teacher", role: "adult" },
    { name: "Hoa", role: "girl, 7" },
  ],
  lines: [
    { speaker: "Teacher", text: "Hello, Hoa. Who is the girl with you?" },
    { speaker: "Hoa", text: "She is my sister. Her name is Lan." },
    { speaker: "Teacher", text: "And who is the man?" },
    { speaker: "Hoa", text: "He is my father." },
    { speaker: "Teacher", text: "Is the boy your brother?" },
    { speaker: "Hoa", text: "Yes. He is my brother. He is a boy." },
  ],
  audioNotes: "Clear, slow delivery. Approx. 30 seconds.",
});

const STARTERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Dùng am/is/are và my/his/her đúng trong câu ngắn.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Dùng từ gia đình và bạn bè trong unit.",
  },
  organization: {
    weight: 0.2,
    criteria: "Trả lời đúng thứ tự câu hỏi; câu rõ ràng.",
  },
  taskAchievement: {
    weight: 0.2,
    criteria: "Hoàn thành đủ phần; độ dài phù hợp Starters (tối thiểu 5 từ).",
  },
};

export const writingChecks = [
  buildWritingCheck({
    slug: "writing-introduce-family-check",
    topicTag: TOPIC,
    title: "Check: Write About My Family",
    instructions: "Write short answers. Use 1–5 words for each answer.",
    sortOrder: 2,
    taskDescription:
      "Read the scene about a family. Write short answers to the three questions.",
    prompts: [
      "1. What is your name?",
      "2. Who is the woman? (Write: my mother / my sister / my friend)",
      "3. Write one sentence: My _____ is _____. (Use father, mother, brother, sister or friend)",
    ],
    minWords: 5,
    modelAnswerText: "My name is Mai. my mother My brother is Nam.",
    successCriteria: [
      "All three prompts are answered",
      "Uses at least two unit vocabulary words",
      "Uses am, is or are correctly in the sentence",
      "Spelling of core words is recognisable",
    ],
    autoCheckKeywords: [
      "my",
      "name",
      "mother",
      "father",
      "brother",
      "sister",
      "friend",
      "is",
      "am",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-family-sentences-check",
    topicTag: TOPIC,
    title: "Check: Write About Family",
    instructions: "Write short answers. Use 1–5 words each.",
    sortOrder: 2,
    taskDescription:
      "Write short answers about your family. Use words from the unit.",
    prompts: [
      "1. What is your name?",
      "2. Who is your mother? (Write: my mother)",
      "3. Write one sentence: My _____ is _____. (Use father, brother or sister)",
    ],
    minWords: 5,
    modelAnswerText: "My name is Mai. my mother My brother is Nam.",
    successCriteria: [
      "All three prompts answered",
      "Uses my before a family noun",
      "Uses is correctly",
    ],
    autoCheckKeywords: [
      "my",
      "name",
      "mother",
      "father",
      "brother",
      "sister",
      "is",
      "am",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-friend-check",
    topicTag: TOPIC,
    title: "Check: Write About a Friend",
    instructions: "Write short answers about a friend.",
    sortOrder: 2,
    taskDescription: "Write about your friend using short answers.",
    prompts: [
      "1. What is your friend's name?",
      "2. Is your friend a boy or a girl?",
      "3. Write: _____ is my friend.",
    ],
    minWords: 5,
    modelAnswerText: "Her name is Anna. a girl She is my friend.",
    successCriteria: [
      "All prompts answered",
      "Uses friend and boy or girl",
      "Uses is and my/his/her",
    ],
    autoCheckKeywords: ["friend", "boy", "girl", "my", "is", "Her", "His", "She", "He"],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
];

const STARTERS_SPEAKING_CRITERIA = {
  pronunciation:
    "Từ gia đình (mother, father, brother, sister, friend) nghe được rõ.",
  fluency: "Trả lời bằng từ hoặc cụm ngắn; không im lặng quá lâu.",
  grammar: "Dùng am/is/are hoặc my/his/her trong ít nhất hai câu trả lời.",
  vocabulary: "Dùng ít nhất ba từ vựng unit đúng nghĩa.",
};

const FAMILY_PICTURE =
  "Scene: a mother, father, two children and a friend in a garden.";

export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-family-interview-check",
    topicTag: TOPIC,
    title: "Check: Family Interview",
    instructions:
      "Answer the examiner's questions. Say at least one word for each question.",
    sortOrder: 2,
    prompt:
      "The examiner will ask you about you and your family. Look at your family photo if you have one.",
    sceneDescription: FAMILY_PICTURE,
    followUpQuestions: [
      "What is your name?",
      "How old are you?",
      "Who is he/she in the picture?",
      "Is he/she your brother, sister or friend?",
      "What colour is your mother's or your friend's hair?",
    ],
    suggestedAnswers: [
      "My name is Mai.",
      "I am eight.",
      "He is my father.",
      "She is my friend.",
      "Her hair is black.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-picture-check",
    topicTag: TOPIC,
    title: "Check: Picture Interview",
    instructions: "Answer about people in the scene.",
    sortOrder: 2,
    prompt: "Read the scene below about a family. The examiner asks about the people.",
    sceneDescription: FAMILY_PICTURE,
    followUpQuestions: [
      "Who is the woman?",
      "Who is the boy?",
      "Is the girl your sister or your friend?",
      "What do you say about your father?",
    ],
    suggestedAnswers: [
      "She is my mother.",
      "He is my brother.",
      "She is my sister.",
      "He is my father.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-situational-check",
    topicTag: TOPIC,
    title: "Check: Situational Speaking",
    instructions: "Answer the examiner's questions in short phrases.",
    sortOrder: 2,
    prompt:
      "The examiner asks everyday questions about you, your family and friends.",
    sceneDescription: FAMILY_PICTURE,
    followUpQuestions: [
      "What is your name?",
      "Who is he in the picture?",
      "Who is your best friend?",
      "How old is your brother or sister?",
      "Say one sentence about your family.",
    ],
    suggestedAnswers: [
      "My name is Mai.",
      "He is my father.",
      "Anna is my friend.",
      "He is six.",
      "My mother is kind.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
];

export const listeningAnswerKeys = {
  atHome: {
    q1: "mother",
    q2: "brother",
    q3: "friend",
    q4: "Duc",
    q5: "Lily",
  },
  atSchool: {
    q1: "sister",
    q2: "father",
    q3: "brother",
    q4: "Lan",
    q5: "boy",
  },
};
