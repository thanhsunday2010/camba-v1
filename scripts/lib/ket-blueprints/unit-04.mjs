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

const TOPIC = 'leisure-and-entertainment';

const reviewBlogPassage = buildPassage({
  title: 'Weekend Culture Blog — City Arts Centre',
  text: `POSTED BY MAI — 12 JUNE

Last Saturday my friends and I visited the City Arts Centre. We wanted to see the new photography exhibition before it closes. The audience was small but friendly, and the performance space looked amazing.

First we picked up a free magazine at the entrance. It had a review of last month's concert and tips for downloading the centre's app. I found out that students get cheaper tickets for comedy shows on Fridays.

In the afternoon we watched a short dance performance. The dancers took off their shoes for one piece — it was surprising! After that we read online reviews on our phones. Most people loved the exhibition, but a few wanted more seats.

We spent the evening at home streaming a film. My brother prefers streaming to going out, but I still enjoy live events. Next week there is a jazz concert in the park. I will download the programme tonight and invite my classmates.

If you like art and music, check the centre website. You can find out about every exhibition and performance there.`,
});

const ticketOfficeScript1 = buildListeningScript({
  title: 'Buying Concert Tickets',
  setting: 'City Arts Centre ticket office',
  speakers: [{ name: 'Staff', role: 'ticket seller' }, { name: 'Alex', role: 'student customer' }],
  lines: [
    { speaker: 'Alex', text: 'Hello. I would like two tickets for the jazz concert on Saturday, please.' },
    { speaker: 'Staff', text: 'Certainly. The performance starts at seven o\'clock in the main hall.' },
    { speaker: 'Alex', text: 'Great. I read a review in your magazine. The audience loved the last concert.' },
    { speaker: 'Staff', text: 'Yes! You can pick up a programme at the door. Student tickets are twelve pounds each.' },
    { speaker: 'Alex', text: 'Perfect. Can I pay by card? I found out about the discount on your website.' },
    { speaker: 'Staff', text: 'Of course. Here are your tickets. Enjoy the show!' },
    { speaker: 'Alex', text: 'Thank you. We are really looking forward to it.' },
  ],
  audioNotes: 'Friendly ticket office exchange, clear speech. Approx. 45 seconds.',
});

const friendsChatScript2 = buildListeningScript({
  title: 'Friends Planning the Weekend',
  setting: 'Café conversation',
  speakers: [{ name: 'Sofia', role: 'student' }, { name: 'Ben', role: 'friend' }],
  lines: [
    { speaker: 'Sofia', text: 'What shall we do on Sunday? There is a new exhibition at the museum.' },
    { speaker: 'Ben', text: 'I prefer staying home and streaming a series. I am tired this week.' },
    { speaker: 'Sofia', text: 'Come on! The magazine said the photography exhibition is excellent. The audience gave it five stars.' },
    { speaker: 'Ben', text: 'OK, but only if we pick up food on the way. I want to find out what time it closes.' },
    { speaker: 'Sofia', text: 'It closes at six. After that we could watch a comedy performance nearby.' },
    { speaker: 'Ben', text: 'Sounds good. I will download the tickets tonight.' },
    { speaker: 'Sofia', text: 'Great. I will read the online review again before we go.' },
  ],
  audioNotes: 'Casual café chat, natural pace. Approx. 45 seconds.',
});

