# M4.1 Phase A — Audit Findings

Pre-implementation audit of CAMBA assessment architecture before Gold Mock authoring.

## Scope audited

| System | Path | Status |
|--------|------|--------|
| Cambridge assessment core | `src/lib/cambridge-assessment/` | Reusable |
| Gold mock framework (M3.1) | `gold-mocks/`, `gold-mock-validation.ts` | Extended for M4.1 |
| Item bank (M3.2) | `src/lib/item-bank/` | Consumes gold mock 1 only (M4.2 target) |
| Writing AI (M2.2) | `src/lib/writing/` | Contract-ready |
| Speaking AI (M2.3) | `src/lib/speaking/` | Contract-ready |
| Exam assembly (M2.4) | `exam-assembly/` | Blueprint validation ready |
| Coverage engine (M3.2) | `item-bank/coverage-matrix.ts` | Ready for post-extraction |
| Mass generation (M3.3) | `exam-assembly/cambridge-exam-assembler.ts` | Out of scope (non-goal) |
| Certification (M3.4) | `certification/` | Extended for 15 mocks, GOLD-only policy |

## Reusable systems

1. **`composeGoldMockManifest()`** — Deterministic manifest composition with metadata, blueprint refs, coverage targets.
2. **`gold-mock-helpers.ts`** — Typed builders for MCQ, gap-fill, matching, reading, writing, speaking, listening audio.
3. **`validateGoldMock()`** — Blueprint, coverage, difficulty, M2.2/M2.3 shape validation.
4. **`certifyGoldMock()`** — M3.4 certification pipeline with academic quality rules.
5. **`extractItemBankFromManifest()`** — M4.2-ready item extraction (1:1 question mapping).
6. **`detectCrossMockStemDuplicates()`** — Content fingerprint duplicate detection across mock versions.

## Required authoring contracts

| Contract | Source | Requirement |
|----------|--------|-------------|
| Gold manifest shape | `gold-mock-format.ts` | `GoldMockManifest` with `gold`, `specification`, `metadata`, `questions`, `parts` |
| Question metadata | `gold-mock-authoring-standard.md` | grammarTags, vocabularyTopics, skillTag, blueprintQuestionType, difficulty |
| Writing tasks | M2.2 `writing-utils.ts` | rubricId, prompt, word guidance, Gemini eval config |
| Speaking tasks | M2.3 `speaking-utils.ts` | rubricId, prompt, duration, transcription compatibility |
| Blueprint compliance | `cambridge-exam-blueprints.ts` | Part counts and question types per level |

## Exam assembly requirements

| Level | Questions per mock | Papers |
|-------|-------------------|--------|
| Starters | 43 | Listening, Reading & Writing, Speaking |
| Movers | 51 | Listening, Reading & Writing, Speaking |
| Flyers | 59 | Listening, Reading & Writing, Speaking |
| KET | 59 | Reading & Writing, Listening, Speaking |
| PET | 64 | Reading, Writing, Listening, Speaking |

Each mock must pass `validateRuntimeManifestCompatibility()` before student use.

## Content gaps (pre-M4.1)

- M3.1 shipped **5 mocks** (1 per level); M4.1 requires **15** (3 per level).
- Mock 2/3 slots empty for all levels.
- JSON manifests on disk only for mock 1.
- Item bank builder referenced mock 1 exclusively.

## Blueprint gaps (pre-M4.1)

- No cross-version duplicate policy enforced at registry level.
- Certification allowed Silver/Bronze for gold mocks — tightened to **GOLD only** in M4.1.
- No central registry tracking author, reviewer, version, publication readiness.

## M4.1 resolution

| Gap | Resolution |
|-----|------------|
| 15 mocks | 15 TS manifests + JSON in `data/cambridge-gold-mocks/` |
| Registry | `gold-mock-registry.ts` with version, author, certification status |
| Duplicates | Fingerprint-based `detectCrossMockStemDuplicates()` |
| Certification | `certifyGoldMock()` rejects non-gold tiers |
| Authoring standard | `gold-mock-authoring-standard.md` |
| Coverage report | `gold-mock-coverage-report.md` |

## Non-goals confirmed

- No mass generation
- No item bank expansion in M4.1
- No runtime or AI evaluation redesign
- No teacher dashboards
