/** Flyers U4 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [tvCheck, filmCheck, opinionCheck] = writingChecks;

  return [
    {
      slug: "writing-tv-programmes",
      title: "Lesson 1: Write About TV Programmes",
      learningObjective:
        "Use frames to write about choosing TV programmes with enjoy + -ing.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-tv-learn",
          title: "Learn: TV Writing Frames",
          instructions: "Complete the sentences about television.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Minh enjoys [0] documentaries. | Linh wants [1] see a cartoon. | The news is too [2].",
              skillTag: "writing",
              topicTag,
              explanation: "watching; to; boring — khung ngữ pháp media.",
              template:
                "Minh enjoys [0] documentaries. Linh wants [1] see a cartoon. The news is too [2].",
              correctAnswers: ["watching", "to", "boring"],
              acceptableAnswers: [
                ["watching", "Watching"],
                ["to", "To"],
                ["boring", "Boring"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-tv-practice",
          title: "Practice: Order TV Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: They / changed / the / channel / to / watch / a / comedy.",
              skillTag: "writing",
              topicTag,
              explanation: "They changed the channel to watch a comedy.",
              words: ["They", "changed", "the", "channel", "to", "watch", "a", "comedy."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
              difficultyRating: 2,
            }),
          ],
        }),
        tvCheck,
        buildExercise({
          slug: "writing-tv-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence about choosing a programme:",
              skillTag: "writing",
              topicTag,
              explanation: "Enjoy watching + too boring — chuẩn Flyers U4.",
              correct:
                "Minh enjoys watching documentaries but Linh thinks the news is too boring.",
              wrong: [
                "Minh enjoy to watch documentary news boring.",
                "Linh wants seeing cartoon enough too.",
              ],
              distractorNotes: ["Grammar errors", "Mixed wrong forms"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about the screen:",
              skillTag: "writing",
              topicTag,
              explanation: "Too small — too + adjective.",
              correct: "The television screen is too small for a big audience.",
              wrong: [
                "The screen is enough small for audience.",
                "The screen too is small enough boring.",
              ],
              distractorNotes: ["Enough small (×)", "Word order wrong"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-tv-review",
          title: "Review: TV Writing Mix",
          instructions: "Choose the best written answer.",
          exerciseType: "multiple_choice",
          sortOrder: 4,
          questions: [
            buildMcq({
              questionText: "Best note about favourite programmes:",
              skillTag: "writing",
              topicTag,
              explanation: "Comedies are favourite + enjoy watching — đầy đủ.",
              correct:
                "Comedies are my favourite programmes. I enjoy watching them with my friend Linh.",
              wrong: [
                "Comedy favourite enjoy watch Linh.",
                "I enjoy to watch comedy boring enough.",
              ],
              distractorNotes: ["Fragment", "Grammar errors"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence using channel and news:",
              skillTag: "writing",
              topicTag,
              explanation: "Changed channel to watch news — câu hoàn chỉnh.",
              correct: "Dad watches the news on channel three every evening.",
              wrong: ["Dad channel news watch three every.", "News channel boring enjoy."],
              distractorNotes: ["Fragment", "Fragment"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-films",
      title: "Lesson 2: Write About Films",
      learningObjective:
        "Write about films using want to see and too/enough.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-film-learn",
          title: "Learn: Film Writing Frames",
          instructions: "Complete sentences about films.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I want [0] see a new film. | The actor is funny [1]. | The best [2] is on a ship.",
              skillTag: "writing",
              topicTag,
              explanation: "to; enough; scene — khung viết về phim.",
              template:
                "I want [0] see a new film. The actor is funny [1]. The best [2] is on a ship.",
              correctAnswers: ["to", "enough", "scene"],
              acceptableAnswers: [
                ["to", "To"],
                ["enough", "Enough"],
                ["scene", "Scene"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-film-practice",
          title: "Practice: Order Film Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: The / film / is / exciting / enough / for / the / audience.",
              skillTag: "writing",
              topicTag,
              explanation: "The film is exciting enough for the audience.",
              words: ["The", "film", "is", "exciting", "enough", "for", "the", "audience."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
              difficultyRating: 2,
            }),
          ],
        }),
        filmCheck,
        buildExercise({
          slug: "writing-film-apply",
          title: "Apply: Choose Best Film Sentence",
          instructions: "Choose the best sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence about the cinema:",
              skillTag: "writing",
              topicTag,
              explanation: "Want to see + screen too small — logic rõ.",
              correct:
                "I want to see the comedy at the cinema because the television screen is too small.",
              wrong: [
                "I wants seeing cinema screen enough too.",
                "Film actor scene comedy boring enjoy.",
              ],
              distractorNotes: ["Grammar errors", "Fragment"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about the audience:",
              skillTag: "writing",
              topicTag,
              explanation: "Audience clapped — câu hoàn chỉnh quá khứ.",
              correct: "The audience clapped loudly when the exciting scene finished.",
              wrong: ["Audience clap scene exciting when.", "The audience is too watch film."],
              distractorNotes: ["Fragment", "Grammar wrong"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-film-review",
          title: "Review: Film Writing Mix",
          instructions: "Choose the best written answer.",
          exerciseType: "multiple_choice",
          sortOrder: 4,
          questions: [
            buildMcq({
              questionText: "Best email about a film:",
              skillTag: "writing",
              topicTag,
              explanation: "Want to see + interesting documentary/film vocabulary.",
              correct:
                "Hi! I want to see a new comedy on Saturday. The actor is my favourite and the scene on the ship looks exciting enough.",
              wrong: [
                "Hi film want see actor ship enough exciting.",
                "I enjoy to watch film boring cinema screen.",
              ],
              distractorNotes: ["Fragment", "Enjoy to (×)"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence comparing TV and cinema:",
              skillTag: "writing",
              topicTag,
              explanation: "Screen too small vs big enough at cinema.",
              correct:
                "At home the screen is too small, but the cinema screen is big enough for everyone.",
              wrong: [
                "Home screen cinema enough too small big.",
                "Television is enjoy watching enough too.",
              ],
              distractorNotes: ["Fragment", "Grammar wrong"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-media-opinions",
      title: "Lesson 3: Write Media Opinions",
      learningObjective:
        "Write opinions about media using too, enough and enjoy + -ing.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-opinion-learn",
          title: "Learn: Opinion Writing Frames",
          instructions: "Complete opinion sentences.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Documentaries are [0] enough for me. | Cartoons are [1] boring for Minh. | I [2] watching comedy programmes.",
              skillTag: "writing",
              topicTag,
              explanation: "interesting; too; enjoy — từ đánh giá media.",
              template:
                "Documentaries are [0] enough for me. Cartoons are [1] boring for Minh. I [2] watching comedy programmes.",
              correctAnswers: ["interesting", "too", "enjoy"],
              acceptableAnswers: [
                ["interesting", "Interesting", "exciting", "Exciting"],
                ["too", "Too"],
                ["enjoy", "Enjoy"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-opinion-practice",
          title: "Practice: Order Opinion Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: The / news / is / too / boring / for / Linh.",
              skillTag: "writing",
              topicTag,
              explanation: "The news is too boring for Linh.",
              words: ["The", "news", "is", "too", "boring", "for", "Linh."],
              correctOrder: [0, 1, 2, 3, 4, 5, 6],
              difficultyRating: 2,
            }),
          ],
        }),
        opinionCheck,
        buildExercise({
          slug: "writing-opinion-apply",
          title: "Apply: Choose Best Opinion Sentence",
          instructions: "Choose the best sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best paragraph opener about media:",
              skillTag: "writing",
              topicTag,
              explanation: "Enjoy + too boring + favourite — đủ ý.",
              correct:
                "I enjoy watching interesting documentaries on television. Comedies are my favourite because the news is too boring.",
              wrong: [
                "Enjoy television documentary boring comedy favourite.",
                "I enjoy to watch enough boring news interesting.",
              ],
              distractorNotes: ["Fragment", "Enjoy to (×)"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence about radio:",
              skillTag: "writing",
              topicTag,
              explanation: "Grandma listens to radio — câu hoàn chỉnh.",
              correct: "Grandma listens to the radio while Dad watches the news on television.",
              wrong: ["Grandma radio listen news television.", "Radio is enjoy enough too."],
              distractorNotes: ["Fragment", "Grammar wrong"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-opinion-review",
          title: "Review: Media Opinion Writing Mix",
          instructions: "Choose the best written answer.",
          exerciseType: "multiple_choice",
          sortOrder: 4,
          questions: [
            buildMcq({
              questionText: "Best message combining all media types:",
              skillTag: "writing",
              topicTag,
              explanation: "TV + radio + cinema + opinions — review toàn unit.",
              correct:
                "I enjoy watching films at the cinema because the screen is big enough. At home I watch cartoons on television, and Grandma listens to the radio. Documentaries are interesting but the news is too boring.",
              wrong: [
                "Cinema television radio documentary news boring enjoy.",
                "I want seeing film enough too screen audience.",
              ],
              distractorNotes: ["Fragment", "Want seeing (×)"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best closing sentence for a media email:",
              skillTag: "writing",
              topicTag,
              explanation: "Want to see + exciting enough — kết thúc tự nhiên.",
              correct: "I want to see the new comedy because it looks exciting enough!",
              wrong: ["Want see comedy exciting enough I.", "Comedy enough exciting want see."],
              distractorNotes: ["Word order wrong", "Fragment"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
