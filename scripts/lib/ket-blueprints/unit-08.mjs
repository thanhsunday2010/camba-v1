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

const TOPIC = "services";

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

const servicesPassage = buildPassage({
  title: "Which Service Do You Need?",
  text: `CITY HELP DESK — FOUR SHORT MESSAGES

Message A — Bank
Need a new bank account? Visit the counter on Floor 2 with your ID and proof of address. You must complete a registration form before the bank can open your account. Appointments are available on weekdays.

Message B — Post Office
Standard postage for a small letter is £1.20. Keep your receipt if you send something valuable. You can buy stamps at the counter or use the self-service machine near reception.

Message C — Medical Centre
For a routine appointment, call reception before 4 p.m. If you have a complaint about waiting times, speak to the manager at the enquiry desk. You must bring your registration card to every visit.

Message D — Council Office
Lost your parking permit? Make an enquiry online or at the help desk. You have to pay a small fee and show your receipt from the last payment. Registration for new residents opens every Monday morning.`,
const listeningScript1 = buildListeningScript({
  title: "Making a Doctor's Appointment",
  setting: "Medical centre reception desk",
  speakers: [{ name: "Receptionist", role: "reception staff" }],
  lines: [
    {
      speaker: "Receptionist",
      text: "Good morning. City Medical Centre, reception. How can I help you?",
    },
    {
      speaker: "Receptionist",
      text: "Yes, we can book an appointment for Thursday at ten thirty. Could you spell your surname, please?",
    },
    {
      speaker: "Receptionist",
      text: "Thank you. You must bring your registration card and any recent receipts for medicine.",
    },
    {
      speaker: "Receptionist",
      text: "If you need to change the time, call reception before three o'clock. Have a good day.",
    },
  ],
  audioNotes:
    "Friendly professional tone, moderate pace, clear phone/reception ambience. Approx. 40 seconds.",
});

const listeningScript2 = buildListeningScript({
  title: "Bank Enquiry Call",
  setting: "Phone call to a high street bank",
  speakers: [{ name: "Bank clerk", role: "customer service" }],
  lines: [
    {
      speaker: "Bank clerk",
      text: "Hello, Riverside Bank. This is customer services. How may I help you today?",
    },
    {
      speaker: "Bank clerk",
      text: "To open a bank account, you have to visit a branch with your ID. You could also start registration online first.",
    },
    {
      speaker: "Bank clerk",
      text: "If you have a complaint about a charge, please keep your receipt and we will check it.",
    },
    {
      speaker: "Bank clerk",
      text: "You can speak to someone at the enquiry desk on Monday from nine to five. Thank you for calling.",
    },
  ],
  audioNotes:
    "Formal telephone voice, steady pace, light office background. Approx. 45 seconds.",
});

export default {
  vocabularyBank: [
    buildVocabWord({
      word: "bank account",
      ipa: "/bæŋk əˈkaʊnt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tài khoản ngân hàng",
      exampleSentence: "I opened a bank account at the city branch.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "postage",
      ipa: "/ˈpəʊstɪdʒ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "cước phí bưu chính",
      exampleSentence: "The postage for this letter is one pound twenty.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "reception",
      ipa: "/rɪˈsepʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "quầy lễ tân / tiếp tân",
      exampleSentence: "Please wait at reception until your name is called.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "enquiry",
      ipa: "/ɪnˈkwaɪəri/",
      partOfSpeech: "noun",
      vietnameseMeaning: "câu hỏi / yêu cầu thông tin",
      exampleSentence: "I made an enquiry about my bank charges.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "appointment",
      ipa: "/əˈpɔɪntmənt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "cuộc hẹn",
      exampleSentence: "My appointment with the doctor is at ten thirty.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "complaint",
      ipa: "/kəmˈpleɪnt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "khiếu nại",
      exampleSentence: "She wrote a complaint about the long queue.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "receipt",
      ipa: "/rɪˈsiːt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "biên lai / hóa đơn",
      exampleSentence: "Keep the receipt if you want a refund.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "registration",
      ipa: "/ˌredʒɪˈstreɪʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đăng ký",
      exampleSentence: "Registration for new students opens on Monday.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "counter",
      ipa: "/ˈkaʊntə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "quầy giao dịch",
      exampleSentence: "Pay for the postage at the counter.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "refund",
      ipa: "/ˈriːfʌnd/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hoàn tiền",
      exampleSentence: "Show your receipt to get a refund.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "form",
      ipa: "/fɔːm/",
      partOfSpeech: "noun",
      vietnameseMeaning: "mẫu đơn / phiếu",
      exampleSentence: "Complete the registration form at reception.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "queue",
      ipa: "/kjuː/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hàng đợi",
      exampleSentence: "There was a long queue at the post office.",
      topic: TOPIC,
    }),
  ],

  grammarReference: [
    buildGrammarRef({
      structure: "Modals: can, could, must, have to",
      explanation:
        "Use can/could for ability and polite requests. Use must/have to for rules and obligations. Have to often describes external rules; must can sound stronger or more personal.",
      examples: [
        "Could I make an appointment, please?",
        "You must bring your registration card.",
        "You have to complete the form at the counter.",
        "Can you help me at reception?",
      ],
      commonMistakes: [
        "You must to bring your ID (×) → You must bring your ID (✓)",
        "I have bring the receipt (×) → I have to bring the receipt (✓)",
        "Could I to ask a question? (×) → Could I ask a question? (✓)",
      ],
      topic: TOPIC,
    }),
    buildGrammarRef({
      structure: "Formal / informal register",
      explanation:
        "Formal language uses polite phrases (Could you..., I would like..., Dear Sir/Madam). Informal language uses short forms and friendly phrases (Can you..., Hi, Thanks). Choose register to match the situation.",
      examples: [
        "Formal: I would like to make an enquiry about my bank account.",
        "Informal: Can you check my account, please?",
        "Formal: I am writing to complain about the service.",
        "Informal: I'm not happy with the queue today.",
      ],
      commonMistakes: [
        "Hey Sir, give me a refund (×) → Dear Sir, I would like a refund (✓)",
        "I am writing to complain lol (×) → I am writing to complain about the delay (✓)",
        "Could you kindly stuff (×) → Could you kindly help me? (✓)",
      ],
      topic: TOPIC,
    }),
  ],

  unit: {
    learningObjectives: [
      "Use core services vocabulary at A2 level.",
      "Use can, could, must and have to in everyday service situations.",
      "Choose formal or informal language appropriately.",
      "Match people to short service texts.",
      "Complete notes from short service announcements.",
      "Write a formal message about a service problem.",
      "Answer interview questions about using local services.",
    ],
  },

  lessons: {
    vocabulary: {
      slug: "vocab-services-words",
      title: "Lesson 1: Services Words",
      learningObjective:
        "Recognise and understand twelve words for banks, post offices and other everyday services at KET A2 level.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "vocab-services-learn",
          title: "Learn: Services Word Match",
          instructions: "Read each sentence. Choose the best word.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Money you keep in a bank is in your _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation:
                "Bank account (tài khoản ngân hàng) là nơi lưu tiền. Receipt là biên lai.",
              correct: "bank account",
              wrong: ["receipt", "postage"],
              distractorNotes: ["Proof of payment", "Cost of sending mail"],
            }),
            buildMcq({
              questionText: "The price you pay to send a letter is called _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation:
                "Postage (cước phí bưu chính) là phí gửi thư. Queue là hàng đợi.",
              correct: "postage",
              wrong: ["queue", "registration"],
              distractorNotes: ["Line of people waiting", "Signing up for a service"],
            }),
            buildMcq({
              questionText: "When you book a time to see a doctor, you have an _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation:
                "Appointment (cuộc hẹn) là thời gian đã đặt trước. Complaint là khiếu nại.",
              correct: "appointment",
              wrong: ["complaint", "refund"],
              distractorNotes: ["A problem you report", "Money returned to you"],
            }),
            buildMcq({
              questionText: "A paper that shows you paid is a _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation:
                "Receipt (biên lai) chứng minh bạn đã thanh toán. Form là mẫu đơn.",
              correct: "receipt",
              wrong: ["form", "headline"],
              distractorNotes: ["Paper you fill in", "Not a services word here"],
            }),
            buildMcq({
              questionText: "Signing up for a service or course is called _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation:
                "Registration (đăng ký) là ghi danh. Enquiry là hỏi thông tin.",
              correct: "registration",
              wrong: ["enquiry", "postage"],
              distractorNotes: ["Asking for information", "Mail cost"],
            }),
            buildMcq({
              questionText: "People waiting in a line form a _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation:
                "Queue (hàng đợi) là dãy người chờ. Counter là quầy giao dịch.",
              correct: "queue",
              wrong: ["counter", "reception"],
              distractorNotes: ["Desk where you pay", "Front desk area"],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-services-matching",
          title: "Practice: Match the Pairs",
          instructions: "Match each word on the left with the correct meaning on the right.",
          exerciseType: "matching",
          sortOrder: 1,
          questions: [
            buildMatching({
              questionText: "Match the services words to their meanings.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation:
                "Mỗi từ khớp với một nghĩa rõ ràng. Reception và counter thường bị nhầm.",
              pairs: [
                { left: "reception", right: "the desk where visitors first ask for help" },
                { left: "enquiry", right: "a question or request for information" },
                { left: "complaint", right: "when you say you are unhappy with a service" },
                { left: "refund", right: "money returned when something is wrong" },
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-services-check",
          title: "Check: Vocab Quiz",
          instructions: "No hints — choose the best answer for each question.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          qualityScores: { quality: 0.91, difficulty: 0.32, curriculumAlignment: 0.96, needsReview: false },
          questions: [
            buildMcq({
              questionText: "You pay for stamps and letters at the post office _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Counter (quầy giao dịch) là nơi trả tiền. Appointment là cuộc hẹn.",
              correct: "counter",
              wrong: ["appointment", "registration"],
              distractorNotes: ["A booked time", "Signing up"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "If the service was bad, you might make a _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Complaint (khiếu nại) khi dịch vụ không tốt. Postage là phí gửi thư.",
              correct: "complaint",
              wrong: ["postage", "bank account"],
              distractorNotes: ["Mail cost", "Where money is kept"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Before you open a bank account, you often fill in a _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Form (mẫu đơn) cần điền khi mở tài khoản. Queue là hàng đợi.",
              correct: "form",
              wrong: ["queue", "receipt"],
              distractorNotes: ["People waiting in line", "Proof you already paid"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Wait at _____ until the clerk calls your name.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Reception (lễ tân) là nơi chờ và hỏi thông tin. Refund là hoàn tiền.",
              correct: "reception",
              wrong: ["refund", "postage"],
              distractorNotes: ["Money back", "Letter cost"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-services-apply",
          title: "Apply: Complete the Sentences",
          instructions: "Fill in each gap with the correct word from the unit.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: "Complete: I kept the [0] after paying the [1] at the post office.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "receipt (biên lai) sau khi trả postage (cước phí).",
              template: "I kept the [0] after paying the [1] at the post office.",
              correctAnswers: ["receipt", "postage"],
              acceptableAnswers: [
                ["receipt", "Receipt"],
                ["postage", "Postage"],
              ],
            }),
            buildGapFill({
              questionText: "Complete: She made an [0] about the long [1] at reception.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "enquiry (hỏi thông tin) hoặc complaint — ở đây complaint về queue.",
              template: "She made a [0] about the long [1] at reception.",
              correctAnswers: ["complaint", "queue"],
              acceptableAnswers: [
                ["complaint", "Complaint"],
                ["queue", "Queue"],
              ],
            }),
          ],
        }),
      ],
    },

    grammar: {
      slug: "grammar-modals-register",
      title: "Lesson 2: Modals and Register",
      learningObjective:
        "Use can, could, must and have to correctly, and choose formal or informal language in service contexts.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "grammar-modals-learn",
          title: "Learn: Choose the Modal",
          instructions: "Choose the best word to complete each sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "_____ I make an appointment, please?",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Could + I — yêu cầu lịch sự ở quầy dịch vụ.",
              correct: "Could",
              wrong: ["Must", "Have"],
              distractorNotes: ["Too strong for a polite request", "Incomplete form"],
            }),
            buildMcq({
              questionText: "You _____ bring your registration card to every visit.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Must/have to — quy định bắt buộc. Must phù hợp với quy tắc y tế.",
              correct: "must",
              wrong: ["could", "can"],
              distractorNotes: ["Polite possibility", "Ability, not obligation"],
            }),
            buildMcq({
              questionText: "To open a bank account, you _____ visit the branch with your ID.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Have to — quy định bên ngoài (ngân hàng yêu cầu).",
              correct: "have to",
              wrong: ["could", "can"],
              distractorNotes: ["Optional suggestion", "Ability only"],
            }),
            buildMcq({
              questionText: "Which sentence is most formal?",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "I would like to make an enquiry — cấu trúc trang trọng cho email/thư.",
              correct: "I would like to make an enquiry about my receipt.",
              wrong: [
                "Hey! My receipt is wrong!",
                "Gimme a refund now.",
              ],
              distractorNotes: ["Too casual for a complaint", "Very informal and rude"],
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-modals-practice",
          title: "Practice: Complete the Grammar",
          instructions: "Fill in each gap with the correct form.",
          exerciseType: "gap_fill",
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText: "Complete: You [0] to show your receipt for a refund. | [1] I speak to someone at reception?",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "have to (bắt buộc); Could (yêu cầu lịch sự).",
              template: "You [0] to show your receipt for a refund. [1] I speak to someone at reception?",
              correctAnswers: ["have", "Could"],
              acceptableAnswers: [
                ["have", "Have"],
                ["Could", "could"],
              ],
            }),
            buildGapFill({
              questionText: "Complete: Visitors [0] wait in the queue. | You [1] complete the registration form online.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "must (quy tắc); can (khả năng/permission).",
              template: "Visitors [0] wait in the queue. You [1] complete the registration form online.",
              correctAnswers: ["must", "can"],
              acceptableAnswers: [
                ["must", "Must"],
                ["can", "Can"],
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-modals-check",
          title: "Check: Grammar Challenge",
          instructions: "Choose the correct answer. Think carefully.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          qualityScores: { quality: 0.92, difficulty: 0.38, curriculumAlignment: 0.97, needsReview: false },
          questions: [
            buildMcq({
              questionText: "Dear Sir, I am writing to _____ about the long queue yesterday.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "complain — động từ trang trọng trong thư khiếu nại.",
              correct: "complain",
              wrong: ["complaint", "complaining"],
              distractorNotes: ["Noun, not verb after to", "Gerund less natural after to here"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "You _____ smoke in the medical centre reception area.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "must not / can't — cấm. Must alone means obligation.",
              correct: "must not",
              wrong: ["must", "have"],
              distractorNotes: ["Opposite meaning", "Incomplete"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "_____ you help me with this registration form?",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Could — lịch sự hơn Can trong tình huống trang trọng.",
              correct: "Could",
              wrong: ["Must", "Have to"],
              distractorNotes: ["Obligation, not request", "Wrong structure for request"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Which reply is appropriate at a bank counter?",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "I would like to open a bank account, please — formal và lịch sự.",
              correct: "I would like to open a bank account, please.",
              wrong: [
                "Open me account now.",
                "Yo, bank stuff.",
              ],
              distractorNotes: ["Grammatically wrong and rude", "Very informal"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-modals-apply",
          title: "Apply: Build the Sentence",
          instructions: "Put the words in the correct order to make a sentence.",
          exerciseType: "sentence_ordering",
          sortOrder: 3,
          questions: [
            buildOrderQ(
              "Make a sentence: You / have to / bring / your receipt / for a refund.",
              "grammar",
              "You have to bring your receipt for a refund. — have to + động từ nguyên mẫu.",
              ["You", "have to", "bring", "your receipt", "for a refund."]
            ),
            buildOrderQ(
              "Make a sentence: Could / I / make / an appointment / at reception?",
              "grammar",
              "Could I make an appointment at reception? — Could + chủ ngữ + động từ nguyên mẫu.",
              ["Could", "I", "make", "an appointment", "at reception?"],
              2
            ),
            buildOrderQ(
              "Make a sentence: I / would like / to make / an enquiry / about my bank account.",
              "grammar",
              "I would like to make an enquiry about my bank account. — register trang trọng.",
              ["I", "would like", "to make", "an enquiry", "about my bank account."],
              3
            ),
          ],
        }),
      ],
    },

    reading: {
      slug: "reading-service-messages",
      title: "Lesson 3: Service Messages",
      learningObjective:
        "Match people to short service texts and find details about rules, appointments and registration.",
      estimatedMinutes: 23,
      exercises: [
        buildReadingExercise({
          slug: "reading-services-learn",
          title: "Learn: Read the Messages",
          instructions: "Read the four messages. Answer the detail questions.",
          sortOrder: 0,
          passage: servicesPassage,
          questions: [
            buildMcq({
              questionText: "Where must you go to open a bank account?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Message A: Visit the counter on Floor 2 with your ID.",
              correct: "The counter on Floor 2",
              wrong: ["The enquiry desk only", "The post office counter"],
              distractorNotes: ["Enquiry desk is for council", "Post office is Message B"],
              assessmentType: "detail",
            }),
            buildMcq({
              questionText: "What must you bring to every medical visit?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Message C: You must bring your registration card to every visit.",
              correct: "Your registration card",
              wrong: ["A bank receipt", "Proof of postage"],
              distractorNotes: ["Mentioned for bank/refund", "Post office topic"],
              assessmentType: "detail",
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-services-practice",
          title: "Practice: Words in the Messages",
          instructions: "Read the messages again. Answer about vocabulary and meaning.",
          sortOrder: 1,
          passage: servicesPassage,
          difficulty: 0.3,
          questions: [
            buildMcq({
              questionText: "In Message B, why should you keep your receipt?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Keep your receipt if you send something valuable — bảo hiểm/chứng minh gửi.",
              correct: "If you send something valuable",
              wrong: ["To get a doctor's appointment", "To register as a new resident"],
              distractorNotes: ["Medical centre topic", "Council registration topic"],
              assessmentType: "vocabulary_in_context",
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Why might someone go to the enquiry desk in Message D?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Lost parking permit — make an enquiry online or at the help desk.",
              correct: "They lost their parking permit",
              wrong: ["They need postage for a letter", "They want a new bank account"],
              distractorNotes: ["Post office", "Bank Message A"],
              assessmentType: "inference",
              difficultyRating: 2,
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-services-check",
          title: "Check: Main Idea and Order",
          instructions: "Read the messages one more time. These questions need careful thinking.",
          sortOrder: 2,
          passage: servicesPassage,
          difficulty: 0.35,
          questions: [
            buildMcq({
              questionText: "What is the main purpose of all four messages?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Mỗi tin nhắn hướng dẫn người dùng dịch vụ công cộng phải làm gì.",
              correct: "To tell people what to do at different services",
              wrong: ["To advertise a concert", "To sell bank accounts online"],
              distractorNotes: ["Not entertainment", "Not sales advertising"],
              assessmentType: "main_idea",
            }),
            buildMcq({
              questionText: "Put the steps for opening a bank account in order: (1) Complete form (2) Visit counter (3) Bring ID",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Message A: visit with ID → complete registration form → account opened.",
              correct: "2 → 1 → (account opened)",
              wrong: ["1 → 2 → 3", "3 → 1 → 2"],
              distractorNotes: ["Form before visit in text", "ID is needed when you visit"],
              assessmentType: "sequencing",
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "reading-services-apply",
          title: "Apply: Match People to Messages",
          instructions: "Use what you read. Match each person to the correct message (A–D).",
          exerciseType: "matching",
          sortOrder: 3,
          content: { passage: servicesPassage },
          questions: [
            buildMatching({
              questionText: "Match each person to the message they should read.",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Mỗi người khớp với dịch vụ phù hợp trong bốn tin nhắn.",
              pairs: [
                { left: "Mai needs stamps", right: "Message B — Post Office" },
                { left: "Tom lost his parking permit", right: "Message D — Council Office" },
                { left: "Lin wants a bank account", right: "Message A — Bank" },
                { left: "Hoa has a complaint about waiting", right: "Message C — Medical Centre" },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    listening: {
      slug: "listening-service-calls",
      title: "Lesson 4: Service Calls",
      learningObjective:
        "Listen to service calls and notes to identify appointments, rules and enquiry details.",
      estimatedMinutes: 22,
      exercises: [
        buildListeningExercise({
          slug: "listening-appointment-learn",
          title: "Learn: Making an Appointment",
          instructions: "Listen to the call. Answer the first two questions.",
          sortOrder: 0,
          script: listeningScript1,
          answerKey: { q1: "Thursday ten thirty", q2: "registration card" },
          questions: [
            buildMcq({
              questionText: "When is the appointment?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "We can book an appointment for Thursday at ten thirty.",
              correct: "Thursday at ten thirty",
              wrong: ["Monday at nine", "Friday at four"],
              distractorNotes: ["Council registration day", "Call-before time, not appointment"],
            }),
            buildMcq({
              questionText: "What must the caller bring?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "You must bring your registration card and any recent receipts.",
              correct: "Registration card and medicine receipts",
              wrong: ["Bank account form only", "Postage receipt"],
              distractorNotes: ["Bank topic", "Post office topic"],
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-appointment-practice",
          title: "Practice: More from the Appointment Call",
          instructions: "Listen again to the same call. Answer the next questions.",
          sortOrder: 1,
          script: listeningScript1,
          answerKey: { q1: "before three o'clock", q2: "spell surname" },
          difficulty: 0.28,
          questions: [
            buildMcq({
              questionText: "When must you call if you need to change the time?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Call reception before three o'clock.",
              correct: "Before three o'clock",
              wrong: ["Before ten thirty", "After four p.m."],
              distractorNotes: ["Appointment time", "Medical centre closing for calls"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "What does the receptionist ask the caller to do?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Could you spell your surname, please?",
              correct: "Spell their surname",
              wrong: ["Pay postage", "Complete a bank form"],
              distractorNotes: ["Post office", "Bank"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-bank-check",
          title: "Check: Bank Enquiry Call",
          instructions: "Listen to a new call. Choose the correct answer.",
          sortOrder: 2,
          script: listeningScript2,
          answerKey: { q1: "visit branch with ID", q2: "keep receipt" },
          difficulty: 0.32,
          questions: [
            buildMcq({
              questionText: "What do you have to do to open a bank account?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "You have to visit a branch with your ID.",
              correct: "Visit a branch with your ID",
              wrong: ["Only register online", "Send a letter with postage"],
              distractorNotes: ["Online is optional first step", "Post office action"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "What should you keep if you have a complaint about a charge?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Please keep your receipt and we will check it.",
              correct: "Your receipt",
              wrong: ["Your registration card", "The enquiry form only"],
              distractorNotes: ["Medical card", "Not enough alone"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "listening-services-apply",
          title: "Apply: Match Facts from the Calls",
          instructions: "Listen to the appointment call again. Match each topic to the correct fact.",
          exerciseType: "matching",
          sortOrder: 3,
          content: {
            script: listeningScript1,
            answerKey: { matching: true },
          },
          questions: [
            buildMatching({
              questionText: "Match each topic to a fact from the appointment call.",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Mỗi mục khớp với thông tin trong cuộc gọi đặt lịch.",
              pairs: [
                { left: "Appointment day", right: "Thursday" },
                { left: "Must bring", right: "Registration card" },
                { left: "Change time", right: "Call before 3 p.m." },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    writing: {
      slug: "writing-service-complaint",
      title: "Lesson 5: Write About a Service Problem",
      learningObjective:
        "Write a short formal message about a service problem using modals and services vocabulary.",
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: "writing-services-learn",
          title: "Learn: Formal Message Phrases",
          instructions: "Complete each gap with a word from the box: Dear, complaint, receipt, must, thank.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText: "Complete: [0] Sir, | I am writing to make a [1] about my visit. | I [2] attach my [3].",
              skillTag: "writing",
              topicTag: TOPIC,
              explanation: "Dear; complaint; must (hoặc will); receipt — khung thư trang trọng.",
              template: "[0] Sir,\n\nI am writing to make a [1] about my visit. I [2] attach my [3].",
              correctAnswers: ["Dear", "complaint", "must", "receipt"],
              acceptableAnswers: [
                ["Dear", "dear"],
                ["complaint", "Complaint"],
                ["must", "Must", "will", "Will"],
                ["receipt", "Receipt"],
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "writing-services-order-practice",
          title: "Practice: Build Formal Sentences",
          instructions: "Put the words in order to make correct sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildOrderQ(
              "Make a sentence: I / would like / to make / an enquiry / about my appointment.",
              "writing",
              "I would like to make an enquiry about my appointment.",
              ["I", "would like", "to make", "an enquiry", "about my appointment."]
            ),
            buildOrderQ(
              "Make a sentence: You / have to / wait / in the queue / at reception.",
              "writing",
              "You have to wait in the queue at reception.",
              ["You", "have to", "wait", "in the queue", "at reception."],
              2
            ),
          ],
        }),
        buildExercise({
          slug: "writing-services-check",
          title: "Check: Message About a Service Problem",
          instructions: "Write a message to a service manager. Write at least 25 words.",
          exerciseType: "writing",
          sortOrder: 2,
          content: {
            taskDescription:
              "You visited the post office yesterday. You paid the wrong postage and waited in a long queue. Write a formal message to the manager.",
            prompts: [
              "Say why you are writing.",
              "Explain the problem with the postage or queue.",
              "Say what you would like (for example a refund or help).",
              "End the message politely.",
            ],
            minWords: 25,
            successCriteria: [
              "At least 25 words",
              "Clear reason for writing",
              "Polite formal tone",
              "Appropriate opening and closing",
              "Uses at least two unit vocabulary words",
            ],
            modelAnswer: {
              text: "Dear Manager,\n\nI am writing to make a complaint about my visit yesterday. I paid the wrong postage at the counter and I had to wait in a long queue. I have my receipt and I would like a refund, please. Could you help me with this enquiry?\n\nThank you,\nMinh",
            },
            rubric: {
              grammar: {
                weight: 0.25,
                criteria: "Uses can/could/must/have to or formal phrases correctly.",
              },
              vocabulary: {
                weight: 0.25,
                criteria: "Uses services words (complaint, receipt, queue, postage) appropriately.",
              },
              organization: {
                weight: 0.25,
                criteria: "Message has greeting, body and polite closing.",
              },
              taskAchievement: {
                weight: 0.25,
                criteria: "Explains the problem and says what you want; at least 25 words.",
              },
            },
            autoCheckKeywords: [
              "dear",
              "complaint",
              "receipt",
              "postage",
              "queue",
              "refund",
              "thank",
              "enquiry",
            ],
          },
        }),
        buildExercise({
          slug: "writing-services-apply",
          title: "Apply: Complete the Message Frames",
          instructions: "Complete the message frames with the correct unit words.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: "Complete: Dear Reception, | I [0] to change my [1]. | I can come on Thursday. | [2] you, | Lan",
              skillTag: "writing",
              topicTag: TOPIC,
              explanation: "need (need to); appointment; Thank — email lịch sự.",
              template: "Dear Reception,\n\nI [0] to change my [1]. I can come on Thursday.\n\n[2] you,\nLan",
              correctAnswers: ["need", "appointment", "Thank"],
              acceptableAnswers: [
                ["need", "Need"],
                ["appointment", "Appointment"],
                ["Thank", "Thanks", "thank", "thanks"],
              ],
            }),
          ],
        }),
      ],
    },

    speaking: {
      slug: "speaking-using-services",
      title: "Lesson 6: Talk About Using Services",
      learningObjective:
        "Answer interview questions about using banks, post offices and other services.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "speaking-services-learn",
          title: "Learn: Choose the Best Reply",
          instructions: "Imagine an examiner asks you a question. Choose the best answer.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Examiner: Where do you pay for postage? You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "At the counter — trả lời ngắn, đúng từ vựng A2.",
              correct: "At the counter in the post office.",
              wrong: ["At my bank account.", "In the registration."],
              distractorNotes: ["Not where you pay postage", "Wrong collocation"],
            }),
            buildMcq({
              questionText: "Examiner: What do you need for a doctor's appointment? You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Registration card — thẻ đăng ký thường cần khi khám.",
              correct: "I must bring my registration card.",
              wrong: ["I must bring my postage.", "I need a blogger profile."],
              distractorNotes: ["Mail cost", "Wrong topic word"],
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-services-practice",
          title: "Practice: Best Response",
          instructions: "Choose the most appropriate reply in each service situation.",
          exerciseType: "multiple_choice",
          sortOrder: 1,
          questions: [
            buildMcq({
              questionText: "The queue is very long. You want to complain politely. You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Excuse me, I would like to make a complaint — lịch sự, formal.",
              correct: "Excuse me, I would like to make a complaint about the queue.",
              wrong: ["This queue is stupid!", "Give me refund now!"],
              distractorNotes: ["Too rude", "Too direct and informal"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "You need information at reception. You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Could I make an enquiry...? — modal lịch sự.",
              correct: "Could I make an enquiry about my appointment, please?",
              wrong: ["I must enquiry now.", "Appointment is me."],
              distractorNotes: ["Wrong grammar", "Unclear broken English"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-services-check",
          title: "Check: Interview About Services",
          instructions: "Answer the examiner's questions. Record your answers.",
          exerciseType: "speaking",
          sortOrder: 2,
          content: {
            prompt:
              "The examiner will ask you about services in your town — post office, bank, medical centre or council office.",
            sceneDescription:
              "A simple scene of a reception desk with a queue, a counter sign and a registration form on the desk.",
            followUpQuestions: [
              "Which services do you use in your town?",
              "When did you last go to the post office? Why?",
              "Do you have a bank account? Why or why not?",
              "Have you ever made a complaint about a service?",
              "What must you bring when you visit the doctor?",
              "Is it better to phone reception or visit in person? Why?",
            ],
            suggestedAnswers: [
              "I use the post office and sometimes the medical centre.",
              "I went last week to buy postage for a letter to my cousin.",
              "Yes, I have a bank account because I need to save money safely.",
              "Yes, once I complained about a long queue at reception.",
              "I must bring my registration card and sometimes a receipt.",
              "I think phoning is faster, but visiting is better for difficult enquiries.",
            ],
            assessmentCriteria: {
              vocabulary: "Uses services vocabulary naturally (appointment, receipt, queue, etc.).",
              grammar: "Uses can/could/must/have to and short answers correctly.",
              fluency: "Speaks in short clear sentences without long pauses.",
              taskAchievement: "Answers all six questions with relevant details.",
            },
            maxDurationSeconds: 120,
          },
        }),
        buildExercise({
          slug: "speaking-services-apply",
          title: "Apply: Situational Response",
          instructions: "Choose the best thing to say in each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "You lost your receipt but want a refund. You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Could you help me without a receipt? — lịch sự, thực tế.",
              correct: "Could you help me? I am afraid I lost my receipt.",
              wrong: ["Receipt is not important ever.", "You must give refund no receipt."],
              distractorNotes: ["Not always true", "Too demanding, poor grammar"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "You want to register for a new library card at reception. You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "I would like to register, please — formal and clear.",
              correct: "I would like to register for a library card, please.",
              wrong: ["I registering now.", "Postage for library."],
              distractorNotes: ["Missing verb", "Wrong vocabulary"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  },
};
