import { describe, expect, it } from "vitest";
import {
  YLE_VOCABULARY_TOPICS,
  isKnownVocabularyTopic,
  validateVocabularyTopics,
  resolveVocabularyTopicsFromLegacyTopicTag,
} from "@/lib/learning/vocabulary-taxonomy";

describe("vocabulary taxonomy", () => {
  it("recognises canonical vocabulary topics", () => {
    expect(isKnownVocabularyTopic("family")).toBe(true);
    expect(isKnownVocabularyTopic("school")).toBe(true);
    expect(isKnownVocabularyTopic("unknown_topic")).toBe(false);
  });

  it("validates known and unknown vocabulary topics", () => {
    const result = validateVocabularyTopics(["family", "made_up", "sports"]);
    expect(result.valid).toEqual(["family", "sports"]);
    expect(result.unknown).toEqual(["made_up"]);
  });

  it("maps legacy topicTag aliases to canonical topics", () => {
    expect(resolveVocabularyTopicsFromLegacyTopicTag("park")).toEqual(["leisure"]);
    expect(resolveVocabularyTopicsFromLegacyTopicTag("family")).toEqual(["family"]);
    expect(resolveVocabularyTopicsFromLegacyTopicTag("xyzzy")).toEqual([]);
    expect(YLE_VOCABULARY_TOPICS.length).toBeGreaterThanOrEqual(18);
  });
});
