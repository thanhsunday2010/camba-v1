# M1.1 — YLE Mock Blueprint Foundation

**Status:** Implemented (M1.1 foundation + M1.2 seed pipeline + M1.3 bank + M1.3b quality/disclosure)  
**Depends on:** U6a/U6b mock-test product flow (unchanged)  
**Next:** M2 — speaking/writing runtime, audio authoring, or fuller exam fidelity (deferred)

---

## 1. Audit findings (Phase A)

### Reuse as-is

| Asset | Location | Role for mocks |
|-------|----------|----------------|
| Curriculum authority | `data/curriculum/cambridge-curriculum-map.json` | YLE themes, grammar scope, exam `taskTypes` per skill |
| Curriculum loader | `scripts/lib/curriculum-map.mjs` | `getCurriculumLevel`, `validateContentPackage`, `LEVEL_IDS` |
| Lesson content structure | `scripts/lib/content-structure.mjs` | 18×90 lesson model — **not** mock structure, but shared skill order |
| Question builders | `scripts/lib/cambridge-unit-builder.mjs` | `buildMcq`, `buildGapFill`, `buildMatching`, etc. for M1.2 item pools |
| Unit assembly | `scripts/lib/unit-assembler.mjs`, `scripts/lib/content-ids.mjs` | Lesson generation — reuse ID strategy in M1.2 |
| Unit validation | `scripts/lib/validate-unit-structure.mjs` | Pattern for `validate-mock-test-structure.mjs` in M1.2 |
| Generated lesson JSON | `data/content/{starters,movers,flyers}/` | Vocabulary/passage/audio pools |
| Listening audio | `public/audio/listening/{level}/unit-NN/` | Media for listening items |
| Mock runtime (U6) | `src/lib/mock-tests/*`, `src/components/mock-tests/*`, `src/actions/mock-tests.ts` | Take/hub/detail — **do not modify in M1.1** |
| Question renderer + scoring | `src/components/exercises/exercise-player.tsx`, `src/lib/learning/scoring.ts` | Auto-scored types only |
| Answer sanitization | `src/lib/learning/sanitize-questions.ts` | Client-safe questions |
| Lesson blueprint pattern | `scripts/lib/{starters,movers,flyers}-blueprints/unit-01/` | Gold modular U1 per level |

### Extend (lesson → mock)

| Source | Extension for mocks |
|--------|---------------------|
| Curriculum `readingSkills.taskTypes` / `listeningSkills.taskTypes` | Mapped to `YleMockPartBlueprint.curriculumTaskTypeRefs` |
| `createStartersFactory()` / Movers / Flyers helpers | M1.2: build exam-style items, not 5-phase lesson scaffolding |
| Shared unit content (`shared/*-content.mjs`) | Item pools for mock generation |
| `seed-unit-content.mjs` question insert | M1.2: parallel `seed-mock-test.mjs` |
| Mock player | M1.2+: optional `ExerciseContextPanel` for listening/reading in take flow |
| Admin bulk import | `src/actions/admin/bulk.ts` — align manifest export shape |

### New (M1.1 delivered)

| Item | Location |
|------|----------|
| Mock blueprint domain types | `src/lib/mock-blueprints/yle-mock-blueprint-types.ts` |
| Question-type registry | `src/lib/mock-blueprints/yle-question-type-registry.ts` |
| Starters / Movers / Flyers blueprints | `src/lib/mock-blueprints/yle-mock-blueprints.ts` |
| Coverage + level metadata | `src/lib/mock-blueprints/yle-coverage.ts` |
| Manifest contract | `src/lib/mock-blueprints/yle-mock-manifest-types.ts` |
| Validation | `src/lib/mock-blueprints/yle-mock-validation.ts` |
| Utils + public API | `src/lib/mock-blueprints/yle-mock-blueprint-utils.ts`, `index.ts` |
| Example fixture | `src/lib/mock-blueprints/fixtures/starters-practice-mock-manifest.example.ts` |
| Tests | `src/lib/mock-blueprints/yle-mock-blueprint.validation.test.ts` |

**Not found in repo (deferred to M1.2):** `scripts/lib/*-mock-blueprints/`, `generate-mock-tests.mjs`, DB importer, full mock content bank.

---

## 2. Lesson blueprint vs mock blueprint

| Dimension | Lesson blueprint | Mock blueprint (M1.1) |
|-----------|------------------|------------------------|
| Purpose | Teach a unit in 18 lessons × 90 exercises | Define a full exam-style form |
| Structure | `lessons[]` → exercises by skill/phase | `sections[]` → `parts[]` → question counts |
| Progression | Learn → Practice → Check → Apply → Review | Exam parts (Listening, R&W, Speaking ref) |
| Runtime | Lesson player + AI writing/speaking | U6 question-based mock take flow |
| Location | `scripts/lib/*-blueprints/` | `src/lib/mock-blueprints/` |

