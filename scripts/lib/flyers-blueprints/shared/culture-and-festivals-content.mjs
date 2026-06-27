/**
 * Flyers Unit 3 — Culture and Festivals
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-03.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "culture-and-festivals";

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
      word: "festival",
      ipa: "/ˈfestɪvl/",
      partOfSpeech: "noun",
      vietnameseMeaning: "lễ hội",
      exampleSentence: "Our school festival is in March.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Lễ hội trường chúng tôi diễn ra vào tháng Ba.",
  },
  {
    ...buildVocabWord({
      word: "celebrate",
      ipa: "/ˈselɪbreɪt/",
      partOfSpeech: "verb",
      vietnameseMeaning: "ăn mừng",
      exampleSentence: "We celebrate Tet with our family.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng tôi ăn mừng Tết cùng gia đình.",
  },
  {
    ...buildVocabWord({
      word: "tradition",
      ipa: "/trəˈdɪʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "truyền thống",
      exampleSentence: "Wearing ao dai is an old tradition.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Mặc áo dài là một truyền thống lâu đời.",
  },
  {
    ...buildVocabWord({
      word: "costume",
      ipa: "/ˈkɒstjuːm/",
      partOfSpeech: "noun",
      vietnameseMeaning: "trang phục",
      exampleSentence: "Minh wore a colourful costume for the parade.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh mặc trang phục sặc sỡ cho cuộc diễu hành.",
  },
  {
    ...buildVocabWord({
      word: "parade",
      ipa: "/pəˈreɪd/",
      partOfSpeech: "noun",
      vietnameseMeaning: "cuộc diễu hành",
      exampleSentence: "We watched the parade in the city centre.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng tôi xem cuộc diễu hành ở trung tâm thành phố.",
  },
  {
    ...buildVocabWord({
      word: "fireworks",
      ipa: "/ˈfaɪəwɜːks/",
      partOfSpeech: "noun",
      vietnameseMeaning: "pháo hoa",
      exampleSentence: "The fireworks lit up the night sky.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Pháo hoa thắp sáng bầu trời đêm.",
  },
  {
    ...buildVocabWord({
      word: "national",
      ipa: "/ˈnæʃnəl/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "quốc gia",
      exampleSentence: "We sang the national anthem at the festival.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng tôi hát quốc ca tại lễ hội.",
  },
  {
    ...buildVocabWord({
      word: "custom",
      ipa: "/ˈkʌstəm/",
      partOfSpeech: "noun",
      vietnameseMeaning: "phong tục",
      exampleSentence: "Giving lucky money is a Tet custom.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Tặng lì xì là một phong tục Tết.",
  },
  {
    ...buildVocabWord({
      word: "holiday",
      ipa: "/ˈhɒlədeɪ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "ngày lễ, kỳ nghỉ",
      exampleSentence: "Tet is our longest holiday of the year.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Tết là kỳ nghỉ dài nhất trong năm của chúng tôi.",
  },
  {
    ...buildVocabWord({
      word: "party",
      ipa: "/ˈpɑːti/",
      partOfSpeech: "noun",
      vietnameseMeaning: "bữa tiệc",
      exampleSentence: "Grandma made a big party for the family.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bà nấu bữa tiệc lớn cho cả gia đình.",
  },
  {
    ...buildVocabWord({
      word: "dance",
      ipa: "/dɑːns/",
      partOfSpeech: "noun",
      vietnameseMeaning: "điệu múa",
      exampleSentence: "Linh learned a traditional dance for the festival.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh học một điệu múa truyền thống cho lễ hội.",
  },
  {
    ...buildVocabWord({
      word: "music",
      ipa: "/ˈmjuːzɪk/",
      partOfSpeech: "noun",
      vietnameseMeaning: "âm nhạc",
      exampleSentence: "Live music played during the school festival.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Nhạc sống được chơi trong lễ hội trường.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Past simple: irregular verbs (went, saw, had)",
    explanation:
      "Use went (not goed) for movement in the past: We went to the parade. Use saw (not seed) for seeing: We saw fireworks. Use had (not haved) for experiences or meals: We had a big party. These verbs do not add -ed.",
    examples: [
      "Last Tet we went to my grandparents' house.",
      "Minh saw a colourful parade in the city.",
      "We had lucky money and a family dinner.",
      "Linh went to school in her ao dai costume.",
    ],
    commonMistakes: [
      "We goed to the parade (×) → We went to the parade (✓)",
      "I seed the fireworks (×) → I saw the fireworks (✓)",
      "They haved a party (×) → They had a party (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "When clauses: When we arrived, ...",
    explanation:
      "Use When + past simple to say what happened at one moment in a story. When we arrived, we saw decorations. When the parade started, everyone cheered. The when-clause often comes first, then a comma.",
    examples: [
      "When we arrived, Grandma had food ready.",
      "When the music started, Linh began to dance.",
      "When we saw the fireworks, we clapped loudly.",
      "When Minh went to the festival, he wore a costume.",
    ],
    commonMistakes: [
      "When we arrive, we saw food (×) → When we arrived, we saw food (✓)",
      "When we arrived we saw food (×) → When we arrived, we saw food (✓) — comma after clause",
      "When we went, we go to the parade (×) → When we went, we saw the parade (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Past simple + when clauses (mixed)",
    explanation:
      "Combine irregular past verbs with when-clauses to tell festival stories in order. First say when something happened, then what you went to, saw or had. Keep both verbs in the past.",
    examples: [
      "When we arrived at school, we saw costumes and music.",
      "We went to the national parade and had a wonderful holiday.",
      "When Linh saw the fireworks, she had a big smile.",
      "Minh went home after the party and had a rest.",
    ],
    commonMistakes: [
      "When we arrived, we see fireworks (×) → When we arrived, we saw fireworks (✓)",
      "We went and have a party (×) → We went and had a party (✓)",
      "When they saw, they goed home (×) → When they saw, they went home (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twelve culture and festival words at Flyers A2 level.",
    "Use irregular past verbs went, saw and had to talk about festivals.",
    "Use when-clauses to link events in chronological order.",
    "Read a short festival text and follow chronological links between events.",
    "Listen for several facts in extended dialogues about a school festival and a national parade.",
    "Write a short message (at least 25 words) about celebrating a festival or holiday.",
    "Talk about traditions, costumes and fireworks in extended spoken answers.",
  ],
};

export const passageMinhFestival = buildPassage({
  title: "Minh's Tet Holiday",
  text: `Minh is eleven and lives in Hanoi. Last Tet was a special national holiday for his family. First, Minh and his sister Linh helped Mum clean the house. It is an old custom before every festival.

When they arrived at their grandparents' house, they saw red decorations and lucky money on the table. Grandma had prepared a big family party with traditional food. Minh wore a colourful ao dai costume — an important tradition in Vietnam.

In the afternoon the family went to the city centre. They watched a long parade with music and dance groups. When the parade finished, everyone went to Hoan Kiem Lake. They saw bright fireworks in the night sky and clapped loudly.

At the end of the holiday Minh felt happy. He wrote about the festival for his school project and told his class why customs and traditions matter.`,
});

export const listeningScriptSchoolFestival = buildListeningScript({
  title: "Planning the School Culture Festival",
  setting: "School classroom, culture club meeting after lessons",
  speakers: [
    { name: "Teacher", role: "culture club teacher" },
    { name: "Minh", role: "boy, 11" },
    { name: "Linh", role: "girl, 11, friend" },
  ],
  lines: [
    { speaker: "Teacher", text: "Welcome! We must plan our school culture festival for next month." },
    { speaker: "Minh", text: "When we had the festival last year, I saw a wonderful dance on stage." },
    { speaker: "Linh", text: "Can we celebrate national traditions with costumes and music?" },
    { speaker: "Teacher", text: "Yes. Each class can wear a traditional costume for the parade." },
    { speaker: "Minh", text: "We went to the gym last time. Should we go there again?" },
    { speaker: "Teacher", text: "Good idea. When we arrive, we will set up the stage first." },
    { speaker: "Linh", text: "Can we have fireworks? Well, maybe just colourful lights instead." },
    { speaker: "Teacher", text: "Right. Let's also invite parents for a small party after the show." },
  ],
  audioNotes:
    "Teacher-led school festival planning, three speakers, moderate pace. Approx. 55 seconds.",
});

export const listeningScriptNationalParade = buildListeningScript({
  title: "Watching the National Parade",
  setting: "City street near Hoan Kiem Lake, national holiday morning",
  speakers: [
    { name: "Dad", role: "father" },
    { name: "Minh", role: "boy, 11" },
    { name: "Linh", role: "girl, 11, sister" },
  ],
  lines: [
    { speaker: "Dad", text: "Look — the national parade is starting now!" },
    { speaker: "Minh", text: "When we arrived, we saw dancers in bright costumes." },
    { speaker: "Linh", text: "I love the music! Last year we had seats near the front." },
    { speaker: "Dad", text: "We went early today, so we can see everything clearly." },
    { speaker: "Minh", text: "When the band passed, I saw our school flag in the parade." },
    { speaker: "Linh", text: "After the parade we can celebrate with ice cream." },
    { speaker: "Dad", text: "Tonight we will watch fireworks by the lake. It is a Tet custom." },
    { speaker: "Minh", text: "This holiday is my favourite. Festivals bring the whole city together." },
  ],
  audioNotes:
    "Family watching national parade dialogue, warm tone. Approx. 50 seconds.",
});

const FLYERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses went, saw, had and when-clauses correctly where appropriate.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses festival words from the unit (celebrate, tradition, parade, fireworks, etc.).",
  },
  organization: {
    weight: 0.2,
    criteria: "Events follow a logical or chronological order.",
  },
  taskAchievement: {
    weight: 0.2,
    criteria: "Meets minimum length and addresses the writing task.",
  },
};

/** Writing Check exercises — one per writing lesson (sortOrder 2). */
export const writingChecks = [
  buildWritingCheck({
    slug: "writing-festival-check",
    topicTag: TOPIC,
    title: "Check: Write About a Festival",
    instructions: "Write about a festival or holiday you celebrate. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to your English teacher about Minh's Tet holiday. Say where the family went, what they saw, and one tradition or custom.",
    prompts: [
      "Where did the family go during Tet?",
      "What did Minh and Linh see at grandparents' house?",
      "What happened at the parade?",
      "What custom or tradition is mentioned?",
    ],
    minWords: 25,
    modelAnswerText:
      "Last Tet Minh's family went to his grandparents' house. When they arrived, they saw red decorations and lucky money. In the afternoon they went to the city centre and watched a parade with music and dance. At night they saw fireworks by the lake. Giving lucky money is an old Tet custom.",
    successCriteria: [
      "At least 25 words",
      "Uses went or saw or had",
      "Mentions festival, tradition or custom",
      "Events in logical order",
    ],
    autoCheckKeywords: ["festival", "went", "saw", "tradition", "parade", "fireworks"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-school-festival-check",
    topicTag: TOPIC,
    title: "Check: Write About the School Festival",
    instructions: "Write about planning a school culture festival. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note for the school notice board about the culture festival. Include costumes, music or dance, and when the club will set up.",
    prompts: [
      "What will students wear?",
      "What will happen on stage?",
      "When will the club arrive to set up?",
      "Will there be a party after the show?",
    ],
    minWords: 25,
    modelAnswerText:
      "Our school culture festival is next month. Each class will wear a traditional costume for the parade. When we arrive at the gym, we will set up the stage first. There will be music and dance on stage. After the show we will have a small party for parents.",
    successCriteria: [
      "At least 25 words",
      "Uses festival or celebrate vocabulary",
      "Uses when-clause or past verb if possible",
      "Mentions costume, music or dance",
    ],
    autoCheckKeywords: ["festival", "costume", "music", "dance", "celebrate", "parade"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-parade-check",
    topicTag: TOPIC,
    title: "Check: Write About the Parade",
    instructions: "Write about watching a parade. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short email to a pen friend about Minh's family watching the national parade. Say when they arrived, what they saw, and what they will do tonight.",
    prompts: [
      "When did the family arrive?",
      "What did Minh see in the parade?",
      "What custom will they follow tonight?",
      "How did Minh feel about the holiday?",
    ],
    minWords: 25,
    modelAnswerText:
      "On the national holiday Minh's family went to the city early. When they arrived, they saw dancers in bright costumes and heard live music. Minh saw his school flag in the parade. Tonight they will watch fireworks by the lake — it is a Tet custom. Minh loves this festival holiday.",
    successCriteria: [
      "At least 25 words",
      "Uses went, saw or had",
      "Mentions parade or fireworks",
      "Uses when-clause or chronological order",
    ],
    autoCheckKeywords: ["parade", "saw", "went", "fireworks", "costume", "national"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
];

const FLYERS_SPEAKING_CRITERIA = {
  pronunciation: "Festival words (tradition, costume, fireworks) are clear enough to understand.",
  fluency: "Answers are connected; brief pauses are acceptable at Flyers level.",
  grammar: "Uses went, saw, had and when-clauses in short phrases.",
  vocabulary: "Uses culture and festival vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-festival-check",
    topicTag: TOPIC,
    title: "Check: Talk About a Festival",
    instructions: "Answer the questions about festivals and holidays. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about Minh's Tet holiday and family traditions.",
    sceneDescription:
      "Story outline: (1) clean house before Tet, (2) arrive at grandparents — decorations and lucky money, (3) parade with music and dance, (4) fireworks at the lake.",
    followUpQuestions: [
      "What custom does Minh's family follow before Tet?",
      "When they arrived at grandparents' house, what did they see?",
      "Where did the family go in the afternoon?",
      "What did they see in the night sky?",
      "Why do traditions matter to Minh?",
    ],
    suggestedAnswers: [
      "They clean the house — it is an old custom.",
      "They saw red decorations and lucky money on the table.",
      "They went to the city centre to watch the parade.",
      "They saw bright fireworks and clapped loudly.",
      "Customs connect families and celebrate culture.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-school-festival-check",
    topicTag: TOPIC,
    title: "Check: Talk About the School Festival",
    instructions: "Answer using festival planning vocabulary. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about planning the school culture festival.",
    sceneDescription:
      "Scene labels: classroom culture club, stage in gym, costumes for parade, music and dance performance, small party for parents after show.",
    followUpQuestions: [
      "What must the culture club plan?",
      "What did Minh see at last year's festival?",
      "What will each class wear?",
      "When will they set up the stage?",
      "What happens after the show?",
    ],
    suggestedAnswers: [
      "They must plan the school culture festival for next month.",
      "He saw a wonderful dance on stage.",
      "Each class will wear a traditional costume.",
      "When they arrive at the gym, they will set up the stage first.",
      "They will invite parents for a small party.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-parade-check",
    topicTag: TOPIC,
    title: "Check: Talk About the Parade",
    instructions: "Describe watching a national parade. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "Tell the examiner about Minh's family watching the national parade.",
    sceneDescription:
      "Timeline: arrive early → see dancers in costumes → hear music → spot school flag → celebrate with ice cream → fireworks tonight by the lake.",
    followUpQuestions: [
      "When did the family arrive at the parade?",
      "What did Minh see when the band passed?",
      "What custom will they follow tonight?",
      "What did Linh say about last year?",
      "Why is this holiday Minh's favourite?",
    ],
    suggestedAnswers: [
      "They went early so they could see everything clearly.",
      "He saw their school flag in the parade.",
      "They will watch fireworks by the lake — a Tet custom.",
      "Last year they had seats near the front.",
      "Festivals bring the whole city together.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  schoolFestival: {
    q1: "next month",
    q2: "costumes",
    q3: "party",
  },
  nationalParade: {
    q1: "dancers",
    q2: "school flag",
    q3: "fireworks",
  },
};
