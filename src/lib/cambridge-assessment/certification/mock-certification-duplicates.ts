/**
 * M3.4 — Mock-level duplicate and cluster detection.
 */

import type { MockCertificationIssue } from "@/lib/cambridge-assessment/certification/mock-certification-types";
import type { YleMockQuestionManifestBlock } from "@/lib/mock-blueprints/yle-mock-manifest-types";

export type MockDuplicateMatch = {
  itemARef: string;
  itemBRef: string;
  matchType:
    | "identical_stem"
    | "near_stem"
    | "identical_prompt"
    | "duplicate_distractor"
    | "repeated_task_flow"
    | "grammar_cluster"
    | "vocabulary_cluster";
  similarity: number;
  detail: string;
};

export type MockDuplicateReport = {
  totalItems: number;
  matches: MockDuplicateMatch[];
  duplicateItemCount: number;
  duplicateClusterCount: number;
  diversityPenalty: number;
};

function normalizeStem(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^(listen\.|read\.|look at the picture\.|write\.)\s*/i, "");
}

function stemOf(q: YleMockQuestionManifestBlock): string {
  const content = q.content ?? {};
  const text =
    (typeof content.questionText === "string" && content.questionText) ||
    (typeof content.prompt === "string" && content.prompt) ||
    q.questionText ||
    "";
  return normalizeStem(text);
}

function tokenSet(text: string): Set<string> {
  return new Set(normalizeStem(text).split(/\W+/).filter((t) => t.length > 2));
}

const NEAR_THRESHOLD = 0.92;

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

const CLUSTER_THRESHOLD = 0.4;

function normalize(text: string): string {
  return normalizeStem(text);
}

function contentFingerprint(q: YleMockQuestionManifestBlock): string {
  const content = q.content ?? {};
  const parts: string[] = [];

  if (q.cambaQuestionType === "writing" || q.cambaQuestionType === "speaking") {
    const prompt = typeof content.prompt === "string" ? normalize(content.prompt) : normalize(q.questionText);
    return prompt || q.questionRef;
  }

  if (Array.isArray(q.choices)) {
    parts.push(
      q.choices
        .map((c) => normalize(c.text ?? ""))
        .sort()
        .join("|")
    );
  }
  if (Array.isArray(q.pairs)) {
    parts.push(
      q.pairs
        .map((p) => `${normalize(p.leftText ?? "")}:${normalize(p.rightText ?? "")}`)
        .join("|")
    );
  }
  if (typeof content.template === "string") {
    parts.push(normalize(content.template));
  }
  if (Array.isArray(content.correctAnswers)) {
    parts.push((content.correctAnswers as string[]).map((a) => normalize(a)).join("|"));
  }
  if (typeof content.passage === "string") {
    parts.push(normalize(content.passage));
  }

  const fingerprint = parts.filter(Boolean).join("::");
  return fingerprint || q.questionRef;
}

