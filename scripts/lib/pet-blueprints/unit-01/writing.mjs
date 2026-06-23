/** PET U1 — writing lessons (3 × 5 exercises; only Check is AI, min 40 words). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [scholarshipCheck, careerCheck, futureCheck] = writingChecks;

  return [
    {
      slug: "writing-email-scholarship",
      title: "Lesson 1: Email About a Scholarship",
      learningObjective:
        "Use frames to write a short email about a scholarship application and deadline.",
      estimatedMinutes: 26,
      exercises: [
        buildExercise({
          slug: "writing-scholarship-learn",
          title: "Learn: Scholarship Email Phrases",
          instructions: "Complete the sentences about emailing your teacher.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Ms Phuong, | I am writing about the international [0]. | My [1] is to study engineering at university. | Could you tell me about the [2] letter?",
              skillTag: "writing",
              topicTag,
              explanation: "scholarship; ambition; reference — khung email B1.",
              template:
                "Dear Ms Phuong,\n\nI am writing about the international [0]. My [1] is to study engineering at university. Could you tell me about the [2] letter?",
              correctAnswers: ["scholarship", "ambition", "reference"],
              acceptableAnswers: [
                ["scholarship", "Scholarship"],
                ["ambition", "Ambition"],
                ["reference", "Reference"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-scholarship-practice",
          title: "Practice: Order Email Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / have gained / a programming / qualification / this year.",
              skillTag: "writing",
              topicTag,
              explanation: "I have gained a programming qualification this year.",
              words: ["I", "have gained", "a programming", "qualification", "this year."],
              correctOrder: [0, 1, 2, 3, 4],
              difficultyRating: 2,
            }),
            buildSentenceOrdering({
              questionText: "Make: Could / you / tell / me / when / the deadline / is?",
              skillTag: "writing",
              topicTag,
              explanation: "Could you tell me when the deadline is? — câu hỏi lịch sự B1.",
              words: ["Could", "you", "tell", "me", "when", "the deadline", "is?"],
              correctOrder: [0, 1, 2, 3, 4, 5, 6],
              difficultyRating: 2,
            }),
          ],
        }),
        scholarshipCheck,
        buildExercise({
          slug: "writing-scholarship-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence to explain your ambition:",
              skillTag: "writing",
              topicTag,
              explanation: "My main ambition is to… — cấu trúc rõ ràng B1.",
              correct: "My main ambition is to study mechanical engineering at university.",
              wrong: [
                "My ambition main is mechanical engineering study university.",
                "Ambition I have engineering university main.",
              ],
              distractorNotes: ["Wrong word order", "Not a sentence"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best polite question about the reference letter:",
              skillTag: "writing",
              topicTag,
              explanation: "Could you tell me when you will upload my reference letter?",
              correct: "Could you tell me when you will upload my reference letter?",
              wrong: [
                "Upload reference letter when you?",
                "Tell me reference now upload.",
              ],
              distractorNotes: ["Wrong order", "Too direct"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-scholarship-review",
          title: "Review: Scholarship Email Quiz",
          instructions: "Choose the best way to complete each writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Ms Phuong, | I have [0] three competitions this year. | The [1] is 15 May. | [2] you for your help, | Minh",
              skillTag: "writing",
              topicTag,
              explanation: "entered; deadline; Thank — ôn khung email.",
              template:
                "Dear Ms Phuong,\n\nI have [0] three competitions this year. The [1] is 15 May.\n\n[2] you for your help,\nMinh",
              correctAnswers: ["entered", "deadline", "Thank"],
              acceptableAnswers: [
                ["entered", "Entered"],
                ["deadline", "Deadline"],
                ["Thank", "Thanks", "thank", "thanks"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-career-plans",
      title: "Lesson 2: Write About Career Plans",
      learningObjective:
        "Write connected sentences about career plans using second conditional.",
      estimatedMinutes: 26,
      exercises: [
        buildExercise({
          slug: "writing-career-learn",
          title: "Learn: Second Conditional Frames",
          instructions: "Complete sentences about hypothetical plans.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: If I [0] a scholarship, I [1] enrol abroad. | If I [2] enough support, I [3] study in Vietnam first.",
              skillTag: "writing",
              topicTag,
              explanation: "got/received; would; didn't get; would — second conditional.",
              template:
                "If I [0] a scholarship, I [1] enrol abroad. If I [2] enough support, I [3] study in Vietnam first.",
              correctAnswers: ["got", "would", "didn't get", "would"],
              acceptableAnswers: [
                ["got", "received", "Got", "Received"],
                ["would", "Would"],
                ["didn't get", "did not get", "Didn't get"],
                ["would", "Would"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-career-practice",
          title: "Practice: Connect Career Ideas",
          instructions: "Put words in order to make career plan sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: Last year / I / visited / a university / open day.",
              skillTag: "writing",
              topicTag,
              explanation: "Last year I visited a university open day. — past simple.",
              words: ["Last year", "I", "visited", "a university", "open day."],
              correctOrder: [0, 1, 2, 3, 4],
              difficultyRating: 2,
            }),
          ],
        }),
        careerCheck,
        buildExercise({
          slug: "writing-career-apply",
          title: "Apply: Best Career Plan Message",
          instructions: "Choose the best short note about career plans.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best note to a friend about career ambition:",
              skillTag: "writing",
              topicTag,
              explanation: "Ambition + conditional + past experience — đủ nội dung B1.",
              correct:
                "My ambition is to become an engineer. If I got a scholarship, I would study abroad. Last year I visited a university open day, which helped me decide.",
              wrong: [
                "Engineer scholarship abroad visit university.",
                "If I get scholarship I study abroad last year visit.",
              ],
              distractorNotes: ["Not sentences", "Mixed tenses wrongly"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-career-review",
          title: "Review: Career Writing Frames",
          instructions: "Complete the career writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I [0] wanted to be an engineer since primary school. | [1] year I visited an open day. | If tuition [2] lower, more students [3] apply abroad.",
              skillTag: "writing",
              topicTag,
              explanation: "have; Last; were; would — mixed tenses.",
              template:
                "I [0] wanted to be an engineer since primary school. [1] year I visited an open day. If tuition [2] lower, more students [3] apply abroad.",
              correctAnswers: ["have", "Last", "were", "would"],
              acceptableAnswers: [
                ["have", "Have"],
                ["Last", "last"],
                ["were", "Were", "was", "Was"],
                ["would", "Would"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-future-study",
      title: "Lesson 3: My Future Study Plan",
      learningObjective:
        "Write a connected message about education plans, opinions and preparation.",
      estimatedMinutes: 27,
      exercises: [
        buildExercise({
          slug: "writing-future-learn",
          title: "Learn: Opinion and Experience Frames",
          instructions: "Complete sentences with opinions and experiences.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Tuition fees abroad [0] me. | I don't think scholarships are only for [1] students. | I [2] entered two competitions this year.",
              skillTag: "writing",
              topicTag,
              explanation: "worry/concern; perfect; have — opinion + present perfect.",
              template:
                "Tuition fees abroad [0] me. I don't think scholarships are only for [1] students. I [2] entered two competitions this year.",
              correctAnswers: ["worry", "perfect", "have"],
              acceptableAnswers: [
                ["worry", "Worry", "concern", "Concern"],
                ["perfect", "Perfect"],
                ["have", "Have"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-future-practice",
          title: "Practice: Order Study Plan Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: I / have gained / useful qualifications / in computer programming.",
              skillTag: "writing",
              topicTag,
              explanation: "I have gained useful qualifications in computer programming.",
              words: ["I", "have gained", "useful qualifications", "in computer programming."],
              correctOrder: [0, 1, 2, 3],
              difficultyRating: 2,
            }),
          ],
        }),
        futureCheck,
        buildExercise({
          slug: "writing-future-apply",
          title: "Apply: Choose the Best Study Message",
          instructions: "Choose the best way to describe your future study plan.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best opening for a message to a pen friend:",
              skillTag: "writing",
              topicTag,
              explanation: "University plan + tuition concern + experience — mở đầu B1.",
              correct:
                "I want to study engineering at a good university, but tuition fees abroad worry me. I have entered science competitions this year, and last month I spoke to our careers adviser.",
              wrong: [
                "University tuition scholarship engineer fifteen.",
                "I want study since for tuition scholarship perfect.",
              ],
              distractorNotes: ["Not connected", "Ungrammatical"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence expressing an opinion:",
              skillTag: "writing",
              topicTag,
              explanation: "I don't think that's fair — opinion rõ ràng.",
              correct: "I don't think scholarships are only for perfect students.",
              wrong: [
                "Scholarships perfect students only think I don't.",
                "Perfect students scholarships only fair not.",
              ],
              distractorNotes: ["Wrong order", "Not a sentence"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-future-review",
          title: "Review: Future Study Frames",
          instructions: "Complete a short future study plan frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: My [0] is to get a mechanical engineering [1]. | A [2] could cover my [3] fees. | Hard work and clear ambitions [4] too.",
              skillTag: "writing",
              topicTag,
              explanation: "ambition; degree; scholarship; tuition; matter — ôn từ vựng unit.",
              template:
                "My [0] is to get a mechanical engineering [1]. A [2] could cover my [3] fees. Hard work and clear ambitions [4] too.",
              correctAnswers: ["ambition", "degree", "scholarship", "tuition", "matter"],
              acceptableAnswers: [
                ["ambition", "Ambition"],
                ["degree", "Degree"],
                ["scholarship", "Scholarship"],
                ["tuition", "Tuition"],
                ["matter", "Matter", "count", "Count"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
