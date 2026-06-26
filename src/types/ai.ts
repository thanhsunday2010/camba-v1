import { z } from "zod";

export const ShieldEstimateSchema = z.object({
  reading: z.number().min(0).max(15).optional(),
  listening: z.number().min(0).max(15).optional(),
  speaking: z.number().min(0).max(15).optional(),
  writing: z.number().min(0).max(15).optional(),
  scaleScore: z.number().min(100).max(170).optional(),
});

export const WritingFeedbackSchema = z.object({
  estimatedLevel: z.string(),
  shieldEstimate: ShieldEstimateSchema,
  grammarFeedback: z.string(),
  vocabularyFeedback: z.string(),
  coherenceFeedback: z.string(),
  suggestedImprovements: z.array(z.string()),
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  errorHighlights: z.array(z.string()).optional(),
  correctedVersion: z.string().optional(),
});

export const SpeakingFeedbackSchema = z.object({
  estimatedLevel: z.string(),
  shieldEstimate: ShieldEstimateSchema,
  pronunciationScore: z.number().min(0).max(100),
  fluencyScore: z.number().min(0).max(100),
  grammarScore: z.number().min(0).max(100),
  vocabularyScore: z.number().min(0).max(100),
  suggestions: z.array(z.string()),
  transcript: z.string().optional(),
  overallScore: z.number().min(0).max(100),
});

export const StudyCoachSchema = z.object({
  dailyRecommendations: z.array(z.string()),
  weeklyPlan: z.array(z.object({
    day: z.string(),
    focus: z.string(),
    tasks: z.array(z.string()),
  })),
  progressSummary: z.string(),
  motivationMessage: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestedActions: z.array(z.object({
    type: z.string(),
    title: z.string(),
    description: z.string(),
  })),
});

export const GeneratedQuestionSchema = z.object({
  questionText: z.string(),
  questionType: z.string(),
  choices: z.array(z.object({
    text: z.string(),
    isCorrect: z.boolean(),
  })).optional(),
  explanation: z.string().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

export const QuestionGeneratorSchema = z.object({
  questions: z.array(GeneratedQuestionSchema),
  topic: z.string(),
  difficulty: z.string(),
});

export type WritingFeedback = z.infer<typeof WritingFeedbackSchema>;
export type SpeakingFeedback = z.infer<typeof SpeakingFeedbackSchema>;

export const PracticePromptSchema = z.object({
  analysisSummary: z.string(),
  prompt: z.string(),
  instructions: z.string(),
  minWords: z.number().optional(),
  maxWords: z.number().optional(),
  maxDurationSeconds: z.number().optional(),
  followUpQuestions: z.array(z.string()).optional(),
});

export const PracticeWritingFeedbackSchema = WritingFeedbackSchema.extend({
  modelAnswerSuggestion: z.string(),
  errorHighlights: z.array(z.string()).optional(),
});

export const PracticeSpeakingFeedbackSchema = SpeakingFeedbackSchema.extend({
  modelAnswerSuggestion: z.string(),
});

export type PracticePromptResult = z.infer<typeof PracticePromptSchema>;
export type PracticeWritingFeedback = z.infer<typeof PracticeWritingFeedbackSchema>;
export type PracticeSpeakingFeedback = z.infer<typeof PracticeSpeakingFeedbackSchema>;
export type StudyCoachResponse = z.infer<typeof StudyCoachSchema>;
export type QuestionGeneratorResponse = z.infer<typeof QuestionGeneratorSchema>;
export type ShieldEstimate = z.infer<typeof ShieldEstimateSchema>;
