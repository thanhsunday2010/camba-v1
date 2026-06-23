# M1.4 — Grammar & Vocabulary Intelligence Metadata

M1.4 adds canonical `grammarTags` and `vocabularyTopics` to mock question metadata. This is **infrastructure only** — no AI, no learner UI yet.

## Adding metadata to manifests

Each question in `data/mock-tests/**/*.json` may include:

```json
{
  "questionRef": "rw-01",
  "grammarTags": ["present_simple", "verb_be"],
  "vocabularyTopics": ["family"],
  "topicTag": "family"
}
```

Rules:

- Use **slugs** from `src/lib/learning/grammar-taxonomy.ts` and `src/lib/learning/vocabulary-taxonomy.ts`.
- `grammarTags` and `vocabularyTopics` are optional arrays — missing values emit **warnings only** during validation; seeding still succeeds.
- Legacy `topicTag` remains supported; runtime/coverage can resolve some freeform tags via aliases, but authors should migrate to explicit `vocabularyTopics`.

## Examples by level

### Starters (present simple, family/park vocabulary)

```json
{
  "questionRef": "listen-05",
  "sectionSlug": "listening",
  "grammarTags": ["verb_be", "present_simple"],
  "vocabularyTopics": ["weather"],
  "topicTag": "weather",
  "questionText": "Complete the sentence.",
  "cambaQuestionType": "gap_fill",
  "content": {
    "template": "It is [0] today.",
    "correctAnswers": ["sunny"]
  }
}
```

### Movers (past simple, school trip)

```json
{
  "questionRef": "rw-09",
  "grammarTags": ["past_simple"],
  "vocabularyTopics": ["sports"],
  "topicTag": "sports",
  "questionText": "When did Ben score?",
  "cambaQuestionType": "multiple_choice",
  "choices": [
    { "text": "in the first half", "isCorrect": true, "sortOrder": 0 },
    { "text": "after the game", "isCorrect": false, "sortOrder": 1 }
  ]
}
```

### Flyers (linking words, community/adventure)

```json
{
  "questionRef": "rw-13",
  "grammarTags": ["linking_words", "past_simple"],
  "vocabularyTopics": ["community"],
  "topicTag": "community",
  "questionText": "Complete the sentence.",
  "cambaQuestionType": "gap_fill",
  "content": {
    "template": "[0], volunteers collected donations.",
    "correctAnswers": ["Meanwhile"]
  }
}
```

## Tooling

| Command | Purpose |
|---------|---------|
| `npm run validate:mock-tests` | Structural + quality + M1.4 metadata warnings |
| `npm run analyze:content-coverage` | Grammar/vocabulary coverage report for all manifests |

## Seeding

`scripts/lib/seed-mock-test.mjs` persists `grammarTags` / `vocabularyTopics` into `questions.content` when present on manifest blocks.

## Analytics (future-ready)

`src/lib/learning/learner-skill-analytics.ts` aggregates attempt results by grammar/vocabulary tags for future diagnostics — not wired to UI in M1.4.
