/** Flyers U2 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [ecoCheck, rulesCheck, cleanupCheck] = writingChecks;

  return [
    {
      slug: "writing-eco-project",
      title: "Lesson 1: Write About an Eco Project",
      learningObjective:
        "Use frames to write about recycling with passive forms.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-eco-learn",
          title: "Learn: Eco Writing Frames",
          instructions: "Complete the sentences about the eco club.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Every Friday plastic waste is [0]. | New bins are [1] from recycled plastic. | Paper is [2] too.",
              skillTag: "writing",
              topicTag,
              explanation: "collected/recycled; made; recycled — khung bị động.",
              template:
                "Every Friday plastic waste is [0]. New bins are [1] from recycled plastic. Paper is [2] too.",
              correctAnswers: ["collected", "made", "recycled"],
              acceptableAnswers: [
                ["collected", "Collected", "recycled", "Recycled"],
                ["made", "Made"],
                ["recycled", "Recycled"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-eco-practice",
          title: "Practice: Order Eco Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: Plastic / is / recycled / at / our / school.",
              skillTag: "writing",
              topicTag,
              explanation: "Plastic is recycled at our school.",
              words: ["Plastic", "is", "recycled", "at", "our", "school."],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
          ],
        }),
        ecoCheck,
        buildExercise({
          slug: "writing-eco-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence about recycling at school:",
              skillTag: "writing",
              topicTag,
              explanation: "Passive + must rule — chuẩn Flyers U2.",
              correct:
                "Plastic is recycled on Fridays and we must sort waste carefully.",
              wrong: [
                "Plastic is recycle on Fridays and we must to sort waste.",
                "Plastic are recycled and we must sorts waste.",
              ],
              distractorNotes: ["Wrong participle and must+to", "Agreement errors"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about what is made:",
              skillTag: "writing",
              topicTag,
              explanation: "New bins are made from recycled plastic.",
              correct: "New bins are made from recycled plastic.",
              wrong: [
                "New bins is made from recycled plastic.",
                "New bins are make from recycled plastic.",
              ],
              distractorNotes: ["Singular verb with bins", "Wrong participle"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-eco-review",
          title: "Review: Eco Writing Quiz",
          instructions: "Choose the best way to complete each writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Our eco club [0] nature. The plastic [1] every week. We [2] throw rubbish on the ground.",
              skillTag: "writing",
              topicTag,
              explanation: "protects; is recycled; mustn't — ôn khung viết.",
              template:
                "Our eco club [0] nature. The plastic [1] every week. We [2] throw rubbish on the ground.",
              correctAnswers: ["protects", "is recycled", "mustn't"],
              acceptableAnswers: [
                ["protects", "Protects", "helps protect", "Helps protect"],
                ["is recycled", "Is recycled"],
                ["mustn't", "Mustn't", "must not", "Must not"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-eco-rules",
      title: "Lesson 2: Write Eco Rules",
      learningObjective:
        "Write connected sentences with must and mustn't about the environment.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-rules-learn",
          title: "Learn: Rule Sentences",
          instructions: "Complete sentences with must or mustn't.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: We [0] protect rainforests. | You [1] drop plastic in the ocean. | Students [2] wear gloves during cleanup.",
              skillTag: "writing",
              topicTag,
              explanation: "must; mustn't; must — quy tắc môi trường.",
              template:
                "We [0] protect rainforests. You [1] drop plastic in the ocean. Students [2] wear gloves during cleanup.",
              correctAnswers: ["must", "mustn't", "must"],
              acceptableAnswers: [
                ["must", "Must"],
                ["mustn't", "Mustn't", "must not", "Must not"],
                ["must", "Must"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-rules-practice",
          title: "Practice: Connect Rule Ideas",
          instructions: "Put words in order to make rule sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: We / must / put / rubbish / in / the / right / bins.",
              skillTag: "writing",
              topicTag,
              explanation: "We must put rubbish in the right bins.",
              words: ["We", "must", "put", "rubbish", "in", "the", "right", "bins."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
              difficultyRating: 2,
            }),
          ],
        }),
        rulesCheck,
        buildExercise({
          slug: "writing-rules-apply",
          title: "Apply: Best Rule Notice",
          instructions: "Choose the best short notice.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best notice for the eco club:",
              skillTag: "writing",
              topicTag,
              explanation: "Must + mustn't + environment words — đủ Flyers.",
              correct:
                "We must recycle plastic and paper. We mustn't drop waste in the lake. Please protect nature!",
              wrong: [
                "Recycle must plastic lake nature.",
                "We must to recycle and mustn't drops waste.",
              ],
              distractorNotes: ["Not sentences", "Grammar errors"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-rules-review",
          title: "Review: Rule Writing Frames",
          instructions: "Complete the rule writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: The earth [0] stay clean. | We [1] waste clean water. | Everyone [2] help protect the environment.",
              skillTag: "writing",
              topicTag,
              explanation: "must; mustn't; must — ôn quy tắc viết.",
              template:
                "The earth [0] stay clean. We [1] waste clean water. Everyone [2] help protect the environment.",
              correctAnswers: ["must", "mustn't", "must"],
              acceptableAnswers: [
                ["must", "Must"],
                ["mustn't", "Mustn't", "must not", "Must not"],
                ["must", "Must"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-cleanup-note",
      title: "Lesson 3: Write About a Cleanup",
      learningObjective:
        "Write a short connected message about community cleanup and the planet.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "writing-cleanup-learn",
          title: "Learn: Cleanup Writing Frames",
          instructions: "Complete sentences about cleanup and the earth.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: On Sunday we helped with a community [0]. | We collected [1] waste in bags. | A clean [2] is important for everyone.",
              skillTag: "writing",
              topicTag,
              explanation: "cleanup; plastic; earth — khung buổi dọn dẹp.",
              template:
                "On Sunday we helped with a community [0]. We collected [1] waste in bags. A clean [2] is important for everyone.",
              correctAnswers: ["cleanup", "plastic", "earth"],
              acceptableAnswers: [
                ["cleanup", "Cleanup", "clean-up", "Clean-up"],
                ["plastic", "Plastic"],
                ["earth", "Earth", "planet", "Planet"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-cleanup-practice",
          title: "Practice: Order Cleanup Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: Small / actions / can / protect / our / planet / for / the / future.",
              skillTag: "writing",
              topicTag,
              explanation: "Small actions can protect our planet for the future.",
              words: [
                "Small",
                "actions",
                "can",
                "protect",
                "our",
                "planet",
                "for",
                "the",
                "future.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              difficultyRating: 2,
            }),
          ],
        }),
        cleanupCheck,
        buildExercise({
          slug: "writing-cleanup-apply",
          title: "Apply: Choose the Best Cleanup Note",
          instructions: "Choose the best way to describe a cleanup.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best opening for a pen-friend message:",
              skillTag: "writing",
              topicTag,
              explanation: "Where + what + why — mở đầu rõ Flyers U2.",
              correct:
                "On Sunday Mum, Linh and I helped with a cleanup near West Lake. We collected plastic waste.",
              wrong: [
                "Cleanup Sunday plastic earth planet must.",
                "I am cleanup near lake yesterday plastic recycle.",
              ],
              distractorNotes: ["Not connected", "Wrong grammar"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence with passive form:",
              skillTag: "writing",
              topicTag,
              explanation: "The plastic is recycled at school — bị động đúng.",
              correct: "The plastic is recycled at our school.",
              wrong: [
                "The plastic is recycle at our school.",
                "The plastic are recycled at our school.",
              ],
              distractorNotes: ["Wrong participle", "Wrong be verb"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-cleanup-review",
          title: "Review: Cleanup Writing Frames",
          instructions: "Complete a short cleanup message frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Pollution hurts fish in the [0]. | The plastic [1] at school. | We [2] protect our planet.",
              skillTag: "writing",
              topicTag,
              explanation: "ocean; is recycled; must — ôn từ vựng và ngữ pháp.",
              template:
                "Pollution hurts fish in the [0]. The plastic [1] at school. We [2] protect our planet.",
              correctAnswers: ["ocean", "is recycled", "must"],
              acceptableAnswers: [
                ["ocean", "Ocean"],
                ["is recycled", "Is recycled"],
                ["must", "Must"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
