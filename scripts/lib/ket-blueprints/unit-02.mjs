import {
  buildMcq,
  buildMatching,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  buildVocabWord,
  buildGrammarRef,
  buildPassage,
  buildListeningScript,
  buildReadingExercise,
  buildListeningExercise,
} from '../ket-unit-builder.mjs';

const TOPIC = 'work-and-jobs';

const jobAdPassage = buildPassage({
  title: 'Part-Time Shop Assistant — Job Advertisement',
  text: `GREENWAY BOOKSHOP — NOW HIRING

We are looking for a friendly part-time shop assistant to join our team on weekends. The employer offers a good salary and training for the right person.

You will work with colleagues in a busy city centre shop. Duties include helping customers, organising books and working a Saturday shift from 9 a.m. to 5 p.m.

REQUIREMENTS
• At least one year of customer service experience
• Good communication skills for interviews with our manager
• Able to work on Saturday and Sunday

BENEFITS
• Hourly salary above the minimum wage
• Free books after three months
• Career advice for students who want to work in publishing

HOW TO APPLY
Send a short email with your name and work experience to jobs@greenwaybooks.co.uk before 30 April. We will contact successful candidates for an interview.

Our shop manager, Ms Pham, started here as a student. She says: "This job helped me build skills for my career."`,
});

const interviewScript1 = buildListeningScript({
  title: 'Job Interview at a Café',
  setting: 'Small café office, quiet background',
  speakers: [{ name: 'Ms Lee', role: 'café manager' }, { name: 'Tom', role: 'job applicant' }],
  lines: [
    { speaker: 'Ms Lee', text: 'Good morning, Tom. Thanks for coming to the interview today.' },
    { speaker: 'Tom', text: 'Good morning. I applied for the part-time waiter job last week.' },
    { speaker: 'Ms Lee', text: 'Tell me about your experience. Have you worked with customers before?' },
    { speaker: 'Tom', text: 'Yes. I worked in a bookshop for six months. My colleagues were very helpful.' },
    { speaker: 'Ms Lee', text: 'Great. The salary is eight pounds an hour. Can you work the evening shift on Fridays?' },
    { speaker: 'Tom', text: 'Yes, I can. I am studying now, but I am free on Friday evenings.' },
    { speaker: 'Ms Lee', text: 'Perfect. The employer will email you next Monday about the start date.' },
  ],
  audioNotes: 'Clear interview dialogue, moderate pace. Approx. 50 seconds.',
});

const interviewScript2 = buildListeningScript({
  title: 'Career Advice Phone Call',
  setting: 'Career advice centre',
  speakers: [{ name: 'Advisor', role: 'career advisor' }, { name: 'Linh', role: 'student caller' }],
  lines: [
    { speaker: 'Linh', text: 'Hello. I want some advice about my career after school.' },
    { speaker: 'Advisor', text: 'Of course. What kind of work interests you?' },
    { speaker: 'Linh', text: 'I like helping people. I had an interview for a nurse assistant course yesterday.' },
    { speaker: 'Advisor', text: 'That is a good choice. You need more experience in a hospital. Have you thought about volunteering?' },
    { speaker: 'Linh', text: 'Not yet. When should I apply for training programmes?' },
    { speaker: 'Advisor', text: 'You should apply before September. Many students retire from study and start work at twenty.' },
    { speaker: 'Linh', text: 'Thank you. That helps a lot.' },
  ],
  audioNotes: 'Friendly phone conversation, clear voices. Approx. 45 seconds.',
});

