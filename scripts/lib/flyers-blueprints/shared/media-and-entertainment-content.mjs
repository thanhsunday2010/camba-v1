/**
 * Flyers Unit 4 — Media and Entertainment
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-04.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "media-and-entertainment";

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
      word: "television",
      ipa: "/ˈtelɪvɪʒn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tivi, truyền hình",
      exampleSentence: "Minh watches television after he finishes homework.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh xem tivi sau khi làm xong bài tập.",
  },
  {
    ...buildVocabWord({
      word: "programme",
      ipa: "/ˈprəʊɡræm/",
      partOfSpeech: "noun",
      vietnameseMeaning: "chương trình (phát sóng)",
      exampleSentence: "Their favourite programme starts at seven o'clock.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chương trình yêu thích của họ bắt đầu lúc bảy giờ.",
  },
  {
    ...buildVocabWord({
      word: "channel",
      ipa: "/ˈtʃænl/",
      partOfSpeech: "noun",
      vietnameseMeaning: "kênh (truyền hình)",
      exampleSentence: "Linh changed the channel to watch the news.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh đổi kênh để xem tin tức.",
  },
  {
    ...buildVocabWord({
      word: "news",
      ipa: "/njuːz/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tin tức",
      exampleSentence: "Dad watches the news on television every evening.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bố xem tin tức trên tivi mỗi buổi tối.",
  },
  {
    ...buildVocabWord({
      word: "radio",
      ipa: "/ˈreɪdiəʊ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đài phát thanh",
      exampleSentence: "Grandma listens to the radio in the kitchen.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bà nghe đài phát thanh trong bếp.",
  },
  {
    ...buildVocabWord({
      word: "watch",
      ipa: "/wɒtʃ/",
      partOfSpeech: "verb",
      vietnameseMeaning: "xem",
      exampleSentence: "Do you want to watch a film tonight?",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bạn có muốn xem phim tối nay không?",
  },
  {
    ...buildVocabWord({
      word: "screen",
      ipa: "/skriːn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "màn hình",
      exampleSentence: "The screen was too small for the whole audience.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Màn hình quá nhỏ cho cả khán giả.",
  },
  {
    ...buildVocabWord({
      word: "cartoon",
      ipa: "/kɑːˈtuːn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "phim hoạt hình",
      exampleSentence: "Minh enjoys watching cartoons on Saturday morning.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh thích xem phim hoạt hình vào sáng thứ Bảy.",
  },
  {
    ...buildVocabWord({
      word: "comedy",
      ipa: "/ˈkɒmədi/",
      partOfSpeech: "noun",
      vietnameseMeaning: "phim/chương trình hài",
      exampleSentence: "The comedy made the whole audience laugh loudly.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chương trình hài khiến cả khán giả cười to.",
  },
  {
    ...buildVocabWord({
      word: "documentary",
      ipa: "/ˌdɒkjuˈmentri/",
      partOfSpeech: "noun",
      vietnameseMeaning: "phim tài liệu",
      exampleSentence: "Linh watched an interesting documentary about animals.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh xem một phim tài liệu thú vị về động vật.",
  },
  {
    ...buildVocabWord({
      word: "film",
      ipa: "/fɪlm/",
      partOfSpeech: "noun",
      vietnameseMeaning: "phim",
      exampleSentence: "They want to see a new film at the cinema.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Họ muốn xem một bộ phim mới ở rạp chiếu phim.",
  },
  {
    ...buildVocabWord({
      word: "video",
      ipa: "/ˈvɪdiəʊ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "video",
      exampleSentence: "Minh shared a funny video with his class.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh chia sẻ một video hài với lớp.",
  },
  {
    ...buildVocabWord({
      word: "scene",
      ipa: "/siːn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "cảnh (trong phim)",
      exampleSentence: "The best scene in the film is on a big ship.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Cảnh hay nhất trong phim là trên một con tàu lớn.",
  },
  {
    ...buildVocabWord({
      word: "actor",
      ipa: "/ˈæktə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "diễn viên",
      exampleSentence: "The actor in the comedy is very famous.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Diễn viên trong phim hài rất nổi tiếng.",
  },
  {
    ...buildVocabWord({
      word: "audience",
      ipa: "/ˈɔːdiəns/",
      partOfSpeech: "noun",
      vietnameseMeaning: "khán giả",
      exampleSentence: "The audience clapped when the film finished.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Khán giả vỗ tay khi phim kết thúc.",
  },
  {
    ...buildVocabWord({
      word: "enjoy",
      ipa: "/ɪnˈdʒɔɪ/",
      partOfSpeech: "verb",
      vietnameseMeaning: "thích, tận hưởng",
      exampleSentence: "I enjoy watching documentaries about nature.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Tôi thích xem phim tài liệu về thiên nhiên.",
  },
  {
    ...buildVocabWord({
      word: "boring",
      ipa: "/ˈbɔːrɪŋ/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "nhàm chán",
      exampleSentence: "Minh thought the news programme was boring.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh thấy chương trình tin tức nhàm chán.",
  },
  {
    ...buildVocabWord({
      word: "exciting",
      ipa: "/ɪkˈsaɪtɪŋ/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "hấp dẫn, thú vị",
      exampleSentence: "The film had an exciting scene at the end.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Phim có một cảnh hấp dẫn ở cuối.",
  },
  {
    ...buildVocabWord({
      word: "favourite",
      ipa: "/ˈfeɪvərɪt/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "yêu thích nhất",
      exampleSentence: "Cartoons are Linh's favourite programmes.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Phim hoạt hình là chương trình yêu thích của Linh.",
  },
  {
    ...buildVocabWord({
      word: "interesting",
      ipa: "/ˈɪntrəstɪŋ/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "thú vị",
      exampleSentence: "The documentary about Hanoi was very interesting.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Phim tài liệu về Hà Nội rất thú vị.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Gerunds and infinitives: enjoy watching, want to see",
    explanation:
      "After enjoy, like and love, use verb + -ing: I enjoy watching cartoons. After want, would like and need, use to + verb: I want to see a film. Do not mix them: enjoy to watch (×) → enjoy watching (✓).",
    examples: [
      "Minh enjoys watching comedy programmes on television.",
      "Linh wants to see a new film at the cinema.",
      "We love listening to music on the radio.",
      "Do you want to watch the news tonight?",
    ],
    commonMistakes: [
      "I enjoy to watch cartoons (×) → I enjoy watching cartoons (✓)",
      "She wants seeing a film (×) → She wants to see a film (✓)",
      "They enjoy watch television (×) → They enjoy watching television (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Too / enough",
    explanation:
      "Use too + adjective to say something is more than you want: The screen is too small. Use adjective + enough to say something is sufficient: The room is dark enough for a film. Enough can also come before nouns: We have enough time.",
    examples: [
      "The comedy was too boring for Minh.",
      "The film is exciting enough for the whole family.",
      "The television screen is too small for a big audience.",
      "We have enough time to watch one programme.",
    ],
    commonMistakes: [
      "The screen is enough small (×) → The screen is too small (✓)",
      "It is too enough exciting (×) → It is exciting enough (✓)",
      "The programme is too boring enough (×) → The programme is too boring (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Gerunds/infinitives + too/enough (mixed)",
    explanation:
      "Combine enjoy/want patterns with too/enough when giving opinions about media. Enjoy + -ing for activities you like; want to + verb for plans; too + adjective for problems; adjective + enough for satisfaction.",
    examples: [
      "Minh enjoys watching cartoons but the news is too boring.",
      "Linh wants to see the film because the actor is interesting enough.",
      "The documentary is interesting enough — I enjoy learning from it.",
      "The screen is too small, so we want to watch at the cinema.",
    ],
    commonMistakes: [
      "I enjoy to watch but it is too boring (×) → I enjoy watching but it is too boring (✓)",
      "She wants see a film enough exciting (×) → She wants to see a film exciting enough (✓)",
      "The comedy is too enough funny (×) → The comedy is funny enough (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twenty media and entertainment words at Flyers A2 level.",
    "Use enjoy + -ing and want to + verb to talk about TV and films.",
    "Use too and enough to give opinions about programmes and screens.",
    "Complete conversations with missing sentences about TV choices.",
    "Listen for speakers' opinions and attitudes about programmes.",
    "Write a short message (at least 25 words) about favourite programmes or films.",
    "Talk about TV, films and opinions in extended spoken answers.",
  ],
};

export const passageMinhTV = buildPassage({
  title: "Minh and Linh Choose a Programme",
  text: `Minh is eleven and lives in Hanoi. After homework he often watches television with his friend Linh. Tonight they cannot agree on a programme.

Minh: "Let's watch the news on channel three."
Linh: "The news is too boring! I want to see a cartoon."
Minh: "Cartoons are for little children. I enjoy watching documentaries."
Linh: "Documentaries can be interesting, but your screen is too small. Let's watch a comedy — comedies are my favourite programmes."
Minh: "OK, but only if the actor is funny enough. Last week's comedy was boring."
Linh: "This one has an exciting scene on a ship. The whole audience at school said it was interesting."

They changed the channel and found a comedy with a famous actor. Minh stopped the programme once because the screen was too dark, but Linh said the film was exciting enough. In the end both friends enjoyed watching together.`,
});

export const listeningScriptTVChoices = buildListeningScript({
  title: "Choosing What to Watch",
  setting: "Minh's living room, Friday evening",
  speakers: [
    { name: "Minh", role: "boy, 11" },
    { name: "Linh", role: "girl, 11, friend" },
  ],
  lines: [
    { speaker: "Minh", text: "There are too many programmes on television tonight!" },
    { speaker: "Linh", text: "I know! I enjoy watching cartoons, but you think they are boring." },
    { speaker: "Minh", text: "Cartoons are OK, but I want to see a documentary about animals." },
    { speaker: "Linh", text: "Documentaries can be interesting, but the news is too long on this channel." },
    { speaker: "Minh", text: "Let's watch a comedy instead. The actor looks funny enough on the screen." },
    { speaker: "Linh", text: "Yes! Comedies are my favourite. The last video we watched was exciting." },
    { speaker: "Minh", text: "OK, but if it is too boring, we can change the channel." },
    { speaker: "Linh", text: "Deal! I think the audience online loved this programme too." },
  ],
  audioNotes:
    "Friendly TV-choice dialogue between Minh and Linh, opinion-focused. Approx. 55 seconds.",
});

export const listeningScriptCinemaNight = buildListeningScript({
  title: "Planning a Cinema Trip",
  setting: "School gate, Saturday morning",
  speakers: [
    { name: "Linh", role: "girl, 11" },
    { name: "Minh", role: "boy, 11" },
    { name: "Dad", role: "father" },
  ],
  lines: [
    { speaker: "Linh", text: "Minh, do you want to see the new film at the cinema?" },
    { speaker: "Minh", text: "Yes! I enjoy watching films on a big screen — television is too small." },
    { speaker: "Linh", text: "The documentary looks interesting, but I prefer an exciting comedy." },
    { speaker: "Dad", text: "The comedy starts at two. Is that early enough for you?" },
    { speaker: "Minh", text: "Perfect. The actor in that film is my favourite." },
    { speaker: "Linh", text: "I heard the best scene is on a ship. The audience clapped loudly!" },
    { speaker: "Dad", text: "We can listen to the radio in the car. The news said the film is popular." },
    { speaker: "Minh", text: "Great! Watching at the cinema is much better when the programme is exciting enough." },
  ],
  audioNotes:
    "Family cinema planning with opinions and attitudes. Warm tone. Approx. 50 seconds.",
});

const FLYERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses enjoy + -ing, want to + verb, too/enough correctly where appropriate.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses media words from the unit (programme, channel, film, comedy, etc.).",
  },
  organization: {
    weight: 0.2,
    criteria: "Opinions and reasons follow a logical order.",
  },
  taskAchievement: {
    weight: 0.2,
    criteria: "Meets minimum length and addresses the writing task.",
  },
};

/** Writing Check exercises — one per writing lesson (sortOrder 2). */
export const writingChecks = [
  buildWritingCheck({
    slug: "writing-tv-check",
    topicTag: TOPIC,
    title: "Check: Write About TV Programmes",
    instructions: "Write about your favourite TV programmes. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to your English teacher about Minh and Linh choosing a programme. Say what each friend enjoys watching and why they disagree.",
    prompts: [
      "What does Minh want to watch?",
      "What does Linh think about the news?",
      "What programme do they choose in the end?",
      "Why does Minh stop the programme once?",
    ],
    minWords: 25,
    modelAnswerText:
      "Minh and Linh watch television after homework. Minh enjoys watching documentaries but Linh thinks the news is too boring. She wants to see a cartoon or comedy. They choose a comedy with a famous actor. The screen is too dark once, but the film is exciting enough. Both friends enjoy watching together.",
    successCriteria: [
      "At least 25 words",
      "Uses enjoy watching or want to see",
      "Mentions programme, channel or comedy",
      "Gives opinions with reasons",
    ],
    autoCheckKeywords: ["programme", "enjoy", "watch", "comedy", "television", "boring"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-film-check",
    topicTag: TOPIC,
    title: "Check: Write About a Film",
    instructions: "Write about a film you want to see. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note to a friend about going to the cinema. Include the type of film, the actor and your opinion using too or enough.",
    prompts: [
      "What type of film do you want to see?",
      "Is the television screen too small?",
      "Who is the actor?",
      "Why is the film interesting or exciting enough?",
    ],
    minWords: 25,
    modelAnswerText:
      "I want to see a new comedy at the cinema on Saturday. The television screen at home is too small for a big audience. My favourite actor is in the film. The best scene is on a ship and it looks exciting enough. I enjoy watching films with friends because documentaries and cartoons are both interesting on a big screen.",
    successCriteria: [
      "At least 25 words",
      "Uses want to see or enjoy watching",
      "Uses too or enough",
      "Mentions film, actor or scene",
    ],
    autoCheckKeywords: ["film", "cinema", "actor", "exciting", "screen", "enjoy"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-opinion-check",
    topicTag: TOPIC,
    title: "Check: Write Your Media Opinions",
    instructions: "Write your opinions about TV and films. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short email to a pen friend about media in Hanoi. Compare television, radio and cinema. Say what you enjoy watching and what is too boring.",
    prompts: [
      "What do you enjoy watching on television?",
      "What programme is too boring for you?",
      "Do you listen to the radio?",
      "Why is the cinema exciting enough?",
    ],
    minWords: 25,
    modelAnswerText:
      "In Hanoi I enjoy watching interesting documentaries on television after school. The news on channel three is sometimes too boring, but comedy programmes are my favourite. Grandma listens to the radio in the kitchen. I want to see exciting films at the cinema because the screen is big enough for the whole audience. Videos online can be fun too.",
    successCriteria: [
      "At least 25 words",
      "Uses too or enough for opinions",
      "Uses enjoy + -ing or want to + verb",
      "Mentions television, film or radio",
    ],
    autoCheckKeywords: ["television", "enjoy", "boring", "film", "interesting", "enough"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
];

const FLYERS_SPEAKING_CRITERIA = {
  pronunciation: "Media words (programme, documentary, audience) are clear enough to understand.",
  fluency: "Answers are connected; brief pauses are acceptable at Flyers level.",
  grammar: "Uses enjoy + -ing, want to + verb, and too/enough in short phrases.",
  vocabulary: "Uses media and entertainment vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-tv-check",
    topicTag: TOPIC,
    title: "Check: Talk About TV Programmes",
    instructions: "Answer the questions about television programmes. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about Minh and Linh choosing a programme on television.",
    sceneDescription:
      "Story outline: (1) Minh suggests news on channel three, (2) Linh says news is too boring — wants cartoon, (3) Minh enjoys documentaries, (4) they choose comedy with famous actor, (5) screen too dark once but exciting enough.",
    followUpQuestions: [
      "What does Minh suggest watching first?",
      "Why does Linh think the news is too boring?",
      "What does Minh enjoy watching?",
      "What programme do they choose in the end?",
      "Why does Minh stop the programme once?",
    ],
    suggestedAnswers: [
      "He suggests watching the news on channel three.",
      "She thinks the news is too boring and wants a cartoon.",
      "He enjoys watching documentaries.",
      "They choose a comedy with a famous actor.",
      "Because the screen is too dark.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-film-check",
    topicTag: TOPIC,
    title: "Check: Talk About Films",
    instructions: "Answer using film vocabulary. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about planning a cinema trip.",
    sceneDescription:
      "Scene labels: school gate Saturday, new film at cinema, big screen vs television, comedy with ship scene, favourite actor, audience clapped.",
    followUpQuestions: [
      "Does Minh want to see the new film?",
      "Why is television too small?",
      "What type of film does Linh prefer?",
      "What is the best scene in the film?",
      "What did the audience do?",
    ],
    suggestedAnswers: [
      "Yes, he wants to see it at the cinema.",
      "Because he enjoys films on a big screen.",
      "She prefers an exciting comedy.",
      "The best scene is on a ship.",
      "The audience clapped loudly.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-opinion-check",
    topicTag: TOPIC,
    title: "Check: Talk About Media Opinions",
    instructions: "Give your opinions about TV and films. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "Tell the examiner what you enjoy watching and what is too boring.",
    sceneDescription:
      "Timeline: after homework watch TV → too many programmes → enjoy cartoons/documentaries/comedy → news too long → cinema screen big enough → radio in kitchen.",
    followUpQuestions: [
      "What do you enjoy watching on television?",
      "What programme is too boring for you?",
      "Do you want to see films at the cinema? Why?",
      "What makes a documentary interesting enough?",
      "Who listens to the radio in Minh's family?",
    ],
    suggestedAnswers: [
      "I enjoy watching comedies and documentaries.",
      "The news is sometimes too boring.",
      "Yes, because the screen is big enough.",
      "When it is about animals or Hanoi.",
      "Grandma listens to the radio in the kitchen.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  tvChoices: {
    q1: "cartoons",
    q2: "comedy",
    q3: "channel",
  },
  cinemaNight: {
    q1: "comedy",
    q2: "two",
    q3: "ship",
  },
};
