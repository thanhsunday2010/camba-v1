/**
 * Movers Unit 2 — The Body and Health
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-02.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "the-body-and-health";

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
      word: "head",
      ipa: "/hed/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đầu",
      exampleSentence: "Minh has got a pain in his head.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh bị đau ở đầu.",
  },
  {
    ...buildVocabWord({
      word: "stomach",
      ipa: "/ˈstʌmək/",
      partOfSpeech: "noun",
      vietnameseMeaning: "dạ dày, bụng",
      exampleSentence: "My stomach hurts after lunch.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bụng tôi đau sau bữa trưa.",
  },
  {
    ...buildVocabWord({
      word: "tooth",
      ipa: "/tuːθ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "răng",
      exampleSentence: "The doctor looks at Minh's tooth.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bác sĩ kiểm tra răng của Minh.",
  },
  {
    ...buildVocabWord({
      word: "arm",
      ipa: "/ɑːm/",
      partOfSpeech: "noun",
      vietnameseMeaning: "cánh tay",
      exampleSentence: "The nurse checks Minh's arm.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Y tá kiểm tra cánh tay của Minh.",
  },
  {
    ...buildVocabWord({
      word: "doctor",
      ipa: "/ˈdɒktə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "bác sĩ",
      exampleSentence: "The doctor says Minh should rest.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bác sĩ bảo Minh nên nghỉ ngơi.",
  },
  {
    ...buildVocabWord({
      word: "hospital",
      ipa: "/ˈhɒspɪtl/",
      partOfSpeech: "noun",
      vietnameseMeaning: "bệnh viện",
      exampleSentence: "Mum takes Minh to the hospital.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mẹ đưa Minh đến bệnh viện.",
  },
  {
    ...buildVocabWord({
      word: "nurse",
      ipa: "/nɜːs/",
      partOfSpeech: "noun",
      vietnameseMeaning: "y tá",
      exampleSentence: "A kind nurse helps Minh at the hospital.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Một y tá tốt bụng giúp Minh ở bệnh viện.",
  },
  {
    ...buildVocabWord({
      word: "ill",
      ipa: "/ɪl/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "ốm, bị bệnh",
      exampleSentence: "Minh is ill and cannot go to school.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh bị ốm và không thể đi học.",
  },
  {
    ...buildVocabWord({
      word: "headache",
      ipa: "/ˈhedeɪk/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đau đầu",
      exampleSentence: "I've got a headache today.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Hôm nay tôi bị đau đầu.",
  },
  {
    ...buildVocabWord({
      word: "medicine",
      ipa: "/ˈmedsn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thuốc",
      exampleSentence: "You should take this medicine twice a day.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bạn nên uống thuốc này hai lần mỗi ngày.",
  },
  {
    ...buildVocabWord({
      word: "rest",
      ipa: "/rest/",
      partOfSpeech: "verb",
      vietnameseMeaning: "nghỉ ngơi",
      exampleSentence: "You should rest when you feel sick.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bạn nên nghỉ ngơi khi cảm thấy mệt/ốm.",
  },
  {
    ...buildVocabWord({
      word: "feel sick",
      ipa: "/fiːl sɪk/",
      partOfSpeech: "phrase",
      vietnameseMeaning: "cảm thấy mệt/ốm, buồn nôn",
      exampleSentence: "Minh feels sick at school.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh cảm thấy mệt/ốm ở trường.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Have got: I've got a headache",
    explanation:
      "Use have got (British English) to say you have a problem or symptom. I've got = I have got. For he/she/it use has got: He's got a headache. In questions: Have you got a headache?",
    examples: [
      "I've got a headache.",
      "She's got a stomach ache.",
      "Have you got a toothache?",
      "Minh has got a pain in his head.",
    ],
    commonMistakes: [
      "I have got headache (×) → I've got a headache (✓)",
      "He have got a toothache (×) → He's got a toothache (✓)",
      "I've got headache (×) → I've got a headache (✓) — need a/an",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Should for advice: You should rest",
    explanation:
      "Use should + base verb to give friendly advice. You should rest. You shouldn't go to school when you are ill. Should comes before the main verb without to.",
    examples: [
      "You should rest at home.",
      "You should take this medicine.",
      "You shouldn't play football when you are ill.",
      "The doctor says you should drink water.",
    ],
    commonMistakes: [
      "You should to rest (×) → You should rest (✓)",
      "You should rests (×) → You should rest (✓)",
      "You shouldn't goes to school (×) → You shouldn't go to school (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Feel + adjective: feel sick / feel ill",
    explanation:
      "Use feel + adjective to describe how your body is. Feel sick = cảm thấy mệt/ốm. Feel ill = cảm thấy bệnh. In questions: Do you feel sick?",
    examples: [
      "Minh feels sick at school.",
      "Do you feel ill today?",
      "I don't feel well.",
      "She feels better after she rests.",
    ],
    commonMistakes: [
      "I feel sickly today (×) → I feel sick today (✓)",
      "He feels a sick (×) → He feels sick (✓)",
      "Do you feel sickly? (×) → Do you feel sick? (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twelve body and health words at Movers A1 level.",
    "Use have got to describe symptoms (I've got a headache).",
    "Use should to give and understand simple health advice (You should rest).",
    "Read a short text about feeling ill and match definitions to words.",
    "Listen for health problems and advice in short dialogues.",
    "Write a short note about feeling unwell (at least 15 words).",
    "Talk about symptoms and health advice in short spoken answers.",
  ],
};

export const passageMinhFeelsIll = buildPassage({
  title: "Minh Feels Ill",
  text: `Minh is nine. He lives in Hanoi. This morning Minh does not feel well. He has got a headache and his stomach hurts.

At school Minh tells his teacher. The teacher calls Minh's mum. Mum takes Minh to the hospital. A kind nurse checks his arm and takes his temperature.

The doctor looks at Minh's tooth and says, "You are ill. You should rest today. Take this medicine twice a day." Minh goes home and rests on the sofa. His friend Linh sends a message: "Get well soon!"`,
});

export const listeningScriptDoctor = buildListeningScript({
  title: "At the Doctor",
  setting: "A small hospital room in Hanoi, quiet afternoon",
  speakers: [
    { name: "Doctor", role: "doctor" },
    { name: "Minh", role: "boy, 9" },
    { name: "Nurse", role: "nurse" },
  ],
  lines: [
    { speaker: "Doctor", text: "Hello Minh. What's wrong?" },
    { speaker: "Minh", text: "I've got a headache, Doctor." },
    { speaker: "Doctor", text: "Have you got a stomach ache too?" },
    { speaker: "Minh", text: "Yes, my stomach hurts." },
    { speaker: "Doctor", text: "Open your mouth, please. You've got a bad tooth." },
    { speaker: "Doctor", text: "You should rest today. Take this medicine twice a day." },
    { speaker: "Minh", text: "Thank you, Doctor." },
    { speaker: "Nurse", text: "You can go home now, Minh. Rest well!" },
  ],
  audioNotes:
    "Calm doctor–patient dialogue with a nurse closing line. Moderate pace. Approx. 50 seconds.",
});

export const listeningScriptCallMum = buildListeningScript({
  title: "Calling Mum from School",
  setting: "School office, phone call to Minh's home",
  speakers: [
    { name: "Teacher", role: "teacher" },
    { name: "Mum", role: "mother" },
    { name: "Minh", role: "boy, 9" },
  ],
  lines: [
    { speaker: "Teacher", text: "Hello, Mrs Tran. This is Minh's teacher." },
    { speaker: "Mum", text: "Hello. Is Minh OK?" },
    { speaker: "Teacher", text: "Minh feels sick. He's got a headache." },
    { speaker: "Mum", text: "Oh no! Should I come to school?" },
    { speaker: "Teacher", text: "Yes, please. He's resting in the office." },
    { speaker: "Mum", text: "I'll come now. He should see a doctor." },
    { speaker: "Minh", text: "Mum, my arm doesn't hurt. It's my head." },
    { speaker: "Mum", text: "Don't worry. We'll go to the hospital." },
  ],
  audioNotes:
    "Phone-style dialogue: teacher, mum, then Minh speaks. Approx. 45 seconds.",
});

const MOVERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses have got and should correctly for health contexts.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses body and health words from the unit (headache, medicine, rest, etc.).",
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
    slug: "writing-symptoms-check",
    topicTag: TOPIC,
    title: "Check: Write About Feeling Ill",
    instructions: "Write about how you feel when you are ill. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note to your teacher explaining that you feel sick today. Say what hurts and use have got at least once.",
    prompts: [
      "How do you feel today?",
      "What have you got? (headache, stomach ache, etc.)",
      "Can you come to school?",
    ],
    minWords: 15,
    modelAnswerText:
      "Dear Teacher, I feel sick today. I've got a headache and my stomach hurts. I am ill and I cannot come to school. I should rest at home. Thank you.",
    successCriteria: [
      "At least 15 words",
      "Uses feel sick or ill",
      "Uses have got for a symptom",
      "Message is clear and polite",
    ],
    autoCheckKeywords: ["feel", "headache", "ill", "got", "rest"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-advice-check",
    topicTag: TOPIC,
    title: "Check: Write Health Advice",
    instructions: "Write advice for a friend who is ill. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Your friend Linh has got a headache. Write a short message with two pieces of advice using should.",
    prompts: [
      "What should Linh do?",
      "What shouldn't she do?",
      "What medicine or rest advice can you give?",
    ],
    minWords: 15,
    modelAnswerText:
      "Hi Linh, you should rest at home today. You shouldn't go to school. You should drink water and take your medicine. I hope you feel better soon!",
    successCriteria: [
      "At least 15 words",
      "Uses should at least twice",
      "Gives sensible health advice",
      "Uses unit vocabulary",
    ],
    autoCheckKeywords: ["should", "rest", "medicine", "headache", "home"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-doctor-check",
    topicTag: TOPIC,
    title: "Check: Write About a Doctor Visit",
    instructions: "Write about going to the doctor or hospital. Use at least 15 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to your pen friend about when Minh went to the hospital. Say what the doctor and nurse did and what Minh should do.",
    prompts: [
      "Where did Minh go?",
      "What did the doctor say?",
      "What should Minh do at home?",
    ],
    minWords: 15,
    modelAnswerText:
      "Minh went to the hospital with his mum. The nurse checked his arm. The doctor said he is ill and he has got a bad tooth. He should rest and take medicine twice a day.",
    successCriteria: [
      "At least 15 words",
      "Mentions doctor or hospital",
      "Uses should for advice",
      "Uses have got or ill",
    ],
    autoCheckKeywords: ["hospital", "doctor", "should", "medicine", "rest"],
    rubric: MOVERS_WRITING_RUBRIC,
  }),
];

const MOVERS_SPEAKING_CRITERIA = {
  pronunciation: "Health words (headache, stomach, medicine) are clear enough to understand.",
  fluency: "Answers are short but connected; brief pauses are acceptable.",
  grammar: "Uses have got and should in short phrases.",
  vocabulary: "Uses body and health vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-symptoms-check",
    topicTag: TOPIC,
    title: "Check: Talk About Symptoms",
    instructions: "Answer the questions about feeling ill. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about how you feel when you are ill.",
    sceneDescription:
      "Story outline: (1) Minh at school holding his head, (2) teacher calling Mum on the phone, (3) Mum driving Minh to hospital, (4) doctor checking Minh's tooth.",
    followUpQuestions: [
      "How do you feel when you are ill?",
      "Have you got a headache before?",
      "What hurts when you feel sick?",
      "Do you tell your teacher or your mum?",
      "Where do you go when you are very ill?",
    ],
    suggestedAnswers: [
      "I feel sick and tired.",
      "Yes, I've got a headache sometimes.",
      "My head and stomach hurt.",
      "I tell my mum first.",
      "I go to the hospital with my mum.",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-advice-check",
    topicTag: TOPIC,
    title: "Check: Give Health Advice",
    instructions: "Give advice using should. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks you to give advice to a friend who is ill.",
    sceneDescription:
      "Linh is at home in bed with a headache. Minh wants to help. Labels: rest, medicine, water, don't go to school.",
    followUpQuestions: [
      "What should Linh do when she has a headache?",
      "Should she go to school?",
      "What should she take?",
      "What shouldn't she do?",
      "What do you say to a sick friend?",
    ],
    suggestedAnswers: [
      "She should rest at home.",
      "No, she shouldn't go to school.",
      "She should take medicine and drink water.",
      "She shouldn't play football.",
      "I say: Get well soon!",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
  buildSpeakingCheck({
    slug: "speaking-doctor-check",
    topicTag: TOPIC,
    title: "Check: Talk About the Doctor",
    instructions: "Describe a visit to the doctor or hospital. Speak for up to 90 seconds.",
    sortOrder: 2,
    prompt: "Tell the examiner about Minh's visit to the hospital.",
    sceneDescription:
      "Timeline: feel sick at school → Mum arrives → hospital → nurse checks arm → doctor looks at tooth → go home and rest.",
    followUpQuestions: [
      "Why did Minh go to the hospital?",
      "Who helped Minh at the hospital?",
      "What did the doctor say?",
      "What should Minh do at home?",
      "What did Linh say to Minh?",
    ],
    suggestedAnswers: [
      "Because he was ill and had a headache.",
      "A nurse and a doctor helped him.",
      "The doctor said he should rest and take medicine.",
      "He should rest on the sofa.",
      "Linh said: Get well soon!",
    ],
    assessmentCriteria: MOVERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 90,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  doctor: {
    q1: "headache",
    q2: "tooth",
    q3: "medicine",
  },
  callMum: {
    q1: "headache",
    q2: "doctor",
    q3: "hospital",
  },
};