export function detectMockDuplicates(
  questions: YleMockQuestionManifestBlock[]
): MockDuplicateReport {
  const matches: MockDuplicateMatch[] = [];
  const stems = questions.map((q) => ({ ref: q.questionRef, stem: stemOf(q), q }));

  for (let i = 0; i < stems.length; i += 1) {
    for (let j = i + 1; j < stems.length; j += 1) {
      const a = stems[i]!;
      const b = stems[j]!;

      if (
        a.stem.length > 0 &&
        b.stem.length > 0 &&
        a.stem === b.stem &&
        contentFingerprint(a.q) === contentFingerprint(b.q)
      ) {
        matches.push({
          itemARef: a.ref,
          itemBRef: b.ref,
          matchType: "identical_stem",
          similarity: 1,
          detail: a.stem.slice(0, 80),
        });
        continue;
      }

      if (a.stem.length > 0 && b.stem.length > 0) {
        const sim = jaccard(tokenSet(a.stem), tokenSet(b.stem));
        if (sim >= NEAR_THRESHOLD && a.q.partSlug === b.q.partSlug) {
          matches.push({
            itemARef: a.ref,
            itemBRef: b.ref,
            matchType: "near_stem",
            similarity: sim,
            detail: `"${a.stem.slice(0, 40)}" ~ "${b.stem.slice(0, 40)}"`,
          });
        }
      }

      const partA = a.q.partSlug;
      const partB = b.q.partSlug;
      const typeA = a.q.blueprintQuestionType;
      const typeB = b.q.blueprintQuestionType;
      if (partA === partB && typeA === typeB && a.stem.length > 0 && a.stem === b.stem) {
        matches.push({
          itemARef: a.ref,
          itemBRef: b.ref,
          matchType: "repeated_task_flow",
          similarity: 1,
          detail: `${partA}/${typeA}`,
        });
      }
    }
  }

  const byPart = new Map<string, YleMockQuestionManifestBlock[]>();
  for (const q of questions) {
    const list = byPart.get(q.partSlug) ?? [];
    list.push(q);
    byPart.set(q.partSlug, list);
  }
  for (const [part, items] of byPart) {
    if (items.length >= 3) {
      const types = items.map((i) => i.blueprintQuestionType);
      const uniqueTypes = new Set(types).size;
      if (uniqueTypes === 1 && items.length >= 4) {
        matches.push({
          itemARef: items[0]!.questionRef,
          itemBRef: items[1]!.questionRef,
          matchType: "repeated_task_flow",
          similarity: 1,
          detail: `Section ${part} has ${items.length} identical task types.`,
        });
      }
    }
  }

  const grammarClusters = new Map<string, string[]>();
  for (const q of questions) {
    const key = (q.grammarTags ?? []).slice().sort().join("|") || "none";
    const list = grammarClusters.get(key) ?? [];
    list.push(q.questionRef);
    grammarClusters.set(key, list);
  }
  for (const [cluster, refs] of grammarClusters) {
    if (refs.length >= 4 && cluster !== "none") {
      const share = refs.length / questions.length;
      if (share >= CLUSTER_THRESHOLD) {
        matches.push({
          itemARef: refs[0]!,
          itemBRef: refs[1]!,
          matchType: "grammar_cluster",
          similarity: share,
          detail: `Grammar cluster "${cluster}" in ${refs.length} items.`,
        });
      }
    }
  }

  const vocabClusters = new Map<string, string[]>();
  for (const q of questions) {
    for (const topic of q.vocabularyTopics ?? []) {
      const list = vocabClusters.get(topic) ?? [];
      list.push(q.questionRef);
      vocabClusters.set(topic, list);
    }
  }
  for (const [topic, refs] of vocabClusters) {
    if (refs.length >= 4) {
      const share = refs.length / questions.length;
      if (share >= CLUSTER_THRESHOLD) {
        matches.push({
          itemARef: refs[0]!,
          itemBRef: refs[1]!,
          matchType: "vocabulary_cluster",
          similarity: share,
          detail: `Vocabulary topic "${topic}" in ${refs.length} items.`,
        });
      }
    }
  }

  const duplicateItemCount = new Set(
    matches.filter((m) => m.matchType === "identical_stem").flatMap((m) => [m.itemARef, m.itemBRef])
  ).size;

  const duplicateClusterCount = matches.filter(
    (m) => m.matchType === "grammar_cluster" || m.matchType === "vocabulary_cluster"
  ).length;

  const diversityPenalty = Math.min(
    50,
    matches.filter((m) => m.matchType === "identical_stem").length * 10 +
      matches.filter((m) => m.matchType === "near_stem").length * 2 +
      duplicateClusterCount * 3
  );

  return {
    totalItems: questions.length,
    matches,
    duplicateItemCount,
    duplicateClusterCount,
    diversityPenalty,
  };
}

export function duplicateIssuesFromReport(report: MockDuplicateReport): MockCertificationIssue[] {
  const issues: MockCertificationIssue[] = [];
  for (const m of report.matches.filter((x) => x.matchType === "identical_stem")) {
    issues.push({
      code: "DUPLICATE_STEM",
      path: `${m.itemARef}/${m.itemBRef}`,
      message: `Identical stem: ${m.detail}`,
      severity: "error",
      category: "duplicate",
    });
  }
  for (const m of report.matches.filter((x) => x.matchType === "near_stem")) {
    issues.push({
      code: "NEAR_DUPLICATE_STEM",
      path: `${m.itemARef}/${m.itemBRef}`,
      message: `Near-duplicate (${(m.similarity * 100).toFixed(0)}%): ${m.detail}`,
      severity: "warning",
      category: "duplicate",
    });
  }
  for (const m of report.matches.filter((x) => x.matchType === "grammar_cluster" || x.matchType === "vocabulary_cluster")) {
    issues.push({
      code: "DUPLICATE_CLUSTER",
      path: `${m.itemARef}/${m.itemBRef}`,
      message: m.detail,
      severity: "warning",
      category: "duplicate",
    });
  }
  return issues;
}

export function diversityScoreFromReport(report: MockDuplicateReport): number {
  return Math.max(0, 100 - report.diversityPenalty);
}
