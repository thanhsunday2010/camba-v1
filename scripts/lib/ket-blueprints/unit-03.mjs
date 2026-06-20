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

const TOPIC = 'health-and-lifestyle';

const healthArticlePassage = buildPassage({
  title: 'Staying Healthy This Winter',
  text: `HEALTH TIPS FROM DR NGUYEN

Winter is a busy time at our clinic. Many patients call to make an appointment because of cold symptoms such as a cough or fever. Dr Nguyen says prevention is better than treatment.

"Wash your hands often and eat healthy food," she advises. "If you have an allergy to nuts, check food labels carefully. A few nuts can cause a serious problem."

When you feel unwell, note your symptoms and rest at home. You should drink a little warm water and sleep well. You must not share cups with family members if you are ill.

For a bad injury, go to hospital immediately. The nurse will clean the wound and give you a prescription for medicine. Most people recover in a week if they follow the doctor's advice.

Remember: you need to finish all your medicine, even when you feel better. If symptoms continue, book another appointment. Prevention, rest and good habits help you stay healthy all year.`,
  imagePrompt: 'A friendly doctor in a clinic giving health advice on a poster about symptoms, prevention and appointments; clean medical setting.',
});

const doctorVisitScript1 = buildListeningScript({
  title: 'At the Doctor\'s Surgery',
  setting: 'Doctor\'s waiting room and consultation',
  speakers: [{ name: 'Receptionist', role: 'clinic receptionist' }, { name: 'Patient', role: 'student patient' }],
  lines: [
    { speaker: 'Receptionist', text: 'Good morning. Do you have an appointment today?' },
    { speaker: 'Patient', text: 'Yes. My name is Lan. I booked online yesterday.' },
    { speaker: 'Receptionist', text: 'Please sit down. The doctor is busy with another patient.' },
    { speaker: 'Patient', text: 'Thank you. I have had a bad cough for three days.' },
    { speaker: 'Receptionist', text: 'That is a common symptom in winter. Have you taken any medicine?' },
    { speaker: 'Patient', text: 'No. I thought I should rest first. I also have a little fever.' },
    { speaker: 'Receptionist', text: 'The doctor will check you soon. You must wear a mask in the clinic.' },
  ],
  audioNotes: 'Clear clinic dialogue, calm tone. Approx. 45 seconds.',
});

const healthPodcastScript2 = buildListeningScript({
  title: 'Health Podcast — Exercise and Prevention',
  setting: 'Radio health segment',
  speakers: [{ name: 'Host', role: 'radio presenter' }],
  lines: [
    { speaker: 'Host', text: 'Welcome to Healthy Living. Today we talk about exercise and prevention.' },
    { speaker: 'Host', text: 'You should do a little exercise every day, even a short walk. A few minutes can help.' },
    { speaker: 'Host', text: 'For injury prevention, warm up before sport. You must wear good shoes when you run.' },
    { speaker: 'Host', text: 'If you have an allergy, tell your coach. Some people need to avoid certain foods.' },
    { speaker: 'Host', text: 'Remember, treatment is important, but healthy habits help you recover faster too.' },
    { speaker: 'Host', text: 'Next week we will discuss sleep and stress. Thanks for listening.' },
  ],
  audioNotes: 'Friendly radio presenter, moderate pace. Approx. 40 seconds.',
});

