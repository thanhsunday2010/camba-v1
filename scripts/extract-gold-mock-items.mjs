#!/usr/bin/env node
/**
 * M3.2 — Extract all Gold Mocks into normalized cambridge-item-banks entries.
 *
 * Usage:
 *   npm run extract:gold-mock-items
 *   npm run extract:gold-mock-items -- starters
 *   npm run extract:gold-mock-items -- all --write
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const GOLD_ROOT = join(ROOT, "data/cambridge-gold-mocks");
const BANK_ROOT = join(ROOT, "data/cambridge-item-banks");
const LEVELS = ["starters", "movers", "flyers", "ket", "pet"];

function loadGoldMock(level) {
  const path = join(GOLD_ROOT, level, `${level}-gold-mock-1.json`);
  if (!existsSync(path)) {
    throw new Error(`Gold mock not found: ${path}`);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

const WRITING_TASK_MAP = {
  write_sentence: "write_sentence",
  write_note: "writing_message",
  write_email: "writing_email",
  write_story: "writing_story",
  picture_description: "picture_description",
};

const SPEAKING_TASK_MAP = {
  speaking_personal_questions: "speaking_personal_questions",
  speaking_picture_description: "speaking_picture_description",
  speaking_storytelling: "speaking_storytelling",
  speaking_discussion: "speaking_discussion",
};

function mapSkill(skillTag, sectionSlug) {
  const slug = (skillTag ?? sectionSlug).toLowerCase();
  if (slug.includes("listen")) return "listening";
  if (slug.includes("writ")) return "writing";
  if (slug.includes("speak")) return "speaking";
  if (slug.includes("read")) return "reading";
  return "reading_writing";
}

function extractItem(manifest, q) {
  const level = manifest.metadata.levelSlug;
  const questionType =
    q.cambaQuestionType === "writing" || q.cambaQuestionType === "speaking"
      ? q.cambaQuestionType
      : q.cambaQuestionType;

  const source = {
    sourceLevel: level,
    sourceMock: manifest.gold?.goldMockId ?? manifest.metadata.manifestId,
    sourcePart: q.partSlug,
    sourceQuestion: q.questionRef,
    extractedAt: new Date().toISOString(),
    goldMockTier: "gold",
  };

  let content;
  if (questionType === "writing") {
    const raw = q.content ?? {};
    const cambridgeTaskType = raw.cambridgeTaskType ?? "write_sentence";
    content = {
      prompt: raw.prompt ?? q.questionText,
      instructions: raw.taskDescription,
      writingTaskType: WRITING_TASK_MAP[cambridgeTaskType] ?? "writing_message",
      cambridgeTaskType,
      minWords: raw.minWords,
      maxWords: raw.maxWords,
      requiredPoints: raw.requiredPoints,
      imageUrl: raw.imageUrl,
      rubricId: raw.rubricId ?? `gold-${cambridgeTaskType}-v1`,
      questionText: q.questionText,
    };
  } else if (questionType === "speaking") {
    const raw = q.content ?? {};
    const cambridgeTaskType = raw.cambridgeTaskType ?? "speaking_personal_questions";
    content = {
      prompt: raw.prompt ?? q.questionText,
      speakingTaskType: SPEAKING_TASK_MAP[cambridgeTaskType] ?? "speaking_personal_questions",
      cambridgeTaskType,
      maxDurationSeconds: raw.maxDurationSeconds ?? 120,
      followUpQuestions: raw.followUpQuestions,
      imageUrl: raw.imageUrl,
      pictureSequence: raw.pictureSequence,
      rubricId: raw.rubricId ?? `gold-${cambridgeTaskType}-v1`,
      questionText: q.questionText,
    };
  } else {
    content = {
      questionText: q.questionText,
      ...(q.content ?? {}),
      ...(q.choices?.length ? { choices: q.choices } : {}),
      ...(q.pairs?.length ? { pairs: q.pairs } : {}),
    };
  }

  return {
    id: `${level}-${q.questionRef}`,
    level,
    skill: mapSkill(q.skillTag, q.sectionSlug),
    part: q.partSlug,
    questionType,
    difficulty: q.difficulty,
    grammarTags: q.grammarTags ?? [],
    vocabularyTopics: q.vocabularyTopics ?? [],
    content,
    authoringMetadata: {
      sourceManifestId: manifest.metadata.manifestId,
      sourceQuestionRef: q.questionRef,
      extractedAt: source.extractedAt,
      topicTag: q.topicTag,
      skillTag: q.skillTag,
      blueprintQuestionType: q.blueprintQuestionType,
      cambridgeTaskType: q.content?.cambridgeTaskType,
      sectionSlug: q.sectionSlug,
      points: q.points,
      sortOrder: q.sortOrder,
      questionText: q.questionText,
      source,
      rubricId: content.rubricId,
    },
  };
}

function extractGoldOnly(manifest) {
  const items = (manifest.questions ?? []).map((q) => extractItem(manifest, q));
  return {
    bankVersion: "2.0.0",
    level: manifest.metadata.levelSlug,
    itemCount: items.length,
    sourceManifests: [manifest.metadata.manifestId],
    extractedAt: new Date().toISOString(),
    bankTier: "cambridge-unified",
    items,
  };
}

const args = process.argv.slice(2);
const writeFlag = args.includes("--write");
const levelArg = args.find((a) => a !== "--write") ?? "all";
const targets = levelArg === "all" ? LEVELS : [levelArg];

if (writeFlag && levelArg === "all") {
  const result = spawnSync(
    "npx",
    [
      "vitest",
      "run",
      "src/lib/item-bank/item-bank.validation.test.ts",
      "-t",
      "writes unified item banks",
    ],
    {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
      env: { ...process.env, ITEM_BANK_WRITE: "1" },
    }
  );
  process.exit(result.status ?? 1);
}

for (const level of targets) {
  if (!LEVELS.includes(level)) {
    console.error(`Unknown level: ${level}`);
    process.exit(1);
  }
  const manifest = loadGoldMock(level);
  const bank = extractGoldOnly(manifest);

  if (writeFlag) {
    const dir = join(BANK_ROOT, level);
    mkdirSync(dir, { recursive: true });
    const out = join(dir, "items.json");
    writeFileSync(out, JSON.stringify(bank, null, 2), "utf8");
    console.log(`Extracted ${bank.itemCount} gold items → ${out}`);
  } else {
    console.log(`=== ${level.toUpperCase()} GOLD EXTRACT (${bank.itemCount} items) ===`);
    console.log(JSON.stringify(bank, null, 2).slice(0, 600) + "\n...");
  }
}

console.log("\nGold extraction complete. Use --write for filesystem output.");
console.log("Unified banks (gold + expansion): npm run extract:gold-mock-items -- all --write");
