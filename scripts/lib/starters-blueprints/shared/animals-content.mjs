/**
 * Starters Unit 4 — Animals
 * Shared content blocks for blueprint.
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "animals";

const {
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildWritingCheck,
  buildSpeakingCheck,
} = createCambridgeUnitBuilder("starters");

export const vocabularyBank = [
  {
    ...buildVocabWord({
      word: "cat",
      ipa: "/kæt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con mèo",
      exampleSentence: "Mai has a small cat.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mai có một con mèo nhỏ.",
  },
  {
    ...buildVocabWord({
      word: "dog",
      ipa: "/dɒɡ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con chó",
      exampleSentence: "The dog is big and brown.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Con chó to và màu nâu.",
  },
  {
    ...buildVocabWord({
      word: "bird",
      ipa: "/bɜːd/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con chim",
      exampleSentence: "The bird can fly.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Con chim có thể bay.",
  },
  {
    ...buildVocabWord({
      word: "fish",
      ipa: "/fɪʃ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con cá",
      exampleSentence: "Anna likes the fish in the pool.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Anna thích con cá trong bể.",
  },
  {
    ...buildVocabWord({
      word: "elephant",
      ipa: "/ˈelɪfənt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con voi",
      exampleSentence: "This is an elephant.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Đây là một con voi.",
  },
  {
    ...buildVocabWord({
      word: "monkey",
      ipa: "/ˈmʌŋki/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con khỉ",
      exampleSentence: "The monkey is Mai's favourite.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Con khỉ là con vật Mai thích nhất.",
  },
  {
    ...buildVocabWord({
      word: "bear",
      ipa: "/beə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con gấu",
      exampleSentence: "They see a big bear at the zoo.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Họ thấy một con gấu to ở sở thú.",
  },
  {
    ...buildVocabWord({
      word: "tiger",
      ipa: "/ˈtaɪɡə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con hổ",
      exampleSentence: "That tiger is far away.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Con hổ kia ở xa.",
  },
  {
    ...buildVocabWord({
      word: "rabbit",
      ipa: "/ˈræbɪt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con thỏ",
      exampleSentence: "The rabbit has long ears.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Con thỏ có tai dài.",
  },
  {
    ...buildVocabWord({
      word: "horse",
      ipa: "/hɔːs/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con ngựa",
      exampleSentence: "The horse runs fast.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Con ngựa chạy nhanh.",
  },
  {
    ...buildVocabWord({
      word: "lion",
      ipa: "/ˈlaɪən/",
      partOfSpeech: "noun",
      vietnameseMeaning: "con sư tử",
      exampleSentence: "Look at that lion!",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Nhìn con sư tử kia!",
  },
  {
    ...buildVocabWord({
      word: "zoo",
      ipa: "/zuː/",
      partOfSpeech: "noun",
      vietnameseMeaning: "sở thú",
      exampleSentence: "Mai goes to the zoo on Saturday.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mai đi sở thú vào thứ Bảy.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Demonstratives: this (near) / that (far)",
    explanation:
      "This = gần người nói (This is a cat). That = xa hơn (That tiger is far away).",
    examples: [
      "This is a cat.",
      "This is an elephant.",
      "That tiger is far away.",
      "Look at that lion!",
    ],
    commonMistakes: [
      "This is tiger (×) → This is a tiger (✓)",
      "That is near cat (×) → This is a cat (✓) — gần dùng this",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Plural nouns: regular -s (cat → cats, dog → dogs)",
    explanation:
      "Thêm -s để chỉ số nhiều: one cat, two cats. one dog, three dogs.",
    examples: [
      "one cat, two cats",
      "one dog, three dogs",
      "The birds are in the tree.",
      "They see monkeys at the zoo.",
    ],
    commonMistakes: [
      "two cat (×) → two cats (✓)",
      "three dog (×) → three dogs (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "This/that + is + animal; plural with are",
    explanation:
      "This is a dog. Those are birds. — số ít dùng is; số nhiều dùng are.",
    examples: [
      "This is my cat.",
      "That is a big bear.",
      "The monkeys are funny.",
      "The fish are in the pool.",
    ],
    commonMistakes: [
      "This are a cat (×) → This is a cat (✓)",
      "The monkey are small (×) → The monkey is small (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Recognise and use twelve Starters animal words including pets and zoo animals.",
    "Use this and that to point to animals near and far.",
    "Form regular plural nouns with -s (cats, dogs, birds).",
    "Read about Mai's pets and a zoo visit with Nam and Anna.",
    "Listen for animal words in dialogues at home and at the zoo.",
    "Write and speak short sentences about pets and zoo animals.",
  ],
};

export const passageMaiPetsAndZoo = buildPassage({
  title: "Mai's Pets and Zoo Visit",
  text: `Mai is eight. She has two pets at home — a cat and a dog.
The cat is small and black. The dog is big and brown.

On Saturday Mai goes to the zoo with her brother Nam and her friend Anna.
"This is an elephant," says Mai. That tiger is far away.
They see monkeys, bears and birds. Anna likes the fish in the pool.

Mai's favourite animal is the monkey. "Look at that lion!" says Nam.
They have a happy day at the zoo.`,
});

export const listeningScriptMaiPets = buildListeningScript({
  title: "Mai's Pets at Home",
  setting: "Mai's living room after school",
  speakers: [
    { name: "Mum", role: "adult" },
    { name: "Mai", role: "girl, 8" },
  ],
  lines: [
    { speaker: "Mum", text: "Where is your cat, Mai?" },
    { speaker: "Mai", text: "This is my cat. It is small and black." },
    { speaker: "Mum", text: "And your dog?" },
    { speaker: "Mai", text: "That is my dog. It is big and brown." },
    { speaker: "Mum", text: "Do you have two pets?" },
    { speaker: "Mai", text: "Yes! One cat and one dog." },
    { speaker: "Mum", text: "The bird is in the garden." },
    { speaker: "Mai", text: "Yes. I can see two birds in the tree." },
  ],
  audioNotes:
    "Clear, slow delivery with short pauses. Total duration approx. 35 seconds.",
});

export const listeningScriptZooVisit = buildListeningScript({
  title: "Zoo Visit with Anna and Nam",
  setting: "The zoo on Saturday afternoon",
  speakers: [
    { name: "Mai", role: "girl, 8" },
    { name: "Anna", role: "girl, friend" },
    { name: "Nam", role: "boy, brother" },
  ],
  lines: [
    { speaker: "Mai", text: "Look! This is an elephant." },
    { speaker: "Anna", text: "Wow! And that tiger is far away." },
    { speaker: "Nam", text: "I can see three monkeys!" },
    { speaker: "Mai", text: "The bears are big. I like the fish in the pool." },
    { speaker: "Anna", text: "Me too. The fish are orange." },
    { speaker: "Nam", text: "Look at that lion! It is sleeping." },
    { speaker: "Mai", text: "My favourite is the monkey. The zoo is fun!" },
  ],
  audioNotes: "Clear, slow delivery. Approx. 35 seconds.",
});

const STARTERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Dùng this/that hoặc số nhiều -s đúng.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Dùng từ động vật trong unit.",
  },
  organization: {
    weight: 0.2,
    criteria: "Câu ngắn rõ ràng; trả lời đủ phần.",
  },
  taskAchievement: {
    weight: 0.2,
    criteria: "Hoàn thành nhiệm vụ; tối thiểu 5 từ (Starters).",
  },
};

export const writingChecks = [
  buildWritingCheck({
    slug: "writing-pets-check",
    topicTag: TOPIC,
    title: "Check: Write About Your Pets",
    instructions: "Write short answers. Use 1–5 words for each answer.",
    sortOrder: 2,
    taskDescription:
      "Write about pets using animal words from the unit.",
    prompts: [
      "1. Write one pet word (cat, dog, bird…).",
      "2. Write: This is my _____.",
      "3. Write: I have two _____. (plural)",
    ],
    minWords: 5,
    modelAnswerText: "cat This is my cat. I have two cats.",
    successCriteria: [
      "Uses at least one animal word",
      "Uses this or a plural -s form",
      "Spelling of core words is recognisable",
    ],
    autoCheckKeywords: [
      "cat",
      "dog",
      "bird",
      "fish",
      "This",
      "is",
      "my",
      "have",
      "two",
      "cats",
      "dogs",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-zoo-check",
    topicTag: TOPIC,
    title: "Check: Write About the Zoo",
    instructions: "Write short answers about the zoo visit.",
    sortOrder: 2,
    taskDescription:
      "Write about animals at the zoo from the reading text.",
    prompts: [
      "1. Where do Mai, Nam and Anna go? (Write: zoo)",
      "2. Write: This is an _____. (elephant or monkey)",
      "3. Write: That _____ is far away. (tiger or lion)",
    ],
    minWords: 5,
    modelAnswerText: "zoo This is an elephant. That tiger is far away.",
    successCriteria: [
      "All three prompts answered",
      "Uses zoo or animal words",
      "Uses this or that correctly",
    ],
    autoCheckKeywords: [
      "zoo",
      "elephant",
      "monkey",
      "tiger",
      "lion",
      "bear",
      "This",
      "That",
      "is",
      "an",
      "far",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-plural-animals-check",
    topicTag: TOPIC,
    title: "Check: Write Plural Animals",
    instructions: "Write short phrases with plural -s.",
    sortOrder: 2,
    taskDescription:
      "Write short phrases using plural animal nouns (cats, dogs, birds).",
    prompts: [
      "1. Write: two _____ (add -s)",
      "2. Write: three _____ (add -s)",
      "3. Write: The _____ are in the tree. (birds or monkeys)",
    ],
    minWords: 5,
    modelAnswerText: "two cats three dogs The birds are in the tree.",
    successCriteria: [
      "Uses plural -s on animal nouns",
      "Uses unit vocabulary",
      "Short clear phrases",
    ],
    autoCheckKeywords: [
      "cats",
      "dogs",
      "birds",
      "monkeys",
      "fish",
      "two",
      "three",
      "The",
      "are",
      "in",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
];

const STARTERS_SPEAKING_CRITERIA = {
  pronunciation:
    "Từ động vật (cat, dog, elephant…) nghe được rõ.",
  fluency: "Trả lời bằng từ hoặc cụm ngắn; không im lặng quá lâu.",
  grammar: "Dùng this/that hoặc số nhiều -s trong ít nhất hai câu trả lời.",
  vocabulary: "Dùng ít nhất ba từ vựng unit đúng nghĩa.",
};

const MAI_PETS_SCENE =
  "Scene: Mai's home after school. Mai is eight. She has a small black cat and a big brown dog. Two birds are in the tree in the garden. Her brother Nam is nearby. Her friend Anna visits sometimes.";

const MAI_ZOO_SCENE =
  "Scene: The zoo on Saturday. Mai, her brother Nam and her friend Anna walk around. They see an elephant near them. A tiger is far away. Three monkeys play. Big bears stand near a pool with orange fish. A lion sleeps. Mai's favourite animal is the monkey.";

export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-pets-check",
    topicTag: TOPIC,
    title: "Check: Talk About Your Pets",
    instructions:
      "Answer the examiner's questions. Say at least one word for each question.",
    sortOrder: 2,
    prompt:
      "The examiner will ask you about pets at home. Answer in short phrases.",
    sceneDescription: MAI_PETS_SCENE,
    followUpQuestions: [
      "Do you have a pet?",
      "What is this animal — a cat or a dog?",
      "What colour is your cat?",
      "How many pets do you have?",
      "Say one sentence: This is my _____.",
    ],
    suggestedAnswers: [
      "Yes.",
      "A cat.",
      "Black.",
      "Two.",
      "This is my dog.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-zoo-check",
    topicTag: TOPIC,
    title: "Check: Talk About the Zoo",
    instructions: "Answer about animals at the zoo.",
    sortOrder: 2,
    prompt:
      "Read the scene about the zoo visit. The examiner asks about the animals.",
    sceneDescription: MAI_ZOO_SCENE,
    followUpQuestions: [
      "Where are Mai, Nam and Anna?",
      "What animal is near Mai? Say: This is…",
      "What animal is far away?",
      "What is Mai's favourite animal?",
      "Say: Look at that _____!",
    ],
    suggestedAnswers: [
      "At the zoo.",
      "This is an elephant.",
      "The tiger.",
      "The monkey.",
      "Look at that lion!",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-plural-animals-check",
    topicTag: TOPIC,
    title: "Check: Plural Animals Speaking",
    instructions: "Answer the examiner's questions in short phrases.",
    sortOrder: 2,
    prompt:
      "The examiner asks about more than one animal. Use plural -s.",
    sceneDescription: MAI_ZOO_SCENE,
    followUpQuestions: [
      "How many monkeys can Nam see?",
      "What are in the tree at Mai's home?",
      "Are the fish in the pool?",
      "Say: two _____ (plural animal)",
      "Say: The _____ are big. (bears or elephants)",
    ],
    suggestedAnswers: [
      "Three.",
      "Birds.",
      "Yes.",
      "Two cats.",
      "The bears are big.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
];

export const listeningAnswerKeys = {
  maiPets: {
    q1: "cat",
    q2: "dog",
    q3: "two",
    q4: "birds",
    q5: "black",
  },
  zooVisit: {
    q1: "elephant",
    q2: "tiger",
    q3: "monkeys",
    q4: "fish",
    q5: "lion",
  },
};
