/**
 * M1.3 — YLE practice mock bank (7 manifests).
 * Starters T2–T3, Movers T1–T3, Flyers T1–T3.
 */

import { LEVEL_IDS, buildManifestSeedIds } from "./mock-test-ids.mjs";

const BLUEPRINT_IDS = {
  starters: "yle-starters-practice-v1",
  movers: "yle-movers-practice-v1",
  flyers: "yle-flyers-practice-v1",
};

function mcq(text, correct, wrong, opts = {}) {
  const { levelTag, ...rest } = opts;
  return {
    points: 1,
    blueprintQuestionType: "mcq_single",
    cambaQuestionType: "multiple_choice",
    questionText: text,
    choices: [
      { text: correct, isCorrect: true, sortOrder: 0 },
      ...wrong.map((w, i) => ({ text: w, isCorrect: false, sortOrder: i + 1 })),
    ],
    ...(levelTag ? { content: { levelTag } } : {}),
    ...rest,
  };
}

function match(text, pairs, opts = {}) {
  const { levelTag, ...rest } = opts;
  const normalized = pairs.map((p, i) =>
    Array.isArray(p)
      ? { leftText: p[0], rightText: p[1], sortOrder: i }
      : { ...p, sortOrder: p.sortOrder ?? i }
  );
  return {
    points: 1,
    blueprintQuestionType: "matching",
    cambaQuestionType: "matching",
    questionText: text,
    pairs: normalized,
    content: { levelTag: levelTag ?? rest.levelSlug },
    ...rest,
  };
}

function gap(text, template, answer, opts = {}) {
  const { levelTag, acceptedAnswers, ...rest } = opts;
  const answers = Array.isArray(answer) ? answer : [answer];
  const content = {
    template,
    correctAnswers: answers,
    levelTag,
    ...(acceptedAnswers ? { acceptedAnswers } : {}),
  };
  return {
    points: 1,
    blueprintQuestionType: "gap_fill",
    cambaQuestionType: "gap_fill",
    questionText: text,
    content,
    ...rest,
  };
}

function buildManifest(def) {
  const {
    levelSlug,
    testNumber,
    title,
    description,
    timeLimitMinutes,
    sections,
    parts,
    questions: rawQuestions,
    grammarPatterns,
    subskills,
    coverageNotes,
    authoringNotes,
  } = def;

  const manifestId = `${levelSlug}-practice-test-${testNumber}`;
  const questionRefs = rawQuestions.map((q) => q.questionRef);
  const sectionSlugs = sections.map((s) => s.sectionSlug);

  const questions = rawQuestions.map((q, i) => {
    const base = { sortOrder: i, points: 1, ...q };
    if (base.cambaQuestionType === "matching" && !base.content) {
      base.content = { levelTag: levelSlug };
    }
    if (base.cambaQuestionType === "multiple_choice" && !base.content) {
      base.content = { levelTag: levelSlug };
    }
    if (base.cambaQuestionType === "gap_fill" && base.content && !base.content.levelTag) {
      base.content.levelTag = levelSlug;
    }
    if (!base.skillTag) {
      base.skillTag = base.sectionSlug === "listening" ? "listening" : "reading";
    }
    return base;
  });

  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
  for (const q of questions) difficultyCounts[q.difficulty]++;

  const distinctTopics = [...new Set(questions.map((q) => q.topicTag).filter(Boolean))];

  return {
    metadata: {
      manifestId,
      manifestVersion: "1.0.0",
      stableSlug: manifestId,
      blueprintId: BLUEPRINT_IDS[levelSlug],
      blueprintVersion: "1.0.0",
      levelSlug,
      title,
      description,
      formKind: "practice",
      levelId: LEVEL_IDS[levelSlug],
      timeLimitMinutes,
      totalScore: questions.length,
      status: "published",
      authoringNotes: authoringNotes ?? `M1.3 mock bank — ${manifestId}`,
      grammarPatterns,
      subskills,
      coverageNotes,
      seedIds: buildManifestSeedIds(levelSlug, testNumber, sectionSlugs, questionRefs),
    },
    sections,
    parts,
    questions,
    coverageAchieved: {
      distinctTopics,
      distinctGrammarPatterns: grammarPatterns,
      subskillsRepresented: subskills,
      difficultyCounts,
      notes: coverageNotes,
    },
  };
}

function startersSections(listenRefs, rwRefs) {
  return [
    {
      sectionSlug: "listening",
      title: "Listening Practice",
      sortOrder: 0,
      skillSlug: "listening",
      timeLimitMinutes: 12,
      partSlugs: ["listening-part-1-link", "listening-part-2-write"],
      questionRefs: listenRefs,
    },
    {
      sectionSlug: "reading-writing",
      title: "Reading & Writing Practice",
      sortOrder: 1,
      skillSlug: "reading",
      timeLimitMinutes: 18,
      partSlugs: [
        "rw-part-1-match-words",
        "rw-part-2-sentences",
        "rw-part-3-dialogues",
        "rw-part-4-read-write",
      ],
      questionRefs: rwRefs,
    },
  ];
}

function startersListeningParts(scriptTitle, scriptText) {
  return [
    {
      partSlug: "listening-part-1-link",
      sectionSlug: "listening",
      partNumber: 1,
      title: "Listening Part 1 — Link",
      instructions: "Read the listening script. Match each person to the correct thing.",
      contextType: "listening",
      groupKey: "listening-part-1",
      passage: { title: scriptTitle, text: scriptText },
      note: "Text-simulated listening — no audio.",
    },
    {
      partSlug: "listening-part-2-write",
      sectionSlug: "listening",
      partNumber: 2,
      title: "Listening Part 2 — Write",
      instructions: "Read the listening script. Write the missing word in each sentence.",
      contextType: "listening",
      groupKey: "listening-part-2",
      passage: { title: scriptTitle, text: scriptText },
      note: "Text-simulated listening — no audio.",
    },
  ];
}

function moversSections(listenRefs, rwRefs) {
  return [
    {
      sectionSlug: "listening",
      title: "Listening Practice",
      sortOrder: 0,
      skillSlug: "listening",
      timeLimitMinutes: 15,
      partSlugs: ["listening-part-2-fill"],
      questionRefs: listenRefs,
    },
    {
      sectionSlug: "reading-writing",
      title: "Reading & Writing Practice",
      sortOrder: 1,
      skillSlug: "reading",
      timeLimitMinutes: 25,
      partSlugs: [
        "rw-part-1-definitions",
        "rw-part-2-conversations",
        "rw-part-3-story",
        "rw-part-4-messages",
      ],
      questionRefs: rwRefs,
    },
  ];
}

function flyersSections(listenRefs, rwRefs) {
  return [
    {
      sectionSlug: "listening",
      title: "Listening Practice",
      sortOrder: 0,
      skillSlug: "listening",
      timeLimitMinutes: 15,
      partSlugs: ["listening-part-2-fill"],
      questionRefs: listenRefs,
    },
    {
      sectionSlug: "reading-writing",
      title: "Reading & Writing Practice",
      sortOrder: 1,
      skillSlug: "reading",
      timeLimitMinutes: 35,
      partSlugs: [
        "rw-part-1-headings",
        "rw-part-2-dialogues",
        "rw-part-3-story-gaps",
        "rw-part-4-messages",
      ],
      questionRefs: rwRefs,
    },
  ];
}

function listenRefs(n) {
  return Array.from({ length: n }, (_, i) => `listen-${String(i + 1).padStart(2, "0")}`);
}

function rwRefs(n, prefix = "rw") {
  return Array.from({ length: n }, (_, i) => `${prefix}-${String(i + 1).padStart(2, "0")}`);
}

function gapItems(items, levelSlug, partSlug = "listening-part-2-fill") {
  return items.map((item, i) =>
    gap(item.q ?? "Complete the sentence.", item.template, item.answer, {
      questionRef: `listen-${String(i + 1).padStart(2, "0")}`,
      partSlug,
      sectionSlug: "listening",
      difficulty: item.difficulty,
      topicTag: item.topic,
      skillTag: "listening",
      explanation: item.explanation,
      levelTag: levelSlug,
      acceptedAnswers: item.acceptedAnswers,
    })
  );
}

// ─── Starters Practice Test 2 — Park & Weather ───────────────────────────────

