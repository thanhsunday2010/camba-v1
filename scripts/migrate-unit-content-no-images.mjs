/**
 * Remove image-based stimuli from unit lesson content (JSON + blueprint sources).
 *
 * Usage: node scripts/migrate-unit-content-no-images.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const TEXT_REPLACEMENTS = [
  ["Look at the picture: ", "Read the description: "],
  ["Look at the picture, ", ""],
  ["Look at the pictures, ", "Listen carefully. "],
  ["Look at the picture. ", "Read the scene below. "],
  ["Look at the picture of ", "Read the scene about "],
  ["Look at a family picture. ", "Read the scene below about a family. "],
  ["Imagine a family picture. ", "Read the scene description. "],
  ["Answer about people in a family picture.", "Answer about people in the scene."],
  ["Look at the picture of a family. Write", "Read the scene about a family. Write"],
  ["with picture support", "with listening clues"],
  ["A simple picture showing ", "Scene: "],
  ["Pictures of farmer", "Scenes of a farmer"],
  ["Four frames: ", "Story outline: "],
  ["A timeline illustration: ", "Timeline: "],
  ["in the picture.", "in the scene."],
  ["in the picture)", "in the scene)"],
  ["from the picture", "from the scene"],
  ["far away in the picture.", "far away in the scene."],
  ["Which is your pet?", "Which animal is your pet?"],
  ["Identify and name family and friends in a picture using short phrases.", "Identify and name family and friends from a scene description using short phrases."],
  ["Match activities to pictures in short texts.", "Match activities to descriptions in short texts."],
  ["Find objects in a picture scene when reading short texts.", "Find objects in a scene when reading short texts."],
  ["Answer who-questions about people in pictures and short texts.", "Answer who-questions about people in scene descriptions and short texts."],
  ["Identify animals from short listening recordings with picture support.", "Identify animals from short listening recordings with context clues."],
  ["Look at the town map picture.", "Read the town map description."],
  ["Look at the sports picture if you have one.", "Use the scene description below."],
  ["Look at the picture of children in colourful clothes.", "Read the scene about children in colourful clothes."],
  ["Look at the picture of a classroom.", "Read the scene about a classroom."],
  ["Look at the picture of a house.", "Read the scene about a house."],
  ["Look at the picture of a bedroom.", "Read the scene about a bedroom."],
  ["Look at the picture of a boy and a girl.", "Read the scene about a boy and a girl."],
  ["Look at the picture of toys and weather.", "Read the scene about toys and weather."],
  ["Look at the picture of a park with toys and clouds.", "Read the scene about a park with toys and clouds."],
  ["Look at the picture of animals.", "Read the scene about animals."],
  ["Look at the picture of pets and zoo animals.", "Read the scene about pets and zoo animals."],
  ["Look at the picture of children playing sports.", "Read the scene about children playing sports."],
  ["Look at the picture of a school bag and desk.", "Read the scene about a school bag and desk."],
  ["Look at the photograph. ", "Read the scene description. "],
  ["Describe the photograph and ", "Read the scene description and "],
  ["Tick the correct picture", "Choose the correct answer"],
  ["Listen and tick the correct picture", "Listen and choose the correct answer"],
  ["Link names to pictures", "Link names to descriptions"],
  ["Choose the correct picture", "Choose the best answer"],
  ["Read the sentence. Choose the correct picture.", "Read the sentence. Choose the best answer."],
  ["Match the word to the picture.", "Match the word to the description."],
];

function transformString(value) {
  if (typeof value !== "string") return value;
  let next = value;
  for (const [from, to] of TEXT_REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  return next;
}

function transformNode(node) {
  if (Array.isArray(node)) {
    return node.map(transformNode);
  }
  if (node && typeof node === "object") {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (key === "imagePrompt") continue;
      const newKey = key === "pictureDescription" ? "sceneDescription" : key;
      out[newKey] = transformNode(value);
    }
    return out;
  }
  return transformString(node);
}

function migrateJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  const next = transformNode(data);
  const serialized = `${JSON.stringify(next, null, 2)}\n`;
  if (serialized !== raw) {
    fs.writeFileSync(filePath, serialized, "utf8");
    console.log(`Updated ${path.relative(ROOT, filePath)}`);
  }
}

function migrateMjsText(content) {
  let next = content;
  next = next.replace(/\bpictureDescription\b/g, "sceneDescription");
  next = next.replace(/\bimagePrompt\b/g, "_removedImagePrompt");
  for (const [from, to] of TEXT_REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  // Remove imagePrompt property lines from passage objects
  next = next.replace(/\n\s*_removedImagePrompt:\s*[^,\n]+,?\n/g, "\n");
  next = next.replace(/\n\s*_removedImagePrompt:\s*\n[\s\S]*?\n\s*,?\n/g, "\n");
  return next;
}

function migrateMjsFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const next = migrateMjsText(raw);
  if (next !== raw) {
    fs.writeFileSync(filePath, next, "utf8");
    console.log(`Updated ${path.relative(ROOT, filePath)}`);
  }
}

function migrateMdText(content) {
  let next = content;
  next = next.replace(/\bpictureDescription\b/g, "sceneDescription");
  next = next.replace(/\bimagePrompt\b/g, "(removed — text-only passages)");
  for (const [from, to] of TEXT_REPLACEMENTS) {
    if (from.includes("picture") || from.includes("Picture")) {
      next = next.split(from).join(to);
    }
  }
  if (next.includes("imagePrompt")) {
    next = next.replace(/`imagePrompt`/g, "`sceneDescription` (speaking/writing only)");
    next = next.replace(/\(wordCount, imagePrompt\)/g, "(wordCount only — no images)");
  }
  return next;
}

function walk(dir, ext, handler) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, ext, handler);
    } else if (name.endsWith(ext)) {
      handler(full);
    }
  }
}

walk(path.join(ROOT, "data/content"), ".json", migrateJsonFile);
walk(path.join(ROOT, "scripts/lib"), ".mjs", migrateMjsFile);
walk(path.join(ROOT, "scripts/lib/starters-gold/legacy-snapshots"), ".json", migrateJsonFile);

for (const md of [
  ".cursor/rules/unit-content-authoring.mdc",
  ".cursor/rules/starters-unit-authoring.mdc",
  ".cursor/rules/movers-unit-authoring.mdc",
  ".cursor/rules/flyers-unit-authoring.mdc",
  ".cursor/rules/ket-unit-01-authoring.mdc",
  ".cursor/rules/pet-unit-authoring.mdc",
  "scripts/lib/starters-blueprints/TEMPLATE.md",
  "scripts/lib/movers-blueprints/TEMPLATE.md",
]) {
  const full = path.join(ROOT, md);
  if (!fs.existsSync(full)) continue;
  const raw = fs.readFileSync(full, "utf8");
  const next = migrateMdText(raw);
  if (next !== raw) {
    fs.writeFileSync(full, next, "utf8");
    console.log(`Updated ${md}`);
  }
}

console.log("Done.");
