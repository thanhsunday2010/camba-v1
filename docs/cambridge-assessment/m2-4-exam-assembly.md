# M2.4 — Cambridge Exam Assembly Engine

M2.4 transforms CAMBA from manually-authored mock tests into a platform that can **assemble complete Cambridge assessments** from blueprints and item banks.

**Assembly only** — no AI question generation in this milestone.

---

## Architecture

```
Cambridge Blueprint (M2.0)
        ↓
Required Parts
        ↓
Item Selection (seeded, stratified)
        ↓
Coverage Validation
        ↓
Difficulty Validation
        ↓
Exam Manifest (item references)
        ↓
Runtime Hydration → YleMockManifest
        ↓
Mock Test Runtime (U6) / M2.2 Writing / M2.3 Speaking
```

Single assembly authority lives in:

```
src/lib/cambridge-assessment/exam-assembly/
```

| Module | Role |
|--------|------|
| `cambridge-exam-assembler.ts` | Orchestrates the full pipeline |
| `cambridge-item-selector.ts` | Deterministic, constraint-aware item selection |
| `cambridge-coverage-engine.ts` | Grammar, vocabulary, skill, task, blueprint checks |
| `cambridge-difficulty-policy.ts` | Level-specific difficulty targets (not global) |
| `cambridge-exam-manifest-hydrator.ts` | References → runtime-compatible manifest |
| `cambridge-exam-report.ts` | QA report for authors |
| `fixtures/assembly-reference-bank.ts` | Golden reference item bank (architecture validation) |

---

## Assembly Pipeline

### 1. Load blueprint

Uses `getCambridgeExamBlueprint(level)` from M2.0 for Starters → PET.

### 2. Load item bank

`loadAssemblyBank(level)` prefers:

1. `data/cambridge-item-banks/{level}/items.json`
2. Legacy `data/item-bank/{level}/items.json` (M1.8)
3. Programmatic reference bank (`buildReferenceBankForLevel`) when banks are empty

### 3. Select items

For each blueprint part:

- Filter by `partSlug`, `skill`, `allowedTaskTypes`, scoring mode
- Seeded shuffle with **difficulty stratification** on auto-scored items
- Never reuse an item within the same exam form

### 4. Validate

- Grammar / vocabulary distinct tag minimums (level-specific)
- All four skills represented (including writing + speaking)
- Blueprint part counts and task types
- Difficulty distribution on auto-scored items (±12% tolerance vs blueprint policy)

### 5. Build manifest

Reference-based structure:

```
Exam → Papers → Parts → Item References
```

Items are **referenced**, not duplicated inline.

### 6. Hydrate for runtime

`hydrateManifestForRuntime()` produces a `YleMockManifest` with:

- Auto-scored questions (MCQ, matching, gap-fill, …)
- `question_type: "writing"` with M2.2 `cambridgeTaskType` content shape
- `question_type: "speaking"` with M2.3 `cambridgeTaskType` content shape

No parallel runtime — compatible with existing `QuestionRenderer`, Writing/Speaking players, review mode, analytics, and hybrid scoring.

---

## Coverage Rules

Per-level requirements (`getCoverageRequirementsForLevel`):

| Level | Min grammar tags | Min vocab topics | Writing | Speaking |
|-------|------------------|------------------|---------|----------|
| Starters | 4 | 5 | required | required |
| Movers | 6 | 6 | required | required |
| Flyers | 8 | 7 | required | required |
| KET | 8 | 8 | required | required |
| PET | 10 | 10 | required | required |

All skills (`reading`, `writing`, `listening`, `speaking`) must appear in the assembled form.

---

## Difficulty Rules

Targets come from the blueprint level policy (`getDifficultyPolicyForLevel`), **not** hardcoded globals:

| Level | Easy | Medium | Hard |
|-------|------|--------|------|
| Starters | 60% | 30% | 10% |
| Movers | 35% | 45% | 20% |
| Flyers | 25% | 50% | 25% |
| KET | 30% | 50% | 20% |
| PET | 25% | 55% | 20% |

Validated on **auto-scored items only**; writing/speaking AI tasks are excluded from band math.

---

## Versioning

Forms **A**, **B**, **C** share:

- Same blueprint
- Same coverage requirements
- Same difficulty policy

But use **different items** via seed derivation:

```
{baseSeed}:{level}:{version}
```

Same seed + version → identical form (deterministic).

---

## CLI Usage

```bash
# Generate golden reference exam (manifest + runtime + report)
npm run generate:cambridge-exam -- starters A
npm run generate:cambridge-exam -- ket B

# Validate all levels (or one level)
npm run validate:cambridge-exam
npm run validate:cambridge-exam -- movers

# Analyze coverage/difficulty report
npm run analyze:cambridge-exam -- flyers A
```

Output directory: `data/cambridge-exams/{level}/`

---

## Golden Reference Exams

One reference exam per level (Form A) validates the architecture:

- `data/cambridge-exams/starters/starters-reference-a-*.json`
- `data/cambridge-exams/movers/…`
- `data/cambridge-exams/flyers/…`
- `data/cambridge-exams/ket/…`
- `data/cambridge-exams/pet/…`

These are **not production content** — architecture validation only.

---

## Extension Strategy (M3+)

1. **Production item banks** — populate `data/cambridge-item-banks/` from authored/extracted content; assembly automatically prefers filesystem banks over reference fixtures.
2. **Adaptive selection** — swap `selectItemsForPart` strategy while keeping manifest + validation contracts.
3. **KET/PET mock seeding** — extend `mock-test-ids.mjs` level series; runtime manifest already carries KET/PET level IDs.
4. **Authoring tools** — consume `CambridgeExamAssemblyReport` for QA dashboards.
5. **Multi-form publishing** — version A/B/C manifests → seed pipeline without runtime changes.

---

## Verification

```bash
npm run typecheck
npm run lint
npm run test:validation
```

Assembly tests: `cambridge-exam-assembly.validation.test.ts` (22 tests)

---

## Known Limitations (Deferred to M3)

- Reference bank uses placeholder content, not curated exam items
- M1.8 filesystem banks are empty for YLE; reference bank fills the gap
- Listening audio URLs are placeholder paths — no TTS generation in M2.4
- KET/PET `levelSlug` extends beyond strict `YleLevelSlug` type at import metadata
- No teacher authoring UI or adaptive exam logic
- No AI question generation
