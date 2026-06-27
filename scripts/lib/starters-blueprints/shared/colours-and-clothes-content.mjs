/**
 * Starters Unit 3 — Colours and Clothes
 * Shared content blocks for blueprint.
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "colours-and-clothes";

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
      word: "red",
      ipa: "/red/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "màu đỏ",
      exampleSentence: "My shirt is red.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Áo sơ mi của tôi màu đỏ.",
  },
  {
    ...buildVocabWord({
      word: "blue",
      ipa: "/bluː/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "màu xanh dương",
      exampleSentence: "Nam's shoes are blue.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Giày của Nam màu xanh dương.",
  },
  {
    ...buildVocabWord({
      word: "green",
      ipa: "/ɡriːn/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "màu xanh lá",
      exampleSentence: "Mai's dress is green.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Váy của Mai màu xanh lá.",
  },
  {
    ...buildVocabWord({
      word: "yellow",
      ipa: "/ˈjeləʊ/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "màu vàng",
      exampleSentence: "Anna has a yellow hat.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Anna có mũ màu vàng.",
  },
  {
    ...buildVocabWord({
      word: "black",
      ipa: "/blæk/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "màu đen",
      exampleSentence: "The shoes are black.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Đôi giày màu đen.",
  },
  {
    ...buildVocabWord({
      word: "white",
      ipa: "/waɪt/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "màu trắng",
      exampleSentence: "Mai wears a white hat.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mai đội mũ màu trắng.",
  },
  {
    ...buildVocabWord({
      word: "shirt",
      ipa: "/ʃɜːt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "áo sơ mi",
      exampleSentence: "Put on your red shirt.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mặc áo sơ mi đỏ vào.",
  },
  {
    ...buildVocabWord({
      word: "trousers",
      ipa: "/ˈtraʊzəz/",
      partOfSpeech: "noun",
      vietnameseMeaning: "quần dài",
      exampleSentence: "My trousers are blue.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Quần của tôi màu xanh dương.",
  },
  {
    ...buildVocabWord({
      word: "dress",
      ipa: "/dres/",
      partOfSpeech: "noun",
      vietnameseMeaning: "váy",
      exampleSentence: "Her dress is green.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Váy của cô ấy màu xanh lá.",
  },
  {
    ...buildVocabWord({
      word: "shoes",
      ipa: "/ʃuːz/",
      partOfSpeech: "noun",
      vietnameseMeaning: "giày",
      exampleSentence: "My shoes are yellow.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Giày của tôi màu vàng.",
  },
  {
    ...buildVocabWord({
      word: "hat",
      ipa: "/hæt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "mũ",
      exampleSentence: "Anna's hat is yellow.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mũ của Anna màu vàng.",
  },
  {
    ...buildVocabWord({
      word: "jacket",
      ipa: "/ˈdʒækɪt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "áo khoác",
      exampleSentence: "Mai has a black jacket.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mai có áo khoác màu đen.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Adjective + noun order: a red shirt",
    explanation:
      "Trong tiếng Anh, màu sắc đứng TRƯỚC danh từ: a red shirt, blue trousers, a green dress.",
    examples: ["a red shirt", "blue trousers", "a white hat", "black shoes"],
    commonMistakes: [
      "a shirt red (×) → a red shirt (✓)",
      "trousers blue (×) → blue trousers (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Verb be for description: It is / They are + adjective",
    explanation:
      "Dùng is/are + màu để mô tả: It is green (váy). They are blue (giày — số nhiều).",
    examples: [
      "It is green.",
      "My dress is yellow.",
      "The shoes are black.",
      "They are blue.",
    ],
    commonMistakes: [
      "The shoes is green (×) → The shoes are green (✓)",
      "It are red (×) → It is red (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "What colour is…?",
    explanation:
      "What colour is your dress? — hỏi màu. Trả lời: It is green. / My dress is green.",
    examples: [
      "What colour is your hat?",
      "It is white.",
      "What colour are your shoes?",
      "They are yellow.",
    ],
    commonMistakes: [
      "What colour are your dress? (×) → What colour is your dress? (✓)",
      "It green is (×) → It is green (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Recognise and use twelve Starters colour and clothes words.",
    "Use adjective + noun order in short phrases (a red shirt, blue trousers).",
    "Describe clothes with It is / They are + colour.",
    "Read about Mai getting dressed and match colours to clothes.",
    "Listen for colour and clothes words in dialogues with Mum.",
    "Write and speak short sentences about clothes and colours.",
  ],
};

export const passageMaiGettingDressed = buildPassage({
  title: "Mai Getting Dressed",
  text: `Mai wakes up on a sunny morning. She opens her cupboard.

Mai has a red shirt and blue trousers. She puts on a green dress.
Her shoes are yellow. She wears a white hat and a black jacket.

"What colour is your dress?" asks Mum. "It is green!" says Mai.

Her brother Nam has blue shoes. Her friend Anna wears a yellow hat.
They look at Mai. "You look nice!" says Anna. Mai is happy!`,
});

export const listeningScriptGettingDressed = buildListeningScript({
  title: "Mai Getting Dressed",
  setting: "Mai's bedroom in the morning",
  speakers: [
    { name: "Mum", role: "adult" },
    { name: "Mai", role: "girl, 8" },
  ],
  lines: [
    { speaker: "Mum", text: "Put on your red shirt, Mai." },
    { speaker: "Mai", text: "OK, Mum. And my blue trousers?" },
    { speaker: "Mum", text: "Yes. Your shoes are green." },
    { speaker: "Mai", text: "What colour is my dress?" },
    { speaker: "Mum", text: "Your dress is yellow." },
    { speaker: "Mai", text: "Is my hat white?" },
    { speaker: "Mum", text: "Yes. It is white." },
    { speaker: "Mai", text: "My jacket is black. I am ready!" },
  ],
  audioNotes:
    "Clear, slow delivery with short pauses. Total duration approx. 35 seconds.",
});

export const listeningScriptClothesShopping = buildListeningScript({
  title: "Clothes Shopping with Mum",
  setting: "A clothes shop on Saturday",
  speakers: [
    { name: "Mum", role: "adult" },
    { name: "Mai", role: "girl, 8" },
  ],
  lines: [
    { speaker: "Mum", text: "Look at this blue jacket, Mai." },
    { speaker: "Mai", text: "I like the yellow shirt." },
    { speaker: "Mum", text: "The shoes are black. Do you like them?" },
    { speaker: "Mai", text: "Yes! And the red hat is nice." },
    { speaker: "Mum", text: "We buy white trousers too." },
    { speaker: "Mai", text: "Thank you, Mum! My dress is green at home." },
    { speaker: "Mum", text: "You have many colours today!" },
  ],
  audioNotes: "Clear, slow delivery. Approx. 30 seconds.",
});

const STARTERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Dùng is/are + màu hoặc màu + danh từ đúng thứ tự.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Dùng từ màu và quần áo trong unit.",
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
    slug: "writing-clothes-colour-check",
    topicTag: TOPIC,
    title: "Check: Write About Your Clothes",
    instructions: "Write short answers. Use 1–5 words for each answer.",
    sortOrder: 2,
    taskDescription:
      "Write about your clothes and their colours using words from the unit.",
    prompts: [
      "1. Write one clothes word (shirt, dress, shoes…).",
      "2. Write its colour: My _____ is _____.",
      "3. Write: My shoes are _____.",
    ],
    minWords: 5,
    modelAnswerText: "shirt red My shirt is red. My shoes are blue.",
    successCriteria: [
      "Uses at least one clothes word",
      "Uses at least one colour word",
      "Uses is or are correctly",
      "Spelling of core words is recognisable",
    ],
    autoCheckKeywords: [
      "shirt",
      "dress",
      "shoes",
      "trousers",
      "hat",
      "jacket",
      "red",
      "blue",
      "green",
      "yellow",
      "black",
      "white",
      "is",
      "are",
      "My",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-mais-outfit-check",
    topicTag: TOPIC,
    title: "Check: Write About Mai's Outfit",
    instructions: "Write short answers about Mai's clothes.",
    sortOrder: 2,
    taskDescription:
      "Write about Mai's clothes from the reading text. Use colour + clothes words.",
    prompts: [
      "1. What colour is Mai's dress? (Write: green / yellow / red)",
      "2. What colour are Mai's shoes? (Write: They are _____.)",
      "3. Write one sentence: Mai has a _____ jacket.",
    ],
    minWords: 5,
    modelAnswerText: "green They are yellow. Mai has a black jacket.",
    successCriteria: [
      "All three prompts answered",
      "Uses colours from the text",
      "Uses a clothes word correctly",
    ],
    autoCheckKeywords: [
      "green",
      "yellow",
      "red",
      "blue",
      "black",
      "white",
      "dress",
      "shoes",
      "jacket",
      "Mai",
      "They",
      "are",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-adjective-noun-check",
    topicTag: TOPIC,
    title: "Check: Write Colour + Clothes",
    instructions: "Write short phrases with colour before the noun.",
    sortOrder: 2,
    taskDescription:
      "Write short phrases using adjective + noun order (a red shirt, blue trousers).",
    prompts: [
      "1. Write: a _____ shirt (colour + shirt)",
      "2. Write: _____ trousers (colour + trousers)",
      "3. Write: It is _____. (one colour word)",
    ],
    minWords: 5,
    modelAnswerText: "a red shirt blue trousers It is green.",
    successCriteria: [
      "Colour comes before noun in phrases",
      "Uses unit vocabulary",
      "It is + colour for one item",
    ],
    autoCheckKeywords: [
      "red",
      "blue",
      "green",
      "yellow",
      "black",
      "white",
      "shirt",
      "trousers",
      "hat",
      "It",
      "is",
      "a",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
];

const STARTERS_SPEAKING_CRITERIA = {
  pronunciation:
    "Từ màu (red, blue, green…) và quần áo (shirt, dress, shoes…) nghe được rõ.",
  fluency: "Trả lời bằng từ hoặc cụm ngắn; không im lặng quá lâu.",
  grammar: "Dùng is/are + màu hoặc màu + danh từ trong ít nhất hai câu trả lời.",
  vocabulary: "Dùng ít nhất ba từ vựng unit đúng nghĩa.",
};

const MAI_DRESSED_SCENE =
  "Scene: Mai's bedroom on a sunny morning. Mai is eight. She has a red shirt, blue trousers, a green dress, yellow shoes, a white hat and a black jacket. Her brother Nam has blue shoes. Her friend Anna wears a yellow hat. Mum helps Mai get dressed.";

export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-clothes-colour-check",
    topicTag: TOPIC,
    title: "Check: Talk About Your Clothes",
    instructions:
      "Answer the examiner's questions. Say at least one word for each question.",
    sortOrder: 2,
    prompt:
      "The examiner will ask you about your clothes and colours. Answer in short phrases.",
    sceneDescription: MAI_DRESSED_SCENE,
    followUpQuestions: [
      "What colour is your shirt?",
      "What are you wearing on your feet?",
      "Do you have a hat? What colour is it?",
      "What colour are your trousers or dress?",
      "Say one sentence: My shoes are _____.",
    ],
    suggestedAnswers: [
      "Red.",
      "Shoes.",
      "Yes. It is white.",
      "Blue.",
      "My shoes are yellow.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-mais-outfit-check",
    topicTag: TOPIC,
    title: "Check: Describe Mai's Clothes",
    instructions: "Answer about Mai's outfit from the scene.",
    sortOrder: 2,
    prompt:
      "Read the scene about Mai getting dressed. The examiner asks about her clothes.",
    sceneDescription: MAI_DRESSED_SCENE,
    followUpQuestions: [
      "What colour is Mai's dress?",
      "What colour are Mai's shoes?",
      "What colour is Mai's hat?",
      "What colour is Mai's jacket?",
      "What does Mai put on first — shirt or shoes?",
    ],
    suggestedAnswers: [
      "Green.",
      "Yellow.",
      "White.",
      "Black.",
      "Shirt.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-shopping-colours-check",
    topicTag: TOPIC,
    title: "Check: Clothes Shopping Speaking",
    instructions: "Answer the examiner's questions in short phrases.",
    sortOrder: 2,
    prompt:
      "The examiner asks about clothes and colours at a shop with Mai and Mum.",
    sceneDescription:
      "Scene: Mai and Mum are at a clothes shop. Mum shows a blue jacket. Mai likes a yellow shirt. The shoes are black. There is a red hat. They buy white trousers. Mai's dress at home is green.",
    followUpQuestions: [
      "What colour is the jacket?",
      "What does Mai like — the shirt or the shoes?",
      "What colour are the shoes in the shop?",
      "What colour is the hat?",
      "Say: I like the _____ shirt.",
    ],
    suggestedAnswers: [
      "Blue.",
      "The shirt.",
      "Black.",
      "Red.",
      "I like the yellow shirt.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
];

export const listeningAnswerKeys = {
  gettingDressed: {
    q1: "red",
    q2: "blue",
    q3: "green",
    q4: "yellow",
    q5: "white",
  },
  clothesShopping: {
    q1: "blue",
    q2: "yellow",
    q3: "black",
    q4: "red",
    q5: "white",
  },
};
