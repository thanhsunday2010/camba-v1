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

const TOPIC = "environment";

function buildOrderQ(questionText, skillTag, explanation, parts, difficultyRating = 2) {
  const items = parts.map((text, i) => ({ id: `w${i + 1}`, text }));
  return {
    questionText,
    questionType: "sentence_ordering",
    skillTag,
    difficultyRating,
    points: difficultyRating >= 3 ? 2 : 1,
    explanation,
    qualityScores: {
      quality: 0.9,
      difficulty: 0.35,
      curriculumAlignment: 0.96,
      needsReview: false,
    },
    content: { items, correctOrder: items.map((x) => x.id) },
  };
}

const environmentPassage = buildPassage({
  title: "Green Valley Eco Week",
  text: `GREEN VALLEY SECONDARY SCHOOL — ECO WEEK PLAN

Our town had a dry summer and a small flood in the north village last year. Eco Week starts on 12 May to help students learn about energy, waste and wildlife.

Monday — Energy Day
Solar panels were installed on the sports hall roof last month. If the weather is sunny, the school will use less electricity from the grid. Students are asked to turn off lights in empty classrooms.

Tuesday — Waste and Recycling
Food waste is collected every morning. Paper and plastic are recycled in the blue bins near the gate. If each class produces less waste, more money will be saved for conservation projects.

Wednesday — Climate and Water
A talk about climate change and drought will be given by Ms Ngo at 2 p.m. She will explain how floods and long dry periods affect local farms and wildlife habitats.

Thursday — Wildlife Walk
Year 8 students will visit the river habitat with a park ranger. Rare birds are protected in this area. Photos may be taken, but litter must not be left behind.

Friday — Community Action
Families are invited to plant trees and learn about renewable energy at the town square. Registration is free at reception.`,
const listeningScript1 = buildListeningScript({
  title: "Eco Week Assembly Talk",
  setting: "School assembly hall",
  speakers: [{ name: "Mr Phan", role: "science teacher" }],
  lines: [
    {
      speaker: "Mr Phan",
      text: "Good morning. Welcome to Eco Week. Last year, waste in our school was reduced by ten percent.",
    },
    {
      speaker: "Mr Phan",
      text: "Solar energy from the new panels is used in the library. If we save energy this term, the money will support wildlife conservation.",
    },
    {
      speaker: "Mr Phan",
      text: "Remember: plastic bottles are recycled in the blue bins. Food waste must be separated every day.",
    },
    {
      speaker: "Mr Phan",
      text: "On Friday, renewable energy models will be shown in the square. I hope to see you there.",
    },
  ],
  audioNotes:
    "Encouraging teacher voice, clear assembly acoustics. Approx. 45 seconds.",
});

const listeningScript2 = buildListeningScript({
  title: "Weather and Flood Report",
  setting: "Local radio news bulletin",
  speakers: [{ name: "News reader", role: "radio presenter" }],
  lines: [
    {
      speaker: "News reader",
      text: "Good evening. This is the Green Valley weather and environment report.",
    },
    {
      speaker: "News reader",
      text: "Heavy rain is expected tonight. If the river rises, low roads near the habitat may be closed.",
    },
    {
      speaker: "News reader",
      text: "Farmers say the long drought in spring damaged crops, but recent conservation work has helped wildlife return.",
    },
    {
      speaker: "News reader",
      text: "Residents are asked to recycle waste and save energy where possible. More news after this.",
    },
  ],
  audioNotes:
    "Neutral news tone, steady pace, light background music fade. Approx. 40 seconds.",
});

export default {
  vocabularyBank: [
    buildVocabWord({
      word: "energy",
      ipa: "/ˈenədʒi/",
      partOfSpeech: "noun",
      vietnameseMeaning: "năng lượng",
      exampleSentence: "Solar panels produce clean energy for the school.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "waste",
      ipa: "/weɪst/",
      partOfSpeech: "noun",
      vietnameseMeaning: "rác thải / chất thải",
      exampleSentence: "We try to produce less waste every week.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "climate",
      ipa: "/ˈklaɪmət/",
      partOfSpeech: "noun",
      vietnameseMeaning: "khí hậu",
      exampleSentence: "Climate change affects weather around the world.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "wildlife",
      ipa: "/ˈwaɪldlaɪf/",
      partOfSpeech: "noun",
      vietnameseMeaning: "động vật hoang dã",
      exampleSentence: "The park is home to local wildlife.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "conservation",
      ipa: "/ˌkɒnsəˈveɪʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "bảo tồn",
      exampleSentence: "Money was saved for wildlife conservation projects.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "renewable",
      ipa: "/rɪˈnjuːəbl/",
      partOfSpeech: "adjective",
      vietnameseMeaning: "tái tạo được",
      exampleSentence: "Wind and solar are renewable energy sources.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "drought",
      ipa: "/draʊt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hạn hán",
      exampleSentence: "The long drought damaged crops on local farms.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "flood",
      ipa: "/flʌd/",
      partOfSpeech: "noun",
      vietnameseMeaning: "lũ lụt / ngập lụt",
      exampleSentence: "There was a small flood in the north village last year.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "pollution",
      ipa: "/pəˈluːʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "ô nhiễm",
      exampleSentence: "Less waste means less pollution in the river.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "recycle",
      ipa: "/ˌriːˈsaɪkl/",
      partOfSpeech: "verb",
      vietnameseMeaning: "tái chế",
      exampleSentence: "Paper and plastic are recycled in the blue bins.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "habitat",
      ipa: "/ˈhæbɪtæt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "môi trường sống",
      exampleSentence: "Rare birds live in this river habitat.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "carbon",
      ipa: "/ˈkɑːbən/",
      partOfSpeech: "noun",
      vietnameseMeaning: "carbon (khí carbon)",
      exampleSentence: "Using less energy reduces carbon emissions.",
      difficulty: 2,
      topic: TOPIC,
    }),
  ],

  grammarReference: [
    buildGrammarRef({
      structure: "First conditional",
      explanation:
        "Use If + present simple, will + base verb to talk about real future results linked to a condition.",
      examples: [
        "If the weather is sunny, the school will use less electricity.",
        "If each class produces less waste, more money will be saved.",
        "If the river rises, low roads may be closed.",
        "If we save energy, wildlife will be protected.",
      ],
      commonMistakes: [
        "If it will rain, we stay home (×) → If it rains, we will stay home (✓)",
        "If we recycle, we saving energy (×) → If we recycle, we will save energy (✓)",
        "If the drought continues, crops are damaged (×) → If the drought continues, crops will be damaged (✓)",
      ],
      topic: TOPIC,
    }),
    buildGrammarRef({
      structure: "Passive voice in environmental contexts",
      explanation:
        "Use be + past participle to focus on the action or result, not who does it. Common in notices and reports about environment.",
      examples: [
        "Solar panels were installed on the roof last month.",
        "Food waste is collected every morning.",
        "Paper and plastic are recycled in the blue bins.",
        "Rare birds are protected in this area.",
      ],
      commonMistakes: [
        "Solar panels installed last month (×) → Solar panels were installed last month (✓)",
        "Waste is collect every day (×) → Waste is collected every day (✓)",
        "Birds are protect here (×) → Birds are protected here (✓)",
      ],
      topic: TOPIC,
    }),
  ],

  unit: {
    learningObjectives: [
      "Use environment vocabulary at A2 level.",
      "Use the first conditional to talk about energy, waste and climate.",
      "Recognise passive forms in environmental texts.",
      "Complete gaps in a short eco week plan.",
      "Understand detail in assembly talks and weather reports.",
      "Write a short message about helping the environment.",
      "Answer interview questions about local environmental issues.",
    ],
  },

  lessons: {
    vocabulary: {
      slug: "vocab-environment-words",
      title: "Lesson 1: Environment Words",
      learningObjective:
        "Recognise and understand twelve words about energy, climate and nature at KET A2 level.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "vocab-environment-learn",
          title: "Learn: Environment Word Match",
          instructions: "Read each sentence. Choose the best word.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Power from the sun or wind is called _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Energy (năng lượng) từ mặt trời/gió. Waste là rác thải.",
              correct: "energy",
              wrong: ["waste", "flood"],
              distractorNotes: ["Rubbish", "Too much water"],
            }),
            buildMcq({
              questionText: "Rubbish that we throw away is called _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Waste (rác thải). Conservation là bảo tồn.",
              correct: "waste",
              wrong: ["conservation", "climate"],
              distractorNotes: ["Protecting nature", "Weather over long time"],
            }),
            buildMcq({
              questionText: "Animals and plants living in nature are _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Wildlife (động vật hoang dã). Carbon là khí carbon.",
              correct: "wildlife",
              wrong: ["carbon", "postage"],
              distractorNotes: ["Gas topic", "Not environment word"],
            }),
            buildMcq({
              questionText: "Protecting forests and animals is called _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Conservation (bảo tồn). Pollution là ô nhiễm.",
              correct: "conservation",
              wrong: ["pollution", "drought"],
              distractorNotes: ["Dirty environment", "No rain period"],
            }),
            buildMcq({
              questionText: "Solar and wind power are _____ sources.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Renewable (tái tạo được) — không cạn kiệt.",
              correct: "renewable",
              wrong: ["wild", "empty"],
              distractorNotes: ["Describes animals", "Not collocated"],
            }),
            buildMcq({
              questionText: "When it does not rain for a long time, there is a _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Drought (hạn hán). Flood là ngược lại — quá nhiều nước.",
              correct: "drought",
              wrong: ["flood", "habitat"],
              distractorNotes: ["Too much water", "Living area"],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-environment-matching",
          title: "Practice: Match the Pairs",
          instructions: "Match each word on the left with the correct meaning on the right.",
          exerciseType: "matching",
          sortOrder: 1,
          questions: [
            buildMatching({
              questionText: "Match the environment words to their meanings.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Climate và weather khác nhau — climate là khí hậu dài hạn.",
              pairs: [
                { left: "climate", right: "weather conditions over a long time" },
                { left: "flood", right: "when water covers land after heavy rain" },
                { left: "recycle", right: "to use materials again instead of throwing them away" },
                { left: "habitat", right: "the natural home of an animal or plant" },
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-environment-check",
          title: "Check: Vocab Quiz",
          instructions: "No hints — choose the best answer for each question.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          qualityScores: { quality: 0.91, difficulty: 0.32, curriculumAlignment: 0.96, needsReview: false },
          questions: [
            buildMcq({
              questionText: "Dirty air and water in rivers cause _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Pollution (ô nhiễm) từ rác và hóa chất.",
              correct: "pollution",
              wrong: ["conservation", "registration"],
              distractorNotes: ["Protecting nature", "Wrong topic"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "We put old paper in bins so it can be _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Recycle (tái chế) giấy và nhựa.",
              correct: "recycled",
              wrong: ["flooded", "subscribed"],
              distractorNotes: ["Water disaster", "Media word"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Burning less fuel can reduce _____ emissions.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Carbon emissions — khí thải carbon.",
              correct: "carbon",
              wrong: ["headline", "receipt"],
              distractorNotes: ["News word", "Services word"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "After the _____, many fields were underwater.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Flood (lũ lụt) làm ngập đồng.",
              correct: "flood",
              wrong: ["drought", "profile"],
              distractorNotes: ["Dry period", "Wrong topic"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-environment-apply",
          title: "Apply: Complete the Sentences",
          instructions: "Fill in each gap with the correct word from the unit.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: "Complete: Solar [0] is a type of renewable [1].",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "energy; energy — năng lượng mặt trời tái tạo.",
              template: "Solar [0] is a type of renewable [1].",
              correctAnswers: ["energy", "energy"],
              acceptableAnswers: [
                ["energy", "Energy"],
                ["energy", "Energy"],
              ],
            }),
            buildGapFill({
              questionText: "Complete: The river [0] is home to local [1]. We must stop [2].",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "habitat; wildlife; pollution.",
              template: "The river [0] is home to local [1]. We must stop [2].",
              correctAnswers: ["habitat", "wildlife", "pollution"],
              acceptableAnswers: [
                ["habitat", "Habitat"],
                ["wildlife", "Wildlife"],
                ["pollution", "Pollution"],
              ],
            }),
          ],
        }),
      ],
    },

    grammar: {
      slug: "grammar-conditional-passive",
      title: "Lesson 2: First Conditional and Passive",
      learningObjective:
        "Use first conditional sentences and recognise passive forms in environmental contexts.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "grammar-env-learn",
          title: "Learn: Choose the Correct Form",
          instructions: "Choose the best answer to complete each sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "If we save energy, we _____ less carbon emissions.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "First conditional: If + present, will + verb.",
              correct: "will produce",
              wrong: ["produce", "produced"],
              distractorNotes: ["Zero conditional", "Past"],
            }),
            buildMcq({
              questionText: "Solar panels _____ on the roof last month.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Passive past: were installed.",
              correct: "were installed",
              wrong: ["installed", "were install"],
              distractorNotes: ["Missing be", "Wrong past participle form"],
            }),
            buildMcq({
              questionText: "Food waste _____ every morning.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Passive present: is collected.",
              correct: "is collected",
              wrong: ["is collect", "collects"],
              distractorNotes: ["Wrong participle", "Active voice"],
            }),
            buildMcq({
              questionText: "If the river rises, low roads _____ closed.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "First conditional passive: will be closed.",
              correct: "will be",
              wrong: ["are", "were"],
              distractorNotes: ["Present not future", "Past"],
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-env-practice",
          title: "Practice: Complete the Grammar",
          instructions: "Fill in each gap with the correct form.",
          exerciseType: "gap_fill",
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText: "Complete: If we [0] less waste, pollution [1] reduced. | Paper [2] in the blue bins.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "produce; will be; is recycled — first conditional + passive.",
              template: "If we [0] less waste, pollution [1] reduced. Paper [2] in the blue bins.",
              correctAnswers: ["produce", "will be", "is recycled"],
              acceptableAnswers: [
                ["produce", "Produce"],
                ["will be", "Will be"],
                ["is recycled", "Is recycled"],
              ],
            }),
            buildGapFill({
              questionText: "Complete: Rare birds [0] in this habitat. | If the drought [1], crops [2] damaged.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "are protected; continues; will be.",
              template: "Rare birds [0] in this habitat. If the drought [1], crops [2] damaged.",
              correctAnswers: ["are protected", "continues", "will be"],
              acceptableAnswers: [
                ["are protected", "Are protected"],
                ["continues", "Continues"],
                ["will be", "Will be"],
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-env-check",
          title: "Check: Grammar Challenge",
          instructions: "Choose the correct answer. Think carefully.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          qualityScores: { quality: 0.92, difficulty: 0.38, curriculumAlignment: 0.97, needsReview: false },
          questions: [
            buildMcq({
              questionText: "If it _____ heavily tonight, the north village may flood.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "If + present: rains (not will rain).",
              correct: "rains",
              wrong: ["will rain", "rained"],
              distractorNotes: ["Future in if-clause", "Past"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Plastic bottles _____ in the blue bins every day.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Passive present plural: are recycled.",
              correct: "are recycled",
              wrong: ["is recycled", "are recycle"],
              distractorNotes: ["Singular be", "Wrong participle"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "If each class saves energy, more money _____ for conservation.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "will be saved — future passive.",
              correct: "will be saved",
              wrong: ["is saved", "will save"],
              distractorNotes: ["Present result", "Active missing object"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Which sentence is correct?",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "A talk will be given — passive future in notice style.",
              correct: "A talk about climate change will be given on Wednesday.",
              wrong: [
                "A talk about climate change will gave on Wednesday.",
                "A talk about climate change given will on Wednesday.",
              ],
              distractorNotes: ["Wrong verb form", "Wrong word order"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-env-apply",
          title: "Apply: Build the Sentence",
          instructions: "Put the words in the correct order to make a sentence.",
          exerciseType: "sentence_ordering",
          sortOrder: 3,
          questions: [
            buildOrderQ(
              "Make a sentence: If / we / recycle / more, / less waste / will / be / produced.",
              "grammar",
              "If we recycle more, less waste will be produced. — first conditional + passive.",
              ["If", "we", "recycle", "more,", "less waste", "will", "be", "produced."]
            ),
            buildOrderQ(
              "Make a sentence: Solar panels / were / installed / on the roof / last month.",
              "grammar",
              "Solar panels were installed on the roof last month. — passive past.",
              ["Solar panels", "were", "installed", "on the roof", "last month."],
              2
            ),
            buildOrderQ(
              "Make a sentence: If / the weather / is sunny, / the school / will / use / less energy.",
              "grammar",
              "If the weather is sunny, the school will use less energy. — first conditional.",
              ["If", "the weather", "is sunny,", "the school", "will", "use", "less energy."],
              3
            ),
          ],
        }),
      ],
    },

    reading: {
      slug: "reading-eco-week",
      title: "Lesson 3: Eco Week Plan",
      learningObjective:
        "Find details and main ideas in a school eco week plan using environment vocabulary.",
      estimatedMinutes: 23,
      exercises: [
        buildReadingExercise({
          slug: "reading-eco-learn",
          title: "Learn: Read the Eco Week Plan",
          instructions: "Read the plan carefully. Answer the detail questions.",
          sortOrder: 0,
          passage: environmentPassage,
          questions: [
            buildMcq({
              questionText: "When were solar panels installed?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Solar panels were installed on the sports hall roof last month.",
              correct: "Last month",
              wrong: ["Last year", "On Friday only"],
              distractorNotes: ["Flood was last year", "Friday is community day"],
              assessmentType: "detail",
            }),
            buildMcq({
              questionText: "Where are paper and plastic recycled?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Recycled in the blue bins near the gate.",
              correct: "In the blue bins near the gate",
              wrong: ["In the river habitat", "At the town square only"],
              distractorNotes: ["Wildlife walk area", "Friday event location"],
              assessmentType: "detail",
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-eco-practice",
          title: "Practice: Words in the Plan",
          instructions: "Read the plan again. Answer about vocabulary and meaning.",
          sortOrder: 1,
          passage: environmentPassage,
          difficulty: 0.3,
          questions: [
            buildMcq({
              questionText: "What does 'conservation projects' refer to in the plan?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Money saved for conservation projects — protecting wildlife/nature.",
              correct: "Work to protect nature and wildlife",
              wrong: ["Selling renewable energy", "Building new classrooms"],
              distractorNotes: ["Not sales focus", "Not construction"],
              assessmentType: "vocabulary_in_context",
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Why will Ms Ngo give a talk on Wednesday?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Talk about climate change and drought — how they affect farms and habitats.",
              correct: "To explain climate change and drought effects",
              wrong: ["To register families for bank accounts", "To sell advertisements"],
              distractorNotes: ["Registration is free Friday", "Not commercial"],
              assessmentType: "inference",
              difficultyRating: 2,
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-eco-check",
          title: "Check: Main Idea and Order",
          instructions: "Read the plan one more time. These questions need careful thinking.",
          sortOrder: 2,
          passage: environmentPassage,
          difficulty: 0.35,
          questions: [
            buildMcq({
              questionText: "What is the main purpose of Eco Week?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Help students learn about energy, waste and wildlife after local drought/flood.",
              correct: "To teach students about environmental issues and actions",
              wrong: ["To cancel all school lessons", "To build a new shopping centre"],
              distractorNotes: ["School continues with themed days", "Not mentioned"],
              assessmentType: "main_idea",
            }),
            buildMcq({
              questionText: "Which day focuses on visiting a river habitat?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Thursday — Wildlife Walk with park ranger at river habitat.",
              correct: "Thursday",
              wrong: ["Monday", "Tuesday"],
              distractorNotes: ["Energy Day", "Waste and Recycling"],
              assessmentType: "sequencing",
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "reading-eco-apply",
          title: "Apply: Match Days to Topics",
          instructions: "Use what you read. Match each day to the correct topic.",
          exerciseType: "matching",
          sortOrder: 3,
          content: { passage: environmentPassage },
          questions: [
            buildMatching({
              questionText: "Match each Eco Week day to its main topic.",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Mỗi ngày có chủ đề môi trường riêng trong kế hoạch.",
              pairs: [
                { left: "Monday", right: "Energy and solar panels" },
                { left: "Tuesday", right: "Waste and recycling" },
                { left: "Wednesday", right: "Climate change and drought talk" },
                { left: "Friday", right: "Community trees and renewable energy" },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    listening: {
      slug: "listening-environment-talks",
      title: "Lesson 4: Environment Talks",
      learningObjective:
        "Understand detail in an eco week assembly talk and a weather/environment radio report.",
      estimatedMinutes: 22,
      exercises: [
        buildListeningExercise({
          slug: "listening-eco-learn",
          title: "Learn: Eco Week Assembly",
          instructions: "Listen to the talk. Answer the first two questions.",
          sortOrder: 0,
          script: listeningScript1,
          answerKey: { q1: "ten percent waste reduced", q2: "library solar energy" },
          questions: [
            buildMcq({
              questionText: "By how much was school waste reduced last year?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Waste in our school was reduced by ten percent.",
              correct: "Ten percent",
              wrong: ["Fifty percent", "One percent"],
              distractorNotes: ["Too large", "Too small"],
            }),
            buildMcq({
              questionText: "Where is solar energy from the new panels used?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Solar energy from the new panels is used in the library.",
              correct: "In the library",
              wrong: ["In the town square", "In the river habitat"],
              distractorNotes: ["Friday event", "Thursday walk"],
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-eco-practice",
          title: "Practice: More from the Assembly",
          instructions: "Listen again to the same talk. Answer the next questions.",
          sortOrder: 1,
          script: listeningScript1,
          answerKey: { q1: "blue bins", q2: "Friday square event" },
          difficulty: 0.28,
          questions: [
            buildMcq({
              questionText: "Where should plastic bottles be recycled?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Plastic bottles are recycled in the blue bins.",
              correct: "In the blue bins",
              wrong: ["In the sports hall roof", "In the drought area"],
              distractorNotes: ["Solar panel location", "Not a bin location"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "What will be shown in the square on Friday?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Renewable energy models will be shown in the square.",
              correct: "Renewable energy models",
              wrong: ["Bank registration forms", "Video advertisements"],
              distractorNotes: ["Services topic", "Media topic"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-weather-check",
          title: "Check: Weather and Flood Report",
          instructions: "Listen to a new report. Choose the correct answer.",
          sortOrder: 2,
          script: listeningScript2,
          answerKey: { q1: "river may close roads", q2: "spring drought damaged crops" },
          difficulty: 0.32,
          questions: [
            buildMcq({
              questionText: "What may happen if the river rises?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Low roads near the habitat may be closed.",
              correct: "Low roads near the habitat may be closed",
              wrong: ["Solar panels will be removed", "School waste will increase"],
              distractorNotes: ["Not mentioned", "Opposite trend"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "What problem did farmers report about spring?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "The long drought in spring damaged crops.",
              correct: "A long drought damaged crops",
              wrong: ["A flood destroyed all wildlife", "Too much recycling"],
              distractorNotes: ["Wildlife returned later", "Recycling is positive"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "listening-environment-apply",
          title: "Apply: Match Facts from the Assembly",
          instructions: "Listen to the assembly talk again. Match each topic to the correct fact.",
          exerciseType: "matching",
          sortOrder: 3,
          content: {
            script: listeningScript1,
            answerKey: { matching: true },
          },
          questions: [
            buildMatching({
              questionText: "Match each topic to a fact from the assembly talk.",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Mỗi mục khớp với thông tin trong bài nói Eco Week.",
              pairs: [
                { left: "Food waste", right: "Must be separated every day" },
                { left: "Saved energy money", right: "Supports wildlife conservation" },
                { left: "Friday event", right: "Renewable energy models in the square" },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    writing: {
      slug: "writing-environment-message",
      title: "Lesson 5: Write About the Environment",
      learningObjective:
        "Write a short message about helping the environment using first conditional and passive forms.",
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: "writing-environment-learn",
          title: "Learn: Eco Message Phrases",
          instructions: "Complete each gap with a word from the box: waste, recycle, energy, if, will.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText: "Complete: We produce too much [0]. | [1] we [2] paper, less [3] is used.",
              skillTag: "writing",
              topicTag: TOPIC,
              explanation: "waste; If; recycle; energy — first conditional.",
              template: "We produce too much [0]. [1] we [2] paper, less [3] is used.",
              correctAnswers: ["waste", "If", "recycle", "energy"],
              acceptableAnswers: [
                ["waste", "Waste"],
                ["If", "if"],
                ["recycle", "Recycle"],
                ["energy", "Energy"],
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "writing-environment-order-practice",
          title: "Practice: Build Eco Sentences",
          instructions: "Put the words in order to make correct sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildOrderQ(
              "Make a sentence: If / we / save / energy, / pollution / will / be / reduced.",
              "writing",
              "If we save energy, pollution will be reduced.",
              ["If", "we", "save", "energy,", "pollution", "will", "be", "reduced."]
            ),
            buildOrderQ(
              "Make a sentence: Plastic bottles / are / recycled / in the blue bins.",
              "writing",
              "Plastic bottles are recycled in the blue bins. — passive present.",
              ["Plastic bottles", "are", "recycled", "in the blue bins."],
              2
            ),
          ],
        }),
        buildExercise({
          slug: "writing-environment-check",
          title: "Check: Message About Eco Week",
          instructions: "Write a message to your teacher. Write at least 25 words.",
          exerciseType: "writing",
          sortOrder: 2,
          content: {
            taskDescription:
              "Your school is planning Eco Week. Write a message to your science teacher with ideas about saving energy and reducing waste.",
            prompts: [
              "Say why you are writing.",
              "Give one idea to save energy at school.",
              "Use If ... to say what will happen if students recycle more.",
              "Mention wildlife or conservation.",
              "End politely.",
            ],
            minWords: 25,
            successCriteria: [
              "At least 25 words",
              "Ideas about energy or waste",
              "Uses if-clause or passive form",
              "Mentions environment vocabulary",
              "Polite closing",
            ],
            modelAnswer: {
              text: "Dear Mr Phan,\n\nI am writing about Eco Week. If we turn off lights in empty classrooms, the school will use less energy. Paper and plastic are recycled in the blue bins, but I think food waste must be separated more carefully. If each class produces less waste, more money will be saved for wildlife conservation.\n\nThank you,\nLan",
            },
            rubric: {
              grammar: {
                weight: 0.25,
                criteria: "Uses first conditional or passive forms correctly.",
              },
              vocabulary: {
                weight: 0.25,
                criteria: "Uses environment words (energy, waste, recycle, wildlife, etc.).",
              },
              organization: {
                weight: 0.25,
                criteria: "Message has greeting, ideas and polite closing.",
              },
              taskAchievement: {
                weight: 0.25,
                criteria: "Gives eco ideas; at least 25 words.",
              },
            },
            autoCheckKeywords: [
              "dear",
              "energy",
              "waste",
              "recycle",
              "if",
              "wildlife",
              "conservation",
              "pollution",
              "thank",
            ],
          },
        }),
        buildExercise({
          slug: "writing-environment-apply",
          title: "Apply: Complete the Message Frames",
          instructions: "Complete the message frames with the correct unit words.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: "Complete: Hi team, | If we [0] more, less [1] goes to landfill. | Rare birds are [2] in our river [3]. | Thanks, | Minh",
              skillTag: "writing",
              topicTag: TOPIC,
              explanation: "recycle; waste; protected; habitat.",
              template: "Hi team,\n\nIf we [0] more, less [1] goes to landfill. Rare birds are [2] in our river [3].\n\nThanks,\nMinh",
              correctAnswers: ["recycle", "waste", "protected", "habitat"],
              acceptableAnswers: [
                ["recycle", "Recycle"],
                ["waste", "Waste"],
                ["protected", "Protected"],
                ["habitat", "Habitat"],
              ],
            }),
          ],
        }),
      ],
    },

    speaking: {
      slug: "speaking-environment",
      title: "Lesson 6: Talk About the Environment",
      learningObjective:
        "Answer interview questions about energy, waste, climate and local environmental issues.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "speaking-environment-learn",
          title: "Learn: Choose the Best Reply",
          instructions: "Imagine an examiner asks you a question. Choose the best answer.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Examiner: What can you recycle at your school? You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Paper and plastic in blue bins — từ kế hoạch Eco Week.",
              correct: "We recycle paper and plastic in the blue bins.",
              wrong: ["We recycle bank accounts.", "We recycle headlines."],
              distractorNotes: ["Wrong topic", "Media word"],
            }),
            buildMcq({
              questionText: "Examiner: What is renewable energy? You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Energy from sun/wind that can be used again — A2 definition.",
              correct: "It is energy from sources like the sun and wind that do not run out.",
              wrong: ["It is energy from receipts.", "It is energy from queues."],
              distractorNotes: ["Services words", "Wrong context"],
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-environment-practice",
          title: "Practice: Best Response",
          instructions: "Choose the most appropriate reply in each environment situation.",
          exerciseType: "multiple_choice",
          sortOrder: 1,
          questions: [
            buildMcq({
              questionText: "Examiner: What will happen if we produce less waste? You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "First conditional: If we produce less waste, pollution will be reduced.",
              correct: "If we produce less waste, there will be less pollution.",
              wrong: ["If we will produce less waste, pollution reduced.", "Waste is if pollution."],
              distractorNotes: ["Will in if-clause", "Broken sentence"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Examiner: How is food waste handled at school? You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Passive: Food waste is collected every morning.",
              correct: "Food waste is collected every morning.",
              wrong: ["Food waste collects every morning.", "Food waste is collect."],
              distractorNotes: ["Active wrong subject", "Wrong participle"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-environment-check",
          title: "Check: Interview About the Environment",
          instructions: "Answer the examiner's questions. Record your answers.",
          exerciseType: "speaking",
          sortOrder: 2,
          content: {
            prompt:
              "The examiner will ask about energy, waste, climate, wildlife and environmental problems in your area.",
            sceneDescription:
              "A simple scene with solar panels on a school roof, blue recycling bins, a river habitat with birds and a tree-planting event.",
            followUpQuestions: [
              "Do you try to save energy at home or at school? How?",
              "What waste do you recycle in your family?",
              "Has your area had drought or flood problems?",
              "Why is wildlife conservation important?",
              "What will happen if students recycle more paper?",
              "Would you like to join an eco week event? Why or why not?",
            ],
            suggestedAnswers: [
              "Yes, I turn off lights when I leave a room to save energy.",
              "We recycle plastic bottles and paper every week.",
              "Last year we had a small flood after heavy rain, but spring was very dry.",
              "Wildlife conservation is important because animals need safe habitats.",
              "If students recycle more paper, less waste will be produced.",
              "Yes, I would like to plant trees because it helps the climate.",
            ],
            assessmentCriteria: {
              vocabulary: "Uses environment vocabulary (energy, waste, climate, wildlife, etc.).",
              grammar: "Uses first conditional and simple passive forms correctly.",
              fluency: "Speaks in short clear sentences.",
              taskAchievement: "Answers all six questions with relevant examples.",
            },
            maxDurationSeconds: 120,
          },
        }),
        buildExercise({
          slug: "speaking-environment-apply",
          title: "Apply: Situational Response",
          instructions: "Choose the best thing to say in each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "You see litter near a river habitat. You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Suggest action politely — litter must not be left (from eco plan).",
              correct: "We should pick up the litter so wildlife is protected.",
              wrong: ["Litter is good for birds.", "Wildlife loves plastic waste."],
              distractorNotes: ["Wrong fact", "Wrong fact"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Your friend asks about climate change. You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Simple A2 explanation linking climate to drought/flood.",
              correct: "Climate change can mean longer droughts and more floods in some places.",
              wrong: ["Climate change is a receipt.", "Climate is only on Monday."],
              distractorNotes: ["Wrong word", "Nonsense"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  },
};
