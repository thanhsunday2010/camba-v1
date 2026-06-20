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

const TOPIC = "communication-and-media";

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

const mediaPassage = buildPassage({
  title: "Teen Media Habits Survey",
  text: `WEST PARK SCHOOL — MEDIA SURVEY RESULTS

Last month, 120 students answered questions about communication and media. Here are three opinions from the report.

Student A — Linh, age 13
Linh checks her phone for notifications every hour. She follows one food blogger and two video channels about science. She said, "If I see an interesting headline, I read the full message straight away."

Student B — Tom, age 14
Tom prefers short messages to long emails. He subscribed to a gaming channel last year and sometimes watches live content after homework. He explained, "If the advertisement is boring, I skip it."

Student C — Priya, age 13
Priya is careful about her online profile. She uploads photos only on weekends and never shares personal details in a message to strangers. She told us, "If someone sends a strange notification, I tell my parents."

The school will use these answers to plan safer media lessons next term.`,
  imagePrompt:
    "School survey infographic with three student profiles, phone icons, video play buttons and notification badges; friendly teen magazine style.",
});

const listeningScript1 = buildListeningScript({
  title: "School Radio Interview with a Blogger",
  setting: "School radio studio",
  speakers: [{ name: "Host", role: "student presenter" }],
  lines: [
    {
      speaker: "Host",
      text: "Today on West Park Radio, we talk to teen blogger Mia Chen. Mia, thanks for coming.",
    },
    {
      speaker: "Host",
      text: "Mia said she writes a short message to her readers every morning. Her channel has five thousand subscribers now.",
    },
    {
      speaker: "Host",
      text: "She told us, if a headline is negative, she tries to write something positive instead.",
    },
    {
      speaker: "Host",
      text: "Mia also said students should check notifications carefully and keep their profile private. Back to music after this advertisement.",
    },
  ],
  audioNotes:
    "Upbeat student radio tone, one speaker, clear diction. Approx. 45 seconds.",
});

const listeningScript2 = buildListeningScript({
  title: "Online Safety Announcement",
  setting: "School assembly PA system",
  speakers: [{ name: "Ms Ortiz", role: "ICT teacher" }],
  lines: [
    {
      speaker: "Ms Ortiz",
      text: "Good afternoon. This is a reminder about online communication and media safety.",
    },
    {
      speaker: "Ms Ortiz",
      text: "If you get a message from someone you do not know, do not reply. Tell a teacher or your parents.",
    },
    {
      speaker: "Ms Ortiz",
      text: "Remember: if you subscribe to a channel, check the profile carefully before you upload photos.",
    },
    {
      speaker: "Ms Ortiz",
      text: "If an advertisement asks for personal details, ignore it. Thank you.",
    },
  ],
  audioNotes:
    "Clear PA voice, serious but friendly, moderate pace. Approx. 40 seconds.",
});

