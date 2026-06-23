/**
 * Derive persisted mock format metadata from a manifest at seed time.
 * Mirrors src/lib/mock-tests/mock-test-format.ts listening rules.
 */

function listeningParts(manifest) {
  return (manifest.parts ?? []).filter((p) => p.sectionSlug === "listening");
}

export function deriveFormatFromManifest(manifest) {
  const sections = manifest.sections ?? [];
  const listeningPartsList = listeningParts(manifest);
  const hasListening = sections.some((s) => s.sectionSlug === "listening");

  const audioInParts = listeningPartsList.some((p) => p.audio?.src?.trim());
  const textInParts = listeningPartsList.some(
    (p) => (p.passage?.text?.trim() || p.note?.includes("Text-simulated")) && !p.audio?.src?.trim()
  );

  let listeningMode = "none";
  if (hasListening) {
    if (audioInParts && textInParts) listeningMode = "mixed";
    else if (audioInParts) listeningMode = "audio";
    else listeningMode = "text";
  }

  return {
    levelSlug: manifest.metadata.levelSlug ?? null,
    isPracticeMock: true,
    isAutoScoredSubset: true,
    includesSpeaking: false,
    includesWriting: false,
    includedSkillSlugs: [...new Set(sections.map((s) => s.skillSlug).filter(Boolean))],
    includedSectionTitles: sections.map((s) => s.title),
    listeningMode,
    hasAudio: listeningMode === "audio" || listeningMode === "mixed",
    hasTextBasedListening: listeningMode === "text" || listeningMode === "mixed",
  };
}
