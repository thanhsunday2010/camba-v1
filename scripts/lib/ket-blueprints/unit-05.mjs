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

const TOPIC = "travel-and-transport";

const travelPassage = buildPassage({
  title: "Why More Students Take the Train",
  text: `Last year, many students at Riverside School started taking the train to the city centre instead of the bus. They said the bus route was often slow because of traffic delays.

Train travel has some clear advantages. You can book a reservation online and check the departure time on your phone. The fare is sometimes cheaper than a taxi, especially if you buy a weekly ticket. Passengers also know the exact platform before they arrive at the station.

However, not everyone agrees. Some parents worry when there is a long delay in winter. Others think the destination station is too far from the sports centre. The school newspaper asked readers: "Is the train really the best choice?"

Most students answered yes. They explained that they were reading or doing homework while they were travelling. One student wrote, "I will keep using the train next term because it saves time on busy days."`,
const trainAnnouncementScript = buildListeningScript({
  title: "Platform Change Announcement",
  setting: "City Central Station, loudspeaker",
  speakers: [{ name: "Announcer", role: "station staff" }],
  lines: [
    {
      speaker: "Announcer",
      text: "Good afternoon, passengers. The 4:15 train to Brighton has a fifteen-minute delay.",
    },
    {
      speaker: "Announcer",
      text: "Please go to platform 6, not platform 4. The departure time is now 4:30.",
    },
    {
      speaker: "Announcer",
      text: "Passengers for Oxford should spell their surname at the ticket desk: O-X-F-O-R-D.",
    },
    {
      speaker: "Announcer",
      text: "Thank you. Have a safe journey to your destination.",
    },
  ],
  audioNotes:
    "Clear station announcement, moderate pace. Destination names spelled clearly. Approx. 35 seconds.",
});

const bookingScript = buildListeningScript({
  title: "Train Reservation Call",
  setting: "Travel agency phone call",
  speakers: [
    { name: "Clerk", role: "travel agent" },
    { name: "Mai", role: "customer" },
  ],
  lines: [
    {
      speaker: "Clerk",
      text: "Good morning, City Travel. How can I help you?",
    },
    {
      speaker: "Mai",
      text: "Hello. I'd like to make a reservation for two passengers to Manchester on Saturday.",
    },
    {
      speaker: "Clerk",
      text: "The morning fare is eighteen pounds each. Departure is at 9:20 from platform 3.",
    },
    {
      speaker: "Mai",
      text: "Perfect. My destination is Manchester Piccadilly. Can I pay by card?",
    },
    {
      speaker: "Clerk",
      text: "Yes. I'll email your ticket. The route takes about two hours with one stop.",
    },
  ],
  audioNotes:
    "Friendly phone conversation, clear numbers and place names. Approx. 40 seconds.",
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
      word: "platform",
      ipa: "/ˈplætfɔːm/",
      partOfSpeech: "noun",
      vietnameseMeaning: "sân ga / vị trí tàu",
      exampleSentence: "Our train leaves from platform 6.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "reservation",
      ipa: "/ˌrezəˈveɪʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đặt chỗ",
      exampleSentence: "I made a reservation for two tickets online.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "delay",
      ipa: "/dɪˈleɪ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "sự trễ / chậm trễ",
      exampleSentence: "There was a twenty-minute delay this morning.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "destination",
      ipa: "/ˌdestɪˈneɪʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "điểm đến",
      exampleSentence: "Our destination is London King's Cross.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "departure",
      ipa: "/dɪˈpɑːtʃə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "giờ khởi hành",
      exampleSentence: "The departure time is 3:45 p.m.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "fare",
      ipa: "/feə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "giá vé",
      exampleSentence: "The return fare costs twelve pounds.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "route",
      ipa: "/ruːt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tuyến đường",
      exampleSentence: "We took the fastest route to the airport.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "passenger",
      ipa: "/ˈpæsɪndʒə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hành khách",
      exampleSentence: "Every passenger must show a ticket.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "luggage",
      ipa: "/ˈlʌɡɪdʒ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hành lý",
      exampleSentence: "Put your luggage on the rack above your seat.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "ticket",
      ipa: "/ˈtɪkɪt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "vé",
      exampleSentence: "Don't forget your train ticket.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "timetable",
      ipa: "/ˈtaɪmteɪbl/",
      partOfSpeech: "noun",
      vietnameseMeaning: "lịch trình / bảng giờ",
      exampleSentence: "Check the timetable for the next departure.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "boarding",
      ipa: "/ˈbɔːdɪŋ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "lên tàu / máy bay",
      exampleSentence: "Boarding starts twenty minutes before departure.",
      difficulty: 2,
      topic: TOPIC,
    }),
  ],

  grammarReference: [
    buildGrammarRef({
      structure: "Past simple and past continuous",
      explanation:
        "Use past simple for completed actions in the past. Use past continuous (was/were + -ing) for actions in progress at a specific time, or for background actions when something else happened.",
      examples: [
        "We missed the train because we were late.",
        "I was reading on the platform when the announcement started.",
        "They took the bus yesterday because the fare was cheaper.",
      ],
      commonMistakes: [
        "I was take the train (×) → I took the train (✓)",
        "While I waited, I was eat lunch (×) → While I was waiting, I ate lunch (✓)",
        "She were travelling (×) → She was travelling (✓)",
      ],
      topic: TOPIC,
    }),
    buildGrammarRef({
      structure: "Future forms: will, going to, present continuous for arrangements",
      explanation:
        "Use will for decisions made at the moment or predictions. Use going to for plans and intentions. Use present continuous for fixed arrangements with a time or place.",
      examples: [
        "I think the train will arrive soon.",
        "We are going to visit Brighton next weekend.",
        "I am meeting my friend at the station at six o'clock.",
      ],
      commonMistakes: [
        "I will going to travel (×) → I am going to travel (✓)",
        "We are go to Manchester (×) → We are going to Manchester (✓)",
        "She will arrives tomorrow (×) → She will arrive tomorrow (✓)",
      ],
      topic: TOPIC,
    }),
  ],

  unit: {
    learningObjectives: [
      "Use core travel and transport vocabulary at A2 level.",
      "Use past simple and past continuous to talk about journeys and delays.",
      "Use will, going to and present continuous for future travel plans and arrangements.",
      "Follow a short argument about transport choices in an article.",
      "Understand station announcements and spell names and places from recordings.",
      "Write a short message about a travel plan.",
      "Answer interview questions about how you travel.",
    ],
  },

  lessons: {
    vocabulary: {
      slug: "vocab-travel-words",
      title: "Lesson 1: Travel and Transport Words",
      learningObjective:
        "Recognise and understand twelve travel and transport words at KET A2 level.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "vocab-travel-learn",
          title: "Learn: Travel Word Match",
          instructions: "Read each sentence. Choose the best word.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "The place where you wait for a train is called a _____.",
              skillTag: "vocabulary",
              explanation:
                "Platform (sân ga) là nơi hành khách đợi tàu. Fare là giá vé.",
              correct: "platform",
              wrong: ["fare", "route"],
              distractorNotes: ["Price of travel", "Path between two places"],
            }),
            buildMcq({
              questionText: "When you book a seat in advance, you make a _____.",
              skillTag: "vocabulary",
              explanation:
                "Reservation (đặt chỗ) là đặt trước. Delay là sự trễ.",
              correct: "reservation",
              wrong: ["delay", "luggage"],
              distractorNotes: ["A late arrival", "Bags you carry"],
            }),
            buildMcq({
              questionText: "The train was late, so there was a _____.",
              skillTag: "vocabulary",
              explanation: "Delay (sự trễ) nghĩa là tàu/xe đến muộn.",
              correct: "delay",
              wrong: ["destination", "boarding"],
              distractorNotes: ["Where you are going", "Getting on a vehicle"],
            }),
            buildMcq({
              questionText: "London is our final _____.",
              skillTag: "vocabulary",
              explanation:
                "Destination (điểm đến) là nơi cuối cùng bạn tới. Departure là giờ đi.",
              correct: "destination",
              wrong: ["departure", "passenger"],
              distractorNotes: ["Time of leaving", "A person travelling"],
            }),
            buildMcq({
              questionText: "The _____ time is shown on the timetable board.",
              skillTag: "vocabulary",
              explanation:
                "Departure (giờ khởi hành) là lúc tàu rời ga. Ticket là vé.",
              correct: "departure",
              wrong: ["ticket", "route"],
              distractorNotes: ["Paper or digital pass", "The way you travel"],
            }),
            buildMcq({
              questionText: "How much is the train _____ to Manchester?",
              skillTag: "vocabulary",
              explanation: "Fare (giá vé) là số tiền phải trả cho chuyến đi.",
              correct: "fare",
              wrong: ["platform", "delay"],
              distractorNotes: ["Station area", "Late running"],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-travel-matching",
          title: "Practice: Match the Pairs",
          instructions: "Match each word on the left with the correct meaning on the right.",
          exerciseType: "matching",
          sortOrder: 1,
          questions: [
            buildMatching({
              questionText: "Match the travel words to their meanings.",
              skillTag: "vocabulary",
              explanation:
                "Mỗi từ khớp với một nghĩa rõ ràng. Route và timetable thường bị nhầm.",
              pairs: [
                { left: "route", right: "the way from one place to another" },
                { left: "passenger", right: "a person travelling on a bus or train" },
                { left: "timetable", right: "a list showing departure times" },
                { left: "luggage", right: "bags and suitcases you take on a journey" },
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-travel-check",
          title: "Check: Vocab Quiz",
          instructions: "No hints — choose the best answer for each question.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          questions: [
            buildMcq({
              questionText: "Getting on a plane or train is called _____.",
              skillTag: "vocabulary",
              explanation: "Boarding (lên tàu/máy bay) là bước lên phương tiện.",
              correct: "boarding",
              wrong: ["reservation", "fare"],
              distractorNotes: ["Booking in advance", "Ticket price"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "You must show your _____ before you travel.",
              skillTag: "vocabulary",
              explanation: "Ticket (vé) cần xuất trình khi đi. Delay là sự trễ.",
              correct: "ticket",
              wrong: ["delay", "destination"],
              distractorNotes: ["Late running", "End point of journey"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "The bus takes a different _____ because of road works.",
              skillTag: "vocabulary",
              explanation: "Route (tuyến đường) thay đổi khi có công trình.",
              correct: "route",
              wrong: ["platform", "boarding"],
              distractorNotes: ["Train waiting area", "Getting on vehicle"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Every _____ must keep their luggage with them.",
              skillTag: "vocabulary",
              explanation:
                "Passenger (hành khách) phải giữ hành lý. Fare là giá vé.",
              correct: "passenger",
              wrong: ["fare", "departure"],
              distractorNotes: ["Cost of travel", "Leaving time"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-travel-apply",
          title: "Apply: Words in Sentences",
          instructions: "Complete each sentence with the correct word from the unit.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Check the [0] for the next train. | Our [1] is Edinburgh. | There was a ten-minute [2].",
              skillTag: "vocabulary",
              explanation:
                "timetable (lịch trình); destination (điểm đến); delay (sự trễ).",
              template:
                "Check the [0] for the next train. Our [1] is Edinburgh. There was a ten-minute [2].",
              correctAnswers: ["timetable", "destination", "delay"],
              acceptableAnswers: [
                ["timetable", "Timetable"],
                ["destination", "Destination"],
                ["delay", "Delay"],
              ],
              difficultyRating: 2,
            }),
            buildGapFill({
              questionText:
                "Complete: I made a [0] online. | The [1] is fifteen pounds. | [2] starts at 8:50.",
              skillTag: "vocabulary",
              explanation:
                "reservation (đặt chỗ); fare (giá vé); Boarding (lên tàu).",
              template:
                "I made a [0] online. The [1] is fifteen pounds. [2] starts at 8:50.",
              correctAnswers: ["reservation", "fare", "Boarding"],
              acceptableAnswers: [
                ["reservation", "Reservation"],
                ["fare", "Fare"],
                ["Boarding", "boarding"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    grammar: {
      slug: "grammar-travel-tenses",
      title: "Lesson 2: Past and Future for Travel",
      learningObjective:
        "Use past simple/continuous and future forms to talk about journeys and plans.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "grammar-travel-learn",
          title: "Learn: Past and Future Forms",
          instructions: "Choose the correct word or phrase to complete each sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "We _____ the wrong platform and missed the train.",
              skillTag: "grammar",
              explanation: "Hành động đã hoàn thành → past simple: went.",
              correct: "went to",
              wrong: ["were going to", "are going"],
              distractorNotes: ["Future intention", "Present continuous"],
            }),
            buildMcq({
              questionText: "I _____ on the train when the conductor checked tickets.",
              skillTag: "grammar",
              explanation:
                "Hành động đang diễn ra → past continuous: was reading.",
              correct: "was reading",
              wrong: ["read", "am reading"],
              distractorNotes: ["Past simple completed", "Present continuous"],
            }),
            buildMcq({
              questionText: "Look at those clouds. I think it _____ rain.",
              skillTag: "grammar",
              explanation: "Dự đoán tại thời điểm nói → will rain.",
              correct: "will",
              wrong: ["is going to", "is"],
              distractorNotes: ["Plan based on evidence", "Present simple"],
            }),
            buildMcq({
              questionText: "We _____ to Brighton next Saturday. We bought tickets yesterday.",
              skillTag: "grammar",
              explanation: "Kế hoạch đã quyết định → going to visit.",
              correct: "are going to visit",
              wrong: ["will visit", "visit"],
              distractorNotes: ["Instant decision", "Present habit"],
            }),
            buildMcq({
              questionText: "I _____ my cousin at the station at 5 p.m. tomorrow.",
              skillTag: "grammar",
              explanation:
                "Sắp xếp cố định có thời gian → present continuous: am meeting.",
              correct: "am meeting",
              wrong: ["meet", "will meeting"],
              distractorNotes: ["Present simple habit", "Wrong future form"],
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-travel-practice",
          title: "Practice: Complete the Grammar",
          instructions: "Fill in each gap with the correct form.",
          exerciseType: "gap_fill",
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText:
                "Complete: They [0] waiting when the delay started. | We [1] take the bus tomorrow. | I [2] buying my ticket online tonight.",
              skillTag: "grammar",
              explanation:
                "were (past continuous); will (future decision); am (present continuous arrangement).",
              template:
                "They [0] waiting when the delay started. We [1] take the bus tomorrow. I [2] buying my ticket online tonight.",
              correctAnswers: ["were", "will", "am"],
              acceptableAnswers: [
                ["were", "Were"],
                ["will", "Will"],
                ["am", "Am"],
              ],
              difficultyRating: 2,
            }),
            buildGapFill({
              questionText:
                "Complete: She [0] to Manchester last week. | He [1] going to book a reservation. | We [2] leaving at 7:30 on Friday.",
              skillTag: "grammar",
              explanation:
                "travelled (past simple); is (going to); are (present continuous arrangement).",
              template:
                "She [0] to Manchester last week. He [1] going to book a reservation. We [2] leaving at 7:30 on Friday.",
              correctAnswers: ["travelled", "is", "are"],
              acceptableAnswers: [
                ["travelled", "traveled", "Travelled", "Traveled"],
                ["is", "Is"],
                ["are", "Are"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-travel-check",
          title: "Check: Grammar Challenge",
          instructions: "Choose the correct answer. Think carefully.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          questions: [
            buildMcq({
              questionText: "While passengers _____ for the train, an announcement started.",
              skillTag: "grammar",
              explanation:
                "Hành động nền đang diễn ra → were waiting.",
              correct: "were waiting",
              wrong: ["waited", "are waiting"],
              distractorNotes: ["Completed action", "Wrong tense for past context"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "The fare is expensive, so we _____ the cheaper route.",
              skillTag: "grammar",
              explanation: "Quyết định tại thời điểm nói → will take.",
              correct: "will take",
              wrong: ["take", "are taking"],
              distractorNotes: ["Present habit", "Fixed arrangement"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "What time _____ your departure tomorrow?",
              skillTag: "grammar",
              explanation: "Sắp xếp cố định → present continuous: is your train leaving.",
              correct: "is your train leaving",
              wrong: ["does your train leave", "will your train leaving"],
              distractorNotes: ["Timetable habit", "Wrong verb form"],
              difficultyRating: 3,
            }),
            buildMcq({
              questionText: "They _____ a reservation because they were going to travel at the weekend.",
              skillTag: "grammar",
              explanation: "Hành động hoàn thành trong quá khứ → made.",
              correct: "made",
              wrong: ["were making", "make"],
              distractorNotes: ["Action in progress", "Present tense"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-travel-order",
          title: "Apply: Build the Sentence",
          instructions: "Put the words in the correct order to make a sentence.",
          exerciseType: "sentence_ordering",
          sortOrder: 3,
          questions: [
            orderingQ(
              "Make a sentence: I / was / on platform 4 / when / the train / arrived.",
              "grammar",
              "I was on platform 4 when the train arrived. — past continuous + past simple.",
              ["I", "was", "on platform 4", "when", "the train", "arrived."]
            ),
            orderingQ(
              "Make a sentence: We / are going to / visit / our grandparents / next month.",
              "grammar",
              "We are going to visit our grandparents next month. — going to + plan.",
              ["We", "are going to", "visit", "our grandparents", "next month."]
            ),
            orderingQ(
              "Make a sentence: I / am meeting / my friend / at the station / at six o'clock.",
              "grammar",
              "I am meeting my friend at the station at six o'clock. — arrangement.",
              ["I", "am meeting", "my friend", "at the station", "at six o'clock."],
              3
            ),
          ],
        }),
      ],
    },

    reading: {
      slug: "reading-train-article",
      title: "Lesson 3: Train Travel Article",
      learningObjective:
        "Follow a short argument about transport choices and find details in context.",
      estimatedMinutes: 23,
      exercises: [
        buildReadingExercise({
          slug: "reading-train-learn",
          title: "Learn: Read the Article",
          instructions: "Read the article carefully. Answer the detail questions.",
          sortOrder: 0,
          passage: travelPassage,
          questions: [
            buildMcq({
              questionText: "Why did many students start taking the train?",
              skillTag: "reading",
              explanation:
                "Bài viết nói bus route was often slow because of traffic delays.",
              correct: "The bus was often slow",
              wrong: ["The train fare was always free", "The school banned buses"],
              distractorNotes: ["Not mentioned", "Not mentioned"],
              assessmentType: "detail",
            }),
            buildMcq({
              questionText: "What can passengers check on their phone?",
              skillTag: "reading",
              explanation: "Check the departure time on your phone.",
              correct: "The departure time",
              wrong: ["The platform number only", "Their luggage weight"],
              distractorNotes: ["Platform is known before arrival", "Not mentioned"],
              assessmentType: "detail",
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-train-practice",
          title: "Practice: Words in the Article",
          instructions: "Read the article again. Answer about vocabulary and meaning.",
          sortOrder: 1,
          passage: travelPassage,
          questions: [
            buildMcq({
              questionText: "In the article, a 'reservation' means _____.",
              skillTag: "reading",
              explanation: "Book a reservation online — đặt chỗ trước.",
              correct: "booking travel in advance",
              wrong: ["a delay at the station", "the price of a ticket"],
              distractorNotes: ["Different word: delay", "Different word: fare"],
              assessmentType: "vocabulary_in_context",
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Why might some parents worry in winter?",
              skillTag: "reading",
              explanation:
                "Some parents worry when there is a long delay in winter.",
              correct: "Because of long delays",
              wrong: ["Because the fare increases", "Because boarding stops"],
              distractorNotes: ["Not the parents' concern", "Not mentioned"],
              assessmentType: "inference",
              difficultyRating: 2,
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-train-check",
          title: "Check: Main Idea and Order",
          instructions: "Read the article one more time. These questions need careful thinking.",
          sortOrder: 2,
          passage: travelPassage,
          questions: [
            buildMcq({
              questionText: "What is the main topic of the article?",
              skillTag: "reading",
              explanation:
                "Bài so sánh lý do học sinh chọn tàu và ý kiến trái chiều.",
              correct: "Whether the train is a good choice for students",
              wrong: ["How to buy a cheaper bus ticket", "Rules for carrying luggage"],
              distractorNotes: ["Bus is background only", "Not the focus"],
              assessmentType: "main_idea",
            }),
            buildMcq({
              questionText:
                "Put the sections in order: (1) Advantages of the train (2) Students switching from bus (3) Different opinions",
              skillTag: "reading",
              explanation: "Bài: chuyển sang tàu → ưu điểm → ý kiến khác nhau.",
              correct: "2 → 1 → 3",
              wrong: ["1 → 2 → 3", "3 → 1 → 2"],
              distractorNotes: ["Students' change comes first", "Opinions come last"],
              assessmentType: "sequencing",
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "reading-train-apply",
          title: "Apply: Match Facts from the Article",
          instructions: "Use what you read. Match each item to the correct fact.",
          exerciseType: "matching",
          sortOrder: 3,
          content: { passage: travelPassage },
          questions: [
            buildMatching({
              questionText: "Match each item from the article to the correct fact.",
              skillTag: "reading",
              explanation: "Mỗi mục khớp với chi tiết trong bài viết.",
              pairs: [
                { left: "Online booking", right: "You can make a reservation" },
                { left: "Weekly ticket", right: "Sometimes cheaper than a taxi" },
                { left: "Most students", right: "Said the train saves time" },
              ],
            }),
          ],
        }),
      ],
    },

    listening: {
      slug: "listening-station-announcements",
      title: "Lesson 4: Station Announcements",
      learningObjective:
        "Understand main ideas in announcements and spell names and places from recordings.",
      estimatedMinutes: 22,
      exercises: [
        buildListeningExercise({
          slug: "listening-platform-learn",
          title: "Learn: Platform Change Announcement",
          instructions: "Listen to the announcement. Answer the questions.",
          sortOrder: 0,
          script: trainAnnouncementScript,
          answerKey: { q1: "platform 6", q2: "4:30" },
          questions: [
            buildMcq({
              questionText: "What is the announcement mainly about?",
              skillTag: "listening",
              explanation:
                "Thông báo về delay và đổi platform cho tàu đi Brighton.",
              correct: "A train delay and platform change",
              wrong: ["A new ticket fare", "Closing the station"],
              distractorNotes: ["Fare not mentioned", "Station stays open"],
            }),
            buildMcq({
              questionText: "Which platform should passengers go to?",
              skillTag: "listening",
              explanation: "Please go to platform 6, not platform 4.",
              correct: "Platform 6",
              wrong: ["Platform 4", "Platform 15"],
              distractorNotes: ["Old platform", "From delay time not platform"],
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-platform-practice",
          title: "Practice: More from the Announcement",
          instructions: "Listen again to the same announcement. Answer the next questions.",
          sortOrder: 1,
          script: trainAnnouncementScript,
          answerKey: { q1: "Oxford", q2: "O-X-F-O-R-D" },
          questions: [
            buildMcq({
              questionText: "Passengers for which place should spell their surname?",
              skillTag: "listening",
              explanation: "Passengers for Oxford should spell their surname.",
              correct: "Oxford",
              wrong: ["Brighton", "Manchester"],
              distractorNotes: ["Destination of delayed train", "From booking script"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "How is the place name spelled in the announcement?",
              skillTag: "listening",
              explanation: "Spell: O-X-F-O-R-D.",
              correct: "O-X-F-O-R-D",
              wrong: ["O-X-F-E-R-D", "O-X-F-O-R-T"],
              distractorNotes: ["Wrong vowel", "Wrong final letter"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-booking-check",
          title: "Check: Train Reservation Call",
          instructions: "Listen to a new conversation. Choose the correct answer.",
          sortOrder: 2,
          script: bookingScript,
          answerKey: {
            q1: "two passengers Manchester Saturday",
            q2: "18 pounds 9:20 platform 3",
            q3: "card email",
          },
          questions: [
            buildMcq({
              questionText: "What does Mai want to book?",
              skillTag: "listening",
              explanation:
                "Reservation for two passengers to Manchester on Saturday.",
              correct: "Two tickets to Manchester on Saturday",
              wrong: ["One ticket to Brighton today", "A bus to Oxford"],
              distractorNotes: ["Wrong number and place", "Wrong transport"],
            }),
            buildMcq({
              questionText: "What is the departure time and platform?",
              skillTag: "listening",
              explanation: "Departure is at 9:20 from platform 3.",
              correct: "9:20 from platform 3",
              wrong: ["4:30 from platform 6", "9:20 from platform 6"],
              distractorNotes: ["From announcement", "Wrong platform"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "How will Mai pay and receive the ticket?",
              skillTag: "listening",
              explanation: "Can I pay by card? — Yes. I'll email your ticket.",
              correct: "Pay by card; ticket by email",
              wrong: ["Pay cash at the platform", "Pay online only at the station"],
              distractorNotes: ["Cash not offered", "Online at station not said"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "listening-platform-apply",
          title: "Apply: Match What You Heard",
          instructions: "Listen again to the platform announcement. Match each item to the correct detail.",
          exerciseType: "matching",
          sortOrder: 3,
          content: { script: trainAnnouncementScript },
          questions: [
            buildMatching({
              questionText: "Match each item from the platform announcement.",
              skillTag: "listening",
              explanation: "Mỗi mục khớp với chi tiết trong thông báo.",
              pairs: [
                { left: "Train destination", right: "Brighton" },
                { left: "Length of delay", right: "Fifteen minutes" },
                { left: "New departure time", right: "4:30" },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    writing: {
      slug: "writing-travel-message",
      title: "Lesson 5: Message About a Trip",
      learningObjective:
        "Write a short message about travel plans using unit vocabulary and future forms.",
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: "writing-travel-learn",
          title: "Learn: Travel Message Phrases",
          instructions:
            "Complete each gap with a word from the box: departure, reservation, platform, delay, fare.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Hi Tom, | I made a [0] for Saturday. | The [1] is 10:15. | The [2] is eight pounds.",
              skillTag: "writing",
              explanation:
                "reservation (đặt chỗ); departure (giờ đi); fare (giá vé).",
              template:
                "Hi Tom,\n\nI made a [0] for Saturday. The [1] is 10:15. The [2] is eight pounds.",
              correctAnswers: ["reservation", "departure", "fare"],
              acceptableAnswers: [
                ["reservation", "Reservation"],
                ["departure", "Departure"],
                ["fare", "Fare"],
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "writing-travel-order-practice",
          title: "Practice: Build Travel Sentences",
          instructions: "Put the words in order to make correct sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            orderingQ(
              "Make a sentence: I / am going to / take / the train / tomorrow.",
              "writing",
              "I am going to take the train tomorrow. — going to + plan.",
              ["I", "am going to", "take", "the train", "tomorrow."]
            ),
            orderingQ(
              "Make a sentence: We / will / meet / at / platform 3.",
              "writing",
              "We will meet at platform 3. — will + decision.",
              ["We", "will", "meet", "at", "platform 3."]
            ),
          ],
        }),
        buildExercise({
          slug: "writing-travel-check",
          title: "Check: Message About Your Trip",
          instructions: "Write a message to a friend. Write at least 25 words.",
          exerciseType: "writing",
          sortOrder: 2,
          content: {
            taskDescription:
              "You are going to visit another city at the weekend. Write a short message to your friend Tom. Tell him about your travel plans.",
            prompts: [
              "Say where you are going (destination).",
              "Say how you will travel and when you are leaving (departure).",
              "Mention one thing you have arranged (reservation, ticket, or meeting).",
              "End the message in a friendly way.",
            ],
            minWords: 25,
            successCriteria: [
              "At least 25 words",
              "Clear destination and travel plan",
              "Uses a future form (will, going to, or present continuous)",
              "Uses at least two unit vocabulary words",
              "Friendly opening and closing",
            ],
            modelAnswer: {
              text: "Hi Tom,\n\nI am going to visit Manchester this Saturday. My train departure is at 9:20 and I made a reservation online. The fare was eighteen pounds. I will meet my cousin at the station. Are you free on Sunday?\n\nSee you,\nMai",
            },
            rubric: {
              grammar: {
                weight: 0.25,
                criteria:
                  "Uses future forms (will, going to, present continuous) correctly.",
              },
              vocabulary: {
                weight: 0.25,
                criteria:
                  "Uses travel words (destination, departure, fare, reservation, platform) appropriately.",
              },
              organization: {
                weight: 0.25,
                criteria: "Message has greeting, clear details and a friendly closing.",
              },
              taskAchievement: {
                weight: 0.25,
                criteria:
                  "Explains travel plans with destination and departure; at least 25 words.",
              },
            },
            autoCheckKeywords: [
              "destination",
              "departure",
              "train",
              "reservation",
              "fare",
              "platform",
              "going",
              "will",
              "tom",
            ],
          },
        }),
        buildExercise({
          slug: "writing-travel-apply",
          title: "Apply: Complete the Message Frames",
          instructions: "Complete the message frames with the correct unit words.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Ana, | There was a [0] on my route. | I [1] take the bus instead. | My new [2] is 6:40. | Bye, | Linh",
              skillTag: "writing",
              explanation: "delay (sự trễ); will (quyết định); departure (giờ đi).",
              template:
                "Dear Ana,\n\nThere was a [0] on my route. I [1] take the bus instead. My new [2] is 6:40.\n\nBye,\nLinh",
              correctAnswers: ["delay", "will", "departure"],
              acceptableAnswers: [
                ["delay", "Delay"],
                ["will", "Will"],
                ["departure", "Departure"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    speaking: {
      slug: "speaking-travel-habits",
      title: "Lesson 6: Talk About Travel",
      learningObjective:
        "Answer interview questions about travel using unit vocabulary and grammar.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "speaking-travel-learn",
          title: "Learn: Choose the Best Reply",
          instructions: "Imagine an examiner asks you a question. Choose the best answer.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Examiner: How do you usually travel to school? You say:",
              skillTag: "speaking",
              explanation: "Trả lời tự nhiên về phương tiện đi học.",
              correct: "I usually take the bus to school.",
              wrong: ["I usually fare the bus.", "I usually platform the bus."],
              distractorNotes: ["Fare is not a verb here", "Platform is not a verb"],
            }),
            buildMcq({
              questionText: "Examiner: Have you ever had a long delay? You say:",
              skillTag: "speaking",
              explanation: "Past simple + delay — mô tả chuyến đi bị trễ.",
              correct: "Yes, we had a two-hour delay last winter.",
              wrong: [
                "Yes, we have a delay every platform.",
                "Yes, I will delayed yesterday.",
              ],
              distractorNotes: ["Nonsense collocation", "Wrong tense/form"],
            }),
            buildMcq({
              questionText: "Examiner: What are you doing this weekend? You say:",
              skillTag: "speaking",
              explanation:
                "Present continuous cho sắp xếp: I am visiting...",
              correct: "I am visiting my aunt in Brighton.",
              wrong: ["I visit my aunt now.", "I am go to Brighton."],
              distractorNotes: ["Present simple", "Missing going"],
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-travel-practice",
          title: "Practice: Best Response",
          instructions: "Choose the best phrase you would say in each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 1,
          questions: [
            buildMcq({
              questionText: "Examiner: Where is your favourite destination? You say:",
              skillTag: "speaking",
              explanation: "Destination + tên địa điểm — cấu trúc phỏng vấn A2.",
              correct: "My favourite destination is the coast near Da Nang.",
              wrong: [
                "My favourite departure is the coast.",
                "My favourite passenger is the coast.",
              ],
              distractorNotes: ["Departure is leaving time", "Passenger is a person"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Examiner: Are you going to travel by train next month? You say:",
              skillTag: "speaking",
              explanation: "Going to + kế hoạch: Yes, I am going to...",
              correct: "Yes, I am going to take the train to Hanoi.",
              wrong: [
                "Yes, I going to take the train.",
                "Yes, I will going to take the train.",
              ],
              distractorNotes: ["Missing am", "Double future form"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Examiner: Tell me about a time you were travelling. You say:",
              skillTag: "speaking",
              explanation:
                "Past continuous: I was travelling when...",
              correct:
                "I was reading on the train when we stopped because of a delay.",
              wrong: [
                "I am reading on the train when we stopped.",
                "I read on the train when we are stopping.",
              ],
              distractorNotes: ["Wrong tense", "Mixed tenses"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-travel-interview",
          title: "Check: Travel Interview",
          instructions:
            "Answer the examiner's questions about how you travel. Speak for up to two minutes.",
          exerciseType: "speaking",
          sortOrder: 2,
          content: {
            prompt:
              "The examiner will ask you about how you travel, your plans and experiences with delays or reservations.",
            sceneDescription:
              "A busy train station with a departure board, passengers with luggage on platform 3, and a ticket machine.",
            followUpQuestions: [
              "How do you usually travel to school or work?",
              "What is your favourite destination and why?",
              "Have you ever had a long delay? What happened?",
              "Are you going to travel anywhere next month?",
              "Do you prefer to buy tickets online or at the station?",
              "What were you doing the last time you were on a train or bus?",
            ],
            suggestedAnswers: [
              "I usually take the bus because the fare is cheap.",
              "My favourite destination is the beach because it is relaxing.",
              "Yes, we had a one-hour delay last year because of rain.",
              "Yes, I am going to visit my grandparents by train.",
              "I prefer to buy tickets online because I can see the timetable.",
              "I was listening to music when the train stopped at a small station.",
            ],
            assessmentCriteria: {
              pronunciation:
                "Key words (platform, destination, departure, fare, delay) are understandable.",
              fluency: "Responds with phrases or short sentences without long silences.",
              grammar:
                "Uses past simple/continuous or future forms in at least two answers.",
              vocabulary: "Uses at least four different unit words correctly.",
            },
            maxDurationSeconds: 120,
          },
        }),
        buildExercise({
          slug: "speaking-travel-apply",
          title: "Apply: Situational Response",
          instructions: "Choose the best thing to say in each travel situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText:
                "Your friend's train is late. You want to help. You say:",
              skillTag: "speaking",
              explanation: "Đề nghị giúp đỡ lịch sự khi có delay.",
              correct: "Don't worry. I will wait with you at the platform.",
              wrong: [
                "Don't worry. I am fare with you.",
                "Don't worry. I departure with you.",
              ],
              distractorNotes: ["Wrong word as verb", "Wrong word as verb"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "The clerk asks about your destination. You say:",
              skillTag: "speaking",
              explanation: "Nêu rõ destination khi đặt vé.",
              correct: "My destination is Manchester Piccadilly, please.",
              wrong: [
                "My reservation is Manchester Piccadilly, please.",
                "My delay is Manchester Piccadilly, please.",
              ],
              distractorNotes: ["Reservation is booking not place", "Delay is lateness"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText:
                "You are telling a friend about tomorrow's plan. You say:",
              skillTag: "speaking",
              explanation:
                "Present continuous cho sắp xếp: I am meeting... at the station.",
              correct: "I am meeting my cousin at the station at 5 p.m.",
              wrong: [
                "I meet my cousin at the station every 5 p.m.",
                "I am meet my cousin at the station.",
              ],
              distractorNotes: ["Sounds like daily habit", "Wrong verb form"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  },
};
