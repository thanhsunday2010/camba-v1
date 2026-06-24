# M3.2 Item Bank Audit

**Date:** June 2026  
**Scope:** `data/item-bank/`, `data/cambridge-gold-mocks/`, `data/cambridge-item-banks/`, M1.8 architecture

## Executive Summary

M3.1 established five Gold Mocks as the academic source of truth. M3.2 converts that content into a **measurable, unified item bank** with expansion samples, validation 2.0, and gap analysis. The bank is **not yet at mass-generation scale** — inventory remains the primary gap — but quality infrastructure is in place.

## Current Item Counts

| Level | Gold Mock Items | Expansion (+30) | Unified Bank | Target | Readiness |
|-------|-----------------|-------------------|--------------|--------|-----------|
| Starters | 43 | 30 | **73** | 250 | ~44% |
| Movers | 51 | 30 | **81** | 350 | ~40% |
| Flyers | 59 | 30 | **89** | 450 | ~38% |
| KET | 59 | 30 | **89** | 600 | ~35% |
| PET | 64 | 30 | **94** | 800 | ~32% |

**Total unified inventory:** 426 items across five levels.

## Data Locations

| Path | Role | Status |
|------|------|--------|
| `data/cambridge-gold-mocks/{level}/` | Authoritative Gold Mock JSON (M3.1) | ✅ 5 levels |
| `data/cambridge-item-banks/{level}/items.json` | Unified bank (gold extract + expansion) | ✅ Written |
| `data/item-bank/{yle}/items.json` | Legacy M1.8 YLE banks | Partial (3 levels, pre-M3.2) |
| `src/lib/item-bank/` | Types, validation, coverage, extraction | ✅ M3.2 |

## M1.8 Architecture Assessment

| Component | M1.8 State | M3.2 Enhancement |
|-----------|------------|------------------|
| Item types | YLE-only, receptive-focused | All 5 levels + writing + speaking |
| Registry | `data/item-bank/` | Prefers `data/cambridge-item-banks/` |
| Validation | Per-item metadata | Validation 2.0: coverage, duplicates, blueprint |
| Traceability | Manifest refs | Full `sourceMock/sourcePart/sourceQuestion/sourceLevel` |
| Coverage | Grammar/vocab counts | Full coverage matrix + gap reports |

## Coverage Gaps (Starters exemplar)

From `npm run analyze:item-bank-gaps`:

- **Inventory:** 73 / 129 minimum (critical)
- **Writing:** 11 / 20 minimum (critical)
- **Speaking:** 9 / 12 minimum (critical)
- **Difficulty:** Hard band under-represented (5 / 39 target)
- **Grammar missing:** `future_will`, `comparatives`, `superlatives`, `countable_uncountable`, `modal_must`, `conjunctions`, `adverbs_frequency`, `relative_clauses`, `linking_words`
- **Vocabulary missing:** `jobs` (and similar gaps at higher levels)
- **Part depth:** Speaking parts at 3/6 items each (warning)

Similar patterns apply at Movers–PET with level-appropriate grammar/vocabulary expectations.

## Task Gaps

| Skill | Present | Gap |
|-------|---------|-----|
| Listening | ✅ All blueprint parts | Pool depth per part |
| Reading | ✅ All blueprint parts | Pool depth per part |
| Writing | ✅ All M2.2 task types represented | Volume (email, story, article, review need more items) |
| Speaking | ✅ All M2.3 task types represented | Volume (personal, picture, storytelling, discussion) |

## Level Gaps

- **YLE (Starters–Flyers):** Strong gold-mock foundation; expansion adds diversity but inventory far below 3-version assembly targets.
- **KET/PET:** Gold mock + 30 expansion; reading/listening pool insufficient for PET full-form assembly without reference bank fallback.

## Difficulty Gaps

Unified banks skew **easy** (Cambridge-appropriate for YLE) with insufficient **hard** band items for stratified assembly at scale.

## Quality Findings

1. Gold mock generic part instructions (e.g. "Match the word to the picture.") are **not content duplicates** — content fingerprint distinguishes items.
2. `vocabularyTopics: ["prepositions"]` error fixed in Movers/Flyers gold mocks (grammar conflated with vocab).
3. Expansion merge skips stem-duplicates against gold extract — no ID or stem duplication in unified banks.
4. Duplicate detection: 0 identical content duplicates in unified starters bank after M3.2 fixes.

## Recommendations

1. Prioritize **part-depth expansion** (6+ items per blueprint part) before mass mock generation (M3.3).
2. Author **hard-band** items deliberately for KET/PET.
3. Expand writing/speaking pools to meet `minWritingItems` / `minSpeakingItems` per level.
4. Use `data/cambridge-authoring-templates/` for human authoring consistency.
