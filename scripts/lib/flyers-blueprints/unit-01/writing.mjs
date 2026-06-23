/** Flyers U1 — writing lessons (3 × 5 exercises; only Check is AI). */

export function writingLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  writingChecks,
  topicTag,
}) {
  const [visitCheck, inviteCheck, familyCheck] = writingChecks;

  return [
    {
      slug: "writing-visit-message",
      title: "Lesson 1: Write About a Visit",
      learningObjective:
        "Use frames to write about visiting relatives with present perfect.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-visit-learn",
          title: "Learn: Visit Writing Frames",
          instructions: "Complete the sentences about visiting family.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Last month I [0] my aunt in Da Nang. I have never [1] by the sea before. My cousin, who is my [2], showed me the beach.",
              skillTag: "writing",
              topicTag,
              explanation: "visited; stayed; age — khung viết về chuyến thăm.",
              template:
                "Last month I [0] my aunt in Da Nang. I have never [1] by the sea before. My cousin, who is my [2], showed me the beach.",
              correctAnswers: ["visited", "stayed", "age"],
              acceptableAnswers: [
                ["visited", "Visited"],
                ["stayed", "Stayed"],
                ["age", "Age"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-visit-practice",
          title: "Practice: Order Visit Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / have never / visited / my uncle / before.",
              skillTag: "writing",
              topicTag,
              explanation: "I have never visited my uncle before.",
              words: ["I", "have never", "visited", "my uncle", "before."],
              correctOrder: [0, 1, 2, 3, 4],
              difficultyRating: 2,
            }),
          ],
        }),
        visitCheck,
        buildExercise({
          slug: "writing-visit-apply",
          title: "Apply: Choose the Best Sentence",
          instructions: "Choose the best written sentence for each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best sentence about a first visit:",
              skillTag: "writing",
              topicTag,
              explanation: "Present perfect never + stayed — chuẩn Flyers.",
              correct: "I have never stayed with my cousin for three days before.",
              wrong: [
                "I never have stayed with my cousin for three days.",
                "I have stay with my cousin never before.",
              ],
              distractorNotes: ["Wrong word order", "Wrong participle"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence with a who-clause:",
              skillTag: "writing",
              topicTag,
              explanation: "My aunt, who lives in Da Nang, welcomed me.",
              correct: "My aunt, who lives in Da Nang, welcomed me at the door.",
              wrong: [
                "My aunt which lives in Da Nang welcomed me.",
                "My aunt, who she lives in Da Nang, welcomed me.",
              ],
              distractorNotes: ["Which for things", "Extra pronoun"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-visit-review",
          title: "Review: Visit Writing Quiz",
          instructions: "Choose the best way to complete each writing frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I visited my aunt who [0] in Da Nang. I [1] for three days and have already promised to [2] again.",
              skillTag: "writing",
              topicTag,
              explanation: "lives; stayed; visit — ôn khung chuyến thăm.",
              template:
                "I visited my aunt who [0] in Da Nang. I [1] for three days and have already promised to [2] again.",
              correctAnswers: ["lives", "stayed", "visit"],
              acceptableAnswers: [
                ["lives", "Lives"],
                ["stayed", "Stayed"],
                ["visit", "Visit"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-invite-note",
      title: "Lesson 2: Write an Invitation",
      learningObjective:
        "Write 3–4 connected sentences inviting someone to a family party.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "writing-invite-learn",
          title: "Learn: Invitation Sentences",
          instructions: "Complete sentences about inviting guests.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: We need to [0] more guests. I [1] our neighbour yesterday. The party, which is on [2], starts at six.",
              skillTag: "writing",
              topicTag,
              explanation: "invite; invited; Saturday — mời khách và thời gian.",
              template:
                "We need to [0] more guests. I [1] our neighbour yesterday. The party, which is on [2], starts at six.",
              correctAnswers: ["invite", "invited", "Saturday"],
              acceptableAnswers: [
                ["invite", "Invite"],
                ["invited", "Invited"],
                ["Saturday", "saturday"],
              ],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-invite-practice",
          title: "Practice: Connect Invitation Ideas",
          instructions: "Put words in order to make invitation sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText: "Make: I / want / to / invite / you / to / our / family / party.",
              skillTag: "writing",
              topicTag,
              explanation: "I want to invite you to our family party.",
              words: [
                "I",
                "want",
                "to",
                "invite",
                "you",
                "to",
                "our",
                "family",
                "party.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              difficultyRating: 2,
            }),
          ],
        }),
        inviteCheck,
        buildExercise({
          slug: "writing-invite-apply",
          title: "Apply: Best Invitation Message",
          instructions: "Choose the best short invitation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best invitation to a neighbour:",
              skillTag: "writing",
              topicTag,
              explanation: "When + where + who — đủ thông tin Flyers.",
              correct:
                "Dear Linh, please come to our family party on Saturday at six o'clock. Many relatives will be there.",
              wrong: [
                "Party Saturday Linh come.",
                "I am invite you to party Saturday.",
              ],
              distractorNotes: ["Too short, not a sentence", "Wrong grammar"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-invite-review",
          title: "Review: Invitation Writing Frames",
          instructions: "Complete the invitation writing frames.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: We will [0] all the guests at the door. Please [1] my aunt and uncle, who live in Da Nang. We will [2] my uncle's birthday together.",
              skillTag: "writing",
              topicTag,
              explanation: "welcome; visit; celebrate — ôn lời mời và tiệc.",
              template:
                "We will [0] all the guests at the door. Please [1] my aunt and uncle, who live in Da Nang. We will [2] my uncle's birthday together.",
              correctAnswers: ["welcome", "visit", "celebrate"],
              acceptableAnswers: [
                ["welcome", "Welcome"],
                ["visit", "Visit", "meet"],
                ["celebrate", "Celebrate"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "writing-extended-family",
      title: "Lesson 3: My Extended Family",
      learningObjective:
        "Write a short connected message about relatives and neighbours.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "writing-family-learn",
          title: "Learn: Family and Neighbour Frames",
          instructions: "Complete sentences with who and which.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: I have an aunt [0] works at a hospital. The party, [1] was on Saturday, was wonderful. My neighbour Linh, [2] is my age, is a good friend.",
              skillTag: "writing",
              topicTag,
              explanation: "who; which; who — mệnh đề quan hệ người và vật.",
              template:
                "I have an aunt [0] works at a hospital. The party, [1] was on Saturday, was wonderful. My neighbour Linh, [2] is my age, is a good friend.",
              correctAnswers: ["who", "which", "who"],
              acceptableAnswers: [
                ["who", "Who"],
                ["which", "Which"],
                ["who", "Who"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-family-practice",
          title: "Practice: Order Family Sentences",
          instructions: "Put the sentence parts in logical order.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: My cousin Nam, / who / lives / in / Da Nang, / has / never / visited / Hanoi.",
              skillTag: "writing",
              topicTag,
              explanation: "My cousin Nam, who lives in Da Nang, has never visited Hanoi.",
              words: [
                "My cousin Nam,",
                "who",
                "lives",
                "in",
                "Da Nang,",
                "has",
                "never",
                "visited",
                "Hanoi.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              difficultyRating: 2,
            }),
          ],
        }),
        familyCheck,
        buildExercise({
          slug: "writing-family-apply",
          title: "Apply: Choose the Best Family Note",
          instructions: "Choose the best way to describe extended family.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Best opening for a pen-friend message:",
              skillTag: "writing",
              topicTag,
              explanation: "Relative + who + experience — mở đầu rõ chủ đề Flyers.",
              correct:
                "I have an aunt who lives in another city. I have never visited her alone.",
              wrong: [
                "I am eleven and cousin aunt neighbour.",
                "Family who which ever never party.",
              ],
              distractorNotes: ["Not connected", "Not grammatical"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Best sentence with never:",
              skillTag: "writing",
              topicTag,
              explanation: "Have never + past participle — đúng present perfect.",
              correct: "I have never invited so many guests to my home.",
              wrong: [
                "I never have invited so many guests to my home.",
                "I have never invite so many guests.",
              ],
              distractorNotes: ["Wrong order", "Wrong participle"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "writing-family-review",
          title: "Review: Extended Family Frames",
          instructions: "Complete a short family message frame.",
          exerciseType: "gap_fill",
          sortOrder: 4,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Have you ever [0] a big family party? I [1] my neighbour to celebrate last month. She is a [2] who always helps my family.",
              skillTag: "writing",
              topicTag,
              explanation: "been to; invited; neighbour — ôn từ vựng và ever.",
              template:
                "Have you ever [0] a big family party? I [1] my neighbour to celebrate last month. She is a [2] who always helps my family.",
              correctAnswers: ["been to", "invited", "neighbour"],
              acceptableAnswers: [
                ["been to", "Been to", "been"],
                ["invited", "Invited"],
                ["neighbour", "Neighbour", "guest"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
