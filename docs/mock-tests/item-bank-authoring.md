# Item Bank Authoring Guide

Canonical guide for CAMBA reusable question assets (M1.8 foundation).

---

## 1. Why item banks exist

Mock tests were originally authored as complete manifests — every question lived inline inside a single JSON file. That works for a handful of practice tests but does not scale to dozens of high-quality mocks with consistent blueprint coverage.

The item bank introduces a **reusable asset layer**:

```
Item Bank → Question Items (canonical, validated)
Mock Manifest → References question items (M1.9+)
```

Benefits:

- Questions are authored once and reused across many mocks
- Metadata (grammar, vocabulary, difficulty) is **enforced**, not optional
- Coverage can be analyzed at bank level before assembly
- M1.9 can generate mocks from the bank without rewriting content architecture

**M1.8 is foundation only.** No runtime routes, scoring, or seed behavior change. Mock generation belongs to M1.9.

---

## 2. Item lifecycle

```
Author / Extract → Validate → Register → Analyze coverage → (M1.9) Assemble mock
```

| Stage | Tool / location |
|-------|-----------------|
| Author manually | Edit `data/item-bank/{level}/items.json` |
| Extract from manifest | `npm run extract:item-bank -- starters starters-practice-test-1` |
| Validate (strict) | `validateItemBankQuestion()` / extraction CLI |
| Load / query | `loadItemBank()`, `getItemsByLevel()`, etc. |
| Coverage report | `npm run analyze:item-bank starters` |
| Assemble mock | M1.9 — not yet implemented |

Each item has a stable `id` (e.g. `starters-listen-05`). Once published to the bank, treat IDs as immutable references for future mock manifests.

---

## 3. Metadata requirements

Every `ItemBankQuestion` must include:

| Field | Required | Notes |
|-------|----------|-------|
| `id` | Yes | `{level}-{questionRef}` |
| `level` | Yes | `starters` \| `movers` \| `flyers` |
| `skill` | Yes | `listening` \| `reading` \| `reading_writing` \| `writing` |
| `part` | Yes | Blueprint part slug (e.g. `rw-part-2-sentences`) |
| `questionType` | Yes | CAMBA auto-scored type |
| `difficulty` | Yes | `easy` \| `medium` \| `hard` |
| `grammarTags` | Yes | ≥1 canonical slug from M1.4 taxonomy |
| `vocabularyTopics` | Yes | ≥1 canonical slug from M1.4 taxonomy |
| `content` | Yes | Non-empty question payload |
| `authoringMetadata` | Yes | Provenance and legacy fields |

Item bank schema is **independent** of mock manifest types. Do not import manifest types into item definitions.

---

## 4. Difficulty guidelines

| Band | When to use |
|------|-------------|
| **easy** | Single-step recognition, familiar vocabulary, obvious distractors |
| **medium** | Two-step reasoning, less common vocab, closer distractors |
| **hard** | Inference, multi-clause sentences, subtle distinctions |

Difficulty is assigned at **item** level, not mock level. A balanced mock (M1.9) will sample across bands per blueprint part.

Starters Test 1 reference distribution (20 items): 10 easy, 9 medium, 1 hard.

---

## 5. Grammar tagging rules

- Use slugs from `src/lib/learning/grammar-taxonomy.ts` only
- Tag the **primary grammatical focus** tested by the item
- Multiple tags allowed when genuinely co-tested (e.g. `verb_be` + `present_simple`)
- Unknown slugs cause **validation failure** (strict mode)

Examples:

- Gap-fill "My name [0] Tom." → `verb_be`
- "She [0] a cat." → `verb_have`, `present_simple`

See also: `docs/mock-tests/m1-5-2-tagging-guidelines.md`

---

## 6. Vocabulary tagging rules

- Use slugs from `src/lib/learning/vocabulary-taxonomy.ts` only
- Tag the **dominant lexical domain** of the stimulus and correct answer
- Prefer one primary topic; add secondary only when equally salient
- Unknown topics cause **validation failure**

Examples:

- Family photo description → `family`
- Animal matching → `animals`

---

## 7. Validation workflow

Item bank validation is **strict** (errors, not warnings). Unlike M1.4 manifest metadata warnings, incomplete items cannot enter the bank.

```bash
# Extract + validate in one step
npm run extract:item-bank -- starters starters-practice-test-1
```

Programmatic:

```typescript
import { validateItemBankFile } from "@/lib/item-bank/item-bank-validation";

const result = validateItemBankFile(items);
if (!result.valid) {
  // result.errors — fix before committing
}
```

Failure codes include: missing metadata, unknown grammar/vocabulary slug, unsupported question type, empty content, duplicate ids.

---

## 8. Coverage workflow

Analyze grammar, vocabulary, and difficulty distribution for a level:

```bash
npm run analyze:item-bank starters
```

Sample output:

```
=== STARTERS ITEM BANK ===

Items: 20

Grammar
  Present simple            6
  Be verb                   6
  ...

Vocabulary
  Family                    4
  Animals                   3
  ...

Difficulty
  easy                     12
  medium                    7
  hard                      1

Missing grammar areas:
  Past simple, …

Missing vocabulary areas:
  Transport, …
```

Use coverage reports to identify gaps **before** M1.9 mock assembly. Taxonomies are reused from M1.4 — not duplicated.

---

## 9. Extraction workflow

Convert a fully tagged gold-standard manifest into a canonical bank:

```bash
npm run extract:item-bank -- starters starters-practice-test-1
```

Output: `data/item-bank/starters/items.json`

Extraction preserves:

- `grammarTags`, `vocabularyTopics`, `difficulty`
- `part`, question type, content payload
- Provenance in `authoringMetadata` (`sourceManifestId`, `sourceQuestionRef`, `extractedAt`)

**Prerequisite:** manifest must pass M1.5.2 tagging (0 metadata warnings). Starters Practice Test 1 is the first canonical source (20 items).

Re-run extraction after manifest updates to refresh the bank. Review git diff before committing.

---

## 10. Future generator workflow (M1.9)

M1.9 will:

1. Load item bank via registry APIs
2. Filter by blueprint part, skill, difficulty targets
3. Enforce grammar/vocabulary coverage constraints
4. Emit mock manifest JSON referencing item ids (not inline duplication)
5. Validate assembled manifest against existing mock pipeline

**Not in scope for M1.8:**

- Automatic mock generation
- Manifest assembly from items
- AI item generation
- Database persistence
- Runtime / seed / scoring changes

---

## File layout

```
data/item-bank/
  starters/items.json   ← 20 items (from Starters Test 1)
  movers/items.json     ← empty placeholder
  flyers/items.json     ← empty placeholder

src/lib/item-bank/
  item-bank-types.ts
  item-bank-validation.ts
  item-bank-registry.ts
  item-bank-coverage.ts
  item-bank-extract.ts

scripts/
  extract-item-bank-from-mock.mjs
  analyze-item-bank.mjs
```

---

## Quick checklist for new items

- [ ] Stable unique `id`
- [ ] Valid level, skill, part, question type
- [ ] Difficulty assigned
- [ ] ≥1 grammar tag (canonical slug)
- [ ] ≥1 vocabulary topic (canonical slug)
- [ ] Non-empty content (text, choices, pairs, or template)
- [ ] `authoringMetadata` populated
- [ ] `npm run analyze:item-bank {level}` — review coverage
- [ ] `npm run test:validation` — 0 failures
