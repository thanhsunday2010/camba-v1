/**
 * Movers Unit 4 — Hobbies and Free Time
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-04.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "hobbies-and-free-time";

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
      word: "hobby",
      ipa: "/ˈhɒbi/",
      partOfSpeech: "noun",
      vietnameseMeaning: "sở thích, thú vui",
      exampleSentence: "Collecting stamps is Minh's favourite hobby.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Sưu tập tem là sở thích yêu thích của Minh.",
  },
  {
    ...buildVocabWord({
      word: "drawing",
      ipa: "/ˈdrɔːɪŋ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "vẽ, bản vẽ",
      exampleSentence: "Linh is drawing a cat after school.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh đang vẽ một con mèo sau giờ học.",
  },
  {
    ...buildVocabWord({
      word: "dancing",
      ipa: "/ˈdɑːnsɪŋ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "nhảy múa",
      exampleSentence: "Linh likes dancing at school.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh thích nhảy múa ở trường.",
  },
  {
    ...buildVocabWord({
      word: "collect",
      ipa: "/kəˈlekt/",
      partOfSpeech: "verb",
      vietnameseMeaning: "sưu tập",
      exampleSentence: "Minh collects stamps from many countries.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh sưu tập tem từ nhiều quốc gia.",
  },
  {
    ...buildVocabWord({
      word: "stamp",
      ipa: "/stæmp/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tem thư",
      exampleSentence: "Minh has a new stamp from Japan.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh có một con tem mới từ Nhật Bản.",
  },
  {
    ...buildVocabWord({
      word: "comic",
      ipa: "/ˈkɒmɪk/",
      partOfSpeech: "noun",
      vietnameseMeaning: "truyện tranh",
      exampleSentence: "Minh is reading a comic book now.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh đang đọc một cuốn truyện tranh.",
  },
  {
    ...buildVocabWord({
      word: "cinema",
      ipa: "/ˈsɪnəmə/",
      partOfSpeech: "noun",
      vietnameseMeaning: "rạp chiếu phim",
      exampleSentence: "Minh and Linh are going to the cinema on Saturday.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh và Linh sẽ đi rạp chiếu phim vào thứ Bảy.",
  },
  {
    ...buildVocabWord({
      word: "concert",
      ipa: "/ˈkɒnsət/",
      partOfSpeech: "noun",
      vietnameseMeaning: "buổi hòa nhạc",
      exampleSentence: "There is a concert in the park on Sunday.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Có buổi hòa nhạc ở công viên vào Chủ nhật.",
  },
  {
    ...buildVocabWord({
      word: "swimming",
      ipa: "/ˈswɪmɪŋ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "bơi lội",
      exampleSentence: "Minh likes swimming in summer.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh thích bơi lội vào mùa hè.",
  },
  {
    ...buildVocabWord({
      word: "playing",
      ipa: "/ˈpleɪɪŋ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "chơi (một hoạt động)",
      exampleSentence: "They like playing football after school.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Các bạn thích chơi bóng đá sau giờ học.",
  },
  {
    ...buildVocabWord({
      word: "reading",
      ipa: "/ˈriːdɪŋ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đọc sách",
      exampleSentence: "Reading comics is fun for Minh.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Đọc truyện tranh rất vui với Minh.",
  },
  {
    ...buildVocabWord({
      word: "football",
      ipa: "/ˈfʊtbɔːl/",
      partOfSpeech: "noun",
      vietnameseMeaning: "bóng đá",
      exampleSentence: "Minh is playing football with his friends.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh đang chơi bóng đá với bạn bè.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Present continuous: I am playing / What are you doing?",
    explanation:
      "Use am/is/are + verb-ing to talk about what is happening now. I am reading. Linh is drawing. What are you doing? We are playing football.",
    examples: [
      "I am reading a comic.",
      "Linh is drawing a cat.",
      "What are you doing?",
      "They are playing football after school.",
    ],
    commonMistakes: [
      "I reading a comic (×) → I am reading a comic (✓)",
      "Linh is draw a cat (×) → Linh is drawing a cat (✓)",
      "What you doing? (×) → What are you doing? (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Like + -ing: I like swimming",
    explanation:
      "Use like + verb-ing to talk about hobbies and things you enjoy. I like swimming. Linh likes dancing. Do you like reading comics?",
    examples: [
      "I like swimming in summer.",
      "Linh likes dancing at school.",
      "Minh likes collecting stamps.",
      "Do you like playing football?",
    ],
    commonMistakes: [
      "I like swim (×) → I like swimming (✓)",
      "She like dancing (×) → She likes dancing (✓)",
      "I like to swimming (×) → I like swimming (✓) — at Movers use -ing after like",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Doing now vs liking always",
    explanation:
      "Present continuous = now (I am reading). Like + -ing = general hobby (I like reading). Minh is reading now, but he likes reading comics every day.",
    examples: [
      "Right now I am drawing.",
      "I like drawing pictures of animals.",
      "They are playing football now.",
      "They like playing football after school.",
    ],
    commonMistakes: [
      "I am like swimming (×) → I like swimming / I am swimming (✓)",
      "She is liking dancing (×) → She likes dancing (✓) — like is not usually continuous",
      "I like am reading (×) → I am reading / I like reading (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twelve hobby and free-time words at Movers A1 level.",
    "Use present continuous (I am playing) to talk about activities happening now.",
    "Use like + -ing (I like swimming) to talk about hobbies and preferences.",
    "Read short conversations and choose the best response.",
    "Listen to short dialogues and understand the main idea.",
    "Write a short message about hobbies and free time (at least 15 words).",
    "Talk about hobbies and weekend plans in short spoken answers.",
  ],
};

export const passageMinhHobbies = buildPassage({
  title: "Minh's Free Time",
  text: `Minh is nine. He lives in Hanoi with his mum. After school, Minh and his friend Linh do different hobbies.

Right now Minh is reading a comic book. Linh is drawing pictures of animals. "What are you doing?" Minh asks. "I am drawing a cat," Linh says.

Minh's favourite hobby is collecting stamps. He has stamps from many countries. On Saturday, Minh and Linh are going to the cinema. Mum says, "We can see a concert in the park on Sunday too."

Minh likes swimming in summer. Linh likes dancing at school. They both like playing football with friends after school.`,
});

export const listeningScriptAfterSchool = buildListeningScript({
  title: "After School at Home",
  setting: "Minh's living room, after school",
  speakers: [
    { name: "Mum", role: "mother" },
    { name: "Minh", role: "boy, 9" },
    { name: "Linh", role: "girl, friend" },
  ],
  lines: [
    { speaker: "Mum", text: "Hi, children! What are you doing?" },
    { speaker: "Minh", text: "I am reading a comic book, Mum." },
    { speaker: "Linh", text: "I am drawing a cat. Look!" },
    { speaker: "Mum", text: "That's nice. Is collecting stamps your hobby, Minh?" },
    { speaker: "Minh", text: "Yes! I am looking at my new stamp from Japan." },
    { speaker: "Linh", text: "I like dancing at school, but now I am drawing." },
    { speaker: "Mum", text: "After you finish, you can play football outside." },
    { speaker: "Minh", text: "Great! We like playing football after school." },
  ],
  audioNotes:
    "Warm after-school dialogue with present continuous. Moderate pace. Approx. 50 seconds.",
});

export const listeningScriptCinemaPlans = buildListeningScript({
  title: "Cinema and Concert Plans",
  setting: "Kitchen table, talking about the weekend",
  speakers: [
    { name: "Mum", role: "mother" },
    { name: "Minh", role: "boy, 9" },
    { name: "Linh", role: "girl, friend" },
  ],
  lines: [
    { speaker: "Minh", text: "Mum, can we go to the cinema on Saturday?" },
    { speaker: "Mum", text: "Yes, we can. What film do you want to see?" },
    { speaker: "Linh", text: "I like reading comics, so I want an adventure film!" },
    { speaker: "Minh", text: "Me too. After the cinema, can we play football?" },
    { speaker: "Mum", text: "On Sunday there is a concert in the park. We can go there too." },
    { speaker: "Linh", text: "Wow! I like dancing, so a concert is perfect." },
    { speaker: "Minh", text: "I like swimming, but the concert sounds fun." },
    { speaker: "Mum", text: "OK — cinema on Saturday, concert on Sunday!" },
  ],
  audioNotes:
    "Weekend plans dialogue about cinema and concert. Approx. 55 seconds.",
});

const MOVERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses present continuous and/or like + -ing correctly for hobby contexts.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses hobby and free-time words from the unit (drawing, cinema, swimming, etc.).",
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
    slug: "writing-now-activity-check",
    topicTag: TOPIC,
    title: "Check: Write About Now",
    instructions: "Write about what you are doing now. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to your friend Linh about what you are doing right now. Use I am + -ing at least once.",
    prompts: [
      "What are you doing now?",
      "Is your friend doing something different?",
      "What hobby is it?",
    ],
    minWords: 15,
    modelAnswerText:
      "Hi Linh, I am reading a comic book now. I am not drawing today. My hobby is collecting stamps. What are you doing?",
    successCriteria: [
      "At least 15 words",
      "Uses I am + -ing",
      "Mentions a hobby or activity",
      "Message is clear",
    ],
    autoCheckKeywords: ["am", "reading", "drawing", "hobby", "now"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-hobbies-check",
    topicTag: TOPIC,
    title: "Check: Write About Hobbies",
    instructions: "Write about your hobbies. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note about your hobbies. Use like + -ing at least once.",
    prompts: [
      "What hobbies do you like?",
      "What does your friend like?",
      "When do you do your hobbies?",
    ],
    minWords: 15,
    modelAnswerText:
      "I like swimming in summer and reading comics after school. Linh likes dancing at school. We both like playing football with friends.",
    successCriteria: [
      "At least 15 words",
      "Uses like + -ing",
      "Names at least one hobby",
      "Uses unit vocabulary",
    ],
    autoCheckKeywords: ["like", "swimming", "reading", "dancing", "playing"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-weekend-plans-check",
    topicTag: TOPIC,
    title: "Check: Write About Weekend Plans",
    instructions: "Write about your weekend plans. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message about going to the cinema or a concert. Mention at least one place from the unit.",
    prompts: [
      "Where are you going at the weekend?",
      "Who is going with you?",
      "What do you want to do there?",
    ],
    minWords: 15,
    modelAnswerText:
      "On Saturday Minh and I are going to the cinema. We want to see an adventure film. On Sunday there is a concert in the park. I like dancing, so it will be fun!",
    successCriteria: [
      "At least 15 words",
      "Mentions cinema or concert",
      "Uses unit vocabulary",
      "Plans are clear",
    ],
    autoCheckKeywords: ["cinema", "concert", "Saturday", "Sunday", "going"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
];

const MOVERS_SPEAKING_CRITERIA = {
  pronunciation: "Hobby words (drawing, swimming, cinema) are clear enough to understand.",
  fluency: "Answers are short but connected; brief pauses are acceptable.",
  grammar: "Uses present continuous and like + -ing in short phrases.",
  vocabulary: "Uses hobby and free-time vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-now-activity-check",
    topicTag: TOPIC,
    title: "Check: Talk About Now",
    instructions: "Answer the questions about what you are doing now. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about activities happening right now.",
    sceneDescription:
      "Story outline: (1) After school at Minh's home, (2) Minh is reading a comic, (3) Linh is drawing a cat, (4) Mum asks what they are doing.",
    followUpQuestions: [
      "What are you doing now?",
      "What is Linh doing?",
      "Are you collecting stamps now?",
      "What can you do after you finish?",
      "Do you like reading comics?",
    ],
    suggestedAnswers: [
      "I am reading a comic book.",
      "She is drawing a cat.",
      "No, I am reading now.",
      "We can play football outside.",
      "Yes, I like reading comics.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-hobbies-check",
    topicTag: TOPIC,
    title: "Check: Talk About Hobbies",
    instructions: "Answer questions about hobbies. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about hobbies and free time.",
    sceneDescription:
      "Hobby chart: Minh collects stamps; Linh likes dancing; both like playing football; Minh likes swimming in summer.",
    followUpQuestions: [
      "What is your favourite hobby?",
      "Do you like dancing?",
      "What does Minh collect?",
      "Do you like playing football?",
      "When do you like swimming?",
    ],
    suggestedAnswers: [
      "My favourite hobby is collecting stamps.",
      "Yes, I like dancing at school.",
      "He collects stamps from many countries.",
      "Yes, we like playing football after school.",
      "I like swimming in summer.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-weekend-plans-check",
    topicTag: TOPIC,
    title: "Check: Talk About Weekend Plans",
    instructions: "Talk about cinema and concert plans. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about weekend plans.",
    sceneDescription:
      "Weekend plan: Saturday cinema with Mum, Minh and Linh; Sunday concert in the park; Linh likes dancing so concert is perfect.",
    followUpQuestions: [
      "Where are you going on Saturday?",
      "What are you doing on Sunday?",
      "Who is going with you?",
      "Does Linh like the concert plan?",
      "What film do you want to see?",
    ],
    suggestedAnswers: [
      "We are going to the cinema.",
      "There is a concert in the park.",
      "Mum, Minh and Linh are going.",
      "Yes, she likes dancing, so a concert is perfect.",
      "We want to see an adventure film.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  afterSchool: {
    q1: "reading",
    q2: "drawing",
    q3: "football",
  },
  cinemaPlans: {
    q1: "cinema",
    q2: "concert",
    q3: "dancing",
  },
};
