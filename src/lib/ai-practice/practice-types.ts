import { z } from "zod";
import type {
  PracticeAttemptRecord,
  PracticeMode,
  SpeakingPhase,
  WritingStep,
} from "@/lib/ai-practice/practice-enhancement-types";

export const PracticeLanguageSchema = z.enum(["en", "zh", "fr", "ja", "ko", "de"]);
export const PracticeProgramSchema = z.enum(["general", "ielts", "toeic"]);
export const PracticeSkillSchema = z.enum(["writing", "speaking"]);
export const PracticeModeSchema = z.enum(["standard", "micro", "roleplay"]);

export const PracticeProfileSchema = z.object({
  language: PracticeLanguageSchema,
  level: z.string().min(1),
  program: PracticeProgramSchema,
  skill: PracticeSkillSchema,
  mode: PracticeModeSchema.default("standard"),
});

export type PracticeLanguage = z.infer<typeof PracticeLanguageSchema>;
export type PracticeProgram = z.infer<typeof PracticeProgramSchema>;
export type PracticeSkill = z.infer<typeof PracticeSkillSchema>;
export type PracticeProfile = z.infer<typeof PracticeProfileSchema>;

export interface PracticePrompt {
  analysisSummary: string;
  prompt: string;
  instructions: string;
  minWords?: number;
  maxWords?: number;
  maxDurationSeconds?: number;
  followUpQuestions?: string[];
  sentenceStarters?: string[];
  repeatPhrase?: string;
  rolePlayPersona?: string;
}

export interface PracticeSessionState {
  profile: PracticeProfile;
  currentPrompt: PracticePrompt;
  previousPrompts: string[];
  round: number;
  promptKey: string;
  attempts: PracticeAttemptRecord[];
  writingStep: WritingStep;
  outline: string;
  speakingPhase: SpeakingPhase;
  focusFixHint?: string;
}

export function hashPromptKey(prompt: string): string {
  let hash = 0;
  for (let i = 0; i < prompt.length; i += 1) {
    hash = (hash << 5) - hash + prompt.charCodeAt(i);
    hash |= 0;
  }
  return `p${Math.abs(hash)}`;
}

export { type PracticeMode, type WritingStep, type SpeakingPhase, type PracticeAttemptRecord };
