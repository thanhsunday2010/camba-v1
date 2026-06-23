/**
 * PET Unit 1 — Education and Future Plans
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-01.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "education-and-future-plans";

const {
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildWritingCheck,
  buildSpeakingCheck,
} = createCambridgeUnitBuilder("pet");

export const vocabularyBank = [
  buildVocabWord({
    word: "university",
    ipa: "/ˌjuːnɪˈvɜːsəti/",
    partOfSpeech: "noun",
    vietnameseMeaning: "đại học",
    exampleSentence: "Minh hopes to study at a university abroad.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "degree",
    ipa: "/dɪˈɡriː/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bằng cấp / chương trình đại học",
    exampleSentence: "He wants a mechanical engineering degree.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "scholarship",
    ipa: "/ˈskɒləʃɪp/",
    partOfSpeech: "noun",
    vietnameseMeaning: "học bổng",
    exampleSentence: "A full scholarship would cover tuition fees.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "career",
    ipa: "/kəˈrɪə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "sự nghiệp / nghề nghiệp",
    exampleSentence: "Research different careers before you choose.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "ambition",
    ipa: "/æmˈbɪʃn/",
    partOfSpeech: "noun",
    vietnameseMeaning: "tham vọng / mục tiêu lớn",
    exampleSentence: "His main ambition is to become an engineer.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "qualification",
    ipa: "/ˌkwɒlɪfɪˈkeɪʃn/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bằng cấp / chứng chỉ",
    exampleSentence: "He has gained qualifications in computer programming.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "tuition",
    ipa: "/tjuˈɪʃn/",
    partOfSpeech: "noun",
    vietnameseMeaning: "học phí",
    exampleSentence: "Tuition fees at foreign universities are high.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "enrol",
    ipa: "/ɪnˈrəʊl/",
    partOfSpeech: "verb",
    vietnameseMeaning: "đăng ký nhập học",
    exampleSentence: "If he got a scholarship, he would enrol immediately.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "application",
    ipa: "/ˌæplɪˈkeɪʃn/",
    partOfSpeech: "noun",
    vietnameseMeaning: "đơn xin / hồ sơ đăng ký",
    exampleSentence: "Minh is preparing his scholarship application online.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "internship",
    ipa: "/ˈɪntɜːnʃɪp/",
    partOfSpeech: "noun",
    vietnameseMeaning: "thực tập",
    exampleSentence: "An internship would help him understand an engineering career.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "graduate",
    ipa: "/ˈɡrædʒuət/",
    partOfSpeech: "verb",
    vietnameseMeaning: "tốt nghiệp",
    exampleSentence: "He will graduate from high school next year.",
    difficulty: 1,
    topic: TOPIC,
  }),
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Second conditional",
    explanation:
      "Use if + past simple, would + base verb to talk about imaginary or unlikely present/future situations. If I received a scholarship, I would enrol abroad.",
    examples: [
      "If I got a full scholarship, I would study engineering abroad.",
      "If tuition were lower, more students would apply.",
      "If Minh didn't prepare well, he wouldn't win competitions.",
      "What would you do if you couldn't afford university?",
    ],
    commonMistakes: [
      "If I will get a scholarship (×) → If I got a scholarship (✓)",
      "I would enrol if I will receive support (×) → I would enrol if I received support (✓)",
      "If I would have money (×) → If I had money (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Present perfect vs past simple",
    explanation:
      "Use present perfect (have/has + past participle) for unfinished time or results connected to now. Use past simple for finished actions at a specific past time.",
    examples: [
      "I have wanted to be an engineer since primary school. (still true)",
      "Last year I visited a university open day. (finished time)",
      "He has entered three competitions this year.",
      "Minh applied for a scholarship in March.",
    ],
    commonMistakes: [
      "I have visited the open day last year (×) → I visited the open day last year (✓)",
      "I want to be an engineer since primary school (×) → I have wanted to be an engineer since primary school (✓)",
      "He has applied in March (×) → He applied in March (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Use education and future-plan vocabulary at B1 level.",
    "Use second conditional to discuss hypothetical university and career choices.",
    "Choose present perfect or past simple correctly when talking about experiences and ambitions.",
    "Read Minh's blog for detail and writer opinion in a longer text.",
    "Identify speaker attitude and purpose in career and scholarship talks.",
    "Write a short email about future study plans (at least 40 words).",
    "Answer extended interview questions about ambitions and qualifications.",
  ],
};

export const passageMinhFuturePlans = buildPassage({
  title: "Minh's Blog — Thinking About My Future",
  text: `Minh is fifteen and in Year 10 at Hanoi International School. In his blog last week, he wrote honestly about education and future plans.

"I have wanted to be an engineer since I was in primary school," he explained. "Last year I visited a university open day, and that experience changed my opinion completely. Before the visit, I thought all engineering careers were boring office jobs. Now I believe engineering can solve real problems — if you choose the right specialisation."

Minh's main ambition is to study at a good university abroad, but he knows tuition fees are high. "If I received a full scholarship, I would enrol in a mechanical engineering degree immediately," he wrote. "However, if I didn't get enough financial support, I would probably study in Vietnam first and apply again later."

His career counsellor, Ms Phuong, thinks Minh is realistic. "He has prepared well," she told our school magazine. "He entered three science competitions this year and has already gained useful qualifications in computer programming."

Minh disagrees slightly with one point. "Some people say scholarships are only for perfect students," he argued. "I don't think that's fair. Hard work and clear ambitions matter too."

The school will hold a scholarship information session next Thursday. Minh hopes more Year 10 students will attend.`,
  imagePrompt:
    "A fifteen-year-old Vietnamese student at a laptop writing a blog; thought bubbles show university campus, engineering tools and a scholarship certificate; Hanoi school setting.",
});

export const listeningScriptCareerTalk = buildListeningScript({
  title: "School Career Talk — Engineering Pathways",
  setting: "School hall, career day afternoon",
  speakers: [
    { name: "Mr Davies", role: "careers adviser" },
    { name: "Students", role: "audience" },
  ],
  lines: [
    {
      speaker: "Mr Davies",
      text: "Good afternoon, everyone. Thanks for coming to today's career talk. My purpose today is to help you think realistically about engineering careers — not just the exciting parts you see online.",
    },
    {
      speaker: "Mr Davies",
      text: "Many students tell me they want a high salary immediately. I understand that ambition, but I want to be honest: most engineering careers need a university degree and several years of experience.",
    },
    {
      speaker: "Mr Davies",
      text: "If you chose engineering only because it sounds impressive, you might struggle later. However, if you genuinely enjoyed science competitions and problem-solving, engineering could be an excellent choice.",
    },
    {
      speaker: "Mr Davies",
      text: "I visited three companies last month, and every manager said the same thing: curiosity matters more than perfect exam results. Research careers carefully before you decide.",
    },
    {
      speaker: "Students",
      text: "Thank you, sir.",
    },
    {
      speaker: "Mr Davies",
      text: "You're welcome. Come to the careers office if you want individual advice about qualifications and university options.",
    },
  ],
  audioNotes: "Encouraging but realistic tone; clear B1 pace. Approx. 55 seconds.",
});

export const listeningScriptScholarshipInfo = buildListeningScript({
  title: "Scholarship Information Session",
  setting: "School announcement, Thursday morning",
  speakers: [{ name: "Ms Lan", role: "scholarship coordinator" }],
  lines: [
    {
      speaker: "Ms Lan",
      text: "Attention Year 10 students. This is Ms Lan from the scholarship office. I'm pleased to announce our annual international scholarship programme is now open.",
    },
    {
      speaker: "Ms Lan",
      text: "The purpose of this session is to explain the application process clearly. A scholarship can cover part or all of your tuition fees at partner universities abroad.",
    },
    {
      speaker: "Ms Lan",
      text: "You don't need perfect grades in every subject. We look at your ambitions, competition results and teacher recommendations. However, applications must be complete — incomplete forms will not be considered.",
    },
    {
      speaker: "Ms Lan",
      text: "The deadline is Friday fifteenth May at four p.m. Submit your form online and ask your form teacher to upload a reference letter. If you need help, visit the scholarship office after school.",
    },
    {
      speaker: "Ms Lan",
      text: "I strongly encourage students who have prepared qualifications or portfolio work to apply. Good luck, and I hope to see many applications this year.",
    },
  ],
  audioNotes: "Formal but friendly school announcement. Approx. 50 seconds.",
});

const PET_WRITING_RUBRIC = {
  grammar: {
    weight: 0.25,
    criteria:
      "Uses second conditional, present perfect or past simple appropriately in connected sentences.",
  },
  vocabulary: {
    weight: 0.25,
    criteria:
      "Uses future-plan vocabulary (university, career, scholarship, ambition, qualification) appropriately.",
  },
  organization: {
    weight: 0.25,
    criteria: "Email or note has greeting, logical paragraphs and appropriate closing.",
  },
  taskAchievement: {
    weight: 0.25,
    criteria: "Meets minimum length (40 words) and addresses all parts of the task.",
  },
};

export const writingChecks = [
  buildWritingCheck({
    slug: "writing-scholarship-check",
    topicTag: TOPIC,
    title: "Check: Email About a Scholarship",
    instructions: "Write an email to your teacher. Write at least 40 words.",
    sortOrder: 2,
    taskDescription:
      "Write an email to your form teacher, Ms Phuong. You want to apply for the international scholarship and you need advice about the application.",
    prompts: [
      "Say why you are writing.",
      "Describe your ambition and one qualification you have.",
      "Ask a polite question about the deadline or reference letter.",
      "End the email politely.",
    ],
    minWords: 40,
    modelAnswerText:
      "Dear Ms Phuong,\n\nI am writing because I want to apply for the international scholarship programme. My ambition is to study mechanical engineering at university abroad. I have entered two science competitions this year and gained a programming qualification.\n\nCould you tell me when you will upload my reference letter? The deadline is 15 May, so I want to prepare early.\n\nThank you,\nMinh",
    successCriteria: [
      "At least 40 words",
      "Clear reason for writing about the scholarship",
      "Mentions ambition or qualification",
      "Polite question and appropriate email closing",
    ],
    autoCheckKeywords: [
      "dear",
      "scholarship",
      "ambition",
      "qualification",
      "deadline",
      "thank",
      "ms",
      "phuong",
    ],
    rubric: PET_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-career-check",
    topicTag: TOPIC,
    title: "Check: Write About Career Plans",
    instructions: "Write about your career plans. Use at least 40 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note to a friend explaining your career ambition and what you would do if you got a scholarship.",
    prompts: [
      "Say what career you are interested in.",
      "Use second conditional: what you would do if you got a scholarship.",
      "Mention one thing you have done to prepare.",
      "Say what you would do if you didn't get enough financial support.",
    ],
    minWords: 40,
    modelAnswerText:
      "Hi Nam,\n\nMy main ambition is to become an engineer. If I received a full scholarship, I would enrol in a mechanical engineering degree abroad immediately. I have wanted this since primary school.\n\nLast year I visited a university open day, which helped a lot. If I didn't get enough support, I would study in Vietnam first and apply again later.\n\nMinh",
    successCriteria: [
      "At least 40 words",
      "Uses second conditional at least once",
      "Mentions career or university plans",
      "Includes present perfect or past simple correctly",
    ],
    autoCheckKeywords: [
      "would",
      "if",
      "scholarship",
      "career",
      "engineer",
      "university",
      "ambition",
    ],
    rubric: PET_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-future-check",
    topicTag: TOPIC,
    title: "Check: My Future Study Plan",
    instructions: "Write about your future study plans. Use at least 40 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to a pen friend describing your education plans, tuition concerns and what you have done to prepare for university.",
    prompts: [
      "Say what you want to study and where.",
      "Explain one opinion you have about scholarships or careers.",
      "Use present perfect for something you have done.",
      "Use past simple for one finished experience.",
    ],
    minWords: 40,
    modelAnswerText:
      "Hi Sam,\n\nI want to study engineering at a good university, but tuition fees abroad worry me. I have entered three science competitions this year. Last month I spoke to our careers adviser, and he said research matters more than perfect grades.\n\nI don't think scholarships are only for perfect students. Hard work and clear ambitions matter too.\n\nBye,\nMinh",
    successCriteria: [
      "At least 40 words",
      "Mentions university, career or tuition",
      "Uses present perfect and past simple",
      "Expresses a clear opinion",
    ],
    autoCheckKeywords: [
      "university",
      "tuition",
      "have",
      "last",
      "scholarship",
      "career",
      "competition",
    ],
    rubric: PET_WRITING_RUBRIC,
  }),
];

const PET_SPEAKING_CRITERIA = {
  pronunciation:
    "Future-plan vocabulary (scholarship, qualification, ambition, tuition) is clear enough to understand.",
  fluency: "Answers are connected with brief linking; pauses are acceptable at PET B1.",
  grammar:
    "Uses second conditional and present perfect vs past simple in short extended turns.",
  vocabulary: "Uses education and future-plan vocabulary from the unit with some range.",
};

export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-ambition-check",
    topicTag: TOPIC,
    title: "Check: Talk About Your Ambitions",
    instructions: "Answer the questions about ambitions and careers. Speak for up to 150 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about your career ambitions and university plans.",
    pictureDescription:
      "A fifteen-year-old student at a careers fair with university brochures, engineering display and scholarship poster — Minh in school uniform.",
    followUpQuestions: [
      "What is your main career ambition?",
      "How long have you wanted this career?",
      "What did you do last year to learn about university?",
      "If you got a full scholarship, what would you study?",
      "What is your opinion about tuition fees abroad?",
    ],
    suggestedAnswers: [
      "My main ambition is to become a mechanical engineer.",
      "I have wanted to be an engineer since primary school.",
      "Last year I visited a university open day.",
      "If I got a full scholarship, I would enrol in an engineering degree abroad.",
      "I think tuition fees are too high for many families, so scholarships are important.",
    ],
    assessmentCriteria: PET_SPEAKING_CRITERIA,
    maxDurationSeconds: 150,
  }),
  buildSpeakingCheck({
    slug: "speaking-scholarship-check",
    topicTag: TOPIC,
    title: "Check: Talk About Scholarships",
    instructions: "Answer using scholarship vocabulary. Speak for up to 150 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about scholarships and applications.",
    pictureDescription:
      "Scholarship information session at school; students with application forms; deadline poster shows 15 May.",
    followUpQuestions: [
      "Have you ever applied for a scholarship?",
      "What qualifications do you have that could help your application?",
      "When is the application deadline?",
      "What would you do if you didn't get a scholarship?",
      "Do you agree that scholarships are only for perfect students?",
    ],
    suggestedAnswers: [
      "No, I haven't applied yet, but I am preparing my form now.",
      "I have gained qualifications in computer programming and entered science competitions.",
      "The deadline is Friday 15 May at four p.m.",
      "If I didn't get a scholarship, I would study in Vietnam first.",
      "No, I don't agree. Hard work and clear ambitions matter too.",
    ],
    assessmentCriteria: PET_SPEAKING_CRITERIA,
    maxDurationSeconds: 150,
  }),
  buildSpeakingCheck({
    slug: "speaking-career-check",
    topicTag: TOPIC,
    title: "Check: Discuss Career Advice",
    instructions: "Discuss career advice and attitudes. Speak for up to 150 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about career talks and realistic planning.",
    pictureDescription:
      "Careers adviser speaking in school hall; students listening; slide shows engineering pathways and university degree requirements.",
    followUpQuestions: [
      "What was the main purpose of the last career talk you attended?",
      "What attitude did the speaker have — encouraging or discouraging?",
      "If you chose a career only for money, what might happen?",
      "What have you done this year to research careers?",
      "Would you prefer to enrol abroad or study in your country first?",
    ],
    suggestedAnswers: [
      "The purpose was to help us think realistically about engineering careers.",
      "The speaker was encouraging but honest — not discouraging.",
      "If I chose a career only for money, I might struggle because I wouldn't enjoy the work.",
      "I have entered three science competitions and spoken to the careers adviser.",
      "If I got a scholarship, I would enrol abroad. Otherwise, I would study here first.",
    ],
    assessmentCriteria: PET_SPEAKING_CRITERIA,
    maxDurationSeconds: 150,
  }),
];

export const listeningAnswerKeys = {
  careerTalk: {
    q1: "realistic engineering careers",
    q2: "curiosity over perfect grades",
    q3: "research careers carefully",
  },
  scholarshipInfo: {
    q1: "application process",
    q2: "deadline 15 May 4pm",
    q3: "ambitions and qualifications",
  },
};
