/**
 * Starters Unit 2 — Numbers and Time
 * Shared content blocks for blueprint.
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "numbers-and-time";

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
      word: "one",
      ipa: "/wʌn/",
      partOfSpeech: "number",
      vietnameseMeaning: "một (1)",
      exampleSentence: "I have one brother.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Tôi có một anh trai.",
  },
  {
    ...buildVocabWord({
      word: "two",
      ipa: "/tuː/",
      partOfSpeech: "number",
      vietnameseMeaning: "hai (2)",
      exampleSentence: "I have two books.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Tôi có hai quyển sách.",
  },
  {
    ...buildVocabWord({
      word: "three",
      ipa: "/θriː/",
      partOfSpeech: "number",
      vietnameseMeaning: "ba (3)",
      exampleSentence: "School starts at three o'clock.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Trường bắt đầu lúc ba giờ.",
  },
  {
    ...buildVocabWord({
      word: "four",
      ipa: "/fɔː(r)/",
      partOfSpeech: "number",
      vietnameseMeaning: "bốn (4)",
      exampleSentence: "Nam is four years old.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Nam bốn tuổi.",
  },
  {
    ...buildVocabWord({
      word: "five",
      ipa: "/faɪv/",
      partOfSpeech: "number",
      vietnameseMeaning: "năm (5)",
      exampleSentence: "I have five pencils.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Tôi có năm cây bút chì.",
  },
  {
    ...buildVocabWord({
      word: "ten",
      ipa: "/ten/",
      partOfSpeech: "number",
      vietnameseMeaning: "mười (10)",
      exampleSentence: "Ten friends come to my party.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mười bạn đến bữa tiệc của tôi.",
  },
  {
    ...buildVocabWord({
      word: "twenty",
      ipa: "/ˈtwenti/",
      partOfSpeech: "number",
      vietnameseMeaning: "hai mươi (20)",
      exampleSentence: "There are twenty desks in our class.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Có hai mươi bàn trong lớp chúng tôi.",
  },
  {
    ...buildVocabWord({
      word: "Monday",
      ipa: "/ˈmʌndeɪ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thứ Hai",
      exampleSentence: "Today is Monday.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Hôm nay là thứ Hai.",
  },
  {
    ...buildVocabWord({
      word: "Tuesday",
      ipa: "/ˈtjuːzdeɪ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thứ Ba",
      exampleSentence: "My birthday is on Tuesday.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Sinh nhật tôi vào thứ Ba.",
  },
  {
    ...buildVocabWord({
      word: "today",
      ipa: "/təˈdeɪ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hôm nay",
      exampleSentence: "Today is my birthday!",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Hôm nay là sinh nhật tôi!",
  },
  {
    ...buildVocabWord({
      word: "birthday",
      ipa: "/ˈbɜːθdeɪ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "sinh nhật",
      exampleSentence: "Happy birthday, Mai!",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúc mừng sinh nhật, Mai!",
  },
  {
    ...buildVocabWord({
      word: "o'clock",
      ipa: "/əˈklɒk/",
      partOfSpeech: "noun",
      vietnameseMeaning: "giờ (chỉ thời gian)",
      exampleSentence: "The party is at three o'clock.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Bữa tiệc diễn ra lúc ba giờ.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Numbers 1–20",
    explanation:
      "Dùng số đếm one, two, three … twenty trước danh từ đếm được hoặc sau how old / how many.",
    examples: ["I am eight.", "I have three books.", "There are ten friends."],
    commonMistakes: [
      "I have three book (×) → I have three books (✓)",
      "She is seven year old (×) → She is seven years old (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Question words: how many, how old",
    explanation:
      "How many hỏi số lượng (how many books?). How old hỏi tuổi (how old are you?).",
    examples: [
      "How many pencils do you have?",
      "How old is your brother?",
      "I am eight. / I have five pencils.",
    ],
    commonMistakes: [
      "How old books? (×) → How many books? (✓)",
      "How many are you? (×) → How old are you? (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Days and months (recognition)",
    explanation:
      "Nhận biết Monday, Tuesday … và today, birthday. Dùng on + ngày: on Tuesday.",
    examples: ["Today is Monday.", "My birthday is on Tuesday.", "See you on Monday."],
    commonMistakes: [
      "Today is Monday day (×) → Today is Monday (✓)",
      "My birthday is Tuesday (×) → My birthday is on Tuesday (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Recognise and use twelve Starters number and time words from one to twenty.",
    "Ask and answer how many and how old questions at Pre-A1 level.",
    "Read Mai's week text and identify numbers, days and birthday details.",
    "Listen for ages, quantities and times in school and party dialogues.",
    "Write short answers about age, days and o'clock times.",
    "Speak short phrases about numbers, days and Mai's birthday week.",
  ],
};

export const passageMaiWeek = buildPassage({
  title: "Mai's Birthday Week",
  text: `Hello! My name is Mai. I am eight years old. Today is Monday.

Tomorrow is Tuesday. Tuesday is my birthday! I am happy. My brother Nam is six. My friend Anna is seven.

At school on Monday, we read three books. Our class has twenty desks.

My birthday party is on Tuesday at three o'clock. Ten friends will come. Today is special because I am eight tomorrow!

We are happy!`,
});

export const listeningScriptMaiAtSchool = buildListeningScript({
  title: "Mai at School",
  setting: "A classroom on Monday morning",
  speakers: [
    { name: "Teacher", role: "adult" },
    { name: "Mai", role: "girl, 8" },
  ],
  lines: [
    { speaker: "Teacher", text: "Good morning, Mai. How old are you?" },
    { speaker: "Mai", text: "I am eight." },
    { speaker: "Teacher", text: "How many pencils do you have?" },
    { speaker: "Mai", text: "I have five pencils." },
    { speaker: "Teacher", text: "Today is Monday. What day is tomorrow?" },
    { speaker: "Mai", text: "Tomorrow is Tuesday. It is my birthday!" },
    { speaker: "Teacher", text: "How old is your brother Nam?" },
    { speaker: "Mai", text: "He is six." },
  ],
  audioNotes:
    "Clear, slow delivery with short pauses. Total duration approx. 40 seconds.",
});

export const listeningScriptBirthdayParty = buildListeningScript({
  title: "Birthday Party",
  setting: "Mai's home on Tuesday afternoon",
  speakers: [
    { name: "Anna", role: "girl, 7, friend" },
    { name: "Mai", role: "girl, 8" },
    { name: "Nam", role: "boy, 6, brother" },
  ],
  lines: [
    { speaker: "Anna", text: "Happy birthday, Mai!" },
    { speaker: "Mai", text: "Thank you, Anna!" },
    { speaker: "Anna", text: "How old are you today?" },
    { speaker: "Mai", text: "I am eight today!" },
    { speaker: "Nam", text: "The party starts at three o'clock." },
    { speaker: "Anna", text: "How many friends are here?" },
    { speaker: "Mai", text: "I have ten friends at my party." },
    { speaker: "Anna", text: "Today is Tuesday. It is a great day!" },
  ],
  audioNotes: "Clear, slow delivery. Approx. 35 seconds.",
});

const STARTERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Dùng how old/how many và số đếm đúng trong câu ngắn.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Dùng từ số, ngày và thời gian trong unit.",
  },
  organization: {
    weight: 0.2,
    criteria: "Trả lời đúng thứ tự câu hỏi; câu rõ ràng.",
  },
  taskAchievement: {
    weight: 0.2,
    criteria: "Hoàn thành đủ phần; độ dài phù hợp Starters (tối thiểu 5 từ).",
  },
};

export const writingChecks = [
  buildWritingCheck({
    slug: "writing-age-and-day-check",
    topicTag: TOPIC,
    title: "Check: Write About Age and Days",
    instructions: "Write short answers. Use 1–5 words for each answer.",
    sortOrder: 2,
    taskDescription:
      "Write about your age and the days of the week using numbers and time words from the unit.",
    prompts: [
      "1. How old are you? (Write: I am _____.)",
      "2. What day is today? (Write: Today is _____.)",
      "3. Write one sentence with a number: I have _____ books.",
    ],
    minWords: 5,
    modelAnswerText: "I am eight. Today is Monday. I have three books.",
    successCriteria: [
      "All three prompts are answered",
      "Uses at least two unit vocabulary words",
      "Uses a number correctly",
      "Spelling of core words is recognisable",
    ],
    autoCheckKeywords: [
      "I",
      "am",
      "Today",
      "Monday",
      "Tuesday",
      "one",
      "two",
      "three",
      "four",
      "five",
      "ten",
      "eight",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-birthday-check",
    topicTag: TOPIC,
    title: "Check: Write About a Birthday",
    instructions: "Write short answers about a birthday.",
    sortOrder: 2,
    taskDescription:
      "Write about Mai's birthday week. Use numbers, days and time words.",
    prompts: [
      "1. When is Mai's birthday? (Write: on _____)",
      "2. What time is the party? (Write: at _____ o'clock)",
      "3. How many friends come? (Write: ten / five / three)",
    ],
    minWords: 5,
    modelAnswerText: "on Tuesday at three o'clock ten friends",
    successCriteria: [
      "All three prompts answered",
      "Uses a day word and a number",
      "Uses o'clock or a time phrase",
    ],
    autoCheckKeywords: [
      "Tuesday",
      "Monday",
      "birthday",
      "o'clock",
      "three",
      "ten",
      "five",
      "friends",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-numbers-check",
    topicTag: TOPIC,
    title: "Check: Write With Numbers",
    instructions: "Write short answers using numbers.",
    sortOrder: 2,
    taskDescription: "Write short answers about ages and quantities.",
    prompts: [
      "1. How old is Nam? (Write: He is _____.)",
      "2. How many books does Mai read? (Write: three / five / ten)",
      "3. Write: School starts at _____ o'clock.",
    ],
    minWords: 5,
    modelAnswerText: "He is six. three eight o'clock",
    successCriteria: [
      "All prompts answered",
      "Uses numbers from the unit",
      "Answers match how old / how many patterns",
    ],
    autoCheckKeywords: [
      "six",
      "eight",
      "three",
      "five",
      "ten",
      "twenty",
      "o'clock",
      "He",
      "is",
    ],
    rubric: STARTERS_WRITING_RUBRIC,
  }),
];

const STARTERS_SPEAKING_CRITERIA = {
  pronunciation:
    "Số (one–twenty), ngày (Monday, Tuesday) và o'clock nghe được rõ.",
  fluency: "Trả lời bằng từ hoặc cụm ngắn; không im lặng quá lâu.",
  grammar: "Dùng how old/how many hoặc I am / I have trong ít nhất hai câu trả lời.",
  vocabulary: "Dùng ít nhất ba từ vựng unit đúng nghĩa.",
};

const BIRTHDAY_WEEK_SCENE =
  "Scene: Mai's classroom on Monday. Mai is eight. Her brother Nam is six. Her friend Anna is seven. Tomorrow is Tuesday — Mai's birthday. The party will be at three o'clock. Ten friends will come.";

export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-age-interview-check",
    topicTag: TOPIC,
    title: "Check: Age Interview",
    instructions:
      "Answer the examiner's questions. Say at least one word for each question.",
    sortOrder: 2,
    prompt:
      "The examiner will ask you about ages and numbers. Answer in short phrases.",
    sceneDescription: BIRTHDAY_WEEK_SCENE,
    followUpQuestions: [
      "How old are you?",
      "How old is your brother or sister?",
      "How many books do you have?",
      "What day is today?",
      "When is your birthday?",
    ],
    suggestedAnswers: [
      "I am eight.",
      "He is six.",
      "I have three books.",
      "Today is Monday.",
      "My birthday is on Tuesday.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-birthday-party-check",
    topicTag: TOPIC,
    title: "Check: Birthday Party Speaking",
    instructions: "Answer about Mai's birthday party.",
    sortOrder: 2,
    prompt:
      "Read the scene about Mai's birthday week. The examiner asks about the party.",
    sceneDescription: BIRTHDAY_WEEK_SCENE,
    followUpQuestions: [
      "How old is Mai?",
      "What day is Mai's birthday?",
      "What time is the party?",
      "How many friends come to the party?",
      "How old is Nam?",
    ],
    suggestedAnswers: [
      "She is eight.",
      "Tuesday.",
      "At three o'clock.",
      "Ten friends.",
      "He is six.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
  buildSpeakingCheck({
    slug: "speaking-numbers-situational-check",
    topicTag: TOPIC,
    title: "Check: Numbers and Time Speaking",
    instructions: "Answer the examiner's questions in short phrases.",
    sortOrder: 2,
    prompt:
      "The examiner asks everyday questions about numbers, days and time.",
    sceneDescription: BIRTHDAY_WEEK_SCENE,
    followUpQuestions: [
      "How many pencils do you have?",
      "How old is Anna?",
      "What day is tomorrow?",
      "What time does school start?",
      "Say one sentence about today.",
    ],
    suggestedAnswers: [
      "I have five pencils.",
      "She is seven.",
      "Tomorrow is Tuesday.",
      "At eight o'clock.",
      "Today is Monday.",
    ],
    assessmentCriteria: STARTERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 60,
  }),
];

export const listeningAnswerKeys = {
  atSchool: {
    q1: "eight",
    q2: "five",
    q3: "Monday",
    q4: "Tuesday",
    q5: "six",
  },
  birthdayParty: {
    q1: "eight",
    q2: "three o'clock",
    q3: "ten",
    q4: "Tuesday",
    q5: "Anna",
  },
};
