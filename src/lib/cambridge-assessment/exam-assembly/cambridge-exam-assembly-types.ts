import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type { CambridgeItemBankItem } from "@/lib/cambridge-assessment/cambridge-item-bank-proposal";
import type { CambridgeExamManifest } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-manifest-types";
import type { CambridgeExamAssemblyReport } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-report";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";

/** Deterministic exam form label — same blueprint, different item set. */
export type CambridgeExamVersion = "A" | "B" | "C";

export const CAMBRIDGE_EXAM_VERSIONS: CambridgeExamVersion[] = ["A", "B", "C"];

export type CambridgeItemDifficulty = "easy" | "medium" | "hard";

/** Blueprint-driven difficulty distribution targets (not global constants). */
export type CambridgeDifficultyPolicy = {
  level: CambridgeExamLevel;
  distribution: Record<CambridgeItemDifficulty, number>;
  /** Maximum absolute deviation from target share (0–1). */
  tolerance: number;
  notes?: string;
};

export type CambridgeCoverageRequirements = {
  minDistinctGrammarTags: number;
  minDistinctVocabularyTopics: number;
  minSkillsRepresented: number;
  requireWritingTasks: boolean;
  requireSpeakingTasks: boolean;
};

export type CambridgeAssemblyPartSelection = {
  paperSlug: string;
  partSlug: string;
  partNumber: number;
  skill: CambridgeExamBlueprint["papers"][number]["parts"][number]["skill"];
  taskType: CambridgeItemBankItem["taskType"];
  item: CambridgeItemBankItem;
  sortOrder: number;
  points: number;
};

export type CambridgeExamAssemblyInput = {
  level: CambridgeExamLevel;
  version?: CambridgeExamVersion;
  /** Base seed — combined with version for deterministic item selection. */
  seed?: string;
  itemBank?: CambridgeItemBankItem[];
  /** When true, assembly throws on validation failure instead of returning errors. */
  strict?: boolean;
};

export type CambridgeExamAssemblySuccess = {
  success: true;
  manifest: CambridgeExamManifest;
  runtimeManifest: YleMockManifest;
  report: CambridgeExamAssemblyReport;
  selections: CambridgeAssemblyPartSelection[];
};

export type CambridgeExamAssemblyFailure = {
  success: false;
  manifest: CambridgeExamManifest | null;
  report: CambridgeExamAssemblyReport;
  selections: CambridgeAssemblyPartSelection[];
  errors: string[];
};

export type CambridgeExamAssemblyResult =
  | CambridgeExamAssemblySuccess
  | CambridgeExamAssemblyFailure;
