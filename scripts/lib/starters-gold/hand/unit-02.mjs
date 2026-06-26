/**
 * Hand-authored gold content — Unit 2: Numbers and Time
 * NO algorithmic generation.
 */
import { UNIT_PASSAGES, UNIT_SCRIPTS } from "../../starters-unit-passages.mjs";

const P2 = UNIT_PASSAGES[2];
const S2 = UNIT_SCRIPTS[2];

function passage(i) {
  const p = P2[i];
  return { ...p, wordCount: p.text.split(/\s+/).filter(Boolean).length };
}

function script(i) {
  return S2[i];
}

export const HAND_UNIT_02 = {
  topic: "numbers-and-time",
  lesson0ExtraSpecs: {
    vocabulary: {
      check: {
        type: "mcq",
        label: "Numbers and Days Quiz",
        instructions: "No hints — choose the best answer.",
        tuples: [
          ["School starts at eight _____.", "o'clock", "Monday", "birthday", "O'clock đi sau số để chỉ giờ.", "Tên ngày, không phải giờ", "Sự kiện, không phải thời gian", 2],
          ["Today is _____. It is not Monday.", "Tuesday", "ten", "three", "Tuesday là thứ Ba — ngày trong tuần.", "Số, không phải ngày", "Số, không phải ngày", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Numbers in Sentences",
        questionText: "Complete with number or day words.",
        explanation: "one/two cho số lượng; Monday cho ngày.",
        template: "I have [0] brother. Today is [1].",
        correctAnswers: ["one", "Monday"],
      },
    },
    grammar: {
      check: {
        type: "mcq",
        label: "How Many / How Old Quiz",
        tuples: [
          ["_____ books are on the desk? — Three.", "How many", "How old", "What", "How many hỏi số lượng danh từ đếm được.", "How old hỏi tuổi", "What hỏi vật/con người", 2],
          ["_____ is your sister? — She is six.", "How old", "How many", "How", "How old hỏi tuổi — trả lời She is six.", "How many hỏi số lượng", "How một mình không đủ", 2],
        ],
      },
      apply: {
        type: "gap_fill",
        label: "Complete Questions",
        explanation: "How old + tuổi; How many + số lượng.",
        template: "[0] are you? I am nine. [1] cats do you have? Two.",
        correctAnswers: ["How old", "How many"],
      },
    },
    reading: {
      practice: {
        type: "reading",
        label: "More Birthday Details",
        passage: passage(0),
        tuples: [
          ["How many friends at Tom's party?", "Ten", "Seven", "Three", "I have ten friends at my party.", "Tuổi Tom", "Số sách", 1],
          ["When is Tom's birthday?", "Tuesday", "Monday", "Thursday", "My birthday is on Tuesday.", "Hôm nay", "Ngày tan học", 1],
        ],
      },
      check: {
        type: "reading",
        label: "Tom's Birthday Details",
        passage: passage(0),
        tuples: [
          ["How old is Tom?", "Seven years old", "Ten years old", "Eight years old", "Đoạn văn: I am seven years old.", "Số bạn ở bữa tiệc", "Tuổi bạn Lin", 2],
          ["When is Tom's birthday?", "Tuesday", "Monday", "Today", "My birthday is on Tuesday.", "Today is Monday — hôm nay", "Today không phải sinh nhật", 2],
        ],
      },
      apply: {
        type: "mcq",
        label: "Birthday Facts",
        tuples: [
          ["What time does school start for Tom?", "Eight o'clock", "Three o'clock", "Four o'clock", "School starts at eight o'clock.", "Giờ trong lớp học khác", "Giờ tan học", 2],
        ],
      },
    },
    listening: {
      practice: {
        type: "listening",
        label: "Listen for Ages",
        script: script(0),
        answerKey: ["seven", "ten", "three"],
        tuples: [
          ["How old is Mai's brother?", "Ten", "Seven", "Three", "He is ten.", "Tuổi Mai", "Số sách", 1],
          ["Who asks How old are you?", "Teacher", "Mai", "Brother", "Teacher: How old are you?", "Mai hỏi", "Không có", 1],
        ],
      },
      check: {
        type: "listening",
        label: "How Old Are You?",
        script: script(0),
        answerKey: ["seven", "ten", "three"],
        tuples: [
          ["How old is Mai?", "Seven", "Ten", "Three", "Mai nói: I am seven.", "Tuổi anh trai", "Số sách", 2],
          ["How many books does Mai have?", "Three", "Seven", "Ten", "I have three books.", "Tuổi", "Tuổi anh trai", 2],
        ],
      },
      apply: {
        type: "matching",
        label: "Match Ages and Numbers",
        questionText: "Match what you heard.",
        explanation: "Ghép tuổi và số lượng từ hội thoại.",
        pairs: [
          { left: "Mai's age", right: "seven" },
          { left: "Brother's age", right: "ten" },
          { left: "Books", right: "three" },
        ],
      },
    },
    writing: {
      learn: {
        type: "mcq",
        label: "Choose Correct Writing",
        tuples: [
          ["Best sentence about age:", "I am eight years old.", "Eight years I am.", "I eight am.", "I am + số + years old.", "Sai trật tự", "Không thành câu", 1],
          ["Best time phrase:", "It is three o'clock.", "Three o'clock it is.", "It three is.", "It is + giờ + o'clock.", "Sai", "Sai", 1],
        ],
      },
      practice: {
        type: "gap_fill",
        label: "Complete Writing Frames",
        explanation: "Khung câu cho tuổi và ngày.",
        template: "I am [0] years old. Today is [1].",
        correctAnswers: ["seven", "Monday"],
      },
      check: {
        type: "writing",
        label: "Write About Age and Days",
        taskDescription: "Write about your age and a day of the week.",
        prompts: ["Write your age in English.", "Write one day of the week."],
        minWords: 4,
        modelAnswers: ["I am eight.", "Monday"],
        rubric: ["Uses a number for age", "Uses a day word correctly"],
        successCriteria: ["Age sentence", "Day word"],
        autoCheckKeywords: ["Monday", "Tuesday", "eight", "seven", "nine"],
      },
      apply: {
        type: "mcq",
        label: "Best Written Sentence",
        tuples: [
          ["Which sentence is best?", "I am nine years old.", "Nine old I am.", "I nine am old.", "Thứ tự từ đúng cho tuổi.", "Sai trật tự", "Không thành câu", 2],
        ],
      },
    },
    speaking: {
      learn: {
        type: "mcq",
        label: "Choose What to Say",
        tuples: [
          ["Someone asks: How old are you? You say:", "I am seven.", "Seven old I.", "Old seven.", "I am + tuổi.", "Sai", "Không thành câu", 1],
          ["Someone asks: How many books? You say:", "I have three books.", "Three books I have.", "Many three.", "I have + số + danh từ.", "Sai trật tự", "Sai", 1],
        ],
      },
      practice: {
        type: "mcq",
        label: "Ask a Question",
        tuples: [
          ["You want someone's age. You ask:", "How old are you?", "How many are you?", "How you old?", "How old are you? — chuẩn.", "Hỏi số lượng", "Sai trật tự", 1],
        ],
      },
      check: {
        type: "speaking",
        label: "Say Your Age and a Number",
        prompt: "Say your age and how many books you have.",
        sceneDescription: "A child in a classroom with books on a desk.",
        followUpQuestions: ["How old are you?", "How many books do you have?"],
        suggestedAnswers: ["I am eight.", "I have three books."],
        assessmentCriteria: ["Uses how old / how many", "Clear numbers", "Short clear phrases"],
      },
      apply: {
        type: "mcq",
        label: "What to Say",
        tuples: [
          ["Someone asks: How old are you? You say:", "I am seven.", "Seven old I.", "Old seven.", "Câu trả lời tự nhiên với I am + số.", "Sai cấu trúc", "Không thành câu", 2],
        ],
      },
    },
  },
  lessons: {
    vocabulary: [
      null,
      {
        slug: "vocab-counting-higher",
        title: "Lesson 2: Counting to Twenty",
        learningObjective: "Use numbers ten to twenty in simple sentences.",
        estimatedMinutes: 16,
        learn: {
          type: "mcq",
          label: "Numbers Ten to Twenty",
          tuples: [
            ["Ten plus ten equals _____.", "twenty", "ten", "three", "10+10=20. Twenty là hai mươi.", "Lặp lại ten", "Ba", 1],
            ["There are _____ students in the photo.", "ten", "Monday", "today", "Ten (mười) chỉ số lượng.", "Ngày trong tuần", "Hôm nay", 1],
            ["After nine comes _____.", "ten", "one", "twenty", "Thứ tự số: ... eight, nine, ten.", "Bắt đầu lại", "Nhảy quá xa", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Match Numbers",
          questionText: "Match numbers to their meanings.",
          explanation: "Mười, hai mươi — số lượng lớn hơn ở Starters.",
          pairs: [
            { left: "ten", right: "10" },
            { left: "twenty", right: "20" },
            { left: "three", right: "3" },
            { left: "one", right: "1" },
          ],
        },
        check: {
          type: "mcq",
          label: "Number Challenge",
          tuples: [
            ["Which number is biggest?", "twenty", "ten", "three", "Twenty (20) lớn nhất trong bộ từ.", "Ten nhỏ hơn", "Three nhỏ nhất", 2],
            ["I see _____ birds in the tree.", "ten", "Monday", "birthday", "Ten đếm chim.", "Ngày", "Sinh nhật", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Write Numbers",
          explanation: "Điền ten hoặc twenty phù hợp ngữ cảnh.",
          template: "I am [0] years old. My class has [1] children.",
          correctAnswers: ["ten", "twenty"],
        },
      },
      {
        slug: "vocab-time-words",
        title: "Lesson 3: Time and Days",
        learningObjective: "Use today, o'clock and days of the week in context.",
        estimatedMinutes: 18,
        learn: {
          type: "mcq",
          label: "Time Words",
          tuples: [
            ["_____ is Monday. We go to school.", "Today", "Ten", "Twenty", "Today (hôm nay) với ngày hiện tại.", "Số", "Số", 1],
            ["The lesson starts at three _____.", "o'clock", "Tuesday", "birthday", "O'clock sau số chỉ giờ.", "Thứ", "Sự kiện", 1],
            ["We have English on _____.", "Tuesday", "o'clock", "ten", "Tuesday là ngày trong tuần.", "Thời gian", "Số", 1],
          ],
        },
        practice: {
          type: "matching",
          label: "Days and Time",
          explanation: "Ghép từ thời gian với nghĩa.",
          pairs: [
            { left: "today", right: "this day" },
            { left: "Monday", right: "first school day in the text" },
            { left: "o'clock", right: "tells the hour" },
            { left: "birthday", right: "special day with cake" },
          ],
        },
        check: {
          type: "mcq",
          label: "Time Quiz",
          tuples: [
            ["Which word tells the hour?", "o'clock", "Monday", "today", "O'clock đi với số giờ.", "Ngày", "Hôm nay", 2],
            ["It is not my birthday _____.", "today", "ten", "three", "Today — hôm nay không phải sinh nhật.", "Số", "Số", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Sentence Order",
          questionText: "Make a sentence about time.",
          explanation: "School starts at + giờ + o'clock.",
          words: ["School", "starts", "at", "eight", "o'clock."],
        },
      },
    ],
    grammar: [
      null,
      {
        slug: "grammar-numbers-in-sentences",
        title: "Lesson 2: Numbers in Sentences",
        learningObjective: "Use numbers 1–20 correctly in answers about age and quantity.",
        learn: {
          type: "mcq",
          label: "Numbers with am and are",
          tuples: [
            ["I _____ eight.", "am", "is", "are", "I am + tuổi.", "Với he/she", "Với they", 1],
            ["They _____ ten years old.", "are", "am", "is", "They are + tuổi số nhiều.", "Chỉ với I", "Với một người", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Fill Ages",
          explanation: "Điền số cho tuổi và số lượng.",
          template: "I am [0]. She is [1].",
          correctAnswers: ["seven", "nine"],
        },
        check: {
          type: "mcq",
          label: "Number Grammar Check",
          tuples: [
            ["There _____ three pens.", "are", "is", "am", "Three pens → are.", "Số ít", "Chỉ với I", 2],
            ["He is _____ years old.", "six", "Monday", "today", "Six là số tuổi.", "Ngày", "Trạng từ", 2],
          ],
        },
        apply: {
          type: "ordering",
          label: "Order the Question",
          explanation: "How many + danh từ số nhiều + do you have?",
          words: ["How", "many", "books", "do", "you", "have?"],
        },
      },
      {
        slug: "grammar-days-and-months",
        title: "Lesson 3: Days Recognition",
        learningObjective: "Recognise days of the week in questions and answers.",
        learn: {
          type: "mcq",
          label: "Days in Questions",
          tuples: [
            ["_____ day is it today?", "What", "How many", "How old", "What day is it today? — hỏi thứ mấy.", "Hỏi số lượng", "Hỏi tuổi", 1],
            ["My birthday is on _____.", "Tuesday", "ten", "o'clock", "On + ngày trong tuần.", "Số", "Giờ", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Complete Days",
          explanation: "Monday/Tuesday trong câu.",
          template: "Today is [0]. Tomorrow is [1].",
          correctAnswers: ["Monday", "Tuesday"],
        },
        check: {
          type: "mcq",
          label: "Days Check",
          tuples: [
            ["School is closed on Sunday. Monday is the next _____.", "day", "number", "time", "Monday là ngày (day).", "Không phải số", "Không phải giờ", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose the Day",
          tuples: [
            ["We have a test on _____.", "Tuesday", "twenty", "o'clock", "Tuesday — ngày trong tuần.", "Số", "Giờ", 2],
          ],
        },
      },
    ],
    reading: [
      null,
      {
        slug: "reading-class-clock",
        title: "Lesson 2: Our Class Clock",
        learningObjective: "Read for time, quantity and age in a classroom text.",
        learn: {
          type: "reading",
          label: "Read the Classroom",
          passage: passage(1),
          tuples: [
            ["What time is it on the clock?", "Three o'clock", "Eight o'clock", "Four o'clock", "It is three o'clock.", "Giờ Tom", "Giờ tan học", 1],
            ["How many pens are there?", "Three", "Twenty", "Thirty", "One, two, three — three pens.", "Số sách", "Tuổi giáo viên", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "Find Numbers",
          passage: passage(1),
          tuples: [
            ["How many books are on the desk?", "Twenty", "Three", "Ten", "We have twenty books.", "Số bút", "Tuổi giáo viên", 1],
            ["How old is the teacher?", "Thirty", "Seven", "Eight", "She is thirty.", "Số sách", "Số bút", 1],
          ],
        },
        check: {
          type: "reading",
          label: "Classroom Check",
          passage: passage(1),
          tuples: [
            ["Where is the clock?", "On the wall", "On the desk", "In the park", "Look at the clock on the wall.", "Trên bàn", "Không có trong bài", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Best Summary",
          tuples: [
            ["This text is mainly about _____.", "a classroom with numbers and time", "animals at the zoo", "food for lunch", "Bài mô tả lớp học, đồng hồ, số lượng.", "Chủ đề khác", "Chủ đề khác", 2],
          ],
        },
      },
      {
        slug: "reading-days-at-school",
        title: "Lesson 3: Days at School",
        learningObjective: "Understand days of the week and ages in a short school text.",
        learn: {
          type: "reading",
          label: "Read About the Week",
          passage: passage(2),
          tuples: [
            ["Which days do they go to school?", "Monday and Tuesday", "Thursday only", "Sunday", "We go to school on Monday and Tuesday.", "Chỉ một ngày", "Không có trong bài", 1],
            ["How old is the writer?", "Eight", "Seven", "Four", "I am eight.", "Tuổi Lin", "Số ngày", 1],
          ],
        },
        practice: {
          type: "reading",
          label: "More Details",
          passage: passage(2),
          tuples: [
            ["How old is Lin?", "Seven", "Eight", "Four", "My friend Lin is seven.", "Tuổi tác giả", "Số ngày", 1],
            ["What time does school finish?", "Four o'clock", "Three o'clock", "Eight o'clock", "School finishes at four o'clock.", "Giờ vào học", "Giờ trong lớp", 1],
          ],
        },
        check: {
          type: "reading",
          label: "School Week Check",
          passage: passage(2),
          tuples: [
            ["What do they do on Wednesday?", "Play in the park", "Go to school", "Eat cake", "On Wednesday we play in the park.", "Đi học", "Không có trong bài", 2],
          ],
        },
        apply: {
          type: "gap_fill",
          label: "Complete from Text",
          explanation: "Điền từ trong bài đọc.",
          template: "Today is [0]. School finishes at [1] o'clock.",
          correctAnswers: ["Thursday", "four"],
        },
      },
    ],
    listening: [
      null,
      {
        slug: "listening-what-day",
        title: "Lesson 2: What Day Is It?",
        learningObjective: "Understand questions about days and time in dialogues.",
        learn: {
          type: "listening",
          label: "Days Dialogue",
          script: script(1),
          tuples: [
            ["What day is it today?", "Monday", "Tuesday", "Thursday", "Today is Monday.", "Ngày sinh nhật", "Ngày hôm qua", 1],
            ["When is Anna's birthday?", "Tuesday", "Monday", "Today", "My birthday is on Tuesday.", "Hôm nay", "Thứ Hai", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Time Questions",
          script: script(1),
          tuples: [
            ["What time is it?", "Two o'clock", "Eight o'clock", "Four o'clock", "It is two o'clock.", "Giờ trường", "Giờ tan", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Days Check",
          script: script(1),
          tuples: [
            ["Who asks about the day?", "Tom", "Anna", "Teacher", "Tom asks: What day is it today?", "Anna trả lời", "Không có giáo viên", 2],
          ],
        },
        apply: {
          type: "matching",
          label: "Match Dialogue",
          explanation: "Ghép câu hỏi và câu trả lời.",
          pairs: [
            { left: "What day?", right: "Monday" },
            { left: "Birthday", right: "Tuesday" },
            { left: "Time", right: "two o'clock" },
          ],
        },
      },
      {
        slug: "listening-counting-home",
        title: "Lesson 3: Counting at Home",
        learningObjective: "Extract ages and numbers from a home dialogue.",
        learn: {
          type: "listening",
          label: "At Home",
          script: script(2),
          tuples: [
            ["How many apples?", "Three", "Six", "Ten", "Three apples.", "Tuổi Ben", "Sinh nhật", 1],
            ["How old is Ben today?", "Six", "Three", "Ten", "I am six today! Happy birthday!", "Số táo", "Tuổi mẹ", 1],
          ],
        },
        practice: {
          type: "listening",
          label: "Listen for Numbers",
          script: script(2),
          tuples: [
            ["Who says Happy birthday?", "Mother", "Ben", "Teacher", "Mother: Happy birthday!", "Ben chúc", "Không có", 1],
          ],
        },
        check: {
          type: "listening",
          label: "Home Dialogue Check",
          script: script(2),
          tuples: [
            ["What does Mother ask first?", "How many apples", "How old are you", "What day is it", "How many apples are there?", "Tuổi hỏi sau", "Không hỏi ngày", 2],
          ],
        },
        apply: {
          type: "mcq",
          label: "Choose What You Heard",
          tuples: [
            ["Ben is _____ today.", "six", "three", "ten", "I am six today.", "Số táo", "Tuổi mẹ", 2],
          ],
        },
      },
    ],
    writing: [
      null,
      {
        slug: "writing-age-sentences",
        title: "Lesson 2: Write About Age",
        learningObjective: "Write short sentences with numbers and days.",
        learn: {
          type: "mcq",
          label: "Choose Correct Writing",
          tuples: [
            ["Best sentence about age:", "I am ten years old.", "Ten years I am.", "I ten am.", "I am + số + years old.", "Sai trật tự", "Không thành câu", 1],
          ],
        },
        practice: {
          type: "gap_fill",
          label: "Write Numbers",
          explanation: "Viết số trong câu.",
          template: "Today is [0]. I am [1] years old.",
          correctAnswers: ["Monday", "nine"],
        },
        check: {
          type: "writing",
          label: "Write Age and Day",
          taskDescription: "Write your age and today's day.",
          prompts: ["Write: I am ___ years old.", "Write one day word."],
          minWords: 5,
          modelAnswers: ["I am eight years old.", "Tuesday"],
          rubric: ["Correct number", "Day word spelled correctly"],
          successCriteria: ["Age sentence", "Day word"],
          autoCheckKeywords: ["Monday", "Tuesday", "years", "old"],
        },
        apply: {
          type: "mcq",
          label: "Fix the Sentence",
          tuples: [
            ["Which needs fixing?", "How old you are?", "How old are you?", "How are you old?", "Cấu trúc đúng: How old are you?", "Đây là câu đúng", "Sai trật tự", 2],
          ],
        },
      },
      {
        slug: "writing-time-phrases",
        title: "Lesson 3: Write Time Phrases",
        learningObjective: "Write o'clock and day phrases at Starters level.",
        learn: {
          type: "mcq",
          label: "Time in Writing",
          tuples: [
            ["School starts at eight _____.", "o'clock", "Monday", "today", "Eight o'clock — giờ.", "Ngày", "Hôm nay", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Best Time Sentence",
          tuples: [
            ["Which is correct?", "It is three o'clock.", "It three o'clock is.", "O'clock three it is.", "It is + giờ + o'clock.", "Sai", "Sai", 1],
          ],
        },
        check: {
          type: "writing",
          label: "Write Time and Day",
          taskDescription: "Write a time and a day.",
          prompts: ["Write a time with o'clock.", "Write a day of the week."],
          minWords: 4,
          modelAnswers: ["three o'clock", "Friday"],
          rubric: ["Uses o'clock", "Day word"],
          successCriteria: ["Time phrase", "Day"],
          autoCheckKeywords: ["o'clock", "Monday", "Tuesday"],
        },
        apply: {
          type: "ordering",
          label: "Order Time Sentence",
          explanation: "It is + số + o'clock.",
          words: ["It", "is", "four", "o'clock."],
        },
      },
    ],
    speaking: [
      null,
      {
        slug: "speaking-ask-age",
        title: "Lesson 2: Ask and Say Age",
        learningObjective: "Ask and answer how old questions aloud.",
        learn: {
          type: "mcq",
          label: "Choose a Reply",
          tuples: [
            ["Friend asks: How old are you? You say:", "I am nine.", "Nine I am.", "How many nine?", "I am + tuổi.", "Sai", "Nhầm how many", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Ask a Question",
          tuples: [
            ["You want someone's age. You ask:", "How old are you?", "How many are you?", "How you old?", "How old are you? — chuẩn.", "Hỏi số lượng", "Sai trật tự", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Age and Count",
          prompt: "Say your age and how many pencils you have.",
          sceneDescription: "Child at desk with pencils.",
          followUpQuestions: ["How old are you?", "How many pencils do you have?"],
          suggestedAnswers: ["I am eight.", "I have five pencils."],
          assessmentCriteria: ["Uses how old/how many", "Clear numbers", "Short phrases"],
        },
        apply: {
          type: "mcq",
          label: "Polite Reply",
          tuples: [
            ["Teacher asks your age. Best reply:", "I am seven years old.", "Seven.", "Old seven I.", "Câu đầy đủ lịch sự.", "Quá ngắn", "Sai", 2],
          ],
        },
      },
      {
        slug: "speaking-days-aloud",
        title: "Lesson 3: Say Days and Time",
        learningObjective: "Say days of the week and o'clock times clearly.",
        learn: {
          type: "mcq",
          label: "Say the Day",
          tuples: [
            ["Today is Monday. Tomorrow is _____.", "Tuesday", "ten", "o'clock", "Thứ tự ngày: Monday → Tuesday.", "Số", "Giờ", 1],
          ],
        },
        practice: {
          type: "mcq",
          label: "Say the Time",
          tuples: [
            ["Look at the clock: 3:00. You say:", "It is three o'clock.", "Three clock it is.", "It three is.", "It is + giờ + o'clock.", "Sai", "Sai", 1],
          ],
        },
        check: {
          type: "speaking",
          label: "Say Day and Time",
          prompt: "Say today's day and a time with o'clock.",
          sceneDescription: "Calendar and classroom clock.",
          followUpQuestions: ["What day is it?", "What time is it?"],
          suggestedAnswers: ["It is Monday.", "It is eight o'clock."],
          assessmentCriteria: ["Day word clear", "O'clock phrase", "Intelligible"],
        },
        apply: {
          type: "mcq",
          label: "Choose What to Say",
          tuples: [
            ["Someone asks: What day is it? You say:", "It is Thursday.", "Thursday it.", "Many Thursday.", "It is + ngày.", "Sai", "Sai", 2],
          ],
        },
      },
    ],
  },
};
