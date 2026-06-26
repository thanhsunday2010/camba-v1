/**
 * Flyers Unit 1 — Family and Friends (Extended)
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-01.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "family-and-friends-extended";

const {
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildWritingCheck,
  buildSpeakingCheck,
} = createCambridgeUnitBuilder("flyers");

export const vocabularyBank = [
  buildVocabWord({
    word: "cousin",
    ipa: "/ˈkʌzn/",
    partOfSpeech: "noun",
    vietnameseMeaning: "anh/chị/em họ",
    exampleSentence: "My cousin Nam lives in Da Nang.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "aunt",
    ipa: "/ɑːnt/",
    partOfSpeech: "noun",
    vietnameseMeaning: "cô/dì",
    exampleSentence: "Minh is visiting his aunt in Da Nang.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "uncle",
    ipa: "/ˈʌŋkl/",
    partOfSpeech: "noun",
    vietnameseMeaning: "chú/bác",
    exampleSentence: "His uncle works near the beach.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "neighbour",
    ipa: "/ˈneɪbə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "hàng xóm",
    exampleSentence: "Our neighbour Linh often helps my aunt.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "guest",
    ipa: "/ɡest/",
    partOfSpeech: "noun",
    vietnameseMeaning: "khách",
    exampleSentence: "We invited ten guests to the family party.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "invite",
    ipa: "/ɪnˈvaɪt/",
    partOfSpeech: "verb",
    vietnameseMeaning: "mời",
    exampleSentence: "Aunt Hoa invited Linh to the party.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "visit",
    ipa: "/ˈvɪzɪt/",
    partOfSpeech: "verb",
    vietnameseMeaning: "thăm",
    exampleSentence: "Minh has never visited Da Nang before.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "stay",
    ipa: "/steɪ/",
    partOfSpeech: "verb",
    vietnameseMeaning: "ở lại",
    exampleSentence: "He will stay with his aunt for three days.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "relative",
    ipa: "/ˈrelətɪv/",
    partOfSpeech: "noun",
    vietnameseMeaning: "người thân",
    exampleSentence: "Many relatives came to celebrate with us.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "welcome",
    ipa: "/ˈwelkəm/",
    partOfSpeech: "verb",
    vietnameseMeaning: "chào đón",
    exampleSentence: "They welcomed all the guests at the door.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "party",
    ipa: "/ˈpɑːti/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bữa tiệc",
    exampleSentence: "The family party is on Saturday evening.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "celebrate",
    ipa: "/ˈselɪbreɪt/",
    partOfSpeech: "verb",
    vietnameseMeaning: "ăn mừng",
    exampleSentence: "We celebrate my uncle's birthday every year.",
    difficulty: 2,
    topic: TOPIC,
  }),
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Present perfect: ever, never",
    explanation:
      "Use present perfect (have/has + past participle) with ever and never to talk about life experiences. Ever goes in questions: Have you ever visited Da Nang? Never means not at any time: I have never stayed at the beach.",
    examples: [
      "Have you ever visited your aunt in Da Nang?",
      "Minh has never been to the beach before.",
      "She has never invited so many guests.",
      "We have always celebrated birthdays together.",
    ],
    commonMistakes: [
      "I never have visited Da Nang (×) → I have never visited Da Nang (✓)",
      "Has you ever stayed with your cousin? (×) → Have you ever stayed with your cousin? (✓)",
      "Minh has visit his aunt (×) → Minh has visited his aunt (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Relative clauses: who, which",
    explanation:
      "Use who for people and which for things. The relative clause gives extra information: My aunt, who lives in Da Nang, invited us. The house, which is near the beach, has a big garden.",
    examples: [
      "Minh has an aunt who lives in Da Nang.",
      "Linh is the neighbour who helped us.",
      "The party, which was on Saturday, was wonderful.",
      "This is the guest who never visits us.",
    ],
    commonMistakes: [
      "The aunt which lives in Da Nang (×) → The aunt who lives in Da Nang (✓)",
      "The party who was fun (×) → The party which was fun (✓)",
      "My cousin who he is eleven (×) → My cousin, who is eleven, (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twelve family and social words at Flyers A2 level.",
    "Use present perfect with ever and never to talk about life experiences.",
    "Form relative clauses with who (people) and which (things).",
    "Read a short text about a family visit and find specific details.",
    "Listen for names, places and times in dialogues about parties and visits.",
    "Write a short message (at least 25 words) about family visits or invitations.",
    "Talk about relatives, neighbours and parties in extended spoken answers.",
  ],
};

export const passageMinhFamilyVisit = buildPassage({
  title: "Minh's Visit to Da Nang",
  text: `Minh is eleven and lives in Hanoi. Last month he visited his aunt Hoa and uncle Binh in Da Nang. He has never stayed by the sea before, so he was very excited.

His aunt, who works at a hospital, welcomed him at the door. His cousin Nam, who is the same age as Minh, showed him the beach. Their neighbour Linh, who is a good friend of the family, came to dinner on the first night.

On Saturday the family had a party. They invited many relatives and guests. Minh has never seen so many cousins! They celebrated Uncle Binh's birthday with cake and music. Minh stayed for three days and has already promised to visit again.`,
    "An eleven-year-old Vietnamese boy on a sunny beach in Da Nang with his aunt, uncle and cousin, a family party with guests in the background, cheerful children's book illustration style.",
});

export const listeningScriptPartyInvite = buildListeningScript({
  title: "Inviting Guests to the Party",
  setting: "Aunt Hoa's kitchen in Da Nang, afternoon",
  speakers: [
    { name: "Aunt Hoa", role: "aunt" },
    { name: "Minh", role: "boy, 11" },
  ],
  lines: [
    { speaker: "Aunt Hoa", text: "Minh, we need to invite more guests for Saturday's party." },
    { speaker: "Minh", text: "Have you invited our neighbour Linh yet?" },
    { speaker: "Aunt Hoa", text: "Yes, I invited her yesterday. She said yes." },
    { speaker: "Minh", text: "What about your relatives from Hue?" },
    { speaker: "Aunt Hoa", text: "I've invited five relatives. The party starts at six o'clock." },
    { speaker: "Minh", text: "Great! I've never been to a big family party here." },
    { speaker: "Aunt Hoa", text: "We will welcome all the guests at the door. Can you help?" },
  ],
  audioNotes:
    "Warm aunt-and-nephew dialogue, moderate pace. Approx. 55 seconds.",
});

export const listeningScriptCousinVisit = buildListeningScript({
  title: "Cousin Nam Stays Overnight",
  setting: "Minh's bedroom in Da Nang, evening",
  speakers: [
    { name: "Minh", role: "boy, 11, visiting" },
    { name: "Nam", role: "cousin, 11" },
  ],
  lines: [
    { speaker: "Nam", text: "Can you stay one more night, Minh? My birthday is tomorrow." },
    { speaker: "Minh", text: "I have never stayed with a cousin for so long! I'll ask my aunt." },
    { speaker: "Nam", text: "She said you can stay until Sunday." },
    { speaker: "Minh", text: "Have you ever visited Hanoi?" },
    { speaker: "Nam", text: "No, I have never been there. I want to visit you next summer." },
    { speaker: "Minh", text: "My neighbour Linh will welcome you. We can celebrate together." },
    { speaker: "Nam", text: "Perfect! Let's plan the visit now." },
  ],
  audioNotes:
    "Friendly cousin conversation before bedtime. Approx. 50 seconds.",
});

const FLYERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses present perfect and relative clauses correctly where appropriate.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses family and social words from the unit (aunt, cousin, invite, guest, etc.).",
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
    slug: "writing-visit-check",
    topicTag: TOPIC,
    title: "Check: Write About a Visit",
    instructions: "Write a short message about visiting a relative. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a message to your English teacher about a time you visited a relative. Say who you visited, where they live, and one thing you did together.",
    prompts: [
      "Who did you visit?",
      "Where do they live?",
      "Have you ever visited them before?",
      "What did you do together?",
    ],
    minWords: 25,
    modelAnswerText:
      "Last summer I visited my aunt who lives in Da Nang. I have never stayed by the sea before. My cousin Nam, who is my age, showed me the beach. We had dinner with our neighbour Linh. I want to visit again next year.",
    successCriteria: [
      "At least 25 words",
      "Mentions a relative (aunt, uncle or cousin)",
      "Uses visit, stay or welcome",
      "Present perfect or past simple mostly correct",
    ],
    autoCheckKeywords: ["visit", "aunt", "cousin", "uncle", "family"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-invite-check",
    topicTag: TOPIC,
    title: "Check: Write an Invitation",
    instructions: "Write 3–4 sentences inviting someone to a party. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short invitation to a friend or neighbour for a family party. Say when and where the party is and who will be there.",
    prompts: [
      "Who are you inviting?",
      "When is the party?",
      "Where will it be?",
      "How many guests or relatives will come?",
    ],
    minWords: 25,
    modelAnswerText:
      "Dear Linh, I want to invite you to our family party on Saturday at six o'clock. My aunt and uncle, who live in Da Nang, will welcome all the guests. Many relatives are coming to celebrate my uncle's birthday. Please come!",
    successCriteria: [
      "At least 25 words",
      "Includes invite or invitation idea",
      "Says when or where the party is",
      "Uses party, guest or celebrate",
    ],
    autoCheckKeywords: ["invite", "party", "guest", "Saturday", "celebrate"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-family-check",
    topicTag: TOPIC,
    title: "Check: My Extended Family",
    instructions: "Write about your extended family and neighbours. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note to a pen friend describing your aunt, uncle, cousin or neighbour. Use who or which in at least one sentence.",
    prompts: [
      "Who is an important relative in your family?",
      "Do you have a neighbour you know well?",
      "Have you ever invited them to your home?",
      "What do you like doing together?",
    ],
    minWords: 25,
    modelAnswerText:
      "I have an aunt who lives in another city. I have never visited her alone, but we talk on the phone. My neighbour Linh, who is my age, is a good friend. We sometimes celebrate birthdays together. Last month I invited her to a small party at my house.",
    successCriteria: [
      "At least 25 words",
      "Names aunt, uncle, cousin or neighbour",
      "Uses who or which at least once",
      "Uses ever or never if possible",
    ],
    autoCheckKeywords: ["aunt", "cousin", "neighbour", "who", "family"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
];

const FLYERS_SPEAKING_CRITERIA = {
  pronunciation: "Family words (cousin, neighbour, relative) are clear enough to understand.",
  fluency: "Answers are connected; brief pauses are acceptable at Flyers level.",
  grammar: "Uses present perfect and relative clauses in short phrases.",
  vocabulary: "Uses family and social vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-visit-check",
    topicTag: TOPIC,
    title: "Check: Talk About Visiting Relatives",
    instructions: "Answer the questions about visiting family. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about visits to relatives.",
    sceneDescription:
      "Story outline: (1) boy arriving at aunt's house with a bag, (2) cousins at the beach, (3) family dinner table, (4) boy waving goodbye at the door.",
    followUpQuestions: [
      "Have you ever visited an aunt or uncle in another city?",
      "Who did you stay with?",
      "What did you do together?",
      "Have you ever stayed for more than one night?",
      "Would you like to visit again?",
    ],
    suggestedAnswers: [
      "Yes, I visited my aunt in Da Nang last month.",
      "I stayed with my aunt, uncle and cousin.",
      "My cousin showed me the beach and we had a family dinner.",
      "No, I have never stayed for a whole week.",
      "Yes, I want to visit again next summer.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-party-check",
    topicTag: TOPIC,
    title: "Check: Talk About a Party",
    instructions: "Answer using party vocabulary. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about a family party or celebration.",
    sceneDescription:
      "A family party with guests, cake, balloons and relatives talking — labels show invite, guest, celebrate, welcome.",
    followUpQuestions: [
      "Have you ever been to a big family party?",
      "Who did you invite or who invited you?",
      "How many guests or relatives were there?",
      "What did you do to celebrate?",
      "Did you welcome the guests?",
    ],
    suggestedAnswers: [
      "Yes, I went to my uncle's birthday party in Da Nang.",
      "My aunt invited our neighbour and many relatives.",
      "There were about ten guests.",
      "We ate cake and listened to music.",
      "Yes, I helped welcome people at the door.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-family-check",
    topicTag: TOPIC,
    title: "Check: Describe Your Extended Family",
    instructions: "Describe relatives and neighbours. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "Tell the examiner about your extended family and neighbours.",
    sceneDescription:
      "A family tree sketch with aunt, uncle, cousin labels plus a neighbour's house next door — Minh and Linh waving.",
    followUpQuestions: [
      "Do you have a cousin who lives near you?",
      "Tell me about a relative who lives in another city.",
      "Do you know your neighbours well?",
      "Have you ever invited a neighbour to your home?",
      "Who is the oldest relative in your family?",
    ],
    suggestedAnswers: [
      "My cousin Nam lives in Da Nang, not near me.",
      "My aunt Hoa, who is a doctor, lives in Da Nang.",
      "Yes, my neighbour Linh is my good friend.",
      "Yes, I invited her to a birthday party.",
      "My grandmother, who is seventy, is the oldest.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  partyInvite: {
    q1: "Linh",
    q2: "Saturday",
    q3: "six o'clock",
  },
  cousinVisit: {
    q1: "Sunday",
    q2: "Hanoi",
    q3: "next summer",
  },
};
