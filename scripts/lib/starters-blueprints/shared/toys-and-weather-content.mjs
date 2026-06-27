/**
 * Starters Unit 5 — Toys and Weather
 * Shared content blocks for blueprint.
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "toys-and-weather";

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
      word: "doll",
      ipa: "/dɒl/",
      partOfSpeech: "noun",
      vietnameseMeaning: "búp bê",
      exampleSentence: "Anna likes her doll.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Anna thích búp bê của cô ấy.",
  },
  {
    ...buildVocabWord({
      word: "kite",
      ipa: "/kaɪt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "diều",
      exampleSentence: "Mai flies her kite outside.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mai thả diều ngoài trời.",
  },
  {
    ...buildVocabWord({
      word: "teddy",
      ipa: "/ˈtedi/",
      partOfSpeech: "noun",
      vietnameseMeaning: "gấu bông",
      exampleSentence: "This is my teddy.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Đây là gấu bông của tôi.",
  },
  {
    ...buildVocabWord({
      word: "robot",
      ipa: "/ˈrəʊbɒt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "người máy (đồ chơi)",
      exampleSentence: "Nam has a red robot.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Nam có một người máy màu đỏ.",
  },
  {
    ...buildVocabWord({
      word: "puzzle",
      ipa: "/ˈpʌzl/",
      partOfSpeech: "noun",
      vietnameseMeaning: "xếp hình",
      exampleSentence: "They do a puzzle inside.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Họ chơi xếp hình trong nhà.",
  },
  {
    ...buildVocabWord({
      word: "balloon",
      ipa: "/bəˈluːn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "bóng bay",
      exampleSentence: "Anna has a blue balloon.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Anna có một quả bóng bay màu xanh.",
  },
  {
    ...buildVocabWord({
      word: "sunny",
      ipa: "/ˈsʌni/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "nắng, có nắng",
      exampleSentence: "It is sunny today.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Hôm nay trời nắng.",
  },
  {
    ...buildVocabWord({
      word: "rainy",
      ipa: "/ˈreɪni/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "có mưa, trời mưa",
      exampleSentence: "It is rainy and windy.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Trời mưa và có gió.",
  },
  {
    ...buildVocabWord({
      word: "cloud",
      ipa: "/klaʊd/",
      partOfSpeech: "noun",
      vietnameseMeaning: "mây",
      exampleSentence: "Look at the clouds!",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Nhìn những đám mây kia!",
  },
  {
    ...buildVocabWord({
      word: "wind",
      ipa: "/wɪnd/",
      partOfSpeech: "noun",
      vietnameseMeaning: "gió",
      exampleSentence: "The wind is strong.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Gió mạnh.",
  },
  {
    ...buildVocabWord({
      word: "cloudy",
      ipa: "/ˈklaʊdi/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "có mây, nhiều mây",
      exampleSentence: "It is sunny and cloudy.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Trời nắng và có mây.",
  },
  {
    ...buildVocabWord({
      word: "windy",
      ipa: "/ˈwɪndi/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "có gió, nhiều gió",
      exampleSentence: "It is rainy and windy.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Trời mưa và có gió.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "It's + weather adjective: It's sunny / It's rainy",
    explanation:
      "It is (It's) + tính từ thời tiết để mô tả trời: It's sunny. It's rainy and windy.",
    examples: [
      "It's sunny today.",
      "It's rainy and windy.",
      "It's cloudy.",
      "Look outside! It's windy.",
    ],
    commonMistakes: [
      "They is sunny (×) → It's sunny (✓)",
      "It sunny (×) → It's sunny (✓) — cần is",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Plural nouns: two kites, three balloons",
    explanation:
      "Thêm -s sau số lớn hơn một: one kite, two kites. one balloon, two balloons.",
    examples: [
      "one kite, two kites",
      "I have two balloons.",
      "Those puzzles are fun.",
      "These are my toys.",
    ],
    commonMistakes: [
      "two kite (×) → two kites (✓)",
      "three balloon (×) → three balloons (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Demonstratives: these (near, plural) / those (far, plural)",
    explanation:
      "These = nhiều vật gần (These are my toys). Those = nhiều vật xa hơn (Those balloons are on the chair).",
    examples: [
      "These are my toys.",
      "These are my favourite toys.",
      "Those balloons are red and blue.",
      "That kite is by the door.",
    ],
    commonMistakes: [
      "These is my toys (×) → These are my toys (✓)",
      "Those is balloons (×) → Those balloons are… (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Recognise and use twelve Starters toy and weather words.",
    "Describe the weather with It's + adjective (sunny, rainy, windy, cloudy).",
    "Form plural toy nouns with -s (kites, balloons, puzzles).",
    "Use these and those for toys near and far.",
    "Read about Mai's rainy day indoors and flying a kite outside.",
    "Listen for toy and weather words with Mai, Nam, Anna and parents.",
    "Write and speak short sentences about toys and weather.",
  ],
};

export const passageMaiToysAndRain = buildPassage({
  title: "Mai's Toys and Rainy Day",
  text: `Mai is eight. It is a rainy and windy day. Mai, her brother Nam and her friend Anna stay inside.
Mai plays with her teddy and her doll. Nam has a robot and a puzzle.
"These are my toys," says Mai. "Those balloons are on the chair."

Mum looks out of the window. "Look at the clouds!" she says. They do a puzzle together.
When the sun comes out, it is sunny and cloudy. Dad says, "You can fly your kite outside!"
Mai runs into the garden with her red kite. The wind is strong. Anna has a blue balloon.
They have a happy day with their toys and the weather.`,
});

export const listeningScriptMaiToys = buildListeningScript({
  title: "Mai's Favourite Toys",
  setting: "Mai's living room on a rainy day",
  speakers: [
    { name: "Mum", role: "adult" },
    { name: "Mai", role: "girl, 8" },
  ],
  lines: [
    { speaker: "Mum", text: "What are your favourite toys, Mai?" },
    { speaker: "Mai", text: "These are my favourite toys. I like my teddy and my doll." },
    { speaker: "Mum", text: "And Nam?" },
    { speaker: "Mai", text: "Nam has a robot. His puzzle is on the table." },
    { speaker: "Mum", text: "Do you have balloons?" },
    { speaker: "Mai", text: "Yes! Those balloons are red and blue." },
    { speaker: "Mum", text: "Today is rainy. We stay inside." },
    { speaker: "Mai", text: "OK. We play with our toys." },
  ],
  audioNotes:
    "Clear, slow delivery with short pauses. Total duration approx. 35 seconds.",
});

export const listeningScriptAnnaWeather = buildListeningScript({
  title: "Anna, Weather and the Kite",
  setting: "By the window — then planning to go outside",
  speakers: [
    { name: "Dad", role: "adult" },
    { name: "Anna", role: "girl, friend" },
    { name: "Mai", role: "girl, 8" },
  ],
  lines: [
    { speaker: "Dad", text: "Look outside. Is it sunny?" },
    { speaker: "Anna", text: "No. It is rainy and windy. I can see clouds." },
    { speaker: "Mai", text: "Can we fly my kite?" },
    { speaker: "Dad", text: "Not now. When it is sunny, you can go outside." },
    { speaker: "Anna", text: "The wind is strong today!" },
    { speaker: "Mai", text: "OK. These are my toys inside. That kite is by the door." },
    { speaker: "Anna", text: "I have a blue balloon. Those puzzles are fun!" },
  ],
  audioNotes: "Clear, slow delivery. Approx. 35 seconds.",
});

const STARTERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Dùng It's + thời tiết, these/those hoặc số nhiều -s đúng.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Dùng từ đồ chơi và thời tiết trong unit.",
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
    slug: "writing-toys-check",
    topicTag: TOPIC,
    title: "Check: Write About Your Toys",
    instructions: "Write short answers. Use 1–5 words for each answer.",
    sortOrder: 2,
    taskDescription:
      "Write about toys using words from the unit.",
    prompts: [
      "1. Write one toy word (doll, teddy, robot…).",
      "2. Write: These are my _____.",
      "3. Write: I have two _____. (plural toy)",
    ],
    minWords: 5,
    modelAnswerText: "teddy These are my toys. I have two kites.",
    successCriteria: [
      "Uses at least one toy word",
      "Uses these or a plural -s form",
      "Spelling of core words is recognisable",
    ],
    autoCheckKeywords: [
      "doll",
      "kite",
      "teddy",
      "robot",
      "puzzle",
      "balloon",
      "These",
      "are",
      "my",
      "have",
      "two",
      "kites",
      "toys",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-weather-check",
    topicTag: TOPIC,
    title: "Check: Write About the Weather",
    instructions: "Write short answers about the weather.",
    sortOrder: 2,
    taskDescription:
      "Write about weather from the reading text.",
    prompts: [
      "1. Write: It's _____. (sunny or rainy)",
      "2. Write: It is windy and _____. (cloudy or rainy)",
      "3. Write: Look at the _____! (cloud or clouds)",
    ],
    minWords: 5,
    modelAnswerText: "It's rainy. It is windy and cloudy. Look at the clouds!",
    successCriteria: [
      "All three prompts answered",
      "Uses weather words from the unit",
      "Uses It's or It is correctly",
    ],
    autoCheckKeywords: [
      "sunny",
      "rainy",
      "windy",
      "cloudy",
      "cloud",
      "clouds",
      "It's",
      "It",
      "is",
      "Look",
      "at",
      "the",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-these-those-check",
    topicTag: TOPIC,
    title: "Check: Write These and Those",
    instructions: "Write short phrases with these/those and plurals.",
    sortOrder: 2,
    taskDescription:
      "Write short phrases using these, those, or plural toy nouns.",
    prompts: [
      "1. Write: These are my _____. (toys or balloons)",
      "2. Write: Those _____ are on the chair. (balloons)",
      "3. Write: two _____ (add -s to kite or puzzle)",
    ],
    minWords: 5,
    modelAnswerText: "These are my toys. Those balloons are on the chair. two kites",
    successCriteria: [
      "Uses these or those correctly",
      "Uses plural -s on toy nouns",
      "Short clear phrases",
    ],
    autoCheckKeywords: [
      "These",
      "Those",
      "are",
      "my",
      "toys",
      "balloons",
      "kites",
      "puzzles",
      "two",
      "on",
      "the",
      "chair",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
];

const STARTERS_SPEAKING_CRITERIA = {
  pronunciation:
    "Từ đồ chơi và thời tiết (kite, sunny, balloon…) nghe được rõ.",
  fluency: "Trả lời bằng từ hoặc cụm ngắn; không im lặng quá lâu.",
  grammar:
    "Dùng It's + thời tiết hoặc these/those / số nhiều -s trong ít nhất hai câu trả lời.",
  vocabulary: "Dùng ít nhất ba từ vựng unit đúng nghĩa.",
};

const MAI_INDOOR_SCENE =
  "Scene: Mai's home on a rainy and windy day. Mai is eight. She plays with her teddy and doll inside. Her brother Nam has a robot and a puzzle on the table. Red and blue balloons are on the chair. Her friend Anna visits. Mum says they must stay inside. Clouds are in the sky.";

const MAI_OUTDOOR_SCENE =
  "Scene: Later the sun comes out. It is sunny and cloudy. Mai, Nam and Anna go into the garden. Mai flies her red kite. The wind is strong. Anna holds a blue balloon. Dad says they can play outside now. Toys stay inside; the kite and balloon are outside.";

export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-toys-check",
    topicTag: TOPIC,
    title: "Check: Talk About Your Toys",
    instructions:
      "Answer the examiner's questions. Say at least one word for each question.",
    sortOrder: 2,
    prompt:
      "The examiner will ask you about toys at home. Answer in short phrases.",
    sceneDescription: MAI_INDOOR_SCENE,
    followUpQuestions: [
      "Do you have toys?",
      "What is your favourite toy — a teddy or a doll?",
      "What does Nam have — a robot or a kite?",
      "Say: These are my _____.",
      "How many balloons do you see?",
    ],
    suggestedAnswers: [
      "Yes.",
      "A teddy.",
      "A robot.",
      "These are my toys.",
      "Two.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-weather-check",
    topicTag: TOPIC,
    title: "Check: Talk About the Weather",
    instructions: "Answer about the weather today.",
    sortOrder: 2,
    prompt:
      "Read the scene. The examiner asks about the weather and clouds.",
    sceneDescription: MAI_INDOOR_SCENE,
    followUpQuestions: [
      "What is the weather like today?",
      "Is it sunny or rainy?",
      "Can you see clouds?",
      "Say: It's _____. (rainy or windy)",
      "Can Mai fly her kite now?",
    ],
    suggestedAnswers: [
      "Rainy and windy.",
      "Rainy.",
      "Yes.",
      "It's rainy.",
      "No.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-these-those-check",
    topicTag: TOPIC,
    title: "Check: These and Those Speaking",
    instructions: "Answer the examiner's questions in short phrases.",
    sortOrder: 2,
    prompt:
      "The examiner asks about toys near and far. Use these, those, or plurals.",
    sceneDescription: MAI_OUTDOOR_SCENE,
    followUpQuestions: [
      "Where are the balloons — inside or outside?",
      "Say: These are my _____. (toys inside)",
      "Say: That kite is _____. (by the door / outside)",
      "How many kites does Mai have?",
      "Say: The wind is _____. (strong)",
    ],
    suggestedAnswers: [
      "Inside.",
      "These are my toys.",
      "By the door.",
      "One.",
      "Strong.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
];

export const listeningAnswerKeys = {
  maiToys: {
    q1: "teddy",
    q2: "robot",
    q3: "balloons",
    q4: "rainy",
    q5: "toys",
  },
  annaWeather: {
    q1: "rainy",
    q2: "clouds",
    q3: "kite",
    q4: "balloon",
    q5: "puzzles",
  },
};