export default {
  vocabularyBank: [
    buildVocabWord({ word: 'colleague', ipa: '/ˈkɒliːɡ/', partOfSpeech: 'noun', vietnameseMeaning: 'đồng nghiệp', exampleSentence: 'My colleague helped me on my first day.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'salary', ipa: '/ˈsæləri/', partOfSpeech: 'noun', vietnameseMeaning: 'lương', exampleSentence: 'The salary for this job is good.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'interview', ipa: '/ˈɪntəvjuː/', partOfSpeech: 'noun', vietnameseMeaning: 'buổi phỏng vấn', exampleSentence: 'I have a job interview on Tuesday.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'career', ipa: '/kəˈrɪə(r)/', partOfSpeech: 'noun', vietnameseMeaning: 'sự nghiệp', exampleSentence: 'She wants a career in medicine.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'experience', ipa: '/ɪkˈspɪəriəns/', partOfSpeech: 'noun', vietnameseMeaning: 'kinh nghiệm', exampleSentence: 'Do you have any shop experience?', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'employer', ipa: '/ɪmˈplɔɪə(r)/', partOfSpeech: 'noun', vietnameseMeaning: 'người sử dụng lao động / chủ lao động', exampleSentence: 'My employer pays me every month.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'shift', ipa: '/ʃɪft/', partOfSpeech: 'noun', vietnameseMeaning: 'ca làm việc', exampleSentence: 'I work the morning shift on Saturdays.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'retire', ipa: '/rɪˈtaɪə(r)/', partOfSpeech: 'verb', vietnameseMeaning: 'nghỉ hưu', exampleSentence: 'My grandfather retired at sixty-five.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'office', ipa: '/ˈɒfɪs/', partOfSpeech: 'noun', vietnameseMeaning: 'văn phòng', exampleSentence: 'She works in an office in the city centre.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'manager', ipa: '/ˈmænɪdʒə(r)/', partOfSpeech: 'noun', vietnameseMeaning: 'quản lý', exampleSentence: 'The manager interviewed three people today.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'part-time', ipa: '/ˌpɑːt ˈtaɪm/', partOfSpeech: 'adjective', vietnameseMeaning: 'bán thời gian', exampleSentence: 'I want a part-time job after school.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'apply', ipa: '/əˈplaɪ/', partOfSpeech: 'verb', vietnameseMeaning: 'nộp đơn / ứng tuyển', exampleSentence: 'You should apply before the deadline.', difficulty: 1, topic: TOPIC }),
  ],

  grammarReference: [
    buildGrammarRef({
      structure: 'Present simple vs present continuous',
      explanation: 'Use present simple for habits, facts and permanent jobs (I work in a shop). Use present continuous for actions happening now or temporary situations (I am working extra shifts this month).',
      examples: [
        'I work in a bookshop every Saturday.',
        'She is preparing for an interview this week.',
        'My colleague usually starts his shift at nine.',
        'They are hiring new staff at the moment.',
      ],
      commonMistakes: [
        'I am work in a café (×) → I work in a café (✓)',
        'She works now on her CV (×) → She is working on her CV now (✓)',
        'He is usually work on Fridays (×) → He usually works on Fridays (✓)',
      ],
      topic: TOPIC,
    }),
    buildGrammarRef({
      structure: 'Wh- questions across tenses',
      explanation: 'Use Wh- words (what, where, when, who, why, how) + auxiliary (do/does/is/are/have) + subject + verb. Match the tense to the situation: present simple for routines, present continuous for now.',
      examples: [
        'Where do you work?',
        'What is your colleague doing now?',
        'When does your shift start?',
        'How much salary do you get?',
      ],
      commonMistakes: [
        'Where you work? (×) → Where do you work? (✓)',
        'What she is doing? (×) → What is she doing? (✓)',
        'When start your shift? (×) → When does your shift start? (✓)',
      ],
      topic: TOPIC,
    }),
  ],

  unit: {
    learningObjectives: [
      'Use core work and jobs vocabulary at A2 level.',
      'Use present simple and present continuous to talk about jobs and current work situations.',
      'Ask and answer Wh- questions about work routines and temporary tasks.',
      'Scan a job advertisement for specific information such as salary and shift times.',
      'Extract factual details from a short job interview recording.',
      'Write a short email applying for a part-time job.',
      'Answer interview questions about work experience and career plans.',
    ],
  },

  lessons: {
    vocabulary: {
      slug: 'vocab-work-words',
      title: 'Lesson 1: Work and Jobs Words',
      learningObjective: 'Recognise and understand twelve work and jobs words at KET A2 level.',
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: 'vocab-work-learn',
          title: 'Learn: Work Word Match',
          instructions: 'Read each sentence. Choose the best word.',
          exerciseType: 'multiple_choice',
          sortOrder: 0,
          questions: [
            buildMcq({ questionText: 'A person who works with you at the same company is a _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Colleague (đồng nghiệp) là người làm cùng công ty. Employer là chủ lao động.', correct: 'colleague', wrong: ['employer', 'manager'], distractorNotes: ['The person who pays you', 'A boss, not necessarily a co-worker'], difficultyRating: 1 }),
            buildMcq({ questionText: 'The money you receive each month from your job is your _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Salary (lương) là tiền lương hàng tháng. Shift là ca làm.', correct: 'salary', wrong: ['shift', 'interview'], distractorNotes: ['A work period, not payment', 'A meeting, not money'], difficultyRating: 1 }),
            buildMcq({ questionText: 'A formal meeting where an employer asks you questions is an _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Interview (phỏng vấn) là buổi hỏi đáp khi xin việc. Career là sự nghiệp dài hạn.', correct: 'interview', wrong: ['career', 'experience'], distractorNotes: ['Long-term professional path', 'Skills gained over time'], difficultyRating: 1 }),
            buildMcq({ questionText: 'The path of jobs you have over many years is your _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Career (sự nghiệp) là con đường nghề nghiệp lâu dài. Experience là kinh nghiệm đã có.', correct: 'career', wrong: ['experience', 'shift'], distractorNotes: ['Past skills, not the whole path', 'One work period'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Knowledge and skills you gain from doing a job is _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Experience (kinh nghiệm) là kỹ năng thu được khi làm việc. Salary là tiền lương.', correct: 'experience', wrong: ['salary', 'colleague'], distractorNotes: ['Payment, not skills', 'A person, not knowledge'], difficultyRating: 1 }),
            buildMcq({ questionText: 'When you stop working permanently because of age, you _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Retire (nghỉ hưu) nghĩa là ngừng làm việc vĩnh viễn. Apply là nộp đơn.', correct: 'retire', wrong: ['apply', 'interview'], distractorNotes: ['To send a job application', 'A meeting before getting a job'], difficultyRating: 1 }),
          ],
        }),
        buildExercise({
          slug: 'vocab-work-matching',
          title: 'Practice: Match the Pairs',
          instructions: 'Match each word on the left with the correct meaning on the right.',
          exerciseType: 'matching',
          sortOrder: 1,
          questions: [
            buildMatching({
              questionText: 'Match the work words to their meanings.',
              skillTag: 'vocabulary',
              topicTag: TOPIC,
              explanation: 'Mỗi từ khớp với một nghĩa rõ ràng. Employer và manager thường bị nhầm.',
              pairs: [
                { left: 'employer', right: 'the person or company that pays you to work' },
                { left: 'shift', right: 'a fixed period of work time' },
                { left: 'part-time', right: 'working fewer hours than a full week' },
                { left: 'apply', right: 'to send a request for a job' },
              ],
            }),
          ],
        }),
        buildExercise({
          slug: 'vocab-work-check',
          title: 'Check: Vocab Quiz',
          instructions: 'No hints — choose the best answer for each question.',
          exerciseType: 'multiple_choice',
          sortOrder: 2,
          questions: [
            buildMcq({ questionText: 'Ms Pham is the shop _____. She interviews new staff.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Manager (quản lý) phỏng vấn nhân viên mới. Colleague là đồng cấp.', correct: 'manager', wrong: ['colleague', 'salary'], distractorNotes: ['A co-worker, not the boss', 'Payment, not a person'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Tom works three evenings a week. He has a _____ job.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Part-time (bán thời gian) khi làm vài buổi/tuần. Career là sự nghiệp.', correct: 'part-time', wrong: ['career', 'retire'], distractorNotes: ['Long-term professional path', 'To stop working'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Before the interview, you should _____ online with your CV.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Apply (nộp đơn) là gửi đơn xin việc. Experience là kinh nghiệm.', correct: 'apply', wrong: ['experience', 'shift'], distractorNotes: ['Skills you already have', 'A work period'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Many people work in an _____ in the city centre.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Office (văn phòng) là nơi làm việc trong nhà. Interview là buổi phỏng vấn.', correct: 'office', wrong: ['interview', 'employer'], distractorNotes: ['A meeting, not a place', 'A person, not a building'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'vocab-work-apply',
          title: 'Apply: Complete the Job Sentences',
          instructions: 'Fill in each gap with the correct word.',
          exerciseType: 'gap_fill',
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: 'Complete: My [0] helped me prepare for the [1]. | The [2] is eight pounds an hour. | I work the evening [3] on Fridays.',
              skillTag: 'vocabulary',
              topicTag: TOPIC,
              explanation: 'colleague; interview; salary; shift — bốn từ cốt lõi trong ngữ cảnh xin việc.',
              template: 'My [0] helped me prepare for the [1]. The [2] is eight pounds an hour. I work the evening [3] on Fridays.',
              correctAnswers: ['colleague', 'interview', 'salary', 'shift'],
              acceptableAnswers: [['colleague', 'Colleague'], ['interview', 'Interview'], ['salary', 'Salary'], ['shift', 'Shift']],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    grammar: {
      slug: 'grammar-work-tenses',
      title: 'Lesson 2: Present Simple and Continuous at Work',
      learningObjective: 'Use present simple and present continuous correctly, and form Wh- questions about jobs.',
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: 'grammar-work-learn',
          title: 'Learn: Choose the Correct Form',
          instructions: 'Choose the best verb form for each sentence.',
          exerciseType: 'multiple_choice',
          sortOrder: 0,
          questions: [
            buildMcq({ questionText: 'I _____ in a bookshop every Saturday.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Every Saturday = thói quen → present simple: work.', correct: 'work', wrong: ['am working', 'worked'], distractorNotes: ['Temporary action now', 'Past tense'], difficultyRating: 1 }),
            buildMcq({ questionText: 'She _____ for an interview right now.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Right now = hành động đang diễn ra → is preparing.', correct: 'is preparing', wrong: ['prepares', 'prepared'], distractorNotes: ['Habit, not now', 'Past tense'], difficultyRating: 1 }),
            buildMcq({ questionText: '_____ does your shift start?', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Hỏi thời gian → When + does (present simple).', correct: 'When', wrong: ['What', 'Who'], distractorNotes: ['Asks about thing, not time', 'Asks about person'], difficultyRating: 1 }),
            buildMcq({ questionText: 'What _____ your colleague doing at the moment?', skillTag: 'grammar', topicTag: TOPIC, explanation: 'At the moment + continuous → is your colleague doing.', correct: 'is', wrong: ['does', 'do'], distractorNotes: ['Present simple auxiliary', 'Wrong person with colleague'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'grammar-work-practice',
          title: 'Practice: Complete the Grammar',
          instructions: 'Fill in each gap with the correct form.',
          exerciseType: 'gap_fill',
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText: 'Complete: I [0] in an office. | She [1] an interview today. | [2] do you work?',
              skillTag: 'grammar',
              topicTag: TOPIC,
              explanation: 'work (thói quen); is having (hôm nay, tạm thời); Where (hỏi địa điểm).',
              template: 'I [0] in an office. She [1] an interview today. [2] do you work?',
              correctAnswers: ['work', 'is having', 'Where'],
              acceptableAnswers: [['work', 'Work'], ['is having', "is having"], ['Where', 'where']],
              difficultyRating: 2,
            }),
            buildGapFill({
              questionText: 'Complete: They [0] hiring staff this month. | My manager [1] the morning shift. | [2] is your salary?',
              skillTag: 'grammar',
              topicTag: TOPIC,
              explanation: 'are hiring (tạm thời); works (thói quen); How much (hỏi số tiền).',
              template: 'They [0] hiring staff this month. My manager [1] the morning shift. [2] is your salary?',
              correctAnswers: ['are', 'works', 'How much'],
              acceptableAnswers: [['are', 'Are'], ['works', 'Works'], ['How much', 'how much']],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: 'grammar-work-check',
          title: 'Check: Grammar Challenge',
          instructions: 'Choose the correct answer. Think carefully.',
          exerciseType: 'multiple_choice',
          sortOrder: 2,
          questions: [
            buildMcq({ questionText: 'My employer usually _____ me on the last Friday of the month.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Usually = thói quen → pays (present simple).', correct: 'pays', wrong: ['is paying', 'pay'], distractorNotes: ['Action happening now', 'Wrong form with my employer'], difficultyRating: 2 }),
            buildMcq({ questionText: '_____ are you working extra shifts this week?', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Hỏi lý do → Why + are you working (continuous).', correct: 'Why', wrong: ['When', 'Who'], distractorNotes: ['Asks about time', 'Asks about person'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Tom _____ as a waiter, but this month he is training to be a manager.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Việc thường xuyên → works; tháng này tạm thời → is training.', correct: 'works', wrong: ['is working', 'worked'], distractorNotes: ['Sounds like only now', 'Past, not general fact'], difficultyRating: 3 }),
            buildMcq({ questionText: 'How many hours _____ you work each week?', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Wh- question present simple với you → do you work.', correct: 'do', wrong: ['are', 'does'], distractorNotes: ['Needs -ing verb', 'Wrong person'], difficultyRating: 3 }),
          ],
        }),
        buildExercise({
          slug: 'grammar-work-order',
          title: 'Apply: Build the Sentence',
          instructions: 'Put the words in the correct order to make a sentence.',
          exerciseType: 'sentence_ordering',
          sortOrder: 3,
          questions: [
            buildSentenceOrdering({ questionText: 'Make a sentence: Where / do / you / work?', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Where do you work? — Wh- question present simple.', words: ['Where', 'do', 'you', 'work?'], correctOrder: [0, 1, 2, 3], difficultyRating: 2 }),
            buildSentenceOrdering({ questionText: 'Make a sentence: She / is / preparing / for / an interview / now.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'She is preparing for an interview now. — present continuous.', words: ['She', 'is', 'preparing', 'for', 'an interview', 'now.'], correctOrder: [0, 1, 2, 3, 4, 5], difficultyRating: 2 }),
            buildSentenceOrdering({ questionText: 'Make a sentence: My colleague / usually / starts / his shift / at nine.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'My colleague usually starts his shift at nine. — present simple + adverb.', words: ['My colleague', 'usually', 'starts', 'his shift', 'at nine.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 3 }),
          ],
        }),
      ],
    },

    reading: {
      slug: 'reading-job-advert',
      title: 'Lesson 3: Job Advertisement',
      learningObjective: 'Scan a job advertisement to find specific details about salary, shifts and requirements.',
      estimatedMinutes: 23,
      exercises: [
        buildReadingExercise({
          slug: 'reading-job-learn',
          title: 'Learn: Read the Job Advert',
          instructions: 'Read the advertisement carefully. Answer the detail questions.',
          sortOrder: 0,
          passage: jobAdPassage,
          questions: [
            buildMcq({ questionText: 'What days does the shop assistant work?', skillTag: 'reading', topicTag: TOPIC, explanation: 'REQUIREMENTS: Able to work on Saturday and Sunday.', correct: 'Saturday and Sunday', wrong: ['Monday to Friday', 'Only Saturday'], distractorNotes: ['Weekdays not mentioned', 'Sunday is also required'], assessmentType: 'detail', difficultyRating: 1 }),
            buildMcq({ questionText: 'How much experience do applicants need?', skillTag: 'reading', topicTag: TOPIC, explanation: 'At least one year of customer service experience.', correct: 'At least one year', wrong: ['No experience', 'Three years'], distractorNotes: ['Experience is required', 'Only one year needed'], assessmentType: 'detail', difficultyRating: 1 }),
          ],
        }),
        buildReadingExercise({
          slug: 'reading-job-practice',
          title: 'Practice: Words in the Advert',
          instructions: 'Read the advertisement again. Answer about vocabulary and meaning.',
          sortOrder: 1,
          passage: jobAdPassage,
          difficulty: 0.3,
          questions: [
            buildMcq({ questionText: "In the advert, 'shift' refers to _____.", skillTag: 'reading', topicTag: TOPIC, explanation: 'Saturday shift from 9 a.m. to 5 p.m. = một ca làm việc cụ thể.', correct: 'a fixed period of work time', wrong: ['the salary amount', 'a job interview'], distractorNotes: ['Salary is separate', 'Interview is a meeting'], assessmentType: 'vocabulary_in_context', difficultyRating: 2 }),
            buildMcq({ questionText: 'Why does Ms Pham mention her own story?', skillTag: 'reading', topicTag: TOPIC, explanation: 'She says the job helped her build skills for her career — khuyến khích ứng viên.', correct: 'To show the job can help your career', wrong: ['To explain the salary', 'To say when to retire'], distractorNotes: ['Salary listed separately', 'Retire not the message'], assessmentType: 'inference', difficultyRating: 2 }),
          ],
        }),
        buildReadingExercise({
          slug: 'reading-job-check',
          title: 'Check: Main Idea and Order',
          instructions: 'Read the advertisement one more time. These questions need careful thinking.',
          sortOrder: 2,
          passage: jobAdPassage,
          difficulty: 0.35,
          questions: [
            buildMcq({ questionText: 'What is the main purpose of this advertisement?', skillTag: 'reading', topicTag: TOPIC, explanation: 'Toàn bộ quảng cáo tuyển part-time shop assistant và hướng dẫn apply.', correct: 'To recruit a part-time shop assistant', wrong: ['To announce a book sale', 'To describe Ms Pham retiring'], distractorNotes: ['Sale not mentioned', 'Ms Pham started as student'], assessmentType: 'main_idea', difficultyRating: 1 }),
            buildMcq({ questionText: 'Put the sections in order: (1) Requirements (2) How to apply (3) Job description and benefits', skillTag: 'reading', topicTag: TOPIC, explanation: 'Thứ tự: mô tả công việc + benefits → requirements → how to apply.', correct: '3 → 1 → 2', wrong: ['1 → 2 → 3', '2 → 3 → 1'], distractorNotes: ['Requirements come after description', 'Apply section is last'], assessmentType: 'sequencing', difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'reading-job-apply',
          title: 'Apply: Match Facts from the Advert',
          instructions: 'Use what you read. Match each item to the correct fact.',
          exerciseType: 'matching',
          sortOrder: 3,
          content: { passage: jobAdPassage },
          questions: [
            buildMatching({
              questionText: 'Match each topic to a fact from the advertisement.',
              skillTag: 'reading',
              topicTag: TOPIC,
              explanation: 'Mỗi mục khớp với thông tin cụ thể trong quảng cáo tuyển dụng.',
              pairs: [
                { left: 'Salary', right: 'Above the minimum wage' },
                { left: 'Apply by', right: 'Email before 30 April' },
                { left: 'Employer benefit', right: 'Free books after three months' },
                { left: 'Manager', right: 'Ms Pham' },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    listening: {
      slug: 'listening-job-interview',
      title: 'Lesson 4: Job Interview',
      learningObjective: 'Listen to a job interview and extract factual information about experience, salary and shifts.',
      estimatedMinutes: 22,
      exercises: [
        buildListeningExercise({
          slug: 'listening-interview-learn',
          title: 'Learn: Café Interview',
          instructions: 'Listen to the interview. Answer the first two questions.',
          sortOrder: 0,
          script: interviewScript1,
          answerKey: { q1: 'part-time waiter', q2: 'bookshop six months' },
          questions: [
            buildMcq({ questionText: 'What job did Tom apply for?', skillTag: 'listening', topicTag: TOPIC, explanation: 'Tom says he applied for the part-time waiter job.', correct: 'Part-time waiter', wrong: ['Shop manager', 'Bookshop assistant'], distractorNotes: ['Ms Lee is the manager', 'His past job, not application'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Where did Tom get his work experience?', skillTag: 'listening', topicTag: TOPIC, explanation: 'He worked in a bookshop for six months.', correct: 'In a bookshop', wrong: ['In a café', 'In an office'], distractorNotes: ['Interview is at café', 'Not mentioned'], difficultyRating: 1 }),
          ],
        }),
        buildListeningExercise({
          slug: 'listening-interview-practice',
          title: 'Practice: More from the Interview',
          instructions: 'Listen again to the same interview. Answer the next questions.',
          sortOrder: 1,
          script: interviewScript1,
          answerKey: { q1: 'eight pounds an hour', q2: 'Friday evenings' },
          difficulty: 0.28,
          questions: [
            buildMcq({ questionText: 'What is the salary?', skillTag: 'listening', topicTag: TOPIC, explanation: 'The salary is eight pounds an hour.', correct: 'Eight pounds an hour', wrong: ['Ten pounds an hour', 'Minimum wage only'], distractorNotes: ['Not stated', 'Advert mentions above minimum'], difficultyRating: 2 }),
            buildMcq({ questionText: 'When can Tom work?', skillTag: 'listening', topicTag: TOPIC, explanation: 'He can work the evening shift on Fridays.', correct: 'Friday evenings', wrong: ['Saturday mornings', 'Every weekday'], distractorNotes: ['From job advert', 'He is studying'], difficultyRating: 2 }),
          ],
        }),
        buildListeningExercise({
          slug: 'listening-career-check',
          title: 'Check: Career Advice Call',
          instructions: 'Listen to a new conversation. Choose the correct answer.',
          sortOrder: 2,
          script: interviewScript2,
          answerKey: { q1: 'nurse assistant course', q2: 'before September', q3: 'volunteering' },
          difficulty: 0.32,
          questions: [
            buildMcq({ questionText: 'What did Linh have yesterday?', skillTag: 'listening', topicTag: TOPIC, explanation: 'She had an interview for a nurse assistant course.', correct: 'An interview for a nurse assistant course', wrong: ['A job at a hospital', 'A meeting with her employer'], distractorNotes: ['Not yet employed', 'Advisor call is today'], difficultyRating: 1 }),
            buildMcq({ questionText: 'When should Linh apply for training programmes?', skillTag: 'listening', topicTag: TOPIC, explanation: 'You should apply before September.', correct: 'Before September', wrong: ['After she retires', 'Next Monday'], distractorNotes: ['Retire mentioned differently', 'Monday is for Tom'], difficultyRating: 2 }),
            buildMcq({ questionText: 'What does the advisor suggest for more experience?', skillTag: 'listening', topicTag: TOPIC, explanation: 'Have you thought about volunteering?', correct: 'Volunteering in a hospital', wrong: ['Working a night shift', 'Getting a higher salary'], distractorNotes: ['Not mentioned', 'Not the advice'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'listening-interview-match',
          title: 'Apply: Match What You Heard',
          instructions: 'Listen again to the café interview. Match each item to the correct detail.',
          exerciseType: 'matching',
          sortOrder: 3,
          content: { script: interviewScript1, audioUrl: '/audio/listening/ket/unit-02/listening-interview-match.mp3' },
          questions: [
            buildMatching({
              questionText: 'Match each item from the café interview.',
              skillTag: 'listening',
              topicTag: TOPIC,
              explanation: 'Mỗi mục khớp với chi tiết Tom và Ms Lee nói trong phỏng vấn.',
              pairs: [
                { left: 'Tom\'s past job', right: 'Bookshop for six months' },
                { left: 'Salary offered', right: 'Eight pounds an hour' },
                { left: 'Shift discussed', right: 'Friday evenings' },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    writing: {
      slug: 'writing-job-application',
      title: 'Lesson 5: Apply for a Job',
      learningObjective: 'Write a short email applying for a part-time job using work vocabulary and correct tenses.',
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: 'writing-job-learn',
          title: 'Learn: Application Phrases',
          instructions: 'Complete each gap with a word from the box: Dear, apply, experience, salary, thank.',
          exerciseType: 'gap_fill',
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText: 'Complete: [0] Ms Pham, | I would like to [1] for the shop assistant job. | I have one year of [2]. | What is the [3]?',
              skillTag: 'writing',
              topicTag: TOPIC,
              explanation: 'Dear; apply; experience; salary — khung email ứng tuyển cơ bản.',
              template: '[0] Ms Pham,\n\nI would like to [1] for the shop assistant job. I have one year of [2]. What is the [3]?',
              correctAnswers: ['Dear', 'apply', 'experience', 'salary'],
              acceptableAnswers: [['Dear', 'dear'], ['apply', 'Apply'], ['experience', 'Experience'], ['salary', 'Salary']],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: 'writing-job-order-practice',
          title: 'Practice: Build Application Sentences',
          instructions: 'Put the words in order to make correct sentences for a job email.',
          exerciseType: 'sentence_ordering',
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({ questionText: 'Make a sentence: I / work / in a bookshop / every Saturday.', skillTag: 'writing', topicTag: TOPIC, explanation: 'I work in a bookshop every Saturday. — present simple thói quen.', words: ['I', 'work', 'in a bookshop', 'every Saturday.'], correctOrder: [0, 1, 2, 3], difficultyRating: 2 }),
            buildSentenceOrdering({ questionText: 'Make a sentence: I / am / available / for / the weekend shift.', skillTag: 'writing', topicTag: TOPIC, explanation: 'I am available for the weekend shift. — present continuous/tobe cho tình huống hiện tại.', words: ['I', 'am', 'available', 'for', 'the weekend shift.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'writing-job-check',
          title: 'Check: Job Application Email',
          instructions: 'Write an email to apply for a part-time job. Write at least 25 words.',
          exerciseType: 'writing',
          sortOrder: 2,
          content: {
            taskDescription: 'You saw the Greenway Bookshop job advertisement. Write an email to Ms Pham to apply for the part-time shop assistant job.',
            prompts: [
              'Say which job you are applying for.',
              'Describe your work experience.',
              'Say when you can work (mention a shift).',
              'Ask a polite question about the salary or interview.',
              'End the email politely.',
            ],
            minWords: 25,
            successCriteria: [
              'At least 25 words',
              'Clear application for the shop assistant job',
              'Mentions experience and availability',
              'Polite question about salary or interview',
              'Appropriate email opening and closing',
            ],
            modelAnswer: {
              text: 'Dear Ms Pham,\n\nI am writing to apply for the part-time shop assistant job. I worked in a café for six months and my colleagues said I am friendly with customers. I can work the Saturday shift and Sunday shift. Could you tell me when the interview is? I would like to know more about the salary too.\n\nThank you,\nMinh',
            },
            rubric: {
              grammar: { weight: 0.25, criteria: 'Uses present simple and/or present continuous correctly.' },
              vocabulary: { weight: 0.25, criteria: 'Uses work words (apply, experience, shift, salary, interview) appropriately.' },
              organization: { weight: 0.25, criteria: 'Email has greeting, body and polite closing.' },
              taskAchievement: { weight: 0.25, criteria: 'Applies for the job with experience and availability; at least 25 words.' },
            },
            autoCheckKeywords: ['dear', 'apply', 'experience', 'shift', 'salary', 'interview', 'thank', 'ms', 'pham', 'job'],
          },
        }),
        buildExercise({
          slug: 'writing-job-apply',
          title: 'Apply: Complete the Email Frames',
          instructions: 'Complete the email frames with the correct unit words.',
          exerciseType: 'gap_fill',
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: 'Complete: Dear Manager, | I want to [0] for the evening [1]. | I have shop [2] from last summer. | [3] you, | Linh',
              skillTag: 'writing',
              topicTag: TOPIC,
              explanation: 'apply; shift; experience; Thank — hoàn thiện email ứng tuyển ngắn.',
              template: 'Dear Manager,\n\nI want to [0] for the evening [1]. I have shop [2] from last summer.\n\n[3] you,\nLinh',
              correctAnswers: ['apply', 'shift', 'experience', 'Thank'],
              acceptableAnswers: [['apply', 'Apply'], ['shift', 'Shift'], ['experience', 'Experience'], ['Thank', 'Thanks', 'thank', 'thanks']],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    speaking: {
      slug: 'speaking-work-career',
      title: 'Lesson 6: Talk About Work',
      learningObjective: 'Answer interview questions about jobs, experience and career plans.',
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: 'speaking-work-learn',
          title: 'Learn: Choose the Best Reply',
          instructions: 'Imagine an examiner asks you a question. Choose the best answer.',
          exerciseType: 'multiple_choice',
          sortOrder: 0,
          questions: [
            buildMcq({ questionText: 'Examiner: Where do you work? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Present simple + địa điểm: I work in a bookshop.', correct: 'I work in a bookshop on Saturdays.', wrong: ['I am work in a bookshop.', 'I working in a bookshop.'], distractorNotes: ['Wrong auxiliary', 'Missing auxiliary verb'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Examiner: What is your colleague doing now? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Present continuous: is helping a customer.', correct: 'She is helping a customer.', wrong: ['She helps a customer now.', 'She help a customer now.'], distractorNotes: ['Simple present for now', 'Wrong verb form'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Examiner: Tell me about your work experience. You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Mô tả kinh nghiệm quá khứ ngắn gọn, tự nhiên.', correct: 'I worked in a café for six months.', wrong: ['I retire in a café.', 'My salary is experience.'], distractorNotes: ['Wrong verb', 'Nonsense collocation'], difficultyRating: 1 }),
          ],
        }),
        buildExercise({
          slug: 'speaking-work-practice',
          title: 'Practice: Best Response',
          instructions: 'Choose the best phrase you would say in each situation.',
          exerciseType: 'multiple_choice',
          sortOrder: 1,
          questions: [
            buildMcq({ questionText: 'Examiner: When does your shift start? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Trả lời thời gian cụ thể — câu trả lời phỏng vấn A2.', correct: 'It starts at nine o\'clock in the morning.', wrong: ['It is start at nine.', 'It starting at nine.'], distractorNotes: ['Wrong form', 'Missing auxiliary'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Examiner: Do you want a career in business? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Career + lý do ngắn — cấu trúc trả lời tự nhiên.', correct: 'Yes, I want a career in business because I like working with people.', wrong: ['Yes, I want interview in business.', 'Yes, I shift in business.'], distractorNotes: ['Wrong noun', 'Wrong word'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Examiner: What are you doing this week at work? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Present continuous cho tuần này: I am training with my manager.', correct: 'I am training with my manager this week.', wrong: ['I train with my manager usually.', 'I am train with my manager.'], distractorNotes: ['Habit, not this week', 'Wrong -ing form'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'speaking-work-interview',
          title: 'Check: Work and Career Interview',
          instructions: 'Answer the examiner\'s questions about work. Speak for up to two minutes.',
          exerciseType: 'speaking',
          sortOrder: 2,
          content: {
            prompt: 'The examiner will ask you about your job, work experience, salary and career plans.',
            sceneDescription: 'A young person in a shop uniform talking to a manager, with a shift schedule on the wall.',
            followUpQuestions: [
              'Do you have a part-time job now? What do you do?',
              'Where do you work and who are your colleagues?',
              'What experience do you have?',
              'What shift do you usually work?',
              'What career would you like in the future?',
              'When do people usually retire in your country?',
            ],
            suggestedAnswers: [
              'Yes, I work part-time in a bookshop on weekends.',
              'I work in the city centre. My colleagues are very friendly.',
              'I have six months of customer service experience.',
              'I usually work the Saturday morning shift.',
              'I would like a career in hotel management.',
              'Many people retire at sixty or sixty-five.',
            ],
            assessmentCriteria: {
              pronunciation: 'Key words (colleague, salary, interview, career, shift) are understandable.',
              fluency: 'Responds with phrases or short sentences without long silences.',
              grammar: 'Uses present simple and present continuous or Wh- answers in at least two responses.',
              vocabulary: 'Uses at least four different unit words correctly.',
            },
            maxDurationSeconds: 120,
          },
        }),
        buildExercise({
          slug: 'speaking-work-apply',
          title: 'Apply: Situational Responses',
          instructions: 'Choose the best thing to say in each situation.',
          exerciseType: 'multiple_choice',
          sortOrder: 3,
          questions: [
            buildMcq({ questionText: 'Your employer asks why you are late for your shift. You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Xin lỗi lịch sự + lý do ngắn — phù hợp nơi làm việc.', correct: 'I\'m sorry. The bus was late this morning.', wrong: ['I\'m sorry. I retire this morning.', 'I\'m sorry. My salary was late.'], distractorNotes: ['Wrong verb', 'Illogical reason'], difficultyRating: 2 }),
            buildMcq({ questionText: 'A friend asks about your interview yesterday. You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Mô tả ngắn về phỏng vấn — câu trả lời tự nhiên.', correct: 'It went well. The manager asked about my experience.', wrong: ['It went well. The manager asked about my retire.', 'It went well. I shift at the manager.'], distractorNotes: ['Wrong word', 'Nonsense'], difficultyRating: 2 }),
            buildMcq({ questionText: 'The examiner asks: What is your employer like? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Mô tả employer — tính từ + ví dụ ngắn.', correct: 'My employer is fair and pays a good salary.', wrong: ['My employer is interview and career.', 'My employer is colleague every day.'], distractorNotes: ['Wrong word class', 'Awkward meaning'], difficultyRating: 3 }),
          ],
        }),
      ],
    },
  },
};
