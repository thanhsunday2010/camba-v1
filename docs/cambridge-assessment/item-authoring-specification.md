# Canonical Item Authoring Specification

**Authority:** This document governs all Cambridge item bank authoring in CAMBA.  
**Scope:** Reading, Listening, Writing, Speaking — Starters through PET.

## 1. Item Identity

Every item MUST have:

| Field | Rule |
|-------|------|
| `id` | `{level}-{source}-{seq}` e.g. `starters-exp-001`, `ket-pgm-042` |
| `level` | One of: `starters`, `movers`, `flyers`, `ket`, `pet` |
| `skill` | `listening`, `reading`, `reading_writing`, `writing`, `speaking` |
| `part` | M2.0 blueprint `partSlug` |
| `questionType` | Receptive type OR `writing` / `speaking` |
| `difficulty` | `easy`, `medium`, `hard` — calibrated to level CEFR band |

## 2. Grammar Tagging Rules

- Use **canonical slugs** from `YLE_GRAMMAR_TAGS` (`src/lib/learning/grammar-taxonomy.ts`)
- Minimum **1 tag**, recommended **2** for analytics richness
- Tag the **primary grammatical focus** being tested, not incidental grammar
- Do NOT use grammar slugs as vocabulary topics (e.g. `prepositions` is grammar, not vocab)
- Unknown tags fail validation (`ITEM_UNKNOWN_GRAMMAR_TAG`)

## 3. Vocabulary Tagging Rules

- Use **canonical topics** from `YLE_VOCABULARY_TOPICS`
- Minimum **1 topic**, recommended **2**
- Topics reflect **content domain**, not grammatical category
- KET/PET may use full topic set including `technology`, `environment`, `culture`, `community`

## 4. Difficulty Calibration

| Level | Easy | Medium | Hard |
|-------|------|--------|------|
| Starters | Pre-A1 core vocab, single clause | Simple inference | Multi-step listening |
| Movers | A1 familiar contexts | Mild distractors | Combined skills |
| Flyers | A2 standard | Passage-level inference | Complex instructions |
| KET | A2+ | B1 threshold | B1+ extended |
| PET | B1 | B1+ | B2 threshold |

- Auto-scored items MUST have difficulty assigned
- Writing/speaking: calibrate by **word range**, **task complexity**, **cognitive demand**
- Bank-level distribution validated against `cambridge-difficulty-policy`

## 5. Distractor Design (Receptive Items)

1. **Plausibility:** Distractors must be same category as key (semantic, grammatical, or visual)
2. **Homogeneity:** All options similar length and register
3. **Single key:** Exactly one correct answer unless multi-select specified
4. **No overlap:** Distractor text must not duplicate another item's key or distractor in the same bank slice
5. **Age-appropriate:** YLE distractors use familiar vocabulary; no trick questions

## 6. Writing Task Authoring (M2.2 Compatible)

Required content fields:

```json
{
  "prompt": "Candidate-facing task instruction",
  "instructions": "Bullet points or examiner notes",
  "writingTaskType": "writing_email | writing_story | writing_message | writing_article | writing_review | write_sentence | write_note | picture_description",
  "minWords": 25,
  "maxWords": 35,
  "requiredPoints": ["Point 1", "Point 2"],
  "rubricId": "cambridge-write-email-v1"
}
```

Rules:
- Word range MUST match level expectations (Starters: 1 sentence; KET: 25–35; PET: 100–120 for article)
- `rubricId` MUST reference an existing M2.2 rubric
- Include all bullet points the candidate must address
- Picture tasks MUST include `imageUrl` or reference stimulus

## 7. Speaking Task Authoring (M2.3 Compatible)

Required content fields:

```json
{
  "prompt": "Examiner instruction",
  "speakingTaskType": "speaking_personal_questions | speaking_picture_description | speaking_storytelling | speaking_discussion",
  "maxDurationSeconds": 120,
  "followUpQuestions": ["Optional follow-up"],
  "imageUrl": "/images/speaking/...",
  "rubricId": "cambridge-speaking-interview-v1"
}
```

Rules:
- Duration MUST be realistic for level (Starters: 30–60s; PET: up to 120s)
- Personal questions: provide 2–4 follow-up questions
- Picture description: provide image or picture sequence
- `rubricId` MUST reference an existing M2.3 rubric

## 8. Listening Task Authoring

- Include `audioUrl` or `transcript` for authoring QA
- Gap-fill: provide `template` with `[0]` placeholders and `correctAnswers`
- Matching: provide `pairs` with `leftText`/`rightText`
- MCQ listening: stem references audio content; choices are visual or textual

## 9. Reading Task Authoring

- Reading comprehension: include `passage` in content
- Matching: word-to-picture or sentence-to-picture pairs
- Generic part instructions (e.g. "Match the word to the picture.") are permitted when **content payload differs**

## 10. Source Traceability

Every item MUST include:

```json
{
  "source": {
    "sourceLevel": "starters",
    "sourceMock": "starters-gold-mock-1",
    "sourcePart": "listening-part-1",
    "sourceQuestion": "sgm-001",
    "goldMockTier": "gold | expansion | manual"
  }
}
```

Extracted gold items retain `goldMockTier: "gold"`. Manual expansion uses `expansion` tier.

## 11. Templates

Authoring templates live at `data/cambridge-authoring-templates/`:
- `reading-mcq.template.json`
- `listening-gap-fill.template.json`
- `writing-task.template.json`
- `speaking-task.template.json`

Use templates for **human authoring consistency** — not AI bulk generation.

## 12. Validation Gate

All items MUST pass `validateItemBankFile()` before merge. Extended validation (`validateItemBankExtended`) adds coverage, duplicate, and blueprint checks.
