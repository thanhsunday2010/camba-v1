/**
 * Flyers Unit 2 — Environment and Nature
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-02.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "environment-and-nature";

const {
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildWritingCheck,
  buildSpeakingCheck,
} = createCambridgeUnitBuilder("flyers");

export const vocabularyBank = [
  {
    ...buildVocabWord({
      word: "environment",
      ipa: "/ɪnˈvaɪrənmənt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "môi trường",
      exampleSentence: "We must keep our school environment clean.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng ta phải giữ môi trường trường học sạch sẽ.",
  },
  {
    ...buildVocabWord({
      word: "pollution",
      ipa: "/pəˈluːʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "ô nhiễm",
      exampleSentence: "Plastic waste causes pollution in the ocean.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Rác nhựa gây ô nhiễm đại dương.",
  },
  {
    ...buildVocabWord({
      word: "recycle",
      ipa: "/ˌriːˈsaɪkl/",
      partOfSpeech: "verb",
      vietnameseMeaning: "tái chế",
      exampleSentence: "Our eco club recycles paper every Friday.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Câu lạc bộ sinh thái tái chế giấy mỗi thứ Sáu.",
  },
  {
    ...buildVocabWord({
      word: "planet",
      ipa: "/ˈplænɪt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hành tinh",
      exampleSentence: "We must protect our planet for the future.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng ta phải bảo vệ hành tinh cho tương lai.",
  },
  {
    ...buildVocabWord({
      word: "rainforest",
      ipa: "/ˈreɪnfɒrɪst/",
      partOfSpeech: "noun",
      vietnameseMeaning: "rừng mưa nhiệt đới",
      exampleSentence: "Rainforests are home to many animals.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Rừng mưa là nhà của nhiều loài động vật.",
  },
  {
    ...buildVocabWord({
      word: "ocean",
      ipa: "/ˈəʊʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đại dương",
      exampleSentence: "Pollution is dangerous for fish in the ocean.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Ô nhiễm nguy hiểm cho cá trong đại dương.",
  },
  {
    ...buildVocabWord({
      word: "protect",
      ipa: "/prəˈtekt/",
      partOfSpeech: "verb",
      vietnameseMeaning: "bảo vệ",
      exampleSentence: "Minh wants to protect nature near his school.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh muốn bảo vệ thiên nhiên gần trường.",
  },
  {
    ...buildVocabWord({
      word: "nature",
      ipa: "/ˈneɪtʃə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thiên nhiên",
      exampleSentence: "Linh loves walking in nature after school.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh thích đi bộ trong thiên nhiên sau giờ học.",
  },
  {
    ...buildVocabWord({
      word: "plastic",
      ipa: "/ˈplæstɪk/",
      partOfSpeech: "noun",
      vietnameseMeaning: "nhựa",
      exampleSentence: "Plastic bottles are collected by the eco club.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chai nhựa được câu lạc bộ sinh thái thu gom.",
  },
  {
    ...buildVocabWord({
      word: "waste",
      ipa: "/weɪst/",
      partOfSpeech: "noun",
      vietnameseMeaning: "rác thải",
      exampleSentence: "The club sorts waste into different bins.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Câu lạc bộ phân loại rác vào các thùng khác nhau.",
  },
  {
    ...buildVocabWord({
      word: "clean",
      ipa: "/kliːn/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "sạch",
      exampleSentence: "Our playground is clean after the cleanup.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Sân chơi sạch sẽ sau buổi dọn dẹp.",
  },
  {
    ...buildVocabWord({
      word: "earth",
      ipa: "/ɜːθ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "Trái Đất",
      exampleSentence: "A clean earth is important for everyone.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Trái Đất sạch quan trọng với mọi người.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Passive voice (introduction): is made / are made",
    explanation:
      "Use is/are + past participle to say what happens to something. The plastic is made into new bins. Paper is made from old newspapers. The focus is on the thing, not who does the action.",
    examples: [
      "New bins are made from recycled plastic.",
      "Paper is made from old newspapers.",
      "The report is written by our teacher.",
      "Trees are planted near the playground.",
    ],
    commonMistakes: [
      "Plastic is make into bins (×) → Plastic is made into bins (✓)",
      "Paper are made from trees (×) → Paper is made from trees (✓)",
      "The bins is made yesterday (×) → The bins were made yesterday (✓) — past needs were",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Passive voice: is recycled / are recycled",
    explanation:
      "Use is recycled or are recycled to talk about waste and materials. Plastic bottles are recycled every week. Water is not recycled at home in the same way. Plural nouns use are recycled.",
    examples: [
      "Plastic is recycled at our school.",
      "Old bottles are recycled on Fridays.",
      "Glass is recycled into new jars.",
      "Food waste is not recycled here yet.",
    ],
    commonMistakes: [
      "Plastic is recycle at school (×) → Plastic is recycled at school (✓)",
      "The bottles is recycled (×) → The bottles are recycled (✓)",
      "Paper recycled every day (×) → Paper is recycled every day (✓) — need is",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Must / mustn't for rules",
    explanation:
      "Use must + base verb for important rules: We must protect nature. Use mustn't to say something is not allowed: You mustn't drop plastic in the ocean. Must comes before the verb without to.",
    examples: [
      "We must put rubbish in the right bins.",
      "You mustn't throw waste on the ground.",
      "Students must wear gloves during cleanup.",
      "We mustn't waste clean water.",
    ],
    commonMistakes: [
      "We must to recycle paper (×) → We must recycle paper (✓)",
      "You mustn't to drop plastic (×) → You mustn't drop plastic (✓)",
      "We must protects nature (×) → We must protect nature (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twelve environment and nature words at Flyers A2 level.",
    "Understand simple passive forms: is made, are recycled.",
    "Use must and mustn't to talk about eco rules and responsibilities.",
    "Read a short text about an eco project and identify text type and purpose.",
    "Listen for several facts in dialogues about an eco club and community cleanup.",
    "Write a short message (at least 25 words) about protecting nature or recycling.",
    "Talk about pollution, recycling and rules in extended spoken answers.",
  ],
};

export const passageMinhEcoProject = buildPassage({
  title: "Minh's School Eco Project",
  text: `Minh is eleven and lives in Hanoi. This term his school started an eco project to protect nature and keep the environment clean. Minh and his friend Linh joined the school eco club.

Every Friday the club collects plastic waste from classrooms. The plastic is recycled and new bins are made from it. Old paper is recycled too. Their teacher says we must sort waste carefully and we mustn't throw rubbish on the ground.

Minh wrote a short article for the school board. It describes why rainforests and oceans on our planet are important. Pollution hurts animals in the ocean. The article asks everyone to help.

On Sunday Mum took Minh and Linh to a community cleanup near West Lake. They filled three bags with waste. Minh felt proud because small actions can protect the earth.`,
});

export const listeningScriptEcoClub = buildListeningScript({
  title: "Eco Club Meeting",
  setting: "School classroom after lessons, eco club meeting",
  speakers: [
    { name: "Teacher", role: "eco club teacher" },
    { name: "Minh", role: "boy, 11" },
    { name: "Linh", role: "girl, 11, friend" },
  ],
  lines: [
    { speaker: "Teacher", text: "Welcome to the eco club. Today we must plan our recycling project." },
    { speaker: "Minh", text: "How much plastic waste did we collect last week?" },
    { speaker: "Teacher", text: "We collected twenty bottles. They are recycled on Fridays." },
    { speaker: "Linh", text: "Paper is made from old newspapers, isn't it?" },
    { speaker: "Teacher", text: "Yes. New paper is made from paper you bring from home." },
    { speaker: "Minh", text: "We must protect rainforests and oceans on our planet." },
    { speaker: "Linh", text: "We mustn't drop plastic in the ocean. Pollution hurts fish." },
    { speaker: "Teacher", text: "Good. Next Friday we will plant trees near the playground." },
  ],
  audioNotes:
    "Teacher-led eco club discussion, three speakers, moderate pace. Approx. 55 seconds.",
});

export const listeningScriptCleanup = buildListeningScript({
  title: "Community Cleanup Day",
  setting: "Park near West Lake, Sunday morning",
  speakers: [
    { name: "Mum", role: "mother" },
    { name: "Minh", role: "boy, 11" },
    { name: "Linh", role: "girl, 11, friend" },
  ],
  lines: [
    { speaker: "Mum", text: "Thanks for helping with the community cleanup, Minh and Linh." },
    { speaker: "Minh", text: "Look — there is a lot of plastic waste near the lake." },
    { speaker: "Linh", text: "We must put it in these bags. The earth must stay clean." },
    { speaker: "Mum", text: "You mustn't leave sharp bottles on the ground." },
    { speaker: "Minh", text: "This plastic is recycled at our school, Mum." },
    { speaker: "Linh", text: "We filled two bags already. One more and we finish!" },
    { speaker: "Mum", text: "I'm proud of you. Nature looks better already." },
    { speaker: "Minh", text: "Small actions protect our planet for the future." },
  ],
  audioNotes:
    "Outdoor family-and-friends cleanup dialogue, warm tone. Approx. 50 seconds.",
});

const FLYERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses passive forms (is made, is recycled) and must/mustn't correctly where appropriate.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses environment words from the unit (pollution, recycle, protect, plastic, waste, etc.).",
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
    slug: "writing-eco-project-check",
    topicTag: TOPIC,
    title: "Check: Write About an Eco Project",
    instructions: "Write about your school eco club or project. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to your English teacher about Minh's school eco project. Say what the club collects, what is recycled, and one rule using must or mustn't.",
    prompts: [
      "What does the eco club collect?",
      "What is recycled at school?",
      "What must students do?",
      "What mustn't they do?",
    ],
    minWords: 25,
    modelAnswerText:
      "Our eco club collects plastic waste every Friday. The plastic is recycled and new bins are made from it. Paper is recycled too. We must sort waste carefully. We mustn't throw rubbish on the ground because pollution hurts nature.",
    successCriteria: [
      "At least 25 words",
      "Mentions recycle or recycling",
      "Uses must or mustn't once",
      "Uses environment or nature vocabulary",
    ],
    autoCheckKeywords: ["recycle", "plastic", "must", "pollution", "environment"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-rules-check",
    topicTag: TOPIC,
    title: "Check: Write Eco Rules",
    instructions: "Write 3–4 sentences with must and mustn't. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short notice for your class about protecting the environment. Include two rules with must and one with mustn't.",
    prompts: [
      "What must students do with plastic?",
      "What mustn't they do near the ocean or lake?",
      "How can they protect nature?",
    ],
    minWords: 25,
    modelAnswerText:
      "Dear class, we must put plastic in the recycling bin. We must protect rainforests and oceans on our planet. We mustn't drop waste in the lake. Clean water is important for fish. Please help keep the earth clean.",
    successCriteria: [
      "At least 25 words",
      "Uses must at least once",
      "Uses mustn't at least once",
      "Uses protect, pollution or clean",
    ],
    autoCheckKeywords: ["must", "mustn't", "protect", "pollution", "recycle"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-cleanup-check",
    topicTag: TOPIC,
    title: "Check: Write About a Cleanup",
    instructions: "Write about a community cleanup. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note to a pen friend about Minh's community cleanup with Mum and Linh. Say where they went, what waste they found, and why a clean earth matters.",
    prompts: [
      "Where did they go on Sunday?",
      "What kind of waste did they collect?",
      "Why is a clean earth important?",
    ],
    minWords: 25,
    modelAnswerText:
      "On Sunday Minh, Linh and Mum helped with a community cleanup near West Lake. They collected plastic waste in three bags. The plastic is recycled at school. A clean earth is important because pollution hurts animals in the ocean. Small actions protect our planet.",
    successCriteria: [
      "At least 25 words",
      "Mentions cleanup or waste",
      "Uses clean, earth or planet",
      "Passive or must used if possible",
    ],
    autoCheckKeywords: ["cleanup", "waste", "plastic", "earth", "protect"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
];

const FLYERS_SPEAKING_CRITERIA = {
  pronunciation: "Environment words (pollution, recycle, rainforest) are clear enough to understand.",
  fluency: "Answers are connected; brief pauses are acceptable at Flyers level.",
  grammar: "Uses passive forms and must/mustn't in short phrases.",
  vocabulary: "Uses environment and nature vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-eco-club-check",
    topicTag: TOPIC,
    title: "Check: Talk About the Eco Club",
    instructions: "Answer the questions about the school eco club. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about Minh's school eco club.",
    sceneDescription:
      "Story outline: (1) classroom eco club meeting with teacher, (2) pupils sorting plastic into bins, (3) recycled paper stack, (4) trees planted near playground.",
    followUpQuestions: [
      "What does your eco club collect every Friday?",
      "What is recycled at your school?",
      "What is made from recycled plastic?",
      "Why must we protect nature?",
      "What mustn't students do with rubbish?",
    ],
    suggestedAnswers: [
      "We collect plastic waste from classrooms.",
      "Plastic and paper are recycled on Fridays.",
      "New bins are made from recycled plastic.",
      "Because pollution hurts animals and our planet.",
      "We mustn't throw waste on the ground.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-pollution-check",
    topicTag: TOPIC,
    title: "Check: Talk About Pollution",
    instructions: "Answer using pollution and protect vocabulary. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about pollution and protecting the planet.",
    sceneDescription:
      "Scene labels: ocean with fish, plastic bottles in water, rainforest trees, clean lake after cleanup — protect, pollution, planet, earth.",
    followUpQuestions: [
      "Why is pollution dangerous for the ocean?",
      "What must we do to protect rainforests?",
      "What mustn't people drop in rivers or lakes?",
      "How can recycling help the environment?",
      "Why is a clean earth important?",
    ],
    suggestedAnswers: [
      "Pollution hurts fish and animals in the ocean.",
      "We must stop cutting trees and protect nature.",
      "People mustn't drop plastic waste in water.",
      "Waste is recycled so less pollution is made.",
      "A clean earth is important for everyone's future.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-cleanup-check",
    topicTag: TOPIC,
    title: "Check: Talk About a Cleanup",
    instructions: "Describe a community cleanup. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "Tell the examiner about Minh's community cleanup with Mum and Linh.",
    sceneDescription:
      "Timeline: Sunday morning at West Lake → find plastic waste → fill bags → Mum says be careful → nature looks cleaner → proud feeling.",
    followUpQuestions: [
      "Where did Minh and Linh go on Sunday?",
      "What kind of waste did they collect?",
      "What did Mum say they mustn't do?",
      "Where is the plastic recycled?",
      "How did Minh feel at the end?",
    ],
    suggestedAnswers: [
      "They went to a community cleanup near West Lake.",
      "They collected plastic waste in bags.",
      "Mum said we mustn't leave sharp bottles on the ground.",
      "The plastic is recycled at our school.",
      "Minh felt proud because small actions protect the planet.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  ecoClub: {
    q1: "twenty bottles",
    q2: "Fridays",
    q3: "trees",
  },
  cleanup: {
    q1: "plastic waste",
    q2: "two bags",
    q3: "school",
  },
};
