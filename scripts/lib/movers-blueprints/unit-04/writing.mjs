/** Movers U4 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [nowCheck, hobbiesCheck, weekendCheck] = writingChecks;

  return [
    {
      slug: "writing-now-activity",
      title: "Lesson 1: Write About Now",
      learningObjective:
        "Use I am + -ing frames to write about activities happening now.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-now-learn",
          title: "Learn: Now Writing Frames",
          instructions: "Complete the sentences about now.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I [0] reading a comic now. | Linh [1] drawing a cat. | What [2] you doing?",
              skillTag: "writing",
              topicTag,
              explanation: "am; is; are — khung viết hiện tại tiếp diễn.",
              template: "I [0] reading a comic now. Linh [1] drawing a cat. What [2] you doing?",
              correctAnswers: ["am", "is", "are"],
              acceptableAnswers: [
                ["am", "Am"],
                ["is", "Is"],
                ["are", "Are"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-now-practice",
          title: "Practice: Order Now Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / am / reading / a / comic / book / now.",
              skillTag: "writing",
              topicTag,
              explanation: "I am reading a comic book now.",
              words: ["I", "am", "reading", "a", "comic", "book", "now."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6],
              difficultyRating: 2,
            }),
          ],
        }),
        nowCheck,
        buildExercise({
          slug: "writing-now-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best message about what you are doing now:",
              skillTag: "writing",
              topicTag,
              explanation: "I am reading a comic — đúng cấu trúc am + -ing.",
              correct: "Hi Linh, I am reading a comic book now. What are you doing?",
              wrong: ["Reading comic I now am Linh hi.", "I reading comic now Linh."],
              distractorNotes: ["Sai trật tự", "Thiếu am"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about Linh now:",
              skillTag: "writing",
              topicTag,
              explanation: "Linh is drawing a cat — she → is.",
              correct: "Linh is drawing a cat. Look at her picture!",
              wrong: ["Linh drawing is cat a.", "Linh are drawing cat."],
              distractorNotes: ["Sai trật tự", "Linh → is"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-now-review",
          title: "Review: Now Writing Quiz",
          instructions: "Choose the best way to complete each writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText: "Complete: What [0] you doing? | I [1] looking at my stamp. | We [2] not playing football now.",
              skillTag: "writing",
              topicTag,
              explanation: "are; am; are — câu hỏi và trả lời.",
              template: "What [0] you doing? I [1] looking at my stamp. We [2] not playing football now.",
              correctAnswers: ["are", "am", "are"],
              acceptableAnswers: [
                ["are", "Are"],
                ["am", "Am"],
                ["are", "Are"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-hobbies",
      title: "Lesson 2: Write About Hobbies",
      learningObjective:
        "Write connected sentences about hobbies using like + -ing.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-hobbies-learn",
          title: "Learn: Hobby Writing Frames",
          instructions: "Complete sentences with like + -ing.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I like [0] in summer. | Linh likes [1] at school. | We like [2] football.",
              skillTag: "writing",
              topicTag,
              explanation: "swimming; dancing; playing — like + -ing.",
              template: "I like [0] in summer. Linh likes [1] at school. We like [2] football.",
              correctAnswers: ["swimming", "dancing", "playing"],
              acceptableAnswers: [
                ["swimming", "Swimming"],
                ["dancing", "Dancing"],
                ["playing", "Playing"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-hobbies-practice",
          title: "Practice: Order Hobby Sentences",
          instructions: "Put words in order to make hobby sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: Minh / likes / collecting / stamps / from / many / countries.",
              skillTag: "writing",
              topicTag,
              explanation: "Minh likes collecting stamps from many countries.",
              words: ["Minh", "likes", "collecting", "stamps", "from", "many", "countries."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6],
              difficultyRating: 2,
            }),
          ],
        }),
        hobbiesCheck,
        buildExercise({
          slug: "writing-hobbies-apply",
          title: "Apply: Best Hobby Message",
          instructions: "Choose the best short message.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best note about hobbies:",
              skillTag: "writing",
              topicTag,
              explanation: "Like + -ing đúng — swimming, dancing, football.",
              correct: "I like swimming in summer. Linh likes dancing. We like playing football after school.",
              wrong: ["Like I swim summer Linh dance.", "Swimming like I dancing Linh football play."],
              distractorNotes: ["Không thành câu", "Sai trật tự"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-hobbies-review",
          title: "Review: Hobby Writing Frames",
          instructions: "Complete the hobby writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: My favourite hobby is [0] stamps. | I like [1] comics. | Linh likes [2] at school.",
              skillTag: "writing",
              topicTag,
              explanation: "collecting; reading; dancing — sở thích.",
              template:
                "My favourite hobby is [0] stamps. I like [1] comics. Linh likes [2] at school.",
              correctAnswers: ["collecting", "reading", "dancing"],
              acceptableAnswers: [
                ["collecting", "Collecting"],
                ["reading", "Reading"],
                ["dancing", "Dancing"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-weekend-plans",
      title: "Lesson 3: Write About Weekend Plans",
      learningObjective:
        "Write a short message about cinema or concert plans.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-weekend-learn",
          title: "Learn: Weekend Plan Frames",
          instructions: "Complete sentences about weekend plans.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: On Saturday we go to the [0]. | On Sunday there is a [1] in the park. | Linh likes [2], so it is fun.",
              skillTag: "writing",
              topicTag,
              explanation: "cinema; concert; dancing — kế hoạch cuối tuần.",
              template:
                "On Saturday we go to the [0]. On Sunday there is a [1] in the park. Linh likes [2], so it is fun.",
              correctAnswers: ["cinema", "concert", "dancing"],
              acceptableAnswers: [
                ["cinema", "Cinema"],
                ["concert", "Concert"],
                ["dancing", "Dancing"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-weekend-practice",
          title: "Practice: Order Plan Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: On / Saturday / we / are / going / to / the / cinema.",
              skillTag: "writing",
              topicTag,
              explanation: "On Saturday we are going to the cinema.",
              words: ["On", "Saturday", "we", "are", "going", "to", "the", "cinema."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
              difficultyRating: 2,
            }),
          ],
        }),
        weekendCheck,
        buildExercise({
          slug: "writing-weekend-apply",
          title: "Apply: Choose the Best Plan Paragraph",
          instructions: "Choose the best short message about weekend plans.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best message about weekend plans:",
              skillTag: "writing",
              topicTag,
              explanation: "Cinema + concert + lý do — đủ thông tin.",
              correct:
                "On Saturday Minh and I are going to the cinema. On Sunday there is a concert in the park. Linh likes dancing, so it will be fun!",
              wrong: ["Saturday cinema Sunday concert fun.", "Cinema Saturday concert park Linh dance fun."],
              distractorNotes: ["Không thành câu", "Sai trật tự"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about the cinema trip:",
              skillTag: "writing",
              topicTag,
              explanation: "We want to see an adventure film — rõ ràng.",
              correct: "We are going to the cinema on Saturday. We want to see an adventure film.",
              wrong: ["Cinema adventure Saturday film we.", "Going cinema we film adventure Saturday is."],
              distractorNotes: ["Sai trật tự", "Sai trật tự"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-weekend-review",
          title: "Review: Weekend Plan Frames",
          instructions: "Complete a short weekend plan frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Mum says we can go to the [0] on Saturday. | There is a [1] on Sunday. | I like [2] comics before the film.",
              skillTag: "writing",
              topicTag,
              explanation: "cinema; concert; reading — ôn viết kế hoạch.",
              template:
                "Mum says we can go to the [0] on Saturday. There is a [1] on Sunday. I like [2] comics before the film.",
              correctAnswers: ["cinema", "concert", "reading"],
              acceptableAnswers: [
                ["cinema", "Cinema"],
                ["concert", "Concert"],
                ["reading", "Reading"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