const STARTERS_T2 = buildManifest({
  levelSlug: "starters",
  testNumber: 2,
  title: "Starters Practice Test 2",
  description:
    "Cambridge YLE Starters practice mock — park, weather, and friends themes with text-simulated listening.",
  timeLimitMinutes: 30,
  grammarPatterns: ["verb be", "have got", "can", "present simple", "prepositions of place"],
  subskills: [
    "vocabulary recognition",
    "matching words to meanings",
    "identifying detail in short texts",
    "completing simple sentences",
  ],
  coverageNotes: "M1.3 — distinct from Test 1; park and weather vocabulary; mostly easy difficulty.",
  sections: startersSections(
    listenRefs(8),
    rwRefs(12)
  ),
  parts: [
    ...startersListeningParts(
      "A day at the park",
      "Lily and Max go to the park. Lily has a kite. Max has a ball. Their friend Sam brings juice. It is sunny and warm."
    ),
    {
      partSlug: "rw-part-1-match-words",
      sectionSlug: "reading-writing",
      partNumber: 1,
      title: "Reading Part 1 — Match words",
      instructions: "Read each word and match it to the right phrase.",
      contextType: "reading",
      groupKey: "rw-part-1",
    },
    {
      partSlug: "rw-part-2-sentences",
      sectionSlug: "reading-writing",
      partNumber: 2,
      title: "Reading Part 2 — Choose",
      instructions: "Read the sentence and choose the best answer.",
      contextType: "reading",
      groupKey: "rw-part-2",
    },
    {
      partSlug: "rw-part-3-dialogues",
      sectionSlug: "reading-writing",
      partNumber: 3,
      title: "Reading Part 3 — Read and choose",
      instructions: "Read the text and choose the best answer.",
      contextType: "reading",
      questionRefs: ["rw-07"],
      groupKey: "rw-dialogue-1",
      passage: {
        title: "Rainy day",
        text: "It is raining today. Anna stays at home. She reads a book and drinks hot chocolate.",
      },
    },
    {
      partSlug: "rw-part-3-dialogues",
      sectionSlug: "reading-writing",
      partNumber: 3,
      title: "Reading Part 3 — Read and choose",
      instructions: "Read the text and choose the best answer.",
      contextType: "reading",
      questionRefs: ["rw-08"],
      groupKey: "rw-dialogue-2",
      passage: {
        title: "My pet rabbit",
        text: "I have got a white rabbit. It lives in a small cage. I give it carrots every day.",
      },
    },
    {
      partSlug: "rw-part-3-dialogues",
      sectionSlug: "reading-writing",
      partNumber: 3,
      title: "Reading Part 3 — Read and choose",
      instructions: "Read the text and choose the best answer.",
      contextType: "reading",
      questionRefs: ["rw-09"],
      groupKey: "rw-dialogue-3",
      passage: {
        title: "Birthday party",
        text: "Today is Kim's birthday. There are balloons in the living room. Her friends sing a song.",
      },
    },
    {
      partSlug: "rw-part-4-read-write",
      sectionSlug: "reading-writing",
      partNumber: 4,
      title: "Reading Part 4 — Write",
      instructions: "Read and write the missing word.",
      contextType: "reading",
      groupKey: "rw-part-4",
    },
  ],
  questions: [
    match("Match each child to what they have at the park.", [
      ["Lily", "a kite"],
      ["Max", "a ball"],
      ["Sam", "juice"],
    ], {
      questionRef: "listen-01", partSlug: "listening-part-1-link", sectionSlug: "listening",
      difficulty: "easy", topicTag: "park", skillTag: "listening",
      explanation: "Lily has a kite, Max has a ball, Sam brings juice.", levelTag: "starters",
    }),
    match("Match each weather word to the right thing.", [
      ["sunny", "wear a hat"],
      ["rainy", "use an umbrella"],
      ["windy", "fly a kite"],
    ], {
      questionRef: "listen-02", partSlug: "listening-part-1-link", sectionSlug: "listening",
      difficulty: "easy", topicTag: "weather", skillTag: "listening",
      explanation: "Sunny — hat; rainy — umbrella; windy — kite.", levelTag: "starters",
    }),
    match("Match each friend to a favourite place.", [
      ["Emma", "the playground"],
      ["Jack", "the pond"],
      ["Mia", "the café"],
    ], {
      questionRef: "listen-03", partSlug: "listening-part-1-link", sectionSlug: "listening",
      difficulty: "easy", topicTag: "friends", skillTag: "listening",
      explanation: "Emma likes the playground, Jack the pond, Mia the café.", levelTag: "starters",
    }),
    match("Match each body part to an action.", [
      ["eyes", "see flowers"],
      ["ears", "hear birds"],
      ["hands", "catch a ball"],
    ], {
      questionRef: "listen-04", partSlug: "listening-part-1-link", sectionSlug: "listening",
      difficulty: "medium", topicTag: "body", skillTag: "listening",
      explanation: "Eyes see, ears hear, hands catch.", levelTag: "starters",
    }),
    gap("Complete the sentence.", "It is [0] today.", "sunny", {
      questionRef: "listen-05", partSlug: "listening-part-2-write", sectionSlug: "listening",
      difficulty: "easy", topicTag: "weather", skillTag: "listening",
      explanation: "The weather is sunny.", levelTag: "starters",
    }),
    gap("Complete the sentence.", "She [0] a red balloon.", "has", {
      questionRef: "listen-06", partSlug: "listening-part-2-write", sectionSlug: "listening",
      difficulty: "easy", topicTag: "birthday", skillTag: "listening",
      explanation: "She has a red balloon.", levelTag: "starters",
      acceptedAnswers: { 0: ["has", "has got"] },
    }),
    gap("Write the number.", "Max is [0] years old.", "eight", {
      questionRef: "listen-07", partSlug: "listening-part-2-write", sectionSlug: "listening",
      difficulty: "medium", topicTag: "numbers", skillTag: "listening",
      explanation: "Max is eight.", levelTag: "starters",
      acceptedAnswers: { 0: ["eight", "8"] },
    }),
    gap("Complete the sentence.", "I [0] run fast.", "can", {
      questionRef: "listen-08", partSlug: "listening-part-2-write", sectionSlug: "listening",
      difficulty: "medium", topicTag: "sports", skillTag: "listening",
      explanation: "I can run fast.", levelTag: "starters",
    }),
    match("Match each word to the right phrase.", [
      ["cloud", "in the sky"],
      ["tree", "in the park"],
      ["bench", "we sit on it"],
    ], {
      questionRef: "rw-01", partSlug: "rw-part-1-match-words", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "park", skillTag: "reading",
      explanation: "Clouds are in the sky; trees grow in parks; benches are for sitting.", levelTag: "starters",
    }),
    match("Match each word to the right phrase.", [
      ["juice", "a cold drink"],
      ["sandwich", "food for lunch"],
      ["ice cream", "a sweet snack"],
    ], {
      questionRef: "rw-02", partSlug: "rw-part-1-match-words", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "food", skillTag: "reading",
      explanation: "Juice is a drink; sandwiches are lunch food; ice cream is sweet.", levelTag: "starters",
    }),
    match("Match each word to the right phrase.", [
      ["piano", "makes music"],
      ["drum", "you hit it"],
      ["song", "you sing it"],
    ], {
      questionRef: "rw-03", partSlug: "rw-part-1-match-words", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "music", skillTag: "reading",
      explanation: "Piano and drum are instruments; a song is sung.", levelTag: "starters",
    }),
    mcq("The kite is in the sky. Where is the kite?", "in the sky", ["on the grass", "under the bench"], {
      questionRef: "rw-04", partSlug: "rw-part-2-sentences", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "park", skillTag: "reading",
      explanation: "The sentence says the kite is in the sky.", levelTag: "starters",
    }),
    mcq("The rabbit is behind the tree. Where is the rabbit?", "behind the tree", ["in front of the tree", "on the tree"], {
      questionRef: "rw-05", partSlug: "rw-part-2-sentences", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "pets", skillTag: "reading",
      explanation: "Behind means at the back of the tree.", levelTag: "starters",
    }),
    mcq("Lily and Max are happy. How do they feel?", "happy", ["sad", "angry"], {
      questionRef: "rw-06", partSlug: "rw-part-2-sentences", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "feelings", skillTag: "reading",
      explanation: "The sentence says they are happy.", levelTag: "starters",
    }),
    mcq("What does Anna do on a rainy day?", "reads a book", ["plays football", "goes swimming"], {
      questionRef: "rw-07", partSlug: "rw-part-3-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "weather", skillTag: "reading",
      explanation: "Anna reads a book when it rains.", levelTag: "starters",
    }),
    mcq("What does the child give the rabbit?", "carrots", ["apples", "fish"], {
      questionRef: "rw-08", partSlug: "rw-part-3-dialogues", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "pets", skillTag: "reading",
      explanation: "The text says carrots every day.", levelTag: "starters",
    }),
    mcq("Where are the balloons?", "in the living room", ["in the garden", "at school"], {
      questionRef: "rw-09", partSlug: "rw-part-3-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "birthday", skillTag: "reading",
      explanation: "Balloons are in the living room.", levelTag: "starters",
    }),
    gap("Complete the word.", "This is my [0].", "father", {
      questionRef: "rw-10", partSlug: "rw-part-4-read-write", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "family", skillTag: "reading",
      explanation: "This is my father.", levelTag: "starters",
      acceptedAnswers: { 0: ["father", "dad"] },
    }),
    gap("Complete the sentence.", "The oranges [0] round.", "are", {
      questionRef: "rw-11", partSlug: "rw-part-4-read-write", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "fruit", skillTag: "reading",
      explanation: "Oranges are round.", levelTag: "starters",
    }),
    gap("Complete the sentence.", "We [0] to the park on Sunday.", "go", {
      questionRef: "rw-12", partSlug: "rw-part-4-read-write", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "park", skillTag: "reading",
      explanation: "We go to the park on Sunday.", levelTag: "starters",
    }),
  ],
});

// ─── Starters Practice Test 3 — Farm & Country ───────────────────────────────