export default {
  vocabularyBank: [
    buildVocabWord({ word: 'appointment', ipa: '/əˈpɔɪntmənt/', partOfSpeech: 'noun', vietnameseMeaning: 'cuộc hẹn (khám bác sĩ)', exampleSentence: 'I have a doctor\'s appointment at ten.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'symptom', ipa: '/ˈsɪmptəm/', partOfSpeech: 'noun', vietnameseMeaning: 'triệu chứng', exampleSentence: 'A cough is a common symptom of a cold.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'recover', ipa: '/rɪˈkʌvə(r)/', partOfSpeech: 'verb', vietnameseMeaning: 'hồi phục / khỏi bệnh', exampleSentence: 'She recovered after a week of rest.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'prescription', ipa: '/prɪˈskrɪpʃn/', partOfSpeech: 'noun', vietnameseMeaning: 'đơn thuốc', exampleSentence: 'The doctor gave me a prescription for medicine.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'allergy', ipa: '/ˈælədʒi/', partOfSpeech: 'noun', vietnameseMeaning: 'dị ứng', exampleSentence: 'He has an allergy to milk.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'injury', ipa: '/ˈɪndʒəri/', partOfSpeech: 'noun', vietnameseMeaning: 'chấn thương', exampleSentence: 'She got a leg injury playing football.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'treatment', ipa: '/ˈtriːtmənt/', partOfSpeech: 'noun', vietnameseMeaning: 'điều trị', exampleSentence: 'The treatment helped him feel better.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'prevention', ipa: '/prɪˈvenʃn/', partOfSpeech: 'noun', vietnameseMeaning: 'phòng ngừa', exampleSentence: 'Hand washing is good prevention against illness.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'doctor', ipa: '/ˈdɒktə(r)/', partOfSpeech: 'noun', vietnameseMeaning: 'bác sĩ', exampleSentence: 'The doctor checked my symptoms carefully.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'nurse', ipa: '/nɜːs/', partOfSpeech: 'noun', vietnameseMeaning: 'y tá', exampleSentence: 'The nurse cleaned the injury.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'exercise', ipa: '/ˈeksəsaɪz/', partOfSpeech: 'noun', vietnameseMeaning: 'tập thể dục', exampleSentence: 'A little exercise every day keeps you healthy.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'healthy', ipa: '/ˈhelθi/', partOfSpeech: 'adjective', vietnameseMeaning: 'khỏe mạnh', exampleSentence: 'Eat healthy food and sleep well.', difficulty: 1, topic: TOPIC }),
  ],

  grammarReference: [
    buildGrammarRef({
      structure: 'Modals: should, must, need to',
      explanation: 'Use should for advice (You should rest), must for strong rules or necessity (You must wear a mask), and need to for something necessary (You need to take medicine). After modals, use the base verb without to (except need to).',
      examples: [
        'You should drink warm water when you have a cough.',
        'You must not share cups when you are ill.',
        'You need to finish all your medicine.',
        'Patients should make an appointment before visiting.',
      ],
      commonMistakes: [
        'You should to rest (×) → You should rest (✓)',
        'You must wearing a mask (×) → You must wear a mask (✓)',
        'You need finish the treatment (×) → You need to finish the treatment (✓)',
      ],
      topic: TOPIC,
    }),
    buildGrammarRef({
      structure: 'Countable / uncountable with a few / a little',
      explanation: 'Use a few + countable plural nouns (a few nuts, a few symptoms). Use a little + uncountable nouns (a little water, a little exercise). Some/any follow the same countable/uncountable rules.',
      examples: [
        'She has a few symptoms: cough and fever.',
        'Drink a little warm water before bed.',
        'A few minutes of exercise help prevention.',
        'There is a little medicine left in the bottle.',
      ],
      commonMistakes: [
        'A little symptoms (×) → A few symptoms (✓)',
        'A few water (×) → A little water (✓)',
        'Few exercise every day (×) → A little exercise every day (✓)',
      ],
      topic: TOPIC,
    }),
  ],

  unit: {
    learningObjectives: [
      'Use core health and lifestyle vocabulary at A2 level.',
      'Use should, must and need to to give and understand health advice.',
      'Use a few and a little correctly with countable and uncountable nouns.',
      'Understand vocabulary in context in a short health article.',
      'Understand attitude and opinion in a health podcast recording.',
      'Write a short note about symptoms and an appointment request.',
      'Answer interview questions about health habits and lifestyle.',
    ],
  },

  lessons: {
    vocabulary: {
      slug: 'vocab-health-words',
      title: 'Lesson 1: Health and Lifestyle Words',
      learningObjective: 'Recognise and understand twelve health and lifestyle words at KET A2 level.',
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: 'vocab-health-learn',
          title: 'Learn: Health Word Match',
          instructions: 'Read each sentence. Choose the best word.',
          exerciseType: 'multiple_choice',
          sortOrder: 0,
          questions: [
            buildMcq({ questionText: 'A planned meeting with a doctor is an _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Appointment (cuộc hẹn) là lịch gặp bác sĩ. Treatment là điều trị.', correct: 'appointment', wrong: ['treatment', 'prescription'], distractorNotes: ['Medical care, not a meeting', 'Paper for medicine'], difficultyRating: 1 }),
            buildMcq({ questionText: 'A sign that you are ill, like a cough or fever, is a _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Symptom (triệu chứng) báo hiệu bệnh. Prevention là phòng ngừa.', correct: 'symptom', wrong: ['prevention', 'injury'], distractorNotes: ['Stopping illness', 'Physical damage from accident'], difficultyRating: 1 }),
            buildMcq({ questionText: 'To get healthy again after an illness means to _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Recover (hồi phục) nghĩa là khỏe lại. Allergy là dị ứng.', correct: 'recover', wrong: ['allergy', 'exercise'], distractorNotes: ['Bad reaction to something', 'Physical activity'], difficultyRating: 1 }),
            buildMcq({ questionText: 'A piece of paper from a doctor for medicine is a _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Prescription (đơn thuốc) do bác sĩ kê. Symptom là triệu chứng.', correct: 'prescription', wrong: ['symptom', 'appointment'], distractorNotes: ['Sign of illness', 'Meeting time'], difficultyRating: 1 }),
            buildMcq({ questionText: 'A bad reaction to food like nuts or milk is an _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Allergy (dị ứng) phản ứng với thực phẩm/chất. Injury là chấn thương.', correct: 'allergy', wrong: ['injury', 'treatment'], distractorNotes: ['Damage from accident', 'Medical care'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Damage to your body from an accident is an _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Injury (chấn thương) do tai nạn. Symptom là biểu hiện bệnh.', correct: 'injury', wrong: ['symptom', 'prevention'], distractorNotes: ['Illness sign', 'Stopping problems'], difficultyRating: 1 }),
          ],
        }),
        buildExercise({
          slug: 'vocab-health-matching',
          title: 'Practice: Match the Pairs',
          instructions: 'Match each word on the left with the correct meaning on the right.',
          exerciseType: 'matching',
          sortOrder: 1,
          questions: [
            buildMatching({
              questionText: 'Match the health words to their meanings.',
              skillTag: 'vocabulary',
              topicTag: TOPIC,
              explanation: 'Mỗi từ khớp với nghĩa rõ ràng. Treatment và prevention thường bị nhầm.',
              pairs: [
                { left: 'treatment', right: 'medical care to make you better' },
                { left: 'prevention', right: 'actions to stop illness before it starts' },
                { left: 'doctor', right: 'a person who diagnoses and treats patients' },
                { left: 'healthy', right: 'in good physical condition' },
              ],
            }),
          ],
        }),
        buildExercise({
          slug: 'vocab-health-check',
          title: 'Check: Vocab Quiz',
          instructions: 'No hints — choose the best answer for each question.',
          exerciseType: 'multiple_choice',
          sortOrder: 2,
          questions: [
            buildMcq({ questionText: 'The _____ gave Lan a prescription after checking her cough.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Doctor (bác sĩ) khám và kê đơn. Nurse thường hỗ trợ điều trị.', correct: 'doctor', wrong: ['nurse', 'appointment'], distractorNotes: ['May assist but doctor prescribes', 'A meeting, not a person'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Dr Nguyen says _____ is better than waiting for treatment.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Prevention is better than treatment — phòng bệnh hơn chữa bệnh.', correct: 'prevention', wrong: ['injury', 'symptom'], distractorNotes: ['Damage, not a strategy', 'Sign of illness'], difficultyRating: 2 }),
            buildMcq({ questionText: 'After the football match, he had a knee _____ and went to hospital.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Injury (chấn thương) sau tai nạn thể thao. Allergy là dị ứng.', correct: 'injury', wrong: ['allergy', 'appointment'], distractorNotes: ['Food reaction', 'Scheduled visit'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Eat _____ food and do a little _____ every day.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Healthy food + exercise — thói quen sống khỏe.', correct: 'healthy ... exercise', wrong: ['symptom ... prescription', 'injury ... treatment'], distractorNotes: ['Illness words', 'Medical care context'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'vocab-health-apply',
          title: 'Apply: Complete the Health Sentences',
          instructions: 'Fill in each gap with the correct word.',
          exerciseType: 'gap_fill',
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: 'Complete: I made an [0] with the doctor. | My main [1] is a sore throat. | The [2] gave me medicine. | I will [3] in a few days.',
              skillTag: 'vocabulary',
              topicTag: TOPIC,
              explanation: 'appointment; symptom; nurse/doctor — prescription context; recover.',
              template: 'I made an [0] with the doctor. My main [1] is a sore throat. The nurse gave me [2] from the doctor. I will [3] in a few days.',
              correctAnswers: ['appointment', 'symptom', 'medicine', 'recover'],
              acceptableAnswers: [['appointment', 'Appointment'], ['symptom', 'Symptom'], ['medicine', 'Medicine', 'a prescription', 'prescription'], ['recover', 'Recover']],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    grammar: {
      slug: 'grammar-health-modals',
      title: 'Lesson 2: Health Advice and Quantifiers',
      learningObjective: 'Use should, must and need to for health advice, and a few / a little with nouns.',
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: 'grammar-health-learn',
          title: 'Learn: Choose the Correct Form',
          instructions: 'Choose the best word or phrase for each sentence.',
          exerciseType: 'multiple_choice',
          sortOrder: 0,
          questions: [
            buildMcq({ questionText: 'You _____ rest when you have a fever.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Should = lời khuyên: You should rest.', correct: 'should', wrong: ['must to', 'need'], distractorNotes: ['Must + base verb, no to', 'Need to + verb'], difficultyRating: 1 }),
            buildMcq({ questionText: 'You _____ wear a mask in the clinic. It is a rule.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Must = quy định bắt buộc.', correct: 'must', wrong: ['should to', 'needs'], distractorNotes: ['No to after should', 'Wrong person/form'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Drink _____ warm water before bed.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Water không đếm được → a little.', correct: 'a little', wrong: ['a few', 'few'], distractorNotes: ['Few + countable plural', 'Few without article changes meaning'], difficultyRating: 1 }),
            buildMcq({ questionText: 'She has _____ symptoms: cough and headache.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Symptoms đếm được → a few.', correct: 'a few', wrong: ['a little', 'little'], distractorNotes: ['Little + uncountable', 'Little = not much'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'grammar-health-practice',
          title: 'Practice: Complete the Grammar',
          instructions: 'Fill in each gap with the correct form.',
          exerciseType: 'gap_fill',
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText: 'Complete: You [0] see a doctor if symptoms continue. | You [1] to finish your medicine. | Drink [2] water.',
              skillTag: 'grammar',
              topicTag: TOPIC,
              explanation: 'should (lời khuyên); need (need to); a little (nước không đếm được).',
              template: 'You [0] see a doctor if symptoms continue. You [1] to finish your medicine. Drink [2] water.',
              correctAnswers: ['should', 'need', 'a little'],
              acceptableAnswers: [['should', 'Should'], ['need', 'Need'], ['a little', 'A little']],
              difficultyRating: 2,
            }),
            buildGapFill({
              questionText: 'Complete: You [0] not share cups when you are ill. | I have [1] apples for a healthy snack. | Do [2] exercise every day.',
              skillTag: 'grammar',
              topicTag: TOPIC,
              explanation: 'must (cấm); a few (apples đếm được); a little (exercise không đếm).',
              template: 'You [0] not share cups when you are ill. I have [1] apples for a healthy snack. Do [2] exercise every day.',
              correctAnswers: ['must', 'a few', 'a little'],
              acceptableAnswers: [['must', 'Must'], ['a few', 'A few'], ['a little', 'A little']],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: 'grammar-health-check',
          title: 'Check: Grammar Challenge',
          instructions: 'Choose the correct answer. Think carefully.',
          exerciseType: 'multiple_choice',
          sortOrder: 2,
          questions: [
            buildMcq({ questionText: 'Patients _____ make an appointment before visiting the clinic.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Should = khuyên nên đặt lịch trước.', correct: 'should', wrong: ['must to', 'needs to'], distractorNotes: ['No to after must', 'Wrong agreement'], difficultyRating: 2 }),
            buildMcq({ questionText: 'There is _____ medicine left. Take it tonight.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Medicine không đếm được → a little.', correct: 'a little', wrong: ['a few', 'few medicines'], distractorNotes: ['Few + countable', 'Medicine usually uncountable here'], difficultyRating: 2 }),
            buildMcq({ questionText: 'You _____ tell the doctor about your allergy to nuts.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Must = bắt buộc thông tin quan trọng.', correct: 'must', wrong: ['should to', 'need'], distractorNotes: ['No to', 'Need to required'], difficultyRating: 3 }),
            buildMcq({ questionText: 'He felt better after _____ days of treatment.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Days đếm được → a few days.', correct: 'a few', wrong: ['a little', 'little'], distractorNotes: ['Little + uncountable', 'Changes meaning'], difficultyRating: 3 }),
          ],
        }),
        buildExercise({
          slug: 'grammar-health-order',
          title: 'Apply: Build the Sentence',
          instructions: 'Put the words in the correct order to make a sentence.',
          exerciseType: 'sentence_ordering',
          sortOrder: 3,
          questions: [
            buildSentenceOrdering({ questionText: 'Make a sentence: You / should / drink / a little / warm water.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'You should drink a little warm water. — modal + a little + uncountable.', words: ['You', 'should', 'drink', 'a little', 'warm water.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 2 }),
            buildSentenceOrdering({ questionText: 'Make a sentence: You / must / not / share / cups.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'You must not share cups. — must not + base verb.', words: ['You', 'must', 'not', 'share', 'cups.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 2 }),
            buildSentenceOrdering({ questionText: 'Make a sentence: I / have / a few / symptoms / today.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'I have a few symptoms today. — a few + countable plural.', words: ['I', 'have', 'a few', 'symptoms', 'today.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 3 }),
          ],
        }),
      ],
    },

    reading: {
      slug: 'reading-health-article',
      title: 'Lesson 3: Health Article',
      learningObjective: 'Understand health vocabulary in context and identify advice in a short article.',
      estimatedMinutes: 23,
      exercises: [
        buildReadingExercise({
          slug: 'reading-health-learn',
          title: 'Learn: Read the Health Article',
          instructions: 'Read the article carefully. Answer the detail questions.',
          sortOrder: 0,
          passage: healthArticlePassage,
          questions: [
            buildMcq({ questionText: 'What should people with a nut allergy do?', skillTag: 'reading', topicTag: TOPIC, explanation: 'Check food labels carefully if you have an allergy to nuts.', correct: 'Check food labels carefully', wrong: ['Avoid all exercise', 'Skip appointments'], distractorNotes: ['Exercise is recommended', 'Appointments still needed'], assessmentType: 'detail', difficultyRating: 1 }),
            buildMcq({ questionText: 'What must ill people not do with family cups?', skillTag: 'reading', topicTag: TOPIC, explanation: 'You must not share cups with family members if you are ill.', correct: 'Share them', wrong: ['Wash them', 'Buy new ones'], distractorNotes: ['Washing not forbidden', 'Not mentioned'], assessmentType: 'detail', difficultyRating: 1 }),
          ],
        }),
        buildReadingExercise({
          slug: 'reading-health-practice',
          title: 'Practice: Words in the Article',
          instructions: 'Read the article again. Answer about vocabulary and meaning.',
          sortOrder: 1,
          passage: healthArticlePassage,
          difficulty: 0.3,
          questions: [
            buildMcq({ questionText: "In the article, 'prevention' means _____.", skillTag: 'reading', topicTag: TOPIC, explanation: 'Prevention is better than treatment — ngăn bệnh trước khi cần điều trị.', correct: 'stopping illness before it happens', wrong: ['medicine from a doctor', 'recovering after surgery'], distractorNotes: ['That is prescription/treatment', 'That is recovery'], assessmentType: 'vocabulary_in_context', difficultyRating: 2 }),
            buildMcq({ questionText: 'Why does Dr Nguyen mention finishing all medicine?', skillTag: 'reading', topicTag: TOPIC, explanation: 'Even when you feel better — để điều trị hiệu quả, tránh tái phát.', correct: 'To make sure treatment works completely', wrong: ['To get a new prescription', 'To avoid exercise'], distractorNotes: ['Not the reason given', 'Exercise is encouraged'], assessmentType: 'inference', difficultyRating: 2 }),
          ],
        }),
        buildReadingExercise({
          slug: 'reading-health-check',
          title: 'Check: Main Idea and Order',
          instructions: 'Read the article one more time. These questions need careful thinking.',
          sortOrder: 2,
          passage: healthArticlePassage,
          difficulty: 0.35,
          questions: [
            buildMcq({ questionText: 'What is the main message of the article?', skillTag: 'reading', topicTag: TOPIC, explanation: 'Bài nhấn mạnh prevention, rest và thói quen tốt để khỏe cả năm.', correct: 'Good habits and prevention help you stay healthy', wrong: ['All injuries need surgery', 'You should never see a doctor'], distractorNotes: ['Hospital for bad injuries only', 'Appointments are recommended'], assessmentType: 'main_idea', difficultyRating: 1 }),
            buildMcq({ questionText: 'Put the advice in order: (1) Rest and note symptoms (2) Prevention habits (3) Finish medicine and follow-up', skillTag: 'reading', topicTag: TOPIC, explanation: 'Bài: prevention trước → khi ốm nghỉ/ngờ symptom → hoàn thành thuốc.', correct: '2 → 1 → 3', wrong: ['1 → 2 → 3', '3 → 1 → 2'], distractorNotes: ['Prevention comes first in article', 'Medicine at end'], assessmentType: 'sequencing', difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'reading-health-apply',
          title: 'Apply: Match Facts from the Article',
          instructions: 'Use what you read. Match each item to the correct fact.',
          exerciseType: 'matching',
          sortOrder: 3,
          content: { passage: healthArticlePassage },
          questions: [
            buildMatching({
              questionText: 'Match each topic to a fact from the health article.',
              skillTag: 'reading',
              topicTag: TOPIC,
              explanation: 'Mỗi mục khớp với lời khuyên cụ thể của Dr Nguyen.',
              pairs: [
                { left: 'Bad injury', right: 'Go to hospital immediately' },
                { left: 'Allergy', right: 'Check food labels for nuts' },
                { left: 'Recovery time', right: 'About a week with doctor\'s advice' },
                { left: 'When ill', right: 'Drink a little warm water and rest' },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    listening: {
      slug: 'listening-health-clinic',
      title: 'Lesson 4: At the Clinic',
      learningObjective: 'Listen to clinic conversations and a health podcast to understand advice and opinions.',
      estimatedMinutes: 22,
      exercises: [
        buildListeningExercise({
          slug: 'listening-clinic-learn',
          title: 'Learn: Doctor\'s Appointment',
          instructions: 'Listen to the conversation. Answer the first two questions.',
          sortOrder: 0,
          script: doctorVisitScript1,
          answerKey: { q1: 'appointment booked', q2: 'cough three days' },
          questions: [
            buildMcq({ questionText: 'Does the patient have an appointment?', skillTag: 'listening', topicTag: TOPIC, explanation: 'Yes, she booked online yesterday.', correct: 'Yes, booked online yesterday', wrong: ['No, she is walk-in', 'Yes, but for next week'], distractorNotes: ['She confirms appointment', 'Today\'s visit'], difficultyRating: 1 }),
            buildMcq({ questionText: 'What symptom does the patient mention first?', skillTag: 'listening', topicTag: TOPIC, explanation: 'I have had a bad cough for three days.', correct: 'A bad cough', wrong: ['A broken leg', 'An allergy to nuts'], distractorNotes: ['Injury not mentioned', 'Allergy from article'], difficultyRating: 1 }),
          ],
        }),
        buildListeningExercise({
          slug: 'listening-clinic-practice',
          title: 'Practice: More from the Clinic',
          instructions: 'Listen again to the same conversation. Answer the next questions.',
          sortOrder: 1,
          script: doctorVisitScript1,
          answerKey: { q1: 'little fever', q2: 'wear a mask' },
          difficulty: 0.28,
          questions: [
            buildMcq({ questionText: 'What other symptom does the patient have?', skillTag: 'listening', topicTag: TOPIC, explanation: 'I also have a little fever.', correct: 'A little fever', wrong: ['A serious injury', 'No other symptoms'], distractorNotes: ['Not mentioned', 'She mentions fever'], difficultyRating: 2 }),
            buildMcq({ questionText: 'What must patients do in the clinic?', skillTag: 'listening', topicTag: TOPIC, explanation: 'You must wear a mask in the clinic.', correct: 'Wear a mask', wrong: ['Pay immediately', 'Bring a prescription'], distractorNotes: ['Not mentioned', 'Doctor gives prescription'], difficultyRating: 2 }),
          ],
        }),
        buildListeningExercise({
          slug: 'listening-podcast-check',
          title: 'Check: Health Podcast',
          instructions: 'Listen to a new recording. Choose the correct answer.',
          sortOrder: 2,
          script: healthPodcastScript2,
          answerKey: { q1: 'exercise prevention', q2: 'warm up', q3: 'tell coach about allergy' },
          difficulty: 0.32,
          questions: [
            buildMcq({ questionText: 'What is the podcast mainly about?', skillTag: 'listening', topicTag: TOPIC, explanation: 'Today we talk about exercise and prevention.', correct: 'Exercise and prevention', wrong: ['Prescriptions and treatment', 'Hospital injuries only'], distractorNotes: ['Mentioned briefly', 'Broader topic'], difficultyRating: 1 }),
            buildMcq({ questionText: 'What does the host say about sport?', skillTag: 'listening', topicTag: TOPIC, explanation: 'Warm up before sport. You must wear good shoes when you run.', correct: 'Warm up and wear good shoes', wrong: ['Never do exercise', 'Only exercise when ill'], distractorNotes: ['Opposite of advice', 'Rest when ill'], difficultyRating: 2 }),
            buildMcq({ questionText: 'What is the host\'s opinion about treatment and habits?', skillTag: 'listening', topicTag: TOPIC, explanation: 'Treatment is important, but healthy habits help you recover faster too.', correct: 'Healthy habits help recovery as well as treatment', wrong: ['Treatment is not important', 'Only medicine helps'], distractorNotes: ['Host values both', 'Too extreme'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'listening-clinic-match',
          title: 'Apply: Match What You Heard',
          instructions: 'Listen again to the clinic conversation. Match each item to the correct detail.',
          exerciseType: 'matching',
          sortOrder: 3,
          content: { script: doctorVisitScript1, audioUrl: '/audio/listening/ket/unit-03/listening-clinic-match.mp3' },
          questions: [
            buildMatching({
              questionText: 'Match each item from the clinic conversation.',
              skillTag: 'listening',
              topicTag: TOPIC,
              explanation: 'Mỗi mục khớp với chi tiết Lan và lễ tân nói.',
              pairs: [
                { left: 'Booking', right: 'Online yesterday' },
                { left: 'Main symptom', right: 'Bad cough for three days' },
                { left: 'Clinic rule', right: 'Must wear a mask' },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    writing: {
      slug: 'writing-health-note',
      title: 'Lesson 5: Note About Symptoms',
      learningObjective: 'Write a short note about symptoms and request an appointment using health vocabulary.',
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: 'writing-health-learn',
          title: 'Learn: Health Note Phrases',
          instructions: 'Complete each gap with a word from the box: appointment, symptom, doctor, should, thank.',
          exerciseType: 'gap_fill',
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText: 'Complete: Dear [0], | I would like to make an [1]. | My main [2] is a sore throat. | I think I [3] rest at home.',
              skillTag: 'writing',
              topicTag: TOPIC,
              explanation: 'Doctor; appointment; symptom; should — khung ghi chú ngắn gửi phòng khám.',
              template: 'Dear [0],\n\nI would like to make an [1]. My main [2] is a sore throat. I think I [3] rest at home.\n\nThank you.',
              correctAnswers: ['Doctor', 'appointment', 'symptom', 'should'],
              acceptableAnswers: [['Doctor', 'doctor'], ['appointment', 'Appointment'], ['symptom', 'Symptom'], ['should', 'Should']],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: 'writing-health-order-practice',
          title: 'Practice: Build Health Sentences',
          instructions: 'Put the words in order to make correct sentences.',
          exerciseType: 'sentence_ordering',
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({ questionText: 'Make a sentence: You / should / drink / a little / water.', skillTag: 'writing', topicTag: TOPIC, explanation: 'You should drink a little water. — lời khuyên sức khỏe.', words: ['You', 'should', 'drink', 'a little', 'water.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 2 }),
            buildSentenceOrdering({ questionText: 'Make a sentence: I / need to / see / the doctor / tomorrow.', skillTag: 'writing', topicTag: TOPIC, explanation: 'I need to see the doctor tomorrow. — need to + động từ.', words: ['I', 'need to', 'see', 'the doctor', 'tomorrow.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'writing-health-check',
          title: 'Check: Symptoms and Appointment Note',
          instructions: 'Write a short note to your doctor. Write at least 25 words.',
          exerciseType: 'writing',
          sortOrder: 2,
          content: {
            taskDescription: 'You are not feeling well. Write a short note to Dr Nguyen to request an appointment and describe your symptoms.',
            prompts: [
              'Say you want to make an appointment.',
              'Describe two symptoms you have.',
              'Say what you have done so far (e.g. rest, drink water).',
              'Ask when you can visit the clinic.',
              'End politely.',
            ],
            minWords: 25,
            successCriteria: [
              'At least 25 words',
              'Clear appointment request',
              'Describes at least two symptoms',
              'Uses should or need to appropriately',
              'Polite closing',
            ],
            modelAnswer: {
              text: 'Dear Dr Nguyen,\n\nI would like to make an appointment, please. I have had a cough and a little fever for three days. I have rested at home and drunk warm water, but I do not feel better. I think I should see you soon. When can I come to the clinic?\n\nThank you,\nLan',
            },
            rubric: {
              grammar: { weight: 0.25, criteria: 'Uses should, must or need to correctly; a few/a little where appropriate.' },
              vocabulary: { weight: 0.25, criteria: 'Uses health words (appointment, symptom, recover, treatment) appropriately.' },
              organization: { weight: 0.25, criteria: 'Note has greeting, clear body and polite closing.' },
              taskAchievement: { weight: 0.25, criteria: 'Requests appointment with symptoms; at least 25 words.' },
            },
            autoCheckKeywords: ['dear', 'appointment', 'symptom', 'doctor', 'should', 'need', 'thank', 'cough', 'fever', 'clinic'],
          },
        }),
        buildExercise({
          slug: 'writing-health-apply',
          title: 'Apply: Complete the Note Frames',
          instructions: 'Complete the note frames with the correct unit words.',
          exerciseType: 'gap_fill',
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: 'Complete: Dear Nurse, | I have an [0] to nuts. | I had a small [1] yesterday. | The [2] helped me. | I hope to [3] soon.',
              skillTag: 'writing',
              topicTag: TOPIC,
              explanation: 'allergy; injury; treatment; recover — tóm tắt tình huống sức khỏe.',
              template: 'Dear Nurse,\n\nI have an [0] to nuts. I had a small [1] yesterday. The [2] helped me. I hope to [3] soon.\n\nThank you,\nMinh',
              correctAnswers: ['allergy', 'injury', 'treatment', 'recover'],
              acceptableAnswers: [['allergy', 'Allergy'], ['injury', 'Injury'], ['treatment', 'Treatment'], ['recover', 'Recover']],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    speaking: {
      slug: 'speaking-health-lifestyle',
      title: 'Lesson 6: Talk About Health',
      learningObjective: 'Answer questions about health habits, symptoms and lifestyle choices.',
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: 'speaking-health-learn',
          title: 'Learn: Choose the Best Reply',
          instructions: 'Imagine an examiner asks you a question. Choose the best answer.',
          exerciseType: 'multiple_choice',
          sortOrder: 0,
          questions: [
            buildMcq({ questionText: 'Examiner: How do you stay healthy? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Healthy habits ngắn gọn: eat healthy food, exercise.', correct: 'I eat healthy food and do a little exercise.', wrong: ['I eat symptom food every day.', 'I have injury every morning.'], distractorNotes: ['Wrong word', 'Nonsense'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Examiner: What should you do when you have a cough? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Should + lời khuyên: rest and drink water.', correct: 'I should rest and drink a little warm water.', wrong: ['I should to rest and drink.', 'I must resting at home.'], distractorNotes: ['No to after should', 'Wrong form after must'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Examiner: Have you ever been to a doctor\'s appointment? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Trả lời có/không + chi tiết ngắn về appointment.', correct: 'Yes, I went last month because I had a fever.', wrong: ['Yes, I prescription last month.', 'Yes, I allergy the doctor.'], distractorNotes: ['Wrong word', 'Nonsense'], difficultyRating: 1 }),
          ],
        }),
        buildExercise({
          slug: 'speaking-health-practice',
          title: 'Practice: Best Response',
          instructions: 'Choose the best phrase you would say in each situation.',
          exerciseType: 'multiple_choice',
          sortOrder: 1,
          questions: [
            buildMcq({ questionText: 'Examiner: Do you have any allergies? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Have an allergy to + thực phẩm — cấu trúc A2 chuẩn.', correct: 'Yes, I have an allergy to milk.', wrong: ['Yes, I have injury to milk.', 'Yes, I recover to milk.'], distractorNotes: ['Wrong noun', 'Wrong verb'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Examiner: What must you do in a hospital waiting room? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Must + quy tắc: be quiet, wear a mask.', correct: 'You must be quiet and wear a mask.', wrong: ['You must to be quiet.', 'You should must be quiet.'], distractorNotes: ['No to', 'Double modal'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Examiner: How long did it take you to recover from your cold? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Recover + thời gian: about a week.', correct: 'It took about a week to recover.', wrong: ['It took about a week to prescription.', 'It took about a week to allergy.'], distractorNotes: ['Wrong word', 'Wrong word'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'speaking-health-interview',
          title: 'Check: Health and Lifestyle Interview',
          instructions: 'Answer the examiner\'s questions about health. Speak for up to two minutes.',
          exerciseType: 'speaking',
          sortOrder: 2,
          content: {
            prompt: 'The examiner will ask you about your health, symptoms, doctor visits and healthy habits.',
            pictureDescription: 'A person resting at home with a cup of warm water, a calendar showing a doctor appointment, and a poster about prevention.',
            followUpQuestions: [
              'Do you usually eat healthy food? What do you eat?',
              'How often do you exercise?',
              'When did you last go to a doctor\'s appointment?',
              'What symptoms do people often have in winter?',
              'What should you do when you have a fever?',
              'Do you know anyone with a food allergy?',
            ],
            suggestedAnswers: [
              'Yes, I eat vegetables and fruit every day.',
              'I do a little exercise three times a week.',
              'I went last month because I had a cough.',
              'People often have coughs and fevers.',
              'You should rest and drink a little water.',
              'My friend has an allergy to nuts.',
            ],
            assessmentCriteria: {
              pronunciation: 'Key words (appointment, symptom, allergy, treatment, prevention) are understandable.',
              fluency: 'Responds with phrases or short sentences without long silences.',
              grammar: 'Uses should/must/need to or a few/a little in at least two answers.',
              vocabulary: 'Uses at least four different unit words correctly.',
            },
            maxDurationSeconds: 120,
          },
        }),
        buildExercise({
          slug: 'speaking-health-apply',
          title: 'Apply: Situational Responses',
          instructions: 'Choose the best thing to say in each situation.',
          exerciseType: 'multiple_choice',
          sortOrder: 3,
          questions: [
            buildMcq({ questionText: 'Your friend has a bad headache. You advise them:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Should + lời khuyên thực tế: rest, see doctor if needed.', correct: 'You should rest. If it continues, make an appointment.', wrong: ['You should run fast.', 'You must share cups with everyone.'], distractorNotes: ['Bad advice', 'Opposite of health rule'], difficultyRating: 2 }),
            buildMcq({ questionText: 'A nurse asks about your symptoms. You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Liệt kê symptom rõ ràng.', correct: 'I have a cough and a little fever.', wrong: ['I have a prescription and injury.', 'I have prevention and career.'], distractorNotes: ['Mixed wrong words', 'Unrelated words'], difficultyRating: 2 }),
            buildMcq({ questionText: 'The examiner asks: Is prevention important? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Đưa ra ý kiến + lý do ngắn về prevention.', correct: 'Yes, prevention is important because it stops illness before treatment.', wrong: ['Yes, prevention is my salary.', 'No, you must never exercise.'], distractorNotes: ['Nonsense', 'Wrong advice'], difficultyRating: 3 }),
          ],
        }),
      ],
    },
  },
};