Mocks **reuse** curriculum topics and lesson content pools but **do not** copy lesson JSON shape.

---

## 3. Blueprint layer structure

```
src/lib/mock-blueprints/
├── index.ts                          # Public API
├── yle-mock-blueprint-types.ts       # Domain types
├── yle-question-type-registry.ts     # Question-type contracts + runtime support
├── yle-mock-blueprints.ts            # Starters / Movers / Flyers registry
├── yle-coverage.ts                   # Topics, difficulty, coverage rules
├── yle-mock-manifest-types.ts        # M1.2 import contract
├── yle-mock-validation.ts            # Blueprint + manifest validation
├── yle-mock-blueprint-utils.ts       # Lookup helpers
├── fixtures/                         # Example manifest only
└── yle-mock-blueprint.validation.test.ts
```

### Registry

```ts
import { getYleMockBlueprint, getBlueprintSummary } from "@/lib/mock-blueprints";

const bp = getYleMockBlueprint("starters");
getBlueprintSummary(bp);
// → sectionCount, autoScoredQuestionCapacity, supported/partial/blueprint_only parts
```

### Runtime support flags

Each part and question type has `runtimeSupport`:

- **`supported`** — Auto-scored in U6 take flow today
- **`partial`** — Works with author adaptation (e.g. listening without context panel in mock player)
- **`blueprint_only`** — In YLE blueprint for fidelity; not importable to auto-scored mocks yet (speaking, free writing, colour-and-draw)

---

## 4. YLE levels represented

| Level | Blueprint ID | Auto-scored capacity (approx.) | Speaking |
|-------|--------------|-------------------------------|----------|
| Pre A1 Starters | `yle-starters-practice-v1` | Listening + R&W supported/partial parts | Blueprint reference only |
| A1 Movers | `yle-movers-practice-v1` | Expanded parts, more gap-fill/story | Blueprint reference only |
| A2 Flyers | `yle-flyers-practice-v1` | Longer texts, form completion | Blueprint reference only |

Metadata (`CEFR`, `levelId`, duration) lives in `YLE_LEVEL_METADATA` — aligned with `scripts/lib/curriculum-map.mjs` `LEVEL_IDS`.

---

## 5. Manifest contract (M1.2 preview)

`YleMockManifest` describes a full mock before DB insert:

- `metadata` → `mock_tests` row
- `sections[]` → `mock_test_sections`
- `questions[]` → `questions` + `mock_test_questions` junction

Validate with:

```ts
import { validateYleMockManifest, STARTERS_PRACTICE_MOCK_MANIFEST_EXAMPLE } from "@/lib/mock-blueprints";

validateYleMockManifest(STARTERS_PRACTICE_MOCK_MANIFEST_EXAMPLE);
```

---

## 6. Compatibility with U6a/U6b

M1.1 adds **no changes** to:

- Routes: `/mock-tests`, `/mock-tests/[id]`, `/mock-tests/[id]/take`
- `submitMockTest`, `mock-test-scoring`, attempt persistence
- `MockTestPageContent`, `MockTestPlayer`, hub/detail shells

Blueprint layer is imported by **future** generation/seed scripts and authoring tools only.

---

## 7. Deferred to M1.2 / M1.3

| Item | Phase |
|------|-------|
| `scripts/generate-mock-tests.mjs` | M1.2 |
| `scripts/validate-mock-test-structure.mjs` | M1.2 |
| `scripts/seed-mock-test.mjs` | M1.2 |
| Full Starters/Movers/Flyers practice forms | M1.2 |
| Listening/reading context in mock player | M1.2+ |
| Writing/speaking mock parts | M1.3+ |
| Admin mock authoring UI | Later |
| Question dedup / link to lesson questions | M1.2 design decision |

---

## 8. Authoring guide (future mock authors)

1. Choose level → `getYleMockBlueprint("starters" | "movers" | "flyers")`.
2. Follow `sections` → `parts` for part slugs, counts, allowed `blueprintQuestionType` keys.
3. Pull vocabulary/passages from `lessonBlueprintRefs` paths — do not duplicate topic lists.
4. Use only `supported` or `partial` types for auto-scored practice mocks.
5. Build `YleMockManifest`; run `validateYleMockManifest`.
6. M1.2 importer will persist to `mock_tests` tables.

**Cursor rules for units:** `.cursor/rules/*-unit-authoring.mdc`  
**Mock authoring rule (add in M1.2):** `.cursor/rules/mock-test-authoring.mdc` (not in M1.1 scope)

---

## 9. Verification

```bash
npm run typecheck
npm run lint
npm run test:validation -- src/lib/mock-blueprints/yle-mock-blueprint.validation.test.ts
```

**M1.2 addendum:** See [m1-yle-practice-mock-authoring.md](./m1-yle-practice-mock-authoring.md) for seed pipeline.
