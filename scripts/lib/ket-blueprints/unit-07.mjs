import {
  buildMcq,
  buildMatching,
  buildGapFill,
  buildExercise,
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildReadingExercise,
  buildListeningExercise,
} from "../ket-unit-builder.mjs";

const TOPIC = "house-and-home";

const homePassage = buildPassage({
  title: "Moving to a New Flat",
  text: `Last month, Lan and her brother moved into a flat in a quiet neighbourhood. The building is old but the rooms are bright. Their balcony looks over a small park, and the garage downstairs is useful for their father's motorbike.

The landlord explained that the rent includes water, but electricity is extra. The kitchen has modern appliances, including a fridge and a washing machine. However, the sofa in the living room is old furniture that the previous tenant left behind.

On the first weekend, they needed a repair because the bathroom tap was broken. A plumber came quickly and fixed it. Their mother was worried about the mortgage because the family had saved for years to buy this home.

Lan likes the area. She says, "The house which we visited last year was smaller. Our new home, which has a large balcony, is perfect for studying." Her neighbour, who works at the bank, gave useful advice about home insurance. Lan feels happy that the flat was built in 2010 and is well looked after.`,
  imagePrompt:
    "A modern flat interior with balcony view, kitchen appliances, and a quiet residential neighbourhood street with garages.",
});

const viewingScript = buildListeningScript({
  title: "Flat Viewing Phone Call",
  setting: "Phone call between tenant and landlord",
  speakers: [
    { name: "Landlord", role: "property owner" },
    { name: "Lan", role: "prospective tenant" },
  ],
  lines: [
    {
      speaker: "Lan",
      text: "Hello. I'm calling about the flat on Oak Street. Is it still available?",
    },
    {
      speaker: "Landlord",
      text: "Yes. It has two bedrooms, a balcony and a garage. The rent is five hundred pounds a month.",
    },
    {
      speaker: "Lan",
      text: "Are the appliances included? We need a washing machine.",
    },
    {
      speaker: "Landlord",
      text: "Yes, the washing machine and fridge are included. The neighbourhood is very quiet.",
    },
    {
      speaker: "Lan",
      text: "Great. Can we visit on Saturday? My email is lan.nguyen@email.com.",
    },
  ],
  audioNotes:
    "Clear phone call, numbers and email spelled slowly. Natural pace. Approx. 40 seconds.",
});

const repairScript = buildListeningScript({
  title: "Repair Visit Conversation",
  setting: "Inside a flat living room",
  speakers: [
    { name: "Plumber", role: "repair worker" },
    { name: "Minh", role: "tenant" },
  ],
  lines: [
    {
      speaker: "Minh",
      text: "Thank you for coming. The tap in the bathroom was broken yesterday.",
    },
    {
      speaker: "Plumber",
      text: "No problem. It will be repaired in about thirty minutes.",
    },
    {
      speaker: "Minh",
      text: "The furniture in here is old, but the appliances in the kitchen are new.",
    },
    {
      speaker: "Plumber",
      text: "I see. Many flats in this building were built in 2010. The garage is downstairs.",
    },
    {
      speaker: "Minh",
      text: "Perfect. Should I pay now or later?",
    },
  ],
  audioNotes:
    "Indoor conversation, moderate natural speed with brief pauses. Approx. 38 seconds.",
});

function orderingQ(questionText, skillTag, explanation, parts, difficultyRating = 2) {
  const items = parts.map((text, i) => ({ id: `w${i + 1}`, text }));
  return {
    questionText,
    questionType: "sentence_ordering",
    skillTag,
    difficultyRating,
    points: 2,
    explanation,
    qualityScores: {
      quality: 0.9,
      difficulty: difficultyRating === 3 ? 0.38 : 0.35,
      curriculumAlignment: 0.96,
      needsReview: false,
    },
    content: { items, correctOrder: items.map((i) => i.id) },
  };
}

