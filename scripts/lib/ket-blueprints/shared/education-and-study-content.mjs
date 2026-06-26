/**
 * KET Unit 1 — Education and Study
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-01.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "education-and-study";

const {
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildWritingCheck,
  buildSpeakingCheck,
} = createCambridgeUnitBuilder("ket");

export const vocabularyBank = [
  buildVocabWord({
    word: "subject",
    ipa: "/ˈsʌbdʒɪkt/",
    partOfSpeech: "noun",
    vietnameseMeaning: "môn học",
    exampleSentence: "My favourite subject is English.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "timetable",
    ipa: "/ˈtaɪmteɪbl/",
    partOfSpeech: "noun",
    vietnameseMeaning: "thời khóa biểu",
    exampleSentence: "Check the timetable for your next class.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "revision",
    ipa: "/rɪˈvɪʒn/",
    partOfSpeech: "noun",
    vietnameseMeaning: "ôn tập",
    exampleSentence: "I do revision before every exam.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "assignment",
    ipa: "/əˈsaɪnmənt/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bài tập / bài nộp",
    exampleSentence: "The assignment is due on Friday.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "deadline",
    ipa: "/ˈdedlaɪn/",
    partOfSpeech: "noun",
    vietnameseMeaning: "hạn chót",
    exampleSentence: "Don't miss the deadline for your homework.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "graduate",
    ipa: "/ˈɡrædʒuət/",
    partOfSpeech: "verb",
    vietnameseMeaning: "tốt nghiệp",
    exampleSentence: "She wants to graduate next year.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "semester",
    ipa: "/sɪˈmestə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "học kỳ",
    exampleSentence: "We have two semesters each year.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "campus",
    ipa: "/ˈkæmpəs/",
    partOfSpeech: "noun",
    vietnameseMeaning: "khuôn viên trường",
    exampleSentence: "The library is on the main campus.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "lecture",
    ipa: "/ˈlektʃə(r)/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bài giảng",
    exampleSentence: "There is a science lecture on Tuesday.",
    difficulty: 2,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "exam",
    ipa: "/ɪɡˈzæm/",
    partOfSpeech: "noun",
    vietnameseMeaning: "kỳ thi",
    exampleSentence: "I have an English exam in May.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "homework",
    ipa: "/ˈhəʊmwɜːk/",
    partOfSpeech: "noun",
    vietnameseMeaning: "bài tập về nhà",
    exampleSentence: "I do my homework in the library.",
    difficulty: 1,
    topic: TOPIC,
  }),
  buildVocabWord({
    word: "library",
    ipa: "/ˈlaɪbrəri/",
    partOfSpeech: "noun",
    vietnameseMeaning: "thư viện",
    exampleSentence: "The library is open after school.",
    difficulty: 1,
    topic: TOPIC,
  }),
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Present perfect with for / since",
    explanation:
      "Use present perfect (have/has + past participle) with for + a period of time and since + a starting point. For: I have studied English for two years. Since: I have studied English since Year 6.",
    examples: [
      "I have studied English since Year 6.",
      "Linh has revised every evening since Monday.",
      "We have had the same timetable for one semester.",
      "She has lived on campus since September.",
    ],
    commonMistakes: [
      "I have studied since two years (×) → I have studied for two years (✓)",
      "I have studied for Year 6 (×) → I have studied since Year 6 (✓)",
      "Linh has revise since Monday (×) → Linh has revised since Monday (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Have to / need to",
    explanation:
      "Use have to or need to + base verb to talk about obligations and necessities. Have to often describes external rules; need to focuses on necessity.",
    examples: [
      "Students have to bring their ID to the library.",
      "You need to finish the assignment before the deadline.",
      "Linh has to finish her history assignment this month.",
      "I don't have to go to revision club, but I want extra help.",
    ],
    commonMistakes: [
      "You have to bringing your book (×) → You have to bring your book (✓)",
      "I need finish my homework (×) → I need to finish my homework (✓)",
      "Students has to bring ID (×) → Students have to bring ID (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Use core education and study vocabulary at A2 level.",
    "Use present perfect with for and since to talk about study habits and duration.",
    "Use have to and need to to talk about school rules and obligations.",
    "Read about Linh's school life and skim signs and notices for gist.",
    "Understand the main idea in short school announcements.",
    "Write a short email to a teacher about an assignment.",
    "Answer interview questions about study habits and school life.",
  ],
};

export const passageLinhSchoolLife = buildPassage({
  title: "Linh's School Life at West Hill Secondary",
  text: `Linh is thirteen and studies in Year 8 at West Hill Secondary School on the main campus. She has studied English since Year 6 and has had the same timetable for one semester.

This month Linh has to finish a history assignment about campus life one hundred years ago. She has revised every evening since Monday because the deadline is next Friday. Students need to bring their student ID to use the library after school.

Linh doesn't have to go to revision club on Wednesday, but she wants extra help from Ms Tran. Her favourite subject is English, though she needs to work harder at maths. She hopes to graduate in four years and visit a university lecture one day.

LIBRARY NOTICE (posted outside the lecture hall)
Revision week: 10–14 March. The library is open Monday–Thursday, 3:30–6:00 p.m. Friday: CLOSED (staff meeting). All books must be returned before 7 March.`,
});

export const listeningScriptLibraryNotice = buildListeningScript({
  title: "Library Revision Week Announcement",
  setting: "School PA system, afternoon",
  speakers: [{ name: "Library Team", role: "school announcement" }],
  lines: [
    {
      speaker: "Library Team",
      text: "Attention students. During revision week from ten to fourteen March, the school library will stay open for extra study hours after school.",
    },
    {
      speaker: "Library Team",
      text: "Monday to Thursday, the library is open from three thirty to six p.m. On Friday the library is closed because of a staff meeting.",
    },
    {
      speaker: "Library Team",
      text: "Students can use the library for homework, exam preparation and quiet revision. Bring your student ID every day.",
    },
    {
      speaker: "Library Team",
      text: "All books must be returned before the deadline: Friday seventh March. Mobile phones must be silent in the library.",
    },
    {
      speaker: "Library Team",
      text: "Need help finding resources for your assignment? Speak to Ms Tran at the information desk. For full details, visit the campus website. Thank you.",
    },
  ],
  audioNotes: "Clear PA announcement, moderate pace. Approx. 50 seconds.",
});

export const listeningScriptAssignmentDeadline = buildListeningScript({
  title: "Assignment Deadline Reminder",
  setting: "End of a morning lesson",
  speakers: [
    { name: "Ms Tran", role: "English teacher" },
    { name: "Students", role: "class" },
  ],
  lines: [
    { speaker: "Ms Tran", text: "Before you leave, a quick reminder about your history assignment." },
    {
      speaker: "Ms Tran",
      text: "You need to write about life on campus one hundred years ago. The deadline is next Friday at three o'clock.",
    },
    {
      speaker: "Ms Tran",
      text: "Email your work to me or bring a printed copy. Late work will lose marks.",
    },
    {
      speaker: "Ms Tran",
      text: "If you need help, come to revision club in the library on Wednesday. Any questions?",
    },
    { speaker: "Students", text: "No, thank you." },
    { speaker: "Ms Tran", text: "Good. Don't forget the deadline." },
  ],
  audioNotes: "Classroom tone, teacher speaks clearly. Approx. 40 seconds.",
});

const KET_WRITING_RUBRIC = {
  grammar: {
    weight: 0.25,
    criteria: "Uses present perfect, have to/need to or polite request forms correctly.",
  },
  vocabulary: {
    weight: 0.25,
    criteria: "Uses education words (assignment, deadline, revision, subject) appropriately.",
  },
  organization: {
    weight: 0.25,
    criteria: "Email or note has greeting, body and polite closing.",
  },
  taskAchievement: {
    weight: 0.25,
    criteria: "Meets minimum length and addresses the writing task.",
  },
};

export const writingChecks = [
  buildWritingCheck({
    slug: "writing-email-check",
    topicTag: TOPIC,
    title: "Check: Email About an Assignment",
    instructions: "Write an email to your teacher. Write at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write an email to your English teacher, Ms Tran. You have a problem with your history assignment and you want to ask about the deadline.",
    prompts: [
      "Say why you are writing.",
      "Explain your problem with the assignment.",
      "Ask a polite question about the deadline.",
      "End the email politely.",
    ],
    minWords: 25,
    modelAnswerText:
      "Dear Ms Tran,\n\nI am writing about my history assignment. I have studied the notes since Monday, but I need more time to finish the work. Could you tell me if the deadline is next Friday? I can come to revision club on Wednesday.\n\nThank you,\nLinh",
    successCriteria: [
      "At least 25 words",
      "Clear reason for writing about the assignment",
      "Polite question about the deadline",
      "Appropriate email opening and closing",
    ],
    autoCheckKeywords: ["dear", "assignment", "deadline", "revision", "thank", "ms", "tran"],
    rubric: KET_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-revision-check",
    topicTag: TOPIC,
    title: "Check: Write About Revision",
    instructions: "Write a short note about your revision habits. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note to a classmate about how you prepare for exams during revision week.",
    prompts: [
      "Say when you started revising.",
      "Describe where you study.",
      "Mention one school rule (have to / need to).",
      "Invite your classmate to study together.",
    ],
    minWords: 25,
    modelAnswerText:
      "Hi Mai,\n\nI have revised every evening since Monday because we have exams soon. I usually study in the library after school. Students need to bring their student ID, so don't forget yours. Do you want to come to revision club with me on Wednesday?\n\nLinh",
    successCriteria: [
      "At least 25 words",
      "Uses since or for with present perfect",
      "Mentions revision or library",
      "Uses have to or need to once",
    ],
    autoCheckKeywords: ["revision", "library", "since", "exam", "study", "need", "have to"],
    rubric: KET_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-plan-check",
    topicTag: TOPIC,
    title: "Check: My Study Plan",
    instructions: "Write about your study plan and future goals. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short message to a pen friend describing your school life, obligations and future study plans.",
    prompts: [
      "Say what school you go to and your favourite subject.",
      "Describe one thing you have to do this month.",
      "Say how long you have studied English.",
      "Mention a future plan (graduate or visit a lecture).",
    ],
    minWords: 25,
    modelAnswerText:
      "Hi Sam,\n\nI study at West Hill Secondary on the main campus. My favourite subject is English, but I have to finish a history assignment this month. I have studied English since Year 6. I hope to graduate in four years and visit a university lecture one day.\n\nBye,\nLinh",
    successCriteria: [
      "At least 25 words",
      "Mentions subject or assignment",
      "Uses for or since correctly",
      "Includes have to or need to",
    ],
    autoCheckKeywords: ["subject", "assignment", "since", "graduate", "school", "english"],
    rubric: KET_WRITING_RUBRIC,
  }),
];

const KET_SPEAKING_CRITERIA = {
  pronunciation: "Education words (assignment, deadline, revision, subject) are clear enough to understand.",
  fluency: "Answers are connected; brief pauses are acceptable at KET A2.",
  grammar: "Uses present perfect with for/since and have to/need to in short phrases.",
  vocabulary: "Uses education and study vocabulary from the unit.",
};

export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-study-check",
    topicTag: TOPIC,
    title: "Check: Talk About Study Habits",
    instructions: "Answer the questions about study habits. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about your subjects, timetable and revision.",
    sceneDescription:
      "A secondary student at a desk with timetable, books and library notice on the wall — labels show subject, revision, homework.",
    followUpQuestions: [
      "What is your favourite subject?",
      "Where do you usually do your homework?",
      "How long have you studied at this school?",
      "How long have you studied English?",
      "Do you do revision before exams?",
    ],
    suggestedAnswers: [
      "My favourite subject is English.",
      "I usually do my homework in the library.",
      "I have studied here for two years.",
      "I have studied English since Year 6.",
      "Yes, I revise every evening during revision week.",
    ],
    assessmentCriteria: KET_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-assignment-check",
    topicTag: TOPIC,
    title: "Check: Talk About an Assignment",
    instructions: "Answer using assignment vocabulary. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about your homework and deadlines.",
    sceneDescription:
      "A student talking to a teacher about a history assignment; calendar shows Friday deadline and revision club on Wednesday.",
    followUpQuestions: [
      "Tell me about your history assignment.",
      "When is the deadline?",
      "Do you need help with your work?",
      "What do you have to bring to the library?",
      "What happens if you miss the deadline?",
    ],
    suggestedAnswers: [
      "I have to write about campus life one hundred years ago.",
      "The deadline is next Friday at three o'clock.",
      "Yes, I can go to revision club on Wednesday.",
      "I have to bring my student ID.",
      "Late work will lose marks.",
    ],
    assessmentCriteria: KET_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-school-check",
    topicTag: TOPIC,
    title: "Check: Describe Your School Life",
    instructions: "Describe your school and future plans. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "Tell the examiner about your campus, semester and future study plans.",
    sceneDescription:
      "West Hill Secondary campus with library, lecture hall and students with timetables — Linh (13) in school uniform.",
    followUpQuestions: [
      "Tell me about your school campus.",
      "What year are you in?",
      "How long have you had the same timetable?",
      "When do you want to graduate?",
      "Have you ever been to a university lecture?",
    ],
    suggestedAnswers: [
      "My school is on the main campus. There is a library and a lecture hall.",
      "I am in Year 8 at secondary school.",
      "I have had the same timetable for one semester.",
      "I hope to graduate in four years.",
      "No, not yet, but I want to visit one day.",
    ],
    assessmentCriteria: KET_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
];

export const listeningAnswerKeys = {
  libraryNotice: {
    q1: "revision week extra hours",
    q2: "3:30 p.m. – 6:00 p.m.",
    q3: "student ID",
  },
  assignmentDeadline: {
    q1: "history assignment deadline",
    q2: "next Friday 3pm",
    q3: "campus one hundred years ago",
  },
};
