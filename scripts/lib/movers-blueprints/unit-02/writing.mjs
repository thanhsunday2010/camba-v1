/** Movers U2 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [symptomsCheck, adviceCheck, doctorCheck] = writingChecks;

  return [
    {
      slug: "writing-symptoms-frames",
      title: "Lesson 1: Write About Feeling Ill",
      learningObjective:
        "Use frames to write short sentences about symptoms with have got.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-symptoms-learn",
          title: "Learn: Symptom Writing Frames",
          instructions: "Complete the sentences about feeling ill.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I feel [0]. | I've [1] a headache. | I am [2] and I cannot go to school.",
              skillTag: "writing",
              topicTag,
              explanation: "sick; got; ill — khung viết khi ốm.",
              template:
                "I feel [0]. I've [1] a headache. I am [2] and I cannot go to school.",
              correctAnswers: ["sick", "got", "ill"],
              acceptableAnswers: [
                ["sick", "Sick"],
                ["got", "Got"],
                ["ill", "Ill"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-symptoms-practice",
          title: "Practice: Order Symptom Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / feel / sick / today.",
              skillTag: "writing",
              topicTag,
              explanation: "I feel sick today.",
              words: ["I", "feel", "sick", "today."],
              correctOrder: [0, 1, 2, 3],
              difficultyRating: 2,
            }),
          ],
        }),
        symptomsCheck,
        buildExercise({
          slug: "writing-symptoms-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence about a headache:",
              skillTag: "writing",
              topicTag,
              explanation: "I've got a headache — have got + triệu chứng.",
              correct: "I've got a headache and my head hurts.",
              wrong: ["I have got headache.", "I am headache today."],
              distractorNotes: ["Thiếu a", "Sai ngữ pháp"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best note to a teacher:",
              skillTag: "writing",
              topicTag,
              explanation: "I feel sick — lịch sự và rõ ràng.",
              correct: "Dear Teacher, I feel sick today. I cannot come to school.",
              wrong: ["Sick I school no.", "Feel sick today school."],
              distractorNotes: ["Không thành câu", "Quá ngắn"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-symptoms-review",
          title: "Review: Symptom Writing Quiz",
          instructions: "Choose the best way to complete each writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText: "Complete: Today I [0] sick. My stomach [1] and I've got a [2].",
              skillTag: "writing",
              topicTag,
              explanation: "feel; hurts; headache — ôn khung viết triệu chứng.",
              template: "Today I [0] sick. My stomach [1] and I've got a [2].",
              correctAnswers: ["feel", "hurts", "headache"],
              acceptableAnswers: [
                ["feel", "Feel"],
                ["hurts", "Hurts"],
                ["headache", "Headache"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-advice-should",
      title: "Lesson 2: Write Health Advice",
      learningObjective:
        "Write 2–3 connected sentences giving advice with should.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-advice-learn",
          title: "Learn: Advice Sentences",
          instructions: "Complete sentences with should.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: You [0] rest at home. | You [1] take your medicine. | You [2] go to school when you are ill.",
              skillTag: "writing",
              topicTag,
              explanation: "should; should; shouldn't — lời khuyên.",
              template:
                "You [0] rest at home. You [1] take your medicine. You [2] go to school when you are ill.",
              correctAnswers: ["should", "should", "shouldn't"],
              acceptableAnswers: [
                ["should", "Should"],
                ["should", "Should"],
                ["shouldn't", "should not", "Shouldn't"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-advice-practice",
          title: "Practice: Order Advice Sentences",
          instructions: "Put words in order to make advice.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: You / should / rest / and / drink / water.",
              skillTag: "writing",
              topicTag,
              explanation: "You should rest and drink water.",
              words: ["You", "should", "rest", "and", "drink", "water."],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
          ],
        }),
        adviceCheck,
        buildExercise({
          slug: "writing-advice-apply",
          title: "Apply: Best Advice Message",
          instructions: "Choose the best short message.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best message to ill friend Linh:",
              skillTag: "writing",
              topicTag,
              explanation: "Should rest + shouldn't go to school — lời khuyên rõ.",
              correct: "Hi Linh, you should rest. You shouldn't go to school today.",
              wrong: ["Linh rest should school no.", "You should to rest Linh."],
              distractorNotes: ["Không thành câu", "Thừa to"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-advice-review",
          title: "Review: Advice Writing Frames",
          instructions: "Complete the advice writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: When you have a headache, you [0] rest. You [1] play outside. You [2] drink water.",
              skillTag: "writing",
              topicTag,
              explanation: "should; shouldn't; should — ôn lời khuyên.",
              template:
                "When you have a headache, you [0] rest. You [1] play outside. You [2] drink water.",
              correctAnswers: ["should", "shouldn't", "should"],
              acceptableAnswers: [
                ["should", "Should"],
                ["shouldn't", "should not", "Shouldn't"],
                ["should", "Should"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-doctor-visit",
      title: "Lesson 3: A Doctor Visit",
      learningObjective:
        "Write a short connected message about a hospital visit.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-doctor-learn",
          title: "Learn: Hospital Visit Frames",
          instructions: "Complete sentences about the doctor and hospital.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Mum took me to the [0]. | The [1] checked my arm. | The doctor gave me [2].",
              skillTag: "writing",
              topicTag,
              explanation: "hospital; nurse; medicine — chuyến khám.",
              template:
                "Mum took me to the [0]. The [1] checked my arm. The doctor gave me [2].",
              correctAnswers: ["hospital", "nurse", "medicine"],
              acceptableAnswers: [
                ["hospital", "Hospital"],
                ["nurse", "Nurse"],
                ["medicine", "Medicine"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-doctor-practice",
          title: "Practice: Order Hospital Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: The doctor / said / I / should / rest / and / take / medicine.",
              skillTag: "writing",
              topicTag,
              explanation: "The doctor said I should rest and take medicine.",
              words: [
                "The doctor",
                "said",
                "I",
                "should",
                "rest",
                "and",
                "take",
                "medicine.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
              difficultyRating: 2,
            }),
          ],
        }),
        doctorCheck,
        buildExercise({
          slug: "writing-doctor-apply",
          title: "Apply: Choose the Best Paragraph",
          instructions: "Choose the best short message about a doctor visit.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best message to a pen friend:",
              skillTag: "writing",
              topicTag,
              explanation: "Hospital + doctor + should rest — đủ thông tin.",
              correct:
                "I went to the hospital. The doctor said I am ill. I should rest and take medicine.",
              wrong: ["Hospital doctor ill.", "I am medicine hospital rest should."],
              distractorNotes: ["Không thành câu", "Sai trật tự"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence with have got:",
              skillTag: "writing",
              topicTag,
              explanation: "I've got a headache — đúng cấu trúc.",
              correct: "I've got a headache so I went to the doctor.",
              wrong: ["I got have headache doctor.", "Have got I headache."],
              distractorNotes: ["Sai trật tự", "Sai trật tự"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-doctor-review",
          title: "Review: Doctor Visit Frames",
          instructions: "Complete a short hospital message frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: At the hospital the [0] looked at my tooth. I [1] got a headache too. I should [2] at home.",
              skillTag: "writing",
              topicTag,
              explanation: "doctor; have/'ve; rest — ôn viết về bác sĩ.",
              template:
                "At the hospital the [0] looked at my tooth. I [1] got a headache too. I should [2] at home.",
              correctAnswers: ["doctor", "have", "rest"],
              acceptableAnswers: [
                ["doctor", "Doctor"],
                ["have", "'ve", "Have"],
                ["rest", "Rest"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
