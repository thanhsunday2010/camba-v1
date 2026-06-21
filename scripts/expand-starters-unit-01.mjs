#!/usr/bin/env node
/**
 * Expand Starters Unit 1 to 3 lessons per skill × 5 exercises per lesson.
 *
 * Usage: node scripts/expand-starters-unit-01.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { lessonId } from "./lib/content-ids.mjs";
import { validateUnitStructure } from "./lib/validate-unit-structure.mjs";
import {
  TOPIC,
  buildMcq,
  buildMatching,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  buildReadingExercise,
  buildListeningExercise,
  buildWritingCheck,
  buildSpeakingCheck,
  acceptableWord,
  orderingItems,
  orderingOrder,
  exScores,
} from "./lib/starters-exercise-factory.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const INPUT = resolve(ROOT, "data/content/starters/unit-01-family-and-friends.json");
const LEVEL = "starters";
const UNIT_NUMBER = 1;

const SKILL_ORDER = [
  "vocabulary",
  "grammar",
  "reading",
  "listening",
  "writing",
  "speaking",
];

const MAI_PASSAGE = {
  title: "Mai's Family",
  text: "Hello! My name is Mai. I am eight years old. This is my family photo.\n\nMy father is tall. His hair is black. My mother is kind. Her eyes are brown.\n\nI have one brother. His name is Nam. He is a boy. He is six. We have a friend. Her name is Anna. She is a girl in our class.\n\nWe are happy!",
  wordCount: 58,
  imagePrompt:
    "A cheerful family photo: parents, two children, and a friend waving.",
};

const AT_HOME_SCRIPT = {
  title: "At Home",
  setting: "A living room after school",
  speakers: [
    { name: "Examiner", role: "adult" },
    { name: "Minh", role: "boy, 8" },
  ],
  lines: [
    { speaker: "Examiner", text: "Hello, Minh. Who is this?" },
    { speaker: "Minh", text: "This is my mother." },
    { speaker: "Examiner", text: "And who is the boy?" },
    { speaker: "Minh", text: "He is my brother. His name is Duc." },
    { speaker: "Examiner", text: "Is the girl your sister?" },
    { speaker: "Minh", text: "No. She is my friend. Her name is Lily." },
  ],
  audioNotes: "Clear, slow delivery with short pauses. Total duration approx. 35 seconds.",
};

const AT_SCHOOL_SCRIPT = {
  title: "At School",
  setting: "School playground",
  speakers: [
    { name: "Teacher", role: "adult" },
    { name: "Hoa", role: "girl, 7" },
  ],
  lines: [
    { speaker: "Teacher", text: "Hello, Hoa. Who is the girl with you?" },
    { speaker: "Hoa", text: "She is my sister. Her name is Lan." },
    { speaker: "Teacher", text: "And who is the man?" },
    { speaker: "Hoa", text: "He is my father." },
    { speaker: "Teacher", text: "Is the boy your brother?" },
    { speaker: "Hoa", text: "Yes. He is my brother. He is a boy." },
  ],
  audioNotes: "Clear, slow delivery. Approx. 30 seconds.",
};

function cloneAsReview(checkExercise) {
  const review = structuredClone(checkExercise);
  review.slug = review.slug.includes("-check")
    ? review.slug.replace("-check", "-review")
    : `${review.slug}-review`;
  review.title = review.title.replace(/^Check:/, "Review:");
  review.sortOrder = 4;
  return review;
}

function findCheckExercise(exercises) {
  return (
    exercises.find((ex) => ex.sortOrder === 2) ??
    exercises.find((ex) => ex.title?.startsWith("Check:"))
  );
}

function normalizeWritingCheck(exercise) {
  if (exercise.exerciseType !== "writing") return exercise;
  exercise.content = exercise.content ?? {};
  exercise.content.targetLevel = LEVEL;
  if (exercise.content.minWords == null) {
    exercise.content.minWords = 5;
  }
  return exercise;
}

function normalizeSpeakingCheck(exercise) {
  if (exercise.exerciseType !== "speaking") return exercise;
  exercise.content = exercise.content ?? {};
  exercise.content.targetLevel = LEVEL;
  exercise.content.maxDurationSeconds = 60;
  for (const q of exercise.questions ?? []) {
    if (q.content) q.content.maxDurationSeconds = 60;
  }
  return exercise;
}

function prepareLessonIndex0(lesson) {
  const exercises = structuredClone(lesson.exercises);
  for (const ex of exercises) {
    if (ex.exerciseType === "writing") normalizeWritingCheck(ex);
    if (ex.exerciseType === "speaking") normalizeSpeakingCheck(ex);
  }
  const check = findCheckExercise(exercises);
  if (check) {
    let review = cloneAsReview(check);
    if (review.exerciseType === "writing") review = normalizeWritingCheck(review);
    if (review.exerciseType === "speaking") review = normalizeSpeakingCheck(review);
    exercises.push(review);
  }
  return {
    ...structuredClone(lesson),
    lessonIndex: 0,
    exercises,
  };
}

function globalSortOrder(skillIndex, lessonIndex) {
  return skillIndex * 3 + lessonIndex;
}

function unlockAfter(skillIndex, lessonIndex) {
  if (skillIndex === 0 && lessonIndex === 0) return undefined;
  if (lessonIndex === 0) {
    const prevSkill = SKILL_ORDER[skillIndex - 1];
    return lessonId(LEVEL, UNIT_NUMBER, prevSkill, 2);
  }
  const skill = SKILL_ORDER[skillIndex];
  return lessonId(LEVEL, UNIT_NUMBER, skill, lessonIndex - 1);
}

function lessonShell({
  slug,
  skill,
  lessonIndex,
  skillIndex,
  title,
  learningObjective,
  estimatedMinutes,
  exercises,
}) {
  const sortOrder = globalSortOrder(skillIndex, lessonIndex);
  const unlock = unlockAfter(skillIndex, lessonIndex);
  return {
    slug,
    skill,
    lessonIndex,
    sortOrder,
    ...(unlock ? { unlockAfterLessonId: unlock } : {}),
    title,
    learningObjective,
    estimatedMinutes,
    exercises,
  };
}

function addReviewFromCheck(exercises) {
  const check = findCheckExercise(exercises);
  if (!check) return exercises;
  let review = cloneAsReview(check);
  if (review.exerciseType === "writing") review = normalizeWritingCheck(review);
  if (review.exerciseType === "speaking") review = normalizeSpeakingCheck(review);
  return [...exercises, review];
}

// ─── New lesson builders (lessonIndex 1 & 2) ───────────────────────────────

function buildVocabularyLesson(lessonIndex, skillIndex) {
  if (lessonIndex === 1) {
    const exercises = addReviewFromCheck([
      buildExercise({
        slug: "vocab-friends-learn",
        title: "Learn: Friends and People",
        instructions: "Read each sentence. Choose the best word.",
        exerciseType: "multiple_choice",
        sortOrder: 0,
        questions: [
          buildMcq({
            questionText: "Tom plays with you at school. Tom is your _____.",
            skillTag: "vocabulary",
            explanation:
              "Friend (bạn) là người bạn chơi cùng ở trường. Brother là anh/em trai trong gia đình.",
            correct: "friend",
            wrong: ["brother", "father"],
            distractorNotes: [
              "Family member, not a school friend",
              "Adult parent, not a playmate",
            ],
          }),
          buildMcq({
            questionText: "A young male child is a _____.",
            skillTag: "vocabulary",
            explanation:
              "Boy (cậu bé) chỉ con trai nhỏ. Girl là con gái; friend là quan hệ, không phải giới tính.",
            correct: "boy",
            wrong: ["girl", "friend"],
            distractorNotes: ["Female child", "Relationship word, not gender"],
          }),
          buildMcq({
            questionText: "Anna is a young _____. She is seven.",
            skillTag: "vocabulary",
            explanation:
              "Girl (cô bé) phù hợp với tên nữ và tuổi nhỏ. Boy dùng cho con trai.",
            correct: "girl",
            wrong: ["boy", "mother"],
            distractorNotes: ["Male child", "Adult woman; age does not fit"],
          }),
          buildMcq({
            questionText: "My best _____ is Linh. We sit together in class.",
            skillTag: "vocabulary",
            explanation:
              "Friend (bạn) là người ngồi cạnh ở lớp. Sister là chị/em gái trong gia đình.",
            correct: "friend",
            wrong: ["sister", "brother"],
            distractorNotes: [
              "Family role; classmate may not be sister",
              "Male family member",
            ],
          }),
        ],
      }),
      buildExercise({
        slug: "vocab-friends-practice",
        title: "Practice: Match Friends and People",
        instructions: "Match each word to the correct meaning.",
        exerciseType: "matching",
        sortOrder: 1,
        questions: [
          buildMatching({
            questionText: "Match the people words to their meanings.",
            skillTag: "vocabulary",
            explanation:
              "Mỗi từ khớp một nghĩa rõ ràng. Boy/girl nói giới tính/tuổi; friend nói quan hệ.",
            pairs: [
              { left: "friend", right: "a person you like and know" },
              { left: "boy", right: "a young male child" },
              { left: "girl", right: "a young female child" },
              { left: "brother", right: "a boy in your family" },
            ],
          }),
        ],
      }),
      buildExercise({
        slug: "vocab-friends-check",
        title: "Check: Friends Quiz",
        instructions: "No hints — choose the best answer.",
        exerciseType: "multiple_choice",
        sortOrder: 2,
        qualityScores: exScores(0.32),
        questions: [
          buildMcq({
            questionText: "She is not my sister. She is my _____ from class.",
            skillTag: "vocabulary",
            explanation:
              "from class → friend (bạn), không phải thành viên gia đình.",
            correct: "friend",
            wrong: ["mother", "brother"],
            distractorNotes: [
              "Adult parent",
              "Male family member",
            ],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "Look at the picture: a young male child. He is a _____.",
            skillTag: "vocabulary",
            explanation: "Boy (cậu bé) = young male. Girl là nữ.",
            correct: "boy",
            wrong: ["girl", "friend"],
            distractorNotes: ["Female child", "Says relationship, not gender"],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "Lily and Mai play together. They are _____.",
            skillTag: "vocabulary",
            explanation:
              "Hai người chơi cùng nhau thường là friends (bạn). Sister cần quan hệ gia đình.",
            correct: "friends",
            wrong: ["sisters", "brothers"],
            distractorNotes: [
              "Family role not stated",
              "Male siblings; both are girls",
            ],
            difficultyRating: 2,
          }),
        ],
      }),
      buildExercise({
        slug: "vocab-friends-apply",
        title: "Apply: People in Sentences",
        instructions: "Complete each sentence with the correct word.",
        exerciseType: "gap_fill",
        sortOrder: 3,
        qualityScores: exScores(0.36),
        questions: [
          buildGapFill({
            questionText: "Complete: Tom is my [0]. | He is a [1]. | Anna is a [2].",
            skillTag: "vocabulary",
            explanation:
              "friend (bạn); boy (cậu bé) với he; girl (cô bé) với Anna.",
            template: "Tom is my [0]. He is a [1]. Anna is a [2].",
            correctAnswers: ["friend", "boy", "girl"],
            acceptableAnswers: [
              acceptableWord("friend"),
              acceptableWord("boy"),
              acceptableWord("girl"),
            ],
            difficultyRating: 2,
            points: 3,
          }),
        ],
      }),
    ]);
    return lessonShell({
      slug: "vocab-friends-and-people",
      skill: "vocabulary",
      lessonIndex: 1,
      skillIndex,
      title: "Lesson 2: Friends and People",
      learningObjective:
        "Recognise and use friend, boy and girl to talk about people at Starters level.",
      estimatedMinutes: 18,
      exercises,
    });
  }

  const exercises = addReviewFromCheck([
    buildExercise({
      slug: "vocab-face-learn",
      title: "Learn: Face Words",
      instructions: "Read each clue. Choose the face word.",
      exerciseType: "multiple_choice",
      sortOrder: 0,
      questions: [
        buildMcq({
          questionText: "You see with your _____.",
          skillTag: "vocabulary",
          explanation: "Eyes (mắt) dùng để nhìn. Nose để ngửi; mouth để ăn.",
          correct: "eyes",
          wrong: ["nose", "mouth"],
          distractorNotes: ["Used for smelling", "Used for eating"],
        }),
        buildMcq({
          questionText: "You smell with your _____.",
          skillTag: "vocabulary",
          explanation: "Nose (mũi) dùng để ngửi.",
          correct: "nose",
          wrong: ["eyes", "hair"],
          distractorNotes: ["Used for seeing", "On the head, not for smelling"],
        }),
        buildMcq({
          questionText: "You eat with your _____.",
          skillTag: "vocabulary",
          explanation: "Mouth (miệng) dùng để ăn và nói.",
          correct: "mouth",
          wrong: ["nose", "head"],
          distractorNotes: ["Used for smelling", "Whole top part, not for eating"],
        }),
        buildMcq({
          questionText: "Long or short _____ grows on your head.",
          skillTag: "vocabulary",
          explanation: "Hair (tóc) mọc trên đầu. Head là cả phần đầu.",
          correct: "hair",
          wrong: ["head", "eyes"],
          distractorNotes: [
            "Whole head, not just hair",
            "Used for seeing",
          ],
        }),
      ],
    }),
    buildExercise({
      slug: "vocab-face-practice",
      title: "Practice: Match Face Parts",
      instructions: "Match each word to what you do with it or where it is.",
      exerciseType: "matching",
      sortOrder: 1,
      questions: [
        buildMatching({
          questionText: "Match face words to their descriptions.",
          skillTag: "vocabulary",
          explanation:
            "Mỗi bộ phận có chức năng hoặc vị trí riêng trên khuôn mặt/đầu.",
          pairs: [
            { left: "eyes", right: "you see with them" },
            { left: "nose", right: "you smell with it" },
            { left: "mouth", right: "you eat and talk with it" },
            { left: "hair", right: "grows on your head" },
          ],
        }),
      ],
    }),
    buildExercise({
      slug: "vocab-face-check",
      title: "Check: Face Words Quiz",
      instructions: "Choose the best answer. No hints.",
      exerciseType: "multiple_choice",
      sortOrder: 2,
      qualityScores: exScores(0.34),
      questions: [
        buildMcq({
          questionText: "The part above your neck that has your face is your _____.",
          skillTag: "vocabulary",
          explanation: "Head (đầu) là phần trên cổ có mặt. Hair chỉ là tóc.",
          correct: "head",
          wrong: ["hair", "mouth"],
          distractorNotes: ["Only the hair part", "Lower face part"],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "Her _____ are brown. She can see well.",
          skillTag: "vocabulary",
          explanation: "Eyes (mắt) — are + eyes; dùng để nhìn.",
          correct: "eyes",
          wrong: ["nose", "hair"],
          distractorNotes: ["Used for smelling", "Not used for seeing"],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "Touch your _____. It is at the top of your body.",
          skillTag: "vocabulary",
          explanation: "Head (đầu) ở trên cùng cơ thể.",
          correct: "head",
          wrong: ["mouth", "eyes"],
          distractorNotes: ["In the face, not the top", "In the face"],
          difficultyRating: 2,
        }),
      ],
    }),
    buildExercise({
      slug: "vocab-face-apply",
      title: "Apply: Face Words in Context",
      instructions: "Complete the sentences with face words.",
      exerciseType: "gap_fill",
      sortOrder: 3,
      qualityScores: exScores(0.38),
      questions: [
        buildGapFill({
          questionText: "Complete: I see with my [0]. | I smell with my [1]. | Her [2] is long.",
          skillTag: "vocabulary",
          explanation: "eyes (mắt); nose (mũi); hair (tóc) — her hair is long.",
          template: "I see with my [0]. I smell with my [1]. Her [2] is long.",
          correctAnswers: ["eyes", "nose", "hair"],
          acceptableAnswers: [
            acceptableWord("eyes"),
            acceptableWord("nose"),
            acceptableWord("hair"),
          ],
          difficultyRating: 2,
          points: 3,
        }),
      ],
    }),
  ]);
  return lessonShell({
    slug: "vocab-face-words",
    skill: "vocabulary",
    lessonIndex: 2,
    skillIndex,
    title: "Lesson 3: Face Words",
    learningObjective:
      "Name and use head, eyes, nose, mouth and hair in short sentences.",
    estimatedMinutes: 18,
    exercises,
  });
}

function buildGrammarLesson(lessonIndex, skillIndex) {
  if (lessonIndex === 1) {
    const exercises = addReviewFromCheck([
      buildExercise({
        slug: "grammar-be-practice-learn",
        title: "Learn: am, is, are",
        instructions: "Choose am, is or are to complete each sentence.",
        exerciseType: "multiple_choice",
        sortOrder: 0,
        questions: [
          buildMcq({
            questionText: "I _____ seven years old.",
            skillTag: "grammar",
            explanation: "Dùng am với I (tôi). Is dùng với he/she/it; are với you/we/they.",
            correct: "am",
            wrong: ["is", "are"],
            distractorNotes: ["Used with he/she/it", "Used with you/we/they"],
          }),
          buildMcq({
            questionText: "He _____ my brother.",
            skillTag: "grammar",
            explanation: "Dùng is với he (anh ấy/cậu ấy).",
            correct: "is",
            wrong: ["am", "are"],
            distractorNotes: ["Only with I", "Used with plural or you"],
          }),
          buildMcq({
            questionText: "We _____ happy friends.",
            skillTag: "grammar",
            explanation: "Dùng are với we (chúng tôi/chúng ta).",
            correct: "are",
            wrong: ["is", "am"],
            distractorNotes: ["Singular form", "Only with I"],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "They _____ my mother and father.",
            skillTag: "grammar",
            explanation: "Dùng are với they (họ) — hai người = they.",
            correct: "are",
            wrong: ["is", "am"],
            distractorNotes: ["Singular; two people need are", "Only with I"],
            difficultyRating: 2,
          }),
        ],
      }),
      buildExercise({
        slug: "grammar-be-practice-gap",
        title: "Practice: Fill in am, is, are",
        instructions: "Complete the sentences with am, is or are.",
        exerciseType: "gap_fill",
        sortOrder: 1,
        questions: [
          buildGapFill({
            questionText: "Complete: I [0] Mai. | She [1] my friend. | They [2] boys.",
            skillTag: "grammar",
            explanation: "I am; She is; They are — chia động từ be theo chủ ngữ.",
            template: "I [0] Mai. She [1] my friend. They [2] boys.",
            correctAnswers: ["am", "is", "are"],
            acceptableAnswers: [["am"], ["is"], ["are"]],
            difficultyRating: 2,
            points: 3,
          }),
        ],
      }),
      buildExercise({
        slug: "grammar-be-practice-check",
        title: "Check: Be Verb Quiz",
        instructions: "Choose the correct form. No hints.",
        exerciseType: "multiple_choice",
        sortOrder: 2,
        qualityScores: exScores(0.34),
        questions: [
          buildMcq({
            questionText: "You _____ my good friend.",
            skillTag: "grammar",
            explanation: "You are — are đi với you.",
            correct: "are",
            wrong: ["is", "am"],
            distractorNotes: ["Not with you", "Only with I"],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "Anna and I _____ in Class 2A.",
            skillTag: "grammar",
            explanation: "Anna and I = we → We are.",
            correct: "are",
            wrong: ["is", "am"],
            distractorNotes: ["Two people need are", "Only with I alone"],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "It _____ a family photo.",
            skillTag: "grammar",
            explanation: "It is — is đi với it (nó).",
            correct: "is",
            wrong: ["are", "am"],
            distractorNotes: ["Plural form", "Only with I"],
            difficultyRating: 2,
          }),
        ],
      }),
      buildExercise({
        slug: "grammar-be-practice-apply",
        title: "Apply: Build Sentences with be",
        instructions: "Put the words in the correct order.",
        exerciseType: "sentence_ordering",
        sortOrder: 3,
        qualityScores: exScores(0.36),
        questions: [
          buildSentenceOrdering({
            questionText: "Make a sentence: I / am / eight.",
            skillTag: "grammar",
            explanation: "I am eight. — I + am + số tuổi.",
            items: orderingItems(["I", "am", "eight."]),
            correctOrder: orderingOrder(3),
          }),
          buildSentenceOrdering({
            questionText: "Make a sentence: They / are / my / friends.",
            skillTag: "grammar",
            explanation: "They are my friends. — They + are + my + danh từ.",
            items: orderingItems(["They", "are", "my", "friends."]),
            correctOrder: orderingOrder(4),
            difficultyRating: 2,
          }),
        ],
      }),
    ]);
    return lessonShell({
      slug: "grammar-be-verbs-practice",
      skill: "grammar",
      lessonIndex: 1,
      skillIndex,
      title: "Lesson 2: am, is, are Practice",
      learningObjective:
        "Choose am, is and are correctly with I, he, she, we and they.",
      estimatedMinutes: 20,
      exercises,
    });
  }

  const exercises = addReviewFromCheck([
    buildExercise({
      slug: "grammar-possessives-learn",
      title: "Learn: my, your, his, her",
      instructions: "Choose the correct possessive adjective.",
      exerciseType: "multiple_choice",
      sortOrder: 0,
      questions: [
        buildMcq({
          questionText: "I talk about myself: This is _____ mother.",
          skillTag: "grammar",
          explanation: "My (của tôi) dùng khi nói về bản thân.",
          correct: "my",
          wrong: ["your", "his"],
          distractorNotes: ["About the listener", "About a male other person"],
        }),
        buildMcq({
          questionText: "You ask a friend: Is this _____ brother?",
          skillTag: "grammar",
          explanation: "Your (của bạn) khi hỏi người nghe.",
          correct: "your",
          wrong: ["my", "her"],
          distractorNotes: ["About yourself", "About a female other person"],
        }),
        buildMcq({
          questionText: "Nam is a boy. _____ name is Nam.",
          skillTag: "grammar",
          explanation: "His (của anh ấy) với Nam (boy).",
          correct: "His",
          wrong: ["Her", "My"],
          distractorNotes: ["Female form", "About yourself"],
        }),
        buildMcq({
          questionText: "Anna is a girl. _____ eyes are brown.",
          skillTag: "grammar",
          explanation: "Her (của cô ấy) với Anna (girl).",
          correct: "Her",
          wrong: ["His", "Your"],
          distractorNotes: ["Male form", "About the listener"],
        }),
      ],
    }),
    buildExercise({
      slug: "grammar-possessives-practice",
      title: "Practice: Possessives Gap Fill",
      instructions: "Complete with my, your, his or her.",
      exerciseType: "gap_fill",
      sortOrder: 1,
      questions: [
        buildGapFill({
          questionText: "Complete: This is [0] father. | [1] name is Duc. | [2] hair is black.",
          skillTag: "grammar",
          explanation: "my father; His name (Duc = boy); Her hair (mother = she).",
          template: "This is [0] father. [1] name is Duc. [2] hair is black.",
          correctAnswers: ["my", "His", "Her"],
          acceptableAnswers: [
            ["my", "My"],
            ["His", "his"],
            ["Her", "her"],
          ],
          difficultyRating: 2,
          points: 3,
        }),
      ],
    }),
    buildExercise({
      slug: "grammar-possessives-check",
      title: "Check: Possessives Quiz",
      instructions: "Choose the best answer.",
      exerciseType: "multiple_choice",
      sortOrder: 2,
      qualityScores: exScores(0.36),
      questions: [
        buildMcq({
          questionText: "Lily is my friend. _____ name is Lily.",
          skillTag: "grammar",
          explanation: "Lily là nữ → Her name.",
          correct: "Her",
          wrong: ["His", "Your"],
          distractorNotes: ["Male form", "About listener"],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "Point to yourself: _____ mother is kind.",
          skillTag: "grammar",
          explanation: "Nói về bản thân → My mother.",
          correct: "My",
          wrong: ["His", "Her"],
          distractorNotes: ["About a male", "About a female"],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "Ask your friend: Is _____ sister seven?",
          skillTag: "grammar",
          explanation: "Hỏi bạn → your sister.",
          correct: "your",
          wrong: ["my", "his"],
          distractorNotes: ["About yourself", "About a boy"],
          difficultyRating: 2,
        }),
      ],
    }),
    buildExercise({
      slug: "grammar-possessives-apply",
      title: "Apply: Order Possessive Sentences",
      instructions: "Put the words in order.",
      exerciseType: "sentence_ordering",
      sortOrder: 3,
      qualityScores: exScores(0.38),
      questions: [
        buildSentenceOrdering({
          questionText: "Make: She / is / my / sister.",
          skillTag: "grammar",
          explanation: "She is my sister. — She + is + my + noun.",
          items: orderingItems(["She", "is", "my", "sister."]),
          correctOrder: orderingOrder(4),
        }),
        buildSentenceOrdering({
          questionText: "Make: His / name / is / Nam.",
          skillTag: "grammar",
          explanation: "His name is Nam. — His + name + is + tên.",
          items: orderingItems(["His", "name", "is", "Nam."]),
          correctOrder: orderingOrder(4),
          difficultyRating: 2,
        }),
      ],
    }),
  ]);
  return lessonShell({
    slug: "grammar-possessives",
    skill: "grammar",
    lessonIndex: 2,
    skillIndex,
    title: "Lesson 3: my, your, his, her",
    learningObjective:
      "Use possessive adjectives my, your, his and her before family and friend nouns.",
    estimatedMinutes: 20,
    exercises,
  });
}

function buildReadingLesson(lessonIndex, skillIndex) {
  const passage = MAI_PASSAGE;

  if (lessonIndex === 1) {
    const exercises = addReviewFromCheck([
      buildReadingExercise({
        slug: "reading-friends-learn",
        title: "Learn: Read About Friends",
        instructions: "Read Mai's text. Answer about Anna and friends.",
        sortOrder: 0,
        passage,
        questions: [
          buildMcq({
            questionText: "What is Anna's role in the text?",
            skillTag: "reading",
            assessmentType: "detail",
            explanation: "Anna là bạn của Mai: We have a friend. Her name is Anna.",
            correct: "Mai's friend",
            wrong: ["Mai's sister", "Mai's mother"],
            distractorNotes: [
              "Girl but not sister",
              "Adult female parent",
            ],
          }),
          buildMcq({
            questionText: "Anna is a _____ in Mai's class.",
            skillTag: "reading",
            assessmentType: "detail",
            explanation: "She is a girl in our class.",
            correct: "girl",
            wrong: ["boy", "teacher"],
            distractorNotes: ["Wrong gender", "Not in text"],
          }),
        ],
      }),
      buildReadingExercise({
        slug: "reading-friends-practice",
        title: "Practice: Friends in Context",
        instructions: "Read again. Answer about people and words.",
        sortOrder: 1,
        passage,
        questions: [
          buildMcq({
            questionText: "In 'He is a boy', who is he?",
            skillTag: "reading",
            assessmentType: "vocabulary_in_context",
            explanation: "He là Nam — anh trai của Mai.",
            correct: "Nam, Mai's brother",
            wrong: ["Mai's father", "Anna"],
            distractorNotes: ["Would use different context", "Would use she"],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "Why is Anna not in Mai's family photo as a sister?",
            skillTag: "reading",
            assessmentType: "inference",
            explanation: "Text nói friend from class, không phải sister.",
            correct: "She is a friend, not a sister.",
            wrong: ["She is Mai's mother.", "She is not in the photo."],
            distractorNotes: [
              "Wrong relationship",
              "She is mentioned in the text",
            ],
            difficultyRating: 2,
          }),
        ],
      }),
      buildReadingExercise({
        slug: "reading-friends-check",
        title: "Check: Friends Reading Quiz",
        instructions: "Read carefully. Choose the best answer.",
        sortOrder: 2,
        passage,
        difficulty: 0.35,
        questions: [
          buildMcq({
            questionText: "Who is the boy in the text?",
            skillTag: "reading",
            assessmentType: "main_idea",
            explanation: "Nam là boy, anh trai sáu tuổi của Mai.",
            correct: "Nam, Mai's six-year-old brother",
            wrong: ["Mai's father", "Anna's brother"],
            distractorNotes: [
              "Father is tall, not six",
              "Anna is a girl friend",
            ],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "Order: (1) parents (2) brother (3) friend — how does Mai tell the story?",
            skillTag: "reading",
            assessmentType: "sequencing",
            explanation: "Mai mô tả bố mẹ trước, rồi anh trai, rồi bạn Anna.",
            correct: "1 → 2 → 3",
            wrong: ["3 → 1 → 2", "2 → 3 → 1"],
            distractorNotes: [
              "Friend comes after family",
              "Parents come first",
            ],
            difficultyRating: 2,
          }),
        ],
      }),
      buildExercise({
        slug: "reading-friends-apply",
        title: "Apply: Match Friends to Facts",
        instructions: "Use the text. Match each person to a fact.",
        exerciseType: "matching",
        sortOrder: 3,
        content: { passage },
        qualityScores: exScores(0.34),
        questions: [
          buildMatching({
            questionText: "Match people to facts from the text.",
            skillTag: "reading",
            explanation:
              "Anna = girl in class; Nam = six; father = black hair; mother = brown eyes.",
            pairs: [
              { left: "Anna", right: "She is a girl in our class" },
              { left: "Nam", right: "He is six years old" },
              { left: "Mai's father", right: "His hair is black" },
              { left: "Mai's mother", right: "Her eyes are brown" },
            ],
            difficultyRating: 2,
          }),
        ],
      }),
    ]);
    return lessonShell({
      slug: "reading-about-friends",
      skill: "reading",
      lessonIndex: 1,
      skillIndex,
      title: "Lesson 2: Read About Friends",
      learningObjective:
        "Read about friends in Mai's family text and answer detail questions.",
      estimatedMinutes: 20,
      exercises,
    });
  }

  const exercises = addReviewFromCheck([
    buildReadingExercise({
      slug: "reading-details-learn",
      title: "Learn: More Details",
      instructions: "Read the text. Answer detail questions.",
      sortOrder: 0,
      passage,
      questions: [
        buildMcq({
          questionText: "What colour is Mai's mother's eyes?",
          skillTag: "reading",
          assessmentType: "detail",
          explanation: "Her eyes are brown — her = mother.",
          correct: "Brown",
          wrong: ["Black", "Blue"],
          distractorNotes: [
            "Father's hair colour",
            "Not mentioned in text",
          ],
        }),
        buildMcq({
          questionText: "How old is Nam?",
          skillTag: "reading",
          assessmentType: "detail",
          explanation: "He is six.",
          correct: "Six years old",
          wrong: ["Eight years old", "Seven years old"],
          distractorNotes: ["Mai's age", "Not in text"],
        }),
      ],
    }),
    buildReadingExercise({
      slug: "reading-details-practice",
      title: "Practice: Hair and Eyes",
      instructions: "Read again. Answer about descriptions.",
      sortOrder: 1,
      passage,
      questions: [
        buildMcq({
          questionText: "Whose hair is black?",
          skillTag: "reading",
          assessmentType: "vocabulary_in_context",
          explanation: "His hair is black — his = father.",
          correct: "Mai's father's",
          wrong: ["Mai's mother's", "Anna's"],
          distractorNotes: [
            "Mother has brown eyes, not black hair stated",
            "Not described",
          ],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "Mai says her mother is _____.",
          skillTag: "reading",
          assessmentType: "inference",
          explanation: "My mother is kind.",
          correct: "kind",
          wrong: ["tall", "six"],
          distractorNotes: [
            "Father is tall",
            "Nam is six",
          ],
          difficultyRating: 2,
        }),
      ],
    }),
    buildReadingExercise({
      slug: "reading-details-check",
      title: "Check: Detail Reading Quiz",
      instructions: "Read one more time. Harder questions.",
      sortOrder: 2,
      passage,
      difficulty: 0.38,
      questions: [
        buildMcq({
          questionText: "How many brothers does Mai have?",
          skillTag: "reading",
          assessmentType: "detail",
          explanation: "I have one brother.",
          correct: "One",
          wrong: ["Two", "None"],
          distractorNotes: [
            "Only Nam is mentioned",
            "Text says one brother",
          ],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "At the end, how does Mai feel?",
          skillTag: "reading",
          assessmentType: "main_idea",
          explanation: "We are happy!",
          correct: "Happy",
          wrong: ["Sad", "Angry"],
          distractorNotes: ["Opposite of text", "Not in text"],
          difficultyRating: 2,
        }),
      ],
    }),
    buildExercise({
      slug: "reading-details-apply",
      title: "Apply: Match Details to People",
      instructions: "Match each description to the correct person.",
      exerciseType: "matching",
      sortOrder: 3,
      content: { passage },
      qualityScores: exScores(0.36),
      questions: [
        buildMatching({
          questionText: "Match descriptions from the text.",
          skillTag: "reading",
          explanation: "Mai = eight; father = tall; mother = kind; Nam = boy.",
          pairs: [
            { left: "Mai", right: "eight years old" },
            { left: "Father", right: "tall" },
            { left: "Mother", right: "kind" },
            { left: "Nam", right: "a boy" },
          ],
          difficultyRating: 2,
        }),
      ],
    }),
  ]);
  return lessonShell({
    slug: "reading-more-details",
    skill: "reading",
    lessonIndex: 2,
    skillIndex,
    title: "Lesson 3: More Details from the Text",
    learningObjective:
      "Find specific details about hair, eyes, age and feelings in Mai's text.",
    estimatedMinutes: 20,
    exercises,
  });
}

function buildListeningLesson(lessonIndex, skillIndex) {
  const padded = "01";

  if (lessonIndex === 1) {
    const audioBase = `/audio/listening/starters/unit-${padded}`;
    const exercises = addReviewFromCheck([
      buildListeningExercise({
        slug: "listening-school-learn",
        title: "Learn: Listen at School",
        instructions: "Listen to the conversation at school. Answer the first questions.",
        sortOrder: 0,
        script: AT_SCHOOL_SCRIPT,
        answerKey: { q1: "sister", q2: "father" },
        audioUrl: `${audioBase}/listening-school-learn.mp3`,
        questions: [
          buildMcq({
            questionText: "Who is Lan?",
            skillTag: "listening",
            explanation: "Hoa nói: She is my sister. Her name is Lan.",
            correct: "Hoa's sister",
            wrong: ["Hoa's friend", "Hoa's teacher"],
            distractorNotes: [
              "Family member stated",
              "Not mentioned",
            ],
          }),
          buildMcq({
            questionText: "Who is the man?",
            skillTag: "listening",
            explanation: "He is my father.",
            correct: "Hoa's father",
            wrong: ["Hoa's brother", "The teacher"],
            distractorNotes: [
              "Brother is a boy",
              "Teacher asks questions",
            ],
          }),
        ],
      }),
      buildListeningExercise({
        slug: "listening-school-practice",
        title: "Practice: More from At School",
        instructions: "Listen again. Answer the next questions.",
        sortOrder: 1,
        script: AT_SCHOOL_SCRIPT,
        answerKey: { q1: "brother", q2: "boy" },
        audioUrl: `${audioBase}/listening-school-practice.mp3`,
        questions: [
          buildMcq({
            questionText: "Is the boy Hoa's brother?",
            skillTag: "listening",
            explanation: "Yes. He is my brother.",
            correct: "Yes",
            wrong: ["No", "Maybe"],
            distractorNotes: [
              "Hoa says yes clearly",
              "Answer is clear in dialogue",
            ],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "Hoa says the brother is a _____.",
            skillTag: "listening",
            explanation: "He is a boy.",
            correct: "boy",
            wrong: ["girl", "friend"],
            distractorNotes: ["Wrong gender", "Family, not friend"],
            difficultyRating: 2,
          }),
        ],
      }),
      buildListeningExercise({
        slug: "listening-school-check",
        title: "Check: School Listening Quiz",
        instructions: "Listen one more time. Choose carefully.",
        sortOrder: 2,
        script: AT_SCHOOL_SCRIPT,
        answerKey: { q1: "Lan", q2: "father", q3: "brother" },
        audioUrl: `${audioBase}/listening-school-check.mp3`,
        difficulty: 0.34,
        questions: [
          buildMcq({
            questionText: "What is the sister's name?",
            skillTag: "listening",
            explanation: "Her name is Lan.",
            correct: "Lan",
            wrong: ["Hoa", "Anna"],
            distractorNotes: [
              "Speaker's name",
              "Name from another unit text",
            ],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "How many family members does Hoa talk about?",
            skillTag: "listening",
            explanation: "Sister, father, brother — three people.",
            correct: "Three",
            wrong: ["Two", "Four"],
            distractorNotes: [
              "Misses one person",
              "Counts teacher",
            ],
            difficultyRating: 2,
          }),
        ],
      }),
      buildExercise({
        slug: "listening-school-apply",
        title: "Apply: Match School Dialogue",
        instructions: "Listen again. Match each person to what Hoa says.",
        exerciseType: "matching",
        sortOrder: 3,
        content: {
          script: AT_SCHOOL_SCRIPT,
          answerKey: { match: "school-people" },
          audioUrl: `${audioBase}/listening-school-apply.mp3`,
        },
        qualityScores: exScores(0.34),
        questions: [
          buildMatching({
            questionText: "Match people to Hoa's words.",
            skillTag: "listening",
            explanation: "Lan = sister; man = father; boy = brother.",
            pairs: [
              { left: "Lan", right: "She is my sister" },
              { left: "The man", right: "He is my father" },
              { left: "The boy", right: "He is my brother" },
              { left: "The brother", right: "He is a boy" },
            ],
            difficultyRating: 2,
          }),
        ],
      }),
    ]);
    return lessonShell({
      slug: "listening-at-school-focus",
      skill: "listening",
      lessonIndex: 1,
      skillIndex,
      title: "Lesson 2: At School Dialogue",
      learningObjective:
        "Listen to a school conversation and identify family members.",
      estimatedMinutes: 18,
      exercises,
    });
  }

  const audioBase = `/audio/listening/starters/unit-${padded}`;
  const exercises = addReviewFromCheck([
    buildListeningExercise({
      slug: "listening-home-review-learn",
      title: "Learn: Listen at Home Again",
      instructions: "Listen to Minh at home. Answer the questions.",
      sortOrder: 0,
      script: AT_HOME_SCRIPT,
      answerKey: { q1: "mother", q2: "Duc" },
      audioUrl: `${audioBase}/listening-home-review-learn.mp3`,
      questions: [
        buildMcq({
          questionText: "Who is the woman?",
          skillTag: "listening",
          explanation: "This is my mother.",
          correct: "Minh's mother",
          wrong: ["Minh's sister", "Lily"],
          distractorNotes: [
            "Minh says no to sister for the girl",
            "Lily is the friend",
          ],
        }),
        buildMcq({
          questionText: "What is the brother's name?",
          skillTag: "listening",
          explanation: "His name is Duc.",
          correct: "Duc",
          wrong: ["Minh", "Lily"],
          distractorNotes: ["Speaker's name", "Friend's name"],
        }),
      ],
    }),
    buildListeningExercise({
      slug: "listening-home-review-practice",
      title: "Practice: Lily and Duc",
      instructions: "Listen again. Focus on the friend and brother.",
      sortOrder: 1,
      script: AT_HOME_SCRIPT,
      answerKey: { q1: "friend", q2: "Lily" },
      audioUrl: `${audioBase}/listening-home-review-practice.mp3`,
      questions: [
        buildMcq({
          questionText: "Who is Lily?",
          skillTag: "listening",
          explanation: "She is my friend.",
          correct: "Minh's friend",
          wrong: ["Minh's sister", "Minh's mother"],
          distractorNotes: [
            "Minh says no",
            "Already identified as mother",
          ],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "Minh says 'No' when asked if the girl is his _____.",
          skillTag: "listening",
          explanation: "Is the girl your sister? — No.",
          correct: "sister",
          wrong: ["friend", "mother"],
          distractorNotes: [
            "She is friend, but question was about sister",
            "Question was about sister",
          ],
          difficultyRating: 2,
        }),
      ],
    }),
    buildListeningExercise({
      slug: "listening-home-review-check",
      title: "Check: At Home Review Quiz",
      instructions: "Listen one final time. Choose carefully.",
      sortOrder: 2,
      script: AT_HOME_SCRIPT,
      answerKey: { q1: "brother", q2: "friend", q3: "mother" },
      audioUrl: `${audioBase}/listening-home-review-check.mp3`,
      difficulty: 0.36,
      questions: [
        buildMcq({
          questionText: "Who is Duc?",
          skillTag: "listening",
          explanation: "He is my brother. His name is Duc.",
          correct: "Minh's brother",
          wrong: ["Minh's friend", "Minh's father"],
          distractorNotes: [
            "Lily is friend",
            "Not mentioned",
          ],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "Put in order: (1) mother (2) brother (3) friend",
          skillTag: "listening",
          explanation: "Dialogue: mother → brother Duc → friend Lily.",
          correct: "1 → 2 → 3",
          wrong: ["2 → 1 → 3", "3 → 2 → 1"],
          distractorNotes: [
            "Mother comes first",
            "Friend is last",
          ],
          difficultyRating: 2,
        }),
      ],
    }),
    buildExercise({
      slug: "listening-home-review-apply",
      title: "Apply: Match At Home People",
      instructions: "Listen and match each name to their role.",
      exerciseType: "matching",
      sortOrder: 3,
      content: {
        script: AT_HOME_SCRIPT,
        answerKey: { match: "home-people" },
        audioUrl: `${audioBase}/listening-home-review-apply.mp3`,
      },
      qualityScores: exScores(0.36),
      questions: [
        buildMatching({
          questionText: "Match names to relationships.",
          skillTag: "listening",
          explanation: "Duc = brother; Lily = friend; woman = mother.",
          pairs: [
            { left: "Duc", right: "Minh's brother" },
            { left: "Lily", right: "Minh's friend" },
            { left: "The woman", right: "Minh's mother" },
            { left: "The boy", right: "He is my brother" },
          ],
          difficultyRating: 2,
        }),
      ],
    }),
  ]);
  return lessonShell({
    slug: "listening-home-review",
    skill: "listening",
    lessonIndex: 2,
    skillIndex,
    title: "Lesson 3: Review At Home",
    learningObjective:
      "Review the at-home listening script and identify all people correctly.",
    estimatedMinutes: 18,
    exercises,
  });
}

function buildWritingLesson(lessonIndex, skillIndex) {
  if (lessonIndex === 1) {
    const exercises = addReviewFromCheck([
      buildExercise({
        slug: "writing-family-sentences-learn",
        title: "Learn: Family Sentence Frames",
        instructions: "Complete each sentence about family.",
        exerciseType: "gap_fill",
        sortOrder: 0,
        questions: [
          buildGapFill({
            questionText: "Complete: This is [0] father. | She is [1] mother. | He is [2] brother.",
            skillTag: "writing",
            explanation: "my (của tôi) trước các thành viên gia đình.",
            template: "This is [0] father. She is [1] mother. He is [2] brother.",
            correctAnswers: ["my", "my", "my"],
            acceptableAnswers: [["my", "My"], ["my", "My"], ["my", "My"]],
          }),
        ],
      }),
      buildExercise({
        slug: "writing-family-sentences-practice",
        title: "Practice: Order Family Sentences",
        instructions: "Put words in order to make sentences.",
        exerciseType: "sentence_ordering",
        sortOrder: 1,
        questions: [
          buildSentenceOrdering({
            questionText: "Make: My / father / is / tall.",
            skillTag: "writing",
            explanation: "My father is tall. — mẫu câu mô tả gia đình.",
            items: orderingItems(["My", "father", "is", "tall."]),
            correctOrder: orderingOrder(4),
          }),
          buildSentenceOrdering({
            questionText: "Make: She / is / my / sister.",
            skillTag: "writing",
            explanation: "She is my sister.",
            items: orderingItems(["She", "is", "my", "sister."]),
            correctOrder: orderingOrder(4),
            difficultyRating: 2,
          }),
        ],
      }),
      buildWritingCheck({
        slug: "writing-family-sentences-check",
        title: "Check: Write About Family",
        instructions: "Write short answers. Use 1–5 words each.",
        sortOrder: 2,
        taskDescription:
          "Write short answers about your family. Use words from the unit.",
        prompts: [
          "1. What is your name?",
          "2. Who is your mother? (Write: my mother)",
          "3. Write one sentence: My _____ is _____. (Use father, brother or sister)",
        ],
        minWords: 5,
        modelAnswers: [
          "My name is Linh.",
          "my mother",
          "My brother is Nam.",
        ],
        successCriteria: [
          "All three prompts answered",
          "Uses my before a family noun",
          "Uses is correctly",
        ],
        rubric: {
          grammar: {
            weight: 0.3,
            criteria: "Uses am/is/are and my correctly.",
          },
          vocabulary: {
            weight: 0.3,
            criteria: "Uses family words from the unit.",
          },
          organization: {
            weight: 0.2,
            criteria: "Answers match prompts in order.",
          },
          taskAchievement: {
            weight: 0.2,
            criteria: "Short answers appropriate for Starters.",
          },
        },
        autoCheckKeywords: [
          "my",
          "name",
          "mother",
          "father",
          "brother",
          "sister",
          "is",
          "am",
        ],
      }),
      buildExercise({
        slug: "writing-family-sentences-apply",
        title: "Apply: More Family Frames",
        instructions: "Complete the writing frames.",
        exerciseType: "gap_fill",
        sortOrder: 3,
        qualityScores: exScores(0.34),
        questions: [
          buildGapFill({
            questionText: "Complete: [0] name is Hoa. | [1] is my sister. | We [2] happy.",
            skillTag: "writing",
            explanation: "My name; She; are — We are happy.",
            template: "[0] name is Hoa. [1] is my sister. We [2] happy.",
            correctAnswers: ["My", "She", "are"],
            acceptableAnswers: [["My", "my"], ["She", "she"], ["are"]],
            difficultyRating: 2,
            points: 3,
          }),
        ],
      }),
    ]);
    return lessonShell({
      slug: "writing-family-sentences",
      skill: "writing",
      lessonIndex: 1,
      skillIndex,
      title: "Lesson 2: Short Sentences About Family",
      learningObjective:
        "Write short sentences and answers about family members.",
      estimatedMinutes: 20,
      exercises,
    });
  }

  const exercises = addReviewFromCheck([
    buildExercise({
      slug: "writing-friend-learn",
      title: "Learn: Friend Writing Frames",
      instructions: "Complete sentences about a friend.",
      exerciseType: "gap_fill",
      sortOrder: 0,
      questions: [
        buildGapFill({
          questionText: "Complete: Tom is [0] friend. | [1] is a boy. | [2] name is Tom.",
          skillTag: "writing",
          explanation: "my friend; He; His name.",
          template: "Tom is [0] friend. [1] is a boy. [2] name is Tom.",
          correctAnswers: ["my", "He", "His"],
          acceptableAnswers: [
            ["my", "My"],
            ["He", "he"],
            ["His", "his"],
          ],
        }),
      ],
    }),
    buildExercise({
      slug: "writing-friend-practice",
      title: "Practice: Order Friend Sentences",
      instructions: "Put the words in order.",
      exerciseType: "sentence_ordering",
      sortOrder: 1,
      questions: [
        buildSentenceOrdering({
          questionText: "Make: She / is / my / friend.",
          skillTag: "writing",
          explanation: "She is my friend.",
          items: orderingItems(["She", "is", "my", "friend."]),
          correctOrder: orderingOrder(4),
        }),
        buildSentenceOrdering({
          questionText: "Make: Her / name / is / Anna.",
          skillTag: "writing",
          explanation: "Her name is Anna.",
          items: orderingItems(["Her", "name", "is", "Anna."]),
          correctOrder: orderingOrder(4),
          difficultyRating: 2,
        }),
      ],
    }),
    buildWritingCheck({
      slug: "writing-friend-check",
      title: "Check: Write About a Friend",
      instructions: "Write short answers about a friend.",
      sortOrder: 2,
      taskDescription: "Write about your friend using short answers.",
      prompts: [
        "1. What is your friend's name?",
        "2. Is your friend a boy or a girl?",
        "3. Write: _____ is my friend.",
      ],
      minWords: 5,
      modelAnswers: [
        "Her name is Anna.",
        "a girl",
        "She is my friend.",
      ],
      successCriteria: [
        "All prompts answered",
        "Uses friend and boy or girl",
        "Uses is and my/his/her",
      ],
      rubric: {
        grammar: {
          weight: 0.3,
          criteria: "Uses is and possessives correctly.",
        },
        vocabulary: {
          weight: 0.3,
          criteria: "Uses friend, boy, girl from the unit.",
        },
        organization: {
          weight: 0.2,
          criteria: "Answers are clear and in order.",
        },
        taskAchievement: {
          weight: 0.2,
          criteria: "All parts completed at Starters length.",
        },
      },
      autoCheckKeywords: ["friend", "boy", "girl", "my", "is", "Her", "His", "She", "He"],
    }),
    buildExercise({
      slug: "writing-friend-apply",
      title: "Apply: Write About a Friend",
      instructions: "Complete the gap-fill writing frames.",
      exerciseType: "gap_fill",
      sortOrder: 3,
      qualityScores: exScores(0.36),
      questions: [
        buildGapFill({
          questionText: "Complete: [0] name is Lily. | She is [1] friend. | We [2] happy.",
          skillTag: "writing",
          explanation: "Her name; my; are — We are happy.",
          template: "[0] name is Lily. She is [1] friend. We [2] happy.",
          correctAnswers: ["Her", "my", "are"],
          acceptableAnswers: [
            ["Her", "her"],
            ["my", "My"],
            ["are"],
          ],
          difficultyRating: 2,
          points: 3,
        }),
        buildGapFill({
          questionText: "Complete: He is [0] boy. | [1] is my friend. | [2] hair is short.",
          skillTag: "writing",
          explanation: "a boy; Tom (name) or He; His hair.",
          template: "He is [0] boy. [1] is my friend. [2] hair is short.",
          correctAnswers: ["a", "He", "His"],
          acceptableAnswers: [["a"], ["He", "Tom"], ["His", "his"]],
          difficultyRating: 2,
          points: 3,
        }),
      ],
    }),
  ]);
  return lessonShell({
    slug: "writing-about-a-friend",
    skill: "writing",
    lessonIndex: 2,
    skillIndex,
    title: "Lesson 3: Write About a Friend",
    learningObjective:
      "Write short gap-fill frames and answers about a friend.",
    estimatedMinutes: 20,
    exercises,
  });
}

function buildSpeakingLesson(lessonIndex, skillIndex) {
  const picture =
    "A mother, father, boy, girl and friend in a garden.";

  if (lessonIndex === 1) {
    const exercises = addReviewFromCheck([
      buildExercise({
        slug: "speaking-picture-learn",
        title: "Learn: Who Is in the Picture?",
        instructions: "Imagine a family picture. Choose the best answer.",
        exerciseType: "multiple_choice",
        sortOrder: 0,
        content: { pictureDescription: picture },
        questions: [
          buildMcq({
            questionText: "The tall man is the _____.",
            skillTag: "speaking",
            explanation: "Trong ảnh gia đình, người đàn ông lớn thường là father.",
            correct: "father",
            wrong: ["brother", "friend"],
            distractorNotes: [
              "Young male, not adult man",
              "Usually not the adult man",
            ],
          }),
          buildMcq({
            questionText: "The young girl in the family is the _____.",
            skillTag: "speaking",
            explanation: "Young girl in family → sister.",
            correct: "sister",
            wrong: ["mother", "friend"],
            distractorNotes: [
              "Adult woman",
              "From class, not family photo",
            ],
          }),
        ],
      }),
      buildExercise({
        slug: "speaking-picture-practice-l2",
        title: "Practice: Point and Name",
        instructions: "Choose what you would say for each person.",
        exerciseType: "multiple_choice",
        sortOrder: 1,
        content: { pictureDescription: picture },
        questions: [
          buildMcq({
            questionText: "Point to your mother. You say:",
            skillTag: "speaking",
            explanation: "She is my mother.",
            correct: "She is my mother.",
            wrong: ["He is my mother.", "She is my brother."],
            distractorNotes: [
              "Mother is she, not he",
              "Brother is male",
            ],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "Point to a boy who is your brother. You say:",
            skillTag: "speaking",
            explanation: "He is my brother.",
            correct: "He is my brother.",
            wrong: ["She is my sister.", "He is my friend."],
            distractorNotes: [
              "Female form",
              "Wrong relationship if he is brother",
            ],
            difficultyRating: 2,
          }),
        ],
      }),
      buildSpeakingCheck({
        slug: "speaking-picture-check",
        title: "Check: Picture Interview",
        instructions: "Answer about people in a family picture.",
        sortOrder: 2,
        prompt:
          "Look at a family picture. The examiner asks about the people.",
        pictureDescription: picture,
        followUpQuestions: [
          "Who is the woman?",
          "Who is the boy?",
          "Is the girl your sister or your friend?",
          "What do you say about your father?",
        ],
        suggestedAnswers: [
          "She is my mother.",
          "He is my brother.",
          "She is my sister.",
          "He is my father.",
        ],
        assessmentCriteria: {
          pronunciation:
            "Family words (mother, father, brother, sister, friend) are understandable.",
          fluency: "Short phrases without long silence.",
          grammar: "Uses He/She is my ... correctly.",
          vocabulary: "Uses at least three unit words.",
        },
      }),
      buildExercise({
        slug: "speaking-picture-apply",
        title: "Apply: Picture Who Is Who",
        instructions: "Choose the best phrase for each situation.",
        exerciseType: "multiple_choice",
        sortOrder: 3,
        questions: [
          buildMcq({
            questionText: "Teacher points to a girl from class. You say:",
            skillTag: "speaking",
            explanation: "She is my friend — from class, not sister.",
            correct: "She is my friend.",
            wrong: ["She is my sister.", "He is my friend."],
            distractorNotes: [
              "Classmate is usually friend",
              "Girl needs she, not he",
            ],
            difficultyRating: 2,
          }),
          buildMcq({
            questionText: "You point to yourself and your age. You say:",
            skillTag: "speaking",
            explanation: "I am seven. — giới thiệu tuổi bản thân.",
            correct: "I am seven.",
            wrong: ["He is seven.", "I is seven."],
            distractorNotes: [
              "About another person",
              "Wrong verb with I",
            ],
            difficultyRating: 2,
          }),
        ],
      }),
    ]);
    return lessonShell({
      slug: "speaking-picture-who-is-who",
      skill: "speaking",
      lessonIndex: 1,
      skillIndex,
      title: "Lesson 2: Picture — Who Is Who?",
      learningObjective:
        "Identify and name family and friends in a picture using short phrases.",
      estimatedMinutes: 18,
      exercises,
    });
  }

  const exercises = addReviewFromCheck([
    buildExercise({
      slug: "speaking-situational-learn",
      title: "Learn: Situational Replies",
      instructions: "Choose the best reply in each situation.",
      exerciseType: "multiple_choice",
      sortOrder: 0,
      questions: [
        buildMcq({
          questionText: "Friend asks: Who is she? (your sister) You say:",
          skillTag: "speaking",
          explanation: "She is my sister.",
          correct: "She is my sister.",
          wrong: ["He is my sister.", "She is my friend."],
          distractorNotes: [
            "Sister is she",
            "Wrong if she is sister",
          ],
        }),
        buildMcq({
          questionText: "Teacher asks: How old are you? You say:",
          skillTag: "speaking",
          explanation: "I am + tuổi.",
          correct: "I am eight.",
          wrong: ["I is eight.", "He is eight."],
          distractorNotes: [
            "Wrong verb",
            "About another person",
          ],
        }),
      ],
    }),
    buildExercise({
      slug: "speaking-situational-practice",
      title: "Practice: More Situations",
      instructions: "Choose what you would say.",
      exerciseType: "multiple_choice",
      sortOrder: 1,
      questions: [
        buildMcq({
          questionText: "Examiner: Is he your father? (Yes) You say:",
          skillTag: "speaking",
          explanation: "Yes. He is my father.",
          correct: "Yes. He is my father.",
          wrong: ["No. She is my mother.", "Yes. She is my father."],
          distractorNotes: [
            "Wrong answer",
            "Father is he",
          ],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "Friend asks about Anna. You say:",
          skillTag: "speaking",
          explanation: "Her name is Anna. — giới thiệu bạn gái.",
          correct: "Her name is Anna.",
          wrong: ["His name is Anna.", "My name is Anna."],
          distractorNotes: [
            "Anna is a girl's name",
            "Talks about yourself",
          ],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "You finish talking about family happily. You say:",
          skillTag: "speaking",
          explanation: "We are happy! — kết thúc tích cực.",
          correct: "We are happy!",
          wrong: ["I am mother.", "They is happy."],
          distractorNotes: [
            "Grammatically wrong",
            "Wrong verb form",
          ],
          difficultyRating: 2,
        }),
      ],
    }),
    buildSpeakingCheck({
      slug: "speaking-situational-check",
      title: "Check: Situational Speaking",
      instructions: "Answer the examiner's questions in short phrases.",
      sortOrder: 2,
      prompt:
        "The examiner asks everyday questions about you, your family and friends.",
      pictureDescription: picture,
      followUpQuestions: [
        "What is your name?",
        "Who is he in the picture?",
        "Who is your best friend?",
        "How old is your brother or sister?",
        "Say one sentence about your family.",
      ],
      suggestedAnswers: [
        "My name is Minh.",
        "He is my father.",
        "Tom is my friend.",
        "He is six.",
        "My mother is kind.",
      ],
      assessmentCriteria: {
        pronunciation: "Key words are clear enough to understand.",
        fluency: "Answers without long pauses.",
        grammar: "Uses am/is/are and my/his/her in answers.",
        vocabulary: "Uses family and friend words from the unit.",
      },
    }),
    buildExercise({
      slug: "speaking-situational-apply",
      title: "Apply: Quick Situational Replies",
      instructions: "Choose the best phrase for each situation.",
      exerciseType: "multiple_choice",
      sortOrder: 3,
      questions: [
        buildMcq({
          questionText: "Someone says: Nice to meet your family! You say:",
          skillTag: "speaking",
          explanation: "We are happy! — phản hồi tích cực phù hợp unit.",
          correct: "We are happy!",
          wrong: ["I am friend.", "She are happy."],
          distractorNotes: [
            "Grammatically wrong",
            "Wrong verb with she",
          ],
          difficultyRating: 2,
        }),
        buildMcq({
          questionText: "Examiner points to your sister. You say:",
          skillTag: "speaking",
          explanation: "She is my sister.",
          correct: "She is my sister.",
          wrong: ["He is my sister.", "She is my brother."],
          distractorNotes: [
            "Sister is female",
            "Brother is male",
          ],
          difficultyRating: 2,
        }),
      ],
    }),
  ]);
  return lessonShell({
    slug: "speaking-situational-replies",
    skill: "speaking",
    lessonIndex: 2,
    skillIndex,
    title: "Lesson 3: More Situational Replies",
    learningObjective:
      "Choose and say appropriate short replies in family and friend situations.",
    estimatedMinutes: 18,
    exercises,
  });
}

const NEW_LESSON_BUILDERS = {
  vocabulary: buildVocabularyLesson,
  grammar: buildGrammarLesson,
  reading: buildReadingLesson,
  listening: buildListeningLesson,
  writing: buildWritingLesson,
  speaking: buildSpeakingLesson,
};

function expandUnit(original) {
  const bySkill = {};
  for (const lesson of original.lessons) {
    bySkill[lesson.skill] = lesson;
  }

  const expandedLessons = [];

  for (let skillIndex = 0; skillIndex < SKILL_ORDER.length; skillIndex++) {
    const skill = SKILL_ORDER[skillIndex];
    const originalLesson = bySkill[skill];
    if (!originalLesson) {
      throw new Error(`Missing original lesson for skill: ${skill}`);
    }

    const lesson0 = prepareLessonIndex0(originalLesson);
    lesson0.sortOrder = globalSortOrder(skillIndex, 0);
    lesson0.unlockAfterLessonId = unlockAfter(skillIndex, 0);
    if (lesson0.unlockAfterLessonId === undefined) {
      delete lesson0.unlockAfterLessonId;
    }
    expandedLessons.push(lesson0);

    for (const lessonIndex of [1, 2]) {
      const builder = NEW_LESSON_BUILDERS[skill];
      expandedLessons.push(builder(lessonIndex, skillIndex));
    }
  }

  return {
    ...original,
    lessons: expandedLessons,
  };
}

export { expandUnit };

function main() {
  const original = JSON.parse(readFileSync(INPUT, "utf8"));
  const expanded = expandUnit(original);

  const stats = validateUnitStructure(expanded);

  writeFileSync(INPUT, `${JSON.stringify(expanded, null, 2)}\n`, "utf8");

  console.log(`✓ Expanded ${INPUT}`);
  console.log(`  Lessons: ${stats.lessonCount} (expected 18)`);
  console.log(`  Exercises: ${stats.exerciseCount} (expected 90)`);
  console.log("  By skill:", stats.bySkill);

  for (const lesson of expanded.lessons) {
    const exCount = lesson.exercises.length;
    console.log(
      `  [${lesson.sortOrder}] ${lesson.skill} L${lesson.lessonIndex}: ${exCount} exercises — ${lesson.slug}`
    );
  }
}

const isDirectRun =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) main();
