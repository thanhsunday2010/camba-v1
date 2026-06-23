/** KET U1 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [assignmentCheck, revisionCheck, studyPlanCheck] = writingChecks;

  return [
    {
      slug: "writing-email-teacher",
      title: "Lesson 1: Email About an Assignment",
      learningObjective:
        "Use frames to write a short email to a teacher about an assignment and deadline.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "writing-email-learn",
          title: "Learn: Email Phrases",
          instructions: "Complete the sentences about emailing a teacher.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Ms Tran, | I am writing about my history [0]. | I [1] to ask about the [2]. | Thank you, Linh",
              skillTag: "writing",
              topicTag,
              explanation: "assignment; need; deadline — khung email lịch sự cơ bản.",
              template:
                "Dear Ms Tran,\n\nI am writing about my history [0]. I [1] to ask about the [2].\n\nThank you,\nLinh",
              correctAnswers: ["assignment", "need", "deadline"],
              acceptableAnswers: [
                ["assignment", "Assignment"],
                ["need", "Need"],
                ["deadline", "Deadline"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-email-practice",
          title: "Practice: Order Email Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / have studied / the notes / since Monday.",
              skillTag: "writing",
              topicTag,
              explanation: "I have studied the notes since Monday. — present perfect trong email.",
              words: ["I", "have studied", "the notes", "since Monday."],
              correctOrder: [0, 1, 2, 3],
              difficultyRating: 2,
            }),
            buildSentenceOrdering({
              questionText: "Make: Could / you / tell / me / the deadline?",
              skillTag: "writing",
              topicTag,
              explanation: "Could you tell me the deadline? — câu hỏi lịch sự.",
              words: ["Could", "you", "tell", "me", "the deadline?"],
              correctOrder: [0, 1, 2, 3, 4],
              difficultyRating: 2,
            }),
          ],
        }),
        assignmentCheck,
        buildExercise({
          slug: "writing-email-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence to explain you need more time:",
              skillTag: "writing",
              topicTag,
              explanation: "I need more time to finish the work — need to + động từ.",
              correct: "I need more time to finish my assignment.",
              wrong: [
                "I need more time finishing my assignment need.",
                "More time I need finish assignment.",
              ],
              distractorNotes: ["Wrong word order", "Not a sentence"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best polite question about the deadline:",
              skillTag: "writing",
              topicTag,
              explanation: "Could you tell me if the deadline is next Friday?",
              correct: "Could you tell me if the deadline is next Friday?",
              wrong: [
                "Tell me deadline Friday now.",
                "When deadline is you tell?",
              ],
              distractorNotes: ["Too direct", "Wrong order"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-email-review",
          title: "Review: Email Writing Quiz",
          instructions: "Choose the best way to complete each writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Ms Tran, | I have revised [0] Monday. | I can come to [1] club on Wednesday. | [2] you, | Linh",
              skillTag: "writing",
              topicTag,
              explanation: "since; revision; Thank — ôn khung email.",
              template:
                "Dear Ms Tran,\n\nI have revised [0] Monday. I can come to [1] club on Wednesday.\n\n[2] you,\nLinh",
              correctAnswers: ["since", "revision", "Thank"],
              acceptableAnswers: [
                ["since", "Since"],
                ["revision", "Revision"],
                ["Thank", "Thanks", "thank", "thanks"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-revision-note",
      title: "Lesson 2: Write About Revision",
      learningObjective:
        "Write 3–4 connected sentences about revision habits using present perfect for/since.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "writing-revision-learn",
          title: "Learn: Revision Sentences",
          instructions: "Complete sentences about studying and revision.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I have studied English [0] Year 6. | I have revised every evening [1] Monday. | Students [2] to bring their student ID to the library.",
              skillTag: "writing",
              topicTag,
              explanation: "since; since; need — for/since và need to.",
              template:
                "I have studied English [0] Year 6. I have revised every evening [1] Monday. Students [2] to bring their student ID to the library.",
              correctAnswers: ["since", "since", "need"],
              acceptableAnswers: [
                ["since", "Since"],
                ["since", "Since"],
                ["need", "Need"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-revision-practice",
          title: "Practice: Connect Revision Ideas",
          instructions: "Put words in order to make revision sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / have had / the same timetable / for one semester.",
              skillTag: "writing",
              topicTag,
              explanation: "I have had the same timetable for one semester.",
              words: ["I", "have had", "the same timetable", "for one semester."],
              correctOrder: [0, 1, 2, 3],
              difficultyRating: 2,
            }),
          ],
        }),
        revisionCheck,
        buildExercise({
          slug: "writing-revision-apply",
          title: "Apply: Best Revision Message",
          instructions: "Choose the best short note about revision.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best note to a classmate about revision week:",
              skillTag: "writing",
              topicTag,
              explanation: "When + where + what — đủ thông tin KET A2.",
              correct:
                "The library is open until six during revision week. I have revised since Monday. Do you want to study together on Wednesday?",
              wrong: [
                "Library revision week study together.",
                "I am revise since Monday library open.",
              ],
              distractorNotes: ["Not sentences", "Wrong grammar"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-revision-review",
          title: "Review: Revision Writing Frames",
          instructions: "Complete the revision writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I don't have to go to revision club, but I [0] extra help. | I have worked on my assignment [1] three days. | The [2] is next Friday.",
              skillTag: "writing",
              topicTag,
              explanation: "need/want; for; deadline — ôn for/since và need to.",
              template:
                "I don't have to go to revision club, but I [0] extra help. I have worked on my assignment [1] three days. The [2] is next Friday.",
              correctAnswers: ["need", "for", "deadline"],
              acceptableAnswers: [
                ["need", "Need", "want", "Want"],
                ["for", "For"],
                ["deadline", "Deadline"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-study-plan",
      title: "Lesson 3: My Study Plan",
      learningObjective:
        "Write a short connected message about study obligations and future plans.",
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: "writing-plan-learn",
          title: "Learn: Have to and Need to Frames",
          instructions: "Complete sentences with have to or need to.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I [0] finish my history assignment this month. | I don't [1] to attend revision club. | Students [2] to bring their ID to the library.",
              skillTag: "writing",
              topicTag,
              explanation: "have to; have; need — nghĩa vụ và quy định.",
              template:
                "I [0] finish my history assignment this month. I don't [1] to attend revision club. Students [2] to bring their ID to the library.",
              correctAnswers: ["have to", "have", "need"],
              acceptableAnswers: [
                ["have to", "Have to", "must"],
                ["have", "Have"],
                ["need", "Need"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-plan-practice",
          title: "Practice: Order Study Plan Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: I / hope / to graduate / in four years / and visit / a university lecture.",
              skillTag: "writing",
              topicTag,
              explanation: "I hope to graduate in four years and visit a university lecture.",
              words: [
                "I",
                "hope",
                "to graduate",
                "in four years",
                "and visit",
                "a university lecture.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
          ],
        }),
        studyPlanCheck,
        buildExercise({
          slug: "writing-plan-apply",
          title: "Apply: Choose the Best Study Note",
          instructions: "Choose the best way to describe your study plan.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best opening for a message to a pen friend:",
              skillTag: "writing",
              topicTag,
              explanation: "Subject + present perfect + obligation — mở đầu rõ chủ đề KET.",
              correct:
                "I am in Year 8 at West Hill Secondary. I have studied English since primary school and I have to finish a history assignment soon.",
              wrong: [
                "I am thirteen assignment deadline campus.",
                "Study since for have to need graduate.",
              ],
              distractorNotes: ["Not connected", "Not grammatical"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence with for:",
              skillTag: "writing",
              topicTag,
              explanation: "I have had the same timetable for one semester.",
              correct: "I have had the same timetable for one semester.",
              wrong: [
                "I have had the same timetable since one semester.",
                "I have the same timetable for since semester.",
              ],
              distractorNotes: ["Since + point", "Mixed for/since"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-plan-review",
          title: "Review: Study Plan Frames",
          instructions: "Complete a short study plan frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: My favourite [0] is English. | I have revised [1] Monday because the [2] is next Friday. | I hope to [3] in four years.",
              skillTag: "writing",
              topicTag,
              explanation: "subject; since; deadline; graduate — ôn từ vựng unit.",
              template:
                "My favourite [0] is English. I have revised [1] Monday because the [2] is next Friday. I hope to [3] in four years.",
              correctAnswers: ["subject", "since", "deadline", "graduate"],
              acceptableAnswers: [
                ["subject", "Subject"],
                ["since", "Since"],
                ["deadline", "Deadline"],
                ["graduate", "Graduate"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
