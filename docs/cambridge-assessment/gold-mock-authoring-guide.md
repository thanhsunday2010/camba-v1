# Gold Mock Authoring Guide

M3.1 standards for manually authoring Cambridge Gold Mocks — the academic source of truth for CAMBA.

---

## Principles

1. **Authenticity over volume** — one excellent mock beats ten mediocre ones.
2. **Blueprint fidelity** — M2.0 part counts and task types are non-negotiable.
3. **No AI-generated filler** — every item is human-authored and reviewable.
4. **Runtime compatibility** — all items must load in U6 without adapters.
5. **Traceability** — grammar tags, vocabulary topics, and difficulty are explicit metadata.

---

## Question quality rules

- Stems must be clear, age-appropriate, and exam-authentic.
- One clear objective per item — no double-barrelled questions.
- Reading/listening texts use natural child/teen language (not textbookese).
- Correct answers must be unambiguous for auto-scored items.
- Explanations optional but encouraged for review mode.
- Never reuse identical stems within the same mock.

---

## Distractor quality rules

- MCQ: 3 options for YLE; 3–4 for KET/PET where appropriate.
- Distractors must be plausible (same category/grammar frame as key).
- Avoid “all of the above”, negative tricks, or cultural bias.
- Matching: each left item maps to exactly one right item.
- Gap-fill: accept only orthographically correct forms listed in `correctAnswers`.

---

## Writing task quality rules

- Prompt must state audience, purpose, and content points clearly.
- Word limits match level (Starters: 3–25 words; KET email: 25–35; PET: 100+).
- Include `cambridgeTaskType`, `prompt`, `minWords`/`maxWords`, `rubricId`.
- Picture-style tasks use a text `taskDescription` (scene outline) — **never** `imageUrl`.
- Required bullet points for KET/PET must appear in prompt or `requiredPoints`.
- Tasks must be evaluable by M2.2 Gemini rubric without custom adapters.

---

## Speaking prompt quality rules

- Examiner-style instructions in `prompt` / `taskDescription`.
- `maxDurationSeconds` realistic (YLE: 60–120s; KET/PET: up to 240s).
- Picture description / spot-the-difference: describe scenes in `taskDescription` — **no images**.
- Personal questions: 2–4 `followUpQuestions` for YLE interview parts.
- Story telling: numbered story outline in `taskDescription` — **no** `pictureSequence`.
- Use M2.3 runtime aliases (`speaking_picture_description`, etc.).

---

## Vocabulary rules

- Tags from `YLE_VOCABULARY_TOPICS` (`vocabulary-taxonomy.ts`).
- Topic spread: no single topic > 20–25% of items.
- Level-appropriate lexis only (Starters: high-frequency concrete nouns; PET: broader B1 range).
- Avoid brand names, slang, and region-locked idioms unless taught in curriculum.

---

## Grammar rules

- Tags from `YLE_GRAMMAR_TAGS` (`grammar-taxonomy.ts`).
- Match grammar to level scope (Starters: be/have/can; Flyers: past simple; PET: conditionals).
- At least minimum distinct tags per level (see gold mock specifications).
- Do not test grammar never taught at that CEFR band.

---

## Difficulty rules

- Tag every item `easy`, `medium`, or `hard`.
- Follow level distribution targets (see specifications).
- Part progression: easier items earlier in each section when possible.
- Hard items test inference or productive skills — not obscure vocabulary.

---

## Age appropriateness rules

| Level | Age band | Content boundaries |
|-------|----------|-------------------|
| Starters | 7–9 | Concrete, familiar worlds (home, school, pets) |
| Movers | 8–11 | Simple past, hobbies, health |
| Flyers | 9–12 | Longer texts, opinions, environment |
| KET | 12–15 | Teen contexts, messages, everyday problems |
| PET | 13–17 | B1 topics; no adult-only themes |

Avoid violence, politics, religion, romance, and anxiety-triggering scenarios.

---

## File format

Gold Mocks live as:

- **Source:** `src/lib/cambridge-assessment/gold-mocks/manifests/{level}-gold-mock-1.ts`
- **Canonical JSON:** `data/cambridge-gold-mocks/{level}/{level}-gold-mock-1.json`

Use `composeGoldMockManifest()` and helpers in `gold-mock-helpers.ts`.

Required manifest fields:

```typescript
gold: {
  tier: "gold",
  authoringMethod: "manual",
  academicAuthority: true,
  ...
}
```

---

## Review workflow

1. Author content in TypeScript manifest.
2. Run `validateGoldMock()`.
3. Run `npm run analyze:gold-mock -- {level}`.
4. Complete QA checklist (`gold-mock-qa-checklist.md`).
5. Write JSON via `GOLD_WRITE=1` test hook.
6. Mark `gold.status: "published"`.

---

## Anti-patterns (reject)

- “Question #12” or “Writing task:” placeholder stems
- Copy-paste identical MCQ templates with one word changed
- Assembly-generated content presented as gold
- Missing grammar/vocabulary metadata
- Writing/speaking without AI-compatible content shape
- Part slug mismatch with M2.0 blueprint