const STARTERS_T3 = buildManifest({
  levelSlug: "starters",
  testNumber: 3,
  title: "Starters Practice Test 3",
  description:
    "Cambridge YLE Starters practice mock — farm animals, vegetables, and countryside themes.",
  timeLimitMinutes: 30,
  grammarPatterns: ["verb be", "have got", "there is/are", "present simple", "countable nouns"],
  subskills: [
    "farm vocabulary",
    "reading short descriptions",
    "matching words to phrases",
    "writing single words in context",
  ],
  coverageNotes: "M1.3 — farm and countryside theme; easy-heavy with one hard item.",
  sections: startersSections(listenRefs(8), rwRefs(12)),
  parts: [
    ...startersListeningParts(
      "On Uncle Ben's farm",
      "Uncle Ben has cows and chickens. The cows give milk. The chickens lay eggs. Children visit the farm on Saturday."
    ),
    {
      partSlug: "rw-part-1-match-words",
      sectionSlug: "reading-writing",
      partNumber: 1,
      title: "Reading Part 1 — Match words",
      instructions: "Read each word and match it to the right phrase.",
      contextType: "reading",
      groupKey: "rw-part-1",
    },
    {
      partSlug: "rw-part-2-sentences",
      sectionSlug: "reading-writing",
      partNumber: 2,
      title: "Reading Part 2 — Choose",
      instructions: "Read the sentence and choose the best answer.",
      contextType: "reading",
      groupKey: "rw-part-2",
    },
    {
      partSlug: "rw-part-3-dialogues",
      sectionSlug: "reading-writing",
      partNumber: 3,
      title: "Reading Part 3 — Read and choose",
      instructions: "Read the text and choose the best answer.",
      contextType: "reading",
      questionRefs: ["rw-07"],
      groupKey: "rw-dialogue-1",
      passage: {
        title: "Vegetable garden",
        text: "Grandma grows tomatoes and carrots. She waters the plants every morning. The vegetables are fresh and green.",
      },
    },
    {
      partSlug: "rw-part-3-dialogues",
      sectionSlug: "reading-writing",
      partNumber: 3,
      title: "Reading Part 3 — Read and choose",
      instructions: "Read the text and choose the best answer.",
      contextType: "reading",
      questionRefs: ["rw-08"],
      groupKey: "rw-dialogue-2",
      passage: {
        title: "At the zoo",
        text: "We see lions and monkeys at the zoo. The monkeys climb the trees. We take photos with Dad.",
      },
    },
    {
      partSlug: "rw-part-3-dialogues",
      sectionSlug: "reading-writing",
      partNumber: 3,
      title: "Reading Part 3 — Read and choose",
      instructions: "Read the text and choose the best answer.",
      contextType: "reading",
      questionRefs: ["rw-09"],
      groupKey: "rw-dialogue-3",
      passage: {
        title: "Winter on the farm",
        text: "In winter it is cold on the farm. The fields are white with snow. The horses stay in the barn.",
      },
    },
    {
      partSlug: "rw-part-4-read-write",
      sectionSlug: "reading-writing",
      partNumber: 4,
      title: "Reading Part 4 — Write",
      instructions: "Read and write the missing word.",
      contextType: "reading",
      groupKey: "rw-part-4",
    },
  ],
  questions: [
    match("Match each animal to what it gives.", [
      ["cow", "milk"],
      ["chicken", "eggs"],
      ["sheep", "wool"],
    ], {
      questionRef: "listen-01", partSlug: "listening-part-1-link", sectionSlug: "listening",
      difficulty: "easy", topicTag: "farm", skillTag: "listening",
      explanation: "Cows give milk, chickens lay eggs, sheep give wool.", levelTag: "starters",
    }),
    match("Match each vegetable to its colour.", [
      ["carrot", "orange"],
      ["pea", "green"],
      ["potato", "brown"],
    ], {
      questionRef: "listen-02", partSlug: "listening-part-1-link", sectionSlug: "listening",
      difficulty: "easy", topicTag: "vegetables", skillTag: "listening",
      explanation: "Carrots are orange, peas green, potatoes brown.", levelTag: "starters",
    }),
    match("Match each place to what you find there.", [
      ["barn", "horses"],
      ["field", "cows"],
      ["kitchen", "bread"],
    ], {
      questionRef: "listen-03", partSlug: "listening-part-1-link", sectionSlug: "listening",
      difficulty: "easy", topicTag: "countryside", skillTag: "listening",
      explanation: "Horses in the barn, cows in the field, bread in the kitchen.", levelTag: "starters",
    }),
    match("Match each season to weather.", [
      ["summer", "hot and sunny"],
      ["autumn", "windy and cool"],
      ["winter", "cold and snowy"],
    ], {
      questionRef: "listen-04", partSlug: "listening-part-1-link", sectionSlug: "listening",
      difficulty: "medium", topicTag: "seasons", skillTag: "listening",
      explanation: "Summer is hot, autumn cool, winter cold and snowy.", levelTag: "starters",
    }),
    gap("Complete the sentence.", "Uncle Ben [0] a farm.", "has", {
      questionRef: "listen-05", partSlug: "listening-part-2-write", sectionSlug: "listening",
      difficulty: "easy", topicTag: "farm", skillTag: "listening",
      explanation: "Uncle Ben has a farm.", levelTag: "starters",
      acceptedAnswers: { 0: ["has", "has got"] },
    }),
    gap("Complete the sentence.", "There [0] ten chickens.", "are", {
      questionRef: "listen-06", partSlug: "listening-part-2-write", sectionSlug: "listening",
      difficulty: "easy", topicTag: "farm", skillTag: "listening",
      explanation: "There are ten chickens.", levelTag: "starters",
    }),
    gap("Write the number.", "The children visit on [0].", "Saturday", {
      questionRef: "listen-07", partSlug: "listening-part-2-write", sectionSlug: "listening",
      difficulty: "medium", topicTag: "days", skillTag: "listening",
      explanation: "They visit on Saturday.", levelTag: "starters",
    }),
    gap("Complete the sentence.", "The horse [0] big.", "is", {
      questionRef: "listen-08", partSlug: "listening-part-2-write", sectionSlug: "listening",
      difficulty: "easy", topicTag: "farm", skillTag: "listening",
      explanation: "The horse is big.", levelTag: "starters",
    }),
    match("Match each word to the right phrase.", [
      ["tractor", "drives on the farm"],
      ["fence", "around the field"],
      ["pond", "ducks swim here"],
    ], {
      questionRef: "rw-01", partSlug: "rw-part-1-match-words", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "farm", skillTag: "reading",
      explanation: "Tractors work on farms; fences surround fields; ducks swim in ponds.", levelTag: "starters",
    }),
    match("Match each word to the right phrase.", [
      ["hospital", "doctors work here"],
      ["shop", "we buy food"],
      ["school", "children learn"],
    ], {
      questionRef: "rw-02", partSlug: "rw-part-1-match-words", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "places", skillTag: "reading",
      explanation: "Hospitals have doctors; shops sell food; schools are for learning.", levelTag: "starters",
    }),
    match("Match each hobby to the right phrase.", [
      ["drawing", "use crayons"],
      ["cooking", "make soup"],
      ["gardening", "plant seeds"],
    ], {
      questionRef: "rw-03", partSlug: "rw-part-1-match-words", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "hobbies", skillTag: "reading",
      explanation: "Drawing uses crayons; cooking makes food; gardening plants seeds.", levelTag: "starters",
    }),
    mcq("The sheep are in the field. Where are the sheep?", "in the field", ["in the barn", "in the kitchen"], {
      questionRef: "rw-04", partSlug: "rw-part-2-sentences", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "farm", skillTag: "reading",
      explanation: "The sheep are in the field.", levelTag: "starters",
    }),
    mcq("The tomatoes are red. What colour are the tomatoes?", "red", ["green", "blue"], {
      questionRef: "rw-05", partSlug: "rw-part-2-sentences", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "vegetables", skillTag: "reading",
      explanation: "Tomatoes are red.", levelTag: "starters",
    }),
    mcq("The monkey is on the tree. Where is the monkey?", "on the tree", ["under the tree", "in the river"], {
      questionRef: "rw-06", partSlug: "rw-part-2-sentences", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "zoo", skillTag: "reading",
      explanation: "On the tree means above the branches.", levelTag: "starters",
    }),
    mcq("When does Grandma water the plants?", "every morning", ["every evening", "on Monday only"], {
      questionRef: "rw-07", partSlug: "rw-part-3-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "vegetables", skillTag: "reading",
      explanation: "She waters every morning.", levelTag: "starters",
    }),
    mcq("What do the monkeys do?", "climb the trees", ["swim in the lake", "drive a car"], {
      questionRef: "rw-08", partSlug: "rw-part-3-dialogues", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "zoo", skillTag: "reading",
      explanation: "Monkeys climb the trees.", levelTag: "starters",
    }),
    mcq("Where do the horses stay in winter?", "in the barn", ["in the field", "at the shop"], {
      questionRef: "rw-09", partSlug: "rw-part-3-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "seasons", skillTag: "reading",
      explanation: "Horses stay in the barn in winter.", levelTag: "starters",
    }),
    gap("Complete the word.", "This is my [0].", "sister", {
      questionRef: "rw-10", partSlug: "rw-part-4-read-write", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "family", skillTag: "reading",
      explanation: "This is my sister.", levelTag: "starters",
    }),
    gap("Complete the sentence.", "The eggs [0] white.", "are", {
      questionRef: "rw-11", partSlug: "rw-part-4-read-write", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "farm", skillTag: "reading",
      explanation: "The eggs are white.", levelTag: "starters",
    }),
    gap("Complete the sentence.", "We [0] photos at the zoo.", "take", {
      questionRef: "rw-12", partSlug: "rw-part-4-read-write", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "zoo", skillTag: "reading",
      explanation: "We take photos at the zoo.", levelTag: "starters",
    }),
  ],
});

// ─── Movers helpers ──────────────────────────────────────────────────────────

function moversListeningPart(scriptTitle, scriptText) {
  return {
    partSlug: "listening-part-2-fill",
    sectionSlug: "listening",
    partNumber: 1,
    title: "Listening Part 2 — Fill in blanks",
    instructions: "Read the listening script. Write the missing words.",
    contextType: "listening",
    groupKey: "listening-part-2",
    passage: { title: scriptTitle, text: scriptText },
    note: "Text-simulated listening — no audio.",
  };
}

function moversRwParts(conversationPassages, storyPassage, messagePassages) {
  const base = [
    {
      partSlug: "rw-part-1-definitions",
      sectionSlug: "reading-writing",
      partNumber: 1,
      title: "Reading Part 1 — Definitions",
      instructions: "Match each definition to the correct word.",
      contextType: "reading",
      groupKey: "rw-part-1",
    },
    {
      partSlug: "rw-part-3-story",
      sectionSlug: "reading-writing",
      partNumber: 3,
      title: "Reading Part 3 — Story",
      instructions: "Read the story and complete the sentences.",
      contextType: "reading",
      groupKey: "rw-story",
      passage: storyPassage,
    },
  ];
  const convParts = conversationPassages.map((p, i) => ({
    partSlug: "rw-part-2-conversations",
    sectionSlug: "reading-writing",
    partNumber: 2,
    title: "Reading Part 2 — Conversations",
    instructions: "Read the conversation and choose the best answer.",
    contextType: "dialogue",
    questionRefs: [`rw-${String(5 + i).padStart(2, "0")}`],
    groupKey: `rw-conv-${i + 1}`,
    passage: p,
  }));
  const msgParts = messagePassages.map((p, i) => ({
    partSlug: "rw-part-4-messages",
    sectionSlug: "reading-writing",
    partNumber: 4,
    title: "Reading Part 4 — Messages",
    instructions: "Read the message and complete the gap.",
    contextType: "reading",
    questionRefs: [`rw-${String(13 + i).padStart(2, "0")}`],
    groupKey: `rw-msg-${i + 1}`,
    passage: p,
  }));
  return [...base.slice(0, 1), ...convParts, base[1], ...msgParts];
}

// ─── Movers Practice Test 1 — School Trip ────────────────────────────────────

