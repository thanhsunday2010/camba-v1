import { z } from "zod";

export const PracticeLanguageSchema = z.enum(["en", "zh", "fr", "ja", "ko", "de"]);
export const PracticeProgramSchema = z.enum(["general", "ielts", "toeic"]);
export const PracticeSkillSchema = z.enum(["writing", "speaking"]);

export const PracticeProfileSchema = z.object({
  language: PracticeLanguageSchema,
  level: z.string().min(1),
  program: PracticeProgramSchema,
  skill: PracticeSkillSchema,
});

export type PracticeLanguage = z.infer<typeof PracticeLanguageSchema>;
export type PracticeProgram = z.infer<typeof PracticeProgramSchema>;
export type PracticeSkill = z.infer<typeof PracticeSkillSchema>;
export type PracticeProfile = z.infer<typeof PracticeProfileSchema>;

export interface PracticeSessionState {
  profile: PracticeProfile;
  currentPrompt: PracticePrompt;
  previousPrompts: string[];
  round: number;
}

export interface PracticePrompt {
  analysisSummary: string;
  prompt: string;
  instructions: string;
  minWords?: number;
  maxWords?: number;
  maxDurationSeconds?: number;
  followUpQuestions?: string[];
}
