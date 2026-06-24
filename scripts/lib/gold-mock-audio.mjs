import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { writeListeningMp3 } from "./listening-audio.mjs";

/** Convert Gold Mock listening transcript text into edge-tts script lines. */
export function transcriptToListeningScript(transcript) {
  const lines = String(transcript ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    speakers: [{ name: "Examiner", role: "examiner" }],
    lines: lines.map((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0 && colonIndex < 40) {
        const speaker = line.slice(0, colonIndex).trim();
        const text = line.slice(colonIndex + 1).trim();
        return { speaker, text };
      }
      return { speaker: "Examiner", text: line };
    }),
  };
}

export async function writeGoldMockListeningMp3(filePath, transcript) {
  mkdirSync(dirname(filePath), { recursive: true });
  const script = transcriptToListeningScript(transcript);
  const bytes = await writeListeningMp3(filePath, script);
  return bytes;
}

export function goldMockListeningAudioSrc(goldMockId, partSlug) {
  return `/audio/gold-mocks/${goldMockId}/${partSlug}.mp3`;
}
