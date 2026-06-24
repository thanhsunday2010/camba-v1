import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeItemReference } from "@/lib/cambridge-assessment/cambridge-item-bank-proposal";
import type { CambridgeExamVersion } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";

export type CambridgeExamManifestMetadata = {
  manifestId: string;
  manifestVersion: string;
  blueprintId: string;
  blueprintVersion: string;
  level: CambridgeExamLevel;
  examVersion: CambridgeExamVersion;
  assemblySeed: string;
  title: string;
  description: string | null;
  formKind: "practice" | "diagnostic" | "full-form";
  timeLimitMinutes: number;
  totalScore: number;
  assembledAt: string;
  authoringNotes?: string;
};

export type CambridgeExamManifestPart = {
  paperSlug: string;
  partSlug: string;
  partNumber: number;
  title: string;
  skill: string;
  questionCount: number;
  itemReferences: CambridgeItemReference[];
};

export type CambridgeExamManifestPaper = {
  paperSlug: string;
  title: string;
  skills: string[];
  parts: CambridgeExamManifestPart[];
};

/**
 * Reference-based exam manifest — items are not duplicated inline.
 * Exam → Papers → Parts → Item References
 */
export type CambridgeExamManifest = {
  metadata: CambridgeExamManifestMetadata;
  papers: CambridgeExamManifestPaper[];
  /** Flat reference list for assembly QA and hydration. */
  itemReferences: CambridgeItemReference[];
};
