import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { EdgeTTS } from "edge-tts-universal";

/** Slow, clear UK English for YLE Starters listening. */
const STARTERS_VOICE =
  "Microsoft Server Speech Text to Speech Voice (en-GB, SoniaNeural)";

const EXAMINER_VOICE =
  "Microsoft Server Speech Text to Speech Voice (en-GB, SoniaNeural)";

const CHILD_VOICE =
  "Microsoft Server Speech Text to Speech Voice (en-GB, RyanNeural)";

export function buildListeningSpeechText(script) {
  if (!script?.lines?.length) return "";

  return script.lines
    .map((line) => line.text?.trim())
    .filter(Boolean)
    .join(". ");
}

export function pickVoiceForSpeaker(speaker) {
  const name = (speaker ?? "").toLowerCase();
  if (name.includes("examiner") || name.includes("teacher") || name.includes("adult")) {
    return EXAMINER_VOICE;
  }
  if (name.includes("minh") || name.includes("boy") || name.includes("girl") || name.includes("child")) {
    return CHILD_VOICE;
  }
  return STARTERS_VOICE;
}

/**
 * Synthesize dialogue with short pauses; alternates voice when speaker changes.
 */
export async function synthesizeListeningScript(script, options = {}) {
  const rate = options.rate ?? "-18%";
  const lines = script?.lines ?? [];
  if (lines.length === 0) {
    throw new Error("Listening script has no lines");
  }

  const chunks = [];

  for (const line of lines) {
    const text = line.text?.trim();
    if (!text) continue;

    const voice = pickVoiceForSpeaker(line.speaker);
    const tts = new EdgeTTS(text, voice, { rate });
    const result = await tts.synthesize();
    const buf = Buffer.from(await result.audio.arrayBuffer());
    chunks.push(buf);
  }

  return Buffer.concat(chunks);
}

export async function writeListeningMp3(filePath, script) {
  mkdirSync(dirname(filePath), { recursive: true });
  const audio = await synthesizeListeningScript(script);
  writeFileSync(filePath, audio);
  return audio.length;
}