export default {
  vocabularyBank: [
    buildVocabWord({ word: 'concert', ipa: '/ˈkɒnsət/', partOfSpeech: 'noun', vietnameseMeaning: 'buổi hòa nhạc', exampleSentence: 'We went to a jazz concert in the park.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'exhibition', ipa: '/ˌeksɪˈbɪʃn/', partOfSpeech: 'noun', vietnameseMeaning: 'triển lãm', exampleSentence: 'The photography exhibition closes next week.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'magazine', ipa: '/ˌmæɡəˈziːn/', partOfSpeech: 'noun', vietnameseMeaning: 'tạp chí', exampleSentence: 'I picked up a free magazine at the arts centre.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'download', ipa: '/ˌdaʊnˈləʊd/', partOfSpeech: 'verb', vietnameseMeaning: 'tải xuống', exampleSentence: 'You can download the programme from the website.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'streaming', ipa: '/ˈstriːmɪŋ/', partOfSpeech: 'noun', vietnameseMeaning: 'phát trực tuyến', exampleSentence: 'We spent the evening streaming a film at home.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'performance', ipa: '/pəˈfɔːməns/', partOfSpeech: 'noun', vietnameseMeaning: 'buổi biểu diễn', exampleSentence: 'The dance performance was wonderful.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'review', ipa: '/rɪˈvjuː/', partOfSpeech: 'noun', vietnameseMeaning: 'bài đánh giá', exampleSentence: 'I read a review of the concert online.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'audience', ipa: '/ˈɔːdiəns/', partOfSpeech: 'noun', vietnameseMeaning: 'khán giả', exampleSentence: 'The audience clapped loudly at the end.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'ticket', ipa: '/ˈtɪkɪt/', partOfSpeech: 'noun', vietnameseMeaning: 'vé', exampleSentence: 'Student tickets are cheaper on Fridays.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'programme', ipa: '/ˈprəʊɡræm/', partOfSpeech: 'noun', vietnameseMeaning: 'chương trình (sự kiện)', exampleSentence: 'Pick up a programme at the door.', difficulty: 2, topic: TOPIC }),
    buildVocabWord({ word: 'comedy', ipa: '/ˈkɒmədi/', partOfSpeech: 'noun', vietnameseMeaning: 'hài kịch', exampleSentence: 'There is a comedy show on Friday evening.', difficulty: 1, topic: TOPIC }),
    buildVocabWord({ word: 'venue', ipa: '/ˈvenjuː/', partOfSpeech: 'noun', vietnameseMeaning: 'địa điểm tổ chức', exampleSentence: 'The concert venue is in the city centre.', difficulty: 2, topic: TOPIC }),
  ],

  grammarReference: [
    buildGrammarRef({
      structure: 'Phrasal verbs: pick up, find out, take off',
      explanation: 'Pick up can mean collect (pick up a magazine) or learn casually (pick up a skill). Find out means discover information (find out the time). Take off can mean remove clothes/shoes or become successful (the show took off).',
      examples: [
        'I picked up a free magazine at the entrance.',
        'We found out that student tickets are cheaper.',
        'The dancers took off their shoes on stage.',
        'Did you find out when the exhibition closes?',
      ],
      commonMistakes: [
        'I found the information (×) → I found out the time (✓) [when discovering news]',
        'I picked up my shoes (×) → I took off my shoes (✓)',
        'I found out a magazine (×) → I picked up a magazine (✓)',
      ],
      topic: TOPIC,
    }),
    buildGrammarRef({
      structure: 'Gerunds and infinitives after common verbs',
      explanation: 'Some verbs are followed by -ing (enjoy, finish, mind): enjoy watching. Others take to + infinitive (want, decide, hope): want to download. Like/love/start can take both with similar meaning at A2.',
      examples: [
        'I enjoy going to concerts.',
        'She decided to download the app.',
        'We finished reading the review.',
        'They hope to see the exhibition tomorrow.',
      ],
      commonMistakes: [
        'I enjoy to go to concerts (×) → I enjoy going to concerts (✓)',
        'She decided downloading the app (×) → She decided to download the app (✓)',
        'We finished to read the review (×) → We finished reading the review (✓)',
      ],
      topic: TOPIC,
    }),
  ],

  unit: {
    learningObjectives: [
      'Use core leisure and entertainment vocabulary at A2 level.',
      'Use phrasal verbs pick up, find out and take off in everyday contexts.',
      'Use gerunds and infinitives after common verbs like enjoy, want and decide.',
      'Identify the writer\'s purpose and intended audience in a short blog post.',
      'Follow everyday social exchanges about plans for concerts and exhibitions.',
      'Write a short message inviting a friend to a cultural event.',
      'Answer interview questions about free time and entertainment preferences.',
    ],
  },

  lessons: {
    vocabulary: {
      slug: 'vocab-leisure-words',
      title: 'Lesson 1: Leisure and Entertainment Words',
      learningObjective: 'Recognise and understand twelve leisure and entertainment words at KET A2 level.',
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: 'vocab-leisure-learn',
          title: 'Learn: Entertainment Word Match',
          instructions: 'Read each sentence. Choose the best word.',
          exerciseType: 'multiple_choice',
          sortOrder: 0,
          questions: [
            buildMcq({ questionText: 'A live music event with a band or orchestra is a _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Concert (buổi hòa nhạc) là sự kiện âm nhạc trực tiếp. Performance rộng hơn.', correct: 'concert', wrong: ['magazine', 'download'], distractorNotes: ['Printed publication', 'Computer action'], difficultyRating: 1 }),
            buildMcq({ questionText: 'A public show of art or photos in a gallery is an _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Exhibition (triển lãm) trưng bày tác phẩm. Review là bài đánh giá.', correct: 'exhibition', wrong: ['review', 'streaming'], distractorNotes: ['Written opinion', 'Watching online'], difficultyRating: 1 }),
            buildMcq({ questionText: 'A thin book with articles and photos, sold weekly or monthly, is a _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Magazine (tạp chí) có bài viết định kỳ. Programme là chương trình sự kiện.', correct: 'magazine', wrong: ['programme', 'ticket'], distractorNotes: ['Event schedule', 'Entry pass'], difficultyRating: 1 }),
            buildMcq({ questionText: 'To save a file from the internet onto your phone means to _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Download (tải xuống) lưu file từ mạng. Streaming là xem trực tuyến.', correct: 'download', wrong: ['stream', 'review'], distractorNotes: ['Watch online without saving', 'Written opinion'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Watching films or shows online without downloading is _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Streaming (phát trực tuyến) xem qua internet. Concert là trực tiếp.', correct: 'streaming', wrong: ['concert', 'exhibition'], distractorNotes: ['Live music event', 'Art display'], difficultyRating: 1 }),
            buildMcq({ questionText: 'The people who watch a show in a theatre or hall are the _____.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Audience (khán giả) người xem biểu diễn. Venue là địa điểm.', correct: 'audience', wrong: ['venue', 'magazine'], distractorNotes: ['Place of event', 'Publication'], difficultyRating: 1 }),
          ],
        }),
        buildExercise({
          slug: 'vocab-leisure-matching',
          title: 'Practice: Match the Pairs',
          instructions: 'Match each word on the left with the correct meaning on the right.',
          exerciseType: 'matching',
          sortOrder: 1,
          questions: [
            buildMatching({
              questionText: 'Match the entertainment words to their meanings.',
              skillTag: 'vocabulary',
              topicTag: TOPIC,
              explanation: 'Mỗi từ khớp nghĩa rõ ràng. Performance và concert có thể liên quan nhưng khác nhau.',
              pairs: [
                { left: 'performance', right: 'an act of presenting music, dance or drama live' },
                { left: 'review', right: 'an article that gives an opinion about a show or film' },
                { left: 'ticket', right: 'a piece of paper or code that lets you enter an event' },
                { left: 'venue', right: 'the place where a concert or show happens' },
              ],
            }),
          ],
        }),
        buildExercise({
          slug: 'vocab-leisure-check',
          title: 'Check: Vocab Quiz',
          instructions: 'No hints — choose the best answer for each question.',
          exerciseType: 'multiple_choice',
          sortOrder: 2,
          questions: [
            buildMcq({ questionText: 'Mai read an online _____ before buying tickets for the comedy show.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Review (bài đánh giá) giúp quyết định mua vé. Programme là chương trình.', correct: 'review', wrong: ['venue', 'audience'], distractorNotes: ['Place', 'People watching'], difficultyRating: 2 }),
            buildMcq({ questionText: 'You can _____ the centre\'s app to see the exhibition timetable.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Download (tải) app về điện thoại. Streaming là xem phim.', correct: 'download', wrong: ['stream', 'perform'], distractorNotes: ['Watch online', 'Not the app action'], difficultyRating: 2 }),
            buildMcq({ questionText: 'The jazz _____ in the park starts at seven o\'clock.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Concert (hòa nhạc) ngoài trời. Magazine là tạp chí.', correct: 'concert', wrong: ['magazine', 'comedy'], distractorNotes: ['Publication', 'Different genre unless specified'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Pick up a _____ at the door to see the list of acts.', skillTag: 'vocabulary', topicTag: TOPIC, explanation: 'Programme (chương trình) liệt kê tiết mục. Ticket là vé vào cửa.', correct: 'programme', wrong: ['ticket', 'streaming'], distractorNotes: ['Entry pass', 'Online viewing'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'vocab-leisure-apply',
          title: 'Apply: Complete the Leisure Sentences',
          instructions: 'Fill in each gap with the correct word.',
          exerciseType: 'gap_fill',
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: 'Complete: We went to a jazz [0]. | The [1] clapped loudly. | I read a [2] online. | We spent the evening [3] a film at home.',
              skillTag: 'vocabulary',
              topicTag: TOPIC,
              explanation: 'concert; audience; review; streaming — ngữ cảnh giải trí cuối tuần.',
              template: 'We went to a jazz [0]. The [1] clapped loudly. I read a [2] online. We spent the evening [3] a film at home.',
              correctAnswers: ['concert', 'audience', 'review', 'streaming'],
              acceptableAnswers: [['concert', 'Concert'], ['audience', 'Audience'], ['review', 'Review'], ['streaming', 'Streaming']],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    grammar: {
      slug: 'grammar-leisure-phrasal',
      title: 'Lesson 2: Phrasal Verbs and Gerunds',
      learningObjective: 'Use phrasal verbs pick up, find out and take off, and gerunds/infinitives after common verbs.',
      estimatedMinutes: 22,
      exercises: [
        buildExercise({
          slug: 'grammar-leisure-learn',
          title: 'Learn: Choose the Correct Form',
          instructions: 'Choose the best word or phrase for each sentence.',
          exerciseType: 'multiple_choice',
          sortOrder: 0,
          questions: [
            buildMcq({ questionText: 'I _____ a free magazine at the arts centre.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Pick up = nhận/lấy tạp chí miễn phí.', correct: 'picked up', wrong: ['found out', 'took off'], distractorNotes: ['Discover information', 'Remove or become successful'], difficultyRating: 1 }),
            buildMcq({ questionText: 'We need to _____ what time the exhibition closes.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Find out = tìm hiểu thông tin.', correct: 'find out', wrong: ['pick up', 'take off'], distractorNotes: ['Collect physically', 'Remove shoes'], difficultyRating: 1 }),
            buildMcq({ questionText: 'I enjoy _____ to live concerts.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Enjoy + -ing: enjoy going.', correct: 'going', wrong: ['go', 'to go'], distractorNotes: ['Base verb after enjoy', 'Infinitive after enjoy'], difficultyRating: 1 }),
            buildMcq({ questionText: 'She decided _____ the tickets tonight.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Decide + to-infinitive: decided to download.', correct: 'to download', wrong: ['download', 'downloading'], distractorNotes: ['Missing to', 'Gerund after decide'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'grammar-leisure-practice',
          title: 'Practice: Complete the Grammar',
          instructions: 'Fill in each gap with the correct form.',
          exerciseType: 'gap_fill',
          sortOrder: 1,
          questions: [
            buildGapFill({
              questionText: 'Complete: I [0] out that student tickets are cheaper. | We [1] up programmes at the door. | They enjoy [2] comedy shows.',
              skillTag: 'grammar',
              topicTag: TOPIC,
              explanation: 'found (find out); pick (pick up); watching (enjoy + -ing).',
              template: 'I [0] out that student tickets are cheaper. We [1] up programmes at the door. They enjoy [2] comedy shows.',
              correctAnswers: ['found', 'pick', 'watching'],
              acceptableAnswers: [['found', 'Found'], ['pick', 'Pick', 'picked', 'Picked'], ['watching', 'Watching']],
              difficultyRating: 2,
            }),
            buildGapFill({
              questionText: 'Complete: The dancers [0] off their shoes. | I want [1] the new app. | We finished [2] the review.',
              skillTag: 'grammar',
              topicTag: TOPIC,
              explanation: 'took (take off); to download (want to); reading (finish + -ing).',
              template: 'The dancers [0] off their shoes. I want [1] the new app. We finished [2] the review.',
              correctAnswers: ['took', 'to download', 'reading'],
              acceptableAnswers: [['took', 'Took'], ['to download', 'to download'], ['reading', 'Reading']],
              difficultyRating: 2,
            }),
          ],
        }),
        buildExercise({
          slug: 'grammar-leisure-check',
          title: 'Check: Grammar Challenge',
          instructions: 'Choose the correct answer. Think carefully.',
          exerciseType: 'multiple_choice',
          sortOrder: 2,
          questions: [
            buildMcq({ questionText: 'Did you _____ when the performance starts?', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Find out + thông tin thời gian.', correct: 'find out', wrong: ['pick up', 'take off'], distractorNotes: ['Collect something', 'Remove'], difficultyRating: 2 }),
            buildMcq({ questionText: 'He hopes _____ the exhibition tomorrow.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Hope + to-infinitive.', correct: 'to see', wrong: ['seeing', 'see'], distractorNotes: ['Gerund less common after hope', 'Missing to'], difficultyRating: 2 }),
            buildMcq({ questionText: 'The show really _____ after the famous singer arrived.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Took off = trở nên thành công/nổi tiếng.', correct: 'took off', wrong: ['picked up', 'found out'], distractorNotes: ['Collected', 'Discovered'], difficultyRating: 3 }),
            buildMcq({ questionText: 'We don\'t mind _____ at home and streaming films.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'Mind + -ing: mind staying.', correct: 'staying', wrong: ['stay', 'to stay'], distractorNotes: ['Base verb', 'Infinitive after mind'], difficultyRating: 3 }),
          ],
        }),
        buildExercise({
          slug: 'grammar-leisure-order',
          title: 'Apply: Build the Sentence',
          instructions: 'Put the words in the correct order to make a sentence.',
          exerciseType: 'sentence_ordering',
          sortOrder: 3,
          questions: [
            buildSentenceOrdering({ questionText: 'Make a sentence: I / found out / the concert / starts / at seven.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'I found out the concert starts at seven. — phrasal verb + clause.', words: ['I', 'found out', 'the concert', 'starts', 'at seven.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 2 }),
            buildSentenceOrdering({ questionText: 'Make a sentence: We / enjoy / going / to / exhibitions.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'We enjoy going to exhibitions. — enjoy + gerund.', words: ['We', 'enjoy', 'going', 'to', 'exhibitions.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 2 }),
            buildSentenceOrdering({ questionText: 'Make a sentence: She / decided / to / download / the programme.', skillTag: 'grammar', topicTag: TOPIC, explanation: 'She decided to download the programme. — decide + infinitive.', words: ['She', 'decided', 'to', 'download', 'the programme.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 3 }),
          ],
        }),
      ],
    },

    reading: {
      slug: 'reading-culture-blog',
      title: 'Lesson 3: Culture Blog',
      learningObjective: 'Identify the writer\'s purpose and audience in a short blog about weekend entertainment.',
      estimatedMinutes: 23,
      exercises: [
        buildReadingExercise({
          slug: 'reading-blog-learn',
          title: 'Learn: Read the Blog Post',
          instructions: 'Read the blog post carefully. Answer the detail questions.',
          sortOrder: 0,
          passage: reviewBlogPassage,
          questions: [
            buildMcq({ questionText: 'What did Mai and her friends see on Saturday afternoon?', skillTag: 'reading', topicTag: TOPIC, explanation: 'They watched a short dance performance in the afternoon.', correct: 'A dance performance', wrong: ['A jazz concert', 'A comedy show'], distractorNotes: ['Planned for next week', 'Mentioned as future option'], assessmentType: 'detail', difficultyRating: 1 }),
            buildMcq({ questionText: 'How did Mai spend the evening?', skillTag: 'reading', topicTag: TOPIC, explanation: 'We spent the evening at home streaming a film.', correct: 'Streaming a film at home', wrong: ['At a live concert', 'Writing a magazine review'], distractorNotes: ['Concert is next week', 'She read reviews, not wrote'], assessmentType: 'detail', difficultyRating: 1 }),
          ],
        }),
        buildReadingExercise({
          slug: 'reading-blog-practice',
          title: 'Practice: Words in the Blog',
          instructions: 'Read the blog post again. Answer about vocabulary and meaning.',
          sortOrder: 1,
          passage: reviewBlogPassage,
          difficulty: 0.3,
          questions: [
            buildMcq({ questionText: "In the blog, when Mai says they 'picked up' a magazine, she means they _____.", skillTag: 'reading', topicTag: TOPIC, explanation: 'Picked up a free magazine at the entrance = lấy/nhận tạp chí.', correct: 'collected a free copy at the entrance', wrong: ['wrote an article for it', 'downloaded it illegally'], distractorNotes: ['She is a reader', 'Free at entrance'], assessmentType: 'vocabulary_in_context', difficultyRating: 2 }),
            buildMcq({ questionText: 'Why does Mai mention her brother?', skillTag: 'reading', topicTag: TOPIC, explanation: 'He prefers streaming to going out — contrast với Mai thích live events.', correct: 'To contrast staying home with going to live events', wrong: ['To complain about ticket prices', 'To advertise the arts centre'], distractorNotes: ['Prices mentioned elsewhere', 'Personal blog not official ad'], assessmentType: 'inference', difficultyRating: 2 }),
          ],
        }),
        buildReadingExercise({
          slug: 'reading-blog-check',
          title: 'Check: Purpose and Audience',
          instructions: 'Read the blog post one more time. These questions need careful thinking.',
          sortOrder: 2,
          passage: reviewBlogPassage,
          difficulty: 0.35,
          questions: [
            buildMcq({ questionText: 'Who is the most likely audience for this blog post?', skillTag: 'reading', topicTag: TOPIC, explanation: 'Mai writes for friends/classmates interested in arts — teenagers/students.', correct: 'Young people who enjoy culture and free-time activities', wrong: ['Hospital doctors', 'Ticket office staff only'], distractorNotes: ['Wrong context', 'Too narrow'], assessmentType: 'main_idea', difficultyRating: 1 }),
            buildMcq({ questionText: 'What is Mai\'s main purpose in writing this post?', skillTag: 'reading', topicTag: TOPIC, explanation: 'Chia sẻ trải nghiệm và khuyên đọc website — recommend arts centre.', correct: 'To share her weekend experience and encourage others to visit', wrong: ['To sell tickets officially', 'To criticise all performances'], distractorNotes: ['Personal blog not sales', 'Mostly positive'], assessmentType: 'main_idea', difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'reading-blog-apply',
          title: 'Apply: Match Facts from the Blog',
          instructions: 'Use what you read. Match each item to the correct fact.',
          exerciseType: 'matching',
          sortOrder: 3,
          content: { passage: reviewBlogPassage },
          questions: [
            buildMatching({
              questionText: 'Match each topic to a fact from the blog post.',
              skillTag: 'reading',
              topicTag: TOPIC,
              explanation: 'Mỗi mục khớp với chi tiết Mai viết trong blog.',
              pairs: [
                { left: 'Student discount', right: 'Found on the website' },
                { left: 'Next plan', right: 'Jazz concert in the park' },
                { left: 'Saturday morning', right: 'Photography exhibition' },
                { left: 'Brother\'s preference', right: 'Streaming at home' },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    listening: {
      slug: 'listening-ticket-plans',
      title: 'Lesson 4: Tickets and Weekend Plans',
      learningObjective: 'Follow social exchanges about buying tickets and planning cultural activities.',
      estimatedMinutes: 22,
      exercises: [
        buildListeningExercise({
          slug: 'listening-tickets-learn',
          title: 'Learn: At the Ticket Office',
          instructions: 'Listen to the conversation. Answer the first two questions.',
          sortOrder: 0,
          script: ticketOfficeScript1,
          answerKey: { q1: 'jazz concert Saturday', q2: 'seven o clock' },
          questions: [
            buildMcq({ questionText: 'What tickets does Alex want?', skillTag: 'listening', topicTag: TOPIC, explanation: 'Two tickets for the jazz concert on Saturday.', correct: 'Jazz concert on Saturday', wrong: ['Comedy show on Friday', 'Dance exhibition'], distractorNotes: ['Different event', 'Not what Alex buys'], difficultyRating: 1 }),
            buildMcq({ questionText: 'What time does the performance start?', skillTag: 'listening', topicTag: TOPIC, explanation: 'The performance starts at seven o\'clock.', correct: 'Seven o\'clock', wrong: ['Six o\'clock', 'Twelve o\'clock'], distractorNotes: ['Museum closing time', 'Ticket price'], difficultyRating: 1 }),
          ],
        }),
        buildListeningExercise({
          slug: 'listening-tickets-practice',
          title: 'Practice: More from the Ticket Office',
          instructions: 'Listen again to the same conversation. Answer the next questions.',
          sortOrder: 1,
          script: ticketOfficeScript1,
          answerKey: { q1: 'twelve pounds', q2: 'pick up programme' },
          difficulty: 0.28,
          questions: [
            buildMcq({ questionText: 'How much is each student ticket?', skillTag: 'listening', topicTag: TOPIC, explanation: 'Student tickets are twelve pounds each.', correct: 'Twelve pounds', wrong: ['Ten pounds', 'Free'], distractorNotes: ['Not stated', 'Tickets cost money'], difficultyRating: 2 }),
            buildMcq({ questionText: 'What can Alex pick up at the door?', skillTag: 'listening', topicTag: TOPIC, explanation: 'You can pick up a programme at the door.', correct: 'A programme', wrong: ['A magazine review', 'A streaming app'], distractorNotes: ['Read about, not pick up there', 'Download separately'], difficultyRating: 2 }),
          ],
        }),
        buildListeningExercise({
          slug: 'listening-weekend-check',
          title: 'Check: Friends Planning Sunday',
          instructions: 'Listen to a new conversation. Choose the correct answer.',
          sortOrder: 2,
          script: friendsChatScript2,
          answerKey: { q1: 'exhibition museum', q2: 'closes six', q3: 'download tickets' },
          difficulty: 0.32,
          questions: [
            buildMcq({ questionText: 'What does Sofia want to do on Sunday?', skillTag: 'listening', topicTag: TOPIC, explanation: 'There is a new exhibition at the museum.', correct: 'Visit the museum exhibition', wrong: ['Stay home streaming', 'Go to a jazz concert'], distractorNotes: ['Ben\'s preference', 'Different event'], difficultyRating: 1 }),
            buildMcq({ questionText: 'What time does the exhibition close?', skillTag: 'listening', topicTag: TOPIC, explanation: 'It closes at six.', correct: 'Six o\'clock', wrong: ['Seven o\'clock', 'Friday evening'], distractorNotes: ['Concert time', 'Comedy timing'], difficultyRating: 2 }),
            buildMcq({ questionText: 'What will Ben do tonight?', skillTag: 'listening', topicTag: TOPIC, explanation: 'I will download the tickets tonight.', correct: 'Download the tickets', wrong: ['Write a review', 'Take off his shoes'], distractorNotes: ['Sofia reads review', 'From dance blog'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'listening-tickets-match',
          title: 'Apply: Match What You Heard',
          instructions: 'Listen again to the ticket office conversation. Match each item to the correct detail.',
          exerciseType: 'matching',
          sortOrder: 3,
          content: { script: ticketOfficeScript1, audioUrl: '/audio/listening/ket/unit-04/listening-tickets-match.mp3' },
          questions: [
            buildMatching({
              questionText: 'Match each item from the ticket office conversation.',
              skillTag: 'listening',
              topicTag: TOPIC,
              explanation: 'Mỗi mục khớp với chi tiết Alex và nhân viên nói.',
              pairs: [
                { left: 'Event', right: 'Jazz concert Saturday' },
                { left: 'Student price', right: 'Twelve pounds each' },
                { left: 'At the door', right: 'Pick up a programme' },
              ],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    writing: {
      slug: 'writing-event-invite',
      title: 'Lesson 5: Invite a Friend',
      learningObjective: 'Write a short message inviting a friend to a concert or exhibition.',
      estimatedMinutes: 25,
      exercises: [
        buildExercise({
          slug: 'writing-invite-learn',
          title: 'Learn: Invitation Phrases',
          instructions: 'Complete each gap with a word from the box: concert, exhibition, download, ticket, hope.',
          exerciseType: 'gap_fill',
          sortOrder: 0,
          questions: [
            buildGapFill({
              questionText: 'Complete: Hi Ben, | Would you like to come to a jazz [0] on Saturday? | There is also a photo [1] at the arts centre. | We can [2] the programme tonight. | I [3] you can come!',
              skillTag: 'writing',
              topicTag: TOPIC,
              explanation: 'concert; exhibition; download; hope — khung tin nhắn mời bạn.',
              template: 'Hi Ben,\n\nWould you like to come to a jazz [0] on Saturday? There is also a photo [1] at the arts centre. We can [2] the programme tonight.\n\nI [3] you can come!\n\nMai',
              correctAnswers: ['concert', 'exhibition', 'download', 'hope'],
              acceptableAnswers: [['concert', 'Concert'], ['exhibition', 'Exhibition'], ['download', 'Download'], ['hope', 'Hope']],
              difficultyRating: 1,
            }),
          ],
        }),
        buildExercise({
          slug: 'writing-invite-order-practice',
          title: 'Practice: Build Invitation Sentences',
          instructions: 'Put the words in order to make correct sentences.',
          exerciseType: 'sentence_ordering',
          sortOrder: 1,
          questions: [
            buildSentenceOrdering({ questionText: 'Make a sentence: I / enjoy / going / to / concerts.', skillTag: 'writing', topicTag: TOPIC, explanation: 'I enjoy going to concerts. — enjoy + gerund.', words: ['I', 'enjoy', 'going', 'to', 'concerts.'], correctOrder: [0, 1, 2, 3, 4], difficultyRating: 2 }),
            buildSentenceOrdering({ questionText: 'Make a sentence: We / found out / the / tickets / are / cheaper / online.', skillTag: 'writing', topicTag: TOPIC, explanation: 'We found out the tickets are cheaper online. — find out + clause.', words: ['We', 'found out', 'the', 'tickets', 'are', 'cheaper', 'online.'], correctOrder: [0, 1, 2, 3, 4, 5, 6], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'writing-invite-check',
          title: 'Check: Invite a Friend to an Event',
          instructions: 'Write a short message to a friend. Write at least 25 words.',
          exerciseType: 'writing',
          sortOrder: 2,
          content: {
            taskDescription: 'Write a message to your friend Ben. Invite him to go with you to a concert or exhibition at the City Arts Centre next weekend.',
            prompts: [
              'Say which event you want to see (concert or exhibition).',
              'Say when and where it is.',
              'Tell him how to get tickets or download information.',
              'Say why you think he will enjoy it.',
              'End in a friendly way.',
            ],
            minWords: 25,
            successCriteria: [
              'At least 25 words',
              'Clear invitation to a specific event',
              'Includes time or place details',
              'Mentions tickets, programme or download',
              'Friendly tone and closing',
            ],
            modelAnswer: {
              text: 'Hi Ben,\n\nWould you like to come to the jazz concert in the park next Saturday? It starts at seven o\'clock. I found out that student tickets are only twelve pounds. We can download the programme tonight and read the review online. I think you will enjoy it because the audience loved the last concert.\n\nHope you can come!\nMai',
            },
            rubric: {
              grammar: { weight: 0.25, criteria: 'Uses phrasal verbs or gerunds/infinitives correctly (e.g. want to go, enjoy watching).' },
              vocabulary: { weight: 0.25, criteria: 'Uses leisure words (concert, exhibition, ticket, review, audience) appropriately.' },
              organization: { weight: 0.25, criteria: 'Message has greeting, clear details and friendly closing.' },
              taskAchievement: { weight: 0.25, criteria: 'Invites friend with event details; at least 25 words.' },
            },
            autoCheckKeywords: ['concert', 'exhibition', 'ticket', 'download', 'hope', 'ben', 'saturday', 'review', 'programme', 'come'],
          },
        }),
        buildExercise({
          slug: 'writing-invite-apply',
          title: 'Apply: Complete the Message Frames',
          instructions: 'Complete the message frames with the correct unit words.',
          exerciseType: 'gap_fill',
          sortOrder: 3,
          questions: [
            buildGapFill({
              questionText: 'Complete: Hi Sofia, | The dance [0] was amazing! | The [1] clapped for ten minutes. | I read your [2] online. | Let\'s go to the comedy [3] on Friday.',
              skillTag: 'writing',
              topicTag: TOPIC,
              explanation: 'performance; audience; review; show/comedy — hoàn thiện tin nhắn về sự kiện.',
              template: 'Hi Sofia,\n\nThe dance [0] was amazing! The [1] clapped for ten minutes. I read your [2] online. Let\'s go to the comedy [3] on Friday.\n\nAlex',
              correctAnswers: ['performance', 'audience', 'review', 'show'],
              acceptableAnswers: [['performance', 'Performance'], ['audience', 'Audience'], ['review', 'Review'], ['show', 'Show', 'comedy']],
              difficultyRating: 2,
            }),
          ],
        }),
      ],
    },

    speaking: {
      slug: 'speaking-leisure-time',
      title: 'Lesson 6: Talk About Free Time',
      learningObjective: 'Answer questions about entertainment preferences, concerts and streaming.',
      estimatedMinutes: 20,
      exercises: [
        buildExercise({
          slug: 'speaking-leisure-learn',
          title: 'Learn: Choose the Best Reply',
          instructions: 'Imagine an examiner asks you a question. Choose the best answer.',
          exerciseType: 'multiple_choice',
          sortOrder: 0,
          questions: [
            buildMcq({ questionText: 'Examiner: What do you like doing in your free time? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Enjoy + -ing: enjoy going to concerts.', correct: 'I enjoy going to concerts and exhibitions.', wrong: ['I enjoy go to concerts.', 'I enjoy to going concerts.'], distractorNotes: ['Missing gerund', 'Wrong form'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Examiner: How do you usually get tickets? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Found out + thông tin mua vé online.', correct: 'I usually find out the prices online and download tickets.', wrong: ['I usually pick up the prices online.', 'I usually take off tickets online.'], distractorNotes: ['Wrong phrasal verb', 'Wrong phrasal verb'], difficultyRating: 1 }),
            buildMcq({ questionText: 'Examiner: Do you prefer live events or streaming? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'So sánh tự nhiên live events vs streaming.', correct: 'I like live concerts, but I sometimes enjoy streaming films at home.', wrong: ['I like live magazines at home.', 'I enjoy audience films at concerts.'], distractorNotes: ['Wrong collocation', 'Nonsense'], difficultyRating: 1 }),
          ],
        }),
        buildExercise({
          slug: 'speaking-leisure-practice',
          title: 'Practice: Best Response',
          instructions: 'Choose the best phrase you would say in each situation.',
          exerciseType: 'multiple_choice',
          sortOrder: 1,
          questions: [
            buildMcq({ questionText: 'Examiner: Tell me about a concert you went to. You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Mô tả ngắn concert + audience reaction.', correct: 'I went to a jazz concert. The audience was fantastic.', wrong: ['I went to a jazz download.', 'I went to a streaming audience.'], distractorNotes: ['Wrong word', 'Nonsense'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Examiner: What did you decide to do last weekend? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Decide + to-infinitive.', correct: 'I decided to visit the photography exhibition.', wrong: ['I decided visiting the photography exhibition.', 'I decided visit the photography exhibition.'], distractorNotes: ['Gerund after decide', 'Missing to'], difficultyRating: 2 }),
            buildMcq({ questionText: 'Examiner: Would you like to review a film for the school magazine? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Would like + to-infinitive — lời đồng ý lịch sự.', correct: 'Yes, I would like to write a review.', wrong: ['Yes, I would like writing a review.', 'Yes, I like to writing a review.'], distractorNotes: ['Would like + to', 'Wrong pattern'], difficultyRating: 2 }),
          ],
        }),
        buildExercise({
          slug: 'speaking-leisure-interview',
          title: 'Check: Free Time Interview',
          instructions: 'Answer the examiner\'s questions about entertainment. Speak for up to two minutes.',
          exerciseType: 'speaking',
          sortOrder: 2,
          content: {
            prompt: 'The examiner will ask you about concerts, exhibitions, streaming and how you spend your free time.',
            sceneDescription: 'Teenagers at a concert venue with tickets, a programme and phones showing a streaming app.',
            followUpQuestions: [
              'Do you prefer going to live concerts or watching at home?',
              'When did you last go to an exhibition?',
              'Do you read reviews before you choose a film or show?',
              'How do you usually find out about events in your city?',
              'What kind of performance do you enjoy most?',
              'Would you like to download the arts centre app? Why?',
            ],
            suggestedAnswers: [
              'I prefer live concerts because the audience energy is exciting.',
              'I went to a photo exhibition last month.',
              'Yes, I read online reviews before I stream a new series.',
              'I find out about events on the centre website.',
              'I enjoy comedy performances the most.',
              'Yes, I want to download it to see ticket prices.',
            ],
            assessmentCriteria: {
              pronunciation: 'Key words (concert, exhibition, streaming, performance, audience) are understandable.',
              fluency: 'Responds with phrases or short sentences without long silences.',
              grammar: 'Uses phrasal verbs or gerunds/infinitives in at least two answers.',
              vocabulary: 'Uses at least four different unit words correctly.',
            },
            maxDurationSeconds: 120,
          },
        }),
        buildExercise({
          slug: 'speaking-leisure-apply',
          title: 'Apply: Situational Responses',
          instructions: 'Choose the best thing to say in each situation.',
          exerciseType: 'multiple_choice',
          sortOrder: 3,
          questions: [
            buildMcq({ questionText: 'Your friend asks if the concert was good. You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Mô tả performance + audience — phản hồi tự nhiên.', correct: 'Yes! The performance was great and the audience loved it.', wrong: ['Yes! The magazine was great and the ticket loved it.', 'Yes! The download was great and streaming loved it.'], distractorNotes: ['Mixed wrong words', 'Nonsense'], difficultyRating: 2 }),
            buildMcq({ questionText: 'You arrive at the venue early. You tell your friend:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Pick up programme — phrasal verb trong tình huống thực.', correct: 'Let\'s pick up a programme at the door.', wrong: ['Let\'s find out a programme at the door.', 'Let\'s take off a programme at the door.'], distractorNotes: ['Find out = discover info', 'Take off = remove'], difficultyRating: 2 }),
            buildMcq({ questionText: 'The examiner asks: Is streaming popular with teenagers? You say:', skillTag: 'speaking', topicTag: TOPIC, explanation: 'Đưa ý kiến + ví dụ ngắn về streaming.', correct: 'Yes, many teenagers enjoy streaming films and series at home.', wrong: ['Yes, many teenagers enjoy to stream at the concert venue only.', 'No, teenagers never download or stream anything.'], distractorNotes: ['Awkward/untrue', 'Too extreme'], difficultyRating: 3 }),
          ],
        }),
      ],
    },
  },
};