export default {
  vocabularyBank: [
    buildVocabWord({
      word: "furniture",
      ipa: "/ˈfɜːnɪtʃə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đồ nội thất",
      exampleSentence: "We bought new furniture for the living room.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "appliance",
      ipa: "/əˈplaɪəns/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thiết bị gia dụng",
      exampleSentence: "The kitchen has modern appliances.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "repair",
      ipa: "/rɪˈpeə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "sửa chữa",
      exampleSentence: "We called a worker for a repair in the bathroom.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "rent",
      ipa: "/rent/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tiền thuê nhà",
      exampleSentence: "The rent is due on the first day of the month.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "neighbourhood",
      ipa: "/ˈneɪbəhʊd/",
      partOfSpeech: "noun",
      vietnameseMeaning: "khu phố / vùng lân cận",
      exampleSentence: "It is a friendly neighbourhood with a park.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "balcony",
      ipa: "/ˈbælkəni/",
      partOfSpeech: "noun",
      vietnameseMeaning: "ban công",
      exampleSentence: "We have breakfast on the balcony in summer.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "garage",
      ipa: "/ˈɡærɑːʒ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "nhà để xe / gara",
      exampleSentence: "Our car is kept in the garage.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "mortgage",
      ipa: "/ˈmɔːɡɪdʒ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thế chấp / vay mua nhà",
      exampleSentence: "They are paying a mortgage on their house.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "landlord",
      ipa: "/ˈlændlɔːd/",
      partOfSpeech: "noun",
      vietnameseMeaning: "chủ nhà cho thuê",
      exampleSentence: "The landlord collects the rent every month.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "tenant",
      ipa: "/ˈtenənt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "người thuê nhà",
      exampleSentence: "The new tenant moved in last week.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "utility",
      ipa: "/juːˈtɪləti/",
      partOfSpeech: "noun",
      vietnameseMeaning: "dịch vụ tiện ích (điện, nước...)",
      exampleSentence: "Electricity is the most expensive utility.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "upstairs",
      ipa: "/ˌʌpˈsteəz/",
      partOfSpeech: "adverb",
      vietnameseMeaning: "ở tầng trên",
      exampleSentence: "The bedrooms are upstairs.",
      topic: TOPIC,
    }),
  ],

  grammarReference: [
    buildGrammarRef({
      structure: "Passive voice: present and past simple",
      explanation:
        "Use passive (be + past participle) when the action is more important than who does it, or when the doer is unknown. Present passive: is/are + past participle. Past passive: was/were + past participle.",
      examples: [
        "The flat is rented by a young family.",
        "The tap was repaired yesterday.",
        "Modern appliances are included in the kitchen.",
        "Many houses were built in this neighbourhood in 2010.",
      ],
      commonMistakes: [
        "The tap was repair (×) → The tap was repaired (✓)",
        "The rent is pay every month (×) → The rent is paid every month (✓)",
        "The furniture were made (×) → The furniture was made (✓)",
      ],
      topic: TOPIC,
    }),
    buildGrammarRef({
      structure: "Relative clauses (defining and non-defining, basic)",
      explanation:
        "Use who for people, which for things, and where for places. Defining clauses give essential information (no commas). Non-defining clauses add extra information (with commas).",
      examples: [
        "The tenant who lives upstairs is very friendly.",
        "The flat which we visited has a balcony.",
        "Our neighbourhood, which is near the park, is very quiet.",
        "This is the house where I grew up.",
      ],
      commonMistakes: [
        "The man which lives here (×) → The man who lives here (✓)",
        "The flat, we visited (×) → The flat which we visited (✓)",
        "The house who is old (×) → The house which is old (✓)",
      ],
      topic: TOPIC,
    }),
  ],

  unit: {
    learningObjectives: [
      "Use core house and home vocabulary at A2 level.",
      "Use present and past passive to describe homes and repairs.",
      "Use basic relative clauses with who, which and where.",
      "Understand grammar and vocabulary in a short text about moving home.",
      "Understand conversations about flats and repairs at natural speed.",
      "Write a short message describing your home.",
      "Answer interview questions about where you live.",
    ],
  },

  lessons: {
    vocabulary: {
      slug: "vocab-home-words",
      title: "Lesson 1: House and Home Words",
      learningObjective:
        "Recognise and understand twelve house and home words at KET A2 level.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "vocab-home-learn",
          title: "Learn: Home Word Match",
          instructions: "Read each sentence. Choose the best word.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Tables, chairs and sofas are types of _____.",
              skillTag: "vocabulary",
              explanation: "Furniture (đồ nội thất) gồm bàn ghế, sofa.",
              correct: "furniture",
              wrong: ["appliance", "utility"],
              distractorNotes: ["Machines like fridges", "Services like electricity"],
            }),
            buildMcq({
              questionText: "A fridge and a washing machine are kitchen _____.",
              skillTag: "vocabulary",
              explanation: "Appliance (thiết bị) là máy gia dụng.",
              correct: "appliances",
              wrong: ["furniture", "mortgages"],
              distractorNotes: ["Tables and chairs", "Home loans"],
            }),
            buildMcq({
              questionText: "When something is broken and fixed, it needs a _____.",
              skillTag: "vocabulary",
              explanation: "Repair (sửa chữa) khi đồ hỏng được sửa.",
              correct: "repair",
              wrong: ["rent", "balcony"],
              distractorNotes: ["Monthly payment", "Outdoor platform"],
            }),
            buildMcq({
              questionText: "Money you pay to live in a flat each month is the _____.",
              skillTag: "vocabulary",
              explanation: "Rent (tiền thuê) trả hàng tháng.",
              correct: "rent",
              wrong: ["garage", "neighbourhood"],
              distractorNotes: ["Car storage", "Area around home"],
            }),
            buildMcq({
              questionText: "The area around your home is your _____.",
              skillTag: "vocabulary",
              explanation: "Neighbourhood (khu phố) là vùng quanh nhà.",
              correct: "neighbourhood",
              wrong: ["mortgage", "tenant"],
              distractorNotes: ["Bank loan", "Person who rents"],
            }),
            buildMcq({
              questionText: "We drink coffee on the _____ in the morning sun.",
              skillTag: "vocabulary",
              explanation: "Balcony (ban công) là nơi ngồi ngoài tầng cao.",
              correct: "balcony",
              wrong: ["garage", "upstairs"],
              distractorNotes: ["Car park area", "Direction not place name"],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-home-matching",
          title: "Practice: Match the Pairs",
          instructions: "Match each word on the left with the correct meaning on the right.",
          exerciseType: "matching",
          sortOrder: 1,
          questions: [
            buildMatching({
              questionText: "Match the home words to their meanings.",
              skillTag: "vocabulary",
              explanation:
                "Mỗi từ khớp với nghĩa rõ ràng. Garage và mortgage thường bị nhầm.",
              pairs: [
                { left: "garage", right: "a building where you keep a car" },
                { left: "mortgage", right: "money borrowed to buy a house" },
                { left: "landlord", right: "a person who owns a rented flat" },
                { left: "tenant", right: "a person who pays rent to live somewhere" },
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-home-check",
          title: "Check: Vocab Quiz",
          instructions: "No hints — choose the best answer for each question.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          questions: [
            buildMcq({
              questionText: "Electricity and water are examples of a _____.",
              skillTag: "vocabulary",
              explanation: "Utility (dịch vụ tiện ích) như điện, nước.",
              correct: "utility",
              wrong: ["furniture", "balcony"],
              distractorNotes: ["Household objects", "Outdoor area"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "The bedrooms are _____, on the second floor.",
              skillTag: "vocabulary",
              explanation: "Upstairs (tầng trên) chỉ vị trí phòng ngủ.",
              correct: "upstairs",
              wrong: ["rent", "repair"],
              distractorNotes: ["Payment", "Fixing something"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "The _____ collects the _____ from the _____.",
              skillTag: "vocabulary",
              explanation: "Landlord thu rent từ tenant.",
              correct: "landlord ... rent ... tenant",
              wrong: ["tenant ... garage ... balcony", "appliance ... mortgage ... utility"],
              distractorNotes: ["Wrong roles", "Wrong words"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "They keep their car in the _____ below the flat.",
              skillTag: "vocabulary",
              explanation: "Garage (nhà để xe) thường ở tầng dưới.",
              correct: "garage",
              wrong: ["balcony", "neighbourhood"],
              distractorNotes: ["Outdoor platform", "Whole area"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-home-apply",
          title: "Apply: Words in Sentences",
          instructions: "Complete each sentence with the correct word from the unit.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText:
                "Complete: The [0] is five hundred a month. | We need a [1] for the tap. | Our [2] is very quiet.",
              skillTag: "vocabulary",
              explanation: "rent (tiền thuê); repair (sửa chữa); neighbourhood (khu phố).",
              template:
                "The [0] is five hundred a month. We need a [1] for the tap. Our [2] is very quiet.",
              correctAnswers: ["rent", "repair", "neighbourhood"],
              acceptableAnswers: [
                ["rent", "Rent"],
                ["repair", "Repair"],
                ["neighbourhood", "Neighbourhood"],
              ],
              difficultyRating: 2,
            }),
            buildGapFill({
              questionText:
                "Complete: The kitchen [0] are new. | The old [1] was left by the [2].",
              skillTag: "vocabulary",
              explanation: "appliances (thiết bị); furniture (nội thất); tenant (người thuê).",
              template:
                "The kitchen [0] are new. The old [1] was left by the [2].",
              correctAnswers: ["appliances", "furniture", "tenant"],
              acceptableAnswers: [
                ["appliances", "Appliances"],
                ["furniture", "Furniture"],
                ["tenant", "Tenant"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    grammar: {
      slug: "grammar-home-passive",
      title: "Lesson 2: Passive and Relative Clauses",
      learningObjective:
        "Use passive voice and basic relative clauses to describe homes.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "grammar-home-learn",
          title: "Learn: Passive and Who/Which",
          instructions: "Choose the correct word or phrase to complete each sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "The bathroom tap _____ yesterday.",
              skillTag: "grammar",
              explanation: "Past passive: was + repaired.",
              correct: "was repaired",
              wrong: ["repaired", "is repaired"],
              distractorNotes: ["Missing be verb", "Present passive wrong tense"],
            }),
            buildMcq({
              questionText: "Modern appliances _____ in the kitchen.",
              skillTag: "grammar",
              explanation: "Present passive plural: are included.",
              correct: "are included",
              wrong: ["is included", "include"],
              distractorNotes: ["Singular be", "Active voice"],
            }),
            buildMcq({
              questionText: "The tenant _____ lives upstairs is very friendly.",
              skillTag: "grammar",
              explanation: "Person → who in relative clause.",
              correct: "who",
              wrong: ["which", "where"],
              distractorNotes: ["For things", "For places"],
            }),
            buildMcq({
              questionText: "The flat _____ we visited has a large balcony.",
              skillTag: "grammar",
              explanation: "Thing → which in relative clause.",
              correct: "which",
              wrong: ["who", "where"],
              distractorNotes: ["For people", "For places"],
            }),
            buildMcq({
              questionText: "Many houses in this area _____ in 2010.",
              skillTag: "grammar",
              explanation: "Past passive plural: were built.",
              correct: "were built",
              wrong: ["was built", "built"],
              distractorNotes: ["Singular was", "Active missing be"],
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-home-practice",
          title: "Practice: Complete the Grammar",
          instructions: "Fill in each gap with the correct form.",
          exerciseType: "gap_fill",
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText:
                "Complete: The rent [0] paid on the first day. | The sofa [1] left by the old tenant. | The flats [2] built in 2010.",
              skillTag: "grammar",
              explanation: "is (rent); was (sofa); were (flats) — passive forms.",
              template:
                "The rent [0] paid on the first day. The sofa [1] left by the old tenant. The flats [2] built in 2010.",
              correctAnswers: ["is", "was", "were"],
              acceptableAnswers: [
                ["is", "Is"],
                ["was", "Was"],
                ["were", "Were"],
              ],
              difficultyRating: 2,
            }),
            buildGapFill({
              questionText:
                "Complete: The man [0] is our landlord works nearby. | The house [1] we like has a garage. | This is the street [2] I grew up.",
              skillTag: "grammar",
              explanation: "who (man); which (house); where (street).",
              template:
                "The man [0] is our landlord works nearby. The house [1] we like has a garage. This is the street [2] I grew up.",
              correctAnswers: ["who", "which", "where"],
              acceptableAnswers: [
                ["who", "Who"],
                ["which", "which", "Which", "that", "That"],
                ["where", "Where"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-home-check",
          title: "Check: Grammar Challenge",
          instructions: "Choose the correct answer. Think carefully.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          questions: [
            buildMcq({
              questionText: "Our neighbourhood, _____ is near the park, is very safe.",
              skillTag: "grammar",
              explanation: "Non-defining clause for thing/place → which.",
              correct: "which",
              wrong: ["who", "where"],
              distractorNotes: ["For people", "Needs place as antecedent"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "The mortgage _____ every month by my parents.",
              skillTag: "grammar",
              explanation: "Present passive: is paid.",
              correct: "is paid",
              wrong: ["pays", "is pay"],
              distractorNotes: ["Active voice", "Wrong past participle"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "The repair _____ finished when we arrived home.",
              skillTag: "grammar",
              explanation: "Past passive singular: was finished.",
              correct: "was finished",
              wrong: ["were finished", "finished"],
              distractorNotes: ["Plural were", "Missing auxiliary"],
              difficultyRating: 3,
            }),
            buildMcq({
              questionText: "The landlord _____ rented us the flat is helpful.",
              skillTag: "grammar",
              explanation: "Person → who.",
              correct: "who",
              wrong: ["which", "where"],
              distractorNotes: ["For things", "For places"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-home-order",
          title: "Apply: Build the Sentence",
          instructions: "Put the words in the correct order to make a sentence.",
          exerciseType: "sentence_ordering",
          sortOrder: 3,
          questions: [
            orderingQ(
              "Make a sentence: The tap / was / repaired / yesterday.",
              "grammar",
              "The tap was repaired yesterday. — past passive.",
              ["The tap", "was", "repaired", "yesterday."]
            ),
            orderingQ(
              "Make a sentence: The flat / which / we visited / has / a balcony.",
              "grammar",
              "The flat which we visited has a balcony. — relative clause with which.",
              ["The flat", "which", "we visited", "has", "a balcony."]
            ),
            orderingQ(
              "Make a sentence: The appliances / are / made / in / Europe.",
              "grammar",
              "The appliances are made in Europe. — present passive.",
              ["The appliances", "are", "made", "in", "Europe."],
              3
            ),
          ],
        }),
      ],
    },

    reading: {
      slug: "reading-moving-article",
      title: "Lesson 3: Moving Home Article",
      learningObjective:
        "Read a short text about moving home and understand grammar and vocabulary in context.",
      estimatedMinutes: 23,
      exercises: [
        buildReadingExercise({
          slug: "reading-home-learn",
          title: "Learn: Read the Article",
          instructions: "Read the article carefully. Answer the detail questions.",
          sortOrder: 0,
          passage: homePassage,
          questions: [
            buildMcq({
              questionText: "What is included in the rent?",
              skillTag: "reading",
              explanation: "The rent includes water, but electricity is extra.",
              correct: "Water",
              wrong: ["Electricity", "The mortgage"],
              distractorNotes: ["Extra utility", "Separate from rent"],
              assessmentType: "detail",
            }),
            buildMcq({
              questionText: "Why did they call a plumber?",
              skillTag: "reading",
              explanation: "Needed a repair because the bathroom tap was broken.",
              correct: "The bathroom tap was broken",
              wrong: ["The garage was too small", "The balcony was dirty"],
              distractorNotes: ["Garage useful not broken", "Balcony liked"],
              assessmentType: "detail",
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-home-practice",
          title: "Practice: Words in the Article",
          instructions: "Read the article again. Answer about vocabulary and meaning.",
          sortOrder: 1,
          passage: homePassage,
          questions: [
            buildMcq({
              questionText: "In the article, 'appliances' refers to _____.",
              skillTag: "reading",
              explanation: "Fridge and washing machine — thiết bị gia dụng.",
              correct: "machines like a fridge and washing machine",
              wrong: ["tables and sofas", "money paid to the bank"],
              distractorNotes: ["Furniture", "Mortgage"],
              assessmentType: "vocabulary_in_context",
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Why was Lan's mother worried?",
              skillTag: "reading",
              explanation: "Worried about the mortgage — vay mua nhà.",
              correct: "Because of the mortgage",
              wrong: ["Because the rent was too high", "Because the tenant left"],
              distractorNotes: ["Rent mentioned but not worry", "Previous tenant left furniture"],
              assessmentType: "inference",
              difficultyRating: 2,
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-home-check",
          title: "Check: Main Idea and Order",
          instructions: "Read the article one more time. These questions need careful thinking.",
          sortOrder: 2,
          passage: homePassage,
          questions: [
            buildMcq({
              questionText: "What is the article mainly about?",
              skillTag: "reading",
              explanation: "Bài kể Lan chuyển đến căn hộ mới và trải nghiệm đầu tiên.",
              correct: "Lan's family moving into a new flat",
              wrong: ["How to get a mortgage from a bank", "Rules for all landlords"],
              distractorNotes: ["Mortgage is one detail", "Too general"],
              assessmentType: "main_idea",
            }),
            buildMcq({
              questionText:
                "Put the events in order: (1) Repair in bathroom (2) Landlord explains rent (3) Family moves in",
              skillTag: "reading",
              explanation: "Chuyển vào → landlord giải thích → sửa tap cuối tuần.",
              correct: "3 → 2 → 1",
              wrong: ["1 → 2 → 3", "2 → 3 → 1"],
              distractorNotes: ["Repair after moving", "Move before explanation"],
              assessmentType: "sequencing",
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "reading-home-apply",
          title: "Apply: Match Facts from the Article",
          instructions: "Use what you read. Match each item to the correct fact.",
          exerciseType: "matching",
          sortOrder: 3,
          content: { passage: homePassage },
          questions: [
            buildMatching({
              questionText: "Match each item from the article to the correct fact.",
              skillTag: "reading",
              explanation: "Mỗi mục khớp với chi tiết trong bài.",
              pairs: [
                { left: "Balcony", right: "Looks over a small park" },
                { left: "Furniture", right: "Old sofa left by previous tenant" },
                { left: "Building", right: "Flats were built in 2010" },
              ],
            }),
          ],
        }),
      ],
    },

    listening: {
      slug: "listening-home-conversations",
      title: "Lesson 4: Home Conversations",
      learningObjective:
        "Understand details in conversations about flats and repairs at natural speed.",
      estimatedMinutes: 22,
      exercises: [
        buildListeningExercise({
          slug: "listening-viewing-learn",
          title: "Learn: Flat Viewing Call",
          instructions: "Listen to the phone call. Answer the questions.",
          sortOrder: 0,
          script: viewingScript,
          answerKey: { q1: "Oak Street flat", q2: "500 rent" },
          questions: [
            buildMcq({
              questionText: "What is Lan calling about?",
              skillTag: "listening",
              explanation: "Calling about the flat on Oak Street.",
              correct: "A flat on Oak Street",
              wrong: ["A garage for sale", "A mortgage at the bank"],
              distractorNotes: ["Garage mentioned as feature", "Mortgage not discussed"],
            }),
            buildMcq({
              questionText: "How much is the rent per month?",
              skillTag: "listening",
              explanation: "The rent is five hundred pounds a month.",
              correct: "Five hundred pounds",
              wrong: ["Two hundred pounds", "One thousand pounds"],
              distractorNotes: ["Not mentioned", "Too high"],
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-viewing-practice",
          title: "Practice: More from the Viewing Call",
          instructions: "Listen again to the same phone call. Answer the next questions.",
          sortOrder: 1,
          script: viewingScript,
          answerKey: { q1: "washing machine fridge", q2: "Saturday visit" },
          questions: [
            buildMcq({
              questionText: "Which appliances are included?",
              skillTag: "listening",
              explanation: "Washing machine and fridge are included.",
              correct: "Washing machine and fridge",
              wrong: ["Sofa and tables", "Mortgage and rent"],
              distractorNotes: ["Furniture not discussed", "Wrong items"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "When does Lan want to visit the flat?",
              skillTag: "listening",
              explanation: "Can we visit on Saturday?",
              correct: "On Saturday",
              wrong: ["On Monday", "Yesterday"],
              distractorNotes: ["Not mentioned", "Past"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-repair-check",
          title: "Check: Repair Visit",
          instructions: "Listen to a new conversation. Choose the correct answer.",
          sortOrder: 2,
          script: repairScript,
          answerKey: {
            q1: "broken tap bathroom",
            q2: "30 minutes",
            q3: "built 2010",
          },
          questions: [
            buildMcq({
              questionText: "What needs to be repaired?",
              skillTag: "listening",
              explanation: "The tap in the bathroom was broken.",
              correct: "The bathroom tap",
              wrong: ["The garage door", "The balcony railing"],
              distractorNotes: ["Mentioned but not broken", "Not mentioned"],
            }),
            buildMcq({
              questionText: "How long will the repair take?",
              skillTag: "listening",
              explanation: "Repaired in about thirty minutes.",
              correct: "About thirty minutes",
              wrong: ["About three hours", "Two days"],
              distractorNotes: ["Not mentioned", "Too long"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "When were many flats in the building built?",
              skillTag: "listening",
              explanation: "Many flats were built in 2010.",
              correct: "In 2010",
              wrong: ["In 2000", "Last year"],
              distractorNotes: ["Wrong year", "Too recent for many flats"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "listening-viewing-apply",
          title: "Apply: Match What You Heard",
          instructions: "Listen again to the flat viewing call. Match each item to the correct detail.",
          exerciseType: "matching",
          sortOrder: 3,
          content: { script: viewingScript },
          questions: [
            buildMatching({
              questionText: "Match each item from the flat viewing call.",
              skillTag: "listening",
              explanation: "Mỗi mục khớp với chi tiết trong cuộc gọi.",
              pairs: [
                { left: "Number of bedrooms", right: "Two" },
                { left: "Extra features", right: "Balcony and garage" },
                { left: "Neighbourhood", right: "Very quiet" },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    writing: {
      slug: "writing-home-message",
      title: "Lesson 5: Message About Your Home",
      learningObjective:
        "Write a short message describing your home using unit vocabulary and passive forms.",
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: "writing-home-learn",
          title: "Learn: Home Description Phrases",
          instructions:
            "Complete each gap with a word from the box: balcony, rent, furniture, appliance, neighbourhood.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Hi Sam, | Our [0] is quiet and friendly. | The [1] is four hundred a month. | We have a small [2].",
              skillTag: "writing",
              explanation:
                "neighbourhood (khu phố); rent (tiền thuê); balcony (ban công).",
              template:
                "Hi Sam,\n\nOur [0] is quiet and friendly. The [1] is four hundred a month. We have a small [2].",
              correctAnswers: ["neighbourhood", "rent", "balcony"],
              acceptableAnswers: [
                ["neighbourhood", "Neighbourhood"],
                ["rent", "Rent"],
                ["balcony", "Balcony"],
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "writing-home-order-practice",
          title: "Practice: Build Home Sentences",
          instructions: "Put the words in order to make correct sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            orderingQ(
              "Make a sentence: The kitchen / was / painted / last year.",
              "writing",
              "The kitchen was painted last year. — past passive.",
              ["The kitchen", "was", "painted", "last year."]
            ),
            orderingQ(
              "Make a sentence: The flat / which / we rent / has / a garage.",
              "writing",
              "The flat which we rent has a garage. — relative clause.",
              ["The flat", "which", "we rent", "has", "a garage."]
            ),
          ],
        }),
        buildExercise({
          slug: "writing-home-check",
          title: "Check: Message About Your Home",
          instructions: "Write a message to a friend. Write at least 25 words.",
          exerciseType: "writing",
          sortOrder: 2,
          content: {
            taskDescription:
              "Write a short message to your friend Sam describing where you live now.",
            prompts: [
              "Say what type of home you live in (flat or house).",
              "Describe one or two features (balcony, garage, appliances, furniture).",
              "Say something about your neighbourhood.",
              "End the message in a friendly way.",
            ],
            minWords: 25,
            successCriteria: [
              "At least 25 words",
              "Clear description of home",
              "Uses passive or relative clause if possible",
              "Uses at least two unit vocabulary words",
              "Friendly opening and closing",
            ],
            modelAnswer: {
              text: "Hi Sam,\n\nI live in a flat which has a small balcony and a garage downstairs. The kitchen appliances are new, but the furniture is quite old. Our neighbourhood is quiet and friendly. The rent is paid on the first day every month.\n\nSee you soon,\nLan",
            },
            rubric: {
              grammar: {
                weight: 0.25,
                criteria:
                  "Uses passive or relative clauses (who/which/where) correctly if attempted.",
              },
              vocabulary: {
                weight: 0.25,
                criteria:
                  "Uses home words (furniture, appliance, rent, balcony, neighbourhood) appropriately.",
              },
              organization: {
                weight: 0.25,
                criteria: "Message has greeting, description and a friendly closing.",
              },
              taskAchievement: {
                weight: 0.25,
                criteria:
                  "Describes home and neighbourhood clearly; at least 25 words.",
              },
            },
            autoCheckKeywords: [
              "flat",
              "house",
              "home",
              "balcony",
              "garage",
              "rent",
              "furniture",
              "appliance",
              "neighbourhood",
              "sam",
            ],
          },
        }),
        buildExercise({
          slug: "writing-home-apply",
          title: "Apply: Complete the Message Frames",
          instructions: "Complete the message frames with the correct unit words.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Ana, | The tap [0] repaired yesterday. | The man [1] is our landlord is kind. | Best, | Minh",
              skillTag: "writing",
              explanation: "was (past passive); who (relative clause for person).",
              template:
                "Dear Ana,\n\nThe tap [0] repaired yesterday. The man [1] is our landlord is kind.\n\nBest,\nMinh",
              correctAnswers: ["was", "who"],
              acceptableAnswers: [
                ["was", "Was"],
                ["who", "Who"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    speaking: {
      slug: "speaking-home-habits",
      title: "Lesson 6: Talk About Your Home",
      learningObjective:
        "Answer interview questions about your home using unit vocabulary and grammar.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "speaking-home-learn",
          title: "Learn: Choose the Best Reply",
          instructions: "Imagine an examiner asks you a question. Choose the best answer.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Examiner: Do you live in a house or a flat? You say:",
              skillTag: "speaking",
              explanation: "Trả lời trực tiếp loại nhà ở.",
              correct: "I live in a flat with my family.",
              wrong: ["I live in a rent with my family.", "I live in a mortgage."],
              distractorNotes: ["Rent is payment not home type", "Mortgage is a loan"],
            }),
            buildMcq({
              questionText: "Examiner: What is your favourite room? You say:",
              skillTag: "speaking",
              explanation: "Mô tả phòng yêu thích với balcony hoặc view.",
              correct: "My favourite room is the living room because it has a balcony.",
              wrong: [
                "My favourite room is the garage because it has a balcony.",
                "My favourite repair is the living room.",
              ],
              distractorNotes: ["Garage not typical favourite room", "Repair is not a room"],
            }),
            buildMcq({
              questionText: "Examiner: Is your home old or new? You say:",
              skillTag: "speaking",
              explanation: "Passive: was built — mô tả năm xây.",
              correct: "It is quite new. It was built in 2015.",
              wrong: ["It is quite new. It built in 2015.", "It is quite new. It was build in 2015."],
              distractorNotes: ["Missing passive be", "Wrong past participle"],
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-home-practice",
          title: "Practice: Best Response",
          instructions: "Choose the best phrase you would say in each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 1,
          questions: [
            buildMcq({
              questionText: "Examiner: Tell me about your neighbourhood. You say:",
              skillTag: "speaking",
              explanation: "Neighbourhood + đặc điểm — cấu trúc phỏng vấn A2.",
              correct: "My neighbourhood is quiet and there is a park nearby.",
              wrong: [
                "My mortgage is quiet and there is a park nearby.",
                "My appliance is quiet and there is a park nearby.",
              ],
              distractorNotes: ["Mortgage is loan", "Appliance is a machine"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Examiner: Who do you pay rent to? You say:",
              skillTag: "speaking",
              explanation: "Landlord là chủ nhà nhận rent.",
              correct: "We pay rent to our landlord every month.",
              wrong: [
                "We pay rent to our tenant every month.",
                "We pay rent to our garage every month.",
              ],
              distractorNotes: ["Tenant pays not receives", "Garage is not a person"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Examiner: Describe a person who lives near you. You say:",
              skillTag: "speaking",
              explanation: "Relative clause with who for neighbour.",
              correct: "I have a neighbour who works at the local shop.",
              wrong: [
                "I have a neighbour which works at the local shop.",
                "I have a neighbour where works at the local shop.",
              ],
              distractorNotes: ["Which for things", "Where for places"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-home-interview",
          title: "Check: Home Interview",
          instructions:
            "Answer the examiner's questions about where you live. Speak for up to two minutes.",
          exerciseType: "speaking",
          sortOrder: 2,
          content: {
            prompt:
              "The examiner will ask you about your home, neighbourhood and any repairs or appliances.",
            pictureDescription:
              "A modern flat with a balcony, kitchen appliances, a garage entrance below, and a quiet tree-lined street.",
            followUpQuestions: [
              "Do you live in a house or a flat? Describe it.",
              "What furniture and appliances do you have at home?",
              "Is your neighbourhood quiet or noisy? Why?",
              "Have you ever needed a repair at home? What happened?",
              "Would you prefer to rent or buy a home in the future?",
              "Tell me about a neighbour who you know well.",
            ],
            suggestedAnswers: [
              "I live in a flat with two bedrooms and a small balcony.",
              "We have a sofa and table in the living room, and new kitchen appliances.",
              "My neighbourhood is quiet because there is little traffic.",
              "Yes, the tap was broken and a plumber repaired it in one hour.",
              "In the future I would like to buy a house, but a mortgage is expensive.",
              "My neighbour who lives upstairs is a teacher and she is very friendly.",
            ],
            assessmentCriteria: {
              pronunciation:
                "Key words (furniture, appliance, rent, balcony, neighbourhood) are understandable.",
              fluency: "Responds with phrases or short sentences without long silences.",
              grammar:
                "Uses passive or relative clauses in at least two answers.",
              vocabulary: "Uses at least four different unit words correctly.",
            },
            maxDurationSeconds: 120,
          },
        }),
        buildExercise({
          slug: "speaking-home-apply",
          title: "Apply: Situational Response",
          instructions: "Choose the best thing to say in each home situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "Your landlord asks if the appliances work. You say:",
              skillTag: "speaking",
              explanation: "Mô tả appliances hoạt động tốt.",
              correct: "Yes, the fridge and washing machine work well.",
              wrong: [
                "Yes, the mortgage and rent work well.",
                "Yes, the neighbourhood and garage work well.",
              ],
              distractorNotes: ["Wrong nouns", "Wrong collocation"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "A friend asks where you park your car. You say:",
              skillTag: "speaking",
              explanation: "Garage downstairs — trả lời tự nhiên.",
              correct: "We park it in the garage downstairs.",
              wrong: ["We park it on the balcony.", "We park it in the mortgage."],
              distractorNotes: ["Balcony wrong place", "Mortgage is not a place"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "You are describing the flat you want to rent. You say:",
              skillTag: "speaking",
              explanation: "Relative clause: flat which has...",
              correct: "I want a flat which has a balcony and a quiet neighbourhood.",
              wrong: [
                "I want a flat who has a balcony and a quiet neighbourhood.",
                "I want a flat where has a balcony and a quiet neighbourhood.",
              ],
              distractorNotes: ["Who for people", "Where needs place antecedent"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  },
};
