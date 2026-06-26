/**
 * Hand-authored gold content — Unit 10: Transport and Places
 * NO algorithmic generation.
 */
import { UNIT_PASSAGES, UNIT_SCRIPTS } from "../../starters-unit-passages.mjs";

const P10 = UNIT_PASSAGES[10];
const S10 = UNIT_SCRIPTS[10];

function passage(i) {
  const p = P10[i];
  return { ...p, wordCount: p.text.split(/\s+/).filter(Boolean).length };
}

function script(i) {
  return S10[i];
}

export const HAND_UNIT_10 = {
  topic: "transport-and-places",
  lesson0ExtraSpecs: {
    vocabulary: {
      check: {
        type: "mcq",
        label: "Transport and Places Quiz",
        instructions: "No hints — choose the best answer.",
        tuples: [
          ["We fly in a _____.", "plane", "bus", "street", "Plane (máy bay) — bay trên trời.", "Xe buýt — trên đường", "Đường phố — không phải phương tiện", 2],
          ["Children play in the _____.", "park", "airport", "taxi", "Park (công viên) — nơi chơi.", "Sân bay", "Taxi — phương tiện", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Places in Sentences",
        questionText: "Complete with transport or place words.",
        explanation: "bus/car cho phương tiện; shop/park cho địa điểm.",
        template: "We go by [0]. The [1] is next to the park.",
        correctAnswers: ["bus", "shop"],
      },
    },
    grammar: {
      check: {
        type: "mcq",
        label: "Where and Prepositions Quiz",
        tuples: [
          ["_____ is the shop?", "Where", "What", "Who", "Where hỏi địa điểm.", "What hỏi vật", "Who hỏi người", 2],
          ["The car is _____ our house.", "in front of", "in", "on", "In front of — phía trước nhà.", "In — bên trong", "On — trên bề mặt", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Complete Where and Prepositions",
        explanation: "Where + to be; next to/behind cho vị trí.",
        template: "[0] is the park? It is [1] the school.",
        correctAnswers: ["Where", "next to"],
      },
    },
    reading: {
      practice: {
        type: "reading",
        label: "Find Places in the Text",
        passage: passage(0),
        tuples: [
          ["Where is the park?", "Next to the house", "Behind the shop", "In the airport", "The park is next to our house.", "Shop behind park", "Không ở sân bay", 1],
          ["How does Father go?", "By bike", "By bus", "By plane", "My father goes by bike.", "Mẹ đi bus", "Không bay", 1],
        ],
      },
      check: {
        type: "reading",
        label: "Going to the Park Details",
        passage: passage(0),
        tuples: [
          ["Where is the shop?", "Behind the park", "In front of the house", "On the plane", "The shop is behind the park.", "Trước nhà là xe", "Không trên máy bay", 2],
          ["Where is the car?", "In front of the house", "Behind the school", "Next to the bus", "It is in front of our house!", "Sau trường", "Cạnh bus", 2],
        ],
      },
      apply: {
        type: "mcq",
        label: "Park Trip Facts",
        tuples: [
          ["How does Mother go?", "Takes the bus", "Walks", "Flies", "My mother takes the bus.", "Đi bộ là we", "Không bay", 2],
        ],
      },
    },
    listening: {
      practice: {
        type: "listening",
        label: "Listen for Transport",
        script: script(0),
        answerKey: ["bus", "park"],
        tuples: [
          ["Can they go by bus?", "Yes", "No", "Not said", "Tom: Can we go by bus? Mother: Yes.", "Mẹ đồng ý", "Có nói", 1],
          ["Where is the bus stop?", "Next to the shop", "Behind the park", "In the house", "The bus stop is next to the shop.", "Sau công viên", "Trong nhà", 1],
        ],
      },
      check: {
        type: "listening",
        label: "How Do We Go?",
        script: script(0),
        answerKey: ["bus", "park"],
        tuples: [
          ["Where is their house?", "Behind the park", "Next to the shop", "At the airport", "It is behind the park.", "Cạnh shop", "Sân bay", 2],
          ["Who asks about the bus?", "Tom", "Mother", "Father", "Tom: Can we go by bus?", "Mẹ trả lời", "Bố không hỏi", 2],
        ],
      },
      apply: {
        type: "matching",
        label: "Match Transport and Places",
        questionText: "Match what you heard.",
        explanation: "Ghép phương tiện và địa điểm.",
        pairs: [
          { left: "bus stop", right: "next to the shop" },
          { left: "house", right: "behind the park" },
        ],
      },
    },
    writing: {
      learn: {
        type: "mcq",
        label: "Choose Correct Writing",
        tuples: [
          ["Best place question:", "Where is the shop?", "The shop where is?", "Shop where the is?", "Where is + địa điểm?", "Sai trật tự", "Sai", 1],
          ["Best preposition phrase:", "The park is next to the school.", "Next school park the is.", "Park next school is the.", "Next to + địa điểm.", "Sai trật tự", "Sai", 1],
        ],
      },
      practice: {
        type: "gap_fill",
        label: "Complete Place Sentences",
        explanation: "Where + to be; next to/behind.",
        template: "[0] is the car? It is in front of the [1].",
        correctAnswers: ["Where", "house"],
      },
      check: {
        type: "writing",
        label: "Write About Your Street",
        taskDescription: "Write about a place near your home and how you go there.",
        prompts: ["Write: The ___ is next to my house.", "Write: I go by ___."],
        minWords: 6,
        modelAnswers: ["The park is next to my house.", "I go by bus."],
        rubric: ["Uses a place word", "Uses by + transport"],
        successCriteria: ["Place sentence", "Transport sentence"],
        autoCheckKeywords: ["park", "shop", "bus", "bike", "next to", "by"],
      },
      apply: {
        type: "mcq",
        label: "Best Written Sentence",
        tuples: [
          ["Which sentence is best?", "The shop is behind the park.", "Shop the behind park is.", "Behind park shop the.", "The shop is behind + nơi.", "Sai trật tự", "Sai", 2],
        ],
      },
    },
    speaking: {
      learn: {
        type: "mcq",
        label: "Choose What to Say",
        tuples: [
          ["You are lost. You ask:", "Excuse me, where is the shop?", "Shop where excuse me.", "Where shop is me excuse.", "Excuse me, where is + địa điểm?", "Sai trật tự", "Không thành câu", 1],
          ["Someone asks how you go to school. You say:", "I go by bus.", "By bus I go school.", "Bus by go I.", "I go by + phương tiện.", "Sai trật tự", "Sai", 1],
        ],
      },
      practice: {
        type: "mcq",
        label: "Ask About Location",
        tuples: [
          ["You want to know where the park is. You ask:", "Where is the park?", "What is the park?", "Who is the park?", "Where hỏi vị trí.", "What hỏi vật", "Who hỏi người", 1],
        ],
      },
      check: {
        type: "speaking",
        label: "Say How You Go and Where",
        prompt: "Say how you go to one place and where something is near your home.",
        sceneDescription: "Street with house, park, shop, bus and car.",
        followUpQuestions: ["How do you go to the park?", "Where is the shop?"],
        suggestedAnswers: ["I go by bike.", "The shop is next to the park."],
        assessmentCriteria: ["Uses by + transport", "Uses next to/behind/in front of", "Clear phrases"],
      },
      apply: {
        type: "mcq",
        label: "What to Say",
        tuples: [
          ["Someone asks: Where is your house? You say:", "It is behind the school.", "Behind school house it.", "House behind school.", "It is + giới từ + nơi.", "Sai cấu trúc", "Quá ngắn", 2],
        ],
      },
    },
  },
  lessons: {
    vocabulary: [
      null,
      {
        slug: "vocab-transport",
        title: "Lesson 2: Transport",
        learningObjective: "Name transport: car, bus, bike, plane and taxi.",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "Transport Words",
          tuples: [
            ["Many people travel in a _____.", "bus", "park", "shop", "Bus — xe buýt.", "Công viên", "Cửa hàng", 1],
            ["We fly in a _____.", "plane", "car", "street", "Plane — máy bay.", "Ô tô", "Đường phố", 1],
            ["A _____ takes you quickly by road for money.", "taxi", "bike", "house", "Taxi — xe taxi trả phí.", "Xe đạp", "Nhà", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Transport",
          questionText: "Match transport to how it moves.",
          explanation: "Ghép phương tiện với cách di chuyển.",
          pairs: [
            { left: "car", right: "drives on the road" },
            { left: "plane", right: "flies in the sky" },
            { left: "bike", right: "you ride it" },
            { left: "bus", right: "many people travel together" },
          ],
        },
        check: {
          type: "mcq",
          label: "Transport Challenge",
          tuples: [
            ["Which goes in the sky?", "plane", "bus", "taxi", "Plane bay trên trời.", "Bus trên đường", "Taxi trên đường", 2],
            ["Father has a red _____.", "car", "park", "street", "Car — xe ô tô.", "Công viên", "Đường phố", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete Transport Sentences",
          explanation: "Điền phương tiện phù hợp.",
          template: "We go by [0]. Grandpa takes a [1] to the airport.",
          correctAnswers: ["bus", "taxi"],
        },
      },
      {
        slug: "vocab-places",
        title: "Lesson 3: Places",
        learningObjective: "Use place words: house, park, shop, street and airport.",
        estimatedMinutes: 18,
        learn: {
          type: "mcq",
          label: "Place Names",
          tuples: [
            ["We live in a _____.", "house", "plane", "bus", "House — ngôi nhà.", "Máy bay", "Xe buýt", 1],
            ["Children play in the _____.", "park", "airport", "taxi", "Park — công viên.", "Sân bay", "Taxi", 1],
            ["We buy food at the _____.", "shop", "street", "plane", "Shop — cửa hàng.", "Đường phố", "Máy bay", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Places",
          explanation: "Ghép địa điểm với hoạt động.",
          pairs: [
            { left: "park", right: "play and see trees" },
            { left: "shop", right: "buy things" },
            { left: "airport", right: "planes take off" },
            { left: "street", right: "cars and buses go here" },
          ],
        },
        check: {
          type: "mcq",
          label: "Places Quiz",
          tuples: [
            ["Where do planes wait?", "airport", "park", "shop", "Airport — sân bay.", "Công viên", "Cửa hàng", 2],
            ["Our home is on this _____.", "street", "plane", "bus", "Street — đường phố.", "Máy bay", "Xe buýt", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Sentence Order",
          questionText: "Make a sentence about a place.",
          explanation: "The + park + is + next to + the + house.",
          words: ["The", "park", "is", "next", "to", "the", "house."],
        },
      },
    ],
    grammar: [
      null,
      {
        slug: "grammar-where-what",
        title: "Lesson 2: Where and What Questions",
        learningObjective: "Ask where and what questions about places and transport.",
        learn: {
          type: "mcq",
          label: "Where and What",
          tuples: [
            ["_____ is the bus stop?", "Where", "What", "Who", "Where hỏi vị trí.", "What hỏi vật", "Who hỏi người", 1],
            ["_____ is that? — It is a red car.", "What", "Where", "When", "What hỏi vật/con gì.", "Where hỏi nơi", "When hỏi thời gian", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Complete Questions",
          explanation: "Where cho nơi; What cho vật.",
          template: "[0] is the shop? [1] is that blue bus?",
          correctAnswers: ["Where", "What"],
        },
        check: {
          type: "mcq",
          label: "Question Words Check",
          tuples: [
            ["You want a place. You ask:", "Where is the park?", "What is the park?", "Who is the park?", "Where + place.", "What hỏi loại vật", "Who hỏi người", 2],
            ["You see transport. You ask:", "What is that?", "Where is that?", "Who is that?", "What hỏi xe gì.", "Where hỏi vị trí", "Who hỏi người", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Order the Question",
          explanation: "Where + is + the + shop?",
          words: ["Where", "is", "the", "shop?"],
        },
      },
      {
        slug: "grammar-place-prepositions",
        title: "Lesson 3: Next To, Behind, In Front Of",
        learningObjective: "Use next to, behind and in front of to describe location.",
        learn: {
          type: "mcq",
          label: "Place Prepositions",
          tuples: [
            ["The shop is _____ the park.", "next to", "in", "on", "Next to — bên cạnh.", "In — bên trong", "On — trên", 1],
            ["The car is _____ the house.", "in front of", "under", "in", "In front of — phía trước.", "Under — dưới", "In — trong", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Complete Prepositions",
          explanation: "Next to/behind/in front of theo vị trí.",
          template: "The school is [0] the park. Our house is [1] the school.",
          correctAnswers: ["next to", "behind"],
        },
        check: {
          type: "mcq",
          label: "Prepositions Check",
          tuples: [
            ["The bike is _____ the door.", "in front of", "next to", "behind", "In front of the door — trước cửa.", "Next to — bên cạnh", "Behind — phía sau", 2],
            ["Go straight. Turn left _____ the park.", "at", "in", "under", "At the park — tại/rẽ tại công viên.", "In — bên trong", "Under — dưới", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose the Preposition",
          tuples: [
            ["The bus stop is _____ the shop.", "next to", "in front of", "under", "Next to the shop — cạnh cửa hàng.", "In front of — trước shop", "Under — dưới shop", 2],
          ],
        },
      },
    ],
    reading: [
      null,
      {
        slug: "reading-park-trip",
        title: "Lesson 2: Going to the Park",
        learningObjective: "Read for transport and place locations in a street text.",
        learn: {
          type: "reading",
          label: "Read the Street",
          passage: passage(0),
          tuples: [
            ["How do they walk to the park?", "They walk", "They fly", "They take a taxi", "We walk to the park.", "Không bay", "Không taxi", 1],
            ["What is next to the house?", "The park", "The airport", "The plane", "The park is next to our house.", "Sân bay", "Máy bay", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "More Trip Details",
          passage: passage(0),
          tuples: [
            ["What do they see in the park?", "Birds and trees", "Planes and taxis", "Shops only", "In the park we see birds and trees.", "Máy bay", "Chỉ shop", 1],
            ["Where is the shop?", "Behind the park", "In the house", "On the plane", "The shop is behind the park.", "Trong nhà", "Trên máy bay", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Park Trip Check",
          passage: passage(0),
          tuples: [
            ["Where is the car?", "In front of the house", "Behind the park", "Next to the bus", "It is in front of our house!", "Sau công viên", "Cạnh bus", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete from Text",
          explanation: "Điền từ trong bài đọc.",
          template: "Mother takes the [0]. The shop is [1] the park.",
          correctAnswers: ["bus", "behind"],
        },
      },
      {
        slug: "reading-trip-directions",
        title: "Lesson 3: Trip and Directions",
        learningObjective: "Read simple directions and holiday travel texts.",
        learn: {
          type: "reading",
          label: "Read the Plane Trip",
          passage: passage(1),
          tuples: [
            ["How do they get to the airport?", "By taxi", "By bike", "On foot only", "We take a taxi to the airport.", "Xe đạp", "Chỉ đi bộ", 1],
            ["Who waits at her house?", "Grandma", "Tom", "The shopkeeper", "Grandma waits at her house.", "Tom", "Người bán hàng", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Read Directions",
          passage: passage(2),
          tuples: [
            ["What should you do first?", "Go straight", "Turn right", "Stop", "Go straight.", "Rẽ phải không nói", "Dừng không nói", 1],
            ["Where is the shop?", "Next to the bus stop", "Behind the school", "In the plane", "The shop is next to the bus stop.", "Sau trường", "Trên máy bay", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Directions Check",
          passage: passage(2),
          tuples: [
            ["Where is the writer's house?", "Behind the school", "Next to the bus stop", "At the airport", "My house is behind the school.", "Cạnh bus stop", "Sân bay", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Best Summary",
          tuples: [
            ["The plane trip text is about _____.", "flying on holiday to Grandma", "playing football at school", "eating lunch at home", "Bài về bay máy bay đi nghỉ.", "Bóng đá", "Ăn trưa", 2],
          ],
        },
      },
    ],
    listening: [
      null,
      {
        slug: "listening-how-we-go",
        title: "Lesson 2: How Do We Go?",
        learningObjective: "Extract transport and place names from street dialogues.",
        learn: {
          type: "listening",
          label: "By Bus",
          script: script(0),
          answerKey: ["bus", "park"],
          tuples: [
            ["Can they go by bus?", "Yes", "No", "Maybe", "Mother: Yes.", "Mẹ đồng ý", "Không do dự", 1],
            ["Where is the bus stop?", "Next to the shop", "Behind the park", "In the house", "Next to the shop.", "Sau công viên", "Trong nhà", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "At the Airport",
          script: script(1),
          answerKey: ["plane", "airport"],
          tuples: [
            ["What do they fly in?", "A plane", "A bus", "A bike", "Look at the plane!", "Xe buýt", "Xe đạp", 1],
            ["Where is the car?", "In front of the airport", "Behind the park", "Next to the shop", "It is in front of the airport.", "Sau công viên", "Cạnh shop", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Transport Check",
          script: script(0),
          answerKey: ["bus", "park"],
          tuples: [
            ["Where is the house?", "Behind the park", "Next to the shop", "At the airport", "It is behind the park.", "Cạnh shop", "Sân bay", 2],
          ],
        },
        apply: {
          type: "matching",
          label: "Match Dialogue Facts",
          explanation: "Ghép câu hỏi và câu trả lời.",
          pairs: [
            { left: "Go by bus?", right: "Yes" },
            { left: "Bus stop", right: "next to the shop" },
            { left: "House", right: "behind the park" },
          ],
        },
      },
      {
        slug: "listening-find-shop",
        title: "Lesson 3: Finding the Shop",
        learningObjective: "Follow directions to find places in a street dialogue.",
        learn: {
          type: "listening",
          label: "Ask for Directions",
          script: script(2),
          answerKey: ["straight", "school"],
          tuples: [
            ["What does Ben ask?", "Where is the shop?", "What is the shop?", "Who is the shop?", "Excuse me. Where is the shop?", "What hỏi vật", "Who hỏi người", 1],
            ["Is the park near?", "Yes", "No", "Not said", "Yes. It is next to the school.", "Không gần", "Có nói", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Directions",
          script: script(2),
          answerKey: ["straight", "school"],
          tuples: [
            ["First direction:", "Go straight", "Turn right", "Go back", "Go straight.", "Rẽ phải", "Quay lại", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Directions Check",
          script: script(2),
          answerKey: ["straight", "school"],
          tuples: [
            ["Where is the park?", "Next to the school", "Behind the airport", "In the house", "It is next to the school.", "Sau sân bay", "Trong nhà", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose What You Heard",
          tuples: [
            ["The shop is on this _____.", "street", "plane", "park only", "The shop is on this street.", "Máy bay", "Chỉ công viên", 2],
          ],
        },
      },
    ],
    writing: [
      null,
      {
        slug: "writing-transport",
        title: "Lesson 2: Write About Transport",
        learningObjective: "Write how you go places using by + transport.",
        learn: {
          type: "mcq",
          label: "Choose Correct Writing",
          tuples: [
            ["Best transport sentence:", "I go to school by bus.", "By bus I go school to.", "School bus by go I.", "I go + place + by + transport.", "Sai trật tự", "Sai", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write By + Transport",
          explanation: "By + bus/car/bike/plane.",
          template: "We go to the park [0] bike. Father goes [1] car.",
          correctAnswers: ["by", "by"],
        },
        check: {
          type: "writing",
          label: "Write How You Travel",
          taskDescription: "Write how you go to two places.",
          prompts: ["Write: I go to ___ by ___.", "Write another way you travel."],
          minWords: 6,
          modelAnswers: ["I go to school by bus.", "I go to the park by bike."],
          rubric: ["Uses by + transport", "Names a place"],
          successCriteria: ["First trip", "Second trip or transport"],
          autoCheckKeywords: ["by", "bus", "bike", "car", "walk", "school", "park"],
        },
        apply: {
          type: "mcq",
          label: "Fix the Sentence",
          tuples: [
            ["Which needs fixing?", "We go by the bus.", "We go by bus.", "We by go bus.", "By bus — không cần the.", "Đây là câu đúng", "Sai trật tự", 2],
          ],
        },
      },
      {
        slug: "writing-places-directions",
        title: "Lesson 3: Write About Places",
        learningObjective: "Write where questions and preposition phrases.",
        learn: {
          type: "mcq",
          label: "Places in Writing",
          tuples: [
            ["Best question:", "Where is the park?", "Park where the is?", "The where park is?", "Where is + place?", "Sai trật tự", "Sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Best Location Sentence",
          tuples: [
            ["Which is correct?", "The shop is next to the school.", "Shop next school the is.", "Next to shop school the.", "The shop is next to + nơi.", "Sai trật tự", "Sai", 1],
          ],
        },
        check: {
          type: "writing",
          label: "Write Places and Directions",
          taskDescription: "Write where two places are near your home.",
          prompts: ["Write: The ___ is next to ___.", "Write: My house is behind/in front of ___."],
          minWords: 6,
          modelAnswers: ["The park is next to my house.", "My house is behind the school."],
          rubric: ["Uses next to/behind/in front of", "Uses place words"],
          successCriteria: ["First location", "Second location"],
          autoCheckKeywords: ["next to", "behind", "in front of", "park", "shop", "house", "school"],
        },
        apply: {
          type: "ordering",
          label: "Order Direction Sentence",
          explanation: "Turn + left + at + the + park.",
          words: ["Turn", "left", "at", "the", "park."],
        },
      },
    ],
    speaking: [
      null,
      {
        slug: "speaking-transport-talk",
        title: "Lesson 2: Say How You Go",
        learningObjective: "Say how you go to places using by + transport.",
        learn: {
          type: "mcq",
          label: "Choose a Reply",
          tuples: [
            ["Mother asks: How do we go? You say:", "We go by bus.", "By bus we go.", "Bus by go we.", "We go by + transport.", "Sai trật tự", "Sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Ask About Transport",
          tuples: [
            ["You want to know about the bus. You ask:", "Can we go by bus?", "We can bus go?", "Bus can we?", "Can we go by + transport?", "Sai trật tự", "Sai", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say How You Travel",
          prompt: "Say how you go to school and to the park.",
          sceneDescription: "Street scene with bus, bike, car and park.",
          followUpQuestions: ["How do you go to school?", "How do you go to the park?"],
          suggestedAnswers: ["I go to school by bus.", "I go to the park by bike."],
          assessmentCriteria: ["Uses by + transport", "Names places", "Clear speech"],
        },
        apply: {
          type: "mcq",
          label: "Polite Reply",
          tuples: [
            ["Father asks: Can we take a taxi? Best reply:", "Yes, good idea!", "No bus plane.", "Shop park.", "Yes — đồng ý lịch sự.", "Không liên quan", "Không liên quan", 2],
          ],
        },
      },
      {
        slug: "speaking-places-talk",
        title: "Lesson 3: Ask and Say Where",
        learningObjective: "Ask where places are and answer with prepositions.",
        learn: {
          type: "mcq",
          label: "Say About Places",
          tuples: [
            ["Best answer:", "The shop is next to the park.", "Shop park next the is.", "Next park shop.", "The shop is next to + nơi.", "Sai trật tự", "Sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Ask for Directions",
          tuples: [
            ["You are lost. You say:", "Excuse me, where is the shop?", "Shop where is excuse.", "Where shop me excuse.", "Excuse me, where is + place?", "Sai trật tự", "Sai", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Where Things Are",
          prompt: "Say where the park, shop and your house are.",
          sceneDescription: "Map-like street with park, shop, school and house.",
          followUpQuestions: ["Where is the park?", "Where is your house?"],
          suggestedAnswers: ["The park is next to the school.", "My house is behind the park."],
          assessmentCriteria: ["Uses where question or answer", "Uses next to/behind/in front of", "Intelligible"],
        },
        apply: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["Someone asks: Where is the bus stop? You say:", "It is next to the shop.", "Next shop it stop.", "Bus shop next.", "It is next to + nơi.", "Sai cấu trúc", "Quá ngắn", 2],
          ],
        },
      },
    ],
  },
};