const MOVERS_T1 = buildManifest({
  levelSlug: "movers",
  testNumber: 1,
  title: "Movers Practice Test 1",
  description: "Cambridge YLE Movers practice mock — school trip, museum, and sports club themes.",
  timeLimitMinutes: 40,
  grammarPatterns: [
    "past simple regular",
    "present continuous",
    "comparatives",
    "prepositions of time",
    "must/mustn't",
  ],
  subskills: [
    "listening for specific information",
    "matching definitions",
    "dialogue comprehension",
    "story gap completion",
    "reading short messages",
  ],
  coverageNotes: "M1.3 Movers T1 — mixed difficulty; school trip vocabulary.",
  sections: moversSections(listenRefs(10), rwRefs(16)),
  parts: [
    moversListeningPart(
      "The school museum trip",
      "Class 3B went to the city museum last Tuesday. They saw dinosaur bones and old paintings. The guide told them stories about ancient Egypt. Tom bought a postcard in the shop."
    ),
    ...moversRwParts(
      [
        { title: "At the ticket desk", text: "Clerk: Can I help you?\nMum: Two tickets for the science show, please.\nClerk: That is six pounds.\nMum: Here you are. Thank you." },
        { title: "Lost scarf", text: "Teacher: Did anyone see a blue scarf?\nSara: I found one near the dinosaur room.\nTeacher: Great! Whose is it?\nSara: There is a name tag — 'Leo'." },
        { title: "Lunch time", text: "Dad: Are you hungry, Mia?\nMia: Yes! Can we eat our sandwiches now?\nDad: Let's sit on that bench first.\nMia: Good idea. I want some water too." },
        { title: "Bus home", text: "Driver: Everyone back on the bus!\nChildren: We're coming!\nDriver: Fasten your seatbelts, please.\nTeacher: Well done, class. What a lovely trip!" },
      ],
      {
        title: "The football match",
        text: "Last Saturday, Ben played in a football match. His team wore yellow shirts. In the first half, Ben scored a goal. The crowd clapped loudly. After the game, everyone drank orange juice. Ben felt very proud.",
      },
      [
        { title: "Note from the teacher", text: "Dear parents,\nPlease send a packed lunch on Friday.\nWe will visit the river park.\nWear comfortable shoes.\nThank you,\nMrs Cole" },
        { title: "Birthday invitation", text: "Hi Sam,\nCome to my party on 14 May at 3 pm.\nWe will play games in the garden.\nPlease bring a smile!\nFrom Lucy" },
        { title: "Sports club email", text: "Hello members,\nSwimming lessons start next Monday.\nBring your towel and goggles.\nSee you at the pool!\nCoach Dan" },
        { title: "Library reminder", text: "Reminder:\nYour book 'Space Heroes' is due on Wednesday.\nPlease return it to the desk.\nThank you!" },
      ]
    ),
  ],
  questions: [
    ...gapItems([
      { template: "They went to the city [0] last Tuesday.", answer: "museum", topic: "school-trip", difficulty: "easy", explanation: "They visited the museum." },
      { template: "They saw dinosaur [0].", answer: "bones", topic: "museum", difficulty: "easy", explanation: "Dinosaur bones were on display." },
      { template: "The guide told stories about ancient [0].", answer: "Egypt", topic: "history", difficulty: "medium", explanation: "Stories were about ancient Egypt.", acceptedAnswers: { 0: ["Egypt", "egypt"] } },
      { template: "Tom bought a [0] in the shop.", answer: "postcard", topic: "shopping", difficulty: "easy", explanation: "Tom bought a postcard." },
      { template: "The science show tickets cost six [0].", answer: "pounds", topic: "money", difficulty: "medium", explanation: "Six pounds for two tickets." },
      { template: "Sara found a blue [0].", answer: "scarf", topic: "clothes", difficulty: "easy", explanation: "A blue scarf near the dinosaur room." },
      { template: "Mia wants some [0] too.", answer: "water", topic: "food", difficulty: "easy", explanation: "Mia asks for water." },
      { template: "The driver says: Fasten your [0].", answer: "seatbelts", topic: "transport", difficulty: "medium", explanation: "Fasten your seatbelts.", acceptedAnswers: { 0: ["seatbelts", "seatbelt"] } },
      { template: "Ben scored a [0] in the first half.", answer: "goal", topic: "sports", difficulty: "easy", explanation: "Ben scored a goal." },
      { template: "Everyone drank orange [0] after the game.", answer: "juice", topic: "sports", difficulty: "easy", explanation: "They drank orange juice." },
    ], "movers"),
    match("Match each definition to the correct word.", [["A place with old objects on show", "museum"], ["A person who teaches you on a trip", "guide"], ["Something you send to a friend with a picture", "postcard"]], {
      questionRef: "rw-01", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "museum", skillTag: "reading",
      explanation: "Museum, guide, postcard match the definitions.", levelTag: "movers",
    }),
    match("Match each definition to the correct word.", [["You wear this around your neck when it is cold", "scarf"], ["You kick this in football", "ball"], ["You sit on this in the park", "bench"]], {
      questionRef: "rw-02", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "vocabulary", skillTag: "reading",
      explanation: "Scarf, ball, bench.", levelTag: "movers",
    }),
    match("Match each definition to the correct word.", [["A building with many books to borrow", "library"], ["A person who drives a bus", "driver"], ["Money in the UK", "pound"]], {
      questionRef: "rw-03", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "places", skillTag: "reading",
      explanation: "Library, driver, pound.", levelTag: "movers",
    }),
    match("Match each definition to the correct word.", [["You do this when you like a performance", "clap"], ["The time before half-time in a game", "first half"], ["Feeling pleased with yourself", "proud"]], {
      questionRef: "rw-04", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "feelings", skillTag: "reading",
      explanation: "Clap, first half, proud.", levelTag: "movers",
    }),
    mcq("How much are two tickets?", "six pounds", ["four pounds", "ten pounds"], {
      questionRef: "rw-05", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "money", skillTag: "reading",
      explanation: "The clerk says six pounds.", levelTag: "movers",
    }),
    mcq("Where did Sara find the scarf?", "near the dinosaur room", ["in the shop", "on the bus"], {
      questionRef: "rw-06", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "museum", skillTag: "reading",
      explanation: "Near the dinosaur room.", levelTag: "movers",
    }),
    mcq("What does Mia want to drink?", "water", ["milk", "lemonade"], {
      questionRef: "rw-07", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "food", skillTag: "reading",
      explanation: "Mia wants water.", levelTag: "movers",
    }),
    mcq("What must the children do on the bus?", "fasten seatbelts", ["buy tickets", "read books"], {
      questionRef: "rw-08", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "transport", skillTag: "reading",
      explanation: "Fasten your seatbelts.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "Ben's team wore yellow [0].", "shirts", {
      questionRef: "rw-09", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "sports", skillTag: "reading",
      explanation: "They wore yellow shirts.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "Ben scored a goal in the [0] half.", "first", {
      questionRef: "rw-10", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "sports", skillTag: "reading",
      explanation: "In the first half.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "The crowd clapped [0].", "loudly", {
      questionRef: "rw-11", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "sports", skillTag: "reading",
      explanation: "They clapped loudly.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "Ben felt very [0] after the game.", "proud", {
      questionRef: "rw-12", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "feelings", skillTag: "reading",
      explanation: "Ben felt proud.", levelTag: "movers",
    }),
    gap("Complete the message.", "Please send a packed [0] on Friday.", "lunch", {
      questionRef: "rw-13", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "school", skillTag: "reading",
      explanation: "Packed lunch for the trip.", levelTag: "movers",
    }),
    gap("Complete the message.", "Lucy's party is on 14 [0].", "May", {
      questionRef: "rw-14", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "birthday", skillTag: "reading",
      explanation: "14 May.", levelTag: "movers", acceptedAnswers: { 0: ["May", "may"] },
    }),
    gap("Complete the message.", "Bring your towel and [0].", "goggles", {
      questionRef: "rw-15", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "sports", skillTag: "reading",
      explanation: "Towel and goggles for swimming.", levelTag: "movers",
    }),
    gap("Complete the message.", "Return the book on [0].", "Wednesday", {
      questionRef: "rw-16", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "library", skillTag: "reading",
      explanation: "Due on Wednesday.", levelTag: "movers",
    }),
  ],
});

// ─── Movers Practice Test 2 — Holiday Camp ───────────────────────────────────

const MOVERS_T2 = buildManifest({
  levelSlug: "movers",
  testNumber: 2,
  title: "Movers Practice Test 2",
  description: "Cambridge YLE Movers practice mock — holiday camp, travel, and beach themes.",
  timeLimitMinutes: 40,
  grammarPatterns: [
    "past simple irregular",
    "going to future",
    "adjectives",
    "prepositions of movement",
    "some/any",
  ],
  subskills: [
    "listening for detail",
    "definition matching",
    "understanding conversations",
    "sequencing story events",
    "note completion",
  ],
  coverageNotes: "M1.3 Movers T2 — holiday camp theme; balanced easy/medium/hard.",
  sections: moversSections(listenRefs(10), rwRefs(16)),
  parts: [
    moversListeningPart(
      "Summer holiday camp",
      "The children arrived at Pine Lake Camp on Monday. They put their bags in wooden cabins. In the afternoon they sailed small boats on the lake. On Wednesday they hiked through the forest and saw a deer."
    ),
    ...moversRwParts(
      [
        { title: "At the beach shop", text: "Shopkeeper: Can I help you?\nGirl: How much are these sunglasses?\nShopkeeper: Five pounds.\nGirl: OK. I'll take them." },
        { title: "Camp fire", text: "Leader: Sit in a circle, everyone.\nBoy: Can we sing a song?\nLeader: Yes! Then we'll toast marshmallows.\nChildren: Yay!" },
        { title: "Train station", text: "Dad: Our train leaves at ten fifteen.\nSon: Is that platform four?\nDad: Yes. Let's buy a sandwich first.\nSon: Good idea!" },
        { title: "Rainy afternoon", text: "Mum: It's raining. We can't swim now.\nGirl: Can we play board games inside?\nMum: Of course. I'll make hot chocolate.\nGirl: Thanks, Mum!" },
      ],
      {
        title: "The mountain hike",
        text: "On Tuesday morning, the camp group climbed a small mountain. The path was rocky but safe. They stopped halfway for a snack. From the top they could see the whole lake. Everyone took photos before walking down.",
      },
      [
        { title: "Camp rules", text: "Camp rules:\n1. Be kind to others.\n2. Wear a helmet when cycling.\n3. Lights out at 9 pm.\nHave fun!" },
        { title: "Postcard", text: "Dear Grandma,\nI am having a great time at camp.\nYesterday I caught a fish!\nLove, Jake" },
        { title: "Travel leaflet", text: "Boat trips every hour.\nAdults: £8\nChildren: £5\nLife jackets provided.\nBook at the pier office." },
        { title: "Weather note", text: "Thursday forecast:\nMorning — sunny\nAfternoon — cloudy\nEvening — light rain\nPack a raincoat!" },
      ]
    ),
  ],
  questions: [
    ...gapItems([
      { template: "They put their bags in wooden [0].", answer: "cabins", topic: "holiday", difficulty: "easy", explanation: "Bags went in cabins." },
      { template: "They sailed small boats on the [0].", answer: "lake", topic: "holiday", difficulty: "easy", explanation: "Boats on the lake." },
      { template: "On Wednesday they hiked through the [0].", answer: "forest", topic: "nature", difficulty: "medium", explanation: "Hiked through the forest." },
      { template: "They saw a [0] in the forest.", answer: "deer", topic: "animals", difficulty: "medium", explanation: "They saw a deer." },
      { template: "The sunglasses cost five [0].", answer: "pounds", topic: "shopping", difficulty: "easy", explanation: "Five pounds." },
      { template: "They will toast [0] at the camp fire.", answer: "marshmallows", topic: "food", difficulty: "medium", explanation: "Toast marshmallows." },
      { template: "The train leaves at ten [0].", answer: "fifteen", topic: "travel", difficulty: "medium", explanation: "Ten fifteen.", acceptedAnswers: { 0: ["fifteen", "15"] } },
      { template: "Platform [0] is their train.", answer: "four", topic: "travel", difficulty: "easy", explanation: "Platform four.", acceptedAnswers: { 0: ["four", "4"] } },
      { template: "They will play board games [0].", answer: "inside", topic: "weather", difficulty: "easy", explanation: "Play inside when it rains." },
      { template: "Mum will make hot [0].", answer: "chocolate", topic: "food", difficulty: "easy", explanation: "Hot chocolate." },
    ], "movers"),
    match("Match each definition to the correct word.", [["A small house at a camp", "cabin"], ["To travel on water in a boat", "sail"], ["A large area with many trees", "forest"]], {
      questionRef: "rw-01", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "holiday", skillTag: "reading", explanation: "Cabin, sail, forest.", levelTag: "movers",
    }),
    match("Match each definition to the correct word.", [["Glasses that protect your eyes from the sun", "sunglasses"], ["Sweet soft food you roast on a fire", "marshmallow"], ["A game you play on a board with pieces", "board game"]], {
      questionRef: "rw-02", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "holiday", skillTag: "reading", explanation: "Sunglasses, marshmallow, board game.", levelTag: "movers",
    }),
    match("Match each definition to the correct word.", [["Where trains stop for passengers", "platform"], ["Hard stones on a path", "rocks"], ["An animal with antlers", "deer"]], {
      questionRef: "rw-03", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "travel", skillTag: "reading", explanation: "Platform, rocks, deer.", levelTag: "movers",
    }),
    match("Match each definition to the correct word.", [["A jacket for wet weather", "raincoat"], ["To go up a mountain", "climb"], ["Not heavy; easy to carry", "light"]], {
      questionRef: "rw-04", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "weather", skillTag: "reading", explanation: "Raincoat, climb, light.", levelTag: "movers",
    }),
    mcq("How much are the sunglasses?", "five pounds", ["three pounds", "eight pounds"], {
      questionRef: "rw-05", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "shopping", skillTag: "reading", explanation: "Five pounds.", levelTag: "movers",
    }),
    mcq("What will they do after singing?", "toast marshmallows", ["go swimming", "catch a train"], {
      questionRef: "rw-06", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "holiday", skillTag: "reading", explanation: "Then toast marshmallows.", levelTag: "movers",
    }),
    mcq("Which platform is their train?", "platform four", ["platform two", "platform six"], {
      questionRef: "rw-07", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "travel", skillTag: "reading", explanation: "Platform four.", levelTag: "movers",
    }),
    mcq("What will they do because of the rain?", "play board games inside", ["swim in the lake", "hike the mountain"], {
      questionRef: "rw-08", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "weather", skillTag: "reading", explanation: "Play board games inside.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "The path was rocky but [0].", "safe", {
      questionRef: "rw-09", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "nature", skillTag: "reading", explanation: "Rocky but safe.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "They stopped halfway for a [0].", "snack", {
      questionRef: "rw-10", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "food", skillTag: "reading", explanation: "Stopped for a snack.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "From the top they could see the whole [0].", "lake", {
      questionRef: "rw-11", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "nature", skillTag: "reading", explanation: "They saw the lake.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "Everyone took [0] before walking down.", "photos", {
      questionRef: "rw-12", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "holiday", skillTag: "reading", explanation: "Took photos at the top.", levelTag: "movers",
      acceptedAnswers: { 0: ["photos", "pictures"] },
    }),
    gap("Complete the message.", "Wear a helmet when [0].", "cycling", {
      questionRef: "rw-13", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "safety", skillTag: "reading", explanation: "Helmet when cycling.", levelTag: "movers",
    }),
    gap("Complete the message.", "Yesterday I caught a [0]!", "fish", {
      questionRef: "rw-14", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "holiday", skillTag: "reading", explanation: "Caught a fish.", levelTag: "movers",
    }),
    gap("Complete the message.", "Children: £[0]", "5", {
      questionRef: "rw-15", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "travel", skillTag: "reading", explanation: "Children pay five pounds.", levelTag: "movers",
      acceptedAnswers: { 0: ["5", "five"] },
    }),
    gap("Complete the message.", "Pack a [0] for Thursday evening.", "raincoat", {
      questionRef: "rw-16", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "weather", skillTag: "reading", explanation: "Light rain — pack a raincoat.", levelTag: "movers",
    }),
  ],
});

