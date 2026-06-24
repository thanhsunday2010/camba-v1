# M4.1 — Gold Mock Authoring Program — Implementation Report

## 1. Audit findings

See `docs/cambridge-assessment/m4-1-audit-findings.md`.

M3.1 provided 5 gold mocks (1 per level). Reusable infrastructure: `composeGoldMockManifest`, `gold-mock-helpers`, `validateGoldMock`, M2.2/M2.3 contracts, M3.4 certification. Gaps: no registry for 15 mocks, no cross-version duplicate policy, Silver/Bronze allowed for gold mocks.

## 2. Gold mock authoring standard

`docs/cambridge-assessment/gold-mock-authoring-standard.md` defines question rules, difficulty/vocabulary/grammar calibration, writing/speaking/listening/reading standards, review workflow, and certification workflow.

## 3. Registry implementation

`src/lib/cambridge-assessment/gold-mock-registry.ts` tracks all 15 mocks with level, version (1–3), author, reviewer, certification status, source blueprint, and publication readiness. Mock 2/3 registered via `register-all-gold-mocks.ts`.

## 4. Starters Gold Mocks

| Mock | ID | Questions | Certification |
|------|-----|-----------|---------------|
| 1 | starters-gold-mock-1 | 43 | gold |
| 2 | starters-gold-mock-2 | 43 | gold |
| 3 | starters-gold-mock-3 | 43 | gold |

Full Reading, Listening, Writing, Speaking. Gemini evaluation enabled via M2.2/M2.3 rubrics.

## 5. Movers Gold Mocks

| Mock | ID | Questions | Certification |
|------|-----|-----------|---------------|
| 1 | movers-gold-mock-1 | 51 | gold |
| 2 | movers-gold-mock-2 | 51 | gold |
| 3 | movers-gold-mock-3 | 51 | gold |

Blueprint compliant. Writing AI and Speaking AI enabled.

## 6. Flyers Gold Mocks

| Mock | ID | Questions | Certification |
|------|-----|-----------|---------------|
| 1 | flyers-gold-mock-1 | 59 | gold |
| 2 | flyers-gold-mock-2 | 59 | gold |
| 3 | flyers-gold-mock-3 | 59 | gold |

Increased reading complexity, open-ended writing, natural speaking prompts.

## 7. KET Gold Mocks

| Mock | ID | Questions | Certification |
|------|-----|-----------|---------------|
| 1 | ket-gold-mock-1 | 59 | gold |
| 2 | ket-gold-mock-2 | 59 | gold |
| 3 | ket-gold-mock-3 | 59 | gold |

A2 Key style. Writing/speaking rubric mapping. Realistic exam timing.

## 8. PET Gold Mocks

| Mock | ID | Questions | Certification |
|------|-----|-----------|---------------|
| 1 | pet-gold-mock-1 | 64 | gold |
| 2 | pet-gold-mock-2 | 64 | gold |
| 3 | pet-gold-mock-3 | 64 | gold |

B1 Preliminary style. Longer writing tasks, expanded speaking interaction.

## 9. Writing integration

All writing tasks use M2.2 contracts (`goldWriting()` helper): prompt, expected level, word guidance, `rubricId`, Gemini evaluation config, feedback config. Validated by `isWritingQuestion()` in gold mock validation.

## 10. Speaking integration

All speaking tasks use M2.3 contracts (`goldSpeaking()` helper): prompt, candidate instructions, recording duration, `rubricId`, Gemini evaluation config, transcription compatibility. Validated by `isSpeakingQuestion()`.

## 11. Validation results

```
npm run typecheck     ✅
npm run lint          ✅
npm run test:validation  ✅ 225 tests
```

All 15 mocks pass `validateGoldMock()`: blueprint compliant, coverage targets met, M2.2/M2.3 shape valid, runtime compatible.

## 12. Certification results

```
npm run certify:mocks  ✅
```

All 15 mocks certify at **gold** tier only (M4.1 policy: no Silver/Bronze for gold mocks). Reports in `data/cambridge-certification/reports/`.

## 13. Coverage report

`docs/cambridge-assessment/gold-mock-coverage-report.md` — generated via `npm run report:gold-mock-coverage`.

Aggregate: 765 questions across 15 mocks. Grammar, vocabulary, skill, and task coverage documented per mock and in aggregate.

## 14. Duplication analysis

`detectCrossMockStemDuplicates()` uses content fingerprints (choices, pairs, templates, prompts, passages) — not generic stems. **Zero cross-mock duplicates** across all 5 levels (validated in M4.1 test suite).

## 15. Readiness for M4.2 Item Extraction

| Requirement | Status |
|-------------|--------|
| 15 canonical manifests (TS) | ✅ `src/lib/cambridge-assessment/gold-mocks/manifests/` |
| 15 JSON manifests | ✅ `data/cambridge-gold-mocks/{level}/` |
| Deterministic question IDs | ✅ `questionRef` per item |
| Full academic metadata | ✅ grammar, vocab, skill, part, blueprint refs |
| Item extraction API | ✅ `extractItemBankFromManifest()` |
| Gold-only certification | ✅ All 15 at gold tier |

Gold Mocks are the permanent source of truth. Generated mocks must not replace them.

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run analyze:gold-mock` | Per-mock validation report |
| `npm run certify:mocks` | Batch certification (15 mocks) |
| `npm run report:gold-mock-coverage` | Regenerate coverage report |
| `GOLD_WRITE=1 npm run test:validation` | Rewrite JSON manifests |
