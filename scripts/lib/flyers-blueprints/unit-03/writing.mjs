/** Flyers U3 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [festivalCheck, schoolCheck, paradeCheck] = writingChecks;

  return [
    {
      slug: "writing-festival-holiday",
      title: "Lesson 1: Write About a Festival",
      learningObjective:
        "Use frames to write about celebrating a festival with went, saw, had.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-festival-learn",
          title: "Learn: Festival Writing Frames",
          instructions: "Complete the sentences about Tet.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Last Tet we [0] to grandparents' house. | When we arrived, we [1] decorations. | We [2] a big family party.",
              skillTag: "writing",
              topicTag,
              explanation: "went; saw; had — khung quá khứ bất quy tắc.",
              template:
                "Last Tet we [0] to grandparents' house. When we arrived, we [1] decorations. We [2] a big family party.",
              correctAnswers: ["went", "saw", "had"],
              acceptableAnswers: [
                ["went", "Went"],
                ["saw", "Saw"],
                ["had", "Had"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-festival-practice",
          title: "Practice: Order Festival Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: When / we / arrived, / we / saw / lucky / money.",
              skillTag: "writing",
              topicTag,
              explanation: "When we arrived, we saw lucky money.",
              words: ["When", "we", "arrived,", "we", "saw", "lucky", "money."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6],
              difficultyRating: 2,
            }),
          ],
        }),
        festivalCheck,
        buildExercise({
          slug: "writing-festival-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence about Tet traditions:",
              skillTag: "writing",
              topicTag,
              explanation: "When-clause + tradition word — chuẩn Flyers U3.",
              correct:
                "When we arrived, we saw red decorations. Giving lucky money is an old custom.",
              wrong: [
                "When we arrive we see decoration custom lucky.",
                "We goed to Tet and haved tradition custom.",
              ],
              distractorNotes: ["Not connected sentences", "Goed/haved wrong"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about the parade:",
              skillTag: "writing",
              topicTag,
              explanation: "We went to the parade and saw music and dance.",
              correct: "We went to the city centre and saw a parade with music and dance.",
              wrong: [
                "We go to parade yesterday and see fireworks.",
                "Went parade city music dance saw.",
              ],
              distractorNotes: ["Tense errors", "Fragment"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-festival-review",
          title: "Review: Festival Writing Quiz",
          instructions: "Choose the best way to complete each writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: We [0] to the parade. | When the parade finished, we [1] fireworks. | It was a wonderful [2].",
              skillTag: "writing",
              topicTag,
              explanation: "went; saw; holiday — ôn khung viết lễ hội.",
              template:
                "We [0] to the parade. When the parade finished, we [1] fireworks. It was a wonderful [2].",
              correctAnswers: ["went", "saw", "holiday"],
              acceptableAnswers: [
                ["went", "Went"],
                ["saw", "Saw"],
                ["holiday", "Holiday", "festival", "Festival"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-school-festival",
      title: "Lesson 2: Write About the School Festival",
      learningObjective:
        "Write connected sentences about planning a culture festival.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-school-learn",
          title: "Learn: School Festival Frames",
          instructions: "Complete sentences about the culture club.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: We must plan our culture [0]. | Each class will wear a [1]. | Live [2] will play on stage.",
              skillTag: "writing",
              topicTag,
              explanation: "festival; costume; music — lễ hội trường.",
              template:
                "We must plan our culture [0]. Each class will wear a [1]. Live [2] will play on stage.",
              correctAnswers: ["festival", "costume", "music"],
              acceptableAnswers: [
                ["festival", "Festival"],
                ["costume", "Costume"],
                ["music", "Music"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-school-practice",
          title: "Practice: Connect Festival Ideas",
          instructions: "Put words in order to make sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: When / we / arrive, / we / will / set / up / the / stage.",
              skillTag: "writing",
              topicTag,
              explanation: "When we arrive, we will set up the stage.",
              words: ["When", "we", "arrive,", "we", "will", "set", "up", "the", "stage."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              difficultyRating: 2,
            }),
          ],
        }),
        schoolCheck,
        buildExercise({
          slug: "writing-school-apply",
          title: "Apply: Best Festival Notice",
          instructions: "Choose the best short notice.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best notice for the culture festival:",
              skillTag: "writing",
              topicTag,
              explanation: "Costume + music + when arrive — đủ Flyers U3.",
              correct:
                "Our festival is next month. Wear a traditional costume. When we arrive at the gym, we will set up the stage and play music.",
              wrong: [
                "Festival costume music dance next.",
                "When we arrived we will costume festival music.",
              ],
              distractorNotes: ["Not sentences", "Mixed tenses"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-school-review",
          title: "Review: School Festival Writing Frames",
          instructions: "Complete the festival notice frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: We can [0] national traditions. | Linh learned a [1] for the show. | After the show we will have a small [2].",
              skillTag: "writing",
              topicTag,
              explanation: "celebrate; dance; party — ôn từ vựng viết.",
              template:
                "We can [0] national traditions. Linh learned a [1] for the show. After the show we will have a small [2].",
              correctAnswers: ["celebrate", "dance", "party"],
              acceptableAnswers: [
                ["celebrate", "Celebrate"],
                ["dance", "Dance"],
                ["party", "Party"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-parade-note",
      title: "Lesson 3: Write About the Parade",
      learningObjective:
        "Write a short connected message about watching a national parade.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "writing-parade-learn",
          title: "Learn: Parade Writing Frames",
          instructions: "Complete sentences about the parade.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: We [0] early to see the national [1]. | When the band passed, I [2] our school flag.",
              skillTag: "writing",
              topicTag,
              explanation: "went; parade; saw — khung diễu hành.",
              template:
                "We [0] early to see the national [1]. When the band passed, I [2] our school flag.",
              correctAnswers: ["went", "parade", "saw"],
              acceptableAnswers: [
                ["went", "Went"],
                ["parade", "Parade"],
                ["saw", "Saw"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-parade-practice",
          title: "Practice: Order Parade Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: Tonight / we / will / watch / fireworks / by / the / lake.",
              skillTag: "writing",
              topicTag,
              explanation: "Tonight we will watch fireworks by the lake.",
              words: [
                "Tonight",
                "we",
                "will",
                "watch",
                "fireworks",
                "by",
                "the",
                "lake.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
              difficultyRating: 2,
            }),
          ],
        }),
        paradeCheck,
        buildExercise({
          slug: "writing-parade-apply",
          title: "Apply: Choose the Best Parade Email",
          instructions: "Choose the best way to describe the parade.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best opening for a pen-friend email:",
              skillTag: "writing",
              topicTag,
              explanation: "When arrived + saw + national parade — mở đầu rõ Flyers U3.",
              correct:
                "On the national holiday we went early. When we arrived, we saw dancers in bright costumes and heard live music.",
              wrong: [
                "Parade national costume music flag went saw.",
                "I am parade yesterday and seed fireworks custom.",
              ],
              distractorNotes: ["Not connected", "Seed wrong past"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence with when-clause:",
              skillTag: "writing",
              topicTag,
              explanation: "When we saw the fireworks, we clapped loudly.",
              correct: "When we saw the fireworks, we clapped loudly.",
              wrong: [
                "When we see the fireworks, we clapped loudly.",
                "When we saw the fireworks we clap loudly.",
              ],
              distractorNotes: ["See → saw", "Clap → clapped"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-parade-review",
          title: "Review: Parade Writing Frames",
          instructions: "Complete a short parade message frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: The [0] parade was exciting. | Dad said fireworks tonight is a Tet [1]. | Festivals bring the whole [2] together.",
              skillTag: "writing",
              topicTag,
              explanation: "national; custom; city — ôn từ vựng viết diễu hành.",
              template:
                "The [0] parade was exciting. Dad said fireworks tonight is a Tet [1]. Festivals bring the whole [2] together.",
              correctAnswers: ["national", "custom", "city"],
              acceptableAnswers: [
                ["national", "National"],
                ["custom", "Custom", "tradition", "Tradition"],
                ["city", "City"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