// ─── Movers Practice Test 3 — Science Club ───────────────────────────────────

const MOVERS_T3 = buildManifest({
  levelSlug: "movers",
  testNumber: 3,
  title: "Movers Practice Test 3",
  description: "Cambridge YLE Movers practice mock — science club, environment, and inventions themes.",
  timeLimitMinutes: 40,
  grammarPatterns: [
    "present perfect (intro)",
    "adverbs of manner",
    "because/so",
    "countable/uncountable",
    "imperatives",
  ],
  subskills: [
    "science vocabulary",
    "reading dialogues",
    "story inference",
    "message field completion",
    "listening gap fill",
  ],
  coverageNotes: "M1.3 Movers T3 — science and environment; mixed difficulty.",
  sections: moversSections(listenRefs(10), rwRefs(16)),
  parts: [
    moversListeningPart(
      "After-school science club",
      "Every Thursday, the science club meets in Room 12. This week they built volcanoes with baking soda and vinegar. The mixture bubbled over the cups. Ms Patel showed them how to grow crystals in jars. The students wrote their results in notebooks."
    ),
    ...moversRwParts(
      [
        { title: "Recycling bin", text: "Boy: Where does this plastic bottle go?\nGirl: In the blue recycling bin.\nBoy: And the banana skin?\nGirl: That goes in the green compost bin." },
        { title: "Robot project", text: "Teacher: Did your robot move?\nStudent: Yes! It rolled across the table.\nTeacher: Excellent. What powered it?\nStudent: Two small batteries." },
        { title: "Planetarium visit", text: "Guide: This star is called Polaris.\nChild: Is it very far away?\nGuide: Yes — much farther than the Sun.\nChild: Wow!" },
        { title: "Garden club", text: "Leader: We need to water the tomatoes.\nVolunteer: I'll get the watering can.\nLeader: Thanks. Don't forget the sunflowers too.\nVolunteer: OK!" },
      ],
      {
        title: "The windy day experiment",
        text: "The class wanted to test paper planes. They made three different shapes. On a windy day they flew them in the playground. The wide wings flew the farthest. The students measured the distance with a tape measure. They drew a chart of the results.",
      },
      [
        { title: "Club timetable", text: "Science Club — Thursdays 3:30 pm\nBring: apron, notebook, pencil\nNext topic: magnets and springs" },
        { title: "Eco pledge", text: "Our class pledge:\nWe will turn off lights.\nWe will walk to school on Fridays.\nWe will use both sides of paper." },
        { title: "Competition flyer", text: "Young Inventors Contest!\nDesign a helpful gadget.\nDeadline: 20 November\nPrizes for the top three ideas." },
        { title: "Lab safety", text: "Safety rules:\nAlways wear goggles in the lab.\nNever taste chemicals.\nTell the teacher if something spills." },
      ]
    ),
  ],
  questions: [
    ...gapItems([
      { template: "The science club meets in Room [0].", answer: "12", topic: "school", difficulty: "easy", explanation: "Room 12.", acceptedAnswers: { 0: ["12", "twelve"] } },
      { template: "They built volcanoes with baking soda and [0].", answer: "vinegar", topic: "science", difficulty: "medium", explanation: "Baking soda and vinegar." },
      { template: "The mixture [0] over the cups.", answer: "bubbled", topic: "science", difficulty: "medium", explanation: "It bubbled over." },
      { template: "They learned to grow [0] in jars.", answer: "crystals", topic: "science", difficulty: "hard", explanation: "Grow crystals." },
      { template: "Plastic bottles go in the blue [0] bin.", answer: "recycling", topic: "environment", difficulty: "easy", explanation: "Blue recycling bin." },
      { template: "Banana skins go in the green [0] bin.", answer: "compost", topic: "environment", difficulty: "medium", explanation: "Green compost bin." },
      { template: "The robot was powered by two small [0].", answer: "batteries", topic: "technology", difficulty: "easy", explanation: "Two batteries.", acceptedAnswers: { 0: ["batteries", "battery"] } },
      { template: "Polaris is much farther than the [0].", answer: "Sun", topic: "space", difficulty: "hard", explanation: "Farther than the Sun.", acceptedAnswers: { 0: ["Sun", "sun"] } },
      { template: "Don't forget the [0] too.", answer: "sunflowers", topic: "garden", difficulty: "easy", explanation: "Water the sunflowers." },
      { template: "They measured the distance with a tape [0].", answer: "measure", topic: "science", difficulty: "medium", explanation: "Tape measure." },
    ], "movers"),
    match("Match each definition to the correct word.", [["A room where scientists work", "laboratory"], ["To make something new from parts", "build"], ["Liquid that reacts with baking soda", "vinegar"]], {
      questionRef: "rw-01", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "science", skillTag: "reading", explanation: "Laboratory, build, vinegar.", levelTag: "movers",
    }),
    match("Match each definition to the correct word.", [["To put used materials in a special bin", "recycle"], ["Power for a small robot", "battery"], ["Yellow flowers that grow tall", "sunflower"]], {
      questionRef: "rw-02", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "environment", skillTag: "reading", explanation: "Recycle, battery, sunflower.", levelTag: "movers",
    }),
    match("Match each definition to the correct word.", [["A bright star used for navigation", "Polaris"], ["A tool for measuring length", "tape measure"], ["A paper aircraft you throw", "paper plane"]], {
      questionRef: "rw-03", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "science", skillTag: "reading", explanation: "Polaris, tape measure, paper plane.", levelTag: "movers",
    }),
    match("Match each definition to the correct word.", [["To protect your eyes in the lab", "goggles"], ["A promise to help the planet", "pledge"], ["The last day to enter a contest", "deadline"]], {
      questionRef: "rw-04", partSlug: "rw-part-1-definitions", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "school", skillTag: "reading", explanation: "Goggles, pledge, deadline.", levelTag: "movers",
    }),
    mcq("Where does the plastic bottle go?", "the blue recycling bin", ["the green compost bin", "the rubbish bin"], {
      questionRef: "rw-05", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "environment", skillTag: "reading", explanation: "Blue recycling bin.", levelTag: "movers",
    }),
    mcq("What powered the robot?", "two small batteries", ["solar panels", "a windmill"], {
      questionRef: "rw-06", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "technology", skillTag: "reading", explanation: "Two batteries.", levelTag: "movers",
    }),
    mcq("What did the guide name?", "Polaris", ["the Moon", "Mars"], {
      questionRef: "rw-07", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "space", skillTag: "reading", explanation: "The star Polaris.", levelTag: "movers",
    }),
    mcq("What must they water?", "tomatoes and sunflowers", ["roses only", "the grass"], {
      questionRef: "rw-08", partSlug: "rw-part-2-conversations", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "garden", skillTag: "reading", explanation: "Tomatoes and sunflowers.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "The wide wings flew the [0].", "farthest", {
      questionRef: "rw-09", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "science", skillTag: "reading", explanation: "Flew the farthest.", levelTag: "movers",
      acceptedAnswers: { 0: ["farthest", "furthest"] },
    }),
    gap("Complete the sentence.", "They flew the planes on a [0] day.", "windy", {
      questionRef: "rw-10", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "weather", skillTag: "reading", explanation: "A windy day.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "They made three different [0].", "shapes", {
      questionRef: "rw-11", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "science", skillTag: "reading", explanation: "Three shapes.", levelTag: "movers",
    }),
    gap("Complete the sentence.", "They drew a [0] of the results.", "chart", {
      questionRef: "rw-12", partSlug: "rw-part-3-story", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "science", skillTag: "reading", explanation: "Drew a chart.", levelTag: "movers",
    }),
    gap("Complete the message.", "Next topic: magnets and [0].", "springs", {
      questionRef: "rw-13", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "science", skillTag: "reading", explanation: "Magnets and springs.", levelTag: "movers",
    }),
    gap("Complete the message.", "We will walk to school on [0].", "Fridays", {
      questionRef: "rw-14", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "environment", skillTag: "reading", explanation: "Walk on Fridays.", levelTag: "movers",
    }),
    gap("Complete the message.", "Deadline: 20 [0]", "November", {
      questionRef: "rw-15", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "competition", skillTag: "reading", explanation: "20 November.", levelTag: "movers",
      acceptedAnswers: { 0: ["November", "november"] },
    }),
    gap("Complete the message.", "Never taste [0].", "chemicals", {
      questionRef: "rw-16", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "safety", skillTag: "reading", explanation: "Never taste chemicals.", levelTag: "movers",
    }),
  ],
});

