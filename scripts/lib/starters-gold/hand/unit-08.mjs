/**
 * Hand-authored gold content — Unit 8: School
 * NO algorithmic generation.
 */
import { UNIT_PASSAGES, UNIT_SCRIPTS } from "../../starters-unit-passages.mjs";

const P8 = UNIT_PASSAGES[8];
const S8 = UNIT_SCRIPTS[8];

function passage(i) {
  const p = P8[i];
  return { ...p, wordCount: p.text.split(/\s+/).filter(Boolean).length };
}

function script(i) {
  return S8[i];
}

export const HAND_UNIT_08 = {
  topic: "school",
  lesson0ExtraSpecs: {
    vocabulary: {
      check: {
        type: "mcq",
        label: "Classroom Objects Quiz",
        instructions: "No hints — choose the best answer.",
        tuples: [
          ["Open your _____ and read.", "book", "desk", "lesson", "Book (sách) — mở sách để đọc.", "Bàn học — không mở bàn", "Tiết học — không phải vật", 2],
          ["Write with your _____.", "pencil", "classroom", "teacher", "Pencil — bút chì để viết.", "Lớp học — là phòng", "Giáo viên — là người", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "School Words in Sentences",
        questionText: "Complete with school object words.",
        explanation: "pen/bag cho đồ dùng học tập.",
        template: "I have a [0] in my bag. My [1] is on the desk.",
        correctAnswers: ["pen", "book"],
      },
    },
    grammar: {
      check: {
        type: "mcq",
        label: "Imperatives and Have Got Quiz",
        tuples: [
          ["_____ down, please.", "Sit", "Sits", "Sitting", "Sit down — mệnh lệnh dùng động từ nguyên mẫu.", "Sits có -s", "Sitting không phải mệnh lệnh", 2],
          ["I've _____ a pencil in my bag.", "got", "get", "gets", "Have got = có — I've got.", "Get không đi với have", "Gets có -s", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Complete Commands and Have Got",
        explanation: "Open/Close cho mệnh lệnh; got sau have.",
        template: "[0] your book, please. I have [1] two pens.",
        correctAnswers: ["Open", "got"],
      },
    },
    reading: {
      practice: {
        type: "reading",
        label: "Find Classroom Objects",
        passage: passage(0),
        tuples: [
          ["What is the teacher's name?", "Ms Lan", "Tom", "Anna", "Her name is Ms Lan.", "Tom là học sinh", "Anna không có", 1],
          ["How many desks are there?", "Twenty", "Ten", "Three", "There are twenty desks and chairs.", "Mười bàn", "Ba cái bút", 1],
        ],
      },
      check: {
        type: "reading",
        label: "Our Classroom Details",
        passage: passage(0),
        tuples: [
          ["What lesson do they have today?", "English", "Maths", "Science", "We have an English lesson today.", "Không nói toán", "Không nói khoa học", 2],
          ["What does the teacher say to do?", "Open your book", "Close the door", "Run fast", "Open your book, please!", "Đóng cửa ở bài khác", "Không chạy", 2],
        ],
      },
      apply: {
        type: "mcq",
        label: "Classroom Facts",
        tuples: [
          ["What is in the writer's bag?", "A pen, a pencil and a book", "A ball and a bike", "Food and milk", "I have a pen, a pencil and a book in my bag.", "Đồ thể thao", "Đồ ăn", 2],
        ],
      },
    },
    listening: {
      practice: {
        type: "listening",
        label: "Listen for Commands",
        script: script(0),
        answerKey: ["book", "pen"],
        tuples: [
          ["What should students open?", "Their book", "The door", "The window", "Open your book.", "Đóng cửa không nhắc", "Cửa sổ không nhắc", 1],
          ["What should they take?", "Their pen", "Their bag", "Their lunch", "Take your pen.", "Cặp không nhắc", "Bữa trưa không nhắc", 1],
        ],
      },
      check: {
        type: "listening",
        label: "Open Your Book",
        script: script(0),
        answerKey: ["book", "pen"],
        tuples: [
          ["What kind of lesson is it?", "English", "Sports", "Music", "This is an English lesson.", "Thể thao", "Âm nhạc", 2],
          ["What should students write?", "Their name", "A story", "Numbers only", "Write your name.", "Không viết truyện", "Không chỉ số", 2],
        ],
      },
      apply: {
        type: "matching",
        label: "Match Commands",
        questionText: "Match what the teacher says.",
        explanation: "Ghép mệnh lệnh với hành động.",
        pairs: [
          { left: "Sit down", right: "on your chair" },
          { left: "Open your book", right: "read the lesson" },
          { left: "Take your pen", right: "write your name" },
        ],
      },
    },
    writing: {
      learn: {
        type: "mcq",
        label: "Choose Correct Writing",
        tuples: [
          ["Best sentence about school things:", "I have got a pen and a book.", "Got pen I have book.", "Pen book I got.", "I have got + đồ vật.", "Sai trật tự", "Không thành câu", 1],
          ["Best classroom command:", "Open your book, please.", "Your book open please.", "Book open your.", "Open your book — mệnh lệnh lịch sự.", "Sai trật tự", "Sai", 1],
        ],
      },
      practice: {
        type: "gap_fill",
        label: "Complete School Sentences",
        explanation: "Have got + đồ dùng; Open + sách.",
        template: "I have [0] a pencil. [1] your book, please.",
        correctAnswers: ["got", "Open"],
      },
      check: {
        type: "writing",
        label: "Write About Your School Bag",
        taskDescription: "Write what you have in your school bag.",
        prompts: ["Write: I have got a ___ and a ___.", "Write one thing on your desk."],
        minWords: 6,
        modelAnswers: ["I have got a pen and a book.", "My bag is on the desk."],
        rubric: ["Uses have got or school word", "Correct spelling of pen/book/bag"],
        successCriteria: ["Bag contents", "Desk item"],
        autoCheckKeywords: ["have got", "pen", "book", "bag", "pencil", "desk"],
      },
      apply: {
        type: "mcq",
        label: "Best Written Sentence",
        tuples: [
          ["Which sentence is best?", "Close the door, please.", "Door close please the.", "Please door close.", "Close the door — mệnh lệnh đúng.", "Sai trật tự", "Sai", 2],
        ],
      },
    },
    speaking: {
      learn: {
        type: "mcq",
        label: "Choose What to Say",
        tuples: [
          ["Teacher says: Open your book. You _____.", "open your book", "close the door", "run fast", "Làm theo mệnh lệnh — mở sách.", "Đóng cửa", "Chạy", 1],
          ["Friend asks: Have you got a pen? You say:", "Yes, I have got a pen.", "Yes, pen I got.", "Pen yes got.", "Yes, I have got + đồ vật.", "Sai trật tự", "Không thành câu", 1],
        ],
      },
      practice: {
        type: "mcq",
        label: "Give a Command",
        tuples: [
          ["You want someone to sit. You say:", "Sit down, please.", "Down sit please.", "Please sitting down.", "Sit down, please — mệnh lệnh lịch sự.", "Sai trật tự", "Sitting không phải mệnh lệnh", 1],
        ],
      },
      check: {
        type: "speaking",
        label: "Talk About School",
        prompt: "Say what you have in your bag and one classroom command.",
        pictureDescription: "Classroom with desks, bags, books and a teacher.",
        followUpQuestions: ["What have you got in your bag?", "What does the teacher say?"],
        suggestedAnswers: ["I have got a book and two pens.", "Open your book, please."],
        assessmentCriteria: ["Uses have got", "Uses an imperative", "Clear pronunciation"],
      },
      apply: {
        type: "mcq",
        label: "What to Say",
        tuples: [
          ["Someone asks: Do you like school? You say:", "Yes, I like school!", "School like I yes.", "Like school yes.", "Yes, I like + danh từ.", "Sai trật tự", "Không thành câu", 2],
        ],
      },
    },
  },
  lessons: {
    vocabulary: [
      null,
      {
        slug: "vocab-classroom-objects",
        title: "Lesson 2: Classroom Objects",
        learningObjective: "Name classroom objects: book, pen, pencil, bag and desk.",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "School Objects",
          tuples: [
            ["You read a _____.", "book", "desk", "lesson", "Book — sách để đọc.", "Bàn học", "Tiết học", 1],
            ["You write with a _____.", "pen", "bag", "classroom", "Pen — bút mực.", "Cặp sách", "Lớp học", 1],
            ["Your _____ is on the desk.", "bag", "teacher", "worker", "Bag — cặp/túi đựng đồ.", "Giáo viên", "Công nhân", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match School Objects",
          questionText: "Match each object to its use.",
          explanation: "Ghép đồ dùng với công dụng.",
          pairs: [
            { left: "book", right: "read stories" },
            { left: "pencil", right: "draw and write" },
            { left: "pen", right: "write in ink" },
            { left: "desk", right: "sit and work at" },
          ],
        },
        check: {
          type: "mcq",
          label: "Objects Challenge",
          tuples: [
            ["Which do you carry to school?", "bag", "desk", "classroom", "Bag — mang theo cặp.", "Bàn cố định trong lớp", "Lớp học là phòng", 2],
            ["Which is NOT in your bag usually?", "desk", "book", "pen", "Desk là bàn — không bỏ trong cặp.", "Sách thường trong cặp", "Bút thường trong cặp", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete Object Sentences",
          explanation: "Điền đồ dùng học tập.",
          template: "I put my [0] in my bag. I write with a [1].",
          correctAnswers: ["book", "pencil"],
        },
      },
      {
        slug: "vocab-school-people-jobs",
        title: "Lesson 3: School and Jobs",
        learningObjective: "Use school, teacher, lesson, farmer and worker words.",
        estimatedMinutes: 18,
        learn: {
          type: "mcq",
          label: "School and Jobs",
          tuples: [
            ["A _____ teaches children.", "teacher", "farmer", "desk", "Teacher — giáo viên dạy học.", "Nông dân", "Bàn học", 1],
            ["A _____ works on a farm.", "farmer", "worker", "student", "Farmer — nông dân trên nông trại.", "Công nhân xây nhà", "Học sinh", 1],
            ["We go to _____ every day.", "school", "kitchen", "park", "School — trường học.", "Nhà bếp", "Công viên", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Jobs",
          explanation: "Ghép nghề với nơi làm việc.",
          pairs: [
            { left: "teacher", right: "teaches in a classroom" },
            { left: "farmer", right: "works on a farm" },
            { left: "worker", right: "builds houses" },
            { left: "lesson", right: "time to learn at school" },
          ],
        },
        check: {
          type: "mcq",
          label: "Jobs Quiz",
          tuples: [
            ["Who builds houses?", "worker", "farmer", "teacher", "Worker — công nhân xây nhà.", "Nông dân", "Giáo viên", 2],
            ["Where does a teacher work?", "school", "farm", "shop", "Teacher dạy ở trường.", "Nông trại", "Cửa hàng", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Sentence Order",
          questionText: "Make a sentence about a teacher.",
          explanation: "Our teacher + is + tính từ.",
          words: ["Our", "teacher", "is", "kind."],
        },
      },
    ],
    grammar: [
      null,
      {
        slug: "grammar-imperatives",
        title: "Lesson 2: Classroom Commands",
        learningObjective: "Use imperatives: Open, Close, Sit down and Listen.",
        learn: {
          type: "mcq",
          label: "Imperatives",
          tuples: [
            ["_____ your book, please.", "Open", "Opens", "Opening", "Open — động từ nguyên mẫu cho mệnh lệnh.", "Opens có -s", "Opening không phải mệnh lệnh", 1],
            ["_____ down at your desk.", "Sit", "Sits", "Sitting", "Sit down — ngồi xuống.", "Sits có -s", "Sitting không phải mệnh lệnh", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Complete Commands",
          explanation: "Động từ nguyên mẫu cho mệnh lệnh.",
          template: "[0] the door, please. [1] to the teacher.",
          correctAnswers: ["Close", "Listen"],
        },
        check: {
          type: "mcq",
          label: "Commands Check",
          tuples: [
            ["Which is a correct command?", "Write your name.", "Your name write.", "Writing your name.", "Write your name — mệnh lệnh chuẩn.", "Sai trật tự", "Writing không phải mệnh lệnh", 2],
            ["Teacher says: Don't _____.", "run", "runs", "running", "Don't + động từ nguyên mẫu.", "Runs có -s", "Running không đúng sau Don't", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Order the Command",
          explanation: "Open + your + book.",
          words: ["Open", "your", "book,", "please."],
        },
      },
      {
        slug: "grammar-have-got-work",
        title: "Lesson 3: Have Got and Work",
        learningObjective: "Use have got for possessions and work/teach for jobs.",
        learn: {
          type: "mcq",
          label: "Have Got and Work",
          tuples: [
            ["I _____ got a ruler.", "have", "has", "having", "I have got — ngôi I.", "Has cho he/she", "Having không đúng", 1],
            ["A farmer _____ on a farm.", "works", "work", "working", "A farmer works — ngôi thứ ba có -s.", "Work không có -s", "Working không đúng", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Fill Have Got and Work",
          explanation: "Have got + đồ vật; works/teaches cho nghề.",
          template: "She has [0] two pens. A teacher [1] children.",
          correctAnswers: ["got", "teaches"],
        },
        check: {
          type: "mcq",
          label: "Have Got Check",
          tuples: [
            ["Tom _____ got a book and a pencil.", "has", "have", "got", "Tom → has got.", "Have cho I/you/we/they", "Got một mình không đủ", 2],
            ["Workers _____ houses.", "build", "builds", "building", "Workers số nhiều → build.", "Builds cho số ít", "Building không đúng", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose the Sentence",
          tuples: [
            ["Which is correct?", "I have got three books.", "I has got three books.", "I have get three books.", "I have got — chuẩn.", "Has sai với I", "Get sai", 2],
          ],
        },
      },
    ],
    reading: [
      null,
      {
        slug: "reading-our-classroom",
        title: "Lesson 2: Our Classroom",
        learningObjective: "Label classroom objects and people in a school text.",
        learn: {
          type: "reading",
          label: "Read the Classroom",
          passage: passage(0),
          tuples: [
            ["How many desks and chairs?", "Twenty", "Ten", "Three", "There are twenty desks and chairs.", "Mười", "Ba cái bút", 1],
            ["What is in the bag?", "Pen, pencil and book", "Ball and bike", "Food", "A pen, a pencil and a book in my bag.", "Đồ thể thao", "Đồ ăn", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "More Classroom Facts",
          passage: passage(0),
          tuples: [
            ["Is the teacher kind?", "Yes", "No", "Not said", "The teacher is kind.", "Bài nói kind", "Bài nói rõ", 1],
            ["What subject is the lesson?", "English", "Maths", "Art", "We have an English lesson today.", "Toán", "Mỹ thuật", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Classroom Check",
          passage: passage(0),
          tuples: [
            ["What does the writer like?", "School and the classroom", "Sports only", "Food", "School is fun. I like my classroom!", "Thể thao", "Đồ ăn", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete from Text",
          explanation: "Điền từ trong bài đọc.",
          template: "The teacher is [0] Lan. There are [1] desks.",
          correctAnswers: ["Ms", "twenty"],
        },
      },
      {
        slug: "reading-jobs-at-school",
        title: "Lesson 3: Jobs Day at School",
        learningObjective: "Understand jobs vocabulary in a school context text.",
        learn: {
          type: "reading",
          label: "Read About Jobs",
          passage: passage(1),
          tuples: [
            ["Where does a farmer work?", "On a farm", "In a classroom", "In a shop", "A farmer works on a farm.", "Trong lớp", "Cửa hàng", 1],
            ["What does Tom want to be?", "A teacher", "A farmer", "A worker", "Tom says: A teacher!", "Nông dân", "Công nhân", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Read Pack Your Bag",
          passage: passage(2),
          tuples: [
            ["What time does school start?", "Eight o'clock", "Three o'clock", "Twelve o'clock", "School starts at eight o'clock.", "Ba giờ", "Mười hai giờ", 1],
            ["What should you NOT do?", "Run in the classroom", "Write in your book", "Listen to the teacher", "Don't run in the classroom!", "Viết sách được", "Nghe giáo viên được", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Jobs Day Check",
          passage: passage(1),
          tuples: [
            ["What do workers build?", "Houses", "Books", "Lessons", "A worker builds houses.", "Sách", "Tiết học", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Best Summary",
          tuples: [
            ["The pack-your-bag text tells you to _____.", "get ready for school on time", "play football in class", "eat lunch at home", "Bài hướng dẫn chuẩn bị đi học.", "Chơi bóng", "Ăn trưa ở nhà", 2],
          ],
        },
      },
    ],
    listening: [
      null,
      {
        slug: "listening-classroom-commands",
        title: "Lesson 2: Classroom Commands",
        learningObjective: "Understand and follow simple classroom commands.",
        learn: {
          type: "listening",
          label: "Listen to the Teacher",
          script: script(0),
          answerKey: ["book", "pen"],
          tuples: [
            ["First command:", "Sit down", "Run fast", "Close the window", "Sit down, please.", "Không chạy", "Cửa sổ không nhắc", 1],
            ["Second command:", "Open your book", "Eat lunch", "Go home", "Open your book.", "Ăn trưa", "Về nhà", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "What's in Your Bag?",
          script: script(1),
          answerKey: ["book", "pencil"],
          tuples: [
            ["What does Tom have in his bag?", "A book and a pencil", "Two pens and a ruler", "A ball", "I have a book and a pencil in my bag.", "Anna có bút và thước", "Không có bóng", 1],
            ["What does Anna have?", "Two pens and a ruler", "A book only", "Nothing", "I have two pens and a ruler.", "Tom có sách", "Anna có đồ", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Commands Check",
          script: script(0),
          answerKey: ["book", "pen"],
          tuples: [
            ["What do students say at the end?", "Yes, teacher!", "Goodbye!", "Thank you!", "Class: Yes, teacher!", "Không nói tạm biệt", "Không cảm ơn", 2],
          ],
        },
        apply: {
          type: "matching",
          label: "Match Commands",
          explanation: "Ghép mệnh lệnh với hành động.",
          pairs: [
            { left: "Open your book", right: "read the lesson" },
            { left: "Take your pen", right: "write your name" },
            { left: "Listen", right: "hear the teacher" },
          ],
        },
      },
      {
        slug: "listening-jobs-dialogue",
        title: "Lesson 3: Jobs We Know",
        learningObjective: "Identify job words and who does what from a classroom dialogue.",
        learn: {
          type: "listening",
          label: "Jobs Lesson",
          script: script(2),
          answerKey: ["farm", "houses"],
          tuples: [
            ["Where does a farmer work?", "On a farm", "In a school", "In a shop", "A farmer works on a farm.", "Trong trường", "Cửa hàng", 1],
            ["What do workers build?", "Houses", "Books", "Bags", "A worker builds houses.", "Sách", "Cặp", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Jobs",
          script: script(2),
          answerKey: ["farm", "houses"],
          tuples: [
            ["Who does Lin call a teacher?", "The speaker (Teacher)", "A farmer", "A worker", "Lin: You are a teacher!", "Nông dân", "Công nhân", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Jobs Check",
          script: script(2),
          answerKey: ["farm", "houses"],
          tuples: [
            ["What does the teacher do every day?", "Teach", "Build houses", "Work on a farm", "Yes! I teach every day.", "Xây nhà", "Làm nông", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose What You Heard",
          tuples: [
            ["A farmer works on a _____.", "farm", "school", "desk", "A farmer works on a farm.", "Trường học", "Bàn học", 2],
          ],
        },
      },
    ],
    writing: [
      null,
      {
        slug: "writing-school-bag",
        title: "Lesson 2: Write About Your Bag",
        learningObjective: "Write sentences with have got about school objects.",
        learn: {
          type: "mcq",
          label: "Choose Correct Writing",
          tuples: [
            ["Best sentence:", "I have got a book and a pen.", "Got book I pen.", "Book pen I have.", "I have got + danh sách đồ vật.", "Sai trật tự", "Không thành câu", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write Have Got Sentences",
          explanation: "Have got + đồ dùng học tập.",
          template: "I have [0] a pencil. Tom has [1] two books.",
          correctAnswers: ["got", "got"],
        },
        check: {
          type: "writing",
          label: "Write Your School Things",
          taskDescription: "Write what you have got for school.",
          prompts: ["Write: I have got a ___ and a ___.", "Write where your bag is."],
          minWords: 6,
          modelAnswers: ["I have got a pen and a book.", "My bag is on the desk."],
          rubric: ["Uses have got", "Uses a school word"],
          successCriteria: ["Possessions sentence", "Location or object"],
          autoCheckKeywords: ["have got", "pen", "book", "bag", "pencil", "desk"],
        },
        apply: {
          type: "mcq",
          label: "Fix the Sentence",
          tuples: [
            ["Which needs fixing?", "She have got a pen.", "She has got a pen.", "She got has a pen.", "She has got — ngôi thứ ba.", "Đây là câu đúng", "Sai trật tự", 2],
          ],
        },
      },
      {
        slug: "writing-classroom-commands",
        title: "Lesson 3: Write Classroom Commands",
        learningObjective: "Write imperatives and job sentences at Starters level.",
        learn: {
          type: "mcq",
          label: "Commands in Writing",
          tuples: [
            ["Best command:", "Listen to the teacher.", "Teacher listen to.", "Listening teacher.", "Listen to + người.", "Sai trật tự", "Listening không phải mệnh lệnh", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Best Job Sentence",
          tuples: [
            ["Which is correct?", "A teacher teaches children.", "A teacher teach children.", "Teacher a teaches.", "Teaches cho ngôi thứ ba số ít.", "Thiếu -s", "Sai trật tự", 1],
          ],
        },
        check: {
          type: "writing",
          label: "Write a Command and a Job",
          taskDescription: "Write one classroom command and one job sentence.",
          prompts: ["Write a command starting with Open/Close/Sit.", "Write: A farmer works on a ___."],
          minWords: 5,
          modelAnswers: ["Open your book, please.", "A farmer works on a farm."],
          rubric: ["Uses imperative or job word", "Correct word order"],
          successCriteria: ["Command", "Job sentence"],
          autoCheckKeywords: ["Open", "Close", "Sit", "farmer", "teacher", "works", "farm"],
        },
        apply: {
          type: "ordering",
          label: "Order Command Sentence",
          explanation: "Close + the + door.",
          words: ["Close", "the", "door,", "please."],
        },
      },
    ],
    speaking: [
      null,
      {
        slug: "speaking-classroom-talk",
        title: "Lesson 2: Talk About the Classroom",
        learningObjective: "Say what you have and follow classroom commands aloud.",
        learn: {
          type: "mcq",
          label: "Choose a Reply",
          tuples: [
            ["Teacher: Have you got a pen? You say:", "Yes, I have got a pen.", "Yes, pen got I.", "Pen yes.", "Yes, I have got + đồ vật.", "Sai trật tự", "Quá ngắn", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Say a Command",
          tuples: [
            ["You want the class to listen. You say:", "Listen, please!", "Listening please!", "Please listen you.", "Listen — mệnh lệnh ngắn.", "Listening sai", "Sai trật tự", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Your Bag Contents",
          prompt: "Say what you have got in your bag and one thing on your desk.",
          pictureDescription: "School desk with bag, book, pen and pencil.",
          followUpQuestions: ["What have you got in your bag?", "What is on your desk?"],
          suggestedAnswers: ["I have got a book and two pens.", "My pencil is on the desk."],
          assessmentCriteria: ["Uses have got", "Names school objects", "Clear speech"],
        },
        apply: {
          type: "mcq",
          label: "Polite Reply",
          tuples: [
            ["Teacher: Open your book. Best response:", "OK! (opens book)", "No!", "Run!", "Làm theo mệnh lệnh — phản hồi tích cực.", "Từ chối", "Không chạy", 2],
          ],
        },
      },
      {
        slug: "speaking-jobs-talk",
        title: "Lesson 3: Talk About Jobs",
        learningObjective: "Say what farmers, workers and teachers do.",
        learn: {
          type: "mcq",
          label: "Say About Jobs",
          tuples: [
            ["Best sentence:", "A farmer works on a farm.", "Farmer a farm works.", "Works farm farmer.", "A farmer works on a farm.", "Sai trật tự", "Sai", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Answer About Jobs",
          tuples: [
            ["What do you want to be? You say:", "I want to be a teacher.", "Teacher want I.", "Be teacher want.", "I want to be + nghề.", "Sai trật tự", "Sai", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Two Jobs",
          prompt: "Say what a farmer and a worker do.",
          pictureDescription: "Pictures of farmer on farm and worker building a house.",
          followUpQuestions: ["What does a farmer do?", "What does a worker do?"],
          suggestedAnswers: ["A farmer works on a farm.", "A worker builds houses."],
          assessmentCriteria: ["Uses work/build/teach", "Names jobs clearly", "Short sentences"],
        },
        apply: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["Someone asks: What does a teacher do? You say:", "A teacher teaches children.", "Teaches teacher children.", "Children teacher teaches a.", "A teacher teaches + object.", "Sai trật tự", "Sai", 2],
          ],
        },
      },
    ],
  },
};
