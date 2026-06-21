/**
 * Hand-authored gold content — Unit 3: Colours and Clothes
 * NO algorithmic generation.
 */
import { UNIT_PASSAGES, UNIT_SCRIPTS } from "../../starters-unit-passages.mjs";

const P3 = UNIT_PASSAGES[3];
const S3 = UNIT_SCRIPTS[3];

function passage(i) {
  const p = P3[i];
  return { ...p, wordCount: p.text.split(/\s+/).filter(Boolean).length };
}

function script(i) {
  return S3[i];
}

export const HAND_UNIT_03 = {
  topic: "colours-and-clothes",
  lesson0ExtraSpecs: {
    vocabulary: {
      check: {
        type: "mcq",
        label: "Colours and Clothes Quiz",
        instructions: "No hints — choose the best answer.",
        tuples: [
          ["Grass and leaves are usually _____.", "green", "blue", "pink", "Green là màu của cỏ và lá.", "Blue — màu trời/biển", "Pink — màu hồng, không phải cây", 2],
          ["You wear these on your feet.", "shoes", "shirt", "jacket", "Shoes đi trên chân.", "Shirt mặc trên thân", "Jacket là áo khoác", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Colours in Sentences",
        questionText: "Complete with colour or clothes words.",
        explanation: "red/blue cho màu; shirt/dress cho quần áo.",
        template: "My [0] shirt is nice. Her [1] is pink.",
        correctAnswers: ["red", "dress"],
      },
    },
    grammar: {
      check: {
        type: "mcq",
        label: "Describe Clothes Quiz",
        tuples: [
          ["She has _____ .", "a blue dress", "a dress blue", "blue a dress", "Màu đứng trước danh từ: a blue dress.", "Thứ tự tiếng Việt — sai", "Mạo từ sai vị trí", 2],
          ["The shoes _____ green.", "are", "is", "am", "Shoes số nhiều → are.", "is cho số ít", "am chỉ với I", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Complete Descriptions",
        explanation: "What colour is…? và is/are + màu.",
        template: "[0] colour is your hat? It [1] yellow.",
        correctAnswers: ["What", "is"],
      },
    },
    reading: {
      practice: {
        type: "reading",
        label: "Anna's Wardrobe",
        passage: passage(0),
        tuples: [
          ["What does Anna put on?", "A green dress", "Blue trousers", "A red hat", "She puts on a green dress.", "Chỉ thấy trong tủ", "Không có trong bài", 1],
          ["What colour are Anna's shoes?", "Yellow", "Pink", "Blue", "Her shoes are yellow.", "Màu mũ", "Màu quần", 1],
        ],
      },
      check: {
        type: "reading",
        label: "Anna Gets Dressed Details",
        passage: passage(0),
        tuples: [
          ["What colour is Anna's hat?", "Pink", "Green", "Red", "Her hat is pink.", "Màu váy", "Màu áo trong tủ", 2],
          ["Who asks about the dress colour?", "Anna's mother", "Anna", "Anna's teacher", "What colour is your dress? asks her mother.", "Anna trả lời", "Không có giáo viên", 2],
        ],
      },
      apply: {
        type: "mcq",
        label: "Anna's Clothes Facts",
        tuples: [
          ["Anna keeps a red shirt and blue trousers in her _____.", "cupboard", "shop", "classroom", "She opens her cupboard.", "Tom đi mua đồ", "Không có trong bài", 2],
        ],
      },
    },
    listening: {
      practice: {
        type: "listening",
        label: "Listen for Clothes",
        script: script(0),
        answerKey: ["red", "blue", "green", "yellow"],
        tuples: [
          ["What does Lily put on first?", "Red shirt", "Blue trousers", "Yellow dress", "Put on your red shirt.", "Quần hỏi sau", "Váy không mặc ngay", 1],
          ["What colour are Lily's shoes?", "Green", "Blue", "Red", "Your shoes are green.", "Màu quần", "Màu áo", 1],
        ],
      },
      check: {
        type: "listening",
        label: "Getting Dressed Check",
        script: script(0),
        answerKey: ["red", "blue", "green", "yellow"],
        tuples: [
          ["What colour is Lily's dress?", "Yellow", "Green", "Blue", "Your dress is yellow.", "Màu giày", "Màu quần", 2],
          ["Who gives Lily instructions?", "Mother", "Lily", "Teacher", "Mother nói: Put on your red shirt.", "Lily hỏi", "Không có giáo viên", 2],
        ],
      },
      apply: {
        type: "matching",
        label: "Match Lily's Clothes",
        questionText: "Match what you heard.",
        explanation: "Ghép đồ và màu từ hội thoại.",
        pairs: [
          { left: "Shirt", right: "red" },
          { left: "Trousers", right: "blue" },
          { left: "Dress", right: "yellow" },
        ],
      },
    },
    writing: {
      learn: {
        type: "mcq",
        label: "Choose Correct Writing",
        tuples: [
          ["Best phrase for clothes:", "a red shirt", "a shirt red", "red a shirt", "Màu trước danh từ: a red shirt.", "Thứ tự tiếng Việt", "Mạo từ sai chỗ", 1],
          ["Best colour sentence:", "My shoes are blue.", "My shoes blue are.", "Blue are my shoes.", "My + danh từ + are + màu.", "Sai trật tự", "Không tự nhiên", 1],
        ],
      },
      practice: {
        type: "gap_fill",
        label: "Complete Writing Frames",
        explanation: "Khung câu mô tả quần áo và màu.",
        template: "I have a [0] hat. My dress [1] green.",
        correctAnswers: ["yellow", "is"],
      },
      check: {
        type: "writing",
        label: "Write About Your Clothes",
        taskDescription: "Write about one clothes item and its colour.",
        prompts: ["Write one clothes word (shirt, dress, shoes…).", "Write its colour in a short sentence."],
        minWords: 4,
        modelAnswers: ["My shirt is red.", "blue shoes"],
        rubric: ["Uses a clothes word", "Uses a colour word correctly"],
        successCriteria: ["Clothes word", "Colour in sentence"],
        autoCheckKeywords: ["shirt", "dress", "shoes", "red", "blue", "green", "yellow", "is", "are"],
      },
      apply: {
        type: "mcq",
        label: "Best Written Sentence",
        tuples: [
          ["Which sentence is best?", "Her dress is pink.", "Pink dress her is.", "Her pink is dress.", "Her + danh từ + is + màu.", "Sai trật tự", "Không thành câu", 2],
        ],
      },
    },
    speaking: {
      learn: {
        type: "mcq",
        label: "Choose What to Say",
        tuples: [
          ["Someone asks: What colour is your shirt? You say:", "It is blue.", "Blue it.", "Shirt blue.", "It is + màu — câu trả lời tự nhiên.", "Sai cấu trúc", "Quá ngắn, không rõ", 1],
          ["You describe your shoes. You say:", "My shoes are green.", "Green shoes my.", "Shoes green are my.", "My shoes are + màu.", "Sai trật tự", "Không thành câu", 1],
        ],
      },
      practice: {
        type: "mcq",
        label: "Ask About Colour",
        tuples: [
          ["You want to know a hat's colour. You ask:", "What colour is your hat?", "What is colour hat?", "Colour what is hat?", "What colour is your hat? — chuẩn.", "Sai trật tự từ", "Không thành câu hỏi", 1],
        ],
      },
      check: {
        type: "speaking",
        label: "Say Your Clothes and Colours",
        prompt: "Say what you are wearing and two colours.",
        pictureDescription: "Children in colourful clothes: red shirt, blue trousers, green dress, yellow shoes.",
        followUpQuestions: ["What colour is your shirt?", "What are you wearing today?", "What colour are your shoes?"],
        suggestedAnswers: ["My shirt is red.", "A blue dress and black shoes.", "They are yellow."],
        assessmentCriteria: ["Uses colour words clearly", "Uses clothes vocabulary", "Short clear phrases"],
      },
      apply: {
        type: "mcq",
        label: "What to Say",
        tuples: [
          ["Friend asks about your jacket. Best reply:", "My jacket is green.", "Green jacket.", "Jacket my green.", "Câu đầy đủ: My jacket is + màu.", "Quá ngắn", "Sai trật tự", 2],
        ],
      },
    },
  },
  lessons: {
    vocabulary: [
      null,
      {
        slug: "vocab-colour-words",
        title: "Lesson 2: Basic Colours",
        learningObjective: "Recognise and use red, blue, green, yellow and pink in context.",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "Colour Words",
          tuples: [
            ["The sun looks _____ in the sky.", "yellow", "green", "pink", "Yellow là màu của mặt trời.", "Green — màu cây", "Pink — màu hồng", 1],
            ["The sea is often _____.", "blue", "red", "yellow", "Blue thường là màu biển/trời.", "Red — màu nóng", "Yellow — màu sáng", 1],
            ["Apples can be _____.", "red", "blue", "green", "Red thường là màu táo.", "Blue — không phải táo", "Green — ít dùng cho táo ở Starters", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Colours",
          questionText: "Match each colour to its example.",
          explanation: "Ghép màu với hình ảnh quen thuộc.",
          pairs: [
            { left: "red", right: "apples and roses" },
            { left: "blue", right: "the sky and sea" },
            { left: "green", right: "grass and leaves" },
            { left: "yellow", right: "the sun" },
            { left: "pink", right: "Anna's hat in the story" },
          ],
        },
        check: {
          type: "mcq",
          label: "Colour Challenge",
          tuples: [
            ["Which colour is NOT in Anna's outfit in the story?", "black", "yellow", "pink", "Anna wears yellow shoes and a pink hat — không có black.", "Có trong bài", "Có trong bài", 2],
            ["Bananas are often _____.", "yellow", "blue", "pink", "Yellow phù hợp với chuối.", "Blue — không phải chuối", "Pink — không phải chuối", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Colours in Context",
          explanation: "Điền màu phù hợp ngữ cảnh.",
          template: "The sky is [0]. The grass is [1].",
          correctAnswers: ["blue", "green"],
        },
      },
      {
        slug: "vocab-clothes-items",
        title: "Lesson 3: Clothes Words",
        learningObjective: "Name common clothes items and match them to body parts.",
        estimatedMinutes: 18,
        learn: {
          type: "mcq",
          label: "Clothes Vocabulary",
          tuples: [
            ["You wear this on your upper body.", "shirt", "shoes", "trousers", "Shirt mặc trên thân.", "Shoes — chân", "Trousers — chân", 1],
            ["Girls often wear a _____ to a party.", "dress", "hat", "jacket", "Dress là váy/đầm.", "Hat — đội đầu", "Jacket — áo khoác ngoài", 1],
            ["When it is cold, you put on a _____.", "jacket", "dress", "shoes", "Jacket giữ ấm khi trời lạnh.", "Dress — không phải áo khoác", "Shoes — không giữ ấm thân", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Clothes and Body",
          explanation: "Ghép đồ mặc với vị trí trên cơ thể.",
          pairs: [
            { left: "shirt", right: "upper body" },
            { left: "trousers", right: "legs" },
            { left: "shoes", right: "feet" },
            { left: "hat", right: "head" },
          ],
        },
        check: {
          type: "mcq",
          label: "Clothes Quiz",
          tuples: [
            ["Tom's father buys _____ at the shop.", "trousers", "dress", "hat", "His father buys black trousers.", "Tom thích shirt", "Không mua mũ", 2],
            ["Which word means 'màu sắc'?", "colour", "jacket", "shirt", "Colour = màu sắc.", "Jacket — áo khoác", "Shirt — áo sơ mi", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Sentence Order",
          questionText: "Make a sentence about clothes.",
          explanation: "I wear + màu + đồ.",
          words: ["I", "wear", "a", "blue", "shirt."],
        },
      },
    ],
    grammar: [
      null,
      {
        slug: "grammar-adjective-noun",
        title: "Lesson 2: Adjective + Noun",
        learningObjective: "Use colour adjectives before nouns: a red shirt, green shoes.",
        estimatedMinutes: 15,
        learn: {
          type: "mcq",
          label: "Word Order",
          tuples: [
            ["Tom likes _____ .", "the yellow shirt", "the shirt yellow", "yellow the shirt", "Màu đứng trước danh từ.", "Thứ tự tiếng Việt", "Mạo từ sai", 1],
            ["Anna has _____ .", "a pink hat", "a hat pink", "pink a hat", "A pink hat — màu trước noun.", "Sai thứ tự", "Sai vị trí a", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Complete Phrases",
          explanation: "Điền màu trước danh từ.",
          template: "a [0] jacket | [1] shoes",
          correctAnswers: ["blue", "green"],
        },
        check: {
          type: "mcq",
          label: "Adjective Order Check",
          tuples: [
            ["Which phrase is correct?", "a red dress", "a dress red", "red a dress", "A red dress — chuẩn Starters.", "Thứ tự Việt", "Mạo từ lệch", 2],
            ["Mai wears _____ at school.", "a white shirt", "a shirt white", "white a shirt", "A white shirt — màu trước shirt.", "Sai thứ tự", "Sai mạo từ", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Order the Phrase",
          explanation: "a + màu + danh từ.",
          words: ["a", "yellow", "hat"],
        },
      },
      {
        slug: "grammar-be-and-questions",
        title: "Lesson 3: Is/Are and What Colour",
        learningObjective: "Describe colours with is/are and ask What colour is…?",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "Verb Be with Colours",
          tuples: [
            ["The dress _____ green.", "is", "are", "am", "Dress số ít → is.", "Are cho số nhiều", "Am chỉ với I", 1],
            ["The shoes _____ black.", "are", "is", "am", "Shoes số nhiều → are.", "Is cho số ít", "Am chỉ với I", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Is or Are",
          explanation: "Chọn is/are theo chủ ngữ.",
          template: "Her hat [0] pink. Their shoes [1] yellow.",
          correctAnswers: ["is", "are"],
        },
        check: {
          type: "mcq",
          label: "What Colour Questions",
          tuples: [
            ["_____ colour is your shirt?", "What", "Who", "Where", "What colour is…? — hỏi màu.", "Who hỏi người", "Where hỏi nơi", 2],
            ["Their shoes _____ black at school.", "are", "is", "am", "Shoes → are black.", "Is cho số ít", "Am với I", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose the Question",
          tuples: [
            ["You want to know about a jacket's colour. Ask:", "What colour is your jacket?", "What is jacket colour?", "Where colour jacket?", "What colour is your jacket? — đúng.", "Sai trật tự", "Where hỏi nơi", 2],
          ],
        },
      },
    ],
    reading: [
      null,
      {
        slug: "reading-clothes-shop",
        title: "Lesson 2: The Clothes Shop",
        learningObjective: "Understand colours and shopping details in a shop text.",
        learn: {
          type: "reading",
          label: "Read the Shop Visit",
          passage: passage(1),
          tuples: [
            ["Who goes to the shop with Tom?", "His father", "Anna", "The teacher", "Tom and his father go to a shop.", "Anna ở bài khác", "Không có giáo viên", 1],
            ["What does Tom like?", "The yellow shirt", "The green shoes", "Black trousers", "I like the yellow shirt, says Tom.", "Giày xanh", "Quần đen của bố", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Shop Colours",
          passage: passage(1),
          tuples: [
            ["What colour is the jacket Tom sees?", "Blue", "Red", "Yellow", "Tom sees a blue jacket.", "Màu mũ", "Màu shirt Tom thích", 1],
            ["What colour are the shoes in the shop?", "Green", "Black", "Blue", "The shoes are green.", "Quần bố mua", "Mũ đỏ", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Shop Reading Check",
          passage: passage(1),
          tuples: [
            ["What does Tom's father buy?", "Black trousers", "A yellow shirt", "A blue jacket", "His father buys black trousers.", "Tom thích shirt", "Tom chỉ nhìn jacket", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Shop Summary",
          tuples: [
            ["Tom sees a red _____ in the shop.", "hat", "dress", "skirt", "Tom sees a blue jacket and a red hat.", "Không có dress", "Không có skirt", 2],
          ],
        },
      },
      {
        slug: "reading-school-uniform",
        title: "Lesson 3: School Uniform Day",
        learningObjective: "Read about school clothes and colours in a uniform text.",
        learn: {
          type: "reading",
          label: "Read About Uniforms",
          passage: passage(2),
          tuples: [
            ["What is special at school today?", "Uniform day", "Tom's birthday", "A clothes shop visit", "Today is special at school. All children wear smart clothes.", "Không phải sinh nhật", "Không đi shop", 1],
            ["What does Mai wear?", "A white shirt and blue skirt", "Grey trousers", "A green dress", "Mai has a white shirt and a blue skirt.", "Quần của Nam", "Váy Anna", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Uniform Colours",
          passage: passage(2),
          tuples: [
            ["What does Nam wear?", "Grey trousers", "A blue skirt", "A white shirt", "Nam wears grey trousers.", "Mai mặc skirt", "Shirt của Mai", 1],
            ["What colour are the children's shoes?", "Black", "Blue", "White", "Their shoes are black.", "Màu shirt", "Màu skirt", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Uniform Reading Check",
          passage: passage(2),
          tuples: [
            ["Who says You look nice?", "The teacher", "Mai", "Nam", "You look nice! says the teacher.", "Mai không nói", "Nam không nói", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete from Text",
          explanation: "Điền từ trong bài đọc.",
          template: "Mai's skirt is [0]. The shoes are [1].",
          correctAnswers: ["blue", "black"],
        },
      },
    ],
    listening: [
      null,
      {
        slug: "listening-colour-instructions",
        title: "Lesson 2: Listen and Colour",
        learningObjective: "Follow listen-and-colour instructions with clothes words.",
        learn: {
          type: "listening",
          label: "Art Class Commands",
          script: script(1),
          answerKey: ["red", "blue", "green", "yellow"],
          tuples: [
            ["What colour is the hat?", "Red", "Blue", "Green", "Colour the hat red.", "Màu shirt", "Màu dress", 1],
            ["What does the teacher colour second?", "The shirt", "The hat", "The shoes", "Colour the shirt blue — sau mũ.", "Mũ tô trước", "Giày tô cuối", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "More Colour Commands",
          script: script(1),
          answerKey: ["red", "blue", "green", "yellow"],
          tuples: [
            ["What colour is the dress?", "Green", "Red", "Yellow", "Colour the dress green.", "Màu mũ", "Màu giày", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Listen and Colour Check",
          script: script(1),
          answerKey: ["red", "blue", "green", "yellow"],
          tuples: [
            ["What colour are the shoes?", "Yellow", "Green", "Blue", "Colour the shoes yellow.", "Màu dress", "Màu shirt", 2],
          ],
        },
        apply: {
          type: "matching",
          label: "Match Coloured Items",
          explanation: "Ghép đồ và màu từ lệnh tô màu.",
          pairs: [
            { left: "Hat", right: "red" },
            { left: "Shirt", right: "blue" },
            { left: "Dress", right: "green" },
          ],
        },
      },
      {
        slug: "listening-clothes-shop",
        title: "Lesson 3: At the Clothes Shop",
        learningObjective: "Understand shop dialogue about clothes and colours.",
        learn: {
          type: "listening",
          label: "Shop Dialogue",
          script: script(2),
          answerKey: ["pink", "blue", "black"],
          tuples: [
            ["What does Tom like?", "The pink dress", "The blue jacket", "Black shoes", "I like the pink dress.", "Jacket shopkeeper gợi ý", "Màu giày hỏi sau", 1],
            ["What does the shopkeeper suggest?", "The blue jacket", "The pink dress", "Yellow shoes", "The blue jacket is nice too.", "Tom thích dress", "Không có yellow", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Shoe Colour",
          script: script(2),
          answerKey: ["pink", "blue", "black"],
          tuples: [
            ["What colour are the shoes?", "Black", "Blue", "Pink", "They are black.", "Màu jacket", "Màu dress", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Shop Dialogue Check",
          script: script(2),
          answerKey: ["pink", "blue", "black"],
          tuples: [
            ["Who asks about the shoes?", "Tom", "Shopkeeper", "Anna", "What colour are the shoes? — Tom hỏi.", "Shopkeeper trả lời", "Anna không có", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose What You Heard",
          tuples: [
            ["The shopkeeper says the jacket is _____.", "blue", "pink", "black", "The blue jacket is nice too.", "Màu dress Tom thích", "Màu giày", 2],
          ],
        },
      },
    ],
    writing: [
      null,
      {
        slug: "writing-describe-outfit",
        title: "Lesson 2: Write About an Outfit",
        learningObjective: "Write short phrases with adjective + noun and is/are + colour.",
        learn: {
          type: "mcq",
          label: "Choose Correct Writing",
          tuples: [
            ["Best phrase:", "a green dress", "a dress green", "green a dress", "Màu trước danh từ.", "Thứ tự Việt", "Mạo từ sai", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write Colour Phrases",
          explanation: "Viết cụm màu + đồ.",
          template: "a [0] hat | [1] shoes are black",
          correctAnswers: ["red", "My"],
        },
        check: {
          type: "writing",
          label: "Write Your Clothes",
          taskDescription: "Write two short phrases about clothes and colours.",
          prompts: ["Write: My ___ is ___. (one clothes item + colour)", "Write: I wear a ___ ___. (colour + clothes)"],
          minWords: 5,
          modelAnswers: ["My shirt is blue.", "I wear a red hat."],
          rubric: ["Adjective before noun or is + colour", "Recognisable spelling"],
          successCriteria: ["One full sentence", "Colour + clothes word"],
          autoCheckKeywords: ["shirt", "dress", "shoes", "hat", "red", "blue", "green", "is", "wear"],
        },
        apply: {
          type: "mcq",
          label: "Fix the Sentence",
          tuples: [
            ["Which needs fixing?", "My shoes is green.", "My shoes are green.", "Green are my shoes.", "Shoes → are, không phải is.", "Câu đúng", "Sai trật tự", 2],
          ],
        },
      },
      {
        slug: "writing-shop-sentences",
        title: "Lesson 3: Write Shop Sentences",
        learningObjective: "Write simple sentences about clothes seen in a shop.",
        learn: {
          type: "mcq",
          label: "Writing from the Shop",
          tuples: [
            ["Tom likes the yellow _____.", "shirt", "trousers", "colour", "Yellow shirt trong bài shop.", "Quần bố mua", "Colour không phải đồ", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Best Shop Sentence",
          tuples: [
            ["Which is correct?", "The shoes are green.", "The shoes is green.", "Green the shoes are.", "Shoes are + màu.", "Is cho số ít", "Sai trật tự", 1],
          ],
        },
        check: {
          type: "writing",
          label: "Write About Shop Clothes",
          taskDescription: "Write about two clothes items and their colours.",
          prompts: ["Write one clothes word from the shop story.", "Write a sentence: The ___ is ___. or The ___ are ___."],
          minWords: 4,
          modelAnswers: ["jacket", "The jacket is blue."],
          rubric: ["Uses unit clothes words", "Correct is/are"],
          successCriteria: ["Clothes word", "Colour sentence"],
          autoCheckKeywords: ["jacket", "shirt", "shoes", "trousers", "blue", "green", "yellow", "is", "are"],
        },
        apply: {
          type: "ordering",
          label: "Order the Sentence",
          explanation: "I like + the + màu + danh từ.",
          words: ["I", "like", "the", "yellow", "shirt."],
        },
      },
    ],
    speaking: [
      null,
      {
        slug: "speaking-describe-clothes",
        title: "Lesson 2: Describe Your Clothes",
        learningObjective: "Say clothes items and colours in short answers.",
        learn: {
          type: "mcq",
          label: "Choose a Reply",
          tuples: [
            ["What colour is your shirt? Best answer:", "It is red.", "Red shirt it.", "Shirt red is.", "It is + màu.", "Sai trật tự", "Không thành câu", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Ask About Colour",
          tuples: [
            ["You want to know about shoes. Ask:", "What colour are your shoes?", "What colour is your shoes?", "What are colour shoes?", "Shoes số nhiều → are.", "Is cho số ít", "Sai cấu trúc", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say What You Wear",
          prompt: "Say three clothes items you wear and their colours.",
          pictureDescription: "Child in bedroom with shirt, trousers, shoes and hat on a chair.",
          followUpQuestions: ["What colour is your shirt?", "What are you wearing?", "What colour are your shoes?"],
          suggestedAnswers: ["Blue.", "A red shirt and blue trousers.", "They are black."],
          assessmentCriteria: ["Colour words clear", "Clothes vocabulary", "Uses is/are"],
        },
        apply: {
          type: "mcq",
          label: "Polite Reply",
          tuples: [
            ["Teacher asks about your dress. Best reply:", "My dress is green.", "Green.", "Dress my green.", "Câu đầy đủ lịch sự.", "Quá ngắn", "Sai trật tự", 2],
          ],
        },
      },
      {
        slug: "speaking-shop-talk",
        title: "Lesson 3: Talk at the Shop",
        learningObjective: "Ask and answer about clothes colours in a shop role-play.",
        learn: {
          type: "mcq",
          label: "Say at the Shop",
          tuples: [
            ["Tom says he likes the pink _____.", "dress", "jacket", "trousers", "I like the pink dress — script shop.", "Jacket màu xanh", "Quần màu đen", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Ask the Shopkeeper",
          tuples: [
            ["You want shoe colour. Ask:", "What colour are the shoes?", "What colour is the shoes?", "Where are shoes colour?", "Shoes → are.", "Is cho số ít", "Where hỏi nơi", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Shop Colours",
          prompt: "Pretend you are at a clothes shop. Say what you like and ask one colour question.",
          pictureDescription: "Clothes shop with dresses, jackets, shirts and shoes on display.",
          followUpQuestions: ["What do you like?", "What colour are the shoes?", "What colour is the jacket?"],
          suggestedAnswers: ["I like the pink dress.", "They are black.", "It is blue."],
          assessmentCriteria: ["Uses I like…", "Asks what colour", "Clear colour words"],
        },
        apply: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["Shopkeeper says shoes are black. You repeat:", "They are black.", "It is black.", "Black shoes they.", "Shoes số nhiều → They are.", "It cho số ít", "Sai trật tự", 2],
          ],
        },
      },
    ],
  },
};
