/**
 * Hand-authored gold content — Unit 5: Toys and Weather
 * NO algorithmic generation.
 */
import { UNIT_PASSAGES, UNIT_SCRIPTS } from "../../starters-unit-passages.mjs";

const P5 = UNIT_PASSAGES[5];
const S5 = UNIT_SCRIPTS[5];

function passage(i) {
  const p = P5[i];
  return { ...p, wordCount: p.text.split(/\s+/).filter(Boolean).length };
}

function script(i) {
  return S5[i];
}

export const HAND_UNIT_05 = {
  topic: "toys-and-weather",
  lesson0ExtraSpecs: {
    vocabulary: {
      check: {
        type: "mcq",
        label: "Toys and Weather Quiz",
        instructions: "No hints — choose the best answer.",
        tuples: [
          ["You fly this on a windy day.", "kite", "doll", "puzzle", "Kite (diều) bay trên trời khi có gió.", "Búp bê cầm tay", "Xếp hình trên bàn", 2],
          ["The sky is grey and water falls. It is _____.", "rainy", "sunny", "teddy", "Rainy — trời mưa, bầu trời xám.", "Nắng, không mưa", "Đồ chơi, không phải thời tiết", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Toys and Weather Words",
        questionText: "Complete with toy or weather words.",
        explanation: "teddy = gấu bông; sunny = nắng.",
        template: "I play with my [0]. Today is [1].",
        correctAnswers: ["teddy", "sunny"],
      },
    },
    grammar: {
      check: {
        type: "mcq",
        label: "Weather and Plurals Quiz",
        tuples: [
          ["Look outside! _____ windy today.", "It's", "They", "These", "It's = It is — mô tả thời tiết.", "They không dùng với weather", "These chỉ đồ vật số nhiều", 2],
          ["I have two _____.", "kites", "kite", "kiting", "Sau two cần danh từ số nhiều: kites.", "Số ít sau two — sai", "Không phải từ tiếng Anh", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Complete Weather Sentences",
        explanation: "It's + tính từ thời tiết; these + danh từ số nhiều.",
        template: "[0] rainy. [1] are my toys.",
        correctAnswers: ["It's", "These"],
      },
    },
    reading: {
      practice: {
        type: "reading",
        label: "More Rainy Day Details",
        passage: passage(0),
        tuples: [
          ["What toys does the writer play with?", "Teddy and doll", "Kite and ball", "Robot and balloon", "I play with my teddy and my doll.", "Anh trai chơi diều", "Đồ chơi ngoài cửa hàng", 1],
          ["Where do they stay?", "Inside", "At the park", "At the shop", "We stay inside.", "Ra ngoài công viên", "Đi mua đồ", 1],
        ],
      },
      check: {
        type: "reading",
        label: "Rainy Day Details",
        passage: passage(0),
        tuples: [
          ["What is the weather like today?", "Rainy and windy", "Sunny and hot", "Snowy and cold", "It is rainy and windy.", "Trời nắng — ngày mai", "Không có tuyết trong bài", 2],
          ["What do they do inside?", "A puzzle", "Fly a kite", "Buy toys", "But now we do a puzzle.", "Diều khi nắng", "Mua đồ — bài khác", 2],
        ],
      },
      apply: {
        type: "mcq",
        label: "Rainy Day Facts",
        tuples: [
          ["What will tomorrow be like?", "Sunny", "Rainy", "Windy", "Tomorrow will be sunny.", "Hôm nay mưa", "Hôm nay gió", 2],
        ],
      },
    },
    listening: {
      practice: {
        type: "listening",
        label: "Listen for Weather",
        script: script(0),
        answerKey: ["rainy", "windy", "clouds", "toys"],
        tuples: [
          ["Is it sunny today?", "No", "Yes", "Maybe", "Mother: No. It is rainy and windy.", "Mẹ nói không nắng", "Không trả lời maybe", 1],
          ["What does Mother say to do?", "Stay inside and play", "Go to the park", "Buy a kite", "Stay inside. Play with your toys.", "Ra ngoài", "Mua đồ", 1],
        ],
      },
      check: {
        type: "listening",
        label: "What's the Weather?",
        script: script(0),
        answerKey: ["rainy", "windy", "clouds", "toys"],
        tuples: [
          ["What is the weather like?", "Rainy and windy", "Sunny and warm", "Snowy", "It is rainy and windy.", "Lin hỏi nắng nhưng không", "Không có tuyết", 2],
          ["Who says Look at the clouds?", "Lin", "Mother", "Tom", "Lin: Look at the clouds!", "Mẹ không nói câu này", "Tom không có", 2],
        ],
      },
      apply: {
        type: "matching",
        label: "Match Weather Dialogue",
        questionText: "Match what you heard.",
        explanation: "Ghép câu hỏi và câu trả lời về thời tiết.",
        pairs: [
          { left: "Is it sunny?", right: "No — rainy" },
          { left: "Look at...", right: "the clouds" },
          { left: "Stay inside", right: "play with toys" },
        ],
      },
    },
    writing: {
      learn: {
        type: "mcq",
        label: "Choose Correct Writing",
        tuples: [
          ["Best sentence about weather:", "It is sunny today.", "Sunny it is today.", "It sunny is.", "It is + tính từ thời tiết.", "Sai trật tự", "Thiếu is", 1],
          ["Best sentence about toys:", "I have a teddy.", "Teddy I have a.", "Have teddy I.", "I have + a + đồ chơi.", "Sai trật tự", "Không thành câu", 1],
        ],
      },
      practice: {
        type: "gap_fill",
        label: "Complete Writing Frames",
        explanation: "Khung câu cho thời tiết và đồ chơi.",
        template: "It is [0]. I play with my [1].",
        correctAnswers: ["rainy", "doll"],
      },
      check: {
        type: "writing",
        label: "Write About Weather and Toys",
        taskDescription: "Write about the weather and a toy you like.",
        prompts: ["Write a weather sentence with sunny or rainy.", "Write a sentence about a toy."],
        minWords: 4,
        modelAnswers: ["It is sunny.", "I like my kite."],
        rubric: ["Uses weather word", "Uses toy word correctly"],
        successCriteria: ["Weather sentence", "Toy sentence"],
        autoCheckKeywords: ["sunny", "rainy", "windy", "kite", "doll", "teddy", "robot"],
      },
      apply: {
        type: "mcq",
        label: "Best Written Sentence",
        tuples: [
          ["Which sentence is best?", "These are my toys.", "These is my toys.", "Those is my toy.", "These are + danh từ số nhiều.", "These + is — sai", "Those + is + số ít — sai", 2],
        ],
      },
    },
    speaking: {
      learn: {
        type: "mcq",
        label: "Choose What to Say",
        tuples: [
          ["Someone asks: What's the weather like? You say:", "It's rainy.", "Rainy it's.", "It rainy.", "It's + tính từ thời tiết.", "Sai trật tự", "Thiếu is", 1],
          ["You want to show toys near you. You say:", "These are my toys.", "Those are my toys.", "This are my toys.", "These = gần, số nhiều.", "Those = xa", "This + are — sai", 1],
        ],
      },
      practice: {
        type: "mcq",
        label: "Describe the Weather",
        tuples: [
          ["The sun is shining. You say:", "It's sunny.", "It's rainy.", "It's windy.", "Nắng → It's sunny.", "Mưa", "Gió mạnh", 1],
        ],
      },
      check: {
        type: "speaking",
        label: "Say Weather and a Toy",
        prompt: "Say what the weather is like and name a toy you like.",
        sceneDescription: "Window showing rain and clouds; teddy and doll on a table.",
        followUpQuestions: ["What's the weather like?", "What toy do you like?"],
        suggestedAnswers: ["It's rainy.", "I like my teddy."],
        assessmentCriteria: ["Uses It's + weather word", "Names a toy clearly", "Short clear phrases"],
      },
      apply: {
        type: "mcq",
        label: "What to Say",
        tuples: [
          ["You see kites far away. You say:", "Those are kites.", "These are kites.", "That are kites.", "Those = xa, số nhiều.", "These = gần", "That + are — sai", 2],
        ],
      },
    },
  },
  lessons: {
    vocabulary: [
      null,
      {
        slug: "vocab-toy-names",
        title: "Lesson 2: Toy Names",
        learningObjective: "Name common toys: doll, teddy, robot, puzzle, balloon and kite.",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "Toy Words",
          tuples: [
            ["A soft bear you hug is a _____.", "teddy", "robot", "kite", "Teddy (gấu bông) — đồ chơi mềm.", "Robot — máy", "Kite — diều", 1],
            ["You do this on a table — a _____.", "puzzle", "balloon", "cloud", "Puzzle — xếp hình trên bàn.", "Bóng bay", "Mây trên trời", 1],
            ["A red _____ floats in the air.", "balloon", "doll", "wind", "Balloon (bóng bay) bay lên.", "Búp bê", "Gió — không phải đồ chơi", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Toys",
          questionText: "Match each toy to its description.",
          explanation: "Ghép tên đồ chơi với mô tả.",
          pairs: [
            { left: "doll", right: "a toy girl or baby" },
            { left: "robot", right: "a toy that looks like a machine" },
            { left: "kite", right: "flies in the sky" },
            { left: "teddy", right: "soft bear toy" },
          ],
        },
        check: {
          type: "mcq",
          label: "Toy Challenge",
          tuples: [
            ["Which toy can fly in the sky?", "kite", "doll", "puzzle", "Kite bay trên trời.", "Búp bê cầm tay", "Xếp hình trên bàn", 2],
            ["Lin buys a small _____ at the shop.", "puzzle", "cloud", "wind", "They buy a small puzzle too.", "Mây — không mua được", "Gió — không phải đồ chơi", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Write Toy Words",
          explanation: "Điền tên đồ chơi phù hợp.",
          template: "I have a [0] and a red [1].",
          correctAnswers: ["robot", "balloon"],
        },
      },
      {
        slug: "vocab-weather-words",
        title: "Lesson 3: Weather Words",
        learningObjective: "Use sunny, rainy, windy, cloud and wind in simple sentences.",
        estimatedMinutes: 18,
        learn: {
          type: "mcq",
          label: "Weather Vocabulary",
          tuples: [
            ["The sun is out. It is _____.", "sunny", "rainy", "puzzle", "Sunny — trời nắng.", "Mưa", "Đồ chơi", 1],
            ["Water falls from the sky. It is _____.", "rainy", "sunny", "teddy", "Rainy — trời mưa.", "Nắng", "Gấu bông", 1],
            ["The _____ is strong — good for kites!", "wind", "doll", "robot", "Wind (gió) mạnh giúp diều bay.", "Búp bê", "Robot", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Weather Meanings",
          explanation: "Ghép từ thời tiết với nghĩa.",
          pairs: [
            { left: "sunny", right: "the sun shines" },
            { left: "rainy", right: "water falls from clouds" },
            { left: "windy", right: "lots of wind" },
            { left: "cloud", right: "white or grey in the sky" },
          ],
        },
        check: {
          type: "mcq",
          label: "Weather Quiz",
          tuples: [
            ["These _____ are white in the sky.", "clouds", "kites", "puzzles", "Clouds (mây) trên trời.", "Diều — đồ chơi", "Xếp hình", 2],
            ["It is _____ — we can play outside!", "sunny", "rainy", "windy", "Sunny — ra ngoài chơi.", "Mưa — ở trong", "Gió mạnh — cẩn thận", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Weather Sentence Order",
          questionText: "Make a sentence about weather.",
          explanation: "It is + tính từ thời tiết.",
          words: ["It", "is", "windy", "today."],
        },
      },
    ],
    grammar: [
      null,
      {
        slug: "grammar-its-weather",
        title: "Lesson 2: It's + Weather",
        learningObjective: "Use It's (It is) plus weather adjectives correctly.",
        learn: {
          type: "mcq",
          label: "It's + Adjective",
          tuples: [
            ["_____ sunny today!", "It's", "They", "These", "It's = It is — mô tả thời tiết.", "They không dùng với trời", "These cho đồ vật", 1],
            ["_____ rainy. Stay inside.", "It's", "It", "Its", "It's + rainy — câu đúng.", "Thiếu is", "Its = của nó", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Fill Weather Sentences",
          explanation: "It's + sunny/rainy/windy.",
          template: "[0] sunny. [1] windy.",
          correctAnswers: ["It's", "It's"],
        },
        check: {
          type: "mcq",
          label: "Weather Grammar Check",
          tuples: [
            ["Which sentence is correct?", "It's windy today.", "It windy is today.", "Windy it's.", "It's + windy — chuẩn.", "Sai trật tự", "Sai trật tự", 2],
            ["The sky is grey. _____ rainy.", "It's", "Its", "They", "It's rainy — mô tả thời tiết.", "Its = sở hữu", "They không dùng", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Order the Sentence",
          explanation: "It's + tính từ thời tiết.",
          words: ["It's", "sunny", "today!"],
        },
      },
      {
        slug: "grammar-plurals-these-those",
        title: "Lesson 3: Plurals and These/Those",
        learningObjective: "Form plurals with -s and use these/those for nearby and distant things.",
        learn: {
          type: "mcq",
          label: "Plurals and Demonstratives",
          tuples: [
            ["Two _____ — not one!", "kites", "kite", "kiting", "Sau two: kites (số nhiều).", "Số ít — sai", "Không phải từ", 1],
            ["_____ are my toys. (near me)", "These", "Those", "This", "These = gần, số nhiều.", "Those = xa", "This = số ít", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Complete Plurals",
          explanation: "Thêm -s sau số lớn hơn một.",
          template: "I have two [0]. Three [1] are red.",
          correctAnswers: ["balloons", "balloons"],
        },
        check: {
          type: "mcq",
          label: "These and Those Check",
          tuples: [
            ["Kites in the sky, far away. _____ are kites.", "Those", "These", "This", "Those = xa, số nhiều.", "These = gần", "This = số ít", 2],
            ["Three _____ on the shelf.", "robots", "robot", "roboting", "Three robots — thêm -s.", "Số ít sau three", "Không phải từ", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose the Correct Form",
          tuples: [
            ["_____ are my balloons. (in my hand)", "These", "Those", "That", "These — gần tay.", "Those — xa", "That — số ít", 2],
          ],
        },
      },
    ],
    reading: [
      null,
      {
        slug: "reading-toy-shop",
        title: "Lesson 2: Toy Shop Visit",
        learningObjective: "Read for toy names and shopping details in a short text.",
        learn: {
          type: "reading",
          label: "Read the Toy Shop",
          passage: passage(1),
          tuples: [
            ["What colour is the robot?", "Red", "Blue", "Green", "She sees a red robot.", "Balloon màu xanh", "Teddy không màu đỏ", 1],
            ["What does Lin ask for?", "The teddy", "The robot", "The kite", "Can I have the teddy?", "Robot — chỉ nhìn", "Kite — không có", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Find Toy Details",
          passage: passage(1),
          tuples: [
            ["What colour is the balloon?", "Blue", "Red", "Yellow", "A blue balloon.", "Robot đỏ", "Không vàng", 1],
            ["Who goes to the shop with Lin?", "Her mother", "Her father", "Tom", "Lin goes with her mother.", "Bố — không có", "Tom — bài khác", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Toy Shop Check",
          passage: passage(1),
          tuples: [
            ["Does Lin's mother say yes to the teddy?", "Yes", "No", "Maybe", "Her mother says yes.", "Mẹ từ chối", "Không rõ", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Best Summary",
          tuples: [
            ["This text is mainly about _____.", "buying toys at a shop", "weather at the park", "food for lunch", "Bài về mua đồ chơi.", "Chủ đề thời tiết", "Chủ đề đồ ăn", 2],
          ],
        },
      },
      {
        slug: "reading-park-in-sun",
        title: "Lesson 3: Park in the Sun",
        learningObjective: "Understand sunny weather and outdoor toys in a park text.",
        learn: {
          type: "reading",
          label: "Read About the Park",
          passage: passage(2),
          tuples: [
            ["What is the weather like?", "Sunny", "Rainy", "Windy only", "It is sunny today!", "Mưa — bài khác", "Chỉ gió — còn nắng", 1],
            ["What does Tom have?", "A ball and a kite", "A doll only", "A robot", "Tom has a ball and a kite.", "Anna có búp bê", "Robot — không có", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "More Park Details",
          passage: passage(2),
          tuples: [
            ["What does Anna bring?", "Her doll", "Her kite", "Her puzzle", "Anna brings her doll.", "Diều của Tom", "Xếp hình — trong nhà", 1],
            ["What time do they play until?", "Four o'clock", "Three o'clock", "Twelve o'clock", "We play until four o'clock.", "Ba giờ", "Mười hai giờ", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Park Check",
          passage: passage(2),
          tuples: [
            ["Why does the kite fly high?", "The wind is strong", "It is rainy", "They are inside", "The wind is strong — the kite flies high!", "Mưa — không bay diều", "Trong nhà — sai", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete from Text",
          explanation: "Điền từ trong bài đọc.",
          template: "It is [0] today. The [1] flies high!",
          correctAnswers: ["sunny", "kite"],
        },
      },
    ],
    listening: [
      null,
      {
        slug: "listening-toys-in-park",
        title: "Lesson 2: Toys in the Park",
        learningObjective: "Identify toy words in a sunny park dialogue.",
        learn: {
          type: "listening",
          label: "Park Toys Dialogue",
          script: script(1),
          answerKey: ["kite", "ball", "doll", "teddy", "kite", "wind"],
          tuples: [
            ["What does Tom have?", "A kite and a ball", "A doll and teddy", "A robot", "I have a kite and a ball.", "Anna's toys", "Robot — không có", 1],
            ["What does Anna like?", "Her doll and teddy", "Her kite", "Her puzzle", "I like my doll and teddy.", "Diều của Tom", "Xếp hình", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Toys",
          script: script(1),
          answerKey: ["kite", "ball", "doll", "teddy", "kite", "wind"],
          tuples: [
            ["What do they want to do?", "Fly the kite", "Do a puzzle", "Stay inside", "Let's fly the kite!", "Xếp hình — trong nhà", "Ở trong — sai", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Park Dialogue Check",
          script: script(1),
          answerKey: ["kite", "ball", "doll", "teddy", "kite", "wind"],
          tuples: [
            ["Who says The wind is strong?", "Anna", "Tom", "Mother", "Anna: OK! The wind is strong!", "Tom đề nghị bay diều", "Mẹ không có", 2],
          ],
        },
        apply: {
          type: "matching",
          label: "Match Park Dialogue",
          explanation: "Ghép người nói và đồ chơi.",
          pairs: [
            { left: "Tom", right: "kite and ball" },
            { left: "Anna", right: "doll and teddy" },
            { left: "Activity", right: "fly the kite" },
          ],
        },
      },
      {
        slug: "listening-indoor-play",
        title: "Lesson 3: Indoor Play",
        learningObjective: "Extract weather and toy words from a rainy-day dialogue.",
        learn: {
          type: "listening",
          label: "Indoor Toys",
          script: script(2),
          answerKey: ["rainy", "puzzle", "robot", "balloon"],
          tuples: [
            ["Why can't they go out?", "It is rainy", "It is sunny", "It is windy only", "It is rainy. We can't go out.", "Nắng — ra ngoài được", "Chỉ gió — vẫn mưa", 1],
            ["What does Nam suggest?", "Do a puzzle", "Fly a kite", "Go to the shop", "Let's do a puzzle!", "Bay diều — ngoài trời", "Mua đồ — không có", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Find the Toys",
          script: script(2),
          answerKey: ["rainy", "puzzle", "robot", "balloon"],
          tuples: [
            ["What toy does Nam mention?", "Balloon", "Kite", "Doll", "Here. And my balloon!", "Diều — ngoài trời", "Búp bê — Anna", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Indoor Play Check",
          script: script(2),
          answerKey: ["rainy", "puzzle", "robot", "balloon"],
          tuples: [
            ["Who asks Where is my robot?", "Mai", "Nam", "Lin", "Mai: Where is my robot?", "Nam có robot", "Lin — bài khác", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose What You Heard",
          tuples: [
            ["They play inside because it is _____.", "rainy", "sunny", "windy only", "It is rainy. We can't go out.", "Nắng — ra ngoài", "Chỉ gió", 2],
          ],
        },
      },
    ],
    writing: [
      null,
      {
        slug: "writing-weather-sentences",
        title: "Lesson 2: Write About Weather",
        learningObjective: "Write short sentences with It's and weather adjectives.",
        learn: {
          type: "mcq",
          label: "Choose Correct Writing",
          tuples: [
            ["Best weather sentence:", "It's windy today.", "Windy it is.", "It windy.", "It's + windy — chuẩn.", "Sai trật tự", "Thiếu is", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write Weather Words",
          explanation: "Viết tính từ thời tiết trong câu.",
          template: "It is [0]. The [1] is strong.",
          correctAnswers: ["rainy", "wind"],
        },
        check: {
          type: "writing",
          label: "Write Weather and Toys",
          taskDescription: "Write about today's weather and a toy.",
          prompts: ["Write: It's ___. (sunny/rainy/windy)", "Write a sentence with a toy word."],
          minWords: 5,
          modelAnswers: ["It's sunny.", "I have a kite."],
          rubric: ["Uses It's + weather", "Toy word spelled correctly"],
          successCriteria: ["Weather sentence", "Toy sentence"],
          autoCheckKeywords: ["It's", "sunny", "rainy", "windy", "kite", "doll", "teddy"],
        },
        apply: {
          type: "mcq",
          label: "Fix the Sentence",
          tuples: [
            ["Which needs fixing?", "It sunny is.", "It's sunny.", "It's sun.", "It sunny is — sai trật tự.", "Câu đúng", "Sun không phải tính từ", 2],
          ],
        },
      },
      {
        slug: "writing-toy-sentences",
        title: "Lesson 3: Write About Toys",
        learningObjective: "Write plurals and these/those with toy vocabulary.",
        learn: {
          type: "mcq",
          label: "Toys in Writing",
          tuples: [
            ["Best sentence about toys near you:", "These are my toys.", "Those is my toys.", "This are toys.", "These are + số nhiều.", "Those + is — sai", "This + are — sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Best Toy Sentence",
          tuples: [
            ["Which is correct?", "I have two kites.", "I have two kite.", "I has two kites.", "Two kites — số nhiều.", "Số ít — sai", "I has — sai", 1],
          ],
        },
        check: {
          type: "writing",
          label: "Write Toys and Weather",
          taskDescription: "Write about toys and the weather.",
          prompts: ["Write a sentence with two toys.", "Write a weather sentence."],
          minWords: 4,
          modelAnswers: ["I have a doll and a teddy.", "It's rainy."],
          rubric: ["Two toy words or plural", "Weather adjective"],
          successCriteria: ["Toy sentence", "Weather sentence"],
          autoCheckKeywords: ["doll", "teddy", "kite", "robot", "sunny", "rainy", "windy"],
        },
        apply: {
          type: "ordering",
          label: "Order Toy Sentence",
          explanation: "These are + my toys.",
          words: ["These", "are", "my", "toys."],
        },
      },
    ],
    speaking: [
      null,
      {
        slug: "speaking-describe-weather",
        title: "Lesson 2: Describe the Weather",
        learningObjective: "Say weather sentences aloud with It's + adjective.",
        learn: {
          type: "mcq",
          label: "Choose a Reply",
          tuples: [
            ["Friend asks: Is it sunny? (No — it rains.) You say:", "No. It's rainy.", "Yes. It's sunny.", "It's kite.", "Mưa → It's rainy.", "Nắng — sai", "Kite — không phải thời tiết", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Say the Weather",
          tuples: [
            ["Clouds and rain. You say:", "It's rainy.", "It's sunny.", "It's doll.", "Mưa → It's rainy.", "Nắng — sai", "Doll — đồ chơi", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Weather and Stay Inside",
          prompt: "Say what the weather is like and what you do when it rains.",
          sceneDescription: "Rain on the window; children with a puzzle indoors.",
          followUpQuestions: ["What's the weather like?", "What do you play with inside?"],
          suggestedAnswers: ["It's rainy.", "I play with my teddy."],
          assessmentCriteria: ["Uses It's + weather", "Names indoor toy", "Clear pronunciation"],
        },
        apply: {
          type: "mcq",
          label: "Polite Reply",
          tuples: [
            ["Teacher asks about weather. Best reply:", "It's windy today.", "Windy it.", "It wind.", "Câu đầy đủ: It's windy.", "Sai trật tự", "Wind — danh từ", 2],
          ],
        },
      },
      {
        slug: "speaking-toys-aloud",
        title: "Lesson 3: Talk About Toys",
        learningObjective: "Name toys and use these/those when speaking.",
        learn: {
          type: "mcq",
          label: "Say the Toy",
          tuples: [
            ["You hold a teddy. You say:", "This is my teddy.", "These is my teddy.", "Those is teddy.", "This is + số ít gần.", "These + is — sai", "Those + is — sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Point to Toys",
          tuples: [
            ["Toys on the table near you. You say:", "These are my toys.", "Those are my toys.", "This are toys.", "These — gần, số nhiều.", "Those — xa", "This + are — sai", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Toys and Weather",
          prompt: "Name two toys you like and say if it is sunny or rainy.",
          sceneDescription: "Sunny park with kite, ball and doll.",
          followUpQuestions: ["What toys do you like?", "Is it sunny or rainy?"],
          suggestedAnswers: ["I like my kite and doll.", "It's sunny."],
          assessmentCriteria: ["Two toy names", "Weather word", "Intelligible phrases"],
        },
        apply: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["Kites far in the sky. You say:", "Those are kites.", "These are kites.", "That are kites.", "Those — xa, số nhiều.", "These — gần", "That + are — sai", 2],
          ],
        },
      },
    ],
  },
};
