import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";

export function normalizeCambridgeExamLevel(raw?: string | null): CambridgeExamLevel {
  if (!raw) return "flyers";
  const slug = raw.toLowerCase().replace(/\s+/g, "_");
  if (slug.includes("starter")) return "starters";
  if (slug.includes("mover")) return "movers";
  if (slug.includes("flyer")) return "flyers";
  if (slug.includes("ket") || slug.includes("a2_key")) return "ket";
  if (slug.includes("pet") || slug.includes("b1_preliminary")) return "pet";
  if (["starters", "movers", "flyers", "ket", "pet"].includes(slug)) {
    return slug as CambridgeExamLevel;
  }
  return "flyers";
}
