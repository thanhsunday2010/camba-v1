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

const TOPIC = "food-and-shopping";

const shoppingPassage = buildPassage({
  title: "Smart Shopping at GreenMart",
  text: `Last Saturday, Linh went to GreenMart supermarket with her mother. They wanted to buy ingredients for a family dinner, but they also hoped to find a bargain.

First, they checked the discount labels near the checkout. Many customers were pushing trolleys and reading price tags carefully. Linh's mother compared two brands of rice and chose the cheaper one. "We don't need much sugar," she said, "just a little for the recipe."

At the meat counter, Linh asked the assistant about a refund policy. The assistant explained that customers could return items with a receipt within seven days. Linh felt happier because she had forgotten an ingredient last week and lost money.

Before they paid, they joined a short queue at the checkout. The total was lower than Linh expected because of a ten-percent discount on vegetables. On the way home, Linh decided she would shop more carefully every week. "Fewer impulse buys mean more savings," her mother smiled.`,
const checkoutScript = buildListeningScript({
  title: "At the Supermarket Checkout",
  setting: "GreenMart supermarket checkout",
  speakers: [
    { name: "Assistant", role: "checkout staff" },
    { name: "Linh", role: "customer" },
  ],
  lines: [
    {
      speaker: "Assistant",
      text: "Hello. Did you find everything today?",
    },
    {
      speaker: "Linh",
      text: "Yes, thanks. I'd like to order these ingredients for soup, please.",
    },
    {
      speaker: "Assistant",
      text: "That's twelve pounds forty. There's a discount on tomatoes today.",
    },
    {
      speaker: "Linh",
      text: "Great. Can I have a receipt, please? I might need a refund if the milk is bad.",
    },
    {
      speaker: "Assistant",
      text: "Of course. Keep the receipt. Next customer, please!",
    },
  ],
  audioNotes:
    "Busy supermarket sounds in background, clear friendly voices. Approx. 35 seconds.",
});

const marketScript = buildListeningScript({
  title: "Weekend Market Bargain",
  setting: "Outdoor food market",
  speakers: [
    { name: "Vendor", role: "market seller" },
    { name: "Minh", role: "customer" },
  ],
  lines: [
    {
      speaker: "Vendor",
      text: "Good morning! Fresh fruit today. Three mangoes for two pounds — a real bargain!",
    },
    {
      speaker: "Minh",
      text: "That's cheaper than the supermarket. I'll take six, please.",
    },
    {
      speaker: "Vendor",
      text: "Many customers buy extra for smoothies. Do you need a bag?",
    },
    {
      speaker: "Minh",
      text: "Yes, please. Here's four pounds. Keep the change.",
    },
    {
      speaker: "Vendor",
      text: "Thank you! Enjoy your shopping.",
    },
  ],
  audioNotes:
    "Outdoor market ambience, clear prices and numbers. Approx. 38 seconds.",
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
      word: "receipt",
      ipa: "/rɪˈsiːt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hóa đơn / biên lai",
      exampleSentence: "Keep your receipt if you want a refund.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "discount",
      ipa: "/ˈdɪskaʊnt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "giảm giá",
      exampleSentence: "There is a ten-percent discount on fruit today.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "customer",
      ipa: "/ˈkʌstəmə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "khách hàng",
      exampleSentence: "The shop assistant helped the customer.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "order",
      ipa: "/ˈɔːdə(r)/",
      partOfSpeech: "noun",
      vietnameseMeaning: "đơn hàng / gọi món",
      exampleSentence: "I placed an order for two pizzas.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "ingredient",
      ipa: "/ɪnˈɡriːdiənt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "nguyên liệu",
      exampleSentence: "Salt is an important ingredient in this soup.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "refund",
      ipa: "/ˈriːfʌnd/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hoàn tiền",
      exampleSentence: "She asked for a refund because the bread was old.",
      difficulty: 2,
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "bargain",
      ipa: "/ˈbɑːɡən/",
      partOfSpeech: "noun",
      vietnameseMeaning: "món hời / giá rẻ",
      exampleSentence: "These shoes were a real bargain.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "checkout",
      ipa: "/ˈtʃekaʊt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "quầy thanh toán",
      exampleSentence: "We paid at the checkout near the exit.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "supermarket",
      ipa: "/ˈsuːpəmɑːkɪt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "siêu thị",
      exampleSentence: "We buy most food at the supermarket.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "queue",
      ipa: "/kjuː/",
      partOfSpeech: "noun",
      vietnameseMeaning: "hàng đợi",
      exampleSentence: "There was a long queue at the checkout.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "wallet",
      ipa: "/ˈwɒlɪt/",
      partOfSpeech: "noun",
      vietnameseMeaning: "ví tiền",
      exampleSentence: "He paid from his wallet at the counter.",
      topic: TOPIC,
    }),
    buildVocabWord({
      word: "menu",
      ipa: "/ˈmenjuː/",
      partOfSpeech: "noun",
      vietnameseMeaning: "thực đơn",
      exampleSentence: "Look at the menu before you order.",
      topic: TOPIC,
    }),
  ],

  grammarReference: [
    buildGrammarRef({
      structure: "Quantifiers: much, many, a few, a little, all, every",
      explanation:
        "Use many with countable nouns and much with uncountable nouns, usually in questions and negatives. Use a few (countable) and a little (uncountable) for small positive amounts. Use all and every to talk about complete groups.",
      examples: [
        "How many apples do we need?",
        "There isn't much sugar left.",
        "I bought a few eggs and a little milk.",
        "Every customer gets a discount today.",
      ],
      commonMistakes: [
        "How much apples? (×) → How many apples? (✓)",
        "I have a few milk (×) → I have a little milk (✓)",
        "Every customers (×) → Every customer (✓)",
      ],
      topic: TOPIC,
    }),
    buildGrammarRef({
      structure: "Comparatives and superlatives (less / fewer)",
      explanation:
        "Use comparatives (-er or more) to compare two things. Use superlatives (-est or most) for the extreme in a group. Use fewer with countable nouns and less with uncountable nouns.",
      examples: [
        "This shop is cheaper than the market.",
        "It is the best bargain in the store.",
        "I eat fewer sweets now.",
        "We need less salt in this recipe.",
      ],
      commonMistakes: [
        "less customers (×) → fewer customers (✓)",
        "more cheap (×) → cheaper (✓)",
        "the most cheap (×) → the cheapest (✓)",
      ],
      topic: TOPIC,
    }),
  ],

  unit: {
    learningObjectives: [
      "Use core food and shopping vocabulary at A2 level.",
      "Use quantifiers much, many, a few and a little correctly.",
      "Use comparatives, superlatives, less and fewer when shopping.",
      "Complete a short text about shopping with grammatical control.",
      "Understand transactional exchanges at shops and markets.",
      "Write a short message about a shopping experience.",
      "Answer interview questions about food and shopping habits.",
    ],
  },

  lessons: {
    vocabulary: {
      slug: "vocab-shopping-words",
      title: "Lesson 1: Food and Shopping Words",
      learningObjective:
        "Recognise and understand twelve food and shopping words at KET A2 level.",
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: "vocab-shopping-learn",
          title: "Learn: Shopping Word Match",
          instructions: "Read each sentence. Choose the best word.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "The paper that shows what you paid is a _____.",
              skillTag: "vocabulary",
              explanation: "Receipt (hóa đơn) chứng minh thanh toán. Refund là hoàn tiền.",
              correct: "receipt",
              wrong: ["refund", "bargain"],
              distractorNotes: ["Money returned", "Good cheap buy"],
            }),
            buildMcq({
              questionText: "When the price is lower than usual, there is a _____.",
              skillTag: "vocabulary",
              explanation: "Discount (giảm giá) làm giá rẻ hơn.",
              correct: "discount",
              wrong: ["queue", "menu"],
              distractorNotes: ["Line of people", "List of food"],
            }),
            buildMcq({
              questionText: "A person who buys things in a shop is a _____.",
              skillTag: "vocabulary",
              explanation: "Customer (khách hàng) là người mua hàng.",
              correct: "customer",
              wrong: ["ingredient", "checkout"],
              distractorNotes: ["Part of a recipe", "Place to pay"],
            }),
            buildMcq({
              questionText: "Flour, eggs and milk are _____ in a cake recipe.",
              skillTag: "vocabulary",
              explanation: "Ingredient (nguyên liệu) là thành phần nấu ăn.",
              correct: "ingredients",
              wrong: ["receipts", "queues"],
              distractorNotes: ["Payment papers", "Lines of people"],
            }),
            buildMcq({
              questionText: "If the shop gives your money back, you get a _____.",
              skillTag: "vocabulary",
              explanation: "Refund (hoàn tiền) khi trả hàng hoặc hàng lỗi.",
              correct: "refund",
              wrong: ["discount", "order"],
              distractorNotes: ["Lower price", "Request for goods"],
            }),
            buildMcq({
              questionText: "Something very cheap and good value is a _____.",
              skillTag: "vocabulary",
              explanation: "Bargain (món hời) là mua được giá tốt.",
              correct: "bargain",
              wrong: ["wallet", "supermarket"],
              distractorNotes: ["Money holder", "Type of shop"],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-shopping-matching",
          title: "Practice: Match the Pairs",
          instructions: "Match each word on the left with the correct meaning on the right.",
          exerciseType: "matching",
          sortOrder: 1,
          questions: [
            buildMatching({
              questionText: "Match the shopping words to their meanings.",
              skillTag: "vocabulary",
              explanation:
                "Mỗi từ khớp với nghĩa rõ ràng. Order và checkout thường bị nhầm.",
              pairs: [
                { left: "order", right: "a request to buy food or goods" },
                { left: "checkout", right: "the place where you pay in a shop" },
                { left: "menu", right: "a list of food you can choose in a café" },
                { left: "queue", right: "a line of people waiting" },
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-shopping-check",
          title: "Check: Vocab Quiz",
          instructions: "No hints — choose the best answer for each question.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          questions: [
            buildMcq({
              questionText: "We paid at the _____ near the supermarket exit.",
              skillTag: "vocabulary",
              explanation: "Checkout (quầy thanh toán) là nơi trả tiền.",
              correct: "checkout",
              wrong: ["ingredient", "bargain"],
              distractorNotes: ["Recipe item", "Cheap product"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "She kept the _____ in her _____ after paying.",
              skillTag: "vocabulary",
              explanation: "Receipt (hóa đơn) thường cất trong wallet (ví).",
              correct: "receipt ... wallet",
              wrong: ["menu ... queue", "discount ... ingredient"],
              distractorNotes: ["Wrong pair", "Wrong pair"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Many _____ were waiting because the _____ was very long.",
              skillTag: "vocabulary",
              explanation: "Customers (khách hàng) xếp queue (hàng đợi).",
              correct: "customers ... queue",
              wrong: ["ingredients ... menu", "refunds ... bargain"],
              distractorNotes: ["Wrong pair", "Wrong pair"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "He found a great _____ on shoes at the _____.",
              skillTag: "vocabulary",
              explanation: "Bargain (món hời) tại supermarket (siêu thị).",
              correct: "bargain ... supermarket",
              wrong: ["receipt ... checkout", "order ... wallet"],
              distractorNotes: ["Wrong collocation", "Wrong collocation"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "vocab-shopping-apply",
          title: "Apply: Words in Sentences",
          instructions: "Complete each sentence with the correct word from the unit.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Keep your [0] for a [1]. | There is a [2] on rice today.",
              skillTag: "vocabulary",
              explanation: "receipt (hóa đơn); refund (hoàn tiền); discount (giảm giá).",
              template:
                "Keep your [0] for a [1]. There is a [2] on rice today.",
              correctAnswers: ["receipt", "refund", "discount"],
              acceptableAnswers: [
                ["receipt", "Receipt"],
                ["refund", "Refund"],
                ["discount", "Discount"],
              ],
              difficultyRating: 2,
            }),
            buildGapFill({
              questionText:
                "Complete: Check the [0] before you [1]. | We joined the [2] at the checkout.",
              skillTag: "vocabulary",
              explanation: "menu (thực đơn); order (gọi món); queue (hàng đợi).",
              template:
                "Check the [0] before you [1]. We joined the [2] at the checkout.",
              correctAnswers: ["menu", "order", "queue"],
              acceptableAnswers: [
                ["menu", "Menu"],
                ["order", "Order"],
                ["queue", "Queue"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    grammar: {
      slug: "grammar-shopping-quantifiers",
      title: "Lesson 2: Quantifiers and Comparisons",
      learningObjective:
        "Use quantifiers and comparatives/superlatives when talking about shopping.",
      estimatedMinutes: 24,
      exercises: [
        buildExercise({
          slug: "grammar-shopping-learn",
          title: "Learn: Much, Many, Fewer",
          instructions: "Choose the correct word or phrase to complete each sentence.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "How _____ apples do we need for the recipe?",
              skillTag: "grammar",
              explanation: "Apples đếm được → many.",
              correct: "many",
              wrong: ["much", "little"],
              distractorNotes: ["Uncountable quantifier", "Small uncountable amount"],
            }),
            buildMcq({
              questionText: "There isn't _____ sugar in the bowl.",
              skillTag: "grammar",
              explanation: "Sugar không đếm được → much.",
              correct: "much",
              wrong: ["many", "few"],
              distractorNotes: ["Countable quantifier", "Countable small amount"],
            }),
            buildMcq({
              questionText: "I bought _____ eggs and _____ milk.",
              skillTag: "grammar",
              explanation: "a few + countable; a little + uncountable.",
              correct: "a few ... a little",
              wrong: ["a little ... a few", "much ... many"],
              distractorNotes: ["Swapped quantifiers", "Wrong for small amounts"],
            }),
            buildMcq({
              questionText: "This market is _____ than the supermarket near my house.",
              skillTag: "grammar",
              explanation: "So sánh hơn với cheap → cheaper.",
              correct: "cheaper",
              wrong: ["more cheap", "cheapest"],
              distractorNotes: ["Wrong comparative form", "Superlative not comparative"],
            }),
            buildMcq({
              questionText: "I eat _____ snacks now because I want to be healthier.",
              skillTag: "grammar",
              explanation: "Snacks đếm được → fewer.",
              correct: "fewer",
              wrong: ["less", "little"],
              distractorNotes: ["Uncountable form", "Not comparative"],
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-shopping-practice",
          title: "Practice: Complete the Grammar",
          instructions: "Fill in each gap with the correct form.",
          exerciseType: "gap_fill",
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText:
                "Complete: How [0] customers are in the queue? | We need [1] salt. | [2] item is on discount today.",
              skillTag: "grammar",
              explanation: "many (customers); little (salt); Every (item).",
              template:
                "How [0] customers are in the queue? We need [1] salt. [2] item is on discount today.",
              correctAnswers: ["many", "little", "Every"],
              acceptableAnswers: [
                ["many", "Many"],
                ["little", "Little"],
                ["Every", "every"],
              ],
              difficultyRating: 2,
            }),
            buildGapFill({
              questionText:
                "Complete: This is the [0] bargain in the shop. | I spend [1] money on sweets. | There are [2] ingredients in the basket.",
              skillTag: "grammar",
              explanation: "best (superlative); less (money); a few (ingredients).",
              template:
                "This is the [0] bargain in the shop. I spend [1] money on sweets. There are [2] ingredients in the basket.",
              correctAnswers: ["best", "less", "a few"],
              acceptableAnswers: [
                ["best", "Best"],
                ["less", "Less"],
                ["a few", "A few"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-shopping-check",
          title: "Check: Grammar Challenge",
          instructions: "Choose the correct answer. Think carefully.",
          exerciseType: "multiple_choice",
          sortOrder: 2,
          questions: [
            buildMcq({
              questionText: "_____ customer must show a receipt for a refund.",
              skillTag: "grammar",
              explanation: "Every + singular noun: Every customer.",
              correct: "Every",
              wrong: ["All", "Much"],
              distractorNotes: ["All customers needs plural verb pattern", "Wrong quantifier"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "GreenMart has _____ vegetables than the small shop on our street.",
              skillTag: "grammar",
              explanation: "Comparative of many → more.",
              correct: "more",
              wrong: ["much", "most"],
              distractorNotes: ["Not comparative", "Superlative"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "We bought only _____ rice because we don't need _____.",
              skillTag: "grammar",
              explanation: "a little + uncountable rice; much in negative.",
              correct: "a little ... much",
              wrong: ["a few ... many", "many ... few"],
              distractorNotes: ["Rice uncountable", "Wrong quantifiers"],
              difficultyRating: 3,
            }),
            buildMcq({
              questionText: "The checkout queue today is _____ than yesterday.",
              skillTag: "grammar",
              explanation: "Long → comparative longer.",
              correct: "longer",
              wrong: ["more long", "longest"],
              distractorNotes: ["Wrong form", "Superlative"],
              difficultyRating: 3,
            }),
          ],
        }),
        buildExercise({
          slug: "grammar-shopping-order",
          title: "Apply: Build the Sentence",
          instructions: "Put the words in the correct order to make a sentence.",
          exerciseType: "sentence_ordering",
          sortOrder: 3,
          questions: [
            orderingQ(
              "Make a sentence: There / are / a few / customers / at / the checkout.",
              "grammar",
              "There are a few customers at the checkout. — a few + countable.",
              ["There", "are", "a few", "customers", "at", "the checkout."]
            ),
            orderingQ(
              "Make a sentence: This / supermarket / is / cheaper / than / the market.",
              "grammar",
              "This supermarket is cheaper than the market. — comparative.",
              ["This", "supermarket", "is", "cheaper", "than", "the market."]
            ),
            orderingQ(
              "Make a sentence: I / need / a little / sugar / for / the recipe.",
              "grammar",
              "I need a little sugar for the recipe. — a little + uncountable.",
              ["I", "need", "a little", "sugar", "for", "the recipe."],
              3
            ),
          ],
        }),
      ],
    },

    reading: {
      slug: "reading-supermarket-article",
      title: "Lesson 3: Shopping Article",
      learningObjective:
        "Read a short shopping text and complete meaning with grammatical control.",
      estimatedMinutes: 23,
      exercises: [
        buildReadingExercise({
          slug: "reading-shopping-learn",
          title: "Learn: Read the Article",
          instructions: "Read the article carefully. Answer the detail questions.",
          sortOrder: 0,
          passage: shoppingPassage,
          questions: [
            buildMcq({
              questionText: "Why did Linh and her mother go to GreenMart?",
              skillTag: "reading",
              explanation: "Buy ingredients for a family dinner.",
              correct: "To buy ingredients for dinner",
              wrong: ["To get a refund only", "To eat at the café menu"],
              distractorNotes: ["Refund was a question later", "Not mentioned"],
              assessmentType: "detail",
            }),
            buildMcq({
              questionText: "How long can customers return items with a receipt?",
              skillTag: "reading",
              explanation: "Return items with a receipt within seven days.",
              correct: "Within seven days",
              wrong: ["On the same day only", "After one month"],
              distractorNotes: ["Too short", "Too long"],
              assessmentType: "detail",
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-shopping-practice",
          title: "Practice: Words in the Article",
          instructions: "Read the article again. Answer about vocabulary and meaning.",
          sortOrder: 1,
          passage: shoppingPassage,
          questions: [
            buildMcq({
              questionText: "In the article, 'a bargain' means _____.",
              skillTag: "reading",
              explanation: "Hoped to find a bargain — món hời, giá tốt.",
              correct: "something bought at a good price",
              wrong: ["a long queue at checkout", "a list of ingredients"],
              distractorNotes: ["Different word: queue", "Different word: menu/ingredients"],
              assessmentType: "vocabulary_in_context",
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Why was the total lower than Linh expected?",
              skillTag: "reading",
              explanation: "Ten-percent discount on vegetables.",
              correct: "Because of a discount on vegetables",
              wrong: ["Because she got a refund", "Because she lost her wallet"],
              distractorNotes: ["Refund not received", "Wallet not mentioned"],
              assessmentType: "inference",
              difficultyRating: 2,
            }),
          ],
        }),
        buildReadingExercise({
          slug: "reading-shopping-check",
          title: "Check: Main Idea and Order",
          instructions: "Read the article one more time. These questions need careful thinking.",
          sortOrder: 2,
          passage: shoppingPassage,
          questions: [
            buildMcq({
              questionText: "What is the main message of the article?",
              skillTag: "reading",
              explanation: "Bài kể chuyến mua sắm thông minh và tiết kiệm.",
              correct: "Careful shopping can help you save money",
              wrong: ["Supermarkets never give discounts", "Customers cannot get refunds"],
              distractorNotes: ["Opposite of text", "Opposite of text"],
              assessmentType: "main_idea",
            }),
            buildMcq({
              questionText:
                "Put the events in order: (1) Paid at checkout (2) Compared prices (3) Asked about refund policy",
              skillTag: "reading",
              explanation: "So sánh giá → hỏi refund → thanh toán.",
              correct: "2 → 3 → 1",
              wrong: ["1 → 2 → 3", "3 → 1 → 2"],
              distractorNotes: ["Payment is last", "Payment before comparing"],
              assessmentType: "sequencing",
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "reading-shopping-apply",
          title: "Apply: Match Facts from the Article",
          instructions: "Use what you read. Match each item to the correct fact.",
          exerciseType: "matching",
          sortOrder: 3,
          content: { passage: shoppingPassage },
          questions: [
            buildMatching({
              questionText: "Match each item from the article to the correct fact.",
              skillTag: "reading",
              explanation: "Mỗi mục khớp với chi tiết trong bài.",
              pairs: [
                { left: "Sugar", right: "They needed just a little" },
                { left: "Vegetables", right: "Had a ten-percent discount" },
                { left: "Receipt", right: "Needed for a refund within seven days" },
              ],
            }),
          ],
        }),
      ],
    },

    listening: {
      slug: "listening-shopping-exchanges",
      title: "Lesson 4: Shopping Conversations",
      learningObjective:
        "Understand main ideas and details in transactional shopping exchanges.",
      estimatedMinutes: 22,
      exercises: [
        buildListeningExercise({
          slug: "listening-checkout-learn",
          title: "Learn: At the Checkout",
          instructions: "Listen to the conversation. Answer the questions.",
          sortOrder: 0,
          script: checkoutScript,
          answerKey: { q1: "ingredients soup", q2: "12.40" },
          questions: [
            buildMcq({
              questionText: "What is Linh buying?",
              skillTag: "listening",
              explanation: "Order these ingredients for soup.",
              correct: "Ingredients for soup",
              wrong: ["A discount card", "A new wallet"],
              distractorNotes: ["Mentioned but not buying", "Not mentioned"],
            }),
            buildMcq({
              questionText: "How much does Linh pay?",
              skillTag: "listening",
              explanation: "That's twelve pounds forty.",
              correct: "Twelve pounds forty",
              wrong: ["Ten pounds", "Four pounds"],
              distractorNotes: ["Discount percent not total", "From market script"],
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-checkout-practice",
          title: "Practice: More from the Checkout",
          instructions: "Listen again to the same conversation. Answer the next questions.",
          sortOrder: 1,
          script: checkoutScript,
          answerKey: { q1: "tomatoes discount", q2: "receipt refund" },
          questions: [
            buildMcq({
              questionText: "Which item has a discount today?",
              skillTag: "listening",
              explanation: "There's a discount on tomatoes today.",
              correct: "Tomatoes",
              wrong: ["Milk", "Rice"],
              distractorNotes: ["Mentioned for possible refund", "Not mentioned"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Why does Linh want a receipt?",
              skillTag: "listening",
              explanation: "Might need a refund if the milk is bad.",
              correct: "In case she needs a refund",
              wrong: ["To get a bigger discount", "To order from the menu"],
              distractorNotes: ["Discount already applied", "Wrong context"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildListeningExercise({
          slug: "listening-market-check",
          title: "Check: Market Bargain",
          instructions: "Listen to a new conversation. Choose the correct answer.",
          sortOrder: 2,
          script: marketScript,
          answerKey: {
            q1: "3 mangoes 2 pounds",
            q2: "6 mangoes 4 pounds",
            q3: "cheaper than supermarket",
          },
          questions: [
            buildMcq({
              questionText: "What bargain does the vendor offer first?",
              skillTag: "listening",
              explanation: "Three mangoes for two pounds.",
              correct: "Three mangoes for two pounds",
              wrong: ["Six mangoes for four pounds", "Ten mangoes for one pound"],
              distractorNotes: ["Minh's order", "Not mentioned"],
            }),
            buildMcq({
              questionText: "How many mangoes does Minh buy and how much does he pay?",
              skillTag: "listening",
              explanation: "I'll take six... Here's four pounds.",
              correct: "Six mangoes for four pounds",
              wrong: ["Three mangoes for two pounds", "Six mangoes for two pounds"],
              distractorNotes: ["Vendor's first offer", "Wrong price"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Why does Minh buy at the market?",
              skillTag: "listening",
              explanation: "That's cheaper than the supermarket.",
              correct: "Because it is cheaper than the supermarket",
              wrong: ["Because he needs a receipt", "Because the queue is longer"],
              distractorNotes: ["Receipt not discussed", "Opposite of reason"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "listening-checkout-apply",
          title: "Apply: Match What You Heard",
          instructions: "Listen again to the checkout conversation. Match each item to the correct detail.",
          exerciseType: "matching",
          sortOrder: 3,
          content: { script: checkoutScript },
          questions: [
            buildMatching({
              questionText: "Match each item from the checkout conversation.",
              skillTag: "listening",
              explanation: "Mỗi mục khớp với chi tiết trong hội thoại.",
              pairs: [
                { left: "Linh's order", right: "Ingredients for soup" },
                { left: "Discount item", right: "Tomatoes" },
                { left: "Receipt", right: "Needed for a possible refund" },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    writing: {
      slug: "writing-shopping-message",
      title: "Lesson 5: Message About Shopping",
      learningObjective:
        "Write a short message about a shopping trip using unit vocabulary and quantifiers.",
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: "writing-shopping-learn",
          title: "Learn: Shopping Message Phrases",
          instructions:
            "Complete each gap with a word from the box: receipt, discount, bargain, checkout, ingredients.",
          exerciseType: "gap_fill",
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Hi Mum, | I found a [0] on fruit. | I paid at the [1]. | Here is the [2].",
              skillTag: "writing",
              explanation: "bargain (món hời); checkout (quầy thanh toán); receipt (hóa đơn).",
              template:
                "Hi Mum,\n\nI found a [0] on fruit. I paid at the [1]. Here is the [2].",
              correctAnswers: ["bargain", "checkout", "receipt"],
              acceptableAnswers: [
                ["bargain", "Bargain"],
                ["checkout", "Checkout"],
                ["receipt", "Receipt"],
              ],
            }),
          ],
        }),
        buildExercise({
          slug: "writing-shopping-order-practice",
          title: "Practice: Build Shopping Sentences",
          instructions: "Put the words in order to make correct sentences.",
          exerciseType: "sentence_ordering",
          sortOrder: 1,
          questions: [
            orderingQ(
              "Make a sentence: There / are / many / customers / in / the queue.",
              "writing",
              "There are many customers in the queue. — many + countable.",
              ["There", "are", "many", "customers", "in", "the queue."]
            ),
            orderingQ(
              "Make a sentence: This / shop / is / cheaper / than / the supermarket.",
              "writing",
              "This shop is cheaper than the supermarket. — comparative.",
              ["This", "shop", "is", "cheaper", "than", "the supermarket."]
            ),
          ],
        }),
        buildExercise({
          slug: "writing-shopping-check",
          title: "Check: Message About Your Shopping",
          instructions: "Write a message to a friend. Write at least 25 words.",
          exerciseType: "writing",
          sortOrder: 2,
          content: {
            taskDescription:
              "You went shopping at the supermarket yesterday. Write a short message to your friend Anna about your experience.",
            prompts: [
              "Say where you went and what you bought (ingredients or food).",
              "Mention if there was a discount or a bargain.",
              "Say something about the queue or checkout.",
              "End the message in a friendly way.",
            ],
            minWords: 25,
            successCriteria: [
              "At least 25 words",
              "Clear description of shopping trip",
              "Uses a quantifier or comparative",
              "Uses at least two unit vocabulary words",
              "Friendly opening and closing",
            ],
            modelAnswer: {
              text: "Hi Anna,\n\nI went to GreenMart yesterday and bought ingredients for dinner. There was a discount on vegetables, so it was a real bargain! Many customers were in the queue, but the checkout was fast. I kept my receipt in case I need a refund.\n\nSee you,\nLinh",
            },
            rubric: {
              grammar: {
                weight: 0.25,
                criteria:
                  "Uses quantifiers or comparatives (many, a few, cheaper) correctly.",
              },
              vocabulary: {
                weight: 0.25,
                criteria:
                  "Uses shopping words (discount, receipt, checkout, bargain, ingredient) appropriately.",
              },
              organization: {
                weight: 0.25,
                criteria: "Message has greeting, details and a friendly closing.",
              },
              taskAchievement: {
                weight: 0.25,
                criteria:
                  "Describes a shopping trip with discount or bargain; at least 25 words.",
              },
            },
            autoCheckKeywords: [
              "shopping",
              "supermarket",
              "discount",
              "bargain",
              "receipt",
              "checkout",
              "queue",
              "ingredient",
              "anna",
            ],
          },
        }),
        buildExercise({
          slug: "writing-shopping-apply",
          title: "Apply: Complete the Message Frames",
          instructions: "Complete the message frames with the correct unit words.",
          exerciseType: "gap_fill",
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText:
                "Complete: Dear Tom, | I bought [0] eggs and [1] milk. | The shop was [2] than last week. | Bye, | Mai",
              skillTag: "writing",
              explanation: "a few (eggs); a little (milk); cheaper (comparative).",
              template:
                "Dear Tom,\n\nI bought [0] eggs and [1] milk. The shop was [2] than last week.\n\nBye,\nMai",
              correctAnswers: ["a few", "a little", "cheaper"],
              acceptableAnswers: [
                ["a few", "A few"],
                ["a little", "A little"],
                ["cheaper", "Cheaper"],
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    speaking: {
      slug: "speaking-shopping-habits",
      title: "Lesson 6: Talk About Shopping",
      learningObjective:
        "Answer interview questions about food and shopping using unit vocabulary and grammar.",
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: "speaking-shopping-learn",
          title: "Learn: Choose the Best Reply",
          instructions: "Imagine an examiner asks you a question. Choose the best answer.",
          exerciseType: "multiple_choice",
          sortOrder: 0,
          questions: [
            buildMcq({
              questionText: "Examiner: Where do you usually buy food? You say:",
              skillTag: "speaking",
              explanation: "Trả lời tự nhiên về nơi mua sắm.",
              correct: "I usually buy food at the supermarket near my home.",
              wrong: ["I usually receipt food at home.", "I usually queue food."],
              distractorNotes: ["Receipt is not a verb here", "Queue is not a verb here"],
            }),
            buildMcq({
              questionText: "Examiner: Do you look for discounts? You say:",
              skillTag: "speaking",
              explanation: "Yes + discount — thói quen mua sắm.",
              correct: "Yes, I always check discount labels before I buy.",
              wrong: [
                "Yes, I always check refund labels before I buy.",
                "Yes, I discount always check.",
              ],
              distractorNotes: ["Refund is different", "Wrong word order"],
            }),
            buildMcq({
              questionText: "Examiner: How much fruit do you eat? You say:",
              skillTag: "speaking",
              explanation: "Much không dùng khẳng định → a lot of / quite a lot.",
              correct: "I eat quite a lot of fruit every week.",
              wrong: ["I eat much fruit every week.", "I eat many fruit every week."],
              distractorNotes: ["Much rare in affirmative", "Fruit often uncountable"],
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-shopping-practice",
          title: "Practice: Best Response",
          instructions: "Choose the best phrase you would say in each situation.",
          exerciseType: "multiple_choice",
          sortOrder: 1,
          questions: [
            buildMcq({
              questionText: "Examiner: Tell me about a bargain you found. You say:",
              skillTag: "speaking",
              explanation: "Bargain + giá rẻ — cấu trúc kể chuyện A2.",
              correct:
                "Last month I found a bargain — shoes were half price with a discount.",
              wrong: [
                "Last month I found a receipt — shoes were half price.",
                "Last month I found a queue — shoes were half price.",
              ],
              distractorNotes: ["Wrong noun", "Wrong noun"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Examiner: Is the market cheaper than the supermarket? You say:",
              skillTag: "speaking",
              explanation: "Comparative: cheaper than.",
              correct: "Yes, the market is usually cheaper than the supermarket.",
              wrong: [
                "Yes, the market is cheap than the supermarket.",
                "Yes, the market is more cheaper than the supermarket.",
              ],
              distractorNotes: ["Missing -er", "Double comparative"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "Examiner: What do you do at the checkout? You say:",
              skillTag: "speaking",
              explanation: "Mô tả hành động tại quầy thanh toán.",
              correct: "I pay and ask for a receipt.",
              wrong: ["I pay and ask for a menu.", "I pay and ask for an ingredient."],
              distractorNotes: ["Menu is for ordering food", "Ingredient is recipe item"],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: "speaking-shopping-interview",
          title: "Check: Shopping Interview",
          instructions:
            "Answer the examiner's questions about food and shopping. Speak for up to two minutes.",
          exerciseType: "speaking",
          sortOrder: 2,
          content: {
            prompt:
              "The examiner will ask you about where you shop, what you buy and how you save money.",
            sceneDescription:
              "A supermarket checkout with a customer holding a receipt, discount signs on shelves, and a short queue.",
            followUpQuestions: [
              "Where do you usually buy food and ingredients?",
              "Do you prefer shopping in a supermarket or at a market? Why?",
              "Have you ever asked for a refund? What happened?",
              "How many items do you usually buy when you shop?",
              "Do you think online shopping is cheaper than going to a shop?",
              "Tell me about the last bargain you found.",
            ],
            suggestedAnswers: [
              "I usually buy food at the supermarket near my house.",
              "I prefer the market because fresh fruit is often cheaper.",
              "Yes, I returned bread and got a refund with my receipt.",
              "I usually buy a few vegetables and a little meat.",
              "Sometimes online shopping is cheaper because of discounts.",
              "Last week I found a bargain on rice — it was the cheapest in the shop.",
            ],
            assessmentCriteria: {
              pronunciation:
                "Key words (receipt, discount, customer, checkout, bargain) are understandable.",
              fluency: "Responds with phrases or short sentences without long silences.",
              grammar:
                "Uses quantifiers or comparatives in at least two answers.",
              vocabulary: "Uses at least four different unit words correctly.",
            },
            maxDurationSeconds: 120,
          },
        }),
        buildExercise({
          slug: "speaking-shopping-apply",
          title: "Apply: Situational Response",
          instructions: "Choose the best thing to say in each shopping situation.",
          exerciseType: "multiple_choice",
          sortOrder: 3,
          questions: [
            buildMcq({
              questionText: "The milk you bought is bad. At the shop you say:",
              skillTag: "speaking",
              explanation: "Yêu cầu refund với receipt — tình huống thực tế.",
              correct: "Excuse me, can I have a refund? Here is my receipt.",
              wrong: [
                "Excuse me, can I have a discount? Here is my menu.",
                "Excuse me, can I have a queue? Here is my bargain.",
              ],
              distractorNotes: ["Wrong request", "Nonsense collocation"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "A friend asks if the queue is long. You say:",
              skillTag: "speaking",
              explanation: "Mô tả queue với many customers.",
              correct: "Yes, there are many customers waiting at the checkout.",
              wrong: [
                "Yes, there is much customers waiting at the checkout.",
                "Yes, there are much customer waiting at the checkout.",
              ],
              distractorNotes: ["Much with countable", "Much + singular wrong"],
              difficultyRating: 2,
            }),
            buildMcq({
              questionText: "You are ordering in a café. You say:",
              skillTag: "speaking",
              explanation: "Look at menu before order — cụm tự nhiên.",
              correct: "Can I see the menu, please? I'd like to order soup.",
              wrong: [
                "Can I see the receipt, please? I'd like to order soup.",
                "Can I see the refund, please? I'd like to order soup.",
              ],
              distractorNotes: ["Receipt after paying", "Refund wrong context"],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },
  },
};
