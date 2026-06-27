/** KET U2 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [applicationCheck, shiftNoteCheck, careerPlanCheck] = writingChecks;

  return [
    {
      slug: "writing-job-application",
      title: "Lesson 1: Apply for a Job",
      learningObjective:
        "Use frames to write a short email applying for a part-time job.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "writing-application-learn",
          title: "Learn: Application Phrases",
          instructions: "Complete the sentences about job applications.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Ms Pham, | I would like to [0] for the shop assistant job. | I have one year of [1]. | What is the [2]?",
              skillTag: "writing",
              topicTag,
              explanation: "apply; experience; salary — khung email ứng tuyển.",
              template:
                "Dear Ms Pham,\n\nI would like to [0] for the shop assistant job. I have one year of [1]. What is the [2]?",
              correctAnswers: ["apply", "experience", "salary"],
              acceptableAnswers: [
                ["apply", "Apply"],
                ["experience", "Experience"],
                ["salary", "Salary"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-application-practice",
          title: "Practice: Order Application Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / work / in a bookshop / every Saturday.",
              skillTag: "writing",
              topicTag,
              explanation: "I work in a bookshop every Saturday. — present simple.",
              words: ["I", "work", "in a bookshop", "every Saturday."],
              correctOrder: [0, 1, 2, 3],
              difficultyRating: 2,
            }),
            buildSentenceOrdering({
              questionText: "Make: I / am / available / for / the weekend shift.",
              skillTag: "writing",
              topicTag,
              explanation: "I am available for the weekend shift.",
              words: ["I", "am", "available", "for", "the weekend shift."],
              correctOrder: [0, 1, 2, 3, 4],
              difficultyRating: 2,
            }),
          ],
        }),
        applicationCheck,
        buildExercise({
          slug: "writing-application-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence to say when you can work:",
              skillTag: "writing",
              topicTag,
              explanation: "I can work the Saturday shift — rõ ràng và lịch sự.",
              correct: "I can work the Saturday shift and the Sunday shift.",
              wrong: [
                "I can shift Saturday work Sunday.",
                "Shift I work Saturday can.",
              ],
              distractorNotes: ["Wrong order", "Not a sentence"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best polite question about the interview:",
              skillTag: "writing",
              topicTag,
              explanation: "Could you tell me when the interview is?",
              correct: "Could you tell me when the interview is?",
              wrong: ["Tell me interview when.", "When interview is you tell?"],
              distractorNotes: ["Too direct", "Wrong order"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-application-review",
          title: "Review: Application Writing Quiz",
          instructions: "Complete the application writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Manager, | I want to [0] for the part-time [1]. | I have shop [2] from last summer. | [3] you, | Linh",
              skillTag: "writing",
              topicTag,
              explanation: "apply; job; experience; Thank — khung email ngắn.",
              template:
                "Dear Manager,\n\nI want to [0] for the part-time [1]. I have shop [2] from last summer.\n\n[3] you,\nLinh",
              correctAnswers: ["apply", "job", "experience", "Thank"],
              acceptableAnswers: [
                ["apply", "Apply"],
                ["job", "Job"],
                ["experience", "Experience"],
                ["Thank", "Thanks", "thank", "thanks"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-shift-note",
      title: "Lesson 2: Write About Your Shift",
      learningObjective:
        "Write 3–4 connected sentences about work schedule using present tenses.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "writing-shift-learn",
          title: "Learn: Shift Sentences",
          instructions: "Complete sentences about shifts and salary.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I work the morning [0] on Saturdays. | My [1] pays me every month. | This week I [2] training with a new colleague.",
              skillTag: "writing",
              topicTag,
              explanation: "shift; employer; am — từ vựng và present continuous.",
              template:
                "I work the morning [0] on Saturdays. My [1] pays me every month. This week I [2] training with a new colleague.",
              correctAnswers: ["shift", "employer", "am"],
              acceptableAnswers: [
                ["shift", "Shift"],
                ["employer", "Employer"],
                ["am", "Am"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-shift-practice",
          title: "Practice: Connect Shift Ideas",
          instructions: "Put words in order to make shift sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / usually / work / the evening shift / on Fridays.",
              skillTag: "writing",
              topicTag,
              explanation: "I usually work the evening shift on Fridays.",
              words: ["I", "usually", "work", "the evening shift", "on Fridays."],
              correctOrder: [0, 1, 2, 3, 4],
              difficultyRating: 2,
            }),
          ],
        }),
        shiftNoteCheck,
        buildExercise({
          slug: "writing-shift-apply",
          title: "Apply: Best Shift Message",
          instructions: "Choose the best short note about your shift.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best note to your manager about availability:",
              skillTag: "writing",
              topicTag,
              explanation: "When + shift + reason — đủ thông tin KET A2.",
              correct:
                "I usually work the Saturday shift from nine to five. This week I am free on Sunday too. Could you tell me about the salary?",
              wrong: [
                "Shift Saturday work salary manager.",
                "I am shift work Friday every colleague.",
              ],
              distractorNotes: ["Not sentences", "Wrong grammar"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-shift-review",
          title: "Review: Shift Writing Frames",
          instructions: "Complete the shift writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Manager, | I [0] the evening shift on Fridays. | My [1] is eight pounds an hour. | [2] you, | Linh",
              skillTag: "writing",
              topicTag,
              explanation: "work; salary; Thank — ôn khung note ngắn.",
              template:
                "Dear Manager,\n\nI [0] the evening shift on Fridays. My [1] is eight pounds an hour.\n\n[2] you,\nLinh",
              correctAnswers: ["work", "salary", "Thank"],
              acceptableAnswers: [
                ["work", "Work"],
                ["salary", "Salary"],
                ["Thank", "Thanks", "thank", "thanks"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-career-plan",
      title: "Lesson 3: My Career Plan",
      learningObjective:
        "Write a short connected message about career plans and work experience.",
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: "writing-career-learn",
          title: "Learn: Career Plan Frames",
          instructions: "Complete sentences about career and retire.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I would like a [0] in nursing. | I have six months of [1]. | Many people [2] at sixty-five.",
              skillTag: "writing",
              topicTag,
              explanation: "career; experience; retire — kế hoạch nghề nghiệp.",
              template:
                "I would like a [0] in nursing. I have six months of [1]. Many people [2] at sixty-five.",
              correctAnswers: ["career", "experience", "retire"],
              acceptableAnswers: [
                ["career", "Career"],
                ["experience", "Experience"],
                ["retire", "Retire"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-career-practice",
          title: "Practice: Order Career Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: I / want / a part-time job / to build / skills / for my career.",
              skillTag: "writing",
              topicTag,
              explanation: "I want a part-time job to build skills for my career.",
              words: [
                "I",
                "want",
                "a part-time job",
                "to build",
                "skills",
                "for my career.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
          ],
        }),
        careerPlanCheck,
        buildExercise({
          slug: "writing-career-apply",
          title: "Apply: Choose the Best Career Note",
          instructions: "Choose the best way to describe your career plan.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best opening for a message to a pen friend:",
              skillTag: "writing",
              topicTag,
              explanation: "Job + experience + career — mở đầu rõ chủ đề KET.",
              correct:
                "I don't have a full-time job yet, but I want a part-time job at a bookshop. I have six months of customer service experience.",
              wrong: [
                "I am thirteen career shift salary.",
                "Career experience retire apply job.",
              ],
              distractorNotes: ["Not connected", "Not grammatical"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about retirement:",
              skillTag: "writing",
              topicTag,
              explanation: "Many people in my country retire at sixty or sixty-five.",
              correct: "Many people in my country retire at sixty or sixty-five.",
              wrong: [
                "Many people retire at experience sixty.",
                "Retire people many country at.",
              ],
              distractorNotes: ["Nonsense", "Wrong order"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-career-review",
          title: "Review: Career Plan Frames",
          instructions: "Complete a short career plan frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Hi Sam, | I want a [0] in hotel management. | I [1] for training before September. | My grandfather [2] at sixty-five. | Bye, Linh",
              skillTag: "writing",
              topicTag,
              explanation: "career; apply; retired — ôn từ vựng unit.",
              template:
                "Hi Sam,\n\nI want a [0] in hotel management. I [1] for training before September. My grandfather [2] at sixty-five.\n\nBye,\nLinh",
              correctAnswers: ["career", "apply", "retired"],
              acceptableAnswers: [
                ["career", "Career"],
                ["apply", "Apply", "will apply"],
                ["retired", "Retired"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
