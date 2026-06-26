import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const IN_CHUNK_SIZE = 80;
const MAX_ROWS = 10_000;

type Supabase = SupabaseClient<Database>;

async function fetchInChunks<TRow extends { question_id: string }>(
  supabase: Supabase,
  table: "choices" | "question_pairs",
  ids: string[],
  orderBy: "sort_order"
): Promise<TRow[]> {
  if (ids.length === 0) return [];

  const uniqueIds = [...new Set(ids)];
  const rows: TRow[] = [];

  for (let index = 0; index < uniqueIds.length; index += IN_CHUNK_SIZE) {
    const chunk = uniqueIds.slice(index, index + IN_CHUNK_SIZE);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .in("question_id", chunk)
      .order(orderBy)
      .range(0, MAX_ROWS - 1);

    if (error) {
      throw new Error(`${table} fetch failed: ${error.message}`);
    }

    if (data?.length) {
      rows.push(...(data as unknown as TRow[]));
    }
  }

  return rows;
}

export async function fetchChoicesByQuestionIds(
  supabase: Supabase,
  questionIds: string[]
): Promise<Database["public"]["Tables"]["choices"]["Row"][]> {
  return fetchInChunks(supabase, "choices", questionIds, "sort_order");
}

export async function fetchPairsByQuestionIds(
  supabase: Supabase,
  questionIds: string[]
): Promise<Database["public"]["Tables"]["question_pairs"]["Row"][]> {
  return fetchInChunks(supabase, "question_pairs", questionIds, "sort_order");
}

export function groupRowsByQuestionId<T extends { question_id: string }>(
  rows: T[]
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const bucket = map.get(row.question_id) ?? [];
    bucket.push(row);
    map.set(row.question_id, bucket);
  }
  return map;
}