// ─── Flyers helpers ──────────────────────────────────────────────────────────

function flyersListeningPart(scriptTitle, scriptText) {
  return {
    partSlug: "listening-part-2-fill",
    sectionSlug: "listening",
    partNumber: 1,
    title: "Listening Part 2 — Fill in blanks",
    instructions: "Read the listening script. Write the missing words.",
    contextType: "listening",
    groupKey: "listening-part-2",
    passage: { title: scriptTitle, text: scriptText },
    note: "Text-simulated listening — no audio.",
  };
}

function flyersRwParts(dialoguePassages, storyPassage, messagePassages) {
  const headingPart = {
    partSlug: "rw-part-1-headings",
    sectionSlug: "reading-writing",
    partNumber: 1,
    title: "Reading Part 1 — Match headings",
    instructions: "Match each heading to the correct paragraph.",
    contextType: "reading",
    groupKey: "rw-headings",
    passage: {
      title: "Community newsletter excerpts",
      text: "Paragraph A: Our local library now opens on Sundays.\nParagraph B: The new cycle path is safer for families.\nParagraph C: Students planted trees behind the sports hall.\nParagraph D: The drama club will perform a play in June.\nParagraph E: The café offers free fruit for children after school.",
    },
  };
  const storyPart = {
    partSlug: "rw-part-3-story-gaps",
    sectionSlug: "reading-writing",
    partNumber: 3,
    title: "Reading Part 3 — Story gaps",
    instructions: "Read the story and complete the gaps.",
    contextType: "reading",
    groupKey: "rw-story",
    passage: storyPassage,
  };
  const dialogueParts = dialoguePassages.map((p, i) => ({
    partSlug: "rw-part-2-dialogues",
    sectionSlug: "reading-writing",
    partNumber: 2,
    title: "Reading Part 2 — Dialogues",
    instructions: "Read the dialogue and choose the best answer.",
    contextType: "dialogue",
    questionRefs: [`rw-${String(6 + i).padStart(2, "0")}`],
    groupKey: `rw-dlg-${i + 1}`,
    passage: p,
  }));
  const messageParts = messagePassages.map((p, i) => ({
    partSlug: "rw-part-4-messages",
    sectionSlug: "reading-writing",
    partNumber: 4,
    title: "Reading Part 4 — Messages",
    instructions: "Read the message and complete each gap.",
    contextType: "reading",
    questionRefs: [`rw-${String(17 + i).padStart(2, "0")}`],
    groupKey: `rw-email-${i + 1}`,
    passage: p,
  }));
  return [headingPart, ...dialogueParts, storyPart, ...messageParts];
}

// ─── Flyers Practice Test 1 — Adventure Challenge ──────────────────────────

