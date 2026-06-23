# M1.5.2 — Mock Test Tagging Guidelines

This document is the **canonical authoring guide** for `grammarTags` and `vocabularyTopics` on CAMBA YLE mock tests.

Gold-standard reference manifest:

`data/mock-tests/starters/starters-practice-test-1.json`

---

## 1. Why tagging exists

M1.4+ intelligence metadata powers:

- Learner grammar / vocabulary analytics (M1.5 UI)
- Content coverage reports (`npm run analyze:content-coverage`)
- Future adaptive practice and recommendations (M1.6+)

Tags must reflect **what the question assesses**, not every word in the sentence.

---

## 2. Grammar tagging rules

Use **only** slugs from `src/lib/learning/grammar-taxonomy.ts`.

| Rule | Detail |
|------|--------|
| Count | **1–2 tags** per question |
| Focus | Tag the grammar skill being **tested** |
| Avoid | Listing every grammar feature in the sentence |

### Good

Question: *"The cat is under the table. Where is the cat?"*

```json
"grammarTags": ["prepositions"]
```

Question: *"My name is Tom."* (gap: is)

```json
"grammarTags": ["verb_be"]
```

### Bad

Question: *"The cats are under the table."*

```json
"grammarTags": ["countable_uncountable", "verb_be", "prepositions"]
```

(Only tag `prepositions` if location is what is assessed.)

---

## 3. Vocabulary tagging rules

Use **only** slugs from `src/lib/learning/vocabulary-taxonomy.ts`.

| Rule | Detail |
|------|--------|
| Count | **1–2 topics** per question |
| Focus | Tag the **vocabulary domain** being assessed |
| Legacy | Keep `topicTag` if useful, but always add explicit `vocabularyTopics` |

### Good

```json
"vocabularyTopics": ["family"]
```

Animal + food matching:

```json
"vocabularyTopics": ["animals", "food"]
```

### Bad

Tagging every noun in the sentence, or using non-canonical slugs like `"toys"` (use `transport`, `colours`, or `hobbies` instead).

---

## 4. Examples (Starters Test 1)

### Listening — verb be

```json
{
  "questionRef": "listen-05",
  "grammarTags": ["verb_be"],
  "vocabularyTopics": ["family"],
  "topicTag": "family",
  "content": {
    "template": "My name [0] Tom.",
    "correctAnswers": ["is"]
  }
}
```

### Reading — prepositions

```json
{
  "questionRef": "rw-05",
  "grammarTags": ["prepositions"],
  "vocabularyTopics": ["home", "animals"],
  "questionText": "The cat is under the table. Where is the cat?"
}
```

### Reading — modal can

```json
{
  "questionRef": "listen-08",
  "grammarTags": ["modal_can"],
  "vocabularyTopics": ["sports"],
  "content": {
    "template": "I [0] swim.",
    "correctAnswers": ["can"]
  }
}
```

---

## 5. Bad examples

| Problem | Example |
|---------|---------|
| Over-tagging grammar | `["verb_be", "articles", "present_simple"]` on a single gap-fill testing only *is* |
| Random tags | Tags not linked to question intent |
| Non-canonical slug | `"toys"`, `"be"`, `"can"` instead of taxonomy slugs |
| Missing explicit vocab | Only legacy `topicTag` without `vocabularyTopics` |

---

## 6. Review checklist

Before marking a mock as fully tagged:

- [ ] Every question has `grammarTags` (1–2 slugs)
- [ ] Every question has `vocabularyTopics` (1–2 slugs)
- [ ] All slugs exist in taxonomy files
- [ ] Tags match **assessed** skill, not incidental grammar
- [ ] No single grammar tag appears on > 30% of questions (unless pedagogically justified)
- [ ] `npm run validate:mock-tests -- starters <slug>` shows **zero** metadata warnings
- [ ] `npm run analyze:content-coverage starters <slug>` report is readable

---

## 7. Validation workflow

```bash
# Validate one manifest (warnings printed; seeding still allowed)
npm run validate:mock-tests -- starters starters-practice-test-1

# Coverage report
npm run analyze:content-coverage starters starters-practice-test-1

# Re-seed after manifest changes (updates question content in DB)
npm run seed:mock-tests
```

Expected for a fully tagged mock:

- No `GRAMMAR_TAG_MISSING`
- No `VOCAB_TOPIC_MISSING`
- No `UNKNOWN_GRAMMAR_TAG`
- No `UNKNOWN_VOCAB_TOPIC`

---

## 8. Distribution guidance

- Aim for **balanced** grammar coverage across the test theme
- Top grammar tag should ideally be **≤ 30%** of questions
- Vocabulary should reflect manifest themes (family, school, animals, etc.)
- **Pedagogical accuracy beats artificial balance**

---

## 9. Rollout order (recommended)

1. **Starters Practice Test 1** — gold standard (M1.5.2) ✓
2. Starters Tests 2–3
3. Movers Tests 1–3
4. Flyers Tests 1–3

Copy patterns from Starters Test 1; adjust tags per question intent.
