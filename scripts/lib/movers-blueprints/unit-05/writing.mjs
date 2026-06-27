/** Movers U5 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [plansCheck, pastCheck, travelCheck] = writingChecks;

  return [
    {
      slug: "writing-holiday-plans",
      title: "Lesson 1: Write About Holiday Plans",
      learningObjective:
        "Use going to frames to write about future holiday plans.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-plans-learn",
          title: "Learn: Plan Writing Frames",
          instructions: "Complete the sentences about holiday plans.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: We [0] going to visit the beach. | Minh [1] going to pack his suitcase. | They [2] going to travel by train. | [3] you going to forget your passport?",
              skillTag: "writing",
              topicTag,
              explanation: "are; is; are; Are — khung viết going to.",
              template:
                "We [0] going to visit the beach. Minh [1] going to pack his suitcase. They [2] going to travel by train. [3] you going to forget your passport?",
              correctAnswers: ["are", "is", "are", "Are"],
              acceptableAnswers: [
                ["are", "Are"],
                ["is", "Is"],
                ["are", "Are"],
                ["Are", "are"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-plans-practice",
          title: "Practice: Order Plan Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: We / are / going / to / visit / the / beach / and / mountains.",
              skillTag: "writing",
              topicTag,
              explanation: "We are going to visit the beach and mountains.",
              words: ["We", "are", "going", "to", "visit", "the", "beach", "and", "mountains."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              difficultyRating: 2,
            }),
          ],
        }),
        plansCheck,
        buildExercise({
          slug: "writing-plans-apply",
          title: "Apply: Choose the Best Plan Message",
          instructions: "Choose the best written message about plans.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best message about holiday plans:",
              skillTag: "writing",
              topicTag,
              explanation: "Going to visit + travel by train — đúng cấu trúc.",
              correct:
                "We're going to visit the beach. We're going to travel by train and stay at a hotel.",
              wrong: ["Visit beach we going train hotel.", "We going to visited the beach tomorrow."],
              distractorNotes: ["Không thành câu", "Sai thì"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about packing:",
              skillTag: "writing",
              topicTag,
              explanation: "I'm going to pack my passport and tickets — đúng.",
              correct: "I'm going to pack my passport and train tickets in my suitcase.",
              wrong: ["I pack going to passport tickets.", "I going to packed my suitcase."],
              distractorNotes: ["Sai trật tự", "Sai quá khứ"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-plans-review",
          title: "Review: Plan Writing Quiz",
          instructions: "Complete the plan writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dad says we [0] going to visit the mountains. | Mum [1] going to put the tickets in her bag. | We [2] going to stay at a hotel near the [3].",
              skillTag: "writing",
              topicTag,
              explanation: "are; is; are; beach — kế hoạch nghỉ.",
              template:
                "Dad says we [0] going to visit the mountains. Mum [1] going to put the tickets in her bag. We [2] going to stay at a hotel near the [3].",
              correctAnswers: ["are", "is", "are", "beach"],
              acceptableAnswers: [
                ["are", "Are"],
                ["is", "Is"],
                ["are", "Are"],
                ["beach", "Beach"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-past-holiday",
      title: "Lesson 2: Write About a Past Holiday",
      learningObjective:
        "Write connected sentences about a past trip using went, saw, had.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-past-learn",
          title: "Learn: Past Holiday Frames",
          instructions: "Complete sentences with went, saw or had.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Last summer we [0] to the mountains. | Minh [1] a waterfall. | We [2] a picnic. | We [3] fish for lunch.",
              skillTag: "writing",
              topicTag,
              explanation: "went; saw; had; had — quá khứ.",
              template:
                "Last summer we [0] to the mountains. Minh [1] a waterfall. We [2] a picnic. We [3] fish for lunch.",
              correctAnswers: ["went", "saw", "had", "had"],
              acceptableAnswers: [
                ["went", "Went"],
                ["saw", "Saw"],
                ["had", "Had"],
                ["had", "Had"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-past-practice",
          title: "Practice: Order Past Sentences",
          instructions: "Put words in order to make past holiday sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: Last / year / we / went / to / the / mountains / with / Dad.",
              skillTag: "writing",
              topicTag,
              explanation: "Last year we went to the mountains with Dad.",
              words: ["Last", "year", "we", "went", "to", "the", "mountains", "with", "Dad."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              difficultyRating: 2,
            }),
          ],
        }),
        pastCheck,
        buildExercise({
          slug: "writing-past-apply",
          title: "Apply: Best Past Holiday Note",
          instructions: "Choose the best short note about a past holiday.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best note about a past holiday:",
              skillTag: "writing",
              topicTag,
              explanation: "Went, saw, had — đủ quá khứ và từ vựng unit.",
              correct:
                "Last summer we went to the mountains. I saw a waterfall and we had a picnic. It was wonderful!",
              wrong: ["We go to mountains saw waterfall had picnic.", "Last summer we going to went mountains."],
              distractorNotes: ["Sai thì", "Sai cấu trúc"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-past-review",
          title: "Review: Past Holiday Frames",
          instructions: "Complete the past holiday writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: First we [0] to the mountains. | Then we [1] a big waterfall. | We [2] a picnic by the lake. | Finally we [3] to the beach.",
              skillTag: "writing",
              topicTag,
              explanation: "went; saw; had; went — thứ tự quá khứ.",
              template:
                "First we [0] to the mountains. Then we [1] a big waterfall. We [2] a picnic by the lake. Finally we [3] to the beach.",
              correctAnswers: ["went", "saw", "had", "went"],
              acceptableAnswers: [
                ["went", "Went"],
                ["saw", "Saw"],
                ["had", "Had"],
                ["went", "Went"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-travel-day",
      title: "Lesson 3: Write About Travel Day",
      learningObjective:
        "Write a short message about travelling with first/then order.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-travel-learn",
          title: "Learn: Travel Day Frames",
          instructions: "Complete sentences about a travel day.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: First we take a [0] to the station. | Then we get on the [1]. | We're going to stay at a [2] near the beach. | Don't forget your [3]!",
              skillTag: "writing",
              topicTag,
              explanation: "boat; train; hotel; passport — ngày đi.",
              template:
                "First we take a [0] to the station. Then we get on the [1]. We're going to stay at a [2] near the beach. Don't forget your [3]!",
              correctAnswers: ["boat", "train", "hotel", "passport"],
              acceptableAnswers: [
                ["boat", "Boat"],
                ["train", "Train"],
                ["hotel", "Hotel"],
                ["passport", "Passport"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-travel-practice",
          title: "Practice: Order Travel Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: First / the / boat / to / the / station. / Then / the / train / to / the / hotel.",
              skillTag: "writing",
              topicTag,
              explanation: "First the boat to the station. Then the train to the hotel.",
              words: ["First", "the", "boat", "to", "the", "station.", "Then", "the", "train", "to", "the", "hotel."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              difficultyRating: 2,
            }),
          ],
        }),
        travelCheck,
        buildExercise({
          slug: "writing-travel-apply",
          title: "Apply: Choose the Best Travel Paragraph",
          instructions: "Choose the best short message about travel day.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best message about travel day:",
              skillTag: "writing",
              topicTag,
              explanation: "First boat, then train, hotel — thứ tự rõ.",
              correct:
                "First we take a boat to the station. Then we get on the train with our tickets. We're going to stay at a hotel near the beach.",
              wrong: ["Boat train hotel tickets first then.", "We take boat station train hotel going to stayed."],
              distractorNotes: ["Không thành câu", "Sai trật tự/thì"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence mixing past and plans:",
              skillTag: "writing",
              topicTag,
              explanation: "Last year went by train; this year going to visit again.",
              correct: "Last year we went by train. This year we're going to visit the beach again.",
              wrong: ["Last year we going to went train. This year we saw visit beach.", "We went going to train beach last this year."],
              distractorNotes: ["Sai cấu trúc", "Sai trật tự"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-travel-review",
          title: "Review: Travel Day Frames",
          instructions: "Complete a short travel day frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Minh packs his [0] with a map. | Mum puts the [1] in her bag. | On the train they look at the [2]. | They arrive at the [3] near the beach.",
              skillTag: "writing",
              topicTag,
              explanation: "suitcase; tickets; map; hotel — ôn viết hành trình.",
              template:
                "Minh packs his [0] with a map. Mum puts the [1] in her bag. On the train they look at the [2]. They arrive at the [3] near the beach.",
              correctAnswers: ["suitcase", "tickets", "map", "hotel"],
              acceptableAnswers: [
                ["suitcase", "Suitcase"],
                ["tickets", "Tickets", "ticket", "Ticket"],
                ["map", "Map"],
                ["hotel", "Hotel"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