const FLYERS_T1 = buildManifest({
  levelSlug: "flyers",
  testNumber: 1,
  title: "Flyers Practice Test 1",
  description: "Cambridge YLE Flyers practice mock — adventure race, community projects, and teamwork.",
  timeLimitMinutes: 50,
  grammarPatterns: [
    "past continuous",
    "relative clauses (who/which)",
    "modal verbs (should/could)",
    "linking words (although, however)",
    "comparative and superlative",
  ],
  subskills: [
    "listening for detail in longer scripts",
    "matching headings to paragraphs",
    "dialogue inference",
    "story gap completion",
    "email and notice completion",
  ],
  coverageNotes: "M1.3 Flyers T1 — medium-heavy difficulty; adventure and community themes.",
  sections: flyersSections(listenRefs(10), rwRefs(22)),
  parts: [
    flyersListeningPart(
      "The Green Valley adventure race",
      "Last spring, teams from four schools joined the Green Valley adventure race. They canoed across the river, then cycled along muddy tracks. One team got lost because their map blew away, but a volunteer helped them. The winning team finished in two hours and donated their prize money to plant trees."
    ),
    ...flyersRwParts(
      [
        { title: "Team meeting", text: "Coach: We need a plan for the obstacle course.\nCaptain: I'll check the rope bridge first.\nCoach: Good. Remember, safety comes before speed.\nCaptain: Understood!" },
        { title: "At the river", text: "Guide: Put on your life jackets now.\nRacer: Are the canoes stable?\nGuide: Yes, but paddle together in rhythm.\nRacer: OK, we'll try!" },
        { title: "Lost map", text: "Volunteer: You look worried. Can I help?\nStudent: Our map flew into the bushes!\nVolunteer: I have a spare copy. Follow me.\nStudent: Thank you so much!" },
        { title: "Prize ceremony", text: "Mayor: Congratulations to Riverside School!\nCaptain: We practised every week after class.\nMayor: Your teamwork was impressive.\nCaptain: We'll donate the money to the tree project." },
        { title: "Interview", text: "Reporter: What was the hardest part?\nRacer: The steep hill after the cycle route.\nReporter: And the best moment?\nRacer: Crossing the finish line together!" },
      ],
      {
        title: "The rope bridge",
        text: "Before the race began, the organisers inspected an old rope bridge. Although it looked fragile, engineers had reinforced it overnight. The first team crossed carefully, holding the side ropes. When everyone reached the other side, they cheered with relief. The bridge became the most talked-about part of the course.",
      },
      [
        { title: "Volunteer signup", text: "Green Valley Race — volunteers needed!\nRoles: marshals, first aid, water stations\nDate: 12 April\nContact: race@greenvalley.org" },
        { title: "Team email", text: "Hi team,\nPractice starts at 4 pm on Monday.\nBring trainers, water bottle, and rain jacket.\nSee you!\nCoach Rivera" },
        { title: "Sponsor letter", text: "Dear organisers,\nWe are pleased to sponsor the junior prizes.\nPlease display our logo on the banners.\nBest wishes,\nHilltop Sports Shop" },
        { title: "Safety notice", text: "Safety reminder:\nHelmets compulsory on the cycle section.\nNo racing on the river bank.\nReport injuries to the first-aid tent immediately." },
        { title: "Tree project update", text: "Tree Project Update:\nThanks to the winners, we bought 50 saplings.\nPlanting day: 5 May at Riverside Park.\nVolunteers welcome!" },
        { title: "Results sheet", text: "Results — Green Valley Adventure Race\n1st Riverside School — 2:04:18\n2nd Oakwood School — 2:11:05\n3rd Lakeside School — 2:15:44" },
      ]
    ),
  ],
  questions: [
    ...gapItems([
      { template: "Teams from four [0] joined the race.", answer: "schools", topic: "adventure", difficulty: "medium", explanation: "Four schools." },
      { template: "They canoed across the [0].", answer: "river", topic: "adventure", difficulty: "easy", explanation: "Canoed across the river." },
      { template: "One team got lost because their map [0] away.", answer: "blew", topic: "adventure", difficulty: "hard", explanation: "The map blew away." },
      { template: "A [0] helped the lost team.", answer: "volunteer", topic: "community", difficulty: "medium", explanation: "A volunteer helped." },
      { template: "The winning team finished in two [0].", answer: "hours", topic: "adventure", difficulty: "easy", explanation: "Two hours.", acceptedAnswers: { 0: ["hours", "hour"] } },
      { template: "They donated prize money to plant [0].", answer: "trees", topic: "environment", difficulty: "medium", explanation: "Plant trees." },
      { template: "Put on your life [0] before canoeing.", answer: "jackets", topic: "safety", difficulty: "medium", explanation: "Life jackets.", acceptedAnswers: { 0: ["jackets", "jacket"] } },
      { template: "Paddle together in [0].", answer: "rhythm", topic: "teamwork", difficulty: "hard", explanation: "Paddle in rhythm." },
      { template: "The volunteer had a spare [0].", answer: "copy", topic: "adventure", difficulty: "medium", explanation: "A spare copy of the map." },
      { template: "The hardest part was the steep [0].", answer: "hill", topic: "adventure", difficulty: "easy", explanation: "The steep hill." },
    ], "flyers"),
    match("Which heading matches each paragraph?", [["Paragraph A", "Library Sunday opening"], ["Paragraph B", "Safer cycling route"], ["Paragraph C", "Tree planting by students"]], {
      questionRef: "rw-01", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "A=library, B=cycle path, C=trees.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph D", "Drama club performance"], ["Paragraph E", "Free fruit after school"], ["Paragraph A", "Library Sunday opening"]], {
      questionRef: "rw-02", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "D=drama, E=café fruit, A=library.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph B", "Safer cycling route"], ["Paragraph C", "Tree planting by students"], ["Paragraph D", "Drama club performance"]], {
      questionRef: "rw-03", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "community", skillTag: "reading", explanation: "B=cycle path, C=trees, D=drama.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph E", "Free fruit after school"], ["Paragraph C", "Tree planting by students"], ["Paragraph B", "Safer cycling route"]], {
      questionRef: "rw-04", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "E=café, C=trees, B=cycle path.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph A", "Library Sunday opening"], ["Paragraph D", "Drama club performance"], ["Paragraph E", "Free fruit after school"]], {
      questionRef: "rw-05", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "community", skillTag: "reading", explanation: "A=library, D=drama, E=café.", levelTag: "flyers",
    }),
    mcq("What will the captain check first?", "the rope bridge", ["the river boats", "the prize table"], {
      questionRef: "rw-06", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "adventure", skillTag: "reading", explanation: "Check the rope bridge first.", levelTag: "flyers",
    }),
    mcq("What must racers do when paddling?", "paddle together in rhythm", ["race alone quickly", "stand up in the canoe"], {
      questionRef: "rw-07", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "teamwork", skillTag: "reading", explanation: "Paddle together in rhythm.", levelTag: "flyers",
    }),
    mcq("Why was the student worried?", "their map flew into the bushes", ["they forgot their helmet", "it started to snow"], {
      questionRef: "rw-08", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "adventure", skillTag: "reading", explanation: "The map flew away.", levelTag: "flyers",
    }),
    mcq("What will the winning team do with the money?", "donate it to the tree project", ["buy new bikes", "go on holiday"], {
      questionRef: "rw-09", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "Donate to the tree project.", levelTag: "flyers",
    }),
    mcq("What was the best moment for the racer?", "crossing the finish line together", ["eating lunch", "buying a map"], {
      questionRef: "rw-10", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "adventure", skillTag: "reading", explanation: "Crossing the finish line together.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "Engineers had [0] the bridge overnight.", "reinforced", {
      questionRef: "rw-11", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "adventure", skillTag: "reading", explanation: "Engineers reinforced it.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "The first team crossed [0].", "carefully", {
      questionRef: "rw-12", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "safety", skillTag: "reading", explanation: "Crossed carefully.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "They held the side [0].", "ropes", {
      questionRef: "rw-13", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "adventure", skillTag: "reading", explanation: "Held the side ropes.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "They cheered with [0].", "relief", {
      questionRef: "rw-14", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "feelings", skillTag: "reading", explanation: "Cheered with relief.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "The bridge became the most talked-about [0] of the course.", "part", {
      questionRef: "rw-15", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "adventure", skillTag: "reading", explanation: "Most talked-about part.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "Although it looked fragile, it was [0].", "safe", {
      questionRef: "rw-16", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "safety", skillTag: "reading", explanation: "Engineers made it safe.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Roles: marshals, first aid, water [0]", "stations", {
      questionRef: "rw-17", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "Water stations.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Bring trainers, water bottle, and rain [0].", "jacket", {
      questionRef: "rw-18", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "adventure", skillTag: "reading", explanation: "Rain jacket.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Please display our [0] on the banners.", "logo", {
      questionRef: "rw-19", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "sponsorship", skillTag: "reading", explanation: "Display our logo.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Helmets [0] on the cycle section.", "compulsory", {
      questionRef: "rw-20", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "safety", skillTag: "reading", explanation: "Helmets compulsory.", levelTag: "flyers",
    }),
    gap("Complete the message.", "We bought 50 [0].", "saplings", {
      questionRef: "rw-21", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "environment", skillTag: "reading", explanation: "Fifty saplings.", levelTag: "flyers",
    }),
    gap("Complete the message.", "1st Riverside School — [0]", "2:04:18", {
      questionRef: "rw-22", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "adventure", skillTag: "reading", explanation: "Winning time.", levelTag: "flyers",
    }),
  ],
});

// ─── Flyers Practice Test 2 — Technology Fair ──────────────────────────────

const FLYERS_T2 = buildManifest({
  levelSlug: "flyers",
  testNumber: 2,
  title: "Flyers Practice Test 2",
  description: "Cambridge YLE Flyers practice mock — technology fair, coding, and digital safety.",
  timeLimitMinutes: 50,
  grammarPatterns: [
    "present perfect",
    "passive voice (simple)",
    "conditional type 1",
    "reported speech (intro)",
    "phrasal verbs",
  ],
  subskills: [
    "technology vocabulary",
    "reading longer dialogues",
    "inferring purpose",
    "completing formal notices",
    "listening gap fill",
  ],
  coverageNotes: "M1.3 Flyers T2 — technology fair theme; medium-heavy difficulty.",
  sections: flyersSections(listenRefs(10), rwRefs(22)),
  parts: [
    flyersListeningPart(
      "Riverside Technology Fair",
      "The Riverside Technology Fair opened on Friday in the sports hall. Students demonstrated robots, apps, and 3D-printed models. A judge praised a wheelchair ramp designed by Year 6. Visitors voted online for the most helpful invention. The organisers promised to run the fair again next year because attendance broke records."
    ),
    ...flyersRwParts(
      [
        { title: "Coding workshop", text: "Tutor: Today we'll debug this game.\nStudent: I think the problem is in line ten.\nTutor: Good spot. Change the variable and test again.\nStudent: It works now!" },
        { title: "3D printer", text: "Engineer: The printer needs fresh filament.\nPupil: Which colour should we use?\nEngineer: Blue matches our school logo.\nPupil: I'll load it carefully." },
        { title: "Online safety talk", text: "Officer: Never share passwords with friends.\nClass: Why not?\nOfficer: Someone could access your accounts.\nClass: We'll remember that." },
        { title: "Judges' discussion", text: "Judge A: The ramp project solves a real problem.\nJudge B: I agree — it's practical and well built.\nJudge A: Let's mark it highly for usefulness.\nJudge B: Definitely." },
        { title: "Visitor feedback", text: "Visitor: Which invention helps elderly neighbours?\nStudent: The grocery-delivery app tracks orders.\nVisitor: Clever! How did you test it?\nStudent: We asked three families to try it." },
      ],
      {
        title: "The drone display",
        text: "During the afternoon, a drone club performed a short display. Although the hall was crowded, the pilots kept the drones above head height. One drone carried a banner that read 'STEM for Everyone'. When the batteries ran low, the pilots landed smoothly on marked mats. The audience applauded for several minutes.",
      },
      [
        { title: "Fair timetable", text: "Technology Fair — Friday schedule\n10:00 Opening speech\n11:30 Robot demos\n14:00 Drone display\n16:00 Prize announcements" },
        { title: "App instructions", text: "Grocery Helper App:\n1. Create an account\n2. Add items to your list\n3. Choose a delivery time\n4. Pay securely online" },
        { title: "Workshop signup", text: "Coding workshop — limited places!\nLevel: beginners\nBring: laptop and charger\nRegister at desk 3 before noon." },
        { title: "Safety poster", text: "Digital Safety Tips:\nUse strong passwords.\nAsk an adult before downloading apps.\nReport strange messages immediately." },
        { title: "Sponsor email", text: "We enjoyed sponsoring the 3D-printing zone.\nPlease send photos for our website.\nRegards,\nTechCity Ltd" },
        { title: "Results blog", text: "Fair results published!\nMost votes: Grocery Helper App\nRunner-up: Smart plant waterer\nThank you to all participants." },
      ]
    ),
  ],
  questions: [
    ...gapItems([
      { template: "The fair opened in the sports [0].", answer: "hall", topic: "technology", difficulty: "easy", explanation: "Sports hall." },
      { template: "Students demonstrated robots, apps, and 3D-printed [0].", answer: "models", topic: "technology", difficulty: "medium", explanation: "3D-printed models." },
      { template: "A judge praised a wheelchair [0] designed by Year 6.", answer: "ramp", topic: "invention", difficulty: "medium", explanation: "Wheelchair ramp." },
      { template: "Visitors voted [0] for the most helpful invention.", answer: "online", topic: "technology", difficulty: "easy", explanation: "Voted online." },
      { template: "Attendance broke [0].", answer: "records", topic: "events", difficulty: "hard", explanation: "Broke records." },
      { template: "Change the [0] and test again.", answer: "variable", topic: "coding", difficulty: "hard", explanation: "Change the variable." },
      { template: "The printer needs fresh [0].", answer: "filament", topic: "technology", difficulty: "hard", explanation: "Fresh filament." },
      { template: "Never share [0] with friends.", answer: "passwords", topic: "safety", difficulty: "medium", explanation: "Never share passwords." },
      { template: "The ramp project is practical and well [0].", answer: "built", topic: "invention", difficulty: "medium", explanation: "Well built." },
      { template: "They asked three [0] to try the app.", answer: "families", topic: "technology", difficulty: "easy", explanation: "Three families tested it." },
    ], "flyers"),
    match("Which heading matches each paragraph?", [["Paragraph A", "Library Sunday opening"], ["Paragraph B", "Safer cycling route"], ["Paragraph D", "Drama club performance"]], {
      questionRef: "rw-01", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "Shared newsletter paragraphs.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph C", "Tree planting by students"], ["Paragraph E", "Free fruit after school"], ["Paragraph B", "Safer cycling route"]], {
      questionRef: "rw-02", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "C=trees, E=café, B=cycle path.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph D", "Drama club performance"], ["Paragraph A", "Library Sunday opening"], ["Paragraph C", "Tree planting by students"]], {
      questionRef: "rw-03", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "community", skillTag: "reading", explanation: "D=drama, A=library, C=trees.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph E", "Free fruit after school"], ["Paragraph A", "Library Sunday opening"], ["Paragraph D", "Drama club performance"]], {
      questionRef: "rw-04", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "E=café, A=library, D=drama.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph B", "Safer cycling route"], ["Paragraph E", "Free fruit after school"], ["Paragraph C", "Tree planting by students"]], {
      questionRef: "rw-05", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "community", skillTag: "reading", explanation: "B=cycle path, E=café, C=trees.", levelTag: "flyers",
    }),
    mcq("Where was the problem in the code?", "line ten", ["line two", "line fifty"], {
      questionRef: "rw-06", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "coding", skillTag: "reading", explanation: "Problem in line ten.", levelTag: "flyers",
    }),
    mcq("Which colour filament will they use?", "blue", ["red", "black"], {
      questionRef: "rw-07", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "technology", skillTag: "reading", explanation: "Blue matches the logo.", levelTag: "flyers",
    }),
    mcq("Why should you not share passwords?", "someone could access your accounts", ["games will delete themselves", "phones will stop working"], {
      questionRef: "rw-08", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "safety", skillTag: "reading", explanation: "Accounts could be accessed.", levelTag: "flyers",
    }),
    mcq("Why did the judges like the ramp?", "it solves a real problem", ["it is the smallest project", "it uses gold paint"], {
      questionRef: "rw-09", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "invention", skillTag: "reading", explanation: "Practical and useful.", levelTag: "flyers",
    }),
    mcq("How did they test the grocery app?", "three families tried it", ["they read a book", "they watched a film"], {
      questionRef: "rw-10", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "technology", skillTag: "reading", explanation: "Three families tested it.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "The pilots kept the drones above head [0].", "height", {
      questionRef: "rw-11", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "technology", skillTag: "reading", explanation: "Above head height.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "One drone carried a [0].", "banner", {
      questionRef: "rw-12", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "events", skillTag: "reading", explanation: "Carried a banner.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "The banner read 'STEM for [0]'.", "Everyone", {
      questionRef: "rw-13", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "education", skillTag: "reading", explanation: "STEM for Everyone.", levelTag: "flyers",
      acceptedAnswers: { 0: ["Everyone", "everyone"] },
    }),
    gap("Complete the sentence.", "When the batteries ran [0], they landed.", "low", {
      questionRef: "rw-14", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "technology", skillTag: "reading", explanation: "Batteries ran low.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "They landed on marked [0].", "mats", {
      questionRef: "rw-15", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "safety", skillTag: "reading", explanation: "Marked mats.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "The audience applauded for several [0].", "minutes", {
      questionRef: "rw-16", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "events", skillTag: "reading", explanation: "Applauded for several minutes.", levelTag: "flyers",
    }),
    gap("Complete the message.", "14:00 Drone [0]", "display", {
      questionRef: "rw-17", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "events", skillTag: "reading", explanation: "Drone display at 14:00.", levelTag: "flyers",
    }),
    gap("Complete the message.", "4. Pay securely [0]", "online", {
      questionRef: "rw-18", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "technology", skillTag: "reading", explanation: "Pay securely online.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Register at desk 3 before [0].", "noon", {
      questionRef: "rw-19", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "workshop", skillTag: "reading", explanation: "Before noon.", levelTag: "flyers",
      acceptedAnswers: { 0: ["noon", "12"] },
    }),
    gap("Complete the message.", "Report strange [0] immediately.", "messages", {
      questionRef: "rw-20", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "safety", skillTag: "reading", explanation: "Report strange messages.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Most votes: Grocery Helper [0]", "App", {
      questionRef: "rw-21", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "technology", skillTag: "reading", explanation: "Grocery Helper App won.", levelTag: "flyers",
      acceptedAnswers: { 0: ["App", "app"] },
    }),
    gap("Complete the message.", "Runner-up: Smart plant [0]", "waterer", {
      questionRef: "rw-22", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "invention", skillTag: "reading", explanation: "Smart plant waterer.", levelTag: "flyers",
    }),
  ],
});

