/** Movers U1 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [morningCheck, mealsCheck, routineCheck] = writingChecks;

  return [
    {
      slug: "writing-morning-frames",
      title: "Lesson 1: Write About Your Morning",
      learningObjective:
        "Use frames to write short sentences about morning routines.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-morning-learn",
          title: "Learn: Morning Writing Frames",
          instructions: "Complete the sentences about morning routines.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I [0] up at six thirty. | I [1] breakfast at seven. | I [2] brush my teeth before school.",
              skillTag: "writing",
              topicTag,
              explanation: "wake; have; always — khung viết buổi sáng.",
              template:
                "I [0] up at six thirty. I [1] breakfast at seven. I [2] brush my teeth before school.",
              correctAnswers: ["wake", "have", "always"],
              acceptableAnswers: [
                ["wake", "Wake"],
                ["have", "Have"],
                ["always", "Always"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-morning-practice",
          title: "Practice: Order Morning Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / always / have / breakfast / with / my family.",
              skillTag: "writing",
              topicTag,
              explanation: "I always have breakfast with my family.",
              words: ["I", "always", "have", "breakfast", "with", "my family."],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
          ],
        }),
        morningCheck,
        buildExercise({
          slug: "writing-morning-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence about waking up:",
              skillTag: "writing",
              topicTag,
              explanation: "Present simple + time — chuẩn Movers.",
              correct: "I wake up at six thirty every day.",
              wrong: [
                "I am wake up at six thirty.",
                "I wakes up at six thirty.",
              ],
              distractorNotes: ["Wrong tense", "Wrong person"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence with always:",
              skillTag: "writing",
              topicTag,
              explanation: "Always trước brush.",
              correct: "I always brush my teeth in the morning.",
              wrong: [
                "I brush always my teeth in the morning.",
                "Always I brush my teeth morning.",
              ],
              distractorNotes: ["Wrong adverb position", "Wrong word order"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-morning-review",
          title: "Review: Morning Writing Quiz",
          instructions: "Choose the best way to complete each writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText: "Complete: Every morning I [0] up early and [1] dressed for school.",
              skillTag: "writing",
              topicTag,
              explanation: "wake; get — ôn khung viết buổi sáng.",
              template: "Every morning I [0] up early and [1] dressed for school.",
              correctAnswers: ["wake", "get"],
              acceptableAnswers: [
                ["wake", "Wake"],
                ["get", "Get"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-meals-note",
      title: "Lesson 2: Write About Meals",
      learningObjective: "Write 2–3 connected sentences about meals and where you eat them.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-meals-learn",
          title: "Learn: Meal Sentences",
          instructions: "Complete sentences about meals.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I have [0] at home. | I have [1] at school at twelve. | We eat [2] at six.",
              skillTag: "writing",
              topicTag,
              explanation: "breakfast; lunch; dinner — ba bữa ăn.",
              template:
                "I have [0] at home. I have [1] at school at twelve. We eat [2] at six.",
              correctAnswers: ["breakfast", "lunch", "dinner"],
              acceptableAnswers: [
                ["breakfast", "Breakfast"],
                ["lunch", "Lunch"],
                ["dinner", "Dinner"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-meals-practice",
          title: "Practice: Connect Meal Ideas",
          instructions: "Put words in order to make meal sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / have / lunch / at / school / every day.",
              skillTag: "writing",
              topicTag,
              explanation: "I have lunch at school every day.",
              words: ["I", "have", "lunch", "at", "school", "every day."],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
          ],
        }),
        mealsCheck,
        buildExercise({
          slug: "writing-meals-apply",
          title: "Apply: Best Meal Message",
          instructions: "Choose the best short message.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best message about lunch:",
              skillTag: "writing",
              topicTag,
              explanation: "Place + time — đủ thông tin Movers.",
              correct: "I have lunch at school at twelve o'clock.",
              wrong: [
                "Lunch school twelve.",
                "I am have lunch at school.",
              ],
              distractorNotes: ["Too short, not a sentence", "Wrong grammar"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-meals-review",
          title: "Review: Meals Writing Frames",
          instructions: "Complete the meal writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: At home I eat [0]. At school I have [1]. In the evening we have [2] together.",
              skillTag: "writing",
              topicTag,
              explanation: "breakfast; lunch; dinner — ôn bữa ăn.",
              template:
                "At home I eat [0]. At school I have [1]. In the evening we have [2] together.",
              correctAnswers: ["breakfast", "lunch", "dinner"],
              acceptableAnswers: [
                ["breakfast", "Breakfast"],
                ["lunch", "Lunch"],
                ["dinner", "Dinner"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-full-routine",
      title: "Lesson 3: My Daily Routine",
      learningObjective:
        "Write a short connected message about a full school day.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-routine-learn",
          title: "Learn: Routine Connectors",
          instructions: "Complete sentences with then and after.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I wake up, then I [0] breakfast. [1] school I do homework. Then I [2] to bed.",
              skillTag: "writing",
              topicTag,
              explanation: "have; After; go — liên từ thứ tự.",
              template:
                "I wake up, then I [0] breakfast. [1] school I do homework. Then I [2] to bed.",
              correctAnswers: ["have", "After", "go"],
              acceptableAnswers: [
                ["have", "Have"],
                ["After", "after"],
                ["go", "Go"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-routine-practice",
          title: "Practice: Order My Day",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: After school / I / always / do / my homework / before dinner.",
              skillTag: "writing",
              topicTag,
              explanation: "After school I always do my homework before dinner.",
              words: [
                "After school",
                "I",
                "always",
                "do",
                "my homework",
                "before dinner.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
          ],
        }),
        routineCheck,
        buildExercise({
          slug: "writing-routine-apply",
          title: "Apply: Choose the Best Paragraph Start",
          instructions: "Choose the best way to start a routine message.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best opening for a pen-friend message:",
              skillTag: "writing",
              topicTag,
              explanation: "Every day + wake up — mở đầu rõ chủ đề.",
              correct: "Every day I wake up at six thirty and go to school.",
              wrong: [
                "I am nine and football.",
                "Homework never always school.",
              ],
              distractorNotes: ["Not about routine", "Not grammatical"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence with never:",
              skillTag: "writing",
              topicTag,
              explanation: "Never trước watch — đúng ngữ pháp.",
              correct: "I never watch TV before I do my homework.",
              wrong: [
                "I watch never TV before homework.",
                "Never I watch TV homework before.",
              ],
              distractorNotes: ["Wrong position", "Wrong order"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-routine-review",
          title: "Review: Full Day Frames",
          instructions: "Complete a short routine message frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Every day I [0] to school at seven thirty. I [1] do homework after school. I [2] watch TV before homework.",
              skillTag: "writing",
              topicTag,
              explanation: "go; always; never — cả ngày học sinh Movers.",
              template:
                "Every day I [0] to school at seven thirty. I [1] do homework after school. I [2] watch TV before homework.",
              correctAnswers: ["go", "always", "never"],
              acceptableAnswers: [
                ["go", "Go"],
                ["always", "Always"],
                ["never", "Never"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
