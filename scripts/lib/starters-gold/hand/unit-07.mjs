/**
 * Hand-authored gold content — Unit 7: The Home
 * NO algorithmic generation.
 */
import { UNIT_PASSAGES, UNIT_SCRIPTS } from "../../starters-unit-passages.mjs";

const P7 = UNIT_PASSAGES[7];
const S7 = UNIT_SCRIPTS[7];

function passage(i) {
  const p = P7[i];
  return { ...p, wordCount: p.text.split(/\s+/).filter(Boolean).length };
}

function script(i) {
  return S7[i];
}

export const HAND_UNIT_07 = {
  topic: "the-home",
  lesson0ExtraSpecs: {
    vocabulary: {
      check: {
        type: "mcq",
        label: "Rooms and Furniture Quiz",
        instructions: "No hints — choose the best answer.",
        tuples: [
          ["You sleep on a _____.", "bed", "table", "lamp", "Bed (giường) dùng để ngủ.", "Bàn — không ngủ trên bàn", "Đèn — không phải nơi ngủ", 2],
          ["Mother cooks in the _____.", "kitchen", "bedroom", "bathroom", "Kitchen là nhà bếp — nơi nấu ăn.", "Phòng ngủ — để ngủ", "Phòng tắm — để tắm", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Home Words in Sentences",
        questionText: "Complete with room or furniture words.",
        explanation: "bedroom cho phòng ngủ; sofa cho ghế ngồi.",
        template: "I sleep in my [0]. We sit on the [1].",
        correctAnswers: ["bedroom", "sofa"],
      },
    },
    grammar: {
      check: {
        type: "mcq",
        label: "There Is / There Are Quiz",
        tuples: [
          ["_____ a lamp in my room.", "There is", "There are", "They are", "Một đèn → There is + danh từ số ít.", "There are cho số nhiều", "They are không dùng mô tả vật", 2],
          ["_____ two books under the table.", "There are", "There is", "It is", "Hai cuốn sách → There are + số nhiều.", "There is cho số ít", "It is không mô tả số lượng", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Complete There Is / Are",
        explanation: "There is + số ít; There are + số nhiều.",
        template: "[0] a bed in the bedroom. [1] four chairs in the kitchen.",
        correctAnswers: ["There is", "There are"],
      },
    },
    reading: {
      practice: {
        type: "reading",
        label: "Find Things in the Bedroom",
        passage: passage(0),
        tuples: [
          ["Where is the bag?", "On the chair", "Under the bed", "On the table", "My bag is on the chair.", "Giày ở dưới giường", "Sách dưới bàn", 1],
          ["Where are the shoes?", "Under the bed", "On the chair", "On the table", "My shoes are under the bed.", "Túi trên ghế", "Sách dưới bàn", 1],
        ],
      },
      check: {
        type: "reading",
        label: "My Bedroom Details",
        passage: passage(0),
        tuples: [
          ["How many books are under the table?", "Two", "One", "Four", "There are two books under the table.", "Một cuốn", "Bốn ghế", 2],
          ["Is the door open or closed?", "Open", "Closed", "Broken", "The door is open.", "Không nói đóng", "Không có trong bài", 2],
        ],
      },
      apply: {
        type: "mcq",
        label: "Bedroom Facts",
        tuples: [
          ["The window is _____.", "big", "small", "under", "The window is big.", "Bài nói cửa sổ lớn", "Under là giới từ vị trí", 2],
        ],
      },
    },
    listening: {
      practice: {
        type: "listening",
        label: "Listen for Places",
        script: script(0),
        answerKey: ["chair", "bed"],
        tuples: [
          ["Where is Anna's bag?", "On the chair", "Under the bed", "On the table", "It is on the chair.", "Giày dưới giường", "Không nói bàn", 1],
          ["Where are Anna's shoes?", "Under the bed", "On the chair", "In the kitchen", "They are under the bed.", "Túi trên ghế", "Không ở bếp", 1],
        ],
      },
      check: {
        type: "listening",
        label: "Where Is My Bag?",
        script: script(0),
        answerKey: ["chair", "bed"],
        tuples: [
          ["Who asks about the bag?", "Anna", "Mother", "Teacher", "Anna: Where is my bag?", "Mẹ trả lời", "Không có giáo viên", 2],
          ["Who says the shoes are under the bed?", "Mother", "Anna", "Father", "Mother: They are under the bed.", "Anna hỏi", "Không có bố", 2],
        ],
      },
      apply: {
        type: "matching",
        label: "Match What You Heard",
        questionText: "Match items to places.",
        explanation: "Ghép đồ vật với vị trí trong hội thoại.",
        pairs: [
          { left: "bag", right: "on the chair" },
          { left: "shoes", right: "under the bed" },
        ],
      },
    },
    writing: {
      learn: {
        type: "mcq",
        label: "Choose Correct Writing",
        tuples: [
          ["Best sentence about a room:", "There is a bed in my bedroom.", "A bed there is bedroom.", "Bedroom a bed there.", "There is + vật + in + phòng.", "Sai trật tự", "Không thành câu", 1],
          ["Best preposition phrase:", "The lamp is on the table.", "The lamp on is table.", "On table lamp the is.", "On the table — trên bàn.", "Sai trật tự", "Sai", 1],
        ],
      },
      practice: {
        type: "gap_fill",
        label: "Complete Home Sentences",
        explanation: "There is + đồ vật; on/under cho vị trí.",
        template: "[0] a lamp on the table. My shoes are [1] the bed.",
        correctAnswers: ["There is", "under"],
      },
      check: {
        type: "writing",
        label: "Write About Your Room",
        taskDescription: "Write two sentences about things in your room.",
        prompts: ["Write: There is a ___ in my room.", "Write where something is (on/under/in)."],
        minWords: 6,
        modelAnswers: ["There is a bed in my room.", "My bag is on the chair."],
        rubric: ["Uses There is/There are", "Uses a preposition correctly"],
        successCriteria: ["Room sentence", "Place sentence"],
        autoCheckKeywords: ["There is", "There are", "on", "under", "in", "bedroom"],
      },
      apply: {
        type: "mcq",
        label: "Best Written Sentence",
        tuples: [
          ["Which sentence is best?", "There are two books on the table.", "Two books there are table.", "Books two on table.", "There are + số + danh từ + giới từ.", "Sai trật tự", "Thiếu There are", 2],
        ],
      },
    },
    speaking: {
      learn: {
        type: "mcq",
        label: "Choose What to Say",
        tuples: [
          ["Someone asks: Where is your bag? You say:", "It is on the chair.", "On chair it.", "Bag chair on.", "It is + on + vị trí.", "Sai trật tự", "Không thành câu", 1],
          ["You see a bed. You say:", "There is a bed.", "A bed there.", "Bed is there a.", "There is + danh từ.", "Sai", "Sai trật tự", 1],
        ],
      },
      practice: {
        type: "mcq",
        label: "Ask About Location",
        tuples: [
          ["You want to know where shoes are. You ask:", "Where are my shoes?", "Where is my shoes?", "Shoes where my?", "Shoes số nhiều → Where are.", "Shoes số nhiều cần are", "Sai trật tự", 1],
        ],
      },
      check: {
        type: "speaking",
        label: "Describe Your Room",
        prompt: "Say what is in your room and where two things are.",
        pictureDescription: "A bedroom with bed, lamp, chair, bag and books.",
        followUpQuestions: ["What is in your room?", "Where is your bag?"],
        suggestedAnswers: ["There is a bed and a lamp.", "My bag is on the chair."],
        assessmentCriteria: ["Uses There is/are", "Uses on/under/in", "Clear short phrases"],
      },
      apply: {
        type: "mcq",
        label: "What to Say",
        tuples: [
          ["Mother asks: Where are your shoes? You say:", "They are under the bed.", "Under bed they.", "Shoes under.", "They are + under + vị trí.", "Sai cấu trúc", "Quá ngắn", 2],
        ],
      },
    },
  },
  lessons: {
    vocabulary: [
      null,
      {
        slug: "vocab-home-rooms",
        title: "Lesson 2: Rooms in the Home",
        learningObjective: "Name rooms in a home: kitchen, bedroom, bathroom and living room.",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "Room Names",
          tuples: [
            ["We cook food in the _____.", "kitchen", "bedroom", "bathroom", "Kitchen — nhà bếp.", "Phòng ngủ", "Phòng tắm", 1],
            ["I sleep in my _____.", "bedroom", "kitchen", "fridge", "Bedroom — phòng ngủ.", "Nhà bếp", "Tủ lạnh không phải phòng", 1],
            ["We watch TV in the _____.", "living room", "bathroom", "cupboard", "Living room — phòng khách.", "Phòng tắm", "Tủ đựng đồ", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Rooms",
          questionText: "Match each room to what you do there.",
          explanation: "Mỗi phòng có chức năng khác nhau.",
          pairs: [
            { left: "kitchen", right: "cook food" },
            { left: "bedroom", right: "sleep" },
            { left: "bathroom", right: "wash" },
            { left: "living room", right: "sit and watch TV" },
          ],
        },
        check: {
          type: "mcq",
          label: "Room Challenge",
          tuples: [
            ["Which room is for washing?", "bathroom", "kitchen", "living room", "Bathroom — phòng tắm.", "Nhà bếp", "Phòng khách", 2],
            ["Where do we usually eat dinner at home?", "kitchen", "bedroom", "window", "Thường ăn tối ở bếp hoặc gần bếp.", "Phòng ngủ", "Cửa sổ không phải phòng", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete Room Sentences",
          explanation: "Điền tên phòng phù hợp.",
          template: "Mother is in the [0]. I sleep in the [1].",
          correctAnswers: ["kitchen", "bedroom"],
        },
      },
      {
        slug: "vocab-home-furniture",
        title: "Lesson 3: Furniture and Things",
        learningObjective: "Use furniture words: bed, chair, table, sofa, lamp, door and window.",
        estimatedMinutes: 18,
        learn: {
          type: "mcq",
          label: "Furniture Words",
          tuples: [
            ["You sit on a _____.", "chair", "window", "door", "Chair — ghế để ngồi.", "Cửa sổ", "Cửa ra vào", 1],
            ["We put food on the _____.", "table", "lamp", "bed", "Table — bàn để đặt đồ.", "Đèn", "Giường", 1],
            ["Turn on the _____. It is dark.", "lamp", "sofa", "fridge", "Lamp — đèn chiếu sáng.", "Ghế sofa", "Tủ lạnh", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Furniture",
          explanation: "Ghép đồ nội thất với công dụng.",
          pairs: [
            { left: "bed", right: "sleep on it" },
            { left: "sofa", right: "sit comfortably" },
            { left: "window", right: "look outside" },
            { left: "door", right: "go in and out" },
          ],
        },
        check: {
          type: "mcq",
          label: "Furniture Quiz",
          tuples: [
            ["Which is NOT furniture?", "fridge", "table", "chair", "Fridge thường là thiết bị, không phải nội thất ngồi/đặt.", "Bàn là nội thất", "Ghế là nội thất", 2],
            ["Open the _____ to go outside.", "door", "lamp", "sofa", "Door — cửa ra ngoài.", "Đèn", "Ghế sofa", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Sentence Order",
          questionText: "Make a sentence about furniture.",
          explanation: "There is + đồ vật + in + phòng.",
          words: ["There", "is", "a", "sofa", "in", "the", "living", "room."],
        },
      },
    ],
    grammar: [
      null,
      {
        slug: "grammar-there-is-are",
        title: "Lesson 2: There Is and There Are",
        learningObjective: "Use There is and There are to describe things in a room.",
        learn: {
          type: "mcq",
          label: "There Is / There Are",
          tuples: [
            ["_____ a cat on the sofa.", "There is", "There are", "They is", "Một con mèo → There is.", "Số nhiều", "They is sai", 1],
            ["_____ three chairs in the kitchen.", "There are", "There is", "It are", "Ba ghế → There are.", "Số ít", "It are sai", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Fill There Is / Are",
          explanation: "Chọn There is hoặc There are theo số lượng.",
          template: "[0] a lamp in the bedroom. [1] two windows in the living room.",
          correctAnswers: ["There is", "There are"],
        },
        check: {
          type: "mcq",
          label: "There Is / Are Check",
          tuples: [
            ["_____ milk in the fridge.", "There is", "There are", "Are there", "Milk không đếm được → There is.", "There are cho số nhiều", "Are there đảo ngữ — không phải khẳng định", 2],
            ["_____ apples on the table.", "There are", "There is", "Is there", "Apples số nhiều → There are.", "Số ít", "Is there là câu hỏi", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Order the Sentence",
          explanation: "There are + số + danh từ + in + phòng.",
          words: ["There", "are", "four", "chairs", "in", "the", "kitchen."],
        },
      },
      {
        slug: "grammar-prepositions-place",
        title: "Lesson 3: In, On and Under",
        learningObjective: "Use in, on and under to say where things are at home.",
        learn: {
          type: "mcq",
          label: "Prepositions of Place",
          tuples: [
            ["The milk is _____ the fridge.", "in", "on", "under", "In the fridge — bên trong tủ lạnh.", "On — trên mặt", "Under — bên dưới", 1],
            ["The bag is _____ the chair.", "on", "in", "under", "On the chair — trên ghế.", "In — bên trong", "Under — dưới ghế", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Complete Prepositions",
          explanation: "In/on/under theo vị trí thật.",
          template: "The books are [0] the table. The shoes are [1] the bed.",
          correctAnswers: ["on", "under"],
        },
        check: {
          type: "mcq",
          label: "Prepositions Check",
          tuples: [
            ["Mother is _____ the kitchen.", "in", "on", "under", "In the kitchen — ở trong bếp.", "On — trên bề mặt", "Under — dưới bếp", 2],
            ["The cat sleeps _____ the sofa.", "on", "in", "under", "On the sofa — trên ghế sofa.", "In — bên trong sofa", "Under — dưới sofa", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose the Preposition",
          tuples: [
            ["Put the book _____ the table.", "on", "in", "under", "On the table — đặt lên bàn.", "In — bên trong bàn", "Under — dưới bàn", 2],
          ],
        },
      },
    ],
    reading: [
      null,
      {
        slug: "reading-my-bedroom",
        title: "Lesson 2: My Bedroom",
        learningObjective: "Find objects and their locations in a bedroom text.",
        learn: {
          type: "reading",
          label: "Read the Bedroom",
          passage: passage(0),
          tuples: [
            ["What furniture is in the bedroom?", "A bed and a lamp", "A sofa and TV", "A fridge", "There is a bed and a lamp.", "Sofa ở phòng khách", "Fridge ở bếp", 1],
            ["Where is the bag?", "On the chair", "Under the table", "In the fridge", "My bag is on the chair.", "Dưới bàn là sách", "Không có tủ lạnh", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "More Bedroom Details",
          passage: passage(0),
          tuples: [
            ["How many books are there?", "Two", "One", "Three", "There are two books under the table.", "Một cuốn", "Ba cuốn", 1],
            ["What is under the bed?", "Shoes", "Books", "A bag", "My shoes are under the bed.", "Sách dưới bàn", "Túi trên ghế", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Bedroom Check",
          passage: passage(0),
          tuples: [
            ["Is the room big or small?", "Small but nice", "Very big", "Dark and cold", "It is small but nice!", "Bài không nói rất lớn", "Không nói tối lạnh", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete from Text",
          explanation: "Điền từ trong bài đọc.",
          template: "The bag is on the [0]. The shoes are under the [1].",
          correctAnswers: ["chair", "bed"],
        },
      },
      {
        slug: "reading-kitchen-living",
        title: "Lesson 3: Kitchen and Living Room",
        learningObjective: "Read for food, furniture and locations in kitchen and living room texts.",
        learn: {
          type: "reading",
          label: "Read the Kitchen",
          passage: passage(1),
          tuples: [
            ["Where is the milk?", "In the fridge", "On the table", "In the cupboard", "The milk is in the fridge.", "Táo trên bàn", "Gạo trong tủ", 1],
            ["How many chairs are there?", "Four", "Two", "Three", "There is a table and four chairs.", "Hai ghế", "Ba ghế", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Read the Living Room",
          passage: passage(2),
          tuples: [
            ["Where does the cat sleep?", "On the sofa", "On the table", "Under the bed", "My cat sleeps on the sofa.", "TV trên bàn", "Không có giường", 1],
            ["Where is the TV?", "On the table", "On the sofa", "Near the door", "The TV is on the table.", "Mèo trên sofa", "Giày trước cửa", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Living Room Check",
          passage: passage(2),
          tuples: [
            ["Where are the shoes?", "In front of the door", "On the sofa", "Under the table", "My shoes are in front of the door.", "Trên sofa", "Dưới bàn", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Best Summary",
          tuples: [
            ["The living room text is mainly about _____.", "furniture and a cat at home", "school and teachers", "sports in the park", "Bài mô tả sofa, TV, mèo ở nhà.", "Chủ đề trường học", "Chủ đề thể thao", 2],
          ],
        },
      },
    ],
    listening: [
      null,
      {
        slug: "listening-where-things-are",
        title: "Lesson 2: Where Are Things?",
        learningObjective: "Understand questions and answers about where things are at home.",
        learn: {
          type: "listening",
          label: "Bag and Shoes",
          script: script(0),
          answerKey: ["chair", "bed"],
          tuples: [
            ["What does Anna look for first?", "Her bag", "Her shoes", "Her book", "Where is my bag?", "Giày hỏi sau", "Không hỏi sách", 1],
            ["Where is the bag?", "On the chair", "Under the bed", "In the kitchen", "It is on the chair.", "Giày dưới giường", "Không ở bếp", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Kitchen Dialogue",
          script: script(1),
          answerKey: ["fridge", "table"],
          tuples: [
            ["Where is the milk?", "In the fridge", "On the table", "In the cupboard", "There is milk in the fridge.", "Táo trên bàn", "Gạo trong tủ", 1],
            ["What does Mother ask Ben to do?", "Close the door", "Open the window", "Turn off the lamp", "Close the door, please.", "Không mở cửa sổ", "Đèn đang bật — không tắt", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Home Locations Check",
          script: script(0),
          answerKey: ["chair", "bed"],
          tuples: [
            ["Where does the dialogue happen?", "Bedroom", "Kitchen", "Park", "Setting: Bedroom.", "Bếp là script khác", "Không có công viên", 2],
          ],
        },
        apply: {
          type: "matching",
          label: "Match Places",
          explanation: "Ghép đồ vật với vị trí nghe được.",
          pairs: [
            { left: "bag", right: "on the chair" },
            { left: "milk", right: "in the fridge" },
            { left: "apples", right: "on the table" },
          ],
        },
      },
      {
        slug: "listening-home-instructions",
        title: "Lesson 3: Tidy the Room",
        learningObjective: "Follow simple instructions about objects in a room.",
        learn: {
          type: "listening",
          label: "Tidy Up",
          script: script(2),
          answerKey: ["table", "window"],
          tuples: [
            ["Where should Mai put the book?", "On the table", "Under the chair", "In the box", "Put the book on the table.", "Đồ chơi dưới ghế", "Hộp đựng sau", 1],
            ["Where is the sofa?", "Near the window", "In the kitchen", "Under the bed", "The sofa is near the window.", "Không ở bếp", "Không dưới giường", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Instructions",
          script: script(2),
          answerKey: ["table", "window"],
          tuples: [
            ["What is under the chair?", "Toys", "Books", "Shoes", "There are toys under the chair.", "Sách trên bàn", "Giày không nhắc", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Instructions Check",
          script: script(2),
          answerKey: ["table", "window"],
          tuples: [
            ["Who gives instructions?", "Father", "Mai", "Teacher", "Father tells Mai what to do.", "Mai làm theo", "Không có giáo viên", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose What You Heard",
          tuples: [
            ["Mai puts toys _____.", "in the box", "on the table", "under the bed", "I put them in the box!", "Sách trên bàn", "Không dưới giường", 2],
          ],
        },
      },
    ],
    writing: [
      null,
      {
        slug: "writing-describe-room",
        title: "Lesson 2: Write About a Room",
        learningObjective: "Write short sentences with There is/are and home words.",
        learn: {
          type: "mcq",
          label: "Choose Correct Writing",
          tuples: [
            ["Best sentence:", "There is a lamp in my bedroom.", "A lamp bedroom there is.", "In bedroom lamp a.", "There is + vật + in + phòng.", "Sai trật tự", "Không thành câu", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write Home Sentences",
          explanation: "Viết câu mô tả phòng.",
          template: "[0] a bed in my room. [1] two books on the table.",
          correctAnswers: ["There is", "There are"],
        },
        check: {
          type: "writing",
          label: "Write Your Bedroom",
          taskDescription: "Write two sentences about your bedroom.",
          prompts: ["Write: There is a ___ in my bedroom.", "Write where something is (on/under/in)."],
          minWords: 6,
          modelAnswers: ["There is a bed in my bedroom.", "My lamp is on the table."],
          rubric: ["Uses There is or There are", "Uses a home word correctly"],
          successCriteria: ["Room description", "Location phrase"],
          autoCheckKeywords: ["There is", "There are", "bedroom", "on", "under"],
        },
        apply: {
          type: "mcq",
          label: "Fix the Sentence",
          tuples: [
            ["Which needs fixing?", "There are a chair.", "There is a chair.", "A chair there is.", "Một ghế → There is a chair.", "Đây là câu đúng", "Sai trật tự", 2],
          ],
        },
      },
      {
        slug: "writing-home-sentences",
        title: "Lesson 3: Write About the Kitchen",
        learningObjective: "Write sentences about food and furniture with prepositions.",
        learn: {
          type: "mcq",
          label: "Prepositions in Writing",
          tuples: [
            ["The apples are _____ the table.", "on", "in", "under", "On the table — trên bàn.", "In — bên trong", "Under — dưới bàn", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Best Kitchen Sentence",
          tuples: [
            ["Which is correct?", "The milk is in the fridge.", "The milk in fridge is.", "In fridge milk the.", "The + danh từ + is in + nơi.", "Sai trật tự", "Sai", 1],
          ],
        },
        check: {
          type: "writing",
          label: "Write About the Kitchen",
          taskDescription: "Write about food and furniture in a kitchen.",
          prompts: ["Write where food is (in/on).", "Write: There are ___ chairs."],
          minWords: 5,
          modelAnswers: ["The milk is in the fridge.", "There are four chairs."],
          rubric: ["Uses in or on", "Uses There are or food word"],
          successCriteria: ["Food location", "Furniture sentence"],
          autoCheckKeywords: ["in", "on", "fridge", "table", "There are", "chairs"],
        },
        apply: {
          type: "ordering",
          label: "Order Home Sentence",
          explanation: "There are + số + danh từ + in + phòng.",
          words: ["There", "are", "apples", "on", "the", "table."],
        },
      },
    ],
    speaking: [
      null,
      {
        slug: "speaking-where-things-are",
        title: "Lesson 2: Say Where Things Are",
        learningObjective: "Ask and answer where things are at home.",
        learn: {
          type: "mcq",
          label: "Choose a Reply",
          tuples: [
            ["Mother asks: Where is your bag? You say:", "It is on the chair.", "On chair bag.", "Bag chair.", "It is + on + vị trí.", "Sai trật tự", "Không thành câu", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Ask a Question",
          tuples: [
            ["You want to know where books are. You ask:", "Where are the books?", "Where is the books?", "Books where are?", "Books số nhiều → Where are.", "Books cần are", "Sai trật tự", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Describe Locations",
          prompt: "Say where your bag and shoes are at home.",
          pictureDescription: "Bedroom with bag on a chair and shoes under a bed.",
          followUpQuestions: ["Where is your bag?", "Where are your shoes?"],
          suggestedAnswers: ["My bag is on the chair.", "My shoes are under the bed."],
          assessmentCriteria: ["Uses on/under", "Clear location phrases", "Intelligible"],
        },
        apply: {
          type: "mcq",
          label: "Polite Reply",
          tuples: [
            ["Father asks: Where are the toys? Best reply:", "They are under the chair.", "Under chair.", "Toys under chair they.", "They are + vị trí — câu đầy đủ.", "Quá ngắn", "Sai trật tự", 2],
          ],
        },
      },
      {
        slug: "speaking-describe-home",
        title: "Lesson 3: Describe Your Home",
        learningObjective: "Say what rooms and furniture you have at home.",
        learn: {
          type: "mcq",
          label: "Say About Rooms",
          tuples: [
            ["Best sentence:", "There is a sofa in the living room.", "Sofa living room there.", "In living sofa.", "There is + đồ vật + in + phòng.", "Sai trật tự", "Sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Say About Furniture",
          tuples: [
            ["You see a lamp. You say:", "There is a lamp.", "A lamp there.", "Lamp is there.", "There is + danh từ.", "Sai trật tự", "Sai", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Talk About Your Home",
          prompt: "Say two rooms in your home and one thing in each room.",
          pictureDescription: "House cutaway showing kitchen, bedroom and living room.",
          followUpQuestions: ["What rooms do you have?", "What is in your kitchen?"],
          suggestedAnswers: ["I have a kitchen and a bedroom.", "There is a fridge in the kitchen."],
          assessmentCriteria: ["Names rooms", "Uses There is/are", "Short clear phrases"],
        },
        apply: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["Someone asks: What is in your bedroom? You say:", "There is a bed and a lamp.", "Bed lamp bedroom.", "A bed there lamp.", "There is + liệt kê đồ vật.", "Sai", "Sai trật tự", 2],
          ],
        },
      },
    ],
  },
};
