/** Flyers U5 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [labCheck, inventionCheck, spaceCheck] = writingChecks;

  return [
    {
      slug: "writing-laboratory",
      title: "Lesson 1: Write About the Laboratory",
      learningObjective:
        "Use frames to write about experiments in the laboratory with test and result.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-lab-learn",
          title: "Learn: Laboratory Writing Frames",
          instructions: "Complete the sentences about the laboratory.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: We work in the [0]. | We [1] two batteries. | We write the [2] in our notebook.",
              skillTag: "writing",
              topicTag,
              explanation: "laboratory; test; result — khung viết về phòng lab.",
              template:
                "We work in the [0]. We [1] two batteries. We write the [2] in our notebook.",
              correctAnswers: ["laboratory", "test", "result"],
              acceptableAnswers: [
                ["laboratory", "Laboratory", "lab", "Lab"],
                ["test", "Test"],
                ["result", "Result", "results", "Results"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-lab-practice",
          title: "Practice: Order Lab Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: Linh / looked / through / the / microscope / at / tiny / wires.",
              skillTag: "writing",
              topicTag,
              explanation: "Linh looked through the microscope at tiny wires.",
              words: ["Linh", "looked", "through", "the", "microscope", "at", "tiny", "wires."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
              difficultyRating: 2,
            }),
          ],
        }),
        labCheck,
        buildExercise({
          slug: "writing-lab-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence about the experiment:",
              skillTag: "writing",
              topicTag,
              explanation: "Test batteries + result — câu hoàn chỉnh Flyers U5.",
              correct:
                "Minh and Linh test two batteries in the laboratory and write each result in their notebook.",
              wrong: [
                "Minh test battery laboratory result write notebook.",
                "Linh microscope tiny wires test boring television.",
              ],
              distractorNotes: ["Fragment", "Mixed unrelated words"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about the second result:",
              skillTag: "writing",
              topicTag,
              explanation: "Might be better — might + base verb.",
              correct: "The second result might be better tomorrow.",
              wrong: [
                "The second result might be better tomorrow is might.",
                "Second result might better tomorrow the.",
              ],
              distractorNotes: ["Word order wrong", "Fragment"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-lab-review",
          title: "Review: Laboratory Writing Mix",
          instructions: "Choose the best written answer.",
          exerciseType: "multiple_choice",
          sortOrder: 4,
          questions: [
            buildMcq({
              questionText: "Best report about the science project:",
              skillTag: "writing",
              topicTag,
              explanation: "Laboratory + experiment + research — đầy đủ.",
              correct:
                "Our science project is in the school laboratory. We do research about electricity and test two batteries for energy.",
              wrong: [
                "Science project laboratory electricity test energy.",
                "We enjoy to watch experiment in laboratory result.",
              ],
              distractorNotes: ["Fragment", "Enjoy to (×) + mixed"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence using scientist and experiment:",
              skillTag: "writing",
              topicTag,
              explanation: "Good scientists check work — câu hoàn chỉnh.",
              correct: "Good scientists always check their experiment and write the result carefully.",
              wrong: ["Scientist experiment result check careful always.", "Scientists is check experiment result."],
              distractorNotes: ["Fragment", "Grammar wrong"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-inventions",
      title: "Lesson 2: Write About Inventions",
      learningObjective:
        "Write about inventions using was built/was invented and could/might.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-invention-learn",
          title: "Learn: Invention Writing Frames",
          instructions: "Complete sentences about inventions.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: The robot was [0] by our class. | The telescope was [1] long ago. | The invention might [2] a prize.",
              skillTag: "writing",
              topicTag,
              explanation: "built; invented; win — passive + might + verb.",
              template:
                "The robot was [0] by our class. The telescope was [1] long ago. The invention might [2] a prize.",
              correctAnswers: ["built", "invented", "win"],
              acceptableAnswers: [
                ["built", "Built"],
                ["invented", "Invented"],
                ["win", "Win", "get", "Get"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-invention-practice",
          title: "Practice: Order Invention Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: The / robot / was / built / by / twelve / students.",
              skillTag: "writing",
              topicTag,
              explanation: "The robot was built by twelve students.",
              words: ["The", "robot", "was", "built", "by", "twelve", "students."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6],
              difficultyRating: 2,
            }),
          ],
        }),
        inventionCheck,
        buildExercise({
          slug: "writing-invention-apply",
          title: "Apply: Choose Best Invention Sentence",
          instructions: "Choose the best sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence about the robot:",
              skillTag: "writing",
              topicTag,
              explanation: "Was built + might need electricity — logic rõ.",
              correct:
                "Our robot was built last week, and it might need more electricity to move in the laboratory.",
              wrong: [
                "Robot built might electricity need laboratory move.",
                "The robot was build and might needs electricity.",
              ],
              distractorNotes: ["Fragment", "Build + might needs (×)"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about the science fair:",
              skillTag: "writing",
              topicTag,
              explanation: "Could present experiment — could + base verb.",
              correct: "We could present our experiment at the invention fair next Friday.",
              wrong: ["We could to present experiment fair Friday.", "Present could experiment we fair."],
              distractorNotes: ["Could + to (×)", "Fragment"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-invention-review",
          title: "Review: Invention Writing Mix",
          instructions: "Choose the best written answer.",
          exerciseType: "multiple_choice",
          sortOrder: 4,
          questions: [
            buildMcq({
              questionText: "Best note about the class invention:",
              skillTag: "writing",
              topicTag,
              explanation: "Invention + was built + machine — đầy đủ.",
              correct:
                "Our invention is a small robot. It was built by the whole class and the machine might win first prize at the fair.",
              wrong: [
                "Invention robot built class machine prize fair might.",
                "The robot was invent by class and might wins prize.",
              ],
              distractorNotes: ["Fragment", "Invent + might wins (×)"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence comparing microscope and telescope:",
              skillTag: "writing",
              topicTag,
              explanation: "Microscope for tiny things; telescope was invented for space.",
              correct:
                "The microscope was invented to see tiny cells, and the telescope was invented to discover planets in space.",
              wrong: [
                "Microscope telescope invented tiny space discover cells planets.",
                "The microscope was invent and telescope discover space tiny.",
              ],
              distractorNotes: ["Fragment", "Invent not participle"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-space-discovery",
      title: "Lesson 3: Write About Space and Discovery",
      learningObjective:
        "Write about space, discovery and curiosity using could/might.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-space-learn",
          title: "Learn: Space Writing Frames",
          instructions: "Complete sentences about space and discovery.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Scientists [0] new planets. | We could do [1] about the moon. | Minh is [2] about space.",
              skillTag: "writing",
              topicTag,
              explanation: "discover; research; curious — khung viết về vũ trụ.",
              template:
                "Scientists [0] new planets. We could do [1] about the moon. Minh is [2] about space.",
              correctAnswers: ["discover", "research", "curious"],
              acceptableAnswers: [
                ["discover", "Discover"],
                ["research", "Research"],
                ["curious", "Curious"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-space-practice",
          title: "Practice: Order Space Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: We / might / discover / a / new / planet / with / the / telescope.",
              skillTag: "writing",
              topicTag,
              explanation: "We might discover a new planet with the telescope.",
              words: ["We", "might", "discover", "a", "new", "planet", "with", "the", "telescope."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              difficultyRating: 2,
            }),
          ],
        }),
        spaceCheck,
        buildExercise({
          slug: "writing-space-apply",
          title: "Apply: Choose Best Space Sentence",
          instructions: "Choose the best sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best paragraph about space:",
              skillTag: "writing",
              topicTag,
              explanation: "Planet + telescope + discover — đủ ý.",
              correct:
                "Minh is curious about planets in space. A scientist used a telescope to discover new worlds, and we might do research about the moon.",
              wrong: [
                "Space planet telescope discover moon research curious might.",
                "Minh curious space might discover planet telescope was invent.",
              ],
              distractorNotes: ["Fragment", "Invent not participle"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about energy from the sun:",
              skillTag: "writing",
              topicTag,
              explanation: "Sun gives energy — câu hoàn chỉnh.",
              correct: "We discovered that the sun gives energy to our small machine in the science project.",
              wrong: ["Sun energy discover machine science project small gives.", "The sun might gives energy discover we."],
              distractorNotes: ["Fragment", "Might gives (×)"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-space-review",
          title: "Review: Space Writing Mix",
          instructions: "Choose the best written answer.",
          exerciseType: "multiple_choice",
          sortOrder: 4,
          questions: [
            buildMcq({
              questionText: "Best email combining lab and space topics:",
              skillTag: "writing",
              topicTag,
              explanation: "Laboratory + project + space + could/might — review toàn unit.",
              correct:
                "We work on our science project in the laboratory and test batteries for energy. Our robot was built by the class. I am curious about space and we might use the telescope to discover a new planet.",
              wrong: [
                "Laboratory project energy robot built space telescope discover planet curious.",
                "We might discovers planet and robot was build in laboratory science.",
              ],
              distractorNotes: ["Fragment", "Might discovers + was build (×)"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best closing sentence for a science report:",
              skillTag: "writing",
              topicTag,
              explanation: "Could present + result — kết thúc tự nhiên.",
              correct: "We could present our result at the invention fair because our experiment was built carefully.",
              wrong: ["Could present result fair experiment built carefully we.", "We could to present result might built experiment."],
              distractorNotes: ["Word order wrong", "Could to (×)"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
