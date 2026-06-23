/** PET U1 — grammar lessons (3 × 5 exercises). */

export function grammarLessons({
  buildMcq,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  topicTag,
}) {
  return [
    {
      slug: "grammar-second-conditional",
      title: "Lesson 1: Second Conditional",
      learningObjective:
        "Use the second conditional to talk about imaginary university and career choices.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "grammar-conditional-learn",
          title: "Learn: If…, I would…",
          instructions: "Choose the correct form.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "If I _____ a scholarship, I would study abroad.",
              skillTag: "grammar",
              topicTag,
              explanation: "Second conditional: If + past simple → had.",
              correct: "had",
              wrong: ["have", "would have"],
              distractorNotes: ["Present simple", "Would in if-clause"],
              difficultyRating: 1,
            }),
            buildMcq({
              questionText:
                "If Minh got a scholarship, he _____ in engineering.",
              skillTag: "grammar",
              topicTag,
              explanation: "Would + base verb → would enrol.",
              correct: "would enrol",
              wrong: ["will enrol", "enrols"],
              distractorNotes: ["First conditional", "Present simple"],
              difficultyRating: 1,
            }),
            buildMcq({
              questionText:
                "If she _____ harder on presentation skills, she would feel more confident.",
              skillTag: "grammar",
              topicTag,
              explanation: "If + past simple → worked.",
              correct: "worked",
              wrong: ["works", "would work"],
              distractorNotes: ["Present", "Would in if-clause"],
              difficultyRating: 1,
            }),
            buildMcq({
              questionText:
                "If they offered an internship, I _____ it immediately.",
              skillTag: "grammar",
              topicTag,
              explanation: "Would accept — kết quả giả định.",
              correct: "would accept",
              wrong: ["accepted", "will accept"],
              distractorNotes: ["Past simple result", "First conditional"],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-conditional-practice",
          title: "Practice: Complete Second Conditional",
          instructions: "Fill in each gap with the correct verb form.",
          exerciseType: "gap_fill",
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText:
                "Complete: If I [0] more time, I would finish my application. | If Minh [1] closer, he would visit open days more often. | She [2] apply for medicine if she had better grades.",
              skillTag: "grammar",
              topicTag,
              explanation: "had; lived; would — if-clause past, result would.",
              template:
                "If I [0] more time, I would finish my application. If Minh [1] closer, he would visit open days more often. She [2] apply for medicine if she had better grades.",
              correctAnswers: ["had", "lived", "would"],
              acceptableAnswers: [
                ["had", "Had"],
                ["lived", "Lived"],
                ["would", "Would"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-conditional-check",
          title: "Check: Second Conditional Challenge",
          instructions: "Choose the correct answer. Think carefully.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          questions: [
            buildMcq({
              questionText: "Which sentence is correct?",
              skillTag: "grammar",
              topicTag,
              explanation:
                "If I had money, I would travel — past in if-clause, would in result.",
              correct: "If I had money, I would travel.",
              wrong: [
                "If I would have money, I would travel.",
                "If I had money, I will travel.",
              ],
              distractorNotes: ["Would in if-clause", "Will in result"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "If Minh _____ the scholarship, he would enrol in computer science.",
              skillTag: "grammar",
              topicTag,
              explanation: "Received — past simple in if-clause.",
              correct: "received",
              wrong: ["receives", "would receive"],
              distractorNotes: ["Present", "Would in if-clause"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "What would you do if you _____ any career?",
              skillTag: "grammar",
              topicTag,
              explanation: "Could choose — modal past in if-clause.",
              correct: "could choose",
              wrong: ["can choose", "would choose"],
              distractorNotes: ["Present", "Would in if-clause"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-conditional-apply",
          title: "Apply: Build Conditional Sentences",
          instructions: "Put the words in the correct order.",
          exerciseType: "sentence_ordering",
          sortOrder: 3,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: If / I / had / a scholarship, / I / would / study / at university.",
              skillTag: "grammar",
              topicTag,
              explanation: "If I had a scholarship, I would study at university.",
              words: [
                "If",
                "I",
                "had",
                "a scholarship,",
                "I",
                "would",
                "study",
                "at university.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
              difficultyRating: 2,
            }),
            buildSentenceOrdering({
              questionText:
                "Make: If / he / prepared / his statement / now, / he / would / feel / less stressed.",
              skillTag: "grammar",
              topicTag,
              explanation:
                "If he prepared his statement now, he would feel less stressed.",
              words: [
                "If",
                "he",
                "prepared",
                "his statement",
                "now,",
                "he",
                "would",
                "feel",
                "less stressed.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-conditional-review",
          title: "Review: Second Conditional Mix",
          instructions: "Choose the best answer.",
          exerciseType: "multiple_choice",
          sortOrder: 4,
          questions: [
            buildMcq({
              questionText:
                "If I lived abroad, I _____ study computer science there.",
              skillTag: "grammar",
              topicTag,
              explanation: "Would study — hypothetical result.",
              correct: "would",
              wrong: ["will", "would have"],
              distractorNotes: ["First conditional", "Third conditional"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "If you _____ your documents now, you would feel more confident.",
              skillTag: "grammar",
              topicTag,
              explanation: "Prepared — past simple after if.",
              correct: "prepared",
              wrong: ["prepare", "would prepare"],
              distractorNotes: ["Present", "Would in if-clause"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "grammar-perfect-past",
      title: "Lesson 2: Present Perfect vs Past Simple",
      learningObjective:
        "Choose present perfect and past simple correctly when talking about applications and experiences.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "grammar-tense-learn",
          title: "Learn: Finished vs Connected to Now",
          instructions: "Choose the correct tense.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Minh _____ for a scholarship last month.",
              skillTag: "grammar",
              topicTag,
              explanation: "Last month = finished time → applied (past simple).",
              correct: "applied",
              wrong: ["has applied", "applies"],
              distractorNotes: ["Present perfect + specific time", "Present"],
              difficultyRating: 1,
            }),
            buildMcq({
              questionText: "He _____ never been on a university campus.",
              skillTag: "grammar",
              topicTag,
              explanation: "Experience → has never been (present perfect).",
              correct: "has",
              wrong: ["have", "had"],
              distractorNotes: ["Wrong person", "Past simple"],
              difficultyRating: 1,
            }),
            buildMcq({
              questionText: "They _____ an open day in April.",
              skillTag: "grammar",
              topicTag,
              explanation: "In April = specific past → held (past simple).",
              correct: "held",
              wrong: ["have held", "hold"],
              distractorNotes: ["Present perfect", "Present"],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-tense-practice",
          title: "Practice: Complete the Tenses",
          instructions: "Fill in the correct verb form.",
          exerciseType: "gap_fill",
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Minh [0] his application last Friday. | He [1] visited two universities this year. | Dr Phuong [2] forty scholarships last year.",
              skillTag: "grammar",
              topicTag,
              explanation: "sent; has; awarded — past simple vs present perfect.",
              template:
                "Minh [0] his application last Friday. He [1] visited two universities this year. Dr Phuong [2] forty scholarships last year.",
              correctAnswers: ["sent", "has", "awarded"],
              acceptableAnswers: [
                ["sent", "Sent"],
                ["has", "Has"],
                ["awarded", "Awarded"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-tense-check",
          title: "Check: Tense Challenge",
          instructions: "Choose the correct answer.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          questions: [
            buildMcq({
              questionText: "Which sentence is NOT correct?",
              skillTag: "grammar",
              topicTag,
              explanation:
                "Have applied + last week — không dùng present perfect với thời gian cụ thể.",
              correct: "I have applied last week.",
              wrong: [
                "Minh has never visited Da Nang.",
                "She graduated in 2024.",
              ],
              distractorNotes: ["Đúng", "Đúng"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "Minh _____ two internship applications so far.",
              skillTag: "grammar",
              topicTag,
              explanation: "So far → has completed (present perfect).",
              correct: "has completed",
              wrong: ["completed", "completes"],
              distractorNotes: ["No connection to now", "Present simple"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "When _____ you last research tuition fees online?",
              skillTag: "grammar",
              topicTag,
              explanation: "When + last → did you research (past simple question).",
              correct: "did",
              wrong: ["have", "do"],
              distractorNotes: ["Present perfect", "Present"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-tense-apply",
          title: "Apply: Order the Sentences",
          instructions: "Put words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 3,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: Minh / has / visited / two / open days / this year.",
              skillTag: "grammar",
              topicTag,
              explanation: "Minh has visited two open days this year.",
              words: [
                "Minh",
                "has",
                "visited",
                "two",
                "open days",
                "this year.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
            buildSentenceOrdering({
              questionText:
                "Make: He / applied / for / a scholarship / in / March.",
              skillTag: "grammar",
              topicTag,
              explanation: "He applied for a scholarship in March.",
              words: [
                "He",
                "applied",
                "for",
                "a scholarship",
                "in",
                "March.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-tense-review",
          title: "Review: Present Perfect / Past Simple Mix",
          instructions: "Choose the best answer.",
          exerciseType: "multiple_choice",
          sortOrder: 4,
          questions: [
            buildMcq({
              questionText:
                "She _____ already chosen her career ambition.",
              skillTag: "grammar",
              topicTag,
              explanation: "Already → has chosen (present perfect).",
              correct: "has",
              wrong: ["have", "had"],
              distractorNotes: ["Wrong person", "Past simple"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "Last year he _____ his first university open day.",
              skillTag: "grammar",
              topicTag,
              explanation: "Last year → visited (past simple).",
              correct: "visited",
              wrong: ["has visited", "visits"],
              distractorNotes: ["Present perfect", "Present"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
    {
      slug: "grammar-future-review",
      title: "Lesson 3: Grammar Review — Future Plans",
      learningObjective:
        "Mix second conditional with present perfect and past simple in education contexts.",
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: "grammar-mixed-learn",
          title: "Learn: Choose the Correct Form",
          instructions: "Pick the best grammar for each sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText:
                "Minh applied for a scholarship last month because tuition fees _____ his parents.",
              skillTag: "grammar",
              topicTag,
              explanation: "Worry — present simple for general truth.",
              correct: "worry",
              wrong: ["worried", "have worried"],
              distractorNotes: ["Past only", "Unnatural here"],
              difficultyRating: 1,
            }),
            buildMcq({
              questionText:
                "If he _____ the scholarship, he would enrol in computer science.",
              skillTag: "grammar",
              topicTag,
              explanation: "Received — second conditional if-clause.",
              correct: "received",
              wrong: ["receives", "has received"],
              distractorNotes: ["First conditional", "Wrong pattern"],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-mixed-practice",
          title: "Practice: Complete the Paragraph",
          instructions: "Fill in the gaps.",
          exerciseType: "gap_fill",
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Minh [0] visited two open days this year. | He [1] for a scholarship in March. | If he [2] the offer, he would enrol in Hanoi.",
              skillTag: "grammar",
              topicTag,
              explanation: "has; applied; accepted — mixed tense review.",
              template:
                "Minh [0] visited two open days this year. He [1] for a scholarship in March. If he [2] the offer, he would enrol in Hanoi.",
              correctAnswers: ["has", "applied", "accepted"],
              acceptableAnswers: [
                ["has", "Has"],
                ["applied", "Applied"],
                ["accepted", "Accepted", "got", "Got", "received", "Received"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-mixed-check",
          title: "Check: Mixed Grammar Challenge",
          instructions: "Harder questions — choose carefully.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          questions: [
            buildMcq({
              questionText: "Which sentence is correct?",
              skillTag: "grammar",
              topicTag,
              explanation:
                "If I prepared now, I would feel less stressed — second conditional.",
              correct:
                "If I prepared my application now, I would feel less stressed.",
              wrong: [
                "If I prepare my application now, I would feel less stressed.",
                "If I would prepare my application, I feel less stressed.",
              ],
              distractorNotes: ["Mixed conditionals wrong", "Would in if-clause"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "Minh _____ never researched degree programmes before last year.",
              skillTag: "grammar",
              topicTag,
              explanation: "Had never researched — past perfect for earlier past.",
              correct: "had",
              wrong: ["has", "have"],
              distractorNotes: ["Present perfect", "Wrong person"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "How many open days _____ you attended so far?",
              skillTag: "grammar",
              topicTag,
              explanation: "Have you attended — present perfect question.",
              correct: "have",
              wrong: ["did", "do"],
              distractorNotes: ["Past simple", "Present"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-mixed-apply",
          title: "Apply: Build Future Plans Sentences",
          instructions: "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: 3,
          questions: [
            buildSentenceOrdering({
              questionText:
                "Make: If / I / had / better grades, / I / would / apply / for medicine.",
              skillTag: "grammar",
              topicTag,
              explanation:
                "If I had better grades, I would apply for medicine.",
              words: [
                "If",
                "I",
                "had",
                "better grades,",
                "I",
                "would",
                "apply",
                "for medicine.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
              difficultyRating: 2,
            }),
            buildSentenceOrdering({
              questionText:
                "Make: He / has / already / sent / two / internship / applications.",
              skillTag: "grammar",
              topicTag,
              explanation:
                "He has already sent two internship applications.",
              words: [
                "He",
                "has",
                "already",
                "sent",
                "two",
                "internship",
                "applications.",
              ],
              correctOrder: [0, 1, 2, 3, 4, 5, 6],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-mixed-review",
          title: "Review: Full Grammar Mix",
          instructions: "Final grammar review.",
          exerciseType: "multiple_choice",
          sortOrder: 4,
          questions: [
            buildMcq({
              questionText:
                "Applications _____ on the first of November last year.",
              skillTag: "grammar",
              topicTag,
              explanation: "Closed — past simple for finished deadline.",
              correct: "closed",
              wrong: ["have closed", "close"],
              distractorNotes: ["Present perfect", "Present"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "If you _____ a scholarship, tuition would be easier for your family.",
              skillTag: "grammar",
              topicTag,
              explanation: "Received — second conditional.",
              correct: "received",
              wrong: ["receive", "would receive"],
              distractorNotes: ["First conditional", "Would in if-clause"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  ];
}
