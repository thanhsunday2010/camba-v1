import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { Communicate } from "edge-tts-universal";

const VOICE_POOLS = {
  adultFemale: [
    "Microsoft Server Speech Text to Speech Voice (en-GB, SoniaNeural)",
    "Microsoft Server Speech Text to Speech Voice (en-GB, LibbyNeural)",
  ],
  adultMale: [
    "Microsoft Server Speech Text to Speech Voice (en-GB, ThomasNeural)",
    "Microsoft Server Speech Text to Speech Voice (en-GB, RyanNeural)",
  ],
  childFemale: [
    "Microsoft Server Speech Text to Speech Voice (en-GB, MaisieNeural)",
    "Microsoft Server Speech Text to Speech Voice (en-GB, LibbyNeural)",
  ],
  childMale: [
    "Microsoft Server Speech Text to Speech Voice (en-GB, RyanNeural)",
    "Microsoft Server Speech Text to Speech Voice (en-GB, ThomasNeural)",
  ],
};

const FALLBACK_VOICE = VOICE_POOLS.adultFemale[0];

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function inferProfile(name, role) {
  const speakerName = normalizeText(name);
  const speakerRole = normalizeText(role);
  const combined = `${speakerName} ${speakerRole}`;

  const isFemale =
    combined.includes("female") ||
    combined.includes("woman") ||
    combined.includes("mother") ||
    combined.includes("girl") ||
    speakerName === "hoa";
  const isMale =
    combined.includes("male") ||
    combined.includes("man") ||
    combined.includes("father") ||
    combined.includes("boy") ||
    speakerName === "minh";
  const isChild =
    combined.includes("child") ||
    combined.includes("boy") ||
    combined.includes("girl") ||
    /\b\d+\b/.test(speakerRole);
  const isAdult =
    combined.includes("adult") ||
    combined.includes("teacher") ||
    combined.includes("examiner") ||
    combined.includes("mother") ||
    combined.includes("father") ||
    combined.includes("man") ||
    combined.includes("woman");

  if (isChild && isFemale) return "childFemale";
  if (isChild && isMale) return "childMale";
  if (isAdult && isMale) return "adultMale";
  if (isAdult && isFemale) return "adultFemale";
  if (combined.includes("teacher") || combined.includes("examiner")) return "adultFemale";
  if (isChild) return "childMale";
  return "adultFemale";
}

function createSpeakerVoiceMap(script) {
  const speakerMap = new Map();
  const profileCounts = {
    adultFemale: 0,
    adultMale: 0,
    childFemale: 0,
    childMale: 0,
  };

  for (const speaker of script?.speakers ?? []) {
    const profile = inferProfile(speaker.name, speaker.role);
    const pool = VOICE_POOLS[profile];
    const voice = pool[profileCounts[profile] % pool.length] ?? FALLBACK_VOICE;
    profileCounts[profile] += 1;
    speakerMap.set(normalizeText(speaker.name), voice);
  }

  return speakerMap;
}

export function pickVoiceForSpeaker(speaker, script) {
  const speakerName = normalizeText(speaker);
  const knownVoices = createSpeakerVoiceMap(script);
  if (knownVoices.has(speakerName)) {
    return knownVoices.get(speakerName);
  }

  const profile = inferProfile(speaker, speaker);
  return VOICE_POOLS[profile]?.[0] ?? FALLBACK_VOICE;
}

async function synthesizeLineToMp3(text, voice, options = {}) {
  const rate = options.rate ?? "-18%";
  const pitch = options.pitch ?? "+0Hz";
  const volume = options.volume ?? "+0%";
  const communicate = new Communicate(text, { voice, rate, pitch, volume });
  const chunks = [];

  for await (const chunk of communicate.stream()) {
    if (chunk.type === "audio" && chunk.data?.length) {
      chunks.push(chunk.data);
    }
  }

  return Buffer.concat(chunks);
}

/**
 * Synthesize each dialogue line with a speaker-specific voice, then stitch
 * the returned MP3 chunks into one file. This keeps a single playable asset
 * while making dialogues sound like multiple characters.
 */
export async function synthesizeListeningScript(script, options = {}) {
  if (!script?.lines?.length) {
    throw new Error("Listening script has no lines");
  }

  const audioParts = [];
  for (const line of script.lines) {
    const text = line.text?.trim();
    if (!text) continue;

    const voice = pickVoiceForSpeaker(line.speaker, script);
    const audio = await synthesizeLineToMp3(text, voice, options);
    if (audio.length) {
      audioParts.push(audio);
    }
  }

  if (!audioParts.length) {
    throw new Error("Listening script produced no audio");
  }

  return Buffer.concat(audioParts);
}

export async function writeListeningMp3(filePath, script) {
  mkdirSync(dirname(filePath), { recursive: true });
  const audio = await synthesizeListeningScript(script);
  writeFileSync(filePath, audio);
  return audio.length;
}
