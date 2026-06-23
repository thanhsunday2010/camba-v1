import type { ItemBankQuestion } from "@/lib/item-bank/item-bank-types";

/** Sample items for registry/coverage unit tests (filesystem banks may be empty). */
export const ITEM_BANK_SAMPLE_ITEMS: ItemBankQuestion[] = [
  {
    id: "starters-listen-01",
    level: "starters",
    skill: "listening",
    part: "listening-part-1-link",
    questionType: "matching",
    difficulty: "easy",
    grammarTags: ["have_got"],
    vocabularyTopics: ["family"],
    content: { questionText: "Match each person to what they have." },
    authoringMetadata: { sourceQuestionRef: "listen-01" },
  },
  {
    id: "starters-listen-05",
    level: "starters",
    skill: "listening",
    part: "listening-part-2-write",
    questionType: "gap_fill",
    difficulty: "easy",
    grammarTags: ["verb_be"],
    vocabularyTopics: ["family"],
    content: { template: "My name [0] Tom." },
    authoringMetadata: { sourceQuestionRef: "listen-05" },
  },
];
