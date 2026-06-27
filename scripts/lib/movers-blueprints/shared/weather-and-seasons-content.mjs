/**
 * Movers Unit 3 — Weather and Seasons
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-03.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "weather-and-seasons";

const {
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildWritingCheck,
  buildSpeakingCheck,
} = createCambridgeUnitBuilder("movers");

export const vocabularyBank = [
  {
    ...buildVocabWord({
      word: "sunny",
      ipa: "/ˈsʌni/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "nắng, có nắng",
      exampleSentence: "It's sunny today in Hanoi.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Hôm nay ở Hà Nội trời nắng.",
  },
  {
    ...buildVocabWord({
      word: "rainy",
      ipa: "/ˈreɪni/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "có mưa, mưa",
      exampleSentence: "Yesterday it was rainy and windy.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Hôm qua trời mưa và có gió.",
  },
  {
    ...buildVocabWord({
      word: "windy",
      ipa: "/ˈwɪndi/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "có gió, gió",
      exampleSentence: "It is windy so we stay inside.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Trời có gió nên chúng tôi ở trong nhà.",
  },
  {
    ...buildVocabWord({
      word: "cloudy",
      ipa: "/ˈklaʊdi/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "có mây, nhiều mây",
      exampleSentence: "Autumn days are often cloudy in Hanoi.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Ngày thu ở Hà Nội thường nhiều mây.",
  },
  {
    ...buildVocabWord({
      word: "snow",
      ipa: "/snəʊ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tuyết",
      exampleSentence: "It doesn't snow in Hanoi in winter.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mùa đông ở Hà Nội không có tuyết.",
  },
  {
    ...buildVocabWord({
      word: "spring",
      ipa: "/sprɪŋ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "mùa xuân",
      exampleSentence: "Minh likes spring when the flowers bloom.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh thích mùa xuân khi hoa nở.",
  },
  {
    ...buildVocabWord({
      word: "summer",
      ipa: "/ˈsʌmə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "mùa hè",
      exampleSentence: "Summer is hot and sometimes rainy.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mùa hè nóng và đôi khi có mưa.",
  },
  {
    ...buildVocabWord({
      word: "autumn",
      ipa: "/ˈɔːtəm/",
      partOfSpeech: "noun",
      vietnameseMeaning: "mùa thu",
      exampleSentence: "Autumn is cloudy and cool in Vietnam.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mùa thu ở Việt Nam nhiều mây và mát.",
  },
  {
    ...buildVocabWord({
      word: "winter",
      ipa: "/ˈwɪntə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "mùa đông",
      exampleSentence: "Winter can be cold in the north of Vietnam.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mùa đông ở miền Bắc Việt Nam có thể lạnh.",
  },
  {
    ...buildVocabWord({
      word: "hot",
      ipa: "/hɒt/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "nóng",
      exampleSentence: "It's hot and sunny today.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Hôm nay trời nóng và nắng.",
  },
  {
    ...buildVocabWord({
      word: "cold",
      ipa: "/kəʊld/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "lạnh",
      exampleSentence: "It was cold yesterday morning.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Sáng hôm qua trời lạnh.",
  },
  {
    ...buildVocabWord({
      word: "weather",
      ipa: "/ˈweðə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thời tiết",
      exampleSentence: "Minh and Linh talk about the weather every day.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh và Linh nói về thời tiết mỗi ngày.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Present simple weather: It's sunny today",
    explanation:
      "Use It's (It is) + adjective to describe the weather today. It's sunny. It's rainy. It's hot. It's cold. For questions: Is it sunny today?",
    examples: [
      "It's sunny today.",
      "It's hot in summer.",
      "Is it rainy now?",
      "It isn't windy today.",
    ],
    commonMistakes: [
      "It sunny today (×) → It's sunny today (✓)",
      "It's a sunny today (×) → It's sunny today (✓) — no a before adjective",
      "Is sunny today? (×) → Is it sunny today? (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Past simple was / were",
    explanation:
      "Use was for I/he/she/it and were for you/we/they to talk about the past. Yesterday it was rainy. We were at home. Was it cold yesterday? They were happy.",
    examples: [
      "Yesterday it was rainy.",
      "Minh and Linh were at home.",
      "Was it sunny yesterday?",
      "It wasn't windy last week.",
    ],
    commonMistakes: [
      "Yesterday it were rainy (×) → it was rainy (✓) — it → was",
      "We was at home (×) → We were at home (✓)",
      "Was it cold yesterday? Yes, it were. (×) → Yes, it was. (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Seasons and weather together",
    explanation:
      "Combine season nouns with weather adjectives. In summer the weather is hot. In winter it can be cold. Use present simple for general facts and past simple for specific days.",
    examples: [
      "In spring the weather is warm.",
      "Summer was hot last year.",
      "Autumn is cloudy and cool.",
      "It doesn't snow in Hanoi in winter.",
    ],
    commonMistakes: [
      "In summer it is hotly (×) → it is hot (✓)",
      "Winter is coldly (×) → Winter is cold (✓)",
      "Last summer were hot (×) → Last summer was hot (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twelve weather and season words at Movers A1 level.",
    "Use It's + adjective to describe today's weather (It's sunny today).",
    "Use was and were to talk about weather and places in the past.",
    "Read a short text about weather today vs yesterday and complete sentences.",
    "Listen for weather and season words in short dialogues.",
    "Write a short message about the weather (at least 15 words).",
    "Talk about weather and favourite seasons in short spoken answers.",
  ],
};

export const passageMinhWeatherSeasons = buildPassage({
  title: "Minh and the Weather",
  text: `Minh is nine. He lives in Hanoi with his mum. Today the weather is sunny and hot. Minh says, "It's sunny today. I can play outside with Linh."

Yesterday the weather was different. It was rainy and windy. Minh and Linh were at home. They couldn't play in the park.

Minh's mum tells him about the four seasons in Vietnam. "In spring the weather is warm. Summer is hot and sometimes rainy. Autumn is cloudy and cool. Winter can be cold, but it doesn't snow in Hanoi."

Linh loves summer best because she likes swimming. Minh likes spring when the flowers bloom. Every day they talk about the weather together.`,
});

export const listeningScriptWeatherHome = buildListeningScript({
  title: "Weather at Home",
  setting: "Minh's kitchen in Hanoi, morning",
  speakers: [
    { name: "Mum", role: "mother" },
    { name: "Minh", role: "boy, 9" },
  ],
  lines: [
    { speaker: "Mum", text: "Good morning, Minh. Look outside!" },
    { speaker: "Minh", text: "Wow! It's sunny and hot today." },
    { speaker: "Mum", text: "Yes. Yesterday the weather was different." },
    { speaker: "Minh", text: "Was it rainy yesterday?" },
    { speaker: "Mum", text: "Yes, it was rainy and windy. We were at home all day." },
    { speaker: "Minh", text: "Can I play outside with Linh today?" },
    { speaker: "Mum", text: "Yes, but wear a hat. It's very hot." },
    { speaker: "Minh", text: "OK, Mum. I love sunny days!" },
  ],
  audioNotes:
    "Warm mother–son dialogue about today vs yesterday weather. Moderate pace. Approx. 45 seconds.",
});

export const listeningScriptLinhSeasons = buildListeningScript({
  title: "Linh's Favourite Season",
  setting: "School playground, after class",
  speakers: [
    { name: "Minh", role: "boy, 9" },
    { name: "Linh", role: "girl, friend" },
  ],
  lines: [
    { speaker: "Minh", text: "Hi Linh! What's your favourite season?" },
    { speaker: "Linh", text: "I love summer. It's hot and sunny." },
    { speaker: "Minh", text: "Summer was great last year. We were at the beach." },
    { speaker: "Linh", text: "Yes! But autumn is cloudy and cool. I like that too." },
    { speaker: "Minh", text: "My favourite season is spring. The weather is warm." },
    { speaker: "Linh", text: "Was it cold in winter?" },
    { speaker: "Minh", text: "Yes, it was cold, but it doesn't snow in Hanoi." },
    { speaker: "Linh", text: "Let's talk about the weather again tomorrow!" },
  ],
  audioNotes:
    "Friendly dialogue about four seasons and weather. Approx. 50 seconds.",
});

const MOVERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses It's / was / were correctly for weather contexts.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses weather and season words from the unit (sunny, rainy, spring, etc.).",
  },
  organization: {
    weight: 0.2,
    criteria: "Ideas follow a logical order or answer all prompts clearly.",
  },
  taskAchievement: {
    weight: 0.2,
    criteria: "Meets minimum length and addresses the writing task.",
  },
};

/** Writing Check exercises — one per writing lesson (sortOrder 2). */
export const writingChecks = [
  buildWritingCheck({
    slug: "writing-today-weather-check",
    topicTag: TOPIC,
    title: "Check: Write About Today's Weather",
    instructions: "Write about the weather today. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to your friend Linh about today's weather. Use It's + weather word at least once.",
    prompts: [
      "What is the weather like today?",
      "Is it hot or cold?",
      "What can you do outside?",
    ],
    minWords: 15,
    modelAnswerText:
      "Hi Linh, it's sunny and hot today. The weather is great. I can play outside in the park. It's not windy. See you later!",
    successCriteria: [
      "At least 15 words",
      "Uses It's + weather adjective",
      "Mentions today",
      "Message is clear",
    ],
    autoCheckKeywords: ["sunny", "hot", "weather", "today", "It's"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-yesterday-weather-check",
    topicTag: TOPIC,
    title: "Check: Write About Yesterday",
    instructions: "Write about yesterday's weather. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note about yesterday's weather. Use was or were at least once.",
    prompts: [
      "What was the weather like yesterday?",
      "Where were you?",
      "Could you play outside?",
    ],
    minWords: 15,
    modelAnswerText:
      "Yesterday the weather was rainy and windy. Minh and I were at home. We couldn't play in the park. It was cold in the morning too.",
    successCriteria: [
      "At least 15 words",
      "Uses was or were",
      "Describes past weather",
      "Uses unit vocabulary",
    ],
    autoCheckKeywords: ["was", "were", "rainy", "windy", "yesterday"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-seasons-check",
    topicTag: TOPIC,
    title: "Check: Write About Seasons",
    instructions: "Write about your favourite season. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message about your favourite season and its weather. Name at least one season.",
    prompts: [
      "What is your favourite season?",
      "What is the weather like in that season?",
      "Why do you like it?",
    ],
    minWords: 15,
    modelAnswerText:
      "My favourite season is spring. The weather is warm and sunny. I like spring because the flowers bloom. Summer is hot but I like swimming too.",
    successCriteria: [
      "At least 15 words",
      "Names a season",
      "Describes weather",
      "Uses unit vocabulary",
    ],
    autoCheckKeywords: ["spring", "summer", "weather", "hot", "season"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
];

const MOVERS_SPEAKING_CRITERIA = {
  pronunciation: "Weather and season words (sunny, rainy, spring) are clear enough to understand.",
  fluency: "Answers are short but connected; brief pauses are acceptable.",
  grammar: "Uses It's / was / were in short phrases.",
  vocabulary: "Uses weather and season vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-today-weather-check",
    topicTag: TOPIC,
    title: "Check: Talk About Today's Weather",
    instructions: "Answer the questions about today's weather. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about the weather today.",
    sceneDescription:
      "Story outline: (1) Minh looks out the window — sunny sky, (2) Mum says yesterday was rainy, (3) Minh wants to play outside with Linh, (4) hot sunny day in Hanoi.",
    followUpQuestions: [
      "What's the weather like today?",
      "Is it hot or cold?",
      "Can you play outside today?",
      "What do you wear when it's sunny?",
      "Do you like sunny days?",
    ],
    suggestedAnswers: [
      "It's sunny and hot today.",
      "It's hot.",
      "Yes, I can play outside.",
      "I wear a hat and T-shirt.",
      "Yes, I love sunny days.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-yesterday-weather-check",
    topicTag: TOPIC,
    title: "Check: Talk About Yesterday",
    instructions: "Answer questions about yesterday's weather. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about weather in the past.",
    sceneDescription:
      "Timeline: yesterday rainy and windy → Minh and Linh at home → couldn't play in park → Mum says weather was different from today.",
    followUpQuestions: [
      "What was the weather like yesterday?",
      "Were you at home or at school?",
      "Was it sunny yesterday?",
      "Could you play outside?",
      "Is today's weather different?",
    ],
    suggestedAnswers: [
      "It was rainy and windy.",
      "We were at home.",
      "No, it wasn't sunny.",
      "No, we couldn't play outside.",
      "Yes, today is sunny and hot.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-seasons-check",
    topicTag: TOPIC,
    title: "Check: Talk About Seasons",
    instructions: "Talk about seasons and favourite weather. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about seasons and favourite weather.",
    sceneDescription:
      "Four seasons chart: spring warm, summer hot, autumn cloudy cool, winter cold no snow in Hanoi. Linh loves summer; Minh loves spring.",
    followUpQuestions: [
      "What's your favourite season?",
      "What's the weather like in summer?",
      "Is autumn hot or cool?",
      "Does it snow in Hanoi in winter?",
      "What season does Linh like best?",
    ],
    suggestedAnswers: [
      "My favourite season is spring.",
      "Summer is hot and sometimes rainy.",
      "Autumn is cool and cloudy.",
      "No, it doesn't snow in Hanoi.",
      "Linh loves summer best.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  weatherHome: {
    q1: "sunny",
    q2: "rainy",
    q3: "hot",
  },
  linhSeasons: {
    q1: "summer",
    q2: "spring",
    q3: "snow",
  },
};
