/**
 * Hand-authored gold content — Unit 9: Sports and Leisure
 * NO algorithmic generation.
 */
import { UNIT_PASSAGES, UNIT_SCRIPTS } from "../../starters-unit-passages.mjs";

const P9 = UNIT_PASSAGES[9];
const S9 = UNIT_SCRIPTS[9];

function passage(i) {
  const p = P9[i];
  return { ...p, wordCount: p.text.split(/\s+/).filter(Boolean).length };
}

function script(i) {
  return S9[i];
}

export const HAND_UNIT_09 = {
  topic: "sports-and-leisure",
  lesson0ExtraSpecs: {
    vocabulary: {
      check: {
        type: "mcq",
        label: "Sports and Games Quiz",
        instructions: "No hints — choose the best answer.",
        tuples: [
          ["You kick a _____ in football.", "ball", "bike", "pool", "Ball (quả bóng) — đá trong bóng đá.", "Xe đạp — không đá", "Hồ bơi — nơi bơi", 2],
          ["I can _____ in the pool.", "swim", "run", "kick", "Swim — bơi trong hồ.", "Run — chạy", "Kick — đá bóng", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Sports Words in Sentences",
        questionText: "Complete with sports words.",
        explanation: "football/tennis cho môn; ball cho dụng cụ.",
        template: "I play [0] with my friends. We use a [1].",
        correctAnswers: ["football", "ball"],
      },
    },
    grammar: {
      check: {
        type: "mcq",
        label: "Can and Play Quiz",
        tuples: [
          ["I _____ swim well.", "can", "cans", "swimming", "Can + động từ nguyên mẫu — khả năng.", "Cans không tồn tại", "Swimming không đi sau can", 2],
          ["We _____ football after school.", "play", "plays", "playing", "We play — số nhiều không có -s.", "Plays cho he/she", "Playing không đúng", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Complete Can and Play",
        explanation: "Can + động từ; play + môn thể thao.",
        template: "She [0] play tennis. I [1] football every day.",
        correctAnswers: ["can", "play"],
      },
    },
    reading: {
      practice: {
        type: "reading",
        label: "Find Sports in the Text",
        passage: passage(0),
        tuples: [
          ["Who can run fast?", "Tom", "Anna", "Ben", "Tom can run fast.", "Anna bơi giỏi", "Ben đạp xe", 1],
          ["What sport uses a ball for many games?", "Many games at Sports Day", "Only tennis", "Only swimming", "We use a ball for many games.", "Không chỉ tennis", "Bơi không dùng bóng chính", 1],
        ],
      },
      check: {
        type: "reading",
        label: "Sports Day Details",
        passage: passage(0),
        tuples: [
          ["Who can swim well?", "Anna", "Tom", "Ben", "Anna can swim well.", "Tom chạy nhanh", "Ben đạp xe", 2],
          ["What does Ben do?", "Rides his bike", "Plays tennis", "Swims in the pool", "Ben rides his bike.", "Tennis của bạn", "Bơi của Anna", 2],
        ],
      },
      apply: {
        type: "mcq",
        label: "Sports Day Facts",
        tuples: [
          ["When is Sports Day?", "Today at school", "On Sunday at home", "Never", "Today is Sports Day at school.", "Chủ nhật ở nhà", "Không có", 2],
        ],
      },
    },
    listening: {
      practice: {
        type: "listening",
        label: "Listen for Abilities",
        script: script(0),
        answerKey: ["swim", "football"],
        tuples: [
          ["Can Mai swim?", "Yes", "No", "Not said", "Mai: Yes, I can swim!", "Mai nói có thể", "Có nói rõ", 1],
          ["Can Tom play football?", "Yes", "No", "Not sure", "Yes! He can run fast too.", "Tom chơi được", "Không chắc", 1],
        ],
      },
      check: {
        type: "listening",
        label: "Can You Swim?",
        script: script(0),
        answerKey: ["swim", "football"],
        tuples: [
          ["Who asks about swimming?", "Coach", "Mai", "Tom", "Coach: Can you swim, Mai?", "Mai trả lời", "Tom không hỏi", 2],
          ["What else can Tom do?", "Run fast", "Swim well", "Ride a bike", "He can run fast too.", "Bơi là Mai", "Xe đạp không nhắc", 2],
        ],
      },
      apply: {
        type: "matching",
        label: "Match Abilities",
        questionText: "Match people to what they can do.",
        explanation: "Ghép người với khả năng nghe được.",
        pairs: [
          { left: "Mai", right: "can swim" },
          { left: "Tom", right: "can play football and run fast" },
        ],
      },
    },
    writing: {
      learn: {
        type: "mcq",
        label: "Choose Correct Writing",
        tuples: [
          ["Best sentence about ability:", "I can play football.", "Football I can play.", "Can play I football.", "I can + play + môn.", "Sai trật tự", "Sai", 1],
          ["Best leisure sentence:", "I ride my bike every day.", "Bike my ride every.", "Every day bike ride I.", "I ride my bike — cấu trúc chuẩn.", "Sai trật tự", "Sai", 1],
        ],
      },
      practice: {
        type: "gap_fill",
        label: "Complete Sports Sentences",
        explanation: "Can + động từ; play + môn.",
        template: "I [0] swim. We [1] tennis on Saturday.",
        correctAnswers: ["can", "play"],
      },
      check: {
        type: "writing",
        label: "Write About a Sport",
        taskDescription: "Write what sport you can play or do.",
        prompts: ["Write: I can ___. ", "Write one sport you play."],
        minWords: 4,
        modelAnswers: ["I can swim.", "I play football."],
        rubric: ["Uses can or play", "Uses a sport word"],
        successCriteria: ["Ability sentence", "Sport word"],
        autoCheckKeywords: ["can", "play", "football", "tennis", "swim", "run", "bike"],
      },
      apply: {
        type: "mcq",
        label: "Best Written Sentence",
        tuples: [
          ["Which sentence is best?", "She can run very fast.", "She runs can very fast.", "Can she run very.", "She can + động từ + trạng từ.", "Sai trật tự", "Không thành câu", 2],
        ],
      },
    },
    speaking: {
      learn: {
        type: "mcq",
        label: "Choose What to Say",
        tuples: [
          ["Someone asks: Can you swim? You say:", "Yes, I can swim!", "Yes, swim I can.", "Swim yes can.", "Yes, I can + động từ.", "Sai trật tự", "Không thành câu", 1],
          ["You want to play football. You say:", "Let's play football!", "Football play let's!", "Play football let.", "Let's play + môn — đề nghị chơi.", "Sai trật tự", "Sai", 1],
        ],
      },
      practice: {
        type: "mcq",
        label: "Ask About Ability",
        tuples: [
          ["You want to know if someone can ride a bike. You ask:", "Can you ride a bike?", "You can ride a bike?", "Ride bike you can?", "Can you + động từ? — câu hỏi chuẩn.", "Không phải câu hỏi", "Sai trật tự", 1],
        ],
      },
      check: {
        type: "speaking",
        label: "Say What You Can Do",
        prompt: "Say two sports or activities you can do.",
        pictureDescription: "Children playing football, swimming and riding bikes.",
        followUpQuestions: ["Can you swim?", "What sport do you play?"],
        suggestedAnswers: ["Yes, I can swim.", "I play football."],
        assessmentCriteria: ["Uses can or play", "Names sports clearly", "Short phrases"],
      },
      apply: {
        type: "mcq",
        label: "What to Say",
        tuples: [
          ["Friend says: Let's play tennis! You say:", "OK!", "No swim.", "Can bike.", "OK! — đồng ý chơi.", "Không liên quan", "Không liên quan", 2],
        ],
      },
    },
  },
  lessons: {
    vocabulary: [
      null,
      {
        slug: "vocab-sports-names",
        title: "Lesson 2: Sports Names",
        learningObjective: "Name sports: football, tennis, swim, run and sport.",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "Sports Vocabulary",
          tuples: [
            ["You play this with a ball and kick it.", "football", "tennis", "swim", "Football — bóng đá, đá bóng.", "Tennis — vợt", "Swim — bơi", 1],
            ["You hit a ball over a net.", "tennis", "football", "run", "Tennis — quần vợt.", "Football — đá bóng", "Run — chạy", 1],
            ["Moving fast on your feet is to _____.", "run", "swim", "kick", "Run — chạy.", "Swim — bơi", "Kick — đá", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Sports",
          questionText: "Match each sport to where you do it.",
          explanation: "Ghép môn với địa điểm.",
          pairs: [
            { left: "football", right: "in the park or field" },
            { left: "swim", right: "in the pool" },
            { left: "tennis", right: "on a court" },
            { left: "run", right: "in the garden or park" },
          ],
        },
        check: {
          type: "mcq",
          label: "Sports Challenge",
          tuples: [
            ["Which is a sport with water?", "swim", "football", "tennis", "Swim — bơi trong nước.", "Football — trên cạn", "Tennis — sân vợt", 2],
            ["Football is my favourite _____.", "sport", "bike", "game only", "Sport — môn thể thao.", "Bike — phương tiện", "Game rộng hơn sport ở đây", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete Sport Sentences",
          explanation: "Điền tên môn thể thao.",
          template: "I play [0] after school. Anna likes [1].",
          correctAnswers: ["football", "tennis"],
        },
      },
      {
        slug: "vocab-games-and-gear",
        title: "Lesson 3: Games, Ball and Bike",
        learningObjective: "Use ball, game, bike, play and kick in sports contexts.",
        estimatedMinutes: 18,
        learn: {
          type: "mcq",
          label: "Games and Gear",
          tuples: [
            ["Kick the _____!", "ball", "bike", "sport", "Ball — quả bóng để đá.", "Xe đạp", "Môn thể thao", 1],
            ["This is a fun _____.", "game", "run", "swim", "Game — trò chơi.", "Run — chạy", "Swim — bơi", 1],
            ["I ride my _____ every day.", "bike", "ball", "tennis", "Bike — xe đạp.", "Bóng", "Tennis — môn", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Actions",
          explanation: "Ghép hành động với dụng cụ.",
          pairs: [
            { left: "kick", right: "the ball" },
            { left: "ride", right: "a bike" },
            { left: "play", right: "a game" },
            { left: "jump", right: "high in sports" },
          ],
        },
        check: {
          type: "mcq",
          label: "Gear Quiz",
          tuples: [
            ["What do you need for football?", "A ball", "A bike", "A pool", "Football cần bóng.", "Xe đạp cho đạp xe", "Hồ cho bơi", 2],
            ["Which word means chơi?", "play", "kick", "run", "Play — chơi.", "Kick — đá", "Run — chạy", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Sentence Order",
          questionText: "Make a sentence about a game.",
          explanation: "This + is + a + fun + game.",
          words: ["This", "is", "a", "fun", "game."],
        },
      },
    ],
    grammar: [
      null,
      {
        slug: "grammar-can-ability",
        title: "Lesson 2: Can for Ability",
        learningObjective: "Use can and can't to talk about what you are able to do.",
        learn: {
          type: "mcq",
          label: "Can for Ability",
          tuples: [
            ["I _____ ride a bike.", "can", "cans", "riding", "Can + động từ nguyên mẫu.", "Cans không có", "Riding không đi sau can", 1],
            ["She _____ swim — she is afraid of water.", "can't", "can", "cans", "Can't = cannot — phủ định khả năng.", "Can — khẳng định", "Cans sai", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Fill Can / Can't",
          explanation: "Can/can't theo khả năng thật.",
          template: "Tom [0] run fast. My sister [1] swim.",
          correctAnswers: ["can", "can't"],
        },
        check: {
          type: "mcq",
          label: "Can Check",
          tuples: [
            ["_____ you play tennis?", "Can", "Do", "Are", "Can you + động từ? — hỏi khả năng.", "Do you play — cũng được nhưng Can hỏi ability trực tiếp", "Are không đi với play", 2],
            ["He _____ jump very high.", "can", "cans", "jumping", "He can jump — ngôi thứ ba vẫn dùng can.", "Cans sai", "Jumping sai", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Order the Question",
          explanation: "Can + you + động từ?",
          words: ["Can", "you", "swim?"],
        },
      },
      {
        slug: "grammar-play-and-go",
        title: "Lesson 3: Play and Go",
        learningObjective: "Use play with sports and go with activities correctly.",
        learn: {
          type: "mcq",
          label: "Play and Go",
          tuples: [
            ["We _____ football in the park.", "play", "plays", "playing", "We play — số nhiều.", "Plays cho he/she", "Playing không đúng", 1],
            ["They _____ swimming on Sunday.", "go", "goes", "going", "Go swimming — go + activity.", "Goes cho he/she", "Going không đúng", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Complete Play and Go",
          explanation: "Play + môn; go + swimming.",
          template: "I [0] tennis. We [1] swimming in the pool.",
          correctAnswers: ["play", "go"],
        },
        check: {
          type: "mcq",
          label: "Play / Go Check",
          tuples: [
            ["She _____ tennis well.", "plays", "play", "go", "She plays — ngôi thứ ba có -s.", "Play không có -s", "Go không đi với tennis", 2],
            ["Let's _____ a game!", "play", "go", "plays", "Play a game — chơi trò.", "Go a game sai", "Plays sai", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose the Verb",
          tuples: [
            ["We _____ football after school.", "play", "go", "plays", "Play football — cụm cố định.", "Go football sai", "Plays sai với we", 2],
          ],
        },
      },
    ],
    reading: [
      null,
      {
        slug: "reading-sports-day",
        title: "Lesson 2: Sports Day",
        learningObjective: "Match activities to people in a sports day text.",
        learn: {
          type: "reading",
          label: "Read Sports Day",
          passage: passage(0),
          tuples: [
            ["What can the writer play?", "Football", "Tennis only", "Nothing", "I can play football.", "Chỉ tennis", "Có thể chơi", 1],
            ["Who likes tennis?", "The writer's friend", "Tom", "Ben", "My friend likes tennis.", "Tom chạy", "Ben đạp xe", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "More Sports Day Facts",
          passage: passage(0),
          tuples: [
            ["What do they use for many games?", "A ball", "A bike", "A computer", "We use a ball for many games.", "Xe đạp của Ben", "Máy tính ở bài khác", 1],
            ["Are sports fun?", "Yes", "No", "Not said", "Sports are fun!", "Bài nói fun", "Có nói", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Sports Day Check",
          passage: passage(0),
          tuples: [
            ["Where is Sports Day?", "At school", "At home", "In the shop", "Today is Sports Day at school.", "Ở nhà", "Cửa hàng", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete from Text",
          explanation: "Điền tên người hoặc môn.",
          template: "[0] can run fast. [1] can swim well.",
          correctAnswers: ["Tom", "Anna"],
        },
      },
      {
        slug: "reading-weekend-sports",
        title: "Lesson 3: Weekend and After School",
        learningObjective: "Understand when and where leisure activities happen in texts.",
        learn: {
          type: "reading",
          label: "Read Weekend Fun",
          passage: passage(1),
          tuples: [
            ["When do they play football?", "Saturday", "Sunday", "Monday", "On Saturday I play football in the park.", "Chủ nhật bơi", "Thứ Hai", 1],
            ["Who can't swim?", "The writer's sister", "The writer", "Father", "My sister can't swim.", "Tác giả bơi được", "Bố chạy", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Read After School",
          passage: passage(2),
          tuples: [
            ["What time does school finish?", "Three o'clock", "Eight o'clock", "Four o'clock", "School finishes at three o'clock.", "Tám giờ", "Bốn giờ", 1],
            ["What does the brother play?", "Tennis", "Football", "Computer games only", "My brother plays tennis.", "Tác giả đá bóng", "Chỉ máy tính", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Weekend Check",
          passage: passage(1),
          tuples: [
            ["What does Father do every morning?", "Runs", "Swims", "Plays tennis", "Father runs every morning.", "Bơi", "Tennis", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Best Summary",
          tuples: [
            ["The after-school text is about _____.", "playing sports and games after school", "eating lunch at school", "going to the shop", "Bài về chơi thể thao sau giờ học.", "Ăn trưa", "Đi mua sắm", 2],
          ],
        },
      },
    ],
    listening: [
      null,
      {
        slug: "listening-can-you",
        title: "Lesson 2: Can You…?",
        learningObjective: "Identify abilities from short sports dialogues.",
        learn: {
          type: "listening",
          label: "Swimming Pool",
          script: script(0),
          answerKey: ["swim", "football"],
          tuples: [
            ["Can Mai swim?", "Yes", "No", "Maybe", "Yes, I can swim!", "Mai nói có", "Không do dự", 1],
            ["Can Tom play football?", "Yes", "No", "Not said", "Yes! He can run fast too.", "Tom chơi được", "Có nói", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "After School Sports",
          script: script(1),
          answerKey: ["football", "bike"],
          tuples: [
            ["What do Ben and Lily want to play?", "Football", "Tennis", "Swimming", "Let's play football!", "Tennis không nhắc", "Bơi không nhắc", 1],
            ["Can Lily ride a bike?", "Yes", "No", "Not said", "Yes! I ride my bike every day.", "Lily đạp được", "Có nói", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Abilities Check",
          script: script(0),
          answerKey: ["swim", "football"],
          tuples: [
            ["Where does the first dialogue happen?", "Swimming pool", "Football field", "Classroom", "Setting: Swimming pool.", "Sân bóng", "Lớp học", 2],
          ],
        },
        apply: {
          type: "matching",
          label: "Match People and Sports",
          explanation: "Ghép người với môn/khả năng.",
          pairs: [
            { left: "Mai", right: "can swim" },
            { left: "Tom", right: "can play football" },
            { left: "Lily", right: "can ride a bike" },
          ],
        },
      },
      {
        slug: "listening-sports-day",
        title: "Lesson 3: Sports Day Commands",
        learningObjective: "Identify sports actions from a Sports Day dialogue.",
        learn: {
          type: "listening",
          label: "Sports Day",
          script: script(2),
          answerKey: ["tree", "tennis"],
          tuples: [
            ["First instruction:", "Run to the tree", "Swim in the pool", "Ride a bike", "Run to the tree!", "Bơi không nhắc", "Xe đạp không nhắc", 1],
            ["Second instruction:", "Play tennis", "Play football", "Jump high", "Now play tennis!", "Bóng đá", "Nhảy", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Actions",
          script: script(2),
          answerKey: ["tree", "tennis"],
          tuples: [
            ["How do the children feel?", "It is fun", "It is boring", "They are sad", "This game is fun!", "Không nhàm chán", "Không buồn", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Sports Day Check",
          script: script(2),
          answerKey: ["tree", "tennis"],
          tuples: [
            ["Who gives instructions?", "Teacher", "Ben", "Coach at pool", "Teacher tells the class.", "Ben không dạy", "Coach ở hội thoại khác", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose What You Heard",
          tuples: [
            ["The teacher says: Well done, _____!", "everyone", "Tom only", "no one", "Well done, everyone!", "Không chỉ Tom", "Không phủ định", 2],
          ],
        },
      },
    ],
    writing: [
      null,
      {
        slug: "writing-sports-ability",
        title: "Lesson 2: Write About Ability",
        learningObjective: "Write sentences with can about sports and activities.",
        learn: {
          type: "mcq",
          label: "Choose Correct Writing",
          tuples: [
            ["Best ability sentence:", "I can play football.", "Football can I play.", "Can play football I.", "I can + play + môn.", "Sai trật tự", "Sai", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write Can Sentences",
          explanation: "Can + động từ cho khả năng.",
          template: "I [0] swim. Tom [1] run fast.",
          correctAnswers: ["can", "can"],
        },
        check: {
          type: "writing",
          label: "Write Two Abilities",
          taskDescription: "Write two things you can do.",
          prompts: ["Write: I can ___.", "Write another: I can ___."],
          minWords: 4,
          modelAnswers: ["I can swim.", "I can ride a bike."],
          rubric: ["Uses can twice", "Uses activity verbs"],
          successCriteria: ["First ability", "Second ability"],
          autoCheckKeywords: ["can", "swim", "run", "play", "ride", "football", "tennis"],
        },
        apply: {
          type: "mcq",
          label: "Fix the Sentence",
          tuples: [
            ["Which needs fixing?", "She can swims well.", "She can swim well.", "She swims can well.", "Can + động từ nguyên mẫu swim.", "Đây là câu đúng", "Sai trật tự", 2],
          ],
        },
      },
      {
        slug: "writing-play-sports",
        title: "Lesson 3: Write About Games",
        learningObjective: "Write play/go sentences about sports and leisure.",
        learn: {
          type: "mcq",
          label: "Play in Writing",
          tuples: [
            ["Best sentence:", "We play football in the park.", "Football we play park in.", "In park football play we.", "We play + môn + nơi.", "Sai trật tự", "Sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Best Game Sentence",
          tuples: [
            ["Which is correct?", "Let's play a game!", "Play a game let's!", "A game play let.", "Let's play — đề nghị.", "Sai trật tự", "Sai", 1],
          ],
        },
        check: {
          type: "writing",
          label: "Write About a Game",
          taskDescription: "Write what game or sport you play and when.",
          prompts: ["Write: I play ___ on ___.", "Write one sport you like."],
          minWords: 5,
          modelAnswers: ["I play football on Saturday.", "I like tennis."],
          rubric: ["Uses play or like", "Names a sport"],
          successCriteria: ["When sentence", "Sport name"],
          autoCheckKeywords: ["play", "football", "tennis", "Saturday", "Sunday", "like"],
        },
        apply: {
          type: "ordering",
          label: "Order Sports Sentence",
          explanation: "I + play + football + after + school.",
          words: ["I", "play", "football", "after", "school."],
        },
      },
    ],
    speaking: [
      null,
      {
        slug: "speaking-sports-ability",
        title: "Lesson 2: Say What You Can Do",
        learningObjective: "Answer can questions about sports aloud.",
        learn: {
          type: "mcq",
          label: "Choose a Reply",
          tuples: [
            ["Coach asks: Can you swim? You say:", "Yes, I can swim!", "Yes, swim can I.", "Swim yes.", "Yes, I can + động từ.", "Sai trật tự", "Quá ngắn", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Ask About Ability",
          tuples: [
            ["You want to know if friend can run fast. You ask:", "Can you run fast?", "You can run fast?", "Run fast you can?", "Can you + động từ + trạng từ?", "Không phải câu hỏi", "Sai trật tự", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Two Sports",
          prompt: "Say one sport you can play and one you can't.",
          pictureDescription: "Sports field with football, tennis and swimming pool.",
          followUpQuestions: ["Can you play football?", "Can you swim?"],
          suggestedAnswers: ["Yes, I can play football.", "No, I can't swim."],
          assessmentCriteria: ["Uses can/can't", "Names sports", "Clear yes/no"],
        },
        apply: {
          type: "mcq",
          label: "Polite Reply",
          tuples: [
            ["Friend: Let's play football! Best reply:", "OK! Let's go!", "No can.", "Swim bike.", "OK! — đồng ý nhiệt tình.", "Không liên quan", "Không liên quan", 2],
          ],
        },
      },
      {
        slug: "speaking-leisure-talk",
        title: "Lesson 3: Talk About Leisure",
        learningObjective: "Say what you play and do after school.",
        learn: {
          type: "mcq",
          label: "Say About Games",
          tuples: [
            ["Best sentence:", "I ride my bike after school.", "Bike my ride after.", "After school bike ride I.", "I ride my bike — chuẩn.", "Sai trật tự", "Sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Suggest an Activity",
          tuples: [
            ["You want to play tennis. You say:", "Let's play tennis!", "Tennis play let's!", "Play tennis let.", "Let's play + môn.", "Sai trật tự", "Sai", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say After-School Activities",
          prompt: "Say what you do after school and one sport you play.",
          pictureDescription: "Children with ball, bike and tennis racket after school.",
          followUpQuestions: ["What do you do after school?", "What sport do you play?"],
          suggestedAnswers: ["I ride my bike.", "I play football."],
          assessmentCriteria: ["Uses play/ride/run", "Names activity", "Intelligible"],
        },
        apply: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["Someone asks: Do you like sports? You say:", "Yes, I love sports!", "Sports love I yes.", "Love sports.", "Yes, I love + danh từ.", "Sai trật tự", "Quá ngắn", 2],
          ],
        },
      },
    ],
  },
};
