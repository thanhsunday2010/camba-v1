/**
 * Flyers Unit 5 — Science and Discovery
 * Shared content blocks for blueprint (Phase 1).
 * Lessons/exercises are assembled in unit-05.mjs (Phase 2).
 */

import { createCambridgeUnitBuilder } from "../../cambridge-unit-builder.mjs";

export const TOPIC = "science-and-discovery";

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
      word: "science",
      ipa: "/ˈsaɪəns/",
      partOfSpeech: "noun",
      vietnameseMeaning: "khoa học",
      exampleSentence: "Minh loves science lessons at school in Hanoi.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh thích các tiết khoa học ở trường tại Hà Nội.",
  },
  {
    ...buildVocabWord({
      word: "scientist",
      ipa: "/ˈsaɪəntɪst/",
      partOfSpeech: "noun",
      vietnameseMeaning: "nhà khoa học",
      exampleSentence: "The scientist showed us how to use a microscope.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Nhà khoa học cho chúng tôi xem cách dùng kính hiển vi.",
  },
  {
    ...buildVocabWord({
      word: "laboratory",
      ipa: "/ləˈbɒrətri/",
      partOfSpeech: "noun",
      vietnameseMeaning: "phòng thí nghiệm",
      exampleSentence: "We worked in the school laboratory after lunch.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng tôi làm việc trong phòng thí nghiệm trường sau bữa trưa.",
  },
  {
    ...buildVocabWord({
      word: "experiment",
      ipa: "/ɪkˈsperɪmənt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thí nghiệm",
      exampleSentence: "Our experiment tested how plants need light to grow.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Thí nghiệm của chúng tôi kiểm tra cách cây cần ánh sáng để phát triển.",
  },
  {
    ...buildVocabWord({
      word: "research",
      ipa: "/rɪˈsɜːtʃ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "nghiên cứu",
      exampleSentence: "The teacher asked us to do research about electricity.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Cô giáo yêu cầu chúng tôi nghiên cứu về điện.",
  },
  {
    ...buildVocabWord({
      word: "test",
      ipa: "/test/",
      partOfSpeech: "verb",
      vietnameseMeaning: "kiểm tra, thử nghiệm",
      exampleSentence: "Minh and Linh will test two different batteries.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh và Linh sẽ thử nghiệm hai loại pin khác nhau.",
  },
  {
    ...buildVocabWord({
      word: "result",
      ipa: "/rɪˈzʌlt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "kết quả",
      exampleSentence: "We wrote the result in our science notebook.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chúng tôi ghi kết quả vào sổ khoa học.",
  },
  {
    ...buildVocabWord({
      word: "discover",
      ipa: "/dɪˈskʌvə(r)/",
      partOfSpeech: "verb",
      vietnameseMeaning: "khám phá",
      exampleSentence: "Scientists discover new planets with a telescope.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Các nhà khoa học khám phá hành tinh mới bằng kính thiên văn.",
  },
  {
    ...buildVocabWord({
      word: "invent",
      ipa: "/ɪnˈvent/",
      partOfSpeech: "verb",
      vietnameseMeaning: "phát minh",
      exampleSentence: "People invent machines to make work easier.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Con người phát minh máy móc để công việc dễ hơn.",
  },
  {
    ...buildVocabWord({
      word: "invention",
      ipa: "/ɪnˈvenʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "phát minh",
      exampleSentence: "The robot was an important invention for the factory.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Robot là một phát minh quan trọng cho nhà máy.",
  },
  {
    ...buildVocabWord({
      word: "microscope",
      ipa: "/ˈmaɪkrəskəʊp/",
      partOfSpeech: "noun",
      vietnameseMeaning: "kính hiển vi",
      exampleSentence: "Linh looked at tiny cells through the microscope.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh quan sát các tế bào nhỏ qua kính hiển vi.",
  },
  {
    ...buildVocabWord({
      word: "telescope",
      ipa: "/ˈtelɪskəʊp/",
      partOfSpeech: "noun",
      vietnameseMeaning: "kính thiên văn",
      exampleSentence: "Minh used a telescope to look at the moon.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh dùng kính thiên văn để nhìn mặt trăng.",
  },
  {
    ...buildVocabWord({
      word: "machine",
      ipa: "/məˈʃiːn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "máy móc",
      exampleSentence: "The old machine in the laboratory still works well.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Chiếc máy cũ trong phòng thí nghiệm vẫn hoạt động tốt.",
  },
  {
    ...buildVocabWord({
      word: "robot",
      ipa: "/ˈrəʊbɒt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "robot",
      exampleSentence: "Our class built a small robot for the science project.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Lớp chúng tôi làm một robot nhỏ cho dự án khoa học.",
  },
  {
    ...buildVocabWord({
      word: "electricity",
      ipa: "/ɪˌlekˈtrɪsəti/",
      partOfSpeech: "noun",
      vietnameseMeaning: "điện",
      exampleSentence: "The experiment needs electricity from a battery.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Thí nghiệm cần điện từ pin.",
  },
  {
    ...buildVocabWord({
      word: "energy",
      ipa: "/ˈenədʒi/",
      partOfSpeech: "noun",
      vietnameseMeaning: "năng lượng",
      exampleSentence: "The sun gives energy to plants and machines.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Mặt trời cung cấp năng lượng cho cây và máy móc.",
  },
  {
    ...buildVocabWord({
      word: "space",
      ipa: "/speɪs/",
      partOfSpeech: "noun",
      vietnameseMeaning: "không gian (vũ trụ)",
      exampleSentence: "Minh is curious about planets in space.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Minh tò mò về các hành tinh trong không gian.",
  },
  {
    ...buildVocabWord({
      word: "planet",
      ipa: "/ˈplænɪt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hành tinh",
      exampleSentence: "Earth is the planet where we live.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Trái Đất là hành tinh chúng ta đang sống.",
  },
  {
    ...buildVocabWord({
      word: "project",
      ipa: "/ˈprɒdʒekt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "dự án",
      exampleSentence: "Our science project is about energy and electricity.",
      difficulty: 1,
      topic: TOPIC,
    }),
    exampleTranslation: "Dự án khoa học của chúng tôi về năng lượng và điện.",
  },
  {
    ...buildVocabWord({
      word: "curious",
      ipa: "/ˈkjʊəriəs/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "tò mò",
      exampleSentence: "Linh is curious about how the robot was built.",
      difficulty: 2,
      topic: TOPIC,
    }),
    exampleTranslation: "Linh tò mò về cách robot được chế tạo.",
  },
];

export const grammarReference = [
  buildGrammarRef({
    structure: "Passive voice: was built, was invented",
    explanation:
      "Use was/were + past participle to say who did something to an object in the past. The focus is on the thing, not the person: The robot was built by Minh's class. The microscope was invented long ago. Do not use active form when the object is more important.",
    examples: [
      "The small robot was built by Minh and Linh's class.",
      "Electricity was discovered through many experiments.",
      "The telescope was invented to look at planets in space.",
      "The machine in the laboratory was built last year.",
    ],
    commonMistakes: [
      "The robot built by the class (×) → The robot was built by the class (✓)",
      "The microscope was invent (×) → The microscope was invented (✓)",
      "The project was build yesterday (×) → The project was built yesterday (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Could / might for possibility",
    explanation:
      "Use could or might + base verb to say something is possible but not certain. Could is common in questions and suggestions: We could test another battery. Might is softer: The result might change tomorrow. Do not use will for uncertain ideas.",
    examples: [
      "The experiment might work if we use more electricity.",
      "Minh could discover something new with the microscope.",
      "Linh might invent a better machine for the project.",
      "We could see another planet through the telescope tonight.",
    ],
    commonMistakes: [
      "The robot might works (×) → The robot might work (✓)",
      "We could to test the battery (×) → We could test the battery (✓)",
      "The result will maybe change (×) → The result might change (✓)",
    ],
    topic: TOPIC,
  }),
  buildGrammarRef({
    structure: "Passive + could/might (mixed)",
    explanation:
      "Combine passive forms with could/might when talking about science projects and discoveries. The invention was built by students. The result might show more energy. We could use the laboratory again next week.",
    examples: [
      "The robot was built by our class, and it might win the school prize.",
      "Electricity was invented for machines, but we could test solar energy too.",
      "The telescope was invented long ago, and scientists might discover new planets.",
      "Our project was finished yesterday, so we could present the result today.",
    ],
    commonMistakes: [
      "The robot might built by us (×) → The robot might be built by us (✓)",
      "The experiment was might fail (×) → The experiment might fail (✓)",
      "We could the result was good (×) → The result could be good (✓)",
    ],
    topic: TOPIC,
  }),
];

export const unit = {
  learningObjectives: [
    "Name and use twenty science and discovery words at Flyers A2 level.",
    "Use was/were + past participle to talk about inventions and projects.",
    "Use could and might to express possibility in science contexts.",
    "Use contextual clues to understand unknown vocabulary in science texts.",
    "Track speakers in short interviews about school science projects.",
    "Write a short report (at least 25 words) about a science experiment.",
    "Talk about science projects, the laboratory and discoveries in spoken answers.",
  ],
};

export const passageMinhScience = buildPassage({
  title: "Minh and Linh's Science Project",
  text: `Minh is eleven and lives in Hanoi. He and his friend Linh are working on a science project in the school laboratory. Their teacher, Ms Nguyen, is helping them with research about electricity and energy.

First, Minh and Linh had to test two small batteries. They were curious about which battery gives more energy to their machine. Linh looked through the microscope at tiny wires while Minh wrote each result in the notebook.

"The first test was good," said Minh, "but the second result might be better tomorrow."
Ms Nguyen smiled. "Good scientists always check their work. You could discover something useful for your project."

Near the window stood an old telescope. Minh pointed at a poster of a planet in space. "A famous scientist used a telescope like this to discover new worlds," he said. Linh added, "Our robot was built last week, but it might need more electricity to move."

The class invention fair is next Friday. Minh and Linh hope their project was built well enough to win a prize. They could present their experiment and explain how the robot was invented by their whole class.`,
});

export const listeningScriptLabInterview = buildListeningScript({
  title: "Interview in the Laboratory",
  setting: "School science laboratory, Wednesday afternoon",
  speakers: [
    { name: "Ms Nguyen", role: "science teacher" },
    { name: "Minh", role: "boy, 11" },
    { name: "Linh", role: "girl, 11" },
  ],
  lines: [
    { speaker: "Ms Nguyen", text: "Minh, Linh, tell me about your science project." },
    { speaker: "Minh", text: "We test batteries to find which gives more energy to our machine." },
    { speaker: "Linh", text: "I use the microscope to look at tiny parts. The result might change tomorrow." },
    { speaker: "Ms Nguyen", text: "Good. Was the robot built by your whole class?" },
    { speaker: "Minh", text: "Yes! Our robot was built last week. It might need more electricity." },
    { speaker: "Linh", text: "I'm curious about space. I want to discover planets with a telescope." },
    { speaker: "Ms Nguyen", text: "You could do research about the moon for next month's fair." },
    { speaker: "Minh", text: "Great! Our experiment was invented to show how energy works." },
  ],
  audioNotes:
    "Short teacher interview with Minh and Linh about lab project. Clear speaker turns. Approx. 55 seconds.",
});

export const listeningScriptScienceFair = buildListeningScript({
  title: "Science Fair Interviews",
  setting: "School hall, Friday morning",
  speakers: [
    { name: "Reporter", role: "school reporter" },
    { name: "Minh", role: "boy, 11, project team" },
    { name: "Linh", role: "girl, 11, project team" },
  ],
  lines: [
    { speaker: "Reporter", text: "Welcome to the science fair! Minh, what is your project about?" },
    { speaker: "Minh", text: "Our project is about electricity and energy. We did an experiment in the laboratory." },
    { speaker: "Reporter", text: "Linh, was the robot built by your class?" },
    { speaker: "Linh", text: "Yes, it was built by twelve students. The invention might win first prize." },
    { speaker: "Reporter", text: "What did you discover during your research?" },
    { speaker: "Minh", text: "We discovered that the sun gives energy to our small machine." },
    { speaker: "Reporter", text: "Could you use a telescope to learn about space too?" },
    { speaker: "Linh", text: "We might! A scientist showed us a planet poster. We're curious about space now." },
  ],
  audioNotes:
    "Reporter interviews Minh and Linh at science fair. Track who says what. Approx. 50 seconds.",
});

const FLYERS_WRITING_RUBRIC = {
  grammar: {
    weight: 0.3,
    criteria: "Uses was built/was invented, could/might correctly where appropriate.",
  },
  vocabulary: {
    weight: 0.3,
    criteria: "Uses science words from the unit (experiment, laboratory, energy, etc.).",
  },
  organization: {
    weight: 0.2,
    criteria: "Steps and results follow a logical order.",
  },
  taskAchievement: {
    weight: 0.2,
    criteria: "Meets minimum length and addresses the writing task.",
  },
};

/** Writing Check exercises — one per writing lesson (sortOrder 2). */
export const writingChecks = [
  buildWritingCheck({
    slug: "writing-lab-check",
    topicTag: TOPIC,
    title: "Check: Write About the Laboratory",
    instructions: "Write about your science project in the laboratory. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short report to your teacher about Minh and Linh's experiment in the laboratory. Say what they test and what result they get.",
    prompts: [
      "Where do Minh and Linh work on their project?",
      "What do they test with the batteries?",
      "What does Linh see through the microscope?",
      "What might happen to the result tomorrow?",
    ],
    minWords: 25,
    modelAnswerText:
      "Minh and Linh work on their science project in the school laboratory. They test two batteries to find which gives more energy to their machine. Linh looks through the microscope at tiny wires while Minh writes each result. The first test was good but the second result might be better tomorrow. Their teacher says they could discover something useful.",
    successCriteria: [
      "At least 25 words",
      "Uses laboratory, experiment or test",
      "Mentions result or energy",
      "Describes what the students do",
    ],
    autoCheckKeywords: ["laboratory", "experiment", "test", "result", "energy", "microscope"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-invention-check",
    topicTag: TOPIC,
    title: "Check: Write About an Invention",
    instructions: "Write about a science invention. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short note about the class robot. Say who built it, what it needs and what might happen at the science fair.",
    prompts: [
      "Was the robot built by the class?",
      "What might the robot need to move?",
      "When is the invention fair?",
      "What could Minh and Linh present?",
    ],
    minWords: 25,
    modelAnswerText:
      "Our robot was built by the whole class last week. It is an important invention for our science project. The robot might need more electricity to move across the laboratory floor. The invention fair is next Friday and we could present our experiment there. Linh is curious about how machines use energy from batteries.",
    successCriteria: [
      "At least 25 words",
      "Uses was built or invention",
      "Uses could or might",
      "Mentions robot or machine",
    ],
    autoCheckKeywords: ["robot", "built", "invention", "electricity", "might", "experiment"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
  buildWritingCheck({
    slug: "writing-space-check",
    topicTag: TOPIC,
    title: "Check: Write About Space and Discovery",
    instructions: "Write about space and discovery. Use at least 25 words.",
    sortOrder: 2,
    taskDescription:
      "Write a short email to a pen friend about Minh's interest in space. Include the telescope, a planet and what scientists discover.",
    prompts: [
      "What does Minh point at on the poster?",
      "What did a famous scientist use to discover new worlds?",
      "What research could Linh do about the moon?",
      "Why is Minh curious about space?",
    ],
    minWords: 25,
    modelAnswerText:
      "Minh is curious about planets in space. In the laboratory he pointed at a poster of a planet near the old telescope. A famous scientist used a telescope to discover new worlds long ago. Linh might do research about the moon for next month's fair. We could learn more about how the sun gives energy to our planet Earth.",
    successCriteria: [
      "At least 25 words",
      "Uses space, planet or telescope",
      "Uses discover or curious",
      "Uses could or might",
    ],
    autoCheckKeywords: ["space", "planet", "telescope", "discover", "curious", "research"],
    rubric: FLYERS_WRITING_RUBRIC,
  }),
];

const FLYERS_SPEAKING_CRITERIA = {
  pronunciation: "Science words (laboratory, microscope, electricity) are clear enough to understand.",
  fluency: "Answers are connected; brief pauses are acceptable at Flyers level.",
  grammar: "Uses was built/was invented and could/might in short phrases.",
  vocabulary: "Uses science and discovery vocabulary from the unit.",
};

/** Speaking Check exercises — one per speaking lesson (sortOrder 2). */
export const speakingChecks = [
  buildSpeakingCheck({
    slug: "speaking-lab-check",
    topicTag: TOPIC,
    title: "Check: Talk About the Laboratory",
    instructions: "Answer the questions about the science laboratory. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about Minh and Linh's work in the school laboratory.",
    sceneDescription:
      "Story outline: (1) science project in laboratory with Ms Nguyen, (2) test two batteries for energy, (3) Linh uses microscope on tiny wires, (4) Minh writes results, (5) second result might be better tomorrow.",
    followUpQuestions: [
      "Where do Minh and Linh work on their project?",
      "What do they test in their experiment?",
      "What does Linh see through the microscope?",
      "What does Ms Nguyen say good scientists do?",
      "What might happen to the second result?",
    ],
    suggestedAnswers: [
      "In the school laboratory with their teacher.",
      "They test two batteries for energy.",
      "Tiny wires through the microscope.",
      "They always check their work.",
      "It might be better tomorrow.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-invention-check",
    topicTag: TOPIC,
    title: "Check: Talk About Inventions",
    instructions: "Answer using invention vocabulary. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "The examiner asks about the class robot and science fair.",
    sceneDescription:
      "Scene labels: robot built last week by class, might need electricity, invention fair next Friday, could present experiment, hope project wins prize.",
    followUpQuestions: [
      "Was the robot built by Minh and Linh alone?",
      "What might the robot need to move?",
      "When is the invention fair?",
      "What could they present at the fair?",
      "What was their experiment invented to show?",
    ],
    suggestedAnswers: [
      "No, it was built by the whole class.",
      "It might need more electricity.",
      "Next Friday.",
      "They could present their experiment.",
      "How energy works.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
  buildSpeakingCheck({
    slug: "speaking-space-check",
    topicTag: TOPIC,
    title: "Check: Talk About Space and Discovery",
    instructions: "Talk about space and discovery. Speak for up to 120 seconds.",
    sortOrder: 2,
    prompt: "Tell the examiner what Minh and Linh are curious about in space.",
    sceneDescription:
      "Timeline: poster of planet near window → old telescope → scientist discovered new worlds → Linh curious about space → could research the moon → might discover planets.",
    followUpQuestions: [
      "What is on the poster Minh points at?",
      "What did a scientist use to discover new worlds?",
      "Why is Linh curious about space?",
      "What research could they do about the moon?",
      "What might they discover with a telescope?",
    ],
    suggestedAnswers: [
      "A planet in space.",
      "A telescope.",
      "She wants to discover planets.",
      "Research about the moon for next month.",
      "They might discover new planets.",
    ],
    assessmentCriteria: FLYERS_SPEAKING_CRITERIA,
    maxDurationSeconds: 120,
  }),
];

/** Listening answer keys keyed by question id — for Phase 2 exercise assembly. */
export const listeningAnswerKeys = {
  labInterview: {
    q1: "batteries",
    q2: "robot",
    q3: "telescope",
  },
  scienceFair: {
    q1: "electricity",
    q2: "twelve",
    q3: "sun",
  },
};
