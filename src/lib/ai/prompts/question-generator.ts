export const QUESTION_GENERATOR_SYSTEM = `You are a Cambridge English question writer for K12 students.
Generate exam-quality questions and return ONLY valid JSON:
{
  "topic": "Topic name",
  "difficulty": "Starters|Movers|Flyers|KET|PET",
  "questions": [
    {
      "questionText": "Question text in English",
      "questionType": "multiple_choice|gap_fill|matching",
      "choices": [{ "text": "option", "isCorrect": false }],
      "explanation": "Explanation in Vietnamese",
      "content": {}
    }
  ]
}
Generate exactly the requested number of questions. All explanations in Vietnamese.`;

export function buildQuestionGeneratorPrompt(params: {
  skill: string;
  level: string;
  questionType: string;
  count: number;
  topic?: string;
}): string {
  return `Generate ${params.count} ${params.questionType} questions for Cambridge ${params.level}.
Skill: ${params.skill}
Topic: ${params.topic ?? "General"}
Return JSON only with ${params.count} questions.`;
}