export default {
  vocabularyBank: [
    buildVocabWord({
      word: "message",
      ipa: "/ˈmesɪdʒ/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tin nhắn",
      exampleSentence: "I sent a message to my friend after school.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "blogger",
      ipa: "/ˈblɒɡə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "người viết blog",
      exampleSentence: "The food blogger posted a new recipe today.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "channel",
      ipa: "/ˈtʃænl/",
      partOfSpeech: "noun",
      vietnameseMeaning: "kênh (video/online)",
      exampleSentence: "She subscribed to a science channel on the internet.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "advertisement",
      ipa: "/ədˈvɜːtɪsmənt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "quảng cáo",
      exampleSentence: "An advertisement appeared before the video started.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "headline",
      ipa: "/ˈhedlaɪn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "tiêu đề tin",
      exampleSentence: "The headline said 'School Team Wins Prize'.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "subscribe",
      ipa: "/səbˈskraɪb/",
      partOfSpeech: "verb",
      vietnameseMeaning: "đăng ký theo dõi",
      exampleSentence: "Tom subscribed to three gaming channels.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "notification",
      ipa: "/ˌnəʊtɪfɪˈkeɪʃn/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thông báo (máy/ứng dụng)",
      exampleSentence: "I got a notification about a new message.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "profile",
      ipa: "/ˈprəʊfaɪl/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hồ sơ cá nhân (online)",
      exampleSentence: "Keep your profile private on social media.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "podcast",
      ipa: "/ˈpɒdkɑːst/",
      partOfSpeech: "noun",
      vietnameseMeaning: "podcast / chương trình audio",
      exampleSentence: "We listen to a podcast about space in class.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "content",
      ipa: "/ˈkɒntent/",
      partOfSpeech: "noun",
      vietnameseMeaning: "nội dung",
      exampleSentence: "The channel uploads new content every Friday.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "upload",
      ipa: "/ˌʌpˈləʊd/",
      partOfSpeech: "verb",
      vietnameseMeaning: "tải lên",
      exampleSentence: "Do not upload photos without permission.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "viewer",
      ipa: "/ˈvjuːə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "người xem",
      exampleSentence: "The video has ten thousand viewers this week.",
      topic: TOPIC,
    }),
  ],

  grammarReference: [
    buildGrammarRef({
      structure: "Reported speech (statements)",
      explanation:
        "To report what someone said, often use said/told + (that) + subject + past tense. Pronouns and time words may change.",
      examples: [
        'Direct: "I subscribe to this channel." → Reported: She said (that) she subscribed to that channel.',
        'Direct: "I read the headline." → Reported: He said (that) he read the headline.',
        'Direct: "My profile is private." → Reported: She told us (that) her profile was private.',
      ],
      commonMistakes: [
        'She said me she likes blogs (×) → She told me she liked blogs (✓)',
        "He said that he subscribe (×) → He said that he subscribed (✓)",
        "They told they upload photos (×) → They said they uploaded photos (✓)",
      ],
      topic: TOPIC,
    }),
    buildGrammarRef({
      structure: "Zero and first conditional",
      explanation:
        "Zero conditional: If + present, present — for general truths. First conditional: If + present, will + base verb — for real future possibilities.",
      examples: [
        "If you subscribe, you get notifications. (zero)",
        "If I see a strange message, I tell my parents. (zero)",
        "If the advertisement is boring, I will skip it. (first)",
        "If Mia writes a positive headline, more viewers will read her blog. (first)",
      ],
      commonMistakes: [
        "If I will see a message, I tell (×) → If I see a message, I will tell (✓)",
        "If you subscribe, you will get always (×) → If you subscribe, you always get notifications (✓)",
        "If he uploads, he will uploads (×) → If he uploads, he will get viewers (✓)",
      ],
      topic: TOPIC,
    }),
  ],

  unit: {
    learningObjectives: [
      "Use communication and media vocabulary at A2 level.",
      "Report simple statements about media habits.",
      "Use zero and first conditionals to talk about messages and online habits.",
      "Find detail and opinion in a short survey text.",
      "Understand main ideas in a radio interview and safety announcement.",
      "Write a short message about media use.",
      "Answer interview questions about online communication.",
    ],
  },

  lessons: {
    vocabulary: {
      slug: "vocab-media-words",
      title: "Lesson 1: Communication and Media Words",
      learningObjective:
        "Recognise and understand twelve words about messages, blogs and online media at KET A2 level.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "vocab-media-learn",
          title: "Learn: Media Word Match",
          instructions: "Read each sentence. Choose the best word.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "A short text you send on your phone is a _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Message (tin nhắn) gửi qua điện thoại. Headline là tiêu đề tin.",
              correct: "message",
              wrong: ["headline", "profile"],
              distractorNotes: ["Title of news", "Personal online page"],
            }),
            buildMcq({
              questionText: "A person who writes regular posts online is a _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Blogger (người viết blog) đăng bài thường xuyên. Viewer là người xem.",
              correct: "blogger",
              wrong: ["viewer", "notification"],
              distractorNotes: ["Person who watches", "Alert on your phone"],
            }),
            buildMcq({
              questionText: "When you follow a video series online, you join a _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Channel (kênh) là nơi đăng video. Podcast là chương trình audio.",
              correct: "channel",
              wrong: ["podcast", "receipt"],
              distractorNotes: ["Audio show", "Not a media word here"],
            }),
            buildMcq({
              questionText: "A paid promotion before a video is an _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Advertisement (quảng cáo) xuất hiện trước nội dung. Content là nội dung chính.",
              correct: "advertisement",
              wrong: ["content", "message"],
              distractorNotes: ["Main material", "Private text"],
            }),
            buildMcq({
              questionText: "The big title at the top of news is the _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Headline (tiêu đề tin) ở đầu bài báo. Profile là trang cá nhân.",
              correct: "headline",
              wrong: ["profile", "upload"],
              distractorNotes: ["Personal page", "Verb/action"],
            }),
            buildMcq({
              questionText: "When you press 'follow' on a channel, you _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Subscribe (đăng ký theo dõi) để nhận nội dung mới.",
              correct: "subscribe",
              wrong: ["upload", "complain"],
              distractorNotes: ["Put content online", "Not media action here"],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-media-matching",
          title: "Practice: Match the Pairs",
          instructions: "Match each word on the left with the correct meaning on the right.",
          exerciseType: "matching",
          sortOrder: 1,
          questions: [
            buildMatching({
              questionText: "Match the media words to their meanings.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Notification và profile thường bị nhầm — một cái là báo, một cái là trang cá nhân.",
              pairs: [
                { left: "notification", right: "an alert on your phone or app" },
                { left: "profile", right: "your personal page online" },
                { left: "upload", right: "to put photos or videos on the internet" },
                { left: "viewer", right: "a person who watches online content" },
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-media-check",
          title: "Check: Vocab Quiz",
          instructions: "No hints — choose the best answer for each question.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          qualityScores: { quality: 0.91, difficulty: 0.32, curriculumAlignment: 0.96, needsReview: false },
          questions: [
            buildMcq({
              questionText: "A weekly audio show you download is a _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Podcast là chương trình audio. Channel thường là video.",
              correct: "podcast",
              wrong: ["headline", "queue"],
              distractorNotes: ["News title", "Not a media word"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Videos, photos and posts together are called online _____.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Content (nội dung) gồm mọi thứ đăng tải.",
              correct: "content",
              wrong: ["postage", "registration"],
              distractorNotes: ["Mail cost", "Signing up for services"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Be careful — do not _____ personal photos without asking.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Upload (tải lên) cần cẩn thận với quyền riêng tư.",
              correct: "upload",
              wrong: ["subscribe", "headline"],
              distractorNotes: ["Follow a channel", "Title text"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "The blogger has five thousand _____ this month.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "Viewers (người xem) xem nội dung. Notifications là thông báo.",
              correct: "viewers",
              wrong: ["notifications", "appointments"],
              distractorNotes: ["Phone alerts", "Booked times"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-media-apply",
          title: "Apply: Complete the Sentences",
          instructions: "Fill in each gap with the correct word from the unit.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: "Complete: I got a [0] about a new [1] from my cousin.",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "notification (thông báo) về message (tin nhắn).",
              template: "I got a [0] about a new [1] from my cousin.",
              correctAnswers: ["notification", "message"],
              acceptableAnswers: [
                ["notification", "Notification"],
                ["message", "Message"],
              ],
            }),
            buildGapFill({
              questionText: "Complete: She [0] to a cooking [1] and reads every [2].",
              skillTag: "vocabulary",
              topicTag: TOPIC,
              explanation: "subscribed; channel; headline — thói quen xem media.",
              template: "She [0] to a cooking [1] and reads every [2].",
              correctAnswers: ["subscribed", "channel", "headline"],
              acceptableAnswers: [
                ["subscribed", "Subscribed", "subscribes", "Subscribes"],
                ["channel", "Channel"],
                ["headline", "Headline"],
              ],
            }),
          ],
        }),
      ],
    },

    grammar: {
      slug: "grammar-reported-conditionals",
      title: "Lesson 2: Reported Speech and Conditionals",
      learningObjective:
        "Report simple statements about media and use zero and first conditionals correctly.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "grammar-reported-learn",
          title: "Learn: Report What They Said",
          instructions: "Choose the best reported sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: 'Direct: "I subscribe to this channel." → Reported:',
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "She said (that) she subscribed — động từ lùi thì trong reported speech.",
              correct: "She said (that) she subscribed to that channel.",
              wrong: [
                "She said (that) she subscribe to this channel.",
                "She said me she subscribed.",
              ],
              distractorNotes: ["Wrong tense", "said me is wrong — told me"],
            }),
            buildMcq({
              questionText: 'Direct: "My profile is private." → Reported:',
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "She told us (that) her profile was private — is → was.",
              correct: "She told us (that) her profile was private.",
              wrong: [
                "She told us her profile is private.",
                "She told that profile was private.",
              ],
              distractorNotes: ["Present in reported clause", "Missing subject"],
            }),
            buildMcq({
              questionText: "If you subscribe, you _____ notifications. (general truth)",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Zero conditional: If + present, present.",
              correct: "get",
              wrong: ["will get", "got"],
              distractorNotes: ["First conditional form", "Past — wrong pattern"],
            }),
            buildMcq({
              questionText: "If the advertisement is boring, I _____ it. (future result)",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "First conditional: If + present, will + verb.",
              correct: "will skip",
              wrong: ["skip", "skipped"],
              distractorNotes: ["Zero conditional", "Past form"],
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-reported-practice",
          title: "Practice: Complete the Grammar",
          instructions: "Fill in each gap with the correct form.",
          exerciseType: "gap_fill",
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText: "Complete: Tom said he [0] to a gaming channel. | If I [1] a strange message, I [2] my parents.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "subscribed (reported); get / see; tell — zero conditional.",
              template: "Tom said he [0] to a gaming channel. If I [1] a strange message, I [2] my parents.",
              correctAnswers: ["subscribed", "get", "tell"],
              acceptableAnswers: [
                ["subscribed", "Subscribed"],
                ["get", "Get", "see", "See", "receive", "Receive"],
                ["tell", "Tell", "will tell", "will Tell"],
              ],
            }),
            buildGapFill({
              questionText: "Complete: If she [0] a good headline, more viewers [1] her blog.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "writes (first conditional if-clause); will read.",
              template: "If she [0] a good headline, more viewers [1] her blog.",
              correctAnswers: ["writes", "will read"],
              acceptableAnswers: [
                ["writes", "Writes"],
                ["will read", "Will read", "will visit", "Will visit"],
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-reported-check",
          title: "Check: Grammar Challenge",
          instructions: "Choose the correct answer. Think carefully.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          qualityScores: { quality: 0.92, difficulty: 0.38, curriculumAlignment: 0.97, needsReview: false },
          questions: [
            buildMcq({
              questionText: 'Mia said, "I upload content every Friday." → Reported:',
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Mia said (that) she uploaded content every Friday.",
              correct: "Mia said (that) she uploaded content every Friday.",
              wrong: [
                "Mia said (that) she uploads content every Friday.",
                "Mia told she uploaded content every Friday.",
              ],
              distractorNotes: ["No backshift", "Missing object after told"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "If you _____ your profile public, strangers can see your photos.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Zero conditional: If + present, can + verb.",
              correct: "make",
              wrong: ["will make", "made"],
              distractorNotes: ["Future in if-clause", "Past"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "If I read an interesting headline, I _____ the full message.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "First conditional for real future: I will read.",
              correct: "will read",
              wrong: ["read", "reading"],
              distractorNotes: ["Zero — less future focus", "Wrong form"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Priya told us she _____ photos only on weekends.",
              skillTag: "grammar",
              topicTag: TOPIC,
              explanation: "Reported: upload → uploaded.",
              correct: "uploaded",
              wrong: ["uploads", "upload"],
              distractorNotes: ["Direct speech tense", "Base form"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-reported-apply",
          title: "Apply: Build the Sentence",
          instructions: "Put the words in the correct order to make a sentence.",
          exerciseType: "sentence_ordering",
          sortOrder: 3,
          questions: [
            buildOrderQ(
              "Make a sentence: He / said / that / he / subscribed / to the channel.",
              "grammar",
              "He said that he subscribed to the channel. — reported speech.",
              ["He", "said", "that", "he", "subscribed", "to the channel."]
            ),
            buildOrderQ(
              "Make a sentence: If / I / get / a notification, / I / check / the message.",
              "grammar",
              "If I get a notification, I check the message. — zero conditional.",
              ["If", "I", "get", "a notification,", "I", "check", "the message."],
              2
            ),
            buildOrderQ(
              "Make a sentence: If / the advertisement / is boring, / I / will / skip / it.",
              "grammar",
              "If the advertisement is boring, I will skip it. — first conditional.",
              ["If", "the advertisement", "is boring,", "I", "will", "skip", "it."],
              3
            ),
          ],
        }),
      ],
    },

    reading: {
      slug: "reading-media-survey",
      title: "Lesson 3: Media Survey",
      learningObjective:
        "Find detail, opinion and vocabulary in a short survey about communication and media habits.",
      estimatedMinutes: 23,
      exercises: [
        buildReadingExercise({
          slug: "reading-media-learn",
          title: "Learn: Read the Survey",
          instructions: "Read the survey results. Answer the detail questions.",
          sortOrder: 0,
          passage: mediaPassage,
          questions: [
            buildMcq({
              questionText: "How often does Linh check notifications?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Linh checks her phone for notifications every hour.",
              correct: "Every hour",
              wrong: ["Once a week", "Never"],
              distractorNotes: ["Too infrequent", "Opposite of text"],
              assessmentType: "detail",
            }),
            buildMcq({
              questionText: "What does Tom do if an advertisement is boring?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: 'Tom: "If the advertisement is boring, I skip it."',
              correct: "He skips it",
              wrong: ["He uploads a photo", "He writes a headline"],
              distractorNotes: ["Priya's habit", "Linh's habit"],
              assessmentType: "detail",
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-media-practice",
          title: "Practice: Words in the Survey",
          instructions: "Read the survey again. Answer about vocabulary and meaning.",
          sortOrder: 1,
          passage: mediaPassage,
          difficulty: 0.3,
          questions: [
            buildMcq({
              questionText: "What does 'subscribed' mean in Tom's answer?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "He subscribed to a gaming channel — đăng ký theo dõi kênh.",
              correct: "He followed the channel to get new videos",
              wrong: ["He uploaded his homework", "He wrote a complaint"],
              distractorNotes: ["Upload action", "Services word"],
              assessmentType: "vocabulary_in_context",
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Why is Priya careful about her profile?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "She never shares personal details — safety and privacy.",
              correct: "She wants to stay safe online",
              wrong: ["She hates all advertisements", "She cannot read headlines"],
              distractorNotes: ["Tom skips ads", "All students read headlines"],
              assessmentType: "inference",
              difficultyRating: 2,
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-media-check",
          title: "Check: Main Idea and Order",
          instructions: "Read the survey one more time. These questions need careful thinking.",
          sortOrder: 2,
          passage: mediaPassage,
          difficulty: 0.35,
          questions: [
            buildMcq({
              questionText: "What is the main purpose of the survey report?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "The school will use these answers to plan safer media lessons.",
              correct: "To understand student media habits and plan lessons",
              wrong: ["To sell advertisements to students", "To close all phone channels"],
              distractorNotes: ["Not commercial", "Opposite intention"],
              assessmentType: "main_idea",
            }),
            buildMcq({
              questionText: "Which student is most careful about strangers online?",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Priya tells parents about strange notifications and keeps profile private.",
              correct: "Priya",
              wrong: ["Linh", "Tom"],
              distractorNotes: ["Reads headlines quickly", "Skips boring ads"],
              assessmentType: "sequencing",
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "reading-media-apply",
          title: "Apply: Match Students to Habits",
          instructions: "Use what you read. Match each student to the correct habit.",
          exerciseType: "matching",
          sortOrder: 3,
          content: { passage: mediaPassage },
          questions: [
            buildMatching({
              questionText: "Match each student to their media habit.",
              skillTag: "reading",
              topicTag: TOPIC,
              explanation: "Mỗi học sinh có thói quen khác nhau trong khảo sát.",
              pairs: [
                { left: "Linh", right: "Reads full messages after interesting headlines" },
                { left: "Tom", right: "Subscribed to a gaming channel" },
                { left: "Priya", right: "Uploads photos only on weekends" },
                { left: "All three", right: "Use phones for communication and media" },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    listening: {
      slug: "listening-media-interviews",
      title: "Lesson 4: Media on the Radio",
      learningObjective:
        "Understand detail in a radio interview about a blogger and an online safety announcement.",
      estimatedMinutes: 22,
      exercises: [
        buildListeningExercise({
          slug: "listening-blogger-learn",
          title: "Learn: Blogger Interview",
          instructions: "Listen to the radio item. Answer the first two questions.",
          sortOrder: 0,
          script: listeningScript1,
          answerKey: { q1: "five thousand subscribers", q2: "positive headline" },
          questions: [
            buildMcq({
              questionText: "How many subscribers does Mia's channel have?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Her channel has five thousand subscribers now.",
              correct: "Five thousand",
              wrong: ["Five hundred", "Fifty thousand"],
              distractorNotes: ["Too small", "Too large"],
            }),
            buildMcq({
              questionText: "What does Mia try to write if a headline is negative?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "If a headline is negative, she tries to write something positive.",
              correct: "Something positive",
              wrong: ["A long advertisement", "A private profile"],
              distractorNotes: ["Ads come after interview", "Profile safety is separate point"],
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-blogger-practice",
          title: "Practice: More from the Interview",
          instructions: "Listen again to the same radio item. Answer the next questions.",
          sortOrder: 1,
          script: listeningScript1,
          answerKey: { q1: "message every morning", q2: "keep profile private" },
          difficulty: 0.28,
          questions: [
            buildMcq({
              questionText: "What does Mia write to her readers every morning?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "She writes a short message to her readers every morning.",
              correct: "A short message",
              wrong: ["A podcast episode", "A bank receipt"],
              distractorNotes: ["Audio show", "Wrong topic"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "What does Mia say students should do with their profile?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Keep their profile private.",
              correct: "Keep it private",
              wrong: ["Upload every hour", "Subscribe to every channel"],
              distractorNotes: ["Too frequent", "Not what she said"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-safety-check",
          title: "Check: Online Safety Announcement",
          instructions: "Listen to a new announcement. Choose the correct answer.",
          sortOrder: 2,
          script: listeningScript2,
          answerKey: { q1: "tell teacher or parents", q2: "check profile before upload" },
          difficulty: 0.32,
          questions: [
            buildMcq({
              questionText: "What should you do if you get a message from someone you do not know?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Do not reply. Tell a teacher or your parents.",
              correct: "Tell a teacher or your parents",
              wrong: ["Reply with your profile link", "Upload a photo"],
              distractorNotes: ["Unsafe action", "Wrong response"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Before you upload photos, what should you check?",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Check the profile carefully before you upload photos.",
              correct: "The profile settings",
              wrong: ["The postage cost", "The bank account"],
              distractorNotes: ["Services topic", "Wrong context"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "listening-media-apply",
          title: "Apply: Match Facts from the Interview",
          instructions: "Listen to the blogger interview again. Match each topic to the correct fact.",
          exerciseType: "matching",
          sortOrder: 3,
          content: {
            script: listeningScript1,
            answerKey: { matching: true },
          },
          questions: [
            buildMatching({
              questionText: "Match each topic to a fact from the interview.",
              skillTag: "listening",
              topicTag: TOPIC,
              explanation: "Mỗi mục khớp với thông tin trong bài phát thanh.",
              pairs: [
                { left: "Mia's job", right: "Teen blogger" },
                { left: "Channel size", right: "Five thousand subscribers" },
                { left: "After interview", right: "Music and advertisement" },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    writing: {
      slug: "writing-media-message",
      title: "Lesson 5: Write About Media",
      learningObjective:
        "Write a short message about media habits using reported speech and conditionals.",
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: "writing-media-learn",
          title: "Learn: Message Phrases",
          instructions: "Complete each gap with a word from the box: message, channel, subscribe, if, will.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText: "Complete: I sent a [0] to my friend about a new video [1]. | [2] you [3] to it, you get notifications.",
              skillTag: "writing",
              topicTag: TOPIC,
              explanation: "message; channel; If; subscribe — zero conditional.",
              template: "I sent a [0] to my friend about a new video [1]. [2] you [3] to it, you get notifications.",
              correctAnswers: ["message", "channel", "If", "subscribe"],
              acceptableAnswers: [
                ["message", "Message"],
                ["channel", "Channel"],
                ["If", "if"],
                ["subscribe", "Subscribe"],
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "writing-media-order-practice",
          title: "Practice: Build Sentences",
          instructions: "Put the words in order to make correct sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            buildOrderQ(
              "Make a sentence: She / said / that / she / read / the headline.",
              "writing",
              "She said that she read the headline. — reported speech in writing.",
              ["She", "said", "that", "she", "read", "the headline."]
            ),
            buildOrderQ(
              "Make a sentence: If / I / see / a boring advertisement, / I / will / skip / it.",
              "writing",
              "If I see a boring advertisement, I will skip it. — first conditional.",
              ["If", "I", "see", "a boring advertisement,", "I", "will", "skip", "it."],
              2
            ),
          ],
        }),
        buildExercise({
          slug: "writing-media-check",
          title: "Check: Message About Your Media Habits",
          instructions: "Write a message to a friend. Write at least 25 words.",
          exerciseType: "writing",
          sortOrder: 2,
          content: {
            taskDescription:
              "Write a message to your friend about your communication and media habits. Mention a channel, blog or app you use.",
            prompts: [
              "Say which channel, blogger or app you use.",
              "Explain when you check messages or notifications.",
              "Use If ... to say what you do when you see an advertisement or headline.",
              "End the message in a friendly way.",
            ],
            minWords: 25,
            successCriteria: [
              "At least 25 words",
              "Mentions media vocabulary",
              "Uses if-clause or reported speech",
              "Friendly message tone",
              "Clear ending",
            ],
            modelAnswer: {
              text: "Hi Lan,\n\nI subscribed to a science channel last month. I check notifications after school, but not during lessons. My friend said that she uploads photos on weekends only. If an advertisement is boring, I will skip it. Do you read the headline before you watch a video?\n\nSee you,\nTom",
            },
            rubric: {
              grammar: {
                weight: 0.25,
                criteria: "Uses reported speech or zero/first conditional correctly.",
              },
              vocabulary: {
                weight: 0.25,
                criteria: "Uses media words (message, channel, subscribe, notification, etc.).",
              },
              organization: {
                weight: 0.25,
                criteria: "Message is clear with greeting and closing.",
              },
              taskAchievement: {
                weight: 0.25,
                criteria: "Describes media habits; at least 25 words.",
              },
            },
            autoCheckKeywords: [
              "hi",
              "message",
              "channel",
              "subscribe",
              "notification",
              "if",
              "headline",
              "advertisement",
            ],
          },
        }),
        buildExercise({
          slug: "writing-media-apply",
          title: "Apply: Complete the Message Frames",
          instructions: "Complete the message frames with the correct unit words.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: "Complete: Hi Mia, | I read your [0] today. | If I like the [1], I [2] to your [3]. | Bye, | Hoa",
              skillTag: "writing",
              topicTag: TOPIC,
              explanation: "headline; content; subscribe; channel.",
              template: "Hi Mia,\n\nI read your [0] today. If I like the [1], I [2] to your [3].\n\nBye,\nHoa",
              correctAnswers: ["headline", "content", "subscribe", "channel"],
              acceptableAnswers: [
                ["headline", "Headline"],
                ["content", "Content"],
                ["subscribe", "Subscribe", "will subscribe", "will Subscribe"],
                ["channel", "Channel"],
              ],
            }),
          ],
        }),
      ],
    },

    speaking: {
      slug: "speaking-media-habits",
      title: "Lesson 6: Talk About Media Habits",
      learningObjective:
        "Answer interview questions about messages, channels and online safety.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "speaking-media-learn",
          title: "Learn: Choose the Best Reply",
          instructions: "Imagine an examiner asks you a question. Choose the best answer.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Examiner: Do you subscribe to any channels? You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Yes, I subscribe to... — trả lời trực tiếp với từ vựng đơn vị.",
              correct: "Yes, I subscribe to a cooking channel and a music channel.",
              wrong: ["Yes, I postage to channels.", "I registration three blogs."],
              distractorNotes: ["Wrong word", "Broken grammar"],
            }),
            buildMcq({
              questionText: "Examiner: What is a notification? You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "An alert on your phone — định nghĩa ngắn A2.",
              correct: "It is an alert on my phone about a new message or video.",
              wrong: ["It is a bank receipt.", "It is a registration form."],
              distractorNotes: ["Services word", "Wrong topic"],
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-media-practice",
          title: "Practice: Best Response",
          instructions: "Choose the most appropriate reply in each media situation.",
          exerciseType: "multiple_choice",
          sortOrder: 1,
          questions: [
            buildMcq({
              questionText: "Your friend said, 'I upload photos every day.' You report:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "She said (that) she uploaded... — reported speech trong nói.",
              correct: "She said that she uploaded photos every day.",
              wrong: ["She said she upload photos every day.", "She told that upload photos."],
              distractorNotes: ["Wrong tense", "Broken structure"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Examiner: What do you do if you see a strange message? You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "If I get a strange message, I tell my parents — zero conditional.",
              correct: "If I get a strange message, I tell my parents.",
              wrong: ["If I will get strange message, tell.", "Message is strange I parents."],
              distractorNotes: ["Will in if-clause", "Broken sentence"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-media-check",
          title: "Check: Interview About Media",
          instructions: "Answer the examiner's questions. Record your answers.",
          exerciseType: "speaking",
          sortOrder: 2,
          content: {
            prompt:
              "The examiner will ask about how you use messages, social media, blogs and online video.",
            pictureDescription:
              "A teenager looking at a phone with message bubbles, a play button for a video channel and a notification icon.",
            followUpQuestions: [
              "How often do you send messages to friends?",
              "Do you follow any bloggers or channels? Which ones?",
              "When do you get notifications on your phone?",
              "Do you read the headline before you watch a video?",
              "What do you do if an advertisement is very long?",
              "How can you keep your online profile safe?",
            ],
            suggestedAnswers: [
              "I send messages to my friends every day after school.",
              "Yes, I follow a science blogger and a football channel.",
              "I get notifications when someone sends a message or uploads a new video.",
              "Yes, I usually read the headline first.",
              "If an advertisement is very long, I will skip it.",
              "I keep my profile private and I do not upload personal photos without asking.",
            ],
            assessmentCriteria: {
              vocabulary: "Uses media vocabulary (message, channel, subscribe, profile, etc.).",
              grammar: "Uses reported speech and if-clauses in short answers.",
              fluency: "Speaks in clear short sentences.",
              taskAchievement: "Answers all six questions with relevant examples.",
            },
            maxDurationSeconds: 120,
          },
        }),
        buildExercise({
          slug: "speaking-media-apply",
          title: "Apply: Situational Response",
          instructions: "Choose the best thing to say in each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "A stranger asks for your profile link in a message. You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Refuse politely and tell an adult — an toàn online.",
              correct: "Sorry, I do not share my profile with strangers. I will tell my teacher.",
              wrong: ["Here is my profile! Message me!", "Profiles are for strangers only."],
              distractorNotes: ["Unsafe", "Wrong advice"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Your cousin asks why you subscribed to a channel. You say:",
              skillTag: "speaking",
              topicTag: TOPIC,
              explanation: "Explain reason with because/if — A2 speaking pattern.",
              correct: "Because the content is interesting and I learn new words from the blogger.",
              wrong: ["Because subscribe is headline.", "Channel message notification upload."],
              distractorNotes: ["Word salad", "List without sentence"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  },
};
