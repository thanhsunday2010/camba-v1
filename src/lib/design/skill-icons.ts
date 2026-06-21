import {
  BookOpen,
  BookText,
  Ear,
  FileText,
  Mic,
  PenLine,
  type LucideIcon,
} from "lucide-react";

export const SKILL_ICONS: Record<string, LucideIcon> = {
  vocabulary: BookOpen,
  grammar: BookText,
  reading: FileText,
  listening: Ear,
  writing: PenLine,
  speaking: Mic,
};
