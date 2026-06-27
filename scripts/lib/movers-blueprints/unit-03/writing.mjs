/** Movers U3 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [todayCheck, yesterdayCheck, seasonsCheck] = writingChecks;

  return [
    {
      slug: "writing-today-weather",
      title: "Lesson 1: Write About Today's Weather",
      learningObjective:
        "Use frames to write short sentences about today's weather with It's.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-today-learn",
          title: "Learn: Today's Weather Frames",
          instructions: "Complete the sentences about today.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: [0] sunny today. | [1] hot outside. | The [2] is great.",
              skillTag: "writing",
              topicTag,
              explanation: "It's; It's; weather — khung viết hôm nay.",
              template: "[0] sunny today. [1] hot outside. The [2] is great.",
              correctAnswers: ["It's", "It's", "weather"],
              acceptableAnswers: [
                ["It's", "It is"],
                ["It's", "It is"],
                ["weather", "Weather"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-today-practice",
          title: "Practice: Order Weather Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: It's / sunny / and / hot / today.",
              skillTag: "writing",
              topicTag,
              explanation: "It's sunny and hot today.",
              words: ["It's", "sunny", "and", "hot", "today."],
              correctOrder: [0, 1, 2, 3, 4],
              difficultyRating: 2,
            }),
          ],
        }),
        todayCheck,
        buildExercise({
          slug: "writing-today-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best message about today's weather:",
              skillTag: "writing",
              topicTag,
              explanation: "It's sunny and hot — đúng cấu trúc It's.",
              correct: "Hi Linh, it's sunny and hot today. I can play outside!",
              wrong: ["Sunny hot today Linh.", "It sunny and hot today is."],
              distractorNotes: ["Không thành câu", "Sai trật tự"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about the weather:",
              skillTag: "writing",
              topicTag,
              explanation: "The weather is great today — rõ ràng.",
              correct: "The weather is great today. It's not windy.",
              wrong: ["Weather great is windy not.", "The weathers is great."],
              distractorNotes: ["Sai trật tự", "Weather không -s"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-today-review",
          title: "Review: Today Weather Writing Quiz",
          instructions: "Choose the best way to complete each writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText: "Complete: [0] cloudy today? | No, [1] sunny and [2].",
              skillTag: "writing",
              topicTag,
              explanation: "Is it; it's; hot — câu hỏi và trả lời.",
              template: "[0] cloudy today? No, [1] sunny and [2].",
              correctAnswers: ["Is it", "it's", "hot"],
              acceptableAnswers: [
                ["Is it", "Is It"],
                ["it's", "It is", "It's"],
                ["hot", "Hot"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-yesterday-weather",
      title: "Lesson 2: Write About Yesterday",
      learningObjective:
        "Write 2–3 connected sentences about past weather with was/were.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "writing-yesterday-learn",
          title: "Learn: Yesterday's Weather Frames",
          instructions: "Complete sentences with was or were.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Yesterday it [0] rainy. | It [1] windy too. | We [2] at home.",
              skillTag: "writing",
              topicTag,
              explanation: "was; was; were — quá khứ thời tiết.",
              template:
                "Yesterday it [0] rainy. It [1] windy too. We [2] at home.",
              correctAnswers: ["was", "was", "were"],
              acceptableAnswers: [
                ["was", "Was"],
                ["was", "Was"],
                ["were", "Were"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-yesterday-practice",
          title: "Practice: Order Past Weather Sentences",
          instructions: "Put words in order to make past weather sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: Yesterday / it / was / rainy / and / windy.",
              skillTag: "writing",
              topicTag,
              explanation: "Yesterday it was rainy and windy.",
              words: ["Yesterday", "it", "was", "rainy", "and", "windy."],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
          ],
        }),
        yesterdayCheck,
        buildExercise({
          slug: "writing-yesterday-apply",
          title: "Apply: Best Yesterday Message",
          instructions: "Choose the best short message.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best note about yesterday:",
              skillTag: "writing",
              topicTag,
              explanation: "Was/were đúng — mưa gió, ở nhà.",
              correct: "Yesterday the weather was rainy and windy. Minh and I were at home.",
              wrong: ["Yesterday were rainy it windy.", "Yesterday it is rainy we was home."],
              distractorNotes: ["Sai trật tự", "Sai thì was/is"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-yesterday-review",
          title: "Review: Yesterday Writing Frames",
          instructions: "Complete the past weather writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Last week it [0] cold. | Minh and Linh [1] at school. | The weather [2] different every day.",
              skillTag: "writing",
              topicTag,
              explanation: "was; were; is — quá khứ và sự thật chung.",
              template:
                "Last week it [0] cold. Minh and Linh [1] at school. The weather [2] different every day.",
              correctAnswers: ["was", "were", "is"],
              acceptableAnswers: [
                ["was", "Was"],
                ["were", "Were"],
                ["is", "Is"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-seasons",
      title: "Lesson 3: Write About Seasons",
      learningObjective:
        "Write a short connected message about favourite seasons and weather.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-seasons-learn",
          title: "Learn: Season Writing Frames",
          instructions: "Complete sentences about seasons.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: My favourite season is [0]. | In summer the weather is [1]. | Winter can be [2].",
              skillTag: "writing",
              topicTag,
              explanation: "spring/summer; hot; cold — mùa và thời tiết.",
              template:
                "My favourite season is [0]. In summer the weather is [1]. Winter can be [2].",
              correctAnswers: ["spring", "hot", "cold"],
              acceptableAnswers: [
                ["spring", "Spring", "summer", "Summer", "autumn", "Autumn", "winter", "Winter"],
                ["hot", "Hot"],
                ["cold", "Cold"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-seasons-practice",
          title: "Practice: Order Season Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / love / summer / because / it / is / hot / and / sunny.",
              skillTag: "writing",
              topicTag,
              explanation: "I love summer because it is hot and sunny.",
              words: ["I", "love", "summer", "because", "it", "is", "hot", "and", "sunny."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              difficultyRating: 2,
            }),
          ],
        }),
        seasonsCheck,
        buildExercise({
          slug: "writing-seasons-apply",
          title: "Apply: Choose the Best Season Paragraph",
          instructions: "Choose the best short message about seasons.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best message about favourite season:",
              skillTag: "writing",
              topicTag,
              explanation: "Season + weather + reason — đủ thông tin.",
              correct:
                "My favourite season is spring. The weather is warm. I like it because the flowers bloom.",
              wrong: ["Spring warm flowers I like.", "Favourite season spring weather warm bloom."],
              distractorNotes: ["Không thành câu", "Sai trật tự"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about winter in Hanoi:",
              skillTag: "writing",
              topicTag,
              explanation: "Winter can be cold but it doesn't snow — đúng bài.",
              correct: "Winter can be cold in Hanoi, but it doesn't snow.",
              wrong: ["Winter cold snow Hanoi always.", "It snows every winter in Hanoi."],
              distractorNotes: ["Sai trật tự", "Sai sự thật"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-seasons-review",
          title: "Review: Season Writing Frames",
          instructions: "Complete a short season message frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Linh loves [0] best. | Autumn is [1] and cool. | We talk about the [2] every day.",
              skillTag: "writing",
              topicTag,
              explanation: "summer; cloudy; weather — ôn viết mùa.",
              template:
                "Linh loves [0] best. Autumn is [1] and cool. We talk about the [2] every day.",
              correctAnswers: ["summer", "cloudy", "weather"],
              acceptableAnswers: [
                ["summer", "Summer"],
                ["cloudy", "Cloudy"],
                ["weather", "Weather"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
