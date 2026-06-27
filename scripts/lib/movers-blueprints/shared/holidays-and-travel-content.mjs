/**
 * Movers Unit 5 — Holidays and Travel
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-05.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "holidays-and-travel";

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
      word: "holiday",
      ipa: "/ˈhɒlədeɪ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "kỳ nghỉ, ngày lễ",
      exampleSentence: "Minh's family is going on holiday this summer.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Gia đình Minh sẽ đi nghỉ mùa hè này.",
  },
  {
    ...buildVocabWord({
      word: "beach",
      ipa: "/biːtʃ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "bãi biển",
      exampleSentence: "We're going to visit the beach near the hotel.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng ta sẽ đi thăm bãi biển gần khách sạn.",
  },
  {
    ...buildVocabWord({
      word: "mountain",
      ipa: "/ˈmaʊntən/",
      partOfSpeech: "noun",
      vietnameseMeaning: "núi",
      exampleSentence: "Last year Minh went to the mountains with Dad.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Năm ngoái Minh đi núi với bố.",
  },
  {
    ...buildVocabWord({
      word: "suitcase",
      ipa: "/ˈsuːtkeɪs/",
      partOfSpeech: "noun",
      vietnameseMeaning: "vali",
      exampleSentence: "Minh packs his suitcase before the holiday.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh xếp vali trước kỳ nghỉ.",
  },
  {
    ...buildVocabWord({
      word: "hotel",
      ipa: "/həʊˈtel/",
      partOfSpeech: "noun",
      vietnameseMeaning: "khách sạn",
      exampleSentence: "We're going to stay at a hotel near the beach.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng ta sẽ ở khách sạn gần bãi biển.",
  },
  {
    ...buildVocabWord({
      word: "map",
      ipa: "/mæp/",
      partOfSpeech: "noun",
      vietnameseMeaning: "bản đồ",
      exampleSentence: "Dad looks at the map on the table.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bố nhìn bản đồ trên bàn.",
  },
  {
    ...buildVocabWord({
      word: "ticket",
      ipa: "/ˈtɪkɪt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "vé",
      exampleSentence: "Mum puts the train tickets in her bag.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mẹ để vé tàu vào túi.",
  },
  {
    ...buildVocabWord({
      word: "passport",
      ipa: "/ˈpɑːspɔːt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hộ chiếu",
      exampleSentence: "Don't forget your passport for the holiday.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Đừng quên hộ chiếu khi đi nghỉ.",
  },
  {
    ...buildVocabWord({
      word: "visit",
      ipa: "/ˈvɪzɪt/",
      partOfSpeech: "verb",
      vietnameseMeaning: "thăm, đi thăm",
      exampleSentence: "We're going to visit the beach and the mountains.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng ta sẽ đi thăm bãi biển và núi.",
  },
  {
    ...buildVocabWord({
      word: "travel",
      ipa: "/ˈtrævl/",
      partOfSpeech: "verb",
      vietnameseMeaning: "du lịch, đi lại",
      exampleSentence: "The family travels to the station by boat.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Gia đình đi đến ga bằng thuyền.",
  },
  {
    ...buildVocabWord({
      word: "train",
      ipa: "/treɪn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tàu hỏa",
      exampleSentence: "They get on the train to the coast.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Họ lên tàu đi về phía biển.",
  },
  {
    ...buildVocabWord({
      word: "boat",
      ipa: "/bəʊt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thuyền, tàu thủy",
      exampleSentence: "They take a boat along the river to the station.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Họ đi thuyền dọc sông đến ga.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Going to future: We're going to visit",
    explanation:
      "Use am/is/are + going to + verb to talk about future plans. We're going to visit the beach. Minh is going to pack his suitcase. Are you going to travel by train?",
    examples: [
      "We're going to visit the beach.",
      "Minh is going to pack his suitcase.",
      "They are going to stay at a hotel.",
      "Are you going to travel by train?",
    ],
    commonMistakes: [
      "We going to visit (×) → We are going to visit (✓)",
      "Minh is go to pack (×) → Minh is going to pack (✓)",
      "We are going visit (×) → We are going to visit (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Past simple: went, saw, had",
    explanation:
      "Use past simple verbs to talk about finished holiday events. Last year Minh went to the mountains. He saw a waterfall. They had fish for lunch.",
    examples: [
      "Last summer they went to the mountains.",
      "Minh saw a beautiful lake.",
      "They had a picnic on the holiday.",
      "Dad went to the hotel first.",
    ],
    commonMistakes: [
      "Minh goed to the beach (×) → Minh went to the beach (✓)",
      "He seed a lake (×) → He saw a lake (✓)",
      "They haved lunch (×) → They had lunch (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Plans (going to) vs past (went/saw/had)",
    explanation:
      "Going to = future plans (We're going to visit). Past simple = finished events (We went, we saw, we had). This holiday we're going to the beach. Last year we went to the mountains.",
    examples: [
      "We're going to visit the hotel tomorrow.",
      "Last year we went to the mountains.",
      "Minh is going to pack his suitcase.",
      "Minh saw a waterfall last summer.",
    ],
    commonMistakes: [
      "We are going to went (×) → We went / We are going to go (✓)",
      "Last year we are going to visit (×) → Last year we visited / went (✓)",
      "He is going to saw (×) → He is going to see / He saw (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twelve holiday and travel words at Movers A1 level.",
    "Use going to (We're going to visit) to talk about holiday plans.",
    "Use past simple (went, saw, had) to talk about finished holiday events.",
    "Follow a chronological narrative with first, then and finally.",
    "Listen to short stories and understand the order of events.",
    "Write a short message about holiday plans or a past trip (at least 15 words).",
    "Talk about packing, travel and holiday experiences in short spoken answers.",
  ],
};

export const passageMinhHoliday = buildPassage({
  title: "Minh's Family Holiday",
  text: `Minh is nine. He lives in Hanoi with his mum and dad. His friend Linh visits before the family holiday.

First, Mum and Dad plan the trip. Dad looks at the map and says, "We're going to visit the beach and the mountains." Minh packs his suitcase. He puts in a map, his passport and the train tickets.

Then the family travels to the station. They take a boat along the river, then get on the train. On the train Minh and Linh look at the map. "We're going to stay at a hotel near the beach," Mum says.

Finally they arrive at the hotel. They swim at the beach and walk in the mountains. Last summer they went to the mountains with Dad. Minh saw a big waterfall and had fish for lunch. It was a wonderful holiday!`,
});

export const listeningScriptPackingPlans = buildListeningScript({
  title: "Packing for the Holiday",
  setting: "Minh's bedroom, evening before the trip",
  speakers: [
    { name: "Mum", role: "mother" },
    { name: "Dad", role: "father" },
    { name: "Minh", role: "boy, 9" },
    { name: "Linh", role: "girl, friend" },
  ],
  lines: [
    { speaker: "Dad", text: "We're going to visit the beach and the mountains tomorrow." },
    { speaker: "Mum", text: "Minh, is your suitcase ready? Don't forget your passport." },
    { speaker: "Minh", text: "Yes, Mum. I put my passport and the train tickets in my bag." },
    { speaker: "Linh", text: "Can I help? I have a map of the coast." },
    { speaker: "Dad", text: "Good idea. We're going to travel by train after the boat." },
    { speaker: "Mum", text: "First the boat to the station, then the train to the hotel." },
    { speaker: "Minh", text: "We're going to stay at a hotel near the beach!" },
    { speaker: "Dad", text: "That's right. Pack your hat. It's going to be a great holiday." },
  ],
  audioNotes:
    "Family packing dialogue with going to future plans. Moderate pace. Approx. 55 seconds.",
});

export const listeningScriptHolidayStory = buildListeningScript({
  title: "Minh's Holiday Story",
  setting: "On the train, telling a story about last summer",
  speakers: [
    { name: "Minh", role: "boy, 9" },
    { name: "Linh", role: "girl, friend" },
    { name: "Mum", role: "mother" },
  ],
  lines: [
    { speaker: "Linh", text: "Tell me about your last holiday, Minh." },
    { speaker: "Minh", text: "OK. First we went to the mountains with Dad." },
    { speaker: "Minh", text: "Then we saw a big waterfall near the hotel." },
    { speaker: "Linh", text: "Wow! What did you do after that?" },
    { speaker: "Minh", text: "We had a picnic by a beautiful lake." },
    { speaker: "Mum", text: "And finally we went to the beach for two days." },
    { speaker: "Minh", text: "I saw lots of boats on the river too." },
    { speaker: "Linh", text: "This year we're going to visit the beach again!" },
  ],
  audioNotes:
    "Chronological holiday story with first/then/finally sequencing. Approx. 50 seconds.",
});

const MOVERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses going to and/or past simple (went, saw, had) correctly for holiday contexts.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses holiday and travel words from the unit (beach, hotel, train, passport, etc.).",
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
    slug: "writing-holiday-plans-check",
    topicTag: TOPIC,
    title: "Check: Write About Holiday Plans",
    instructions: "Write about your holiday plans. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message about your family's holiday plans. Use going to at least once.",
    prompts: [
      "Where are you going to visit?",
      "How are you going to travel?",
      "What are you going to pack?",
    ],
    minWords: 15,
    modelAnswerText:
      "We're going to visit the beach and the mountains. We're going to travel by train. I'm going to pack my suitcase with a map and my passport.",
    successCriteria: [
      "At least 15 words",
      "Uses going to",
      "Mentions a place or travel item",
      "Message is clear",
    ],
    autoCheckKeywords: ["going", "visit", "beach", "train", "hotel"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-past-holiday-check",
    topicTag: TOPIC,
    title: "Check: Write About a Past Holiday",
    instructions: "Write about a past holiday. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note about a holiday you had. Use went, saw or had at least once.",
    prompts: [
      "Where did you go?",
      "What did you see?",
      "What did you have or do?",
    ],
    minWords: 15,
    modelAnswerText:
      "Last summer we went to the mountains. I saw a big waterfall and a beautiful lake. We had a picnic and fish for lunch. It was wonderful!",
    successCriteria: [
      "At least 15 words",
      "Uses went, saw or had",
      "Names a place from the unit",
      "Uses unit vocabulary",
    ],
    autoCheckKeywords: ["went", "saw", "had", "mountain", "beach", "holiday"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-travel-day-check",
    topicTag: TOPIC,
    title: "Check: Write About Travel Day",
    instructions: "Write about a travel day. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message about travelling to a hotel. Use first/then or going to and past verbs.",
    prompts: [
      "How do you travel to the station?",
      "What do you take on the train?",
      "Where do you stay?",
    ],
    minWords: 15,
    modelAnswerText:
      "First we take a boat to the station. Then we get on the train with our tickets. We're going to stay at a hotel near the beach. Last year we went there by train too.",
    successCriteria: [
      "At least 15 words",
      "Mentions train, boat or hotel",
      "Order or plans are clear",
      "Uses unit vocabulary",
    ],
    autoCheckKeywords: ["train", "boat", "hotel", "ticket", "first", "then"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
];

const MOVERS_SPEAKING_CRITERIA = {
  pronunciation: "Holiday words (beach, passport, train) are clear enough to understand.",
  fluency: "Answers are short but connected; brief pauses are acceptable.",
  grammar: "Uses going to and past simple in short phrases.",
  vocabulary: "Uses holiday and travel vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-packing-plans-check",
    topicTag: TOPIC,
    title: "Check: Talk About Packing",
    instructions: "Answer the questions about packing for a holiday. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about packing and holiday plans.",
    sceneDescription:
      "Story outline: (1) Evening before the trip at Minh's home, (2) Dad says we're going to visit beach and mountains, (3) Minh packs suitcase with passport and tickets, (4) Linh helps with a map.",
    followUpQuestions: [
      "Where are you going to visit?",
      "What are you going to pack in your suitcase?",
      "Don't forget — what important document do you need?",
      "How are you going to travel?",
      "Are you going to stay at a hotel?",
    ],
    suggestedAnswers: [
      "We're going to visit the beach and the mountains.",
      "I'm going to pack my passport, tickets and a map.",
      "I need my passport.",
      "We're going to travel by boat and train.",
      "Yes, we're going to stay at a hotel near the beach.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-past-holiday-check",
    topicTag: TOPIC,
    title: "Check: Talk About a Past Holiday",
    instructions: "Answer questions about a past holiday. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about a finished holiday.",
    sceneDescription:
      "Past holiday chart: First went to mountains; then saw waterfall; had picnic by lake; finally went to beach; saw boats on river.",
    followUpQuestions: [
      "Where did you go last summer?",
      "What did you see in the mountains?",
      "What did you have for lunch?",
      "Did you go to the beach?",
      "What did you see on the river?",
    ],
    suggestedAnswers: [
      "We went to the mountains with Dad.",
      "I saw a big waterfall near the hotel.",
      "We had a picnic and fish for lunch.",
      "Yes, finally we went to the beach for two days.",
      "I saw lots of boats on the river.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-travel-sequence-check",
    topicTag: TOPIC,
    title: "Check: Talk About Travel Order",
    instructions: "Describe the order of travel events. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks you to describe a travel day in order.",
    sceneDescription:
      "Travel sequence: First pack suitcase; boat to station; train to coast; arrive at hotel near beach; swim at beach; walk in mountains.",
    followUpQuestions: [
      "What do you do first before the trip?",
      "How do you get to the station?",
      "What do you do on the train?",
      "Where do you stay?",
      "What do you do at the beach and mountains?",
    ],
    suggestedAnswers: [
      "First I pack my suitcase with my passport and tickets.",
      "We take a boat along the river to the station.",
      "On the train we look at the map together.",
      "We stay at a hotel near the beach.",
      "We swim at the beach and walk in the mountains.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  packingPlans: {
    q1: "beach",
    q2: "passport",
    q3: "train",
  },
  holidayStory: {
    q1: "mountains",
    q2: "waterfall",
    q3: "picnic",
  },
};
