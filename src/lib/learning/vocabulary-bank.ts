export type VocabularyWord = {
  word: string;
  ipa: string;
  partOfSpeech?: string | null;
  vietnameseMeaning: string;
  exampleSentence: string;
  exampleTranslation?: string | null;
};

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseVocabularyBank(raw: unknown): VocabularyWord[] {
  if (!Array.isArray(raw)) return [];

  const words: VocabularyWord[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const word = readString(row.word);
    const vietnameseMeaning = readString(row.vietnameseMeaning);
    if (!word || !vietnameseMeaning) continue;

    words.push({
      word,
      ipa: readString(row.ipa),
      partOfSpeech: readString(row.partOfSpeech) || null,
      vietnameseMeaning,
      exampleSentence: readString(row.exampleSentence),
      exampleTranslation:
        readString(row.exampleTranslation) ||
        readString(row.exampleSentenceVi) ||
        readString(row.exampleSentenceTranslation) ||
        null,
    });
  }

  return words;
}