// ─── Flyers Practice Test 3 — Global Cultures ────────────────────────────────

const FLYERS_T3 = buildManifest({
  levelSlug: "flyers",
  testNumber: 3,
  title: "Flyers Practice Test 3",
  description: "Cambridge YLE Flyers practice mock — world cultures, festivals, and international school exchange.",
  timeLimitMinutes: 50,
  grammarPatterns: [
    "past perfect (intro)",
    "used to",
    "question tags",
    "too/enough",
    "discourse markers (meanwhile, finally)",
  ],
  subskills: [
    "cultural vocabulary",
    "reading multi-paragraph texts",
    "dialogue comprehension",
    "story cohesion",
    "formal email completion",
  ],
  coverageNotes: "M1.3 Flyers T3 — global cultures theme; medium-heavy with challenging items.",
  sections: flyersSections(listenRefs(10), rwRefs(22)),
  parts: [
    flyersListeningPart(
      "International Culture Week",
      "Oakwood School celebrated International Culture Week in March. Students wore traditional costumes and cooked dishes from different countries. A guest speaker from Brazil taught a samba rhythm on drums. On Thursday, pen pals from France joined a video call. Teachers said the week helped everyone respect diverse traditions."
    ),
    ...flyersRwParts(
      [
        { title: "Festival planning", text: "Organiser: We need decorations for Diwali.\nStudent: I'll make paper lanterns.\nOrganiser: Wonderful. Can someone research the story of Rama?\nStudent: I'll prepare a short poster." },
        { title: "Exchange student", text: "Host mum: Did you sleep well, Amelie?\nAmelie: Yes, thank you. The bed was cosy.\nHost mum: Today we'll visit the market.\nAmelie: I'd love to try local cheese!" },
        { title: "Museum guide", text: "Guide: This mask comes from West Africa.\nVisitor: What materials is it made from?\nGuide: Wood, beads, and natural dyes.\nVisitor: The patterns are amazing." },
        { title: "Language club", text: "Teacher: Let's practise greetings in Japanese.\nPupil: Konnichiwa — is that 'hello'?\nTeacher: Yes, in the afternoon. Remember bowing politely.\nPupil: I'll practise at home." },
        { title: "Cooking demo", text: "Chef: Mexican tacos use soft tortillas.\nAssistant: Should we add spicy salsa?\nChef: Just a little — some guests prefer mild food.\nAssistant: Good point!" },
      ],
      {
        title: "The lantern parade",
        text: "On the final evening, families joined a lantern parade through the town square. Although the wind was strong, the children protected their candles carefully. Musicians played drums while dancers moved in colourful skirts. Meanwhile, volunteers collected donations for a refugee charity. Finally, the mayor thanked everyone for celebrating unity.",
      },
      [
        { title: "Culture week schedule", text: "International Culture Week\nMon: costume day\nTue: food stalls\nWed: guest speakers\nThu: video call with France\nFri: lantern parade" },
        { title: "Pen pal letter", text: "Dear Amelie,\nWe enjoyed the video call!\nPlease send your recipe for crepes.\nOur class wants to cook them next Friday.\nBest wishes, Class 5B" },
        { title: "Charity notice", text: "Lantern Parade donations:\nAll money supports refugee children's books.\nBring coins in labelled envelopes.\nThank you for your kindness." },
        { title: "Workshop flyer", text: "Samba Drumming Workshop\nOpen to ages 9–12\nLimited drums — arrive early!\nSign up with Mr Santos." },
        { title: "Host family rules", text: "Exchange visit rules:\nRespect quiet hours after 9 pm.\nAsk before using the kitchen.\nWrite a thank-you note before leaving." },
        { title: "Feedback form", text: "Culture Week feedback:\nFavourite activity: food stalls (42 votes)\nMost learned: Japanese greetings\nSuggestion: invite more guest chefs" },
      ]
    ),
  ],
  questions: [
    ...gapItems([
      { template: "Students wore traditional [0].", answer: "costumes", topic: "culture", difficulty: "medium", explanation: "Traditional costumes." },
      { template: "They cooked dishes from different [0].", answer: "countries", topic: "culture", difficulty: "easy", explanation: "Different countries." },
      { template: "A guest speaker from Brazil taught a samba [0].", answer: "rhythm", topic: "music", difficulty: "hard", explanation: "Samba rhythm." },
      { template: "Pen pals from France joined a video [0].", answer: "call", topic: "exchange", difficulty: "easy", explanation: "Video call." },
      { template: "The week helped everyone respect diverse [0].", answer: "traditions", topic: "culture", difficulty: "medium", explanation: "Diverse traditions." },
      { template: "I'll make paper [0] for Diwali.", answer: "lanterns", topic: "festival", difficulty: "medium", explanation: "Paper lanterns." },
      { template: "Amelie wants to try local [0].", answer: "cheese", topic: "food", difficulty: "easy", explanation: "Local cheese." },
      { template: "The mask is made from wood, beads, and natural [0].", answer: "dyes", topic: "art", difficulty: "hard", explanation: "Natural dyes." },
      { template: "Konnichiwa is a greeting in the [0].", answer: "afternoon", topic: "language", difficulty: "hard", explanation: "Afternoon greeting in Japanese." },
      { template: "Mexican tacos use soft [0].", answer: "tortillas", topic: "food", difficulty: "medium", explanation: "Soft tortillas." },
    ], "flyers"),
    match("Which heading matches each paragraph?", [["Paragraph C", "Tree planting by students"], ["Paragraph A", "Library Sunday opening"], ["Paragraph E", "Free fruit after school"]], {
      questionRef: "rw-01", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "C=trees, A=library, E=café.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph B", "Safer cycling route"], ["Paragraph D", "Drama club performance"], ["Paragraph A", "Library Sunday opening"]], {
      questionRef: "rw-02", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "B=cycle path, D=drama, A=library.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph E", "Free fruit after school"], ["Paragraph C", "Tree planting by students"], ["Paragraph D", "Drama club performance"]], {
      questionRef: "rw-03", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "community", skillTag: "reading", explanation: "E=café, C=trees, D=drama.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph A", "Library Sunday opening"], ["Paragraph B", "Safer cycling route"], ["Paragraph E", "Free fruit after school"]], {
      questionRef: "rw-04", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "A=library, B=cycle path, E=café.", levelTag: "flyers",
    }),
    match("Which heading matches each paragraph?", [["Paragraph D", "Drama club performance"], ["Paragraph C", "Tree planting by students"], ["Paragraph B", "Safer cycling route"]], {
      questionRef: "rw-05", partSlug: "rw-part-1-headings", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "community", skillTag: "reading", explanation: "D=drama, C=trees, B=cycle path.", levelTag: "flyers",
    }),
    mcq("What will a student prepare for Diwali?", "a short poster about Rama", ["a bicycle map", "a swimming timetable"], {
      questionRef: "rw-06", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "festival", skillTag: "reading", explanation: "Poster about Rama's story.", levelTag: "flyers",
    }),
    mcq("What does Amelie want to try?", "local cheese", ["spicy salsa", "samba drums"], {
      questionRef: "rw-07", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "food", skillTag: "reading", explanation: "Local cheese at the market.", levelTag: "flyers",
    }),
    mcq("What is the African mask made from?", "wood, beads, and natural dyes", ["plastic and metal", "paper and glue only"], {
      questionRef: "rw-08", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "art", skillTag: "reading", explanation: "Wood, beads, natural dyes.", levelTag: "flyers",
    }),
    mcq("What should pupils remember in Japanese culture?", "bowing politely", ["shouting loudly", "running indoors"], {
      questionRef: "rw-09", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "language", skillTag: "reading", explanation: "Remember bowing politely.", levelTag: "flyers",
    }),
    mcq("How much spicy salsa should they add?", "just a little", ["a large bowl", "none at all"], {
      questionRef: "rw-10", partSlug: "rw-part-2-dialogues", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "food", skillTag: "reading", explanation: "Just a little salsa.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "The children protected their candles [0].", "carefully", {
      questionRef: "rw-11", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "festival", skillTag: "reading", explanation: "Protected candles carefully.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "Musicians played drums while dancers moved in colourful [0].", "skirts", {
      questionRef: "rw-12", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "culture", skillTag: "reading", explanation: "Colourful skirts.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "[0], volunteers collected donations.", "Meanwhile", {
      questionRef: "rw-13", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "writing", skillTag: "reading", explanation: "Meanwhile introduces a parallel action.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "Donations were for a refugee [0].", "charity", {
      questionRef: "rw-14", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "community", skillTag: "reading", explanation: "Refugee charity.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "[0], the mayor thanked everyone.", "Finally", {
      questionRef: "rw-15", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "writing", skillTag: "reading", explanation: "Finally closes the sequence.", levelTag: "flyers",
    }),
    gap("Complete the sentence.", "The mayor thanked everyone for celebrating [0].", "unity", {
      questionRef: "rw-16", partSlug: "rw-part-3-story-gaps", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "culture", skillTag: "reading", explanation: "Celebrating unity.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Thu: video call with [0]", "France", {
      questionRef: "rw-17", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "exchange", skillTag: "reading", explanation: "Video call with France.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Please send your recipe for [0].", "crepes", {
      questionRef: "rw-18", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "food", skillTag: "reading", explanation: "Recipe for crepes.", levelTag: "flyers",
      acceptedAnswers: { 0: ["crepes", "crêpes"] },
    }),
    gap("Complete the message.", "Bring coins in labelled [0].", "envelopes", {
      questionRef: "rw-19", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "charity", skillTag: "reading", explanation: "Labelled envelopes.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Sign up with Mr [0].", "Santos", {
      questionRef: "rw-20", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "easy", topicTag: "music", skillTag: "reading", explanation: "Mr Santos.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Respect quiet hours after 9 [0].", "pm", {
      questionRef: "rw-21", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "medium", topicTag: "exchange", skillTag: "reading", explanation: "After 9 pm.", levelTag: "flyers",
    }),
    gap("Complete the message.", "Favourite activity: food [0] (42 votes)", "stalls", {
      questionRef: "rw-22", partSlug: "rw-part-4-messages", sectionSlug: "reading-writing",
      difficulty: "hard", topicTag: "culture", skillTag: "reading", explanation: "Food stalls were favourite.", levelTag: "flyers",
    }),
  ],
});

export const M1_3_MANIFESTS = [
  STARTERS_T2,
  STARTERS_T3,
  MOVERS_T1,
  MOVERS_T2,
  MOVERS_T3,
  FLYERS_T1,
  FLYERS_T2,
  FLYERS_T3,
];
