/**
 * KET Unit 2 — Work and Jobs
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-02.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "work-and-jobs";

const {
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildWritingCheck,
  buildSpeakingCheck,
} = createCambridgeUnitBuilder("ket");

export const vocabularyBank = [
  {
    ...buildVocabWord({
      word: "colleague",
      ipa: "/ˈkɒliːɡ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đồng nghiệp",
      exampleSentence: "My colleague helped me on my first day at the bookshop.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Đồng nghiệp của tôi đã giúp tôi trong ngày đầu tiên ở hiệu sách.",
  },
  {
    ...buildVocabWord({
      word: "salary",
      ipa: "/ˈsæləri/",
      partOfSpeech: "noun",
      vietnameseMeaning: "lương",
      exampleSentence: "The salary for this part-time job is good.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mức lương cho công việc bán thời gian này khá tốt.",
  },
  {
    ...buildVocabWord({
      word: "interview",
      ipa: "/ˈɪntəvjuː/",
      partOfSpeech: "noun",
      vietnameseMeaning: "buổi phỏng vấn",
      exampleSentence: "Linh has a job interview on Tuesday.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh có buổi phỏng vấn xin việc vào thứ Ba.",
  },
  {
    ...buildVocabWord({
      word: "career",
      ipa: "/kəˈrɪə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "sự nghiệp",
      exampleSentence: "She wants a career in medicine.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Cô ấy muốn theo đuổi sự nghiệp y khoa.",
  },
  {
    ...buildVocabWord({
      word: "experience",
      ipa: "/ɪkˈspɪəriəns/",
      partOfSpeech: "noun",
      vietnameseMeaning: "kinh nghiệm",
      exampleSentence: "Do you have any shop experience?",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Bạn có kinh nghiệm làm việc ở cửa hàng không?",
  },
  {
    ...buildVocabWord({
      word: "employer",
      ipa: "/ɪmˈplɔɪə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "người sử dụng lao động / chủ lao động",
      exampleSentence: "My employer pays me every month.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Người sử dụng lao động trả lương cho tôi hàng tháng.",
  },
  {
    ...buildVocabWord({
      word: "shift",
      ipa: "/ʃɪft/",
      partOfSpeech: "noun",
      vietnameseMeaning: "ca làm việc",
      exampleSentence: "I work the morning shift on Saturdays.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Tôi làm ca sáng vào các thứ Bảy.",
  },
  {
    ...buildVocabWord({
      word: "retire",
      ipa: "/rɪˈtaɪə(r)/",
      partOfSpeech: "verb",
      vietnameseMeaning: "nghỉ hưu",
      exampleSentence: "My grandfather retired at sixty-five.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Ông tôi nghỉ hưu khi sáu mươi lăm tuổi.",
  },
  {
    ...buildVocabWord({
      word: "job",
      ipa: "/dʒɒb/",
      partOfSpeech: "noun",
      vietnameseMeaning: "công việc",
      exampleSentence: "Linh wants a part-time job after school.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh muốn có một công việc bán thời gian sau giờ học.",
  },
  {
    ...buildVocabWord({
      word: "apply",
      ipa: "/əˈplaɪ/",
      partOfSpeech: "verb",
      vietnameseMeaning: "nộp đơn / ứng tuyển",
      exampleSentence: "You should apply before the deadline.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Bạn nên nộp đơn trước hạn chót.",
  },
  {
    ...buildVocabWord({
      word: "part-time",
      ipa: "/ˌpɑːt ˈtaɪm/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "bán thời gian",
      exampleSentence: "I want a part-time job at the bookshop.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Tôi muốn một công việc bán thời gian ở hiệu sách.",
  },
  {
    ...buildVocabWord({
      word: "manager",
      ipa: "/ˈmænɪdʒə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "quản lý",
      exampleSentence: "The manager interviewed three people today.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Quản lý đã phỏng vấn ba người hôm nay.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Present simple vs present continuous",
    explanation:
      "Use present simple for habits, facts and permanent jobs (I work in a shop). Use present continuous for actions happening now or temporary situations (I am working extra shifts this month).",
    examples: [
      "I work in a bookshop every Saturday.",
      "She is preparing for an interview this week.",
      "My colleague usually starts his shift at nine.",
      "They are hiring new staff at the moment.",
    ],
    commonMistakes: [
      "I am work in a café (×) → I work in a café (✓)",
      "She works now on her CV (×) → She is working on her CV now (✓)",
      "He is usually work on Fridays (×) → He usually works on Fridays (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Wh- questions — present simple",
    explanation:
      "Use Wh- word + do/does + subject + base verb for routines and facts. Where do you work? When does your shift start? How much salary do you get?",
    examples: [
      "Where do you work?",
      "When does your shift start?",
      "What job do you want?",
      "How much salary does your employer pay?",
    ],
    commonMistakes: [
      "Where you work? (×) → Where do you work? (✓)",
      "When start your shift? (×) → When does your shift start? (✓)",
      "What job you want? (×) → What job do you want? (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Wh- questions — present continuous",
    explanation:
      "Use Wh- word + am/is/are + subject + -ing for actions happening now. What is your colleague doing? Why are you working extra shifts?",
    examples: [
      "What is your colleague doing now?",
      "Why are you working extra shifts this week?",
      "Who is the manager interviewing today?",
      "Where are they hiring new staff?",
    ],
    commonMistakes: [
      "What she is doing? (×) → What is she doing? (✓)",
      "Why you are working late? (×) → Why are you working late? (✓)",
      "Who the manager is interviewing? (×) → Who is the manager interviewing? (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Use core work and jobs vocabulary at A2 level.",
    "Use present simple and present continuous to talk about jobs and current work situations.",
    "Ask and answer Wh- questions about work routines and temporary tasks.",
    "Scan a job advertisement for specific information such as salary and shift times.",
    "Extract factual details from short job interview recordings.",
    "Write a short email applying for a part-time job.",
    "Answer interview questions about work experience and career plans.",
  ],
};

export const passageJobAdvert = buildPassage({
  title: "Part-Time Shop Assistant — Job Advertisement",
  text: `GREENWAY BOOKSHOP — NOW HIRING

We are looking for a friendly part-time shop assistant to join our team on weekends. The employer offers a good salary and training for the right person.

You will work with colleagues in a busy city centre shop. Duties include helping customers, organising books and working a Saturday shift from 9 a.m. to 5 p.m.

REQUIREMENTS
• At least one year of customer service experience
• Good communication skills for interviews with our manager
• Able to work on Saturday and Sunday

BENEFITS
• Hourly salary above the minimum wage
• Free books after three months
• Career advice for students who want to work in publishing

HOW TO APPLY
Send a short email with your name and work experience to jobs@greenwaybooks.co.uk before 30 April. We will contact successful candidates for an interview.

Our shop manager, Ms Pham, started here as a student. She says: "This job helped me build skills for my career."`,
});

export const listeningScriptJobInterview = buildListeningScript({
  title: "Job Interview at a Café",
  setting: "Small café office, quiet background",
  speakers: [
    { name: "Ms Lee", role: "café manager" },
    { name: "Tom", role: "job applicant" },
  ],
  lines: [
    { speaker: "Ms Lee", text: "Good morning, Tom. Thanks for coming to the interview today." },
    { speaker: "Tom", text: "Good morning. I applied for the part-time waiter job last week." },
    {
      speaker: "Ms Lee",
      text: "Tell me about your experience. Have you worked with customers before?",
    },
    {
      speaker: "Tom",
      text: "Yes. I worked in a bookshop for six months. My colleagues were very helpful.",
    },
    {
      speaker: "Ms Lee",
      text: "Great. The salary is eight pounds an hour. Can you work the evening shift on Fridays?",
    },
    { speaker: "Tom", text: "Yes, I can. I am studying now, but I am free on Friday evenings." },
    {
      speaker: "Ms Lee",
      text: "Perfect. The employer will email you next Monday about the start date.",
    },
  ],
  audioNotes: "Clear interview dialogue, moderate pace. Approx. 50 seconds.",
});

export const listeningScriptShiftTalk = buildListeningScript({
  title: "Career Advice and Shift Planning Call",
  setting: "Career advice centre phone call",
  speakers: [
    { name: "Advisor", role: "career advisor" },
    { name: "Linh", role: "student caller" },
  ],
  lines: [
    { speaker: "Linh", text: "Hello. I want some advice about my career after school." },
    { speaker: "Advisor", text: "Of course. What kind of work interests you?" },
    {
      speaker: "Linh",
      text: "I like helping people. I had an interview for a nurse assistant course yesterday.",
    },
    {
      speaker: "Advisor",
      text: "That is a good choice. You need more experience in a hospital. Have you thought about volunteering?",
    },
    {
      speaker: "Linh",
      text: "Not yet. I also want a part-time job. Can I work a weekend shift and study?",
    },
    {
      speaker: "Advisor",
      text: "Many students do. Apply before September for training programmes. A Saturday shift can build useful skills.",
    },
    { speaker: "Linh", text: "Thank you. That helps a lot." },
  ],
  audioNotes: "Friendly phone conversation, clear voices. Approx. 45 seconds.",
});

const KET_WRITING_RUBRIC = {
  grammar: {
    weight: 0.25,
    criteria: "Uses present simple and/or present continuous correctly.",
  },
  vocabulary: {
    weight: 0.25,
    criteria: "Uses work words (apply, experience, shift, salary, interview) appropriately.",
  },
  organization: {
    weight: 0.25,
    criteria: "Email has greeting, body and polite closing.",
  },
  taskAchievement: {
    weight: 0.25,
    criteria: "Meets minimum length and addresses the writing task.",
  },
};

export const writingChecks = [
  buildWritingCheck({
    slug: "writing-job-application-check",
    topicTag: TOPIC,
    title: "Check: Job Application Email",
    instructions: "Write an email to apply for a part-time job. Write at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "You saw the Greenway Bookshop job advertisement. Write an email to Ms Pham to apply for the part-time shop assistant job.",
    prompts: [
      "Say which job you are applying for.",
      "Describe your work experience.",
      "Say when you can work (mention a shift).",
      "Ask a polite question about the salary or interview.",
      "End the email politely.",
    ],
    minWords: 25,
    modelAnswerText:
      "Dear Ms Pham,\n\nI am writing to apply for the part-time shop assistant job. I worked in a café for six months and my colleagues said I am friendly with customers. I can work the Saturday shift and Sunday shift. Could you tell me when the interview is? I would like to know more about the salary too.\n\nThank you,\nLinh",
    successCriteria: [
      "At least 25 words",
      "Clear application for the shop assistant job",
      "Mentions experience and availability",
      "Polite question about salary or interview",
      "Appropriate email opening and closing",
    ],
    autoCheckKeywords: ["dear", "apply", "experience", "shift", "salary", "interview", "thank", "ms", "pham", "job"],
    rubric: KET_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-shift-note-check",
    topicTag: TOPIC,
    title: "Check: Write About Your Shift",
    instructions: "Write a short note about your work schedule. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note to your manager explaining when you can work and asking about your shift.",
    prompts: [
      "Say what job you do or want.",
      "Describe your usual shift or availability.",
      "Mention one thing you are doing at work this week.",
      "Ask a polite question about salary or experience.",
    ],
    minWords: 25,
    modelAnswerText:
      "Dear Manager,\n\nI work as a part-time shop assistant on weekends. I usually do the Saturday morning shift from nine to five. This week I am training with a new colleague. Could you tell me when the employer pays the salary?\n\nThank you,\nLinh",
    successCriteria: [
      "At least 25 words",
      "Mentions shift or availability",
      "Uses present simple or continuous once",
      "Polite question included",
    ],
    autoCheckKeywords: ["shift", "work", "part-time", "salary", "experience", "thank", "manager"],
    rubric: KET_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-career-plan-check",
    topicTag: TOPIC,
    title: "Check: My Career Plan",
    instructions: "Write about your career plans and work experience. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to a pen friend describing your part-time job, experience and future career plans.",
    prompts: [
      "Say if you have a part-time job now.",
      "Describe your work experience.",
      "Say what career you would like.",
      "Mention when people usually retire in your country.",
    ],
    minWords: 25,
    modelAnswerText:
      "Hi Sam,\n\nI don't have a full-time job yet, but I want a part-time job at a bookshop. I have six months of customer service experience. I would like a career in nursing. Many people in my country retire at sixty or sixty-five.\n\nBye,\nLinh",
    successCriteria: [
      "At least 25 words",
      "Mentions job or career",
      "Uses experience or apply vocabulary",
      "Includes future plan or retire",
    ],
    autoCheckKeywords: ["job", "career", "experience", "part-time", "retire", "apply", "work"],
    rubric: KET_WRITING_RUBRIC,
  }),
];

const KET_SPEAKING_CRITERIA = {
  pronunciation: "Work words (colleague, salary, interview, career, shift) are clear enough to understand.",
  fluency: "Answers are connected; brief pauses are acceptable at KET A2.",
  grammar: "Uses present simple and present continuous or Wh- answers in short phrases.",
  vocabulary: "Uses at least four different unit words correctly.",
};

export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-job-check",
    topicTag: TOPIC,
    title: "Check: Talk About Your Job",
    instructions: "Answer the questions about work. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about your part-time job, colleagues and shifts.",
    sceneDescription:
      "Linh (13) in a bookshop uniform with a shift schedule on the wall — labels show colleague, shift, salary, manager.",
    followUpQuestions: [
      "Do you have a part-time job now? What do you do?",
      "Where do you work and who are your colleagues?",
      "What shift do you usually work?",
      "What is your salary?",
      "What is your manager like?",
    ],
    suggestedAnswers: [
      "Yes, I work part-time in a bookshop on weekends.",
      "I work in the city centre. My colleagues are very friendly.",
      "I usually work the Saturday morning shift.",
      "My salary is above the minimum wage.",
      "My manager is fair and helpful.",
    ],
    assessmentCriteria: KET_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-interview-check",
    topicTag: TOPIC,
    title: "Check: Talk About an Interview",
    instructions: "Answer using interview vocabulary. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about job applications and interviews.",
    sceneDescription:
      "A student talking to a manager about a job interview; calendar shows interview date and apply-by deadline.",
    followUpQuestions: [
      "Have you ever had a job interview?",
      "What job did you apply for?",
      "What experience do you have?",
      "When can you work?",
      "What question did the manager ask you?",
    ],
    suggestedAnswers: [
      "Yes, I had an interview for a shop assistant job last week.",
      "I applied for a part-time job at Greenway Bookshop.",
      "I have six months of customer service experience.",
      "I can work the weekend shift.",
      "The manager asked about my experience with customers.",
    ],
    assessmentCriteria: KET_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-career-check",
    topicTag: TOPIC,
    title: "Check: Describe Your Career Plans",
    instructions: "Describe your career plans and work experience. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "Tell the examiner about your career, experience and future work plans.",
    sceneDescription:
      "Linh (13) at a career advice desk with notes about nursing, part-time jobs and retirement age.",
    followUpQuestions: [
      "What career would you like in the future?",
      "Do you have any work experience?",
      "Why do you want a part-time job?",
      "What skills do you need for your career?",
      "When do people usually retire in your country?",
    ],
    suggestedAnswers: [
      "I would like a career in nursing.",
      "I have some volunteering experience at a hospital.",
      "I want to earn money and build skills after school.",
      "I need more experience and good communication skills.",
      "Many people retire at sixty or sixty-five.",
    ],
    assessmentCriteria: KET_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
];

export const listeningAnswerKeys = {
  jobInterview: {
    q1: "part-time waiter",
    q2: "bookshop six months",
    q3: "eight pounds an hour",
  },
  shiftTalk: {
    q1: "nurse assistant course interview",
    q2: "before September apply",
    q3: "volunteering hospital",
  },
};
