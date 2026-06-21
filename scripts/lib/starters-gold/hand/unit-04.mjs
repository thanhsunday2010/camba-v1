/**
 * Hand-authored gold content — Unit 4: Animals
 * NO algorithmic generation.
 */
import { UNIT_PASSAGES, UNIT_SCRIPTS } from "../../starters-unit-passages.mjs";

const P4 = UNIT_PASSAGES[4];
const S4 = UNIT_SCRIPTS[4];

function passage(i) {
  const p = P4[i];
  return { ...p, wordCount: p.text.split(/\s+/).filter(Boolean).length };
}

function script(i) {
  return S4[i];
}

export const HAND_UNIT_04 = {
  topic: "animals",
  lesson0ExtraSpecs: {
    vocabulary: {
      check: {
        type: "mcq",
        label: "Animal Words Quiz",
        instructions: "No hints — choose the best answer.",
        tuples: [
          ["It says 'meow' and likes milk. It is a _____.", "cat", "dog", "fish", "Mèo kêu meow và thích sữa.", "Chó sủa, không meow", "Cá ở trong nước", 2],
          ["It is very big and has a long nose. It is an _____.", "elephant", "rabbit", "bird", "Voi rất to và có vòi dài.", "Thỏ nhỏ, không có vòi", "Chim bay, không to như voi", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Animals in Sentences",
        questionText: "Complete with animal words.",
        explanation: "cat/dog cho thú cưng; bird cho chim.",
        template: "I have a [0]. My friend has a [1].",
        correctAnswers: ["cat", "dog"],
      },
    },
    grammar: {
      check: {
        type: "mcq",
        label: "This, That and Plurals Quiz",
        tuples: [
          ["_____ is my cat. (The cat is in your arms.)", "This", "That", "These", "This — vật gần bạn.", "That — vật xa", "These — số nhiều", 2],
          ["I have two _____.", "dogs", "dog", "doges", "Two → số nhiều → dogs.", "Dog số ít", "Doges sai chính tả", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Complete with This, That or Plurals",
        explanation: "This gần; That xa; thêm -s cho số nhiều.",
        template: "[0] is my pet cat. [1] is a big elephant. I see two [2].",
        correctAnswers: ["This", "That", "birds"],
      },
    },
    reading: {
      practice: {
        type: "reading",
        label: "More Zoo Animals",
        passage: passage(0),
        tuples: [
          ["Which animal jumps and is funny?", "Monkey", "Elephant", "Bear", "The monkey is funny — it jumps!", "Voi to, không nhảy", "Gấu gần sông", 1],
          ["What colour is the tiger?", "Orange and black", "Brown", "Yellow", "That tiger is orange and black.", "Màu gấu", "Màu vịt", 1],
        ],
      },
      check: {
        type: "reading",
        label: "At the Zoo Details",
        passage: passage(0),
        tuples: [
          ["When do they go to the zoo?", "Saturday", "Sunday", "Monday", "We go to the zoo on Saturday.", "Chủ nhật — ngày đi trang trại", "Thứ Hai — không có trong bài", 2],
          ["Which animal is near the river?", "Bear", "Tiger", "Monkey", "I see a bear near the river.", "Hổ cam đen", "Khỉ nhảy", 2],
        ],
      },
      apply: {
        type: "mcq",
        label: "Zoo Facts",
        tuples: [
          ["Who likes the birds?", "The writer's sister", "Ben", "Grandpa", "My sister likes the birds.", "Ben có thú cưng", "Ông ở trang trại", 2],
        ],
      },
    },
    listening: {
      practice: {
        type: "listening",
        label: "Listen at the Pet Shop",
        script: script(0),
        answerKey: ["cat", "dog", "fish"],
        tuples: [
          ["Which animal is small?", "Cat", "Dog", "Fish", "Anna: This cat is small.", "Chó to", "Cá trong bể", 1],
          ["Where are the fish?", "In the tank", "On the floor", "In a cage", "The fish are in the tank.", "Không nói trên sàn", "Chim mới ở lồng", 1],
        ],
      },
      check: {
        type: "listening",
        label: "Pet Shop Check",
        script: script(0),
        answerKey: ["cat", "dog", "fish"],
        tuples: [
          ["Which animal is big?", "Dog", "Cat", "Fish", "That dog is big.", "Mèo nhỏ", "Cá trong bể", 2],
          ["Who says the cat is small?", "Anna", "The shopkeeper", "Ben", "Anna: Look! This cat is small.", "Người bán trả lời về chó", "Ben không có trong hội thoại", 2],
        ],
      },
      apply: {
        type: "matching",
        label: "Match Pet Shop Animals",
        questionText: "Match what you heard.",
        explanation: "Ghép con vật với mô tả trong tiệm thú cưng.",
        pairs: [
          { left: "This cat", right: "small" },
          { left: "That dog", right: "big" },
          { left: "The fish", right: "in the tank" },
        ],
      },
    },
    writing: {
      learn: {
        type: "mcq",
        label: "Choose Correct Writing",
        tuples: [
          ["Best sentence about a pet:", "This is my cat.", "This my cat is.", "My cat this is.", "This is + danh từ — chuẩn Starters.", "Sai trật tự", "Không thành câu", 1],
          ["Best plural sentence:", "I have two dogs.", "I have two dog.", "I two dogs have.", "Two → dogs (thêm -s).", "Thiếu -s", "Sai trật tự", 1],
        ],
      },
      practice: {
        type: "gap_fill",
        label: "Complete Writing Frames",
        explanation: "Khung câu cho thú cưng và số nhiều.",
        template: "This is my [0]. I have two [1].",
        correctAnswers: ["cat", "fish"],
      },
      check: {
        type: "writing",
        label: "Write About Your Pet",
        taskDescription: "Write about a pet you have or want.",
        prompts: ["Write the name of one animal.", "Write: This is my ___."],
        minWords: 4,
        modelAnswers: ["cat", "This is my dog."],
        rubric: ["Uses an animal word", "Uses This is correctly"],
        successCriteria: ["Animal word", "This is sentence"],
        autoCheckKeywords: ["cat", "dog", "bird", "fish", "This", "my"],
      },
      apply: {
        type: "mcq",
        label: "Best Written Sentence",
        tuples: [
          ["Which sentence is best?", "That is a big elephant.", "That a big elephant is.", "Elephant that big is.", "That is + mô tả + danh từ.", "Sai trật tự", "Không thành câu", 2],
        ],
      },
    },
    speaking: {
      learn: {
        type: "mcq",
        label: "Choose What to Say",
        tuples: [
          ["You hold your cat. You say:", "This is my cat.", "That is my cat.", "These is my cat.", "Gần tay → This is.", "That — vật xa", "These — số nhiều", 1],
          ["Someone asks: Do you have pets? You say:", "Yes. I have a dog.", "Yes. I dog have.", "Pets yes dog.", "Yes + I have + a + con vật.", "Sai trật tự", "Không thành câu", 1],
        ],
      },
      practice: {
        type: "mcq",
        label: "Point to an Animal",
        tuples: [
          ["The tiger is far away in the picture. You say:", "That is a tiger.", "This is a tiger.", "That are a tiger.", "Xa → That is.", "This — gần", "That is — số ít", 1],
        ],
      },
      check: {
        type: "speaking",
        label: "Say Your Favourite Animal",
        prompt: "Say your favourite animal and whether it is a pet.",
        pictureDescription: "Children at a zoo and at home with a cat and dog.",
        followUpQuestions: ["What is your favourite animal?", "Do you have a pet?"],
        suggestedAnswers: ["My favourite animal is a cat.", "Yes. I have a dog."],
        assessmentCriteria: ["Names an animal clearly", "Uses pet or This/That", "Short clear phrases"],
      },
      apply: {
        type: "mcq",
        label: "What to Say",
        tuples: [
          ["You see two birds in a tree. You say:", "I see two birds.", "I see two bird.", "Two birds I see are.", "Two → birds (số nhiều).", "Thiếu -s", "Sai cấu trúc", 2],
        ],
      },
    },
  },
  lessons: {
    vocabulary: [
      null,
      {
        slug: "vocab-pet-animals",
        title: "Lesson 2: Pet Animals",
        learningObjective: "Name and recognise common pet animals: cat, dog, bird and fish.",
        estimatedMinutes: 14,
        learn: {
          type: "mcq",
          label: "Pet Animal Words",
          tuples: [
            ["A _____ says 'meow'.", "cat", "dog", "fish", "Mèo kêu meow.", "Chó sủa", "Cá không kêu meow", 1],
            ["A _____ barks and runs.", "dog", "bird", "elephant", "Chó sủa (bark) và chạy.", "Chim bay", "Voi rất to", 1],
            ["It lives in water and swims. It is a _____.", "fish", "bird", "tiger", "Cá sống trong nước.", "Chim bay trên trời", "Hổ ở trên cạn", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Pet Animals",
          questionText: "Match each animal to its description.",
          explanation: "Ghép từ động vật với đặc điểm.",
          pairs: [
            { left: "cat", right: "says meow" },
            { left: "dog", right: "barks and runs" },
            { left: "bird", right: "can fly and sing" },
            { left: "fish", right: "swims in water" },
          ],
        },
        check: {
          type: "mcq",
          label: "Pet Animals Challenge",
          tuples: [
            ["Which animal can sing?", "bird", "fish", "dog", "Chim (bird) có thể hót/hát.", "Cá không hát", "Chó sủa", 2],
            ["Ben has a cat named Mimi. Mimi is a _____.", "cat", "dog", "bear", "Mimi là tên con mèo trong bài.", "Rex là chó", "Gấu không phải thú cưng nhà Ben", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Write Pet Words",
          explanation: "Điền từ thú cưng phù hợp.",
          template: "I have a [0] and a [1]. The [1] is big.",
          correctAnswers: ["cat", "dog"],
        },
      },
      {
        slug: "vocab-wild-farm-animals",
        title: "Lesson 3: Wild and Farm Animals",
        learningObjective: "Recognise elephant, tiger, monkey, bear, rabbit and zoo/farm words.",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "Wild Animal Words",
          tuples: [
            ["It is very big with a long nose. It is an _____.", "elephant", "rabbit", "bird", "Voi (elephant) to và có vòi.", "Thỏ nhỏ", "Chim nhỏ", 1],
            ["It has orange and black stripes. It is a _____.", "tiger", "bear", "fish", "Hổ (tiger) có sọc cam và đen.", "Gấu không sọc", "Cá không có sọc", 1],
            ["It climbs trees and is funny. It is a _____.", "monkey", "elephant", "dog", "Khỉ (monkey) leo cây và hay làm trò.", "Voi không leo cây", "Chó không leo cây", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Zoo and Farm Animals",
          explanation: "Ghép con vật với nơi hoặc đặc điểm.",
          pairs: [
            { left: "elephant", right: "very big at the zoo" },
            { left: "bear", right: "big and furry" },
            { left: "rabbit", right: "small with long ears" },
            { left: "zoo", right: "place to see wild animals" },
          ],
        },
        check: {
          type: "mcq",
          label: "Wild Animals Quiz",
          tuples: [
            ["Which animal has long ears?", "rabbit", "tiger", "fish", "Thỏ (rabbit) có tai dài.", "Hổ có sọc", "Cá có vây", 2],
            ["Where do we see elephants and tigers?", "zoo", "kitchen", "bedroom", "Zoo — sở thú — nơi xem thú hoang dã.", "Bếp không có voi", "Phòng ngủ", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Sentence Order",
          questionText: "Make a sentence about the zoo.",
          explanation: "We see + con vật + at the zoo.",
          words: ["We", "see", "elephants", "at", "the", "zoo."],
        },
      },
    ],
    grammar: [
      null,
      {
        slug: "grammar-this-and-that",
        title: "Lesson 2: This and That",
        learningObjective: "Use this for animals near you and that for animals far away.",
        learn: {
          type: "mcq",
          label: "This or That?",
          tuples: [
            ["_____ is my dog. (You are holding the dog.)", "This", "That", "These", "Cầm trong tay → gần → This.", "That — xa", "These — số nhiều", 1],
            ["_____ is a tiger. (The tiger is far in the picture.)", "That", "This", "Those", "Trong tranh xa → That.", "This — gần", "Those — số nhiều", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Fill This or That",
          explanation: "This gần; That xa.",
          template: "[0] is my cat. [1] is a big elephant.",
          correctAnswers: ["This", "That"],
        },
        check: {
          type: "mcq",
          label: "This and That Check",
          tuples: [
            ["The duck is near you on the farm. You say:", "This duck is small.", "That duck is small.", "These duck is small.", "Gần → This duck.", "That — xa", "These + số nhiều", 2],
            ["Choose the correct sentence:", "That is a bear.", "That are a bear.", "That is bear.", "That is + a + danh từ số ít.", "That are — sai số", "Thiếu a", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Order the Sentence",
          explanation: "This is + a + con vật.",
          words: ["This", "is", "a", "monkey."],
        },
      },
      {
        slug: "grammar-animal-plurals",
        title: "Lesson 3: Animal Plurals",
        learningObjective: "Form regular plurals with -s: one cat, two cats.",
        learn: {
          type: "mcq",
          label: "One or Many?",
          tuples: [
            ["One cat, two _____.", "cats", "cat", "cates", "Hai con → cats (thêm -s).", "Cat số ít", "Cates sai", 1],
            ["Three _____. (monkey → ?)", "monkeys", "monkey", "monkies", "Three → monkeys.", "Monkey số ít", "Monkies sai chính tả", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write Plurals",
          explanation: "Thêm -s sau số lớn hơn 1.",
          template: "I see two [0]. There are three [1].",
          correctAnswers: ["dogs", "birds"],
        },
        check: {
          type: "mcq",
          label: "Plurals Check",
          tuples: [
            ["Grandpa counts: one, two — two _____.", "dogs", "dog", "doges", "Two dogs — số nhiều.", "Dog số ít", "Doges sai", 2],
            ["There are many _____ in the sky.", "birds", "bird", "birde", "Many → birds.", "Bird số ít", "Birde không tồn tại", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose the Plural",
          tuples: [
            ["I have two pet _____.", "fish", "fishes", "fishs", "Fish — số nhiều thường giữ nguyên fish ở Starters.", "Fishes ít dùng", "Fishs sai", 2],
          ],
        },
      },
    ],
    reading: [
      null,
      {
        slug: "reading-pets-at-home",
        title: "Lesson 2: Pets at Home",
        learningObjective: "Read for pet names and animal words in a home text.",
        learn: {
          type: "reading",
          label: "Read About Ben's Pets",
          passage: passage(1),
          tuples: [
            ["What is the cat's name?", "Mimi", "Rex", "Ben", "This is my cat. Her name is Mimi.", "Rex là tên chó", "Ben là tên cậu bé", 1],
            ["What is the dog's name?", "Rex", "Mimi", "Anna", "That is my dog. His name is Rex.", "Mimi là mèo", "Anna không có trong bài", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Find Pet Details",
          passage: passage(1),
          tuples: [
            ["What colour are the fish?", "Orange and blue", "Black and white", "Green", "They are orange and blue.", "Không nói đen trắng", "Không nói xanh", 1],
            ["What can Ben's friend's bird do?", "Sing", "Swim", "Bark", "My friend has a bird. It can sing!", "Cá mới bơi", "Chó mới sủa", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Pets at Home Check",
          passage: passage(1),
          tuples: [
            ["How many pets does Ben have at home?", "Two", "One", "Three", "I have two pets at home.", "Một — sai", "Ba — sai", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete from Text",
          explanation: "Điền từ trong bài đọc.",
          template: "Ben's cat is [0]. His dog is [1].",
          correctAnswers: ["Mimi", "Rex"],
        },
      },
      {
        slug: "reading-farm-animals",
        title: "Lesson 3: Farm Animals",
        learningObjective: "Understand farm animals and counting in a short farm text.",
        learn: {
          type: "reading",
          label: "Read About the Farm",
          passage: passage(2),
          tuples: [
            ["When do they visit Grandpa?", "Sunday", "Saturday", "Monday", "We visit him on Sunday.", "Thứ Bảy — ngày đi sở thú", "Thứ Hai", 1],
            ["What colour is the duck?", "Yellow", "Brown", "Orange", "This duck is small and yellow.", "Ngựa nâu", "Hổ cam", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "More Farm Details",
          passage: passage(2),
          tuples: [
            ["Which animal is big and brown?", "Horse", "Duck", "Chicken", "That horse is big and brown.", "Vịt nhỏ vàng", "Gà — không mô tả màu", 1],
            ["How many dogs does the writer count?", "Two", "One", "Three", "I count the dogs: one, two — two dogs!", "Một con", "Ba con", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Farm Check",
          passage: passage(2),
          tuples: [
            ["What do they do on the farm?", "Feed the animals", "Go to the zoo", "Buy a cat", "We feed the animals.", "Đi sở thú — bài khác", "Mua mèo — không có", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Best Summary",
          tuples: [
            ["This text is mainly about _____.", "animals on a farm", "clothes at a shop", "food for lunch", "Bài mô tả trang trại và động vật.", "Chủ đề quần áo", "Chủ đề đồ ăn", 2],
          ],
        },
      },
    ],
    listening: [
      null,
      {
        slug: "listening-zoo-tour",
        title: "Lesson 2: Zoo Tour",
        learningObjective: "Identify zoo animals from a guide's short talk.",
        learn: {
          type: "listening",
          label: "Zoo Guide",
          script: script(1),
          tuples: [
            ["Which animal does the guide say is very big?", "Elephant", "Monkey", "Bird", "This is an elephant. It is very big.", "Khỉ nhỏ và vui", "Chim không được nhắc", 1],
            ["Which animal is funny?", "Monkey", "Elephant", "Bear", "That monkey is funny!", "Voi to", "Gấu — nhắc sau", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for More Animals",
          script: script(1),
          tuples: [
            ["Which two animals does the guide mention last?", "Tiger and bear", "Cat and dog", "Fish and bird", "Look at the tiger. And the bear!", "Thú cưng", "Cá và chim", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Zoo Tour Check",
          script: script(1),
          answerKey: ["elephant", "monkey", "tiger", "bear"],
          tuples: [
            ["Who speaks to the children?", "Guide", "Ben", "Anna", "Guide giới thiệu các con vật.", "Ben nói về thú cưng", "Anna ở tiệm thú cưng", 2],
          ],
        },
        apply: {
          type: "matching",
          label: "Match Zoo Animals",
          explanation: "Ghép con vật với mô tả của hướng dẫn viên.",
          pairs: [
            { left: "elephant", right: "very big" },
            { left: "monkey", right: "funny" },
            { left: "tiger", right: "look at it" },
          ],
        },
      },
      {
        slug: "listening-my-pets",
        title: "Lesson 3: My Pets",
        learningObjective: "Understand a dialogue about pets at home.",
        learn: {
          type: "listening",
          label: "Talking About Pets",
          script: script(2),
          tuples: [
            ["What pets does Ben have?", "A cat and a dog", "A bird", "Two fish", "Yes. I have a cat and a dog.", "Chim là của Mai", "Cá không được nhắc", 1],
            ["What pet does Mai have?", "A bird", "A cat", "A tiger", "I have a bird. It can sing!", "Ben có mèo và chó", "Hổ ở sở thú", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Details",
          script: script(2),
          tuples: [
            ["What can Mai's bird do?", "Sing", "Swim", "Jump", "I have a bird. It can sing!", "Cá mới bơi", "Khỉ mới nhảy", 1],
          ],
        },
        check: {
          type: "listening",
          label: "My Pets Check",
          script: script(2),
          answerKey: ["cat", "dog", "bird", "animals"],
          tuples: [
            ["Who asks: Do you have pets?", "Mai", "Ben", "Guide", "Mai: Do you have pets?", "Ben trả lời", "Guide ở sở thú", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose What You Heard",
          tuples: [
            ["Ben says birds are _____.", "nice", "big", "funny", "Birds are nice. I like animals.", "To — voi", "Vui — khỉ", 2],
          ],
        },
      },
    ],
    writing: [
      null,
      {
        slug: "writing-pet-sentences",
        title: "Lesson 2: Write About Pets",
        learningObjective: "Write short sentences with This is and pet animal names.",
        learn: {
          type: "mcq",
          label: "Choose Correct Writing",
          tuples: [
            ["Best sentence about your cat:", "This is my cat.", "This cat my is.", "My cat this.", "This is my + con vật.", "Sai trật tự", "Thiếu is", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write Pet Sentences",
          explanation: "Viết câu về thú cưng.",
          template: "This is my [0]. That is my [1].",
          correctAnswers: ["cat", "dog"],
        },
        check: {
          type: "writing",
          label: "Write About a Pet",
          taskDescription: "Write about one pet you have or like.",
          prompts: ["Write: This is my ___.", "Write one more animal word."],
          minWords: 5,
          modelAnswers: ["This is my dog.", "cat"],
          rubric: ["Uses This is", "Animal word spelled correctly"],
          successCriteria: ["This is sentence", "Animal word"],
          autoCheckKeywords: ["This", "my", "cat", "dog", "bird", "fish"],
        },
        apply: {
          type: "mcq",
          label: "Fix the Sentence",
          tuples: [
            ["Which needs fixing?", "That are a dog.", "That is a dog.", "That is dog.", "That is + a + danh từ.", "Đây là câu đúng", "Thiếu a", 2],
          ],
        },
      },
      {
        slug: "writing-animal-plurals",
        title: "Lesson 3: Write Animal Plurals",
        learningObjective: "Write plural animal words in short sentences at Starters level.",
        learn: {
          type: "mcq",
          label: "Plurals in Writing",
          tuples: [
            ["Best sentence:", "I see two cats.", "I see two cat.", "Two cats I see.", "Two → cats.", "Thiếu -s", "Sai trật tự", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Best Plural Sentence",
          tuples: [
            ["Which is correct?", "There are three monkeys.", "There are three monkey.", "There is three monkeys.", "Three → monkeys; There are + số nhiều.", "Thiếu -s", "There is — sai", 1],
          ],
        },
        check: {
          type: "writing",
          label: "Write About Animals",
          taskDescription: "Write about animals you see — use a plural.",
          prompts: ["Write: I see two ___.", "Write one animal at the zoo."],
          minWords: 4,
          modelAnswers: ["I see two dogs.", "elephant"],
          rubric: ["Uses plural -s", "Animal word correct"],
          successCriteria: ["Plural sentence", "Animal word"],
          autoCheckKeywords: ["see", "two", "cats", "dogs", "birds", "elephant"],
        },
        apply: {
          type: "ordering",
          label: "Order the Sentence",
          explanation: "I see + số + con vật số nhiều.",
          words: ["I", "see", "two", "birds."],
        },
      },
    ],
    speaking: [
      null,
      {
        slug: "speaking-point-to-pets",
        title: "Lesson 2: Point to Pets",
        learningObjective: "Say This is and That is aloud about pets near and far.",
        learn: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["You hold your cat. You say:", "This is my cat.", "That is my cat.", "These is my cat.", "Gần → This is.", "That — xa", "These — số nhiều", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Near or Far?",
          tuples: [
            ["The dog is across the room. You say:", "That is my dog.", "This is my dog.", "That are my dog.", "Xa → That is.", "This — gần", "That are — sai", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say This and That",
          prompt: "Point to a pet near you and one far away. Say This is… and That is…",
          pictureDescription: "A boy with a cat on his lap and a dog across the room.",
          followUpQuestions: ["What is this?", "What is that?"],
          suggestedAnswers: ["This is my cat.", "That is my dog."],
          assessmentCriteria: ["Uses This for near", "Uses That for far", "Clear animal names"],
        },
        apply: {
          type: "mcq",
          label: "Polite Reply",
          tuples: [
            ["Friend asks: Do you have pets? Best reply:", "Yes. I have a cat and a dog.", "Yes pets.", "Cat dog I.", "Câu đầy đủ với I have.", "Quá ngắn", "Sai trật tự", 2],
          ],
        },
      },
      {
        slug: "speaking-zoo-animals",
        title: "Lesson 3: Say Zoo Animals",
        learningObjective: "Name zoo animals and use plurals in short spoken phrases.",
        learn: {
          type: "mcq",
          label: "Say the Animal",
          tuples: [
            ["The guide points to a big elephant. You repeat:", "This is an elephant.", "This is elephant.", "This are an elephant.", "This is + an + con vật.", "Thiếu an", "This are — sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Say the Plural",
          tuples: [
            ["You see two birds. You say:", "I see two birds.", "I see two bird.", "Two bird I see.", "Two → birds.", "Thiếu -s", "Sai trật tự", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Your Favourite Zoo Animal",
          prompt: "Name your favourite zoo animal and say if it is big or small.",
          pictureDescription: "Zoo scene with elephant, monkey, tiger and bear.",
          followUpQuestions: ["What is your favourite animal?", "Is it big or small?"],
          suggestedAnswers: ["My favourite animal is the monkey.", "It is small."],
          assessmentCriteria: ["Names a zoo animal", "Uses big or small", "Intelligible pronunciation"],
        },
        apply: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["The tiger is far away. You say:", "That is a tiger.", "This is a tiger.", "That are tiger.", "Xa → That is a tiger.", "This — gần", "That are — sai", 2],
          ],
        },
      },
    ],
  },
};
