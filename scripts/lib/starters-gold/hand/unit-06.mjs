/**
 * Hand-authored gold content — Unit 6: Food and Drink
 * NO algorithmic generation.
 */
import { UNIT_PASSAGES, UNIT_SCRIPTS } from "../../starters-unit-passages.mjs";

const P6 = UNIT_PASSAGES[6];
const S6 = UNIT_SCRIPTS[6];

function passage(i) {
  const p = P6[i];
  return { ...p, wordCount: p.text.split(/\s+/).filter(Boolean).length };
}

function script(i) {
  return S6[i];
}

export const HAND_UNIT_06 = {
  topic: "food-and-drink",
  lesson0ExtraSpecs: {
    vocabulary: {
      check: {
        type: "mcq",
        label: "Food and Drink Quiz",
        instructions: "No hints — choose the best answer.",
        tuples: [
          ["A yellow fruit that monkeys like is a _____.", "banana", "rice", "water", "Banana (chuối) — trái cây màu vàng.", "Cơm — không phải trái cây", "Nước uống", 2],
          ["White drink from cows is _____.", "milk", "juice", "bread", "Milk (sữa) — đồ uống màu trắng.", "Nước ép", "Bánh mì — đồ ăn", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Food Words in Sentences",
        questionText: "Complete with food or drink words.",
        explanation: "rice = cơm; water = nước uống.",
        template: "I eat [0] for lunch. I drink [1].",
        correctAnswers: ["rice", "water"],
      },
    },
    grammar: {
      check: {
        type: "mcq",
        label: "Like, Eat and Drink Quiz",
        tuples: [
          ["I _____ apples. They are yummy!", "like", "likes", "liking", "I like — chủ ngữ I không thêm -s.", "Likes — he/she/it", "Không dùng -ing", 2],
          ["Anna _____ like fish.", "doesn't", "don't", "not", "Anna doesn't like — ngôi thứ ba số ít.", "Don't — I/you/we/they", "Not một mình — sai", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Complete Food Sentences",
        explanation: "like/eat cho đồ ăn; drink cho đồ uống.",
        template: "I [0] chicken. She [1] milk.",
        correctAnswers: ["like", "drinks"],
      },
    },
    reading: {
      practice: {
        type: "reading",
        label: "More Lunch Details",
        passage: passage(0),
        tuples: [
          ["What does the writer eat?", "Rice and chicken", "Egg and bread", "Fish and apple", "I have rice and chicken.", "Bạn ăn trứng bánh mì", "Anna không thích cá", 1],
          ["What does the friend drink?", "Milk", "Water", "Juice", "She drinks milk.", "Tác giả uống nước", "Nước cam — bài khác", 1],
        ],
      },
      check: {
        type: "reading",
        label: "Lunch at School Details",
        passage: passage(0),
        tuples: [
          ["What time is lunch?", "Twelve o'clock", "Eight o'clock", "Four o'clock", "It is twelve o'clock.", "Giờ vào học", "Giờ tan học", 2],
          ["What doesn't Anna like?", "Fish", "Bananas", "Rice", "Anna doesn't like fish.", "Tom thích chuối", "Cơm — tác giả ăn", 2],
        ],
      },
      apply: {
        type: "mcq",
        label: "Lunch Facts",
        tuples: [
          ["How do they feel after lunch?", "Not hungry", "Very hungry", "Sleepy only", "We are not hungry now!", "Vẫn đói — sai", "Chỉ buồn ngủ — không có", 2],
        ],
      },
    },
    listening: {
      practice: {
        type: "listening",
        label: "Listen for Lunch",
        script: script(0),
        answerKey: ["hungry", "rice", "chicken", "milk"],
        tuples: [
          ["Is Hoa hungry?", "Yes", "No", "Maybe", "Hoa: Yes! I want rice and chicken.", "Cô hỏi đói — Hoa nói yes", "Không trả lời maybe", 1],
          ["What does Hoa want to eat?", "Rice and chicken", "Egg and bread", "Fish", "I want rice and chicken.", "Trứng bánh mì — bài đọc", "Cá — Anna không thích", 1],
        ],
      },
      check: {
        type: "listening",
        label: "What's for Lunch?",
        script: script(0),
        answerKey: ["hungry", "rice", "chicken", "milk"],
        tuples: [
          ["What does Hoa drink every day?", "Milk", "Water", "Juice", "I drink milk every day.", "Nước — tác giả bài đọc", "Nước cam — bài khác", 2],
          ["Who asks Are you hungry?", "Teacher", "Hoa", "Tom", "Teacher: Are you hungry, Hoa?", "Hoa trả lời", "Tom — không có", 2],
        ],
      },
      apply: {
        type: "matching",
        label: "Match Lunch Dialogue",
        questionText: "Match what you heard.",
        explanation: "Ghép câu hỏi và câu trả lời về bữa trưa.",
        pairs: [
          { left: "Hungry?", right: "Yes — rice and chicken" },
          { left: "Like milk?", right: "Yes, every day" },
          { left: "Speaker", right: "Hoa" },
        ],
      },
    },
    writing: {
      learn: {
        type: "mcq",
        label: "Choose Correct Writing",
        tuples: [
          ["Best sentence about food:", "I like apples.", "Apples I like.", "I likes apples.", "I like + đồ ăn.", "Sai trật tự", "I likes — sai", 1],
          ["Best sentence about drink:", "I drink water.", "Water I drink.", "I drink chicken.", "I drink + đồ uống.", "Sai trật tự", "Chicken — ăn, không uống", 1],
        ],
      },
      practice: {
        type: "gap_fill",
        label: "Complete Writing Frames",
        explanation: "Khung câu cho like/eat/drink.",
        template: "I [0] bananas. I [1] milk.",
        correctAnswers: ["like", "drink"],
      },
      check: {
        type: "writing",
        label: "Write About Food You Like",
        taskDescription: "Write about food and drink you like.",
        prompts: ["Write a food you like.", "Write a drink you like."],
        minWords: 4,
        modelAnswers: ["I like rice.", "I drink milk."],
        rubric: ["Uses like/eat for food", "Uses drink for liquid"],
        successCriteria: ["Food sentence", "Drink sentence"],
        autoCheckKeywords: ["like", "eat", "drink", "rice", "milk", "apple", "water"],
      },
      apply: {
        type: "mcq",
        label: "Best Written Sentence",
        tuples: [
          ["Which sentence is best?", "I don't like fish.", "I not like fish.", "I don't likes fish.", "I don't like — phủ định đúng.", "Not một mình — sai", "Don't + likes — sai", 2],
        ],
      },
    },
    speaking: {
      learn: {
        type: "mcq",
        label: "Choose What to Say",
        tuples: [
          ["Someone asks: Do you like milk? You say:", "Yes, I do.", "Yes, I like.", "Yes, I likes.", "Yes, I do — trả lời ngắn.", "Thiếu do", "Likes — sai", 1],
          ["You don't like eggs. You say:", "I don't like eggs.", "I not like eggs.", "I don't likes eggs.", "I don't like — phủ định.", "Not — sai", "Don't likes — sai", 1],
        ],
      },
      practice: {
        type: "mcq",
        label: "Talk About Food",
        tuples: [
          ["You are hungry. You say:", "I am hungry.", "I hungry am.", "Hungry I.", "I am hungry — chuẩn.", "Sai trật tự", "Không thành câu", 1],
        ],
      },
      check: {
        type: "speaking",
        label: "Say What You Like to Eat",
        prompt: "Say what you like to eat and drink for lunch.",
        sceneDescription: "School lunch tray with rice, chicken, fruit and milk.",
        followUpQuestions: ["What do you like to eat?", "What do you drink?"],
        suggestedAnswers: ["I like rice and chicken.", "I drink milk."],
        assessmentCriteria: ["Uses like/eat/drink", "Names food and drink", "Short clear phrases"],
      },
      apply: {
        type: "mcq",
        label: "What to Say",
        tuples: [
          ["Someone offers fish. You don't like it. You say:", "I don't like fish.", "I like not fish.", "I don't likes fish.", "I don't like — lịch sự từ chối.", "Sai cấu trúc", "Don't likes — sai", 2],
        ],
      },
    },
  },
  lessons: {
    vocabulary: [
      null,
      {
        slug: "vocab-fruit-and-drinks",
        title: "Lesson 2: Fruit and Drinks",
        learningObjective: "Name fruit and drinks: apple, banana, orange, milk, water and juice.",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "Fruit and Drink Words",
          tuples: [
            ["A round red or green fruit is an _____.", "apple", "rice", "chicken", "Apple (táo) — trái cây tròn.", "Cơm", "Thịt gà", 1],
            ["Orange _____ comes from oranges.", "juice", "bread", "egg", "Orange juice — nước ép cam.", "Bánh mì", "Trứng", 1],
            ["We drink _____ when we are thirsty.", "water", "rice", "bread", "Water (nước) — uống khi khát.", "Cơm — ăn", "Bánh mì — ăn", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Food and Drinks",
          questionText: "Match each word to its type.",
          explanation: "Phân biệt trái cây và đồ uống.",
          pairs: [
            { left: "banana", right: "yellow fruit" },
            { left: "orange", right: "round orange fruit" },
            { left: "milk", right: "white drink" },
            { left: "juice", right: "drink from fruit" },
          ],
        },
        check: {
          type: "mcq",
          label: "Fruit and Drink Challenge",
          tuples: [
            ["Which is a drink, not food?", "water", "banana", "apple", "Water — uống, không ăn.", "Chuối — trái cây", "Táo — trái cây", 2],
            ["Mother buys orange _____.", "juice", "rice", "egg", "Orange juice — trong bài mua sắm.", "Cơm", "Trứng", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Write Fruit and Drinks",
          explanation: "Điền trái cây hoặc đồ uống.",
          template: "I eat an [0]. I drink [1].",
          correctAnswers: ["apple", "milk"],
        },
      },
      {
        slug: "vocab-meals-and-food",
        title: "Lesson 3: Meals and Main Food",
        learningObjective: "Use egg, rice, chicken, bread, fish and hungry in context.",
        estimatedMinutes: 18,
        learn: {
          type: "mcq",
          label: "Meal Words",
          tuples: [
            ["We eat _____ for lunch at school.", "rice", "water", "juice", "Rice (cơm) — bữa trưa.", "Nước — uống", "Nước ép — uống", 1],
            ["When your stomach is empty, you are _____.", "hungry", "rainy", "windy", "Hungry (đói) — bụng trống.", "Mưa — thời tiết", "Gió — thời tiết", 1],
            ["_____ comes from chickens — we eat it.", "Chicken", "Milk", "Water", "Chicken (thịt gà) — đồ ăn.", "Sữa — uống", "Nước — uống", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Meal Vocabulary",
          explanation: "Ghép từ đồ ăn với bữa ăn.",
          pairs: [
            { left: "egg", right: "breakfast food" },
            { left: "bread", right: "baked food" },
            { left: "fish", right: "from the sea" },
            { left: "lunch", right: "meal at midday" },
          ],
        },
        check: {
          type: "mcq",
          label: "Meals Quiz",
          tuples: [
            ["We don't eat _____ for breakfast in the text.", "chicken", "egg", "bread", "We don't eat chicken for breakfast.", "Trứng — ăn sáng", "Bánh mì — ăn sáng", 2],
            ["Anna eats an _____ at lunch.", "apple", "fish", "cake", "She eats an apple.", "Cá — không thích", "Bánh — mua sắm", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Food Sentence Order",
          questionText: "Make a sentence about being hungry.",
          explanation: "I am + hungry.",
          words: ["I", "am", "hungry", "now."],
        },
      },
    ],
    grammar: [
      null,
      {
        slug: "grammar-like-eat-drink",
        title: "Lesson 2: Like, Eat and Drink",
        learningObjective: "Use like, eat and drink correctly with food and drink nouns.",
        learn: {
          type: "mcq",
          label: "Like, Eat, Drink",
          tuples: [
            ["I _____ rice for lunch.", "eat", "drink", "eats", "Eat — ăn đồ rắn như cơm.", "Drink — uống", "Eats — chỉ he/she/it", 1],
            ["She _____ milk every day.", "drinks", "eat", "drink", "She drinks — ngôi thứ ba thêm -s.", "Eat — ăn", "Drink — thiếu -s", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Fill Food Verbs",
          explanation: "like = thích; eat = ăn; drink = uống.",
          template: "I [0] apples. He [1] water.",
          correctAnswers: ["like", "drinks"],
        },
        check: {
          type: "mcq",
          label: "Food Verb Check",
          tuples: [
            ["Which sentence is correct?", "Tom likes bananas.", "Tom like bananas.", "Tom likes banana.", "Tom likes — he/she + -s.", "Like — thiếu -s", "Banana số ít — Tom thích nhiều", 2],
            ["You _____ chicken. It is food.", "eat", "drink", "drinks", "Eat chicken — ăn thức ăn.", "Drink — uống", "Drinks — he/she", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Order the Sentence",
          explanation: "I like + đồ ăn.",
          words: ["I", "like", "orange", "juice."],
        },
      },
      {
        slug: "grammar-dont-like",
        title: "Lesson 3: I Don't Like",
        learningObjective: "Say what you do not like using don't like and doesn't like.",
        learn: {
          type: "mcq",
          label: "Negative with Like",
          tuples: [
            ["I _____ like fish.", "don't", "doesn't", "not", "I don't like — phủ định với I.", "Doesn't — he/she", "Not một mình — sai", 1],
            ["She _____ like eggs.", "doesn't", "don't", "not", "She doesn't like — ngôi thứ ba.", "Don't — I/you", "Not — sai", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Complete Negatives",
          explanation: "don't với I/you/we/they; doesn't với he/she/it.",
          template: "I [0] like fish. Anna [1] like fish.",
          correctAnswers: ["don't", "doesn't"],
        },
        check: {
          type: "mcq",
          label: "Don't Like Check",
          tuples: [
            ["Which sentence is correct?", "I don't like fish.", "I not like fish.", "I don't likes fish.", "I don't like — chuẩn.", "Not — sai", "Don't likes — sai", 2],
            ["Tom _____ like eggs.", "doesn't", "don't", "not", "Tom doesn't — he + doesn't.", "Don't — I/you", "Not — sai", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose the Negative",
          tuples: [
            ["We _____ like fish for breakfast.", "don't", "doesn't", "not", "We don't like — we + don't.", "Doesn't — he/she", "Not — sai", 2],
          ],
        },
      },
    ],
    reading: [
      null,
      {
        slug: "reading-shopping-food",
        title: "Lesson 2: Shopping for Food",
        learningObjective: "Read for fruit, drinks and shopping details in a short text.",
        learn: {
          type: "reading",
          label: "Read the Shop Trip",
          passage: passage(1),
          tuples: [
            ["What fruit do they buy?", "Apples, oranges and bananas", "Rice and chicken", "Eggs only", "We buy apples, oranges and bananas.", "Thịt gà — bữa tối", "Chỉ trứng", 1],
            ["What juice does the child want?", "Orange juice", "Apple juice", "Milk", "Yes! Orange juice!", "Nước táo — không có", "Sữa — mua thêm", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Find Shopping Details",
          passage: passage(1),
          tuples: [
            ["What does Father like for dinner?", "Chicken", "Fish", "Cake", "Father likes chicken for dinner.", "Cá — Anna không thích", "Bánh — mua nhưng không phải bữa tối", 1],
            ["What sweet food do they buy?", "A small cake", "An apple", "Bread", "We also buy a small cake.", "Táo — trái cây", "Bánh mì — không có", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Shopping Check",
          passage: passage(1),
          tuples: [
            ["Besides fruit, what drinks do they get?", "Milk and water", "Juice only", "Nothing", "We get milk and water too.", "Chỉ nước cam", "Không mua gì — sai", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Best Summary",
          tuples: [
            ["This text is mainly about _____.", "buying food at a shop", "playing with toys", "weather at the park", "Bài về mua thực phẩm.", "Đồ chơi — unit khác", "Thời tiết — unit khác", 2],
          ],
        },
      },
      {
        slug: "reading-breakfast-time",
        title: "Lesson 3: Breakfast Time",
        learningObjective: "Understand breakfast foods and don't like in a family text.",
        learn: {
          type: "reading",
          label: "Read About Breakfast",
          passage: passage(2),
          tuples: [
            ["What does the writer eat for breakfast?", "An egg and bread", "Rice and chicken", "Fish", "I eat an egg and bread.", "Cơm gà — bữa trưa", "Cá — không ăn sáng", 1],
            ["What does the sister drink?", "Milk", "Water", "Juice", "My sister drinks milk.", "Bố uống nước", "Nước cam — bài khác", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "More Breakfast Details",
          passage: passage(2),
          tuples: [
            ["What does the brother eat?", "A banana", "An egg", "Fish", "My brother eats a banana.", "Trứng — tác giả", "Cá — không sáng", 1],
            ["What does Mother tell them to eat?", "An apple", "Chicken", "Rice", "Eat your apple!", "Gà — không sáng", "Cơm — bữa trưa", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Breakfast Check",
          passage: passage(2),
          tuples: [
            ["What don't they eat for breakfast?", "Chicken", "Egg", "Bread", "We don't eat chicken for breakfast.", "Trứng — ăn sáng", "Bánh mì — ăn sáng", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete from Text",
          explanation: "Điền từ trong bài đọc.",
          template: "For breakfast I eat an [0] and [1].",
          correctAnswers: ["egg", "bread"],
        },
      },
    ],
    listening: [
      null,
      {
        slug: "listening-fruit-shop",
        title: "Lesson 2: At the Fruit Shop",
        learningObjective: "Identify fruit and drink orders in a market dialogue.",
        learn: {
          type: "listening",
          label: "Fruit Shop Dialogue",
          script: script(1),
          answerKey: ["apples", "bananas", "oranges", "water"],
          tuples: [
            ["How many apples does Mother want?", "Three", "Two", "One", "Three apples and two bananas, please.", "Hai quả chuối", "Một quả", 1],
            ["Does Mother want oranges?", "Yes", "No", "Maybe", "Seller: Do you want oranges too? Mother: Yes.", "Từ chối — sai", "Không rõ", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Orders",
          script: script(1),
          answerKey: ["apples", "bananas", "oranges", "water"],
          tuples: [
            ["What else does Mother buy?", "Water", "Milk", "Cake", "Yes. And some water.", "Sữa — bài mua sắm", "Bánh — không có", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Fruit Shop Check",
          script: script(1),
          answerKey: ["apples", "bananas", "oranges", "water"],
          tuples: [
            ["Who says Here you are?", "Seller", "Mother", "Tom", "Seller: Here you are!", "Mẹ không nói", "Tom — không có", 2],
          ],
        },
        apply: {
          type: "matching",
          label: "Match Market Dialogue",
          explanation: "Ghép người mua và thức ăn.",
          pairs: [
            { left: "Apples", right: "three" },
            { left: "Bananas", right: "two" },
            { left: "Also bought", right: "oranges and water" },
          ],
        },
      },
      {
        slug: "listening-breakfast-chat",
        title: "Lesson 3: Breakfast Chat",
        learningObjective: "Understand like, don't like and breakfast foods in dialogue.",
        learn: {
          type: "listening",
          label: "Breakfast Dialogue",
          script: script(2),
          answerKey: ["eggs", "bread", "juice", "apple"],
          tuples: [
            ["What doesn't Tom like?", "Eggs", "Bread", "Apples", "I don't like eggs.", "Bố hỏi bánh mì — Tom thích", "Táo — bố bảo ăn", 1],
            ["What drink does Tom want?", "Orange juice", "Milk", "Water", "Yes! And orange juice.", "Sữa — chị uống", "Nước — bố uống", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Likes",
          script: script(2),
          answerKey: ["eggs", "bread", "juice", "apple"],
          tuples: [
            ["What does Father ask Tom to eat too?", "An apple", "An egg", "Bread", "OK. Eat your apple too.", "Trứng — Tom không thích", "Bánh mì — đã thích", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Breakfast Chat Check",
          script: script(2),
          answerKey: ["eggs", "bread", "juice", "apple"],
          tuples: [
            ["Who starts the conversation?", "Tom", "Father", "Mother", "Tom: I don't like eggs.", "Bố hỏi sau", "Mẹ — không có", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose What You Heard",
          tuples: [
            ["Tom likes _____ and orange juice.", "bread", "eggs", "fish", "Do you like bread? Yes! And orange juice.", "Trứng — không thích", "Cá — không có", 2],
          ],
        },
      },
    ],
    writing: [
      null,
      {
        slug: "writing-food-likes",
        title: "Lesson 2: Write About Food You Like",
        learningObjective: "Write short sentences with like, eat and drink.",
        learn: {
          type: "mcq",
          label: "Choose Correct Writing",
          tuples: [
            ["Best sentence about liking food:", "I like rice.", "Rice I like.", "I likes rice.", "I like + đồ ăn.", "Sai trật tự", "I likes — sai", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write Food Sentences",
          explanation: "Viết like/eat/drink trong câu.",
          template: "I [0] chicken. I [1] water.",
          correctAnswers: ["eat", "drink"],
        },
        check: {
          type: "writing",
          label: "Write Lunch Sentences",
          taskDescription: "Write what you eat and drink for lunch.",
          prompts: ["Write a food you eat for lunch.", "Write a drink you have."],
          minWords: 5,
          modelAnswers: ["I eat rice.", "I drink milk."],
          rubric: ["Uses eat/drink correctly", "Food and drink words spelled well"],
          successCriteria: ["Food sentence", "Drink sentence"],
          autoCheckKeywords: ["eat", "drink", "like", "rice", "milk", "chicken", "water"],
        },
        apply: {
          type: "mcq",
          label: "Fix the Sentence",
          tuples: [
            ["Which needs fixing?", "She drink milk.", "She drinks milk.", "She drinks milks.", "She drink — thiếu -s.", "Câu đúng", "Milks — sai", 2],
          ],
        },
      },
      {
        slug: "writing-dont-like",
        title: "Lesson 3: Write Don't Like",
        learningObjective: "Write negative sentences about food preferences.",
        learn: {
          type: "mcq",
          label: "Don't Like in Writing",
          tuples: [
            ["Best negative sentence:", "I don't like fish.", "I not like fish.", "I don't likes fish.", "I don't like — phủ định đúng.", "Not — sai", "Don't likes — sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Best Negative Sentence",
          tuples: [
            ["Which is correct?", "Anna doesn't like fish.", "Anna don't like fish.", "Anna not like fish.", "Anna doesn't — she + doesn't.", "Don't — I/you", "Not — sai", 1],
          ],
        },
        check: {
          type: "writing",
          label: "Write Likes and Dislikes",
          taskDescription: "Write one food you like and one you don't like.",
          prompts: ["Write: I like ___.", "Write: I don't like ___."],
          minWords: 4,
          modelAnswers: ["I like apples.", "I don't like fish."],
          rubric: ["Uses like correctly", "Uses don't like correctly"],
          successCriteria: ["Like sentence", "Don't like sentence"],
          autoCheckKeywords: ["like", "don't", "fish", "apple", "rice", "egg"],
        },
        apply: {
          type: "ordering",
          label: "Order Negative Sentence",
          explanation: "I don't like + đồ ăn.",
          words: ["I", "don't", "like", "fish."],
        },
      },
    ],
    speaking: [
      null,
      {
        slug: "speaking-food-likes",
        title: "Lesson 2: Say What You Like",
        learningObjective: "Say what you like to eat and drink aloud.",
        learn: {
          type: "mcq",
          label: "Choose a Reply",
          tuples: [
            ["Friend asks: Do you like bananas? You say:", "Yes, I do.", "Yes, I likes.", "Yes, like I.", "Yes, I do — trả lời ngắn.", "Likes — sai", "Sai trật tự", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Ask About Food",
          tuples: [
            ["You want to know if someone likes milk. You ask:", "Do you like milk?", "You like milk?", "Like you milk?", "Do you like — câu hỏi chuẩn.", "Thiếu Do", "Sai trật tự", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Lunch Preferences",
          prompt: "Say what you eat and drink for lunch.",
          sceneDescription: "School canteen with rice, chicken, fruit and milk.",
          followUpQuestions: ["What do you eat for lunch?", "What do you drink?"],
          suggestedAnswers: ["I eat rice and chicken.", "I drink water."],
          assessmentCriteria: ["Uses eat/drink", "Names food clearly", "Short phrases"],
        },
        apply: {
          type: "mcq",
          label: "Polite Reply",
          tuples: [
            ["Teacher asks what you like. Best reply:", "I like apples and milk.", "Apples and milk I like.", "I likes apples.", "Câu đầy đủ tự nhiên.", "Sai trật tự", "I likes — sai", 2],
          ],
        },
      },
      {
        slug: "speaking-dont-like",
        title: "Lesson 3: Say What You Don't Like",
        learningObjective: "Say don't like clearly when talking about food.",
        learn: {
          type: "mcq",
          label: "Say Don't Like",
          tuples: [
            ["You don't like fish. You say:", "I don't like fish.", "I not like fish.", "I don't likes fish.", "I don't like — phủ định.", "Not — sai", "Don't likes — sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Respond at Breakfast",
          tuples: [
            ["Father offers eggs. You don't want them. You say:", "I don't like eggs.", "I like not eggs.", "Eggs don't I like.", "I don't like eggs — từ chối lịch sự.", "Sai cấu trúc", "Sai trật tự", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Likes and Dislikes",
          prompt: "Say one food you like and one food you don't like.",
          sceneDescription: "Breakfast table with egg, bread, apple and milk.",
          followUpQuestions: ["What do you like?", "What don't you like?"],
          suggestedAnswers: ["I like bread.", "I don't like fish."],
          assessmentCriteria: ["Uses like", "Uses don't like", "Clear food words"],
        },
        apply: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["Someone offers fish. You don't like it. You say:", "No, I don't like fish.", "No, I not like fish.", "No, I don't likes fish.", "I don't like — lịch sự.", "Not — sai", "Don't likes — sai", 2],
          ],
        },
      },
    ],
  },
};
