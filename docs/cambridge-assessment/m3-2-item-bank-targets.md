# M3.2 Item Bank Target Coverage Framework

**Purpose:** Define minimum inventory targets justified by blueprint, assembly, and coverage requirements — not arbitrary numbers.

## Target Formula

```
targetItems = formSize × 3 versions × 2 pool depth
minItems    = formSize × 3 versions
```

Where **formSize** = total questions per full exam form from M2.0 blueprints.

| Level | Form Size | minItems (3×) | Computed Target | **Adopted Target** |
|-------|-----------|---------------|-----------------|-------------------|
| Starters | 43 | 129 | 258 | **250** |
| Movers | 51 | 153 | 306 | **350** |
| Flyers | 59 | 177 | 354 | **450** |
| KET | 59 | 177 | 354 | **600** |
| PET | 64 | 192 | 384 | **800** |

KET/PET adopted targets exceed the pure formula to account for **multi-skill breadth** (reading, listening, writing, speaking) and **task-type diversity** required for authentic B1/B2 assembly.

## Justification by Requirement

### Blueprint Requirements (M2.0)

Each level blueprint defines:
- Papers (Reading, Listening, Writing, Speaking)
- Parts with fixed `questionCount` and `allowedTaskTypes`
- AI-evaluated writing/speaking parts

**Minimum pool depth per part:** 6 items (allows version A/B/C without reuse within a part).

### Exam Assembly Requirements (M2.4)

Assembly needs:
- Enough candidates per part to satisfy `questionCount`
- Stratified difficulty selection (easy/medium/hard policy per level)
- No item reuse within a single form
- Three distinct versions (A/B/C) from the same bank

**Therefore:** `minItems = formSize × 3` is the hard floor for single-pass assembly.

### Coverage Requirements (M1.4 + M3.1)

| Dimension | Starters | Movers | Flyers | KET | PET |
|-----------|----------|--------|--------|-----|-----|
| minGrammarTags | 12 | 14 | 16 | 18 | 18 |
| minVocabularyTopics | 15 | 18 | 20 | 22 | 22 |
| minWritingItems | 20 | 20 | 20 | 12 | 12 |
| minSpeakingItems | 12 | 12 | 12 | 8 | 10 |
| minPerDifficulty (easy/med/hard) | 25%/45%/15% of target | same | same | same | same |

### Writing/Speaking Minimums

Derived from M2.2/M2.3 task coverage:
- Each writing task type needs ≥2 items for version rotation
- Speaking parts (3–4 per level) need ≥2 items per part

## Implementation

Targets are codified in:

```typescript
// src/lib/item-bank/item-bank-coverage-matrix.ts
export const ITEM_BANK_INVENTORY_TARGETS
```

Coverage matrix builder compares actual inventory against these targets and emits `CoverageGap` records with `critical` / `warning` severity.

## Readiness Score

```
readinessScore = weighted percentage of target dimensions met
```

Current unified banks score **32–44%** readiness — sufficient for QA and pipeline validation, insufficient for M3.3 mass generation.

## Path to Targets

| Phase | Action | Expected Gain |
|-------|--------|---------------|
| M3.2 (now) | Gold extract + 30 manual expansion/level | ~400 items |
| M3.3 | Human-authored batches per part/skill | → minItems |
| M3.4+ | Continued authoring against gap reports | → targetItems |
